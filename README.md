<h1 align="center">UI Lab · 组件实验室</h1>

<p align="center">
  A visual vocabulary for the web — motion components, blocks and design styles.
</p>

## 这是什么

**UI Lab（组件实验室）** 是一本中英双语的**前端视觉词汇表**，个人自用项目，中文优先。

它收集一切"只能看、说不出"的前端事物——动效组件、复合区块、设计风格——做成活样本：让人肉眼感受，让 AI 拿到准确的话。每个条目遵循同一个公式：**活样本 + 名字（中英 + 别名）+「对 AI 这样说」prompt + 配方**。

- **组件 / 区块**：可视化浏览实际动效，直接查看/复制源码（shadcn registry 分发），也方便 AI 编程助手（Claude、Codex 等）读取用法作为上下文
- **风格**（`/styles`）：29 种设计风格的换皮对比器——同一份页面套不同风格，认出你想要的，复制那段能直接粘给 AI 建站工具的描述

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
