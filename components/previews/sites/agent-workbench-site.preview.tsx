"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import type { ApplicationPageState, ConversationMessage } from "@/components/pages";
import { ApplicationPreviewControls } from "@/components/previews/pages/preview-controls";
import { applicationSampleData } from "@/components/previews/pages/sample-data";
import { AgentWorkbenchSite, type WorkbenchSitePage } from "@/components/site-shells";

export function AgentWorkbenchSitePreview() {
  const [locale, setLocale] = useState<"zh" | "en">(useLocale() === "en" ? "en" : "zh");
  const [state, setState] = useState<ApplicationPageState>("ready");
  const [page, setPage] = useState<WorkbenchSitePage>("conversation");
  const [action, setAction] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const data = applicationSampleData(locale);
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
      <AgentWorkbenchSite
        key={locale}
        locale={locale}
        value={page}
        onChange={setPage}
        data={{ ...data, messages: [...(data.messages ?? []), ...messages] }}
        pages={{ conversation: { state }, artifacts: { state }, settings: { state } }}
        onAction={(event) => {
          setAction(`${event.page}: ${event.action.type}`);
          if (event.action.type === "retry") setState("ready");
          if (event.page === "conversation" && event.action.type === "send") {
            const text = event.action.text;
            setMessages((current) => [
              ...current,
              { id: `message-${current.length}`, role: "user", content: text },
            ]);
            setState("ready");
          }
        }}
      />
    </div>
  );
}
