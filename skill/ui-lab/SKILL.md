---
name: ui-lab
description: "UI Lab 组件查询与安装入口。用于查找仓库已有组件/区块，并给出 shadcn registry 安装命令。Use when the user wants to search, list, inspect, or install existing UI Lab components via the shadcn-compatible registry (`ui-lab search/list/show/add`, `npx shadcn@latest add ...`). Do NOT use for creator/visual-selection/order workflows, admin template scaffolding, or business feature implementation."
---

# UI Lab

本 skill 只做两件事：

1. **查询** UI Lab 已有组件 / 区块  
2. **安装** 已有组件（通过 shadcn-compatible registry）

不做：

范畴边界见 [scope-boundary.md](references/scope-boundary.md)。


- 创建器、视觉选择或下单/发布工作流
- 通用中后台模板装配（转 `$uilab-admin`）
- 风格皮肤沉淀（转 `$design-ingest`）
- 业务逻辑实现

每轮只进入一个互斥路线。

## 先路由

| 用户意图 | 路线 | 是否改生产代码 | 行动前读取 |
|---|---|---:|---|
| 搜索/列出/查看组件、区块、安装方式 | `discover` | 否 | [discover.md](references/discover.md) |
| 安装某个已有组件到项目 | `install` | 有限（仅打印/登记安装命令，不自动改业务代码） | [install.md](references/install.md) |

不确定时先 `discover`。

## 共同约束

1. 先确认可用命令：`ui-lab --help`（或本仓库 `bun cli/src/index.ts --help`）
2. 只围绕 **已有 Catalog/registry 资产** 工作，不发明不存在的组件
3. 安装走 **shadcn registry**，不把 UI Lab 当运行时依赖 `import from "ui-lab"`
4. `ui-lab add` 默认**只打印**安装命令，不替用户静默执行（除非用户明确要求执行）
5. 目标项目应有可用的 `components.json` / shadcn 工作流；没有就先说明前置条件
6. 中文优先回复；命令、slug、路径保持英文标识

## 完成边界

### `discover`
- 给出候选 `kind/slug`
- 说明用途、中英文名/描述（如有）
- 给出 install / fetch 命令或 URL
- 不修改消费者项目

### `install`
- 确认 slug 存在且为可安装 component
- 输出对应 package manager 的 shadcn 安装命令
- 如项目有 `ui-lab.config.json`，`ui-lab add` 可登记 component slug（仍不自动执行 shadcn）
- 提醒用户自行运行命令并检查结果

## 常用命令

```bash
ui-lab search "<关键词>" --json
ui-lab list --kind component --json
ui-lab show <slug> --json
ui-lab add <slug> --pm pnpm
```

本地仓库开发时：

```bash
bun cli/src/index.ts search button --json
bun cli/src/index.ts add button-base --pm pnpm
```

线上 registry（示例）：

```bash
npx shadcn@latest add https://ui-lab-ten.vercel.app/r/<slug>
```

具体 URL / namespace 以 `ui-lab show <slug>` 或站点安装说明为准。
