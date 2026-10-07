# UI Lab Application Kit

> 产品边界以 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md) 为唯一真源。本文只描述当前可用的装配协议，不定义未来创建器、选择面或下单生命周期。

UI Lab Application Kit 位于可视词汇表之上：它用 Stack Profile、Theme Kit、registry 资产、Recipe、config、CatalogLock 与 Audit 约束 React 前端装配。

此前的 Studio、System Preset、Order Manifest、candidate evidence 与 checkout/confirmation 实验已移除。它们不是 current bridge，也没有兼容承诺。

## 当前边界

UI Lab 负责：

- React 前端的推荐技术栈和框架适配边界；
- 主题、字体、排版、颜色、间距、圆角、阴影、动效与图表 token；
- 可 vendoring 的组件、区块、完整页面、共享外壳、多页组合及其 source family；
- Recipe 的 section、slot、state、responsive、asset、required 与 forbidden；
- 消费项目的装配意图、Catalog provenance 与基础一致性审计。

UI Lab 不负责：

- 业务领域模型、产品规则和最终信息架构；
- 后端、数据库、鉴权、部署或原生桌面主进程；
- 为套用已有组件而改变业务语义；
- 替代人工视觉验收或目标运行时测试；
- Package、Order、Evidence、Create、Studio 或 approval 产品流程。

## Stack Profile

Golden Path 是 React 19、TypeScript、Tailwind CSS 4、shadcn-compatible registry、Lucide 图标与 CSS variables 驱动主题。Motion 只在交互确实需要时进入，并默认支持 reduced motion。

Profile 不强迫所有项目使用 Next.js：

- `next-app`：App Router、SSR 边界、`next/font` 和全局样式入口；
- `vite-app`：纯客户端入口、路由选择和本地字体资源；
- `electron-renderer`：保持渲染层为纯 React，不把 Node 或主进程能力带进 UI 组件。

站点的 Next 路由、next-intl 和预览控制器留在 `app/[locale]/` 与 `components/app/` / `components/previews/`。可复用源码通过显式 locale/content/data/回调接入消费者，不依赖 UI Lab 的站点 provider。Profile 声明不是消费者运行验收结果；实际安装、构建、浏览器及 Electron renderer 验收分别记录在[验收台账](plans/005-acceptance-tracker.md)。

站点中文默认使用裸路径，英文使用 `/en/*`；registry、Catalog、llms 和主题 CSS 等机器端点留在 `app/` 根，保持英文规范及 locale 无关路径。

## Theme Kit

Theme Kit 是 System 层的可运行 token 载荷，包含 shadcn 语义色、`--wb-*` 工作台 token、图表色、字体栈和必要的静态值。

Theme Kit 可以通过 registry theme item、CSS endpoint 或 `ui-lab theme <slug>` 获取。它只负责视觉 token，不能被称为完整应用系统、业务模板或用户批准结果。

## Asset 与 source family

可安装资产通过 shadcn-compatible registry 复制源码分发。Catalog `kind: "component"` 表示安装源码条目，`assetRole` 区分 `component` / `block` / `page` / `shell` / `site`。历史 category `motion` / `blocks`、详情 URL 和源码位置保持兼容，不能据此推断职责；`assetRole: component` 输出 `registry:component`，其余源码职责输出 `registry:block`。展示父项和变体各有真实安装身份；已有同名默认变体保留窄范围安装语义，其余父项安装完整源码族。

本轮新增24个资产：19个区段变体位于 `components/sections/`，4个完整页面位于 `components/pages/`，1个 Agent 多页组合位于 `components/site-shells/`。区段、页面和整站分别由 `lib/section-assets.ts`、`lib/pages.ts`、`lib/sites.ts` 登记；多页组合引用既有 Workbench 和独立页面，不保存第二份页面实现。对应 `components/examples/` 用法通过 `usageFile` 登记，直接 import 安装入口；站点预览与可复制用法分开。

Catalog 的 `sourceFile` / `sourceFiles` 声明资产拥有的源码 family，`installationFiles` 单独声明分发必需 import 闭包，`sourceVersion` 标记原始闭包内容的 SHA-256 修订。Audit 从消费方匹配的 vendored 入口出发，按 TypeScript AST 和模块解析递归检查实际 import/export 与字符串字面量动态 import，读取 paths/extends/references，支持 `.js` 到 `.ts` 的解析。它允许合法适配，不要求恢复已从源码移除的依赖，也不按上游闭包逐文件强制补齐。

消费方需声明 TypeScript；审计优先加载其编译器，本仓库开发环境可回退 CLI 可解析的编译器。两处均不可用时返回 error，不跳过 import 审计。这里的源码修订和依赖检查不证明消费源码与上游 API 等价。

组件、Block 与 Recipe 不得改变消费者的业务语义、API/IPC、路由、状态机或可访问行为。需要适配时由消费项目显式记录映射和偏差。

## Recipe

Recipe 是 Catalog 的 `kind: "recipe"`，用于组合 Theme Kit、Block、组件或页面 section。每个 Recipe 可以声明：

- `profiles` / `recommendedSystem`；
- `entryComponent`、`components`、`optionalComponents`；
- `sections`、`slots`、`states`、`responsive`、`assets`；
- `required` / `forbidden`。

`examples` 经 Catalog `related` 指向真实页面或多页源码，关系为 example，不宣称完整语义等价。所有 sections 必须引用真实分发变体。

Recipe 不承载业务数据、业务逻辑或完整页面源码。`agent-workbench` 是可 vendoring 的应用外壳契约；`saas-landing` 是 section composition contract。

## 项目级 artifacts

| 文件 | 当前职责 | 不是什么 |
|---|---|---|
| `ui-lab.config.json` | Profile、System、Recipe、组件与 `adopt\|replace` 装配意图 | 视觉规范或批准记录 |
| `ui-lab.lock.json` | Catalog contract hash 与 source-family provenance 的 **CatalogLock** | 安装收据、视觉验收或更高阶 lock |
| `DESIGN.md` | 消费项目自己维护的视觉真源 | Recipe 或机器审计结果 |
| `.ui-lab/adoption-report.md` | 消费项目自己维护的映射、偏差和验证记录 | 用户批准或 Catalog 真源 |

这些 artifacts 不可互相替代。

## CLI current bridge

调用前先运行 `ui-lab --help`；仓库源码版本可用 `bun cli/src/index.ts <command>`。

```text
init → compose → add → lock → audit
```

- `init`：校验 Profile 与 Theme Kit，创建 config 和 CatalogLock；
- `compose`：登记 Recipe 与必装组件，保留既有 Lock 基准，输出安装计划，不执行外部命令；
- `add`：打印安装命令；有 config 时去重登记 slug，仅追加新 Lock 项；
- `lock`：按当前 Catalog 重建 CatalogLock，不安装资产；
- `audit`：检查 config、Catalog/Recipe 引用、技术栈依赖声明、components.json、vendored 入口与实际传递内部依赖、source-family 警告和当前 Workbench token 规则。

`themes --picker`、`theme`、`search`、`show` 与 `list` 是发现接口。`list --kind component --role <role>` 用职责筛选安装资产，role 可选 `component` / `block` / `page` / `shell` / `site`；`--category` 筛选历史或领域 category，`vocabulary` / `reference` 只读。显式 registry 失败、结构或引用不合法时写入命令中止；只读查询允许注明来源后回退。当前不存在 Studio、Preset、order、checkout、confirmation 或 evidence 命令。

`skill/ui-lab/SKILL.md` 只有 `discover` 与 `install` 两条互斥路线：查询已有资产或输出/登记其 shadcn 安装命令，不自动执行安装。CLI 的 compose、Audit 等装配协议不因此成为新的 Skill 路线；Skill 不生成业务功能或创建/选择/发布流程。

## 消费项目根

`ui-lab.config.json`、`components.json` 和被审计的 `package.json` 必须位于实际 React frontend package 根。Monorepo 使用同一个 `--dir packages/desktop` 一类参数贯穿 `init`、`compose`、`add`、`lock` 与 `audit`，不要在无 React 依赖的 workspace root 建 config。

## Audit 范围

当前 Audit 硬检查：

- config/Catalog/Recipe 引用；
- Recipe/Profile 与必装组件登记；
- React 19、Tailwind CSS 4、TypeScript 和对应 `next|vite|electron` 依赖；
- 有效 `components.json`，至少提供非空 `aliases.components` / `aliases.utils`；
- 每个 config Component 的匹配 vendored 入口及 AST 解析出的实际传递内部依赖，缺失为 error；
- 使用 `agent-workbench` Recipe 或登记核心 Workbench 组件时，匹配核心文件的 `--wb-*` 引用，以及 CSS 中有效 `--wb-surface` 声明或所选主题 CSS import。

Recipe 必装项的 owned source-family 缺少 sidecar、CatalogLock 的选择/来源/契约/sourceFiles 漂移或无效 Lock 会产生 warning。普通 audit 只因 error 失败；`--strict` 要求 Lock 存在，并将 warning 也作为未通过条件。

Audit 读取 tsconfig 做解析，但不检查 strict 设置，不执行完整 typecheck/build，也不验证任意外部包导入、完整 API/源码等价、视觉 fidelity、所有业务状态、字体/资产加载、裸色、未门控 motion 或用户批准。Audit 通过只能说明当前确定性检查通过，不能替代消费者运行验收或线上核验。

工程验证分开执行：`bun run check:catalog` 是已纳入 `check` 的低成本 Catalog/安装契约/导航门禁；`bun run check:catalog-site` 检查实际 HTTP 和120个浏览器场景，须先停 dev、生产 build、start 服务后另开终端运行；`bun run benchmark:catalog-assets` 在真实 Next/Vite/Electron 独立消费者中验证安装、构建与运行，属于高成本门禁。站点检查和消费者验证不随 `check` 自动运行；构建或任一单项通过不构成总体验收通过。

## 示例

```bash
ui-lab themes --picker
ui-lab init --profile electron-renderer --system graphite --mode replace --dir packages/desktop
ui-lab compose agent-workbench --dir packages/desktop
ui-lab audit --strict --json --dir packages/desktop
```

命令只展示 current bridge。它们不生成创建器输出、订单、发布状态或批准记录。
