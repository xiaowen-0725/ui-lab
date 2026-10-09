# SaaS Admin：Base UI 底座与可复用基线核验

核验日期：2026-10-08。只读官方文档、固定版本源码及许可；未安装或运行上游，未移植源码，未作用户视觉验收。已确认要求与待决定项见[对齐记录](../009-saas-admin-realignment.md)。

## 候选事实

| 候选 | 固定 revision | 主要控件底座 | 许可和内容边界 |
| --- | --- | --- | --- |
| satnaing/shadcn-admin | e16c87f213a5ba5e45964e9b67c792105ec74d26 | Radix；Dialog/Select 等直接导入 Radix | 根 LICENSE 为 MIT；使用 Base UI 需迁移控件，不能称为原样复制 |
| 免费 AdminCN | dd1afd2f3a794ea9e746197de314f81d43670ea1 | Base UI 1.6.0，components.json 为 base-vega | 根 LICENSE.md 为 MIT；免费总览是 Orders，Sales 等属于 Pro；README 另要求页脚归属链接 |
| shadcn-studio 公开仓库 | 72a20331970218848103184b61e1efa9d0e08dea | 所查公开源码为 Radix；官网提供 Base UI 分发选项，两者不能混为一份实现 | 根许可附额外限制，不能当普通 MIT 源码池直接搬入 UI Lab |

第一方依据：[shadcn-admin package](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/package.json)、[shadcn-admin LICENSE](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/LICENSE)、[免费 AdminCN package](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/package.json)、[免费 AdminCN components.json](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/components.json)、[免费 AdminCN LICENSE](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/LICENSE.md)、[Free/Pro 对照及归属说明](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/README.md)、[Studio LICENSE](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/LICENSE.md)、[Studio Dialog](https://github.com/shadcnstudio/shadcn-studio/blob/72a20331970218848103184b61e1efa9d0e08dea/src/components/ui/dialog.tsx)、[官网分发说明](https://shadcnstudio.com/docs/getting-started/how-to-use-shadcn-cli)。

Studio 附加条款限制未经修改的组件再分发，并限制直接竞争产品；不能据此推出修改少量源码即可获准。商业模板采用另行许可，其[官网许可](https://shadcnstudio.com/license)允许商业终端产品，但列出 UI 库、模板及 starter kit 等再分发限制；购买模板不等于获得 UI Lab 模板分发权限。免费 AdminCN 根 MIT 与 README 页脚说明的文本差异单独记录，不将 Studio 总体条款直接套到这个独立仓库，也不擅自删除来源声明。

## Base UI 版本的准确含义

官方 shadcn/ui 同时保留 Base UI 与 Radix 实现家族，不能只改配置就认为已有组件已完成迁移。此处采用用户选择的 Base UI 家族；它并不意味着所有功能都由 @base-ui/react 单独提供。

- Table 是官方原生 HTML 表格组件；Data Table 按官方指南组合 TanStack Table，不自行重写排序/分页引擎。
- Chart 按官方组合使用 Recharts。
- Sidebar 是官方组合组件，包含布局、折叠、Sheet、Tooltip 等。
- Command 官方 Base UI 文档仍采用 cmdk；免费 AdminCN 的 cmdk 锁文件快照包含 Radix 间接依赖。因此“使用 Base UI 版控件”与“依赖树中完全没有 Radix”是两个不同条件。用户在第二轮确认允许官方配套库及其间接依赖，不要求依赖树完全没有 Radix。

依据：[官方默认底座说明](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)、[Base UI Data Table](https://ui.shadcn.com/docs/components/base/data-table)、[Base UI Chart](https://ui.shadcn.com/docs/components/base/chart)、[Base UI Command](https://ui.shadcn.com/docs/components/base/command)、[官方 Base Sidebar 源码](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/bases/base/ui/sidebar.tsx)、[免费 AdminCN cmdk 锁文件](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/pnpm-lock.yaml#L4674)。

官方站点版本、上游模板声明版本和消费者实际解析版本分别记录；尚未确认使用何种精确版本，不以最新 release 代替安装兼容性验证。

## 用户已选择的基线

2026-10-08 第二轮用户回复“按推荐”：以免费 AdminCN 为外壳、Orders 总览及已有页面的复用基线，保留其版权、许可和来源归属；基础组件采用 shadcn/ui 官方 Base UI 对应实现。用户接受“免费版本而非原 Sales 页面”这项内容差异，不自行补造商业页面。

免费模板现有组件是否改过官方源码仍需逐项比对，不能因目录叫 components/ui 或基础是 Base UI 就豁免来源与定制检查。必要的框架/路由适配、官方组件差异、缺失页面及新增组件应先形成具体清单，再依已确认边界沟通；本次选型推荐不授权这些未知改动。

未验证：实际构建、SSR/hydration、完整依赖图的运行参与情况、UI Lab 注册/安装闭包、Next/Vite 兼容、全部第三方图片字体权利、用户截图与免费模板的视觉一致性。免费模板声明 Next 16，UI Lab 当前为 Next 15；不能把大版本相近或静态查证写成已兼容。

## 页面分支与耦合核对

2026-10-08 对固定 Free revision 的只读核验；不是构建或浏览器结果。九类职责对应12个上游页面入口，页内标签和同页示例不另算路由。

| 职责 | 固定源码 | 实际边界 |
| --- | --- | --- |
| Orders | [页面组合](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/%28pages%29/dashboard/orders/page.tsx) | 1路由；statistics/widgets/charts 与交易表格组合 |
| Users | [列表](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/apps/users/list/index.tsx)、[详情](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/apps/users/view/index.tsx)、[标签](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/apps/users/view/user-view-tabs.tsx) | 2路由；详情5标签；固定 users[0]，没有动态用户路由 |
| Profile / Settings | [资料](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/user-profile/index.tsx)、[设置](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/user-settings/index.tsx) | 各1路由、2标签；资料 Profile/Connections，设置 General/Workspace |
| Data Table | [页面](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/datatables/index.tsx) | 1路由；Basic、Pinnable Columns、Filters 三示例 |
| Forms | [Vertical](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/forms/form-layouts/vertical/index.tsx)、[Horizontal](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/forms/form-layouts/horizontal/index.tsx)、[Validation](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/forms/form-validation/index.tsx)、[模式](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/forms/form-validation/validation-demos.tsx) | 3路由；两布局各 Basic/With Icon，校验页有注册示例及4校验模式 |
| Auth | [Login](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/auth/login/index.tsx)、[Register](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/auth/register/index.tsx)、[Forgot Password](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/auth/forgot-password/index.tsx) | 3路由，各1免费布局；认证表单仅 preventDefault，未接服务 |

框架耦合核对：

- [Sidebar](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/layout/Sidebar.tsx)、[Header](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/layout/Header.tsx) 使用 Next Link/pathname/searchParams；[用户列](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/apps/users/list/user-table-columns.tsx) 详情链接固定。认证和部分设置子视图也使用 Link。
- [资料标签](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/user-profile/user-profile-tabs.tsx)、[设置标签](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/views/pages/user-settings/user-settings-tabs.tsx) 使用 nuqs，分别管理 `view` / `setting`，history push/shallow；用户详情标签是本地状态。
- [server actions](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/server/actions.ts) 包含取数函数，但全源码引用核对未发现调用者；不能以文件存在推导首批页面依赖它。[导航 API](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/api/nav-apps/route.ts) 转取 CDN 导航供 Sidebar 使用；首批未发现业务 API 请求。
- [根 layout](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/layout.tsx)、[Providers](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/Providers.tsx) 包含字体、NuqsAdapter、next-themes、Sidebar/Tooltip provider。这些是消费包装依赖，不应导入纯页面闭包。
- [ModeToggle](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/layout/ModeToggle.tsx) 只提供 light/dark 切换，尽管 ThemeProvider 初始为 system；尚无品牌选择/品牌记忆。增加两品牌及 system 入口需明确列为 UI 组合适配。

默认主题按 [globals.css](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/app/globals.css) 为 neutral；primary 浅色 `oklch(0.205 0 0)`、深色 `oklch(0.922 0 0)`。图表和部分深色 sidebar token 有彩色值，不将它误称为整体紫色品牌。CDN README 宣传图作为调查参考，不代替固定源码运行截图。

## Portal 与局部主题约束

代表性只读样本：Free [Dialog](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/ui/dialog.tsx)、[Sheet](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/ui/sheet.tsx)；官方固定 revision [Dialog](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/bases/base/ui/dialog.tsx)、[Sheet](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/bases/base/ui/sheet.tsx)。

两份来源中，Content 内部均无参数创建 Portal，Content props 传给 Popup，不直接透传 portal container。DialogPortal 本身导出并透传 Portal props；SheetPortal/SheetOverlay 没有导出。Base UI [1.6.0 DialogPortal](https://github.com/mui/base-ui/blob/v1.6.0/packages/react/src/dialog/portal/DialogPortal.tsx) 本身支持 container；[底层解析](https://github.com/mui/base-ui/blob/v1.6.0/packages/react/src/floating-ui-react/components/FloatingPortal.tsx#L114) 未传时先查父 Portal，再到 body。因此不能说外包 Portal 必然无效，也不能说现有 Content 已支持 container；嵌套组合尚未运行验证。

推荐在独立文档/iframe 上设置主题，避免修改官方原语；同页局部主题需另行验证 Portal 组合或先沟通具体 API 改动。该推荐及完整适配包见[规格](../010-saas-admin-spec.md)，尚待确认，未实施；不暗自创建 ThemePortalContext 或自行组合新原语。

## 官方组件抽样对照范围

官方 revision 为 `97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0`，采用 Base 原始源码与 [style-vega.css](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/styles/style-vega.css) 一起核对。原始源码的 `cn-*` 类需要经过 style 生成展开；不能直接把它与模板内联 Tailwind 类的文本差异当作定制。免费模板当时复制的精确官方 revision 未定位，不宣称历史逐字原样。

| 抽样 | 核对结论 | 限制 |
| --- | --- | --- |
| [Free Button](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/ui/button.tsx) / [官方 Button](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/bases/base/ui/button.tsx) | primitive、props、六种 variant、八种 size 一致；所查未发现额外 API、事件逻辑或 Vega 样式定制；helper 路径/格式及生成样式表示不同 | 静态核对，不证明所有状态渲染相同 |
| [Free Sidebar 基础组件](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/ui/sidebar.tsx) / [官方 Sidebar](https://github.com/shadcn-ui/ui/blob/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/bases/base/ui/sidebar.tsx) | cookie、快捷键、移动 Sheet、render 合成、Tooltip 均已有；free 图标未带官方原始源码的 cn-rtl-flip | 图标差异的历史/生成原因未定；本次中文/英文是 LTR，不扩展为 RTL 验收 |
| Dialog / Sheet | 核对 Portal API 与结构，见上一节；Free 使用具体 Lucide 图标，官方源文件为图标占位 | 未完成全部 Vega 样式逐项核对 |
| Select / Dropdown | 固定来源可定位 | 未完成独立对照，不能标为原样或私改；完整安装闭包核对仍需完成 |

[Free 布局 Sidebar](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/layout/Sidebar.tsx) 的图标模式 flyout、当前路由自动展开、用户展开状态保留，能在[基线提交补丁](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/commit/dd1afd2f3a794ea9e746197de314f81d43670ea1)中追溯。这属于模板布局层，不是基础 ui/sidebar 的模板原创行为；移植时应保留。

下一步选择官方 Base UI 的 base-vega 生成结果作为基础控件源码，模板布局沿用 Free。生成所需 cn helper 路径、Lucide 图标绑定及 style 展开单列为安装适配，不更改原语行为/API。逐控件完整核对、依赖锁定及运行兼容仍未完成；发现真实行为/API 差异先沟通，不以此抽样报告批量豁免。


## 实施后的补充核对

2026-10-08 已完成官方 base-vega 生成、32份同名源码结构/API核对，定位 BreadcrumbLink 接口差异、两个 Free 自有组件及 useIsMobile 阈值差异。具体来源、样式配置和仍待选择的范围见[来源记录](../../docs/sources/saas-admin.md)。隔离的固定上游与当前 Orders 截图、49文件闭包的 Next/Vite 实测见[阶段记录](../011-saas-admin-implementation.md)。前面的“未验证/抽样范围”描述调查时状态，不是对本轮已测范围的替代，也不能推导其他页面已完成。
