export const COLUMN_IDS = ["queued", "doing", "review", "done"] as const;

export type ColumnId = (typeof COLUMN_IDS)[number];

export type TaskLabel = "product" | "billing" | "support";

export interface Task {
  id: string;
  column: ColumnId;
  title: string;
  titleZh: string;
  detail: string;
  detailZh: string;
  label: TaskLabel;
  owner: string;
  ownerZh: string;
  due: string;
  dueZh: string;
}

export const TASKS: readonly Task[] = [
  {
    id: "trial-email",
    column: "doing",
    title: "Name the next plan in the trial-end email",
    titleZh: "在试用结束信里写明下一档方案",
    detail: "The current letter says “upgrade” and never names Studio or Team.",
    detailZh: "现在这封信只写“升级”，没有点明工作室版或团队版。",
    label: "product",
    owner: "Lin Zhixia",
    ownerZh: "林知夏",
    due: "Oct 11",
    dueZh: "10月11日",
  },
  {
    id: "invoice-export",
    column: "review",
    title: "Export September invoices",
    titleZh: "导出九月账单",
    detail: "CSV for the bookkeeper. One row per paid invoice, no drafts.",
    detailZh: "给记账的人一份 CSV。只含已付款，不含草稿。",
    label: "billing",
    owner: "Priya Nair",
    ownerZh: "Priya Nair",
    due: "Oct 9",
    dueZh: "10月9日",
  },
  {
    id: "empty-customers",
    column: "queued",
    title: "Empty state for a workspace with no customers",
    titleZh: "没有客户时的空状态",
    detail: "Offer a sample import instead of a blank table.",
    detailZh: "不要留一张空表，给出一份示例导入。",
    label: "product",
    owner: "Zhou Heng",
    ownerZh: "周衡",
    due: "Oct 18",
    dueZh: "10月18日",
  },
  {
    id: "card-keys",
    column: "doing",
    title: "Keyboard path for moving a card",
    titleZh: "用键盘移动卡片",
    detail: "Arrow keys on the grip, and visible buttons for the same move.",
    detailZh: "把手上用方向键，旁边放同样作用的按钮。",
    label: "support",
    owner: "Kenji Arai",
    ownerZh: "Kenji Arai",
    due: "Oct 10",
    dueZh: "10月10日",
  },
  {
    id: "pricing-call",
    column: "queued",
    title: "Confirm the October 14 pricing call",
    titleZh: "确认 10 月 14 日的定价通话",
    detail: "Paper & Pine asked for 30 minutes after lunch, their time.",
    detailZh: "Paper & Pine 希望在他们当地午后，谈 30 分钟。",
    label: "support",
    owner: "Mara Ellison",
    ownerZh: "Mara Ellison",
    due: "Oct 12",
    dueZh: "10月12日",
  },
  {
    id: "settings-phone",
    column: "queued",
    title: "Stack settings on a phone",
    titleZh: "手机上把设置收成一列",
    detail: "The two-column form clips the save button.",
    detailZh: "双列表单会把保存按钮裁掉。",
    label: "product",
    owner: "Zhou Heng",
    ownerZh: "周衡",
    due: "Oct 20",
    dueZh: "10月20日",
  },
  {
    id: "failed-charge",
    column: "review",
    title: "Note why Harbor Goods was charged twice",
    titleZh: "写明 Harbor Goods 为什么被扣了两次",
    detail: "The second charge is a retry, not a new invoice.",
    detailZh: "第二笔是重试，不是一张新账单。",
    label: "billing",
    owner: "Priya Nair",
    ownerZh: "Priya Nair",
    due: "Oct 9",
    dueZh: "10月9日",
  },
  {
    id: "checklist",
    column: "done",
    title: "Archive the old onboarding checklist",
    titleZh: "归档旧的上手清单",
    detail: "Replaced by the three-step welcome. Kept for the audit trail.",
    detailZh: "已换成三步欢迎。旧清单留给审计。",
    label: "product",
    owner: "Lin Zhixia",
    ownerZh: "林知夏",
    due: "Oct 2",
    dueZh: "10月2日",
  },
  {
    id: "status-copy",
    column: "done",
    title: "Status page copy for the October window",
    titleZh: "十月维护窗口的状态页文案",
    detail: "Plain language, with the clock in the customer’s zone.",
    detailZh: "用白话，并写上客户所在时区的钟点。",
    label: "support",
    owner: "Mara Ellison",
    ownerZh: "Mara Ellison",
    due: "Oct 4",
    dueZh: "10月4日",
  },
];

export function tasksInColumn(tasks: readonly Task[], column: ColumnId) {
  return tasks.filter((task) => task.column === column);
}

export function moveTask(
  tasks: readonly Task[],
  id: string,
  column: ColumnId,
): Task[] {
  const current = tasks.find((task) => task.id === id);
  if (!current || current.column === column) return [...tasks];
  const next = { ...current, column };
  return [...tasks.filter((task) => task.id !== id), next];
}

export function neighborColumn(column: ColumnId, direction: -1 | 1) {
  const index = COLUMN_IDS.indexOf(column) + direction;
  return COLUMN_IDS[index] ?? null;
}

export function taskMatches(task: Task, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [
    task.title,
    task.titleZh,
    task.detail,
    task.detailZh,
    task.owner,
    task.ownerZh,
    task.label,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}
