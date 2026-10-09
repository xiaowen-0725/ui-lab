/** Real, pinned shadcn installation into independent Next/Vite consumers.
 * Writes only this run's /tmp fixtures; never copies portable source by hand.
 * --prepare installs the initial graph; --refresh reinstalls a new frozen graph.
 * --verify builds and runs the already installed graph without refreshing it.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";
import { chromium } from "playwright";
import postcss from "postcss";
import ts from "typescript";
import { allShadcnTargets, buildInstallationContract, buildShadcnItem } from "../lib/registry-server";
import { inspectModule } from "./architecture-rules";

const directory = "/tmp/uilab-saas-full-consumers";
const profiles = ["next-app", "vite-app"] as const;
const mode = process.argv[2] ?? "--prepare";
if (!["--prepare", "--refresh", "--verify", "--audit"].includes(mode)) throw new Error("Use --prepare, --refresh, --verify or --audit");
await mkdir(directory, { recursive: true });
const hash = (content: string) => createHash("sha256").update(content).digest("hex");
const runId = `${new Date().toISOString().replace(/[:.]/g, "-")}-${mode.slice(2)}`;
const evidence = join(directory, "evidence", runId);
await mkdir(evidence, { recursive: true });
const commands: { profile: string; args: string[]; exitCode: number; log: string }[] = [];
const requests: { path: string; status: number }[] = [];
const outcomes: Record<string, unknown>[] = [];

async function auditInstalledGraph(profile: string, cwd: string, graph: NonNullable<Awaited<ReturnType<typeof buildShadcnItem>>>) {
  const paths = new Set((graph.files ?? []).map(file => file.path));
  const resolvedImports: Record<string, unknown>[] = [];
  const unexpectedImports: Record<string, unknown>[] = [];
  const bodyChanges: string[] = [];
  const cssChanges: string[] = [];
  const directiveChanges: string[] = [];
  const licenseGaps: Record<string, unknown>[] = [];
  const installed = new Map<string, string>();
  for (const file of graph.files ?? []) installed.set(file.path, await readFile(join(cwd, file.path), "utf8"));
  function resolveInternal(specifier: string, file: string) {
    if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return undefined;
    const rel = specifier.startsWith("@/") ? specifier.slice(2) : posix.normalize(posix.join(posix.dirname(file), specifier));
    for (const candidate of [rel, ...[".ts", ".tsx", ".js", ".jsx", ".css"].map(ext => rel + ext), ...[".ts", ".tsx", ".js", ".jsx", ".css"].map(ext => `${rel}/index${ext}`)]) {
      if (paths.has(candidate)) return candidate;
    }
    return null;
  }
  function jsxText(text: string) {
    const lines = text.replace(/\r/g, "").split("\n");
    const last = lines.findLastIndex(line => /[^ \t]/.test(line));
    return lines.map((line, index) => {
      let value = line.replace(/\t/g, " ");
      if (index !== 0) value = value.replace(/^ +/, "");
      if (index !== lines.length - 1) value = value.replace(/ +$/, "");
      return value ? value + (index !== last ? " " : "") : "";
    }).join("");
  }
  function body(file: string, content: string) {
    const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
    function shape(node: ts.Node): unknown {
      let text: string | undefined;
      if (ts.isStringLiteralLike(node)) {
        const parent = node.parent;
        const module = ((ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) && parent.moduleSpecifier === node)
          || (ts.isCallExpression(parent) && (parent.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(parent.expression) && parent.expression.text === "require")))
          || (ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent));
        text = module ? "<module-specifier>" : node.text;
      } else if (ts.isIdentifier(node) || ts.isNumericLiteral(node)) text = node.text;
      else if (ts.isJsxText(node)) text = jsxText(node.text);
      return [node.kind, text, node.getChildren(source).filter(child => ![ts.SyntaxKind.EndOfFileToken, ts.SyntaxKind.JSDocComment, ts.SyntaxKind.SingleLineCommentTrivia, ts.SyntaxKind.MultiLineCommentTrivia].includes(child.kind)).map(shape)];
    }
    return JSON.stringify(source.statements.filter(statement => !(ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression) && statement.expression.text === "use client")).map(shape));
  }
  function cssBody(content: string) {
    function shape(node: postcss.AnyNode): unknown {
      if (node.type === "comment") return undefined;
      if (node.type === "decl") return [node.type, node.prop, node.value, node.important];
      if (node.type === "atrule") return [node.type, node.name, node.params, node.nodes?.filter(child => child.type !== "comment").map(shape)];
      if (node.type === "rule") return [node.type, node.selector, node.nodes.filter(child => child.type !== "comment").map(shape)];
      if ("nodes" in node) return [node.type, node.nodes?.filter(child => child.type !== "comment").map(shape)];
      return undefined;
    }
    return JSON.stringify(shape(postcss.parse(content)));
  }
  for (const file of graph.files ?? []) {
    const original = file.content ?? "";
    const actual = installed.get(file.path) ?? "";
    const clientDirective = (content: string) => ts.createSourceFile(file.path, content, ts.ScriptTarget.Latest, true).statements.some(statement => ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression) && statement.expression.text === "use client");
    if (!file.path.endsWith(".css") && clientDirective(original) !== clientDirective(actual) && !(profile === "vite-app" && clientDirective(original) && !clientDirective(actual))) directiveChanges.push(file.path);
    const originalReferences = file.path.endsWith(".css") ? [...original.matchAll(/@import\s+["']([^"']+)["']/g)].map(match => ({ specifier: match[1], line: 0 })) : inspectModule(file.path, original).references;
    const actualReferences = file.path.endsWith(".css") ? [...actual.matchAll(/@import\s+["']([^"']+)["']/g)].map(match => ({ specifier: match[1], line: 0 })) : inspectModule(file.path, actual).references;
    if (originalReferences.length !== actualReferences.length) unexpectedImports.push({ path: file.path, reason: "module-reference count changed", original: originalReferences, actual: actualReferences });
    for (let index = 0; index < Math.max(originalReferences.length, actualReferences.length); index++) {
      const before = originalReferences[index]; const after = actualReferences[index];
      if (!before || !after) continue;
      const originalTarget = resolveInternal(before.specifier, file.path);
      const installedTarget = resolveInternal(after.specifier, file.path);
      const changed = originalTarget === undefined && installedTarget === undefined ? before.specifier !== after.specifier : originalTarget !== installedTarget || originalTarget === null;
      const record = { path: file.path, originalSpecifier: before.specifier, installedSpecifier: after.specifier, originalTarget, installedTarget, originalLine: before.line, installedLine: after.line };
      resolvedImports.push(record);
      if (changed) unexpectedImports.push(record);
    }
    if (file.path.endsWith(".css")) { if (cssBody(original) !== cssBody(actual)) cssChanges.push(file.path); }
    else if (body(file.path, original) !== body(file.path, actual)) bodyChanges.push(file.path);
    for (const comment of original.matchAll(/\/\*[\s\S]*?\*\//g)) {
      if (!comment[0].includes("MIT License") && !comment[0].includes("SIL OPEN FONT LICENSE Version 1.1")) continue;
      const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
      if (![...installed.values()].some(content => normalize(content).includes(normalize(comment[0])))) licenseGaps.push({ path: file.path, notice: comment[0].includes("SIL OPEN") ? "SIL OFL 1.1" : "MIT" });
    }
  }
  const duplicateBasenames = [...new Set([...paths].map(path => posix.basename(path)))].flatMap(name => {
    const files = [...paths].filter(path => posix.basename(path) === name);
    return files.length > 1 ? [{ name, files }] : [];
  });
  const stem = (path: string) => posix.basename(path, posix.extname(path));
  const duplicateStems = [...new Set([...paths].map(stem))].flatMap(name => {
    const files = [...paths].filter(path => stem(path) === name);
    return files.length > 1 ? [{ name, files }] : [];
  });
  const report = { profile, files: paths.size, references: resolvedImports.length, resolvedImports, duplicateBasenames, duplicateStems, unexpectedImports, bodyChanges, cssChanges, directiveChanges, licenseGaps, allowedTransforms: ["module specifier spelling with identical resolved target", "use client removal for a non-RSC consumer", "comments/formatting without license loss", "JSX indentation with unchanged rendered text"] };
  await writeFile(join(evidence, `${profile}-source-audit.json`), JSON.stringify(report, null, 2));
  console.log(`${profile}: semantic audit: ${report.references} references; ${unexpectedImports.length} wrong imports; ${bodyChanges.length} body changes; ${cssChanges.length} CSS changes; ${licenseGaps.length} license gaps`);
  return report;
}

async function run(profile: string, cwd: string, args: string[]) {
  const log = join(evidence, `${profile}-${commands.length}.log`);
  const child = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe", env: {
    ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1", PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: "1",
  } });
  const timeout = setTimeout(() => child.kill(), 600_000);
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited, new Response(child.stdout).text(), new Response(child.stderr).text(),
  ]);
  clearTimeout(timeout);
  await writeFile(log, `$ ${args.join(" ")}\nCWD ${cwd}\nEXIT ${exitCode}\n${stdout}\n${stderr}`);
  commands.push({ profile, args, exitCode, log });
  console.log(`${profile}: exit ${exitCode}: ${args.join(" ")} (${log})`);
  if (exitCode !== 0) throw new Error(`${profile}: ${stdout.slice(-2400)}\n${stderr.slice(-2400)}`);
  return stdout;
}

const consumer = `"use client";
import { useEffect, useState, useRef } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { SaasAdminSite, type SaasAdminAction, type SaasAdminBrand, type SaasAdminMode, type SaasAdminLocale } from "@/components/site-shells/saas-admin-site";
import { DEFAULT_SAAS_ADMIN_APPEARANCE, normalizeSaasAdminAppearance, type SaasAdminAppearance } from "@/components/pages/saas-admin/appearance";
const KEY = "uilab.saas-full.consumer.preferences.v1";
const MODE = "uilab.saas-full.consumer.mode.v1";
function SyncMode({ mode, ready }: { mode: SaasAdminMode; ready: boolean }) {
  const { setTheme } = useTheme();
  useEffect(() => { if (ready) setTheme(mode); }, [mode, ready, setTheme]);
  return null;
}
export function Consumer({ initialPath = "/dashboard/orders", initialSearch = "" }: { initialPath?: string; initialSearch?: string }) {
  const [location, setLocation] = useState({ pathname: initialPath, search: initialSearch });
  const [brand, setBrand] = useState<SaasAdminBrand>("default");
  const [mode, setMode] = useState<SaasAdminMode>("system");
  const [locale, setLocale] = useState<SaasAdminLocale>("en");
  const [appearance, setAppearance] = useState<SaasAdminAppearance>(DEFAULT_SAAS_ADMIN_APPEARANCE);
  const [ready, setReady] = useState(false);
  const [action, setAction] = useState({ type: "", status: "idle", attempt: 0 });
  const deletionFailed = useRef(false);
  useEffect(() => {
    const sync = () => setLocation({ pathname: window.location.pathname === "/" ? "/dashboard/orders" : window.location.pathname, search: window.location.search });
    sync(); window.addEventListener("popstate", sync);
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (["default", "blue-ink"].includes(saved?.brand)) setBrand(saved.brand);
      if (["light", "dark", "system"].includes(saved?.mode)) setMode(saved.mode);
      if (saved?.appearance) setAppearance(normalizeSaasAdminAppearance(saved.appearance));
    } catch { /* Optional storage; retain defaults. */ }
    setReady(true);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.saasAdminBrand = brand;
    try { localStorage.setItem(KEY, JSON.stringify({ brand, mode, appearance })); } catch { /* Optional storage. */ }
  }, [brand, mode, appearance, ready]);
  const navigate = (path: string) => {
    const url = new URL(path, window.location.origin);
    window.history.pushState(null, "", url.pathname + url.search);
    setLocation({ pathname: url.pathname === "/" ? "/dashboard/orders" : url.pathname, search: url.search });
  };
  const submit = async (next: SaasAdminAction) => {
    setAction(previous => ({ type: next.type, status: "pending", attempt: previous.attempt + 1 }));
    await new Promise<void>(resolve => setTimeout(resolve, 350));
    const firstDeletion = next.type === "orders.action" && next.values.action === "delete" && !deletionFailed.current;
    if (firstDeletion) deletionFailed.current = true;
    const fail = firstDeletion || Object.entries(next.values).some(([key, value]) => /email/i.test(key) && String(value).startsWith("fail@"));
    setAction(previous => ({ ...previous, status: fail ? "error" : "success" }));
    if (fail) throw new Error("Independent consumer demo failure: retry the action or change the email.");
  };
  return <ThemeProvider attribute="class" storageKey={MODE} defaultTheme="system" enableSystem>
    <SyncMode mode={mode} ready={ready} />
    <output hidden data-testid="consumer-state">{JSON.stringify({ ...location, brand, mode, locale, ready, action })}</output>
    <SaasAdminSite pathname={location.pathname} search={location.search} locale={locale} brand={brand} mode={mode}
      hrefFor={path => path} onNavigate={navigate} onLocaleChange={setLocale} onBrandChange={setBrand} onModeChange={setMode}
      onSubmit={submit} appearance={appearance} onAppearanceChange={setAppearance} documentTheme />
  </ThemeProvider>;
}
`;

// Host toolchain only. Semantic bindings, animations and fonts must come from
// the installed template CSS; no copied upstream palette/global stylesheet.
const hostCss = `@import "tailwindcss";
@import "../components/pages/saas-admin/styles.css";
@custom-variant dark (&:is(.dark *));
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
}
`;

async function seed(profile: typeof profiles[number]) {
  const cwd = join(directory, profile);
  if (existsSync(join(cwd, "package.json"))) throw new Error(`${cwd} exists; use --refresh instead of reseeding`);
  await mkdir(cwd, { recursive: true });
  const prior = join("/tmp/uilab-saas-orders-consumers", profile);
  const template = JSON.parse(await readFile(join(prior, "package.json"), "utf8"));
  // Start with only the chosen consumer framework, React and CSS toolchain.
  // The shadcn CLI, not this seeding code, installs all source dependencies.
  template.dependencies = {
    react: "19.2.0", "react-dom": "19.2.0", tailwindcss: "4.1.18",
    ...(profile === "next-app" ? { next: "15.5.18" } : {}),
  };
  await writeFile(join(cwd, "package.json"), JSON.stringify(template, null, 2));
  for (const file of ["components.json", "tsconfig.json", ...(profile === "next-app" ? ["next.config.mjs", "postcss.config.mjs"] : ["vite.config.ts"])]) {
    await cp(join(prior, file), join(cwd, file));
  }
  await writeFile(join(cwd, "consumer.tsx"), consumer);
  const css = profile === "next-app" ? "app/globals.css" : "src/globals.css";
  await mkdir(join(cwd, profile === "next-app" ? "app/[[...route]]" : "src"), { recursive: true });
  await writeFile(join(cwd, css), hostCss);
  if (profile === "next-app") {
    await writeFile(join(cwd, "app/layout.tsx"), `import type { ReactNode } from "react";
import "./globals.css";
export const metadata = { icons: { icon: "data:," } };
export default function Layout({children}: {children: ReactNode}) { return <html lang="en" suppressHydrationWarning><body>{children}</body></html>; }
`);
    await writeFile(join(cwd, "app/[[...route]]/page.tsx"), `import { Consumer } from "../../consumer";
export const dynamic = "force-dynamic";
export default async function Page({params,searchParams}: {params: Promise<{route?: string[]}>;searchParams: Promise<Record<string,string|string[]|undefined>>}) {
 const {route}=await params;const search=await searchParams;const query=new URLSearchParams();
 for(const [key,value] of Object.entries(search)) { if(Array.isArray(value)) value.forEach(item=>query.append(key,item)); else if(value!==undefined) query.set(key,value); }
 return <Consumer initialPath={route?.length ? "/"+route.join("/") : "/dashboard/orders"} initialSearch={query.toString() ? "?"+query : ""}/>;
}
`);
  } else {
    await writeFile(join(cwd, "index.html"), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>SaaS independent consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
    await writeFile(join(cwd, "src/main.tsx"), `import {createRoot} from "react-dom/client";import {Consumer} from "../consumer";import "./globals.css";createRoot(document.getElementById("root")!).render(<Consumer initialPath={location.pathname === "/" ? "/dashboard/orders" : location.pathname} initialSearch={location.search}/>);`);
    // Relative asset paths break refreshes on nested routes; consumer config.
    const config = await readFile(join(cwd, "vite.config.ts"), "utf8");
    await writeFile(join(cwd, "vite.config.ts"), config.replace('base: "./"', 'base: "/"'));
  }
}

const target = allShadcnTargets().find(target => target.slug === "saas-admin-site");
if (!target) throw new Error("Main must register saas-admin-site before a real installation");
const frozenPath = join(directory, "frozen-registry.json");
let item: NonNullable<Awaited<ReturnType<typeof buildShadcnItem>>>;
let sourceVersion: string | undefined;
let registryPayloadSha256: string | undefined;
let server: ReturnType<typeof Bun.serve> | undefined;
try {
  if (mode !== "--verify" && mode !== "--audit") {
    const before = await buildInstallationContract(target.categorySlug, target.slug);
    const generated = await buildShadcnItem(target.categorySlug, target.slug);
    if (!generated?.files?.length) throw new Error("Empty SaaS site installation graph");
    item = generated;
    registryPayloadSha256 = hash(JSON.stringify(item));
    sourceVersion = (await buildInstallationContract(target.categorySlug, target.slug))?.sourceVersion;
    if (before?.sourceVersion !== sourceVersion) throw new Error("Source changed while freezing; rerun refresh once Main finishes editing");
    await writeFile(frozenPath, JSON.stringify({ sourceVersion, item }, null, 2));
    await writeFile(join(evidence, "frozen-registry.json"), JSON.stringify({ sourceVersion, item }, null, 2));
    server = Bun.serve({ hostname: "127.0.0.1", port: 3113, fetch(request) {
      const path = new URL(request.url).pathname;
      const status = path === "/r/saas-admin-site.json" ? 200 : 404;
      requests.push({ path, status });
      return new Response(status === 200 ? JSON.stringify(item) : "Not found", { status, headers: { "content-type": "application/json" } });
    } });
    const tools = join(directory, "tooling");
    await mkdir(tools, { recursive: true });
    await writeFile(join(tools, "package.json"), JSON.stringify({ private: true, dependencies: { shadcn: "4.21.4" } }, null, 2));
    await run("tooling", tools, ["bun", "install"]);
    const cli = join(tools, "node_modules/shadcn/dist/index.js");
    await run("tooling", tools, ["node", cli, "--version"]);
    for (const profile of profiles) {
      const cwd = join(directory, profile);
      try {
        if (mode === "--prepare") await seed(profile);
        if (mode === "--refresh") {
          // A fresh source tree makes this proof independent of any previous
          // install or CLI equality shortcuts. Only remove our /tmp outputs.
          for (const folder of ["components", "lib"]) await rm(join(cwd, folder), { recursive: true, force: true });
        }
        await writeFile(join(cwd, "consumer.tsx"), consumer);
        await writeFile(join(cwd, profile === "next-app" ? "app/globals.css" : "src/globals.css"), hostCss);
        await writeFile(join(cwd, "consumer.tsx"), consumer);
        await run(profile, cwd, ["bun", "install"]);
        await run(profile, cwd, ["node", cli, "add", "http://127.0.0.1:3113/r/saas-admin-site.json", "--yes", "--overwrite", "--cwd", cwd]);
        const installedFiles = [];
        for (const file of item.files ?? []) {
          // Only read files after the real CLI install. No fallback copying.
          const content = await readFile(join(cwd, file.path), "utf8");
          installedFiles.push({ path: file.path, originalSha256: hash(file.content ?? ""), installedSha256: hash(content) });
        }
        const pkg = JSON.parse(await readFile(join(cwd, "package.json"), "utf8"));
        const resolvedVersions: Record<string, string> = {};
        const realCwd = await realpath(cwd);
        for (const dependency of ["react", "react-dom", "tailwindcss", ...(profile === "next-app" ? ["next"] : ["vite"]), ...item.dependencies.map(dep => dep.slice(0, dep.lastIndexOf("@")))]) {
          const dependencyPath = join(cwd, "node_modules", dependency);
          if (!(await realpath(dependencyPath)).startsWith(`${realCwd}/`)) throw new Error(`${dependency}: package resolves outside this consumer`);
          const manifest = JSON.parse(await readFile(join(dependencyPath, "package.json"), "utf8"));
          resolvedVersions[dependency] = manifest.version;
        }
        for (const dependency of item.dependencies) {
          const at = dependency.lastIndexOf("@"); const name = dependency.slice(0, at); const version = dependency.slice(at + 1);
          if (resolvedVersions[name] !== version) throw new Error(`${name}: expected ${version}, resolved ${resolvedVersions[name]}`);
        }
        const modules = await realpath(join(cwd, "node_modules"));
        if (!modules.startsWith(`${realCwd}/`)) throw new Error("Consumer node_modules resolves outside its own project");
        const licenses = [];
        for (const file of item.files ?? []) {
          const content = await readFile(join(cwd, file.path), "utf8");
          for (const notice of ["MIT License", "SIL OPEN FONT LICENSE Version 1.1"]) {
            if (file.content?.includes(notice)) licenses.push({ path: file.path, notice, preserved: content.includes(notice) });
          }
        }
        await writeFile(join(evidence, `${profile}-installation.json`), JSON.stringify({ sourceVersion, registryPayloadSha256: hash(JSON.stringify(item)), lockSha256: hash(await readFile(join(cwd, "bun.lock"), "utf8")), dependencies: pkg.dependencies, resolvedVersions, modules, installedFiles, licenses }, null, 2));
        const audit = await auditInstalledGraph(profile, cwd, item);
        outcomes.push({ profile, phase: "source-integrity", ok: !(audit.unexpectedImports.length || audit.bodyChanges.length || audit.cssChanges.length || audit.directiveChanges.length || audit.licenseGaps.length), wrongImports: audit.unexpectedImports.length, bodyChanges: audit.bodyChanges, cssChanges: audit.cssChanges, directiveChanges: audit.directiveChanges, licenseGaps: audit.licenseGaps });
        outcomes.push({ profile, phase: "install", ok: true, files: installedFiles.length, sourceVersion, resolvedVersions });
        console.log(`INITIAL INSTALL READY ${profile}: ${installedFiles.length} files, sourceVersion ${sourceVersion}`);
      } catch (error) { outcomes.push({ profile, phase: "install", ok: false, error: String(error) }); console.error(error); }
    }
  } else {
    ({ sourceVersion, item } = JSON.parse(await readFile(frozenPath, "utf8")));
    registryPayloadSha256 = hash(JSON.stringify(item));
    await writeFile(join(evidence, "frozen-registry.json"), JSON.stringify({ sourceVersion, item }, null, 2));
    for (const profile of profiles) {
      const cwd = join(directory, profile);
      let runtime: ReturnType<typeof Bun.spawn> | undefined;
      try {
        const audit = await auditInstalledGraph(profile, cwd, item);
        outcomes.push({ profile, phase: "source-integrity", ok: !(audit.unexpectedImports.length || audit.bodyChanges.length || audit.cssChanges.length || audit.directiveChanges.length || audit.licenseGaps.length), wrongImports: audit.unexpectedImports.length, bodyChanges: audit.bodyChanges, cssChanges: audit.cssChanges, directiveChanges: audit.directiveChanges, licenseGaps: audit.licenseGaps });
        if (mode === "--audit") continue;
        try {
          await run(profile, cwd, ["bun", "run", "typecheck"]);
          outcomes.push({ profile, phase: "typecheck", ok: true });
        } catch (error) {
          outcomes.push({ profile, phase: "typecheck", ok: false, error: String(error) });
          // Vite's production compiler can still expose runtime defects when
          // a type-only source error exists. Report that error independently.
        }
        await run(profile, cwd, ["bun", "run", "build"]);
        const port = profile === "next-app" ? 3111 : 3112;
        runtime = Bun.spawn(["bun", "run", "start", "--port", String(port)], { cwd, stdout: Bun.file(join(evidence, `${profile}-runtime.log`)), stderr: Bun.file(join(evidence, `${profile}-runtime-errors.log`)), env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
        const origin = `http://127.0.0.1:${port}`;
        let ready = false;
        for (let n = 0; n < 150; n++) {
          if (runtime.exitCode !== null) throw new Error(`Runtime exited: ${runtime.exitCode}`);
          try { if ((await fetch(origin)).ok) { ready = true; break; } } catch { /* Starting. */ }
          await Bun.sleep(100);
        }
        if (!ready) throw new Error("Runtime readiness timeout");
        await browserChecks(profile, origin);
        outcomes.push({ profile, phase: "runtime", ok: true, sourceVersion });
      } catch (error) { outcomes.push({ profile, phase: "runtime", ok: false, error: String(error) }); console.error(error); }
      finally { if (runtime) { runtime.kill(); await runtime.exited; } }
    }
  }
} finally {
  server?.stop();
  const current = await buildInstallationContract(target.categorySlug, target.slug);
  await writeFile(join(evidence, "summary.json"), JSON.stringify({ runId, sourceVersion, registryPayloadSha256, currentSourceVersion: current?.sourceVersion, rootDrifted: sourceVersion !== current?.sourceVersion, requests, commands, outcomes }, null, 2));
  console.log(`Evidence ${evidence}; frozen ${sourceVersion}; current ${current?.sourceVersion}`);
}
if (outcomes.some(outcome => outcome.ok === false)) process.exitCode = 1;

async function browserChecks(profile: typeof profiles[number], origin: string) {
  const executablePath = [chromium.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
  if (!executablePath) throw new Error("No installed Chromium/Chrome; no automatic browser download");
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, colorScheme: "light" });
  const page = await context.newPage();
  const errors: string[] = [];
  const warnings: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && message.location().url.startsWith("https://cdn.shadcnstudio.com/ss-assets/products/")) warnings.push(`Unresolved product asset: ${message.text()}`);
    else if (message.type() === "error") errors.push(message.text());
    else if (message.type() === "warning") warnings.push(message.text());
  });
  // Product images retain the pending, unapproved CDN choice. Keep failures
  // separate from source/runtime errors; do not replace image bytes in tests.
  const networkFailures: { url: string; error: string | null }[] = [];
  page.on("requestfailed", request => networkFailures.push({ url: request.url(), error: request.failure()?.errorText ?? null }));
  const checks: { name: string; ok: boolean }[] = [];
  const state = async () => JSON.parse(await page.getByTestId("consumer-state").textContent() ?? "{}");
  async function check(name: string, action: () => Promise<void>) { await action(); checks.push({ name, ok: true }); }
  async function route(path: string) {
    await page.evaluate(path => { history.pushState(null, "", path); dispatchEvent(new PopStateEvent("popstate")); }, path);
    await page.waitForFunction(path => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").pathname === path.split("?")[0], path);
    await page.locator("[data-saas-admin]").first().waitFor();
    const pagePath = path.split("?")[0];
    const heading = pagePath.startsWith("/apps/users/") ? "Users" : pagePath.startsWith("/forms/") ? "Forms" : ({
      "/dashboard/orders": "Orders", "/pages/user-profile": "User Profile", "/pages/user-settings": "Account & User Management", "/datatable": "Data Tables", "/pages/auth/login": "Sign In", "/pages/auth/register": "Sign Up", "/pages/auth/forgot-password": "Forgot Password",
    } as Record<string, string>)[pagePath];
    await page.getByRole("heading", { level: 1, name: heading, exact: true }).waitFor({ state: "attached" });
  }
  async function appearance(name: string) {
    await page.getByRole("button", { name: "Appearance", exact: true }).click();
    await page.getByRole("menuitemradio", { name, exact: true }).click();
    // Base UI radio items can retain the menu. Close it before reopening for
    // another selection rather than toggling a closing popup in the test.
    await page.keyboard.press("Escape");
    await page.getByRole("menuitemradio", { name, exact: true }).waitFor({ state: "hidden" });
  }
  try {
    await page.goto(`${origin}/dashboard/orders`);
    await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").ready === true);
    await check("full-site mounted", async () => { await page.locator("[data-saas-admin]").first().waitFor(); });
    await check("installed font and CSS loaded", async () => {
      const loaded = await page.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('16px "SaaS Admin Geist"') && getComputedStyle(document.querySelector("[data-saas-admin]") as HTMLElement).fontFamily.includes("SaaS Admin Geist");
      });
      if (!loaded) throw new Error("Installed font/CSS not applied");
    });
    const paths = ["/dashboard/orders", "/apps/users/list", "/apps/users/view", "/pages/user-profile", "/pages/user-settings", "/datatable", "/forms/form-layouts/vertical", "/forms/form-layouts/horizontal", "/forms/form-validation", "/pages/auth/login", "/pages/auth/register", "/pages/auth/forgot-password"];
    for (const path of paths) await check(`route ${path}`, async () => {
      await route(path);
      const text = await page.locator("[data-saas-admin]").first().innerText();
      if (!text.trim() || text.includes("Page not found")) throw new Error(`Route did not render: ${path}`);
    });
    await check("profile and settings query/history", async () => {
      await route("/pages/user-profile");
      await page.getByRole("tab", { name: "Connections", exact: true }).click();
      await page.waitForURL("**/pages/user-profile?view=connections");
      await page.goBack();
      await page.waitForURL("**/pages/user-profile");
      await page.getByRole("tab", { name: "Profile", exact: true }).waitFor();
      await route("/pages/user-settings");
      await page.getByRole("tab", { name: "Workspace", exact: true }).click();
      await page.waitForURL("**/pages/user-settings?setting=workspace");
      await page.goBack(); await page.waitForURL("**/pages/user-settings");
    });
    await route("/apps/users/list");
    await check("theme retains Users search", async () => {
      const input = page.locator("#search-user");
      await input.fill("Ava");
      await appearance("Blue Ink"); await appearance("Dark");
      if (await input.inputValue() !== "Ava") throw new Error("Search lost during brand/mode change");
      const value = await state();
      if (value.brand !== "blue-ink" || value.mode !== "dark") throw new Error("Theme callbacks did not apply");
      if (!await page.evaluate(() => document.documentElement.classList.contains("dark") && document.documentElement.dataset.saasAdminBrand === "blue-ink")) throw new Error("Document theme not applied");
      await input.fill("");
    });
    await check("user mutation survives brand and mode changes", async () => {
      const row = page.locator('tbody tr').filter({ has: page.getByRole("button", { name: "Delete user", exact: true }) }).first();
      const selected = await row.locator('a[href*="/apps/users/view?user="]').first().getAttribute("href");
      if (!selected) throw new Error("No row-specific user link");
      await row.getByRole("button", { name: "Delete user", exact: true }).click();
      const dialog = page.getByRole("alertdialog");
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
      await dialog.waitFor({ state: "hidden" });
      if (!await page.locator(`tbody a[href="${selected}"]`).count()) throw new Error("Cancel deleted the user");
      await row.getByRole("button", { name: "Delete user", exact: true }).click();
      await dialog.getByRole("button", { name: "Delete", exact: true }).click();
      await dialog.waitFor({ state: "hidden" });
      await appearance("Default"); await appearance("Light");
      if (await page.locator(`tbody a[href="${selected}"]`).count()) throw new Error("Deleted user reappeared after theme change");
      await appearance("Blue Ink"); await appearance("Dark");
      if (await page.locator(`tbody a[href="${selected}"]`).count()) throw new Error("Deleted user reappeared after second theme change");
    });
    await check("URL history and document preferences refresh", async () => {
      await page.locator('a[href^="/apps/users/view?user="]').first().click();
      await page.waitForURL("**/apps/users/view?user=*");
      await page.goBack(); await page.waitForURL("**/apps/users/list");
      await page.reload();
      await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").brand === "blue-ink");
      if ((await state()).mode !== "dark") throw new Error("Mode preference not restored");
    });
    await check("system follows browser preference without route reset", async () => {
      await appearance("System");
      await page.emulateMedia({ colorScheme: "dark" });
      await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
      await page.emulateMedia({ colorScheme: "light" });
      await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
      if ((await state()).pathname !== "/apps/users/list") throw new Error("System theme changed route");
    });
    await route("/pages/user-settings");
    const panel = page.getByRole("dialog", { name: "Theme Customizer", exact: true });
    async function configure(group: string, value: string) {
      await panel.getByRole("group", { name: group, exact: true }).getByRole("button", { name: value, exact: true }).click();
    }
    await check("installed customizer preserves settings draft", async () => {
      await page.getByPlaceholder("John", { exact: true }).fill("Consumer appearance draft");
      await page.getByRole("button", { name: "Theme Customizer", exact: true }).click();
      await configure("Sidebar", "Floating");
      await configure("Layout", "Compact");
      await configure("Content Layout", "Full");
      await configure("Scale", "LG");
      if (await page.locator('[data-slot="sidebar"]').getAttribute("data-variant") !== "floating" || await page.locator('[data-slot="sidebar"]').getAttribute("data-collapsible") !== "icon") throw new Error("Installed sidebar configuration not applied");
      if (await page.locator("#saas-admin-content").evaluate(element => getComputedStyle(element).maxWidth) !== "none") throw new Error("Content width not applied");
      if (await page.getByPlaceholder("John", { exact: true }).inputValue() !== "Consumer appearance draft") throw new Error("Appearance changed settings draft");
      await page.getByRole("button", { name: "Reset appearance", exact: true }).click();
      if (await page.getByPlaceholder("John", { exact: true }).inputValue() !== "Consumer appearance draft") throw new Error("Reset lost settings draft");
    });
    await check("installed appearance persists across refresh", async () => {
      await configure("Sidebar", "Inset");
      await configure("Layout", "Full layout");
      await page.reload();
      await page.waitForFunction(() => document.querySelector('[data-slot="sidebar"]')?.getAttribute("data-variant") === "inset" && document.querySelector('[data-slot="sidebar"]')?.getAttribute("data-collapsible") === "offcanvas");
      await page.getByRole("button", { name: "Theme Customizer", exact: true }).click();
      await page.getByRole("button", { name: "Reset appearance", exact: true }).click();
      await page.keyboard.press("Escape");
      await panel.waitFor({ state: "hidden" });
    });
    await route("/dashboard/orders");
    await check("order deletion failure stays in dialog and retries", async () => {
      const row = page.locator("tbody tr").first();
      const customer = await row.locator("td").first().locator(".text-muted-foreground").last().innerText();
      await row.getByRole("button", { name: "Edit item", exact: true }).click();
      await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
      const dialog = page.getByRole("alertdialog");
      await dialog.getByRole("button", { name: "Delete", exact: true }).click();
      await dialog.getByRole("alert").filter({ hasText: "Independent consumer demo failure" }).waitFor();
      if (!await page.locator("tbody tr").filter({ hasText: customer }).count()) throw new Error("Failed deletion removed the record");
      await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").action.status === "error");
      await dialog.getByRole("button", { name: "Delete", exact: true }).click();
      await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").action.attempt >= 2);
      await dialog.waitFor({ state: "hidden" });
      if (await page.locator("tbody tr").filter({ hasText: customer }).count()) throw new Error("Successful retry retained the record");
    });
    await route("/pages/auth/login");
    await check("async submit failure retains inputs and retries", async () => {
      await page.locator('input[type="email"]').fill("fail@example.com");
      await page.locator('input[name="password"]').fill("demo-password");
      await page.locator('button[type="submit"]').click();
      await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").action.status === "error");
      await page.getByRole("alert").filter({ hasText: "Independent consumer demo failure" }).waitFor();
      if (await page.locator('input[type="email"]').inputValue() !== "fail@example.com") throw new Error("Failure lost input");
      await page.locator('input[type="email"]').fill("success@example.com");
      await page.locator('button[type="submit"]').click();
      await page.waitForFunction(() => JSON.parse(document.querySelector('[data-testid="consumer-state"]')?.textContent ?? "{}").action.status === "success");
      await page.getByRole("status").filter({ hasText: "Action completed." }).waitFor();
    });
    await page.screenshot({ path: join(evidence, `${profile}-login.png`), fullPage: true });
    if (errors.length) throw new Error(`Browser errors: ${errors.join(" | ")}`);
  } catch (error) {
    console.error(`${profile}: browser check failed`, error);
    console.error("Consumer state", await state());
    console.error("Open dialogs", await page.getByRole("alertdialog").allTextContents());
    throw error;
  } finally {
    await page.screenshot({ path: join(evidence, `${profile}-last-page.png`), fullPage: true }).catch(() => {});
    await writeFile(join(evidence, `${profile}-browser.json`), JSON.stringify({ browserVersion: browser.version(), executablePath, checks, errors, warnings, networkFailures }, null, 2));
    await Promise.race([browser.close(), Bun.sleep(5_000)]);
  }
}
