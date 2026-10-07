import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");

/** Execute the real gate in a fresh repository scaffold; no product files change. */
type GateOptions = {
  usage?: boolean;
  helper?: boolean;
  variant?: boolean;
  variantUsage?: boolean;
  usageSource?: string;
  dependencies?: string[];
  variantDependencies?: string[];
  usageExceptions?: string[];
  displayedVariant?: { usageSource?: string | null };
};

function runGate(source: string, { usage = true, helper = false, variant = false, variantUsage = false, usageSource = 'import { Widget } from "@/components/motion/widget"; export function Example() { return Widget(); }', dependencies = [], variantDependencies = dependencies, usageExceptions = [], displayedVariant }: GateOptions = {}) {
  const fixture = mkdtempSync(join(tmpdir(), "uilab-architecture-"));
  try {
    for (const directory of ["scripts", "lib", "components/motion", "components/examples", "components/app", "components/previews", "app/[locale]"]) mkdirSync(join(fixture, directory), { recursive: true });
    symlinkSync(join(root, "node_modules"), join(fixture, "node_modules"), "dir");
    for (const file of ["scripts/check-architecture.ts", "scripts/architecture-rules.ts", "lib/source-files.ts"]) copyFileSync(join(root, file), join(fixture, file));
    writeFileSync(join(fixture, "scripts/legacy-asset-exceptions.json"), JSON.stringify({ usageOptional: usageExceptions }));
    const examples = [
      ...(variant ? [{ installSlug: "sample-widget-new", ...(variantUsage ? { usageFile: "components/examples/widget.tsx" } : {}) }] : []),
      ...(displayedVariant ? [{ slug: "alternate", file: "components/motion/alternate.tsx", ...(displayedVariant.usageSource !== null ? { usageFile: "components/examples/alternate.tsx" } : {}) }] : []),
    ];
    const entry = { slug: "sample-widget", category: { slug: "motion" }, nameZh: "示例控件", descriptionZh: "用于测试的新控件", ...(usage ? { usageFile: "components/examples/widget.tsx" } : {}), examples };
    writeFileSync(join(fixture, "lib/registry.ts"), `export function allComponents() { return [${JSON.stringify(entry)}]; }`);
    const files = [{ path: "components/motion/widget.tsx", content: source }, ...(helper ? [{ path: "components/motion/helper.ts", content: 'export { useLocale } from "next-intl";' }] : []), ...(displayedVariant ? [{ path: "components/motion/alternate.tsx", content: 'export function AlternateWidget() { return null; }' }] : [])];
    const targets = [{ slug: "sample-widget", pageSlug: "sample-widget", categorySlug: "motion", file: "components/motion/widget.tsx" }, ...(variant ? [{ slug: "sample-widget-new", pageSlug: "sample-widget", categorySlug: "motion", file: "components/motion/widget.tsx" }] : [])];
    writeFileSync(join(fixture, "lib/registry-server.ts"), `export function allShadcnTargets() { return ${JSON.stringify(targets)}; } export async function buildShadcnItem(category, slug) { return { ...${JSON.stringify({ files })}, dependencies: slug === "sample-widget-new" ? ${JSON.stringify(variantDependencies)} : ${JSON.stringify(dependencies)} }; }`);
    for (const file of files) writeFileSync(join(fixture, file.path), file.content);
    writeFileSync(join(fixture, "components/examples/widget.tsx"), usageSource);
    if (displayedVariant?.usageSource !== null && displayedVariant) writeFileSync(join(fixture, "components/examples/alternate.tsx"), displayedVariant.usageSource ?? 'import { AlternateWidget } from "@/components/motion/alternate"; export function AlternateExample() { return AlternateWidget(); }');
    const result = spawnSync("bun", ["scripts/check-architecture.ts"], { cwd: fixture, encoding: "utf8" });
    if (result.error) throw result.error;
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test("new portable assets pass with standalone usage and fail without it", () => {
  const source = "export function Widget() { return null; }";
  expect(runGate(source).status).toBe(0);
  const missing = runGate(source, { usage: false });
  expect(missing.status).toBe(1);
  expect(missing.output).toContain("new assets require provider-free usageFile");
});

test("a transitive helper cannot bring a site provider into an installable asset", () => {
  const result = runGate('import "./helper"; export function Widget() { return null; }', { helper: true });
  expect(result.status).toBe(1);
  expect(result.output).toContain("helper.ts");
  expect(result.output).toContain("browser asset imports next-intl");
});

test("literal require dependencies absent from distribution fail the gate", () => {
  const result = runGate('const helper = require("./helper"); export function Widget() { return helper; }');
  expect(result.status).toBe(1);
  expect(result.output).toContain("cannot resolve ./helper");
});

test("parents and installable variants must each resolve a standalone usage", () => {
  const source = "export function Widget() { return null; }";
  const missing = runGate(source, { usage: false, variant: true });
  expect(missing.status).toBe(1);
  expect(missing.output).toContain("sample-widget-new: new assets require provider-free usageFile");
  const missingParent = runGate(source, { usage: false, variant: true, variantUsage: true });
  expect(missingParent.status).toBe(1);
  expect(missingParent.output).toContain("sample-widget: new assets require provider-free usageFile");
  expect(missingParent.output).not.toContain("sample-widget-new: new assets require provider-free usageFile");
  expect(runGate(source, { variant: true, variantUsage: true }).status).toBe(0);
});

test("retired standalone usage exceptions cannot be reintroduced", () => {
  for (const slug of ["sample-widget", "another-widget"]) {
    const result = runGate("export function Widget() { return null; }", { usage: false, usageExceptions: [slug] });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Legacy standalone usage exceptions are retired; usageOptional must remain empty");
  }
});

test("absolute source paths and file URLs cannot bypass portable graph checks", () => {
  const source = "export function Widget() { return null; }";
  for (const specifier of [join(root, "components/motion/button/base"), "C:\\workspace\\other-package\\widget", "file:///tmp/other-install/widget.tsx"]) {
    const usageSource = `import { Widget } from "@/components/motion/widget"; import ${JSON.stringify(specifier)}; export function Example() { return Widget(); }`;
    const result = runGate(source, { usageSource });
    expect(result.status).toBe(1);
    expect(result.output).toContain("absolute paths or URLs are not portable imports");
    expect(result.output).toContain(specifier);
  }
  const result = runGate('import "/tmp/other-install/helper"; export function Widget() { return null; }');
  expect(result.status).toBe(1);
  expect(result.output).toContain("absolute paths or URLs are not portable imports");
});

test("usage external package roots must belong to the exact install dependencies", () => {
  const source = "export function Widget() { return null; }";
  for (const [specifier, packageName] of [["next-themes", "next-themes"], ["motion/react", "motion"], ["@tanstack/react-virtual", "@tanstack/react-virtual"], ["react-dom-extra/client", "react-dom-extra"]]) {
    const usageSource = `import { Widget } from "@/components/motion/widget"; import ${JSON.stringify(specifier)}; export function Example() { return Widget(); }`;
    const rejected = runGate(source, { usageSource });
    expect(rejected.status).toBe(1);
    expect(rejected.output).toContain(`${packageName} is not declared in sample-widget installation dependencies`);
    expect(runGate(source, { usageSource, dependencies: [packageName] }).status).toBe(0);
  }
  const usageSource = 'import { Widget } from "@/components/motion/widget"; import "react/jsx-runtime"; import "react-dom/client"; export function Example() { return Widget(); }';
  expect(runGate(source, { usageSource }).status).toBe(0);
});

test("literal dynamic, re-export, require and import-type references cannot borrow external packages", () => {
  const source = "export function Widget() { return null; }";
  for (const reference of ['export { ThemeProvider } from "next-themes";', 'const theme = import("next-themes");', 'const theme = require("next-themes");', 'type Theme = import("next-themes").ThemeProviderProps;']) {
    const result = runGate(source, { usageSource: `import { Widget } from "@/components/motion/widget"; ${reference} export function Example() { return Widget(); }` });
    expect(result.status).toBe(1);
    expect(result.output).toContain("next-themes is not declared in sample-widget installation dependencies");
  }
});

test("an installable variant cannot borrow its parent's external dependency declaration", () => {
  const result = runGate("export function Widget() { return null; }", {
    variant: true,
    variantUsage: true,
    dependencies: ["motion"],
    variantDependencies: [],
    usageSource: 'import { Widget } from "@/components/motion/widget"; import "motion/react"; export function Example() { return Widget(); }',
  });
  expect(result.status).toBe(1);
  expect(result.output).toContain("motion is not declared in sample-widget-new installation dependencies");
  expect(result.output).not.toContain("motion is not declared in sample-widget installation dependencies");
});

test("displayed variants without install slugs use the parent graph and their own entry", () => {
  const source = "export function Widget() { return null; }";
  expect(runGate(source, { displayedVariant: {} }).status).toBe(0);
  const wrongEntry = runGate(source, { displayedVariant: { usageSource: 'import { Widget } from "@/components/motion/widget"; export function AlternateExample() { return Widget(); }' } });
  expect(wrongEntry.status).toBe(1);
  expect(wrongEntry.output).toContain("usage must import the sample-widget installation entry components/motion/alternate.tsx");
  const missing = runGate(source, { displayedVariant: { usageSource: null } });
  expect(missing.status).toBe(1);
  expect(missing.output).toContain("sample-widget/alternate: displayed variants require provider-free usageFile");
});

test("displayed variants without install slugs reject site providers and undeclared packages", () => {
  const source = "export function Widget() { return null; }";
  for (const [reference, error] of [
    ['import "next-intl";', "browser asset imports next-intl"],
    ['import "next-themes";', "next-themes is not declared in sample-widget installation dependencies"],
    ['import "/tmp/other-install/widget";', "absolute paths or URLs are not portable imports"],
  ]) {
    const result = runGate(source, { displayedVariant: { usageSource: `import { AlternateWidget } from "@/components/motion/alternate"; ${reference} export function AlternateExample() { return AlternateWidget(); }` } });
    expect(result.status).toBe(1);
    expect(result.output).toContain("components/examples/alternate.tsx");
    expect(result.output).toContain(error);
  }
  expect(runGate(source, { dependencies: ["next-themes"], displayedVariant: { usageSource: 'import { AlternateWidget } from "@/components/motion/alternate"; import "next-themes"; export function AlternateExample() { return AlternateWidget(); }' } }).status).toBe(0);
});
