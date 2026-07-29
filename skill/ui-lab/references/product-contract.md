# Product contract

这是已安装 `$ui-lab` Skill 内部的目标/current bridge 真源。每条 route 行动前完整读取；不要依赖消费环境一定存在根仓 `PRODUCT_DEFINITION.md`。

## North star

UI Lab 以 **Catalog + machine-readable contracts** 为核心。人负责看见、比较、批准和定义业务语义；AI 是受约束装配执行器，不是临场设计师，也不以复刻 Codex 为产品目标。

Design System Package 是横跨 Design Intent、System、Asset、Composition、Implementation、Verification 六层的顶层交付单元。Theme/skin 只覆盖 System 层部分 token，不能冒充完整设计系统。

## Package maturity

| maturity | 当前允许用途 |
|---|---|
| `reference` | 来源研究、校准、候选分析 |
| `draft` | Studio 比较、内部实验 |
| `theme-only` | 换肤/System 层候选，不得称完整系统 |
| `adapter-ready` | 受控 prototype/benchmark，尚不能直接正式采用 |
| `production-ready` | 唯一可直接用于正式项目装配的 maturity |

目标优先选择精确 `Package@version`，并验证 contract hash、fixture、source family、adapter、compatibility、license 与 evidence。当前无 production-ready Package 时，System Preset 只能作为 package-like candidate，必须显示 maturity 与缺口。

## Contract chain

```text
Package@version
  → OrderDraft
  → selection approval
  → OrderLock
  → implementation
  → EvidenceBundle
  → acceptance / release
```

- **OrderDraft** 可变，只记录候选 Package/fixture、Recipe、capability、兼容换件与 override。
- **selection approval** 批准“选什么”，允许生成 OrderLock；不批准最终实现。
- **OrderLock** 是不可变、可重放的解析快照，但不代表实现或视觉通过。
- **EvidenceBundle** 分开保存 Static、Runtime、Visual、Human；implementation acceptance 决定是否 release。

## Interaction

- **Chat**：理解目标、解释候选、编排 route 和报告 blocker。
- **Studio**：负责必须看见的全尺寸 Package/fixture 选择与 selection approval。
- **CLI / Agent**：查询 Catalog、执行真实暴露的契约、vendor 资产、运行 Audit 和产生机器证据。

CLI/headless 是 Studio 同一契约的投影，不得绕过视觉选择或用户批准。默认推荐 3 套场景匹配套餐；整套优先，只有 Compatibility Graph 明确兼容或存在 adapter 时才换件。

## Current bridge

| 当前对象 | 当前只是什么 | 不能称为什么 |
|---|---|---|
| Theme Kit | 可运行 token/theme | 完整 Package |
| System Preset | package-like predecessor | versioned production-ready Package |
| `ui-lab.config.json` | 当前装配意图 | OrderDraft / OrderLock |
| `ui-lab.lock.json` | **CatalogLock**：Catalog contract/provenance 快照 | OrderLock / acceptance |
| current Order Manifest | Phase 1–2 领域实验 | 稳定公开的新契约链 |
| Studio | candidate/Draft/matrix 的部分选择面 | 完整 Package chooser / OrderLock / release 工作台 |
| route references | 当前八条 route 的流程契约 | 已全部安装的 dedicated skills |

目标 OrderLock、完整 Package schema、Compatibility Graph、dedicated capabilities 与对应公开 CLI 尚未全部实现。项目命令必须先检查 `ui-lab --help` 和当前 Studio 能力；不存在的命令、Package maturity 或确认状态保持 `pending`，不得臆造。

## Global boundaries

- Codex 只能是 optional Package/reference，不是 UI Lab 产品目标、默认系统或全局 fidelity 标准。
- Parking Agent 只能是 Existing Adoption benchmark fixture，不定义 Catalog、Package 或全局 contract。
- selection approval 与 implementation acceptance 必须分开。
- CatalogLock、strict Audit、hash、pixel score、Agent 判断都不能替代 OrderLock 或 Human evidence。
- Contract required/forbidden/source-family/state/a11y 为 0 tolerance；geometry 使用声明容差；平台视觉差异使用 target-runtime baseline。
