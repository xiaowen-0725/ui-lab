export type ApplicationProfile = "next-app" | "vite-app" | "electron-renderer";

export interface PageDefinition {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  aliases: string[];
  componentSlug: string;
  components: string[];
  profiles: ApplicationProfile[];
  pagePath: `/pages/${string}`;
}

export const PAGES: readonly PageDefinition[] = [
  {
    slug: "saas-landing-page",
    name: "SaaS Landing Page",
    nameZh: "SaaS 落地页",
    description:
      "A complete landing page composed of distributable sections with navigation, pricing, FAQ and conversion actions.",
    descriptionZh: "由可分发区块组成的完整落地页，包含导航、定价、常见问题与转化操作。",
    aliases: ["marketing page", "产品落地页", "SaaS 首页", "SaaS 模板", "页面模板"],
    componentSlug: "saas-landing-page",
    components: [
      "navbar-simple",
      "hero-screenshot",
      "logo-wall-row",
      "features-grid",
      "features-alternating",
      "stats-row",
      "testimonials-cards",
      "pricing-tiers",
      "faq-accordion",
      "cta-banner",
      "footer-columns",
    ],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/saas-landing-page",
  },
  {
    slug: "workbench-conversation-page",
    name: "Workbench Conversation Page",
    nameZh: "工作台会话页",
    description:
      "A reusable conversation page with message history, a composer and explicit loading, empty and error states.",
    descriptionZh: "可独立复用的会话页面，包含消息记录、输入区和加载、空白、错误状态。",
    aliases: ["chat page", "会话页面", "Agent 对话"],
    componentSlug: "workbench-conversation-page",
    components: ["agent-thread", "agent-composer"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/workbench-conversation-page",
  },
  {
    slug: "workbench-artifact-page",
    name: "Workbench Artifact Page",
    nameZh: "工作台制品页",
    description:
      "A reusable artifact library and detail page with preview/code switching and consumer-owned actions.",
    descriptionZh: "可独立复用的制品列表与详情页面，支持预览、源码切换及消费方操作回调。",
    aliases: ["artifact library", "制品库", "生成结果页"],
    componentSlug: "workbench-artifact-page",
    components: ["artifact-panel"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/workbench-artifact-page",
  },
  {
    slug: "workbench-settings-page",
    name: "Workbench Settings Page",
    nameZh: "工作台设置页",
    description:
      "A reusable workspace preferences page with controlled or local form values and save callbacks.",
    descriptionZh: "可独立复用的工作区设置页，支持受控或本地表单值及保存回调。",
    aliases: ["preferences page", "偏好设置", "工作区设置"],
    componentSlug: "workbench-settings-page",
    components: ["settings-panel", "switch"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/workbench-settings-page",
  },
  {
    slug: "task-board-page",
    name: "Task Board Page",
    nameZh: "任务板页",
    description:
      "A reusable task board that moves cards across queued, active, review, and done columns.",
    descriptionZh: "可独立复用的任务板，在排队、进行中、待确认和完成列之间移动卡片。",
    aliases: ["kanban page", "任务看板", "board"],
    componentSlug: "task-board-page",
    components: [],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/task-board-page",
  },
  {
    slug: "inbox-page",
    name: "Inbox Page",
    nameZh: "收件箱页",
    description:
      "A reusable mailbox with folders, a thread list, a reader, and a local-only compose form.",
    descriptionZh: "可独立复用的收件箱，包含文件夹、邮件列表、阅读区和只留在本地的写信表单。",
    aliases: ["mail page", "邮件", "inbox"],
    componentSlug: "inbox-page",
    components: ["button"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/inbox-page",
  },
  {
    slug: "calendar-page",
    name: "Calendar Page",
    nameZh: "日程页",
    description:
      "A reusable month calendar with keyboard day movement and a same-day agenda.",
    descriptionZh: "可独立复用的月历，支持键盘移动日期，并列出当天安排。",
    aliases: ["month calendar", "日历", "日程"],
    componentSlug: "calendar-page",
    components: ["button"],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/calendar-page",
  },
  {
    slug: "customer-book-page",
    name: "Customer Book Page",
    nameZh: "客户册页",
    description:
      "A reusable customer list with status filters, a table, and a short profile.",
    descriptionZh: "可独立复用的客户册，包含状态筛选、表格和一份简短档案。",
    aliases: ["customers page", "客户列表", "users table"],
    componentSlug: "customer-book-page",
    components: [],
    profiles: ["next-app", "vite-app", "electron-renderer"],
    pagePath: "/pages/customer-book-page",
  },
];
