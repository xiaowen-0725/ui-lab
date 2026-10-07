import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import { type ReactNode, StrictMode, useState } from "react";
import { BottomSheet } from "@/components/motion/bottom-sheet";
import { Drawer } from "@/components/motion/drawer";

afterEach(cleanup);

type Kind = "drawer" | "sheet";

function Modal({ kind, open, onOpenChange, children }: {
  kind: Kind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return kind === "drawer" ? (
    <Drawer open={open} onOpenChange={onOpenChange} ariaLabel="Actions">
      {children}
    </Drawer>
  ) : (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Actions">
      {children}
    </BottomSheet>
  );
}

function Consumer({ kind }: { kind: Kind }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Launch</button>
      <Modal kind={kind} open={open} onOpenChange={setOpen}>
        <input aria-label="Name" />
        <button type="button" onClick={() => setOpen(false)}>Done</button>
      </Modal>
    </>
  );
}

for (const kind of ["drawer", "sheet"] as const) {
  describe(`${kind} modal`, () => {
    test("moves focus into its content and restores the launcher after closing", async () => {
      const view = render(<Consumer kind={kind} />);
      const launcher = view.getByRole("button", { name: "Launch" });
      launcher.focus();
      fireEvent.click(launcher);

      const dialog = within(document.body).getByRole("dialog", { name: "Actions" });
      expect(document.activeElement === within(dialog).getByRole("textbox")).toBe(true);

      fireEvent.click(within(dialog).getByRole("button", { name: "Done" }));
      await waitFor(() => expect(document.activeElement === launcher).toBe(true));
    });

    test("cycles Tab in both directions and rejects focus outside the content", () => {
      const view = render(<Consumer kind={kind} />);
      const launcher = view.getByRole("button", { name: "Launch" });
      launcher.focus();
      fireEvent.click(launcher);
      const dialog = within(document.body).getByRole("dialog", { name: "Actions" });
      const first = within(dialog).getByRole("textbox");
      const last = within(dialog).getByRole("button", { name: "Done" });

      last.focus();
      expect(fireEvent.keyDown(last, { key: "Tab" })).toBe(false);
      expect(document.activeElement === first).toBe(true);
      expect(fireEvent.keyDown(first, { key: "Tab", shiftKey: true })).toBe(false);
      expect(document.activeElement === last).toBe(true);
      launcher.focus();
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    test("makes the background inert, closes with Escape, and releases the scroll lock", () => {
      const original = document.body.style.cssText;
      document.body.style.overflow = "auto";
      document.body.style.position = "relative";
      try {
        const view = render(<Consumer kind={kind} />);
        const launcher = view.getByRole("button", { name: "Launch" });
        launcher.focus();
        fireEvent.click(launcher);
        expect(view.container.inert).toBe(true);
        expect(document.body.style.overflow).toBe("hidden");
        expect(document.body.style.position).toBe("fixed");

        fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
        expect(view.container.inert).toBe(false);
        expect(document.body.style.overflow).toBe("auto");
        expect(document.body.style.position).toBe("relative");
        expect(document.activeElement === launcher).toBe(true);
      } finally {
        cleanup();
        document.body.style.cssText = original;
      }
    });

    test("focuses a content surface with no controls and keeps Tab there", () => {
      render(<Modal kind={kind} open onOpenChange={() => {}}>Read only</Modal>);
      const dialog = within(document.body).getByRole("dialog");
      const focused = document.activeElement;
      expect(focused !== dialog && dialog.contains(focused)).toBe(true);
      expect(fireEvent.keyDown(focused ?? dialog, { key: "Tab" })).toBe(false);
      expect(document.activeElement === focused).toBe(true);
      expect(fireEvent.keyDown(focused ?? dialog, { key: "Tab", shiftKey: true })).toBe(false);
      expect(document.activeElement === focused).toBe(true);
    });

    test("does not lose focus or the launcher when an inline callback changes", () => {
      function EditingConsumer() {
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState("");
        return (
          <>
            <button type="button" onClick={() => setOpen(true)}>Launch</button>
            <Modal kind={kind} open={open} onOpenChange={(next) => setOpen(next)}>
              <input aria-label="Name" value={value} onChange={(event) => setValue(event.target.value)} />
              <button type="button">Keep focus</button>
            </Modal>
          </>
        );
      }
      const view = render(<StrictMode><EditingConsumer /></StrictMode>);
      const launcher = view.getByRole("button", { name: "Launch" });
      launcher.focus();
      fireEvent.click(launcher);
      const dialog = within(document.body).getByRole("dialog");
      const input = within(dialog).getByRole("textbox");
      const button = within(dialog).getByRole("button", { name: "Keep focus" });
      button.focus();
      fireEvent.change(input, { target: { value: "draft" } });
      expect(document.activeElement === button).toBe(true);
      fireEvent.keyDown(button, { key: "Escape" });
      expect(document.activeElement === launcher).toBe(true);
    });

    test("skips unavailable controls and follows the live Tab order", () => {
      const view = render(
        <Modal kind={kind} open onOpenChange={() => {}}>
          <button type="button" disabled>Disabled</button>
          <div hidden><button type="button">Hidden</button></div>
          <div style={{ display: "none" }}><input aria-label="CSS hidden" /></div>
          <input type="hidden" />
          <button type="button" tabIndex={-1}>Not a Tab stop</button>
          <input aria-label="First" />
          <button type="button">Last</button>
        </Modal>,
      );
      const dialog = within(document.body).getByRole("dialog");
      const first = within(dialog).getByRole("textbox", { name: "First" });
      expect(document.activeElement === first).toBe(true);
      const last = within(dialog).getByRole("button", { name: "Last" });
      last.focus();
      fireEvent.keyDown(last, { key: "Tab" });
      expect(document.activeElement === first).toBe(true);
      view.rerender(
        <Modal kind={kind} open onOpenChange={() => {}}>
          <input aria-label="First" />
          <button type="button" disabled>Last</button>
        </Modal>,
      );
      const remaining = within(dialog).getByRole("textbox", { name: "First" });
      remaining.focus();
      fireEvent.keyDown(remaining, { key: "Tab" });
      expect(document.activeElement === remaining).toBe(true);
    });

    test("restores the launcher even when a child requests autofocus", () => {
      function AutofocusConsumer() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button type="button" onClick={() => setOpen(true)}>Launch</button>
            <Modal kind={kind} open={open} onOpenChange={setOpen}>
              <input aria-label="Before autofocus" />
              {/* biome-ignore lint/a11y/noAutofocus: Exercise an explicit consumer focus request. */}
              <input aria-label="Autofocus" autoFocus />
            </Modal>
          </>
        );
      }
      const view = render(<AutofocusConsumer />);
      const launcher = view.getByRole("button", { name: "Launch" });
      launcher.focus();
      fireEvent.click(launcher);
      expect(document.activeElement === within(document.body).getByRole("textbox", { name: "Autofocus" })).toBe(true);
      fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
      expect(document.activeElement === launcher).toBe(true);
    });

    test("keeps native cancellation controlled and ignores an IME Escape", () => {
      const onOpenChange = mock((_open: boolean) => {});
      render(<Modal kind={kind} open onOpenChange={onOpenChange}><input aria-label="Name" /></Modal>);
      const dialog = within(document.body).getByRole("dialog");
      fireEvent.keyDown(document.activeElement ?? dialog, { key: "Escape", isComposing: true });
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(fireEvent(dialog, new Event("cancel", { cancelable: true }))).toBe(false);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect((dialog as HTMLDialogElement).open).toBe(true);
    });

    test("chooses the first control after native showModal focuses a content surface", () => {
      // happy-dom only toggles `open`; browsers can initially focus a negative
      // tabindex surface during showModal. Model that missing platform step.
      const show = HTMLDialogElement.prototype.showModal;
      const nativeFocus = spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(function (this: HTMLDialogElement) {
        show.call(this);
        const surface = Array.from(this.querySelectorAll<HTMLElement>('[tabindex="-1"]')).at(-1);
        surface?.focus();
      });
      try {
        const view = render(<Consumer kind={kind} />);
        fireEvent.click(view.getByRole("button", { name: "Launch" }));
        expect(document.activeElement === within(document.body).getByRole("textbox")).toBe(true);
      } finally {
        cleanup();
        nativeFocus.mockRestore();
      }
    });

    test("reports native close requests without leaving a controlled-open modal unlocked", () => {
      const onOpenChange = mock((_open: boolean) => {});
      render(<Modal kind={kind} open onOpenChange={onOpenChange}><input aria-label="Name" /></Modal>);
      const dialog = within(document.body).getByRole("dialog") as HTMLDialogElement;
      // Native forms with method="dialog" also close through this DOM API.
      dialog.close();
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(dialog.open).toBe(true);
      expect(document.body.style.overflow).toBe("hidden");
    });

    test("includes an editable region in the Tab cycle without requiring tabindex", () => {
      render(
        <Modal kind={kind} open onOpenChange={() => {}}>
          <div contentEditable suppressContentEditableWarning>Editor</div>
          <button type="button">Last</button>
        </Modal>,
      );
      const dialog = within(document.body).getByRole("dialog");
      const editor = within(dialog).getByText("Editor");
      expect(document.activeElement === editor).toBe(true);
      const last = within(dialog).getByRole("button", { name: "Last" });
      last.focus();
      fireEvent.keyDown(last, { key: "Tab" });
      expect(document.activeElement === editor).toBe(true);
    });
  });
}

function NestedConsumer({ kind }: { kind: Kind }) {
  const [open, setOpen] = useState(false);
  const [nested, setNested] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Launch outer</button>
      <Modal kind={kind} open={open} onOpenChange={setOpen}>
        <button type="button" onClick={() => setNested(true)}>Launch inner</button>
        <Modal kind={kind === "drawer" ? "sheet" : "drawer"} open={nested} onOpenChange={setNested}>
          <input aria-label="Inner name" />
          <button type="button" onClick={() => setOpen(false)}>Close outer first</button>
        </Modal>
      </Modal>
    </>
  );
}

describe("nested modals", () => {
  for (const kind of ["drawer", "sheet"] as const) {
    test(`${kind} keeps the lower layer locked and restores focus one layer at a time`, () => {
      const view = render(<NestedConsumer kind={kind} />);
      const launcher = view.getByRole("button", { name: "Launch outer" });
      launcher.focus();
      fireEvent.click(launcher);
      const outer = within(document.body).getByRole("dialog");
      const innerLauncher = within(outer).getByRole("button", { name: "Launch inner" });
      innerLauncher.focus();
      fireEvent.click(innerLauncher);
      const inner = within(document.body).getByRole("textbox", { name: "Inner name" }).closest("dialog");
      if (!inner) throw new Error("Inner dialog is missing");
      expect(outer.inert).toBe(true);
      expect(inner !== outer && inner.contains(document.activeElement)).toBe(true);

      fireEvent.keyDown(document.activeElement ?? inner, { key: "Escape" });
      expect(document.activeElement === innerLauncher).toBe(true);
      expect(outer.inert).toBe(false);
      expect(view.container.inert).toBe(true);
      expect(document.body.style.overflow).toBe("hidden");
      expect(inner.inert).toBe(true);

      fireEvent.keyDown(innerLauncher, { key: "Escape" });
      expect(document.activeElement === launcher).toBe(true);
      expect(view.container.inert).toBe(false);
      expect(document.body.style.overflow).not.toBe("hidden");
      expect(inner.inert).toBe(true);
    });
  }

  test("releases every lock when an outer layer closes with its child still open", async () => {
    const view = render(<NestedConsumer kind="drawer" />);
    const launcher = view.getByRole("button", { name: "Launch outer" });
    launcher.focus();
    fireEvent.click(launcher);
    const innerLauncher = within(document.body).getByRole("button", { name: "Launch inner" });
    innerLauncher.focus();
    fireEvent.click(innerLauncher);
    fireEvent.click(within(document.body).getByRole("button", { name: "Close outer first" }));
    await waitFor(() => expect(view.container.inert).toBe(false));
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(document.activeElement === launcher).toBe(true);
  });

  test("keeps a surviving sibling modal locked when the lower layer is unmounted first", async () => {
    const onOpenChange = mock((_open: boolean) => {});
    function Layers({ lower }: { lower: boolean }) {
      return (
        <>
          <button type="button">Page launcher</button>
          {lower ? <Drawer open onOpenChange={onOpenChange} ariaLabel="Lower"><button type="button">Lower action</button></Drawer> : null}
          <BottomSheet open onOpenChange={onOpenChange} title="Upper"><input aria-label="Upper action" /></BottomSheet>
        </>
      );
    }
    const view = render(<Layers lower />);
    const upper = within(document.body).getByRole("textbox", { name: "Upper action" });
    view.rerender(<Layers lower={false} />);
    expect(document.activeElement === upper).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(view.container.inert).toBe(true);
    view.unmount();
    await waitFor(() => expect(document.body.style.overflow).not.toBe("hidden"));
    expect(view.container.inert).toBe(false);
  });

  test("preserves existing inert and body styles and isolates newly inserted background roots", async () => {
    const background = document.createElement("section");
    background.setAttribute("inert", "existing");
    document.body.append(background);
    const late = document.createElement("section");
    const original = document.body.style.cssText;
    const previousScroll = { x: window.scrollX, y: window.scrollY };
    window.scrollTo(12, 320);
    document.body.style.setProperty("overflow", "scroll", "important");
    document.body.style.top = "7px";
    document.body.style.color = "red";
    try {
      const view = render(<Modal kind="sheet" open onOpenChange={() => {}}>Content</Modal>);
      expect(document.body.style.top).toBe("-320px");
      document.body.append(late);
      await waitFor(() => expect(late.inert).toBe(true));
      view.unmount();
      expect(background.getAttribute("inert")).toBe("existing");
      expect(late.inert).toBe(false);
      expect(document.body.style.overflow).toBe("scroll");
      expect(document.body.style.getPropertyPriority("overflow")).toBe("important");
      expect(document.body.style.top).toBe("7px");
      expect(document.body.style.color).toBe("red");
      expect(window.scrollX).toBe(12);
      expect(window.scrollY).toBe(320);
    } finally {
      cleanup();
      background.remove();
      late.remove();
      document.body.style.cssText = original;
      window.scrollTo(previousScroll.x, previousScroll.y);
    }
  });
});
