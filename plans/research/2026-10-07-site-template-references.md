# 开源后台模式与源码复用边界调查

核验日期：2026-10-07。任务：[哪些开源后台模式适合借鉴，源码复用边界在哪里？](https://github.com/xiaowen-0725/ui-lab/issues/26)。分支：`research/site-template-references`。本报告只研究、记录候选，不代表用户选型、视觉批准或新增资产授权；没有复制模板源码。

**主要发现：**四个项目都有可研究的后台组合模式，但技术边界和权利边界不同。AdminCN Free 展示多层导航与统计/图表/表格组合；satnaing 展示按 feature 组织页面及可配置侧栏；Kiranism 展示 Next 消费工程的数据与鉴权适配；shadcn-studio 展示 registry source family。特别是 shadcn-studio 的实际许可文件包含附加限制，不能把它当作无附加限制的 MIT 源码池。[Free 页面][F-page]、[satnaing shell][S-shell]、[Kiranism shell][K-shell]、[studio registry][T-shell]、[studio 许可][T-license]。

## 方法、版本与本地约束

已读 worktree 根 `AGENTS.md`、`PRODUCT_DEFINITION.md`、`CODING_STANDARDS.md`。worktree 没有 `.agents/skills/research/SKILL.md`，因此只读主仓同路径技能；遵循第一方证据规则，作为既有后台研究代理未递归 spawn。证据取自各项目 GitHub API 的 HEAD commit、递归树和固定 SHA 原始文件。下表是实际读取 revision，不是截图版本，也不宣称是未来最新版本。

| 项目 | 固定 revision | commit 时间（UTC） | package 声明的技术栈 |
| --- | --- | --- | --- |
| AdminCN Free | `dd1afd2f3a794ea9e746197de314f81d43670ea1` | 2026-08-18 13:14:41 | Next 16.2.6、React 19.2.4、Tailwind 4、Base UI 1.6.0 [package][F-package] |
| shadcn-studio | `72a20331970218848103184b61e1efa9d0e08dea` | 2026-08-20 10:33:45 | Next ^15.3.3、React ^19.1.0、Tailwind ^4.1.10，多个 Radix 原语 [package][T-package] |
| satnaing/shadcn-admin | `e16c87f213a5ba5e45964e9b67c792105ec74d26` | 2026-06-11 10:08:35 | Vite ^8.0.8、React ^19.2.5、Tailwind ^4.2.2、TanStack Router、@clerk/react [package][S-package] |
| Kiranism starter | `7705dfc0d13889e45c26a55ad5908da6a7a9a605` | 2026-08-24 22:10:22 | Next 16.2.12、React 19.2.4、Tailwind ^4.2.2、Clerk、Sentry、nuqs、React Query [package][K-package] |

Revision 的第一方记录：[Free commit](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/commit/dd1afd2f3a794ea9e746197de314f81d43670ea1)、[studio commit](https://github.com/shadcnstudio/shadcn-studio/commit/72a20331970218848103184b61e1efa9d0e08dea)、[satnaing commit](https://github.com/satnaing/shadcn-admin/commit/e16c87f213a5ba5e45964e9b67c792105ec74d26)、[Kiranism commit](https://github.com/Kiranism/next-shadcn-dashboard-starter/commit/7705dfc0d13889e45c26a55ad5908da6a7a9a605)。版本号仅为 manifest 声明，未核对 lockfile 实际解析结果。

## 事实：各项目实际源码组织

### AdminCN Free：壳、导航和订单概览

- **外壳：**`src/app/(pages)/layout.tsx` 组合 Sidebar、SidebarInset、Header、main、Footer、Toaster，页面通过 children 插入。根 layout 管 Next 字体、metadata、NuqsAdapter；`Providers.tsx` 包装主题、Tooltip 和 Sidebar 状态。[页面壳][F-shell]、[根包装][F-root]、[Providers][F-providers]。
- **导航：**`navConfig.tsx` 定义分组、叶子/子组、badge、target 和 activePath；Sidebar 使用 `next/link`、`usePathname`、`useSearchParams`，包含查询参数匹配、当前分支展开和图标折叠态的 flyout。不是纯 props 导航 renderer。[配置][F-nav]、[实现][F-sidebar]。
- **页面/数据：**orders 页面把统计数据、收入数据、交易数组放在页面内，组合 statistics、widgets、charts 和 transaction datatable，其中统计项和表格数据经 props 传给子项。`fake-db/apps/users.ts` 是示例数据位置，不能证明有生产业务服务。[订单页面][F-page]、[fake-db][F-data]。
- **主题/config：**`themeConfig.ts` 仅声明模板名和首页 URL；根 globals.css 是 Tailwind/语义变量等全局样式，主题选择由 provider 包装，不能据此称为完整应用设计系统。[配置][F-theme]、[样式][F-css]、[Providers][F-providers]。

**Pro 与 Free 必须分开：**公开 Free 的导航配置将 Sales、Finance、Logistics 等标为 Pro，并链接到另一个部署地址；它们不是 Free 的本地页面实现。第一方 README 的 Free/Pro 对照也将两者区分。本调查没有收到或检查用户截图文件、没有读取 Pro 源码，因此不能证明截图布局、功能、主题配置、许可证或源代码与 Free 一致；Free 的来源和许可证不能自动覆盖 Pro。[导航中的外链][F-nav]、[第一方对照][F-readme]。

### shadcn-studio：registry 包与预览站点分层

- **shell/page：**`public/r/dashboard-shell-01.json` 的 registry 项带 `type: registry:block`、依赖、registryDependencies、files。files 包含预览入口和图表、表格、下拉菜单、统计卡、收入卡及分页 hook，展示一个组合项的源码家族。[registry][T-shell]。
- **nav：**`dashboard-sidebar-01.json` 的样本组合 SidebarProvider、分组、badge、SidebarTrigger，多处链接是 `href='#'`；这是结构样本，不能证明真实业务导航已实现。[侧栏 registry][T-nav]。
- **data：**shell 样本内嵌统计/交易数组，头像和部分图片指向 `cdn.shadcnstudio.com`。表格文件 import TanStack Table 和包内分页 hook；图表文件 import Recharts。可借鉴的是组合边界，演示数据和 CDN 地址不等于消费方数据契约。[registry 内容][T-shell]。
- **theme/config/站点耦合：**`src/config/theme.ts` 分开声明 light/dark 语义色、sidebar/chart 与公共字体、圆角、阴影、间距；站点根 layout import Next 字体、SettingsProvider、ThemeProvider、服务端 cookie helper。旧 examples/dashboard 页面还在移动尺寸显示桌面提示并隐藏主体，不能把单一示例的存在等同于完整移动体验。[theme][T-theme]、[根 layout][T-root]、[示例页面][T-page]。

### satnaing/shadcn-admin：feature 页面与配置侧栏

- **shell/nav：**AuthenticatedLayout 包装 SearchProvider、LayoutProvider、SidebarProvider、SkipToMain，正文支持 children，缺省用 TanStack Router Outlet；侧栏状态从 cookie 读。AppSidebar 从静态 sidebarData 取团队、用户与导航组，从 LayoutProvider 取 variant/collapsible；NavGroup 再读取 Router location 并按折叠/移动状态选择下拉或展开子项。[shell][S-shell]、[sidebar][S-sidebar]、[配置][S-nav]、[导航 renderer][S-nav-renderer]。
- **page/data：**`features/dashboard/index.tsx` 组合 Header/Main、Tabs、统计卡、Overview/Analytics/RecentSales；有硬编码统计与禁用 tab。`features/users/data/users.ts` 用固定 Faker seed 生成 500 个用户，是本地演示 fixture。[页面][S-page]、[用户数据][S-data]。
- **theme/工程适配：**ThemeProvider 用 cookie 存偏好，在 render 的 memo 中读取 `window.matchMedia`，effect 修改 document 根 class；这是当前 Vite 客户端语境的实现，原样搬到 SSR 会有运行环境问题。`main.tsx` 建 QueryClient/Router，并把 Axios 401 与 auth store reset、登录重定向关联；此类会话/请求策略属于消费者工程。[主题][S-theme]、[工程入口][S-main]。
- **供应商事实：**manifest 包含 `@clerk/react`，sidebarData 有 Clerk 专用示例链接；普通 AppSidebar 使用的是静态 user/teams，不能因此描述为“所有普通页面均要求 Clerk 登录”，也不能描述为完全没有供应商功能。[manifest][S-package]、[数据配置][S-nav]、[sidebar][S-sidebar]。

### Kiranism：Next 服务边界、数据查询与供应商适配

- **shell/nav：**dashboard layout 在服务端 `await auth.protect()`，读 Next cookies，组合 KBar、Sidebar、Header、正文及右侧 InfoSidebar。AppSidebar 直接读取 Clerk user/organization/signOut 与 Next pathname/router。[shell][K-shell]、[sidebar][K-sidebar]。
- **config：**nav-config 是侧栏和命令栏可共享的分组数据，包含 access 条件；use-nav 实际读取 Clerk 权限/角色。其源码明确区分 UI visibility 与服务端安全：plan/feature 条件当前会显示条目并警告，不能把配置注释里的条件能力视为已完整执行，更不能把隐藏菜单当授权。[配置][K-nav]、[实际 filter][K-nav-filter]。
- **page/data：**product 路由 await searchParams、调用 nuqs server cache、组合 PageContainer 与 ProductListingPage；listing 读取缓存过滤条件、prefetch React Query，再用 HydrationBoundary 包装 ProductTable；query options 通过单独 service 函数提供 queryFn。mock-api 是 Faker 内存记录、过滤/分页/排序和模拟延迟，不是生产后端。[路由][K-page]、[listing][K-listing]、[query options][K-query]、[mock-api][K-data]。
- **theme/config：**根 layout 从 cookie 选 data-theme，并组合 NuqsAdapter 和 next-themes wrapper；globals.css import 独立 theme.css 与全局样式。该主题持久化/SSR 包装属于工程侧职责。[根包装][K-root]、[provider][K-theme]、[样式][K-css]。

## 事实：已有许可声明位置与需要区分的范围

| 项目 | 实际声明位置 | 读取所得事实 |
| --- | --- | --- |
| AdminCN Free | 根 `LICENSE.md`；package.json 的 license 字段 | MIT 文本，copyright 2026 shadcn/studio，包含版权/许可通知保留条件。[原文][F-license] |
| shadcn-studio | 根 `LICENSE.md`；package.json 的 license 字段 | package 写 MIT，但 LICENSE 在 MIT 文本后追加 Commons Clause Restriction：限制未修改组件出售/再许可/再分发，并禁止直接竞争的产品或服务。不能省略追加条款。[原文][T-license] |
| satnaing | 根 `LICENSE` | MIT 文本，copyright 2024 Sat Naing，包含通知保留条件。[原文][S-license] |
| Kiranism | 根 `LICENSE` | MIT 文本，copyright 2023 Kiranism，包含通知保留条件。[原文][K-license] |

**推断：**UI Lab 具有可视组件/区块目录和源码分发，与 shadcn-studio 声明的竞品限制有明显相关性；本调查不能认定具体使用已经获得许可，也不能靠“修改/改名”推导竞品限制消失。建议先将其用于模式研究和带来源的外部 reference；若考虑移植，须有明确适用授权依据再进入源码分发流程。[上游条款][T-license]、[UI Lab 产品定义](../../PRODUCT_DEFINITION.md)。

**建议：**对于含 MIT 文本的候选，后续移植保留实际版权与许可通知、来源 URL、SHA/核验日及文件已有声明，分别核验引入的第三方原语、字体、图片和 CDN 资产；本次仅读根许可，没有做完整逐文件权利链审计。尤其 Free 与 studio 虽属同一组织，不能把一个仓库的根声明自动套到另一仓库或共同源文件；出现冲突时保留并追溯，不擅自删掉限制。[Free 许可][F-license]、[studio 许可][T-license]、[本地命名/来源规则](../../CODING_STANDARDS.md#语义与命名)。

## 推断与宏观候选建议：按职责拆边界，不选整套赢家

下表是研究后的候选方向，并非用户已选择或实际兼容测试结果。

| 可借鉴模式 | 候选证据 | 可分发前端职责 | 留给消费者工程 |
| --- | --- | --- | --- |
| 分组/多层/折叠侧栏 | Free 与 satnaing | 分组、标签、badge、受控 active/expanded 状态、移动关闭动作；由 props/回调/链接渲染入口适配 | pathname/searchParams、Router Link、业务菜单生成、cookie 持久化 |
| 共享壳 + 独立页面 | Free、satnaing、Kiranism | shell 组织 sidebar/header/content/辅助栏 slot，页面复用区块；site 登记页面引用 | App Router/Outlet、metadata、鉴权 guard、Providers、供应商组织切换 |
| 概览统计/图表/表格 | Free、studio、satnaing | 展示模型、格式化输入、空/加载/错误状态、排序/筛选/分页动作 | API 调用、查询缓存、URL 同步、字段业务含义、权限与导出实现 |
| registry source family | studio | 完整 files/helper/原语依赖闭包的表达与验证模式 | 展示站点主题编辑器、营销/定价功能；studio 源码复用还受上述条款限制 |
| theme token 与偏好分离 | 四项主题源码 | 对接 UI Lab Theme Kit 语义 token，组件仅取所需变量 | document/window/cookie/localStorage、SSR 主题注入、整站字体安装 |
| 按 feature 分 query/service/view | satnaing、Kiranism | 视图需要的 data/state/action 契约 | React Query、nuqs、Axios、Clerk、Sentry 及产品业务服务策略 |

这些方向应遵守 UI Lab 当前“props/回调承接业务，框架适配放消费者”的边界，而不是扩大 Application Kit 去承载领域模型和鉴权。四项 manifest 都声明 React 19/Tailwind 4，**仅说明大版本接近**；原语 Base UI/Radix、Recharts 版本、provider、SSR 和 import 闭包仍不同，不能称为直接兼容。[本地标准](../../CODING_STANDARDS.md#组件化与依赖方向)、各项目 package 链接见版本表。

建议主代理先把模式作为候选 reference 进入整体地图。若人决定新增资产，先查询现有 Catalog，再独立定义不含上游品牌的中文/英文职责名、slug、导出与 props；声明 assetRole，完整核验 source family 和许可，遵守主题三桶归属。Recipe 只描述组合约束；不要引入已退役 Studio/订单/批准对象。[产品定义](../../PRODUCT_DEFINITION.md)、[规范](../../CODING_STANDARDS.md)。本调查没有查完本地 Catalog，不断言上述职责目前缺失。

## 本轮用户已确认的约束

用户已确认页面、外壳、整站均可独立安装，交付提供无密钥运行示例，统一整站入口按用途筛选。这是目标约束，不据此宣称上游或 UI Lab 已实现对应安装/示例。后续适配应保持各自安装身份与完整依赖闭包，无密钥样例用明确标注的本地 fixture 和消费方回调，供应商 provider 不成为前端资产的强制运行前提。本报告仍只列事实与候选，不改变产品源码或锁定上游选择。

## 待人决定的问题

1. 在已确认页面/外壳/整站均可独立安装的范围内，首批优先表达哪些用途与职责？目标消费者和无密钥示例需要演示的状态分别是什么？
2. 用户截图中希望保留的是 Pro 的哪种界面职责/信息组织？在没有 Pro 源码与适用授权证据时，是否只按截图讨论结构并独立实现？
3. 是否只借鉴 shadcn-studio 的分发模式，还是要寻求覆盖 UI Lab 场景的额外源码授权？本报告不替用户作选择。
4. 导航可见性、主题持久化、表格筛选/分页哪些由消费方控制？谁提供业务字段语义、国际化文本、真实加载/错误/空态？
5. 已有 Catalog 哪些项能满足需求、需要哪些变体？视觉批准和目标运行时验收由谁完成？

## 实际读取与未验证范围

读取了四仓的固定 SHA、完整递归文件树（API 均未标 truncated）、package 与根许可，以及上文逐项链接的 shell/nav/page/data/theme/config 文件。长文件采用代表性段落：Free Sidebar 前 200 行和导航配置前 115 行、订单页数据开头及完整尾部组合；studio registry 读取元数据、文件清单、入口/侧栏内容和各打包文件 import，theme 配置主要读默认主题段；satnaing dashboard 前 130 行、导航 renderer 前 95 行、用户 fixture 开头及完整 theme/main；Kiranism 导航配置前 200 行、filter 前 95 行、mock-api 前 110 行，短 layout/page/query/provider/listing 文件完整读取。取证脚本输出曾截断，随后针对关键许可、导航、版本、组合和 import 补读；不宣称每个文件逐行完成审计。

没有安装依赖、运行任何上游项目、执行 build/test、验证 registry 安装闭包、SSR/hydration、键盘/焦点/触屏/响应式、性能、真实 API/鉴权、供应商计费或服务可用性；没有打开 Pro 演示或核验用户截图，没有 Pro 源码或商业授权材料，没有完整第三方资产许可审计。没有修改产品源码、主仓、GitHub 评论/票状态；没有 commit/push。报告是静态源码调查，不是项目质量排名、兼容认证或用户批准。

## 固定 revision 源码 permalink 索引


### shadcnstudio/shadcn-nextjs-admincn-admin-template-free

- [package.json](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/package.json)
- [LICENSE.md](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/LICENSE.md)
- [src/app/(pages)/layout.tsx](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/(pages)/layout.tsx)
- [src/components/layout/Sidebar.tsx](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/layout/Sidebar.tsx)
- [src/configs/navConfig.tsx](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/configs/navConfig.tsx)
- [src/app/(pages)/dashboard/orders/page.tsx](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/(pages)/dashboard/orders/page.tsx)
- [src/app/layout.tsx](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/layout.tsx)
- [src/components/Providers.tsx](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/Providers.tsx)
- [src/fake-db/apps/users.ts](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/fake-db/apps/users.ts)
- [src/configs/themeConfig.ts](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/configs/themeConfig.ts)
- [src/app/globals.css](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/globals.css)
- [README.md](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/README.md)

### shadcnstudio/shadcn-studio

- [package.json](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/package.json)
- [LICENSE.md](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/LICENSE.md)
- [public/r/dashboard-shell-01.json](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/public/r/dashboard-shell-01.json)
- [public/r/dashboard-sidebar-01.json](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/public/r/dashboard-sidebar-01.json)
- [src/config/theme.ts](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/config/theme.ts)
- [src/app/layout.tsx](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/app/layout.tsx)
- [src/components/examples/dashboard/index.tsx](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/components/examples/dashboard/index.tsx)

### satnaing/shadcn-admin

- [package.json](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/package.json)
- [LICENSE](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/LICENSE)
- [src/components/layout/authenticated-layout.tsx](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/authenticated-layout.tsx)
- [src/components/layout/app-sidebar.tsx](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/app-sidebar.tsx)
- [src/components/layout/data/sidebar-data.ts](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/data/sidebar-data.ts)
- [src/components/layout/nav-group.tsx](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/nav-group.tsx)
- [src/features/dashboard/index.tsx](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/dashboard/index.tsx)
- [src/features/users/data/users.ts](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/users/data/users.ts)
- [src/context/theme-provider.tsx](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/context/theme-provider.tsx)
- [src/main.tsx](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/main.tsx)

### Kiranism/next-shadcn-dashboard-starter

- [package.json](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/package.json)
- [LICENSE](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/LICENSE)
- [src/app/dashboard/layout.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/app/dashboard/layout.tsx)
- [src/components/layout/app-sidebar.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/components/layout/app-sidebar.tsx)
- [src/config/nav-config.ts](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/config/nav-config.ts)
- [src/hooks/use-nav.ts](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/hooks/use-nav.ts)
- [src/app/dashboard/product/page.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/app/dashboard/product/page.tsx)
- [src/features/products/components/product-listing.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/features/products/components/product-listing.tsx)
- [src/features/products/api/queries.ts](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/features/products/api/queries.ts)
- [src/constants/mock-api.ts](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/constants/mock-api.ts)
- [src/app/layout.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/app/layout.tsx)
- [src/components/themes/theme-provider.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/components/themes/theme-provider.tsx)
- [src/styles/globals.css](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/styles/globals.css)

[F-package]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/package.json
[F-license]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/LICENSE.md
[F-shell]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/(pages)/layout.tsx
[F-sidebar]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/layout/Sidebar.tsx
[F-nav]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/configs/navConfig.tsx
[F-page]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/(pages)/dashboard/orders/page.tsx
[F-root]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/layout.tsx
[F-providers]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/Providers.tsx
[F-data]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/fake-db/apps/users.ts
[F-theme]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/configs/themeConfig.ts
[F-css]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/globals.css
[F-readme]: https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/README.md
[T-package]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/package.json
[T-license]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/LICENSE.md
[T-shell]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/public/r/dashboard-shell-01.json
[T-nav]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/public/r/dashboard-sidebar-01.json
[T-theme]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/config/theme.ts
[T-root]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/app/layout.tsx
[T-page]: https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/components/examples/dashboard/index.tsx
[S-package]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/package.json
[S-license]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/LICENSE
[S-shell]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/authenticated-layout.tsx
[S-sidebar]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/app-sidebar.tsx
[S-nav]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/data/sidebar-data.ts
[S-nav-renderer]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/layout/nav-group.tsx
[S-page]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/dashboard/index.tsx
[S-data]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/users/data/users.ts
[S-theme]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/context/theme-provider.tsx
[S-main]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/main.tsx
[K-package]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/package.json
[K-license]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/LICENSE
[K-shell]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/app/dashboard/layout.tsx
[K-sidebar]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/components/layout/app-sidebar.tsx
[K-nav]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/config/nav-config.ts
[K-nav-filter]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/hooks/use-nav.ts
[K-page]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/app/dashboard/product/page.tsx
[K-listing]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/features/products/components/product-listing.tsx
[K-query]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/features/products/api/queries.ts
[K-data]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/constants/mock-api.ts
[K-root]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/app/layout.tsx
[K-theme]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/components/themes/theme-provider.tsx
[K-css]: https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/7705dfc0d13889e45c26a55ad5908da6a7a9a605/src/styles/globals.css
