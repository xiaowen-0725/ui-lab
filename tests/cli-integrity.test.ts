import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import type { CatalogItem } from "../cli/src/catalog-source";
import { catalogContractHash, type ProjectLock } from "../cli/src/project-lock";

const root = resolve(import.meta.dir, "..");
const projects: string[] = [];
const servers: ReturnType<typeof createServer>[] = [];

function project(): string {
  const directory = mkdtempSync(resolve(tmpdir(), "ui-lab-cli-integrity-"));
  projects.push(directory);
  return directory;
}

function item(kind: CatalogItem["kind"], slug: string): CatalogItem {
  return {
    kind, slug, category: "fixture", name: slug, nameZh: slug,
    aliases: [], description: "Fixture", descriptionZh: "测试夹具",
    pageUrl: `https://fixture.example/${slug}`,
    fetch: kind === "component"
      ? { method: "shadcn", command: `npx shadcn@latest add https://fixture.example/r/${slug}.json` }
      : { method: "endpoint", endpoint: `https://fixture.example/${slug}.json` },
  };
}

function catalog(): CatalogItem[] {
  return [
    { ...item("design-system", "fixture-theme"), themePreview: { modes: ["light", "dark"], light: { background: "white" }, dark: { background: "black" } } },
    { ...item("component", "first"), sourceFile: "components/first.tsx", sourceFiles: ["components/first.tsx", "components/helper.tsx"] },
    { ...item("component", "second"), sourceFile: "components/second.tsx", sourceFiles: ["components/second.tsx"] },
    { ...item("recipe", "fixture-recipe"), profiles: ["vite-app"], recommendedSystem: "fixture-theme", entryComponent: "first", components: ["first", "second"], optionalComponents: [] },
  ];
}

type FixtureResponse = { status?: number; body: string };
function json(body: unknown): FixtureResponse {
  return { body: JSON.stringify(body) };
}

async function registry(items = catalog()) {
  const state = { items, response: undefined as (() => FixtureResponse | Promise<FixtureResponse>) | undefined };
  const server = createServer(async (request, response) => {
    const result = request.url !== "/catalog.json"
      ? { status: 404, body: "missing" }
      : await (state.response?.() ?? json({ count: state.items.length, items: state.items }));
    response.writeHead(result.status ?? 200, { "content-type": "application/json" });
    response.end(result.body);
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  servers.push(server);
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Fixture server did not bind");
  return { state, url: `http://127.0.0.1:${address.port}` };
}

async function cli(args: string[], registryUrl?: string, envRegistry?: string) {
  const child = Bun.spawn({
    cmd: [process.execPath, "cli/src/index.ts", ...args, ...(registryUrl === undefined ? [] : ["--registry", registryUrl])],
    cwd: root, env: { ...process.env, UILAB_REGISTRY: envRegistry ?? "" }, stdout: "pipe", stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited,
  ]);
  return { stdout, stderr, exitCode };
}

function files(directory: string) {
  return ["ui-lab.config.json", "ui-lab.lock.json"].map((name) => {
    const path = resolve(directory, name);
    return existsSync(path) ? readFileSync(path, "utf8") : undefined;
  });
}

function lock(directory: string): ProjectLock {
  return JSON.parse(readFileSync(resolve(directory, "ui-lab.lock.json"), "utf8"));
}

async function initialize(directory: string, url: string) {
  const result = await cli(["init", "--profile", "vite-app", "--system", "fixture-theme", "--dir", directory], url);
  expect(result.exitCode).toBe(0);
}

afterEach(() => {
  for (const server of servers.splice(0)) { server.closeAllConnections(); server.close(); }
  for (const directory of projects.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe("CLI CatalogLock baseline integrity (R6)", () => {
  test("legacy v1 lock and optional sourceFiles remain compatible without implicit repair", async () => {
    const directory = project();
    const { state, url } = await registry();
    delete state.items[1].sourceFiles;
    await initialize(directory, url);
    expect((await cli(["add", "first", "--dir", directory], url)).exitCode).toBe(0);
    const oldLock = lock(directory);
    expect(oldLock.items.every((entry) => entry.catalogSource === undefined)).toBe(true);
    const first = oldLock.items.find((entry) => entry.slug === "first");
    expect(first).not.toHaveProperty("sourceFiles");
    state.items[1].sourceFiles = ["components/first.tsx"];
    expect((await cli(["add", "second", "--dir", directory], url)).exitCode).toBe(0);
    expect(lock(directory).items.find((entry) => entry.slug === "first")).toEqual(first);
    expect((await cli(["lock", "--dir", directory], url)).exitCode).toBe(0);
    expect(lock(directory).items.find((entry) => entry.slug === "first")?.sourceFiles).toEqual(["components/first.tsx"]);
  });

  test("mandatory installation graph affects hashes and never replaces the owned family", async () => {
    const directory = project();
    const { state, url } = await registry();
    state.items[1].assetRole = "component";
    state.items[1].installTargets = ["first"];
    state.items[1].installationFiles = [...(state.items[1].sourceFiles ?? []), "lib/shared.ts"];
    await initialize(directory, url);
    expect((await cli(["add", "first", "--dir", directory], url)).exitCode).toBe(0);
    const first = lock(directory).items.find((entry) => entry.slug === "first");
    expect(first?.sourceFiles).toEqual([...(state.items[1].sourceFiles ?? [])]);
    expect(first?.sourceFiles).not.toContain("lib/shared.ts");
    state.items[1].installationFiles = [...state.items[1].installationFiles, "lib/new-shared.ts"];
    expect(catalogContractHash(state.items[1])).not.toBe(first?.contractHash);
    expect((await cli(["add", "second", "--dir", directory], url)).exitCode).toBe(0);
    expect(lock(directory).items.find((entry) => entry.slug === "first")).toEqual(first);
    const audited = await cli(["audit", "--dir", directory, "--json"], url);
    expect(JSON.parse(audited.stdout).findings.map((finding: { code: string }) => finding.code)).toContain("lock-contract-stale");
  });

  test("add and compose preserve old hashes/families; only explicit lock rebases", async () => {
    const directory = project();
    const { state, url } = await registry();
    await initialize(directory, url);
    expect((await cli(["add", "first", "--dir", directory], url)).exitCode).toBe(0);
    const baseline = lock(directory);
    state.items[0].themePreview = { modes: ["light", "dark"], light: { background: "red" }, dark: { background: "blue" } };
    state.items[1].sourceFiles = ["components/first.tsx", "components/new-helper.tsx"];
    state.items[1].fetch.command += " --changed";
    expect((await cli(["add", "second", "--dir", directory], url)).exitCode).toBe(0);
    for (const old of baseline.items) expect(lock(directory).items.find((entry) => entry.kind === old.kind && entry.slug === old.slug)).toEqual(old);
    const beforeRepeat = files(directory);
    expect((await cli(["add", "first", "--dir", directory], url)).exitCode).toBe(0);
    expect(files(directory)).toEqual(beforeRepeat);
    expect((await cli(["compose", "fixture-recipe", "--dir", directory], url)).exitCode).toBe(0);
    const composedBaseline = lock(directory);
    state.items[3].components = ["first"];
    state.items[3].required = ["Changed upstream contract"];
    expect((await cli(["compose", "fixture-recipe", "--dir", directory], url)).exitCode).toBe(0);
    expect(lock(directory)).toEqual(composedBaseline);
    const audit = await cli(["audit", "--dir", directory, "--json"], url);
    const codes = JSON.parse(audit.stdout).findings.map((finding: { code: string }) => finding.code);
    expect(codes).toContain("lock-contract-stale");
    expect(codes).toContain("lock-source-files-stale");
    const configText = files(directory)[0];
    expect((await cli(["lock", "--dir", directory, "--json"], url)).exitCode).toBe(0);
    expect(files(directory)[0]).toBe(configText);
    expect(lock(directory).items.find((entry) => entry.slug === "first")?.sourceFiles).toEqual([...(state.items[1].sourceFiles ?? [])]);
    expect(lock(directory)).not.toEqual(composedBaseline);
    const rebuilt = files(directory);
    expect((await cli(["lock", "--dir", directory], url)).exitCode).toBe(0);
    expect(files(directory)).toEqual(rebuilt);
  });

  test("mixed catalog sources preserve provenance of old and new entries", async () => {
    const directory = project();
    const first = await registry();
    const second = await registry();
    await initialize(directory, first.url);
    expect((await cli(["add", "first", "--dir", directory], first.url)).exitCode).toBe(0);
    const baseline = lock(directory);
    second.state.items[1].sourceFiles = ["components/first.tsx"];
    expect((await cli(["compose", "fixture-recipe", "--dir", directory], second.url)).exitCode).toBe(0);
    const mixed = lock(directory);
    expect(mixed.catalogSource).toBe(`registry:${first.url}`);
    for (const old of baseline.items) expect(mixed.items.find((entry) => entry.kind === old.kind && entry.slug === old.slug)).toEqual(old);
    expect(mixed.items.find((entry) => entry.slug === "second")).toHaveProperty("catalogSource", `registry:${second.url}`);
    const audit = await cli(["audit", "--dir", directory, "--json"], second.url);
    expect(JSON.parse(audit.stdout).findings.filter((finding: { code: string }) => finding.code === "lock-catalog-source-stale")).toHaveLength(2);
    expect((await cli(["lock", "--dir", directory], second.url)).exitCode).toBe(0);
    expect(lock(directory).catalogSource).toBe(`registry:${second.url}`);
  });

  test("invalid existing lock blocks config mutations; explicit lock can repair it", async () => {
    const directory = project();
    const { url } = await registry();
    await initialize(directory, url);
    writeFileSync(resolve(directory, "ui-lab.lock.json"), "{broken");
    const before = files(directory);
    for (const args of [["add", "first"], ["compose", "fixture-recipe"]]) {
      expect((await cli([...args, "--dir", directory], url)).exitCode).toBe(1);
      expect(files(directory)).toEqual(before);
    }
    expect((await cli(["lock", "--dir", directory], url)).exitCode).toBe(0);
  });
});

describe("CLI explicit Catalog source failure isolation (R7)", () => {
  test("connection failures and invalid explicit URLs do not write snapshot selections", async () => {
    const directory = project();
    expect((await cli(["init", "--profile", "vite-app", "--system", "graphite", "--dir", directory])).exitCode).toBe(0);
    const before = files(directory);
    const { url } = await registry();
    const stopped = servers.pop();
    if (!stopped) throw new Error("Missing fixture server");
    await new Promise<void>((done) => stopped.close(() => done()));
    for (const badSource of [url, "file:///tmp/catalog", `${url}/catalog.json`, ""]) {
      for (const args of [["init", "--profile", "vite-app", "--system", "graphite", "--force"], ["add", "button"], ["compose", "agent-workbench"], ["lock"]]) {
        const result = await cli([...args, "--dir", directory], badSource);
        expect(result.exitCode).toBe(1);
        expect(result.stderr).not.toContain("Using bundled snapshot");
        expect(files(directory)).toEqual(before);
      }
    }
  });

  test("new vocabulary/reference kinds and provenance survive live CLI discovery", async () => {
    const entries = catalog();
    const reference = {
      ...item("reference", "external"),
      reference: { url: "https://fixture.example/official", rightsStatus: "external-only", documentLicense: "MIT", provenance: [{ url: "https://fixture.example/source", kind: "upstream-document" }], reviewedAt: "2026-10-03" },
    };
    entries.push(reference, { ...item("vocabulary", "word"), related: [{ kind: "component", slug: "first" }, { kind: "reference", slug: "external" }] });
    const { url } = await registry(entries);
    const shown = await cli(["show", "external", "--json"], url);
    expect(shown.exitCode).toBe(0);
    expect(JSON.parse(shown.stdout)).toEqual(reference);
    const word = await cli(["search", "word", "--json"], url);
    expect(JSON.parse(word.stdout)[0].related).toHaveLength(2);
    expect(word.stderr).toContain("Using live registry");
  });

  test("missing configured items block add/compose/lock before any file mutation", async () => {
    const directory = project();
    const { state, url } = await registry();
    await initialize(directory, url);
    expect((await cli(["add", "first", "--dir", directory], url)).exitCode).toBe(0);
    const before = files(directory);
    state.items = catalog().filter((entry) => entry.slug !== "first" && entry.kind !== "recipe");
    state.items.push({ ...item("recipe", "other-recipe"), profiles: ["vite-app"], recommendedSystem: "fixture-theme", entryComponent: "second", components: ["second"] });
    for (const args of [["add", "second"], ["compose", "other-recipe"], ["lock"]]) {
      const result = await cli([...args, "--dir", directory], url);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Configured component "first"');
      expect(files(directory)).toEqual(before);
    }
  });

  test("404, invalid JSON, malformed and incomplete catalogs never mutate write-command files", async () => {
    const directory = project();
    const { state, url } = await registry();
    await initialize(directory, url);
    const before = files(directory);
    const brokenItems = catalog();
    brokenItems[3].components = ["missing"];
    const responses = [
      () => ({ status: 404, body: "missing" }),
      () => ({ body: "{invalid" }),
      () => json({ items: [null] }),
      () => json({ items: brokenItems }),
    ];
    for (const response of responses) {
      state.response = response;
      for (const args of [["init", "--profile", "vite-app", "--system", "fixture-theme", "--force"], ["compose", "fixture-recipe"], ["add", "first"], ["lock"]]) {
        const result = await cli([...args, "--dir", directory], url);
        expect(result.exitCode).toBe(1);
        expect(result.stderr).not.toContain("falling back");
        expect(files(directory)).toEqual(before);
      }
    }
  });

  test("timeout fails all writes without creating files", async () => {
    const directory = project();
    const { state, url } = await registry();
    state.response = () => new Promise<FixtureResponse>(() => {});
    const results = await Promise.all([
      ["init", "--profile", "vite-app", "--system", "fixture-theme"],
      ["compose", "fixture-recipe"], ["add", "first"], ["lock"],
    ].map((args) => cli([...args, "--dir", directory], url)));
    for (const result of results) {
      expect(result.exitCode).toBe(1);
      expect(result.stderr).not.toContain("falling back");
    }
    expect(files(directory)).toEqual([undefined, undefined]);
  }, 10000);

  test("read-only discovery falls back with source on stderr and clean JSON", async () => {
    const { state, url } = await registry();
    state.response = () => ({ status: 503, body: "unavailable" });
    for (const args of [["list", "--json"], ["search", "button", "--json"], ["show", "button", "--json"]]) {
      const result = await cli(args, url);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toContain("falling back");
      expect(result.stderr).toContain("Using bundled snapshot");
      expect(() => JSON.parse(result.stdout)).not.toThrow();
    }
  });

  test("UILAB_REGISTRY is also explicit and cannot silently write snapshot data", async () => {
    const directory = project();
    const { state, url } = await registry();
    state.response = () => ({ status: 404, body: "missing" });
    const result = await cli(["init", "--profile", "vite-app", "--system", "graphite", "--dir", directory], undefined, url);
    expect(result.exitCode).toBe(1);
    expect(files(directory)).toEqual([undefined, undefined]);
  });

  test("duplicate identities, bad fields and broken recipe references are rejected before init", async () => {
    const directory = project();
    const { state, url } = await registry();
    const malformed = [
      { items: [] },
      { count: 99, items: catalog() },
      { items: [...catalog(), catalog()[1]] },
      { items: catalog().map((entry) => entry.slug === "first" ? { ...entry, aliases: [42] } : entry) },
      { items: catalog().map((entry) => entry.slug === "first" ? { ...entry, fetch: { method: "shadcn" } } : entry) },
      { items: catalog().map((entry) => entry.slug === "fixture-theme" ? { ...entry, themePreview: { modes: ["light"], light: [] } } : entry) },
      { items: catalog().map((entry) => entry.kind === "recipe" ? { ...entry, entryComponent: "missing" } : entry) },
      { items: catalog().map((entry) => entry.kind === "recipe" ? { ...entry, optionalComponents: ["missing"] } : entry) },
      { items: catalog().map((entry) => entry.kind === "recipe" ? { ...entry, recommendedSystem: "missing" } : entry) },
      { items: catalog().map((entry) => entry.kind === "recipe" ? { ...entry, sections: [{ slug: "hero", variant: "does-not-exist", required: true }] } : entry) },
      { items: catalog().map((entry) => entry.kind === "recipe" ? { ...entry, slots: [{ name: "body", required: "yes" }] } : entry) },
      { items: catalog().map((entry) => entry.kind === "component" ? { ...entry, installTargets: ["missing"] } : entry) },
      { items: catalog().map((entry) => entry.kind === "component" ? { ...entry, installationFiles: ["../outside.tsx"] } : entry) },
      { items: catalog().map((entry) => entry.kind === "component" ? { ...entry, related: [{ kind: "vocabulary", slug: "missing" }] } : entry) },
      { items: catalog().map((entry) => entry.kind === "component" ? { ...entry, related: ["missing"] } : entry) },
      { items: catalog().map((entry) => entry.kind === "component" ? { ...entry, fetch: { method: "endpoint", endpoint: entry.pageUrl } } : entry) },
      { items: catalog().map((entry) => entry.kind === "component" ? { ...entry, installationFiles: [] } : entry) },
    ];
    for (const body of malformed) {
      state.response = () => json(body);
      const result = await cli(["init", "--profile", "vite-app", "--system", "fixture-theme", "--dir", directory], url);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("Invalid catalog");
      expect(files(directory)).toEqual([undefined, undefined]);
    }
  });
});
