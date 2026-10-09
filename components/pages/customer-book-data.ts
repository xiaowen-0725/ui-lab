export const CUSTOMER_STATUSES = ["active", "trial", "pastDue"] as const;
export const PLAN_IDS = ["studio", "team", "company"] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];
export type PlanId = (typeof PLAN_IDS)[number];
export type StatusFilter = CustomerStatus | "all";

export interface Customer {
  id: string;
  name: string;
  nameZh: string;
  company: string;
  email: string;
  plan: PlanId;
  status: CustomerStatus;
  monthly: number;
  city: string;
  cityZh: string;
  since: string;
  note: string;
  noteZh: string;
}

export const CUSTOMERS: readonly Customer[] = [
  {
    id: "paper-pine",
    name: "Elena Voss",
    nameZh: "Elena Voss",
    company: "Paper & Pine",
    email: "elena@paperandpine.example",
    plan: "team",
    status: "trial",
    monthly: 48,
    city: "Portland",
    cityZh: "波特兰",
    since: "2026-09-12",
    note: "Pricing call on October 14. They care about keeping trial notes.",
    noteZh: "10 月 14 日谈价格。他们在意试用笔记能不能留下。",
  },
  {
    id: "harbor",
    name: "Jonah Hale",
    nameZh: "Jonah Hale",
    company: "Harbor Goods",
    email: "jonah@harborgoods.example",
    plan: "company",
    status: "pastDue",
    monthly: 160,
    city: "Halifax",
    cityZh: "哈利法克斯",
    since: "2025-11-02",
    note: "Invoice HG-204 was retried after an expired card. The receipt should say so.",
    noteZh: "账单 HG-204 在卡片过期后重试成功。收据上要写明。",
  },
  {
    id: "fieldnote",
    name: "Omar Haddad",
    nameZh: "Omar Haddad",
    company: "Fieldnote",
    email: "omar@fieldnote.example",
    plan: "team",
    status: "active",
    monthly: 48,
    city: "Amman",
    cityZh: "安曼",
    since: "2026-04-19",
    note: "Workshop moved toward Friday. Two editors will join.",
    noteZh: "工作坊倾向改到周五。会有两位编辑参加。",
  },
  {
    id: "lumen-press",
    name: "Aya Mori",
    nameZh: "Aya Mori",
    company: "Lumen Press",
    email: "aya@lumenpress.example",
    plan: "studio",
    status: "active",
    monthly: 18,
    city: "Kyoto",
    cityZh: "京都",
    since: "2026-01-08",
    note: "Uses the customer book alone. Asked for a quieter empty state.",
    noteZh: "一个人用客户册。希望空状态再安静一点。",
  },
  {
    id: "cedar-mail",
    name: "Noah Berg",
    nameZh: "Noah Berg",
    company: "Cedar Mail",
    email: "noah@cedarmail.example",
    plan: "studio",
    status: "trial",
    monthly: 0,
    city: "Malmö",
    cityZh: "马尔默",
    since: "2026-10-01",
    note: "Trial started this month. No invoices yet.",
    noteZh: "试用从这个月开始。还没有账单。",
  },
  {
    id: "kite-studio",
    name: "Sofia Marques",
    nameZh: "Sofia Marques",
    company: "Kite Studio",
    email: "sofia@kitestudio.example",
    plan: "team",
    status: "active",
    monthly: 48,
    city: "Lisbon",
    cityZh: "里斯本",
    since: "2025-06-23",
    note: "Pays annually in June. Next renewal is already scheduled.",
    noteZh: "每年六月付款。下次续费已经排进日程。",
  },
  {
    id: "north-glass",
    name: "Hugo Tremblay",
    nameZh: "Hugo Tremblay",
    company: "North Glass",
    email: "hugo@northglass.example",
    plan: "company",
    status: "active",
    monthly: 160,
    city: "Montreal",
    cityZh: "蒙特利尔",
    since: "2024-12-14",
    note: "Wants the September export split by tax.",
    noteZh: "希望九月导出按税拆列。",
  },
  {
    id: "small-hours",
    name: "Mei Chen",
    nameZh: "陈梅",
    company: "Small Hours",
    email: "mei@smallhours.example",
    plan: "studio",
    status: "pastDue",
    monthly: 18,
    city: "Singapore",
    cityZh: "新加坡",
    since: "2026-02-27",
    note: "Card failed on October 2. A reminder is drafted, not sent.",
    noteZh: "卡片在 10 月 2 日失败。提醒信写了，还没发。",
  },
];

export function filterCustomers(
  customers: readonly Customer[],
  query: string,
  status: StatusFilter,
) {
  const needle = query.trim().toLowerCase();
  return customers.filter((customer) => {
    if (status !== "all" && customer.status !== status) return false;
    if (!needle) return true;
    return [
      customer.name,
      customer.nameZh,
      customer.company,
      customer.email,
      customer.city,
      customer.cityZh,
    ]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}
