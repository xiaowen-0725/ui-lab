"use client";

import { useTranslations } from "next-intl";
import type { ApplicationPageState } from "@/components/pages";

export interface ApplicationPreviewControlsProps {
  locale: "zh" | "en";
  onLocaleChange: (locale: "zh" | "en") => void;
  state: ApplicationPageState;
  onStateChange: (state: ApplicationPageState) => void;
  action?: string;
}
export function ApplicationPreviewControls({
  locale,
  onLocaleChange,
  state,
  onStateChange,
  action,
}: ApplicationPreviewControlsProps) {
  const t = useTranslations("catalog.previewControls");
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-3 text-xs">
      <select
        aria-label={t("language")}
        value={locale}
        onChange={(event) => onLocaleChange(event.target.value as "zh" | "en")}
        className="rounded-md border border-border bg-background px-2 py-1"
      >
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
      <select
        aria-label={t("state")}
        value={state}
        onChange={(event) => onStateChange(event.target.value as ApplicationPageState)}
        className="rounded-md border border-border bg-background px-2 py-1"
      >
        <option value="ready">{t("ready")}</option>
        <option value="loading">{t("loading")}</option>
        <option value="empty">{t("empty")}</option>
        <option value="error">{t("error")}</option>
      </select>
      <output aria-live="polite" className="min-w-0 truncate text-muted-foreground">
        {action}
      </output>
    </div>
  );
}
