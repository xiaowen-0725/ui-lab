import { allComponents } from "../lib/registry";
import { allShadcnTargets, buildShadcnItem } from "../lib/registry-server";
import { readSourceFile, resolveSourceImport } from "../lib/source-files";
import { externalPackageRoot, inspectModule, isServerModule, isSiteFile, isUnsupportedModuleSpecifier } from "./architecture-rules";
import legacyExceptions from "./legacy-asset-exceptions.json";

const errors = new Set<string>();
const distributed = new Map<string, string>();
const graphs = new Map<string, Set<string>>();
const dependencies = new Map<string, Set<string>>();
const owners = new Map<string, Set<string>>();
const targets = allShadcnTargets();
// Historical migrations are complete; the retained file cannot exempt new work.
if (legacyExceptions.usageOptional.length !== 0) throw new Error("Legacy standalone usage exceptions are retired; usageOptional must remain empty");

for (const target of targets) {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(target.slug)) errors.add(`${target.slug}: install slug must use lower kebab-case`);
  const item = await buildShadcnItem(target.categorySlug, target.slug);
  if (!item?.files?.length) throw new Error(`${target.slug}: missing distribution`);
  graphs.set(target.slug, new Set(item.files.map((file) => file.path)));
  dependencies.set(target.slug, new Set(["react", "react-dom", ...item.dependencies]));
  for (const file of item.files) {
    if (file.content === undefined) throw new Error(`${target.slug}: missing content for ${file.path}`);
    distributed.set(file.path, file.content);
    const slugs = owners.get(file.path) ?? new Set<string>();
    slugs.add(target.slug);
    owners.set(file.path, slugs);
  }
}

async function inspectPortable(file: string, content: string, usageSlug?: string, usageEntryFile?: string) {
  if (!usageSlug && isSiteFile(file)) errors.add(`${file}: site code in portable source graph`);
  if (!/\.[cm]?[jt]sx?$/.test(file)) return;
  const { references, defaultExports } = inspectModule(file, content);
  const entryFile = usageEntryFile ?? (usageSlug ? targets.find((target) => target.slug === usageSlug)?.file : undefined);
  let importsEntry = !usageSlug;
  for (const line of defaultExports) errors.add(`${file}:${line}: portable modules use named exports`);
  for (const { specifier, line } of references) {
    const label = `${file}:${line}`;
    if (isServerModule(specifier)) errors.add(`${label}: browser asset imports ${specifier}`);
    if (isUnsupportedModuleSpecifier(specifier)) {
      errors.add(`${label}: absolute paths or URLs are not portable imports; unsupported specifier ${specifier}`);
      continue;
    }
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const dependency = await resolveSourceImport(specifier, file);
      if (dependency?.path === entryFile) importsEntry = true;
      if (!dependency) errors.add(`${label}: cannot resolve ${specifier}`);
      else if (isSiteFile(dependency.path)) errors.add(`${label}: site dependency ${dependency.path}`);
      else {
        for (const slug of usageSlug ? [usageSlug] : owners.get(file) ?? []) {
          if (!graphs.get(slug)?.has(dependency.path)) errors.add(`${label}: ${dependency.path} is absent from ${slug} distribution`);
        }
      }
    } else if (usageSlug) {
      const packageName = externalPackageRoot(specifier);
      if (packageName && !dependencies.get(usageSlug)?.has(packageName)) errors.add(`${label}: ${packageName} is not declared in ${usageSlug} installation dependencies`);
    }
  }
  if (!importsEntry) errors.add(`${file}: usage must import the ${usageSlug} installation entry ${entryFile}`);
}

for (const [file, content] of distributed) await inspectPortable(file, content);

const entries = allComponents();
for (const entry of entries) {
  if (!entry.nameZh?.trim() || !entry.descriptionZh?.trim()) errors.add(`${entry.slug}: missing Chinese name or description`);
}
for (const target of targets) {
  const entry = entries.find((candidate) => candidate.slug === target.pageSlug && candidate.category.slug === target.categorySlug);
  const example = entry?.examples?.find((candidate) => candidate.installSlug === target.slug);
  const usageFile = example?.usageFile ?? entry?.usageFile;
  if (!usageFile) {
    errors.add(`${target.slug}: new assets require provider-free usageFile`);
    continue;
  }
  await inspectPortable(usageFile, await readSourceFile(usageFile), target.slug);
}
for (const entry of entries) {
  for (const variant of entry.examples ?? []) {
    if (variant.installSlug) continue;
    if (!variant.usageFile) errors.add(`${entry.slug}/${variant.slug}: displayed variants require provider-free usageFile`);
    else await inspectPortable(variant.usageFile, await readSourceFile(variant.usageFile), entry.slug, variant.file);
  }
}

for (const directory of ["app/[locale]", "components/app", "components/previews"]) {
  for await (const file of new Bun.Glob("**/*.{ts,tsx}").scan(directory)) {
    const path = `${directory}/${file}`;
    const { references, navigationErrors } = inspectModule(path, await readSourceFile(path));
    for (const reference of references) {
      if (reference.specifier === "next/link") errors.add(`${path}:${reference.line}: use @/i18n/navigation for localized links`);
    }
    for (const line of navigationErrors) errors.add(`${path}:${line}: use @/i18n/navigation for localized navigation`);
  }
}

if (errors.size) {
  console.error([...errors].join("\n"));
  process.exit(1);
}
console.log(`Architecture: ${targets.length} targets, ${distributed.size} source files; portable imports, named exports, bilingual metadata and localized navigation passed.`);
