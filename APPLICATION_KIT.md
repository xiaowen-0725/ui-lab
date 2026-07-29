# UI Lab Application Kit

> 产品北极星、目标六层、Design System Package 与 Package→Order→Lock→Evidence 契约以 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md) 为唯一真源。本文描述 Application Kit 的目标映射和当前实现桥接；未实现 schema/CLI 必须保持 planned。

UI Lab 正从「可视前端词汇表」升级为一套 **AI-first composable frontend system**：目标由人从 Catalog 选择精确、版本化的 Design System Package/fixture，由 AI 按 OrderLock、Compatibility Graph 与分层契约装配；当前 System Kit、System Preset、组件、区块与 Recipe 是过渡资产。

词汇表仍是底层资产，Application Kit 是其上层装配协议。Studio 负责必须看见的选择，chat 负责编排，CLI/Agent 执行当前真实暴露的结构化契约。

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

## 顶层装配边界：Package、Order、Lock、Evidence

目标对象是 Catalog 中精确、版本化并带 maturity 的 **Design System Package**。正式装配链固定为：

```text
Package@version → OrderDraft → selection approval → OrderLock
  → implementation → EvidenceBundle → acceptance / release
```

- **Package@version**：冻结适用六层契约、fixture、source family、provenance、compatibility 与 declared tolerance；只有 `production-ready` 可直接进入正式项目。
- **OrderDraft**：Studio/chat 中可变的 Package/fixture、Recipe、capability、兼容换件和 override 选择。
- **selection approval**：用户批准“选什么”，允许生成不可变解析快照；不等于批准最终实现。
- **OrderLock**：固定解析结果和 canonical hash，可重放但不代表通过。
- **EvidenceBundle**：绑定实现与 OrderLock，独立记录 Static、Runtime、Visual、Human；通过后才可 acceptance / release。

当前代码仍以 Theme Kit、System Preset、config、`ui-lab.lock.json`、Order Manifest 实验与 Studio candidate pipeline 为主。System Preset 是 **package-like predecessor**，不是已版本化的 `production-ready` Package；`ui-lab.lock.json` 是 **CatalogLock**，不是 OrderLock。当前公开 CLI 尚未完整实现 Package/OrderLock/EvidenceBundle 新链，必须以 `ui-lab --help` 为准，不能把目标命令写成已可用。

历史 `codex-desktop-v1` / Parking 工作只是一组 package/reference 与 Existing Adoption readiness case。Codex 可作为 optional Package/reference，不是产品目标；Parking 只作为 benchmark fixture，不定义通用架构。

### 当前 System Preset bridge

Catalog 当前已有 `kind: "system-preset"`。每个 Preset 以稳定序列化载荷计算 canonical contract hash；resolver 以 `preset + recipe + capability + safeOverrides` 解析确定性 assets/components。`lockedVisual`、reference fixture、白名单与 hash 是未来 Package 的可迁移基础，但当前缺少正式 Package version、maturity、完整 adapter/compatibility 与 release evidence。

当前 Preset 不得分发第三方产品资产或暗示官方授权。它只能引用 UI Lab 可合法分发的 token、组件和明确边界内的参考说明。

## 目标六层与当前资产

| 目标层 | 职责 | 当前主要映射 |
|---|---|---|
| Design Intent | 参考、视觉事实、场景、required / forbidden | Catalog prompt、DESIGN.md、reference fixture |
| System | 全局字体、图标、token、geometry、density、motion、platform | Stack Profile、Theme Kit、System Preset 部分字段 |
| Asset | Primitive、Component、Block、字体/图标及 source family | shadcn registry、`components/motion/` |
| Composition | 语义组件、slot/state/responsive 与页面组合 | Recipe、Block 接口 |
| Implementation | target runtime、adapter、vendoring 与业务连接 | init/compose plan、消费项目源码 |
| Verification | Static、Runtime、Visual、Human evidence | Audit、测试、capture、用户批准 |

以下章节记录当前可用资产与接口，它们是目标六层的桥接，不是另一套产品定义。

### 当前 Stack Profile

Golden Path 是 React 19、TypeScript strict、Tailwind CSS 4、shadcn-compatible registry、Lucide 图标与 CSS variables 驱动主题。Motion 只在交互确实需要时进入，并默认支持 reduced motion。

Profile 不强迫所有项目使用 Next.js：

- `next-app`：负责 App Router、SSR 边界、`next/font` 和全局样式入口。
- `vite-app`：负责纯客户端入口、路由选择和本地 `@font-face`。
- `electron-renderer`：保持渲染层为纯 React，字体和资源本地化，不把 Node 或主进程能力带进 UI 组件。

框架差异由 adapter 吸收；Component、Block 和 System Kit 尽量保持纯 React + Tailwind。

### 当前 System Kit

Current System Kit 是一组应整体选择的运行中视觉/token 资产，而不是零散颜色；在目标模型里它只覆盖 System 层的一部分，不能单独称为完整 Design System Package：

- shadcn 语义颜色及 light / dark 主题。
- 字体栈、字号、字重、行高和等宽字体。
- 间距、圆角、描边、阴影、背景质感与图表颜色。
- 动效 easing、duration 和 reduced-motion 降级。
- 特殊组件族所需的扩展 token，例如 Graphite 的 `--wb-*`。

当前低层流程先选择和安装 System Kit，再添加组件。换品牌时覆盖 token 值，不在组件内部逐处改成近似样式；正式项目的目标流程仍必须从 production-ready Package@version、fixture 和 adapter 出发。

shadcn 项目执行 `ui-lab theme <slug>` 返回的 registry 命令；非 shadcn 项目使用同一 Theme Kit 的 CSS endpoint，并放在全局样式的 `@import "tailwindcss"` 之后。

### 当前 Primitive / Component

Primitive 优先使用 shadcn/ui 补齐无差异的基础能力；UI Lab 维护具有视觉或交互辨识度的 Component。两者共享 shadcn 语义 token 和 Tailwind CSS 4。

Registry 安装是 source vendoring，不是运行时依赖。消费项目可以修改源码，但应保留组件依赖的语义 token、可访问性和动效降级契约。

### 当前 Block

Block 是可直接放进产品的复合区块，例如 Sidebar、Composer、Hero、Pricing 或 Settings。Block 不内置业务模型，只通过以下接口连接业务：

- `data`：渲染所需数据。
- `state`：loading、empty、error、disabled、selected 等显式状态。
- `events`：提交、选择、关闭和重试等业务回调。
- `slots`：允许替换内容、操作区或局部 Primitive，不复制整个 Block。

Block 必须声明桌面和窄屏行为，不能把响应式留给消费方猜测。

### 当前 Recipe

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

### 当前 Audit

`ui-lab audit` 是确定性的接入门禁。当前检查范围包括：

- `ui-lab.config.json` 可解析，字段和枚举合法。
- 配置中的 System Kit、Component 和 Recipe 在 Catalog 中存在。
- `ui-lab.lock.json` 可解析，Catalog 来源、选择项、行为契约哈希与组件 `sourceFiles` 没有相对当前配置和 Catalog 过期。
- Recipe 支持所选 Profile，且它的 `components` 已登记到项目配置。
- `package.json` 声明 React 19、Tailwind CSS 4 和 TypeScript，并按 Profile 声明 `next`、`vite` 或 `electron`。
- `components.json` 是有效 JSON，且至少声明非空的 `aliases.components` 和 `aliases.utils`。
- `ui-lab.config.json` 中每个 Component 都能按 Catalog 的来源提示在前端源码树中找到对应 vendored source；Recipe 必装组件缺少 source family sidecar 时报告 warning。
- 检测到 Agent Workbench 家族时，每个核心文件都保留 `--wb-*` 引用；项目还必须有有效的 `--wb-surface` CSS 声明，或导入所选 Theme Kit 的 CSS。缺失均为 error。

普通模式下，error 使进程退出码为 `1`；只有 warning 时退出码为 `0`，人类可读输出必须明确显示 `Audit passed with warnings`。交付与 CI 使用：

```bash
ui-lab audit --strict --json --dir <frontend-package>
```

`--strict` 要求项目存在 lock，并把任意 warning 也视为失败、返回退出码 `1`。CLI 会拒绝未知 flag 和不适用于当前命令的 flag，而不是静默忽略。若已安装的 npm CLI 尚未在 `ui-lab --help` 中列出 `--strict`，应报告版本不匹配并使用仓库内源码 CLI，不能用普通 Audit 冒充交付门禁。

确定性 Audit 不检查 strict `tsconfig`（继承配置容易误报），也不会自动判断字体/资产、裸颜色、越级圆角或阴影、未门控 motion，以及 `sections`、`slots`、`states`、`responsive`、`assets`、`required`、`forbidden` 是否在最终界面中得到满足。即便 strict Audit 为 `0` errors / `0` warnings，也只证明本次 CLI 报告的确定性契约成立，不证明本地源码与 Catalog 字节等同，更不表示视觉或业务验收通过。

## 消费项目契约

实际 React 前端 package 根目录当前承载四份职责不同的项目证据。这个目录同时应包含该前端的 `package.json` 和 `components.json`；它不一定是 Git 仓库或 monorepo 根目录。不要在没有 React 依赖的 workspace root 创建配置，monorepo 应通过 `--dir packages/desktop` 一类参数始终指向真实消费包。

这些是 current bridge，不是目标 Order 链。尤其 `ui-lab.lock.json` 只承担 CatalogLock 职责，不能被称为 OrderLock。

| 文件 | 单一职责 | 维护者 |
|---|---|---|
| `ui-lab.config.json` | 装配意图：Profile、System、可选 Recipe、已选组件和 `adopt\|replace` 模式 | 项目拥有；CLI 可更新 |
| `ui-lab.lock.json` | Catalog 行为契约来源与版本证据 | CLI 管理；禁止手改 |
| `DESIGN.md` | 视觉真源：外观、构图、字体、token、响应式、状态、动效与有意保留的产品身份 | 产品/设计决策拥有 |
| `.ui-lab/adoption-report.md` | adopt/replace 的实现记录：映射、偏差、候选决策和验证证据 | Agent/实现者维护 |

四者不可互相替代：config 只表达“要装成什么”，不是视觉规范；lock 只记录“基于哪份 Catalog 行为契约装配”，不是安装收据；`DESIGN.md` 不替代 Recipe 的可执行约束；adoption report 记录实施事实，不覆盖视觉真源。

### 目标 OrderLock 与 EvidenceBundle

OrderDraft 主要是 Studio/chat 中可变的选择状态。用户完成 selection approval 后，目标系统生成不可变、可重放的 OrderLock；实现完成后再把 Static、Runtime、Visual、Human 证据绑定为 EvidenceBundle。selection approval 只批准选择，implementation acceptance 才决定实现是否可 release。

当前 Order Manifest schema/service 是 Phase 1–2 领域实验，不等于目标 OrderLock 公共协议。`order validate` / `order diff` / `order sync` 仍属于计划能力；现有 `init`、`compose`、`lock` 和 `audit` 只处理较低层 config、CatalogLock 与确定性规则，绝不能被表述为已支持 Package order、OrderLock 或 EvidenceBundle。

### 装配意图：`ui-lab.config.json`

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

### Catalog 行为契约锁：`ui-lab.lock.json`

`init`、`compose` 和 config-aware `add` 会创建或同步 lock。它记录：

- `catalogSource`：本次绑定使用的内置 snapshot 或远程 Catalog 来源。
- 所选 System、Recipe 和 Component 的 `kind` / `slug` 与 `contractHash`；哈希是 Catalog 中安装入口、主题预览、Recipe 机器字段、组件来源契约等稳定序列化载荷的 SHA-256。
- Component 声明的 `sourceFiles`，用于发现 source family 缺失或 Catalog 契约过期。

CatalogLock 用于发现配置选择、Catalog 来源和行为契约的漂移。它**不会**对消费项目中的 vendored 文件计算字节哈希，也不证明本地源码与 UI Lab 源码逐字节等同；`adopt` 项目可以保留经审查的本地适配。它不是 OrderLock、安装收据或 acceptance。lock 缺失或 stale 时运行 `ui-lab lock --dir <frontend-package>`：它只读取现有 config，按当前 Catalog 重建 CatalogLock，不修改 config，也不执行安装。不要手工改哈希，也不要为恢复 lock 使用会覆盖项目绑定的 `init --force`。

### 视觉真源与采用证据

`DESIGN.md` 应记录选定参考、布局区域、字体与资产、颜色和表面 token、间距/圆角/阴影、图标、主题模式、响应式转换、必需状态、焦点与 reduced-motion 行为。已有产品执行 `adopt` 时，应先把可信的现状或明确选择的目标写入 `DESIGN.md`，再进行大范围视觉修改。

`.ui-lab/adoption-report.md` 逐项记录现有实现到 System / Recipe / Component 的映射、保留或拒绝的候选、已知偏差、理由和审计/截图证据。它回答“这次如何采用、哪里不同、如何验证”，不重新定义“最终应该长什么样”。

视觉证据分为三种且不得互相替代：真实外部观察图是 **calibration source**；当前实现自生成的图是 **candidate regression capture**，只能防回归；满足同 fixture/语义映射、size、scale、theme、font 与 timing 条件并由用户明确批准的图，才是 **approved acceptance capture**。candidate 与自身比对不能证明它忠实于某个 Package/reference，文件名或字段名中的 `golden` 也不改变其证据角色。

比较分两条链：Package/reference source → UI Lab System Showcase / visual master 用于校准，尺寸或语义不同时只能 side-by-side 分类审查，禁止 overlay/pixel score；approved Package fixture/master → consumer implementation 才用于 acceptance，在可比性前置条件满足后可做 overlay/diff。用户批准是两条链之间的硬边界，Agent 不能代为确认。

视觉验收必须在目标运行时，以相同 viewport、device scale、主题、语义状态、字体加载状态和截图时机，成对保存 reference / implementation 截图。同一应用的精确回归使用相同数据；把既有产品与设计系统 demo 对照时，使用确定且语义等价的数据形状/密度，在 adoption report 记录字段映射，并保持产品文案和事实真实，不能为了“像”而把 demo 数据塞进产品。选择覆盖 Recipe 或 `DESIGN.md` 中每个适用 viewport（wide / collapse / narrow）、mode（light / dark 等）和 state（loading / empty / error / success 与领域状态）维度的最小代表性 case 集；只有 Recipe 明确要求时才执行三者的全笛卡尔积。另需补充键盘焦点、reduced motion、必需 section / slot / asset 和 forbidden 检查。缩放已有截图不能充当同尺寸实现截图。

先按布局、排印、颜色/表面、组件 anatomy、资产、状态、响应式、焦点和动效分类差异，再优先修复 token、主题导入、source family 或 Recipe 映射等共同根因。确定性 Audit 不能替代这组视觉比对；剩余差异必须在 adoption report 和视觉比较报告中说明并被明确接受。

## 少数深接口

以下是 **current implementation** 的低层接口，不是目标 Package→Order→Lock→Evidence CLI。先运行 `ui-lab --help`，只调用真实暴露的命令。

```bash
ui-lab init --profile <profile> --system <slug> --mode <adopt|replace> --dir <frontend-package>
ui-lab compose <recipe> --dir <frontend-package>
ui-lab add <component-or-block> --dir <frontend-package>
ui-lab lock --dir <frontend-package> [--json]
ui-lab audit --strict --json --dir <frontend-package>
```

- `init` 校验并绑定 Stack Profile 与 System Kit，生成 config 并同步 lock；它不重写现有应用。
- `compose` 始终要求配置中的 System Kit 存在于 Catalog，把 Recipe 与必装组件清单写回 config，并同步 lock。`adopt` 计划要求先 review/compare，只安装缺失项且不得覆盖现有 vendored 源码；`replace` 计划才执行完整 Theme Kit 与组件安装。
- `add` 始终只打印 vendoring 命令、不执行安装。目标目录已有 config 时，它把 slug 去重登记到 `components` 并同步 lock；没有 config 时只打印命令。`--dir` 决定读取和更新哪个前端 package。
- `lock` 读取现有 config，并按当前 Catalog 重建 lock；它不修改 config、不安装资产，是 missing/stale lock 的安全恢复命令。
- `audit` 在交付前执行基础绑定、provenance 与 Golden Path 硬检查；视觉契约仍需人工/Agent 验证。

`themes --picker`、`theme`、`search`、`show` 和 `list` 继续作为当前视觉候选与专家发现接口。目标上，Studio 承载必须看见的 Package/fixture 选择，CLI/headless 只是同一契约的投影；当前能力尚未完成这一统一。

源码 CLI 已提供上述命令；npm 包版本可能滞后。先运行 `ui-lab --help`，若缺少所需命令或 flag，则在 UI Lab 仓库内使用 `bun cli/src/index.ts <command>`，或升级到包含它们的版本。

实时 Catalog 的 `--registry` / `UILAB_REGISTRY` 值必须是部署 base URL，例如 `https://ui-lab-ten.vercel.app`，不要包含 `/catalog.json`；CLI 会自行追加该路径。

## 工作流示例

以下命令展示 current bridge，不是 production-ready Package 流程。使用当前 System Kit / System Preset 时必须标明 maturity 与缺口；没有公开 OrderLock 命令时保持 pending。

### 新建 Electron Agent 应用

```bash
ui-lab themes --picker
ui-lab init --profile electron-renderer --system graphite --mode replace --dir packages/desktop
ui-lab compose agent-workbench --dir packages/desktop
# 执行 compose 输出的 Theme Kit 与组件安装计划
ui-lab audit --strict --json --dir packages/desktop
```

之后只填入会话、任务和产物数据；需要新增能力时先 `ui-lab add <slug> --dir packages/desktop`，保留 Graphite 的 `--wb-*` 引用。

### 改造现有 Next.js SaaS 落地页

```bash
ui-lab init --profile next-app --system minimal-light --mode adopt --dir apps/web
ui-lab compose saas-landing --dir apps/web
# review/compare 现有源码，只安装缺失项，不覆盖已 vendoring 的组件
ui-lab audit --strict --json --dir apps/web
```

先读取现有品牌、字体和 DOM / E2E 契约并写入 `DESIGN.md`，再按 `sections` 组合页面；Pricing 为可选项。这里得到的是 section composition contract，不是现成页面 shell。只替换 Recipe 的内容 slots 和允许替换项；strict Audit 通过后，仍须以覆盖每个适用 viewport / mode / state 维度的最小代表性 case 集，完成同尺寸 reference / implementation 视觉比对；仅 Recipe 明确要求时才做全笛卡尔积。
