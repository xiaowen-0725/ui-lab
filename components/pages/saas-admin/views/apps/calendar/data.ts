export const DEMO_TODAY = { year: 2026, month: 10, day: 9 } as const;

export type EventKind = "focus" | "meeting" | "ship";

export interface CalendarEvent {
	id: string;
	date: string;
	time: string;
	kind: EventKind;
	title: string;
	titleZh: string;
	detail: string;
	detailZh: string;
}

export interface MonthCell {
	date: string;
	day: number;
	inMonth: boolean;
}

export const CALENDAR_EVENTS: readonly CalendarEvent[] = [
	{
		id: "trial-letter",
		date: "2026-10-06",
		time: "09:30",
		kind: "focus",
		title: "Draft the trial-end letter",
		titleZh: "起草试用结束信",
		detail: "Name Studio and Team. Leave Company out until the call.",
		detailZh: "写明工作室版和团队版。公司版等通话之后再提。",
	},
	{
		id: "workshop",
		date: "2026-10-08",
		time: "15:00",
		kind: "meeting",
		title: "Fieldnote workshop",
		titleZh: "Fieldnote 工作坊",
		detail: "Walk through importing a sample book. Omar is bringing two editors.",
		detailZh: "走一遍示例册导入。Omar 会带两位编辑。",
	},
	{
		id: "export",
		date: "2026-10-09",
		time: "10:00",
		kind: "ship",
		title: "September invoice export",
		titleZh: "九月账单导出",
		detail: "Ship the CSV before the bookkeeper’s afternoon.",
		detailZh: "在记账的人下午开始前交出 CSV。",
	},
	{
		id: "office-hour",
		date: "2026-10-09",
		time: "16:00",
		kind: "focus",
		title: "Support office hour",
		titleZh: "支持办公时间",
		detail: "One hour for open billing questions. Mara hosts.",
		detailZh: "一小时只回答账单问题。Mara 主持。",
	},
	{
		id: "pricing",
		date: "2026-10-14",
		time: "13:30",
		kind: "meeting",
		title: "Paper & Pine pricing",
		titleZh: "Paper & Pine 定价",
		detail: "Seats, annual price, and what happens to trial notes.",
		detailZh: "席位、年付，以及试用笔记会怎样。",
	},
	{
		id: "status",
		date: "2026-10-16",
		time: "11:00",
		kind: "ship",
		title: "Publish the status page mark",
		titleZh: "发布状态页标记",
		detail: "Use the single-color N. Check it at 16 pixels.",
		detailZh: "用单色 N。在 16 像素下看一眼。",
	},
	{
		id: "review",
		date: "2026-10-21",
		time: "09:00",
		kind: "focus",
		title: "Monthly review",
		titleZh: "月度回顾",
		detail: "What shipped, what slipped, and which notes still need a reply.",
		detailZh: "交出了什么、推迟了什么、哪些说明还没回。",
	},
	{
		id: "harbor",
		date: "2026-10-23",
		time: "14:00",
		kind: "meeting",
		title: "Harbor Goods billing",
		titleZh: "Harbor Goods 账单",
		detail: "Explain the retry in person. Bring invoice HG-204.",
		detailZh: "当面解释那次重试。带上账单 HG-204。",
	},
	{
		id: "welcome",
		date: "2026-10-28",
		time: "17:00",
		kind: "ship",
		title: "Ship the three-step welcome",
		titleZh: "交出三步欢迎",
		detail: "Replace the old checklist link in the empty workspace.",
		detailZh: "在空工作区里换掉旧清单的链接。",
	},
];

function pad(value: number) {
	return String(value).padStart(2, "0");
}

export function isoDate(year: number, month: number, day: number) {
	return `${year}-${pad(month)}-${pad(day)}`;
}

export function shiftMonth(year: number, month: number, delta: number) {
	const index = year * 12 + (month - 1) + delta;
	return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function buildMonthGrid(year: number, month: number): MonthCell[] {
	const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
	const leading = (firstWeekday + 6) % 7;
	const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const cells: MonthCell[] = [];

	for (let index = 0; index < leading; index += 1) {
		const date = new Date(Date.UTC(year, month - 1, 1 - (leading - index)));
		cells.push({
			date: isoDate(
				date.getUTCFullYear(),
				date.getUTCMonth() + 1,
				date.getUTCDate(),
			),
			day: date.getUTCDate(),
			inMonth: false,
		});
	}

	for (let day = 1; day <= daysInMonth; day += 1) {
		cells.push({ date: isoDate(year, month, day), day, inMonth: true });
	}

	let extra = 1;
	while (cells.length % 7 !== 0) {
		const date = new Date(Date.UTC(year, month - 1, daysInMonth + extra));
		extra += 1;
		cells.push({
			date: isoDate(
				date.getUTCFullYear(),
				date.getUTCMonth() + 1,
				date.getUTCDate(),
			),
			day: date.getUTCDate(),
			inMonth: false,
		});
	}

	return cells;
}

export function eventsOn(date: string) {
	return CALENDAR_EVENTS.filter((event) => event.date === date).sort((a, b) =>
		a.time.localeCompare(b.time),
	);
}
