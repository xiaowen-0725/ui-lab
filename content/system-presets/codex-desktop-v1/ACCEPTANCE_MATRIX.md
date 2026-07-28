# Acceptance matrix

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

同一 case 的 reference 与 implementation 必须同尺寸、scale、主题、语义 fixture、字体加载状态和捕获时机。`codex-desktop-light` 为 hash-only/private evidence：可在受权核验环境中比较，绝不暗示其 bytes 在仓库。比较按 layout、typography、color/surface、anatomy、state、focus、motion 分类。三门禁为：strict structural audit、逐字段 Recipe 映射、实际 target-runtime 的同尺寸人工比较与差异说明。

这是 Phase 0 review contract；只有 Phase 2 checkout 后才生成 confirmed Manifest。
