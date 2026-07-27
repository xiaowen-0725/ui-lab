# Visual acceptance

Validate the implementation in the actual target runtime against a declared reference. Browser-only mock rendering does not validate a desktop application; an Electron profile must be captured from the actual Electron renderer.

## Fixed evidence layout

For a mutating branch or when the user explicitly requests persisted evidence, store the run under the consumer's fixed path:

```text
.ui-lab/evidence/visual/
├── reference/<case>.png
├── implementation/<case>.png
└── comparison.md
```

Use stable case names, for example `wide-light-default`, `collapse-dark-loading`, `narrow-light-keyboard`, and `wide-light-reduced-motion`. Do not scatter screenshots across temporary folders.

Each reference/implementation pair must use the same viewport, device scale factor, theme, semantic state, font loading status, and capture timing. For exact regression against the same application, use the same data. For adoption against a design-system demo, use deterministic, semantically equivalent data shape and density, record the field mapping in the adoption report, and keep product copy and facts truthful; never inject demo data into the product merely to make a screenshot match. Record the capture values and fixture mapping in `comparison.md`. A resized image is not a valid matching capture.

For an audit-only request, inspect existing evidence or use non-persisted captures and report findings in the response. If the capture tool requires an output path, use an existing user-authorized output directory or ask before writing; do not create `.ui-lab/evidence/*`, `DESIGN.md`, or an adoption report by default.

## Required matrix

Build the smallest representative case set that covers every applicable dimension:

- **Layout:** wide, collapse, and narrow at the Recipe or `DESIGN.md` breakpoints.
- **Theme:** every Recipe/System-required mode.
- **State:** every Recipe state, including loading, empty, error, success, and domain-specific states.
- **Keyboard:** visible focus, logical tab order, and relevant shortcuts or composer behavior.
- **Reduced motion:** reduced-motion rendering and behavior with displacement removed where required.
- **Recipe-specific:** required sections, slots, assets, responsive transitions, and forbidden-pattern checks.

Do not capture the full Cartesian product of dimensions unless the Recipe explicitly requires those combinations. Combine dimensions into representative cases while ensuring each required value and behavior appears at least once.

For landing pages, include the complete narrative and CTA path. For applications, include real task flows and representative dense/empty states. Use deterministic fixtures or test data; do not compare unrelated content.

## Bounded comparison loop

1. **First batch:** capture the complete matrix and classify differences by layout, typography, color/surface, component anatomy, assets, state, responsive behavior, focus, and motion.
2. **Batch fix:** fix shared causes in tokens, theme imports, source families, layout contracts, or Recipe mapping before isolated pixel tweaks.
3. **One confirmation:** recapture affected cases once. Do not enter an open-ended screenshot/fix loop; unresolved differences must be explained, accepted, or reported as blockers.

Use image diff tooling when available, but inspect the paired captures directly. A numeric pixel score cannot decide whether a deliberate product difference is correct.

## Comparison report

`comparison.md` must include:

| Case | Size/scale | Reference | Implementation | Difference | Explanation | Result |
|---|---|---|---|---|---|---|

Link each image path. Mirror intentional differences and their rationale in `.ui-lab/adoption-report.md`.

## Acceptance gate

For a mutating branch, visual acceptance is complete only when:

- strict audit reports `0` errors and `0` warnings;
- every Recipe field is mapped one by one;
- every required same-size screenshot pair exists with exact data or a documented semantic fixture mapping;
- every remaining difference is explained and intentional;
- relevant business, accessibility, keyboard, reduced-motion, and target-runtime tests pass.

For an audit-only request, assess the same gate and report which conditions pass, fail, or lack evidence without modifying the project.
