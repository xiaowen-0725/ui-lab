# 独立 SaaS 工程生成与多主题：第一方机制研究

> 后续范围澄清：用户聚焦前端组件、页面与整站资产；本报告的全栈服务/工程生成建议已不属于本轮规格。已核对的外部事实保留，相关主题和源码分发事实仍可参考。


日期：2026-10-07。票：[项目生成与多主题切换有哪些可复用实践？](https://github.com/xiaowen-0725/ui-lab/issues/37)。隔离分支：`research/site-template-reuse`，UI Lab 基准 `bca736ad89052406667e186d7f2b852943064906`。

用户明确的长期目标：基于整站模板一键创建独立可启动 SaaS 工程，支持换主题；页面、外壳和整站可独立安装，提供无密钥示例，统一整站入口按用途筛选。下文研究承接这个目标，不将未来生成器写成当前能力。全文 **fact = 已读源码/官方文档事实，inference = 由事实推导，recommendation = 尚待产品与实现确认的建议**。

## 关键结论

- **fact**：create-t3-app 真正生成基础工程、组合模板与依赖，并可执行安装；UI Lab 的 init 只写 config/CatalogLock，compose/add 只登记与输出安装计划，不生成 package.json、应用入口或执行 shadcn。当前不具备满足上述长期目标的工程生成器。[T1–T5][U1][U0]
- **fact**：当前官方 shadcn init 已可通过 name/template 创建新工程，create 是其别名；因此不能沿用“shadcn 只能给已有工程加组件”的说法。不过完整 SaaS 领域、服务接入、主题适配和验收仍不是 add 一个 UI 条目即可获得。[S1][U0]
- **inference**：可借鉴 T3 的基础工程 + 有限组合安装器，复用 UI Lab 已有 site/page/shell 的源闭包；新增生成层应负责编排工程与消费适配，服务选择应独立于 UI 资产。不要复制整套 T3 服务栈或为每个主题复制一套页面。[T2–T4][U0][U4]
- **fact**：next-themes 可管理任意主题名、持久化一项选择、响应系统偏好并提前写 DOM；它不自动形成品牌 × mode 两维。UI Lab 站点已有 data-theme 品牌色 + dark class，但品牌选择不持久化；Theme Kit 多主题同时作用域输出尚未在当前生成器中实现。[N1][N2][U2][U3]
- **recommendation**：生成时选默认品牌与支持模式，运行时分别保存 brandId 与 modePreference；theme switch 只改变视觉，不重置路由、表单草稿、业务缓存或权限。固定色资产须逐项适配，不能以全局 CSS 替换宣称所有资产兼容。[U0][U5]

## 固定 revision 与许可

| 第一方源 | 本轮固定 SHA / 版本事实 | 已查许可 |
| --- | --- | --- |
| create-t3-app | `4709861f7e67a15564c0460c13e7b4b6cfcae40d`（main）；该 revision 的 cli/package.json 为 7.40.0，未查询或声称 npm latest 等于它。[T0] | [MIT，Copyright 2022 Shoubhit Dash](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/LICENSE) |
| next-themes | `a7eeabc39cfb37d74ea3d82eac674d0e1851b1cb`（main），作为参考源码；不是 UI Lab 安装解析后的具体版本。UI Lab package.json 声明 ^0.4.6。[N0][U6] | [MIT，Copyright 2022 Paco Coursey](https://github.com/pacocoursey/next-themes/blob/a7eeabc39cfb37d74ea3d82eac674d0e1851b1cb/license.md) |
| shadcn/ui | `f56bbd7282f0116a925a601cb6d7e0c3fede448b`（main）；CLI 文档 init 段已与该 SHA 的 MDX 核对。[S0][S1] | [MIT，Copyright 2023 shadcn](https://github.com/shadcn-ui/ui/blob/f56bbd7282f0116a925a601cb6d7e0c3fede448b/LICENSE.md) |
| UI Lab | `bca736ad89052406667e186d7f2b852943064906`；仅本地源码，未推断 npm/生产与其相同。 | [仓库 LICENSE](../../LICENSE) 声明 MIT；具体引用资产仍保留各自 provenance。 |

上游代码如复制/改写应保留相应版权和许可通知，源码引用保留 SHA；本轮没有复制上游产品代码。live 官网文档是 2026-10-07 查询结果，除 S1 的已核对段外，不宣称所有网页内容与该 SHA 逐字一致。

## create-t3-app 真实生成机制

| 机制 | fact：源码观察 | inference / recommendation：可借鉴与不可照搬 |
| --- | --- | --- |
| 选择模型 | CliResults 分开 appName、packages、flags、databaseProvider。交互选择 Tailwind/tRPC、none/NextAuth/BetterAuth、none/Prisma/Drizzle、router、数据库、linter、安装/Git、alias。默认模式与交互初始选择不完全相同。[T1] | 给 UI Lab 建明确且有限的选择模型：site 身份、Stack Profile、服务 profile、品牌、mode、包管理器、目标目录。默认“无密钥可启动”应是单独且真实的默认，不意外选择需 OAuth 的服务。 |
| 非交互 | -y/--default 返回默认组合（NextAuth/Prisma/Tailwind/tRPC/ESLint，默认 appRouter=false）；--CI 则先清空 packages，再按实验 flags 填入。ORM/linter/auth 两两冲突与非法 DB 在 CI 分支警告后 exit(0)。[T1] | UI Lab 若提供自动化接口，必须显式 schema 校验、所有选项有默认、禁交互，非法组合返回非零。不能把 T3 CI 的 exit(0) 当生成成功，也不能把 -y 当“任意选择均可非交互”。 |
| 非空目标目录 | projectDir=resolve(cwd,projectName)；不存在或空目录进入复制；非空目录另行询问 abort/clear/overwrite，并二次确认。该流程在 scaffoldProject 内，即使 CLI 选择阶段跳过提示，目录提示仍可能发生。[T2][T3] | 推荐空目录默认；非交互遇非空直接失败。更新已有项目应走独立差异流程，不能把“创建”变成全目录清理。应检查输出边界、符号链接/路径冲突；本轮未验证 T3 路径安全性。 |
| 基础复制 | PKG_ROOT 相对 dist 定位；npm 发布 files 包含 template。scaffoldProject 从 template/base copySync，_gitignore 改名；基础工程有 dev/build/start/typecheck。[T0][T3][T8] | 随生成器固定版本带最小工程骨架更易回放；不要运行时抓 main。骨架仅含应用入口/工具链，UI 使用已登记源码，不另复制第二份 site 实现。 |
| 组合与次序 | buildPkgInstallerMap 给每项 inUse/installer，envVariables 总启用、DB script 按 mysql/postgres 启用；installPackages 顺序调用安装器。createProject 再选 router 的 layout/page 或 _app/index；无 Tailwind 复制 CSS module。[T2][T4] | 学习分职责安装器和确定次序，不无限开关排列。先校验依赖冲突，再生成 adapters/providers；每个支持组合有实际验收。selectBoilerplate 是显式分支选择，并不是任意插件天然兼容。 |
| 框架与服务 | 基础骨架是 Next.js；auth/ORM/tRPC 是服务/应用基础选项，选择后引入对应依赖与模板。DB container installer 只写 start-database.sh，并未在该函数开通服务。[T4][T8][T9] | UI Lab 的 next-app/vite-app/electron-renderer 是前端运行 Profile；auth/db/billing/remote API 等另成服务 profile，不把 Vite 等同全栈服务。没有业务 SaaS 后端需求时使用本地样例 adapter。 |
| 依赖与版本 | addPackageDependency 使用静态 dependencyVersionMap，写 package.json 并排序；有确切版本（如 auth beta）也有 ^/~ 范围，基础 Next/React 同样是范围。顶层写 ct3aMetadata.initVersion，除 Bun 外记录实际包管理器版本。[T5][T8] | “固定生成器 revision”和“锁住依赖解析结果”是两种保证。建议明确 generator/site/source revision、实际 PM/version、依赖版本和 PM lockfile。UI Lab CatalogLock 不能替代 package lock。 |
| 安装与 noInstall | main 在生成源码后调用 PM install；noInstall 跳过依赖安装、Prisma generate 和格式化，源码/依赖声明仍已写入。PM 由 npm_config_user_agent 推断，无值默认 npm；支持 npm/pnpm/yarn/bun。[T5] | UI Lab 应允许生成但跳过联网安装，并明确“未安装”与“可启动已验收”的区别。若允许实际安装，用执行参数数组、固定 cwd、阶段错误，不把输出命令当完成。 |
| 外部配置 | envVars installer 生成 .env/.env.example 及按组合选择 env schema；auth secret 写实际 .env、样例不含该 secret；OAuth 字段为空，数据库 URL 依 provider。没有 auth/db 时只是示例注释。[T6] | 无密钥启动 profile 必须不要求真实服务凭据；另提供可选生产 adapter 的 env schema/说明，不替用户开通服务、不将 mock 权限作为真实授权。 |
| 失败路径 | 取消/非空目录 abort exit(1)，顶层 catch 记录并 exit(1)；已读流程没有 staging/自动回滚。npm install await execa；pnpm/yarn/bun spinner helper 监听 error 与 close，close 时 resolve，未显式检查 exitCode。[T1][T3][T5] | 不能保证全部 PM 的失败准确上报；需要实测，报告不声称该代码已发生故障。UI Lab 推荐按阶段记录失败、检查退出码，保留可诊断输出；只清理由本次创建并拥有的临时目录，不回滚消费者原文件。 |

**fact**：上述过程中的“installPackages”主要生成样板并写依赖，真正 PM 安装在顶层后续阶段；生成文件成功不代表 OAuth、数据库或应用运行成功。noInstall 也不等于完全不调用包管理器：除 Bun 外，顶层仍运行 PM -v 以写 packageManager 字段，生成环境须具备对应命令。[T2][T4][T5][T6]

## shadcn 官方契约与 UI Lab 当前边界

| 能力 | 官方 fact | UI Lab fact / 差异 |
| --- | --- | --- |
| init/new project | init 配置依赖、cn、CSS，支持 name/template；create 是别名；base 可选不同原语。[S1] | cmdInit 只验证 Profile、system、adopt/replace 与 config 覆盖规则，再写 config/lock。不是 shadcn init 的同等执行。[U1] |
| add/registry | add 写入组件/依赖，文档提供 overwrite 与 dry-run/diff；registry item 描述文件、包依赖、registry 引用、theme CSS 等。[S1][S2] | cmdAdd 只登记并打印命令；source family 的安装是外部 shadcn 操作。现有 source graph 提取外部包名，不因此证明版本固定。[U1][U4] |
| theme | 官方主题使用语义 CSS variables 和明暗 selectors；Tailwind 4 用 @theme inline 暴露 token。[S3] | buildThemeItem 输出 cssVars-only registry:theme，包含 kit light/dark/statics、无页面/provider；themeKitToCss 输出一个 kit 的 :root/.dark。多 kit 原样拼接会竞争相同 selector，而不是自动形成品牌切换。[U2] |
| compose/lock | registry 可表达源码依赖；不能由此推断领域流程或后端服务已实现。[S2] | compose 验证 recipe/profile、登记 components、打印计划；增量 lock 保留既有 contract 基线，显式 lock 才重建。这是 Catalog provenance，不是依赖安装/升级或完整工程成功记录。[U1] |

**recommendation**：若选 shadcn 作为工程底座，也应固定 CLI 版本、模板与原语选择，再消费 UI Lab registry；不让默认“最新 base”偷偷引入另一套原语。工程层仍要挂载正确的 site、路由/导航、demo adapters、主题 provider、字体资源与运行命令。CLI README 存在落地页 shell“future asset”等陈旧表述，本轮以 PRODUCT_DEFINITION、registry 和实际 CLI 源码为准，不把 README 文案当不存在的证据。[U0][U1][U4]

## next-themes 能力与品牌 × mode

**fact**：已读固定 revision 的 README、src/index.tsx、src/script.ts。Provider 有 themes、storageKey、attribute、defaultTheme、enableSystem、enableColorScheme、value、forcedTheme 等；theme 是一项状态，system 解析为 light/dark。源码可对 attribute 数组写相同主题名，但这不提供两项独立状态；嵌套 provider 检测到已有 context 后直接透传 children。[N1][N2]

**fact**：存储使用 localStorage，写入异常被捕获，并监听 storage 实现跨标签变化；SSR 的 getTheme 返回 undefined。ThemeScript 内联读取存储/系统偏好，在 hydration 前设置 html；suppressHydrationWarning 只用于相关节点，不修复基于未挂载主题值生成的不同业务 DOM。官方建议挂载后才显示依赖主题值的控件。[N1][N2]

**fact**：源码只有已解析名称等于 light/dark 时自动设置标准 color-scheme；传入 graphite 等品牌名不会自动表达其明暗。value 映射主要用于 DOM 名称，当前 script 与 effect 对 data-* 映射处理存在差异：script 写原 theme，effect 写映射后的 name，采用该能力时须做首帧实测。[N2]

**inference**：把 themes 设成 graphite/nightflight/light/dark 是单维选择，不是 graphite-dark、graphite-light 两套独立能力；也不能嵌套两个 next-themes provider 分别控制品牌和模式。推荐保留一个 provider 专管 mode，品牌由另一项明确的消费应用状态控制。组合名称编码方案也可研究，但会新增系统解析、color-scheme、迁移复杂性。[N2]

UI Lab 已有事实：

- [站点 ThemeProvider](../../components/app/chrome/theme-provider.tsx) 使用 class、defaultTheme=dark、enableSystem、enableColorScheme=false；[站点切换按钮](../../components/app/chrome/theme-toggle.tsx) 挂载后展示并切 light/dark。[U3]
- [PreferencesProvider](../../components/app/preferences/preferences-provider.tsx) 持有 colorTheme，以 effect 写 data-theme；注释及行为明确不持久化、刷新默认。lib/themes.ts 输出品牌 light 与 .dark[data-theme] selectors；这是站点色彩样本，不是所有 Theme Kit 的消费者协议。[U3]
- [可分发 ThemeToggle](../../components/motion/theme-toggle.tsx) 直接 useTheme，调用 setTheme(light/dark)，含挂载/减少动效/View Transition 降级。它不是自带 provider 的品牌选择器，消费者需配置 provider；本轮只读接口与 hook 段，不评价全部动效。[U3]
- graphite kit 有双模式，其他 design-system 派生 kit 原生单模式；缺失模式的 CSS/registry 载荷回退同一套值，不会自动合成另一个模式。statics 含字体栈、字号/间距/圆角/动效，切换 kit 也可能改变布局。[U2]

## 可借鉴契约（recommendation，非当前新增产品对象）

### 全站生成层与服务 profile

建议将流程定为：**规范化选择 → 验证有限组合与目录 → 生成前端骨架 → 安装真实 site/source family → 注入消费 adapters/主题与入口 → 可选依赖安装 → 消费者验证 → 交付状态**。这里是职责分层建议，不定义未经实施的 CLI 命令或重新引入退役 Studio/Order/Evidence 流程。[U0][T1–T5]

| 契约 | 建议内容 |
| --- | --- |
| 输入与可重放 | siteSlug/源码修订、Stack Profile、服务 profile、品牌/modes、locale、PM/version、目标目录、install 选择；交互与非交互共享一份校验。记录实际选择及 revision，不能只记录 latest URL。 |
| 工程输出 | 独立 package.json、正确入口/路由、tsconfig alias、Tailwind/PostCSS、components.json、字体/静态资产、provider、README/env 示例、lockfile（实际安装后）；页面/外壳/整站仍保留独立安装身份。 |
| UI/业务分离 | source family 复用既有真实实现；服务 profile 只产 adapter/provider/env schema 与业务连接说明。UI Props 接 data/content/locale/callback，不能 import Catalog preview 或 UI Lab 站点 preferences provider。 |
| 无密钥 profile | 本地数据与状态可走完整 UI 主路径，刷新/存储语义明确；实际 auth/db/billing 为显式选择的 adapters，未配置时不伪装真实服务。生成与开通/迁移/部署分别授权和报告。 |
| 支持矩阵 | template × Profile × service × brand/mode × locale 有明确支持/禁止范围。不要从已有 Profile 声明推断任何 SaaS 整站在三种运行时全部启动通过。 |
| 失败与升级 | 创建默认拒绝非空目录；依赖/生成/验证错误返回非零并指出阶段，完整成功须有启动验收。恢复/重试以本次产物范围为界，不能自动覆盖已有用户业务文件。 |
| 交付判据 | “文件已生成、安装已完成、build通过、启动与交互通过、视觉批准”分别记录；一键是自动编排目标，不降低这些判据。目标可运行不意味着真实支付/权限安全已验证。 |

依据：T3 原始步骤的优势与失败边界、UI Lab 当前 source/业务分离规则。[T2–T6][U0][U4]

### 品牌、mode、持久化与 SSR

建议消费工程显式持有两项值：**brandId**（已知 kit 或用户品牌）与 **modePreference=light|dark|system**，另计算 resolvedMode。创建时的默认值与运行时偏好分开。

1. **CSS 输出**：建立品牌作用域，例如 html[data-brand="graphite"] 与 html[data-brand="graphite"].dark；每个 brand 输出完整 shadcn/状态/wb/chart token 及 statics。保留现有 dark class 以兼容 dark utilities；不把多个 :root/.dark 载荷直接相加。token 对齐、CSS 优先级与载荷大小需实施验收。[U2][S3]
2. **单模式策略**：明确禁用不支持的 mode、使用标注的 fallback kit，或另设计双模式变体；不能把 dark 复制给 light 标作双模式。用户选择品牌不应悄悄改写 mode 偏好。[U2]
3. **存储与首帧**：mode 可借 next-themes 的独立 storageKey 和预绘制脚本；brand 需单独持久化、枚举校验、删除/旧 slug 迁移、读取失败回退、跨标签同步与预绘制 DOM 初始化，不能只在 useEffect 设置。CSP nonce、生产脚本顺序、CSS 加载与无 JS fallback 均要实测。[N2][U3]
4. **服务器一致性**：localStorage 的值不能在 SSR 得知。纯视觉采用 CSS selectors，主题控件保持稳定占位直到 mounted；若业务需要服务端 tenant 品牌，用服务器可读配置或 cookie 与客户端一致优先级，并考虑缓存维度。这是建议，next-themes 本身不自动写 cookie 或同步服务端。[N1][N2]
5. **防闪烁限制**：提前脚本只解决被其控制的 DOM 属性，不保证懒加载 CSS/字体、品牌 effect、固定色资产、系统偏好未知、CSP 阻止脚本等路径。不能将 suppressHydrationWarning 当防闪烁或全树 hydration 修复；不因切品牌给整站换 key 而丢失草稿。[N2][U5]
6. **原生色彩与资产**：为 resolvedMode 明确 color-scheme、logo/图片/图表与字体 fallback。站点的 enableColorScheme=false 不是所有生成工程都适合的默认。图表色只是 token，运行时图表/Canvas/外部组件是否更新要分别验证。[U2][U3]

### 用户定制与升级边界

建议 CSS 分层为 **上游 kit 基线 → 明确的业务品牌差异 → 用户覆盖**，每层有作用域与所有权。状态色（success/warning/danger）、文字对比、工作台 token、图表色、字体和密度都属于契约；只换 primary 不能承诺整站换主题。[U0][U2]

- 生成时 vendor 的 UI 源码可被用户修改；更新默认给差异与冲突，不自动重新 add --overwrite。生成器骨架、服务 adapter、UI 源码、主题 token 分开升级。
- 记录原始 sourceVersion/contractHash 与本地偏差；CatalogLock 保持已有基线是 provenance，不是本地修改等价证明或三方合并能力。[U1]
- 主题切换不覆盖用户 CSS/局部业务样式；显式主题安装的替换语义与运行时品牌选择要分开。用户新增 token 应先定明暗语义与暴露方式，不复制全局 kit 到每个组件。[U0][U2]
- 已审计的 Sidebar/Paywall 固定浅色、Billing 固定暗色；先建立品牌/mode 兼容表并修复/新增同职责变体，再承诺支持。保留历史 slug/URL/安装身份；不要为了生成器批量重命名或复制资产。[U5][U0]

## 需要 HITL 明确的决定

1. “独立可启动 SaaS”首期指无密钥演示工程、接现有 API 的前端工程，还是含 auth/db/payment 的全栈？真实服务的最小范围与凭据是谁负责？
2. 首期支持 Next/Vite 哪些 Profile，是否确有 Electron SaaS 需求？一键默认包管理器、安装/Git行为、非空目录规则是什么？
3. 全站用途与页面集合如何定义；现有 Agent site 语义能否吻合？统一入口筛选和生成能力怎样关联，哪些模板进入可生成支持矩阵？
4. 品牌切换只改颜色还是含字体、密度、圆角和动效？所有品牌是否必须双模式，单模式品牌如何处理？
5. 偏好是每设备、用户还是组织级？租户品牌与个人 mode 优先级、cookie/账户同步、用户覆盖与升级冲突由谁控制？
6. 谁在真实消费者确认明暗首帧、移动、键盘、字体、业务状态保持与最终视觉？未验收组合如何在 UI 上表达？

## 已查与未验证范围

已按 research 技能读取第一方 source/官方文档；后台研究代理未递归 spawn。读取研究票正文，以及之前已读 AGENTS/PRODUCT_DEFINITION/APPLICATION_KIT/CODING_STANDARDS 的边界，本轮补读真实 CLI/lock、Theme Kit/registry 输出、站点 providers/品牌 selectors 与 theme-toggle 关键段。

create-t3-app 已查：入口、CLI 选择/默认/CI/取消分支、createProject/scaffoldProject/installPackages/selectBoilerplate、安装依赖 helper、installer map、版本表与 addPackageDependency、包管理器识别、envVars、Tailwind 与 DB script installer、路径解析、consts、基础和 CLI package.json、LICENSE。未逐一阅读 auth/ORM/tRPC 实现、每个模板、Git/格式化完整实现或上游测试；不声称全部组合无缺陷。

next-themes 已查固定 revision README、index.tsx、script.ts、license；未跑其测试、未核对 npm 已安装产物。shadcn 已查官方 CLI/registry/theming 文档、固定 MDX 的 init/add 段与 license；未审计 shadcn CLI 执行源码，不声称各版本行为完全一致。

未安装或运行任何生成器、新工程或服务；未执行 UI Lab create（不存在）、CLI compose/audit、build/tests、消费者独立安装、浏览器、SSR 首帧、CSP、持久化/跨标签、主题兼容/对比度/视觉验收。没有 commit/push、GitHub 写操作或批准记录。本报告给主代理形成新产品定义与后续验收任务，不代表目标已经实现。

## 来源索引

以下代码链接固定 SHA；本地链接对应报告开头 UI Lab 基准。

- [T0] [T3 CLI package.json](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/package.json)、[consts](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/consts.ts)。
- [T1] [T3 CLI 选择与非交互](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/cli/index.ts)。
- [T2] [createProject](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/helpers/createProject.ts)、[parseNameAndPath](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/utils/parseNameAndPath.ts)。
- [T3] [scaffoldProject](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/helpers/scaffoldProject.ts)。
- [T4] [installPackages](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/helpers/installPackages.ts)、[installer map](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/installers/index.ts)、[selectBoilerplate](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/helpers/selectBoilerplate.ts)。
- [T5] [主流程](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/index.ts)、[installDependencies](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/helpers/installDependencies.ts)、[dependencyVersionMap](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/installers/dependencyVersionMap.ts)、[addPackageDependency](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/utils/addPackageDependency.ts)、[getUserPkgManager](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/utils/getUserPkgManager.ts)。
- [T6] [envVars](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/installers/envVars.ts)。
- [T8] [base package.json](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/template/base/package.json)、[Tailwind installer](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/installers/tailwind.ts)。
- [T9] [dbContainer installer](https://github.com/t3-oss/create-t3-app/blob/4709861f7e67a15564c0460c13e7b4b6cfcae40d/cli/src/installers/dbContainer.ts)。
- [N0] [next-themes 固定仓库 revision](https://github.com/pacocoursey/next-themes/tree/a7eeabc39cfb37d74ea3d82eac674d0e1851b1cb)。
- [N1] [官方 README](https://github.com/pacocoursey/next-themes/blob/a7eeabc39cfb37d74ea3d82eac674d0e1851b1cb/next-themes/README.md)（根 README.md 是指向此文件的链接）。
- [N2] [Provider/存储/SSR 实现](https://github.com/pacocoursey/next-themes/blob/a7eeabc39cfb37d74ea3d82eac674d0e1851b1cb/next-themes/src/index.tsx)、[预绘制 script](https://github.com/pacocoursey/next-themes/blob/a7eeabc39cfb37d74ea3d82eac674d0e1851b1cb/next-themes/src/script.ts)。
- [S0] [shadcn 固定仓库 revision](https://github.com/shadcn-ui/ui/tree/f56bbd7282f0116a925a601cb6d7e0c3fede448b)。
- [S1] [官方 CLI 文档](https://ui.shadcn.com/docs/cli)、[固定 MDX](https://github.com/shadcn-ui/ui/blob/f56bbd7282f0116a925a601cb6d7e0c3fede448b/apps/v4/content/docs/(root)/cli.mdx)。
- [S2] [官方 registry item 文档](https://ui.shadcn.com/docs/registry/registry-item-json)。
- [S3] [官方 Theming 文档](https://ui.shadcn.com/docs/theming)。
- [U0] [PRODUCT_DEFINITION](../../PRODUCT_DEFINITION.md)、[APPLICATION_KIT](../../APPLICATION_KIT.md)、[CODING_STANDARDS](../../CODING_STANDARDS.md)。
- [U1] [CLI index：cmdAdd L442、cmdInit L595、cmdCompose L665](../../cli/src/index.ts)、[增量 CatalogLock L167](../../cli/src/project-lock.ts)。
- [U2] [Theme types](../../lib/theme-kits/types.ts)、[compose](../../lib/theme-kits/compose.ts)、[CSS](../../lib/theme-kits/css.ts)、[registry theme item L354](../../lib/registry-server.ts)。
- [U3] [站点 ThemeProvider](../../components/app/chrome/theme-provider.tsx)、[站点 ThemeToggle](../../components/app/chrome/theme-toggle.tsx)、[PreferencesProvider](../../components/app/preferences/preferences-provider.tsx)、[品牌 selectors](../../lib/themes.ts)、[分发 ThemeToggle](../../components/motion/theme-toggle.tsx)、[全局 CSS](../../app/globals.css)、[locale layout](../../app/[locale]/layout.tsx)。
- [U4] [registry 身份](../../lib/registry.ts)、[source graph/item 输出](../../lib/registry-server.ts)、[SITES](../../lib/sites.ts)。
- [U5] [同 worktree 已有资产审计](2026-10-07-site-template-reuse.md)，并见其中直链的 Sidebar/Billing/Paywall 源码。
- [U6] [UI Lab package.json](../../package.json)。
