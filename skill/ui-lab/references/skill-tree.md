# Skill tree

UI Lab 使用一个薄入口和四个阶段。一次只运行一个路线；路线完成、被门禁阻断或用户改变目标后，再重新路由。八条 route 的 reference contract 已存在，但 dedicated capabilities 尚未全部实现/安装。

| 阶段 | 路线 | 产出 | 转移条件 |
|---|---|---|---|
| **Define** | `discover` / `$design-ingest` / `select` | Catalog Package 候选、draft/reference Theme layer、OrderDraft 与 selection approval | Studio 完成 Package/fixture 视觉选择；完整应用系统必须进入 `select` |
| **Build** | `adopt` / `replace` | 按 OrderLock/当前批准 contract 装配的产品实现 | 生产变更明确获授权，Recipe、adapter 与 source family 映射完整 |
| **Refine** | `polish` / `motion` / `harden` | 不改变方向的精修、动效或状态韧性 | 选定范围修完并通过一次确认；新方向退回 `select` |
| **Verify** | `review` + deterministic `audit` + visual acceptance | 只读 findings、机器证据、视觉证据和用户决定 | 适用门禁全部有外部证据；用户是最终批准者 |

## 转移规则

1. `discover` 只帮助找到资产；要应用时重新路由到 `select`，再进入 `adopt` 或 `replace`。
2. `$design-ingest` 只沉淀视觉 Design System / Theme layer，并先进入 reference/draft/theme-only maturity。要选择 Package、生成 OrderDraft 或进入实现，回到 `$ui-lab` 的 `select`。
3. `select` 可以使用隔离候选页或证据目录，但不得提前改消费者生产代码。
4. `adopt` 与 `replace` 互斥。已有产品默认 `adopt`；没有明确替换授权时不得升级为 `replace`。
5. `polish`、`motion apply` 与 `harden` 都受已批准 contract 约束；发现方向错误就停止并退回 `select`。
6. `review` 保持只读。它可读取或运行 deterministic audit，但不能修复、执行 selection approval、生成 OrderLock 或批准实现。

## Target chain 与 current fallback

目标链是 `Package@version → OrderDraft → selection approval → OrderLock → implementation → EvidenceBundle → acceptance/release`。selection approval 批准选择，implementation acceptance 批准实现，二者不得合并。

当前没有 `production-ready` Package 或公开 OrderLock 能力时，System Preset 只能作为 package-like candidate；`ui-lab.config.json` 仍是装配意图，`ui-lab.lock.json` 仍是 CatalogLock。以 `ui-lab --help` 与 Studio 实际能力为准，不能假装 dedicated skill 或 Order CLI 已存在。

## Verify 的三个独立结论

- [audit.md](audit.md)：证明当前 CLI 实际检查到的结构与装配契约。
- [visual-acceptance.md](visual-acceptance.md)：证明可比较条件下的视觉差异与证据角色。
- Human approval：分别记录 selection approval 与 implementation acceptance；只有后者连同完整 EvidenceBundle 才能决定 acceptance/release。

任何一项通过都不能推导另外两项通过。
