"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  /** Optional transaction controls; legacy immediate callback behavior is unchanged. */
  dirty?: boolean;
  errors?: { workspaceName?: string };
  saveState?: "idle" | "saving" | "error" | "saved";
  message?: string;
  onCancel?: () => void;
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
  dirty,
  saveState = "idle",
  message,
  onCancel,
  errors,
}: WorkbenchSettingsPageProps) {
  const [local, setLocal] = useState<WorkbenchPreferences>(
    defaultValue ?? data ?? { workspaceName: "", appearance: "system", notifications: false },
  );
  const values = value ?? local;
  const selectId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const nameErrorId = useId();
  useEffect(() => {
    if (errors?.workspaceName)
      rootRef.current
        ?.querySelector<HTMLInputElement>('[data-slot="settings-text-field"]')
        ?.focus();
  }, [errors?.workspaceName]);
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
      ref={rootRef}
      lang={locale}
      aria-label={c.title}
      aria-busy={state === "loading"}
      className={cn(
        "flex h-full min-h-[32rem] min-w-0 flex-col overflow-y-auto bg-[var(--wb-surface)] text-foreground",
        className,
      )}
    >
      <header className="border-b border-[var(--wb-divider)] px-6 py-5">
        <h1 data-workspace-heading tabIndex={-1} className="text-lg font-semibold">
          {c.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p>
      </header>
      {state === "ready" ? (
        <form
          className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (saveState !== "saving") onAction?.({ type: "save", values: { ...values } });
          }}
        >
          <fieldset disabled={saveState === "saving"} className="contents">
            <SettingsGroup title={c.workspace}>
              <SettingsRow label={c.workspaceName} className="flex-wrap">
                <SettingsTextField
                  value={values.workspaceName}
                  onChange={(workspaceName) => update({ workspaceName })}
                  aria-label={c.workspaceName}
                  aria-invalid={!!errors?.workspaceName}
                  aria-describedby={errors?.workspaceName ? nameErrorId : undefined}
                />
              </SettingsRow>
            </SettingsGroup>
            {errors?.workspaceName && (
              <p id={nameErrorId} role="alert" className="text-sm text-destructive">
                {errors.workspaceName}
              </p>
            )}
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
          </fieldset>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {message && (
              <p
                role={saveState === "error" ? "alert" : "status"}
                className="mr-auto text-sm text-muted-foreground"
              >
                {message}
              </p>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={!dirty || saveState === "saving"}
                className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ring"
              >
                {locale === "zh" ? "取消修改" : "Cancel changes"}
              </button>
            )}
            <button
              type="submit"
              disabled={!onAction || dirty === false || saveState === "saving"}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
            >
              {saveState === "saving" ? (locale === "zh" ? "正在保存…" : "Saving…") : c.save}
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
