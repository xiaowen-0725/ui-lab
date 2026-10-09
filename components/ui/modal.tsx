"use client";

import { useIsPresent } from "motion/react";
import { type ReactNode, type RefObject,
	createContext,
	useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModalDialog } from "@/lib/hooks/use-modal-dialog";
import { cn } from "@/lib/utils";

const PortalRootContext = createContext<RefObject<HTMLElement | null> | null>(
	null,
);

/** Keeps native top-layer dialogs inside the consumer’s scoped theme. */
export function ModalPortalProvider({
	containerRef,
	children,
}: {
	containerRef: RefObject<HTMLElement | null>;
	children: ReactNode;
}) {
	return (
		<PortalRootContext.Provider value={containerRef}>
			{children}
		</PortalRootContext.Provider>
	);
}

interface ModalProps {
  children: ReactNode;
  contentRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  ariaLabel?: string;
  labelledBy?: string;
  describedBy?: string;
  className?: string;
}

/** Native top-layer modality; motion descendants own the entrance and exit. */
export function Modal(props: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const portalRoot = useContext(PortalRootContext);
	const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // Capture before React mounts a child with autoFocus in the portal.
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMounted(true);
  }, []);
  return mounted ? createPortal(<ModalDialog {...props} returnFocusRef={returnFocusRef} />,
				portalRoot?.current ?? document.body) : null;
}

function ModalDialog({
  children, contentRef, onDismiss, ariaLabel, labelledBy, describedBy, className, returnFocusRef,
}: ModalProps & { returnFocusRef: RefObject<HTMLElement | null> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const present = useIsPresent();
  useModalDialog({ dialogRef, contentRef, onDismiss, present, returnFocusRef });

  return (
    <dialog
      ref={dialogRef}
      data-modal-state={present ? "open" : "closed"}
      aria-modal={present ? true : undefined}
      aria-hidden={!present || undefined}
      inert={!present}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cn(
        "fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-visible border-0 bg-transparent p-0 text-inherit backdrop:bg-transparent",
        className,
      )}
    >
      {children}
    </dialog>
  );
}
