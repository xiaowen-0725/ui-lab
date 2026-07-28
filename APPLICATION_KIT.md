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

## 顶层装配边界：System Preset 与 Order Manifest

六层模型继续描述可复用前端资产如何分层；其上新增两个**顶层装配领域对象**，用来把一次真实应用的选择、约束和验收证据固定下来，而不是再把它们塞回 token、Recipe 或 CLI 配置。

- **System Preset**：跨层的、可被选择的产品级系统预设。它冻结一个 Theme Kit、字体/图标/组件 anatomy、能力与组件白名单、资产、参考包、safe override 和 forbidden；Theme Kit 仍只处于 token 层，Recipe 仍只处于组合层，二者都不能单独表达一套已校准的产品系统。
- **Order Draft**：可变的装配订单草案。它记录所选 System Preset、Recipe、能力和允许的 safe override，供人和 Agent 比较、讨论与修改。
- **Confirmed Manifest**：由确认后的订单生成的不可变装配清单。它必须绑定 canonical contract hash、确定性 assets/components，以及用户批准的目标运行时 acceptance capture / checkout 证据；self-generated candidate regression capture 不能解锁 confirmed，也不得以 config、lock 或 Audit 代替。

`codex-desktop-v1` 的 Phase 1 已建立 approved calibration、planned cases 和 draft order 的领域定义。Phase 2 当前生成的 8 张图仍是 candidate regression captures，尚未获得用户逐项批准，不能称为 acceptance golden 或 Confirmed Manifest；视觉验收完成前仍**不得修改 Parking Agent**。

### System Preset 的 Catalog 与解析契约

Catalog 新增 `kind: "system-preset"`。每个 System Preset 以稳定序列化载荷计算 canonical contract hash；该哈希描述预设本身，不是消费项目源码或截图的字节哈希。Phase 1 resolver 以 `preset + recipe + capability + safeOverrides` 为输入，解析出确定性的 assets/components 清单；任何不在白名单中的能力、组件和 override 都必须被拒绝或显式回到 Order Draft 重新确认。

System Preset 的 `lockedVisual` 固定为 typography、icons、surfaces、selection、density、geometry、shadows、motion、responsive 九类非空视觉事实；reference fixture 以 canonical payload 和 hash 一同进入 Catalog，保证离线可重建。safe override 只有预设声明的六类键和值域可用，解析出的 assets 必须进入 Order Manifest 的 composition 与 manifest hash。

Manifest 的结构/hash 解析与 Catalog 策略验证是两道门：公开 draft 只能从 resolver 结果创建；导入、记录 candidate/approved acceptance evidence 或确认前必须用可信 Catalog 重新解析并逐项比对 preset、Recipe、能力、组件、资产、视觉锁和 reference matrix。仅有合法 JSON、自洽 SHA-256 或 self-generated candidate 不能成为 Confirmed Manifest。

System Preset 不分发第三方产品资产或暗示官方授权。它只引用 UI Lab 可合法分发的 token、组件和明确边界内的参考/资产说明。

## 六层模型

| 层 | 职责 | 连接标准 |
|---|---|---|
| Stack Profile | 规定运行时、样式、图标、动效与框架边界 | `next-app`、`vite-app`、`electron-renderer` |
| System Kit | 提供整套视觉语言（按套件为单态或双态） | CSS variables、Tailwind CSS 4、shadcn 语义 token |
| Primitive / Component | 提供基础交互和有辨识度的组件 | shadcn-compatible registry、具名 React 导出 |
| Block | 组合多个组件形成产品区块 | 数据、状态、事件和 slots |
| Recipe | 组合 System、Block 与页面骨架 | required / forbidden、布局、状态与响应式契约 |
| Audit | 检查消费项目是否偏离选择 | config / lock 契约 + 确定性规则 |

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

| 文件 | 单一职责 | 维护者 |
|---|---|---|
| `ui-lab.config.json` | 装配意图：Profile、System、可选 Recipe、已选组件和 `adopt\|replace` 模式 | 项目拥有；CLI 可更新 |
| `ui-lab.lock.json` | Catalog 行为契约来源与版本证据 | CLI 管理；禁止手改 |
| `DESIGN.md` | 视觉真源：外观、构图、字体、token、响应式、状态、动效与有意保留的产品身份 | 产品/设计决策拥有 |
| `.ui-lab/adoption-report.md` | adopt/replace 的实现记录：映射、偏差、候选决策和验证证据 | Agent/实现者维护 |

四者不可互相替代：config 只表达“要装成什么”，不是视觉规范；lock 只记录“基于哪份 Catalog 行为契约装配”，不是安装收据；`DESIGN.md` 不替代 Recipe 的可执行约束；adoption report 记录实施事实，不覆盖视觉真源。

### Phase 3 目标证据

Order Draft 主要是 Studio 中可变的选择状态，不是消费根的必备文件。Phase 3 的 order sync 将决定消费根中 Confirmed Manifest 与可能的 sync receipt 的具体文件形态；无论最终落点为何，Confirmed Manifest 都必须独立于 config / lock / Audit，固定 canonical contract hash、确定性 assets/components 和用户批准的 acceptance capture / checkout 证据。

当前 CLI 的 `order validate` / `order diff` / `order sync` 属于 **Phase 3 计划能力**，尚未实现。现有 `init`、`compose`、`lock` 和 `audit` 仅处理较低层的配置、Catalog 和确定性规则，绝不能被表述为已经支持 confirmed order 或 Manifest 验收。

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

### 行为契约锁：`ui-lab.lock.json`

`init`、`compose` 和 config-aware `add` 会创建或同步 lock。它记录：

- `catalogSource`：本次绑定使用的内置 snapshot 或远程 Catalog 来源。
- 所选 System、Recipe 和 Component 的 `kind` / `slug` 与 `contractHash`；哈希是 Catalog 中安装入口、主题预览、Recipe 机器字段、组件来源契约等稳定序列化载荷的 SHA-256。
- Component 声明的 `sourceFiles`，用于发现 source family 缺失或 Catalog 契约过期。

lock 用于发现配置选择、Catalog 来源和行为契约的漂移。它**不会**对消费项目中的 vendored 文件计算字节哈希，也不证明本地源码与 UI Lab 源码逐字节等同；`adopt` 项目可以保留经审查的本地适配。lock 缺失或 stale 时运行 `ui-lab lock --dir <frontend-package>`：它只读取现有 config，按当前 Catalog 重建 lock，不修改 config，也不执行安装。不要手工改哈希，也不要为恢复 lock 使用会覆盖项目绑定的 `init --force`。

### 视觉真源与采用证据

`DESIGN.md` 应记录选定参考、布局区域、字体与资产、颜色和表面 token、间距/圆角/阴影、图标、主题模式、响应式转换、必需状态、焦点与 reduced-motion 行为。已有产品执行 `adopt` 时，应先把可信的现状或明确选择的目标写入 `DESIGN.md`，再进行大范围视觉修改。

`.ui-lab/adoption-report.md` 逐项记录现有实现到 System / Recipe / Component 的映射、保留或拒绝的候选、已知偏差、理由和审计/截图证据。它回答“这次如何采用、哪里不同、如何验证”，不重新定义“最终应该长什么样”。

视觉证据分为三种且不得互相替代：真实外部观察图是 **calibration source**；当前实现自生成的图是 **candidate regression capture**，只能防回归；满足同 fixture/语义映射、size、scale、theme、font 与 timing 条件并由用户明确批准的图，才是 **approved acceptance capture**。candidate 与自身比对不能证明它像 Codex，文件名或字段名中的 `golden` 也不改变其证据角色。

比较分两条链：Codex source → UI Lab visual master 用于校准，尺寸或语义不同时只能 side-by-side 分类审查，禁止 overlay/pixel score；approved UI Lab master → consumer app 才用于 acceptance，在可比性前置条件满足后可做 overlay/diff。用户批准是两条链之间的硬边界，Agent 不能代为确认。

视觉验收必须在目标运行时，以相同 viewport、device scale、主题、语义状态、字体加载状态和截图时机，成对保存 reference / implementation 截图。同一应用的精确回归使用相同数据；把既有产品与设计系统 demo 对照时，使用确定且语义等价的数据形状/密度，在 adoption report 记录字段映射，并保持产品文案和事实真实，不能为了“像”而把 demo 数据塞进产品。选择覆盖 Recipe 或 `DESIGN.md` 中每个适用 viewport（wide / collapse / narrow）、mode（light / dark 等）和 state（loading / empty / error / success 与领域状态）维度的最小代表性 case 集；只有 Recipe 明确要求时才执行三者的全笛卡尔积。另需补充键盘焦点、reduced motion、必需 section / slot / asset 和 forbidden 检查。缩放已有截图不能充当同尺寸实现截图。

先按布局、排印、颜色/表面、组件 anatomy、资产、状态、响应式、焦点和动效分类差异，再优先修复 token、主题导入、source family 或 Recipe 映射等共同根因。确定性 Audit 不能替代这组视觉比对；剩余差异必须在 adoption report 和视觉比较报告中说明并被明确接受。

## 少数深接口

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

`themes --picker`、`theme`、`search`、`show` 和 `list` 继续作为视觉选择与专家发现接口，但不要求 Agent 用十几个底层命令手工拼装常见页面。

源码 CLI 已提供上述命令；npm 包版本可能滞后。先运行 `ui-lab --help`，若缺少所需命令或 flag，则在 UI Lab 仓库内使用 `bun cli/src/index.ts <command>`，或升级到包含它们的版本。

实时 Catalog 的 `--registry` / `UILAB_REGISTRY` 值必须是部署 base URL，例如 `https://ui-lab-ten.vercel.app`，不要包含 `/catalog.json`；CLI 会自行追加该路径。

## 工作流示例

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
