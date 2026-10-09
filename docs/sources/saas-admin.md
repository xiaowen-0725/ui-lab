# SaaS Admin 来源与适配记录

2026-10-08。完整规格及原适配包已由用户确认。九类页面、十二条路由及外壳/整站已接入并登记；工程证据的实际范围见计划011，用户视觉批准与发布独立记录。

## 固定来源

- 页面及布局：[免费 AdminCN](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/tree/dd1afd2f3a794ea9e746197de314f81d43670ea1)，MIT，copyright 2026 shadcn/studio。完整许可：[admincn-free-LICENSE.md](admincn-free-LICENSE.md)。模板页脚保留上游归属链接。
- 基础控件：[官方 shadcn/ui Base 家族](https://github.com/shadcn-ui/ui/tree/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0/apps/v4/registry/bases/base/ui)，MIT，copyright 2023 shadcn；使用与该 revision gitHEAD 对应的 shadcn 4.21.4、base-vega、neutral、Lucide 生成结果。完整许可：[shadcn-ui-LICENSE.md](shadcn-ui-LICENSE.md)。未从 Studio 受限制源码库或商业模板取代码。
- 字体：[Vercel Geist](https://github.com/vercel/geist-font)，本地 geist 1.7.2 提供的 Geist/Geist Mono 可变 WOFF2，字形二进制未经修改；SIL OFL 1.1 全文随 `assets/fonts.css` 及许可配套 `assets/font-license.ts` 进入消费闭包；后者保留完整字面量，避免实际 shadcn安装时CSS注释被删除。源码模板也是 Geist/Geist Mono；不依赖消费者安装 Next 字体模块或运行时字体 CDN。
- 53 个已用本地图片来自固定免费仓库 `public/images`，以原字节的 data URI 随 `assets/images.ts` 分发。Filters 表格仍使用8张上游 CDN 商品图，不能宣称全模板可离线运行或素材已完整分发。

[文件台账](saas-admin-inventory.csv)记录当前活跃源码的路径、来源、版本、许可及 hash。它是活跃源码的来源记录，不是 Catalog 安装清单。

## 已完成的普通适配

- `cn`、hook 与内部 import 路径对接消费者别名；模板视图机械转换具名导出，Next Link/path/query 留到 props、导航回调及站点包装。
- 原 Orders 的卡片、图表和交易表格组合保留；页名与品牌名称为 SaaS Admin。菜单按已确认首批范围移除 Pro、Mail/Calendar 与推广 API；移除 GitHub star 脚本及下载推广入口。
- 使用现有 className 恢复 CardContent 的 block / 横向布局：Free CardContent 仅有 padding，而当前官方 base-vega 默认 flex-col/gap-3。官方控件源码与 API不因此修改。
- 上游 neutral 变量原值保留，Blue Ink 复用既有主题的同一份取值。模板品牌与 light/dark/system 入口组合使用官方 DropdownMenuRadioGroup；radio 默认保留菜单打开，按 Escape 关闭。
- 单页与壳共享 provider，单页嵌入壳时不重复挂 Tooltip/Toaster。独立文档主题由消费者作用于 html，浮层继承相同变量；没有改 Dialog/Sheet Portal API。
- 国际化、具名导出、图片内联、消费者提交边界及反馈使用现有 props / 官方组件组合。回调的实际成功/失败、状态保留和页面分支按计划011记录验证，不以接口存在证明已验收。
- 官方文件做格式、import/type/useConst 等机械规范化，并附特定 lint 规则说明；不是逐字复制的宣称。未改变官方基础控件的 API、事件处理或状态算法。

## 静态对照的实际范围

对32份同名 Free/官方生成文件，排除样式、图标绑定、路径和格式后核对结构/API/状态：31份未发现这类差异，BreadcrumbLink 有实际接口差异。Free 返回原生 a，当前官方支持 useRender；适配只能使用现有 render API，不能把原生 a props 推导为相同实现。另加的生成文件及所有状态样式不由此自动获得视觉通过；逐页默认截图对照与允许的包装差异见计划011；截图不代替用户视觉批准。

免费默认图表变量不是统一生成的 Catalog 图表色域：其中浅色黄色 `chart-4` 对白底约1.72:1。为忠实保留来源不重染五个上游值；Catalog 第六图表角色复用 chart-1。现有派生主题的对比度/色域测试继续执行，默认后台主题单独验证来源值一致。当前 Orders 图表使用 primary 的透明度组合，不是这五个 chart 变量。不能据此声称所有后续图表已经满足可访问性指标。

## 用户已确认的两个差异（2026-10-08）

| 文件/缺口 | 推荐 | 替代与当前处理 |
| --- | --- | --- |
| [Free timeline](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/ui/timeline.tsx)、[background-ripple](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/components/ui/background-ripple.tsx) 无对应官方控件 | 原样保留 Free 的两个实现，按活动时间线/资料背景的内部区块维护，记录来源，不登记成官方基础控件 | 可去掉装饰，时间线改用官方组件组合；用户回复“可以”，确认推荐方案。两个私有区块已按来源接入，18份暂存视图恢复，完整保留 MIT；装饰背景的父层通过 className 在 reduce 模式隐藏 |
| [Free useIsMobile](https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free/blob/dd1afd2f3a794ea9e746197de314f81d43670ea1/src/hooks/use-mobile.ts) 阈值1280，官方768且 SSR 初始 undefined | 只调整本次新建 helper 的阈值到1280，保留官方 SSR 初始化、Sidebar/Sheet 源码 | 可保持官方768，接受768–1279px布局差异。用户回复“可以”，确认仅将新 helper 常量改为1280；官方 SSR 初始状态、事件监听和清理未改 |

这个确认来自用户明确要求“定制组件或修改 shadcn 组件提前沟通”，不是安装、运行或发布许可。

## 整站扩展与待核验边界

9 个页面、1 个外壳、1 个整站已登记，引用同一可分发实现。12 个路由、详情五标签、资料与设置各两分支，默认页面均可到达。消费包装保持 query/history、iframe 文档主题与模板独立存储。普通调用方适配包括表单回调/反馈、取消按钮 type、表单与保存按钮关联、Select name 与文件/时区 payload，以及用户/订单/资料数据边界。Basic/Filters通过TanStack既有getRowId配置使用原数据id，修复消费者重排后选择转移到另一条记录的问题；不改表格引擎或基础控件。没有修改官方控件 API，也没有新增密码匹配或业务服务规则。原本不存在的文件导出、账单升级、消息/团队详情等只发送消费者动作并展示回调结果，不自动承诺文件或服务完成。

Filters 表格的8张商品图为原 CDN 链接，Free固定仓库无图片文件或明确覆盖远程字节的许可。当前通过集中映射保留原 URL，用户已收到独立素材选择题；在回答前不下载或替换，不能算成离线素材完整。源码安装闭包与外部运行素材分开记录。

当前验证记录见[计划011](../../plans/011-saas-admin-implementation.md)；首步49文件/Orders的历史通过不推导整站新图全部通过。

真实 shadcn CLI安装曾将同名 `types/orders.ts` 的类型 import 重写到 `views/orders.tsx`。内部数据与类型现使用 `transaction-samples.ts` / `transaction-types.ts`；公开页面和整站身份保持。安装后额外核对每条 import 的实际目标、TS AST、CSS语义与许可，避免只靠仓内类型检查判断可安装。

## 指南整改差异（2026-10-09）

用户“按要求进行优化整改”授权处理[计划012](../../plans/012-saas-admin-guidelines-review.md)列出的流程、语义、配色和性能问题。本轮继续组合官方控件；33份基础控件源码/API均未改，53张本地图片、两份字体二进制及8条远程商品链接与计划011冻结版本一致，核对见[来源审计](../../plans/013-evidence/source-audit.json)。台账更新为当前适配源码 hash，旧台账保存在计划013证据中；台账包含已生成但不在本次整站安装闭包中的 ScrollArea，不能直接当安装文件数。

- 删除增加官方 AlertDialog 确认及弹窗内提交/失败反馈；设置的 General/Workspace 通过官方 TabsContent `keepMounted`保留草稿。消费层保护离开、历史遍历、刷新和关闭；正常设置标签历史不会卸载草稿。可选 `onSettingsDraftChange(actionType)`将时区键盘选择、新增链接及删除已选文件等受控编辑通知消费者；业务保存和导航策略仍由消费者负责。该通知与原生表单事件的保守保护不计算“编辑后改回原值”的等价关系。
- 调用层补充主区域、导航区域、页面标题、跳过导航、列表根元素组合、按钮/字段/进度条名称、滚动容器和输入属性；图片显式尺寸按实际比例核对（支付63×42、产品164×128、Discord 60×61），时间/货币按 locale 格式化，金额仍为原数据的 USD。
- 正文对比度调整：侧栏分组 foreground/50→/80；浅色成功/警告文字 green/amber 600→800，危险状态红色文字使用 light 800/dark 300，组织链接 sky 600→800；页脚与认证行内链接使用常驻下划线；头像 fallback/count 使用 foreground；禁用危险区卡片用淡背景标记替代整块文字 opacity。上游主题变量与图表取值不重染。
- 九页 React.lazy/Suspense 分包，Lucide 菜单图标改为显式导入，图片改为可剔除的具名常量；Geist Sans 保留公共字体 CSS，Geist Mono 仅随 Orders 图表 CSS。data URI 服务既有文本 registry 安装闭包，独立 WOFF2/图片 URL 缓存仍是该分发形式的限制。
- 环境值/回调稳定化，文案与导航内部订阅分开。时区使用稳定列表/基准时间，重新打开按 UTC 日期检查更新偏移，保留 cmdk 搜索及键盘 DOM，以 `content-visibility`降低屏外绘制成本；不是虚拟化。
- 资料背景由共享 hydration-safe 偏好 helper 在 JS 层挂载/卸载；修复 Motion 11 已挂载偏好不更新的问题，并提供暂停/恢复按钮。仅调用层移除 filter/长期 will-change，不改上游区块状态算法。共享 helper 带入现有 Motion 11.18.2 固定依赖。调用方限定 Button 过渡属性；侧栏分组保留上游高度展开，过渡只指定 height，其布局动画成本仍存在。

当前整改和验证范围见[计划013](../../plans/013-saas-admin-remediation.md)。本地实现、用户视觉批准、提交及发布分别记录。

## 主题定制面板（2026-10-09）

用户确认新增完整配置面板，并要求参考shadcn-admin的Sidebar/Layout两组可视选择。官方shadcn 4.21.4、base-vega额外生成Toggle与ToggleGroup，只有cn路径适配与来源/许可补充，既有33份控件未改。私有AppearanceCustomizer组合Popover、Select、ToggleGroup、Field、Button和Tooltip，使用既有Sidebar props/开合状态；新增appearance接口及字体、圆角、尺寸、内容宽度配置，不修改官方原语。

消费接口：`appearance?: Partial<SaasAdminAppearance>`、`onAppearanceChange?: (appearance: SaasAdminAppearance) => void`，以及 `showCustomizer?: boolean`（默认显示）。不传配置时由模板维护本地状态；受控消费同时传入配置和变更回调。类型从整站入口导出，页面与外壳复用同一环境。`sidebarOpen` / `onSidebarOpenChange` 的既有受控开合接口继续生效。偏好持久化由调用方提供。

六份布局示意图来自[satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin/tree/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/assets/custom)，MIT，copyright2024 Sat Naing，完整许可见[shadcn-admin-LICENSE.md](shadcn-admin-LICENSE.md)。除装饰性aria-hidden/focusable默认属性外保留上游绘制数据，调用方配置fill/stroke与尺寸；不移植其Radix配置Drawer或存储provider。首版品牌沿用两套真实主题，字体沿用本地Geist及系统无衬线，无新增字体或商品素材来源。实现范围与验证见[计划014](../../plans/014-saas-admin-theme-customizer.md)。
