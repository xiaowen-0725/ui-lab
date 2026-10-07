"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { type ApplicationPageState, SaasLandingPage } from "@/components/pages";
import { ApplicationPreviewControls } from "./preview-controls";

export function SaasLandingPagePreview() {
  const [locale, setLocale] = useState<"zh" | "en">(useLocale() === "en" ? "en" : "zh");
  const [state, setState] = useState<ApplicationPageState>("ready");
  const [action, setAction] = useState("");
  return (
    <div className="max-h-[52rem] w-full overflow-auto rounded-xl border border-border">
      <ApplicationPreviewControls
        locale={locale}
        onLocaleChange={setLocale}
        state={state}
        onStateChange={setState}
        action={action}
      />
      <SaasLandingPage
        locale={locale}
        state={state}
        onAction={(next) => {
          setAction(next);
          if (next === "retry") setState("ready");
        }}
        media={
          <div className="grid gap-4 bg-muted/40 p-6 text-left sm:grid-cols-[9rem_1fr]">
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="text-sm font-semibold">Acme</div>
              {(locale === "zh" ? ["概览", "项目", "团队"] : ["Overview", "Projects", "Team"]).map(
                (label) => (
                  <div key={label} className="text-xs text-muted-foreground">
                    {label}
                  </div>
                ),
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {locale === "zh" ? "一处掌握团队进展" : "Your team, in one place"}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {["12", "84%", "3"].map((value) => (
                  <div
                    key={value}
                    className="rounded-xl border border-border bg-card p-4 text-xl font-semibold"
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                {locale === "zh"
                  ? "从想法到交付，每一步都清晰可见。"
                  : "Every step from idea to delivery, clearly visible."}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
