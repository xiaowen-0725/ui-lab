# 更新日志

本项目所有值得记录的变更都写在这里。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),版本遵循语义化,日期用 `YYYY-MM-DD`。

尚未发布的改动先记到 `[Unreleased]`,发布时整体挪到一个带日期的版本号下。

## [Unreleased]

### 新增
- **`agent-workbench`(Agent 工作台)block**:三栏式 Agent 应用外壳,半透明可拖宽侧栏 + 会话主列 + 右侧工具面板,支持拖到底关闭、弹簧展开/折叠、键盘调宽,以及横跨全宽的 46px 顶部工具栏覆盖层,并带右上角置顶摘要浮层卡片(环境信息示例)。

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
