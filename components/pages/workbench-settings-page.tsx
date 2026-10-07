"use client";

import { useId, useState } from "react";
import { SettingsGroup, SettingsRow, SettingsTextField } from "@/components/motion/settings-panel";
import { Switch } from "@/components/motion/switch";
import { cn } from "@/lib/utils";
import { type ApplicationPageState, PageState, type PageStateContent } from "./page-state";

export interface WorkbenchPreferences {
  workspaceName: string;
  appearance: "system" | "light" | "dark";
  notifications: boolean;
}
export interface SettingsPageContent extends PageStateContent {
  title: string;
  subtitle: string;
  workspace: string;
  workspaceName: string;
  appearance: string;
  appearanceDescription: string;
  notifications: string;
  notificationDescription: string;
  system: string;
  light: string;
  dark: string;
  save: string;
}
export type SettingsPageAction = { type: "save"; values: WorkbenchPreferences } | { type: "retry" };
export interface WorkbenchSettingsPageProps {
  locale?: "zh" | "en";
  content?: Partial<SettingsPageContent>;
  /** Initial preferences for an uncontrolled form; no persistence is implied. */
  data?: WorkbenchPreferences;
  state?: ApplicationPageState;
  value?: WorkbenchPreferences;
  defaultValue?: WorkbenchPreferences;
  onChange?: (values: WorkbenchPreferences) => void;
  onAction?: (action: SettingsPageAction) => void;
  className?: string;
}

export function WorkbenchSettingsPage({
  locale = "zh",
  content,
  data,
  state = "ready",
  value,
  defaultValue,
  onChange,
  onAction,
  className,
}: WorkbenchSettingsPageProps) {
  const [local, setLocal] = useState<WorkbenchPreferences>(
    defaultValue ?? data ?? { workspaceName: "", appearance: "system", notifications: false },
  );
  const values = value ?? local;
  const selectId = useId();
  const c = {
    ...(locale === "zh"
      ? {
          title: "设置",
          subtitle: "管理工作区与个人偏好",
          workspace: "工作区",
          workspaceName: "工作区名称",
          appearance: "外观",
          appearanceDescription: "选择偏好的明暗模式",
          notifications: "通知",
          notificationDescription: "接收任务完成通知",
          system: "跟随系统",
          light: "浅色",
          dark: "深色",
          save: "保存设置",
        }
      : {
          title: "Settings",
          subtitle: "Manage your workspace and preferences",
          workspace: "Workspace",
          workspaceName: "Workspace name",
          appearance: "Appearance",
          appearanceDescription: "Choose your preferred color scheme",
          notifications: "Notifications",
          notificationDescription: "Receive task completion notifications",
          system: "System",
          light: "Light",
          dark: "Dark",
          save: "Save settings",
        }),
    ...content,
  };
  const update = (patch: Partial<WorkbenchPreferences>) => {
    const next = { ...values, ...patch };
    if (value === undefined) setLocal(next);
    onChange?.(next);
  };
  return (
    <section
      lang={locale}
      aria-label={c.title}
      aria-busy={state === "loading"}
      className={cn(
        "flex h-full min-h-[32rem] min-w-0 flex-col overflow-y-auto bg-[var(--wb-surface)] text-foreground",
        className,
      )}
    >
      <header className="border-b border-[var(--wb-divider)] px-6 py-5">
        <h1 tabIndex={-1} className="text-lg font-semibold">
          {c.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p>
      </header>
      {state === "ready" ? (
        <form
          className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6"
          onSubmit={(event) => {
            event.preventDefault();
            onAction?.({ type: "save", values: { ...values } });
          }}
        >
          <SettingsGroup title={c.workspace}>
            <SettingsRow label={c.workspaceName} className="flex-wrap">
              <SettingsTextField
                value={values.workspaceName}
                onChange={(workspaceName) => update({ workspaceName })}
                aria-label={c.workspaceName}
              />
            </SettingsRow>
          </SettingsGroup>
          <SettingsGroup title={c.appearance}>
            <SettingsRow
              label={<label htmlFor={selectId}>{c.appearance}</label>}
              description={c.appearanceDescription}
              className="flex-wrap"
            >
              <select
                id={selectId}
                value={values.appearance}
                onChange={(event) =>
                  update({ appearance: event.target.value as WorkbenchPreferences["appearance"] })
                }
                className="h-8 rounded-lg border border-[var(--wb-control-hairline)] bg-[var(--wb-inset-faint)] px-2 text-sm"
              >
                <option value="system">{c.system}</option>
                <option value="light">{c.light}</option>
                <option value="dark">{c.dark}</option>
              </select>
            </SettingsRow>
            <SettingsRow label={c.notifications} description={c.notificationDescription}>
              <Switch
                checked={values.notifications}
                onCheckedChange={(notifications) => update({ notifications })}
                label={c.notifications}
                className="[&_label]:sr-only"
              />
            </SettingsRow>
          </SettingsGroup>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!onAction}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
            >
              {c.save}
            </button>
          </div>
        </form>
      ) : (
        <PageState
          state={state}
          locale={locale}
          content={c}
          onRetry={onAction ? () => onAction({ type: "retry" }) : undefined}
        />
      )}
    </section>
  );
}
