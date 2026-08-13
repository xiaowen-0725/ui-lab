# 001 — Polish palette workspace state changes

- **Status**: VERIFIED
- **Commit**: 749f742
- **Severity**: MEDIUM
- **Category**: Purpose & frequency, easing & duration, accessibility, missed opportunities
- **Estimated scope**: 1 source file, roughly 100 lines

## Problem

The palette workspace has three visually important state changes that currently teleport:

```tsx
// components/app/palettes/palettes-explorer.tsx:263 — current
{mode === "export" ? (
  <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
```

```tsx
// components/app/palettes/palettes-explorer.tsx:459 — current
{mode === item && (
  <span aria-hidden="true" className="absolute inset-x-2 -bottom-4 h-0.5 bg-blue-600" />
)}
```

```tsx
// components/app/palettes/palettes-explorer.tsx:529 — current
{mode === "contrast" && activeContrast ? (
  <ContrastCanvas result={activeContrast} />
) : (
  <StyleDemo ... />
)}
```

Copy feedback also swaps icon and label instantly, and its timeout is not cleared if the button unmounts:

```tsx
// components/app/palettes/palettes-explorer.tsx:68 — current
await navigator.clipboard.writeText(value);
setCopied(true);
setTimeout(() => setCopied(false), 1400);
```

These changes are occasional and benefit from short state-indicating motion. They should remain crisp and interruptible because users may switch modes or palettes repeatedly.

## Target

- Move the active mode underline between tabs using the repository's `SPRING_LAYOUT`; with reduced motion use `{ duration: 0 }`.
- Crossfade the main canvas and Inspector body with `AnimatePresence` and transform/opacity only:
  - Enter: `opacity: 0 → 1`, `transform: translateY(6px) → translateY(0)` over `180ms`, `EASE_OUT`.
  - Exit: `opacity: 1 → 0`, `transform: translateY(0) → translateY(-3px)` over `120ms`, `EASE_OUT`.
  - Reduced motion: keep the `180ms` opacity fade but remove all translation.
- On palette changes, key the live canvas by palette slug so the new palette settles from `opacity: 0.82` to `1` over `220ms` with `EASE_OUT`. Do not animate layout dimensions.
- Copy controls use `motion.button` with `SPRING_PRESS`, and the icon/label feedback uses `AnimatePresence` + `SPRING_SWAP`. Under reduced motion, remove positional movement but retain opacity feedback.
- Clear copy-feedback timers on unmount and safely ignore clipboard rejection.
- Add 150ms press feedback (`scale: 0.97`) to previous/next and playback controls; do not add persistent decorative movement.

## Repo conventions to follow

- Motion tokens are defined in `lib/ease.ts`: `EASE_OUT`, `SPRING_PRESS`, `SPRING_SWAP`, and `SPRING_LAYOUT`.
- Reduced-motion behavior uses `useReducedMotion()` from `motion/react`; see `components/agents/todo-list.tsx` for `{ duration: 0 }` spring replacement.
- Animate only `transform` and `opacity`; color-only transitions may remain CSS.
- UI motion remains below 300ms and exits are faster than entrances.

## Steps

1. In `components/app/palettes/palettes-explorer.tsx`, import `AnimatePresence`, `LayoutGroup`, `motion`, and `useReducedMotion` from `motion/react`, plus existing motion tokens from `lib/ease.ts`.
2. Replace the remounted mode underline with one shared-layout `motion.span` and a workspace-local `layoutId` inside `LayoutGroup`.
3. Wrap the main canvas state in `AnimatePresence mode="wait"` and a keyed `motion.div`; use exact target durations and transform strings above.
4. Wrap the Inspector's browse/export body in the same short presence transition without changing the Inspector shell size or content order.
5. Convert `CopyAction` to an interruptible press surface, animate its feedback slot, store its timeout in a ref, and clear it on unmount.
6. Add reduced-motion branches to every new translation and spring.
7. Add subtle press feedback to the palette navigation and playback buttons only.

## Boundaries

- Do NOT touch palette data, contrast math, messages, route structure, global chrome, or `StyleDemo`.
- Do NOT add dependencies or new global motion tokens.
- Do NOT animate width, height, margin, padding, top, left, blur above 2px, or any other layout/paint-heavy property.
- Do NOT add animation to keyboard navigation or the native selects.
- If the cited component has drifted beyond the shown state, stop and report instead of improvising.

## Verification

- **Mechanical**: run `bun run typecheck`, `bun run lint`, and `bun run check:registry`; all must exit 0.
- **Feel check**: open `http://localhost:3000/palettes?palette=business` and confirm:
  - Browse → Contrast → Export moves one underline and never double-renders it.
  - Rapidly alternating modes does not restart from an unrelated origin or leave stale content.
  - Previous/next palette changes feel settled within 220ms; auto-cycle remains calm.
  - Copy immediately presses, then swaps to success without changing the button's overall position.
  - At 10% playback speed, canvas/Inspector exits finish before entries and no layout dimensions interpolate.
  - With `prefers-reduced-motion: reduce`, translations and spring travel disappear while opacity/color feedback remains.
- **Done when**: all checks pass, browser console has no errors, Browse/Contrast/Export and copy actions still work, and 390px viewport has no horizontal overflow.

## Result

- `bun run typecheck`, `bun run lint`, `bun run check:registry`, and `git diff --check` pass.
- Normal and reduced-motion browser runs cover Browse/Contrast/Export, palette navigation, copy feedback, and 390px overflow.
- Recorded feel-check evidence: `palette-workspace-motion.webm` in the Codex visualization artifact directory for this task.
