"use client";

import { useEffect, useState } from "react";
import { Button, MagneticButton, MetallicButton, StatefulButton } from "@/components/motion/button";
import { Button as BaseButton } from "@/components/motion/button/base";
import { SaasLandingPage } from "@/components/pages/saas-landing-page";
import { WorkbenchConversationPage } from "@/components/pages/workbench-conversation-page";
import { WorkbenchArtifactPage } from "@/components/pages/workbench-artifact-page";
import { WorkbenchSettingsPage } from "@/components/pages/workbench-settings-page";
import { AgentWorkbenchSite, type WorkbenchSiteAction } from "@/components/site-shells/agent-workbench-site";
import type { ApplicationPageState } from "@/components/pages/page-state";
import type { WorkbenchPreferences } from "@/components/pages/workbench-settings-page";
import type { ConversationMessage } from "@/components/pages/workbench-conversation-page";

// Consumer-owned data and callbacks, never a copy of registry implementation.
export function Consumer() {
  const [locale, setLocale] = useState<"zh" | "en">("zh");
  const [dark, setDark] = useState(false);
  const [surface, setSurface] = useState("site");
  const [state, setState] = useState<ApplicationPageState>("ready");
  const [result, setResult] = useState("ready");
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messages, setMessages] = useState<ConversationMessage[]>([{ id: "welcome", role: "assistant", content: "消费方提供的长中文内容：共同推进任务，并验证独立安装、状态和操作回调。 Consumer-owned content." }]);
  const [preferences, setPreferences] = useState<WorkbenchPreferences>({ workspaceName: "Consumer workspace", appearance: "system", notifications: false });
  const artifacts = [{ id: "report", title: "Consumer report", code: "export const consumer = true;", preview: <p>Consumer preview</p> }];
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.classList.toggle("dark", dark);
  }, [locale, dark]);
  const action = ({ page, action: event }: WorkbenchSiteAction) => {
    if (event.type === "retry") { setState("ready"); setResult("retry"); }
    if (page === "conversation" && event.type === "send") {
      setMessages((previous) => [...previous, { id: String(previous.length), role: "user", content: event.text }]);
      setResult(`send:${event.text}`);
    }
    if (page === "settings" && event.type === "save") {
      setPreferences(event.values);
      setResult(`save:${event.values.workspaceName}:${event.values.appearance}:${event.values.notifications}`);
    }
    if (page === "artifacts" && event.type === "download") setResult(`download:${event.artifact.id}`);
  };
  const status = { loading: locale === "zh" ? "消费者正在加载" : "Consumer loading", empty: locale === "zh" ? "消费者暂无内容" : "Consumer empty", error: locale === "zh" ? "消费者加载失败" : "Consumer error", retry: locale === "zh" ? "重试" : "Retry" };
  return <>
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background p-3 text-foreground" data-testid="controls">
      <label>Locale <select aria-label="Locale" value={locale} onChange={(e) => setLocale(e.target.value as "zh" | "en")}><option>zh</option><option>en</option></select></label>
      <label>Surface <select aria-label="Surface" value={surface} onChange={(e) => setSurface(e.target.value)}>{["site", "landing", "conversation", "artifacts", "settings"].map((v) => <option key={v}>{v}</option>)}</select></label>
      <label>State <select aria-label="State" value={state} onChange={(e) => setState(e.target.value as ApplicationPageState)}>{["ready", "loading", "empty", "error"].map((v) => <option key={v}>{v}</option>)}</select></label>
      <button type="button" aria-label="Theme" onClick={() => setDark(!dark)}>{dark ? "Dark" : "Light"}</button>
      <Button onClick={() => setResult("parent-button")}>Parent Button</Button>
      <BaseButton onClick={() => setResult("base-button")}>Base Button</BaseButton>
      <MagneticButton onClick={() => setResult("magnetic-button")}>Magnetic</MagneticButton>
      <MetallicButton onClick={() => setResult("metallic-button")}>Metallic</MetallicButton>
      <StatefulButton state={buttonState} onClick={() => { setButtonState("loading"); setTimeout(() => { setButtonState("success"); setResult("button-success"); }, 200); }}>Stateful</StatefulButton>
      <output data-testid="result" aria-live="polite">{result}</output>
    </div>
    <div data-testid="asset">
      {surface === "site" && <AgentWorkbenchSite locale={locale} content={{ brand: "Consumer Workbench" }} data={{ messages, artifacts, preferences }} pages={{ conversation: { state, content: status }, artifacts: { state, content: status }, settings: { state, content: status, value: preferences, onChange: setPreferences } }} onChange={(page) => setResult(`navigate:${page}`)} onAction={action} />}
      {surface === "landing" && <SaasLandingPage locale={locale} state={state} content={{ hero: { title: locale === "zh" ? "消费者产品页面" : "Consumer product page" }, status }} media={<div className="p-8">Consumer-owned product media</div>} onAction={(key) => { setResult(`landing:${key}`); if (key === "retry") setState("ready"); }} />}
      {surface === "conversation" && <WorkbenchConversationPage locale={locale} state={state} content={status} data={messages} onAction={(event) => action({ page: "conversation", action: event })} />}
      {surface === "artifacts" && <WorkbenchArtifactPage locale={locale} state={state} content={status} data={artifacts} onAction={(event) => action({ page: "artifacts", action: event })} />}
      {surface === "settings" && <WorkbenchSettingsPage locale={locale} state={state} content={status} value={preferences} onChange={setPreferences} onAction={(event) => action({ page: "settings", action: event })} />}
    </div>
  </>;
}
