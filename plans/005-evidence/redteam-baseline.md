# UI Lab 目录与资产体系红队审查

日期：2026-10-03

独立审查子 Agent：Peirce。审查基准：a00c627。下文为子 Agent 报告，父 Agent 抽查了安装映射、Drawer、Skill 查询和 Lock 调用证据。仅评审，所有修正路线都是建议，没有据此批准新产品范围。

父 Agent 验证：`bun run check` 通过；Biome 617 文件、3 条技能模板 warning、无 error；104 个 registry 组件；43 项双态 workbench Token；14 个主题项；6 个 Skill 测试。`bun cli/src/index.ts --help` 已核对。未运行 build、消费项目安装或全库浏览器验收。

方法论补充：关注点分离应依据变化原因，不是文件大小。参考 [SRP 原始说明](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)。浏览导航、机器领域分类和分发类型各有职责，不要求一一对应，参考 [shadcn registry item 规范](https://ui.shadcn.com/docs/registry/registry-item-json)。源码所有权 family 与安装依赖闭包是不同概念；第5项应视为消费者诊断/验证能力缺口，而不是要求抹平这一区分。第8项是需要真实消费安装验证的风险，不能推广成所有增量组件安装必然覆盖主题。

---

审查完成。**当前七个入口与按职责分类的方向合理，可以保留；但它还不是覆盖组件、模板、完整页面、整站与升级维护的完整资产系统。主要问题在资产之间的契约和 AI 使用链路，优先修复这些问题，比重排文件夹更有价值。**

本次审查当前 HEAD `a00c627`，覆盖产品定义、分类 ADR、Application Kit、导航、Catalog、registry、Recipe、Theme Kit、CLI、Skill，以及代表组件和预览。只读审查，没有修改、提交或推送。

### 分类与目录判断

| 层次 | 判断 | 建议 |
|---|---|---|
| 词典 | 合理，负责命名和发现 | 指向真实资产，不复制实现 |
| 组件 | 合理，按界面职责分类 | 保留现有源码位置，用元数据归类 |
| 区块 | 合理，承载已组织的布局 | 明确它引用哪些可安装组件 |
| 页面 | 分类合理，内容尚不完整 | 当前主要是空间骨架，应与完整页面资产区分 |
| 整站 | 需要进一步定义契约 | 共享外壳加页面引用；当前工作台外壳不等于多页整站 |
| 主题／系统 | 分离方向正确 | 主题负责取值，系统负责共享规则，明确覆盖与补缺行为 |
| Recipe | 有必要 | 保留组合约束职责，完整页面源码另有承载 |
| 灵感 | 合理 | 保留参考来源与 provenance，不暗示可安装 |

“模板”建议作为用户的查询语言，明确映射到**页面模板、整站模板或组合 Recipe**，避免再创建一个职责含混、重复保存源码的层。

人的七个浏览入口、Catalog kind 与 shadcn registry type 属于不同层，不需要一一对应。`registry:block` 可承载复杂组件，不应单凭这个类型判定产品分类错误。

### 主要发现

**1. P1｜实现缺陷：AI Catalog 给出了不存在的安装入口。**

[Catalog](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:129) 按展示 slug 生成安装命令，但 [registry](/Users/zhoujw/develop/github/ui-lab/lib/registry-server.ts:191) 在有安装变体时只分发变体。

诊断确认以下 7 个条目的 `.json` 安装入口不存在：

`button`、`text-animation`、`number`、`action-swap`、`scroll-animation`、`not-found`、`empty-state`。

实例：`button.json` 对应 builder 返回 `null`，`button-base` 可以构建；CLI `add button` 打印无效入口，`show button-base` 却报告不存在。[SaaS Recipe](/Users/zhoujw/develop/github/ui-lab/lib/recipes.ts:182) 又把 `button` 登记为必装组件。

**影响：** AI 遵循机器真源也会安装失败，检查通过未发现这条跨层断链。

**最小建议：** 明确展示条目与真实安装目标的映射，公开变体安装身份及其 source family；增加 Catalog 安装命令到 registry item 的交叉验证。

**2. P1｜实现缺陷：模态组件的声明与键盘行为不一致。**

[Drawer](/Users/zhoujw/develop/github/ui-lab/components/motion/drawer.tsx:34) 仅处理 Escape 与滚动锁，却[声明模态对话框](/Users/zhoujw/develop/github/ui-lab/components/motion/drawer.tsx:68)。未实现初始焦点迁入、Tab 约束、背景不可交互与关闭后的焦点恢复。BottomSheet 有同类声明。

**影响：** AI 直接复用可能把交互缺陷传播到消费者。模态窗口应管理焦点并阻止背景交互，ARIA 属性本身不能完成这些行为。[W3C 模态对话框模式](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)。

**最小建议：** 用 shadcn 对应基础交互承载现有视觉和动画，补键盘与焦点验证。这里是静态代码确认，未做浏览器键盘实测。

**3. P2｜规划缺口：页面与整站尚未成为完整可复用资产。**

[页面入口](/Users/zhoujw/develop/github/ui-lab/app/[locale]/pages/page.tsx:26) 列出布局骨架；[骨架类型](/Users/zhoujw/develop/github/ui-lab/lib/patterns/types.ts:12) 提供 CSS、prompt 与响应式说明。[整站入口](/Users/zhoujw/develop/github/ui-lab/app/[locale]/sites/page.tsx:26) 只有工作台外壳链接，没有多页面引用清单。

**触发实例：** 用户选择“列表详情页面”或“Agent 整站”，AI 得到的是布局方向或外壳，尚无确定的完整页面／多页组合可复用。

**影响：** 入口名称与资产成熟度有差距；后续若把骨架、Recipe、完整源码都叫模板，会出现重复真源。

**最小建议：** 先定义并完成一个完整页面和一个多页组合。页面承载真实实现，Recipe 描述约束，整站引用页面和共享外壳；再据此决定新增目录与机器类型。这属于新目标下的规划缺口。

**4. P2｜AI 链路缺口：人可见的新知识尚未进入机器主入口。**

[Catalog builders](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:441) 未聚合 concepts、motions、sections 或 patterns；llms 端点消费相同 Catalog。

另有明确查询错误：[Skill](/Users/zhoujw/develop/github/ui-lab/skill/ui-lab/references/discover.md:26) 指导 `list --kind block`，实际区块是 `kind: component / category: blocks`。实测该命令返回 `[]`。

**影响：** 人看到的 section 变体与词典信息，AI 无法从统一入口发现；还可能错误判断不存在区块。

**最小建议：** 修正 Skill 查询，提供 category 筛选；为现有词典、section 和 pattern 增加机器投影、资产引用及可安装标记。无需强行给每个导航入口增加 kind。

**5. P2｜架构风险：分发闭包与审计 source family 使用不同事实。**

[分发](/Users/zhoujw/develop/github/ui-lab/lib/registry-server.ts:315) 递归收集 import 图；[Catalog](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:148) 只登记入口与人工 `extraFiles`。[Audit](/Users/zhoujw/develop/github/ui-lab/cli/src/audit.ts:548) 仅对 Recipe 必装项检查 sidecar，独立添加项主要检查入口文件。

实例：`prompt-input` 实际依赖 Select、MorphPopover、Button family、hook 和公共 lib，Catalog 没公开这份运行依赖闭包。

**影响：** 分发能够带走依赖，但 AI 适配、排查或审计时缺少相同信息。“拥有的源码 family”容易与“完整安装依赖”混淆。

**最小建议：** 分别公开 owned source family 与安装依赖闭包，后者从现有 graph builder 生成。区分必需依赖缺失和可选 family 未引入，不要求 vendored 源码保持原样。

**6. P2｜变化隔离风险：增量添加会重写全部 Lock 基准。**

[`add`](/Users/zhoujw/develop/github/ui-lab/cli/src/index.ts:475) 和 [`compose`](/Users/zhoujw/develop/github/ui-lab/cli/src/index.ts:729) 都按当前 Catalog 全量重建 Lock。[组件 hash](/Users/zhoujw/develop/github/ui-lab/cli/src/project-lock.ts:50) 主要包含 fetch 地址与文件路径，不包含源码/API版本。

**触发实例：** 上游改变已有契约后，消费者添加一个无关组件，已有项的旧 Lock 基准也被更新；随后难以发现此前发生的契约漂移。源码变化但路径不变，也不会改变组件 hash。

**影响：** 现有 Lock 可以记录当前元数据选择，但还不足以支撑可靠升级维护。

**最小建议：** 增量命令只更新新增项，保留已有基准；显式 `lock` 承担重建。维护阶段再补资产版本、provenance 与变更比较，不把 Lock 扩大成安装或批准记录。

**7. P2｜失败隔离风险：读写命令共用自动回退策略。**

[CLI 来源加载](/Users/zhoujw/develop/github/ui-lab/cli/src/catalog-source.ts:129) 对显式 registry 失败自动回退快照，随后继续供给 compose、add、lock 等写操作。在线数据只检查 `items` 为数组。

[Catalog 构建](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:452) 也会跳过失败 builder，而[快照生成](/Users/zhoujw/develop/github/ui-lab/scripts/gen-catalog-snapshot.ts:5) 可继续输出部分结果。

**影响：** Agent 指定某部署源，失败后却可能基于另一份数据修改消费者配置。容错提升可用性，但来源和完整性变化只通过日志表达。

**最小建议：** 只读发现保留回退；写操作对显式来源失败明确报错，或要求显式 fallback 参数。发布快照验证必需域完整，结果携带来源与完整性信息。

**8. P2｜架构风险：共享工作台系统的分发类型带有主题覆盖语义。**

[`system-workbench`](/Users/zhoujw/develop/github/ui-lab/lib/registry-server.ts:383) 使用 `registry:theme`，同时 Theme Kit 也定义相同变量。例如 Pearl 的 `wb-accent` 是 `#0071e3`，默认系统是 `#339cff`。

直接安装该系统项时，主题类型具有覆盖变量的语义；这与“共享系统只补缺、不覆盖已选主题”的目标存在张力。

**边界：** 核对官方实现后，不能声称普通组件安装会因嵌套主题依赖就必然覆盖既有主题；覆盖判断与直接请求的安装项有关。[shadcn 安装逻辑](https://github.com/shadcn-ui/ui/blob/main/packages/registry/src/utils/add-components.ts)。

**最小建议：** 分开补缺型系统依赖与显式主题覆盖职责，验证直接、间接两种安装路径。本轮未实际运行消费者 shadcn 安装。

### 生命周期覆盖

| 阶段 | 当前覆盖 | 主要缺口 |
|---|---|---|
| 发现、命名 | 词典、活样本、Catalog、CLI | 人与 AI 视图未完整对齐 |
| 组件、区块复用 | 源码和递归依赖分发 | 安装身份映射、依赖信息 |
| 模板、完整页面 | 骨架、区段、Recipe | 完整页面资产 |
| 整站 | 工作台外壳 | 多页引用与组合实例 |
| 主题、系统 | Theme Kit、CSS、共享 token | 补缺与覆盖一致性 |
| 装配、集成 | Profile、计划、配置、props／slots | 真实页面组合及消费者运行证据 |
| 验证 | 根仓门禁、基础 Audit、部分测试 | 键盘、运行、视觉等独立验证 |
| 升级维护 | CatalogLock、vendored source | 旧基准保留与变更比较 |
| 发布运行 | UI Lab 自身部署 | 消费者部署等在现行范围外 |

### 架构原则与优先级

**关注点分离已有基础，变化隔离不足，复杂度主要来自重复事实。** 同一资产的展示身份、安装身份、依赖图、sourceFiles、CLI 类型和 Skill 命令分别维护，扩张时容易遗漏。当前 Catalog 与冻结快照的契约一致，不能把所有问题归咎于快照未刷新。

建议保留七入口、现有源码路径、独立数据模块、Recipe 与 CLI 边界。不要先做全仓目录迁移，也不要把站点演示直接升级为分发源码。

优先顺序：

1. **先修现行断链：** 安装身份、Skill 查询、模态交互。
2. **再保护变化：** Lock 增量更新、来源失败处理、主题补缺行为。
3. **补机器事实：** 词典与组合知识投影、真实安装依赖闭包。
4. **再落实新目标：** 明确模板与生命周期边界，以完整页面和多页组合实例驱动目录扩展。

父 Agent 已报告 `bun run check` 全通过；本审查另完成只读 CLI 与 builder 诊断。**未验证**全库所有组件、浏览器全站体验、消费者真实安装、Greenfield、已发布 npm 包及视觉验收。上述结论是架构与代表路径评审，不是全库质量认证。

