# UI Lab benchmarks

本目录记录 UI Lab 在独立、可重跑场景中的能力边界。目标不是制造一个可营销的总分，而是用同一套 rubric 区分已验证能力、证据不足和真实 blocker，持续发现 Skill、Catalog、Design System Package/current System Preset bridge、Recipe、CLI、视觉证据与消费项目之间的断点。产品目标见 [PRODUCT_DEFINITION.md](../PRODUCT_DEFINITION.md)。

`benchmarks/runs/*` 是独立前端 package，不属于根 Next.js package。每个 fixture 使用自己的 `package.json`、lockfile、TypeScript、Biome、测试与浏览器工具链；根 `tsconfig.json` 和 `biome.json` 不扫描这些目录。

## 六维统一 rubric

历史四场景与目标六类 portfolio 都按以下六个维度判断。只有存在可复核证据时才得分；`Insufficient evidence` 不得补写成通过。

| 维度 | 权重 | 判断内容 |
|---|---:|---|
| Route & authority | 10 | 意图、Skill 路线、真实 frontend package root、变更授权与用户批准边界是否明确 |
| System & asset reuse | 20 | 是否从 Catalog / System Preset / Recipe / registry 选择资产，source family 是否完整且来源可追溯 |
| Contract completeness | 20 | Profile、Preset、Recipe、组件、slots、states、responsive、assets、required / forbidden 是否逐项映射 |
| Runtime quality | 20 | 目标 runtime 中的构建、交互、状态、字体、overflow、键盘、a11y、性能与恢复行为 |
| Visual evidence | 20 | 是否有同尺寸、同 fixture、同 theme / font / timing 的可比较证据，差异是否被分类和解释 |
| Evidence honesty | 10 | Static、Runtime、Visual、Human 四层结论是否独立，是否拒绝用自生成证据或分数冒充批准 |

总分为 100，但只在同一场景内部使用。不同场景的对象、证据与风险不同，禁止把它们平均成“UI Lab 总分”。

## Target 六类 benchmark portfolio

| 类型 | 验证对象 | 代表 fixture | 状态 |
|---|---|---|---|
| Package Conformance | Package version/maturity、source family、license、Compatibility Graph、contract 0 tolerance | UI Lab Native Package | **Planned** |
| Greenfield App | approved OrderLock 到新应用、adapter、target runtime 与 EvidenceBundle | Greenfield Workbench | **Partially implemented**：current config/System Preset bridge fixture 已有工程证据 |
| Landing | section Recipe、narrative、asset crop、responsive 与 CTA | canonical landing | **Planned** |
| Existing Adoption | 保留业务/API/IPC/selector，采用 Package/adapter | Parking Agent 仅为 fixture | **Readiness baseline only**，未正式采用 |
| Cross-system Replacement | 同一 Semantic Component Contract 跨两个 production-ready Package 替换 | Canonical App A/B | **Planned** |
| Custom Package Lifecycle | built-in/fork/ingest → draft → adapter → evidence → production-ready | custom package fixture | **Planned** |

Static、Runtime、Visual、Human 必须分别报告。`Planned`、`Partially implemented` 和 `Readiness baseline only` 都不能写成通过；六类也不得平均为产品总分。

## 2026-07-29 历史四场景基线

以下四场景是当日独立会话的历史事实，不是当前产品目标或完整 portfolio。Codex/Parking 只代表当时评估 case。

| ID | 场景 | 关注点 | 新会话 |
|---|---|---|---|
| A | Platform maturity | Catalog、Skill、CLI、System / Recipe 覆盖与证据成熟度的只读盘点 | `019fab74-ac33-7071-a7d9-da76ee66d89b` |
| B | Greenfield Workbench | 从批准的 fixture 范围装配独立 Vite Workbench，并验证 source family、严格 Audit 与运行时 | `019fab74-ac33-7071-a7d9-da626b48b659` |
| C | Assembly Studio visual pipeline | 候选矩阵、capture readiness、证据角色、checkout / confirmation 门禁与 fidelity 能否被证明 | `019fab74-ac33-7071-a7d9-daa311705c92` |
| D | Parking adopt readiness | Existing Adoption fixture 的 frontend root、binding、保留契约、采用授权与落地前置条件 | `019fab74-ac33-7071-a7d9-da4765002db9` |

每个场景必须来自独立新会话，保留原始结论和证据边界。场景 B 的可执行 fixture 位于 `benchmarks/runs/greenfield-workbench/`；其场景内结果见 `benchmarks/runs/greenfield-workbench/BENCHMARK.md`。

## 证据角色

- **Calibration source**：真实外部观察或已记录的方向来源，只说明设计校准方向。
- **Candidate regression capture**：当前实现生成的截图，只能防止该实现向后漂移。
- **Approved acceptance capture**：在可比较条件下由用户明确批准的目标截图，才能作为 acceptance master。
- **Static / Runtime evidence**：命令输出、Audit JSON、source-family 对比、测试、构建和目标运行时记录。
- **Human approval**：用户对 visual master 与适用订单的明确决定，不能由 Agent、hash、pixel score 或 Audit 代替。

Static 分数、strict Audit `0 errors / 0 warnings`、构建成功或 E2E 全过，都不能替代 Visual 与 Human 结论。候选截图与自身比较也不能证明它忠实于 Package/reference calibration source。

## Greenfield 门槛

Greenfield Workbench 只有同时满足以下条件，才达到本基准的工程通过线：

- rubric 得分至少 **85 / 100**；
- `ui-lab audit --strict --json` 为 **0 errors / 0 warnings**；
- 所需 registry **source family exact**，没有缺失 sidecar 或来源不明的替代实现；
- Playwright **E2E 全部通过**；
- Static 与 Runtime 分别有原始证据。

即使达到以上门槛，只要缺少 approved acceptance capture 或用户批准，Visual 仍是 `Insufficient evidence` / `Pending`，Human 仍是 `Pending`。当前 fixture 也不能因此升级为 production-ready Package 或声称已有目标 OrderLock/EvidenceBundle。

## 重跑 Greenfield

先安装 fixture 自己的冻结依赖：

```bash
cd benchmarks/runs/greenfield-workbench
bun install --frozen-lockfile
cd ../../..
```

再从仓库根运行统一验证：

```bash
bun run benchmark:greenfield
```

该命令依次运行 fixture 的 lint、typecheck、unit test、production build、strict audit 与 Playwright E2E。它需要独立依赖和浏览器环境，成本高于根仓常规检查，因此没有接入 `bun run check`。

当前综合基线见 [BASELINE-2026-07-29.md](BASELINE-2026-07-29.md)。
