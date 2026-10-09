# SaaS Admin：界面规范与 React 最佳实践审查

2026-10-09。应用 `$web-design-guidelines`、`$vercel-react-best-practices`；本轮审查未修改模板、原语或消费包装。

## 结论与范围

需求符合性：当前实现符合已确认的技术和页面方向——固定 Free AdminCN 组合、官方 shadcn Base UI、九类页面、十二路由、主题及消费适配边界。用户逐页视觉批准仍未记录；远程商品素材的完整分发仍待选择。本轮不重新判定这些既有边界已完成。

规范符合性：**部分符合，不能宣称已全面符合两项指南。** 主要缺口是整站包体、可访问语义、破坏性操作保护、草稿保护与局部重复计算。来源忠实性不能代替这些规范的验收。

代码范围：`components/pages/saas-admin*`、`components/site-shells/saas-admin*`、`components/app/sites/saas-admin*`，以及所调用的官方控件。浏览器范围：生产预览、Chrome、英文、默认品牌、浅色，18 个页面/分支 × 390/1440 两种宽度，共36个场景；包含用户详情五标签、资料两标签、设置两标签。此次没有复测其他语言/主题、所有浮层及表单状态，也不是完整 WCAG 或 Lighthouse 审计。

使用当日获取的 [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)；React 性能规则按 Skill 本地规则文件，结合 [React Context](https://react.dev/reference/react/useContext)、[useMemo](https://react.dev/reference/react/useMemo) 与 [Next 懒加载](https://nextjs.org/docs/app/guides/lazy-loading) 官方文档核对。

## 发现（按文件分组）

P1 表示应优先解决的用户体验或主要性能问题；P2 表示规范、可访问性或后续规模化问题。自动扫描中的重复节点合并为根因，不将节点数量当作独立缺陷数量。

### 整站入口与资源

- **P1** `components/site-shells/saas-admin-site.tsx:3` — 九个页面全部静态导入，认证页也进入包含图表、表格等后台视图的依赖图；不符合 `bundle-dynamic-imports` / `bundle-conditional`。已有独立构建记录：Next 首屏 JS 813 kB，Vite 入口 minified 2.50 MB / gzip 695 kB。建议按页面延迟加载；可分发源码使用 React 的能力，Next 特定路由策略留在消费层。没有实测移动网络 LCP/TTI，不将包体直接换算为秒数。
- **P2** `components/pages/saas-admin/assets/images.ts:3`、`components/pages/saas-admin/styles.css:3` — 单个资源映射集中包含53张本地图片，字体内联在全局导入 CSS；源码大小分别约161 kB、193 kB。图片/字体难以独立缓存及按页面获取。当前方案服务独立安装闭包；调整外部文件分发前，应先明确 registry 的资源载荷和独立安装回归，不能简单改成失效的 `/public` 路径。

### React 环境与时区

- **P2** `components/pages/saas-admin/environment.tsx:121` — Provider 每次渲染创建新对象及新回调，语言、主题、数据、路由共用一个 Context；所有 `SaasAdminText` 等订阅者随 value 改变重新渲染。建议稳定 value/回调，并按实际依赖拆分内部订阅；不改公开接口，不在没有测量的情况下宣称所有页面都卡顿。
- **P2** `components/pages/saas-admin/views/pages/user-settings/workspace/workspace-name.tsx:54` — 每次创建新 timezones 数组，使第56行 `useMemo` 失效。实测仅打开菜单额外创建 **418** 个 `Intl.DateTimeFormat`，本机该次构造累计约8.4 ms（仪表测量值，非跨设备性能预算）。建议稳定依赖，明确偏移计算基准时间，避免永久缓存夏令时偏移。
- **P2** `components/pages/saas-admin/views/pages/user-settings/workspace/workspace-name.tsx:184` — 时区列表同时渲染418项；不符合大列表按需渲染建议。可在保持搜索、键盘、活动项滚动语义后引入虚拟化；先修复重复格式化再测量。此发现不扩展到默认只渲染5/10行的表格。

### 后台外壳

- **P2** `components/site-shells/saas-admin-shell.tsx:45` — 官方 `SidebarInset` 已输出 `main`，里面又嵌套 `main`；30个后台场景均复现重复/嵌套主区域。改调用层内部容器即可，无需修改官方 Sidebar 源码；补充可聚焦的跳到内容链接。
- **P2** `components/site-shells/saas-admin-site.tsx:82`、`components/pages/saas-admin/views/pages/auth/login/index.tsx:45` — 三个认证入口没有 main landmark，标题以 CardTitle/div 展示。36场景中32个缺少 h1；设置页有 h1，但接着跳到 h3。建议在页面组合层提供正确标题层级、认证主区域；不以标题 className 代替语义。

### 侧栏

- **P2** `components/pages/saas-admin/components/layout/Sidebar.tsx:362` — `SidebarMenu` 是 ul，Collapsible 的默认 div 直接放入 ul，li 又在 div 内；15个桌面后台场景复现 `ul > div > li`。建议用官方 Collapsible 现有 render 能力与 SidebarMenuItem 合并根元素，并核对嵌套分组，不重写控件。
- **P2** `components/pages/saas-admin/components/layout/Sidebar.tsx:320` — 12px 分组文字使用 foreground/50，默认浅色扫描测得约3.68:1，未达到该尺寸正文4.5:1。用户状态徽标也有约2.88–2.89:1：`components/pages/saas-admin/views/apps/users/list/user-table-columns.tsx:76` 附近的状态样式。头像默认 muted 文本约4.34:1。应在调用层/主题中验证可访问取值；这会影响上游默认视觉，需记录约定差异。
- **P2** `components/pages/saas-admin/components/layout/Sidebar.tsx:399` — `transition-all` 且动画 height；第436行同类。指南要求明确过渡属性，并优先 transform/opacity。保留高度展开效果若作为来源例外，应明确成本并测量。`components/ui/button.tsx:10` 也含官方 `transition-all`：调用方可覆盖 className；若要改官方生成源码，须事先沟通。

### 用户列表与导航状态

- **P1** `components/pages/saas-admin/views/apps/users/list/user-table-toolbar.tsx:129` — Export/Import/Add New User 的文字在 max-lg 隐藏，又没有独立可访问名称；390px 场景确认3个无名称按钮（另见第169、180行）。通过现有 aria-label/sr-only props 修复，不需改 Button 或 Dropdown 原语。
- **P1** `components/pages/saas-admin/views/apps/users/list/user-table-columns.tsx:213` — Delete 直接从共享用户数组移除记录，没有确认或撤销；订单删除在 `components/pages/saas-admin/views/datatables/datatable-transaction.tsx:386` 也直接执行。误操作无法恢复。建议使用已有 AlertDialog 或撤销反馈；这会改变默认流程，先沟通具体方案。
- **P2** `components/pages/saas-admin/hooks/use-user-app.ts:128` — 筛选、搜索、排序及分页只有局部状态；实测搜索后 URL 不变，刷新后搜索为空。`components/pages/saas-admin/views/apps/users/view/user-view-tabs.tsx:24` 的详情标签也未同步 URL。资料/设置标签已有 query，不能据此宣称所有状态均可深链。建议通过消费导航适配现有 URL，而不是在分发源码引入 Next/nuqs。

### 表单与草稿

- **P2** `components/pages/saas-admin/views/pages/user-settings/general/social-url.tsx:60` — 三个链接输入只有 placeholder，缺少 label/aria-label、name、URL 输入语义；占位提示不能替代持久字段标签。可以通过官方 Input 的现有 props 补齐。
- **P2** `components/pages/saas-admin/views/pages/user-settings/user-settings-tabs.tsx:42` — 切换标签未检查未保存修改，离开时卸载草稿。实测编辑社交链接后切 Workspace 再切 General，值变回空。消费导航也无草稿保护。建议明确选择“保留草稿”或“确认离开”；保存后的状态保留不等于未保存草稿保护。
- **P2** `components/pages/saas-admin/views/pages/auth/login/login-form.tsx:56` — 邮箱及密码未声明 autocomplete、邮箱未关 spellCheck；注册对应字段同类。补 email/username、current-password/new-password 等正确用途。`components/pages/saas-admin/views/forms/form-layouts/vertical/basic-form.tsx:59` 的电话仍为默认 text，缺 tel 输入语义；横向及带图标表单需同组核对。保持原校验规则，不自行新增密码匹配规则。

### 进度条、表格与数值

- **P2** `components/pages/saas-admin/views/dashboards/widgets/widget-total-earning.tsx:155` — Progress 有数值，无可访问名称；项目表格、Billing、Workspace Data 同类。共10个场景、26个重复节点；使用项目/指标名作为 aria-label 或关联现有文字，无需改 Progress 源码。
- **P2** `components/pages/saas-admin/views/pages/user-settings/workspace/workspace-data.tsx:89` — 两个表头为空，辅助技术无法识别对应列；可提供 sr-only 列名。`components/pages/saas-admin/views/apps/users/view/tabs/security-tab.tsx:174` 的窄屏 Recent Devices 表容器也缺键盘可达的滚动区域，390px 场景复现；调用层提供可聚焦、有名称的滚动区域，不改共享 Table 默认行为。
- **P2** `components/pages/saas-admin/views/datatables/filters/filters-datatable.tsx:115` — 用字符串 `$` 与原数值拼接，缺少币种/小数格式化。其他表格虽使用 Intl，但固定 en-US；应接 locale，并保留消费数据实际币种，不能把中文界面直接等同人民币。调用层格式化不需修改原语。
- **P2** `components/pages/saas-admin/views/datatables/datatable-transaction.tsx:122` — 支付标识图片只有宽度 class，无显式 width/height；图片解码前无法由此确定纵向尺寸。其他头像已有固定容器，不能把其缺属性直接推断为已发生 CLS；图片加载策略按页面位置分别核对。

### 资料装饰

- **P2** `components/pages/saas-admin/blocks/profile-background.tsx:58` — reduce 模式只是父层 CSS 隐藏，内部每2.5秒更新 activeSet 的 interval 仍运行，重算网格；不符合仓库 JS 层门控规则。第131行还有 filter 动画和长期 will-change。可以先在调用层以 hydration-safe reduce 偏好决定是否挂载；改变已确认保留的来源区块算法需单独沟通。普通模式持续装饰是否保留/提供关闭也应明确。

## 已符合与不适用

- 基础原语采用官方 Base UI 家族，来源/固定版本/许可有记录；没有因审查建议而新增另一套控件。
- 消费导航使用真实 a，保留 modifier click；资料/设置已有 query 语义。
- 偏好存储版本化、try/catch 降级；主题首次 hydration 使用预置脚本，html 的 color-scheme 由 next-themes 设置。此次没有把这些列为违规。
- 异步提交有 pending、防重复、错误及重试反馈；原语有焦点样式，reduce CSS 取消视觉动画。CSS 取消不能证明后台 JS 工作也停止。
- 当前模板没有真实数据请求、Server Actions、鉴权、支付或邮件服务；请求瀑布、SWR 去重、服务端鉴权/缓存规则不适用于本次前端实现，不建议为了符合清单而添加后端。

## 证据与处理边界

[浏览器原始记录](012-evidence/browser-axe.json) 使用临时加载的 axe-core **4.11.0**。仓内 jest-axe 间接使用的 axe-core **3.5.6** 对现代 Select/颜色出现不可靠告警，该轮原始输出未作为最终判据；新版复核后排除了 Select 的旧版告警。自动扫描没有替代屏幕阅读器、人工焦点/键盘及全主题对比度检查。

包体引用 [已有实施记录](011-saas-admin-implementation.md#视觉和体验边界)，没有重复运行 build；草稿、搜索与格式化次数为本轮浏览器复现。Context 和资源耦合为代码判断，尚未采集 React Profiler 或 CPU/内存预算。

建议先处理名称/标签、外壳语义、列表组合、进度条和重复计算，再处理路由分包。删除确认、草稿流程、默认颜色和原语源码调整需提出具体差异后决定。本轮仅新增审查文档与证据，没有提交、发布或部署，也没有修改任何模板实现。
