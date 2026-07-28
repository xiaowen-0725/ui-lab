# Planned acceptance matrix

| Case | Size | Theme | State | Surface | Fixture | Reference |
| --- | --- | --- | --- | --- | --- | --- |
| wide-light-task-dense | 1440×900 | light | dense | task, artifact | parking-high-density-v1 | both light |
| wide-dark-task-streaming | 1440×900 | dark | dense, streaming | task, artifact | parking-high-density-v1 | dark composer + workbench |
| collapse-light-approval | 1000×760 | light | approval | task, artifact | parking-high-density-v1 | both light |
| narrow-light-empty | 375×760 | light | empty | task | parking-high-density-v1 | both light |
| wide-dark-error-artifact | 1440×900 | dark | error | task, artifact | parking-high-density-v1 | dark composer + workbench |
| wide-light-board-focus | 1440×900 | light | dense, focus | board | parking-high-density-v1 | both light |
| collapse-dark-connectors-overlay | 1000×760 | dark | dense | connectors, settings | parking-high-density-v1 | dark + desktop |
| wide-light-settings-reduced-motion | 1440×900 | light | dense, reduced motion | settings | parking-high-density-v1 | both light |

这是已批准的 Phase 0 calibration/事实/计划矩阵方向，不宣称当前 visual gate 可执行。8 个 case 仍为 planned、golden 为 null；这不代表 Phase 2 checkout、visual acceptance 或 Manifest confirmed。原始 calibration source 尺寸可不同；`codex-desktop-light` 为 hash-only/private evidence：可在受权核验环境中核验，绝不暗示其 bytes 在仓库。dark case 的跨主题 source 仅校准 anatomy，不是 dark golden。比较按 layout、typography、color/surface、anatomy、state、focus、motion 分类。

Phase 2 必须在用户 checkout 后，用同一 fixture、size、scale、theme、font loading 与 capture timing 为每个 case 生成同尺寸 golden capture 和 hash，才可转为 confirmed。三门禁届时为：strict structural audit、逐字段 Recipe 映射、实际 target-runtime 的同尺寸人工比较与差异说明。

这是 Phase 0 review contract；只有 Phase 2 checkout 后才生成 confirmed Manifest。
