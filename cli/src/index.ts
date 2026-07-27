#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditProject } from "./audit.js";
import { type CatalogItem, loadCatalog } from "./catalog-source.js";
import { renderPickerHtml } from "./picker.js";
import {
  APPLICATION_MODES,
  APPLICATION_PROFILES,
  PROJECT_CONFIG_NAME,
  type ApplicationMode,
  type ApplicationProfile,
  type ProjectConfig,
  readProjectConfig,
  writeProjectConfig,
} from "./project-config.js";

const KIND_ORDER = [
  "component",
  "atom-set",
  "icon-style",
  "icon-motion",
  "style",
  "palette",
  "studio-preset",
  "design-system",
  "recipe",
] as const;

interface Flags {
  kind?: string;
  json?: boolean;
  registry?: string;
  pm?: string;
  help?: boolean;
  version?: boolean;
  [key: string]: string | boolean | undefined;
}

interface ParsedArgv {
  command: string | undefined;
  positionals: string[];
  flags: Flags;
}

const BOOLEAN_FLAGS = new Set(["json", "help", "version", "picker", "force"]);

function parseArgv(argv: string[]): ParsedArgv {
  const positionals: string[] = [];
  const flags: Flags = {};
  let command: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];

    if (token === "-h") {
      flags.help = true;
      continue;
    }
    if (token === "-v") {
      flags.version = true;
      continue;
    }

    if (token.startsWith("--")) {
      const eqIndex = token.indexOf("=");
      if (eqIndex !== -1) {
        const name = token.slice(2, eqIndex);
        const value = token.slice(eqIndex + 1);
        flags[name] = BOOLEAN_FLAGS.has(name)
          ? booleanFlag(name, value)
          : value;
        continue;
      }

      const name = token.slice(2);
      if (BOOLEAN_FLAGS.has(name)) {
        const next = argv[i + 1];
        if (name === "force" && next !== undefined && !next.startsWith("-")) {
          flags[name] = next;
          i++;
        } else {
          flags[name] = true;
        }
        continue;
      }

      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("-")) {
        flags[name] = next;
        i++;
      } else {
        flags[name] = true;
      }
      continue;
    }

    if (command === undefined) {
      command = token;
    } else {
      positionals.push(token);
    }
  }

  return { command, positionals, flags };
}

function stringFlag(value: string | boolean | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function booleanFlag(
  name: string,
  value: string | boolean | undefined,
): boolean {
  if (value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  console.error(`Invalid boolean for "--${name}": "${value}". Expected true or false.`);
  process.exit(1);
}

function truncate(text: string, max = 60): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

function findMatches(
  items: CatalogItem[],
  slug: string,
  kind: string | undefined,
): CatalogItem[] {
  const slugLower = slug.toLowerCase();
  return items.filter((item) => {
    if (item.slug.toLowerCase() !== slugLower) return false;
    if (kind && item.kind !== kind) return false;
    return true;
  });
}

function reportAmbiguous(slug: string, matches: CatalogItem[]): never {
  const kinds = matches.map((item) => item.kind).join(", ");
  console.error(
    `Multiple items share the slug "${slug}" across kinds: ${kinds}. Disambiguate with --kind <kind>.`,
  );
  process.exit(1);
}

function reportNotFound(slug: string): never {
  console.error(`No item found for slug "${slug}".`);
  process.exit(1);
}

// --- theme kits (design-system + studio-preset items carrying themePreview) -

function themeItems(items: CatalogItem[]): CatalogItem[] {
  return items.filter((item) => item.themePreview);
}

function findThemeMatches(
  items: CatalogItem[],
  slug: string,
  kind: string | undefined,
): CatalogItem[] {
  const slugLower = slug.toLowerCase();
  return themeItems(items).filter((item) => {
    if (item.slug.toLowerCase() !== slugLower) return false;
    if (kind && item.kind !== kind) return false;
    return true;
  });
}

function modesLabel(item: CatalogItem): string {
  const modes = item.themePreview?.modes ?? [];
  if (modes.length > 1) return `dual-mode (${modes.join(" + ")})`;
  const mode = modes[0] ?? "unknown";
  return `single-mode (${mode}) — pair with graphite for dual`;
}

// --- list ---------------------------------------------------------------

function cmdList(items: CatalogItem[], flags: Flags): void {
  const kind = stringFlag(flags.kind);
  const filtered = kind ? items.filter((item) => item.kind === kind) : items;

  if (flags.json) {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }

  for (const group of KIND_ORDER) {
    const groupItems = filtered.filter((item) => item.kind === group);
    if (groupItems.length === 0) continue;
    console.log(`${group} (${groupItems.length})`);
    for (const item of groupItems) {
      console.log(`  ${item.slug}  ${item.name} — ${truncate(item.description)}`);
    }
  }
}

// --- search ---------------------------------------------------------------

function scoreItem(item: CatalogItem, query: string): number {
  const q = query.toLowerCase();
  let score = 0;

  const slug = item.slug.toLowerCase();
  const name = item.name.toLowerCase();
  const nameZh = item.nameZh.toLowerCase();

  if (slug === q) {
    score += 100;
  } else if (slug.includes(q)) {
    score += 60;
  }

  if (name === q || nameZh === q) {
    score += 100;
  } else if (name.includes(q) || nameZh.includes(q)) {
    score += 60;
  }

  const aliasMatch = item.aliases.some((alias) => {
    const a = alias.toLowerCase();
    return a === q || a.includes(q);
  });
  if (aliasMatch) score += 40;

  const description = item.description.toLowerCase();
  const descriptionZh = item.descriptionZh.toLowerCase();
  if (description.includes(q) || descriptionZh.includes(q)) score += 30;

  const prompt = item.prompt?.toLowerCase();
  const promptZh = item.promptZh?.toLowerCase();
  if ((prompt && prompt.includes(q)) || (promptZh && promptZh.includes(q))) score += 20;

  return score;
}

function cmdSearch(items: CatalogItem[], query: string | undefined, flags: Flags): void {
  if (!query) {
    console.error("Usage: ui-lab search <query> [--json]");
    process.exit(1);
  }

  const scored = items
    .map((item, index) => ({ item, score: scoreItem(item, query), index }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const results = scored.map((entry) => entry.item);

  if (flags.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  for (const item of results) {
    console.log(`${item.slug}  ${item.name}  (${item.kind})`);
  }
}

// --- show ---------------------------------------------------------------

function cmdShow(items: CatalogItem[], slug: string | undefined, flags: Flags): void {
  if (!slug) {
    console.error("Usage: ui-lab show <slug> [--kind <kind>] [--json]");
    process.exit(1);
  }

  const kind = stringFlag(flags.kind);
  const matches = findMatches(items, slug, kind);

  if (matches.length === 0) reportNotFound(slug);
  if (matches.length > 1) reportAmbiguous(slug, matches);

  const item = matches[0];

  if (flags.json) {
    console.log(JSON.stringify(item, null, 2));
    return;
  }

  if (item.kind === "recipe") {
    console.log(`${item.name} (${item.nameZh})`);
    console.log(item.kind);
    console.log(item.description);
    console.log(item.pageUrl);
    console.log("");
    console.log("Compose:");
    console.log(`  ui-lab compose ${item.slug}`);
    console.log(`Profiles: ${item.profiles?.join(", ") ?? "(none)"}`);
    console.log(`Recommended system: ${item.recommendedSystem ?? "(none)"}`);
    console.log(`Entry component: ${item.entryComponent ?? "(none)"}`);
    printRecipeList("Required components", item.components);
    printRecipeList("Optional components", item.optionalComponents);
    printRecipeList(
      "Slots",
      item.slots?.map(
        (slot) => `${slot.name}${slot.required ? " (required)" : " (optional)"} — ${slot.description}`,
      ),
    );
    printRecipeList(
      "States",
      item.states?.map((state) => `${state.name} — ${state.description}`),
    );
    printRecipeList(
      "Responsive",
      item.responsive?.map((rule) => `${rule.viewport} — ${rule.behavior}`),
    );
    printRecipeList(
      "Assets",
      item.assets?.map(
        (asset) =>
          `${asset.kind}${asset.required ? " (required)" : " (optional)"} — ${asset.requirement}`,
      ),
    );
    printRecipeList(
      "Sections",
      item.sections?.map(
        (section) =>
          `${section.slug}/${section.variant} (${section.required ? "required" : "optional"})`,
      ),
    );
    printRecipeList("Required", item.required);
    printRecipeList("Forbidden", item.forbidden);
    return;
  }

  console.log(item.name);
  console.log(item.kind);
  console.log(item.description);
  console.log(item.pageUrl);
  if (item.prompt) {
    console.log(item.prompt);
  }
  console.log("How to fetch:");
  if (item.fetch.method === "shadcn") {
    console.log(item.fetch.command ?? "");
  } else if (item.fetch.method === "endpoint") {
    console.log(item.fetch.endpoint ?? "");
  } else {
    console.log("copy the block below:");
    console.log(item.fetch.value ?? "");
  }
}

function printRecipeList(label: string, values: readonly string[] | undefined): void {
  console.log(`${label}:`);
  if (!values || values.length === 0) {
    console.log("  (none)");
    return;
  }
  for (const value of values) console.log(`  - ${value}`);
}

// --- add ------------------------------------------------------------------

function rewritePmCommand(command: string, pm: string | undefined): string {
  switch (pm) {
    case "bun":
      return command.replace(/^npx shadcn@latest/, "bunx --bun shadcn@latest");
    case "pnpm":
      return command.replace(/^npx shadcn@latest/, "pnpm dlx shadcn@latest");
    case "yarn":
      return command.replace(/^npx shadcn@latest/, "yarn dlx shadcn@latest");
    default:
      return command;
  }
}

function cmdAdd(items: CatalogItem[], slug: string | undefined, flags: Flags): void {
  if (!slug) {
    console.error(
      "Usage: ui-lab add <slug> [--pm bun|npm|pnpm|yarn] [--dir <path>]",
    );
    process.exit(1);
  }

  const kind = stringFlag(flags.kind);
  const matches = findMatches(items, slug, kind);

  if (matches.length === 0) reportNotFound(slug);
  if (matches.length > 1) reportAmbiguous(slug, matches);

  const item = matches[0];

  if (item.kind !== "component") {
    console.log(
      `This is a ${item.kind}, not a component. Use \`ui-lab show ${slug}\` to get its prompt/tokens instead.`,
    );
    return;
  }

  const directory = resolve(process.cwd(), stringFlag(flags.dir) ?? ".");
  const configPath = resolve(directory, PROJECT_CONFIG_NAME);
  if (existsSync(configPath)) {
    let config: ProjectConfig;
    try {
      ({ config } = readProjectConfig(directory));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    writeProjectConfig(configPath, {
      ...config,
      components: [...new Set([...config.components, item.slug])],
    });
    console.error(`Registered "${item.slug}" in ${configPath}.`);
  }

  const pm = stringFlag(flags.pm);
  console.error("Copy and run this yourself — this command is not executed automatically.");
  console.log(rewritePmCommand(item.fetch.command ?? "", pm));
}

// --- theme / themes ---------------------------------------------------------

function suggestThemeSlugs(items: CatalogItem[], slug: string, limit = 5): string[] {
  const scored = themeItems(items)
    .map((item) => ({ item, score: scoreItem(item, slug) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item.slug);
}

function reportThemeNotFound(items: CatalogItem[], slug: string): never {
  const suggestions = suggestThemeSlugs(items, slug);
  if (suggestions.length > 0) {
    console.error(
      `No theme kit found for slug "${slug}". Did you mean: ${suggestions.join(", ")}? Run \`ui-lab themes\` to list all kits.`,
    );
  } else {
    console.error(`No theme kit found for slug "${slug}". Run \`ui-lab themes\` to list all kits.`);
  }
  process.exit(1);
}

function cmdTheme(items: CatalogItem[], slug: string | undefined, flags: Flags): void {
  if (!slug) {
    console.error(
      "Usage: ui-lab theme <slug> [--kind design-system|studio-preset] [--pm bun|npm|pnpm|yarn] [--json]",
    );
    process.exit(1);
  }

  const kind = stringFlag(flags.kind);
  const matches = findThemeMatches(items, slug, kind);

  if (matches.length === 0) reportThemeNotFound(items, slug);
  if (matches.length > 1) reportAmbiguous(slug, matches);

  const item = matches[0];

  if (flags.json) {
    console.log(JSON.stringify(item, null, 2));
    return;
  }

  const pm = stringFlag(flags.pm);
  const command = rewritePmCommand(item.fetch.command ?? "", pm);
  const endpoint = item.fetch.endpoint ?? "";

  console.log(`${item.name} (${item.nameZh})`);
  console.log(item.kind);
  console.log(modesLabel(item));
  console.log("");
  console.log("shadcn install:");
  console.log(`  ${command}`);
  console.log("");
  console.log(`CSS endpoint: ${endpoint}`);
  console.log(`Not using shadcn? curl ${endpoint} >> app/globals.css`);
}

function writePickerFile(themes: CatalogItem[], outFlag: string | undefined): void {
  const fileName = outFlag ?? "ui-lab-theme-picker.html";
  const outPath = resolve(process.cwd(), fileName);

  if (existsSync(outPath)) {
    console.error(
      `Refusing to overwrite existing file: ${outPath}. Pass --out <file> to pick a different path.`,
    );
    process.exit(1);
  }

  const html = renderPickerHtml(themes);
  writeFileSync(outPath, html, "utf8");
  console.error(`Wrote ${themes.length} theme kits to ${outPath}`);
  console.error(`open ${outPath}`);
}

function cmdThemes(items: CatalogItem[], flags: Flags): void {
  const themes = themeItems(items);

  if (flags.picker) {
    writePickerFile(themes, stringFlag(flags.out));
    return;
  }

  if (flags.json) {
    console.log(JSON.stringify(themes, null, 2));
    return;
  }

  for (const item of themes) {
    const slug = item.slug.padEnd(16);
    const name = `${item.name} (${item.nameZh})`.padEnd(28);
    const modes = modesLabel(item).padEnd(42);
    console.log(`${slug} ${name} ${modes} [${item.kind}]`);
  }
}

// --- application kit -------------------------------------------------------

function cmdInit(items: CatalogItem[], flags: Flags): void {
  const profile = stringFlag(flags.profile);
  const system = stringFlag(flags.system);
  const mode = stringFlag(flags.mode) ?? "adopt";
  const force = booleanFlag("force", flags.force);

  if (!profile || !system) {
    console.error(
      "Usage: ui-lab init --profile <next-app|vite-app|electron-renderer> --system <slug> [--mode adopt|replace] [--dir <path>] [--force] [--json]",
    );
    process.exit(1);
  }
  if (!APPLICATION_PROFILES.includes(profile as ApplicationProfile)) {
    console.error(
      `Invalid profile "${profile}". Expected one of: ${APPLICATION_PROFILES.join(", ")}.`,
    );
    process.exit(1);
  }
  if (!APPLICATION_MODES.includes(mode as ApplicationMode)) {
    console.error(`Invalid mode "${mode}". Expected one of: ${APPLICATION_MODES.join(", ")}.`);
    process.exit(1);
  }
  if (!themeItems(items).some((item) => item.slug === system)) {
    reportThemeNotFound(items, system);
  }

  const directory = resolve(process.cwd(), stringFlag(flags.dir) ?? ".");
  const configPath = resolve(directory, PROJECT_CONFIG_NAME);
  const configExists = existsSync(configPath);
  if (configExists && !force) {
    console.error(`Refusing to overwrite existing file: ${configPath}. Pass --force to replace it.`);
    process.exit(1);
  }

  const config: ProjectConfig = {
    schemaVersion: 1,
    profile: profile as ApplicationProfile,
    system,
    components: [],
    mode: mode as ApplicationMode,
  };
  writeProjectConfig(configPath, config);

  const result = {
    ok: true,
    action: configExists ? "replaced" : "created",
    configPath,
    config,
    nextSteps: [
      `ui-lab compose <recipe> --dir ${directory}`,
      `ui-lab audit --dir ${directory}`,
    ],
  };

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`${configExists ? "Replaced" : "Created"} ${configPath}`);
  console.log("Next:");
  for (const step of result.nextSteps) console.log(`  ${step}`);
}

function cmdCompose(items: CatalogItem[], recipeSlug: string | undefined, flags: Flags): void {
  if (!recipeSlug) {
    console.error("Usage: ui-lab compose <recipe> [--dir <path>] [--json]");
    process.exit(1);
  }

  const recipe = items.find((item) => item.kind === "recipe" && item.slug === recipeSlug);
  if (!recipe) {
    console.error(
      `No recipe found for slug "${recipeSlug}". Run \`ui-lab list --kind recipe\` to list recipes.`,
    );
    process.exit(1);
  }

  const directory = resolve(process.cwd(), stringFlag(flags.dir) ?? ".");
  let configPath: string;
  let config: ProjectConfig;
  try {
    ({ configPath, config } = readProjectConfig(directory));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!recipe.profiles?.includes(config.profile)) {
    console.error(
      `Recipe "${recipeSlug}" does not support profile "${config.profile}". Supported profiles: ${recipe.profiles?.join(", ") ?? "none"}.`,
    );
    process.exit(1);
  }

  const theme = themeItems(items).find((item) => item.slug === config.system);
  if (!theme) {
    console.error(`Configured system "${config.system}" does not exist in the catalog.`);
    process.exit(1);
  }
  const strategy =
    config.mode === "adopt" ? "review-before-install" : "install";
  const planAction = config.mode === "adopt" ? "compare" : "install";

  const componentSlugs = recipe.components ?? [];
  const componentPlan = componentSlugs.map((slug) => {
    const item = items.find((candidate) => candidate.kind === "component" && candidate.slug === slug);
    if (!item) {
      console.error(`Recipe "${recipeSlug}" references missing component "${slug}".`);
      process.exit(1);
    }
    return {
      slug,
      action: planAction,
      command: item.fetch.command ?? "",
      pageUrl: item.pageUrl,
    };
  });
  const optionalComponentPlan = (recipe.optionalComponents ?? []).map((slug) => {
    const item = items.find((candidate) => candidate.kind === "component" && candidate.slug === slug);
    if (!item) {
      console.error(`Recipe "${recipeSlug}" references missing optional component "${slug}".`);
      process.exit(1);
    }
    return {
      slug,
      action: planAction,
      command: item.fetch.command ?? "",
      pageUrl: item.pageUrl,
    };
  });

  const updatedConfig: ProjectConfig = {
    ...config,
    recipe: recipeSlug,
    components: [...new Set([...config.components, ...componentSlugs])],
  };
  writeProjectConfig(configPath, updatedConfig);

  const result = {
    ok: true,
    recipe: recipeSlug,
    config: updatedConfig,
    plan: {
      strategy,
      theme: {
        slug: theme.slug,
        action: planAction,
        command: theme.fetch.command ?? "",
        pageUrl: theme.pageUrl,
      },
      components: componentPlan,
      optionalComponents: optionalComponentPlan,
    },
  };

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Composed ${recipe.name} into ${configPath}`);
  console.log(
    config.mode === "adopt"
      ? "Review-before-install plan (compare before running; commands were not executed):"
      : "Install plan (commands were not executed):",
  );
  console.log(`  ${result.plan.theme.command}`);
  for (const component of result.plan.components) {
    console.log(`  ${component.command}`);
  }
  if (result.plan.optionalComponents.length > 0) {
    console.log("Optional:");
    for (const component of result.plan.optionalComponents) {
      console.log(`  ${component.command}`);
    }
  }
}

function cmdAudit(items: CatalogItem[], flags: Flags): void {
  const directory = resolve(process.cwd(), stringFlag(flags.dir) ?? ".");
  const result = auditProject(items, directory);

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    for (const finding of result.findings) {
      const location = finding.path ? ` (${finding.path})` : "";
      console.log(`${finding.severity.toUpperCase()} ${finding.code}: ${finding.message}${location}`);
    }
    console.log(
      `Audit ${result.ok ? "passed" : "failed"}: ${result.summary.errors} error(s), ${result.summary.warnings} warning(s).`,
    );
  }

  if (!result.ok) process.exitCode = 1;
}

// --- help / version ---------------------------------------------------------

const HELP_TEXT = `ui-lab — compose, discover, and audit coherent React frontends

Usage:
  ui-lab <command> [args] [flags]

Commands:
  list [--kind <kind>] [--json]         List catalog items, grouped by kind
  search <query> [--json]               Rank items matching a query
  show <slug> [--kind <kind>] [--json]  Show one item's detail + how to fetch it
  add <slug> [--pm <pm>] [--dir <path>] Print the command and register it when config exists
  theme <slug> [--pm <pm>] [--json]     Show one theme kit: modes, shadcn install command,
                                         and CSS endpoint (design-system/studio-preset only)
  themes [--picker] [--out <file>]      List every theme kit, or with --picker generate a
                                         self-contained HTML picker page you can open in a
                                         browser (writes ./ui-lab-theme-picker.html unless
                                         --out names a different path)
  init --profile <profile> --system <slug>
                                         Bind a project to a profile and Theme Kit
  compose <recipe> [--dir <path>]        Bind a recipe and print its install plan
  audit [--dir <path>] [--json]          Check the project binding and golden-path contracts

Global flags:
  --registry <base-url>
                     Fetch <base-url>/catalog.json instead of the bundled snapshot
                     (also settable via UILAB_REGISTRY; do not include /catalog.json)
  --json              Emit machine-readable JSON on stdout
  --kind <kind>       Filter/disambiguate by kind: component, atom-set, icon-style,
                      icon-motion, style, palette, studio-preset, design-system, recipe
  --pm <pm>           Package manager used to rewrite \`add\`/\`theme\`'s printed install command
  -h, --help          Show this help
  -v, --version       Print the CLI version

Examples:
  ui-lab list --kind component
  ui-lab search "icon motion"
  ui-lab show minimal-light --json
  ui-lab add tilt-card --pm bun
  ui-lab theme nightflight
  ui-lab themes
  ui-lab themes --picker --out theme-picker.html
  ui-lab init --profile electron-renderer --system graphite
  ui-lab compose agent-workbench
  ui-lab audit --json

Data sources:
  By default ui-lab reads from a snapshot bundled at build time (cli/catalog.snapshot.json)
  for fast, offline use. Pass --registry <url> or set UILAB_REGISTRY to fetch a live
  deployment's /catalog.json instead; if that fetch fails for any reason, ui-lab falls
  back to the bundled snapshot. Source-selection messages always print to stderr, so
  stdout stays clean for --json output.
`;

function printHelp(): void {
  console.log(HELP_TEXT);
}

function readVersion(): string {
  const url = new URL("../package.json", import.meta.url);
  const pkg = JSON.parse(readFileSync(url, "utf8"));
  return pkg.version;
}

function printVersion(): void {
  console.log(readVersion());
}

// --- main ---------------------------------------------------------------

async function main(): Promise<void> {
  const { command, positionals, flags } = parseArgv(process.argv.slice(2));

  if (flags.version) {
    printVersion();
    return;
  }

  if (flags.help || !command) {
    printHelp();
    return;
  }

  const registry = stringFlag(flags.registry);
  const { items } = await loadCatalog({ registry });

  switch (command) {
    case "list":
      cmdList(items, flags);
      break;
    case "search":
      cmdSearch(items, positionals[0], flags);
      break;
    case "show":
      cmdShow(items, positionals[0], flags);
      break;
    case "add":
      cmdAdd(items, positionals[0], flags);
      break;
    case "theme":
      cmdTheme(items, positionals[0], flags);
      break;
    case "themes":
      cmdThemes(items, flags);
      break;
    case "init":
      cmdInit(items, flags);
      break;
    case "compose":
      cmdCompose(items, positionals[0], flags);
      break;
    case "audit":
      cmdAudit(items, flags);
      break;
    default:
      console.error(`Unknown command: "${command}". Run \`ui-lab --help\` for usage.`);
      process.exit(1);
  }
}

main();
