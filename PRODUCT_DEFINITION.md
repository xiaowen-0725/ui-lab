# UI Lab 产品定义

> 本文是 UI Lab 的唯一产品北极星。架构、Skill、Studio、CLI、Catalog、benchmark 与消费项目文档若与本文冲突，以本文为目标定义；未落地能力必须明确标记为 target / planned，不能写成 current implementation。

## North star

UI Lab 是一个以 **Catalog + machine-readable contracts** 为核心的可组合前端系统。

它把设计意图、系统规则、可复用资产、页面组合、目标运行时实现与验证证据组织成可选择、可解析、可审计的契约。

人负责看见、比较、批准与定义产品语义；AI 是受约束的装配执行器，不是临场设计师。

AI 的职责是：

- 从 Catalog 读取真实、版本化的候选；
- 按兼容关系和用户批准的 Order 解析资产；
- vendor 完整 source family 并连接业务契约；
- 在声明的容差和目标运行时内验证实现；
- 如实报告证据不足、冲突和未实现能力。

UI Lab 的目标不是复刻 Codex，也不是把某个产品外观升级为全局审美标准。Codex 只能作为可选的 Design System Package、fixture 或 reference source；Parking Agent 只能作为 Existing Adoption benchmark fixture。

## Non-goals

UI Lab 不负责：

- 替用户决定业务领域模型、产品规则或最终信息架构；
- 让 AI 依据一句“高级、简洁、像 Codex”自由发挥；
- 用 Theme、skin 或 token 集合冒充完整设计系统；
- 把截图临摹、品牌资产或第三方源码未经许可发布为正式 Package；
- 用 Audit、hash、像素分数或 Agent 判断替代用户批准；
- 为迁就现有组件而改变业务语义、API/IPC、路由或可访问行为；
- 承诺所有 Package、Skill、Studio 工作流或 CLI 命令已经实现；
- 生产一个可营销但无法复核的“UI Lab 总分”。

## 六层契约

UI Lab 使用六层，而不是把所有决定塞进主题或组件：

| 层 | 负责什么 | 典型契约 |
|---|---|---|
| **Design Intent** | 目标感觉、参考来源、适用场景、禁止项与批准边界 | reference、visual facts、required / forbidden |
| **System** | 字体、图标、token、geometry、density、motion、platform 与全局规则 | Theme、typography、icons、tokens、Stack Profile |
| **Asset** | 可复用 Primitive、Component、Block、字体、图标与完整 source family | registry item、source files、license、provenance |
| **Composition** | 应用/页面如何组合、哪些 slot/state/responsive 规则必须满足 | Recipe、Semantic Component Contract、capability |
| **Implementation** | 在 Next/Vite/Electron 等目标运行时如何 vendor、adapt 和连接业务 | adapter、project binding、OrderLock resolution |
| **Verification** | 结构、运行时、视觉与人工批准是否有证据 | Static、Runtime、Visual、Human EvidenceBundle |

上层可以约束下层，不能替代下层。Theme 只解决 System 层的部分 token；Recipe 只解决 Composition；截图只提供 Design Intent 或 Evidence；Audit 只覆盖 Verification 的确定性子集。

Design System Package 不是 System 层的别名，而是横跨六层的顶层交付单元：它把适用的 Design Intent、System、Asset、Composition、Implementation 与 Verification 契约按精确版本一起交付。

## Design System Package

Design System Package 是 Catalog 中可选择的、精确且版本化的系统交付单元。

身份必须同时包含稳定 `packageId`、明确 `version`、canonical `contractHash` 和 maturity；载荷必须声明 Stack Profile / target runtime、适用六层契约、fixture IDs/payload、Recipe/Block/Component/source-family 精确引用、fonts/icons/assets provenance 与 license、Compatibility Graph、required/forbidden、declared tolerances、已知缺口和验证证据。

`contractHash` 用于验证载荷内容；`version` 用于人和工具表达兼容、升级与锁定。二者不能互相替代。

### Maturity

| maturity | 能证明什么 | 允许用途 |
|---|---|---|
| `reference` | 只有来源、视觉事实或研究材料 | 发现、校准、候选分析 |
| `draft` | 已有初步 Package 契约，但不完整或未验证 | Studio 比较、内部实验 |
| `theme-only` | 只有可运行 Theme/token，不含完整组件、组合与 adapter | 换肤候选、System 层实验 |
| `adapter-ready` | Package 和 Semantic Component Contract 已完整，有目标 adapter，但证据尚未达到生产线 | 受控 prototype、benchmark |
| `production-ready` | 精确资产、adapter、兼容关系、目标运行时与 acceptance evidence 均达到发布门禁 | 正式项目直接选择与装配 |

只有 `production-ready` Package 可以作为正式项目的直接装配输入。其他 maturity 可以进入 Studio 候选，但必须显示缺口，不能被描述为完整设计系统。

## Semantic Component Contract 与 adapter

复用的核心不是 className 相似，而是语义契约稳定。

Semantic Component Contract 至少声明：

- capability 与 anatomy；
- props、slots、events 与 controlled/uncontrolled 边界；
- loading、empty、error、success、disabled 与领域状态；
- keyboard、focus、accessible name 与 live region；
- responsive、overflow 与 long-content 行为；
- motion、reduced-motion 与 hover capability；
- target runtime 限制；
- required source family 和测试义务。

adapter 把同一语义契约映射到某个 Design System Package 的视觉与实现资产。

adapter 可以改变外观和具体 source family，不能改变业务语义或省略契约状态。一个 skin 只能替换 token；它没有 Semantic Component Contract、Composition 和 adapter 时，不得被称为完整设计系统。

## Compatibility Graph

Catalog 用显式图关系表达可组合性，不能让 Agent 靠猜测拼装。

每个节点可以声明：

- `provides`：提供的 capability、contract、token、asset 或 adapter；
- `requires`：必须存在的 runtime、contract、asset 或 capability；
- `compatibleWith`：已验证的 Package、Recipe、Profile、adapter 与版本范围；
- `conflictsWith`：不能共同启用的资产、规则或版本；
- `constraints`：required、forbidden、值域、容差与运行条件；
- `adapters`：从语义契约到具体 Package 实现的映射；
- `evidence`：支持兼容声明的 Static / Runtime / Visual / Human 证据。

缺少兼容边的组合默认是 unknown，不是 compatible。Agent 必须停止、选择已有 adapter，或把自定义 adapter 作为新契约工作处理。

## 契约链

目标链路固定为：

```text
Package@version
  → OrderDraft
  → selection approval
  → OrderLock
  → implementation
  → EvidenceBundle
  → acceptance / release
```

### OrderDraft

OrderDraft 是可变选择状态，记录候选 Package/fixture、Recipe、capability、兼容换件和允许的 override。它可在 chat 与 Studio 中反复修改，不代表批准或实现。

### Selection approval

Selection approval 是用户对“选择哪套 Package、fixture 和允许换件”的明确决定。它允许生成 OrderLock，但不等于对最终实现的 acceptance。

### OrderLock

OrderLock 是把 `Package@version + fixture + Recipe + capability + override + resolved assets/adapters` 固定下来的不可变解析快照。

OrderLock 必须可重放并带 canonical hash。它只证明选择已固定，不证明实现正确、视觉一致或可发布。

### Implementation

Implementation 按 OrderLock vendor 完整 source family，应用 adapter，并连接真实业务契约。偏差必须进入显式 deviation，不得静默替换资产或自由重画。

### EvidenceBundle

EvidenceBundle 绑定 OrderLock 和具体实现，分别保存：

- Static：schema、typecheck、lint、registry、source-family、Catalog provenance；
- Runtime：目标运行时、业务/API/IPC、state、keyboard、a11y、overflow、font load、performance；
- Visual：可比较 screenshot pair、capture metadata、difference taxonomy；
- Human：selection approval、implementation acceptance、例外接受与发布决定。

只有 EvidenceBundle 达到适用门禁，OrderLock 对应的实现才能进入 acceptance / release。

### 两种 Lock

当前 `ui-lab.lock.json` 是 **CatalogLock**：记录现有 config 选择相对 Catalog 的 contract hash 与 source-family provenance。它不是目标 OrderLock，也不证明订单、实现或 evidence 已完成。

目标 OrderLock 尚未由当前公开 CLI 完整实现。文档、Skill 和 Agent 必须检查 `ui-lab --help` / 当前 Studio 能力，不能臆造 `order` 命令或把 CatalogLock 升格为 OrderLock。

## 交互模型

三个入口共享同一契约，不各自保存一套真相：

- **Chat**：理解目标、解释候选、编排流程、收集约束与报告 blocker；
- **Studio**：承载必须“看见才能决定”的全尺寸视觉比较、Package/fixture 选择和 selection approval；
- **CLI / Agent**：查询 Catalog、解析/执行已支持的契约、vendor 资产、运行 Audit 与产出机器证据。

推荐流程默认给出 **3 套**适配场景的 Package 方案，说明 maturity、兼容性、成本和缺口。优先整套套餐；只有 Compatibility Graph 允许时才进行兼容换件，不把多个未锁定系统自由混搭。

CLI/headless 是 Studio 同一契约的投影，不是绕过视觉选择和用户批准的后门。

## Canonical Reference App 与 System Showcase

UI Lab 维护两个职责不同的验证面：

- **Canonical Reference App**：所有 Package 必须使用相同结构、内容、数据、任务流与状态矩阵，做 apples-to-apples 横向比较；固定覆盖字体、图标、组件 anatomy、loading/empty/error/success/disabled 等状态、light/dark、responsive 与 motion/reduced-motion。
- **System Showcase**：展示某个 Package 最擅长、最有辨识度的专属场景，可使用该系统特有的构图和能力，但必须明确 fixture 与适用边界。

Canonical Reference App 是跨 Package 基线；System Showcase 不是横向基线，不能用专属内容或场景冒充 apples-to-apples 证据。两者都以明确 fixture ID 版本化并进入 Package evidence。

## 精度与容差

UI Lab 不用“差不多”作为验收单位：

- **Contract：0 tolerance。** required contract、source family、state、slot、event、a11y 与 forbidden 不允许缺失；
- **Geometry：declared tolerance。** 每个可比较 case 声明尺寸、间距、对齐、裁切与允许误差；未声明时不能自行放宽；
- **Platform visual baseline。** 字体栅格化、系统 chrome 与渲染差异按 target runtime / platform 建基线，不跨平台强做像素结论；
- **Human approval。** 数值通过不能决定视觉方向或 intentional difference 是否可接受。

若 contract 声明或浏览器计算值应为 `13px`，验收值就必须是 `13px`；不能因为截图“看着接近”而接受 `12px` 或 `14px`。

## Skills

目标 Skill 架构是：一个薄 `$ui-lab` router + 正交 capabilities。

Router 只负责识别 intent、变更权限、阶段和 delegate；discover、select、adopt、replace、review、polish、motion、harden 分别拥有自己的输入、输出和完成门禁。

当前仓库已经有八条 route 和分离 reference contract，但 dedicated skills 尚未全部实现或安装。现阶段不得把 reference 文件称为已安装的独立 Skill，也不得让 router 假装能调用不存在的 capability。

## Source strategy 与许可

Package 来源可以是：

- `built-in`：UI Lab 自有或已明确许可、完整实现的资产；
- `fork`：保留原许可、来源、变更记录并满足再分发义务的代码来源；
- `ingest`：从截图、网址或描述 clean-room 提炼的视觉事实与自有 token/contract。

任何 built-in / fork / ingest 新来源都先进入 `draft`，通过精确契约、许可、adapter 和 evidence 后才能升级 maturity。

`awesome-design-md` 固定来源 commit 为 `664b3e78fd1a298ba11973822da988483256d4b4`，当前作为 **74 条 reference** 使用：64 条 structured、10 条 legacy Markdown。

这些 reference 不等于官方设计系统，也不等于 `production-ready` Package。MIT 只覆盖仓库中可许可的文档/代码表达；品牌、商标、字体、截图、插画和其他资产的权利必须分别核验。不得因 reference 被收录就推断可以 vendor 或发布品牌资产。

Codex 可以作为 optional Package/reference 候选；它不是 UI Lab 的产品目标、默认系统或 fidelity 总标准。

## Benchmark portfolio

目标 portfolio 固定为六类：

| Benchmark | 验证对象 | 代表 fixture | 当前状态 |
|---|---|---|---|
| **Package Conformance** | Package schema、version、maturity、source family、license、Compatibility Graph | UI Lab Native Package + Canonical Reference App | planned |
| **Greenfield App** | 从 approved OrderLock 装配新应用 | Greenfield Workbench | partially implemented |
| **Landing** | narrative、section Recipe、asset crop、responsive 与 CTA | canonical landing | planned |
| **Existing Adoption** | 保留业务契约并采用 Package/adapter | Parking Agent 仅作为 fixture | readiness baseline only |
| **Cross-system Replacement** | 同一 Canonical Reference App / 语义契约跨两个 production-ready Package 替换 | Canonical Reference App A/B | planned |
| **Custom Package Lifecycle** | ingest/fork → draft → adapter → evidence → production-ready | custom package fixture | planned |

每类分别报告 Static、Runtime、Visual、Human；缺证据就是 `Insufficient evidence` / `Pending`。未实现 benchmark 不能写成通过，也不得把不同类型分数平均为产品总分。

## Roadmap

| Phase | 目标 |
|---|---|
| **Phase 0 — contracts/docs** | 固化本文、Package schema、Compatibility Graph、OrderLock/Evidence 术语与 benchmark portfolio |
| **Phase 1 — Native Package + Canonical** | 建立首套 UI Lab Native production-ready 候选、固定 Canonical Reference App 与该系统的 System Showcase |
| **Phase 2 — Studio Order/Lock** | Studio 按 Package/fixture 视觉选择，输出 OrderDraft、selection approval 与 OrderLock |
| **Phase 3 — router/capabilities/CLI build** | 落地正交 capabilities、薄 router 与公开 CLI/Agent 契约执行链 |
| **Phase 4 — second system + cross-system** | 第二套显著不同的 Package、adapter 与 Cross-system Replacement benchmark |
| **Phase 5 — landing/custom/adoption** | 补齐 Landing、Custom Package Lifecycle 与 Existing Adoption 的完整 evidence |

Codex 可在适合的阶段成为 optional Package/reference，但不主导 roadmap。Parking 只参与 Existing Adoption fixture，不定义产品架构。

## Current bridge

下表描述 **current implementation**，不是目标能力声明：

| 当前对象 | 当前只是什么 | 不能称为什么 |
|---|---|---|
| Theme Kit | 可运行的 token/theme 载荷 | 完整 Design System Package |
| System Preset | package-like predecessor，含部分视觉锁、resolver 与 fixture payload | 已版本化、production-ready Package |
| `ui-lab.config.json` | Profile/System/Recipe/Component 装配意图 | OrderDraft、OrderLock 或视觉规范 |
| `ui-lab.lock.json` | CatalogLock：当前 Catalog contract/provenance 快照 | OrderLock、安装收据或 acceptance |
| current Order Manifest schema/service | Phase 1–2 的 draft/confirmed 领域实验与门禁实现 | 已公开、稳定的 Package→Order→Lock→Evidence 产品协议 |
| Studio | 当前候选解析、Draft、candidate matrix 与部分视觉审查面 | 完整 Package chooser、OrderLock 与 release 工作台 |
| `ui-lab init/compose/add/audit` | 当前低层 binding、计划、登记与确定性 Audit | 已实现的 Package order/sync/acceptance CLI |
| `$ui-lab` references | 八条 route 的共享流程契约 | 已全部安装的 dedicated skills |
| `codex-desktop-v1` | 现有 System Preset/参考与候选证据实验 | UI Lab 产品目标或默认 production-ready Package |
| Parking Agent | 未进入正式改造的 Existing Adoption 评估对象 | 全局架构真源、Canonical App 或设计标准 |

迁移期间，Agent 必须同时说清 target 和 current：使用当前 System Preset 或 Theme Kit 时标明 maturity/缺口；使用当前 CLI 时以 `ui-lab --help` 为准；没有公开 OrderLock/Package 命令时保持 pending，不编造成功状态。

最终标准不是“AI 能生成一个页面”，而是：用户能看见并选择一个精确系统，AI 能在明确边界内装配，结果能被重放、比较、审计和诚实验收。冲突依次服从产品定义与用户批准、versioned machine contract、Compatibility Graph / Semantic Component Contract、target runtime / 业务契约、EvidenceBundle，最后才是实现便利或 Agent 偏好。
