"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function useCopyFeedback() {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const copyValue = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopiedLabel(null), 1500);
    trackEvent("copy_atom_value", { label, chars: value.length });
  };

  return { copiedLabel, copyValue };
}

export function CopyValue({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const t = useTranslations("atoms");
  const { copiedLabel, copyValue } = useCopyFeedback();
  const eventLabel = label ?? value;
  const copied = copiedLabel === eventLabel;

  return (
    <button
      type="button"
      onClick={async () => {
        await copyValue(value, eventLabel);
      }}
      aria-label={copied ? t("copiedValue") : t("copyValue", { value })}
      className={cn(
        "group/value flex w-full items-start justify-between gap-3 rounded-xl border border-border bg-background/60 px-3 py-2 text-left transition-colors hover:border-(--color-border-strong) hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <code className="min-w-0 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground">
        {value}
      </code>
      <span className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover/value:text-foreground">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-(--color-success)" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
