# 客户项目工作区：首版前端实现与验证

> 已删除：2026-10-08 用户明确要求删除旧版本。本版专属源码、登记、安装/全屏入口、验证夹具和截图已移除，下文 URL、安装命令和验证命令均为历史记录，不再作为当前使用说明。本文仅保留原规格下的工程证据，不代表新需求完成；新方向及待确认验收见[重新对齐记录](009-saas-admin-realignment.md)。

日期：2026-10-07—2026-10-08。状态：本地实现与工程验收完成；工程证据与用户视觉判断、Git 提交、npm 发布、线上部署分开记录。当前未提交、未发布、未部署。规格见[首版前端规格](research/2026-10-07-saas-frontend-spec.md)，验收要求见[验收规格](research/2026-10-07-saas-acceptance-plan.md)，共享契约见 [ADR 0003](../docs/adr/0003-workspace-theme-and-controlled-query.md)。

## 结果与职责

本次提供可拆用的 SaaS 后台前端资产：A 的共用外壳/概览 + B 的操作列表，独立详情页。九类界面使用同一公开实现；本地示例没有服务密钥或真实账号、支付、邮件行为。

| 页面职责 | 安装身份 / 导出 |
| --- | --- |
| 指标、趋势与最近活动 | `workspace-overview-page` / WorkspaceOverviewPage |
| 项目查询、排序、本页选择与分页 | `project-list-page` / ProjectListPage |
| 单个项目的查看、修改、保存与取消 | `project-detail-page` / ProjectDetailPage |
| 成员清单与消费者提供的操作 | `workspace-members-page` / WorkspaceMembersPage |
| 当前方案、用量、显式价格与发票 | `workspace-billing-page` / WorkspaceBillingPage |
| 工作区名称、外观与通知 | 复用 `workbench-settings-page` / WorkbenchSettingsPage |
| 邮箱与密码登录表单 | `account-sign-in-page` / AccountSignInPage |
| 注册信息与条款确认 | `account-sign-up-page` / AccountSignUpPage |
| 密码恢复邮箱表单 | `password-recovery-page` / PasswordRecoveryPage |

新增 DashboardShell、PagePagination、MetricTrendChart 与 ProjectWorkspaceSite 分别承担外壳、分页、趋势和多页组合职责。名字由本项目职责确定，没有沿用 AdminCN 或上游项目的营销名称。共新增 12 个安装身份和 1 套主题；历史 slug、category、路径及默认能力保留。

## 目录与消费接口

```text
components/motion/                  基础控件、分页和图表
components/pages/                   独立页面、明确的数据/状态/动作 props
components/site-shells/              DashboardShell、ProjectWorkspaceSite、主题作用域
  project-workspace-demo.tsx         共享本地示例控制器
  workspace-demo-{data,routing}.ts   示例样本、全量查询、URL 编解码
  workspace-demo-themes.ts           从真实 Theme Kit 生成的示例载荷
components/examples/                可复制的零参数、有本地状态的用法
components/previews/                仅站点 locale 包装
components/app/sites/               Next/history/cookie/Link 消费适配
app/[locale]/sites/.../preview/      正式双语全屏深链
lib/{registry,pages,sites}.ts         各自真实登记
lib/theme-kits/blue-ink.ts            Blue Ink 双模式主题真源
```

Core Site 接收判别联合 `screen: { page, props }`，只挂载当前页面，后台页保留同一 Shell。`onNavigate`、`pageHref`、`renderLink` 由消费者适配路由；页面接收 data/query/dirty/saveState/errors/callbacks，不读取 Next、next-intl、鉴权、API 或 UI Lab 站点 provider。

查询顺序为全量搜索/筛选 → 全量排序 → 分页。Table 的 `manualSorting` 默认 false；新列表由消费者排序，Table 不再对本页二次排序。示例使用稳定 id，改查询或分页清空本页选择。编辑值由消费者持有；显式保存/取消，离开确认和 beforeunload 在包装层。异步操作捕获页面/目标和请求编号，取消或离开后晚到结果不能写入新目标；默认不持久化草稿。

两套品牌为 Graphite 与 Blue Ink，均有 light/dark，system 单独处理。主题使用 [CSS Cascade 6 的隐式 @scope](https://www.w3.org/TR/css-cascade-6/#scoping-roots)，作用域根是 style 元素的父元素，不依赖 React ID。原生媒体 CSS 覆盖首帧，挂载后监听系统变化；品牌/模式变化不重新挂载页面。ModalPortalProvider 把 native dialog 放进当前作用域，缺省仍为 body。inline token 覆盖保持优先；偏好由消费者拥有，正式预览用服务器 cookie 初值，存储受限时仍可会话切换。核心 Shell/Site 不隐式安装或强制使用示例主题。

## 复用、来源与依赖

复用现有 Table、CollapsibleSidebar、StatsBar、BillingPlanGrid、Drawer/Modal、Input/Button、设置页及其真实源码。Sidebar/Stats/Billing 的新语义外观是显式选项，旧默认保持；annualPrice 仍表示按年支付时的折算月价，示例额外明确年总额。设置扩展原实现，不创建第二份设置页。

外部参考核验与固定 revision/许可记录见[开源后台调查](research/2026-10-07-site-template-references.md)。参考 AdminCN 的后台组合、satnaing/shadcn-admin 的页面/外壳边界、Kiranism 的消费者适配和 shadcn-studio 的 source family 形态；本次组合、接口、样本、主题与新增页面为原创实现，没有移植这些项目的源码、图片、字体或商业模板。shadcn-studio 实际附加条款没有被当作无附加限制的 MIT 许可。

新增外部运行依赖仅 Recharts 和 react-is。趋势图复用 [Recharts](https://github.com/recharts/recharts)（MIT），并参考 [shadcn Chart 官方组合实践](https://ui.shadcn.com/docs/components/base/chart)。图表开启 accessibilityLayer，固定可测高度、响应式宽度，提供文本读数；减少动效时取消绘制动画。没有图表 import 的单页和独立 Shell 不强带 Recharts。

Recharts 官方要求 react-is 与 React 对齐；registry 声明 React 19 的依赖范围，本轮实际三者为 React/react-dom/react-is 19.2.6。消费项目升级时应一起核对版本，不将一个宽范围安装声明当作所有未来版本的验证。

## 发现、安装与运行

`/sites` 从 SITES 投影已有用途组，空用途不显示；保留旧 Agent 整站。新整站详情关联九页和真实 Shell 身份，提供完整预览；旧 Agent Shell 关联仍按其历史 blocks category 生成，不硬编码 motion。

- 中文完整预览：`http://localhost:3108/sites/project-workspace-site/preview`
- 英文完整预览：`http://localhost:3108/en/sites/project-workspace-site/preview`
- 详情：`/sites/project-workspace-site`；项目深链：`.../preview/projects/project-1`
- 查询：`.../preview/projects?q=Acme&sort=progress&direction=desc&page=2`
- 本地安装：`npx shadcn@4.21.1 add http://localhost:3108/r/project-workspace-site.json`
- 单页、Shell 和主题分别使用各自 `/r/<slug>.json`；主题为 `/r/theme-graphite.json`、`/r/theme-blue-ink.json`，应明确选择后安装。

手动说明和 shadcn 使用同一 installationFiles/import 图。完整整站当前 53 个源码文件；手动复制须包括 helper，并按实际 dependencies 安装外部包，配置 `@/*` 和 Tailwind 语义 token。示例的品牌载荷只用于显式演示，不能把两套全局 :root CSS 串接。接真实业务时使用 ProjectWorkspaceSite 的页面 props 和自己的 controller；ProjectWorkspaceDemo 只负责可运行本地样本。

未发布 CLI 用 `bun cli/src/index.ts`，帮助与 init/add/lock/audit 已实际核对。没有增加 create/scaffold 命令、万能配置、服务端套餐或新 Recipe。

## 实际工程验证

环境：macOS arm64、Bun 1.3.14、Node 24.6.0、Chrome 154.0.8037.98。独立 Next：15.5.18；独立 Vite：6.1.0；均实际解析 React/react-dom/react-is 19.2.6、Motion 11.18.2、Recharts 3.10.1、Tailwind 4.1.18、TypeScript 5.9.3。这些是本轮通过的组合，不是每个最低 patch 或未来版本的证明。

| 验证 | 实际范围与结果 |
| --- | --- |
| 根门禁 | `bun run check` 通过；140 registry components、15 theme items、170 安装 targets / 231 源文件；571 条快照与当前 Catalog 一致 |
| 根测试 | `bun run test`：269 passed / 0 failed；包括全量查询、受控排序兼容、URL、作用域 SSR/portal、主题载荷和窄图回归 |
| CLI | `bun run check:cli`：类型检查与构建通过；未发 npm |
| 窄图独立用法 | 初轮 17 个独立用法、34 hydration；共享改动后复测 9 个/18 hydration，整站与详情定稿再测 2 个/4 hydration；原生作用域定稿后整站与 Shell 各1个/2 hydration；每轮只复制各自真实安装图 |
| Next/Vite 真安装 | 两个干净包执行 shadcn 4.21.1、复制可用用法、strict typecheck、生产 build/run；各 34 主流程检查 + 144 展示组合 + 24 关键布局，通过 |
| 手动 Vite | 不执行 shadcn，按同一真实图复制 53 文件；strict/build/run、34 主流程 + 144 展示 + 24 关键布局，通过 |
| 正式全屏预览 | 36 主流程检查；中桌面普通动效、英390px reduce；144 展示组合 + 24 关键布局，通过 |
| 主题与 SSR | 12 个禁用 JS 的两品牌/三模式/两系统偏好首帧；系统运行时变化、无效 cookie 回退、存储阻止后的会话切换、未知路由404和未知项目反馈；共16项，通过 |
| 多主题隔离 | 用真实 WorkspaceThemeScope 的 SSR HTML 验证8个禁用 JS 的作用域：同品牌不同 token、并列/嵌套隔离、两系统首帧与 inline 覆盖，通过 |
| 额外失败/键盘 | 正式预览及独立 Next/Vite 各11项：键盘查询/选择/排序/分页/详情保存与窄屏入口恢复、四个品牌/模式浮层继承及 Escape 入口恢复，邀请/账单/设置/三账号失败保留与键盘重试，通过 |
| Token 真安装 | system 直接/间接补缺、重复安装、用户变量保留、明确 Graphite/Blue Ink 替换及独立覆盖保留，通过 |
| Modal 独立消费者 | 真实 Drawer/BottomSheet 安装，strict/build；普通/reduce、初始/循环/恢复焦点、inert 背景、嵌套 Escape 与真实 touch drag，通过 |
| 生产 Catalog/路由 | 170 JSON/raw/usage 与源码/快照一致；450条实际视觉路由各测中英、PAGES/SITES 的 sitemap/详情；168个浏览器场景 + 20轮整站/外壳连续加载，无未捕获异常；110个历史双语锚点保留 query/hash 并实际滚动到目标，通过 |

展示矩阵固定为九页 × 中英 × Graphite/Blue Ink × light/dark × 1440/390，共144项/工程。另补360/768关键列表/详情/账号布局24项（在各起始桌面/窄屏上下文执行）。表格允许自身横向滚动，根文档不溢出。主流程实际检查查询/选择清空、详情校验焦点、失败后保留/重试、主题切换保留草稿、取消按钮导航、取消浏览器返回只提示一次、前进后退查询恢复、离开后晚到保存无效、邀请/角色/取消移除、年总额与方案确认、设置、三账号、图表、页面重试和刷新。

生产本地没有 Vercel 的两个 analytics 脚本端点；流程测试只对 `/_vercel/insights/script.js` 和 `/_vercel/speed-insights/script.js` 提供空脚本，不拦截任何产品资源或请求。完整流程报告没有未捕获异常或 console error；这个结论不扩展为远端 analytics 已上线。

## 失败、修复与证据位置

- 本地 127.0.0.1 绑定与 next-intl rewrite 的 localhost 地址不一致导致中文重定向循环；改为 localhost 绑定后正式裸中文入口通过，未改 middleware。
- 初轮消费者测试定位器误选移动 Drawer 后面的面包屑；修正为导航区域，并显式检查取消后 Escape 关闭。Vite 消费夹具的相对 base 导致深链静态资源404，改为实际 history 路由所需的 `/`。
- 浏览器返回取消原先会再次提示；包装增加恢复标记，URL/输入与一次提示实测通过。未知项目补明确反馈；设置/邀请补错误定位和取消清理；返回 Catalog 链接也确认未保存离开，修正旧 Agent 外壳关联为真实历史类别。
- 消费夹具快速切换语言时曾出现 hydration 文案恢复错误；把语言入口启用延后到 mount，更新该 Next 消费包装并重做生产构建及11项失败/键盘检查。
- 扩展 Catalog 的真实页面检查另发现 SSR 恢复异常：直接刷新 Shell 未复现，但整站详情 → Shell 详情循环可复现。开发日志显示主题作用域的 server/client useId 路径不同，ID 进入 CSS 文本后触发恢复。等待加载或仅修正 locale 都不能消除；显式同步 locale Provider 虽通过五轮局部循环，生产完整检查仍失败，该候选已撤回。最终改用原生隐式 @scope，CSS 不再依赖 React 树位置；16项偏好/SSR与11项键盘/失败流程在开发、生产环境通过，生产保留20轮循环和原完整场景。没有关闭 SSR、增加 suppressHydrationWarning 或升级整个框架。详情 locale 另按 [next-intl 静态渲染约定](https://next-intl.dev/docs/routing/setup#static-rendering)在翻译 API 前设置，避免英文详情预览继承中文。
- 另发现既有顶部 PressLink 的 reduce 首帧 tabindex 不一致，改用统一 hydration hook；这是单独的首帧修复，不把它当作主题 CSS 恢复异常的原因。
- 原生作用域版的正式全屏、独立 Next/Vite、手动复制均通过，Catalog 仍有偶发 HTML 恢复异常。开发循环未复现该剩余异常；生产原场景可捕获。针对异步预览加载的预测，将新整站与 Shell 两条站点预览改为普通客户端组件引用，移除额外 next/dynamic 包装，保留 SSR。随后原生产168场景、20轮连续加载与110历史锚点通过。该局部改动没有扩展为整个预览库迁移；Next 的服务端动态导入边界说明见[官方 lazy loading 文档](https://nextjs.org/docs/app/guides/lazy-loading#importing-client-components)。
- 额外检查两条详情在英、light/dark、1440/768 下200次加载，未捕获异常；该诊断浏览器仅在 React 418 构造时设置调试暂停点，实际没有触发。记录：`/tmp/uilab-workspace-html-debug.json`。生产完整 Catalog 与历史锚点门禁不使用该调试包装。诊断脚本、截图和日志留在明确命名的 /tmp 目录，产品源码没有调试注入。
- 最后生产构建曾因磁盘空间不足退出；仅删除本次生成的 `.next/cache/webpack` 可重建缓存后重跑，源码、其他任务改动与消费验证证据保留。
- 修改用法或源码后运行旧 build 会被 Catalog 检查明确判为 stale；停服务、重新生产构建后复测。同工作区 dev 未与 build 并行。

原生作用域定稿的真安装证据：`/tmp/uilab-catalog-assets-Jc48hQ/`，含 catalog/registry/commands/requests、两 Profile 的 package/lock、用法选择、截图与 workflow/matrix/states JSON。前一定稿证据 `/tmp/uilab-catalog-assets-mWlSnm/` 保留。原生版本两消费者的11项附加流程日志：`/tmp/uilab-workspace-states-next-native.log`、`/tmp/uilab-workspace-states-vite-native.log`。

手动复制定稿：`/tmp/uilab-workspace-manual-DlpduS/`；前轮 `/tmp/uilab-workspace-manual-m9bFmD/` 保留。正式预览：`output/playwright/workspace-final/`。Token：`/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-system-tokens-X3lzMu/`。Modal：同临时根的 `uilab-installed-modals-jB8H3R/`。原生作用域用法定稿：同临时根的 `uilab-standalone-usage-VFhnby/`（整站）、`uilab-standalone-usage-UabEyY/`（Shell）；前轮 `uilab-standalone-usage-wIkcls/` 保留。多作用域日志 `/tmp/uilab-workspace-native-scope.log`；生产全屏偏好与键盘日志 `/tmp/uilab-workspace-{preferences,states}-native.log`。生产 Catalog/历史锚点最终证据：同临时根的 `uilab-catalog-site-uXSM4C/`、`uilab-deep-links-3E3S3q/`。最后构建/根门禁日志：`/tmp/uilab-workspace-build-preview-boundary.log`、`/tmp/uilab-workspace-check-delivery.log`。

可复现入口：根 package.json 的 check/test/check:cli/check:usage-browser/check:system-tokens/check:modal-consumer/check:catalog-site；新整站消费者执行 `UILAB_WORKSPACE_ACCEPTANCE=1 bun run benchmark:catalog-assets`；手动复制执行 `bun scripts/verify-workspace-manual-consumer.ts`；多作用域执行 `bun scripts/verify-workspace-theme-scope.tsx`。偏好/失败附加检查通过 benchmarks/runs/catalog-assets 的 workspace-preferences.mjs / workspace-states.mjs 执行，其独立工程使用自身工具链。

## 审查结论与边界

需求符合性：九类界面、A+B 布局、拆分消费、两套真实主题、独立 Next/Vite、正式预览与本地可恢复操作已实现并有上述证据。规则符合性：职责独立命名、真实下层复用、owned family 与闭包分开、站点框架隔离、默认 API 兼容、主题安装保留、可复制用法、来源及许可记录符合相关规则；共享契约记录 ADR 0003。

用户批准的是规划及原型方向；本轮截图和 Agent 检查不代表正式视觉批准。主题浏览器需要支持 CSS @scope，本轮实际为 Chrome 154；Firefox/WebKit、真实触屏设备与系统输入法未覆盖。新模板 Electron 运行留待后续，旧资产原有 Profile 保留。真实业务鉴权、请求、权限、支付和邮件由消费项目实现。最低依赖 patch、所有未来组合和远端部署没有据此获批或验证。未改动任务外 skills-lock.json / .grok；本轮没有 Git commit/push、tag、npm 发布或生产部署。
