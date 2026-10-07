# UI Lab 开发流程

新增资产、主题、Recipe 或站点功能从本文进入。产品边界见 [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md)，判断规则见 [CODING_STANDARDS.md](CODING_STANDARDS.md)，操作细节查 [维护参考](docs/engineering/maintenance.md)。

## 1. 确定职责、复用与名字

查询领域登记和 `lib/registry.ts`，确认已有资产能否复用。参考外部实现时先描述职责、结构和行为，再独立确定本项目的中文名、英文名、slug、主导出和接口；记录来源与命名理由。

完成条件：变更说明回答为什么复用、增加变体或新增条目，名字对应什么职责，以及公开契约的兼容影响。新产品流程先更新产品定义，普通资产按现有定义扩展。

## 2. 确定源码与契约边界

| 变更 | 实现与登记入口 |
| --- | --- |
| 组件、区块 | `components/motion/` / `components/agents/` 的既有组织，`lib/registry.ts` 显式声明 `assetRole` |
| 页面区段 | `components/sections/`，`lib/sections/` 与 `lib/section-assets.ts` |
| 完整页面 | `components/pages/`，`lib/pages.ts`；页面骨架仍属于布局知识 |
| 多页组合、外壳 | `components/site-shells/` 或既有外壳，`lib/sites.ts` / registry，引用真实页面 |
| 主题、视觉词汇 | 各领域 `lib/theme-kits.ts` / `lib/styles.ts` / `lib/palettes/` / `lib/atoms/` |
| Recipe | `lib/recipes.ts`，装配协议见 `APPLICATION_KIT.md` |
| 站点功能 | `app/[locale]/`、`components/app/`，不登记为可安装资产 |

站点采用 Next.js 15 App Router、React 19、Tailwind CSS 4、TypeScript strict、motion v11、next-intl v4、Bun 和 Biome；确切依赖读 `package.json` / lockfile。可安装源码采用 React 19、TypeScript、Tailwind CSS 4 和 `motion/react`（需要动效时），Next/Vite/Electron renderer 适配在消费层。新依赖或升级说明原因及验证范围。

完成条件：Token 的主题/系统/私有归属明确，状态、内容、导航与 callback 接口明确，依赖方向符合审查标准；共享契约变化记录 ADR。

## 3. 实现、登记与展示

新增可安装资产同时完成：

1. 源码及必要 helper；交互模块声明 `"use client"`，采用具名导出。
2. `components/previews/<category>/` 活预览及 `components/previews/index.tsx` 注册；站点 locale 和演示控制器留在包装层。
3. 领域登记或 registry：职责、英文名/描述、中文名/描述、源码入口；多文件登记 owned family，变体声明真实安装身份。`new` badge 同时填 ISO 日期 `launchedAt`。
4. `components/examples/<category>/` 独立复制用法，用 `usageFile` 登记，直接 import 安装入口。展示变体通过 `examples[].usageFile` 显式登记自己的用法；复用父用法时也必须能用该变体的窄安装图独立编译。每份用法提供可直接渲染的零参数具名 Example、有意义内容，以及交互职责需要的本地状态和回调；避免固定 DOM id、远程演示资源和仅透传 props 的空包装。全部历史条目已补齐，新资产与新变体遵循同一要求。
5. 发现入口、双语 UI 文案及真实资产关联。新空间还需 locale 路由、`lib/nav.ts` 的 `NAV_SPACES`、首页入口描述和中英文 messages。

Recipe 声明 Profile/System、entry、必装/可选组件、sections、slots、states、responsive、assets、required/forbidden；section 引用真实变体。完整资产示例以 `examples` 关联，不表示组合语义完全等价。

完成条件：预览、用法、源码和安装入口指向同一实现，源码闭包不依赖站点 provider。公开变更更新 Unreleased。

## 4. 同步与验证

Catalog 内容或分发源码变化后运行 `bun run cli:snapshot`，提交快照；sourceVersion 也随源码变化。`check:snapshot` 只校验不写文件，按已提交快照的 origin 重建并比较条目，忽略生成时间；实际部署 URL 由站点检查验证。

提交前运行 `bun run check` 和 `bun run test`；改 CLI 时另运行 `bun run check:cli`。CI 执行这三项，并运行全量 `check:usage` 检查真实安装图下的用法类型、SSR和打包；不自动启动浏览器。当前命令定义读 `package.json`。

`check:architecture` 检查实际安装图的站点/服务端依赖、内部导入是否分发、具名导出、slug 格式、中文元数据、独立用法与 locale 导航。历史缺用法例外已清空，不能新增例外绕过门禁。它不判断语义命名、Token 是否恰当、CSS 完整依赖、计算动态导入、业务行为或视觉质量。

修改用法后运行 `bun run check:usage -- <install-slug>`；展示但不独立安装的变体用 `<parent-slug>-<variant-slug>`。该命令只复制对应安装图到临时目录，校验零参数调用的 strict 类型、Bun SSR 与浏览器打包。加 `--browser` 或运行 `check:usage-browser` 再检查真实 SSR hydration：桌面普通动效、移动宽度 reduce。它共享已安装的外部依赖缓存，使用统一 Graphite 样式环境；不替代真实 shadcn 安装、完整 Profile 构建、样式闭包或视觉批准。验收清单和边界见 [计划007](plans/007-standalone-usage-acceptance.md)。

`check:scroll-lifecycle` 使用已安装Chrome/Chromium和真实Lenis验证滚动引擎切换、子状态保留、原生指标及清理，需要浏览器，单独执行。

| 影响范围 | 额外验证与完成条件 |
| --- | --- |
| 交互、焦点、状态 | 按实际风险补回归，覆盖触发、完成、错误、恢复和键盘操作 |
| 主题、媒体偏好、SSR | 明暗、普通/reduce 两路径；涉及 hydration 时验证实际生产运行 |
| 新资产、共享 import 或依赖 | 在声明支持的独立消费者真实安装、typecheck/build/run；扩展已有 fixture 的受影响场景 |
| 系统或主题安装行为 | `check:system-tokens` 验证补缺、保留和显式替换 |
| 路由、导航、机器端点 | 停 dev → build → start 后运行 `check:catalog-site`，补新增详情和历史深链场景 |
| CLI 来源、Lock、Audit | 根仓回归及 CLI 构建，验证失败无写入、缺 helper 与恢复等路径 |
| Skill | `check:skills`，一次走现有互斥路线 |

高成本门禁按影响执行，不随 `check` 自动运行。Greenfield 仅验证 Graphite/Workbench。现有消费者和站点场景是明确样本；新增资产扩展相关覆盖，不能沿用历史场景数量当作新验收。

完成条件：相关审查规则均有结论，证据注明日期、运行环境、实际解析的依赖版本、场景、结果和未覆盖范围。声明最低版本时补对应版本的消费验证；例如 motion14 消费通过不能证明 motion11 消费通过。失败后修复并复测原路径；工程通过、视觉批准、发布和线上复验分别报告。

## 5. 交付与兼容

修改和验证按任务授权执行；提交用 Conventional 小写前缀和祈使句主题。push、tag、npm 发布及部署按明确授权执行。CLI 构建或快照刷新不等于已发布能力。发布操作查维护参考。

完成条件：变更说明列出实现及验证，公开身份兼容或有明确迁移方案，交付状态与实际 Git/部署状态一致。
