import { expect, test } from "@playwright/test";

const cases: Array<{ id: string; width: number; height: number; query: string; focus?: boolean }> = [
  { id: "wide-light-default", width: 1440, height: 900, query: "state=default&theme=light" },
  { id: "wide-dark-loading", width: 1440, height: 900, query: "state=loading&theme=dark" },
  { id: "collapse-light-error", width: 1000, height: 760, query: "state=error&theme=light" },
  { id: "collapse-dark-reduced-motion", width: 1000, height: 760, query: "state=default&theme=dark&reduced=1" },
  { id: "narrow-light-empty", width: 375, height: 760, query: "state=empty&theme=light" },
  { id: "wide-light-keyboard-focus", width: 1440, height: 900, query: "state=default&theme=light", focus: true },
];

for (const item of cases) {
  test(`capture ${item.id}`, async ({ page }) => {
    await page.setViewportSize({ width: item.width, height: item.height });
    if (item.query.includes("reduced=1")) await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/?${item.query}`);
    await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
    if (item.focus) await page.getByRole("button", { name: "切换任务导航" }).focus();
    await expect(page.getByTestId("workbench-app")).toBeVisible();
    await page.screenshot({ path: `.ui-lab/evidence/visual/implementation/${item.id}.png`, fullPage: false });
  });
}
