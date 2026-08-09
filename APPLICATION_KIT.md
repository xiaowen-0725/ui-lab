# UI Lab Application Kit

> 产品边界以 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md) 为唯一真源。本文只描述当前可用的装配协议，不定义未来创建器、选择面或下单生命周期。

UI Lab Application Kit 位于可视词汇表之上：它用 Stack Profile、Theme Kit、registry 资产、Recipe、config、CatalogLock 与 Audit 约束 React 前端装配。

此前的 Studio、System Preset、Order Manifest、candidate evidence 与 checkout/confirmation 实验已移除。它们不是 current bridge，也没有兼容承诺。

## 当前边界

UI Lab 负责：

- React 前端的推荐技术栈和框架适配边界；
- 主题、字体、排版、颜色、间距、圆角、阴影、动效与图表 token；
- 可 vendoring 的 Primitive、Component、Block 和完整 source family；
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

## Theme Kit

Theme Kit 是 System 层的可运行 token 载荷，包含 shadcn 语义色、`--wb-*` 工作台 token、图表色、字体栈和必要的静态值。

Theme Kit 可以通过 registry theme item、CSS endpoint 或 `ui-lab theme <slug>` 获取。它只负责视觉 token，不能被称为完整应用系统、业务模板或用户批准结果。

## Asset 与 source family

组件和区块通过 shadcn-compatible registry 复制源码分发。Catalog 的 `sourceFile` / `sourceFiles` 声明消费 Audit 所需的完整 family；内部 sidecar、样式、hook 和公共 API 不得漏装。

组件、Block 与 Recipe 不得改变消费者的业务语义、API/IPC、路由、状态机或可访问行为。需要适配时由消费项目显式记录映射和偏差。

## Recipe

Recipe 是 Catalog 的 `kind: "recipe"`，用于组合 Theme Kit、Block、组件或页面 section。每个 Recipe 可以声明：

- `profiles` / `recommendedSystem`；
- `entryComponent`、`components`、`optionalComponents`；
- `sections`、`slots`、`states`、`responsive`、`assets`；
- `required` / `forbidden`。

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
- `compose`：登记 Recipe 与必装组件，输出安装计划，不执行外部命令；
- `add`：打印组件安装命令；有 config 时去重登记 slug；
- `lock`：按当前 Catalog 重建 CatalogLock，不安装资产；
- `audit`：检查 config、Catalog/Recipe 引用、运行时依赖、components.json、source family 和当前 Workbench token 规则。

`themes --picker`、`theme`、`search`、`show` 与 `list` 是发现接口。当前不存在 Studio、Preset、order、checkout、confirmation 或 evidence 命令。

## 消费项目根

`ui-lab.config.json`、`components.json` 和被审计的 `package.json` 必须位于实际 React frontend package 根。Monorepo 使用同一个 `--dir packages/desktop` 一类参数贯穿 `init`、`compose`、`add`、`lock` 与 `audit`，不要在无 React 依赖的 workspace root 建 config。

## Audit 范围

当前 Audit 硬检查：

- config/Catalog/Recipe 引用；
- Recipe/Profile 与必装组件登记；
- React 19、Tailwind CSS 4、TypeScript 和对应 `next|vite|electron` 依赖；
- 有效 `components.json` aliases；
- config Component 的 vendored source family；
- Agent Workbench 核心文件的 `--wb-*` 引用和有效主题来源。

Audit 不验证完整视觉 fidelity、所有业务状态、字体/资产加载、裸色、未门控 motion 或用户批准。Audit 通过只能说明当前确定性检查通过。

## 示例

```bash
ui-lab themes --picker
ui-lab init --profile electron-renderer --system graphite --mode replace --dir packages/desktop
ui-lab compose agent-workbench --dir packages/desktop
ui-lab audit --strict --json --dir packages/desktop
```

命令只展示 current bridge。它们不生成创建器输出、订单、发布状态或批准记录。
