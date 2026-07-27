---
name: ui-lab
description: |
  任何 React 前端的新建、页面开发、应用级改造或设计系统调整都使用本技能，尤其是 Next.js、Vite、Electron renderer、Tailwind CSS、shadcn、主题、字体、组件、区块和落地页工作。先复用 UI Lab 的 Stack Profile、System Kit、Component、Block 与 Recipe，再写业务内容，避免 AI 从零生成导致技术栈和视觉漂移。触发：/ui-lab、做前端/页面/应用/落地页、找组件/主题/字体/设计系统、接入或改造 React UI、"find a component/theme/recipe"、"build/restyle this frontend"。
  Use for any React frontend creation, page implementation, app-level redesign, or design-system change, including Next.js, Vite, Electron renderers, Tailwind CSS, shadcn, themes, typography, components, blocks, and landing pages. Reuse UI Lab Stack Profiles, System Kits, Components, Blocks, and Recipes before writing business-specific UI so generated work stays technically and visually coherent.
---

# UI Lab — composable frontend system

UI Lab is an AI-first assembly system for React frontends: a Golden Path stack, complete System Kits, vendorable components and blocks, and application/page Recipes. The visual vocabulary remains available for discovery, but the default job is to preserve one design contract across the whole product.

## Non-negotiable workflow

For every frontend task:

1. **Preflight** the project before editing.
2. **Read or establish** `ui-lab.config.json`.
3. **Reuse the deepest fitting asset**: Recipe before Block, Block before Component, Component before hand-written UI.
4. Fill business data, state and content into the provided slots; do not redesign the shell incidentally.
5. Run **`ui-lab audit`**, fix deterministic drift, then inspect the actual UI at relevant viewports and modes.

Never silently switch an existing product from `adopt` to `replace`, collapse a token scale into approximate utilities, or declare completion while audit failures remain.

## 1. Project preflight

Before changing code, inspect:

- the actual React frontend package root; in a monorepo this is usually not the workspace root;
- framework and package manager;
- React, TypeScript, Tailwind and shadcn versions/config;
- global stylesheet, theme provider, semantic tokens and font loading;
- existing component library, page shell, breakpoints and dark mode;
- DOM selectors, test IDs, E2E selectors and other replacement contracts;
- `ui-lab.config.json`, if present.

Use the directory that owns the frontend's React dependencies, `components.json`, source tree, and `ui-lab.config.json` as `<frontend-root>`. Do not create the config at a dependency-free monorepo root. Pass this same root through `--dir` for `init`, `compose`, `add`, and `audit` (for example `--dir packages/desktop`).

Before calling Application Kit commands, run `ui-lab --help` and confirm `init`, `compose`, and `audit` are listed. They and config-aware `add` are currently `[Unreleased]`; an older published npm CLI may not contain them. If unavailable, use `bun cli/src/index.ts <command>` while inside the UI Lab repository, or wait for the new release. Never report an unavailable command as executed.

Use `adopt` for an existing product: preserve its stack and visual facts, then add compatible assets. Use `replace` only for a new project or an explicitly approved redesign: a complete System Kit and Recipe may replace the starting UI.

## 2. Read or create the project contract

If `ui-lab.config.json` exists, treat it as the source of truth. Its contract is:

```json
{
  "schemaVersion": 1,
  "profile": "electron-renderer",
  "system": "graphite",
  "recipe": "agent-workbench",
  "components": ["agent-workbench", "agent-composer"],
  "mode": "adopt"
}
```

Allowed profiles are `next-app`, `vite-app`, and `electron-renderer`; `recipe` is optional; `mode` is `adopt` or `replace`. Do not invent additional fields. When no config exists, initialize it:

```bash
ui-lab init --profile <profile> --system <slug> --mode <adopt|replace> --dir <frontend-root>
```

For a new or wholesale replacement project, choose the System Kit by eye before init: run `ui-lab themes --picker`, open the generated page, and let the user choose. Do not silently default a visual identity.

## 3. Compose before inventing

For an application or page starting point, use a Recipe:

```bash
ui-lab compose agent-workbench --dir <frontend-root>
ui-lab compose saas-landing --dir <frontend-root>
```

`compose` requires the configured System Kit to exist in the Catalog, records the Recipe, and prints a plan; it does not execute commands. Follow the plan's mode:

- `adopt`: review and compare before installing, install only missing items, and never overwrite existing vendored source;
- `replace`: apply the full Theme Kit and required-component install plan.

Treat the Recipe fields as executable instructions:

- install every slug in `components`; add from `optionalComponents` only when the business needs it;
- for a page composition, build `sections` in their declared order and variant, omitting only entries whose `required` is false;
- fill business content through `slots`;
- implement every case in `states`;
- follow `responsive` at the named viewports and collapse points;
- supply or deliberately preserve placeholders for `assets`;
- obey `required` and `forbidden`.

`saas-landing` is a section composition contract, not vendorable full-page shell source. Its `sections` define the page rhythm and make Pricing optional; a complete landing shell is a future asset. Do not tell the user that `compose saas-landing` installed an existing page shell.

Do not infer these contracts from the preview alone. If no Recipe fits, search for a Block; if no Block fits, search for a Component:

```bash
ui-lab search "<need>"
ui-lab show <slug> [--kind <kind>]
ui-lab add <slug> --dir <frontend-root> [--pm bun|npm|pnpm|yarn]
```

`add` prints the install command rather than running it. When `<frontend-root>/ui-lab.config.json` exists, it also registers the slug once in `components`; without a config it only prints. Open `pageUrl` and inspect the live sample before adapting it, then execute the command you chose. `shadcn add` vendors source into the project; it does not add a UI Lab runtime dependency. Use stock shadcn for long-tail primitives such as calendars and breadcrumbs so they inherit the same semantic tokens.

## System Kit and protected contracts

Install a complete Theme Kit before individual components. It supplies shadcn semantic colors, type, spacing, radius, shadows, chart colors, motion and any family-specific token scale in light/dark selectors.

```bash
ui-lab themes --picker
ui-lab themes
ui-lab theme <slug>
```

For shadcn projects, execute the registry command returned by `theme`; for non-shadcn projects, use its CSS endpoint below `@import "tailwindcss"` in the global stylesheet. Single-mode kits pin both selectors to their native mode; use a true dual-mode kit such as Graphite when the product requires light and dark.

For Graphite workbench components, the 42-step `--wb-*` scale is part of their identity. Rebrand by overriding `--wb-*` **values** in globals; never rewrite references such as `bg-[--wb-surface]`, `border-[--wb-hairline]`, and `hover:bg-[--wb-hover]` to coarse `card/border/muted` tokens. That destroys the graded surface hierarchy.

After vendoring, deliberately check:

- shape and size against the target slot;
- localized accessible labels;
- hard-coded status colors against project semantic tokens;
- existing DOM, CSS and E2E selectors before element replacement;
- reduced-motion, hover capability and keyboard behavior.

Do not force-fit. If a primitive's interaction shape conflicts with the slot, keep the bespoke implementation and record why.

Across the product, keep one icon voice, one type pairing and one radius scale; use tokens instead of off-scale magic numbers; reserve the accent for focus, selection and primary actions; preserve reduced-motion fallbacks.

## 4. Audit and visual verification

Run after composition and again before delivery:

```bash
ui-lab audit --dir <frontend-root>
```

Phase 1 audit hard-checks only:

- valid `ui-lab.config.json`;
- Catalog references for the configured System Kit, Components and Recipe;
- Recipe/Profile compatibility and registration of its required `components`;
- React 19, Tailwind CSS 4, and TypeScript declarations;
- the matching Profile dependency: `next`, `vite`, or `electron`;
- parseable `components.json` with non-empty `aliases.components` and `aliases.utils`;
- vendored source existence for every Component in the config;
- every core Workbench file retains `--wb-*`, plus either a valid `--wb-surface` declaration or an import of the selected Theme Kit CSS. Missing Workbench protection is an error.

Fix those findings before claiming completion. Phase 1 does **not** validate strict `tsconfig` (extended configs cause false positives), font/asset drift, raw colors, off-scale radius/shadow values, unguarded motion, or whether the rendered UI fulfills `sections`, `slots`, `states`, `responsive`, `assets`, `required`, and `forbidden`. Check those Recipe fields manually, then inspect representative desktop/mobile widths, light/dark modes, loading/empty/error states, keyboard focus and reduced motion. Audit passing is not proof that the page looks right.

## CLI quick reference

```bash
ui-lab init --profile <next-app|vite-app|electron-renderer> --system <slug> --mode <adopt|replace> --dir <frontend-root>
ui-lab compose <agent-workbench|saas-landing> --dir <frontend-root>
ui-lab add <slug> --dir <frontend-root> [--pm bun|npm|pnpm|yarn]
ui-lab audit --dir <frontend-root>

ui-lab themes [--picker]
ui-lab theme <slug>
ui-lab search <query>
ui-lab show <slug> [--kind <kind>]
ui-lab list [--kind <kind>]
```

Add `--json` for structured output. The npm package is `uilab-cli` and its binary is `ui-lab`, but do not assume the currently published version includes the `[Unreleased]` Application Kit commands; verify with `ui-lab --help` first. The CLI uses a bundled snapshot by default. For a live catalog, pass the deployment **base URL** (for example `--registry https://ui-lab-ten.vercel.app`) or set `UILAB_REGISTRY` to that base URL; the CLI appends `/catalog.json`, so do not include that path yourself.
