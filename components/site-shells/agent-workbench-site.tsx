"use client";

import { FileCode2, Menu, MessageSquare, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Workbench,
  WorkbenchHeader,
  WorkbenchMain,
  WorkbenchSidebar,
  useWorkbench,
} from "@/components/motion/agent-workbench";
import { ThreadList, ThreadListItem, ThreadListSection } from "@/components/motion/thread-list";
import {
  WorkbenchConversationPage,
  type WorkbenchConversationPageProps,
  type ConversationMessage,
  type ConversationPageAction,
} from "@/components/pages/workbench-conversation-page";
import {
  WorkbenchArtifactPage,
  type WorkbenchArtifactPageProps,
  type WorkbenchArtifact,
  type ArtifactPageAction,
} from "@/components/pages/workbench-artifact-page";
import {
  WorkbenchSettingsPage,
  type WorkbenchSettingsPageProps,
  type WorkbenchPreferences,
  type SettingsPageAction,
} from "@/components/pages/workbench-settings-page";
import { cn } from "@/lib/utils";

export type WorkbenchSitePage = "conversation" | "artifacts" | "settings";
export type WorkbenchSiteAction =
  | { page: "conversation"; action: ConversationPageAction }
  | { page: "artifacts"; action: ArtifactPageAction }
  | { page: "settings"; action: SettingsPageAction };
export interface WorkbenchSiteContent {
  brand: string;
  navigation: string;
  menu: string;
  conversation: string;
  artifacts: string;
  settings: string;
}
export interface WorkbenchSiteData {
  messages?: readonly ConversationMessage[];
  artifacts?: readonly WorkbenchArtifact[];
  preferences?: WorkbenchPreferences;
}
export interface AgentWorkbenchSiteProps {
  locale?: "zh" | "en";
  content?: Partial<WorkbenchSiteContent>;
  data?: WorkbenchSiteData;
  value?: WorkbenchSitePage;
  defaultValue?: WorkbenchSitePage;
  onChange?: (page: WorkbenchSitePage) => void;
  onAction?: (action: WorkbenchSiteAction) => void;
  /** Independent state/form contracts for each page. */
  pages?: {
    conversation?: Omit<WorkbenchConversationPageProps, "locale" | "data" | "onAction">;
    artifacts?: Omit<WorkbenchArtifactPageProps, "locale" | "data" | "onAction">;
    settings?: Omit<WorkbenchSettingsPageProps, "locale" | "data" | "onAction">;
  };
  className?: string;
}

interface SiteNavigationProps {
  page: WorkbenchSitePage;
  onNavigate: (page: WorkbenchSitePage) => void;
  content: WorkbenchSiteContent;
}

function SiteNavigation({ page, onNavigate, content: c }: SiteNavigationProps) {
  const { layoutMode, sidebarOpen, setSidebarOpen } = useWorkbench();
  const navigate = (next: WorkbenchSitePage) => {
    onNavigate(next);
    if (layoutMode !== "desktop") setSidebarOpen(false);
  };
  const entries = [
    { key: "conversation", icon: MessageSquare },
    { key: "artifacts", icon: FileCode2 },
    { key: "settings", icon: Settings },
  ] as const;
  return (
    <>
      <WorkbenchHeader
        leading={
          <div className="flex items-center gap-2 px-3">
            <button
              type="button"
              aria-label={c.menu}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-[var(--wb-hover)] focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="hidden text-sm font-semibold sm:inline">{c.brand}</span>
          </div>
        }
      >
        <div className="flex justify-end px-4">
          <select
            aria-label={c.navigation}
            value={page}
            onChange={(event) => navigate(event.target.value as WorkbenchSitePage)}
            className="max-w-full rounded-lg border border-[var(--wb-control-hairline)] bg-[var(--wb-surface)] px-3 py-1 text-sm"
          >
            {entries.map(({ key }) => (
              <option key={key} value={key}>
                {c[key]}
              </option>
            ))}
          </select>
        </div>
      </WorkbenchHeader>
      <WorkbenchSidebar>
        <nav aria-label={c.navigation} className="p-3">
          <ThreadList>
            <ThreadListSection title={c.brand}>
              {entries.map(({ key, icon: Icon }) => (
                <ThreadListItem
                  key={key}
                  active={page === key}
                  icon={<Icon className="h-4 w-4" />}
                  onSelect={() => navigate(key)}
                >
                  {c[key]}
                </ThreadListItem>
              ))}
            </ThreadListSection>
          </ThreadList>
        </nav>
      </WorkbenchSidebar>
    </>
  );
}

/** References each unique page source. Hidden pages retain local form drafts. */
export function AgentWorkbenchSite({
  locale = "zh",
  content,
  data,
  value,
  defaultValue = "conversation",
  onChange,
  onAction,
  pages,
  className,
}: AgentWorkbenchSiteProps) {
  const [localPage, setLocalPage] = useState(defaultValue);
  const page = value ?? localPage;
  const mainRef = useRef<HTMLDivElement>(null);
  const previousPage = useRef(page);
  const c: WorkbenchSiteContent = {
    ...(locale === "zh"
      ? {
          brand: "工作台",
          navigation: "切换页面",
          menu: "打开或关闭导航",
          conversation: "会话",
          artifacts: "制品",
          settings: "设置",
        }
      : {
          brand: "Workbench",
          navigation: "Switch page",
          menu: "Toggle navigation",
          conversation: "Conversation",
          artifacts: "Artifacts",
          settings: "Settings",
        }),
    ...content,
  };
  useEffect(() => {
    if (previousPage.current !== page)
      mainRef.current?.querySelector<HTMLElement>(`[data-page="${page}"] h1`)?.focus();
    previousPage.current = page;
  }, [page]);
  const navigate = (next: WorkbenchSitePage) => {
    if (value === undefined) setLocalPage(next);
    onChange?.(next);
  };
  return (
    <div
      lang={locale}
      className={cn(
        "h-[min(52rem,100dvh)] min-h-[32rem] w-full bg-[var(--wb-surface)] text-foreground",
        className,
      )}
    >
      <Workbench className="h-full">
        <SiteNavigation page={page} onNavigate={navigate} content={c} />
        <WorkbenchMain>
          <div ref={mainRef} className="min-h-0 flex-1 overflow-hidden">
            <div data-page="conversation" hidden={page !== "conversation"} className="h-full">
              <WorkbenchConversationPage
                locale={locale}
                data={data?.messages}
                {...pages?.conversation}
                onAction={
                  onAction ? (action) => onAction({ page: "conversation", action }) : undefined
                }
              />
            </div>
            <div data-page="artifacts" hidden={page !== "artifacts"} className="h-full">
              <WorkbenchArtifactPage
                locale={locale}
                data={data?.artifacts}
                {...pages?.artifacts}
                onAction={
                  onAction ? (action) => onAction({ page: "artifacts", action }) : undefined
                }
              />
            </div>
            <div data-page="settings" hidden={page !== "settings"} className="h-full">
              <WorkbenchSettingsPage
                locale={locale}
                data={data?.preferences}
                {...pages?.settings}
                onAction={onAction ? (action) => onAction({ page: "settings", action }) : undefined}
              />
            </div>
          </div>
        </WorkbenchMain>
      </Workbench>
    </div>
  );
}
