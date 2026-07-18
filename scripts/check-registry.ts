import { allComponents } from "../lib/registry";
import { WB_TOKENS_DARK, WB_TOKENS_LIGHT } from "../lib/registry-wb-tokens";
import { allShadcnTargets, buildEntry, buildShadcnItem } from "../lib/registry-server";
import { readSourceFile } from "../lib/source-files";

const errors: string[] = [];
const slugLabels = new Map<string, string[]>();
const installSlugLabels = new Map<string, string[]>();
const validatedWbTokenSlugs = new Set<string>();
const WB_TOKEN_REGISTRY_SLUGS = new Set([
  "agent-thread",
  "agent-composer",
  "agent-workbench",
  "agent-trace",
  "agent-inbox",
  "thread-list",
  "artifact-panel",
]);

function parseWbTokens(css: string, selector: string): Record<string, string> {
  const selectorIndex = css.indexOf(selector);
  const blockStart = css.indexOf("{", selectorIndex);
  const blockEnd = css.indexOf("}", blockStart);
  if (selectorIndex < 0 || blockStart < 0 || blockEnd < 0) {
    throw new Error(`Could not find CSS block for ${selector}`);
  }

  const tokens: Record<string, string> = {};
  const declaration = /--(wb-[\w-]+)\s*:\s*([^;]+);/g;
  for (const match of css.slice(blockStart + 1, blockEnd).matchAll(declaration)) {
    const [, name, value] = match;
    if (name && value) tokens[name] = value.trim();
  }
  return tokens;
}

function validateTokenMap(
  label: string,
  actual: Record<string, string> | undefined,
  expected: Record<string, string>,
) {
  if (!actual || Object.keys(actual).length === 0) {
    errors.push(`${label}: token map is missing or empty`);
    return;
  }

  for (const name of new Set([...Object.keys(actual), ...Object.keys(expected)])) {
    if (!(name in actual)) {
      errors.push(`${label}: missing ${name}`);
    } else if (!(name in expected)) {
      errors.push(`${label}: unexpected ${name}`);
    } else if (actual[name] !== expected[name]) {
      errors.push(`${label}: ${name} expected "${expected[name]}", received "${actual[name]}"`);
    }
  }
}

const globalsCss = await readSourceFile("app/globals.css");
const globalsWbTokensLight = parseWbTokens(globalsCss, ":root,");
const globalsWbTokensDark = parseWbTokens(globalsCss, ".dark {");

validateTokenMap("WB_TOKENS_LIGHT", WB_TOKENS_LIGHT, globalsWbTokensLight);
validateTokenMap("WB_TOKENS_DARK", WB_TOKENS_DARK, globalsWbTokensDark);

for (const component of allComponents()) {
  const label = `${component.category.slug}/${component.slug}`;
  slugLabels.set(component.slug, [...(slugLabels.get(component.slug) ?? []), label]);

  try {
    const entry = await buildEntry(component.category.slug, component.slug);
    if (!entry) {
      errors.push(`${label}: registry entry was not created`);
    } else if (entry.files.length === 0) {
      errors.push(`${label}: registry entry has no files`);
    }
  } catch (error) {
    errors.push(`${label}: ${(error as Error).message}`);
  }

  for (const example of component.examples ?? []) {
    for (const file of [example.file, example.previewFile]) {
      try {
        await readSourceFile(file);
      } catch (error) {
        errors.push(`${label}/${example.slug}: ${(error as Error).message}`);
      }
    }
  }
}

for (const target of allShadcnTargets()) {
  const label = `${target.categorySlug}/${target.slug}`;
  installSlugLabels.set(target.slug, [...(installSlugLabels.get(target.slug) ?? []), label]);

  try {
    const item = await buildShadcnItem(target.categorySlug, target.slug);
    if (!item) {
      errors.push(`${label}: shadcn item was not created`);
    } else if (item.files.length === 0) {
      errors.push(`${label}: shadcn item has no files`);
    } else if (WB_TOKEN_REGISTRY_SLUGS.has(target.slug)) {
      validatedWbTokenSlugs.add(target.slug);
      const registryJson = JSON.parse(JSON.stringify(item)) as typeof item;
      validateTokenMap(`${label}: cssVars.light`, registryJson.cssVars?.light, globalsWbTokensLight);
      validateTokenMap(`${label}: cssVars.dark`, registryJson.cssVars?.dark, globalsWbTokensDark);
    } else if (item.cssVars !== undefined) {
      errors.push(`${label}: unexpected cssVars`);
    }
  } catch (error) {
    errors.push(`${label}: ${(error as Error).message}`);
  }
}

for (const slug of WB_TOKEN_REGISTRY_SLUGS) {
  if (!validatedWbTokenSlugs.has(slug)) {
    errors.push(`Required --wb-* registry item "${slug}" was not validated`);
  }
}

for (const [slug, labels] of slugLabels) {
  if (labels.length > 1) {
    errors.push(`Duplicate component slug "${slug}" used by: ${labels.join(", ")}`);
  }
}

for (const [slug, labels] of installSlugLabels) {
  if (labels.length > 1) {
    errors.push(`Duplicate install slug "${slug}" used by: ${labels.join(", ")}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${allComponents().length} registry components.`);
console.log(
  `Verified ${Object.keys(globalsWbTokensLight).length} light and ${Object.keys(globalsWbTokensDark).length} dark --wb-* tokens on ${validatedWbTokenSlugs.size} registry items.`,
);
