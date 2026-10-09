# SaaS 后台候选职责：现有资产与外部基础能力复用审计

日期：2026-10-07。研究票：[现有资产与外部基础能力能否支撑 SaaS 后台？](https://github.com/xiaowen-0725/ui-lab/issues/27)。本地分支：`research/site-template-reuse`；源码基准：`bca736ad89052406667e186d7f2b852943064906`。本报告是静态研究，不锁定最终页面集合或技术依赖。

## 结论及证据等级

- **fact（事实）**：已有资产提供通用列表、单元格编辑、命令入口、侧栏、方案展示、偏好设置与部分反馈状态；表格三种登记身份均指向同一 `Table` 源码，设置页仅有三项偏好。已登记的页面/整站主要是落地页和 Agent 工作台，不是完整 SaaS 管理后台。[R1][R2][R7]
- **inference（推断）**：这些能力足以成为后台的组合材料，但不能把“已有登记”解释为已经满足明暗主题、手机、完整键盘或实际业务流程。主要缺口是统一主题的导航与账单展示、可靠的模态/菜单行为、服务端列表与事务编辑契约，以及成员/发票等业务职责。[R3][R4][R5][R6][R7]
- **recommendation（建议）**：先明确职责、状态与消费接口，再复用同一 source family。同职责的主题/移动/内容差异优先作为变体或消费者适配；确有新的成员管理、账单记录、业务详情编辑职责再讨论新条目。不得为套用工作台改变业务模型，或因为官方示例采用某依赖就自动引入。[R0][R12]

“可直接复用”在下文仅指接口适合该项界面职责，仍需消费者安装和交互验收；不是运行通过或用户视觉批准。

## 复用矩阵

| 候选职责 | 已有资产与真实接口（fact） | 主题 / 移动 / 键盘及耦合缺口（fact 或明确推断） | 复用判断（recommendation） |
| --- | --- | --- | --- |
| 总览：关键数值与周期切换 | `activity-stats` 的 `StatsBar(children)`、`StatsItem(value,label)`、`StatsPeriodTabs(options,value,onChange)`；`stats-row` 对应 `StatsRow(locale,content.stats,className)`。[R8][R9] | 数值与标签可消费方提供，不做请求。StatsBar 水平 flex 且裁切/截断；StatsRow 固定三列、落地页较大留白。均不能据此确认手机长文案合适。StatsBar 明暗边框有 black/white 固定值，不是完全由 kit 控制。[R8][R9] | 指标与按钮可直接复用；密度、手机布局需要候选变体。无需为几个静态数字引入图表库。 |
| 总览：活动热图/趋势 | `ActivityHeatmap(data:number[],weeks,max,months,cellTitle,className)`，列优先、每列七格，默认 52 周。[R8] | 格子是带原生 title 的 span，没有本实现的键盘聚焦/读数替代；固定 11px 格子与浅/深蓝 `--heat-accent`。不能替代折线趋势、筛选或交互分析；是否需要这些职责尚待决定。[R8] | 活动频次语义吻合时复用；如需趋势图是新的候选职责，另评估官方 Chart，不把 chart token 当成已有图表。 |
| 列表：排序/选择/滚动 | `Table<T>` 接收 `data,columns,getRowId`；列有 `key,header,cell,sortValue,sortable,width,align`；选择和 sort 有受控/非受控接口。使用 `@tanstack/react-virtual`，默认 rowHeight 48、height 440。[R2] | 语义颜色与 overflow-auto 有利于主题/窄屏，但不是卡片式手机列表。排序 hook 始终对已传入 rows 本地排序，即使 sort 受控也没有 manual/server sorting 模式。没有内建过滤、页码、列可见性或错误/重试接口。稳定 id 必须显式传；默认 index 不宜作跨排序/刷新业务身份。[R2][R3] | 一般本地列表可直接复用；过滤器/工具栏/明确行动作由消费者组合。全量服务端排序与分页是契约缺口，候选变体先设计 manual 行为，不能只接 onSortChange 就宣称全局排序完成。 |
| 列表：异步加载 | 登记 `table-async` 仍导出同一 Table；接口 `loading,skeletonRows,onEndReached,emptyState`。用法示例本地创建三页数据、setTimeout 模拟加载，另有加载下一页按钮。[R1][R2][R10] | loading 暂停触底回调；无 hasMore/error/cursor/取消请求契约。示例按钮和 role=status 是演示包装，不自动成为 Table 的公开行为。固定高虚拟滚动、首屏不足以触发滚动时的补页需要实测。[R2][R10] | 复用滚动与骨架，真实请求、终止、错误、重试、可键盘触发“更多”留消费者；有重复需求再提变体。 |
| 详情/行内编辑 | 登记 `table-editable` 同样使用 Table；`editable` 列（设置 cell 时忽略 editable）、`onCellEdit(rowId,key,value:string)`、行列增删/改名回调。EditableCell 每次输入直接 onChange，没有保存事务。[R1][R2][R3] | 只有字符串编辑；未提供数字解析、字段校验、dirty/cancel/conflict、权限或提交失败状态。排序按钮有原生语义与 aria-sort，但 resize 按钮 tabIndex=-1、reorder 只有 pointer 事件；行列菜单手柄依赖 pointer 激活，TableMenu 虽有 Escape，没有实现箭头菜单导航/打开聚焦/恢复。[R3] | 可复用简单字符串编辑；业务详情页、事务表单属于新增组合职责。手机/纯键盘需要可见的操作入口或变体，业务默认不开放改列结构。 |
| 全局查找/命令入口 | `CommandPalette(items,shortcut,placeholder,emptyMessage,open,onOpenChange)`；每项有 id/label/group/keywords/icon/badge/onSelect。[R4] | 无 Next/next-intl import；本地模糊过滤，非服务端搜索。已有快捷键、方向键、Enter、Escape、初始输入聚焦与 body 滚动锁；未实现焦点限制、关闭恢复或背景 inert。dialog/listbox 名称及默认组 Results 固定英文；无 className。按组重排视觉顺序，但 Enter 取 filtered[active]：交错分组输入有错选风险（静态推断，未运行）。[R4] | 命令数据/动作接口可复用；作为模态必须先补齐焦点与本地化。分组按连续次序传入可暂时降低错选风险，仍需专项测试。 |
| 导航侧栏 | `CollapsibleSidebar(workspaceName,items,groups,rail,footer,collapsed,onCollapsedChange,activeId,onActiveChange,onSearch,className)`；item 是 id/label/icon/badge/children/onAction，不是 href。[R5] | 消费者负责 id 到路由映射；按钮导航无原生链接打开方式。固定浅色背景/文字/焦点色，宽度 268/56；无手机抽屉与移动 open 状态。折叠时标签 aria-hidden，而主项按钮没另外的 aria-label，有名称缺口风险；附加动作 hidden + group-hover，不能假设键盘或触摸可发现。[R5] | 桌面浅色导航结构候选复用；双主题/手机/链接导航/折叠名称需候选变体，不把树状 ul 当成完整 ARIA tree 键盘模式。 |
| 成员 | 通用 Table 的 cell 可渲染姓名、角色、邀请状态及动作；Input/Checkbox/Switch 可组合邀请与偏好。[R2][R11] | 已读的页面/整站登记没有成员页；上述组件未提供邀请/撤销/重发、角色变更、最后管理员限制或批量动作业务状态。未全库排除其他资产。[R7][R11] | 直接复用表格与输入；成员管理是消费方业务组合候选新职责，不复制第二份 Table、不将权限规则塞入通用组件。 |
| 账单：方案比较 | `BillingPlanGrid(plans,currentPlanId,interval,defaultInterval,onIntervalChange,onSelectPlan,className)`；plan 含 id/name/description/monthlyPrice/annualPrice/currency/cta/features，included/excluded heading 可替换。[R6] | 固定暗色与紫色；md 三列、窄屏单列，但未浏览器检查。Monthly/Annual/Current plan/Manage plan/Custom/月单位等固定英文。annualPrice 实际仍显示 /month + Billed yearly，需要确认是年付折算月价。feature 信息按钮无 onClick/tooltip；无交易 pending/error/禁用模型。[R6] | 方案数据与选择回调候选复用；统一主题/本地化/计价含义/交易反馈先对齐或做变体。不是发票、付款方式或订阅生命周期实现。 |
| 账单：升级提示/权益锁定 | `UpgradePaywall(title,description,actionLabel,onAction,icon,open,defaultOpen,onOpenChange,children,className)`。[R6] | 浅色固定值；遮罩打开时 children aria-hidden + pointer-events-none，但无 inert/焦点管理。CTA 调用同步 onAction 后 setOpen(false)，默认非受控模式会直接露出内容；aria-modal 不等于实际模态约束。它没有请求或鉴权能力。[R6] | 适合升级提示外观候选；真实权益门禁必须由消费方权限数据控制 open、请求与数据暴露。先决定提示卡是否真的模态，不能把点击 CTA 当升级成功。 |
| 设置：偏好组与完整小页 | `SettingsGroup(variant:card|quiet,title,actions,children)`、`SettingsRow(label,description,children)`、`SettingsTextField(value,onChange,placeholder,aria-label)`、ColorField；SelectButton 只是 onClick 触发器。完整 `WorkbenchSettingsPage` 有 locale/content/state/value/defaultValue/data/onChange/onAction。[R7] | settings-panel 使用 --wb-*，需 system-workbench 或 Theme Kit；并非仅靠 shadcn 通用色。页只覆盖 workspaceName/appearance/notifications，save/retry 回调无持久化；无字段错误、dirty、saving/save-failed 独立契约。行默认不折行，text field 固定 176px，窄屏长标签需确认。[R7] | 现有三项偏好页可直接复用，业务页可复用分组控件；组织安全、API keys、危险操作等是新的候选职责。选择主题只是值更新，消费方还要应用主题。 |
| 表单/状态反馈 | Input 支持 string value、onChange(string)、error:string|boolean、label/ref 和原生属性；Checkbox 支持受控 checked/indeterminate；Switch 受控 checked/onCheckedChange。StatefulButton 接 state=idle/loading/success/error 及各状态文案。[R11] | 非原生 onChange(event)，表单库需明确适配。Switch 不是提交值的原生 input。StatefulButton 表达状态并禁用 busy，不执行请求。StepForm 仅 text/email 或单选、内部值、onComplete Promise；选择后自动前进，失败仅回到 active，无错误文案；导航/required 文案固定英文。[R11] | 控件与反馈可直接复用；StepForm 适合分步采集候选，不等于带 initial values/完整校验/取消的详情编辑表单。 |
| 页面加载/空/错误 | `PageState(state:loading|empty|error,locale,content,onRetry,children)`，状态文本 role=status 或 alert；是 pages 内 helper。empty-state 族 shared 接 title/message/actionLabel/onAction/className。[R7][R11] | PageState 不在本次登记中被证实是独立安装身份；由设置页传递闭包带走。仅阅读 empty-state shared 接口，未读三个插画实现，不能声称全部主题或减少动效通过。[R7][R11] | 复用已安装页面的 helper 或现有空状态接口；保存错误、权限不足、部分失败需先定义，避免全用“空”表达。 |
| Theme Kit | `ThemeKit` 有 shadcn/wb/charts/extra/statics/fonts；graphite 明暗两套，design-system 派生 kit 只声明原生单模式。CSS 对缺失 mode 使用另一个 mode 值，两 selector 不等于双模式。[R12] | 图表色为 chart-1..6，不是图表实现；字体字符串不是字体资源加载证明。固定色侧栏/付费墙/账单不随 kit 全部改色，不能通过换主题消除差异；色彩可辨认性未测试。[R5][R6][R12] | 双主题需求下 graphite 是基线候选，需 HITL 视觉选择；token 合并/替换遵守既有安装边界，不整包覆盖消费者。 |

## 分发与站点/业务边界

**fact**：registry 将 table、command-palette、collapsible-sidebar、settings-panel 声明为 component，billing-plan-grid/upgrade-paywall/activity-stats 为 block；目录 blocks 或 motion 不能替代 assetRole。Table 变体的安装 slug 不代表三个独立算法。[R1]

**fact**：`lib/registry-server.ts` 的 collectSourceGraph 递归内部 import，提取外部包；生成 item 时去除 React 等基础包的分发依赖、按 --wb-* 内容或登记追加 system-workbench。源码闭包还涉及 cn 的 clsx/tailwind-merge、动效 hooks/ease、Checkbox、Billing 的 NumberTicker/共享图标等。实际 registry HTTP 载荷、安装时版本解析和文件落点本轮未生成/核验。[R13]

**fact**：根 package.json 有 `@tanstack/react-virtual`、motion、lucide-react、clsx、tailwind-merge；其 dependencies 中没有 `@tanstack/react-table`、recharts、react-hook-form、Zod 或另一套 UI primitive 包。本轮未审计所有独立 benchmark 包。[R14]

**inference**：Table 成本含虚拟滚动与其内部闭包；命令/侧栏/账单/付费墙主要带 Motion 与 helper，账单再带 NumberTicker。Settings 页/分组额外有工作台 token 补缺。这里只说明源码可见依赖类别，没有 bundle 字节、消费者 peer 冲突或独立安装成功证据。[R2][R4][R5][R6][R7][R13]

**fact**：已读可复用入口使用 props/回调，无 Next 路由/next-intl 直接 import。CommandPalette 使用 browser portal，Table 与侧栏有 client hooks；它们不是后端数据/鉴权层。WorkbenchSettingsPage 明确值/动作模型；PageState 和 helpers 的传递闭包应保持原样。补读 AgentWorkbenchSite 的接口和页面组合段后确认它引用三个独立页面、以 data/onAction/value/onChange 接入消费方；未展开 Workbench 外壳及会话/制品页的完整传递源码，不能据此判断整个壳适用任意 CRUD 后台。[R2][R4][R5][R6][R7][R15][R0]

## 独立安装与 demo coupling 补充

**用户已确认的交付要求**：页面、外壳、整站均可独立安装；提供无密钥运行示例；统一整站入口按用途筛选。这是产品要求与方向确认，不自动等于本轮已经安装、运行或验证入口完成。

| 事项 | 本轮源码可证实的 fact | 尚需验证或建议 |
| --- | --- | --- |
| 独立安装身份 | registry 的 pages/sites 由 PAGES/SITES 映射成 page/site 安装对象；agent-workbench 单独登记为 shell。allShadcnTargets 为公开父项保留 target，变体按 installSlug 单独登记；生成 registry item 时 page/shell/site 输出 registry:block。因而独立身份已经在登记/生成契约中存在。[R1][R13] | 尚未执行 registry item 生成、shadcn 安装、目标 Profile 构建和浏览器验收。独立安装是“带必需 import 闭包”，不是“只有一个文件”或“已具备服务端功能”。 |
| 示例和预览分离 | build item 从 comp.file/extraFiles 收集闭包，未将 usageFile/previewFile 自动作为源码入口。设置预览使用 next-intl、sample-data、ApplicationPreviewControls；设置安装入口本身不依赖这些预览模块。[R7][R13][R16] | 不应复制站点预览作为独立消费者页面；只替换 sample-data 并不能消除 provider 耦合。实际完整 import 图仍待安装核验。 |
| 视觉 demo 的局限 | Billing 预览有 ProductChrome、品牌侧栏、组织 tabs、固定当前 pro、无 onSelectPlan；侧栏预览另写 TASKS 表格与 GlobalRail，若干 onAdd/onMore 为 no-op。[R16] | 预览中的完整后台外观不等于 Billing 或 Sidebar 安装后包含那个页面。整页 tabs、任务清单、工具栏和组织动作不是这些资产已经实现的职责。 |
| 无密钥的本地动作示例 | 已读 billing/upgrade/command/sidebar 的 usage 示例只用静态数据和 useState：选择方案明确不扣款，付费墙只是预览关闭遮罩，命令和侧栏更新本地视图/计数。TableAsyncExample 用 setTimeout 模拟分页。[R10][R17] | 这是无密钥的源码示例证据，未执行运行。真实订阅、邀请、权限、搜索、数据持久化仍由消费者接入。示例增加的反馈文本/按钮也不是底层资产自动提供。 |
| 页面/整站示例完整性 | WorkbenchSettingsPageExample 与 AgentWorkbenchSiteExample 仅接收 ComponentProps 并传入 locale=zh 和 props；没有在文件内提供样本数据、可见动作反馈或消费者启动工程。[R15] | 不需密钥，但当前只是薄用法包装。要满足“可运行示例”，后续应给独立消费者的最小入口、样本 data、本地 callbacks 与启动步骤，再执行运行；本研究不新增示例代码。 |
| 主题与演示默认值 | Billing 的 plans 是必填，DEFAULT_BILLING_PLANS 作为导出常量仍在可分发源码里，但不被组件自动选用。ProductChrome 的 light/dark 是预览环境；实际 Sidebar/Billing/Paywall 内的固定色仍存在。[R5][R6][R16] | 给中文 plans 不会翻译固定按钮/单位，也不会使固定暗色自动随 Theme Kit 切换。保留默认方案为显式样本，业务应传自有数据；主题变体与样例选择分别决策。 |
| 按用途的统一整站入口 | 已读 SITES 是 Agent 多页工作台登记，含 aliases、pages、shellComponent、recommendedSystem，但未见该定义上的专门用途筛选字段。[R7] | 本轮未审计站点统一入口、筛选 UI 或全 Catalog 查询契约，不能宣称用途筛选已实现或缺失。交主代理结合整体地图核验，不在本报告建立新的产品对象。 |

**recommendation**：后续验收台账至少分开记录“公开 target 存在 / 无密钥样例源码存在 / 独立消费者安装 / 明暗与移动键盘运行 / 用户视觉批准”。保留 page、shell、site 各自真实身份和 source family；统一入口负责用途发现，不复制实现或把 site-only preview 带入安装源码。[R0][R13]

## 官方外部能力核对（外部候选，非仓库已有）

核验日期同报告。通用 components URL 当前重定向到 Base UI 分支；同时核对了明确的 Radix Table/Sidebar 文档入口，避免把官网默认分支视为仓库已选原语。以下只作契约参照，不执行安装、不替换现有原语。

| 官方来源与 fact | 对本仓库的 inference / recommendation |
| --- | --- |
| [shadcn Table（Radix 文档）](https://ui.shadcn.com/docs/components/radix/table)：可组合 TableHeader/Body/Caption/Footer，行操作示例另组合 DropdownMenu。 | 小型发票清单可先复用本仓库 Table 的 cell/外部工具栏；Caption/Footer 等职责如确需，再比较原生语义组合缺口。不能把官网 Table 当成本仓库虚拟 Table 的同接口替代品。 |
| [shadcn Data Table](https://ui.shadcn.com/docs/components/base/data-table)：是 TanStack Table 组合指南，示范 sorting/filtering/pagination/visibility/selection，而非一个包办所有业务的数据表。 | 可参照缺失契约清单。现有 react-virtual 不提供 TanStack Table 功能；需先确认规模、服务端模型和列行为，再决定扩展现有 Table 还是新职责方案，本研究不选择或安装它。 |
| [shadcn Sidebar](https://ui.shadcn.com/docs/components/base/sidebar)、[Radix 分支](https://ui.shadcn.com/docs/components/radix/sidebar)：区分 desktop open 与 openMobile/isMobile，并有切换快捷键。 | 是移动导航与控制模式参照；与现有 sidebar id 回调/固定宽度结构比较，不直接引入第二套 provider、Sheet 或原语。手机关闭、返回焦点、地址导航需消费方契约。 |
| [shadcn React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form)：展示 Controller、schema/resolver，以及 label/error/aria-invalid 的关联。 | 可参照字段错误与保存流程；现有 Input 的 onChange 是值回调，需要适配，不能无条件 spread field 后声称相同。多字段/schema 需求尚未定，不自动加入 RHF/Zod/TanStack Form。 |
| [shadcn Chart](https://ui.shadcn.com/docs/components/base/chart)：使用 Recharts 组合与主题配置，示例/文档有 accessibilityLayer 键盘与屏幕阅读支持。 | 趋势/比较图是外部候选；Kit 只给色值，ActivityHeatmap 也不等于这些图。即使启用 accessibilityLayer 仍要实际测试与文本数据替代；不自动引入 Recharts。 |

外部实现若后续采纳，应按 [CODING_STANDARDS.md](../../CODING_STANDARDS.md) 独立定义职责、名字和 props，保留作者/来源/revision/许可，并核验独立安装成本。官方不同原语分支不是自动迁移授权。[R0]

## 必须由 HITL 决定的问题

以下是主代理应带回产品决策的具体问题；本研究没有作批准记录。

1. **信息架构**：总览、列表/详情编辑、成员、账单、设置哪些是真实首期职责？业务对象、角色与权限分别是什么？是否需要新后台壳，还是现有工作台语义确实吻合？
2. **主题与设备**：要求浅色、深色、跟随系统三态吗？是否接受固定浅色侧栏 + 固定暗色账单混搭？手机采用抽屉导航、横向表格还是独立摘要列表？需要多高的信息密度？
3. **列表/编辑**：排序/过滤作用于全部服务端数据还是本地已加载数据？使用页码还是 cursor/更多？选择能否跨页？详情编辑是即时保存、显式保存还是批量事务？允许普通用户修改行列结构吗？
4. **账单/权益**：annualPrice 指整年总额还是折算月价？货币/税/席位/计费单位如何表达？当前方案操作是管理、升级或降级？升级提示是否模态，何时确认权益变化；是否需要发票、支付方式、失败及重试状态？
5. **成员/设置**：邀请与角色操作的前置条件、最后管理员保护、禁用状态和批量部分失败如何展示？哪些设置可修改、如何显示 dirty/保存失败/撤销？
6. **依赖选择与验收**：需求是否确实超出已有 Table/控件，值得新增 table/form/chart 依赖？目标 Profile 是哪一个？最终视觉与键盘验收由谁在真实消费者确认？

问题来源是以上接口差异与产品职责边界。[R0][R2–R7][R11][R12] 建议在答案形成后再把候选变体或新职责登记为实施任务。

## 实际阅读和未验证范围

**fact**：已读 AGENTS.md、PRODUCT_DEFINITION.md、APPLICATION_KIT.md、CODING_STANDARDS.md 与 issue 正文。worktree 未含 `.agents/skills/research/SKILL.md`，使用主仓库对应技能文件，读取其“primary sources / single Markdown / cite each claim”要求；本人已是后台子代理，按明确指令未递归 spawn。

源码阅读限于：registry 相关条目与生成逻辑；table types/index、排序 hook、header、editable-cell、row-handle、menu，以及 editable/async 用法关键段；command-palette；collapsible-sidebar；billing-plan-grid 与 upgrade-paywall；settings-panel、workbench-settings-page、page-state；step-form；activity-stats；empty-state/shared；Input/Checkbox/Switch/StatefulButton 的接口和关键状态段；StatsRow；Theme Kit types/index/compose/css/charts；pages/sites/section-assets 登记。另补读 Billing/Sidebar/设置 preview、Billing/Upgrade/Command/Sidebar usage、设置与整站薄示例，以及 AgentWorkbenchSite 的接口和页面组合段。部分控件/helper 只读关键段；未声称全 source family、全 Catalog 或所有可访问性经过审计。

本轮未执行消费者安装、CLI compose/audit、HTTP registry 获取、typecheck/build/tests、浏览器、SSR/hydration、明暗截图、移动触摸、键盘/屏幕阅读、对比度、性能或实际付款/权限请求。没有 npm/部署/视觉批准证据；官方文档也不证明本仓库运行结果。未 commit/push/评论/关闭票，报告交主代理审阅。

## 仓库源码证据索引

路径相对本报告目录；下述行号用于定位，基准见报告开头。

- [R0] [产品定义](../../PRODUCT_DEFINITION.md)、[Application Kit](../../APPLICATION_KIT.md)、[编码标准](../../CODING_STANDARDS.md)：产品对象、业务/站点边界、主题与 source family。
- [R1] [registry](../../lib/registry.ts)：table L749–813；activity/settings L1350–1395；command L1520；sidebar/paywall/billing L2542–2632；input/switch/checkbox/button 各真实登记。
- [R2] [TableProps](../../components/motion/table/types.ts)、[Table](../../components/motion/table/index.tsx)：接口、虚拟滚动、选择/加载/单元格渲染。
- [R3] [排序 hook](../../components/motion/table/use-column-sort.ts)、[表头](../../components/motion/table/table-header.tsx)、[EditableCell](../../components/motion/table/editable-cell.tsx)、[RowHandle](../../components/motion/table/row-handle.tsx)、[TableMenu](../../components/motion/table/table-menu.tsx)：本地排序、pointer/键盘差异、每次输入回调。
- [R4] [CommandPalette](../../components/motion/command-palette.tsx)：Props L19–40；键盘/聚焦 L103–139、169–185；grouped 与 filtered 顺序、portal/aria 与固定文案。
- [R5] [CollapsibleSidebar](../../components/motion/collapsible-sidebar.tsx)：接口 L24–64；宽度 L67–68；固定色 L165 起；SidebarLabel L332 起与 SidebarRow L395 起。
- [R6] [BillingPlanGrid](../../components/motion/billing-plan-grid.tsx)：接口 L17–44；渲染 L136 起；FeatureGroup L250 起；[UpgradePaywall](../../components/motion/upgrade-paywall.tsx)：接口 L12–25、内容隔离 L65 起与 CTA L108 起。
- [R7] [设置分组控件](../../components/motion/settings-panel/index.tsx)、[WorkbenchSettingsPage](../../components/pages/workbench-settings-page.tsx)、[PageState](../../components/pages/page-state.tsx)、[页面登记](../../lib/pages.ts)、[整站登记](../../lib/sites.ts)。
- [R8] [ActivityStats](../../components/motion/activity-stats/index.tsx)：StatsBar/Item L9–48、Heatmap L63–163、PeriodTabs L166 起。
- [R9] [StatsRow](../../components/sections/basics.tsx)：L186–200；[区段安装身份](../../lib/section-assets.ts) stats/row → stats-row。
- [R10] [TableAsyncExample](../../components/examples/motion/table-async.example.tsx)、[TableEditableExample](../../components/examples/motion/table-editable.example.tsx)：本地示例、值与动作接入。
- [R11] [Input](../../components/motion/input.tsx)、[Checkbox](../../components/motion/checkbox.tsx)、[Switch](../../components/motion/switch.tsx)、[StatefulButton](../../components/motion/button/stateful.tsx)、[StepForm](../../components/motion/step-form.tsx)、[EmptyState shared](../../components/motion/empty-state/shared.tsx)。
- [R12] [Theme 类型](../../lib/theme-kits/types.ts)、[登记](../../lib/theme-kits/index.ts)、[合成](../../lib/theme-kits/compose.ts)、[CSS](../../lib/theme-kits/css.ts)、[图表色](../../lib/theme-kits/charts.ts)。
- [R13] [registry-server](../../lib/registry-server.ts)：collectSourceGraph L206 起，build item L310–338。
- [R14] [package.json](../../package.json)：dependencies L42 起。
- [R15] [AgentWorkbenchSite](../../components/site-shells/agent-workbench-site.tsx) 接口/组合段；[整站用法](../../components/examples/sites/agent-workbench-site.example.tsx)、[设置页用法](../../components/examples/pages/workbench-settings-page.example.tsx)。
- [R16] [Billing 预览](../../components/previews/blocks/billing-plan-grid.preview.tsx)、[Sidebar 预览](../../components/previews/blocks/collapsible-sidebar.preview.tsx)、[设置页预览](../../components/previews/pages/workbench-settings-page.preview.tsx)。
- [R17] [Billing 本地示例](../../components/examples/blocks/billing-plan-grid.example.tsx)、[Upgrade 本地示例](../../components/examples/blocks/upgrade-paywall.example.tsx)、[Command 本地示例](../../components/examples/blocks/command-palette.example.tsx)、[Sidebar 本地示例](../../components/examples/blocks/collapsible-sidebar.example.tsx)。
