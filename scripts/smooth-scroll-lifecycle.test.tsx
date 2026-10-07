import { afterAll, beforeAll, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { chromium, type Browser, type Page } from "playwright";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { SmoothScroll } from "../components/motion/smooth-scroll";

// Bundle the actual installed Lenis and component into memory. No Next build,
// mocked scroll engine, site provider or files outside this test are needed.
const fixtureEntry = import.meta.path;
const browserFixture = `
import { createRoot, hydrateRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { SmoothScroll, useSmoothScroll } from "../components/motion/smooth-scroll";
window.probe = { mounts: 0, unmounts: 0, errors: [], frames: [] };
function Child() {
  const [count, setCount] = useState(0);
  const api = useSmoothScroll();
  window.probe.frames.push(api.lenis === null ? "native" : "lenis");
  useEffect(() => {
    window.probe.mounts++;
    return () => { window.probe.unmounts++; };
  }, []);
  useEffect(() => { window.probe.api = api; }, [api]);
  return <div style={{ height: 900 }}><button type="button" id="counter" onClick={() => setCount(c => c + 1)}>{count}</button></div>;
}
function App({ root }) {
  return <SmoothScroll root={root} className="scroll-wrapper"><Child /></SmoothScroll>;
}
window.probe.isRealLenis = () => window.probe.api.lenis instanceof Lenis;
const params = new URLSearchParams(location.search);
const app = <App root={params.get("root") === "true"} />;
const container = document.getElementById("app");
window.probe.reactRoot = params.get("hydrate") === "true"
  ? hydrateRoot(container, app, { onRecoverableError: error => window.probe.errors.push(String(error)) })
  : createRoot(container);
if (params.get("hydrate") !== "true") window.probe.reactRoot.render(app);
`;

function ServerChild() {
  const [count] = useState(0);
  return <div style={{ height: 900 }}><button type="button" id="counter">{count}</button></div>;
}

type Probe = {
  mounts: number;
  unmounts: number;
  errors: string[];
  frames: string[];
  api: ReturnType<typeof import("../components/motion/smooth-scroll").useSmoothScroll>;
  isRealLenis: () => boolean;
  reactRoot: { unmount: () => void };
  originalButton?: HTMLElement;
  originalWrapper?: HTMLElement;
  previousLenis?: Probe["api"]["lenis"];
};
declare global {
  interface Window { probe: Probe; }
}

let browser: Browser;
let server: Server;
let port: number;

beforeAll(async () => {
  const bundle = await Bun.build({
    entrypoints: [fixtureEntry],
    target: "browser",
    plugins: [{
      name: "in-memory-smooth-scroll-fixture",
      setup(build) {
        build.onLoad({ filter: /smooth-scroll-lifecycle\.test\.tsx$/ }, () => ({ contents: browserFixture, loader: "tsx" }));
      },
    }],
  });
  if (!bundle.success) throw new AggregateError(bundle.logs, "Cannot bundle lifecycle fixture");
  const javascript = await bundle.outputs[0].text();
  server = createServer((request, response) => {
      const url = new URL(request.url ?? "/", "http://localhost");
      if (url.pathname === "/fixture.js") {
        response.writeHead(200, { "content-type": "text/javascript" });
        response.end(javascript);
        return;
      }
      const root = url.searchParams.get("root") === "true";
      const markup = url.searchParams.get("hydrate") === "true"
        ? renderToString(<SmoothScroll root={root} className="scroll-wrapper"><ServerChild /></SmoothScroll>) : "";
      response.writeHead(200, { "content-type": "text/html" });
      response.end(`<!doctype html><html><head><style>body{margin:0} .scroll-wrapper{${root ? "" : "height:160px;overflow:auto;"}}</style></head><body><div id="app">${markup}</div><script type="module" src="/fixture.js"></script></body></html>`);
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing HTTP fixture port");
  port = address.port;
  const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  browser = await chromium.launch({ headless: true, ...(existsSync(chrome) ? { executablePath: chrome } : {}) });
}, 30_000);

afterAll(async () => {
  await browser?.close();
  server?.closeAllConnections();
  server?.close();
});

async function openFixture({ reduced, hydrate = false, root = false }: { reduced: boolean; hydrate?: boolean; root?: boolean }) {
  const context = await browser.newContext({ reducedMotion: reduced ? "reduce" : "no-preference", viewport: { width: 800, height: 400 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`http://127.0.0.1:${port}/?hydrate=${hydrate}&root=${root}`);
  try {
    await page.waitForFunction(() => window.probe?.api && window.probe.mounts > 0);
  } catch (error) {
    const state = await page.evaluate(() => ({ probe: window.probe && Object.keys(window.probe), html: document.body.innerHTML.slice(0, 600) }));
    await context.close();
    throw new Error(`Fixture did not mount: ${JSON.stringify({ errors, state })}`, { cause: error });
  }
  await page.evaluate(() => {
    window.probe.originalButton = document.getElementById("counter") ?? undefined;
    window.probe.originalWrapper = document.querySelector<HTMLElement>(".scroll-wrapper") ?? undefined;
  });
  return { context, page, errors };
}

async function expectNative(page: Page) {
  await page.waitForFunction(() => window.probe.api.lenis === null);
  expect(await page.evaluate(() => {
    const event = new WheelEvent("wheel", { deltaY: 80, bubbles: true, cancelable: true });
    document.getElementById("counter")?.dispatchEvent(event);
    return event.defaultPrevented;
  })).toBe(false);
}

async function expectPreserved(page: Page) {
  expect(await page.evaluate(() => ({
    mounts: window.probe.mounts,
    unmounts: window.probe.unmounts,
    sameButton: window.probe.originalButton === document.getElementById("counter"),
    sameWrapper: window.probe.originalWrapper === document.querySelector(".scroll-wrapper"),
    count: document.getElementById("counter")?.textContent,
  }))).toEqual({ mounts: 1, unmounts: 0, sameButton: true, sameWrapper: true, count: "1" });
}

test("real Lenis switches to native and back without remounting or losing local state", async () => {
  const { context, page, errors } = await openFixture({ reduced: false });
  try {
    await page.waitForFunction(() => window.probe.isRealLenis());
    expect(await page.evaluate(() => window.probe.api.lenis?.options.wrapper === document.querySelector(".scroll-wrapper"))).toBe(true);
    await page.locator("#counter").click();
    expect(await page.evaluate(() => {
      window.probe.previousLenis = window.probe.api.lenis;
      const event = new WheelEvent("wheel", { deltaY: 80, bubbles: true, cancelable: true });
      document.getElementById("counter")?.dispatchEvent(event);
      return event.defaultPrevented;
    })).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNative(page);
    await expectPreserved(page);

    // Trusted browser wheel input must scroll the real wrapper, not window.
    await page.locator(".scroll-wrapper").hover();
    await page.mouse.wheel(0, 180);
    await page.waitForFunction(() => {
      const wrapper = document.querySelector<HTMLElement>(".scroll-wrapper");
      return wrapper && wrapper.scrollTop > 0 && window.probe.api.scrollY.get() === wrapper.scrollTop;
    });
    const metrics = await page.evaluate(() => {
      const wrapper = document.querySelector<HTMLElement>(".scroll-wrapper");
      if (!wrapper) throw new Error("Missing native wrapper");
      return { windowY: window.scrollY, progress: window.probe.api.progress.get(), expected: wrapper.scrollTop / (wrapper.scrollHeight - wrapper.clientHeight) };
    });
    expect(metrics.windowY).toBe(0);
    expect(metrics.progress).toBeCloseTo(metrics.expected, 8);
    await page.evaluate(() => window.probe.api.scrollTo(260, { offset: 10 }));
    await page.waitForFunction(() => window.probe.api.scrollY.get() === 270);
    expect(await page.locator(".scroll-wrapper").evaluate(element => element.scrollTop)).toBe(270);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() => window.probe.isRealLenis() && window.probe.api.lenis !== window.probe.previousLenis);
    await expectPreserved(page);
    expect(errors).toEqual([]);
  } finally { await context.close(); }
}, 20_000);

for (const hydrate of [false, true]) {
  test(`${hydrate ? "SSR hydration commit" : "CSR first frame"} with reduce keeps children and exposes native metrics`, async () => {
    const { context, page, errors } = await openFixture({ reduced: true, hydrate });
    try {
      await expectNative(page);
      expect(await page.evaluate(() => window.probe.frames.every(frame => frame === "native"))).toBe(true);
      await page.locator("#counter").click();
      await expectPreserved(page);
      await page.evaluate(() => window.probe.api.scrollTo(140));
      await page.waitForFunction(() => window.probe.api.scrollY.get() === 140);
      expect(await page.locator(".scroll-wrapper").evaluate(element => element.scrollTop)).toBe(140);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.waitForFunction(() => window.probe.isRealLenis());
      await expectPreserved(page);
      expect(await page.evaluate(() => window.probe.errors)).toEqual([]);
      expect(errors).toEqual([]);
    } finally { await context.close(); }
  }, 20_000);
}

test("root native scroll metrics track window after SSR hydration and cleanup removes the engine", async () => {
  const { context, page, errors } = await openFixture({ reduced: true, hydrate: true, root: true });
  try {
    await expectNative(page);
    await page.locator("#counter").click();
    await page.evaluate(() => window.probe.api.scrollTo(180, { offset: 20 }));
    await page.waitForFunction(() => window.scrollY === 200 && window.probe.api.scrollY.get() === 200);
    expect(await page.evaluate(() => window.probe.api.progress.get())).toBeCloseTo(200 / 500, 8);
    await expectPreserved(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() => window.probe.isRealLenis());
    expect(await page.evaluate(() => window.probe.api.lenis?.options.wrapper === window)).toBe(true);
    await expectPreserved(page);
    await page.evaluate(() => window.probe.reactRoot.unmount());
    expect(await page.evaluate(() => ({ unmounts: window.probe.unmounts, lenisClass: document.documentElement.classList.contains("lenis") }))).toEqual({ unmounts: 1, lenisClass: false });
    expect(errors).toEqual([]);
  } finally { await context.close(); }
}, 20_000);
