# Greenfield Workbench benchmark result

Status: **engineering regression pass**. No product-maturity, visual-fidelity, or approval score is assigned.

This fixture is technically bound to `vite-app` + `graphite` + `agent-workbench`. The binding exists only to keep shared Theme Kit, CatalogLock, Recipe, source-family and runtime paths executable after the Studio/System Preset experiment was removed. It is not a user-approved product direction.

## Gates

- Static: **Pass** — lint, strict typecheck, unit tests, production build, source-family comparison and strict Audit pass.
- Runtime: **Pass for fixture scope** — Chromium/Vite covers required states, three viewport widths, light/dark, keyboard focus, reduced motion, declared fonts and overflow.
- Visual: **Candidate only** — six Graphite implementation captures were regenerated, but no approved reference pair exists.
- Human: **Pending / not requested** — no user approval is recorded for the Graphite binding or captures.

## Evidence

- Catalog binding: `ui-lab.config.json`, `ui-lab.lock.json`, `.init-result.json`, `.compose-result.json`, `.lock-result.json`.
- Static/runtime: `.ui-lab/evidence/static-results.txt`, `source-family-results.txt`, `audit.json`, `e2e-results.txt`.
- Visual candidates: `.ui-lab/evidence/visual/implementation/` with metadata and `comparison.md`.

## Limitations

1. The fixture has no real backend/API; parking data is deterministic test data only.
2. Candidate screenshots cannot establish visual fidelity or user approval.
3. Audit validates current deterministic contracts, not complete product quality.
4. This benchmark does not reintroduce Studio, System Preset, order, checkout, confirmation or release behavior.
