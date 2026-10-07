# 目录职责、安装身份与依赖闭包分离

日期：2026-10-03。状态：采用；执行范围见计划 005。

七个导航入口表达人的发现方式。历史 `motion` / `blocks` 分类已经成为详情 URL、预览键与安装兼容路径，不适合再充当唯一的领域分类。将数组整体搬到另一个 category 会同时改变这些独立契约，扩大迁移风险。

在 Registry 条目显式声明 `assetRole`：单一界面职责为 `component`，已经组织好的布局为 `block`，完整一屏为 `page`，跨页面共享框架为 `shell`，引用页面与外壳的多页组合为 `site`。保留历史 category 和源码路径，浏览入口消费职责而不是猜文件夹。新完整页面放 `components/pages/`；多页组合放 `components/site-shells/`，引用页面与既有 shell。页面、整站登记分别在 `lib/pages.ts` 与 `lib/sites.ts`，不复制实现。Recipe 继续负责组合约束，与页面源码资产关联。

展示条目和安装变体不是同一个身份。所有展示入口必须有真实 registry item；变体使用自己的 installSlug。没有同名默认变体时，父入口安装完整组件族；已经有同名默认变体时，保留其窄范围安装语义，不发布重复身份。Catalog 为每个真实安装身份生成条目，并提供 `installTargets` 关联展示族。

`sourceFiles` 表达本条目拥有的源码；`installationFiles` 表达真实递归 import 图里的必需文件。可选兄弟变体不进入单独变体的必需图。分发、Catalog 和消费者审计使用同一图，防止仅复制入口文件却漏掉共享 helper。安装协议的 `registry:component` / `registry:block` 是分发形状，不能替代职责定义。

统一 Catalog 是各领域的投影，不替代各领域真源。仅增加 `vocabulary` 和 `reference` 两种只读契约：前者承载词典、布局和滚动知识，后者承载外部参考与来源权利。安装能力只来自真实 registry 目标，外部品牌和词条没有虚构安装命令。Catalog 构建及冻结快照在任何必需领域失败或引用不存在时停止，禁止发布静默缺项结果。

此次保持 config / CatalogLock 的 schemaVersion=1。增量命令必须保留已记录基准；显式来源错误不能在写入命令中改用另一来源。完整重建 Lock 是显式维护动作。新增可选元数据由 CLI 校验并保留；旧已发布 CLI 不代表新源码已对外生效。

取舍：历史路径会与新职责不同，因此必须在浏览、帮助和台账中明确显示兼容关系。无需新增万能资产层，也不因本次迁移恢复 Studio、Order、创建或批准工作流。交互、消费项目工程验收和用户视觉决定分别记录。
