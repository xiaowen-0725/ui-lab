# R2 implementation evidence — 2026-10-03

Owned repository files only:
- components/motion/drawer.tsx
- components/motion/bottom-sheet.tsx
- components/ui/modal.tsx
- lib/hooks/use-modal-dialog.ts
- lib/hooks/use-modal-scroll-lock.ts
- tests/modal-dialog.test.tsx

No package/dependency, registry, CLI, Catalog, existing test, commit or push changes were made by this worker.

## Implementation
Native HTMLDialogElement.showModal supplies browser top-layer modality. A shared stack supplies explicit background inert, focus entry and live Tab/Shift-Tab boundaries, top-only Escape/native cancellation, controlled native close handling, focus restoration/rebasing and a reference-counted fixed-body scroll lock. The closing dialog remains as an inert nonmodal surface for its existing motion exit. Drawer and BottomSheet public props, animation tokens, snap/drag code and reduced-motion branches are retained. Drawer now portals to body too; BottomSheet title and description use linked accessible IDs.

## Red → green evidence
Before implementation: the two public consumer focus entry/restore tests failed (exit 1).
Before shared focus/background management: four Tab/inert regressions failed (exit 1).
Nested exit test exposed loss of inert on an exiting inner layer when the final outer layer closed; both nesting orders failed (exit 1), then passed after preserving outgoing-layer ownership.
Consumer autofocus restore, native showModal surface focus, native close requests, and editable-region Tab entry each produced failing regressions before their fixes.

## Final checks (all exit 0)
- bun test tests/modal-dialog.test.tsx — 27 pass, 0 fail, 120 assertions.
- bun test tests/modal-dialog.test.tsx tests/a11y.test.tsx tests/registry-server.test.ts — 51 pass, 0 fail, 153 assertions.
- bun run typecheck.
- bun run lint — three warnings in existing setup-ts-deep-modules skill copies, none in owned files.
- bun run check:registry — 128 registry components, 14 registry:theme items validated in the concurrently evolving workspace.
- Scoped Biome lint on all six owned files — no findings.

## Real browser checks
Playwright CLI isolated session uilab-r2, Chromium. Temporary consumer imports actual Drawer/BottomSheet source and is bundled with Bun, with minimum positioning CSS. No shared Next dev/build state was touched.
Verified:
- Native :modal state and explicit application-root inert.
- Drawer and Sheet initial field focus.
- Tab/Shift-Tab wrapping and rejected programmatic background focus.
- Nested Drawer → Sheet: only upper closes per Escape, restores inner launcher, retains scroll lock; final Escape restores outer launcher and releases inert/scroll lock.
- Pointer drag of Sheet handle by 200px dismisses and restores launcher.
- prefers-reduced-motion=reduce: Drawer/Sheet have no translated transform; nested initial focus and top-only Escape restoration pass.
- Native close request reaches controlled consumer and restores launcher/releases scroll lock.

Browser found a real issue absent from happy-dom: native showModal may focus the Sheet content surface first. Added a failing browser-API boundary regression and fixed initialization bookkeeping, then rechecked Chromium.

Browser files/snapshots/logs and consumer source are beside this report. Initial fixture-load 404s occurred before bundling; successful subsequent reloads had no application errors. Motion logs its expected reduced-motion warning. Temporary server and browser are stopped after verification.

## Parent acceptance still needed
- Real iOS Safari touch dragging/flings, internal boundary scrolling, background scroll prevention, and exact scroll-position restoration.
- Firefox/WebKit keyboard/native-dialog checks and actual site styling/animation appearance.
- Actual registry installation into a consumer package and keyboard regression against the installed files, including vendored dependency closure. check:registry does not substitute for this.
- Independent R2 acceptance/visual review; these implementation checks do not claim final product or visual approval.
