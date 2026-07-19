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

On this machine `ui-lab` is on PATH (`bun link`). Inside the UI Lab repo you can also run `bun cli/src/index.ts <cmd>`.

```
ui-lab list [--kind <kind>]      # browse everything, or one kind
ui-lab search <query>            # keyword search, best matches first
ui-lab show <slug> [--kind <k>]  # full detail: description, AI prompt, page URL, and the fetch block
ui-lab add <slug> [--pm bun|npm|pnpm|yarn]   # prints the shadcn install command for a component (does NOT run it)
```

Add `--json` to any command for structured output. The data source line is printed to **stderr**, so `--json` on **stdout** stays clean.

**Kinds** (`--kind`): `component` · `atom-set` (token scales) · `icon-style` · `icon-motion` (hover-animated icons) · `style` · `palette` · `studio-preset` (whole design systems).

## Workflow: discover → inspect → apply

1. **Discover** — `ui-lab search "<what you need>"` (e.g. `bottom sheet`, `pricing`, `bell icon`, `warm palette`) or `ui-lab list --kind <kind>`.
2. **Inspect** — `ui-lab show <slug>`. Read its `description`, the `prompt` ("对 AI 这样说" — the exact words to reproduce it), the `pageUrl`, and the copyable **fetch block**.
3. **See it** — open the `pageUrl` to look at the live sample (or show it to the user) before committing to it. This is the whole point of UI Lab: choose by eye, not by guessing from a name.
4. **Apply**, by kind:
   - **component** → run the `npx shadcn@latest add …` command from `ui-lab add <slug>` (shadcn drops the source into the project; then import it).
   - **atom-set** / **studio-preset** → the fetch block is a DESIGN.md / token table; paste those CSS variables into the project's global tokens.
   - **icon-style** / **icon-motion** / **style** / **palette** → the fetch block is the AI prompt (named look + concrete moves + a FORBIDDEN list); follow it to implement, using the project's own stack (e.g. animated icons are plain `motion` + `lucide`, no new deps).

## Conventions (anti-slop)

UI Lab prompts encode these; keep them when you apply an asset:
- **One voice per axis** — one icon style across the product (never mix outline and filled in the same bar); one type pairing; one radius scale.
- **Tokens, not magic numbers** — use a token scale end-to-end; never introduce off-scale values (13px, 18px).
- **Hierarchy by hairline first** — establish depth with hairlines and shallow shadows before reaching for prominent shadows; don't stack heavy black shadows.
- **Reserve the accent** — accent color is for focus, selection, and primary actions; semantic colors describe real state only.
- **Respect reduced motion** — every animated asset ships a reduced-motion fallback; keep it.

## Notes

- The CLI reads a **bundled snapshot** by default (fast, offline). When the site is deployed, pass `--registry <url>` or set `UILAB_REGISTRY` to fetch the live catalog. Refresh the snapshot from the repo with `bun run cli:snapshot`.
- The same data is also available as plain HTTP for agents without a shell: `<site>/catalog.json` (structured), `<site>/llms.txt` (grouped index), `<site>/llms-full.txt` (every prompt/token inlined), and components install via the shadcn registry at `<site>/r/*`.
