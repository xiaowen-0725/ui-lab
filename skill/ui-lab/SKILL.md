---
name: ui-lab
description: "Use UI Lab for exactly one of four React frontend branches: discover Catalog assets without changing a project; adopt UI Lab into an existing React product while preserving its contracts; create or explicitly replace a React application or landing page from a System Kit and Recipe; or audit UI Lab assembly and visual alignment against the project contract."
---

# UI Lab

Use UI Lab as a composable frontend contract, not as a mood board. Route the request before touching a project.

## Route first

| User intent | Branch | Read fully before acting |
|---|---|---|
| Find components, themes, styles, or Recipes | Catalog discovery | [discover.md](references/discover.md) |
| Bring UI Lab into an existing product | Adopt | [project-contract.md](references/project-contract.md), [adopt.md](references/adopt.md), [audit.md](references/audit.md), and [visual-acceptance.md](references/visual-acceptance.md) |
| Build new UI or explicitly replace an existing UI | Replace | [project-contract.md](references/project-contract.md), [replace.md](references/replace.md), [audit.md](references/audit.md), and [visual-acceptance.md](references/visual-acceptance.md) |
| Inspect an existing UI Lab integration | Audit and visual alignment | [project-contract.md](references/project-contract.md), [audit.md](references/audit.md), and [visual-acceptance.md](references/visual-acceptance.md) |

Default an existing product to **adopt**. Use **replace** only when the user explicitly authorizes replacement. If the boundary remains ambiguous, ask before changing files.

## Shared invariants

- Locate the actual React package root. Keep `package.json`, `components.json`, `ui-lab.config.json`, and every `--dir` target at that root.
- Run `ui-lab --help` before project commands. If the installed CLI lacks a required command or flag, report the tool mismatch; never silently downgrade the workflow.
- Select in this order: Recipe → Block → Component → shadcn primitive → bespoke code.
- Vendor UI Lab source into the consumer. Do not add a runtime dependency on the UI Lab repository.
- Preserve business state, IPC/API contracts, routes, accessibility semantics, automation selectors, and tests unless the user changes their requirements.
- Treat a CLI plan as a plan. Do not claim that components or themes were installed until their files and runtime behavior are verified.
- Keep `--wb-*` tokens intact for Agent Workbench families. Do not replace their visual contract with arbitrary utilities.
- Keep audit-only work read-only. Report findings in the response; write `DESIGN.md`, adoption reports, or `.ui-lab/evidence/*` only for a mutating branch or when the user explicitly requests evidence files.

## Completion

Discovery is complete only when the user receives evidence-backed candidates with live/fetch details and the project remains unchanged.

Every mutating branch is complete only when all of these are true:

- `ui-lab audit --strict --json` reports `0` errors and `0` warnings.
- Every Recipe field is mapped one by one, including sections, slots, states, responsive rules, assets, required rules, and forbidden rules.
- Same-size reference/implementation screenshot pairs exist under the fixed evidence path.
- Every remaining visual difference is explained and intentional.
- Relevant business, accessibility, and runtime tests pass in the actual target runtime.

Audit success is structural evidence, never proof of visual consistency. Follow the manual matrix and bounded comparison loop in [visual-acceptance.md](references/visual-acceptance.md).
