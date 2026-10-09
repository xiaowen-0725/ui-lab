"use client";

import {
  CalendarDays,
  Kanban,
  LayoutDashboard,
  Mail,
  PanelLeft,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { CalendarPage } from "@/components/pages/calendar-page";
import { CustomerBookPage } from "@/components/pages/customer-book-page";
import { InboxPage } from "@/components/pages/inbox-page";
import { TaskBoardPage } from "@/components/pages/task-board-page";
import {
  enterTransition,
  focusRing,
  useQuietMotion,
} from "@/components/pages/workspace-app-ui";
import {
  workspaceCopy,
  type WorkspaceLocale,
} from "@/components/pages/workspace-copy";
import { cn } from "@/lib/utils";
import type { AdminWorkspaceScreen } from "./admin-workspace-screens";

export {
  ADMIN_WORKSPACE_SCREENS,
  isAdminWorkspaceScreen,
  type AdminWorkspaceScreen,
} from "./admin-workspace-screens";

export interface AdminWorkspaceSiteProps {
  locale?: WorkspaceLocale;
  value?: AdminWorkspaceScreen;
  defaultValue?: AdminWorkspaceScreen;
  onChange?: (screen: AdminWorkspaceScreen) => void;
  /** Catalog chrome, such as a theme control, rendered in the shell header. */
  headerActions?: ReactNode;
  className?: string;
}

const APP_SCREENS = [
  { id: "board", icon: Kanban },
  { id: "inbox", icon: Mail },
  { id: "calendar", icon: CalendarDays },
  { id: "customers", icon: Users },
] as const;

export function AdminWorkspaceSite({
  locale = "zh",
  value,
  defaultValue = "overview",
  onChange,
  headerActions,
  className,
}: AdminWorkspaceSiteProps) {
  const copy = workspaceCopy(locale);
  const quiet = useQuietMotion();
  const [internal, setInternal] = useState<AdminWorkspaceScreen>(defaultValue);
  const [mobileOpen, setMobileOpen] = useState(false);
  const screen = value ?? internal;
  const titleId = useId();
  const group = screen === "overview" ? copy.dashboardGroup : copy.appsGroup;
  const screenName = copy[screen];

  function select(next: AdminWorkspaceScreen) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div
      lang={locale}
      className={cn(
        "flex h-full min-h-0 bg-background text-foreground",
        className,
      )}
    >
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-foreground/20 md:hidden"
          aria-label={copy.closeMenu}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        id={titleId}
        className={cn(
          "z-40 flex w-60 shrink-0 flex-col border-r border-border bg-background",
          "fixed inset-y-0 left-0 md:static",
          mobileOpen ? "flex" : "hidden md:flex",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <span className="grid size-8 place-items-center rounded-lg bg-foreground text-xs font-semibold text-background">
            N
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{copy.workspace}</span>
            <span className="block truncate text-xs text-muted-foreground">{copy.workspaceHint}</span>
          </span>
          <button
            type="button"
            className={cn("ml-auto inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground md:hidden", focusRing)}
            aria-label={copy.closeMenu}
            onClick={() => setMobileOpen(false)}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <nav aria-label={copy.menu} className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
          <SidebarGroup label={copy.dashboardGroup}>
            <SidebarItem
              icon={LayoutDashboard}
              label={copy.overview}
              current={screen === "overview"}
              onSelect={() => select("overview")}
            />
          </SidebarGroup>
          <SidebarGroup label={copy.appsGroup}>
            {APP_SCREENS.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={copy[item.id]}
                current={screen === item.id}
                onSelect={() => select(item.id)}
              />
            ))}
          </SidebarGroup>
        </nav>
        <p className="px-4 py-4 text-[11px] leading-relaxed text-muted-foreground">{copy.sampleFoot}</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 md:px-4">
          <button
            type="button"
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground md:hidden",
              focusRing,
            )}
            aria-label={copy.openMenu}
            aria-expanded={mobileOpen}
            aria-controls={titleId}
            onClick={() => setMobileOpen(true)}
          >
            <PanelLeft aria-hidden="true" className="size-4" />
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
            <span className="truncate text-muted-foreground">{group}</span>
            <span aria-hidden="true" className="text-muted-foreground">/</span>
            <h1 className="truncate font-medium">{screenName}</h1>
          </nav>
          <div className="ml-auto flex items-center gap-2">{headerActions}</div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">
          {screen === "overview" ? (
            <Overview locale={locale} quiet={quiet} onSelect={select} />
          ) : null}
          {screen === "board" ? (
            <TaskBoardPage locale={locale} showHeading={false} className="h-full" />
          ) : null}
          {screen === "inbox" ? (
            <InboxPage locale={locale} showHeading={false} className="h-full" />
          ) : null}
          {screen === "calendar" ? (
            <CalendarPage locale={locale} showHeading={false} className="h-full" />
          ) : null}
          {screen === "customers" ? (
            <CustomerBookPage locale={locale} showHeading={false} className="h-full" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SidebarGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  current,
  onSelect,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={current ? "page" : undefined}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors motion-reduce:transition-none",
        focusRing,
        current
          ? "bg-foreground/[0.06] font-medium text-foreground"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function Overview({
  locale,
  quiet,
  onSelect,
}: {
  locale: WorkspaceLocale;
  quiet: boolean;
  onSelect: (screen: AdminWorkspaceScreen) => void;
}) {
  const copy = workspaceCopy(locale);
  const cards = [
    { id: "board" as const, description: copy.boardDescription },
    { id: "inbox" as const, description: copy.inboxDescription },
    { id: "calendar" as const, description: copy.calendarDescription },
    { id: "customers" as const, description: copy.customersDescription },
  ];
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
        <motion.header {...enterTransition(quiet)} className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {copy.workspace}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{copy.overviewTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{copy.overviewIntro}</p>
        </motion.header>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              type="button"
              {...enterTransition(quiet, quiet ? 0 : index * 0.04)}
              onClick={() => onSelect(card.id)}
              className={cn(
                "group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 text-left transition-colors hover:border-(--color-border-strong) motion-reduce:transition-none",
                focusRing,
              )}
            >
              <span className="text-sm font-semibold">{copy[card.id]}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{card.description}</span>
              <span className="text-xs font-medium text-foreground">{copy.open}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
