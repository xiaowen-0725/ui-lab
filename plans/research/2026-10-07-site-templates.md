# 整站模板探索记录

核验日期：2026-10-07。状态：用户已确认起始推荐，决策地图已建立；本文件保留初步调查，不是实施规格。后续决定的唯一记录位于 [整站模板架构与首个 SaaS 后台规格](https://github.com/xiaowen-0725/ui-lab/issues/24) 的子票，地图只保存索引。

## 用户已明确的方向

先讨论整站模板的总体目录和架构，再实施首个面向 SaaS 后台的模板。长期还要能容纳落地页、个人网站等类型。用户提供的截图与三个网址见 [方向参考](../direction-reference-sites.md#2026-10-07-整站模板)。参考不自动表示逐像素复刻、源码移植或视觉批准。

## 本地已核对的事实

- [产品定义](../../PRODUCT_DEFINITION.md) 已支持组件、区块、页面、外壳与整站。整站引用独立页面和共享外壳，源码分发以真实 import 闭包为依据。
- [ADR 0002](../../docs/adr/0002-catalog-roles-and-install-identities.md) 与 [开发流程](../../CONTRIBUTING.md) 已确定新页面放 `components/pages/`，多页组合及新外壳放 `components/site-shells/`；分别由 `lib/pages.ts`、`lib/sites.ts` / registry 登记。历史 category、路径和安装身份保持兼容。
- [整站登记](../../lib/sites.ts) 目前只有 Agent 多页工作台；`componentSlug`、`shellComponent`、`recommendedSystem`、`pagePath` 的类型均为这个条目的字面量，增加第二种整站需要扩展类型。页面登记同样是一份集中登记，暂时没有多系列目录的源码定位契约。
- [registry](../../lib/registry.ts) 当前按 `components/pages/${componentSlug}.tsx` 和 `components/site-shells/${componentSlug}.tsx` 推导入口路径；若改为子目录，需要显式解决源码定位、用法定位与安装闭包，不能只搬文件。
- [现有整站源码](../../components/site-shells/agent-workbench-site.tsx) 通过页面键与回调切换页面，使用 `hidden` 保留三个页面的状态，没有内置消费者路由。这种方式是否适合更大后台、有深链需求的模板，是待决问题，不能直接推广。
- 已有 SaaS 落地页、表格及其安装变体、命令面板、可折叠侧栏、账单方案网格、升级付费墙、设置控件等候选资产。登记存在不代表满足首版后台的全部主题、交互和移动端需求；需逐项核对接口和状态后决定复用、变体或新增。
- [Application Kit](../../APPLICATION_KIT.md) 当前不提供后端、数据库、真实鉴权或部署。可分发源码接收 content/data/hrefs/callbacks，Next/next-intl、请求和消费者业务适配留在包装层。
- 本仓库 issue tracker 是 `xiaowen-0725/ui-lab` GitHub Issues；wayfinder labels 已存在，建立本轮地图前没有开放 issue。跟踪约定见 [issue tracker](../../docs/agents/issue-tracker.md)。

执行过 `bun cli/src/index.ts --help`、`list --help`，以及 site/shell 角色的只读 Catalog 查询；没有安装、构建或修改产品源码。

## 外部参考：事实与适用范围

| 参考 | 已核验事实 | 值得继续调查的方向 |
| --- | --- | --- |
| [AdminCN Pro 与模板集合](https://shadcnstudio.com/templates/admin-dashboard) | 官网把用户给的演示域名列在 Pro 项下，Free 使用另一个演示域名。 | 截图中的导航层级、卡片密度、报表组织、明暗表现；当前没有读取 Pro 源码。 |
| [AdminCN Free 源码](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free) | 官网 Free 详情页直接链接这个独立仓库。README 区分 App Router 路由、layout/shared/ui、views、配置和 fake-db。 | 最接近用户参考的公开实现；继续核对壳、导航、主题及真实页面代码，移植前保留来源与许可声明。 |
| [shadcn-studio](https://github.com/shadcnstudio/shadcn-studio) | 公开树里存在 dashboard shell/sidebar/header 等 registry JSON、示例和组件；README/manifest 标记 MIT，但后续核对实际 LICENSE.md 发现附加 Commons Clause Restriction，包括再分发及竞品条款。 | 研究组件/区块分发形状；源码复用不能只依据 MIT 标记。不能将它等同于 Pro 整站源码来源。 |
| [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) | README 说明基于 Vite/TanStack Router，有明暗、响应式、全局命令搜索和多页面；作者明确说它不是 starter。源码树分开 `features`、路由与布局。 | 可交互 UI、多页边界和列表/设置组织，避免把演示 UI 当作完整后端工程。 |
| [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) | README 声明当前 Next.js 16，feature 目录、表格/表单/数据层，并接入 Clerk 的组织和账单；有可移除功能脚本。 | 参考 view 与消费者适配的职责边界；其内置服务及整套依赖不纳入本轮前端资产范围。 |
| [shadcn Sidebar](https://ui.shadcn.com/docs/components/base/sidebar) | 官方文档提供可组合的 sidebar/header/footer/group/menu 等结构与安装用法。 | 缺失基础控件的候选来源；先与仓库已有侧栏比较，不直接引入第二套重复能力。 |

公开仓库读取 revision：shadcn-studio `72a20331970218848103184b61e1efa9d0e08dea`；shadcn-admin `e16c87f213a5ba5e45964e9b67c792105ec74d26`；next-shadcn-dashboard-starter `7705dfc0d13889e45c26a55ad5908da6a7a9a605`。以上读取了 README、部分源码树和依赖信息，没有运行这些项目；README 的能力承诺尚未做运行验证。

后续静态源码调查及实际许可核验见 [外部参考调查](2026-10-07-site-template-references.md)；调研票记录摘要及修正依据，不把许可文件的事实发现当作用户已经决定复用任何上游源码。

现有资产的逐职责接口、主题/交互和分发边界见 [SaaS 后台资产复用审计](2026-10-07-site-template-reuse.md)。两项研究均仅做静态调查，不能替代消费者安装和运行验收。

## 架构讨论建议（未决）

沿用职责分层，共享主题、组件与区块；后台、营销网站、个人网站按各自导航和内容结构组合外壳与页面。未来一个 SaaS 产品同时有公共营销面和后台面，可以复用同一主题与基础组件，由消费项目路由组合两种外壳，不要求两种页面套同一个壳。

```text
UI Lab 源码资产                         消费项目适配
components/motion/、agents/ 等已有资产   路由与深链
components/sections/                    请求、缓存与业务动作
components/pages/                       鉴权、租户与权限规则
components/site-shells/                  项目入口与 provider
lib/pages.ts、sites.ts、registry.ts      按 feature 组织的业务集成
lib/recipes.ts、theme-kits/              可选的独立工程示例
components/examples/、previews/
```

起始调查建议一个连贯的工作区 SaaS 示例：总览、业务列表与详情/编辑、成员、账单、设置和账号入口。用户后续已确认页面范围，见下文决定指针；命名、数据契约和具体行为仍待细化。加载、空白、错误、保存失败、移动端导航和键盘操作应随页面规格定义。

独立可启动工程若纳入本次交付，需要另定位置、技术栈、维护责任与分发契约；不能仅凭“整站模板”一词新增 CLI scaffold 产品流程。新的系列子目录或登记元数据也应先明确真实需求，不提前建立万能配置对象。

## 当前讨论前沿

用户以“可以”确认此前三个起始推荐：

1. 规划终点为整站总体架构＋首个 SaaS 后台规格，先讨论再实施。
2. 首版是前端交互模板、示例数据与业务服务接入点。
3. 借鉴截图结构与密度，独立设计明暗主题。

这是地图的起始范围，不表示下文的架构、页面集合或未来视觉原型已经获得用户批准。

地图覆盖整站边界、参考源码、现有资产能力、首版信息架构、目录登记、外壳与路由、视觉原型、发现/安装和实施准入验收。开放子票与阻塞关系直接在 GitHub 查询，本文不重复维护清单。HITL 决策保持开放到真实讨论完成。

用户随后确认交付边界的推荐：页面、外壳和整站均可独立安装；提供无密钥可运行的前端示例；保持统一整站入口，按后台、营销、个人网站等用途筛选。详细决定以 [整站资产的边界、分类与交付单位是什么？](https://github.com/xiaowen-0725/ui-lab/issues/25) 的 resolution comment 为准，此处只保存上下文指针。

用户随后确认客户项目协作工作区、六类后台页面及三类账号入口；范围决定见 [首版 SaaS 后台服务谁，包含哪些页面与完整流程？](https://github.com/xiaowen-0725/ui-lab/issues/28) 的 resolution comment。具体目录、路由、数据与保存契约尚未确定。

下一轮的 [目录与架构候选](2026-10-07-site-architecture-options.md) 对比现有职责目录和新增系列子目录，并说明源码/登记/消费适配的依赖边界；只是待讨论候选，不是实施规格。

## 验证与交付状态

当前只有调查、文档和 GitHub 规划记录；没有实现模板、记录视觉批准、推送或发布。`PRODUCT_DEFINITION.md` 的待规格方向已按用户澄清修正为整站前端模板，当前能力保持原有定义。文档不会改变 Catalog，当前不需要刷新快照；后续实现按开发流程执行相应检查与消费者验证。研究资产的位置与验证范围由对应研究票记录。

## 后续用户调整：完整工程与主题

上一轮代理将用户“一键创建 SaaS 项目和更换主题”的目标扩展为全栈工程与服务组合，随后完成相关研究。用户最新澄清聚焦前端组件及前端相关资产；此前扩展是代理过度解读，现已撤回，相关研究仅保留背景事实。地图当前为[整站前端资产、主题与首个 SaaS 后台模板规格](https://github.com/xiaowen-0725/ui-lab/issues/24)。

新增调查曾覆盖开源完整 SaaS 工程及项目生成/多主题实践。架构候选现已收回到可组合前端资产、运行示例、主题与消费者适配；服务和生成层候选已撤回。详见[目录与架构候选](2026-10-07-site-architecture-options.md)。

补充研究已完成：

- [完整 SaaS 工程案例](2026-10-07-saas-starter-cases.md)：Next.js SaaS Starter、Makerkit 公开 Lite、OpenSaaS 的真实站面、初始化、服务/权限/订阅及许可边界。
- [项目生成与多主题机制](2026-10-07-project-generation-themes.md)：create-t3-app、shadcn 官方 CLI、next-themes 与 UI Lab 现状的对照。

对应研究票已记录 resolution 并关闭；工程交付/服务选型票按最新前端范围移出并关闭，主题契约继续讨论。只做静态源码/文档调查与文档链接/差异检查，没有运行上游工程或验证服务。

用户随后确认当前前端资产路线。关联[后台前端规格草案](2026-10-07-saas-frontend-spec.md)把目录、页面行为、外壳/导航与消费者接口、复用候选及进入实施的检查顺序具体化；未决细节仍保持候选，不将这一方向确认记录成所有后续票已解决。

用户又确认完整示例独立地址/刷新/返回、内嵌预览受控切屏的导航推荐。[外壳与导航决定](https://github.com/xiaowen-0725/ui-lab/issues/30#issuecomment-6034315845)已记录并关闭；草案补充列表/编辑与主题的具体候选，用于后续讨论，尚未实施。

交付边界票与两项研究票已完成，详细决定/事实及限制以各自 resolution comment 为准。术语在既有 `CONTEXT.md` 补充“外壳”“运行示例”；两份报告从隔离研究 worktree 同步主工作区，尚未提交/推送。地图新增的列表/保存契约和资产复用补齐决策仍待用户讨论，未视为已批准实施。
