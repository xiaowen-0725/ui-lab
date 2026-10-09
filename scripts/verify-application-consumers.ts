/** Clean, real shadcn -> CLI -> build -> runtime consumers. No root build required. */
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { buildCatalog } from "../lib/catalog";
import { allShadcnTargets, buildShadcnItem, buildThemeItem, buildWorkbenchSystemItem } from "../lib/registry-server";
import { SITE_URL } from "../lib/site";
import { allStandaloneUsages } from "../lib/standalone-usage";
import { selectConsumerUsages } from "./application-consumer-usage";

const root = resolve(import.meta.dir, "..");
const templates = join(root, "benchmarks/runs/catalog-assets");
const evidence = await mkdtemp("/tmp/uilab-catalog-assets-");
const profiles: readonly ("next-app" | "vite-app" | "electron-renderer")[] = ["next-app", "vite-app", "electron-renderer"] as const;
const selected = process.argv.slice(2);
for (const profile of selected) {
  if (!profiles.includes(profile as (typeof profiles)[number])) throw new Error(`Unknown Profile ${profile}`);
}
type Command = { profile: string; command: string; exitCode: number; log: string };
const commands: Command[] = [];
const outcomes: { profile: string; ok: boolean; directory: string; error?: string }[] = [];
const requests: { path: string; status: number }[] = [];
const catalog = await buildCatalog();
await writeFile(join(evidence, "catalog.json"), JSON.stringify(catalog, null, 2));
const targets = allShadcnTargets();
const assets = ["button", "button-base", "saas-landing-page", "workbench-conversation-page", "workbench-artifact-page", "workbench-settings-page", "agent-workbench-site"];
const usages = allStandaloneUsages();
const requiredGraphs = new Map<string, string[]>();
const served = new Map<string, NonNullable<Awaited<ReturnType<typeof buildShadcnItem>>>>();
for (const target of targets) {
  const item = await buildShadcnItem(target.categorySlug, target.slug);
  if (!item) throw new Error(`Missing registry target ${target.slug}`);
  requiredGraphs.set(target.slug, (item.files ?? []).map((file) => file.path));
  // Freeze the actual registry graph for this independent consumer run.
  if (assets.includes(target.slug) || catalog.some((item) => item.kind === "recipe" && item.components?.includes(target.slug))) {
    served.set(target.slug, item);
  }
}
const theme = buildThemeItem("graphite");
if (!theme) throw new Error("Missing Graphite Theme Kit");
served.set("theme-graphite", theme);
served.set("system-workbench", buildWorkbenchSystemItem());
for (const slug of ["theme-graphite", "system-workbench"]) {
  requiredGraphs.set(slug, (served.get(slug)?.files ?? []).map((file) => file.path));
}
await writeFile(join(evidence, "registry.json"), JSON.stringify(Object.fromEntries(served), null, 2));
const server = Bun.serve({
  hostname: "127.0.0.1", port: 0,
  async fetch(request): Promise<Response> {
    const path = new URL(request.url).pathname;
    const slug = path.match(/^\/r\/(.+)\.json$/)?.[1];
    const payload = path === "/catalog.json" ? { name: "uilab", site: SITE_URL, count: catalog.length, items: catalog } : served.get(slug ?? "");
    const status = payload ? 200 : 404;
    requests.push({ path, status });
    return new Response(payload ? JSON.stringify(payload).replaceAll(SITE_URL, server.url.origin) : "Not found", { status, headers: { "content-type": "application/json" } });
  },
});
const origin = server.url.origin;
console.log(`Evidence: ${evidence}; registry: ${origin}`);

async function run(profile: string, cwd: string, args: string[], expected = 0) {
  const log = join(evidence, `${String(commands.length).padStart(3, "0")}-${profile}-${args.includes("audit") ? "audit" : "command"}.log`);
  const child = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe", env: { ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1" } });
  const timeout = setTimeout(() => child.kill(), 600_000);
  const [exitCode, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
  clearTimeout(timeout);
  await writeFile(log, `$ ${args.join(" ")}\nCWD ${cwd}\nEXIT ${exitCode}\n${stdout}\n${stderr}`);
  commands.push({ profile, command: args.join(" "), exitCode, log });
  console.log(`${profile}: exit ${exitCode}: ${args.slice(0, 5).join(" ")} (${log})`);
  if (exitCode !== expected) throw new Error(`Expected exit ${expected}, got ${exitCode}: ${args.join(" ")}\n${stdout.slice(-3000)}\n${stderr.slice(-3000)}`);
  return stdout;
}
async function seed(profile: string, directory: string) {
  await cp(join(templates, profile), directory, { recursive: true, filter: (path) => !/(?:^|\/)(node_modules|\.next|dist|components|lib)(?:\/|$)/.test(path) && !path.endsWith(".tsbuildinfo") });
  await cp(join(templates, "consumer.tsx"), join(directory, "consumer.tsx"));
  await cp(join(templates, "styles.css"), join(directory, profile === "next-app" ? "app/globals.css" : "src/globals.css"));
}
async function copyInstalledUsages(profile: string, directory: string, installedAssets: string[], installedRecipes: string[]) {
  const installedFiles = [...await filesIn(join(directory, "components")), ...await filesIn(join(directory, "lib"))]
    .map((path) => relative(directory, path));
  const selection = selectConsumerUsages(usages, requiredGraphs, installedAssets, installedFiles);
  // Record exclusions even if a selected usage cannot be copied.
  await writeFile(join(evidence, `${profile}-usage-selection.json`), JSON.stringify({ ...selection, installedRecipes }, null, 2));
  const copiedFiles: string[] = [];
  for (const usageFile of new Set(selection.selected.map((usage) => usage.usageFile))) {
    const destination = join(directory, "copied-usage", relative("components/examples", usageFile));
    await mkdir(dirname(destination), { recursive: true });
    await cp(join(root, usageFile), destination);
    copiedFiles.push(destination);
  }
  await writeFile(join(evidence, `${profile}-copied-usage.json`), JSON.stringify(copiedFiles.sort(), null, 2));
  console.log(`${profile}: copied ${copiedFiles.length} usages; excluded ${selection.excluded.length} (see ${profile}-usage-selection.json)`);
}
async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? filesIn(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}
function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
async function closure(directory: string, profile: string) {
  const paths = new Set<string>();
  for (const slug of assets) {
    for (const file of served.get(slug)?.files ?? []) {
      assert(!/^(components\/(app|previews)|app|i18n|messages)\//.test(file.path), `${slug}: site file in required closure ${file.path}`);
      const actual = join(directory, file.path);
      const content = await readFile(actual, "utf8");
      assert(!/(?:from\s*|import\s*)["'](?:next(?:\/|["'])|next-intl|@\/(?:app|i18n|messages|components\/app)\/)/.test(content), `${slug}: site coupling ${file.path}`);
      paths.add(file.path);
    }
  }
  const installed = [...await filesIn(join(directory, "components")), ...await filesIn(join(directory, "lib"))];
  await writeFile(join(evidence, `${profile}-installed-files.json`), JSON.stringify({ required: [...paths].sort(), written: await Promise.all(installed.map(async (path) => ({ path: path.slice(directory.length + 1), sha256: hash(await readFile(path, "utf8")) }))) }, null, 2));
  assert(paths.has("components/motion/button/index.tsx") && paths.has("components/motion/button/base.tsx"), "Parent/base paths not preserved");
}
async function waitFor(url: string, child: ReturnType<typeof Bun.spawn>) {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (child.exitCode !== null) throw new Error(`Runtime exited early (${child.exitCode})`);
    try { if ((await fetch(url)).ok) return; } catch { /* Still starting. */ }
    await Bun.sleep(100);
  }
  throw new Error(`Runtime readiness timeout: ${url}`);
}
try {
  await run("tooling", templates, ["bun", "install", ...(await Bun.file(join(templates, "bun.lock")).exists() ? ["--frozen-lockfile"] : [])]);
  const shadcn = join(templates, "node_modules/shadcn/dist/index.js");
  await run("tooling", templates, ["node", shadcn, "--version"]);
  await run("tooling", root, ["bun", "cli/src/index.ts", "--help"]);
  // Reuse installed Chromium/Chrome. browser.mjs records the actual runtime version.
  for (const profile of profiles.filter((item) => selected.length === 0 || selected.includes(item))) {
    const directory = join(evidence, profile);
    let runtime: ReturnType<typeof Bun.spawn> | undefined;
    try {
      await seed(profile, directory);
      const installArgs = ["bun", "install", ...(await Bun.file(join(directory, "bun.lock")).exists() ? ["--frozen-lockfile"] : [])];
      await run(profile, directory, installArgs);
      const cli = (args: string[], expected = 0) => run(profile, root, ["bun", "cli/src/index.ts", ...args, "--dir", directory, "--registry", origin], expected);
      await cli(["init", "--profile", profile, "--system", "graphite", "--json"]);
      const composition = JSON.parse(await cli(["compose", "agent-workbench", "--json"]));
      const recipeAssets = composition.config.components as string[];
      const install = (slugs: string[]) => run(profile, directory, ["node", shadcn, "add", ...slugs.map((slug) => `${origin}/r/${slug}.json`), "--yes", "--overwrite", "--cwd", directory]);
      await install(["theme-graphite"]);
      const cssPath = join(directory, profile === "next-app" ? "app/globals.css" : "src/globals.css");
      const themed = await readFile(cssPath, "utf8");
      await install(["button-base"]);
      assert(!await Bun.file(join(directory, "components/motion/button/index.tsx")).exists(), "Narrow base install unexpectedly wrote parent index");
      const installedAssets = [...new Set([...assets, ...recipeAssets])];
      await install(installedAssets);
      assert(hash(await readFile(cssPath, "utf8")) === hash(themed), "Indirect system dependency changed explicit Graphite theme");
      await install(["system-workbench"]);
      assert(hash(await readFile(cssPath, "utf8")) === hash(themed), "Repeat system install changed Graphite theme");
      await closure(directory, profile);
      await copyInstalledUsages(profile, directory, [...installedAssets, "theme-graphite", "system-workbench"], [composition.config.recipe]);
      for (const slug of assets) await cli(["add", slug]);
      await cli(["lock", "--json"]);
      await cli(["audit", "--json", "--strict"]);
      // Negative consumer source regression; restore only our temporary installed helper.
      const helper = join(directory, "lib/utils.ts");
      await rename(helper, `${helper}.missing`);
      try {
        const negative = JSON.parse(await cli(["audit", "--json", "--strict"], 1));
        assert(!negative.ok && negative.findings.some((finding: { code: string }) => /missing|incomplete/.test(finding.code)), "Missing helper was not detected");
      } finally { await rename(`${helper}.missing`, helper); }
      await cli(["audit", "--json", "--strict"]);
      await run(profile, directory, ["bun", "run", "typecheck"]);
      await run(profile, directory, ["bun", "run", "build"]);
      // Lock template dependencies only after shadcn resolved the actual external closure.
      await cp(join(directory, "bun.lock"), join(templates, profile, "bun.lock"));
      await cp(join(directory, "package.json"), join(templates, profile, "package.json"));
      if (profile === "electron-renderer") {
        await run(profile, templates, ["node", "browser.mjs", profile, directory, evidence]);
      } else {
        const port = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response() });
        const number = port.port;
        port.stop();
        const args = ["bun", "run", "start", "--port", String(number)];
        const stream = Bun.file(join(evidence, `${profile}-runtime.log`));
        runtime = Bun.spawn(args, { cwd: directory, stdout: stream, stderr: stream, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
        const url = `http://127.0.0.1:${number}`;
        await waitFor(url, runtime);
        await run(profile, templates, ["node", "browser.mjs", profile, directory, evidence, url]);
      }
      outcomes.push({ profile, ok: true, directory });
    } catch (error) {
      outcomes.push({ profile, ok: false, directory, error: String(error) });
      console.error(`${profile} FAILED: ${String(error)}`);
    } finally {
      if (runtime) { runtime.kill(); await runtime.exited; }
    }
  }
} finally {
  server.stop();
  await writeFile(join(evidence, "commands.json"), JSON.stringify(commands, null, 2));
  await writeFile(join(evidence, "requests.json"), JSON.stringify(requests, null, 2));
  await writeFile(join(evidence, "results.json"), JSON.stringify(outcomes, null, 2));
  const report = `\n## Run ${new Date().toISOString()}\n\nEvidence root: \`${evidence}\`. Registry: \`${origin}\`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.\n\n| Profile | Result | Evidence/package |\n| --- | --- | --- |\n${outcomes.map((outcome) => `| ${outcome.profile} | ${outcome.ok ? "PASS engineering/runtime" : "FAIL"} | ${outcome.directory} |`).join("\n")}\n\n${outcomes.filter((outcome) => !outcome.ok).map((outcome) => `Failure ${outcome.profile}:\n\n\`\`\`text\n${outcome.error}\n\`\`\`\n`).join("\n")}\nCommands and exit codes: [commands.json](${evidence}/commands.json). HTTP requests: [requests.json](${evidence}/requests.json). Registry graphs: [registry.json](${evidence}/registry.json). Screenshots, assertions and runtime errors: \`<Profile>-browser.json\`, \`<Profile>-*.png\`, and command/runtime logs in the same evidence root.\n\n| Profile | Command | Exit | Log |\n| --- | --- | --- | --- |\n${commands.map((command) => `| ${command.profile} | \`${command.command}\` | ${command.exitCode} | ${command.log} |`).join("\n")}\n`;
  // Allow isolated runs to retain their report without editing shared history.
  const acceptance = process.env.UILAB_CONSUMER_REPORT ?? join(templates, "ACCEPTANCE.md");
  const previous = await Bun.file(acceptance).exists() ? await readFile(acceptance, "utf8") : "# Plan 005 independent consumer acceptance\n\nRun from repository root: `bun scripts/verify-application-consumers.ts` (optional Profile arguments). Each run creates fresh packages in /tmp. Templates are independent packages; shadcn 4.21.1 writes all registry implementation files. Graphite is installed by its real theme registry item. Local unpublished CLI uses one --dir throughout init/compose/add/lock/audit. Browser checks are engineering evidence, not user visual approval. No commit/push/publish.\n\nMissing-helper audit: failure must be exit 1, restored helper audit must be exit 0. Each run remains below to retain failure/fix/retest history.\n";
  await writeFile(acceptance, previous + report);
}
process.exitCode = outcomes.length === 0 || outcomes.some((outcome) => !outcome.ok) ? 1 : 0;
console.log(`Final evidence: ${evidence}; ${JSON.stringify(outcomes)}`);
