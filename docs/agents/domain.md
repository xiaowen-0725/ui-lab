# Domain Docs

This repo has a single domain context. Product boundaries come from `PRODUCT_DEFINITION.md`; coding and naming rules come from `CODING_STANDARDS.md`.

## Before exploring

- Read root `GLOSSARY.md` when present. While it has not yet been created, read the existing `CONTEXT.md` for the current domain vocabulary.
- Read relevant decisions in `docs/adr/`.
- Missing glossary files are created lazily by `/domain-modeling` when terms are resolved. Preserve the existing `CONTEXT.md` and ADRs; when establishing `GLOSSARY.md`, consolidate vocabulary and update pointers together so there is one maintained glossary.

## Layout

Single-context: root `GLOSSARY.md` (created lazily) + `docs/adr/`. Existing vocabulary currently lives in root `CONTEXT.md`.

`cli/` and independent `benchmarks/runs/*` are tooling and consumer fixtures; they do not require separate domain glossaries.

## Vocabulary and decisions

Use the maintained glossary's terms in issues, proposals, hypotheses and tests. Note unresolved terms for `/domain-modeling`. Surface conflicts with existing ADRs explicitly before changing decisions.
