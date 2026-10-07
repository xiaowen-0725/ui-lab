import { expect, test } from "bun:test";
import { externalPackageRoot, inspectModule, isServerModule, isSiteFile, isUnsupportedModuleSpecifier } from "../scripts/architecture-rules";

test("portable boundaries recognize static, re-export and literal dynamic dependencies", () => {
  const source = `
    // import fake from "next/link";
    const example = 'import fake from "next/link"';
    import type { Props } from "./types";
    export { Widget } from "@/components/app/widget";
    const lazy = import("next-intl");
    const common = require("node:fs");
    import legacy = require("electron");
  `;
  expect(inspectModule("widget.tsx", source).references.map((reference) => reference.specifier)).toEqual(["./types", "@/components/app/widget", "next-intl", "node:fs", "electron"]);
  for (const file of ["app/page.tsx", "components/app/widget.tsx", "components/previews/widget.tsx", "i18n/navigation.ts", "lib/catalog.ts", "lib/registry-server.ts"]) expect(isSiteFile(file)).toBe(true);
  for (const file of ["lib/ease.ts", "lib/hooks/use-hover-capable.ts", "components/pages/settings.tsx"]) expect(isSiteFile(file)).toBe(false);
  for (const specifier of ["next/image", "next-intl", "electron", "node:fs", "bun:test", "server-only"]) expect(isServerModule(specifier)).toBe(true);
  expect(isServerModule("motion/react")).toBe(false);
});

test("localized navigation rejects aliases and namespace imports but permits read-only queries", () => {
  expect(inspectModule("site.tsx", 'import { useRouter as router } from "next/navigation";').navigationErrors).toEqual([1]);
  expect(inspectModule("site.tsx", 'import * as navigation from "next/navigation";').navigationErrors).toEqual([1]);
  for (const source of ['import navigation, { notFound } from "next/navigation";', 'export { useRouter } from "next/navigation";', 'const navigation = import("next/navigation");']) expect(inspectModule("site.tsx", source).navigationErrors).toEqual([1]);
  expect(inspectModule("site.tsx", 'import { notFound, useSearchParams as query } from "next/navigation";').navigationErrors).toEqual([]);
});

test("portable default exports cannot hide behind re-exports", () => {
  for (const source of ["export default function Widget() {}", "export default Widget;", 'export { Widget as default } from "./widget";']) expect(inspectModule("widget.tsx", source).defaultExports).toEqual([1]);
  expect(inspectModule("widget.tsx", 'export { default as Widget } from "./widget";').defaultExports).toEqual([]);
});

test("portable module specifiers exclude absolute paths, URLs and unsupported aliases", () => {
  for (const specifier of ["/Users/example/project/widget", "//host/share/widget", "C:/workspace/widget", "C:\\workspace\\widget", "C:widget", "\\\\host\\share\\widget", "file:///tmp/widget.tsx", "https://example.com/widget.js", "data:text/javascript,export{}", "#local-alias", "react/../../another-package", "@scope", "@scope//package", ""]) {
    expect(isUnsupportedModuleSpecifier(specifier)).toBe(true);
    expect(externalPackageRoot(specifier)).toBeUndefined();
  }
  for (const specifier of ["@/components/motion/widget", "./widget", "../widget", "react", "react/jsx-runtime", "react-dom/client", "motion/react", "@tanstack/react-virtual", "@scope/package/subpath"]) expect(isUnsupportedModuleSpecifier(specifier)).toBe(false);
});

test("external package identities keep scoped roots and exact React baseline names", () => {
  for (const [specifier, packageName] of [["react/jsx-runtime", "react"], ["react-dom/client", "react-dom"], ["react-dom-extra/client", "react-dom-extra"], ["motion/react", "motion"], ["next-themes", "next-themes"], ["@scope/package/subpath", "@scope/package"]]) expect(externalPackageRoot(specifier)).toBe(packageName);
  for (const specifier of ["@/components/widget", "./widget", "../widget"]) expect(externalPackageRoot(specifier)).toBeUndefined();
});

test("import-type dependencies receive the same boundary checks as value imports", () => {
  const references = inspectModule("usage.tsx", 'type Props = import("next-themes").ThemeProviderProps; type Helper = import("/tmp/other-install/helper").Helper;').references;
  expect(references.map((reference) => reference.specifier)).toEqual(["next-themes", "/tmp/other-install/helper"]);
  expect(references.map((reference) => reference.line)).toEqual([1, 1]);
});
