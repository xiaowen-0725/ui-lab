"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import {
  type ApplicationPageState,
  type ConversationMessage,
  WorkbenchConversationPage,
} from "@/components/pages";
import { ApplicationPreviewControls } from "./preview-controls";
import { applicationSampleData } from "./sample-data";

export function WorkbenchConversationPagePreview() {
  const [locale, setLocale] = useState<"zh" | "en">(useLocale() === "en" ? "en" : "zh");
  const [state, setState] = useState<ApplicationPageState>("ready");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [action, setAction] = useState("");
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <ApplicationPreviewControls
        locale={locale}
        onLocaleChange={(next) => {
          setLocale(next);
          setMessages([]);
        }}
        state={state}
        onStateChange={setState}
        action={action}
      />
      <div className="h-[42rem]">
        <WorkbenchConversationPage
          locale={locale}
          state={state}
          data={[...(applicationSampleData(locale).messages ?? []), ...messages]}
          onAction={(next) => {
            if (next.type === "retry") setState("ready");
            else {
              setMessages((current) => [
                ...current,
                { id: `message-${current.length}`, role: "user", content: next.text },
              ]);
              setState("ready");
            }
            setAction(next.type);
          }}
        />
      </div>
    </div>
  );
}
