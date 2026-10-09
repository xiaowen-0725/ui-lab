# SaaS Admin：指南整改与回归验证

2026-10-09。用户“按要求进行优化整改”授权实施[计划012](012-saas-admin-guidelines-review.md)的修复。应用 web-design-guidelines、vercel-react-best-practices、shadcn；延续已确认的 Free AdminCN / 官方 shadcn Base UI 基线。

## 已实施

| 发现范围 | 处理 |
| --- | --- |
| 九页静态导入、图标命名空间、图片大映射 | React.lazy/Suspense 按页加载；Lucide 显式导入十个菜单图标；61个图片/远程引用采用具名导出；Mono 字体 CSS 随订单页 |
| Context 与重复时区计算 | value/回调稳定；文案、导航内部订阅拆分；时区列表固定，日期基准按 UTC 日期刷新，分钟偏移正确排序，屏外项目 content-visibility |
| 主区域/标题/侧栏列表 | 一个主区域，h1、正确设置标题层级；命名 nav/跳过导航；Collapsible 用官方 render 合并 li 根元素 |
| 无名称控件、字段和进度条 | 手机工具栏三按钮、社交 URL 字段、进度指标；表头 sr-only；Recent Devices 外层可聚焦滚动，取消内层重复滚动 |
| 对比度、图片、输入 | 调整状态/头像/分组/组织链接及禁用卡片正文；页脚与认证行内链接加常驻下划线；图片尺寸，支付/产品图片使用原63×42/164×128比例，组织标识保留自然比例；认证 autocomplete/spellCheck，电话 tel/inputMode；币种保留 USD、格式跟随 locale |
| 删除误操作 | 官方 AlertDialog 默认焦点取消；用户本地删除确认；订单确认、pending、防重复、弹窗内失败反馈和重试 |
| 用户状态不在 URL | role/plan/status/q/page/size/sort/direction；保留消费者其他 query；详情 tab 入 URL；搜索在 Next 消费层 replace，其余历史 push |
| 设置草稿丢失 | 官方 keepMounted 保留标签草稿；消费者事件/可选 draft callback、逐表单保存标记、离开确认及 beforeunload；历史状态保留与恢复后确认；正常标签遍历不弹离开确认 |
| 资料持续装饰/减少动效 | JS 挂载门控、暂停/恢复；共享偏好 helper 增加变化订阅，SSR/首次水合保持未知；移除调用层 filter/will-change；限定 Button 过渡属性 |

没有新增替代基础控件。删除确认是既有官方 AlertDialog 的私有页面组合；来源两个私有区块算法、33份官方原语源码/API、公开安装身份保持。可选 `onSettingsDraftChange(actionType)`是受控编辑通知，不在分发源码引入浏览器存储或 Next 导航。具体来源差异见[适配记录](../docs/sources/saas-admin.md#指南整改差异2026-10-09)。

## 验证

需求符合性：保持固定来源、九类页面/十二路由、官方原语及消费适配边界。语义、确认流程与正文样式差异按本次整改授权实施；用户逐页视觉批准没有由工程扫描替代。

规范符合性：已修复审查中的主要可访问性、交互与重复计算问题，包体已降低。仍保留下面列出的资源分发和动效预算边界，不能宣称全面符合每条指南。

- `bun run check`、`bun run test`（266 pass / 0 fail）和根生产构建通过；CLI快照已刷新。构建仍有既有 metadataBase 配置警告，lint仍有普通源码/native img等警告，不写成零告警。
- [11个独立资产](013-evidence/standalone-usages.json)通过严格类型检查、流式SSR、浏览器打包及22项水合检查；页面异步加载使用 React 的流式 SSR 完成判定。
- 使用固定 shadcn 4.21.4真实安装到独立Next/Vite，155个安装文件、818条引用，安装后模块目标/TS AST/CSS/许可审计均无差异或缺口。两者严格类型检查和生产构建通过，[各21项浏览器检查](013-evidence/consumers-summary.json)通过、运行时错误0；包含品牌/模式/系统变化、URL/刷新/历史、删除取消及订单失败重试、异步认证失败保留输入和重试。Route检查等待实际页面标题，避免 lazy加载期间把上一页算作新页面。
- [完整axe复测](013-evidence/browser-axe.json)：Chrome154、axe4.11.0，18路径/分支 × 中英 × 两品牌 × 深浅色 × 390/1440，共288场景；扫描告警0、整页横向溢出0、main和h1均各一个。随后只修改两处图片尺寸提示与组织标识自动宽度，[32个相关场景](013-evidence/browser-axe-dimensions.json)复测仍为0。原始记录还含各浏览器上下文的独立错误汇总，不能将其计作额外页面场景。
- [7组生产交互检查](013-evidence/browser-flows.json)通过：用户query/刷新、删除初始取消焦点及取消/确认、详情标签历史、设置草稿/标签/离开/后退/放弃/保存、时区搜索/键盘/重复格式化、动态reduce及暂停/恢复、认证输入属性。独立[历史保护回归](013-evidence/history-guard.log)包含多步遍历、前进和框架history state保留。时区菜单打开不增加格式化器；未将这一结论换算成跨设备延迟预算。
- [来源审计](013-evidence/source-audit.json)：33个官方原语hash全部一致，53张本地图片、两份字体字节以及8个远程链接保持。台账使用当前hash，旧hash另存，未覆盖基线历史证据。

指南整改阶段的安装冻结 sourceVersion：`1e55debcf9d40f68d43d67ac2ee1d26751a0f835aee56691b1770575f13b5ba0`。

## 包体结果

与计划011的相同独立消费工具链比较；以下是构建统计，异步页面块另计，不是移动网络实测。

| 指标 | 整改前 | 当前 |
| --- | --- | --- |
| Next build First Load JS | 813 kB | 337 kB |
| Vite入口 minified / gzip | 约2500 / 695 kB | 735.44 / 287.52 kB |
| Vite公共 CSS / gzip | 553 / 313 kB | 365.94 / 169.28 kB |
| Orders异步 CSS / gzip | 计入公共CSS | 95.31 / 71.82 kB |

Vite另外生成九个页面块；Orders JS为361.08 kB / gzip108.33 kB。仍有入口大于500 kB的构建提醒。没有运行Lighthouse、移动网络LCP/TTI、React Profiler或低端设备CPU/内存预算，不把构建包体当成这些指标已达标的证据。

## 保留边界

- 时区保留全部 cmdk 项以保留搜索/键盘语义，优化屏外绘制；没有宣称虚拟化或达成低端设备预算。侧栏分组仍有 height 布局过渡，未建立动画性能预算。
- 图片/字体 data URI 仍受既有文本 registry 安装合同约束，未新增二进制分发协议；页面/Mono CSS已分包，不宣称获得独立图片/WOFF2 URL缓存。8张商品图的许可/离线选择沿用原待决定项。
- 保守草稿保护不判定改回原值等价；密码不保存至消费者 settings 或存储。历史保护覆盖该预览安装监听后创建的历史项及普通回退；监听前任意多步历史跳转没有索引信息，不宣称覆盖所有浏览器扩展导航。
- 默认上游图表变量保持，未判定后续所有图形达到 WCAG；自动扫描不代替屏幕阅读器或完整 WCAG/跨浏览器审计。
- 本轮代码按用户要求纳入本地 Git 提交；用户视觉批准、推送、npm发布及生产部署未执行。本轮没有建立后端、鉴权、支付或邮件服务。

## 本地提交检查

2026-10-09 用户要求提交当前代码。提交前再次运行 `bun run check` 和 `bun run test`：全部门禁通过，266项测试通过、0失败；CLI快照与571个当前条目一致。lint有33条warning和10条info，无阻断错误。提交包含本轮模板、主题、分发、预览、相关来源与验证记录，以及此前同一任务保留的共享组件兼容增强；任务外 `skills-lock.json`、`.grok/` 与浏览器临时目录 `.playwright-cli/` 保留在工作区。

## 提交后的代码简化

2026-10-09 用户调用 simplify，范围限定于刚提交的适配与组合层。文案覆盖、继承及默认语言的优先级改为顺序判断；单页框架统一外层 Provider，保留独立/嵌入时各自的主题与 Tooltip/Toaster 结构。补充 Props/返回类型、整理入口 import 和 Catalog 包装排版，删除源码解析中的重复候选。官方基础控件、两个来源区块、公开安装身份、URL与业务状态逻辑均未改。

来源台账同步三份适配源码hash，CLI快照同步571条记录；简化后的整站 sourceVersion为 `c2a98ae48a57e5a283fd390d979178d941b9f650149cafaa480c06bfc0b8c7c0`。再次运行根 `check`、266项测试和11个独立用法验证均通过，包含严格类型、流式SSR、打包及22项浏览器水合检查。记录位于 `/tmp/uilab-simplify-{check,test,usage}.log`，独立用法证据为 `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-standalone-usage-KIIFbp/`。本轮未重复完整生产站点、真实shadcn安装或288组axe扫描；既有证据对应先前冻结源码，不冒充新修订验证。用户随后要求提交，本轮简化改动纳入本地 Git 提交；未推送或发布。
