# 104 个历史条目独立用法补齐

日期：2026-10-07。承接[维护复盘](006-maintainability-retrospective.md)中104个历史展示条目的缺口。本文与原始证据记录提交前的实现和验收结果；最新提交状态以 Git 记录为准。未推送、发布或部署。

## 交付范围

| 项目 | 结果 |
| --- | --- |
| 历史主条目 | 104 个，motion 44 / blocks 60，全部登记 `usageFile` |
| 展示变体 | 44 个登记自己的用法；4 个默认变体复用主条目文件 |
| 新增文件 | 144 份：134 个历史安装身份的用法，加10个仅在父条目展示的变体 |
| 全仓用法 | 168 份：原24份区段/页面/整站用法与本次144份 |
| 安装身份 | 保持158个，Catalog保持558项；本轮不增加新的资产身份 |
| 历史例外 | `usageOptional=[]`，非空列表直接阻止架构检查 |

完整登记与逐项说明见[清单](007-standalone-usage-inventory.json)。6组并行实现，每组24份；由其他作者交叉审查全部144份示例，主控统一接入登记、机器详情和验证。

仍采用 shadcn registry 复制源码：安装项分发真实实现和必需 import 图，用法直接引用消费项目里的源码。没有新增 UI Lab 运行时依赖包。站点预览与用法分开；主条目及变体的复制用法读取相应 `usageFile`，自定义 `/r/<slug>` 增加独立 `usage.path/content`，shadcn `/r/<slug>.json` 和 raw 的分发边界保持原契约，用法不会自动作为资产实现安装。

## 用法质量与审查修复

新增用法提供具名零参数入口、中文演示内容、本地状态与实际回调；直接导入对应安装入口，窄变体不借父 barrel。涉及输入、授权、上传、订阅或交易的界面明确演示范围，不暗示已有后端或 Agent runtime。

交叉审查修复了录屏播放槽位缺失、弹窗切换视图后的焦点及 Tab 循环、预测市场买卖单位、圆柱轮播 pointer capture 与子按钮冲突、引用的多实例 ID、任务折叠状态说明、重试位置说明、浮层可访问名称，以及最后一道选择题结果缺失的示例路径。Agent Composer 在用法 capture 阶段保护 IME Enter，保留普通 Enter、Shift+Enter 与按钮提交行为。

StepForm 最后一步为 choice 的旧闭包、Agent Composer 源码 IME 处理及 MorphingModal 的消费方语义/焦点责任没有改成新的公共 API；本轮用法在现有接口内处理这些限制。具体操作系统输入法和完整可访问性验收仍需独立验证。

## 隔离门禁与源码修复

`lib/standalone-usage.ts` 枚举158个安装项和10个展示变体；`check:architecture` 覆盖所有用法、绝对路径/URL、站点依赖及未声明外部包，包含反例回归。新资产不能重开历史例外。

`check:usage` 每项创建独立临时目录，只写该安装项 builder 的源码图；`@/` 只指向该目录。外部依赖缓存共享，但用法直接导入的包必须属于安装声明或 React 基线，内部导入必须解析到本图文件。生成的零参数 Consumer 调用参与 strict 类型检查，再执行 Bun SSR 和浏览器打包。

CI接入全量 `check:usage`，未来新增资产、变体或改动API时同样验证窄安装图下的真实用法，不仅核对登记路径。浏览器检查仍按影响单独执行，不加入低成本根 `check`。

`check:usage-browser` 用真实 SSR HTML 执行 `hydrateRoot`，等待 Consumer effect 的提交标记，捕获 recoverable error、console、pageerror、HTTP失败和 requestfailed。桌面1440普通动效及390宽度reduce各执行一轮，另覆盖按钮提交、开关、抽屉保存、授权允许/拒绝、分步表单完整结果的交互。最终证据明确 verdict、预期/实际数量、全局失败与依赖版本，不以SSR DOM存在代替客户端提交。

全量检查首次发现91个 hydration 失败场景，其中90个在reduce模式、1个为滚轮选择器的 CSSOM 数值精度。安装图内媒体偏好读取统一使用共享 `useHydratedReducedMotion`：内部仍读取 motion hook，用 `useSyncExternalStore` 保持SSR与首次hydration的未知偏好一致，挂载后应用实际偏好；纯CSR直接采用浏览器偏好。117处导入绑定接入该hook，129个安装图自动携带helper，公开props未变。滚轮选择器初始transform使用稳定精度。Motion 11.18.2 已挂载后不实时更新媒体偏好是保留的上游限制。

终审另发现SmoothScroll在偏好解析后替换容器会重新挂载children。已改为稳定wrapper/content及effect管理真实Lenis，只切换引擎；原生路径提供null实例与真实滚动指标。该组件单独监听运行时偏好变化，避免已启用的滚动拦截继续工作。独立浏览器生命周期回归覆盖单次挂载、子状态/DOM保留、偏好往返切换、root/容器的原生滚动、SSR/CSR及cleanup。

独立消费者 benchmark 只复制实际成功安装图及落盘文件支持的用法，保留原24份并扩展到36份；其余132份明确排除，由逐项隔离门禁覆盖，避免新增用法引用未安装资产而破坏原fixture。

## 验证与证据

当前全量基线：168份 strict 类型检查、168份SSR、168份浏览器打包、336个实际hydration场景及10个交互场景通过，React19.2.6、motion11.18.2、TypeScript5.9.3、Chrome154.0.8037.98。SmoothScroll终审修复影响4个用法：scroll-animation、smooth-scroll、scroll-progress、scroll-to；4份strict/SSR/打包及8个浏览器场景复测通过。[当前验证索引](007-evidence/current-usage-verification.json)逐项核对本工作区安装图的所有文件SHA-256与真实被测副本，并核对用法内容，合计168份/336个不重复场景；不沿用已变化源码的旧结果。

| 最终验证 | 结果与证据 |
| --- | --- |
| 根 `check` | 通过：typecheck、lint、158安装项/211源码架构、Registry/Catalog/用法、snapshot及Skill；[日志](007-evidence/check-final.txt) |
| 根测试 | 260 pass / 0 fail，12551断言、33文件；[日志](007-evidence/tests-final.txt) |
| CLI | 独立类型检查和构建通过；[日志](007-evidence/cli-check.txt) |
| Next生产构建 | 通过，1317静态生成项；[日志](007-evidence/build-final.txt) |
| 独立用法 | 168 strict/SSR/打包，336个唯一hydration场景，10个重点交互；[当前源码/用法摘要](007-evidence/current-usage-verification.json) |
| 滚动生命周期 | 真实Chrome与Lenis1.3.23，4 pass / 30断言；[日志](007-evidence/scroll-lifecycle.txt) |
| 生产站点 | 158个JSON/raw及自定义详情用法一致性、439保留路由、中英/明暗/390/768/1440的120场景；[最终结果](007-evidence/site-final-result.json) |
| 历史深链 | 110个历史锚点逐项验证中英文，共220检查；[最终结果](007-evidence/deep-links-final-result.json) |
| Next消费者 | 真shadcn安装、strict Audit及缺helper负例/恢复、typecheck/build/start，129浏览器检查/0error；[结果](007-evidence/next-app-browser.json) |
| Vite消费者 | 同上，真实构建预览，129浏览器检查/0error；[结果](007-evidence/vite-app-browser.json) |
| Electron消费者 | 同上，真实Electron38.2.0/Chromium140.0.7339.133 hidden BrowserWindow/file产物，129检查/0error；[结果](007-evidence/electron-renderer-browser.json) |

三个消费package均为React19.2.0、motion14.0.0、TypeScript5.9.3；Next15.5.18、Vite6.1.0。逐项隔离门禁另使用根motion11.18.2，不能用三Profile的motion14结果冒充最低motion11验证。[消费安装图复核](007-evidence/current-consumer-graphs.json)确认两次实际运行各冻结的14个源码分发图仍与当前builder逐字节一致，SmoothScroll终审修复不影响这些Profile样本。各Profile复制36份用法，原24份全部保留，选择/排除清单见证据目录。

最终库存为128主条目、158安装身份、168用法，缺主条目/变体用法均为0；[统计](007-evidence/completion-counts.json)。CLI快照已刷新，公开slug/export和依赖包版本保持原身份；相关 `sourceVersion` 随SSR及滚动源码修复更新。CI定义已接入隔离门禁，本轮是在macOS本地执行同一命令，不声明远程CI已运行。

根lint保留3处既有Skill配置警告；生产构建保留既有metadataBase与next-intl动态构建依赖警告，不表述为零警告构建。原始审查报告以 `initial-review-*` 保存，发现均在上述用法、架构门禁及生命周期修复中闭环；报告中的初始未通过结论不代表最终状态。截图、trace与完整临时消费者保留在JSON记录的临时证据目录，不全部复制进仓库。工作区原有 `skills-lock.json` 改动和 `.grok/` 未纳入本轮修改。

## 失败保留与验收边界

- 初次隔离compiler未配置项目采用的ESNext lib，导致 JSXPreview 的 `toReversed` 类型检查失败；补齐一致的lib后原路径通过。测试HTML曾缺charset造成中文误解码，修正为UTF-8后通过；原失败证据保留。
- 根typecheck与Next构建并行时命中 `.next/types` 被重建的竞态。构建结束后串行复测门禁通过；这不是源码类型错误。
- 首次生产站点场景出现一次英文/tablet/Workbench的React418；同构建6次定点未复现，全量复测通过。未证明首次失败根因，不据复测声称网站所有异步路径无缺陷。
- Electron postinstall首次下载连接超时。使用历史保存的官方38.2.0归档，重新计算SHA-256并逐字节摘要核对主程序和Framework后，用真实hidden Electron BrowserWindow的file构建产物完成复测，保留原失败。
- 逐项浏览器环境统一使用Graphite/light样式；移动项是390宽度，不代表系统触屏/所有移动浏览器。CSS闭包、全部交互、多实例视觉、Safari/Firefox、字体/媒体资源、系统IME和每项资产在全部Profile里的真实安装未作穷尽证明。
- 三Profile benchmark为明确的36用法/所安装资产样本；工程运行、视觉批准和线上发布分别报告。构建或Audit通过不表示已获视觉批准。
