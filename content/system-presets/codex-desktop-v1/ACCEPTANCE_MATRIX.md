# Acceptance matrix — candidate review pending

| Case | Size | Theme | State | Surface | Fixture | Calibration source | Evidence status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| wide-light-task-dense | 1440×900 | light | dense | task, artifact | parking-high-density-v1 | both light | candidate / pending |
| wide-dark-task-streaming | 1440×900 | dark | dense, streaming | task, artifact | parking-high-density-v1 | dark composer + workbench | candidate / pending |
| collapse-light-approval | 1000×760 | light | approval | task, artifact | parking-high-density-v1 | both light | candidate / pending |
| narrow-light-empty | 375×760 | light | empty | task | parking-high-density-v1 | both light | candidate / pending |
| wide-dark-error-artifact | 1440×900 | dark | error | task, artifact | parking-high-density-v1 | dark composer + workbench | candidate / pending |
| wide-light-board-focus | 1440×900 | light | dense, focus | board | parking-high-density-v1 | both light | candidate / pending |
| collapse-dark-connectors-overlay | 1000×760 | dark | dense | connectors, settings | parking-high-density-v1 | dark + desktop | candidate / pending |
| wide-light-settings-reduced-motion | 1440×900 | light | dense, reduced motion | settings | parking-high-density-v1 | both light | candidate / pending |

这是已批准的 Phase 0 calibration/事实/矩阵方向，不是对当前视觉实现的批准。机器 reference pack 仍把 case 描述为 planned、acceptance capture 为 null；Phase 2 生成的 8 张图只是当前实现的 candidate regression capture。它们不代表 checkout、visual acceptance 或 Manifest confirmed，也不能被称为 Codex fidelity reference。

原始 calibration source 尺寸和业务语义可以不同；`codex-desktop-light` 为 hash-only/private evidence，可在受权核验环境中核验，但其 bytes 不在仓库。dark case 的跨主题 source 仅校准 anatomy，不是 dark acceptance reference。因此 Codex source → UI Lab candidate 当前只能在 Reference Board side-by-side 按 layout、typography、color/surface、anatomy、assets、state、responsive、focus/motion 分类，不允许 overlay、heatmap 或 pixel score 作为 fidelity 结论。

用户须在 Reference Board 逐项检查 candidate，并明确批准哪些 case 成为 approved acceptance capture。批准后的 UI Lab master → consumer app 才能在同一 fixture 或记录完备的语义映射、size、scale、theme、font loading 与 capture timing 下进行 reference / implementation overlay 与 diff。三门禁为：strict structural audit、逐字段 Recipe 映射、实际 target-runtime 的同尺寸人工比较与差异说明。

这是 calibration 与 candidate review contract；所有 candidate 在用户批准前保持 pending，并阻止 checkout 与 Confirmed Manifest。Agent 不得代替用户批准或确认。
