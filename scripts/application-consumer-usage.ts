import type { StandaloneUsage } from "../lib/standalone-usage";

export type ConsumerUsageDecision = StandaloneUsage & {
  requiredGraph: string[];
  reason: "installed-asset" | "installed-graph-subset" | "missing-required-graph" | "outside-installed-graph" | "missing-installed-files";
  missingGraphFiles: string[];
  missingInstalledFiles: string[];
};

/** Registry availability is not installation evidence. Only successful install
 * requests contribute graphs, and their files must also exist in the consumer. */
export function selectConsumerUsages(
  usages: readonly StandaloneUsage[],
  requiredGraphs: ReadonlyMap<string, readonly string[]>,
  installedAssets: readonly string[],
  installedFiles: readonly string[],
) {
  const assets = new Set(installedAssets);
  const installedGraph = new Set<string>();
  for (const slug of assets) {
    const graph = requiredGraphs.get(slug);
    if (!graph) throw new Error(`Missing installed graph: ${slug}`);
    for (const path of graph) installedGraph.add(path);
  }
  const written = new Set(installedFiles);
  const selected: ConsumerUsageDecision[] = [];
  const excluded: ConsumerUsageDecision[] = [];
  for (const usage of usages) {
    const graph = requiredGraphs.get(usage.installSlug);
    const requiredGraph = [...new Set([...(graph ?? []), usage.sourceFile])].sort();
    const missingGraphFiles = requiredGraph.filter((path) => !installedGraph.has(path));
    const missingInstalledFiles = requiredGraph.filter((path) => !written.has(path));
    const reason = !graph?.length ? "missing-required-graph"
      : missingGraphFiles.length ? "outside-installed-graph"
      : missingInstalledFiles.length ? "missing-installed-files"
      : assets.has(usage.installSlug) ? "installed-asset" : "installed-graph-subset";
    const decision: ConsumerUsageDecision = { ...usage, requiredGraph, reason, missingGraphFiles, missingInstalledFiles };
    if (reason === "installed-asset" || reason === "installed-graph-subset") selected.push(decision);
    else excluded.push(decision);
  }
  return { installedAssets: [...assets].sort(), installedGraph: [...installedGraph].sort(), installedFiles: [...written].sort(), selected, excluded };
}
