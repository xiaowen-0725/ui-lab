import { expect, test } from "bun:test";
import { PAGES } from "@/lib/pages";
import { SITES } from "@/lib/sites";
import {
  ADMIN_WORKSPACE_SCREENS,
} from "@/components/site-shells/admin-workspace-screens";
import {
  COLUMN_IDS,
  moveTask,
  neighborColumn,
  TASKS,
  taskMatches,
  tasksInColumn,
} from "@/components/pages/task-board-data";
import { buildMonthGrid, DEMO_TODAY, eventsOn, isoDate, shiftMonth } from "@/components/pages/calendar-data";
import { CUSTOMERS, filterCustomers } from "@/components/pages/customer-book-data";
import { THREADS, threadMatches, threadsForFolder } from "@/components/pages/inbox-data";

test("admin workspace pages are registered and presented as one site", () => {
  const slugs = ["task-board-page", "inbox-page", "calendar-page", "customer-book-page"];
  for (const slug of slugs) {
    expect(PAGES.some((page) => page.slug === slug && page.pagePath === `/pages/${slug}`)).toBe(true);
  }
  const site = SITES.find((entry) => entry.slug === "admin-workspace-site");
  expect(site?.pages).toEqual(slugs);
  expect(ADMIN_WORKSPACE_SCREENS).toEqual(["overview", "board", "inbox", "calendar", "customers"]);
});

test("moving a task appends it to the target column", () => {
  const next = moveTask(TASKS, "pricing-call", "doing");
  expect(next.at(-1)?.id).toBe("pricing-call");
  expect(next.at(-1)?.column).toBe("doing");
  expect(tasksInColumn(next, "queued").some((task) => task.id === "pricing-call")).toBe(false);
  expect(moveTask(TASKS, "pricing-call", "queued")).toEqual([...TASKS]);
});

test("column neighbors stop at the ends", () => {
  expect(neighborColumn("queued", -1)).toBeNull();
  expect(neighborColumn("queued", 1)).toBe("doing");
  expect(neighborColumn("done", 1)).toBeNull();
  expect(COLUMN_IDS).toHaveLength(4);
});

test("task search matches either language", () => {
  const trial = TASKS.find((task) => task.id === "trial-email");
  expect(trial && taskMatches(trial, "试用")).toBe(true);
  expect(trial && taskMatches(trial, "studio")).toBe(true);
  expect(trial && taskMatches(trial, "not-a-task")).toBe(false);
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
  expect(eventsOn("2026-10-09").map((event) => event.id)).toEqual(["export", "office-hour"]);
  expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
  expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
});

test("customer filters combine status and query", () => {
  expect(filterCustomers(CUSTOMERS, "harbor", "all").map((customer) => customer.id)).toEqual([
    "harbor",
  ]);
  expect(filterCustomers(CUSTOMERS, "", "pastDue").map((customer) => customer.id)).toEqual([
    "harbor",
    "small-hours",
  ]);
  expect(filterCustomers(CUSTOMERS, "京都", "active").map((customer) => customer.id)).toEqual([
    "lumen-press",
  ]);
});
