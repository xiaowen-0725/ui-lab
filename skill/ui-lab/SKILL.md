---
name: ui-lab
description: |
  在做前端（React/Next + Tailwind）时，从 UI Lab 这套「看得见的前端视觉词汇表」里复用现成、经过打磨的资产，而不是从零编：动效组件、动效/静态图标、设计 token（圆角/阴影/字体/间距/动效曲线/描边/背景）、配色方案、视觉风格、整套设计系统。用 `ui-lab` CLI 从终端发现并取用。
  触发方式：/ui-lab、「找个组件/图标/配色/风格」「给我一套设计 token / 设计系统」「这个该长什么样」「有没有现成的 X 组件」「hover 动效图标」「换个视觉风格」，或任何在写前端、想照着一个已存在的可视样本来做的时候。
  Use when building or designing a frontend (React/Next + Tailwind) and you want to reuse proven, *visible* assets from UI Lab instead of inventing from scratch — motion components, animated/static icons, design tokens (radius, shadow, type, spacing, motion curves, lines, backgrounds), color palettes, visual styles, or a whole design system. Discover and fetch them from the terminal with `ui-lab`.
  Trigger: /ui-lab, "find a component / icon / palette / style", "give me design tokens / a design system", "how should this look", "is there a ready-made X", "hover-animated icon", "restyle this".
---

# UI Lab — the frontend visual vocabulary

UI Lab is a bilingual catalog of frontend things that are "easy to see, hard to name": you look at a live sample, then take away the exact **source**, **tokens**, or **words** to describe it. Reach for it before hand-rolling a component, an icon interaction, a token scale, a palette, a style, or a design system.

## The `ui-lab` CLI

Published on npm as **`uilab-cli`** (the command it installs is `ui-lab`). Get it any of these ways:

```
npx uilab-cli <cmd>          # run without installing
npm i -g uilab-cli           # or: bun add -g uilab-cli  → then use `ui-lab <cmd>`
bun cli/src/index.ts <cmd>   # inside the UI Lab repo itself
```

```
ui-lab list [--kind <kind>]      # browse everything, or one kind
ui-lab search <query>            # keyword search, best matches first
ui-lab show <slug> [--kind <k>]  # full detail: description, AI prompt, page URL, and the fetch block
ui-lab add <slug> [--pm bun|npm|pnpm|yarn]   # prints the shadcn install command for a component (does NOT run it)
```

Add `--json` to any command for structured output. The data source line is printed to **stderr**, so `--json` on **stdout** stays clean.

**Kinds** (`--kind`): `component` · `atom-set` (token scales) · `icon-style` · `icon-motion` (hover-animated icons) · `style` · `palette` · `studio-preset` (whole design systems) · `design-system` (whole design systems, reverse-recreated from real products).

## Workflow: discover → inspect → apply

1. **Discover** — `ui-lab search "<what you need>"` (e.g. `bottom sheet`, `pricing`, `bell icon`, `warm palette`) or `ui-lab list --kind <kind>`.
2. **Inspect** — `ui-lab show <slug>`. Read its `description`, the `prompt` ("对 AI 这样说" — the exact words to reproduce it), the `pageUrl`, and the copyable **fetch block**.
3. **See it** — open the `pageUrl` to look at the live sample (or show it to the user) before committing to it. This is the whole point of UI Lab: choose by eye, not by guessing from a name.
4. **Apply**, by kind:
   - **component** → run the `npx shadcn@latest add …` command from `ui-lab add <slug>` (shadcn drops the source into the project; then import it).
   - **atom-set** / **studio-preset** / **design-system** → the fetch block is a DESIGN.md / token table; paste those CSS variables into the project's global tokens.
   - **palette** → the fetch block is **drop-in CSS**: paste it into globals.css below `@import "tailwindcss"` and it remaps every shadcn semantic token (whole-site recolor with one file). The "say this to AI" prompt still ships in the item's `prompt` field.
   - **icon-style** / **icon-motion** / **style** → the fetch block is the AI prompt (named look + concrete moves + a FORBIDDEN list); follow it to implement, using the project's own stack (e.g. animated icons are plain `motion` + `lucide`, no new deps).

## Conventions (anti-slop)

UI Lab prompts encode these; keep them when you apply an asset:
- **One voice per axis** — one icon style across the product (never mix outline and filled in the same bar); one type pairing; one radius scale.
- **Tokens, not magic numbers** — use a token scale end-to-end; never introduce off-scale values (13px, 18px).
- **Hierarchy by hairline first** — establish depth with hairlines and shallow shadows before reaching for prominent shadows; don't stack heavy black shadows.
- **Reserve the accent** — accent color is for focus, selection, and primary actions; semantic colors describe real state only.
- **Respect reduced motion** — every animated asset ships a reduced-motion fallback; keep it.

## Mixing with shadcn/ui (long-tail primitives)

UI Lab deliberately does not carry every base primitive (date-picker, pagination, breadcrumb, calendar…). When you need one, install it from stock shadcn/ui — UI Lab's palettes and design systems remap the standard shadcn semantic tokens, so stock primitives pick up the look automatically. Keep UI Lab as the source for tokens, palettes, styles, and motion components; use shadcn for missing utilitarian primitives.

## The workbench skin: `--wb-*` tokens (agent components)

The **agent / workbench family** — `agent-workbench`, `agent-composer`, `agent-thread`, `agent-trace`, `agent-inbox`, `thread-list`, `artifact-panel`, `prompt-bar` — does **not** get its look from the standard shadcn semantic tokens. Its "Graphite / workbench" feel (hairline dividers, translucent raised surfaces, low-contrast layered hovers) lives in a **separate 42-token `--wb-*` scale** (light + dark), with multiple graded steps the standard tokens can't express: hover ×4 (`subtle→stronger`), inset ×4, border ×4, `surface`/`surface-translucent`/`surface-raised`/`surface-composer`, `hairline`, `shimmer`, and so on.

If you take one of these components, this is the make-or-break detail:

- **Install carries the skin automatically.** Their `/r/<slug>.json` ships `cssVars.light` / `cssVars.dark` (42 each). Running the `npx shadcn@latest add …` command from `ui-lab add <slug>` writes those variables into your globals — install and it looks right, no hand-copying.
- **`shadcn add` is *source vendoring*, not a runtime dependency.** It drops the component's source into your repo; you own and edit it. A project with a "no runtime dependency on UI Lab / no remote registry at build time" rule can still use it — the code and the `--wb-*` vars are now yours, sitting in your files.
- **To rebrand, override the *values* of `--wb-*` — never repoint the component's *references*.** Want your own accent? Set `--wb-accent` (and friends) to your color in your globals. Do **not** rewrite the component's `bg-[--wb-surface]` / `border-[--wb-hairline]` / `hover:bg-[--wb-hover]` into `bg-card` / `border-border` / `bg-muted`. That collapses 42 graded steps into ~3 and the Graphite look dies — the component stops resembling the sample. `--wb-*` **is** a token scale, so consuming it satisfies any "tokens only, no raw color values" rule; swapping it out for the coarse semantic tokens is what breaks the design, not what honors it.
- **Trimming sub-parts is fine — but eyeball the `pageUrl` first.** You can delete a composer's model picker or reasoning slider if your product doesn't need them; just open the live sample before you cut, so you don't also delete the interaction that *is* the component.

Rule of thumb: reskin by **overriding `--wb-*` values**, extend by **editing the vendored source** — but keep it reading the `--wb-*` names, or you no longer have the workbench skin.

## Adapting a vendored component to your project

A component built on the standard semantic tokens auto-adopts your palette — your `--accent` / `--primary` / `--border` flow straight in. But a few things live *past* the tokens and won't adapt on their own. After vendoring, check them:

- **Shape / radius.** Defaults encode *our* design language, not yours. UI Lab buttons default to pill (`rounded-full`); if your project is square-cornered, retune the size classes once in `button/base.tsx`. Same for over-large default sizes.
- **A11y label language.** Primitives ship English screen-reader labels (e.g. `Loader`'s `label="Loading"`). Localize them for a non-English product.
- **Palette colors baked into variants.** Some status styles reach for Tailwind palette colors instead of semantic tokens — a badge's success/warning may be `emerald`/`amber`. If your project defines `--success` / `--warning`, repoint them so the component matches *your* palette, not the sample's.
- **Mind DOM contracts before replacing a bespoke element.** If a spot is anchored by its className — a `querySelector`, an e2e `data-testid` injected via a selector, a global-CSS hook — dropping in a primitive changes its classes and silently breaks that anchor. Grep the element's classes for such anchors first; if it's contractual (e.g. a consent/approval surface), leave it or migrate the contract deliberately, don't swap blindly.

**"UI Lab first" ≠ force-fit.** When a primitive's shape doesn't match the slot — a dot-style radio for a *card* selector, a horizontal `Tabs` for a *vertical* nav, an `h-11` field for an `h-8` toolbar — keep the bespoke version with a one-line note explaining why, rather than fighting the primitive into a shape it wasn't built for. Reach for UI Lab when it fits; don't bend the design to it.

## Notes

- The CLI reads a **bundled snapshot** by default (fast, offline). When the site is deployed, pass `--registry <url>` or set `UILAB_REGISTRY` to fetch the live catalog. Refresh the snapshot from the repo with `bun run cli:snapshot`.
- The same data is also available as plain HTTP for agents without a shell: `<site>/catalog.json` (structured), `<site>/llms.txt` (grouped index), `<site>/llms-full.txt` (every prompt/token inlined), and components install via the shadcn registry at `<site>/r/*`.
