---
name: inspiration-triage
description: "核验、分类并决定是否收录灵感网站与目录。用户显式使用 $inspiration-triage，或贴网址、截图、单站、批量链接、灵感目录或好看网站并要求收藏、收录、分类、归档或去重时使用。"
---

# 灵感分诊

把候选对象归入 UI Lab 灵感库的正确位置，给出可复核的收录判断；不把视觉风格直接沉淀为设计系统。

## 工作流

1. 先读 [references/taxonomy.md](references/taxonomy.md)，再读仓库 `AGENTS.md`、相关项目文档与现有模块约定。`docs/research/inspiration-source-directory.md` 只是已有研究证据，可按需引用，不是运行必读文件或数据真源。
2. 确认输入范围：逐个处理 URL、截图或用户描述；截图无法确定原站时，要求用户补 URL 或标为 `watch`，不要臆测归属。
3. 对每个 URL 实时浏览。优先使用站点首页、About、FAQ、Terms、官方 GitHub 或作者页面等第一方证据；记录最终 URL、canonical、重定向及常用别名。动态数量、榜单位置和“每日更新”等会变化的信息只在本次报告中表述，不写成永久事实。
4. 在当前批次和现有真源中去重：用 canonical URL、根域、品牌名/别名、已知迁移关系比对。合并同一对象的备用网址；只有内容与维护主体确实不同才保留为独立条目。
5. 按 taxonomy 选 `entryKind`：`source` 选**唯一** `primaryTheme`，再酌情填 `secondaryThemes`、`contentTypes`、`useCases` 与 `visualTraits`；`site` 与 `brand` 选**唯一** `domain`，站点再填 `pageTypes`、`visualTraits`、可选 `badges`，两者都可关联专题 `collections`。按“用户未来为什么会来找它”决定领域或主组，不按站点自称、技术实现或视觉风格决定；`retro-web` 是专题，不是领域。
6. 评估公开访问、登录/付费边界、素材权利与证据质量，给出 `accept`、`watch` 或 `reject`，以及 `high`、`medium` 或 `low` confidence。外部图片、PDF、logo、截图、演示稿默认 `external-only`；用户或权利人明确授权 vendoring 时可保存真实截图或品牌资产，但必须记录原始 URL、最终 URL、采集日期、素材类型和权利归属，不得以生成的假网页冒充官网截图。
7. 检查灵感模块的数据真源：先用 `rg` 搜索 inspiration 相关数据与路由，优先服从项目文档。若规划中的 `lib/inspiration.ts` 存在，做最小、双语的落库修改，保留 `provenance` 与 `reviewedAt`；若不存在，**不要创建它或猜测替代数据文件**，改为输出可直接落库的记录。不要把 `source` 加进 Catalog，除非项目约定后来明确改变。
8. 每次都输出简短分诊报告和证据链接。`accept` 但未落库时，附 ready-to-land record；`watch`/`reject` 说明缺什么或为什么不适合。若用户明确想把已接受站点的视觉风格做成可复用皮肤，建议其后续触发 `design-ingest`，但不要擅自执行。

## 输出纪律

- 对批量链接给一张紧凑表：候选、canonical/别名、种类、主组、结论、置信度；再给每项 1–3 条第一方 evidence。
- 用 taxonomy 中的枚举值；未知信息显式写 `unknown`，不要补造版权、更新时间或内容数量。单站不得同时填多个领域；“知名”“好看”只通过 `badges` 表达，不能当作领域。
- 默认收录索引与分析；仅在明确授权 vendoring 时保存第三方资产副本。无论哪种模式都要保留外链、来源、核验/采集日期和必要归因，预览图整块应链接回原站。
- 仅在已有真源确实存在时修改数据；修改后按仓库约定做最小验证。没有数据落库时不运行无关构建。
