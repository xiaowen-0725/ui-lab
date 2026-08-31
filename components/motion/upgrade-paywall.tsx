"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useState } from "react";
import { UpgradeGlyph, UpgradePlusMark } from "@/components/motion/startup-visuals-icons";
import { EASE_OUT, SPRING_PANEL, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface UpgradePaywallProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function UpgradePaywall({
  title,
  description,
  actionLabel = "Upgrade Plan",
  onAction,
  icon,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  children,
  className,
}: UpgradePaywallProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const titleId = useId();
  const descriptionId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  return (
    <div className={cn("relative isolate overflow-hidden rounded-2xl bg-background", className)}>
      <div
        aria-hidden={open}
        className={cn(open && "pointer-events-none select-none")}
      >
        {children}
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.14, ease: EASE_OUT } }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="absolute inset-0 z-10 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-background/45 [backdrop-filter:blur(8px)_saturate(40%)] [-webkit-backdrop-filter:blur(8px)_saturate(40%)]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descriptionId : undefined}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } }
                  : { opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.14, ease: EASE_OUT } }
              }
              transition={SPRING_PANEL}
              className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl"
            >
              <div className="mx-auto mb-4 flex justify-center">
                {icon ?? <UpgradePlusMark className="size-11" />}
              </div>
              <h3 id={titleId} className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              {description ? (
                <p id={descriptionId} className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              ) : null}
              <motion.button
                type="button"
                onClick={() => {
                  onAction?.();
                  setOpen(false);
                }}
                whileTap={reduce || !canHover ? undefined : { scale: 0.96 }}
                transition={SPRING_PRESS}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                <UpgradeGlyph className="size-4" />
                {actionLabel}
              </motion.button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
