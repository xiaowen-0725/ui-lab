# Project contract

Apply this contract to adopt, replace, and audit branches at the actual React package root.

## Contract roles

| Artifact | Role | Ownership |
|---|---|---|
| `ui-lab.config.json` | Assembly intent: profile, chosen System, optional Recipe, registered components, and adopt/replace mode | Project-owned; CLI commands may update it |
| `ui-lab.lock.json` | Catalog contract provenance: selected item identities, source families, contract hashes, and Catalog source | CLI-managed; never hand-edit |
| `DESIGN.md` | Visual source of truth: appearance, composition, typography, tokens, responsive behavior, states, motion, and intentional identity | Product/design-owned; update only with an explicit visual decision |
| `.ui-lab/adoption-report.md` | Mapping, deviations, candidate decisions, and verification evidence | Agent-maintained implementation record |

The config is not a visual specification. The lock is not an installation receipt. `DESIGN.md` does not replace executable Recipe constraints. Keep the four roles separate.

## Frontend root

Use the directory that owns the React application, its `package.json`, `components.json`, and source tree. In a monorepo this is commonly a nested package. Pass that same directory to `init`, `compose`, `add`, `lock`, and `audit`.

## Config shape

Use only schema fields accepted by the CLI. A complete Agent Workbench binding registers the full five-component family:

```json
{
  "schemaVersion": 1,
  "profile": "electron-renderer",
  "system": "<selected-system>",
  "recipe": "agent-workbench",
  "components": [
    "agent-workbench",
    "thread-list",
    "agent-thread",
    "agent-composer",
    "artifact-panel"
  ],
  "mode": "adopt"
}
```

Valid profiles are `next-app`, `vite-app`, and `electron-renderer`. Valid modes are `adopt` and `replace`. Prefer CLI updates so the config and lock remain synchronized. If the lock is missing or disagrees with the current config or active Catalog, rebuild only its provenance:

```bash
ui-lab lock --dir <frontend-root> --json
```

`lock` derives a fresh lock from the current config and Catalog. It does not change config or install assets. Do not patch hashes manually or use `init --force` as lock recovery.

## Workbench token contract

Keep semantic `--wb-*` variables in Workbench source families and define or import the selected theme's token values. With Tailwind arbitrary values, reference CSS variables using valid `var(...)` syntax:

```tsx
<section className="bg-[var(--wb-surface)] text-foreground">
  <div className="border-[var(--wb-hairline)] hover:bg-[var(--wb-hover)]" />
</section>
```

Use the explicit `var(...)` forms above. Do not replace Workbench tokens with unrelated palette utilities or copy only a primary file when the Catalog declares sidecars.

## `DESIGN.md` minimum

Record the chosen visual reference, layout regions, typography/font assets, color and surface tokens, spacing/radius/shadow rules, icon family, theme modes, responsive transitions, required states, focus treatment, and reduced-motion behavior. Describe visual facts precisely enough that a same-size comparison can pass.
