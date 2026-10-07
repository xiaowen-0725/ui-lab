"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { type ApplicationPageState, WorkbenchSettingsPage } from "@/components/pages";
import { ApplicationPreviewControls } from "./preview-controls";
import { applicationSampleData } from "./sample-data";

export function WorkbenchSettingsPagePreview() {
  const [locale, setLocale] = useState<"zh" | "en">(useLocale() === "en" ? "en" : "zh");
  const [state, setState] = useState<ApplicationPageState>("ready");
  const [action, setAction] = useState("");
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <ApplicationPreviewControls
        locale={locale}
        onLocaleChange={setLocale}
        state={state}
        onStateChange={setState}
        action={action}
      />
      <div className="h-[42rem]">
        <WorkbenchSettingsPage
          key={locale}
          locale={locale}
          state={state}
          data={applicationSampleData(locale).preferences}
          onAction={(next) => {
            if (next.type === "retry") setState("ready");
            setAction(next.type === "save" ? `save: ${next.values.workspaceName}` : next.type);
          }}
        />
      </div>
    </div>
  );
}
