# Craft contract

Craft 不是个人审美禁令，而是用户批准选择、Catalog 契约和目标产品约束的可执行交集。

## 选择与复用顺序

目标按以下顺序寻找真实资产：

1. **Production-ready Package@version**：精确系统、maturity、compatibility、adapter、fixture 与 evidence。
2. **Fixture**：Package 内声明的 Canonical App / System Showcase 或场景 case。
3. **Recipe**：section、slot、state、responsive、asset、required 与 forbidden 装配契约。
4. **Block**：可复用的产品区块。
5. **Component**：UI Lab registry 中的组件及完整 source family。
6. **shadcn primitive**：在上层资产确实没有覆盖时使用。
7. **Bespoke**：记录搜索证据与拒绝理由后才编写。

Catalog 返回值、registry item、fetch 结果及声明的 source family 是事实真源。不要只凭 slug、截图或记忆重画；不要只复制主文件而遗漏 sidecar、样式、hook 或公共 API。项目级 artifact 角色、frontend root 和 Workbench token 规则以 [project-contract.md](project-contract.md) 为准。

当前 Catalog 尚无满足目标全部字段的 production-ready Package 时，可以把 System Preset 作为 package-like candidate，但必须标明它的实际 maturity、缺失的 version/adapter/compatibility/evidence，以及所用 Theme Kit/Recipe/source family。Skin 或 Theme 只覆盖 System 层部分 token，不能冒充完整设计系统。

Studio 承载全尺寸 Package/fixture 视觉选择和 selection approval；CLI/headless 只投影同一 Order 契约。默认推荐 3 套场景匹配套餐，整套优先；只有 Compatibility Graph 明确 `compatibleWith` 或提供 adapter 时才允许换件。

## Approved contract 绑定项

在实现、精修和加固中逐项保持：

- 字体 family、实际加载资产与使用到的 weight；
- 图标 family、stroke、尺寸、填充与 optical alignment；
- theme modes、语义 token、surface 层级与 contrast；
- layout regions、密度、间距、圆角、阴影与 overflow；
- component anatomy、variant、交互 affordance 与 hit area；
- loading、empty、error、success、disabled 等状态；
- responsive 转换、long content 与 locale 行为；
- keyboard、focus、a11y 语义；
- motion personality、reduced-motion 与 hover-capability。

若 approved contract 没有定义某项，优先沿用所选 Package/System/Recipe/source family 的默认值，并把需要用户决定的新视觉方向退回 `select`。不要引入“永远不用某种颜色/圆角/动画”一类个人审美绝对规则。

## 提取与回流

- 相同视觉意图在至少 **3 次**真实使用中重复，才可以建议提取为组件、Block 或 token。
- 三次计数是建议门槛，不是自动授权；必须说明共同 API、差异和所有权边界，并由用户决定是否提取。
- 不自动把消费者的临时修补回灌到 UI Lab，也不为了抽象而改写已稳定的业务组件。
- 外部或仓库内看到的风格若值得长期沉淀，转 `$design-ingest`；它只产出视觉 Theme layer，应用级选择仍回到 `select`。
