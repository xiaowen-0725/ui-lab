# SaaS 后台模板：完整规格与验收清单

日期：2026-10-08。状态：用户回复“可以”，确认完整规格及具体适配包，进入实施；本文不是完成、视觉验收或发布记录。已确认需求见[计划009](009-saas-admin-realignment.md)，产品边界见 [PRODUCT_DEFINITION.md](../PRODUCT_DEFINITION.md)，来源核验见[基线调查](research/2026-10-08-saas-admin-baselines.md)。

## 结果与范围

提供可直接运行、切换主题、拆用页面和外壳的 SaaS 后台前端模板。采用免费 AdminCN 的实际源码和界面组合，基础控件统一采用官方 shadcn/ui Base UI 版；保留上游布局、默认排版、信息密度和默认交互，以本地数据演示流程。Next/Vite 消费者适配业务、路由、偏好存储和国际化，不需要鉴权、数据库、支付或邮件密钥。

首批为九类页面职责：订单总览、用户管理、个人资料、设置、数据表格、表单、登录、注册、找回密码，对应下表12个上游实际页面入口。Mail、Calendar、其他认证变体、商业 Sales 页面、项目管理及独立账单模块不在本次首批实施范围；用户详情已有 Billing 标签仍保留，不把它扩展为独立账单产品。

主题为上游默认 + Blue Ink；两品牌均支持 light/dark，system 独立处理。默认保留上游视觉，Blue Ink 使用现有真实主题取值并对接后台所需语义变量，保持页面布局及状态。模板中文优先，同时提供英文；默认英文内容用作上游对照样本，中文和 Blue Ink 作为约定差异验收。

旧 ProjectWorkspaceSite 及其专属源码和12个安装身份已删除，不作为底座、兼容占位或第二套模板重新加入。

## 实际页面与分支

下表来自固定 revision，路径相对上游 `src/`。后台页面位于 `app/(pages)`，认证页面位于 `app/(blank)`；这是来源路由，不承诺消费者必须采用同一路径。对应源码链接及耦合证据见[页面调查](research/2026-10-08-saas-admin-baselines.md#页面分支与耦合核对)。

| 职责 | 上游路由 | 保留的实际分支 |
| --- | --- | --- |
| 订单总览 | `/dashboard/orders` | 上游 Orders 卡片/图表/交易表格组合；不改成 Sales |
| 用户管理 | `/apps/users/list`、`/apps/users/view` | 列表及详情；详情 Account、Security、Billing、Notifications、Connections 五个标签 |
| 个人资料 | `/pages/user-profile` | Profile、Connections 两个标签；URL `view` 参数语义 |
| 设置 | `/pages/user-settings` | General、Workspace 两个标签；URL `setting` 参数语义 |
| 数据表格 | `/datatable` | Basic、Pinnable Columns、Filters 三个同页示例 |
| 表单 | `/forms/form-layouts/vertical`、`/forms/form-layouts/horizontal`、`/forms/form-validation` | 两布局各 Basic/With Icon；校验页注册示例及 onChange/onBlur/onSubmit/onTouched 四种模式 |
| 登录 | `/pages/auth/login` | 免费版默认布局 |
| 注册 | `/pages/auth/register` | 免费版默认布局 |
| 找回密码 | `/pages/auth/forgot-password` | 免费版默认布局 |

上游 Users 详情固定读取 `users[0]`，列表详情链接也没有用户 ID；认证表单仅阻止默认提交，不是完整成功/失败流程。已确认的用户选择与模拟反馈是下文明确适配，不能写成上游原有能力或真实服务。

## 来源与复用原则

固定模板基线：`shadcnstudio/shadcn-nextjs-admincn-admin-template-free`，revision `dd1afd2f3a794ea9e746197de314f81d43670ea1`。推荐官方基础控件采用 `shadcn-ui/ui` revision `97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0` 的 Base UI、base-vega/neutral、Lucide 生成结果；保留官方 API/行为，并记录 style 展开、图标绑定及 cn helper 路径适配。推荐起始维持 Free 的 Base UI 1.6.0、TanStack Table 8.21.3、cmdk 1.1.1 及其固定锁文件中的其他配套版本，实际消费者解析与兼容需验证。不自动升级到最新文档/包版本，不把组件目录名或 Base UI 包依赖当作“官方原样”的证明。

基础控件从官方 Base UI 实现家族取得；Button、Input、Card、Select、Dropdown、Dialog、Sheet、Sidebar、Table 等按实际 import 图列出。官方组合库 TanStack Table、Recharts、cmdk 等及其间接依赖已允许，不自行替换为 Radix 版或重写同类控件。免费模板已有控件定制需与对应官方版本区分；原样移植上游业务区块不等于新增自写基础控件。

保留作者、来源 URL、revision、版权与 MIT 声明，按免费模板 README 保留来源归属链接；不从 Studio 受限制仓库或商业模板补入缺失页面。图片、字体、图标按实际使用文件单列来源与依赖，不能把运行时 CDN 链接当作已完整分发的资产。

规格确认前的抽样仅完成 Button/Sidebar 的主要对照与 Dialog/Sheet 的 Portal API 核对；实施后的32份同名控件结构/API对照与新增差异见[来源记录](../docs/sources/saas-admin.md)。调查不能推导所有控件都未经定制，具体范围见[抽样报告](research/2026-10-08-saas-admin-baselines.md#官方组件抽样对照范围)。基础原语采用官方生成结果，页面布局沿用 Free；完整安装闭包与实际差异在实施首步核对，真实 API/行为差异仍需提前沟通，不默认忽略或自行修补。

## 目录、身份与依赖方向

目录延续现有可分发资产定位，不创建独立全栈工程或未来通用创建器：

```text
components/ui/                       官方 shadcn/ui Base UI 控件
components/pages/saas-admin-*.tsx     九类独立页面入口
components/pages/saas-admin/          上游区块、页内分支和必要 helper
components/site-shells/              后台外壳、引用真实页面的整站入口
components/examples/                 独立复制用法及无密钥本地示例
components/previews/                 Catalog 展示包装
components/app/sites/                站点 Next/locale/偏好适配
app/[locale]/sites/                  整站详情、全屏预览与深链
lib/{pages,sites,registry}.ts         实际资产与安装闭包登记
lib/theme-kits/                      默认后台主题及现有 Blue Ink
```

已确认的整站身份为 `saas-admin-site`，外壳为 `saas-admin-shell`；独立页面使用 `saas-admin-<职责>-page`。名字描述通用后台职责，上游品牌保留在来源记录；这些是已确认的新身份，尚未登记，不能编造当前安装命令。其他既有资产、源码路径及公开身份保持。

整站 → 外壳/页面 → 区块 → 官方控件。预览、安装和独立用法引用同一实现，页面安装包含实际依赖；官方控件不反向依赖业务页面、站点 provider 或 UI Lab Catalog。可分发代码以 props/回调接入数据、文案和导航；Next、next-intl、URL/存储策略和演示请求在消费层。上游视图若有 default export，移植时的具名导出转换作为明确机械适配记录，不修改基础控件 API。

## 允许变化与须提前沟通的改动

已允许正常 props、className、主题变量配置和页面组合，包括约定的中英文内容、数据、品牌主题及首批菜单范围。不存在上游页面的职责不会用自写新页面悄悄补齐。

已确认的适配按实际源码清单逐项核对：

| 适配 | 意图 | 必须保留的行为 |
| --- | --- | --- |
| 导航包装 | Next Link/hooks 留在消费层，页面/外壳提供导航与链接适配；Vite 接自己的路由 | 当前菜单、href、折叠、移动导航、刷新和前进/返回 |
| 数据与动作包装 | 演示请求、URL 查询及样本由消费 controller 提供，避免分发资产依赖上游 server actions/API | 原表格/表单/详情的搜索、筛选、排序、分页、提交和反馈 |
| 内容与导出适配 | 页面/区块的实际文案入口、具名导出及 import 路径适配 | 保留控件 API、DOM 结构、排版层级及默认交互，不因命名规则重写原语接口 |
| 主题包装 | 接上游默认及 Blue Ink，品牌与模式独立，偏好由消费者拥有 | SSR 首帧、portal 浮层主题、状态保留，预览不写入外部 Catalog 偏好 |

以上具体适配已确认，但不授权未知源码修改。基础控件改源码/API/默认交互、新增自定义组件或需要改变原页面交互的条目，须先给出文件/来源、缺口、建议改动和替代方案；只修改事先沟通过的范围。实现中出现新缺口，补充清单后再决定。

### 已确认的具体适配包

以下改动限于上游布局/页面组合与 UI Lab 消费包装，不是修改官方基础控件的授权。新业务接口保留原 DOM、class、布局及现有控件组合；新增反馈使用官方控件既有 API。

| 来源与缺口 | 推荐实施范围 | 不采用该适配的选择 |
| --- | --- | --- |
| `components/layout/{Sidebar,Header}.tsx`、用户表格列及认证/设置视图直接依赖 Next Link、pathname/searchParams | 链接/当前位置/跳转由 props 或消费适配器提供；Next 包装保留 href、刷新及前进/返回，Vite 接自己的导航。不复制第二套外壳 | 仅支持 Next，放弃既定 Vite/独立分发目标 |
| `user-profile-tabs.tsx`、`user-settings-tabs.tsx` 依赖 nuqs | 页面接当前标签及变更回调；Next 包装保持 `view`、`setting` 查询和 history push，Vite 包装提供等价 URL 语义 | 将标签仅保留本地状态，明确降低深链/历史能力 |
| `views/apps/users/view/index.tsx` 固定首位用户，列表详情链接固定；页面直接读取 fake-db | 使用同一套上游样本默认值，页面接数据/用户选择；列表行操作通过消费包装打开该行对应详情，不新增动态服务端接口 | 保持每一行都打开首位用户的静态展示 |
| 认证仅 `preventDefault`，现有演示保存/提交缺少消费者动作边界 | 上游表单组合增加 `onSubmit` 等消费回调；本地 controller 模拟等待、成功/失败及重试。反馈、禁用及错误通过官方 Button/Input/Alert/Sonner 等既有 API，列出原展示与增加反馈的截图差异；不构造账户/邮件服务 | 静态表单无可观察提交结果，不满足约定的交互演示验收 |
| 上游 mode 按钮只切 light/dark；未提供品牌选择及返回 system 的入口 | 在现有顶栏模式入口使用官方 Dropdown/Select 组合提供默认/Blue Ink、light/dark/system；消费包装保存偏好，不通过 key 重挂页面/provider；保留字体、布局、间距，Blue Ink 只映射所需语义与图表/侧栏 token | 默认维持上游按钮，第二品牌/返回 system 只能由外部代码控制 |
| `DialogContent`/`SheetContent` 内部创建 Portal，未透传 container；局部品牌变量无法直接通过已有 Content props 定位浮层 | Catalog 内嵌预览使用独立 iframe 加载同一整站预览，主题作用于其 html/body；全屏及独立消费者同样使用文档主题。偏好用模板独立键，由包装接收预览配置；不新增 ThemePortalContext、不改官方原语。验证 iframe 高度、导航、焦点及 SSR | 同页局部预览需要先验证额外 Portal 组合，或另行沟通 Content 源码/API 改动；不保证现有 props 可解决 |
| 上游视图多为 default export；现有架构检查要求可分发闭包具名导出 | 仅对模板视图机械转换导出/import、路径和文案入口，保留函数行为；实际共享区块沿用上游实现，不为抽象重写 | 放弃当前资产闭包规范，需要另行架构决定 |
| Sidebar 请求 `/api/nav-apps`，服务端转取 CDN 推广导航；首批无需此服务 | 消费包装提供首批实际页面的静态导航；去掉未移植/Pro 的可运行入口。未被首批调用的 server-actions、Mail/Calendar API 不迁入 | 引入无关服务/CDN 依赖及未实现入口 |

iframe 是站点预览包装，不进入可分发页面/控件闭包；它不代表已经证明所有浮层、无障碍或 SSR 行为通过。字体、样本图片和实际 token 清单在来源台账中冻结，远程资产的分发方式核对后再落地。官方组件与免费模板版本/样式差异按下述调查单独处理，不用这一适配包概括授权未知原语修改。

## 可观察验收条件

| 项目 | 完成条件 | 证据 |
| --- | --- | --- |
| 来源符合 | 基础控件可追溯官方 Base UI 实现；移植区块可追溯免费模板；差异及提前确认记录完整 | 逐项来源/版本/差异清单、许可声明与安装源码 |
| 默认视觉 | 在同视口、同语言/样本、同默认主题下逐页对照上游；侧栏/顶栏、卡片数量和组合、表格/表单结构、排版及密度保留，允许变化单列 | 上游及本地对应截图、差异说明、用户逐页确认 |
| 页面完整 | 九类职责及冻结的页内分支可达；不把未做的 Pro、Mail/Calendar 或其他认证页显示成可运行入口 | 页面/分支清单与导航实测 |
| 导航 | 当前页准确；桌面折叠、移动打开/关闭、可用链接、深链、刷新、前进/返回正确；账号界面沿用上游无后台壳布局 | 桌面/窄屏及 Next/Vite 路径实测 |
| 数据表格 | 沿用上游实际配置的查询、筛选、排序、分页、选择与行操作；对全量数据按约定顺序处理，稳定行标识，不重写表格引擎 | 冻结的输入/动作/预期结果及失败恢复样本 |
| 表单与账号 | 输入、校验、提交中、完成和失败可观察；失败保留适当输入，错误可定位，可重试，避免重复提交 | 本地模拟成功/失败流程；不宣称真实账号或邮件已产生 |
| 资料与设置 | 保留上游页内导航、字段及操作；本地更新可见，取消/保存语义与实际控件一致，不悄悄增加另一套业务规则 | 每个冻结分支的编辑、完成、失败/恢复实测 |
| 主题 | 默认/Blue Ink × 明/暗完整覆盖表面、文字、状态、图表、侧栏与浮层；system 初始及系统运行时变化正确；SSR 有明确默认/system 回退，读取本机偏好后避免闪烁 | 两品牌/模式、系统偏好、初始渲染与 hydration 场景；不声称服务端可读 localStorage |
| 状态与偏好 | 品牌/模式切换不丢当前页、查询、输入和提交目标；刷新恢复本机主题偏好；无效或禁用存储有可用回退 | 切换、刷新、存储受限和晚到结果场景 |
| 语言与布局 | 所选全部页面/分支覆盖中英、两品牌、明暗、1440px/390px；360/768px 补关键壳、表格、表单和账号 | 自动生成实际样本矩阵；不提前编造场景数量 |
| 键盘/焦点 | 导航、菜单、模态、表格及表单可用；检查初始/限制/恢复焦点、Escape、背景隔离和错误提示 | 关键完整流程无鼠标实测；自动检查不代替人工判断 |
| 动效/SSR | 保留必要反馈；减少动效时无无意义位移/延迟；SSR/hydration 无结构差异或可恢复错误 | 普通/reduce 及 Next 生产路径实测 |
| 独立消费 | 所有登记入口仅安装自己的闭包即可 typecheck/build/run；整站和拆用引用同一实现，消费者不依赖站点模块 | 独立用法隔离及干净 Next/Vite 真安装 |
| 站点与分发 | 中英详情/预览、源码、registry、Catalog、CLI 快照和 sitemap 与真实资产一致；既有资产回归通过 | 根 check/test、影响范围对应检查与生产运行 |

工程检查、来源符合性、用户视觉验收与发布分别记录。任一页面仍有未解释的明显视觉差异、控件被自写实现替代、独立消费缺依赖，均不能汇总为模板完成。首轮浏览器为实际 Chrome/Chromium，记录版本及未测范围；不以一种浏览器通过推导所有浏览器支持。

## 实施顺序与确认点

1. 确认本规格、页面/分支和具体适配包；已于2026-10-08确认，开始实施。
2. 在已确认范围内完成官方组件完整闭包的来源/差异核对和依赖锁定；遇到未列出的真实 API/行为差异先沟通。
3. 建立隔离的上游参考，取得默认品牌的同视口截图；先移植默认外壳和订单总览，展示来源与视觉对照，再扩展其余已选模块。
4. 按已确认清单做消费包装，接中英及第二主题，完成独立页面/外壳/整站的真实登记与用法。
5. 按实际安装图及界面分支冻结验收矩阵；执行根检查、Next/Vite 独立消费、生产站点、状态/主题/键盘与来源核对。
6. 用户逐页确认视觉与体验；提交、发版、部署分别遵照明确授权。

上游版本与页面模块的静态核对不构成已安装、已兼容或视觉通过。实施仅限已确认规格及适配包，不扩展为对未知定制、推送或发布的批准。
