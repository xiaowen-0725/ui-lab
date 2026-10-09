/**
 * Site-only application samples. These routes live in the catalog shell so
 * people can click through them. They are not registry entries and have no
 * install identity.
 */
export interface AppSample {
  slug: "board" | "inbox" | "calendar" | "customers";
  href: `/apps/${AppSample["slug"]}`;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
}

export const APPS: readonly AppSample[] = [
  {
    slug: "board",
    href: "/apps/board",
    name: "Board",
    nameZh: "看板",
    description: "Move tasks across a queue, the work in progress, review, and done.",
    descriptionZh: "把任务在排队、进行中、待确认和完成之间移动。",
  },
  {
    slug: "inbox",
    href: "/apps/inbox",
    name: "Inbox",
    nameZh: "收件箱",
    description: "Read a thread, star it, and keep a message in this browser only.",
    descriptionZh: "阅读一封往来、给它加星，并把回复只留在这次浏览里。",
  },
  {
    slug: "calendar",
    href: "/apps/calendar",
    name: "Calendar",
    nameZh: "日程",
    description: "Scan a month, then read the day you select.",
    descriptionZh: "先看一整月，再读你点开的那一天。",
  },
  {
    slug: "customers",
    href: "/apps/customers",
    name: "Customers",
    nameZh: "客户",
    description: "Filter a customer book and open a short profile.",
    descriptionZh: "按状态筛选客户册，并打开一份简短档案。",
  },
];

export const APPS_HOME = "/apps" as const;
