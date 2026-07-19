#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { type CatalogItem, loadCatalog } from "./catalog-source.js";

const KIND_ORDER = [
  "component",
  "atom-set",
  "icon-style",
  "icon-motion",
  "style",
  "palette",
  "studio-preset",
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

const BOOLEAN_FLAGS = new Set(["json", "help", "version"]);

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
        flags[name] = value;
        continue;
      }

      const name = token.slice(2);
      if (BOOLEAN_FLAGS.has(name)) {
        flags[name] = true;
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

  console.log(item.name);
  console.log(item.kind);
  console.log(item.description);
  console.log(item.pageUrl);
  if (item.prompt) {
    console.log(item.prompt);
  }
  console.log("How to fetch:");
  if (item.kind === "component") {
    console.log(item.fetch.command ?? "");
  } else {
    console.log("copy the block below:");
    console.log(item.fetch.value ?? "");
  }
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
    console.error("Usage: ui-lab add <slug> [--pm bun|npm|pnpm|yarn]");
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

  const pm = stringFlag(flags.pm);
  console.error("Copy and run this yourself — this command is not executed automatically.");
  console.log(rewritePmCommand(item.fetch.command ?? "", pm));
}

// --- help / version ---------------------------------------------------------

const HELP_TEXT = `ui-lab — discover and fetch this project's UI vocabulary from the terminal

Usage:
  ui-lab <command> [args] [flags]

Commands:
  list [--kind <kind>] [--json]         List catalog items, grouped by kind
  search <query> [--json]               Rank items matching a query
  show <slug> [--kind <kind>] [--json]  Show one item's detail + how to fetch it
  add <slug> [--pm bun|npm|pnpm|yarn]   Print the shadcn install command for a component

Global flags:
  --registry <url>   Fetch the catalog from a live deployment instead of the bundled
                      snapshot (also settable via the UILAB_REGISTRY env var)
  --json              Emit machine-readable JSON on stdout
  --kind <kind>       Filter/disambiguate by kind: component, atom-set, icon-style,
                      icon-motion, style, palette, studio-preset
  --pm <pm>           Package manager used to rewrite \`add\`'s printed install command
  -h, --help          Show this help
  -v, --version       Print the CLI version

Examples:
  ui-lab list --kind component
  ui-lab search "icon motion"
  ui-lab show minimal-light --json
  ui-lab add tilt-card --pm bun

Data sources:
  By default ui-lab reads from a snapshot bundled at build time (cli/catalog.snapshot.json)
  — this project isn't deployed yet, so the snapshot is the default source of truth. Pass
  --registry <url> or set UILAB_REGISTRY to fetch a live deployment's /catalog.json instead;
  if that fetch fails for any reason, ui-lab falls back to the bundled snapshot. Source-
  selection messages always print to stderr, so stdout stays clean for --json output.
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
    default:
      console.error(`Unknown command: "${command}". Run \`ui-lab --help\` for usage.`);
      process.exit(1);
  }
}

main();
