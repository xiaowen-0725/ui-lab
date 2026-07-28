# Review

Review 是只读路线。检查实现是否符合 approved contract、Catalog/Recipe、目标 runtime 与现有证据；不得创建或修改项目文件、自行修复、批准 visual master 或确认 Manifest。

## 边界

- 纯 motion diff、动效机会或动效专项审查必须进入 [motion.md](motion.md) 的 `find` / `review`，不由通用 Review 重复评审。
- 混合型检查可引用 motion review 的 findings，或把动效部分明确交给 motion review；同一 finding 只能归属一个报告位置，不重复计数、重复定级或给出冲突 verdict。
- 通用 Review 可检查 approved motion contract 是否有证据覆盖，但不替代专项 motion review 的手感与实现判断。

## 流程

1. 确认 frontend root、目标 runtime、选定 System/Recipe、approved contract 与证据角色。
2. 读取 [project-contract.md](project-contract.md)，按需运行 [audit.md](audit.md) 的只读检查。
3. 对照 [quality-gates.md](quality-gates.md) 和 [visual-acceptance.md](visual-acceptance.md)，逐项核查可比较性、状态和 intentional difference。
4. 对每个 finding 引用文件、命令输出、runtime 观察或截图对；没有证据就标为不足，不猜测。
5. 列出曾考虑但拒绝的候选 finding，说明它为何属于已批准差异、豁免或证据不足。

## 必需输出

| Severity | Category | Location | Expected | Observed | Evidence | Recommendation |
|---|---|---|---|---|---|---|

Category 使用 visual acceptance 的稳定分类：layout、typography、color/surface、anatomy、assets、state、responsive、focus/motion；结构与运行时问题可使用 contract、runtime、a11y、performance。混合报告中的 motion finding 若已由 motion review 负责，只引用其 evidence 与 verdict，不再新增同义行。

### Rejected candidates

| Candidate | Why considered | Why rejected |
|---|---|---|

### Verdict

- **Pass**：在本次只读范围内没有阻断项，适用证据充分。
- **Block**：存在违反 approved contract、结构/运行时门禁或不可接受视觉差异的证据。
- **Insufficient evidence**：缺少批准记录、可比较截图、目标 runtime、状态覆盖或测量结果，无法作出可靠结论。

`Pass` 只代表本次 review 结论，不批准 acceptance capture，也不解锁 Confirmed Manifest。
