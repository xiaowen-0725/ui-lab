import { allComponents } from "./registry";
import { allShadcnTargets } from "./registry-server";

export type StandaloneUsage = {
  key: string;
  installSlug: string;
  category: string;
  sourceFile: string;
  usageFile: string;
};

/** Each variant is verified against its own installation, including variants
 * displayed under a parent that intentionally have no separate install slug. */
export function allStandaloneUsages(): StandaloneUsage[] {
  const entries = allComponents();
  const targets = allShadcnTargets();
  const usages: StandaloneUsage[] = [];
  for (const target of targets) {
    const entry = entries.find((candidate) => candidate.slug === target.pageSlug && candidate.category.slug === target.categorySlug);
    const variant = entry?.examples?.find((candidate) => candidate.installSlug === target.slug);
    const usageFile = variant?.usageFile ?? entry?.usageFile;
    if (!usageFile) throw new Error(`${target.slug}: missing standalone usage`);
    usages.push({ key: target.slug, installSlug: target.slug, category: target.categorySlug, sourceFile: target.file, usageFile });
  }
  for (const entry of entries) {
    for (const variant of entry.examples ?? []) {
      if (variant.installSlug) continue;
      if (!variant.usageFile) throw new Error(`${entry.slug}/${variant.slug}: missing standalone variant usage`);
      usages.push({ key: `${entry.slug}-${variant.slug}`, installSlug: entry.slug, category: entry.category.slug, sourceFile: variant.file, usageFile: variant.usageFile });
    }
  }
  const keys = new Set<string>();
  for (const usage of usages) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(usage.key) || keys.has(usage.key)) throw new Error(`Invalid or duplicate standalone usage key: ${usage.key}`);
    keys.add(usage.key);
  }
  return usages;
}
