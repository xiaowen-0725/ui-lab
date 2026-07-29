# Selection

在实现前用视觉证据做决定。Studio 是目标视觉选择面，chat 负责编排，CLI/headless 是同一契约投影。选择阶段形成 OrderDraft 与 selection approval，不修改消费者生产代码，也不等于 implementation acceptance。

## 比较协议

1. **套餐优先。** 默认推荐 3 套适配场景的 `production-ready Package@version + fixture`，展示 maturity、compatibility、成本与缺口。只有 Compatibility Graph 允许时才做兼容换件。
   - 当前没有合格 Package 时，一个完整且内部锁定的 System Preset 可作为单一组合决策轴和 package-like candidate，但必须标出 maturity/缺口；不得拆散多个 preset 后混搭，也不得称为 production-ready。
2. **兼容换件一次只分叉一个维度。** 字体、图标、密度、component anatomy 或 motion personality 每次只变一个兼容轴；其余 Package contract 保持不变。
3. **使用全尺寸真实上下文。** 在目标 viewport、theme、locale、代表性数据和目标 runtime 中展示完整表面，不用缩略卡片代替最终判断。
4. **候选必须真正不同。** 说明 Package/fixture、差异轴、适用场景与成本。仅换 accent 或文案不算新方案。
5. **保持隔离。** 候选放在 Studio、UI Lab、临时 harness 或用户授权的 evidence 位置；不得通过修改消费者生产代码来“预览”。
6. **记录证据角色。** 外部截图是 calibration source；当前生成结果是 candidate regression capture。selection approval 可以批准所选 Package fixture / visual master，但 consumer implementation 仍需独立的可比较 evidence 与 implementation acceptance。完整定义以 [visual-acceptance.md](visual-acceptance.md) 为准。
7. **等待用户决定。** 输出批准、拒绝、待修订项和拒绝理由；Agent 不代选，也不把沉默当同意。

## 选择输出

| Dimension | Candidate | Full-size evidence | Fixed variables | Difference | Cost | Decision |
|---|---|---|---|---|---|---|

批准结果必须能绑定 [craft-contract.md](craft-contract.md) 中的字体、图标、主题、token、布局、组件和状态要求。无法证明全尺寸一致性时，结论保持 `pending`。

## Order 与 acceptance 门禁

- 可以在 selection approval 前保存 OrderDraft 或 candidate evidence。
- selection approval 允许生成目标 OrderLock；OrderLock 只固定解析结果，不代表实现通过。
- implementation 完成后，只有绑定 OrderLock 的完整 EvidenceBundle 与 implementation acceptance 才能进入 acceptance/release。
- OrderLock 的实际生成接口以当前 `ui-lab --help` 和 Studio 真实能力为准。当前没有公开相应命令/操作时保持 `pending` 并报告能力缺口；不得把 `ui-lab.lock.json` CatalogLock 冒充 OrderLock，也不得臆造 CLI/API。
- 当前 Phase 1–2 `Confirmed Manifest` 只是 bridge 实验；其实际命令以公开 CLI/Studio 为准，不得臆造 Confirmed Manifest 命令或把它冒充目标 OrderLock/acceptance。
- Strict audit、低像素差、哈希、Agent 判断或自生成截图都不能替代批准。
- 修改已批准选择时必须更新 OrderDraft、重新 selection approval 并生成新 OrderLock；修改实现时必须刷新受影响 evidence，不沿用失效批准。
