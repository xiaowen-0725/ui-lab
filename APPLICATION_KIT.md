# UI Lab Application Kit

UI Lab 正从「可视前端词汇表」升级为一套 **AI-first composable frontend system**：AI 不再每次重新发明技术栈、主题和页面骨架，而是从同一套连接标准中选择 System Kit、组件、区块与 Recipe，再填入业务内容。

词汇表仍是底层资产，Application Kit 是其上层装配协议。它服务于应用级 React 前端和落地页，同时保留人类按视觉样本选择、AI 按结构化契约执行的双重入口。

## 边界

UI Lab 负责：

- React 前端的推荐技术栈和框架适配边界。
- 主题、字体、排版、颜色、间距、圆角、阴影、动效与图表 token。
- 可 vendoring 的 Primitive、Component、Block 和可组合的 Recipe。
- 组件间的插槽、状态、响应式与可访问性契约。
- 消费项目的设计选择记录与自动一致性审计。

UI Lab 不负责：

- 业务领域模型、产品规则和最终的信息架构决策。
- 后端、数据库、鉴权、部署和原生桌面主进程方案。
- 为了套用现有组件而改变业务语义。
- 替代人工视觉验收或通用体验评审。

## 六层模型

| 层 | 职责 | 连接标准 |
|---|---|---|
| Stack Profile | 规定运行时、样式、图标、动效与框架边界 | `next-app`、`vite-app`、`electron-renderer` |
| System Kit | 提供整套视觉语言（按套件为单态或双态） | CSS variables、Tailwind CSS 4、shadcn 语义 token |
| Primitive / Component | 提供基础交互和有辨识度的组件 | shadcn-compatible registry、具名 React 导出 |
| Block | 组合多个组件形成产品区块 | 数据、状态、事件和 slots |
| Recipe | 组合 System、Block 与页面骨架 | required / forbidden、布局、状态与响应式契约 |
| Audit | 检查消费项目是否偏离选择 | `ui-lab.config.json` + 确定性规则 |

### 1. Stack Profile

Golden Path 是 React 19、TypeScript strict、Tailwind CSS 4、shadcn-compatible registry、Lucide 图标与 CSS variables 驱动主题。Motion 只在交互确实需要时进入，并默认支持 reduced motion。

Profile 不强迫所有项目使用 Next.js：

- `next-app`：负责 App Router、SSR 边界、`next/font` 和全局样式入口。
- `vite-app`：负责纯客户端入口、路由选择和本地 `@font-face`。
- `electron-renderer`：保持渲染层为纯 React，字体和资源本地化，不把 Node 或主进程能力带进 UI 组件。

框架差异由 adapter 吸收；Component、Block 和 System Kit 尽量保持纯 React + Tailwind。

### 2. System Kit

System Kit 是一次性选择的完整设计系统，而不是零散颜色：

- shadcn 语义颜色及 light / dark 主题。
- 字体栈、字号、字重、行高和等宽字体。
- 间距、圆角、描边、阴影、背景质感与图表颜色。
- 动效 easing、duration 和 reduced-motion 降级。
- 特殊组件族所需的扩展 token，例如 Graphite 的 `--wb-*`。

先选择和安装 System Kit，再添加组件。换品牌时覆盖 token 值，不在组件内部逐处改成近似样式。

shadcn 项目执行 `ui-lab theme <slug>` 返回的 registry 命令；非 shadcn 项目使用同一 Theme Kit 的 CSS endpoint，并放在全局样式的 `@import "tailwindcss"` 之后。

### 3. Primitive / Component

Primitive 优先使用 shadcn/ui 补齐无差异的基础能力；UI Lab 维护具有视觉或交互辨识度的 Component。两者共享 shadcn 语义 token 和 Tailwind CSS 4。

Registry 安装是 source vendoring，不是运行时依赖。消费项目可以修改源码，但应保留组件依赖的语义 token、可访问性和动效降级契约。

### 4. Block

Block 是可直接放进产品的复合区块，例如 Sidebar、Composer、Hero、Pricing 或 Settings。Block 不内置业务模型，只通过以下接口连接业务：

- `data`：渲染所需数据。
- `state`：loading、empty、error、disabled、selected 等显式状态。
- `events`：提交、选择、关闭和重试等业务回调。
- `slots`：允许替换内容、操作区或局部 Primitive，不复制整个 Block。

Block 必须声明桌面和窄屏行为，不能把响应式留给消费方猜测。

### 5. Recipe

Recipe 是应用外壳或页面结构的机器可读组合契约，Catalog 中使用 `kind: "recipe"`。不同 Recipe 的交付粒度可以不同：有的引用可 vendoring 的完整 Block，有的只规定应如何组合现有 section。

- `profiles` 与 `recommendedSystem`：兼容的 Stack Profile 和推荐 System Kit。
- `entryComponent` 与 `components`：可用作完整入口或主要视觉锚点的 Block，以及必须安装的组件。
- `optionalComponents`：按业务需要选择的可选组件。
- `sections`：页面型 Recipe 的 section slug、variant、顺序与是否必需。
- `slots`：允许填入或替换的页面区域。
- `states`：必须实现的 loading、empty、error 和关键交互状态。
- `responsive`：桌面、窄屏和折叠规则。
- `assets`：字体、图标、图片或插画要求。
- `required` 与 `forbidden`：不可破坏的约束和禁止项。

首批 Recipe：

- `agent-workbench`：引用可 vendoring 的完整工作台外壳，组合会话栏、线程、输入台和产物区。
- `saas-landing`：section composition contract，按 `sections` 组合导航、Hero、社会证明、功能、CTA 与页脚；Pricing 是可选 section。它当前不是一份可直接 vendoring 的完整页面 shell，完整 shell 属于后续资产。

Recipe 是组合契约，不是业务模板。AI 应按 `sections` 和 slots 填入业务内容，而不是把缺少完整 shell 的 Recipe 误称为已有页面源码。

### 6. Audit

阶段一的 `ui-lab audit` 是一个确定性的接入门禁。当前硬检查范围只有：

- `ui-lab.config.json` 可解析，字段和枚举合法。
- 配置中的 System Kit、Component 和 Recipe 在 Catalog 中存在。
- Recipe 支持所选 Profile，且它的 `components` 已登记到项目配置。
- `package.json` 声明 React 19、Tailwind CSS 4 和 TypeScript，并按 Profile 声明 `next`、`vite` 或 `electron`。
- `components.json` 是有效 JSON，且至少声明非空的 `aliases.components` 和 `aliases.utils`。
- `ui-lab.config.json` 中每个 Component 都能按 Catalog 的 `sourceFile` 提示在前端源码树中找到对应 vendored source。
- 检测到 Agent Workbench 家族时，每个核心文件都保留 `--wb-*` 引用；项目还必须有有效的 `--wb-surface` CSS 声明，或导入所选 Theme Kit 的 CSS。缺失均为 error。

后续可扩展的 detector 才会检查严格 TypeScript 配置、Recipe 的字体/资产要求、裸颜色、越级圆角或阴影、未门控 motion 等实现偏离。阶段一不会检查 strict `tsconfig`（继承配置容易误报），也不会自动判断 `sections`、`slots`、`states`、`responsive`、`assets`、`required` 或 `forbidden` 是否在最终界面中得到满足。

因此，Audit 通过只表示“基础绑定与可确定的 Golden Path 契约没有报错”，不表示设计忠实度或视觉质量已经通过。Agent 仍需按 Recipe 的机器字段检查多视口、明暗态、状态、资产和交互。

## 消费项目契约

实际 React 前端 package 根目录使用 `ui-lab.config.json` 保存设计决策。这个目录同时应包含该前端的 `package.json` 和 `components.json`；它不一定是 Git 仓库或 monorepo 根目录。不要在没有 React 依赖的 workspace root 创建配置，monorepo 应通过 `--dir packages/desktop` 一类参数始终指向真实消费包。

```json
{
  "schemaVersion": 1,
  "profile": "electron-renderer",
  "system": "graphite",
  "recipe": "agent-workbench",
  "components": [
    "agent-workbench",
    "thread-list",
    "agent-thread",
    "agent-composer",
    "artifact-panel"
  ],
  "mode": "adopt"
}
```

字段固定为：

- `schemaVersion`: 当前为 `1`。
- `profile`: `next-app`、`vite-app` 或 `electron-renderer`。
- `system`: System Kit slug。
- `recipe`: 可选的 Recipe slug。
- `components`: 已选择或计划采用的组件和 Block slug；源码尚未 vendoring 时 Audit 会报错。
- `mode`: `adopt` 或 `replace`。

`adopt` 用于已有产品：先尊重现有技术栈和视觉事实，只补齐兼容资产。`replace` 用于新项目或明确重做：允许应用完整 System Kit 和 Recipe。没有用户授权时，不得把 `adopt` 升级为 `replace`。

## 少数深接口

```bash
ui-lab init --profile <profile> --system <slug> --mode <adopt|replace> --dir <frontend-package>
ui-lab compose <recipe> --dir <frontend-package>
ui-lab add <component-or-block> --dir <frontend-package>
ui-lab audit --dir <frontend-package>
```

- `init` 校验并绑定 Stack Profile 与 System Kit，生成配置；它不重写现有应用。
- `compose` 始终要求配置中的 System Kit 存在于 Catalog，并把 Recipe 与必装组件清单写回配置。`adopt` 计划要求先 review/compare，只安装缺失项且不得覆盖现有 vendored 源码；`replace` 计划才执行完整 Theme Kit 与组件安装。
- `add` 始终只打印 vendoring 命令、不执行安装。目标目录已有 `ui-lab.config.json` 时，它把 slug 去重登记到 `components`；没有配置时只打印命令。`--dir` 决定读取和更新哪个前端 package。
- `audit` 在交付前执行阶段一的基础绑定与 Golden Path 硬检查；视觉契约仍需人工/Agent 验证。

`themes --picker`、`theme`、`search`、`show` 和 `list` 继续作为视觉选择与专家发现接口，但不要求 Agent 用十几个底层命令手工拼装常见页面。

`init`、`compose`、`audit` 以及 config-aware `add` 当前仍在 `[Unreleased]`，不能假定已安装的 npm CLI 包含它们。先运行 `ui-lab --help`；若命令尚不可用，在 UI Lab 仓库内使用 `bun cli/src/index.ts <command>`，或等待包含这些命令的新版本发布。

实时 Catalog 的 `--registry` / `UILAB_REGISTRY` 值必须是部署 base URL，例如 `https://ui-lab-ten.vercel.app`，不要包含 `/catalog.json`；CLI 会自行追加该路径。

## 工作流示例

### 新建 Electron Agent 应用

```bash
ui-lab themes --picker
ui-lab init --profile electron-renderer --system graphite --mode replace --dir packages/desktop
ui-lab compose agent-workbench --dir packages/desktop
# 执行 compose 输出的 Theme Kit 与组件安装计划
ui-lab audit --dir packages/desktop
```

之后只填入会话、任务和产物数据；需要新增能力时先 `ui-lab add <slug> --dir packages/desktop`，保留 Graphite 的 `--wb-*` 引用。

### 改造现有 Next.js SaaS 落地页

```bash
ui-lab init --profile next-app --system minimal-light --mode adopt --dir apps/web
ui-lab compose saas-landing --dir apps/web
# review/compare 现有源码，只安装缺失项，不覆盖已 vendoring 的组件
ui-lab audit --dir apps/web
```

先读取现有品牌、字体和 DOM / E2E 契约，再按 `sections` 组合页面；Pricing 为可选项。这里得到的是 section composition contract，不是现成页面 shell。只替换 Recipe 的内容 slots 和允许替换项；审计通过后，再进行桌面、移动端和明暗态目检。
