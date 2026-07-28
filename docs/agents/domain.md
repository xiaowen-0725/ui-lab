# Domain docs

This repository uses a single-context domain-documentation layout.

## Before exploring

Read these files when they exist and are relevant:

- `CONTEXT.md` — shared vocabulary and domain boundaries
- `docs/adr/` — architecture and product decisions affecting the work

Missing files are not errors. Domain-modeling workflows create them lazily
when vocabulary or decisions are actually resolved.

## Vocabulary

Use the terms defined in `CONTEXT.md` in issue titles, specifications,
hypotheses, refactor proposals, and test names. Avoid introducing synonyms for
terms the glossary has already established.

If a required concept is absent, first determine whether the new term is
unnecessary or represents a real domain-model gap.

## Architecture decisions

Read ADRs relevant to the area being changed. If proposed work conflicts with
an existing ADR, surface the conflict explicitly instead of silently
overriding the decision.

## Layout

/
├── CONTEXT.md
├── docs/
│   └── adr/
└── src/
