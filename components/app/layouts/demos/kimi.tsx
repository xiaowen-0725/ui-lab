"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlarmClock,
  ArrowUp,
  AudioLines,
  CalendarClock,
  Cat,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code2,
  CreditCard,
  Database,
  Download,
  FileText,
  Gift,
  Globe,
  Image as ImageIcon,
  Landmark,
  Lightbulb,
  Mail,
  Menu,
  Monitor,
  MoreHorizontal,
  Music,
  Newspaper,
  PanelLeft,
  Plus,
  Presentation,
  Puzzle,
  Share2,
  Sparkles,
  Table as TableIcon,
  Telescope,
  TrendingUp,
  Video,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type View = "home" | "plugins" | "tasks";

const INK = "#e8e8e6";
const SUBTLE = "#8a8a8a";
const FAINT = "#6b6b6b";
const SURFACE = "#1a1a1a";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_HOVER = "rgba(255,255,255,0.14)";
const CREAM = "#d8d4c8";

const HISTORY_ITEMS = [
  "A和CP的多种含义",
  "AI时代值得阅读的产品书籍...",
  "开源UI库比较：Radix UI、...",
  "Kimi AI智能助手介绍",
  "sss",
  "停车场道闸网站设计",
];

const WORK_NAV_ITEMS: { label: string; icon: LucideIcon; badge?: string }[] = [
  { label: "Kimi Work", icon: Monitor, badge: "Beta" },
  { label: "Kimi Code", icon: Code2 },
  { label: "Kimi Claw", icon: Cat },
];

const QUICK_ACTIONS: { label: string; icon: LucideIcon }[] = [
  { label: "PPT", icon: Presentation },
  { label: "集群", icon: Share2 },
  { label: "深度研究", icon: Telescope },
  { label: "文档", icon: FileText },
  { label: "网站", icon: Globe },
  { label: "表格", icon: TableIcon },
];

const FILTER_TABS = ["已安装", "全部插件", "金融", "效率办公", "代码开发", "创意设计", "通用工具"];

type ScheduledTask = {
  title: string;
  schedule: string;
  next: string;
  icon: LucideIcon;
  defaultOn: boolean;
};

const SCHEDULED_TASKS: ScheduledTask[] = [
  { title: "每日 AI 行业早报", schedule: "每天 08:00", next: "明天 08:00", icon: Newspaper, defaultOn: true },
  { title: "每周工作总结", schedule: "每周五 18:00", next: "周五 18:00", icon: FileText, defaultOn: true },
  { title: "竞品价格监控", schedule: "每天 12:00", next: "今天 12:00", icon: TrendingUp, defaultOn: false },
  { title: "arXiv 论文追踪 · AI Agent", schedule: "每天 09:30", next: "明天 09:30", icon: Telescope, defaultOn: true },
];

type PluginItem = {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  installed?: boolean;
};

const PLUGINS: PluginItem[] = [
  {
    title: "金融投资分析",
    desc: "二级市场研究与投资组合工作流插件，覆盖个股、行业与宏观研究、组合归因与风险监控等场景。",
    icon: TrendingUp,
    accent: "#3b6fd6",
  },
  {
    title: "投资银行私募股权",
    desc: "投资银行与私募股权等一级市场工作流插件，覆盖尽调、估值建模、交易文件与项目管理等场景。",
    icon: Landmark,
    accent: "#1e3a5f",
  },
  {
    title: "企业财务会计",
    desc: "企业财务与会计工作流插件，覆盖关账、对账、报表编制与费用管理等场景。",
    icon: Wallet,
    accent: "#2f9e6e",
  },
  {
    title: "灵感池",
    desc: "给 Kimi 的设计灵感库。任何需要设计和多样性参考的场景都可以使用。",
    icon: Sparkles,
    accent: "#e0446f",
  },
  {
    title: "视频生成",
    desc: "根据文字描述生成高质量视频。",
    icon: Video,
    accent: "#8b5cf6",
  },
  {
    title: "图像生成",
    desc: "根据文字描述生成高质量图像。",
    icon: ImageIcon,
    accent: "#ec4899",
    installed: true,
  },
  {
    title: "音频生成",
    desc: "根据文字描述生成高质量音频。",
    icon: AudioLines,
    accent: "#f59e0b",
    installed: true,
  },
  {
    title: "万得金融数据服务",
    desc: "专业、全面、权威的金融数据基础设施。覆盖股票、债券、基金、宏观等全品类数据。",
    icon: Database,
    accent: "#c0392b",
  },
  {
    title: "Stripe",
    desc: "用它连上你自己的 Stripe 账户，直接查客户、余额、订单与交易记录。",
    icon: CreditCard,
    accent: "#635bff",
  },
  {
    title: "Notion",
    desc: "在线协作与知识库管理平台，面向文档检索、知识管理与团队协作等场景。",
    icon: FileText,
    accent: "#171717",
  },
];

function KimiMark() {
  return (
    <div
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: CREAM }}
    >
      <span className="text-sm font-bold" style={{ color: "#0b0b0b" }}>
        K
      </span>
      <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full" style={{ backgroundColor: "#0b0b0b" }} />
    </div>
  );
}

function CRTIllustration() {
  return (
    <div className="relative mx-1 flex shrink-0 flex-col items-center sm:mx-2" aria-hidden="true">
      <div
        className="flex h-14 w-16 flex-col items-center justify-center rounded-lg p-1.5 sm:h-20 sm:w-24 sm:rounded-xl sm:p-2"
        style={{ backgroundColor: CREAM }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-md" style={{ backgroundColor: "#141414" }}>
          <span className="font-mono text-sm font-bold tracking-wider sm:text-lg" style={{ color: "#4fd6e0" }}>
            K3
          </span>
        </div>
      </div>
      <div className="h-1 w-8 sm:h-1.5 sm:w-10" style={{ backgroundColor: "#c3bfb2" }} />
      <div className="h-1 w-12 rounded-full sm:w-16" style={{ backgroundColor: "#b3ae9f" }} />
    </div>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  badge,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors"
      style={{
        color: active ? INK : "#c9c9c7",
        backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
        border: active ? `1px solid ${BORDER_HOVER}` : "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: active ? INK : SUBTLE }} />
      <span className="truncate">{label}</span>
      {badge ? (
        <span
          className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function Sidebar({
  view,
  onOpenPlugins,
  onOpenTasks,
}: {
  view: View;
  onOpenPlugins: () => void;
  onOpenTasks: () => void;
}) {
  const [workOpen, setWorkOpen] = useState(true);

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col overflow-y-auto p-3"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between px-0.5">
        <KimiMark />
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/5"
          style={{ color: SUBTLE }}
        >
          <PanelLeft className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* New chat */}
      <button
        type="button"
        className="mb-3 flex h-10 w-full items-center justify-between rounded-2xl pl-3 pr-2 text-sm font-medium transition-colors"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: INK }}
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" style={{ color: SUBTLE }} />
          新建会话
        </span>
        <span className="flex items-center gap-1">
          <span
            className="flex h-[18px] min-w-[18px] items-center justify-center rounded px-1 text-[10px]"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", color: SUBTLE }}
          >
            ⌘
          </span>
          <span
            className="flex h-[18px] min-w-[18px] items-center justify-center rounded px-1 text-[10px]"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", color: SUBTLE }}
          >
            K
          </span>
        </span>
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        <SidebarButton icon={Puzzle} label="插件" active={view === "plugins"} onClick={onOpenPlugins} />
        <SidebarButton
          icon={AlarmClock}
          label="定时任务"
          active={view === "tasks"}
          onClick={onOpenTasks}
        />

        <button
          type="button"
          onClick={() => setWorkOpen((v) => !v)}
          className="flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors hover:bg-white/5"
          style={{ color: "#c9c9c7" }}
        >
          <MoreHorizontal className="h-4 w-4 shrink-0" style={{ color: SUBTLE }} />
          <span className="flex-1 text-left">收起</span>
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 transition-transform"
            style={{ color: SUBTLE, transform: workOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
          />
        </button>

        {workOpen
          ? WORK_NAV_ITEMS.map((item) => (
              <SidebarButton key={item.label} icon={item.icon} label={item.label} badge={item.badge} />
            ))
          : null}
      </nav>

      {/* Conversations */}
      <p className="mb-1 mt-4 px-2.5 text-xs" style={{ color: SUBTLE }}>
        对话
      </p>
      <div className="flex flex-col gap-0.5">
        {HISTORY_ITEMS.map((title) => (
          <button
            key={title}
            type="button"
            className="flex h-9 w-full items-center rounded-lg px-2.5 text-left text-sm transition-colors hover:bg-white/5"
            style={{ color: SUBTLE }}
          >
            <span className="truncate">{title}</span>
          </button>
        ))}
      </div>

      {/* Promo card */}
      <div
        className="mb-2 mt-auto flex w-full items-center gap-2.5 rounded-xl p-3 pt-4"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <Gift className="h-4 w-4" style={{ color: "#d8b48c" }} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm" style={{ color: INK }}>
            邀请有奖
          </span>
          <span className="block truncate text-xs" style={{ color: SUBTLE }}>
            抢会员权益 - K3 可用
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0" style={{ color: SUBTLE }} />
      </div>

      {/* Account footer */}
      <div className="flex items-center gap-2 px-0.5 pt-1">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: "#5b6ee8" }}
        >
          登
        </div>
        <span className="min-w-0 flex-1 truncate text-sm" style={{ color: INK }}>
          登月者0812
        </span>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", color: SUBTLE }}
        >
          升级
        </span>
        <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-white/5">
          <Download className="h-4 w-4" style={{ color: SUBTLE }} />
        </button>
        <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-white/5">
          <Menu className="h-4 w-4" style={{ color: SUBTLE }} />
        </button>
      </div>
    </aside>
  );
}

function HomeMain() {
  return (
    <section className="relative flex h-full flex-1 flex-col items-center overflow-hidden px-6">
      {/* Upgrade pill */}
      <button
        type="button"
        className="mt-8 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#2f6bff" }}
      >
        <Music className="h-3.5 w-3.5" />
        升级套餐
      </button>

      {/* Center */}
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="flex items-center justify-center select-none">
          <span
            className="text-6xl font-bold tracking-wide sm:text-7xl md:text-8xl"
            style={{ color: CREAM }}
          >
            KI
          </span>
          <CRTIllustration />
          <span
            className="text-6xl font-bold tracking-wide sm:text-7xl md:text-8xl"
            style={{ color: CREAM }}
          >
            MI
          </span>
        </div>

        {/* Input box */}
        <div
          className="mt-10 w-full max-w-3xl rounded-2xl p-4"
          style={{ backgroundColor: "#161616", border: `1px solid ${BORDER}` }}
        >
          <p className="px-1 pb-8 text-base" style={{ color: FAINT }}>
            尽管问，或做个 Agent 任务...
          </p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
              style={{ color: SUBTLE }}
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-white/5"
                style={{ color: "#c9c9c7" }}
              >
                K3 · Max
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: "#2a2a2a", color: FAINT }}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2.5">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors"
              style={{ color: "#a8a8a6", border: `1px solid ${BORDER}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BORDER_HOVER;
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explore bar */}
      <div
        className="mb-4 flex w-full max-w-[calc(100%-1.5rem)] items-center justify-between rounded-2xl px-5 py-3"
        style={{ backgroundColor: "#141414" }}
      >
        <span className="flex items-center gap-2 text-sm" style={{ color: SUBTLE }}>
          <Lightbulb className="h-4 w-4" />
          探索灵感
        </span>
        <span className="flex items-center gap-1.5 text-sm" style={{ color: SUBTLE }}>
          滑动探索
          <ChevronUp className="h-4 w-4" />
        </span>
      </div>
    </section>
  );
}

function PluginCard({ title, desc, icon: Icon, accent, installed }: PluginItem) {
  return (
    <div
      className="relative flex gap-3 rounded-xl p-4"
      style={{ backgroundColor: "#141414", border: `1px solid ${BORDER}` }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: accent, border: accent === "#171717" ? `1px solid ${BORDER_HOVER}` : undefined }}
      >
        <Icon className="h-5 w-5 text-white" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium" style={{ color: INK }}>
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 line-clamp-2" style={{ color: SUBTLE }}>
          {desc}
        </span>
      </span>
      {installed ? (
        <span
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <Check className="h-3 w-3" style={{ color: INK }} />
        </span>
      ) : null}
    </div>
  );
}

function PluginsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"plugins" | "skills">("plugins");
  const [filter, setFilter] = useState("全部插件");

  return (
    <section className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Top tabs */}
      <div
        className="flex shrink-0 items-center justify-between px-8 pt-6"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setTab("plugins")}
            className="relative pb-3 text-sm font-medium"
            style={{ color: tab === "plugins" ? INK : SUBTLE }}
          >
            插件
            {tab === "plugins" ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full" style={{ backgroundColor: INK }} />
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setTab("skills")}
            className="relative pb-3 text-sm font-medium"
            style={{ color: tab === "skills" ? INK : SUBTLE }}
          >
            技能
            {tab === "skills" ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full" style={{ backgroundColor: INK }} />
            ) : null}
          </button>
        </div>
        <div className="flex items-center gap-2 pb-3">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: SUBTLE }}
          >
            <Mail className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: SUBTLE }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <h2 className="text-2xl font-semibold" style={{ color: INK }}>
          插件
        </h2>
        <p className="mt-2 text-sm" style={{ color: SUBTLE }}>
          将外部工具接入 Kimi，使它可以使用应用和服务完成任务
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {FILTER_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className="rounded-full px-3.5 py-1.5 text-sm transition-colors"
              style={
                filter === item
                  ? { backgroundColor: "rgba(255,255,255,0.1)", color: INK }
                  : { color: SUBTLE }
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLUGINS.map((plugin) => (
            <PluginCard key={plugin.title} {...plugin} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
      style={{ backgroundColor: on ? "#2f6bff" : "rgba(255,255,255,0.14)" }}
    >
      <span
        className="absolute h-4 w-4 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }}
      />
    </span>
  );
}

function TasksPanel({ onClose }: { onClose: () => void }) {
  const [enabled, setEnabled] = useState(SCHEDULED_TASKS.map((t) => t.defaultOn));

  return (
    <section className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Top bar */}
      <div
        className="flex shrink-0 items-center justify-between px-8 pt-6"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <span className="pb-3 text-sm font-medium" style={{ color: INK }}>
          定时任务
        </span>
        <button
          type="button"
          onClick={onClose}
          className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          style={{ color: SUBTLE }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: INK }}>
              定时任务
            </h2>
            <p className="mt-2 text-sm" style={{ color: SUBTLE }}>
              让 Kimi 按计划自动执行任务，到点自动运行并把结果发给你。
            </p>
          </div>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, color: INK }}
          >
            <Plus className="h-4 w-4" style={{ color: SUBTLE }} />
            新建任务
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {SCHEDULED_TASKS.map((task, i) => (
            <div
              key={task.title}
              className="flex items-center gap-4 rounded-xl p-4"
              style={{ backgroundColor: "#141414", border: `1px solid ${BORDER}` }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <task.icon className="h-5 w-5" style={{ color: SUBTLE }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: INK }}>
                  {task.title}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-xs" style={{ color: SUBTLE }}>
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <CalendarClock className="h-3 w-3" />
                    {task.schedule}
                  </span>
                  <span>下次 {task.next}</span>
                </div>
              </div>
              <button
                type="button"
                aria-pressed={enabled[i]}
                onClick={() =>
                  setEnabled((prev) => prev.map((v, j) => (j === i ? !v : v)))
                }
                className="shrink-0"
              >
                <Toggle on={enabled[i] ?? false} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/5"
                style={{ color: SUBTLE }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function KimiHome({ className }: { className?: string }) {
  const [view, setView] = useState<View>("home");

  return (
    <div
      className={cn("relative flex h-full w-full overflow-hidden", className)}
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <Sidebar
        view={view}
        onOpenPlugins={() => setView("plugins")}
        onOpenTasks={() => setView("tasks")}
      />
      {/* Main content is a lighter rounded panel inset on the dark base —
       * its rounded top/bottom-left corners reveal the base behind it. */}
      <div
        className="relative flex flex-1 overflow-hidden rounded-l-2xl"
        style={{ backgroundColor: "#0e0e0e" }}
      >
        {view === "home" ? (
          <HomeMain />
        ) : view === "plugins" ? (
          <PluginsPanel onClose={() => setView("home")} />
        ) : (
          <TasksPanel onClose={() => setView("home")} />
        )}
      </div>
    </div>
  );
}
