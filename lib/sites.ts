import type { ApplicationProfile } from "./pages";

export interface SiteDefinition {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  aliases: string[];
  componentSlug: string;
  components: string[];
  profiles: ApplicationProfile[];
  shellComponent?: string;
  pages: string[];
  recommendedSystem: "graphite";
  pagePath: `/sites/${string}`;
}

export const SITES: readonly SiteDefinition[] = [
  {
    slug: "agent-workbench-site",
    name: "Agent Workbench Site",
    nameZh: "Agent 多页工作台",
    description:
      "Conversation, artifact and settings pages sharing the existing responsive Workbench shell and theme.",
    descriptionZh: "会话、制品与设置三个独立页面，共享现有响应式 Workbench 外壳与主题。",
    aliases: ["multi-page workbench", "多页工作台", "Agent workspace", "工作台模板", "整站模板"],
    componentSlug: "agent-workbench-site",
    shellComponent: "agent-workbench",
    components: [
      "agent-workbench",
      "thread-list",
      "workbench-conversation-page",
      "workbench-artifact-page",
      "workbench-settings-page",
    ],
    pages: ["workbench-conversation-page", "workbench-artifact-page", "workbench-settings-page"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    recommendedSystem: "graphite",
    pagePath: "/sites/agent-workbench-site",
  },
  {
    slug: "admin-workspace-site",
    name: "Admin Workspace Site",
    nameZh: "管理工作区",
    description:
      "An admin shell whose sidebar keeps a dashboard overview and an apps group for the task board, inbox, calendar, and customer book.",
    descriptionZh: "管理外壳。侧栏保留仪表盘总览，并用一个应用分组放进任务板、收件箱、日程和客户册。",
    aliases: ["admin template", "管理模板", "dashboard apps", "后台应用"],
    componentSlug: "admin-workspace-site",
    components: ["task-board-page", "inbox-page", "calendar-page", "customer-book-page"],
    pages: ["task-board-page", "inbox-page", "calendar-page", "customer-book-page"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    recommendedSystem: "graphite",
    pagePath: "/sites/admin-workspace-site",
  },
];
