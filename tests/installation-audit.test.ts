import { afterEach, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { buildCatalog } from "@/lib/catalog";
import { auditProject } from "../cli/src/audit";

const fixtures: string[] = [];
afterEach(() => { for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true }); });

test("audit falls back when the consumer TypeScript module exposes no compiler API", async () => {
  const catalog = await buildCatalog();
  const fixture = mkdtempSync(resolve(tmpdir(), "uilab-compiler-api-audit-"));
  fixtures.push(fixture);
  writeFileSync(resolve(fixture, "ui-lab.config.json"), JSON.stringify({ schemaVersion: 1, profile: "vite-app", system: "graphite", components: ["button-base"], mode: "adopt" }));
  writeFileSync(resolve(fixture, "package.json"), JSON.stringify({ dependencies: { react: "19.2.0", tailwindcss: "4.1.18", typescript: "5.9.3", vite: "7.1.0" } }));
  writeFileSync(resolve(fixture, "components.json"), JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } }));
  const compiler = resolve(fixture, "node_modules/typescript");
  mkdirSync(compiler, { recursive: true });
  writeFileSync(resolve(compiler, "package.json"), JSON.stringify({ name: "typescript", main: "index.cjs" }));
  writeFileSync(resolve(compiler, "index.cjs"), 'module.exports = { version: "7.0.2" };\n');
  const family = resolve(fixture, "src/components/motion/button");
  mkdirSync(family, { recursive: true });
  writeFileSync(resolve(family, "base.tsx"), 'import { helper } from "./helper"; export const Button = helper;\n');
  const incomplete = auditProject(catalog, fixture);
  expect(incomplete.ok).toBe(false);
  expect(incomplete.findings.some((finding) => finding.code === "component-installation-incomplete" && finding.message.includes("./helper"))).toBe(true);
  writeFileSync(resolve(family, "helper.ts"), "export const helper = 1;\n");
  expect(auditProject(catalog, fixture).ok).toBe(true);
});

test("audit catches missing shared dependencies for an individually added variant", async () => {
  const catalog = await buildCatalog();
  const item = catalog.find((item) => item.kind === "component" && item.slug === "button-base");
  if (!item) throw new Error("button-base missing");
  const fixture = mkdtempSync(resolve(tmpdir(), "uilab-installation-audit-"));
  fixtures.push(fixture);
  writeFileSync(resolve(fixture, "ui-lab.config.json"), JSON.stringify({ schemaVersion: 1, profile: "vite-app", system: "graphite", components: ["button-base"], mode: "adopt" }));
  writeFileSync(resolve(fixture, "package.json"), JSON.stringify({ dependencies: { react: "19.2.0", tailwindcss: "4.1.18", typescript: "5.9.3", vite: "7.1.0" } }));
  writeFileSync(resolve(fixture, "components.json"), JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } }));
  writeFileSync(resolve(fixture, "tsconfig.json"), JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"] }, moduleResolution: "bundler", module: "ESNext", jsx: "react-jsx" } }));
  for (const file of item.installationFiles ?? []) {
    if (file === "lib/ease.ts") continue;
    const path = resolve(fixture, "src", file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, readFileSync(resolve(import.meta.dir, "..", file), "utf8"));
  }
  mkdirSync(resolve(fixture, "lib"));
  writeFileSync(resolve(fixture, "lib/ease.ts"), "export {};\n");
  const result = auditProject(catalog, fixture);
  expect(result.findings.some((finding) => finding.code === "component-installation-incomplete" && finding.message.includes("lib/ease"))).toBe(true);
  writeFileSync(resolve(fixture, "src/lib/ease.ts"), "export {};\n");
  const repaired = auditProject(catalog, fixture);
  expect(repaired.findings.filter((finding) => finding.code === "component-installation-incomplete")).toHaveLength(0);
  expect(repaired.ok).toBe(true);
});

test("audit follows consumer TypeScript suffix resolution and ignores import-looking strings", async () => {
  const catalog = await buildCatalog();
  for (const source of [
    'import { helper } from "./helper.js"; export const Button = helper;',
    'const example = \'import "@/lib/not-a-dependency"\'; export const Button = example;',
  ]) {
    const fixture = mkdtempSync(resolve(tmpdir(), "uilab-ast-audit-"));
    fixtures.push(fixture);
    writeFileSync(resolve(fixture, "ui-lab.config.json"), JSON.stringify({ schemaVersion: 1, profile: "vite-app", system: "graphite", components: ["button-base"], mode: "adopt" }));
    writeFileSync(resolve(fixture, "package.json"), JSON.stringify({ dependencies: { react: "19.2.0", tailwindcss: "4.1.18", typescript: "5.9.3", vite: "7.1.0" } }));
    writeFileSync(resolve(fixture, "components.json"), JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } }));
    writeFileSync(resolve(fixture, "tsconfig.json"), JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"] }, module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx" } }));
    const family = resolve(fixture, "src/components/motion/button");
    mkdirSync(family, { recursive: true });
    writeFileSync(resolve(family, "base.tsx"), source);
    writeFileSync(resolve(family, "helper.ts"), "export const helper = 1;");
    expect(auditProject(catalog, fixture).ok, source).toBe(true);
  }
});
