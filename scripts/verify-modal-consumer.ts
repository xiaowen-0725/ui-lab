// Install published registry shapes into a separate React package, then exercise native modality.
import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const base = process.env.UILAB_SITE_BASE ?? "http://localhost:3000";
const fixture = await mkdtemp(join(tmpdir(), "uilab-installed-modals-"));
await mkdir(join(fixture, "src"));
await writeFile(join(fixture, "package.json"), JSON.stringify({ name: "uilab-modal-consumer", private: true, dependencies: { react: "19.2.0", "react-dom": "19.2.0", tailwindcss: "4.1.18" }, devDependencies: { typescript: "5.9.3", "@types/react": "19.2.2", "@types/react-dom": "19.2.2" } }));
await writeFile(join(fixture, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2020", lib: ["DOM", "ESNext"], strict: true, skipLibCheck: true, module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx", esModuleInterop: true, baseUrl: ".", paths: { "@/*": ["./*"] } } }));
await writeFile(join(fixture, "components.json"), JSON.stringify({ style: "new-york", rsc: false, tsx: true, tailwind: { config: "", css: "src/globals.css", baseColor: "neutral", cssVariables: true }, aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/lib/hooks" } }));
await writeFile(join(fixture, "src/globals.css"), "@import 'tailwindcss';\n");
const logs: { command: string[]; exit: number }[] = [];
async function run(command: string[]) {
  const child = Bun.spawn(command, { cwd: fixture, stdout: "pipe", stderr: "pipe" });
  const [exit, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
  logs.push({ command, exit });
  await writeFile(join(fixture, `command-${logs.length}.log`), `${stdout}\n${stderr}`);
  assert.equal(exit, 0, `${command.join(" ")} failed; ${fixture}`);
}
const tooling = Bun.spawn(["bun", "install", "--frozen-lockfile"], { cwd: resolve("benchmarks/runs/catalog-assets"), stdout: "pipe", stderr: "pipe" });
const [toolingExit, toolingOut, toolingErr] = await Promise.all([tooling.exited, new Response(tooling.stdout).text(), new Response(tooling.stderr).text()]);
assert.equal(toolingExit, 0, `Install registry test tooling: ${toolingOut} ${toolingErr}`);
await run(["bun", "install"]);
await run(["node", resolve("benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js"), "add", `${base}/r/drawer.json`, `${base}/r/bottom-sheet.json`, "--yes", "--cwd", fixture]);
await writeFile(join(fixture, "src/consumer.tsx"), `
import {useState} from 'react'; import {createRoot} from 'react-dom/client';
import {Drawer} from '@/components/motion/drawer'; import {BottomSheet} from '@/components/motion/bottom-sheet';
function Consumer(){const[d,D]=useState(false);const[s,S]=useState(false);return <><main style={{height:2400}}><button id="launch" onClick={()=>D(true)}>Open drawer</button><button id="background">Background</button></main><Drawer open={d} onOpenChange={D} ariaLabel="Consumer drawer"><input aria-label="Drawer field"/><button id="nested" onClick={()=>S(true)}>Open sheet</button><button id="drawer-last" onClick={()=>D(false)}>Close drawer</button></Drawer><BottomSheet open={s} onOpenChange={S} title="Consumer sheet" description="Consumer details"><input aria-label="Sheet field"/><button id="sheet-last" onClick={()=>S(false)}>Close sheet</button></BottomSheet></>};createRoot(document.getElementById('root')!).render(<Consumer/>);
`);
await run(["bun", "x", "--no-install", "tsc", "--noEmit"]);
const build = await Bun.build({ entrypoints: [join(fixture, "src/consumer.tsx")], outdir: join(fixture, "dist"), target: "browser", define: { "process.env.NODE_ENV": JSON.stringify("production") } });
assert(build.success, `Consumer build failed: ${build.logs}`);
await writeFile(join(fixture, "dist/index.html"), `<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;font:16px system-ui}input,button{margin:12px;padding:12px}dialog{position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;border:0;background:transparent}dialog>button{position:absolute;inset:0;background:#0006;width:100%;height:100%;margin:0}aside{position:absolute;right:0;top:0;bottom:0;width:320px;background:white;display:flex;flex-direction:column}dialog>div[tabindex]{position:absolute;bottom:0;left:0;right:0;background:white;pointer-events:auto}dialog>div:not([tabindex]){position:absolute;inset:0;background:#0006}dialog div.cursor-grab{height:48px;touch-action:none}dialog header{padding:12px}</style></head><body><div id="root"></div><script type="module" src="/consumer.js"></script></body></html>`);
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch(request) { const path = new URL(request.url).pathname; if (path === "/favicon.ico") return new Response(null, { status: 204 }); return new Response(Bun.file(join(fixture, "dist", path === "/" ? "index.html" : path.slice(1)))); } });
const browser = await chromium.launch({ channel: process.env.UILAB_BROWSER_CHANNEL ?? "chrome", headless: true });
const checks: string[] = []; const errors: string[] = [];
try {
  for (const reduce of [false, true]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: reduce ? "reduce" : "no-preference" });
    const page = await context.newPage(); page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.port}`);
    await page.locator("#launch").click();
    await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Drawer field");
    assert.equal(await page.locator("dialog:modal").count(), 1);
    assert(await page.locator("#root").evaluate((el) => el instanceof HTMLElement && el.inert));
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.id), "drawer-last");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Drawer field");
    await page.locator("#background").evaluate((el) => el.focus());
    assert.notEqual(await page.evaluate(() => document.activeElement?.id), "background");
    await page.locator("#nested").click();
    await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Sheet field");
    assert.equal(await page.locator("dialog:modal").count(), 2);
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.id), "sheet-last");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Sheet field");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement?.id === "nested");
    assert(await page.locator("#root").evaluate((el) => el instanceof HTMLElement && el.inert));
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement?.id === "launch");
    await page.waitForFunction(() => document.querySelectorAll("dialog").length === 0);
    assert.equal(await page.locator("#root").evaluate((el) => el instanceof HTMLElement && el.inert), false);
    checks.push(`reduce=${reduce}: initial focus, native modality, inert/background, Tab/Shift+Tab, nested Escape, restoration`);
    await page.locator("#launch").click();
    await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Drawer field");
    await page.locator("#nested").click();
    await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Sheet field");
    const surface = page.locator('dialog:modal').last().locator('div[tabindex="-1"]');
    await surface.waitFor(); await page.waitForTimeout(550);
    if (reduce) assert.equal(await surface.evaluate((el) => getComputedStyle(el).transform), "none");
    // Actual touch events, not mouse dragging presented as touch.
    const handle = surface.locator('.cursor-grab'); const box = await handle.boundingBox(); assert(box);
    const client = await context.newCDPSession(page); const x = box.x + box.width / 2; const y = box.y + box.height / 2;
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let delta = 20; delta <= 220; delta += 20) { await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y + delta }] }); await page.waitForTimeout(20); }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForFunction(() => document.activeElement?.id === "nested", { step: `touch reduce=${reduce}` });
    checks.push(`reduce=${reduce}: touch drag dismiss and launcher restoration`);
    await page.screenshot({ path: join(fixture, `reduce-${reduce}.png`) });
    await page.keyboard.press("Escape"); await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(join(fixture, "result.json"), JSON.stringify({ base, registry: "shadcn 4.21.1", browser: browser.version(), logs, checks, errors }, null, 2));
  console.log(`PASS installed Drawer/BottomSheet: compile/build, keyboard, nested modality, touch, reduced-motion. Evidence: ${fixture}`);
} catch (error) { await writeFile(join(fixture, "failure.json"), JSON.stringify({ error: String(error), logs, checks, errors }, null, 2)); throw error; }
finally { await browser.close(); server.stop(); }
