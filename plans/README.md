# UI Lab plans

| # | Plan | Status |
| --- | --- | --- |
| 001 | [Polish palette workspace state changes](001-palette-workspace-motion.md) | VERIFIED |
| 002 | [可操作视觉库：呈现方向决定](002-visual-library-presentation-decision.md) | 呈现方向已确认，详见能力边界 |
| 004 | [完整覆盖地图](004-visual-library-coverage.md) | 历史讨论方案，以当前产品定义为准 |
| 005 | [目录与资产体系调整：实施及验收计划](005-catalog-realignment-implementation-and-acceptance.md) | 本地工程验收通过，未发布 |
| 008 | [客户项目工作区：首版前端实现与验证](008-project-workspace-implementation.md) | 旧版本已删除，仅保留历史工程证据 |
| 009 | [SaaS Admin：需求与验收重新对齐](009-saas-admin-realignment.md) | 已对齐并移植，整改见013 |
| 010 | [SaaS 后台模板：完整规格与验收清单](010-saas-admin-spec.md) | 用户已确认；九类页面与整站已接入，视觉批准另记 |
| 011 | [SaaS Admin：首步移植与验证记录](011-saas-admin-implementation.md) | 完整模板本地工程验证；视觉/素材边界单独记录 |
| 012 | [SaaS Admin：界面规范与 React 最佳实践审查](012-saas-admin-guidelines-review.md) | 已审查，整改见013 |
| 013 | [SaaS Admin：指南整改与回归验证](013-saas-admin-remediation.md) | 本地整改及验证，非发布批准 |

## 当前执行入口

计划 005 汇总本轮目录调整、现有资产迁移和红队问题闭环。逐项基线见 [迁移台账](005-asset-migration-inventory.csv)，实施准入、验收及复测进度见 [验收台账](005-acceptance-tracker.md)。

用户给出的参考方向按日期追加到 [direction-reference-sites.md](direction-reference-sites.md)。历史计划不自动成为当前已实现能力或新的产品批准。

SaaS 后台模板的决定记录为计划009，当前可审阅实施规格为计划010；计划008的自有组件实现已删除，文档仅保留历史工程记录，不能替代新需求验收。

计划005最终交付：[验收报告](005-acceptance-report.md)（含完整目录）、[独立准入复核](005-evidence/final-independent-acceptance.md)。
