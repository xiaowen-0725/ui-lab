# Adopt into an existing product

Use adopt mode to align an incumbent React product without erasing its product model or silently changing its identity.

Before changing production code, complete [selection.md](selection.md), bind the approved choices through [craft-contract.md](craft-contract.md), and declare how [quality-gates.md](quality-gates.md) will be evidenced. If approved acceptance evidence is missing, stay in selection; do not treat an incumbent screenshot or an Agent-generated candidate as approval.

## Inspect before binding

At the actual frontend package root, inventory:

- runtime/profile, React/Tailwind/TypeScript versions, `components.json`, package manager, and start/test commands;
- current theme tokens, fonts, spacing, radius, shadows, icon family, and dark/light behavior;
- routes, state ownership, API/IPC boundaries, storage, keyboard behavior, accessibility semantics, and automation selectors;
- existing shells, component families, visual references, snapshots, and business tests.

Capture the incumbent visual source of truth in `DESIGN.md` before broad styling changes. If no trustworthy reference exists, say so and obtain a visual direction instead of inventing one.

## Bind and map

1. Run `ui-lab --help`. Use one frontend-root `--dir` for every project command.
2. Discover candidate Systems and Recipes from the current Catalog. Inspect live examples and full source families; do not choose by slug alone.
3. Initialize with `--mode adopt` only when no valid binding exists. Never use `--force` merely to simplify migration.
4. Compose the selected Recipe to obtain a compare plan. The command registers intent; it does not install or validate the result.
5. Compare each planned asset with the incumbent implementation. Prefer adapting vendored UI Lab source around preserved contracts over rewriting working business logic.
6. Search the Catalog before bespoke work. Record considered candidates and why each rejected candidate failed.
7. Install or copy only accepted, missing assets. Preserve full source families and their public APIs; document intentional local adaptations.
8. Map every Recipe field, then run the target runtime, business tests, strict audit, and visual acceptance.

## Required adoption report

Maintain `.ui-lab/adoption-report.md`. Its primary mapping table must use exactly these columns:

| Region | UI Lab asset | Upstream source family | Local implementation | Preserved contracts | Intentional differences | Evidence |
|---|---|---|---|---|---|---|

Also include a candidate log:

| Need | Candidate | Decision | Rejection reason or adaptation |
|---|---|---|---|

Evidence must point to concrete source paths, test output, Catalog/live pages, or screenshot-pair files. “Looks similar” is not evidence.

## Adopt-mode constraints

- Do not overwrite incumbent vendored components before comparing APIs and behavior.
- Do not replace business data with demo data to make a UI Lab sample fit.
- Do not remove test IDs, IPC channels, route semantics, focus behavior, or accessible names without an explicit product decision.
- Do not treat token substitution alone as adoption; shell structure, states, source families, and Recipe constraints still require mapping.
