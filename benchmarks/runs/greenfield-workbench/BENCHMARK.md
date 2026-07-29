# Greenfield Workbench benchmark result

Overall score: **86/100**. This is an implementation/evidence score, not a Codex fidelity or visual-approval score.

| Category | Score | Evidence | Deduction | Confidence |
|---|---:|---|---|---:|
| Route & authority | 10/10 | `.init-result.json`, `ui-lab.config.json`, `.ui-lab/adoption-report.md` | None. `replace`, package root, profile, fixture-only approval, and human gate are explicit. | 0.99 |
| System/asset reuse | 19/20 | `ui-lab.lock.json`, `.compose-result.json`, `.ui-lab/evidence/source-family-results.txt` | Current repository sources were copied exactly rather than fetched from a running registry endpoint; provenance is still Catalog/lock-backed. | 0.98 |
| Contract completeness | 16/20 | `DESIGN.md`, `.ui-lab/adoption-report.md`, config/lock, state queries | System Preset's required Settings capability is documented but not assembled; no success state because Agent Workbench Recipe does not declare one. | 0.87 |
| Runtime quality | 17/20 | `.ui-lab/evidence/e2e-results.txt`, `e2e/workbench.spec.ts`, contrast evidence | Fixture runtime has no real backend/API; interaction assertions cover reachability, focus, fonts, overflow, and states but not every composer/approval branch. | 0.90 |
| Visual evidence | 14/20 | `.ui-lab/evidence/visual/`, six same-size captures, `comparison.md` | No approved acceptance reference exists, so no valid pair, overlay, heatmap, or adoption pixel score can be produced. | 0.96 |
| Evidence honesty | 10/10 | `comparison.md`, reference README, adoption report | Candidate, audit, and human approval roles remain distinct. | 0.99 |

## Gates

- Static: **Pass** — lint, strict typecheck, unit tests, production build, source-family comparison, strict audit 0/0.
- Runtime: **Pass for benchmark fixture** — Chromium/Vite, required states, three widths, themes, keyboard focus, reduced motion, fonts, and overflow are automated.
- Visual: **Insufficient evidence for acceptance** — candidate matrix exists and was manually inspected, but approved reference pairs do not.
- Human: **Pending** — no user approval is recorded for any candidate capture; Confirmed Manifest remains blocked.

## Blockers

1. `codex-desktop-v1` has `goldenCapture: null`; its existing generated images are `candidate-regression` with pending acceptance.
2. The required Settings capability from the System Preset is not assembled in this minimal Recipe consumer.
3. This benchmark fixture intentionally has no real parking backend; it validates deterministic UI contracts only.
