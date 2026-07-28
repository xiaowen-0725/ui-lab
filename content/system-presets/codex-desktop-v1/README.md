# Codex Desktop v1 reference pack

这是 `approved` 状态的 Phase 0 calibration 入口。批准仅涵盖 calibration source、视觉事实和计划矩阵方向，不涵盖当前 UI Lab 实现。真实 Codex 观察图属于 calibration source，不是同尺寸 acceptance capture。

- [视觉事实](./VISUAL_FACTS.md)
- [验收矩阵](./ACCEPTANCE_MATRIX.md)
- [归属与权利边界](./ATTRIBUTION.md)
- [机器可读 reference pack](./reference-pack.json)
- [确定性 Parking fixture](./fixtures/parking-high-density-v1.json)

两张浅色截图仍是权威 calibration 角色；其中 desktop 图是 hash-only/private evidence，仓库不保留其 bytes。仓库仅 vendored safe generic workbench 与受限的深色 composer supporting 图。

Phase 2 已从当前 UI Lab Parking preview 生成 8 张确定性截图及 hash，记录在 `candidate-evidence.json` 和 legacy path `public/system-presets/codex-desktop-v1/reference/`。这些文件目前的证据角色是 **candidate regression capture**：只能用于发现该候选实现后续是否回归。legacy path 中的 `reference` 字样不升级证据角色，不表示已获批准，也不能证明它像 Codex。

原始 calibration source 与这 8 张 candidate 的业务语义、尺寸和捕获条件并不完全相同。当前只能在 Reference Board 中并排按 layout、typography、color/surface、anatomy、assets、state、responsive、focus/motion 分类审查，禁止用 overlay 或 pixel score 宣称 fidelity。只有用户在 Reference Board 逐项确认后，对应 candidate 才能成为 approved acceptance capture，并解锁 checkout 与 Confirmed Manifest。在此之前状态保持 pending。
