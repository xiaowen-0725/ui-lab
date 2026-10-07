<h1 align="center">UI Lab · 组件实验室</h1>

> 产品北极星、目标契约与 current bridge 见 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md)。

<p align="center">
  An AI-first composable frontend system — built on a visible vocabulary of components, blocks and design systems.
</p>

## 这是什么

**UI Lab（组件实验室）** 是一套中文优先、中英双语的 **AI-first 可组合前端系统**。它以可视 Catalog 与 machine-readable contracts 为核心，让人和 AI 基于同一套组件、区块、设计系统与 Recipe 装配 React 应用与落地页。

当前实现包括可视 Catalog、Theme Kit、Recipe、registry、config/CatalogLock 与 Audit。此前的 Studio、System Preset、Order Manifest 和候选视觉验收实验已移除；新的创建、选择与下单工作流尚未定义。

它收集一切"只能看、说不出"的前端事物——动效组件、复合区块、设计风格——做成活样本：让人肉眼感受，让 AI 拿到准确的话。每个条目遵循同一个公式：**活样本 + 名字（中英 + 别名）+「对 AI 这样说」prompt + 配方**。

- **组件 / 区块**：浏览真实样本，查看/复制源码（shadcn registry 分发），并提供可复制用法供人和 AI 编程助手使用。职责由 `assetRole` 声明，历史 `motion` / `blocks` 路径保留兼容
- **页面 / 整站**：本轮新增24个可安装资产，包括19个区段变体、4个完整页面（SaaS 落地页、工作台会话/制品/设置页）和1个 Agent 多页组合。多页组合引用同一份独立页面和共享 Workbench；用法直接导入实际安装入口，不依赖站点 provider
- **风格**（`/styles`）：29 种设计风格的换皮对比器——同一份页面套不同风格，认出你想要的，复制那段能直接粘给 AI 建站工具的描述
- **Application Kit**：当前以 Stack Profile、Theme Kit、Recipe、`ui-lab.config.json`、CatalogLock 与 Audit 约束装配。架构边界见 [APPLICATION_KIT.md](APPLICATION_KIT.md)

创建器、视觉选择面与更高阶交付协议待重新定义后再实现，当前文档和命令不预设其产品形态。

本文的新增能力以当前仓库源码为准，不表示 npm CLI 或线上站点已经更新。已安装的 npm CLI 请先用 `ui-lab --help` 确认可用；在本仓库可用 `bun cli/src/index.ts --help` 查看源码版本。

Catalog 的 `kind: component` 表示可安装源码，`assetRole` 区分组件、区块、页面、共享外壳和多页组合；`vocabulary` 与 `reference` 只提供知识和来源。`$ui-lab` Skill 仅有 `discover` / `install` 两条路线，查询已有资产或输出/登记安装命令，不自动执行安装，也不生成业务或创建工作流。

`ui-lab audit` 从 vendored 入口用 TypeScript AST 和模块解析检查实际内部依赖的传递闭包，读取 paths/extends/references；缺依赖为 error，Recipe source-family 缺项和 Lock 漂移为 warning，`--strict` 也拒绝 warning。它不执行完整 typecheck/build，不证明源码/API 等价、视觉一致或目标运行时可用。消费者验收与线上发布进度以[验收台账](plans/005-acceptance-tracker.md)为准。

前端部分从 [beUI](https://github.com/starc007/ui-components)（MIT 协议）fork 而来二次整理。不追求发布为公开产品或收费服务，只是一个持续生长的个人视觉参考站。

## 本地运行

```bash
export PATH="$HOME/.bun/bin:$PATH"
bun install
bun run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 自检

```bash
bun run typecheck
bun run lint
bun run check:registry
bun run check:catalog # 低成本 Catalog 覆盖、安装契约和导航回归
```

或者一次性跑完（TypeScript + Biome lint + registry 校验 + Catalog 回归 + Skill 门禁）：

```bash
bun run check
```

两个高成本门禁需单独执行：

- `bun run check:catalog-site`：先停 dev → `bun run build` → `bun run start`，保持生产服务运行，在另一终端检查实际 HTTP、120个浏览器场景及台账历史锚点。默认检查 localhost:3000，可通过 `UILAB_SITE_BASE` 指定目标。
- `bun run benchmark:catalog-assets`：创建真实 Next/Vite/Electron 独立消费者，执行安装、构建和运行验证；会安装依赖并保存证据，不需要根仓生产构建。

生产构建完成不表示消费者或站点复测完成，也不表示总体验收通过；结果仍在验收台账分别记录。

## 目录结构

- 可分发控件与现有原语：`components/motion/`、`components/agents/`；历史路径保持兼容，分类以 `assetRole` 为准
- 可分发区段：`components/sections/`；完整页面：`components/pages/`；引用独立页面的多页组合：`components/site-shells/`
- 站点功能：`components/app/`；活预览：`components/previews/`；无站点 provider 的复制用法：`components/examples/`
- 安装登记与源码图：`lib/registry.ts`、`lib/registry-server.ts`；页面和整站真源：`lib/pages.ts`、`lib/sites.ts`
- 领域真源：concepts / motions / sections / patterns / scroll / atoms / styles / palettes / theme-kits / inspiration 各自保留；`lib/catalog.ts` 聚合薄机器投影
- 中英路由：`app/[locale]/`，中文使用裸路径、英文使用 `/en/*`；英文机器端点：`app/` 根（`/catalog.json`、`/r/*`、`/llms*.txt`、`/themes/<slug>.css` 等），不加 locale 前缀；独立 CLI 与冻结数据：`cli/`；Agent 入口：`skill/ui-lab/`
- 实施与验收：[计划 005](plans/005-catalog-realignment-implementation-and-acceptance.md)、[验收台账](plans/005-acceptance-tracker.md)、[迁移台账](plans/005-asset-migration-inventory.csv)

新增源码能力以本仓库 CLI 为准：`bun cli/src/index.ts --help`。本地工程通过不表示 npm/Vercel 已更新，实际消费者证据和未覆盖项在验收台账分别记录。

## 致谢

本项目基于 [starc007/ui-components（beUI）](https://github.com/starc007/ui-components) fork 而来，遵循其 MIT 协议。感谢原作者 Saurabh Chauhan 开源的这套组件库，本仓库在此基础上做了品牌与内容上的个人化整理。

部分 Agent 界面原语移植自 [Vercel AI Elements](https://github.com/vercel/ai-elements)，遵循 Apache-2.0。版权归 Vercel, Inc.；许可证全文见 [`licenses/AI-ELEMENTS-APACHE-2.0.txt`](licenses/AI-ELEMENTS-APACHE-2.0.txt)，归属说明见 [`NOTICE`](NOTICE)。移植文件顶部标有来源与许可。
