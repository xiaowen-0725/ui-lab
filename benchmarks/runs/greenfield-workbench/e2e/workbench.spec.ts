import { expect, test } from "@playwright/test";

test("states, focus, fonts, and overflow are verifiable", async ({ page }) => {
  await page.goto("/?state=default&theme=light");
  await expect(page.getByTestId("workbench-app")).toBeVisible();
  await expect(page.getByText("核验在场异常并生成处理建议")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  const metrics = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      sans: document.fonts.check('14px -apple-system'),
      fontFamily: getComputedStyle(document.body).fontFamily,
    };
  });
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  expect(metrics.sans).toBe(true);
  expect(metrics.fontFamily).toContain("-apple-system");

  for (const state of ["loading", "empty", "error", "streaming", "approval"]) {
    await page.goto(`/?state=${state}&theme=light`);
    await expect(page.getByTestId("workbench-app")).toBeVisible();
  }
});

test("narrow and collapse layouts do not overflow", async ({ page }) => {
  for (const viewport of [{ width: 1000, height: 760 }, { width: 375, height: 760 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/?state=empty&theme=light");
    const size = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth);
  }
});
