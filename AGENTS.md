# 组件实验室 (UI Lab) — Agent 指南

一个**中文优先的双语、AI-first 可组合前端系统**:底层收集一切"只能看、说不出"的前端视觉词汇,上层用 Stack Profile、System Kit、组件、区块和 Recipe 组成应用级 React 前端与落地页,让 AI 复用既定技术栈和设计契约而不是每次重画。组件以 shadcn 兼容的 registry 端点「复制源码」方式分发。架构边界见 `APPLICATION_KIT.md`。基于开源项目 beUI(starc007/ui-components,MIT)fork,个人自用,已部署于 Vercel(生产别名 https://ui-lab-ten.vercel.app)。

技术栈:Next.js 15(App Router)· React 19 · Tailwind CSS 4 · motion(framer-motion)v11 · next-intl v4 · TypeScript strict · Bun · Biome。

## 愿景与条目公式

站点解决"设计说不出来"和"AI 每次从头生成导致漂移"两个问题:非专业人士看到 → 认出 → 选择 System/Recipe → AI 复用和组合。词汇条目遵循统一公式:**活样本 + 名字(中英 + 别名)+「对 AI 这样说」prompt + 可选配方**;应用级 Recipe 则用 `entryComponent` / `components` / `optionalComponents` / `sections` / `slots` / `states` / `responsive` / `assets` / `required` / `forbidden` 声明机器可读的装配契约。prompt 的写法是"具名风格 + 具体视觉手段 + 禁止项(FORBIDDEN)",负面约束比正面形容词更能防住 AI 的平庸默认值。

主题按**顶级模块**扩展(现有:组件 / 区块 / 风格 / 演练场;规划中:配色方案、字体排印、页面区块等)。加新主题三步:顶级路由 `app/[locale]/<theme>/` → `lib/nav.ts` 注册空间(所有导航面自动跟上)→ 首页 `SpaceCards` 补一条描述文案(`landing.space*Desc`)。每个主题的数据真源独立建 `lib/<theme>.ts`,不塞进 `lib/registry.ts`。如果新增的是跨区块的应用外壳或页面组合契约,应建 Catalog `kind: "recipe"` 的 Recipe,不要伪装成普通顶级主题或单个 Block;首批固定为 `agent-workbench` / `saas-landing`。

## 命令

```bash
bun install
bun run dev             # 本地站点(localhost:3000)
bun run typecheck       # tsc --noEmit
bun run lint            # biome
bun run check:registry  # 校验每个 registry 组件都能发布其文件
bun run check           # 根仓 typecheck + lint + registry + skill 门禁 —— 提交前跑
bun run benchmark:greenfield # 独立 Greenfield fixture 的完整高成本验证
```

快速验证用 `typecheck` + `lint`。**dev server 和 `bun run build` 共用 `.next` 目录:dev 开着时别跑 build,会让 dev 报 500(`Cannot find module vendor-chunks`)—— 要构建先停 dev。**

`benchmarks/runs/*` 是独立 package，使用自己的 lockfile、TypeScript、Biome、测试与 Playwright 工具链，根 `tsconfig` / Biome 不扫描。首次重跑 Greenfield 前先在 `benchmarks/runs/greenfield-workbench` 执行 `bun install --frozen-lockfile`，再回仓库根运行 `bun run benchmark:greenfield`。该命令依次跑 lint、typecheck、test、build、strict audit 与 E2E，因依赖和浏览器成本较高，不接入根 `bun run check`。

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

- **页面**放 `app/[locale]/`;**机器端点留在 `app/` 根、永远英文规范**:`registry.json`、`r/`(含 `r/theme-<slug>.json` 主题套件 item)、`catalog.json`、`llms.txt`、`llms-full.txt`、`sitemap`、`robots`、`manifest`、`theme.css`、`themes/<slug>.css`(主题套件整份双态 CSS)、`api/`、`opengraph-image`。中间件 matcher 已把它们排除(带 `.` 的路径天然排除,`themes/<slug>.css` 靠此;不要做裸 `/themes` 根端点),新增同类端点也放根、并确认被排除。
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

## 加新 Recipe(应用外壳/页面组合契约)

Recipe 是 Catalog 的 `kind: "recipe"`,用于组合 System Kit、Block、组件或页面 section,而不是承载业务逻辑。每个 Recipe 必须声明 `profiles` / `recommendedSystem`、`entryComponent`、必装 `components`、`optionalComponents`、页面型配方的 `sections`(slug/variant/required)、`slots`、loading/empty/error 等 `states`、`responsive`、字体/图片等 `assets`,以及 `required` / `forbidden`。`saas-landing` 当前是 section composition contract(Pricing 可选),不是一份可 vendoring 的完整页面 shell;完整 shell 是后续资产。变更 Recipe 后同样必须执行 `bun run cli:snapshot`,并用消费项目的 `ui-lab compose <recipe>` + `ui-lab audit` 验证。

## System Preset 与 Order Manifest（Phase 1–2）

`lib/system-presets/` 是 System Preset 真源；`lib/catalog-contract.ts` 负责 Catalog 契约的 canonical hash；`lib/order-manifest.ts` 定义可校验、不可变的 draft / confirmed Manifest schema。Theme Kit 仍只负责 token，Recipe 仍只负责组合，`ui-lab.config.json` / `ui-lab.lock.json` / Audit 也各自只表达低层绑定与一致性证据，以上任何一项都不能替代 Confirmed Manifest。

`codex-desktop-v1` 的 Phase 1 已有 approved calibration 与 planned acceptance cases；Phase 2 已生成 8 张 candidate visual evidence，但它们只是 current implementation 的 regression captures，仍为 pending，不能称为 Codex fidelity reference 或 approved acceptance。用户在 Reference Board 逐项批准 visual master 前，必须阻断 checkout / Confirmed Manifest，禁止修改 Parking Agent，Agent 也不得自行批准候选或确认订单。Catalog 增删改（包括 System Preset）仍必须执行 `bun run cli:snapshot`。Phase 3 的 order CLI（validate / diff / sync）与 skill enforcement 尚未实现，不得把现有 `init` / `compose` / `lock` / `audit` 描述为已经支持 confirmed order。

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

一个真源、多条薄视图。真源是 `lib/catalog.ts` 的 `buildCatalog()`,把全部词汇和应用 Recipe(组件 / atom token / 图标 / 风格 / 配色 / studio 预设 / 设计系统 / `recipe`)聚合成统一 `CatalogItem`(name、描述、prompt、pageUrl、fetch)。对外三条通道,MCP 已退役:

- **组件安装**:shadcn registry `app/r/*`,`npx shadcn add`(见「分发 / 命名空间」)。
- **机器端点**(`app/` 根、英文规范、部署自动静态化):`/catalog.json`(结构化全词汇)、`/llms.txt`(分组索引)、`/llms-full.txt`(每项 prompt/token 内联)。加新词汇时它们**随构建自动反映**,不用手改。
- **`ui-lab` CLI + skill**:CLI 在 `cli/`(独立子包、零运行时依赖、从根 tsconfig/biome 排除),npm 包名为 `uilab-cli`、bin 为 `ui-lab`,本地也可 `bun link`;skill 在 `skill/ui-lab/`,用 dbs-bridge 桥接到 Claude Code / Codex / 通用 Agents / Grok。项目级深接口是 `init`(建立 Stack/System 与 `ui-lab.config.json`)→ `compose`(装配 Recipe)→ `add`(增量组件)→ `audit`(一致性门禁);配置 schema 固定为 `schemaVersion=1`、`profile`、`system`、可选 `recipe`、`components`、`mode=adopt|replace`。这些 Application Kit 命令与 config-aware `add` 当前仍在 `[Unreleased]`:调用前先以 `ui-lab --help` 确认可用;未发布版本在本仓库用 `bun cli/src/index.ts <command>`,不得假装旧 npm CLI 已执行。CLI 不 import 主仓库 lib/*,只消费 catalog 数据。**改了 CLI 源码后要 `cd cli && bun run build` + 提 npm 新版本(bump version → publish)** 才对外生效;只加词汇或 Recipe 则 `bun run cli:snapshot` 刷快照(下次发版带上)。

**Skill 单入口树**:`skill/ui-lab/SKILL.md` 是 model-invoked router,一次只走一个互斥路线。四阶段为 Define(`discover` / `$design-ingest` / `select`)→ Build(`adopt` / `replace`)→ Refine(`polish` / `motion` / `harden`)→ Verify(`review` + deterministic Audit + visual acceptance);Audit、视觉证据和用户批准互不替代。`$design-ingest` 只沉淀视觉 Design System / Theme layer,完整应用系统必须回到 `$ui-lab select`。修改 `skill/ui-lab/**` 或 `skill/design-ingest/**` 后运行 `bun run check:skills`:校验 SKILL frontmatter、相对链接、`agents/openai.yaml`、路由/门禁关键契约;该检查不证明视觉一致或用户批准。

**消费者根与命令语义**:`ui-lab.config.json`、`components.json` 和被审计的 `package.json` 必须位于实际 React 前端 package 根,不要求是仓库根;monorepo 必须用同一个 `--dir packages/desktop` 一类参数贯穿 `init` / `compose` / `add` / `audit`,不要在无 React 依赖的 workspace root 建 config。`compose` 始终要求 Catalog 中存在所选 System Kit:`adopt` 先 review/compare,只补缺失项且不得覆盖 vendored 源码;`replace` 才给完整安装计划。`add` 始终只打印不执行;有 config 时去重登记 slug,无 config 时只打印,并支持 `--dir`。

**阶段一 Audit 范围**:`ui-lab audit` 当前硬检查 config/Catalog/Recipe 引用、Recipe/Profile 与必装组件登记、React 19、Tailwind CSS 4、TypeScript、按 Profile 所需的 `next|vite|electron`,有效 `components.json`(至少非空 `aliases.components` / `aliases.utils`)、每个 config Component 的 vendored source,以及 Workbench 每个核心文件的 `--wb-*` 和有效 `--wb-surface` 声明或所选主题 CSS import;Workbench 缺失是 error。它不检查 strict `tsconfig`(extends 易误报)、字体/资产、裸颜色、越级圆角/阴影、未门控 motion,也不验证 `sections` / `slots` / `states` / `responsive` / `assets` / `required` / `forbidden` 的视觉 fidelity;Audit 通过不能表述为视觉验收通过。

**⚠ CLI 快照维护规范(重要)**:CLI 默认读**构建时冻结的快照** `cli/catalog.snapshot.json`,不是实时数据。所以**任何 Catalog 内容增删改之后**(加组件、Recipe、图标,改 atoms/styles/palettes/studio),线上机器端点会自动更新,但 `ui-lab` CLI 会一直显示旧数据,直到重新生成快照:

```bash
bun run cli:snapshot        # 重跑 buildCatalog() 刷新 cli/catalog.snapshot.json（种子数据，需提交）
cd cli && bun run build      # 仅当改了 CLI 源码才需要；只刷数据可不必
```

把「刷快照」当成加词汇流程的收尾一步。部署后想让快照里的 URL / 安装命令是 prod 域名,用 `NEXT_PUBLIC_SITE_URL=https://<prod-domain> bun run cli:snapshot`。CLI 也支持 `--registry <base-url>` / `UILAB_REGISTRY=<base-url>` 实时拉线上 Catalog;值必须是部署 base URL(如 `https://ui-lab-ten.vercel.app`),不要带 `/catalog.json`,CLI 会自行追加。

## 更新日志与发版

值得注意的变更(收/删组件、改约定、品牌或结构调整)追加到 `CHANGELOG.md` 的 `[Unreleased]` 段,按「新增 / 变更 / 修复 / 移除」分类;日常琐碎改动不必记。

发版三步:

1. 把 `[Unreleased]` 整段挪到新标题 `[x.y.z] - YYYY-MM-DD` 下,顶部留一个空的 `[Unreleased]`。
2. `package.json` 的 `version` 同步改成 `x.y.z`。
3. 打 tag:`git tag vx.y.z && git push --tags`。

版本号语义:收组件/加功能进 minor(`0.x.0`),改约定/破坏性调整进主版本,纯修复进 patch(`0.0.x`)。

## 提交

Conventional 小写前缀(`feat:`、`fix:`、`refactor:`、`docs:`),祈使句主题。
