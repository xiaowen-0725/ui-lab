# Audit

Audit has a deterministic layer and a manual layer. Both are required for mutating branches; neither substitutes for the other.

## Deterministic audit

Run the strict machine-readable audit at the actual frontend root:

```bash
ui-lab audit --strict --json --dir <frontend-root>
```

For a mutating branch or an explicit evidence-output request, save the exact JSON output as `.ui-lab/evidence/audit.json`. For an audit-only request, report the result in the response and do not create an evidence directory. If the installed CLI does not advertise `--strict`, stop and report a CLI/version mismatch. Do not substitute a non-strict pass.

Strict audit must finish with:

```json
{
  "ok": true,
  "summary": {
    "errors": 0,
    "warnings": 0
  }
}
```

Fix every finding and rerun. Do not edit `ui-lab.lock.json` manually to silence provenance findings.

For a missing, stale, or invalid lock, first verify that the current config and active Catalog are the intended inputs, then rebuild only the lock:

```bash
ui-lab lock --dir <frontend-root> --json
```

This command does not change config or install assets. Do not repair hashes by hand or use `init --force` as a lock-recovery shortcut. Rerun strict audit after rebuilding.

The deterministic audit may check:

- config schema and Catalog references;
- config/lock Catalog provenance;
- Recipe/profile and registered-component relationships;
- React, Tailwind CSS, TypeScript, and profile runtime dependencies;
- `components.json` aliases and vendored source presence;
- Recipe-required source-family completeness;
- Agent Workbench token references and theme token/import presence.

Treat the returned JSON as the authority for what this CLI version actually checked.

## Manual audit

Inspect and record what deterministic audit cannot prove:

| Surface | Manual question |
|---|---|
| Recipe | Is every section, slot, state, responsive rule, asset, required rule, and forbidden rule implemented? |
| Source | Are full source families and public behavior preserved, not merely similarly named files? |
| Visual | Does the actual runtime match same-size reference captures across the required matrix? |
| Tokens | Are fonts, assets, colors, radii, shadows, and motion faithful rather than arbitrary local substitutions? |
| Product | Are routes, API/IPC, state, storage, selectors, accessibility, keyboard behavior, and business tests intact? |
| Exceptions | Is every intentional difference documented with evidence? |

For a mutating branch or an explicit evidence-output request, record results in `.ui-lab/adoption-report.md` and the visual comparison report. For an audit-only request, return the same findings in the response without creating or updating project files.

## Claim boundary

Never translate “strict audit passed” into “visually aligned,” “pixel-perfect,” or “business behavior verified.” It proves only the deterministic contracts reported by that CLI run.
