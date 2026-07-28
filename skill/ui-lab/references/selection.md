# Selection

在实现前用视觉证据做决定。选择阶段只定义 approved contract，不修改消费者生产代码。

## 比较协议

1. **一次只分叉一个维度。** 主题、字体、图标、布局密度、外壳结构、组件 anatomy 或 motion personality 每次只选一个；其余已批准变量保持不变。
   - 一个完整且内部锁定的 System Preset 可以作为单一组合决策轴参与比较，但每个候选必须是整套 preset。禁止拆散多个 preset 后混搭，也不得同时自由改变多个未锁定维度。
2. **使用全尺寸真实上下文。** 在目标 viewport、theme、locale、代表性数据和目标 runtime 中展示完整表面，不用缩略卡片代替最终判断。
3. **候选必须真正不同。** 默认 2–3 个具名方向；说明差异轴、适用场景与成本。仅换 accent 或文案不算新方向。
4. **保持隔离。** 候选放在 UI Lab、临时 harness 或用户授权的 evidence 位置；不得通过修改消费者生产代码来“预览”。
5. **记录证据角色。** 外部截图是 calibration source；当前生成结果是 candidate regression capture。只有用户明确批准后才能成为 approved acceptance capture。完整定义以 [visual-acceptance.md](visual-acceptance.md) 为准。
6. **等待用户决定。** 输出批准、拒绝、待修订项和拒绝理由；Agent 不代选，也不把沉默当同意。

## 选择输出

| Dimension | Candidate | Full-size evidence | Fixed variables | Difference | Cost | Decision |
|---|---|---|---|---|---|---|

批准结果必须能绑定 [craft-contract.md](craft-contract.md) 中的字体、图标、主题、token、布局、组件和状态要求。无法证明全尺寸一致性时，结论保持 `pending`。

## Manifest 门禁

- 可以在批准前保存 Draft 或 candidate evidence。
- 只有绑定用户批准记录的 **approved acceptance evidence** 才能解锁 Confirmed Manifest。
- Confirmed Manifest 的实际确认或生成接口，以当前 `ui-lab --help` 和 Studio 真实暴露的能力为准。没有可信 acceptance evidence，或当前没有公开相应命令/操作时，保持 `pending` 并报告能力缺口；不得臆造 CLI 命令、API 或已确认状态。
- Strict audit、低像素差、哈希、Agent 判断或自生成截图都不能替代批准。
- 修改已批准方向时必须产生新候选、新证据和新的用户批准，不沿用旧批准。
