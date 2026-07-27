# Catalog discovery

Use this branch to find UI Lab assets and advise the user without binding or changing a project.

## Guardrail

Do not run `init`, `compose`, or config-aware `add`. Do not create `ui-lab.config.json`, `ui-lab.lock.json`, `DESIGN.md`, an adoption report, a theme picker inside the consumer, or application files. If the user asks to apply a result, reroute to adopt or replace before mutating.

## Procedure

1. Run `ui-lab --help` and use only commands exposed by the installed CLI.
2. Translate the request into concrete needs: application/landing context, visual direction, interaction, state, responsive behavior, and asset kind.
3. Search broadly, then inspect exact candidates:

   ```bash
   ui-lab search "<need>" --json
   ui-lab list --kind <kind> --json
   ui-lab show <slug> --kind <kind> --json
   ```

4. For visual systems, inspect the live preview. A picker may be generated in a temporary location for human comparison; do not write it into the consumer.
5. Compare candidate fit, source family completeness, supported profiles, Recipe compatibility, fetch/install details, and visible behavior.
6. Record rejected near-matches and the concrete reason each was rejected.

Use `--registry <base-url>` only when the user needs a particular deployed Catalog. The value is the deployment base URL, not `/catalog.json`. State whether results came from that deployment or the bundled snapshot.

## Output

Return a compact table:

| Need | Candidate (`kind/slug`) | Why it fits | Live evidence | Fetch/install | Caveats |
|---|---|---|---|---|---|

Include the strongest rejected candidates and rejection reasons below the table. Discovery is complete only when the evidence is sufficient to choose a next branch and no consumer project was changed.
