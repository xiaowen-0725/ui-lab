"use client";

import { type RefObject, useLayoutEffect, useRef } from "react";
import { lockModalScroll } from "@/lib/hooks/use-modal-scroll-lock";

interface ModalDialogOptions {
  dialogRef: RefObject<HTMLDialogElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  present: boolean;
  returnFocusRef: RefObject<HTMLElement | null>;
}

interface Layer {
  dialog: HTMLDialogElement;
  content: HTMLElement;
  returnFocus: HTMLElement | null;
  lastFocus: HTMLElement | null;
  initializing: boolean;
  dismiss: () => void;
}

interface ModalStack {
  layers: Layer[];
  syncInert: () => void;
  dispose: () => void;
}

const stacks = new WeakMap<Document, ModalStack>();
const focusSelector =
  'button, input:not([type="hidden"]), select, textarea, a[href], area[href], [tabindex], [contenteditable="true"], audio[controls], video[controls], summary';

function restoreInert(element: HTMLElement, previous: string | null) {
  // React owns the outgoing layer's inert state, rather than the background
  // snapshot captured while it was still an active native modal.
  if (element.getAttribute("data-modal-state") === "closed") element.inert = true;
  else if (previous === null) element.removeAttribute("inert");
  else element.setAttribute("inert", previous);
}

function available(element: HTMLElement) {
  if (!element.isConnected || element.closest("[inert], [hidden], [aria-hidden='true']")) return false;
  if (element.matches(":disabled")) return false;
  const view = element.ownerDocument.defaultView;
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const style = view?.getComputedStyle(node);
    if (style?.display === "none" || style?.visibility === "hidden" || style?.visibility === "collapse") return false;
  }
  return true;
}

function tabbables(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>(focusSelector))
    .filter((element) => available(element) && (element.tabIndex >= 0 ||
      (element.contentEditable === "true" && !element.hasAttribute("tabindex"))))
    .filter((element, _, all) => {
      // A named radio group contributes only its checked (or first) control.
      if (!(element instanceof HTMLInputElement) || element.type !== "radio" || !element.name) return true;
      const group = all.filter((candidate): candidate is HTMLInputElement =>
        candidate instanceof HTMLInputElement && candidate.type === "radio" &&
        candidate.name === element.name && candidate.form === element.form);
      return element === (group.find((radio) => radio.checked) ?? group[0]);
    })
    .sort((a, b) => {
      // Positive tabindex precedes zero, in increasing order; ties retain DOM order.
      const aIndex = a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER;
      const bIndex = b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
}

function focusContent(layer: Layer) {
  const preferred = layer.content.querySelector<HTMLElement>("[autofocus]");
  const target = layer.lastFocus && available(layer.lastFocus)
    ? layer.lastFocus
    : preferred && available(preferred)
      ? preferred
      : tabbables(layer.content)[0] ?? layer.content;
  target.focus({ preventScroll: true });
}

function getStack(document: Document): ModalStack {
  const existing = stacks.get(document);
  if (existing) return existing;
  const layers: Layer[] = [];
  const inert = new Map<HTMLElement, string | null>();
  const syncInert = () => {
    const top = layers.at(-1)?.dialog;
    for (const child of Array.from(document.body.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (!inert.has(child)) inert.set(child, child.getAttribute("inert"));
      if (top && child !== top) child.inert = true;
      else {
        const previous = inert.get(child);
        if (previous !== undefined) restoreInert(child, previous);
      }
    }
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const top = layers.at(-1);
    if (!top || event.defaultPrevented || event.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      top.dismiss();
    } else if (event.key === "Tab") {
      const controls = tabbables(top.content);
      const first = controls[0];
      const last = controls.at(-1);
      const active = document.activeElement;
      if (!first || !top.content.contains(active) || active === top.content ||
        (event.shiftKey ? active === first : active === last)) {
        event.preventDefault();
        (event.shiftKey ? last ?? top.content : first ?? top.content).focus({ preventScroll: true });
      }
    }
  };
  const onFocus = (event: FocusEvent) => {
    const top = layers.at(-1);
    if (!top || top.initializing || !(event.target instanceof HTMLElement)) return;
    const entering = event.target.closest('dialog[data-modal-state="open"]');
    if (entering && !layers.some((layer) => layer.dialog === entering)) return;
    if (top.content.contains(event.target)) top.lastFocus = event.target;
    else focusContent(top);
  };
  // Native modality blocks real pointer/focus interaction. Explicit inert also
  // covers outgoing surfaces and DOM environments without a browser top layer.
  const observer = new MutationObserver(syncInert);
  observer.observe(document.body, { childList: true });
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("focusin", onFocus, true);
  const stack = {
    layers, syncInert,
    dispose: () => {
      observer.disconnect();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocus, true);
      for (const [element, previous] of inert) {
        restoreInert(element, previous);
      }
      stacks.delete(document);
    },
  };
  stacks.set(document, stack);
  return stack;
}

export function useModalDialog({ dialogRef, contentRef, present, onDismiss, returnFocusRef }: ModalDialogOptions) {
  const dismissRef = useRef(onDismiss);
  const pendingRestore = useRef<(() => void) | null>(null);
  useLayoutEffect(() => { dismissRef.current = onDismiss; });
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    if (!dialog || !content) return;
    const restore = pendingRestore.current;
    pendingRestore.current = null;
    // Keep the closing surface mounted for motion's exit, without retaining
    // native modality or allowing interaction with its outgoing controls.
    if (!present) {
      dialog.inert = true;
      dialog.show();
      restore?.();
      return () => dialog.close();
    }
    restore?.();
    const document = dialog.ownerDocument;
    const stack = getStack(document);
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const layer: Layer = {
      dialog, content,
      returnFocus: active && !dialog.contains(active) ? active : returnFocusRef.current,
      lastFocus: active && content.contains(active) ? active : null,
      initializing: true,
      dismiss: () => dismissRef.current(),
    };
    const unlock = lockModalScroll(document);
    stack.layers.push(layer);
    stack.syncInert();
    dialog.showModal();
    layer.initializing = false;
    focusContent(layer);
    const onCancel = (event: Event) => {
      // Keep controlled state authoritative and let motion perform the exit.
      event.preventDefault();
      if (stack.layers.at(-1) === layer) layer.dismiss();
    };
    const onClose = () => {
      // method="dialog" forms and imperative native closes must reach the
      // consumer too. Ignore delayed close events from an earlier lifecycle.
      if (dialog.open) return;
      layer.dismiss();
      if (stack.layers.includes(layer) && !dialog.open) dialog.showModal();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      const wasTop = stack.layers.at(-1) === layer;
      stack.layers.splice(stack.layers.indexOf(layer), 1);
      // If a lower layer disappears first, do not later restore into it.
      for (const remaining of stack.layers) {
        if (remaining.returnFocus && dialog.contains(remaining.returnFocus)) {
          remaining.returnFocus = layer.returnFocus;
        }
      }
      dialog.close();
      stack.syncInert();
      if (!stack.layers.length) stack.dispose();
      unlock();
      const top = stack.layers.at(-1);
      if (wasTop) {
        const restore = () => {
          // Another modal may have opened in this same React commit.
          if (stacks.get(document)?.layers.at(-1) !== top) return;
          if (layer.returnFocus && available(layer.returnFocus) &&
            (!top || top.content.contains(layer.returnFocus))) {
            layer.returnFocus.focus({ preventScroll: true });
          } else if (top) focusContent(top);
        };
        // React restores selection after mutation-phase effect cleanup. Restore
        // in the next layout phase, or after the commit for an actual unmount.
        pendingRestore.current = restore;
        queueMicrotask(() => {
          if (pendingRestore.current !== restore) return;
          pendingRestore.current = null;
          restore();
        });
      }
    };
  }, [dialogRef, contentRef, present, returnFocusRef]);
}
