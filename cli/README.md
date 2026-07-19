# ui-lab (CLI)

A zero-dependency command-line interface for AI agents and humans to discover
and fetch this project's UI vocabulary — components, atom-set tokens, icon
styles/motions, styles, palettes, and studio presets — directly from the
terminal, without a browser.

## Install

```sh
npx uilab-cli --help     # run without installing
npm i -g uilab-cli       # or: bun add -g uilab-cli  → then `ui-lab --help`
```

Published on npm as **`uilab-cli`**; the command it installs is `ui-lab`. Zero
runtime dependencies — the compiled `dist/index.js` only uses Node built-ins
(`node:fs`, `node:url`, global `fetch`).

### Build from source

```sh
cd cli && bun install && bun run build   # compiles src/ -> dist/ via tsc
node dist/index.js --help
```

## Commands

### `list`

List catalog items, grouped by kind (component, atom-set, icon-style,
icon-motion, style, palette, studio-preset).

```sh
ui-lab list --kind component
ui-lab list --json
```

### `search <query>`

Score and rank items by how well they match a query (slug/name/alias/
description/prompt), case-insensitive.

```sh
ui-lab search "icon motion"
```

### `show <slug>`

Print one item's detail — name, kind, description, page URL, prompt (if
any), and how to fetch it. For a `component`, that's the shadcn install
command; for everything else, it's the raw prompt/token block to copy.

```sh
ui-lab show minimal-light
ui-lab show draw --kind icon-motion --json
```

### `add <slug>`

For a `component` item, prints the shadcn install command (rewritten for
your package manager via `--pm`). Never executes anything — it only prints
the command for you to run yourself. For non-component items, tells you to
use `show` instead.

```sh
ui-lab add tilt-card --pm bun
```

## Global flags

| Flag | Meaning |
| --- | --- |
| `--registry <url>` | Fetch the catalog from a live deployment's `/catalog.json` instead of the bundled snapshot |
| `--json` | Emit machine-readable JSON on stdout |
| `--kind <kind>` | Filter or disambiguate by kind |
| `--pm <bun\|npm\|pnpm\|yarn>` | Package manager used to rewrite `add`'s printed install command |
| `-h`, `--help` | Show usage help |
| `-v`, `--version` | Print the CLI version |

## Data sources

By default the CLI reads the **bundled snapshot
(`cli/catalog.snapshot.json`)** — generated from the live catalog by
`bun run cli:snapshot` at the repo root and committed so the CLI works
standalone, with no network access required.

To read the live catalog instead, pass `--registry https://ui-lab-ten.vercel.app`
or set the `UILAB_REGISTRY` environment variable. The CLI tries that registry
first (with a ~3s timeout); on any failure — timeout, network error, non-2xx
response, bad JSON — it prints a one-line warning and transparently falls back
to the bundled snapshot. A registry fetch failure never crashes the CLI.

## stdout / stderr discipline

All human-readable "which data source am I using" and warning messages are
written to **stderr**. Command output — including everything printed by
`--json` — goes to **stdout** only. That means you can always pipe
`ui-lab ... --json` straight into `jq` or another parser without stripping
anything first.
