# Route: install

把 **已有** UI Lab 组件安装到消费者项目。

## 做什么

- 校验 slug 存在且可安装
- 输出 shadcn registry 安装命令
- 可选：在存在 `ui-lab.config.json` 时登记 component slug

## 不做什么

- 不发明新组件
- 不自动大改业务页面
- 不把 UI Lab 加为 runtime dependency
- 不处理 admin 模板页面 scaffold（转 `$uilab-admin`）

## 步骤

1. 先 `discover` 或直接 `ui-lab show <slug> --json` 确认资产
2. 确认目标目录（真正的前端 package 根，含 `package.json` / 通常还有 `components.json`）
3. 打印安装命令：

```bash
ui-lab add <slug> --pm pnpm --dir <frontend-root>
```

该命令会：

- 校验 item 为 component
- 若存在 `ui-lab.config.json`，把 slug 登记进 config
- **打印** shadcn 安装命令（默认不自动执行）

4. 把打印出的命令交给用户执行，或在用户明确授权后代为执行
5. 执行后建议检查：
   - 组件文件是否落到 `components` 目录
   - import 路径 / alias 是否可用
   - 是否需要补 peer 依赖

## 命令改写

`ui-lab add --pm` 会改写安装命令前缀：

| pm | 示例前缀 |
|---|---|
| npm / 默认 | `npx shadcn@latest ...` |
| pnpm | `pnpm dlx shadcn@latest ...` |
| yarn | `yarn dlx shadcn@latest ...` |
| bun | `bunx --bun shadcn@latest ...` |

## 输出模板

```md
## Install

- slug:
- kind:
- target dir:
- command:
- executed: no/yes
- notes:
```

## 失败时

- slug 不存在：回到 `discover` 给相近候选
- 不是 component：说明应 `ui-lab show` 看 prompt/tokens，不能 `add`
- 缺少 shadcn / components.json：先说明初始化前置条件，不硬装
