<h1 align="center">UI Lab · 组件实验室</h1>

> 产品北极星、目标契约与 current bridge 见 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md)。

<p align="center">
  An AI-first composable frontend system — built on a visible vocabulary of components, blocks and design systems.
</p>

## 这是什么

**UI Lab（组件实验室）** 是一套中文优先、中英双语的 **AI-first 可组合前端系统**。目标以 Catalog 与 machine-readable contracts 为核心，让人选择精确、版本化的 Design System Package，让 AI 在批准的 Package、Order 与兼容关系内装配 React 应用与落地页，而不是临场设计。

当前实现仍以可视 Catalog、Theme Kit、System Preset、Recipe、registry、config/CatalogLock、Audit 和 Studio candidate pipeline 为主；尚未提供完整 production-ready Package schema、OrderLock/EvidenceBundle 流程或全部 dedicated capabilities。

它收集一切"只能看、说不出"的前端事物——动效组件、复合区块、设计风格——做成活样本：让人肉眼感受，让 AI 拿到准确的话。每个条目遵循同一个公式：**活样本 + 名字（中英 + 别名）+「对 AI 这样说」prompt + 配方**。

- **组件 / 区块**：可视化浏览实际动效，直接查看/复制源码（shadcn registry 分发），也方便 AI 编程助手（Claude、Codex 等）读取用法作为上下文
- **风格**（`/styles`）：29 种设计风格的换皮对比器——同一份页面套不同风格，认出你想要的，复制那段能直接粘给 AI 建站工具的描述
- **Application Kit**：目标以 Package→Order→OrderLock→EvidenceBundle 固定应用级契约；当前以 Stack Profile、System Kit/System Preset、Recipe、`ui-lab.config.json`、CatalogLock 与 Audit 作为桥接。架构边界见 [APPLICATION_KIT.md](APPLICATION_KIT.md)

Codex 只可能是可选 Package/reference，不是 UI Lab 要复刻的产品目标；Parking Agent 只作为 Existing Adoption benchmark fixture，不定义全局设计标准。

Application Kit 的 `init` / `compose` / `audit` 和 config-aware `add` 当前仍在 `[Unreleased]`，尚未 bump/publish。已安装的 npm CLI 请先用 `ui-lab --help` 确认可用；在本仓库可先用 `bun cli/src/index.ts --help` 运行源码版本。

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
bun run check:registry
```

或者一次性跑完（TypeScript + Biome lint + registry 校验）：

```bash
bun run check
```

## 目录结构

- 组件源码：`components/motion/`、`components/app/`
- 组件预览：`components/previews/`
- 组件登记表：`lib/registry.ts`

## 致谢

本项目基于 [starc007/ui-components（beUI）](https://github.com/starc007/ui-components) fork 而来，遵循其 MIT 协议。感谢原作者 Saurabh Chauhan 开源的这套组件库，本仓库在此基础上做了品牌与内容上的个人化整理。
