# Greenfield Workbench visual contract

This benchmark fixture is approved for `vite-app` + `codex-desktop-v1` + `agent-workbench`, Chinese locale, light/dark modes, and the deterministic `parking-high-density-v1` data only. It does not approve a reusable visual master or Confirmed Manifest.

- Layout: complete `AgentWorkbench` entry shell. Wide (`>=1200`) keeps navigation, task, and artifact regions; collapse (`768–1199`) collapses navigation first and uses mutually exclusive overlays; narrow (`<=767`) exposes one task surface with explicit navigation controls.
- Typography: platform system sans for display/body, system monospace for identifiers and numbers; weights 400/500/600.
- Theme: the complete vendored Codex Desktop v1 light/dark token sets, preserving every `--wb-*` semantic token. No gradients, glass identity, or competing palette.
- Icons: Lucide only, 16px standard controls, 2px rounded stroke.
- Geometry: 4px spacing base; 8px controls, 12px panels, 20px composer; hairline/small shadows dominate.
- Slots: task history navigation, primary thread, bottom composer, optional artifact panel are all mapped.
- States: Recipe empty/streaming/approval/error plus benchmark default/loading. State is deterministic and URL-addressable through `?state=`.
- Focus/a11y: native controls, visible blue focus outline, labeled controls, logical DOM tab order, live loading status.
- Motion: vendored motion uses UI Lab tokens and hooks. `prefers-reduced-motion` and `?reduced=1` suppress displacement/long animation while preserving short opacity/color feedback.
- Overflow: the shell is viewport-bound; task and artifact content scroll internally without document-level horizontal overflow.

The System Reference Pack contains planned candidate captures, not approved acceptance references. Consumer screenshots remain candidate regression captures pending explicit human approval.
