# 计划005独立审查：spec

基线 `a00c6278b57012d791c14825857e411b5e208455`；2026-10-03 未提交工作区。按 `git diff a00c627 -- . ':(exclude)skills-lock.json' ':(exclude).grok'` 和 `git ls-files --others --exclude-standard` 审查，并读取新增资产文件；排除 `.grok/`。工作区由主 Agent 持续修改，本报告是读取时点结论。未编辑产品代码、未 commit/push；复现只写临时目录。

## 主要发现（400字内）

- **P2／R5（E1）**：Audit 猜测根目录，不按实际 TS 解析；根目录同名文件可掩盖 `src` 缺依赖，合法 `.js`→`.ts` 引用及代码字符串又会误报。用语法解析与消费者模块解析替代正则/路径猜测。
- **P2／R1、R7（E2）**：显式源包含不存在的 Recipe section 变体，`compose` 仍退出0并写 config/Lock。校验 section→真实安装变体后才允许写入。
- **P2／R3、R4（E3）**：完整页/整站与 Recipe 尚无机器关联；查询配方不能发现新增完整资产。补显式关联，保留原配方语义。
- **P3／七入口（E4）**：页面列表同时枚举 PAGES 和其 registry 投影，四个页面各出现两次。按 slug 去重并统一详情地址。

## 规格与证据

| 编号 | 规格原句及位置 | 代码、触发场景与结果 |
| --- | --- | --- |
| E1 | [规格:115](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:115)：“移除必需helper时能发现；可选变体不误报”；[规格:120](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:120)：“R5 不是要求扩大文件所有权到所有依赖”。 | [audit.ts:360](/Users/zhoujw/develop/github/ui-lab/cli/src/audit.ts:360)、[audit.ts:373](/Users/zhoujw/develop/github/ui-lab/cli/src/audit.ts:373)。临时消费者的 `@/*` 仅映射 `src/*`：删 `src/lib/ease.ts`，保留根 `lib/ease.ts`，TS 解析失败但 Audit `ok=true`。另 `./helper.js` 正确解析到 `helper.ts`，Audit 报 incomplete；字符串内的 `import` 也被误认依赖。 |
| E2 | [规格:15](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:15)：“所有发布的安装地址、变体、依赖和 Recipe 引用有效”；[规格:117](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:117)：“显式源失败的写命令不改config/lock”。 | [catalog-source.ts:295](/Users/zhoujw/develop/github/ui-lab/cli/src/catalog-source.ts:295)只校验 section 字段形状；[catalog-source.ts:325](/Users/zhoujw/develop/github/ui-lab/cli/src/catalog-source.ts:325)只交叉核对组件/系统；[index.ts:741](/Users/zhoujw/develop/github/ui-lab/cli/src/index.ts:741)继续写入。全量快照仅把 SaaS section 改为 `hero/does-not-exist`，HTTP 显式源 `compose` 退出0并生成绑定和 Lock。 |
| E3 | [规格:99](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:99)：“补 Recipe/页面/整站关联”。 | [catalog.ts:161](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:161)页面/整站只关联组件；[catalog.ts:443](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:443)配方投影没有完整资产关联。[recipes.ts:181](/Users/zhoujw/develop/github/ui-lab/lib/recipes.ts:181) SaaS 配方仍指 recording-card；新增页不是同一变体组合，不能简单宣称二者等价。触发：AI 查询 `show saas-landing --kind recipe`，得不到完整页引用；Workbench 配方也未关联多页实例。这是关联缺项，不是消费者运行失败。 |
| E4 | [规格:168](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:168)：“一个名字指向明确资产”。 | [pages/page.tsx:27](/Users/zhoujw/develop/github/ui-lab/app/[locale]/pages/page.tsx:27)与下一行重复枚举；[registry.ts:70](/Users/zhoujw/develop/github/ui-lab/lib/registry.ts:70)已经把 PAGES 投影进去。访问 `/pages` 或 `/en/pages`，四个完整页分别出现 `/pages/*`、`/components/pages/*` 两张同名卡片；两路都有实现，但后一路是额外重复入口。 |

E1 临时证据目录：`/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-spec-audit-UhFRB7`（漏报）、`uilab-spec-audit-jVH4dW`（后缀误报）、`uilab-spec-audit-zDhrms`（字符串误报）。E2 可复跑 [临时脚本](/tmp/uilab-005-spec-section-probe.ts)；[实际CLI/HTTP结果](/tmp/uilab-005-spec-section-probe.json)。

## 已验证与准入待办

本轮 `bun test tests/catalog-contract.test.ts tests/cli-integrity.test.ts tests/installation-audit.test.ts tests/application-assets.test.tsx tests/modal-dialog.test.tsx`：75 pass、0 fail、635 assertions、退出0；新增导航测试：1 pass、0 fail、9 assertions、退出0。这些正向回归未覆盖 E1/E2。

R1 七个父入口已能构建，变体独立身份和 sourceVersion/安装闭包已公开；R2 模态焦点、嵌套及恢复 DOM 回归通过；R3 页面与整站有真实源码，站点 sections 演示复用同一实现，多页壳引用独立页面；R4 词典/参考已进入 Catalog 且 Skill 区块查询修正；R6 旧 Lock 基准/逐项来源保持及显式重建回归通过；R7 连接/超时/畸形及多数引用失败回归通过，但有 E2；R8 改为补缺型系统，台账有真实 shadcn 证据，本轴未独立重跑。未发现恢复 Studio/Order 或业务后端的范围膨胀。

**准入待办，不能写成失败**：主 Agent 补完文档/current implementation、595项迁移/深链对账及快照一致性；实际 Next/Vite/Electron renderer 安装与运行、全安装URL HTTP、消费者键盘/触屏/reduced-motion、明暗响应式与视觉记录；根仓/CLI构建与 Greenfield、R8 独立复核、发布授权及线上复验。以 [台账](/Users/zhoujw/develop/github/ui-lab/plans/005-acceptance-tracker.md) 的实际证据关闭 R-ID；本轮单测通过不表示整体工程或视觉验收通过。
