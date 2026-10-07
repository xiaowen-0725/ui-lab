import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { chromium, type Page } from "playwright";
import ts from "typescript";
import { allShadcnTargets, buildShadcnItem } from "../lib/registry-server";
import { allStandaloneUsages } from "../lib/standalone-usage";
import { themeKitToCss, THEME_KITS } from "../lib/theme-kits";
import { externalPackageRoot, inspectModule, isUnsupportedModuleSpecifier } from "./architecture-rules";

const root = resolve(import.meta.dir, "..");
const args = process.argv.slice(2);
const browserEnabled = args.includes("--browser");
const selected = args.filter((arg) => arg !== "--browser");
const usages = allStandaloneUsages().filter((usage) => selected.length === 0 || selected.includes(usage.key));
if (!usages.length || selected.some((key) => !usages.some((usage) => usage.key === key))) throw new Error("Unknown or empty usage selection");
const evidence = await mkdtemp(join(tmpdir(), "uilab-standalone-usage-"));
const targets = allShadcnTargets();
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
  strict: true, skipLibCheck: true, noEmit: true, esModuleInterop: true,
  resolveJsonModule: true, types: ["node", "react", "react-dom"],
  lib: ["lib.dom.d.ts", "lib.dom.iterable.d.ts", "lib.esnext.d.ts"],
};
const results: { key: string; installSlug: string; usageFile: string; files: { path: string; sha256: string }[]; typecheck: boolean; ssr: boolean; bundle: boolean; error?: string }[] = [];
const browserChecks: { key: string; mode: string; errors: string[]; mounted: boolean }[] = [];
const fixtures = new Map<string, { directory: string; markup: string }>();
const globalErrors: string[] = [];
let browserVersion: string | undefined;
const expectedBrowserChecks = browserEnabled ? usages.length * 2 : 0;
const interactionChecks: { key: string; mode: string; passed: boolean; error?: string }[] = [];
const interactions: Record<string, (page: Page) => Promise<void>> = {
  "button-base": async (page) => {
    await page.getByLabel("任务标题").fill("独立消费验收");
    await page.getByRole("button", { name: "创建任务", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "已创建本地演示任务：独立消费验收" }).waitFor();
  },
  switch: async (page) => {
    await page.getByRole("switch").click();
    await page.getByRole("status").filter({ hasText: "本地阅读提醒选项已开启" }).waitFor();
  },
  drawer: async (page) => {
    await page.getByRole("button", { name: "打开显示设置" }).click();
    await page.getByRole("dialog", { name: "显示设置" }).waitFor();
    await page.getByLabel("使用紧凑布局").check();
    await page.getByRole("button", { name: "保存偏好" }).click();
    await page.getByRole("status").filter({ hasText: "本地偏好已保存：紧凑布局" }).waitFor();
  },
  "tool-approval": async (page) => {
    await page.getByRole("button", { name: "Allow once", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "已记录本次允许" }).waitFor();
    await page.getByRole("button", { name: "重置请求" }).click();
    await page.getByRole("button", { name: "Deny", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "已拒绝本次演示请求" }).waitFor();
  },
  "step-form": async (page) => {
    await page.getByRole("button", { name: /布局.*练习留白/ }).click();
    await page.getByPlaceholder("例如：卡片布局练习").fill("卡片练习");
    await page.getByRole("button", { name: "Complete", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "练习：卡片练习；重点：布局" }).waitFor();
  },
};
console.log(`Standalone usage evidence: ${evidence}; ${usages.length} usages`);

function exampleExport(file: string, content: string) {
  const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  const exports = source.statements.filter((statement): statement is ts.FunctionDeclaration => ts.isFunctionDeclaration(statement) && !!statement.name?.text.endsWith("Example") && !!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
  if (exports.length !== 1 || !exports[0].name) throw new Error(`${file}: expected one named *Example function`);
  return exports[0].name.text;
}

try {
  for (const usage of usages) {
    const record: (typeof results)[number] = { key: usage.key, installSlug: usage.installSlug, usageFile: usage.usageFile, files: [], typecheck: false, ssr: false, bundle: false };
    results.push(record);
    try {
      const directory = join(evidence, usage.key);
      await mkdir(directory, { recursive: true });
      // Only external dependency resolution is shared. @/ resolves inside this
      // fixture, so the source repository cannot supply a missing helper/barrel.
      await symlink(join(root, "node_modules"), join(directory, "node_modules"), "dir");
      const target = targets.find((item) => item.slug === usage.installSlug);
      if (!target) throw new Error(`Missing install target ${usage.installSlug}`);
      const item = await buildShadcnItem(target.categorySlug, target.slug);
      if (!item?.files?.length) throw new Error(`Missing distribution ${target.slug}`);
      for (const file of item.files) {
        if (file.content === undefined) throw new Error(`Missing content ${file.path}`);
        const destination = join(directory, file.path);
        if (relative(directory, destination).startsWith("..") || file.path.startsWith("/")) throw new Error(`Distribution escapes fixture: ${file.path}`);
        await mkdir(dirname(destination), { recursive: true });
        await writeFile(destination, file.content);
        record.files.push({ path: file.path, sha256: createHash("sha256").update(file.content).digest("hex") });
      }
      const source = await readFile(join(root, usage.usageFile), "utf8");
      const exportName = exampleExport(usage.usageFile, source);
      await writeFile(join(directory, "usage.tsx"), source);
      const options = { ...compilerOptions, baseUrl: directory, paths: { "@/*": ["./*"] } };
      const allowedPackages = new Set(["react", "react-dom", ...(item.dependencies ?? []).map((dependency) => dependency.replace(/@[^@/]+$/, ""))]);
      const ownedFiles = new Set(record.files.map((file) => resolve(directory, file.path)));
      for (const { specifier } of inspectModule(usage.usageFile, source).references) {
        if (isUnsupportedModuleSpecifier(specifier)) throw new Error(`Unsupported usage import ${specifier}`);
        const external = externalPackageRoot(specifier);
        if (external && !allowedPackages.has(external)) throw new Error(`Usage imports undeclared dependency ${external}`);
        if (!external) {
          const resolved = ts.resolveModuleName(specifier, join(directory, "usage.tsx"), options, ts.sys).resolvedModule;
          if (!resolved || !ownedFiles.has(resolve(resolved.resolvedFileName))) throw new Error(`Usage import outside installation graph: ${specifier}`);
        }
      }
      await writeFile(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2020", lib: ["dom", "dom.iterable", "esnext"], module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, skipLibCheck: true, esModuleInterop: true, baseUrl: ".", paths: { "@/*": ["./*"] } } }));
      // The same wrapper renders on the server and client. Its effect proves a
      // client commit, rather than merely finding the pre-existing SSR markup.
      await writeFile(join(directory, "consumer.tsx"), `import { useEffect } from "react"; import { ${exportName} } from "./usage"; export function Consumer() { useEffect(() => { document.getElementById("root")!.dataset.hydrated = "true"; }, []); return <${exportName} />; }`);
      const program = ts.createProgram([join(directory, "usage.tsx"), join(directory, "consumer.tsx"), ...record.files.filter((file) => /\.[cm]?tsx?$/.test(file.path)).map((file) => join(directory, file.path))], options);
      const diagnostics = ts.getPreEmitDiagnostics(program);
      if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => directory, getCanonicalFileName: (file) => file, getNewLine: () => "\n" }));
      record.typecheck = true;
      await writeFile(join(directory, "ssr.tsx"), `import { renderToString } from "react-dom/server"; import { Consumer } from "./consumer"; const html = renderToString(<Consumer />); console.log(JSON.stringify({ html }));`);
      const child = Bun.spawn(["bun", "ssr.tsx"], { cwd: directory, stdout: "pipe", stderr: "pipe" });
      const [exit, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
      await writeFile(join(directory, "ssr.log"), `${stdout}\n${stderr}`);
      if (exit !== 0) throw new Error(`SSR exit ${exit}: ${stderr}`);
      const { html } = JSON.parse(stdout.trim());
      if (typeof html !== "string") throw new Error("SSR did not produce markup");
      record.ssr = true;
      await writeFile(join(directory, "browser.tsx"), `import { hydrateRoot } from "react-dom/client"; import { Consumer } from "./consumer"; hydrateRoot(document.getElementById("root")!, <Consumer />, { onRecoverableError: (error) => console.error("React recoverable error", error) });`);
      const build = await Bun.build({ entrypoints: [join(directory, "browser.tsx")], outdir: join(directory, "dist"), target: "browser", minify: true, tsconfig: join(directory, "tsconfig.json") });
      if (!build.success) throw new Error(build.logs.join("\n"));
      record.bundle = true;
      fixtures.set(usage.key, { directory, markup: html });
      console.log(`PASS ${usage.key}: isolated strict typecheck, SSR, browser bundle`);
    } catch (error) {
      record.error = error instanceof Error ? error.stack ?? error.message : String(error);
      console.error(`FAIL ${usage.key}: ${record.error.slice(0, 300)}`);
    }
  }

  if (browserEnabled && results.every((result) => !result.error)) {
    const kit = THEME_KITS.find((theme) => theme.slug === "graphite");
    if (!kit) throw new Error("Missing Graphite theme");
    const template = await readFile(join(root, "benchmarks/runs/catalog-assets/styles.css"), "utf8");
    const css = await postcss([tailwind({ base: root })]).process(`${template}\n@source "${evidence}";\n${themeKitToCss(kit)}`, { from: join(root, "standalone-usage.css") });
    await writeFile(join(evidence, "styles.css"), css.css);
    const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch(request) {
      const [key, resource] = new URL(request.url).pathname.slice(1).split("/");
      const fixture = fixtures.get(key);
      if (resource === "styles.css") return new Response(css.css, { headers: { "content-type": "text/css" } });
      if (!fixture) return new Response("not_found", { status: 404 });
      if (resource === "browser.js") return new Response(Bun.file(join(fixture.directory, "dist/browser.js")), { headers: { "content-type": "text/javascript" } });
      return new Response(`<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><link rel="stylesheet" href="/${key}/styles.css"></head><body><main id="root">${fixture.markup}</main><script type="module" src="/${key}/browser.js"></script></body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });
    } });
    const executablePath = process.env.UILAB_BROWSER_EXECUTABLE ?? [chromium.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
    if (!executablePath) throw new Error("Browser not installed; set UILAB_BROWSER_EXECUTABLE");
    const browser = await chromium.launch({ headless: true, executablePath });
    browserVersion = browser.version();
    try {
      for (const mode of ["no-preference", "reduce"] as const) {
        const context = await browser.newContext({ reducedMotion: mode, viewport: { width: mode === "reduce" ? 390 : 1440, height: 1000 } });
        for (const usage of usages) {
          const page = await context.newPage();
          const errors: string[] = [];
          page.on("pageerror", (error) => errors.push(error.message));
          page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
          page.on("response", (response) => { if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`); });
          page.on("requestfailed", (request) => errors.push(`Request failed: ${request.url()} ${request.failure()?.errorText}`));
          let mounted = false;
          try {
            await page.goto(`${server.url.origin}/${usage.key}`, { waitUntil: "load" });
            await page.locator('#root[data-hydrated="true"]').waitFor({ timeout: 10_000 });
            await page.waitForTimeout(350);
            mounted = await page.locator("#root > *").count() > 0;
            if (interactions[usage.key]) {
              try {
                await interactions[usage.key](page);
                interactionChecks.push({ key: usage.key, mode, passed: true });
              } catch (error) {
                interactionChecks.push({ key: usage.key, mode, passed: false, error: String(error) });
                throw error;
              }
            }
          } catch (error) { errors.push(String(error)); }
          browserChecks.push({ key: usage.key, mode, errors: [...errors], mounted });
          if (!mounted || errors.length) {
            await page.screenshot({ path: join(evidence, `${usage.key}-${mode}-failure.png`) });
            console.error(`BROWSER FAIL ${usage.key}/${mode}: ${errors.join("; ")}`);
          }
          await page.close();
        }
        await context.close();
      }
    } finally { try { await browser.close(); } finally { server.stop(true); } }
  }
} catch (error) {
  globalErrors.push(error instanceof Error ? error.stack ?? error.message : String(error));
} finally {
  const passed = results.length === usages.length && results.every((result) => !result.error) && globalErrors.length === 0 && browserChecks.length === expectedBrowserChecks && browserChecks.every((check) => check.mounted && !check.errors.length);
  await writeFile(join(evidence, "result.json"), JSON.stringify({ generatedAt: new Date().toISOString(), verdict: passed ? "passed" : "failed", globalErrors, root, evidence, typescript: ts.version, browserVersion, dependencyVersions: { react: (await Bun.file(join(root, "node_modules/react/package.json")).json()).version, motion: (await Bun.file(join(root, "node_modules/motion/package.json")).json()).version }, usages: results.length, browserEnabled, expectedBrowserChecks, results, browserChecks, interactionChecks }, null, 2));
}
if (globalErrors.length || results.length !== usages.length || results.some((result) => result.error) || browserChecks.length !== expectedBrowserChecks || browserChecks.some((check) => check.errors.length || !check.mounted)) process.exit(1);
console.log(`PASS ${results.length} isolated usages; ${browserChecks.length} browser hydration checks. Evidence: ${evidence}`);
