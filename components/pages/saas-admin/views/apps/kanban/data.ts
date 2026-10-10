export const COLUMN_IDS = ["queued", "doing", "review", "done"] as const;

export type ColumnId = (typeof COLUMN_IDS)[number];

export type TaskPriority = "high" | "medium" | "low";

export interface Assignee {
	name: string;
	nameZh: string;
}

export interface BoardColumn {
	id: string;
	title: string;
	titleZh: string;
}

export interface Task {
	id: string;
	column: string;
	title: string;
	titleZh: string;
	priority: TaskPriority;
	assignees: readonly Assignee[];
	due: string;
	dueZh: string;
	cover?: string;
}

const LIN: Assignee = { name: "Lin Zhixia", nameZh: "林知夏" };
const PRIYA: Assignee = { name: "Priya Nair", nameZh: "Priya Nair" };
const ZHOU: Assignee = { name: "Zhou Heng", nameZh: "周衡" };
const KENJI: Assignee = { name: "Kenji Arai", nameZh: "Kenji Arai" };
const MARA: Assignee = { name: "Mara Ellison", nameZh: "Mara Ellison" };

/** Original muted plates for optional covers. Not copied from any reference site. */
function coverPlate(from: string, to: string, accent: string, shift = 0) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><rect x="${48 + shift}" y="${56 + shift}" width="236" height="148" rx="22" fill="${accent}" opacity="0.34"/><rect x="${292 - shift}" y="${168 - shift}" width="292" height="112" rx="22" fill="${accent}" opacity="0.2"/></svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const COVER_STUDIO = coverPlate("#efe7d8", "#d7e2dc", "#8aa392", 0);
const COVER_HARBOR = coverPlate("#d7e4ea", "#c5d0d6", "#6f8b97", 10);
const COVER_PAPER = coverPlate("#f0e6d8", "#e4d5c4", "#c4a57a", -8);
const COVER_PINE = coverPlate("#dce6dc", "#c9d4c8", "#6f8a72", 6);

export const COLUMNS: readonly BoardColumn[] = [
	{ id: "queued", title: "To do", titleZh: "待办" },
	{ id: "doing", title: "In progress", titleZh: "进行中" },
	{ id: "review", title: "Review", titleZh: "审核中" },
	{ id: "done", title: "Done", titleZh: "已完成" },
];

export const TASKS: readonly Task[] = [
	{
		id: "trial-email",
		column: "doing",
		title: "Name Studio in the trial-end email",
		titleZh: "在试用结束信里点名工作室版",
		priority: "high",
		assignees: [LIN],
		due: "Oct 11",
		dueZh: "10月11日",
		cover: COVER_STUDIO,
	},
	{
		id: "invoice-export",
		column: "review",
		title: "Export September invoices",
		titleZh: "导出九月账单",
		priority: "medium",
		assignees: [PRIYA],
		due: "Oct 9",
		dueZh: "10月9日",
	},
	{
		id: "empty-workspace",
		column: "queued",
		title: "Empty state for a workspace with no records",
		titleZh: "没有记录时的空状态",
		priority: "medium",
		assignees: [ZHOU],
		due: "Oct 18",
		dueZh: "10月18日",
		cover: COVER_PAPER,
	},
	{
		id: "card-keys",
		column: "doing",
		title: "Keyboard path for moving a card",
		titleZh: "用键盘移动卡片",
		priority: "high",
		assignees: [KENJI, LIN],
		due: "Oct 10",
		dueZh: "10月10日",
	},
	{
		id: "pricing-call",
		column: "queued",
		title: "Confirm the October 14 pricing call",
		titleZh: "确认 10 月 14 日的定价通话",
		priority: "high",
		assignees: [MARA],
		due: "Oct 12",
		dueZh: "10月12日",
		cover: COVER_HARBOR,
	},
	{
		id: "settings-phone",
		column: "queued",
		title: "Stack settings on a phone",
		titleZh: "手机上把设置收成一列",
		priority: "low",
		assignees: [ZHOU],
		due: "Oct 20",
		dueZh: "10月20日",
	},
	{
		id: "failed-charge",
		column: "review",
		title: "Note why Harbor Goods was charged twice",
		titleZh: "写明 Harbor Goods 为什么被扣了两次",
		priority: "high",
		assignees: [PRIYA, MARA],
		due: "Oct 9",
		dueZh: "10月9日",
	},
	{
		id: "checklist",
		column: "done",
		title: "Archive the old onboarding checklist",
		titleZh: "归档旧的上手清单",
		priority: "low",
		assignees: [LIN],
		due: "Oct 2",
		dueZh: "10月2日",
	},
	{
		id: "status-copy",
		column: "done",
		title: "Status page copy for the October window",
		titleZh: "十月维护窗口的状态页文案",
		priority: "medium",
		assignees: [MARA],
		due: "Oct 4",
		dueZh: "10月4日",
		cover: COVER_PINE,
	},
];

export function tasksInColumn(tasks: readonly Task[], column: string) {
	return tasks.filter((task) => task.column === column);
}

export function moveTask(
	tasks: readonly Task[],
	id: string,
	column: string,
): Task[] {
	const current = tasks.find((task) => task.id === id);
	if (!current || current.column === column) return [...tasks];
	const next = { ...current, column };
	return [...tasks.filter((task) => task.id !== id), next];
}

export function neighborColumn(
	column: string,
	direction: -1 | 1,
	ids: readonly string[] = COLUMN_IDS,
) {
	const index = ids.indexOf(column) + direction;
	return ids[index] ?? null;
}

export function taskMatches(task: Task, query: string) {
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	return [
		task.title,
		task.titleZh,
		task.priority,
		...task.assignees.flatMap((person) => [person.name, person.nameZh]),
	]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

export function addTask(
	tasks: readonly Task[],
	column: string,
	serial: number,
): Task[] {
	return [
		...tasks,
		{
			id: `item-${serial}`,
			column,
			title: "Untitled item",
			titleZh: "未命名事项",
			priority: "medium",
			assignees: [LIN],
			due: "Oct 24",
			dueZh: "10月24日",
		},
	];
}

export function addColumn(
	columns: readonly BoardColumn[],
	serial: number,
): BoardColumn[] {
	return [
		...columns,
		{
			id: `column-${serial}`,
			title: "New column",
			titleZh: "新列",
		},
	];
}

export function clearColumn(tasks: readonly Task[], column: string): Task[] {
	return tasks.filter((task) => task.column !== column);
}

export function removeColumn(
	columns: readonly BoardColumn[],
	tasks: readonly Task[],
	id: string,
): { columns: BoardColumn[]; tasks: Task[] } {
	if (columns.length <= 1) {
		return { columns: [...columns], tasks: [...tasks] };
	}
	return {
		columns: columns.filter((column) => column.id !== id),
		tasks: tasks.filter((task) => task.column !== id),
	};
}
