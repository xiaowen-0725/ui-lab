# 组件实验室（UI Lab）— Agent 指南

中文优先、中英双语的可视 Catalog 与 AI-first 可组合前端资产系统。产品北极星、当前能力和已退役对象以 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md) 为唯一真源。

## 按任务读取

| 任务 | 必读材料 |
| --- | --- |
| 新增组件、区块、页面、整站、主题、Recipe 或站点功能 | [CONTRIBUTING.md](CONTRIBUTING.md) 的开发流程，以及 [CODING_STANDARDS.md](CODING_STANDARDS.md) 的相关规则 |
| 参考或复刻外部实现 | [CODING_STANDARDS.md](CODING_STANDARDS.md#语义与命名)：先独立定义职责与名字，保留来源和许可；公开身份调整单独做兼容迁移 |
| 分类、安装身份、source family 或依赖方向变化 | 产品定义的分类原则、[CONTEXT.md](CONTEXT.md)、[ADR 0002](docs/adr/0002-catalog-roles-and-install-identities.md) |
| CLI、装配、Lock 或 Audit | [APPLICATION_KIT.md](APPLICATION_KIT.md)、[cli/README.md](cli/README.md) |
| 路由、国际化、分发、服务、快照或发布操作 | [维护参考](docs/engineering/maintenance.md) 的对应分支 |
| 修改 Skill | 对应 `skill/<name>/SKILL.md`，随后运行 `check:skills` |
| 审查代码 | [CODING_STANDARDS.md](CODING_STANDARDS.md)；将需求符合性与规范符合性分别给出结论 |

## 工作边界

- 新增资产先查询已有登记。复用同一真实实现；职责用 `assetRole`，保留历史 category、URL、源码路径及安装身份。
- 站点实现与可分发源码分开；站点 Next/next-intl 能力留在包装层，消费者以 props/回调适配业务和导航。
- 未来产品流程先定义再实施；当前对象及退役边界查产品定义。测试、Audit、截图和 Agent 判断只说明实际验证范围，用户视觉批准与发布分别记录。
- `skills-lock.json`、`.grok/` 等任务外改动保留，不覆盖、清理或夹带提交。

## 验证与交付

命令定义读根 `package.json`。提交前运行 `bun run check`、`bun run test`；改 CLI 源码另运行 `bun run check:cli`。Catalog 内容或分发源码变化后刷新并提交 CLI 快照。高成本站点、独立消费者及安装验证按 [开发流程](CONTRIBUTING.md#4-同步与验证) 的影响范围执行。

**dev 与 build 共用 `.next`：生产构建前先停 dev。** 独立 `benchmarks/runs/*` 使用各自工具链，不在根 TypeScript/Biome 扫描范围。

未发布 CLI 用 `bun cli/src/index.ts`，调用前核对真实帮助；本地实现、提交、npm 发版与生产部署分别报告。推送、tag、npm 发布和部署按明确授权执行。提交采用 Conventional 小写前缀、祈使句主题；值得记录的变更写入 Unreleased。
