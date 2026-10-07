import type { ApplicationProfile } from "./pages";

export interface SiteDefinition {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  aliases: string[];
  componentSlug: "agent-workbench-site";
  components: string[];
  profiles: ApplicationProfile[];
  shellComponent: "agent-workbench";
  pages: string[];
  recommendedSystem: "graphite";
  pagePath: "/sites/agent-workbench-site";
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
];
