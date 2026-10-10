export interface ModelUsage {
	id: string;
	name: string;
	requests: number;
	inputTokens: number;
	outputTokens: number;
	cost: number;
	errorRate: number;
	limit: number;
	used: number;
}

export interface DailyUsage {
	date: string;
	label: string;
	labelZh: string;
	tokens: number;
	byModel: Record<ModelUsage["id"], number>;
}

export interface UsageQuery {
	id: string;
	title: string;
	titleZh: string;
	model: string;
	at: string;
	atZh: string;
	inputTokens: number;
	outputTokens: number;
	cost: number;
}

export const USAGE_SUMMARY = {
	requests: 1842,
	tokens: 6_420_800,
	cost: 86.4,
	errorRate: 0.012,
} as const;

export const MODEL_USAGE: readonly ModelUsage[] = [
	{
		id: "pulse",
		name: "Pulse",
		requests: 1104,
		inputTokens: 2_180_000,
		outputTokens: 964_000,
		cost: 38.2,
		errorRate: 0.008,
		limit: 4_000_000,
		used: 3_144_000,
	},
	{
		id: "atlas",
		name: "Atlas",
		requests: 512,
		inputTokens: 1_640_000,
		outputTokens: 720_000,
		cost: 41.6,
		errorRate: 0.018,
		limit: 3_000_000,
		used: 2_360_000,
	},
	{
		id: "draft",
		name: "Draft",
		requests: 226,
		inputTokens: 640_000,
		outputTokens: 276_800,
		cost: 6.6,
		errorRate: 0.021,
		limit: 2_000_000,
		used: 916_800,
	},
];

export const USAGE_TODAY = "2026-10-09";

export const DAILY_USAGE: readonly DailyUsage[] = [
	{
		date: "2026-10-03",
		label: "Fri 3",
		labelZh: "3日",
		tokens: 720_000,
		byModel: { pulse: 352_554, atlas: 264_640, draft: 102_806 },
	},
	{
		date: "2026-10-04",
		label: "Sat 4",
		labelZh: "4日",
		tokens: 410_000,
		byModel: { pulse: 200_760, atlas: 150_698, draft: 58_542 },
	},
	{
		date: "2026-10-05",
		label: "Sun 5",
		labelZh: "5日",
		tokens: 380_000,
		byModel: { pulse: 186_070, atlas: 139_671, draft: 54_259 },
	},
	{
		date: "2026-10-06",
		label: "Mon 6",
		labelZh: "6日",
		tokens: 980_000,
		byModel: { pulse: 479_865, atlas: 360_204, draft: 139_931 },
	},
	{
		date: "2026-10-07",
		label: "Tue 7",
		labelZh: "7日",
		tokens: 1_120_000,
		byModel: { pulse: 548_417, atlas: 411_662, draft: 159_921 },
	},
	{
		date: "2026-10-08",
		label: "Wed 8",
		labelZh: "8日",
		tokens: 1_050_000,
		byModel: { pulse: 514_141, atlas: 385_933, draft: 149_926 },
	},
	{
		date: "2026-10-09",
		label: "Thu 9",
		labelZh: "9日",
		tokens: 760_800,
		byModel: { pulse: 372_536, atlas: 279_639, draft: 108_625 },
	},
];

export const RECENT_QUERIES: readonly UsageQuery[] = [
	{
		id: "q-letter",
		title: "Rewrite the trial-end letter",
		titleZh: "重写试用结束信",
		model: "Pulse",
		at: "Oct 9, 09:40",
		atZh: "10月9日 09:40",
		inputTokens: 412,
		outputTokens: 268,
		cost: 0.018,
	},
	{
		id: "q-csv",
		title: "September invoice columns",
		titleZh: "九月账单列",
		model: "Atlas",
		at: "Oct 9, 10:12",
		atZh: "10月9日 10:12",
		inputTokens: 288,
		outputTokens: 194,
		cost: 0.021,
	},
	{
		id: "q-mark",
		title: "Status page mark notes",
		titleZh: "状态页标记说明",
		model: "Draft",
		at: "Oct 8, 16:02",
		atZh: "10月8日 16:02",
		inputTokens: 156,
		outputTokens: 92,
		cost: 0.006,
	},
	{
		id: "q-agenda",
		title: "Agenda for the Thursday call",
		titleZh: "周四通话议程",
		model: "Pulse",
		at: "Oct 8, 18:20",
		atZh: "10月8日 18:20",
		inputTokens: 640,
		outputTokens: 410,
		cost: 0.027,
	},
];

export type UsageModelFilter = "all" | ModelUsage["id"];

export function modelsForFilter(
	models: readonly ModelUsage[],
	filter: UsageModelFilter,
) {
	if (filter === "all") return [...models];
	return models.filter((model) => model.id === filter);
}

export function queriesForFilter(
	queries: readonly UsageQuery[],
	filter: UsageModelFilter,
) {
	if (filter === "all") return [...queries];
	const name = MODEL_USAGE.find((model) => model.id === filter)?.name;
	return queries.filter((query) => query.model === name);
}

export function summaryForFilter(filter: UsageModelFilter) {
	if (filter === "all") {
		return {
			requests: USAGE_SUMMARY.requests,
			tokens: USAGE_SUMMARY.tokens,
			cost: USAGE_SUMMARY.cost,
			errorRate: USAGE_SUMMARY.errorRate,
		};
	}
	const model = MODEL_USAGE.find((item) => item.id === filter);
	if (!model) {
		return {
			requests: USAGE_SUMMARY.requests,
			tokens: USAGE_SUMMARY.tokens,
			cost: USAGE_SUMMARY.cost,
			errorRate: USAGE_SUMMARY.errorRate,
		};
	}
	return {
		requests: model.requests,
		tokens: model.inputTokens + model.outputTokens,
		cost: model.cost,
		errorRate: model.errorRate,
	};
}

export function dailyForFilter(
	days: readonly DailyUsage[],
	filter: UsageModelFilter,
) {
	return days.map((day) => ({
		...day,
		tokens: filter === "all" ? day.tokens : (day.byModel[filter] ?? 0),
	}));
}

export function formatTokens(count: number) {
	if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
	if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
	return String(count);
}

export function formatUsd(value: number) {
	return `$${value.toFixed(value >= 10 ? 1 : 3)}`;
}
