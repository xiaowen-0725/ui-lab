# 组件实验室 (UI Lab) — Agent 指南

一个**中文优先的双语**「前端视觉词汇表」:收集一切"只能看、说不出"的前端事物(动效组件、复合区块、设计风格……),让人肉眼感受、让 AI 拿到准确的话。组件以 shadcn 兼容的 registry 端点「复制源码」方式分发。基于开源项目 beUI(starc007/ui-components,MIT)fork,个人自用,已部署于 Vercel(生产别名 https://ui-lab-ten.vercel.app)。

技术栈:Next.js 15(App Router)· React 19 · Tailwind CSS 4 · motion(framer-motion)v11 · next-intl v4 · TypeScript strict · Bun · Biome。

## 愿景与条目公式

站点解决"设计说不出来"的翻译问题:非专业人士看到 → 认出 → 复制「对 AI 这样说」。全站条目遵循统一公式:**活样本 + 名字(中英 + 别名)+「对 AI 这样说」prompt + 可选配方**。prompt 的写法是"具名风格 + 具体视觉手段 + 禁止项(FORBIDDEN)",负面约束比正面形容词更能防住 AI 的平庸默认值。

主题按**顶级模块**扩展(现有:组件 / 区块 / 风格 / 演练场;规划中:配色方案、字体排印、页面区块等)。加新主题三步:顶级路由 `app/[locale]/<theme>/` → `lib/nav.ts` 注册空间(所有导航面自动跟上)→ 首页 `SpaceCards` 补一条描述文案(`landing.space*Desc`)。每个主题的数据真源独立建 `lib/<theme>.ts`,不塞进 `lib/registry.ts`。

## 命令

```bash
bun install
bun run dev             # 本地站点(localhost:3000)
bun run typecheck       # tsc --noEmit
bun run lint            # biome
bun run check:registry  # 校验每个 registry 组件都能发布其文件
bun run check           # 上面三项一起 —— 提交前跑
```

快速验证用 `typecheck` + `lint`。**dev server 和 `bun run build` 共用 `.next` 目录:dev 开着时别跑 build,会让 dev 报 500(`Cannot find module vendor-chunks`)—— 要构建先停 dev。**

## 目录结构

- `components/motion/` — 组件库本体。一个组件一个文件;多文件组件用文件夹(`swap/`、`button/`)。
- `components/previews/` — 每个组件的演示,注册在 `components/previews/index.tsx`。预览也随 registry 分发。
- `components/app/` — 站点外壳(顶栏、hero、dock、代码块),**不属于组件库**。
- `lib/registry.ts` — **组件目录的真源**(slug、文件、示例、中英文名/描述)。现有组件查这里,别在本文档里找清单。两个分类:`motion`(显示名「组件」,基础组件)和 `blocks`(复合产品组件,发 `registry:block`)。
- `lib/nav.ts` — **顶级空间导航真源**(`NAV_SPACES` + `isSpaceActive`)。site-header、mobile-nav、首页入口卡都消费它;加新空间只改这里。
- `lib/styles.ts` — **「风格」模块数据真源**:每个风格 = 皮肤 CSS 变量(`--st-*`)+ 别名 + 适用场景 + 中英 prompt + 配方。
- `components/app/styles/` — 风格换皮对比器(`/styles` 页面),属站点功能,**不入 registry**。
- `lib/registry-server.ts` — 构建 registry item,会跟随每个文件的 `@/` 与相对 import 把依赖一起打包。所以内部 import 是安全且鼓励的(import `@/lib/ease` 就会连 `lib/ease.ts` 一起发)。
- `lib/site.ts` — 站点常量:`SITE_URL`、`REPO_URL`、`REGISTRY_NAME`(命名空间源头,见「分发」)。
- `lib/ease.ts` — 所有 motion token。
- `i18n/`、`messages/`、`lib/i18n-content.ts` — 国际化,见下节。
- `app/[locale]/` — 页面路由;`app/` 根下是机器端点。
- `scripts/check-registry.ts` — 目录校验。

## 国际化(中文优先)—— 本项目核心约定

next-intl 路由化:`/` = 中文(默认 locale)、`/en/*` = 英文,`localePrefix: "as-needed"`。缺中文时回退英文,不会崩。

- **页面**放 `app/[locale]/`;**机器端点留在 `app/` 根、永远英文规范**:`registry.json`、`r/`、`catalog.json`、`llms.txt`、`llms-full.txt`、`sitemap`、`robots`、`manifest`、`theme.css`、`api/`、`opengraph-image`。中间件 matcher 已把它们排除,新增同类端点也放根、并确认被排除。
- **内部导航必须用 `@/i18n/navigation` 的 `Link`/`useRouter`/`usePathname`/`redirect`**,不要用 `next/link`、`next/navigation`(否则英文态丢 `/en` 前缀)。唯一例外:`notFound` 仍从 `next/navigation` 导入。
- **组件名/描述**:registry 条目带 `nameZh`/`descriptionZh`;可视组件渲染时用 `localizedName`/`localizedDescription`(`lib/i18n-content.ts`)按 locale 解析。客户端组件取 `useLocale()`,服务端取 `getLocale()`。
- **UI 文案**:放 `messages/zh.json` + `messages/en.json`;组件里客户端用 `useTranslations`、服务端用 `getTranslations`。
- **文档页**(`app/[locale]/docs/*`)用 locale 分支:`locale === "zh" ? <ContentZh/> : <ContentEn/>`,两份 JSX 结构一致,只翻散文;代码块、className、URL、prop 名不动。
- SEO `<meta>`、JSON-LD、machine 端点保持英文规范,让 shadcn / AI 工具稳定。

## 加新组件(标准流程)

一次改动同时包含三样,`bun run check:registry` 必须过:

1. **源码** → `components/motion/xxx.tsx`(多文件组件用文件夹)。
2. **预览** → `components/previews/<category>/xxx.preview.tsx`,并注册进 `components/previews/index.tsx`。
3. **registry 条目**(`lib/registry.ts`)—— 中英文一起填:
   ```ts
   { slug: "xxx", name: "Xxx", nameZh: "中文名",
     description: "…", descriptionZh: "中文描述",
     file: "components/motion/xxx.tsx" }
   ```
   标 `new` 的加 `badge: "new"` + `launchedAt: "YYYY-MM-DD"`(落地页「最近上新」按它倒序,新加的排最前)。
4. **刷 CLI 快照** → `bun run cli:snapshot`。CLI 读的是冻结快照,不刷则 `ui-lab` 命令看不到新组件(详见「AI 接入」)。

现有组件先查 `lib/registry.ts`,存在就直接 import。

## Motion 约定

- 用 `lib/ease.ts` 的 token:`EASE_OUT`、`EASE_OUT_CSS`、`EASE_IN_OUT`、`EASE_DRAWER`、`SPRING_PRESS`、`SPRING_SWAP`、`SPRING_PANEL`、`SPRING_LAYOUT`、`SPRING_MOUSE`。不写内联 `cubic-bezier` 或一次性 spring;确实需要组件专属调参时,留成有注释说明原因的具名局部常量。
- 位移类动效用 `useReducedMotion()`(`motion/react`)门控 —— 全局 CSS media query 拦不住 JS spring,必须靠这个 hook;降级时保留透明度/颜色过渡、去掉位移。
- 装饰性 hover(磁吸、倾斜)用 `useHoverCapable()`(`lib/hooks/use-hover-capable`)门控,否则触屏会留幽灵 hover。
- 只动 `transform` 和 `opacity`,不动布局属性;blur ≤ 10px;退出比进入快;UI 动画 <300ms,按压反馈 100–160ms。
- 站点 CTA 用 `PressLink`(`components/app/press-link.tsx`),匹配库里 Button 的 `SPRING_PRESS` 手感;主 CTA 不用 CSS `.press`。

## 代码约定

- 仅具名导出。每个组件接受 `className` 并用 `lib/utils` 的 `cn()` 合并。交互组件加 `"use client"`。
- 较大的组件支持受控 + 非受控(`value`/`defaultValue`/`onChange`);简单开关仅受控。
- Biome a11y 严格:div/span 上不加冗余 ARIA role,交互用真实元素(`<button>`),不嵌套交互元素。

## 分发 / 命名空间

- shadcn registry 名在 `lib/site.ts` 的 `REGISTRY_NAME`(现为 `"uilab"` → 安装命名空间 `@uilab`);所有安装地址用 `SITE_URL`(默认 `localhost:3000`,部署时设 `NEXT_PUBLIC_SITE_URL` 即全站切换)。**改这一处,全站安装命令跟着变** —— 别再散落硬编码 `@beui`/`beui.dev`。
- `app/r/*` 端点的路径形状(`/r/{name}.json`、`/r/{name}/raw`)是 shadcn 契约,别重命名或破坏。

## AI 接入

一个真源、多条薄视图。真源是 `lib/catalog.ts` 的 `buildCatalog()`,把全部词汇(组件 / atom token / 图标 / 风格 / 配色 / studio 预设)聚合成统一 `CatalogItem`(name、描述、prompt、pageUrl、fetch)。对外三条通道,MCP 已退役:

- **组件安装**:shadcn registry `app/r/*`,`npx shadcn add`(见「分发 / 命名空间」)。
- **机器端点**(`app/` 根、英文规范、部署自动静态化):`/catalog.json`(结构化全词汇)、`/llms.txt`(分组索引)、`/llms-full.txt`(每项 prompt/token 内联)。加新词汇时它们**随构建自动反映**,不用手改。
- **`ui-lab` CLI + skill**:CLI 在 `cli/`(独立子包、零运行时依赖、从根 tsconfig/biome 排除),`bun link` 后全局可用;skill 在 `skill/ui-lab/`,用 dbs-bridge 桥接到 Claude Code / Codex / 通用 Agents / Grok。CLI 不 import 主仓库 lib/*,只消费 catalog 数据。

**⚠ CLI 快照维护规范(重要)**:CLI 默认读**构建时冻结的快照** `cli/catalog.snapshot.json`,不是实时数据。所以**任何词汇增删改之后**(加组件、加图标、改 atoms/styles/palettes/studio),线上机器端点会自动更新,但 `ui-lab` CLI 会一直显示旧数据,直到重新生成快照:

```bash
bun run cli:snapshot        # 重跑 buildCatalog() 刷新 cli/catalog.snapshot.json（种子数据，需提交）
cd cli && bun run build      # 仅当改了 CLI 源码才需要；只刷数据可不必
```

把「刷快照」当成加词汇流程的收尾一步。部署后想让快照里的 URL / 安装命令是 prod 域名,用 `NEXT_PUBLIC_SITE_URL=https://<prod-domain> bun run cli:snapshot`。CLI 也支持 `--registry <url>` / `UILAB_REGISTRY` 实时拉线上 `/catalog.json` 绕过快照。

## 更新日志与发版

值得注意的变更(收/删组件、改约定、品牌或结构调整)追加到 `CHANGELOG.md` 的 `[Unreleased]` 段,按「新增 / 变更 / 修复 / 移除」分类;日常琐碎改动不必记。

发版三步:

1. 把 `[Unreleased]` 整段挪到新标题 `[x.y.z] - YYYY-MM-DD` 下,顶部留一个空的 `[Unreleased]`。
2. `package.json` 的 `version` 同步改成 `x.y.z`。
3. 打 tag:`git tag vx.y.z && git push --tags`。

版本号语义:收组件/加功能进 minor(`0.x.0`),改约定/破坏性调整进主版本,纯修复进 patch(`0.0.x`)。

## 提交

Conventional 小写前缀(`feat:`、`fix:`、`refactor:`、`docs:`),祈使句主题。
