import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { chromium, _electron as electron } from "playwright";

const [profile, directory, evidence, url] = process.argv.slice(2);
const scenarios = [
  { name: "desktop-zh-light", width: 1440, height: 1000, locale: "zh", dark: false, reduced: "no-preference" },
  { name: "desktop-en-dark-reduced", width: 1440, height: 1000, locale: "en", dark: true, reduced: "reduce" },
  { name: "tablet-zh-dark", width: 768, height: 1024, locale: "zh", dark: true, reduced: "no-preference" },
  { name: "tablet-en-light-reduced", width: 768, height: 1024, locale: "en", dark: false, reduced: "reduce" },
  { name: "mobile-zh-light-reduced", width: 390, height: 844, locale: "zh", dark: false, reduced: "reduce" },
  { name: "mobile-en-dark", width: 390, height: 844, locale: "en", dark: true, reduced: "no-preference" },
];
const checks = [];
const errors = [];
const screenshots = [];
const diagnostics = [];
let currentScenario = "runtime";
let application;
let browser;
let context;
let page;
const record = (scenario, check, details = {}) => checks.push({ scenario, check, ...details });
async function textContains(locator, text) {
  await locator.filter({ hasText: text }).first().waitFor({ state: "visible" });
}
async function screenshot(name) {
  const path = join(evidence, `${profile}-${name}.png`);
  await page.screenshot({ path, fullPage: true });
  screenshots.push(path);
}
async function expectValue(locator, expected) {
  for (let index = 0; index < 100; index++) {
    if ((await locator.inputValue()) === expected) return;
    await page.waitForTimeout(20);
  }
  assert.equal(await locator.inputValue(), expected);
}
try {
  if (profile === "electron-renderer") {
    const require = createRequire(join(directory, "package.json"));
    application = await electron.launch({ executablePath: process.env.UILAB_ELECTRON_EXECUTABLE || require("electron"), args: [join(directory, "main.cjs")], cwd: directory, timeout: 60000 });
    page = await application.firstWindow();
    context = application.context();
    const runtime = await application.evaluate(({ app, BrowserWindow }) => ({ electron: process.versions.electron, chrome: process.versions.chrome, hidden: !BrowserWindow.getAllWindows()[0].isVisible(), appPath: app.getAppPath() }));
    assert(runtime.electron && runtime.hidden, "Actual hidden Electron BrowserWindow required");
    assert(page.url().startsWith("file:"), "Electron must render the built local file");
    record("runtime", "actual-electron-file-renderer", { ...runtime, fileURL: page.url(), electronRuntime: runtime.electron, hiddenBrowserWindow: runtime.hidden });
  } else {
    const executablePath = process.env.UILAB_BROWSER_EXECUTABLE || [chromium.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
    assert(executablePath, "Install a browser or set UILAB_BROWSER_EXECUTABLE; no automatic browser downloads");
    browser = await chromium.launch({ headless: true, executablePath });
    context = await browser.newContext({ hasTouch: true });
    page = await context.newPage();
    record("runtime", profile === "next-app" ? "next-production-server" : "vite-built-preview", { url, executablePath, browserVersion: browser.version() });
  }
  page.setDefaultTimeout(12000);
  page.on("pageerror", (error) => { errors.push(String(error)); diagnostics.push({ scenario: currentScenario, type: "pageerror", text: String(error), stack: error.stack }); });
  page.on("console", (message) => { if (message.type() === "error") { errors.push(message.text()); diagnostics.push({ scenario: currentScenario, type: "console", text: message.text(), location: message.location() }); } });
  page.on("response", (response) => { if (response.status() >= 400) diagnostics.push({ scenario: currentScenario, type: "http", status: response.status(), url: response.url() }); });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  for (const scenario of scenarios) {
    currentScenario = scenario.name;
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    if (application) await application.evaluate(({ BrowserWindow }, size) => { BrowserWindow.getAllWindows()[0].setContentSize(size.width, size.height); }, scenario);
    await page.emulateMedia({ reducedMotion: scenario.reduced });
    if (application) await page.reload(); else await page.goto(url);
    await page.getByLabel("Locale", { exact: true }).selectOption(scenario.locale);
    if (scenario.dark) await page.getByRole("button", { name: "Theme", exact: true }).click();
    await page.waitForFunction(({ lang, dark }) => document.documentElement.lang === lang && document.documentElement.classList.contains("dark") === dark, { lang: scenario.locale, dark: scenario.dark });
    const token = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return { surface: style.getPropertyValue("--wb-surface").trim(), background: style.getPropertyValue("--background").trim(), foreground: style.getPropertyValue("--foreground").trim(), reduced: matchMedia("(prefers-reduced-motion: reduce)").matches };
    });
    assert(token.surface && token.background && token.foreground, "Graphite CSS tokens must load");
    assert.equal(token.reduced, scenario.reduced === "reduce");
    record(scenario.name, "theme-locale-media", token);
    const result = page.getByTestId("result");
    for (const [name, expected] of [["Parent Button", "parent-button"], ["Base Button", "base-button"], ["Magnetic", "magnetic-button"], ["Metallic", "metallic-button"]]) {
      await page.getByRole("button", { name, exact: true }).click();
      await textContains(result, expected);
    }
    await page.getByRole("button", { name: "Stateful", exact: true }).click();
    await textContains(result, "button-success");
    record(scenario.name, "installed-parent-base-and-all-button-variants");

    const nav = page.getByRole("combobox", { name: scenario.locale === "zh" ? "切换页面" : "Switch page", exact: true });
    const asset = page.getByTestId("asset");
    await nav.selectOption("settings");
    await page.waitForFunction(() => document.activeElement?.tagName === "H1" && document.activeElement.closest('[data-page="settings"]'));
    record(scenario.name, "page-change-focus-heading");
    const workspace = page.getByRole("textbox", { name: scenario.locale === "zh" ? "工作区名称" : "Workspace name", exact: true });
    await workspace.fill("验收工作区 Consumer saved");
    await page.getByRole("combobox", { name: scenario.locale === "zh" ? "外观" : "Appearance", exact: true }).selectOption("dark");
    await page.getByRole("switch").click();
    const save = page.getByRole("button", { name: scenario.locale === "zh" ? "保存设置" : "Save settings", exact: true });
    await save.focus();
    assert(await save.evaluate((element) => element === document.activeElement));
    await page.keyboard.press("Enter");
    await textContains(result, "save:验收工作区 Consumer saved:dark:true");
    await nav.selectOption("artifacts");
    await page.getByRole("button", { name: scenario.locale === "zh" ? "源码" : "Code", exact: true }).click();
    await textContains(asset, "export const consumer = true;");
    await page.getByRole("button", { name: scenario.locale === "zh" ? "下载制品" : "Download artifact", exact: true }).click();
    await textContains(result, "download:report");
    await nav.selectOption("settings");
    await expectValue(workspace, "验收工作区 Consumer saved");
    await nav.selectOption("conversation");
    const input = page.getByRole("textbox", { name: scenario.locale === "zh" ? "消息" : "Message", exact: true });
    await input.fill("消费者输入与真实回调");
    await page.keyboard.press("Enter");
    await textContains(result, "send:消费者输入与真实回调");
    await textContains(asset, "消费者输入与真实回调");
    await expectValue(input, "");
    record(scenario.name, "input-send-save-download-retained-form");
    await screenshot(`${scenario.name}-site-ready`);
    for (const surface of ["site", "landing", "conversation", "artifacts", "settings"]) {
      await page.getByLabel("Surface", { exact: true }).selectOption(surface);
      await asset.locator("h1").filter({ visible: true }).first().waitFor();
      const overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert(overflow.scroll <= overflow.viewport + 1, `${surface} horizontal overflow: ${JSON.stringify(overflow)}`);
      if (surface !== "site") await screenshot(`${scenario.name}-${surface}-ready`);
      for (const state of ["loading", "empty", "error"]) {
        await page.getByLabel("State", { exact: true }).selectOption(state);
        const expected = { loading: scenario.locale === "zh" ? "消费者正在加载" : "Consumer loading", empty: scenario.locale === "zh" ? "消费者暂无内容" : "Consumer empty", error: scenario.locale === "zh" ? "消费者加载失败" : "Consumer error" }[state];
        await textContains(asset.getByRole(state === "error" ? "alert" : "status"), expected);
        if (state === "loading" && surface !== "landing") assert(await asset.locator('section[aria-busy="true"]').filter({ visible: true }).count());
        record(scenario.name, `${surface}-${state}`);
        if (surface === "site" || surface === "landing") await screenshot(`${scenario.name}-${surface}-${state}`);
        if (state === "error") {
          await asset.getByRole("button", { name: scenario.locale === "zh" ? "重试" : "Retry", exact: true }).click();
          await expectValue(page.getByLabel("State", { exact: true }), "ready");
        }
      }
      await page.getByLabel("State", { exact: true }).selectOption("ready");
    }
    await page.getByLabel("Surface", { exact: true }).selectOption("landing");
    if (scenario.width < 640) {
      const summary = asset.locator("summary").filter({ hasText: scenario.locale === "zh" ? /^页面导航$/ : /^Page navigation$/ });
      await summary.click();
      await asset.getByRole("navigation", { name: scenario.locale === "zh" ? "页面导航" : "Page navigation" }).getByRole("link").first().click();
      record(scenario.name, "mobile-landing-disclosure-and-anchor");
    }
    const faq = asset.locator("summary").filter({ hasText: scenario.locale === "zh" ? "可以随时取消吗" : "Can I cancel" }).first();
    const wasOpen = await faq.evaluate((element) => element.parentElement.open);
    await faq.click();
    assert.equal(await faq.evaluate((element) => element.parentElement.open), !wasOpen, "FAQ must toggle its initial state");
    record(scenario.name, "landing-faq-toggle");
    record(scenario.name, "five-assets-states-no-horizontal-overflow");
  }
  assert.deepEqual(errors, [], "Renderer console/page errors");
} catch (error) {
  errors.push(String(error));
  diagnostics.push({ scenario: currentScenario, type: "assertion", text: String(error), stack: error.stack });
  if (page) await screenshot("failure").catch(() => {});
  process.exitCode = 1;
} finally {
  if (context) await context.tracing.stop({ path: join(evidence, `${profile}-trace.zip`) }).catch(() => {});
  await writeFile(join(evidence, `${profile}-browser.json`), JSON.stringify({ profile, checks, errors, diagnostics, screenshots }, null, 2));
  if (application) await application.close();
  if (browser) await browser.close();
}
console.log(JSON.stringify({ profile, assertions: checks.length, screenshots: screenshots.length, errors }));
