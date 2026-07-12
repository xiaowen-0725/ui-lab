"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Tooltip } from "@/components/motion/tooltip";
import { cn } from "@/lib/utils";

/**
 * Toggles between Chinese (中) and English (EN) while staying on the current
 * page. next-intl's `usePathname` returns the locale-less path, so switching
 * is just a locale-scoped replace of the same route.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const next = locale === "zh" ? "en" : "zh";

  return (
    <Tooltip content={locale === "zh" ? "English" : "切换到中文"} side="bottom">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            router.replace(pathname, { locale: next });
          });
        }}
        aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
        className={cn(
          "h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card/20 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
          className,
        )}
      >
        {locale === "zh" ? "EN" : "中"}
      </button>
    </Tooltip>
  );
}
