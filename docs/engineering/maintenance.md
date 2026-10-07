# UI Lab 维护参考

开发流程见 [CONTRIBUTING.md](../../CONTRIBUTING.md)，判断规则见 [CODING_STANDARDS.md](../../CODING_STANDARDS.md)。这里保存按任务查阅的操作和约定。

## 目录与真源

- `lib/catalog.ts` 的 `buildCatalog()` 聚合领域真源，站点、机器端点和 CLI 快照消费它。新增领域建 `lib/<domain>.ts` 或目录；registry 只登记安装资产。
- `lib/registry.ts` 登记资产，`lib/registry-server.ts` 构建安装身份及 import 闭包。历史 category 与路径保持兼容，职责读 `assetRole`；取舍见 [ADR 0002](../adr/0002-catalog-roles-and-install-identities.md)。
- `lib/nav.ts` 的 `NAV_SPACES`、`DICTIONARY_SECTIONS`、`isSpaceActive` 是导航真源；新空间同时更新路由、首页 `SpaceCards` 描述和双语 messages。
- `components/motion/`、`components/agents/` 保留既有组织，helper 随依赖分发。`sections/`、`pages/`、`site-shells/` 保存各自实现。
- `components/previews/` 是站点包装，`components/examples/` 是独立用法。自定义 detail/raw 可含预览，shadcn 安装只带资产必需源码。
- `components/app/` 是站点功能；各领域 `lib/styles.ts` 等维护视觉词汇。`lib/ease.ts` 是 motion token 真源，`lib/hooks/` 提供共享行为，`lib/utils.ts` 提供 `cn()`。

## 双语与路由

中文默认裸路径，英文 `/en/*`，`localePrefix: "as-needed"`；可见页面位于 `app/[locale]/`。

站点导航的 `Link`、`useRouter`、`usePathname`、`redirect` 来自 `@/i18n/navigation`；`notFound`、只读 `useSearchParams` 来自 `next/navigation`。无 locale provider 的根级 `app/not-found.tsx` 使用 `next/link` 返回首页。可分发源码用 href/回调接入消费方导航。

站点文案在 `messages/zh.json` 与 `messages/en.json`，客户端用 `useTranslations`，服务端用 `getTranslations`。条目用 `lib/i18n-content.ts` 的 `localizedName` / `localizedDescription`；历史缺中文可回退，新资产填齐双语。

文档页用结构一致的中英文 JSX，只翻散文，代码、URL、className 和 prop 名保持原义。可分发资产显式接收 locale/content，不依赖 next-intl。

机器端点在 `app/` 根，保持英文规范及 locale 无关路径：registry、`r/`、catalog、llms、主题 CSS、sitemap、robots、manifest、api、opengraph-image。新增端点确认被 middleware 排除；`/themes/<slug>.css` 靠点号排除，主题详情在 locale 路由。SEO meta 与 JSON-LD 保持英文规范。

## 服务与验证

命令真源是 `package.json`。dev 与 build 共用 `.next`，构建前停 dev，避免 vendor-chunks 缺失导致 500。

站点验证：停 dev → `bun run build` → `bun run start`，保持生产服务运行，在另一终端运行 `bun run check:catalog-site`；默认 `http://localhost:3000`，`UILAB_SITE_BASE` 可指定目标。

`benchmarks/runs/*` 为独立 package，根 TypeScript/Biome 不扫描，使用自己的 lockfile 和工具链。Greenfield 首次先在其目录执行 `bun install --frozen-lockfile`，再回根运行 benchmark。原始失败、复测和截图分别保留。

独立复制用法统一由 `lib/standalone-usage.ts` 枚举，包含独立安装项和只在父条目展示的变体。详情页读取 `usageFile`，自定义 `/r/<slug>` 的 `usage` 字段返回用法路径与内容；shadcn `/r/<slug>.json` 和 raw 保持源码分发契约。用法不作为资产运行时文件自动安装。`check:usage` / `check:usage-browser` 支持指定枚举 key，证据落在系统临时目录；门禁不会把缺 helper 回退到仓库源码。

站点主 CTA 使用 `components/app/press-link.tsx` 的 `PressLink`，与库 Button 的按压 token 保持一致。

## 分发、CLI 与 Skill

命名空间源头是 `lib/site.ts` 的 `REGISTRY_NAME`，安装 URL 用 `SITE_URL`；部署通过 `NEXT_PUBLIC_SITE_URL` 指定域名。保留 `/r/{name}.json` 和 `/r/{name}/raw`。

CLI 独立消费 Catalog，不 import 根 lib。调用前检查真实 `ui-lab --help`，未发布实现使用 `bun cli/src/index.ts <command>`。协议和 Audit 边界见 [APPLICATION_KIT.md](../../APPLICATION_KIT.md)，使用见 [cli/README.md](../../cli/README.md)。

Catalog 或分发源码变化后刷新快照。需生产 URL 时运行 `NEXT_PUBLIC_SITE_URL=https://<prod-domain> bun run cli:snapshot`。`--registry` / `UILAB_REGISTRY` 接收 base URL，不带 `/catalog.json`。

`$ui-lab` router 在 `skill/ui-lab/`；`$design-ingest` 仅沉淀 Theme layer。改 Skill 后跑 `check:skills`。通用中后台装配通过已安装的 `$uilab-admin`；调用前确认实际工具可用。

## 日志与发布

值得记录的新增、约定变更、结构调整及修复写入 `CHANGELOG.md` Unreleased，按新增/变更/修复/移除分类。

站点发版：Unreleased 移到 `[x.y.z] - YYYY-MM-DD`，保留空 Unreleased，同步根 package version；授权后建 `vx.y.z` tag 并 push。新增功能进 minor，破坏性调整进主版本，修复进 patch。

CLI 独立发版：源码先类型检查与构建，对外生效需授权后 bump CLI version 并 publish。构建或快照刷新不表示 npm/生产已更新；发布后安排目标线上复验。

## 历史证据

计划005记录 2026-10-03 的验收时点；10月7日补充见 [commit-preflight.md](../../plans/005-evidence/commit-preflight.md)。历史“未提交”不覆盖后续 Git 状态。源码摘要、原始日志和 CSV 保留原样；产品规则不从历史报告推断。

[计划006](../../plans/006-maintainability-retrospective.md) 记录本次维护复盘；其中104条目缺用法的后续补齐记录见 [计划007](../../plans/007-standalone-usage-acceptance.md)，不改写原复盘时点的统计。
