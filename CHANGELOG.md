# 更新日志

本项目所有值得记录的变更都写在这里。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),版本遵循语义化,日期用 `YYYY-MM-DD`。

尚未发布的改动先记到 `[Unreleased]`,发布时整体挪到一个带日期的版本号下。

## [Unreleased]

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
