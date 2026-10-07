# 目录调整与红队问题验收台账

2026-10-03。**阶段0–5本地工程验收通过，R1–R8全部闭环。** [验收报告](005-acceptance-report.md)／[实施计划](005-catalog-realignment-implementation-and-acceptance.md)／[649条迁移清单](005-asset-migration-inventory.csv)／[独立最终准入](005-evidence/final-independent-acceptance.md)。

本台账是工程管理记录，不是产品批准状态机。统筹负责共享契约、全量集成与最终准入；Hume负责CLI来源/Lock，Herschel负责模态，Planck负责区段/页面/多页源码，Boole负责标准轴，Archimedes负责规格轴及最终独立复核。消费者fixture由Wegener/Rawls建立，任务中断后统筹接管剩余实际复测。所有代码均处于未提交工作区，基线a00c627；最终产品文件哈希见source-manifest.json。

## 阶段关卡

| 阶段 | 实施准入 | 验收准入 | 退出证据 |
| --- | --- | --- | --- |
| 0 基线与契约 | 通过 | 通过 | ADR0002；595基线ID保留，649条归属/来源/身份/旧新URL/回滚 |
| 1 现行缺陷 | 通过 | 通过 | 全158安装target有效；模态安装消费；Skill真实查询 |
| 2 变化及失败隔离 | 通过 | 通过 | Lock旧基准保持/显式重建；来源负向零写入；主题真实补缺/替换 |
| 3 全量目录归位 | 通过 | 通过 | 558投影一致；439旧新路由中英；110原始锚点中英220定位 |
| 4 页面与整站实例 | 通过 | 通过 | 19区段、4页、1多页组合，24用法；Next/Vite/实际Electron运行 |
| 5 集成与独立验收 | 通过 | 通过 | check/232tests/build/CLI/Greenfield8E2E，120站点场景，独立两轴+准入 |
| 6 发布及线上复验 | 未进入 | 未进入 | 没有commit/push/tag/npm/Vercel发布；需明确授权后执行 |

## 红队修复闭环

修复版本统一为当前工作区，以[source manifest](005-evidence/source-manifest.json)精确识别；首验历史保留在下方，不用后续通过改写旧失败。

| ID | 问题及状态 | 实施者/独立复审 | 首验/失败 | 复测及最终证据 |
| --- | --- | --- | --- | --- |
| R1 | 安装身份断链：工程通过 | 统筹 / Archimedes | 原7父入口不存在；契约2fail | 158JSON+raw全部有效；父族/base真实安装；无效Recipe section拒写。[HTTP](005-evidence/site-result.json)、[spec](005-evidence/spec-retest.md) |
| R2 | 模态焦点/背景：工程通过 | Herschel、统筹 / Archimedes | 初始focus/嵌套/原生showModal回归失败 | 27DOMtests；真实安装消费的Tab/Shift-Tab、嵌套Escape、inert、恢复、触摸拖动、reduce通过。[安装消费](005-evidence/modal-consumer-result.json) |
| R3 | 完整页/整站缺口：工程通过 | Planck、统筹 / Boole、Archimedes | 复制Usage/provider、Recipe无关联；consumer hydration | 19区段/4页/1site；24provider-free用法；三Profile均129检查/66截图/0error，实际Electron38.2 file renderer。[消费者记录](../benchmarks/runs/catalog-assets/ACCEPTANCE.md) |
| R4 | AI知识/错误查询：工程通过 | 统筹 / Archimedes | list --kind block错误；页面重复 | 558投影、649对账、7入口、双语、模板别名、无虚构参考安装；Skill门禁。[Catalog门禁](005-evidence/root-check.txt) |
| R5 | 闭包/审计分歧：工程通过 | 统筹 / Archimedes | 必需helper未检出；TS路径/.js/string误报漏报 | owned/closure分开；消费者TS AST、extends/references解析；三Profile删helper exit1、恢复exit0、独立构建通过。[spec](005-evidence/spec-retest.md) |
| R6 | 增量Lock改旧基准：工程通过 | Hume、统筹 / Archimedes | 上游变化+无关add覆盖旧基准 | 旧hash/sourceFiles/provenance保留，重复幂等，stale可见，显式lock重建；CLI integrity真实HTTPfixture。[测试](005-evidence/root-tests.txt) |
| R7 | 来源失败/部分数据：工程通过 | Hume、统筹 / Archimedes | 显式失败回退写；无效section仍写Lock | 超时/404/畸形/缺失/坏引用零写入；只读回退标源；builder fail closed。[spec](005-evidence/spec-retest.md)、[测试](005-evidence/root-tests.txt) |
| R8 | 系统/主题覆盖：工程通过 | 统筹 / Archimedes | 共享系统原theme覆盖语义 | registry:lib补缺，直装/间接保留自定义两态，显式Theme替换，重复幂等；shadcn4.21.1。[独立复核](005-evidence/r8-review.md) |

## 最终集成及视觉边界

- 根仓check退出0，保留3条原有技能模板warning；232pass、0fail、11120assertions；生产build通过；CLI typecheck/build及构建产物行为通过，558快照/live/source一致。
- 1231 HTTP请求、158JSON+158raw、14主题CSS、439旧新可视路径中英通过；120浏览器场景涵盖中英/深浅/390/768/1440，0pageerror。110条台账原始query/hash×中英的220锚点均存在、URL保持、目标进入viewport，0error。[站点](005-evidence/site-result.json)／[深链](005-evidence/deep-links-result.json)。
- Next/Vite/实际Electron38.2.0分别独立package，真实shadcn4.21.1安装、同dir CLI链、strict audit/helper负向恢复、typecheck/build、runtime通过。共387检查/198截图；不是387个独立资产。Electron官方archive SHA256严格匹配，实际Chrome140 file renderer；Next/Vite Chrome154。[Next](005-evidence/next-app-browser.json)／[Vite](005-evidence/vite-app-browser.json)／[Electron](005-evidence/electron-renderer-browser.json)。
- Greenfield完整verify通过，8E2E；声明范围为原Graphite/Workbench。模态真实安装消费keyboard/CDP touch/normal+reduce通过；物理iOS Safari及Firefox/WebKit未执行，不冒称全浏览器认证。
- 人工视觉检查：统筹实际查看中文手机站点、英文暗色桌面Next工作台、英文手机Electron工作台以及SaaS站点完整截图；未观察到遮挡主要内容、横向溢出或主题错位。其余自动截图作为工程证据；没有宣称全库逐变体人工视觉通过。用户视觉批准未作，字体/图片和Recipe全面视觉fidelity不由Audit推断。
- 独立标准轴原P2/P3、规格轴E1–E4、附加hydration/锚点和R8修复均有复审/复测记录；最终准入不替代发布。预存skills-lock.json/.grok未覆盖或夹带。

## 历史执行记录

以下是各次首验/复测当时的状态；历史“待验收”不覆盖顶部最终表。

## 2026-10-03 首轮契约回归

- R1/R5：`bun test tests/catalog-contract.test.ts`，修复前 2 fail；修复后 2 pass、22 assertions、退出码 0。7 个父入口真实构建，button-base 独立身份与依赖闭包成立。尚未覆盖实际 shadcn 消费者安装，不关闭问题。
- R7：必需 Catalog builder 改为 fail closed，并校验唯一身份和 related 引用；CLI 显式来源负向回归由 Hume 执行。
- 采用职责及安装契约：[ADR 0002](../docs/adr/0002-catalog-roles-and-install-identities.md)。

## 2026-10-03 系统与来源回归

- R8：`bun scripts/verify-system-tokens.ts` 退出码 0。实际 shadcn **4.21.1** 安装：系统直装保留 light/dark 自定义值并补缺、重复安装 CSS 不变、settings-panel 间接依赖保留主题并补缺、显式 theme-graphite 替换、自定义主题后再次补缺不改变 CSS。原始消费者及日志 `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-system-tokens-Tn5XJ9`；新增可复跑命令 `bun run check:system-tokens`。仍需独立复审，暂不最终关闭。
- R6/R7：Hume 完成 13 个真实 CLI/HTTP fixture 测试、234 assertions；写入命令显式来源失败不写 config/lock，只读查询允许注明来源的回退，增量 add/compose 保留旧基准，显式 lock 才重建。统筹集成复测中。
- R5：`bun test tests/installation-audit.test.ts` 修复前 1 fail，修复后 1 pass、3 assertions；独立 add 的 button-base 缺少 lib/ease.ts 可被发现，补齐后通过，无需 Recipe 才触发。


## 独立复审与集成回归

- 标准轴：P2复制用法依赖站点provider、P3中文预览标签未翻译，分别整改；24个provider-free示例SSR及中英6项标签复测关闭。[首审](005-evidence/standards-initial.md)／[复测](005-evidence/standards-retest.md)。
- 规格轴：E1实际import解析误报漏报、E2无效Recipe区段仍写入、E3Recipe与完整资产无关联、E4页面重复展示；全部整改并以原夹具和新增负向场景关闭。[首审](005-evidence/spec-initial.md)／[复测](005-evidence/spec-retest.md)。
- 根仓全量232pass/0fail/11121assertions；CLI typecheck/build退出0。根仓新增低成本check:catalog纳入check；全安装身份/原始领域投影/649映射/Usage依赖/导航唯一归属作为持续门禁。
- Greenfield：先前缺少Playwright Chromium导致8场景未启动；显式复用已安装Chrome后 `UILAB_BROWSER_CHANNEL=chrome bun run benchmark:greenfield` 完整通过（8E2E）。不改样本验收标准，不冒充物理iOS Safari。
- HTTP/site首验：158 JSON+158 raw及14主题/双态CSS、所有台账旧新可视路由中英已通过；测试器误把CSS当HTML、networkidle等待外部请求导致超时，修测试器并保留失败。实际120浏览器场景发现reduced-motion下3种新详情React418，未标通过。
- F-HYDRATION：ActionSwapText与StatefulButton TextSlot按媒体偏好切换DOM；服务端不能知道偏好。修复为保持文字节点结构，reduce只改变透明度variant并清除级联延迟；ripple容器结构稳定，生成事件继续门控。根仓/生产站点/消费者重新验收中。


## 2026-10-03 生产站点及实际安装复测

- F-HYDRATION：生产重建后 `bun run check:catalog-site` 退出0。1231个HTTP请求、158 JSON与158 raw、14ThemeKit/CSS、439旧新可视路由中英，source/live/snapshot 558条一致；120场景涵盖中英、深浅、390/768/1440和reduce；36截图，浏览器pageerror为0。Chrome154.0.8037.93。[实际结果](005-evidence/site-result.json)，[hydration独立复核](005-evidence/hydration-review.md)。
- R2：`bun scripts/verify-modal-consumer.ts` 真正shadcn4.21.1安装Drawer/BottomSheet到独立React package，消费者typecheck和Bun browser build均通过；native :modal、focusentry、Tab/Shift-Tab、inert/背景focus拒绝、nestedEscape、launcherrestore、实际CDP touchStart/touchMove/touchEnd拖动、normal/reduce均通过。首轮reduce touch失败为前一轮退出动画未清理时立即重开；等待closed dialog卸载、重新检查entryfocus后原场景通过，未改产品。[实际结果](005-evidence/modal-consumer-result.json)。环境为触摸模拟Chrome，不是物理iOS。
- Rawls任务中断后，统筹接管消费者fixture的剩余复测；保留原失败。F-CONSUMER-FIXTURE：mobile summary选择器匹配5项，改为导航summary明确名称；FAQ首项默认open，测试应断言toggle而非每次必open；favicon404通过fixture显式空data icon补齐，没有过滤控制台/pageerror。Next/Vite重新安装/完整构建/真实浏览器通过，分别129检查、66截图、0错误。此前React418未再出现。[Next](005-evidence/next-app-browser.json)／[Vite](005-evidence/vite-app-browser.json)／[全部命令](005-evidence/consumer-next-vite-commands.json)。
- 两个Profile都运行同一 `--dir` 的init→compose→add→lock→audit(strict)，实际安装父button/独立button-base/4完整页/多页site/Recipe核心组件、真实ThemeKit；删除lib/ease.ts严格audit退出1，复原退出0。owned与closure对账、24provider-free Usage compile、独立package typecheck/build均通过。未把消费者数据/业务回调编入registry源码。
- Electron38.2.0 postinstall连接超时为环境失败；正在下载官方GitHub release并校验官方SHA-256。只有实际hidden BrowserWindow/file renderer通过后才关闭跨Profile准入。


## 最终补充关闭记录

- Electron：实际38.2.0/Chrome140 hidden BrowserWindow/file renderer，129检查/66截图/0error，官方SHA256核对通过；同dir装配/strictAudit/helper缺失与恢复/build均通过。独立规格轴已核对原始命令、图和manifest。
- F-OLD-HASH：静态Suspense使Atoms卡片在原生fragment滚动后才挂载；分类commit/RAF/hashchange补定位、卸载清理且不改URL/focus。110原始oldhash×中英=220条均完成URL保留/目标存在/viewport实际检查。首修后检测Atoms轨道/图标reduce结构切换导致418，修成CSS选择稳定轨道、JS门控位移，以及图标同一SVG/wrapper+touchhover门控；最新deep-links-result errors0。
- 最新根仓232pass/0fail/11120assertions、check/build退出0；最新site-result为tWSgdA，120场景/1231HTTP/errors0；raw/source/snapshot全部一致。之前消费run完整Catalog与当前唯一区别是animated-icon sourceVersion/installationFiles新增hover hook；该文件不在三Profile已安装16项图中，独立复核确认全部已安装图及34文件manifest仍同原run，未无意义重跑高成本消费者。
- 准入结论：实现、失败复测、受影响回归、独立复审、台账、当前文档及可复跑门禁已闭环。阶段6、用户视觉批准与物理多浏览器验证仍单独记录。
