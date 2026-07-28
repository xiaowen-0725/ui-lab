# ui-lab (CLI)

A zero-dependency command-line interface for UI Lab's AI-first composable
frontend system. Its visible vocabulary remains the asset layer — components,
tokens, icons, styles, palettes, and design systems — while Application Kit
adds project binding, application/page Recipes, and deterministic auditing.
See [APPLICATION_KIT.md](../APPLICATION_KIT.md) for the architecture and scope.

## Install

```sh
npx uilab-cli --help     # run without installing
npm i -g uilab-cli       # or: bun add -g uilab-cli  → then `ui-lab --help`
```

Published on npm as **`uilab-cli`**; the command it installs is `ui-lab`. Zero
runtime dependencies — the compiled `dist/index.js` only uses Node built-ins
(`node:crypto`, `node:fs`, `node:path`, `node:url`, and global `fetch`).

The published package may lag the repository source. Run `ui-lab --help`
before using Application Kit commands or flags. If one is absent, use the
source CLI from this repository or upgrade to a version that advertises it;
never silently downgrade a documented gate.

### Build from source

```sh
## from the UI Lab repository root
bun cli/src/index.ts --help

## or compile the CLI package
cd cli && bun install && bun run build   # compiles src/ -> dist/ via tsc
node dist/index.js --help
```

## Commands

### `list`

List catalog items, grouped by kind (component, atom-set, icon-style,
icon-motion, style, palette, studio-preset, design-system, system-preset, recipe).

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
command; a `recipe` prints its composition contract and `compose` command.
Other kinds follow their Catalog fetch method; use `theme <slug>` for the
Theme Kit token workflow.

```sh
ui-lab show minimal-light
ui-lab show draw --kind icon-motion --json
```

### `add <slug>`

For a `component` item, prints the shadcn install command (rewritten for
your package manager via `--pm`). Never executes anything. If the target
directory has `ui-lab.config.json`, `add` also registers the slug once in its
`components`; without a config it only prints. Use `--dir` to target the actual
React package. For non-component items, use `show` instead.

```sh
ui-lab add tilt-card --pm bun --dir packages/desktop
```

### `theme <slug>`

Show one theme kit (any Catalog item that carries a `themePreview`): its modes (single-mode kits note that they pair with
`graphite` for dual-mode coverage), the shadcn install command (rewritten for
your package manager via `--pm`), and the CSS endpoint for non-shadcn
projects. A `system-preset` card or command exposes only its underlying
ThemeKit tokens; it is not a complete order, Confirmed Manifest, or visual
confirmation.

```sh
ui-lab theme nightflight
ui-lab theme graphite --json
```

### `themes [--picker] [--out <file>]`

With no flags, lists every theme kit (slug, name, modes, kind) in a table.
With `--picker`, generates a self-contained, zero-dependency HTML page —
one card per kit with a mini live-token preview — and writes it to
`ui-lab-theme-picker.html` in the current directory (or the path given via
`--out`). Refuses to overwrite an existing file; pass a different `--out`
path instead. Open the file in any browser — no server or build step needed.

```sh
ui-lab themes
ui-lab themes --picker --out theme-picker.html
```

### `init`

Validate and bind a consumer project to one Stack Profile and System Kit by
creating `ui-lab.config.json`. The allowed profiles are `next-app`, `vite-app`,
and `electron-renderer`; the mode is `adopt` by default or `replace` when
explicitly requested. The System Kit must exist in the Catalog. It does not
rewrite the application. It also writes a deterministic `ui-lab.lock.json`
for the selected System contract.

```sh
ui-lab init --profile electron-renderer --system graphite --mode adopt --dir packages/desktop
```

### `compose <recipe>`

Bind an application/page Recipe, register its required components, and print
the Theme Kit and component plan. The commands are not executed. In `adopt`
mode, review/compare against existing source, install only missing items, and
do not overwrite vendored components. `replace` mode returns the complete
installation plan. Both modes require the configured System Kit in the Catalog.
`compose` and config-aware `add` rewrite the lock to capture the selected
System, Recipe, and Component contracts from the actual Catalog source.

`saas-landing` is a machine-readable section composition contract: each
`sections` entry has a slug, variant, and required flag; Pricing is optional.
It is not vendorable full-page shell source. A complete landing shell is a
future asset.

```sh
ui-lab compose agent-workbench --dir packages/desktop
ui-lab compose saas-landing --dir apps/web --json
```

### `audit`

Run the phase-one hard checks:

- config and Catalog/System/Component/Recipe references;
- Recipe/Profile compatibility and required-component registration;
- vendored source existence for every config Component;
- React 19, Tailwind CSS 4, TypeScript, and the Profile package (`next`,
  `vite`, or `electron`);
- valid `components.json` with non-empty `aliases.components` and
  `aliases.utils`;
- when `ui-lab.lock.json` exists, its schema, Catalog source, selected item set,
  and behavior-contract hashes; invalid or stale locks are warnings;
- every core Workbench file retains `--wb-*`, with a valid `--wb-surface`
  declaration or selected Theme Kit CSS import. Missing protection is an error.

It does not validate strict `tsconfig` (extended configs would cause false
positives), font/asset drift, raw colors, off-scale radius/shadow values,
unguarded motion, or rendered Recipe fidelity.

Ordinary audit exits zero when only warnings remain and prints
`Audit passed with warnings`. Add `--strict` in CI to require the lock and
treat every warning as a failed audit (`ok: false` in JSON and exit code 1).
Old projects without a lock remain warning-free in ordinary mode.

```sh
ui-lab audit --dir packages/desktop
ui-lab audit --dir apps/web --json
ui-lab audit --dir apps/web --strict --json
```

### `ui-lab.lock.json`

The CLI manages this deterministic, explicitly regenerable file through
`init`, `compose`, config-aware `add`, and the safe recovery command:

```sh
ui-lab lock --dir packages/desktop
```

`lock` reads the existing `ui-lab.config.json` and active Catalog source, then
rewrites only `ui-lab.lock.json`. It never changes the config and never
installs anything. Use this command to repair every stale, invalid, or missing
lock warning before rerunning strict audit.

```json
{
  "schemaVersion": 1,
  "catalogSource": "snapshot",
  "items": [
    {
      "kind": "component",
      "slug": "agent-thread",
      "contractHash": "<sha256>",
      "sourceFiles": ["components/motion/agent-thread/index.tsx"]
    }
  ]
}
```

Hashes use stable serialization of behavior-contract fields such as fetch
instructions, registry source files, Theme Kit previews, and Recipe machine
fields. Display names, descriptions, prompts, page URLs, and timestamps are
excluded. Do not edit the lock by hand; regenerate it with `ui-lab lock`.

## Project root and monorepos

The Application Kit root is the actual React frontend package containing its
`package.json`, `components.json`, source tree, and `ui-lab.config.json`. It
does not have to be the repository root. In a monorepo, pass the same package
through every project command:

```sh
ui-lab init --profile electron-renderer --system graphite --mode adopt --dir packages/desktop
ui-lab compose agent-workbench --dir packages/desktop
ui-lab add agent-inbox --dir packages/desktop
ui-lab lock --dir packages/desktop
ui-lab audit --strict --json --dir packages/desktop
```

Do not create `ui-lab.config.json` at a workspace root with no React
dependencies.

## Global flags

| Flag | Meaning |
| --- | --- |
| `--registry <base-url>` | Fetch `<base-url>/catalog.json` instead of the bundled snapshot; do not include `/catalog.json` in the value |
| `--json` | Emit machine-readable JSON on stdout |
| `--kind <kind>` | Filter or disambiguate by kind |
| `--pm <bun\|npm\|pnpm\|yarn>` | Package manager used to rewrite `add`/`theme`'s printed install command |
| `--strict` | For `audit`: require `ui-lab.lock.json` and fail on warnings |
| `-h`, `--help` | Show usage help |
| `-v`, `--version` | Print the CLI version |

Flags are command-aware. Unknown flags and flags that do not apply to the
selected command fail with an `Unknown flag` error.

## Data sources

By default the CLI reads the **bundled snapshot
(`cli/catalog.snapshot.json`)** — generated from the live catalog by
`bun run cli:snapshot` at the repo root and committed so the CLI works
standalone, with no network access required.

To read the live catalog instead, pass the deployment base URL, for example
`--registry https://ui-lab-ten.vercel.app`, or set `UILAB_REGISTRY` to that
same base URL. Do not include `/catalog.json`; the CLI appends it. The CLI tries
that registry first (with a ~3s timeout); on any failure — timeout, network
error, non-2xx response, bad JSON — it prints a one-line warning and
transparently falls back to the bundled snapshot. A registry fetch failure
never crashes the CLI.

## stdout / stderr discipline

All human-readable "which data source am I using" and warning messages are
written to **stderr**. Command output — including everything printed by
`--json` — goes to **stdout** only. That means you can always pipe
`ui-lab ... --json` straight into `jq` or another parser without stripping
anything first.
