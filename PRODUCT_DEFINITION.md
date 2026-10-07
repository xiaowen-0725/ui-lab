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

- **Catalog**：统一聚合 `component`、`atom-set`、`icon-style`、`icon-motion`、`style`、`palette`、`design-system`、`recipe`、只读 `vocabulary` 与外部 `reference`；
- **Registry**：分发可 vendoring 的组件、区块、完整页面与多页组合源码，展示父项和独立安装变体都有真实安装身份；
- **页面与整站资产**：19 个可复用区段变体、4 个完整页面和一个引用独立页面的 Agent 多页工作台；`lib/pages.ts` / `lib/sites.ts` 登记实际源码及依赖，不复制页面实现；
- **Theme Kit**：提供可运行的主题与 token，不代表完整应用系统；
- **Recipe**：描述页面或应用外壳的组合约束，不承载业务逻辑；
- **CLI**：提供查询、查看、Theme Kit、组件登记、Recipe compose、CatalogLock 与 Audit 等当前仓库 `ui-lab --help` 可见命令（新增源码尚未代表 npm 已发布）；
- **Skill**：`$ui-lab` 只路由已有组件/区块的 discover 与 install；其他产品工作流不属于它的当前能力。

`ui-lab.config.json` 只表达 Profile、System、Recipe、组件与 adopt/replace 装配意图。`ui-lab.lock.json` 只保存当前 Catalog contract/provenance 的 **CatalogLock**。Audit 只验证已实现的确定性规则，不能替代视觉判断、业务验证或用户批准。

## 已移除的工坊实验

此前的 `/studio`、Token Studio、Assembly Studio、System Preset、Order Manifest、candidate evidence 与 checkout/confirmation 已从仓库完整移除。共享 Greenfield benchmark 仅保留为 Graphite + Agent Workbench 工程回归夹具；旧 System Preset binding 与批准语义已删除，它不代表新的产品方向或用户批准。

这些对象不再是当前能力，也不是默认未来方案。仓库不得保留对应路由、Catalog kind、CLI 分支、Skill route、API、截图、测试或“已批准”状态；历史 CHANGELOG 与历史 benchmark 基线可以保留事实记录，但必须明确标记为已退役。

未来如果重新讨论创建器、视觉选择面或更高阶交付协议，必须先形成新的产品定义和用户批准，再决定对象、术语、交互和机器契约。不得直接复活旧 Studio 或旧下单生命周期。

## 分类原则

分类遵循单一职责、可组合、可分发。术语见 [CONTEXT.md](CONTEXT.md)。取舍见 [docs/adr/0001-component-classification.md](docs/adr/0001-component-classification.md)。

- **单一职责**：一个名字只做一件事。体积不改变分类。
- **可组合**：区块引用组件，页面引用区块和组件，整站只登记页面名字。上一层不把下一层的源码再写一遍。
- **可分发**：定义时的名字、接口和源码，就是引入后得到的那一份。预览、文档和 registry 安装结果一致。prompt 只帮助发现，不能另生成一份替代品。

组件是一个名字、一个安装入口、一件界面上的事。动效组件和 shadcn/ui 原语都是组件。区块是一段已经排好的布局，一次安装带走它引用的组件。页面是一屏。整站是多屏共用的壳，只引用页面。

站点使用 Next.js 15；可安装组件、页面与多页组合使用 React 19、TypeScript、Tailwind CSS 4，支持按需组合 shadcn-compatible 原语与 Motion 动效，框架适配放在消费项目。具体复用选择见[组件化与依赖方向](CODING_STANDARDS.md#组件化与依赖方向)。新增或参考外部资产时按 [语义与命名规则](CODING_STANDARDS.md#语义与命名) 独立定义本项目名称及接口。现有 `components/motion` 与 `components/agents` 的文件位置先保持不动；之后按本原则重分类，不按本原则批量搬迁。

### 目录与安装契约

`assetRole` 独立声明 component / block / page / shell / site，历史 category 和源码路径保留兼容。`installTargets` 区分展示族及变体；`sourceFiles` 是拥有的源码，`installationFiles` 是必需 import 闭包，`sourceVersion` 是原始闭包内容的 SHA-256 修订摘要。独立页面与配方可以是示例关联，不意味着两份组合语义完全等价。详见 [ADR 0002](docs/adr/0002-catalog-roles-and-install-identities.md)。

只读词条保留 prompt/token 和真实资产关联；外部参考保留 provenance / 权利信息，没有安装命令。必需 Catalog 领域、安装身份及 Recipe section 引用失败时停止发布快照。

增量 add / compose 保留已有 CatalogLock 基准和逐项来源；显式 lock 才重建。显式线上源失败时，写入命令失败且不改 config/lock；只读发现可以注明来源后回退快照。Audit 用消费方 TypeScript 解析实际 vendored imports，允许合法源码适配，发现缺失的真实 helper；不据此宣称源码/API 或视觉完全相同。

### Token 分发

Token 分三桶。安装组件时只带走它真正依赖的那一桶，并且是合并，不是覆盖。

| 桶 | 现在的东西 | 安装时 |
| --- | --- | --- |
| 主题里已有 | `globals.css` 的语义色：`background`、`foreground`、`primary`、`card`、`border`、`accent`、`destructive`，以及 `success`、`warning`、`danger`、`border-strong`。明暗成对。Theme Kit（`lib/theme-kits/`）是一整套取值，含 shadcn 语义、`--wb-*`、图表色、圆角、间距、字号和缓动的 CSS 静态值 | 项目初始化或用户选定 Theme Kit 时写入。之后安装组件不得重写这些变量 |
| 按需带走的系统 | `lib/ease.ts` 的 `EASE_*` 与 `SPRING_*`。组件 import 它，registry 发布时把这个文件打进组件包。`lib/atoms/motion.ts` 只是这同一份值的目录说明，不是第二份可编辑的源。`use-hover-capable` 这类共享钩子同样随 import 带走 | 组件声明依赖。已存在则跳过。不因为装一个按钮而装上整套主题或全部动效文档 |
| 组件私有 | 只有一个组件使用、且语义层表达不了的值。今天多数组件没有私有 CSS 变量 | 写在该组件自己的 `cssVars` 上，名字带组件前缀。不得提升进 `lib/ease.ts` 或主题 |

`--wb-*` 只服务 Agent 工作台。Theme Kit 里已经带有同一份值。工作台组件不再各自写入 `cssVars`，只依赖单独的系统项 `system-workbench`（`/r/system-workbench.json`）。该系统项为补缺型 `registry:lib`，直接或间接安装均保留已有变量；显式 `theme-*` 才替换主题。安装该系统项时合并这一份变量；之后再装工作台组件不会把整份变量再写一遍。

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
