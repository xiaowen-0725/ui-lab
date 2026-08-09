# UI Lab 产品定义

> 本文是 UI Lab 的产品北极星。架构、Skill、CLI、Catalog、benchmark 与消费项目文档若与本文冲突，以本文为准。未实现能力不得写成 current implementation。

## North star

UI Lab 是一个中文优先、中英双语的 **可视前端词汇表与 AI-first 可组合资产系统**。

它把难以准确描述的组件、区块、设计风格、视觉 token 与页面组合做成可看、可命名、可查询、可复制和可审计的真实资产。人负责产品语义和最终选择；AI 负责在已有 Catalog、registry 与 Recipe 契约内查询、安装和装配，不临场发明不存在的系统。

当前产品目标是让人和 AI 共享同一份事实：

- 人能从活样本认出想要的组件、风格和组合；
- AI 能读取准确名称、双语描述、prompt、token 与源码入口；
- 组件通过 shadcn-compatible registry 分发完整 source family；
- Recipe 明确 slots、states、responsive、assets、required 与 forbidden；
- 消费项目可用 config、CatalogLock 与 Audit 检查基础装配一致性。

## Current implementation

当前真实存在的产品对象只有：

- **Catalog**：统一聚合 `component`、`atom-set`、`icon-style`、`icon-motion`、`style`、`palette`、`design-system` 与 `recipe`；
- **Registry**：分发可 vendoring 的组件和区块源码；
- **Theme Kit**：提供可运行的主题与 token，不代表完整应用系统；
- **Recipe**：描述页面或应用外壳的组合约束，不承载业务逻辑；
- **CLI**：提供查询、查看、Theme Kit、组件登记、Recipe compose、CatalogLock 与 Audit 等当前 `ui-lab --help` 可见命令；
- **Skill**：`$ui-lab` 只路由已有组件/区块的 discover 与 install；其他产品工作流不属于它的当前能力。

`ui-lab.config.json` 只表达 Profile、System、Recipe、组件与 adopt/replace 装配意图。`ui-lab.lock.json` 只保存当前 Catalog contract/provenance 的 **CatalogLock**。Audit 只验证已实现的确定性规则，不能替代视觉判断、业务验证或用户批准。

## 已移除的工坊实验

此前的 `/studio`、Token Studio、Assembly Studio、System Preset、Order Manifest、candidate evidence 与 checkout/confirmation 已从仓库完整移除。共享 Greenfield benchmark 仅保留为 Graphite + Agent Workbench 工程回归夹具；旧 System Preset binding 与批准语义已删除，它不代表新的产品方向或用户批准。

这些对象不再是当前能力，也不是默认未来方案。仓库不得保留对应路由、Catalog kind、CLI 分支、Skill route、API、截图、测试或“已批准”状态；历史 CHANGELOG 与历史 benchmark 基线可以保留事实记录，但必须明确标记为已退役。

未来如果重新讨论创建器、视觉选择面或更高阶交付协议，必须先形成新的产品定义和用户批准，再决定对象、术语、交互和机器契约。不得直接复活旧 Studio 或旧下单生命周期。

## 条目公式

词汇条目遵循统一公式：

**活样本 + 名字（中英 + 别名）+「对 AI 这样说」prompt + 可选配方**

prompt 只帮助发现和沟通，不能替代语义组件、Recipe、真实源码或用户判断。

## Application Kit 当前边界

Application Kit 当前只负责：

- React 19、TypeScript、Tailwind CSS 4 与 Next/Vite/Electron renderer 的 Profile 边界；
- Theme Kit、字体、图标、颜色、间距、圆角、阴影、动效与图表 token；
- Primitive、Component、Block 的 source family；
- Recipe 的 section、slot、state、responsive、asset、required 与 forbidden；
- `ui-lab.config.json`、CatalogLock 与确定性 Audit。

Application Kit 不负责：

- 替用户决定业务领域模型、产品规则或最终信息架构；
- 用 Theme、skin 或 token 冒充完整应用设计系统；
- 为套用组件而改变业务语义、API/IPC、路由或可访问行为；
- 替代人工视觉验收、目标运行时测试或通用体验评审；
- 声称存在未公开的 Package、Order、Evidence、Create、Studio 或 approval 能力。

## AI 行为边界

AI 必须：

- 先查询 Catalog 和 registry，存在就复用完整 source family；
- 只运行当前帮助中真实存在的命令；
- 区分 Theme Kit、Recipe、config、CatalogLock、Audit 与最终产品判断；
- 对缺失能力、证据不足和契约冲突保持诚实；
- 未经用户明确授权，不修改消费者业务语义或制造批准记录。

AI 不得：

- 编造不存在的组件、路由、Skill、CLI/API 或确认状态；
- 把 screenshot、hash、Audit、测试或 Agent 判断写成用户批准；
- 把历史退役实验描述为现行架构；
- 因实现便利而扩大用户授权范围。

最终标准不是“AI 能生成一个页面”，而是：人和 AI 能基于同一套真实资产准确沟通、稳定复用，并对当前能力边界保持诚实。
