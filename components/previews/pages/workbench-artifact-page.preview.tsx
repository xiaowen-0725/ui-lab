"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { type ApplicationPageState, WorkbenchArtifactPage } from "@/components/pages";
import { ApplicationPreviewControls } from "./preview-controls";
import { applicationSampleData } from "./sample-data";

export function WorkbenchArtifactPagePreview() {
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
        <WorkbenchArtifactPage
          locale={locale}
          state={state}
          data={applicationSampleData(locale).artifacts}
          onAction={(next) => {
            if (next.type === "retry") setState("ready");
            setAction(next.type === "download" ? `download: ${next.artifact.title}` : next.type);
          }}
        />
      </div>
    </div>
  );
}
