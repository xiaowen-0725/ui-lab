import { expect, test } from "bun:test";
import { navItems } from "@/components/pages/saas-admin/configs/navConfig";
import { SAAS_ADMIN_ROUTES } from "@/components/pages/saas-admin/routes";
import {
	blocksToDisplay,
	CONVERSATIONS,
	conversationMatches,
	displayLength,
	replyForPrompt,
	sliceBlocks,
} from "@/components/pages/saas-admin/views/apps/ai-chat/data";
import {
	DAILY_USAGE,
	dailyForFilter,
	MODEL_USAGE,
	modelsForFilter,
	queriesForFilter,
	RECENT_QUERIES,
	summaryForFilter,
	USAGE_SUMMARY,
} from "@/components/pages/saas-admin/views/apps/ai-usage/data";
import {
	buildMonthGrid,
	DEMO_TODAY,
	eventsOn,
	isoDate,
	shiftMonth,
} from "@/components/pages/saas-admin/views/apps/calendar/data";
import {
	addColumn,
	addTask,
	COLUMN_IDS,
	COLUMNS,
	clearColumn,
	moveTask,
	neighborColumn,
	removeColumn,
	TASKS,
	taskMatches,
	tasksInColumn,
} from "@/components/pages/saas-admin/views/apps/kanban/data";
import {
	THREADS,
	threadMatches,
	threadsForFolder,
} from "@/components/pages/saas-admin/views/apps/mail/data";
import { PAGES } from "@/lib/pages";
import { SITES } from "@/lib/sites";

test("workspace apps register on the saas-admin site and not as a second shell", () => {
	const slugs = [
		"saas-admin-kanban-page",
		"saas-admin-mail-page",
		"saas-admin-calendar-page",
		"saas-admin-ai-chat-page",
		"saas-admin-ai-usage-page",
	];
	for (const slug of slugs) {
		expect(
			PAGES.some((page) => page.slug === slug && page.pagePath === `/pages/${slug}`),
		).toBe(true);
	}
	expect(PAGES.some((page) => page.slug === "customer-book-page")).toBe(false);
	expect(SITES.some((site) => site.slug === "admin-workspace-site")).toBe(false);
	const site = SITES.find((entry) => entry.slug === "saas-admin-site");
	expect(site?.pages).toEqual(expect.arrayContaining(slugs));
	expect(SAAS_ADMIN_ROUTES).toEqual(
		expect.arrayContaining([
			"/apps/ai-chat",
			"/apps/ai-usage",
			"/apps/kanban",
			"/apps/mail",
			"/apps/calendar",
		]),
	);
	expect(
		navItems
			.find((group) => group.groupLabel === "Apps")
			?.items.map((item) => item.label),
	).toEqual(["Users", "AI Chat", "AI Usage", "Kanban", "Mail", "Calendar"]);
});

test("moving a task appends it to the target column", () => {
	const next = moveTask(TASKS, "pricing-call", "doing");
	expect(next.at(-1)?.id).toBe("pricing-call");
	expect(next.at(-1)?.column).toBe("doing");
	expect(tasksInColumn(next, "queued").some((task) => task.id === "pricing-call")).toBe(
		false,
	);
	expect(moveTask(TASKS, "pricing-call", "queued")).toEqual([...TASKS]);
});

test("column neighbors stop at the ends", () => {
	expect(neighborColumn("queued", -1)).toBeNull();
	expect(neighborColumn("queued", 1)).toBe("doing");
	expect(neighborColumn("done", 1)).toBeNull();
	expect(COLUMN_IDS).toHaveLength(4);
	expect(COLUMNS.map((column) => column.id)).toEqual([...COLUMN_IDS]);
});

test("task search matches either language", () => {
	const trial = TASKS.find((task) => task.id === "trial-email");
	expect(trial?.priority).toBe("high");
	expect(trial?.cover).toBeTruthy();
	expect(trial && taskMatches(trial, "试用")).toBe(true);
	expect(trial && taskMatches(trial, "studio")).toBe(true);
	expect(trial && taskMatches(trial, "not-a-task")).toBe(false);
});

test("board helpers add, clear and remove visit-local columns", () => {
	const withItem = addTask(TASKS, "queued", 1);
	expect(withItem.at(-1)).toMatchObject({
		id: "item-1",
		column: "queued",
		priority: "medium",
	});
	expect(clearColumn(withItem, "queued").every((task) => task.column !== "queued")).toBe(
		true,
	);
	const extra = addColumn(COLUMNS, 2);
	expect(extra.at(-1)).toEqual({
		id: "column-2",
		title: "New column",
		titleZh: "新列",
	});
	const removed = removeColumn(extra, withItem, "column-2");
	expect(removed.columns).toHaveLength(4);
	expect(removeColumn(COLUMNS, TASKS, "queued").columns).toHaveLength(3);
});

test("starred mail excludes the archive", () => {
	expect(threadsForFolder(THREADS, "starred").map((thread) => thread.id)).toEqual([
		"pricing-call",
		"logo",
	]);
	expect(threadsForFolder(THREADS, "archive")).toHaveLength(1);
	expect(threadMatches(THREADS[1], "HG-204")).toBe(true);
});

test("October 2026 starts on Thursday and keeps the sample day", () => {
	const cells = buildMonthGrid(2026, 10);
	expect(cells.length % 7).toBe(0);
	expect(cells.filter((cell) => cell.inMonth)).toHaveLength(31);
	expect(cells.slice(0, 3).every((cell) => !cell.inMonth)).toBe(true);
	expect(cells[3]?.date).toBe("2026-10-01");
	expect(cells.filter((cell) => !cell.inMonth).length).toBeGreaterThan(0);
	expect(isoDate(DEMO_TODAY.year, DEMO_TODAY.month, DEMO_TODAY.day)).toBe("2026-10-09");
	expect(eventsOn("2026-10-09").map((event) => event.id)).toEqual([
		"export",
		"office-hour",
	]);
	expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
	expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
});

test("ai chat samples stay local and match either language", () => {
	const letter = CONVERSATIONS.find((chat) => chat.id === "trial-letter");
	expect(letter && conversationMatches(letter, "工作室版")).toBe(true);
	expect(replyForPrompt("September invoice columns").blocks?.some((block) => block.type === "code")).toBe(
		true,
	);
	expect(USAGE_SUMMARY.requests).toBeGreaterThan(0);
	expect(MODEL_USAGE.map((model) => model.id)).toEqual(["pulse", "atlas", "draft"]);
	expect(queriesForFilter(RECENT_QUERIES, "atlas").map((query) => query.id)).toEqual([
		"q-csv",
	]);
	expect(modelsForFilter(MODEL_USAGE, "draft").map((model) => model.id)).toEqual([
		"draft",
	]);
	expect(queriesForFilter(RECENT_QUERIES, "all")).toHaveLength(RECENT_QUERIES.length);
	const letterBlocks = CONVERSATIONS[0]?.turns[1]?.blocks;
	expect(letterBlocks).toBeDefined();
	expect(displayLength(letterBlocks, "zh")).toBeGreaterThan(80);
	expect(blocksToDisplay(letterBlocks, "zh")).not.toContain("**");
	expect(blocksToDisplay(letterBlocks, "zh")).not.toContain("```");
	const midBold = sliceBlocks(letterBlocks, "zh", 18);
	expect(midBold[0]?.type).toBe("p");
	if (midBold[0]?.type === "p") {
		expect(midBold[0].zh).toContain("**工作室版**");
	}
	expect(blocksToDisplay(midBold, "zh")).not.toContain("*");
	expect(blocksToDisplay(midBold, "zh")).not.toContain("`");
	const intoCode = sliceBlocks(letterBlocks, "zh", displayLength(letterBlocks, "zh") - 8);
	expect(intoCode.some((block) => block.type === "code")).toBe(true);
	expect(blocksToDisplay(intoCode, "zh")).not.toContain("```");
});

test("usage filter drives cards, daily bars and recent prompts together", () => {
	const pulse = summaryForFilter("pulse");
	expect(pulse).toEqual({
		requests: 1104,
		tokens: 3_144_000,
		cost: 38.2,
		errorRate: 0.008,
	});
	expect(summaryForFilter("all")).toEqual({
		requests: USAGE_SUMMARY.requests,
		tokens: USAGE_SUMMARY.tokens,
		cost: USAGE_SUMMARY.cost,
		errorRate: USAGE_SUMMARY.errorRate,
	});
	expect(summaryForFilter("draft").tokens).toBe(916_800);
	expect(dailyForFilter(DAILY_USAGE, "atlas").map((day) => day.tokens)).toEqual(
		DAILY_USAGE.map((day) => day.byModel.atlas),
	);
	expect(dailyForFilter(DAILY_USAGE, "all").reduce((sum, day) => sum + day.tokens, 0)).toBe(
		DAILY_USAGE.reduce((sum, day) => sum + day.tokens, 0),
	);
	for (const day of DAILY_USAGE) {
		expect(day.byModel.pulse + day.byModel.atlas + day.byModel.draft).toBe(day.tokens);
	}
});
