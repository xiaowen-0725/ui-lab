# 更新日志

本项目所有值得记录的变更都写在这里。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),版本遵循语义化,日期用 `YYYY-MM-DD`。

尚未发布的改动先记到 `[Unreleased]`,发布时整体挪到一个带日期的版本号下。

## [Unreleased]

### Added

- Add an OKLCH palette generator with brand seed, basic/full scope, five harmony models, enforced WCAG AA/AAA semantic pairs, Hex/RGB/HSL/OKLCH output, shareable URL state, and live preview/contrast/export integration. Full output now forms a production-oriented dual-mode color contract with eight 11-step ramps, layered surfaces, interaction states, semantic alpha overlays, success/warning/danger/info roles, and six chart colors.
- Add bilingual WCAG contrast health reports and a regression baseline for Catalog palettes.

### 移除

- 移除「工坊 / Studio」完整模块：删除 `/studio`、组装预览与订单 API、Token Studio、System Preset / Order Manifest / candidate evidence 实验，以及对应 Catalog、CLI、导航、搜索、文案、脚本、测试和静态截图。通用 Agent Workbench 组件、Recipe、设计系统展馆与 Theme Kit 基础能力保留；Greenfield benchmark 解耦旧 System Preset，改为无用户批准语义的 Graphite 工程回归夹具。新的创建/选择工作流待重新定义后再实现。

### 变更

- 四个 Startup Visuals 活样本的预览改为自包含产品 chrome，不再继承文档站深色空画布：`collapsible-sidebar` 默认展开浅色双栏（全局图标条 + 标签导航）并带真实任务表；`upgrade-paywall` 浅色公司表 + 居中 Business+ 卡；`view-layout-switch` 为 Ask Rune 浅色工作面且 SWITCH LAYOUT 菜单默认打开；`billing-plan-grid` 炭黑页、紫色当前方案与细线 check/x/info。项目标改为 Tuesday 日历 / Jammio 气泡 / Create 网格 / Thoughts 橙方 / Consumex 圆盘，不再用字母砖。
- 四个 Startup Visuals 活样本的可见图标改为按原稿描摹的描边 SVG（双杠折叠、⌘ Command、付费墙 plus/升级箭、布局切换与账单 check/x/info），不再用 Lucide 近似替换。
- 将 `/palettes` 重构为沉浸式配色工作台：新增实时界面预览、配色轮播、静态背景、WCAG 对比检查与 Prompt/CSS 导出，并以独立深色 Inspector 集中呈现语义色和复制操作。
- 新增唯一产品北极星 `PRODUCT_DEFINITION.md`，将 UI Lab 固化为以 Catalog + machine-readable contracts 为核心的受约束装配系统；目标六层统一为 Design Intent / System / Asset / Composition / Implementation / Verification，正式链路统一为 versioned Design System Package → OrderDraft → selection approval → OrderLock → implementation → EvidenceBundle → acceptance/release。同步澄清 Theme Kit/System Preset/config/CatalogLock/current Order Manifest/Studio 的 current bridge 边界，Codex 仅为 optional Package/reference，Parking 仅为 Existing Adoption fixture；Skill、Application Kit 与 benchmark 文档不再把 planned Package schema、dedicated capabilities 或 Order CLI 写成已实现。
- Agent Workbench skin contract 新增语义化 `--wb-overlay-scrim`，完整 token 数由 42 升为 43；`AgentInbox` / `InboxItem` 与 `SettingsGroup` 新增默认不破坏现有 card 外观的 `quiet` 变体，供 Codex 风 Board / Connectors 复用真实 Preset 组件构成扁平 hairline 行；`settings-panel` registry item 同步携带完整 43 项 light / dark token。
- 灵感库网站与品牌卡片改用带来源、采集日期与版权归属的真实官网首屏截图，整张预览图可直接访问对应网站；新增批量采集与质量审计脚本。
- 灵感库「来源」目录移除已完成内容迁移的 Learn UI 与 RICOUI 卡片，保留迁入的品牌、网站和真实截图。
- 灵感来源卡片新增“公开浏览 / 免费增值 / 付费完整访问”等访问边界，避免把登录与订阅条件藏在数据里。
- 灵感库 21 个来源卡片新增带来源和采集日期的真实网站首屏预览，图片整块可直接访问原站，并纳入统一截图质量审计。

### 新增
- **灵感库「来源」新增 `startup-visuals`**：Louis Nguyen / Startup Visuals 的 B2B SaaS 产品界面动效参考（X / Dribbble 动态，不是案例 CMS）。官网是 Hero + logo 跑马灯 + 评价 + 不可点击的 Dribbble ticker；`external-only`，provenance 含 X / 官网 / Dribbble，截图取自 https://startupvisuals.com/ 首屏。
- **「区块 / Blocks」新增 4 个 SaaS 产品界面模式**（模式受 @startupvisuals / Startup Visuals 启发，实现为原创，未复制品牌或像素稿）：`collapsible-sidebar`（展开树 ⇄ 图标轨）、`upgrade-paywall`（模糊降饱和内容上的升级门禁）、`view-layout-switch`（List / Kanban / Gantt / Calendar / Dashboard 滑动切换）、`billing-plan-grid`（月付/年付方案网格与价格数字变形）。
- **「区块 / Blocks」新增 13 个 AI 向界面原语**（活样本 + registry，不含 Agent runtime）：beUI（MIT）补 `reasoning-text`、`agent-progress`、`ai-sidebar`；Vercel AI Elements（Apache-2.0）补 `reasoning`、`chain-of-thought`、`sources`、`inline-citation`、`plan`、`task`、`queue`、`confirmation`、`suggestion`、`jsx-preview`。导入已适配 ui-lab 原语；许可见各文件头、`NOTICE` 与 `licenses/AI-ELEMENTS-APACHE-2.0.txt`。未移植 chat-app / message 族，也未移植 file-tree / artifact / code-block / prompt-input / shimmer。
- **自 beUI（starc007/ui-components, MIT）移植 4 个组件**：`file-tree`（动画文件树）、`button-metallic`（金属按钮，Button 变体）、`expandable-control`（可展开控件）、`morphing-search`（变形搜索，源码在 `components/motion/`、Catalog 归入区块）。保留上游 MIT 归属，按 UI Lab 公式登记双语名/别名、活预览与 registry。
- **灵感库新增 4 条经分诊参考**：`motionsites`（`source`，动效与 3D）、`uiverse`（`source`，产品界面）、`aceternity-ui`（`source`，产品界面）与 `animejs`（`site`，开发工具）；均保留第一方 provenance、访问边界、`external-only` 权利状态与核验日期。
- **灵感库「来源」新增 3 条**：`shadcn-studio`（shadcn/ui 区块与模板市场，freemium）、`react-bits`（开源 React 动效组件图库，freemium）、`checklist-design`（网站/App/移动/设计系统/流程质量清单，public）。均为 `source` 条目、`external-only`，带第一方 provenance 与真实首屏截图。
- **「区块 / Blocks」新增 9 个 AI Agents 界面原语**（自 beUI 上游移植）: `prompt-input`（提示输入）、`todo-list`（任务清单）、`code-block`（代码块）、`approval-card`（审批卡片，提问澄清 / 审阅批准两变体）、`file-diff`（文件差异）、`tool-result`（工具结果，终端输出 / 请求结果两变体）、`streaming-response`（流式回复）、`image-generation`（图像生成）、`tool-approval`（工具授权）。源码落在 `components/agents/`，共享 `agent-disclosure` / `agent-code` / 轻量 citations 辅助；与既有 `agent-composer` / `agent-thread` / `prompt-bar` 等产品级区块互补，不替换。
- **「区块」新增 `agent-activity`（Agent 活动流）**：自适应活动披露——流式推理文本 / 推理步骤 / 网页搜索 / 工具调用 / 混合时间线 / 执行轨迹六变体；进行中有界跟随，完成后折叠为可重开摘要。依赖共享 `ThinkingShimmer` 与 `AgentDisclosure`；与既有产品级 `agent-trace` 区块互补，不替换。
- **UI Lab 四场景 benchmark 基线**：以 Route & authority、System & asset reuse、Contract completeness、Runtime quality、Visual evidence、Evidence honesty 六维 rubric 汇总四个独立新会话，分别记录 Platform maturity、Greenfield Workbench、Assembly Studio visual pipeline 与 Parking adopt readiness，明确禁止把异质场景平均成“总分”。新增独立 Greenfield fixture 的 `verify` 链和根命令 `bun run benchmark:greenfield`，覆盖 lint、typecheck、unit test、production build、strict Audit 与 Playwright E2E；fixture 使用自己的 lockfile / 工具链并排除在根 TypeScript / Biome 扫描之外。基线继续严格区分 Static、Runtime、Visual、Human：候选截图与静态分数不能替代 approved acceptance master 或用户批准。
- **UI Lab 单入口 Skill Tree**：将 `$ui-lab` 重构为 model-invoked router，以 Define / Build / Refine / Verify 四阶段互斥路由 `discover`、`select`、`adopt`、`replace`、`review`、`polish`、`motion`、`harden`；新增全尺寸一维视觉选择、approved craft contract、只读 review、有界 polish、三模式 motion、状态 hardening 与 Static / Runtime / Visual / Human 四层质量门禁。`$design-ingest` 明确只沉淀 43-token 视觉 Theme layer，不能替代 System Preset、approved acceptance evidence 或 Confirmed Manifest。
- **Assembly Studio Phase 2 应用级视觉下单与候选审查**：`/studio` 以 `codex-desktop-v1` System Preset、业务能力与安全覆盖项组装 Parking Agent 订单，保留真实 Codex calibration source，并为固定 fixture 生成 8 个 light/dark、wide/collapse/narrow 全应用 candidate regression captures。Reference Board 将 calibration 与 candidate 按视觉类别并排审查；所有 candidate 在用户逐项批准前保持 pending，并阻断 checkout 与 Confirmed Manifest，只有用户批准的 approved acceptance capture 才能解锁确认。新增本地只读分享/导入/JSON 导出，以及带 lineage、原因、语义差异和受影响场景的修订流程；Token 实验区明确降为不能生成应用订单的专家辅助工具。此阶段仍未修改 Parking Agent 源码，Agent 不得自行批准候选或确认订单，须由用户亲自批准首套 visual master 后才进入消费项目重构。
- 新增 `codex-desktop-v1` Phase 0 approved calibration（像素哈希、视觉事实、planned Parking acceptance matrix）。
- **`codex-desktop-v1` Phase 1 Domain / System Preset / Catalog / Manifest 边界**：在六层模型之上定义 System Preset、可变 Order Draft 与须绑定 golden / checkout 的不可变 Confirmed Manifest；新增 Catalog `system-preset` 与 canonical contract hash，resolver 按 preset + recipe + capability + safeOverrides 产出确定性 assets/components。预设固定九类非空 locked visual，内联 canonical fixture payload，并对六类 safe override 执行值域校验；Order Manifest 将解析后的 assets 纳入 composition 与 hash。当前仅完成领域与契约实现，未生成 confirmed Manifest、未完成视觉验收、未修改 Parking Agent；`order validate` / `order diff` / `order sync` 仍为 Phase 3 计划能力。
- **「灵感库 / Inspiration」模块(`/inspiration`)**：收录 21 个经核验的外部灵感来源，新增 Dribbble、Behance、Awwwards、SiteInspire、Land-book、Lapa Ninja、One Page Love、CSS Design Awards、Mobbin、Page Flows、Refero 与 SaaSFrame，按网站、产品界面、社交营销、品牌视觉、演示编辑与动效 3D 统一分组；第二阶段新增 74 个品牌设计参考，固定 vendoring `VoltAgent/awesome-design-md` commit `664b3e78fd1a298ba11973822da988483256d4b4` 的 DESIGN.md（64 份结构化 frontmatter、10 份 Markdown），按 MIT 许可保留 LICENSE 与来源说明。模块提供中英搜索、主题/分类筛选、可分享深链、站内搜索直达、逐份原文阅读，以及带来源和采集日期的真实官网视觉预览；品牌资产版权仍归对应权利人。
- **灵感库新增「网站」层**：收录 26 个值得研究的知名与独立网站，提供独立列表和详情页、站内搜索与 sitemap。网站与品牌统一采用唯一行业领域，网站另以页面类型、视觉特征和策展徽标检索；`retro-web` 改为正交的专题集合，不再与行业分类混用。
- **UI Lab Application Kit 第一阶段**:从视觉词汇表扩展为面向 AI 的可组合 React 前端系统,确立 Stack Profile、System Kit、Primitive/Component、Block、Recipe、Audit 六层架构;新增 Catalog `recipe` 类型与首批 `agent-workbench` / `saas-landing`,Recipe 以 `optionalComponents` / `sections` / `slots` / `states` / `responsive` / `assets` 等机器字段描述装配契约。其中 `agent-workbench` 引用完整可 vendoring 外壳;`saas-landing` 是 section composition contract(Pricing 可选),不是完整页面 shell。以实际 React package 根的 `ui-lab.config.json` 持久化 Profile、System、Recipe、组件和 `adopt|replace` 模式,新增 `ui-lab init` / `compose` / `audit` 与 config-aware `add`:四者支持 monorepo `--dir`;`compose` 在 adopt 下先 review/compare 且不覆盖 vendored source,replace 才给完整安装计划;`add` 只打印命令,有 config 时去重登记。源码 CLI 已提供这些命令;npm 包若滞后,以 `ui-lab --help` 核对并使用仓库内源码 CLI。
- **UI Lab Skill v2 / Application Kit 交付契约**:把“装配意图、Catalog 行为契约、视觉真源、采用证据”拆为四份单一真源:`ui-lab.config.json` 只保存装配意图;CLI 管理的 `ui-lab.lock.json` 由 `init` / `compose` / config-aware `add` 同步,记录 `catalogSource`、所选 System/Recipe/Component 的 SHA-256 `contractHash` 与组件 `sourceFiles`,但不对本地 vendored 源码做字节等同性背书;新增安全恢复命令 `ui-lab lock --dir <frontend-package> [--json]`,只读现有 config 并按当前 Catalog 重建 missing/stale lock,不改 config、不安装,无需手改哈希或使用 `init --force`;`DESIGN.md` 保存视觉真源,`.ui-lab/adoption-report.md` 保存映射、偏差与验证证据。Audit 新增 `--strict`:缺 lock 或任意 warning 都退出 `1`,普通模式只有 warning 时退出 `0` 并显示 `Audit passed with warnings`;未知或命令不适用的 flag 直接拒绝。交付门禁统一为 `ui-lab audit --strict --json`,且明确要求以覆盖 Recipe 每个适用 viewport / mode / state 维度的最小代表性 case 集成对比较同尺寸 reference / implementation 截图,仅 Recipe 明确要求时才做全笛卡尔积——确定性 Audit 不等于视觉验收。
- **`agent-workbench` 响应式 Recipe 落地**:外壳按自身容器宽度切换 desktop / tablet / mobile。桌面保留三栏独立拖宽;平板先折叠导航,两个侧区以互斥覆盖层打开;移动端一次只显示一个全宽任务表面,遮罩后的主区从键盘导航中移除。公开 `layoutMode` 供产品头部做窄屏适配,位移在 reduced-motion 下关闭。
- **主题套件 Theme Kit——「一整套风格」首次成为可交付资产**:新增 `lib/theme-kits/` 合成层,把 18 套选择(Graphite 双态旗舰 + 13 套设计系统皮肤 + 4 个工坊预设)各合成为一份完整可运行 token 系统——shadcn 语义色 + 42 项 `--wb-*` 工作台皮肤 + **全库首个图表色 `--chart-1..6`**(从 accent 按 OKLCH 分类色公式派生,对齐 dataviz 亮度带/CVD 固定 hue 序)+ 圆角/阴影/间距/字号阶 + 动效曲线与时长 + 字体栈,亮暗双态一个载荷。三条交付通道:shadcn `registry:theme` item(`/r/theme-<slug>.json`,`npx shadcn add` 实测零 files 直装,statics 落 `@theme inline`)、纯 CSS 端点(`/themes/<slug>.css`,curl 即用)、CLI 新动词 `ui-lab theme <slug>`。design-system/studio-preset 的 catalog fetch 同步升级为「可运行载荷(command/endpoint)+ 设计文档」并存。
- **风格选择页 `ui-lab themes --picker`**:生成自包含单文件 HTML——18 套主题各渲染一张用真实 token 画出的迷你工作台缩影卡(双态套件左右分半、单态标注、frost 附极光垫层),配安装命令与「对 AI 这样说」指引;新项目起步时让用户**用眼睛选风格**而不是靠文字猜。skill 新增「Bootstrapping a NEW project」强制流程:先视觉选套件、再装组件,杜绝每个应用各自拼零件导致的风格漂移。
- **「区块 / Blocks」新增登录卡片 `login-card`**：复刻中文产品登录弹窗——蓝色渐变头部带漂浮光斑与两行标题、左侧微信扫码占位二维码、右侧手机号快捷登录(区号下拉 + 验证码 60 秒重发倒计时)、圆形协议勾选框(未勾选提交时抖动提示)与 ICP 备案页脚;始终浅色的品牌化区块,reduced-motion 降级。
- **「组件 / Components」新增下拉菜单 `dropdown-menu`**：可组合原语(Trigger/Content/Label/Item/CheckboxItem/Sub/Separator)——面板近角弹簧展开、视口不足自动向上翻转;hover 与键盘共写同一块滑动焦点表面;条目支持图标+双行描述+快捷键、危险态、禁用态与勾选项;一级子菜单悬停/方向键开合带宽限延迟;Escape/外点关闭、焦点归还,完整 roving-focus 键盘导航。
- **「组件 / Components」新增卡片展开弹层 `expanding-card`**：App Store 式共享 layoutId 变形——卡片自身放大为居中弹层,背景整页重模糊,扩展内容落定后淡入;×/Escape/点遮罩三路关闭并归还焦点,收起卡片常驻占位避免网格回流;reduced-motion 降级为纯淡变。参照 beUI Pro 公开演示行为的 clean-room 原创实现(本批新增条目同此,均未使用其任何源码)。
- **「组件」Tooltip 收编 Morph 变体 `tooltip-morph`**：`MorphTooltipGroup` 让一组触发器共享同一块气泡——首次悬停弹簧入场,移到相邻触发器时不退场而是滑移变宽,文字带模糊交叉淡变;键盘聚焦同样触发,reduced-motion 直接重定位。Tooltip 条目升级为「标准 / Morph」双变体结构。
- **「区块」新增分步表单 `step-form`**：「一次一题」聚焦式多步表单——分段进度条 + 等宽计数,方向性滑动切换配合容器高度变形,文本/选择卡两种题型(选择后短暂停顿自动推进),校验失败抖动且错误行预留空间不跳版,Enter 推进,完成态画圈打勾,onComplete 支持异步 pending。
- **「区块」新增空状态 `empty-state`(3 变体)**：手绘线稿动画插图——收件箱清零(信封开盖抬信 + 弹簧对勾徽章 + 待机浮动)、档案柜抽屉(悬停/聚焦弹开露纸页)、搜索无果(放大镜扫描 + 虚线结果行闪烁);统一「插图 + 标题 + 文案 + 主操作」API,循环动画在 reduced-motion 下完全静止。
- **「区块 / Blocks」新增录屏演示卡 `recording-card`**:把任意内容呈现成一段录屏——窗口 mock 背后是壁纸 + 双层压暗,摄像头气泡兼作播放按钮,计时器带闪烁录制红点,「点击听声音」药丸在播放后 `translateX(-120%)` 滑回气泡背后(靠只裁左边的 `clip-path`,所以是「藏到气泡后面」而不是「滑出卡片外」)。整套构图用容器查询单位写成,同一个组件从网格缩略图到整宽 hero 全程等比,不需要任何断点;小字用 `clamp()` 兜住可读性下限。可选剧场视图用 `round(up, calc(var(--rec-w) * 9 / 16), 1px)` 锁 16:9 整像素,Escape / 点遮罩关闭并归还焦点。**剧场态另给一套 chrome 比例**——纯等比在两个极端都不成立:气泡占 320px 缩略图的 18% 是对的,占 1280px 剧场的 18% 就荒谬了。`children` 全开放,不绑 `--wb-*`,想套 workbench 自己套。参照 unabyss.com 公开做法,clean-room 自行实现。
- **「组件 / Components」新增网点图像 `halftone-image`**:把任意位图在 canvas 上渲染成印刷网点——明暗驱动网点大小,网格可旋转(45° 才是印刷味,0° 读作点阵)、圆点/方点、疏密与最大点径可调。网点面积(而非半径)与色调成正比,这才是真实网点的还原方式;方点按等墨量换算边长,与圆点同重。给第二张彩色版则灰网点在悬停时交叉淡入彩色版,每个点取所在位置的颜色(触屏无 hover 时不渲染第二层)。点间透明可叠任何表面,跨源图污染 canvas 时降级为直接显示原图。与 `webgl-background` 的 `dither` 变体分工:那个是生成式抖动波纹,这个是把图片网点化。参照 unabyss.com 的公开做法,clean-room 自行实现;演示图元在预览里程序化生成,不引入任何图片素材。
- **「原子」背景质感新增印刷网点阶梯与淡出遮罩**:新增细 / 中 / 粗三档网点(5 / 7 / 11px 网格、亚像素点半径),与既有 20px「点阵」分工——网点是印刷底纹,点阵是波点图案;另立四种淡出遮罩(向下 / 向上 / 中心留白 / 四周淡出)作为与质感正交的维度,任何配方都能套任何遮罩。遮罩只加在质感层、不加在容器上(容器一戴遮罩内容会跟着淡掉),这条规则同时写进 DESIGN.md 导出。参照 unabyss.com 的公开 CSS 技术,clean-room 自行实现。
- **「区块」新增 AI 提示输入条 `prompt-bar`**：紧凑积分感知输入条——可关闭积分横幅(发送扣减)、流式中再提交入队并可 Steer 插队/编辑/删除、斜杠命令凝固为可移除技能 chip、附件演示、联网搜索开关胶囊、模型菜单、发送⇄停止变形;与 `agent-composer`(全功能工作台输入)错位互补,随 registry 携带 `--wb-*` cssVars。

### 变更
- **`star-border` 重写为双层彗星环**:原来是一整块 `inset-[-1000%]` 的巨型元素在转(要合成远大于按钮本身的图层),现改为动画化注册属性 `--uilab-comet-angle`,只重绘渐变;单条弧线换成宽软尾 + 窄亮核两层叠加,才有真正的彗星头尾而不是一团旋转的糊光。环体改用 `mask: … content-box exclude` 裁到边框带,**子元素不再需要自带不透明底**,因此可以套在透明卡、玻璃卡上。新增 `startAngle` 让同屏多个环错峰运行。`@property` 不支持时角度不推进,自然退化成静止环 —— 与「减少动效」下要的效果一致;reduced-motion 从隐藏改为冻结在原地(保留视觉、去掉运动)。原有 `color`/`speed`/`thickness` 行为不变。
- **`star-border` 预览两个环都给了可见色并错峰**:原先按钮环用 `currentColor`(即 `text-white`),浅色主题下白环落在白底上完全看不见。

### 修复
- **Application Kit Audit 不再把不完整的多文件组件当作完整 vendoring**:Catalog component metadata 现在公开 registry 入口文件与显式 `extraFiles` 组成的 source family(不递归共享 lib 依赖);`ui-lab audit` 会在主文件存在、但**Recipe 必装组件**缺少当前组件族 sidecar 时报告 `component-source-family-incomplete` warning,同时兼容 shadcn canonical `motion/<slug>/…` 与项目直接 `<slug>/…` 布局。辅助组件允许有意只采用家族子集;Workbench token 检查也改为每个组件族至少一个实现保留 token,兼容扁平 compatibility re-export。两者都不要求源码/API 字节等同,不会覆盖 `adopt` 项目的本地适配;视觉与状态 fidelity 仍需人工验证。
- **组件的中文名与别名此前没有进入 AI 面向的 catalog**:`buildComponentItems` 把 `nameZh` 直接填成英文名、`aliases` 填成空数组(注释标注为「as instructed」),导致 74 个组件在 `/catalog.json`、`/llms.txt` 与 `ui-lab` CLI 里全是英文名且无别名——搜「网点」「录屏」「倾斜」都为空,而 atoms / styles / palettes 的中文一直正常。改为按 `category/slug` 从 registry 回查补全 `nameZh`/`descriptionZh`/`aliases`(registry 里这些数据一直都在);新增回归测试锁死这条链路。
- **「原子」噪点颗粒配方两处平铺缺陷**:SVG 缺 `width`/`height` 导致没有固有尺寸、整张被拉伸到容器而根本没在平铺;`feTurbulence` 缺 `stitchTiles='stitch'`,每块拼贴边缘湍流重新起算而留下可见接缝。补上两者并显式 `background-size: 120px 120px`。同时加 `feColorMatrix` 把湍流压成中性灰阶——原配方直接用带色噪声,在中性表面上读作彩色噪点(实测浅色态平均色度 0.82 → 0);按实测把叠加强度重新标定到与原配方等重(深色态均值 22.7 → 22.9,基底 18)。

## [0.10.0] - 2026-07-18

### 新增
- **「布局 / Layout」模块(`/patterns`)**：新增居中单栏、侧栏、圣杯布局、双栏分屏、三栏工作台、仪表盘网格、列表详情与全屏画布 8 种整页空间骨架；每条以真实 Grid/Flexbox 绘制带区域标注的浏览器线框，配中英名/别名、适用场景、窄屏塌缩说明、可复制 CSS recipe 与带禁止项的双语 AI prompt，并接入导航、首页、站内搜索和 sitemap。
- **「原子」模块背景质感类目**：新增网格、点阵、蓝图、噪点、网状渐变、径向光晕、对角条纹、扫描线与渐晕 9 组纯 CSS 背景配方，提供 light/dark 成对预览、逐条复制、DESIGN.md 导出、双语文案、深链与站内搜索；动态效果交叉指向既有 `webgl-background` 组件。
- **「滚动 / Scroll」模块(`/scroll`)**：新增视差、钉住、逐段揭示、滚动进度、横向滚动、吸附滚动、缩放入场与叠层卡片 8 种滚动叙事词汇；每条在独立的局部滚动容器内运行并以 `useScroll({ container })` 隔离，配中英名/别名、适用场景、可复制 recipe 与带禁止项的双语 AI prompt，同时接入导航、首页、站内搜索和 sitemap，并提供 reduced-motion 降级。

### 变更
- **顶级导航分组**:顶栏从 11 项精简为 5 项(组件 / 区块 / 词汇表 / 工坊 / 演练场),7 个视觉词汇表主题(风格 / 配色 / 落地页 / 滚动 / 设计系统 / 布局 / 原子)收进一个可键盘访问的「词汇表」下拉,移动端抽屉同步分组。`NAV_SPACES` 平铺真源、首页入口卡与站内搜索均不受影响。

### 修复
- 修复原子模块 explorer 直接读 `resolvedTheme` 导致的主题 hydration 不匹配(服务端按深色渲染主题相关文本/属性),新增 SSR 安全的 `useResolvedDark()`(mount 守卫)供 backgrounds 与 shape explorer 使用。

## [0.9.0] - 2026-07-18

### 新增
- **设计系统展馆工作台的脚本化会话回放**:`/layouts` 里 composer 发送后,不再是单句固定回复,而是播放一段多节拍 agent 回合动画——处理中秒数跳动 → 思考 shimmer 落定摘要 → 联网搜索(running→done)→ 读文件 → 流式吐字带光标 → 产出文件卡 → 变更 diff 卡 → 运行命令 → 审批卡(pending→自动批准)→ 落定,固定延时数组驱动、逐拍揭示。以默认关闭的 `scriptedReplay` prop 接入,仅展馆开启;`/studio` 生成器保持原有静态场景与"改刻度不重挂"性质不变。reduced-motion 下直接显最终态,timer 全程清理不串台。
- **registry 分发 `--wb-*` token 默认值**:7 个 agent 线组件(agent-thread/agent-composer/agent-workbench/agent-trace/agent-inbox/thread-list/artifact-panel)的 `/r/{slug}.json` 现带 shadcn `cssVars.light`/`cssVars.dark`(各 42 项),`npx shadcn add` 安装即带正确着色 token,不必手抄 globals.css。真源仍是 `app/globals.css`;`check-registry` 新增运行时解析比对,globals 与 `lib/registry-wb-tokens.ts` 任一漂移即 check 失败。其余 77 个安装目标不含 cssVars。

### 修复
- 工坊组件样本条的演示输入框占位改为中性文案(原"输入项目名称…"紧挨系统命名框易读作重复)。

## [0.8.0] - 2026-07-18

### 新增
- **「原子」模块二刀**:新增间距（8 档 4px 网格 + 3 档列表密度）、描边与发丝（5 层 light/dark 成对真值 + 真实焦点按钮）和图标风格（6 组词汇 × 5 个自绘 SVG 形状）三个类目，完整接入 `?cat=` 深链、站内搜索和中英文案；新增 `lib/atoms/export.ts` 纯函数导出层，为动效、圆角阴影、字体排印、间距、描边五类提供 CSS 变量、Tailwind v4 `@theme`、DESIGN.md 三种整类复制，图标词汇提供 DESIGN.md 导出。
- **「工坊 / Studio」模块(`/studio`)**:新增七刻度设计系统组合器，以原子模块的圆角、阴影、字体与密度真值驱动组件样本，并复用 `makeWbSkin` 与完整 `WorkbenchStage` 实时预览配色和字体；支持四组起始预设、URL 深链恢复、系统命名，以及 CSS 变量、Tailwind `@theme`、DESIGN.md 三件套实时导出，完整接入导航、首页入口、站内搜索、sitemap 与中英文案。

## [0.7.0] - 2026-07-18

### 新增
- **「原子」模块(`/atoms`)**:把动效曲线、弹簧、时长、圆角、阴影、字体配对与字号阶梯收为可看、可点名、可复制真值的底层视觉词典。三类异构真源位于 `lib/atoms/`；动效曲线与弹簧直接引用 `lib/ease.ts` 既有 token，页面提供单项/全部重播、reduced-motion 静态首末帧、圆角整组实时变形、light/dark 阴影高度梯子、六组系统字体整版样张与字号标尺。导航、首页入口卡、站内搜索（中英名与别名）、`?cat=` 深链、sitemap 与中英文案完整接入。

## [0.6.0] - 2026-07-18

### 新增
- **七个动效组件,移植自 motion-anything**(nexu-io,Apache-2.0;上游效果多源自 reactbits.dev,经作者授权再分发):`text-scramble`(文字解密,视口/悬停/text 变化触发,解码中宽度稳定)、`webgl-background`(fragment-shader 背景族六 variant:极光/丝绸/等离子/光芒射线/像素爆裂(点击涟漪)/抖动噪点,GLSL 原样移植,内建通用 WebGL runner,降级为静态帧或 CSS 渐变)、`star-border`(星光描边包裹器,纯 CSS 锥形渐变环绕光)、`bounce-cards`(弹跳卡组,错峰 spring 扇形展开)、`glare-hover`(眩光悬停,斜向光带扫过,触屏不渲染)、`skeleton`(骨架屏,className 塑形 + 微光扫过)。另原创 `scroll-hint`(滚动提示,鼠标轮廓/chevron 两形态;上游同名条目是无再分发授权的 Lottie 参考卡,故自行实现)。全部按库约定处理 reduced-motion。
- **接入 emilkowalski/skills 开发技能包**(MIT,经 `npx skills` 与 mattpocock 技能同机制安装):动画词汇表、Emil 设计工程指南、Apple 设计原则、find/improve/review 三个动画审计工作流——用于开发期给 agent 提供动效品味约束,不进站点内容。
- **「设计系统」模块(`/layouts`)**:把同一套完整 Agent 工作台换上不同产品语言的沉浸式展示。现含 **13 套皮肤**:**Graphite / 石墨** 基准深浅双态,Nightflight 夜航、Stark 锋白、Jade 翡翠三套深色,Paper 纸感、Terracotta 陶土、Indigo 靛蓝、Pearl 珍珠、Prism 棱彩、Coral 珊瑚、Stone 石纹、Parchment 羊皮纸八套浅色(石纹与陶土带衬线展示字),以及自研玻璃拟态特别篇 **Frost 霜玻**——舞台内 aurora 渐变装饰层 + 半透表面 + `backdrop-filter: blur(18px)`(经 `WorkbenchSkin.backdrop/frost` 字段接入,未启用的皮肤渲染路径不变)。基色经 `makeWbSkin()` 派生完整 42 项 `--wb-*` 契约、舞台语义色与字体(含 mono 与衬线展示字;`@theme inline` 下工具类字体值被内联,靠未分层作用域规则重新走变量)。浏览器画框内由 `agent-workbench`、`thread-list`、`agent-thread`、`agent-composer`、`artifact-panel` 真组件拼成三栏任务场景,保留拖拽/折叠/面板/卡片与弹层交互,输入发送后追加用户消息、处理中 shimmer 和双语固定回复;线程文件卡可打开右侧产物区,切换预览/源码并导航或恢复历史版本;下方线框解剖图与舞台区域悬停联动,点击直达组件文档。每条设计系统包含中英名/别名/描述、可应用的 `--wb-*`/站点语义皮肤、完整「对 AI 这样说」与可复制 `DESIGN.md`;数据真源 `lib/layouts/design-systems.ts`,`?ds=` 深链接入。
- **「落地页」模块(`/sections`)**:视觉词汇表的第三个主题——一张落地页的解剖图。**10 种区块类型、19 个形态变体**,切换条按页面从上到下的解剖顺序编号排列(01 导航栏 → 10 页脚);每个变体是真实渲染的双语活样本(非数据换皮),配「什么时候用哪种形态」的取舍说明和形态级「对 AI 这样说」(结构清单 + 禁止项)。数据真源 `lib/sections/`,demo 注册表按 `slug/variant` 索引;导航/首页入口卡/站内搜索(搜「头图」→首屏、「Social Proof」→客户标墙)/`?section=` 深链/sitemap 全量接入。

## [0.5.0] - 2026-07-16

### 新增
- **「配色」模块(`/palettes`)**:视觉词汇表的第二个主题。首发 **16 个配色方案、4 大组**(柔和淡雅 / 鲜活明快 / 深色系 / 自然经典),每个配色 = 8 个语义色彩角色(背景/卡片/描边/正文/次要/主色/主色文字/点缀)而非松散色块;`paletteToSkin` 把角色映射到中性几何的皮肤契约,复用风格模块的同一份 demo 场景纯换色对比;色板条逐角色点击复制 hex;「对 AI 这样说」= 逐角色报色值 + 情绪比例约束 + 禁止项。数据真源 `lib/palettes/`,导航/首页入口卡/站内搜索(别名直达,如「高级灰」→莫兰迪)/`?palette=` 深链/sitemap 全量接入。

### 变更
- `StyleDemo` 的 prop 从 `entry` 收窄为 `skin`,风格与配色两个探索器共用同一比较画布。

## [0.4.0] - 2026-07-16

### 新增
- **「风格」模块(`/styles`)与项目愿景升级**:站点定位从动效组件库扩展为「前端视觉词汇表」——收集"只能看、说不出"的前端事物,条目公式=活样本 + 名字(中英 + 别名)+「对 AI 这样说」prompt(正面手段 + 禁止项)+ 配方。首发 **29 个风格、8 大谱系**(材质质感 / 粗野反叛 / 极简排版 / 复古 / 科技未来 / 布局驱动 / 有机手作 / 体系化),以换皮对比器呈现:同一份 landing demo 消费 `--st-*` 语义皮肤变量,切换风格原地渐变,支持字体栈、衬线标题、网格 / 扫描线 / 极光背景层与 bento 布局变体;信息面板含别名、适用场景、中英双语可复制 prompt 与折叠配方。数据真源 `lib/styles/`(按谱系分文件)。
- **首页模块入口区**:组件 / 区块 / 风格 / 演练场四张入口卡(`SpaceCards`),风格卡为三皮肤轮播微预览;作为后续新主题(配色、字体排印、页面区块……)的固定扩展点。
- **风格进站内搜索 + `?style=` 深链**:⌘K 搜「毛玻璃」「黑客帝国风」等任意别名直达对应风格;切换风格同步到 URL,单个风格可分享。
- **`thread-list`(会话列表)block**:侧栏会话列表组件族,分组标题(带操作槽)+ 30px 行(未读圆点、时间与悬停操作钮互换、操作簇为绝对定位兄弟层避免交互元素嵌套),签名动效为选中底块经共享布局(LayoutGroup 按实例隔离)在行间平滑滑动。
- **agent-thread 增补**:回溯点分隔行(ThreadCheckpoint,发丝横线 + 胶囊 + Restore)与单条消息用量行(ThreadUsage,$成本/tokens 进出/耗时/缓存命中,按存在字段以中点连接)。
- **agent-trace 增补**:步骤级成本徽章(TraceCostBadge,"1.2K tok · $0.003" 小胶囊入 meta 槽)与 run 汇总尾栏(TraceSummary,总耗时/总 tokens/总成本),回应"执行轨迹缺可观测性组件"的社区空白。

### 变更
- **站点定位文案升级**:hero 标语、副标题与 README 从「动效组件库」改为「前端视觉词汇表」,hero 徽章加入风格计数。
- **顶级导航收真源 `lib/nav.ts`**:site-header、mobile-nav、首页入口卡统一消费 `NAV_SPACES`,加新空间只改一处;删除无引用的 `header-tabs.tsx`。

### 修复
- 移动端抽屉导航的空间标签此前硬编码英文,改走 `nav` i18n 命名空间。

## [0.3.0] - 2026-07-16

### 新增
- **`artifact-panel`(制品画布面板)block**:AI 产物的画布侧栏组件族,发丝面板壳(ArtifactPanel/Header/Action)+ 预览/代码双视图切换(ArtifactViewToggle,内容交叉淡切)+ 版本导航(ArtifactVersionNav,‹ v2/3 › 数字淡切 + 可选 Restore);preview 为"左对话右画布"分屏,三个版本内容随导航联动。
- **`agent-inbox`(Agent 审批收件箱)block**:人机协同审批队列,容器卡带动态计数徽章(AgentInbox)+ 风险分级请求项(InboxItem,low/medium/high 徽章、过期时间、Details 测高展开、批准/拒绝原地落定)+ 操作回执卡(ActionReceipt,影响范围 + ±diff 统计 + Undo);preview 批准后实时追加完成态回执并联动计数。
- **agent-composer 增补**:自主度刻度(ComposerAutonomyDial)——与力度滑杆同构的档位滑杆,填充色随风险档位 蓝→橙→红 渐变,最高档拇指警示呼吸,档位标签淡切;preview 中与权限 chip 文案/警示态联动。
- **agent-thread 增补**:三态任务清单(ThreadTaskList/ThreadTask)——pending 空心圈 / active 主蓝脉冲点 + 扫光标签 / done 绿勾,带进度计数淡切;进入 Streaming 场景演示。

## [0.2.0] - 2026-07-13

### 新增
- **`agent-trace`(Agent 执行轨迹)block**:发丝竖轨上的执行轨迹组件族,按类型着装的步骤节点(计划/工具/反思/完成)+ 进行中步骤(脉冲环 + 节奏扫光标签,可原地落定为完成态)+ "View raw" 原始输出测高展开 + 并行工具组(虚线子列)+ 可嵌套展开的子 Agent 迷你轨迹;preview 以固定延时数组脚本化重放一次完整执行。
- **`streaming-json`(流式结构化输出)block**:对不完整 JSON 容错的分色渲染,手写增量 tokenizer(容忍未闭合字符串/半截数字,键色用警示橙、字符串绿、数字主蓝、字面量紫)+ 仅对新到片段淡入(稳定前缀静态渲染防重排闪烁)+ 流式方块光标 + 函数调用外壳(StreamingFunctionCall,收尾括号随流式结束浮现);preview 以确定性步长自动重放并可 Replay。
- **`citations`(引用与来源)block**:行内引用角标(CitationChip,悬停 150ms 延迟弹出来源预览浮层、共享计时器防误关,焦点可达)+ 来源卡片(SourceCard,favicon/域名/标题/两行摘要,可整卡外链)+ 答案尾部来源列表(SourceList,逐卡级联进场)。
- **`voice-orb`(语音律动球)block**:沉浸式语音模式光球,单一连续渐变球体(状态切换不重置呼吸)在待机/聆听/思考/说话四态间切换——各态呼吸节奏与亮度脉动不同,聆听/说话带回声环外扩(说话节奏减半),思考态叠加旋转锥形高光;preview 为强制深色沉浸卡 + 四态切换。
- **`activity-stats`(活动统计)block**:使用量统计组件族,连体统计条(StatsBar/StatsItem,数值行喂 animated-number 做进场计数)+ GitHub 风格贡献热力图(ActivityHeatmap,单一 CSS 变量配合 color-mix 生成四档强度色阶,逐列 motion.div 级联淡入而非逐格,364 格仅 52 个动画节点)+ 纯文本周期切换器(StatsPeriodTabs);preview 用固定种子的 mulberry32 生成确定性伪随机数据,近期 12 周密集、早期稀疏,切换 Daily/Weekly/Total 演示不同数据集。
- **`settings-panel`(设置面板)block**:偏好设置表单组件族,带标题与头部操作槽的设置分组(SettingsGroup,行间发丝分隔)+ 设置行(SettingsRow)+ 十六进制颜色输入胶囊(SettingsColorField,背景随色值平滑过渡、文字与色环依 YIQ 亮度自动反差)+ 文本框(SettingsTextField)+ 预设选择按钮(SettingsSelectButton)+ 头部幽灵操作按钮(SettingsGhostButton);preview 组合 Switch 与 RangeSlider 演示强调色、背景色、UI 字体、半透明侧栏开关与对比度滑杆的完整交互。
- **`agent-thread`(Agent 会话流)block**:AI agent 对话流渲染组件族,用户消息 pill + 可旋转箭头的回合头(工作中 shimmer 态)+ Markdown 排版容器(段落/列表/行内代码/代码块)+ 思考态(shimmer「思考中」↔ 可展开推理摘要)、可收起工作日志(ThreadCollapse)+ 通用工具调用状态行(运行/完成/失败/停止)+ 审批请求卡(批准/拒绝)+ 流式输出光标 + 带展开动画的文件卡与变更卡(+N/−N 统计、悬藏行展开)+ 命令执行行(运行中脉冲图标)+ 悬停显现的回合操作栏(复制/点赞/点踩/分享 + 时间戳);preview 提供 Streaming / Done / Approval 三场景切换演示；增补澄清追问卡、错误重试态、系统横幅、分支切换、推荐追问与新消息胶囊。
- **`agent-workbench`(Agent 工作台)block**:三栏式 Agent 应用外壳,半透明可拖宽侧栏 + 会话主列 + 右侧工具面板,支持拖到底关闭、弹簧展开/折叠、键盘调宽,以及横跨全宽的 46px 顶部工具栏覆盖层,并带右上角置顶摘要浮层卡片(环境信息示例);预览升级为与 agent-thread、agent-composer 的组合总览。
- **`agent-composer`(Agent 输入台)block**:AI agent 聊天输入台组件族,上下文 chips(悬停切换图标)+ 权限 chip + 分段推理力度滑杆的模型选择器 + 可变形发送/停止按钮,并带 ＋ 添加菜单与语音听写态(虚线声纹轨 + 计时 + 停止钮);最高推理力度档带渐变微光扫过、光晕呼吸与波纹扩散特效；增补附件胶囊与上下文用量指示条。

## [0.1.0] - 2026-07-12

首个版本 —— 基于开源项目 [beUI](https://github.com/starc007/ui-components)(MIT)fork,改造成**中文优先的双语动效组件参考库**「组件实验室 / UI Lab」,并上线 Vercel。

### 新增
- **双语支持**:next-intl 路由化,`/` 中文(默认)、`/en` 英文,`localePrefix: as-needed`,顶栏「中/EN」一键切换,缺中文自动回退英文。
- **registry 双语字段**:`nameZh`/`descriptionZh` + `lib/i18n-content.ts` 的 `localizedName`/`localizedDescription` 解析器。
- **全站中文化**:46 个组件的名称/描述、分类、UI 文案(顶栏/侧边栏/搜索/页脚/详情页/落地页)、三个文档页(AI 接入 / 主题 / 动效指南,按 locale 分支渲染)。
- **空「布局 (layout)」分类**占位,用于以后收纳非动效组件。
- **Agent 指南**:中文 `AGENTS.md` + `CLAUDE.md`(单一真源)。
- **部署**:上线 Vercel(GitHub 联动、push 自动部署);`SITE_URL` 自动解析 Vercel 生产域名,注册表/OG/安装命令零配置指向真实地址。

### 变更
- **品牌**:beUI → UI Lab / 组件实验室。
- **shadcn 命名空间**:`@beui` → `@uilab`,集中在 `lib/site.ts` 的 `REGISTRY_NAME`(改一处全站生效)。
- **内部导航**改用 `@/i18n/navigation`(locale-aware 的 `Link`/`useRouter`/`usePathname`/`redirect`)。
- **logo**:`beui-mark.png` → `uilab-mark.png`;OG 图 logo 改从本地 `SITE_URL` 加载(原先硬编码 `beui.dev`)。
- 内部 CSS 动画标识符 `beui-*` → `uilab-*`;机器元数据前缀 `beui:*` → `uilab:*`。

### 移除
- 原作者专属内容:Pro 付费入口、Sponsors 赞助页、约稿 CTA、testimonials 评价区、指向作者的 GitHub/邮箱/域名链接。
- 与 `[locale]` 动态段冲突的根级 `/{slug}.json` 别名端点(shadcn 安装仍走 `/r/{slug}.json`)。

> logo 图形本身仍是 beUI 原始 mark,待替换为自有 logo(覆盖 `public/uilab-mark.png`)。
