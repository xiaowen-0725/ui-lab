---
name: ui-lab
description: "UI Lab 的单入口 model-invoked router，用于 React 应用与落地页的设计系统发现、视觉选择、现有产品采用、明确替换、只读评审、有限精修、动效与完整性加固。Use when a request involves composing, applying, reviewing, polishing, animating, or hardening a UI Lab frontend; route visual-style ingestion to $design-ingest."
---

# UI Lab

把 UI Lab 当作可组合、可验证的前端契约。每轮只进入一个互斥路线；完成或遇到门禁后再重新路由，不要把选择、实现、评审和批准混在同一步。

每条 route 行动前先完整读取 [product-contract.md](references/product-contract.md)。当前八条 route 已存在，但目标 dedicated capabilities 尚未全部实现或安装；不要把 reference 文件称为可调用的独立 Skill。

## 先路由

| 用户意图 | 路线 | 是否可改生产代码 | 行动前完整读取 |
|---|---|---:|---|
| 查找 Catalog、System、Recipe 或组件 | `discover` | 否 | [product-contract.md](references/product-contract.md)、[discover.md](references/discover.md) |
| 用视觉候选对齐主题、字体、图标、布局或组件方向 | `select` | 否 | [product-contract.md](references/product-contract.md)、[selection.md](references/selection.md)、[craft-contract.md](references/craft-contract.md)、[visual-acceptance.md](references/visual-acceptance.md) |
| 将 UI Lab 接入现有产品并保留业务契约 | `adopt` | 是 | [product-contract.md](references/product-contract.md)、[project-contract.md](references/project-contract.md)、[selection.md](references/selection.md)、[craft-contract.md](references/craft-contract.md)、[adopt.md](references/adopt.md)、[quality-gates.md](references/quality-gates.md)、[audit.md](references/audit.md)、[visual-acceptance.md](references/visual-acceptance.md) |
| 新建前端或经用户明确授权整体替换 | `replace` | 是 | [product-contract.md](references/product-contract.md)、[project-contract.md](references/project-contract.md)、[selection.md](references/selection.md)、[craft-contract.md](references/craft-contract.md)、[replace.md](references/replace.md)、[quality-gates.md](references/quality-gates.md)、[audit.md](references/audit.md)、[visual-acceptance.md](references/visual-acceptance.md) |
| 只读检查契约、实现或视觉偏差（不含纯动效专项） | `review` | 否 | [product-contract.md](references/product-contract.md)、[project-contract.md](references/project-contract.md)、[review.md](references/review.md)、[quality-gates.md](references/quality-gates.md)、[audit.md](references/audit.md)、[visual-acceptance.md](references/visual-acceptance.md) |
| 在已批准方向内修共同观感问题 | `polish` | 有限 | [product-contract.md](references/product-contract.md)、[project-contract.md](references/project-contract.md)、[polish.md](references/polish.md)、[craft-contract.md](references/craft-contract.md)、[quality-gates.md](references/quality-gates.md)、[audit.md](references/audit.md)、[visual-acceptance.md](references/visual-acceptance.md) |
| 查找、评审或应用动效 | `motion` | 取决于模式 | 基础：[product-contract.md](references/product-contract.md)、[motion.md](references/motion.md)、[craft-contract.md](references/craft-contract.md)、[quality-gates.md](references/quality-gates.md)；`apply` 还须完整读取 [project-contract.md](references/project-contract.md)、[audit.md](references/audit.md)、[visual-acceptance.md](references/visual-acceptance.md) |
| 补齐状态、边界、可访问性与目标运行时韧性 | `harden` | 是 | [product-contract.md](references/product-contract.md)、[project-contract.md](references/project-contract.md)、[harden.md](references/harden.md)、[craft-contract.md](references/craft-contract.md)、[quality-gates.md](references/quality-gates.md)、[audit.md](references/audit.md)、[visual-acceptance.md](references/visual-acceptance.md) |

默认把已有产品路由到 `adopt`；只有新项目或用户明确授权替换时才用 `replace`。用户若要求把 UI Lab 仓库内或外部看到的风格沉淀为长期资产，转交 `$design-ingest`，先进入 draft/reference maturity，不要在本路线里临摹成一次性 CSS。若用户要的是完整应用系统，完成 ingest 后回到 `select`。

纯 motion diff、动效机会或动效专项审查优先进入 `motion find` / `motion review`，不进入通用 `review`。混合型检查由通用 `review` 统筹，但同一 finding 只能归属一个路线。

完整阶段与转移条件见 [skill-tree.md](references/skill-tree.md)。来源边界与许可见 [influences.md](references/influences.md)。

## 共同约束

- 定位真正的 React package 根，并让 `package.json`、`components.json`、`ui-lab.config.json` 与所有 `--dir` 指向同一处。
- 项目命令前运行 `ui-lab --help`；已安装 CLI 没有要求的命令或 flag 时，报告版本不匹配，不静默降级。
- 目标选择顺序是 Catalog 中的 `production-ready Package@version` → fixture → Recipe → Block → Component → shadcn primitive → bespoke。当前没有合格 Package 时可把 System Preset 作为 package-like candidate，但必须显示 maturity、缺失 adapter/evidence 与 current fallback 身份，不能称为 production-ready。
- Current fallback 的候选发现仍可沿用 `Reference Pack → System Preset → Recipe → Block → Component → shadcn primitive → bespoke` 搜索，但这只用于在现有 Catalog 中找候选，不得覆盖 Package-first 目标或隐藏 maturity 缺口。
- Studio 是必须看见的 Package/fixture 选择面；CLI/headless 是同一契约的投影。`discover` / `select` 可以创建隔离临时候选，或写入用户明确授权的 evidence 位置，但不得修改消费者生产代码。Agent 可准备候选和证据，不能代替 selection approval 或 implementation acceptance。
- Vendor UI Lab 源码，不给消费者增加 UI Lab 仓库运行时依赖；保留业务状态、API/IPC、路由、可访问语义、自动化选择器和测试。
- `review`、`motion find`、`motion review` 对项目文件完全只读，不创建或修改实现、配置或 evidence。只有 `adopt`、`replace`、`polish`、`motion apply`、`harden` 等明确的 mutating 路线可以修改消费者实现。
- Audit 是结构证据；visual acceptance 是视觉证据；human approval 是批准边界。三者不互相替代。
- 目标契约链为 Package@version → OrderDraft → selection approval → OrderLock → implementation → EvidenceBundle → acceptance/release。当前 `ui-lab.lock.json` 只是 CatalogLock；没有公开 OrderLock 命令时保持 pending，不臆造能力。

## 完成边界

- `discover`：返回带 live/fetch 证据的候选与拒绝理由，消费者不变。
- `select`：全尺寸候选完成一维比较，用户明确批准；在此之前只能保持 pending。
- `adopt` / `replace` / `polish` / `motion apply` / `harden`：通过 [quality-gates.md](references/quality-gates.md) 的适用四层门禁，并满足既有 [audit.md](references/audit.md) 与 [visual-acceptance.md](references/visual-acceptance.md)。
- `review`：只给出 `Pass`、`Block` 或 `Insufficient evidence`；`Pass` 也不等于用户批准。
