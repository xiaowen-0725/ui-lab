# 整站的发现、预览与独立安装提案

日期：2026-10-07。状态：用户已确认使用路径与分发职责；规划阶段结论保留于本文；后续已形成产品入口与分发资产，实际结果见[实施证据](../008-project-workspace-implementation.md)，没有新增创建器命令。关联问题：[整站怎样在 Catalog 中发现、预览与独立安装？](https://github.com/xiaowen-0725/ui-lab/issues/32)；[候选记录](https://github.com/xiaowen-0725/ui-lab/issues/32#issuecomment-6035763292)。

目标：用户先体验客户项目工作区整站，再选择安装整站、单个页面或共用外壳；人和 AI 使用同一真实登记与源码。遵循已确认的[目录与登记](https://github.com/xiaowen-0725/ui-lab/issues/29#issuecomment-6035259967)、[导航](https://github.com/xiaowen-0725/ui-lab/issues/30#issuecomment-6034315845)、[主题](https://github.com/xiaowen-0725/ui-lab/issues/39#issuecomment-6034742450)和[视觉组合](https://github.com/xiaowen-0725/ui-lab/issues/31#issuecomment-6035669569)。

## 已确认的使用路径

```text
整站入口 /sites
  → 客户项目工作区详情：页面范围、主题能力、活预览、安装与用法
  → 全屏多页体验：总览 → 项目列表 → 详情 → 编辑/保存
  → 安装整站，或者打开关联的独立页面/外壳详情
  → 复制相同实现的本地示例，接入消费者导航、数据和主题包装
```

| 用户动作 | 提供的内容 | 完成边界 |
| --- | --- | --- |
| 找后台模板 | 沿用整站入口；中文/英文名称、用途、页面范围与实际主题模式 | 卡片由 SITES 投影，不维护第二份 templates 清单 |
| 看整站 | 内嵌活预览和打开全屏演示入口 | 两处引用同一真实整站与页面，控制器是示例包装 |
| 拆用页面 | 整站详情关联页面及外壳的真实详情与安装身份 | 页面来源仍是 PAGES，外壳来源是显式 registry entry |
| 装整站 | 从真实 Catalog fetch 信息生成 shadcn 命令；也提供手动复制路径 | 只分发真实 import 闭包与外部依赖，不带 UI Lab 站点实现 |
| 接业务 | 零参数本地交互用法及框架包装示例 | 不要求密钥，导航/查询/保存由消费者适配 |

主入口优先展示完整整站；组件、页面和外壳继续保留各自发现方式。不增加顶层“模板工坊”、第二套 Catalog kind 或工程创建流程。

## 用途与双语发现

建议在 SiteDefinition 增加可选用途 `useCase`，候选取值 `workspace`、`marketing`、`personal`，中文为“后台与工作区”“营销网站”“个人网站”。该字段只用于发现，不决定 assetRole、category、安装身份或目录。

当前 Agent 多页工作台和新客户项目工作区都属于 workspace。尚无真实条目的营销/个人类型不显示空筛选；历史未填写用途的条目仍显示在“全部”。名字、描述、用途和通用 aliases 使用中英文检索；来源品牌只留 provenance。

SITES 是整站事实真源，统一 Catalog 可以投影可选用途，机器发现继续使用当前的 `list --kind component --role site` 与 search/show，不预先新增用途 CLI flag。外壳列表按 registry 的 assetRole=shell 派生；保留历史 Agent 外壳详情/布局链接，新增 DashboardShell 使用自己的真实安装详情，不把 shell 伪造成 SiteDefinition。

## 详情与多页预览

整站详情沿用 `/sites/<site-slug>`，独立页面沿用 `/pages/<page-slug>`，其余安装资产沿用真实 category 的详情路径。中文正式站点使用裸路径，英文 `/en/*`；原型的 `/zh/playground/*` 不成为正式路由。

详情应展示：

- 同一实现的活预览、用法和源码；中英文内容；正常/空/错误/编辑/保存反馈等实际可触发状态。
- 外壳与页面清单及相互链接；推荐 Theme Kit、真实可用模式和已验证范围。
- 主操作“打开全屏演示”“安装整站”，以及关联页面各自的“查看/安装页面”。运行示例是用法，不再创立一个整站安装身份。

建议全屏预览采用 `/sites/<site-slug>/preview` 及其页面子路径（实施前再核对路径匹配），总览、项目列表和样本详情具有可分享地址，支持刷新和返回。页面查询采用既定消费者 URL 适配；unknown site/page/id 显示明确未找到状态，不默默跳入另一个条目。账号 UI 使用相应布局，不强制套后台侧栏。

内嵌详情预览继续受控切屏，不修改 Catalog 详情路由。全屏演示仅保留返回 Catalog 和演示状态等必要工具，隐藏 Catalog 的侧栏/顶部栏，后台呈现自己的 DashboardShell。需按现有 SiteShell/locale 包装增加独立展示能力，不能沿用原型的简化 locale layout 或 middleware 绕过。主题作用域和 portal 继承须覆盖弹窗/Drawer；不能影响外部 Catalog 的主题偏好。

全屏预览和可复制示例复用 provider-free 的本地演示 controller；Next/next-intl、浏览器 URL、存储与首帧初始化只在站点或框架消费包装中。每个独立资产同时提供零参数具名 Example，直接 import 安装入口；示例自身承接有意义的本地交互，不只透传 props。

## 安装与源码边界

首版新增名字/安装身份以[复用决定](https://github.com/xiaowen-0725/ui-lab/issues/35#issuecomment-6035093678)及实际登记为准：五个后台页面、三个账号界面、共用外壳与整站、分页与趋势职责；设置引用已有 WorkbenchSettingsPage。整站身份候选 project-workspace-site，不在登记完成前展示可执行的安装命令。

整站真实引用的页面、外壳、控件与 helper 均进入 installationFiles。sourceFiles 仍只表示自己拥有的 family；不把所有组件声明清单直接当作安装文件列表。不复制页面实现，不把预览、站点 provider、框架路由或所有可选组件打进安装图。安装单页按自身实际图走；没有图表 import 的页面不额外带 Recharts。

shadcn 和手动复制两种路径都从同一 registry graph 生成文件、依赖和用法，不能手维护两套。用户已有 vendored 源码和变量应先比较后适配；CLI 打印计划/命令不会替用户执行外部安装，也不能承诺第三方 CLI 自动合并用户所有源码改动。

## 主题与消费者保留

默认推荐 Graphite。主题是独立选择的 token 载荷，整站安装不隐式替换消费者已有全局主题。空白工程按明确选择初始化，已有工程保留现有变量和源码，仅补真实缺失的必要项；明确选择替换主题时才执行已有替换语义。

单页用法默认在消费者主题环境中运行；整站运行示例展示 Graphite 与第二套经过验证的真实双模式品牌。第二套的 token/安装身份在实现中形成实际候选，原型蓝色不冒充已经登记的 Theme Kit。

多品牌载荷由同一 Theme Kit 真源生成作用域样式，框架示例明确提供载荷、初始化与用户覆盖的接入步骤；不能将多个现有 :root/.dark 文件直接串接。必要的载荷接口扩展须在实施中完成分发和消费者回归，未完成前不展示多品牌复制已经可运行。保留当前单主题 endpoint/安装语义；安装组件遵循补缺规则。

品牌/模式切换由纯 React 控件表达值和动作，消费者包装管理偏好、system 解析、SSR 首帧、存储、作用域及 portal；切换不丢页面、查询、选择、草稿或保存状态。用户拥有的覆盖与生成基线分开，不在切换或升级时覆盖它们。

## Recipe 与 CLI 的使用

优先沿用真实整站的 show/add/install；Recipe 负责组合约束和示例关联，不是必经产品步骤，也不成为另一份页面实现。若首版新增工作区 Recipe，其 entry 和必装项应指向真实整站，examples 关联同一资产；可选项不进入整站的必需安装闭包。所有引用在发布 Catalog 前校验，不发布指向候选 slug 的空配方。

当前已核对的只读命令：

```sh
bun cli/src/index.ts --help
bun cli/src/index.ts list --kind component --role site --json
bun cli/src/index.ts show agent-workbench-site --json
```

其中 existing Agent 整站输出 kind=component、assetRole=site、独立源码入口、installationFiles、sourceVersion 和真实 fetch 信息。快照生成于 2026-10-07T04:34:40.777Z，显示 558 条；其 origin 为 localhost:3000，不能直接当成生产 URL。

新模板完成真实登记和快照后，消费者通过 show 查看其准确安装信息，再使用 add 输出/登记命令；有装配需求时才采用当前 init/compose/lock/audit。写入命令必须在真实 React package 根操作。仓库源码、已发布 npm CLI 与线上 Catalog 分别核对版本，不把未发布源码能力描述为 npm 已可用。没有 create/scaffold/模板发布命令。

## 需随实施验证的路径

- 整站入口、双语检索、每个关联详情及历史 URL 可达；内嵌和全屏预览使用相同实现。
- 全屏多页深链、刷新/返回、查询恢复、未保存提示，以及账号页面布局。
- 每个独立安装身份和整站真实闭包、无站点依赖、零参数用法；shadcn/手动说明从相同图派生。
- 既有工程的源码/变量保留与空白工程初始化；品牌作用域、portal、SSR 首帧和状态保留。
- 在后续验收决定中明确 Next/Vite/Electron renderer 的实际消费者样本和门禁；Profile 声明不等于三者都通过。

本轮仅检查现有源码与上述只读 CLI 输出，未执行目标模板安装、消费构建、生产预览、Audit、发版或部署。视觉方向及发现/安装使用路径均已由用户确认，详细决定见[发现与安装 resolution](https://github.com/xiaowen-0725/ui-lab/issues/32#issuecomment-6035818987)。支持范围及验收顺序见[已确认的验收规格](2026-10-07-saas-acceptance-plan.md)。
