<h1 align="center">UI Lab · 组件实验室</h1>

<p align="center">
  A motion component reference for React & Next.js.
</p>

## 这是什么

**UI Lab（组件实验室）** 是一个中英双语的动效组件参考库，个人自用项目，中文优先。

这是从 [beUI](https://github.com/starc007/ui-components)（MIT 协议）fork 出来的二次整理版本，用来收集好看、值得参考的前端动效组件：

- 可视化浏览每个组件的实际动效
- 直接查看/复制组件源码，作为自己项目的参考
- 也方便 AI 编程助手（Claude、Codex 等）读取组件源码和用法作为上下文

不追求发布为公开产品或收费服务，只是一个持续生长的个人组件参考站。

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
