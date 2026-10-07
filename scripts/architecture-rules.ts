import { builtinModules } from "node:module";
import ts from "typescript";

const nodeModules = new Set(builtinModules);

export type ModuleReference = { specifier: string; line: number };

/** Portable source references support @/, relative paths and bare packages;
 * absolute paths, URL schemes, import maps and backslash paths are excluded. */
export function isUnsupportedModuleSpecifier(specifier: string): boolean {
  if (!specifier || specifier.startsWith("/") || specifier.includes("\\") || /^[a-z][a-z0-9+.-]*:/i.test(specifier) || specifier.startsWith("#")) return true;
  if (specifier.startsWith("@/") || specifier.startsWith("./") || specifier.startsWith("../")) return false;
  const parts = specifier.split("/");
  return parts.some((part) => !part || part === "." || part === "..")
    || (specifier.startsWith("@") && (parts[0].length === 1 || parts.length < 2));
}

/** Package identity without its subpath; undefined for source paths or
 * unsupported specifiers. Dependencies are compared by exact package root. */
export function externalPackageRoot(specifier: string): string | undefined {
  if (isUnsupportedModuleSpecifier(specifier) || specifier.startsWith("@/") || specifier.startsWith("./") || specifier.startsWith("../")) return undefined;
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function moduleSpecifier(node: ts.Node): string | undefined {
  if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) return node.moduleSpecifier.text;
  if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
    const expression = node.moduleReference.expression;
    if (expression && ts.isStringLiteralLike(expression)) return expression.text;
  }
  if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) return node.argument.literal.text;
  if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
    const argument = node.arguments[0];
    if (argument && ts.isStringLiteralLike(argument)) return argument.text;
  }
  return undefined;
}

function permitsDirectNavigationImport(node: ts.Node) {
  if (!ts.isImportDeclaration(node) || node.importClause?.name) return false;
  const bindings = node.importClause?.namedBindings;
  // notFound and read-only useSearchParams do not navigate or lose locale.
  return bindings && ts.isNamedImports(bindings) && bindings.elements.every(
    (element) => ["notFound", "useSearchParams"].includes((element.propertyName ?? element.name).text),
  );
}

/** Inspect syntax rather than comments or example strings. */
export function inspectModule(file: string, content: string) {
  const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  const references: ModuleReference[] = [];
  const defaultExports: number[] = [];
  const navigationErrors: number[] = [];
  const lineOf = (node: ts.Node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

  function visit(node: ts.Node) {
    const specifier = moduleSpecifier(node);
    if (specifier) {
      references.push({ specifier, line: lineOf(node) });
      if (specifier === "next/navigation" && !permitsDirectNavigationImport(node)) navigationErrors.push(lineOf(node));
    }
    if (ts.isExportAssignment(node) || (ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) || (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause) && node.exportClause.elements.some((element) => element.name.text === "default"))) {
      defaultExports.push(lineOf(node));
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return { references, defaultExports, navigationErrors };
}

export function isSiteFile(file: string) {
  return /^(?:app|i18n|messages)\//.test(file)
    || /^components\/(?:app|previews|examples)\//.test(file)
    || /^lib\/(?:catalog(?:-[\w-]+)?|registry(?:-[\w-]+)?|nav|site|signature|pages|sites|section-assets|recipes|i18n-content)\.[^/]+$/.test(file);
}

export function isServerModule(specifier: string) {
  return /^(?:next|next-intl|electron|bun)(?:\/|$)/.test(specifier)
    || /^(?:node:|bun:)/.test(specifier)
    || specifier === "server-only"
    || nodeModules.has(specifier);
}
