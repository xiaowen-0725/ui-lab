# Create or replace UI

Use replace mode for a new frontend or when the user explicitly authorizes replacing an existing interface. Reroute an incumbent product without that authorization to adopt.

Before changing production code, complete [selection.md](selection.md), bind the approved choices through [craft-contract.md](craft-contract.md), and declare how [quality-gates.md](quality-gates.md) will be evidenced. Replacement authority does not let an Agent approve a visual master or skip approved acceptance evidence.

## Choose the product mode

Classify the UI before selecting a Recipe:

| Mode | Optimize for | Typical evidence |
|---|---|---|
| **Operate application** | task flow, state density, scanability, navigation, keyboard use, responsive shells | actual workflows, loading/empty/error/success states, wide/collapse/narrow behavior |
| **Persuade landing** | narrative order, message hierarchy, CTA clarity, section rhythm, responsive media | content outline, hero/section references, conversion path, asset crops |

Do not force application conventions onto a landing page or marketing decoration onto an operational surface.

## Select dynamically

1. Run `ui-lab --help`.
2. Discover current Recipes with `ui-lab list --kind recipe --json`; never assume a fixed Recipe list.
3. Inspect candidate Recipes with `ui-lab show <slug> --kind recipe --json`, including profiles, recommended System, entry component, components, optional components, sections, slots, states, responsive rules, assets, required rules, and forbidden rules.
4. Inspect candidate Systems through live previews or a theme picker. Obtain human confirmation when selecting or changing a product's visual identity.
5. Record selected and rejected candidates with evidence.

## Assemble

1. Establish the actual frontend package root and target profile.
2. Create or update `DESIGN.md` as the visual source of truth.
3. Initialize the binding with `--mode replace`, then compose the selected Recipe using the same `--dir`.
4. Treat compose output as an installation plan. Execute accepted fetch/install steps and verify the resulting source files.
5. Vendor complete source families. Assemble the Recipe entry component and map every declared field one by one.
6. Use the hierarchy Recipe → Block → Component → shadcn primitive → bespoke code.
7. Preserve real business contracts in an existing product even when its presentation is replaced.
8. Record mapping, provenance, deviations, and evidence in `.ui-lab/adoption-report.md`.
9. Run the actual runtime, business tests, strict audit, and the full visual acceptance matrix.

Do not infer capability availability from memory. The installed CLI help and current Catalog are the authority.
