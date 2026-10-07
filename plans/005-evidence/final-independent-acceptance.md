# 计划005最终验收准入独立审计

初审时点：2026-10-03T15:29:01+00:00。固定基线 `a00c627`，未提交工作区；产品只读，排除预存 skills-lock.json/.grok。本次仅写此报告，不改 tracker，不执行 build、安装或浏览器流程。

**最终结论：Root、Next/Vite/Electron 与已安装模态消费者证据一致。R1–R8 在本次实际验收范围均可关闭，三 Profile 的安装、审计、构建和真实运行准入通过。CSV全部110条历史hash已另以220条真实浏览器检查闭环；此结论不代替用户视觉批准或阶段6发布/公网复验；不宣称计划005已完成发布闭环。** 原 spec E1–E4 与 standards P2/P3 的关闭结论维持；未发现重新生成实现或隐去失败来制造本次通过。

**P3最终状态：已关闭。** 最新 `nfUeoR` 的220条实际旧hash检查与 `tWSgdA` 的120场景/1231HTTP证据已独立核对；Root最新232 pass / 0 fail / 11120 assertions，check/build成功。Atoms轨道及AnimatedIcon修复的SSR/门控结论与当前源码摘要一致，三Profile已安装目标未变，维持原消费准入。历史复核记录已补充闭环状态，最终结论见末尾。

## 已执行证据及真实性

| 范围 | 独立核对 | 结论 |
| --- | --- | --- |
| 根仓/CLI/Greenfield | 最新[root-check.txt](root-check.txt)、[root-tests.txt](root-tests.txt)、[root-build.txt](root-build.txt)；232 pass / 0 fail / 11120 assertions（此前运行11121，不混作最新计数）；Catalog 6测试4821断言，Skill 6测试；Greenfield Chrome 8 E2E（`/tmp/uilab-005-greenfield-chrome.log`） | 原始成功输出存在；保留既有3条技能模板 lint warning，不冒称无 warning。CLI 当前 dist 的6个JS与相同配置的内存ESM编译逐字一致；额外 Node help、两个明确 kind 的 JSON show 退出0，未知 flag 退出1。未重新构建 |
| Root 生产站点 | [site-result.json](site-result.json)：558 Catalog、158安装target、439可视路由、中英878 HTML请求、1231 HTTP全200、120场景、36截图、errors=[] | JSON副本与 `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-site-tWSgdA/result.json` 语义相同；按当前CSV重新计算439旧/新路由，878请求无漏项。120=七入口+三个详情 × 中英 × 明暗 × 三宽度；不是120个资产或120个交互用例 |
| Next/Vite真实消费 | `/tmp/uilab-catalog-assets-jFoRH2` 的45条命令、原始日志、results、冻结Catalog/registry、installed-files；[命令副本](consumer-next-vite-commands.json)、[Next](next-app-browser.json)、[Vite](vite-app-browser.json) | 副本语义一致；命令文本、退出码与日志全部一致。43条exit0，另两条helper负向exit1；恢复后strict audit各exit0且0warning。typecheck/build/runtime均exit0；每Profile129条记录、66截图、errors/diagnostics均空，原截图与trace存在 |
| 安装源码 | 消费run时点的558项Catalog/快照/真源一致；本次当前Catalog与刷新快照逐字一致。与消费冻结Catalog相比，仅component/animated-icon一项变化；三消费者实际冻结16项目标与当前builders仍逐字一致，各34文件manifest SHA仍与现场相同 | 每个已安装文件与冻结分发内容的去注释TS AST一致，无缺失必需文件；差异仅分发器处理注释/末尾空白等。模态消费者Drawer/Sheet图12次文件比较也无AST差异。不存在替代实现冒充安装源码 |
| 已安装模态交互 | [modal-consumer-result.json](modal-consumer-result.json) 与 `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-installed-modals-K7cMHm/result.json` 相同；shadcn4.21.1实际生产HTTP安装、tsc、Bun browser build | 普通/减少动效两模式均验证focus、Tab/Shift-Tab、背景inert、两层Escape/恢复；实际CDP touchStart/Move/End拖动关闭，不是鼠标冒称触屏；reduce下Sheet transform=none。此为Chromium390视口和最小消费CSS，不代表物理iOS或所有浏览器 |

三Profile消费者实际版本为 React19.2.0 / Tailwind4.1.18 / TypeScript5.9.3，Next15.5.18、Vite6.1.0、安装后 motion14；本仓声明的motion11不能据此泛化为所有版本均验证。消费者模板复制了24个provider-free用法，tsconfig包含其TS/TSX；运行主体仍直接import真实资产，并仅提供消费方data/content/callback，见 [consumer.tsx:15](/Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/consumer.tsx:15)。多页壳显式引用唯一页面源码，见 [agent-workbench-site.tsx:13](/Users/zhoujw/develop/github/ui-lab/components/site-shells/agent-workbench-site.tsx:13)。

## 脚本与失败边界

- [verify-application-consumers.ts:65](/Users/zhoujw/develop/github/ui-lab/scripts/verify-application-consumers.ts:65) seed排除实现目录components/lib，67–72只复制消费者入口、CSS及用法；121–127由真实shadcn安装资产。135–142仅rename已安装helper并原样恢复，没有重写组件。146–147将实际依赖/lock写回模板，属于工具链冻结，不是生成产品源码。
- [verify-application-consumers.ts:53](/Users/zhoujw/develop/github/ui-lab/scripts/verify-application-consumers.ts:53) 保存真实stdout/stderr/exit，62按预期退出码拒绝；162–164记失败且最终179返回非零，未把catch当通过。启动探测的catch只重试至明确timeout（96–102）。早期下载、hydration、404和FAQ测试器失败仍保留在 [ACCEPTANCE.md](/Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/ACCEPTANCE.md)，最新 jFoRH2 未覆盖旧失败记录。
- [browser.mjs:61](/Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/browser.mjs:61) 收集pageerror与console.error并于154断言；失败159设exit1。截图/trace失败的catch只保护辅助留证，不移除产品错误。**HTTP>=400仅进入diagnostics，不直接失败**（63）；本次两份diagnostics确实为空，因此本次无隐藏HTTP错误，但不能宣传该脚本会自动拒绝所有HTTP失败。
- [verify-catalog-site.ts:69](/Users/zhoujw/develop/github/ui-lab/scripts/verify-catalog-site.ts:69) 的Root120全用reduce，只查heading/lang/overflow/desktop导航和pageerror（73–97）；并不逐项操作所有预览，也不收集console.error。消费者六组模式另覆盖普通/reduce、五种surface、ready/loading/empty/error、Stateful成功、输入/发送/设置保存/下载/保留表单、键盘Enter、FAQ和窄屏导航（[browser.mjs:82](/Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/browser.mjs:82)至152）。六组是代表组合，不是所有状态乘12组合。已发现的React418实际回归由生产site及Next消费者通过补足，不能扩写成所有hydration属性警告均已检查。

## Electron补充复审

补充时点：2026-10-03T15:34:16+00:00。此前缺证状态已由真实运行证据取代。

- [electron-renderer-browser.json](electron-renderer-browser.json)、[consumer-electron-commands.json](consumer-electron-commands.json)与 `/tmp/uilab-catalog-assets-Bdvh1a` 原件语义完全相同；results实际为ok=true。24命令中23条exit0，1条helper缺失的预期exit1；所有命令文本/退出码与原始日志一致。strict audit首次/恢复后均0error/0warning，负向为12条error；typecheck/build/browser均exit0。
- runtime记录：`actual-electron-file-renderer`、Electron **38.2.0**、Chromium **140.0.7339.133**、`hidden=true`、`file:///private/tmp/uilab-catalog-assets-Bdvh1a/electron-renderer/dist/index.html`。并非Chrome访问Vite服务器。六组场景共129条检查、66截图、errors=[]、diagnostics=[]；截图存在，trace.zip约13MB。实际关闭窗口、状态/回调及响应式场景与Next/Vite使用同一browser脚本。
- 消费run时点冻结Catalog与当时558项/快照一致；本次当前Catalog/刷新快照一致，仅未安装animated-icon一项相对消费冻结数据变化。Electron冻结registry与当前builders一致；34个安装文件manifest SHA与现场一致，逐个AST与分发实现一致，无必需文件缺失。只读结果见 [Electron源码核对](/tmp/uilab-005-final-electron-readonly-evidence.json)。
- [runtime provenance](electron-runtime-provenance.json)已独立按本地文件核验，不仅信任`verified:true`：完整归档 **`/tmp/uilab-electron-v38.2.0-verified.zip`** 为112474345字节，SHA256 **`cff178e2cb9ae0d957d43009ef46d249d5594bc107d7704130bc0ce2e234bbd1`**，与保存的官方`SHASUMS256.txt`对应darwin-arm64条目一致。`/tmp/uilab-electron-official-38.2.0`中Electron可执行文件和Electron Framework逐字节摘要与该ZIP内容一致。CDN补齐range没有改变最后校验要求；不把保留的旧不完整归档或失败codesign尝试当作通过。消费包原postinstall被Bun阻止的记录保留，实际运行使用已准备的官方runtime，而不是据安装命令退出0推断binary可用。

由此，R3和三Profile工程准入可关闭；不另要求重跑高成本命令。

## R-ID关闭意见

逐项依据[计划005:111–118](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:111)，沿用原红队风险边界。

| ID | 规格相关句子 | 独立意见及证据 |
| --- | --- | --- |
| R1 | “全 Catalog 可安装目标有效；7个失败样例回归” | **可闭**。158 JSON+raw、七个父入口test、独立base与父族真实安装、变体show/add及Recipe section校验；[spec复测](spec-retest.md) E2无效引用零写入。全量URL有效与代表真实消费分别记录，未说158项逐个独立安装 |
| R2 | “焦点迁入、Tab/Shift-Tab约束、Escape、背景不可交互、焦点恢复…触屏拖动与 reduced-motion” | **可闭（所记录Chromium范围）**。[模态实现/27测试](modal-implementation.md)+真实安装消费者两模式、嵌套键盘、CDP触摸。物理iOS/WebKit/Firefox未执行，保持边界 |
| R3 | “完整页面及多页组合真实运行；页面引用唯一源码…声明的状态/响应式/资产逐项验证” | **可闭**。4页+1组合直接分发；Next/Vite及实际Electron38.2.0 file renderer构建/运行、五surface状态、回调、共享token、唯一源码均通过；19section身份/24用法与standards复测成立，已满足[计划:161](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:161)“实际renderer包验证”。不将Recipe example解释为完整配方fidelity或Profile等价 |
| R4 | “概念、动效、区块变体、骨架、页面、整站代表查询可达…快照/线上Catalog事实一致” | **可闭本地工程问题**。558投影/无虚构reference安装、649迁移与七入口、439中英旧新路由、当次运行的源码/快照/本地生产一致；最新动画修复后的Root tWSgdA与220条真实历史hash nfUeoR亦通过，Skill门禁及[spec E3/E4](spec-retest.md)；此处“线上”仅实际本地生产HTTP，公网发布另待阶段6 |
| R5 | “owned family与安装闭包区分；移除必需helper时能发现；可选变体不误报；消费项目真实构建” | **可闭**。[spec E1](spec-retest.md)原shadow/.js/string/extends/references负向与正向；父/base闭包区分；三消费者helper删掉exit1、原样恢复exit0、实际typecheck/build通过，AST确认无站点实现偷渡 |
| R6 | “旧基准保持；重复add幂等；显式lock按声明重建；差异可见” | **可闭**。final-tests中CLI integrity正向/负向通过；[cli-integrity.test.ts:129](/Users/zhoujw/develop/github/ui-lab/tests/cli-integrity.test.ts:129)模拟上游变化逐项保持旧基准，重复add字节等、stale可见、显式lock重建。Lock不作为安装/视觉收据 |
| R7 | “超时/404/畸形/不完整数据测试…写命令不改config/lock…关键域失败不能发布‘完整’快照” | **可闭**。CLI integrity失败矩阵通过；[cli-integrity.test.ts:247](/Users/zhoujw/develop/github/ui-lab/tests/cli-integrity.test.ts:247)与271覆盖数据/超时；[spec E2](spec-retest.md)验证本地builder fail closed、remote引用错误零写入，查询回退明确来源 |
| R8 | “自定义主题直接/间接安装…保留；显式主题替换有效；重复安装幂等；深浅两态实测” | **维持已闭**。[R8独立复核](r8-review.md)+[结果](r8-evidence.json)，消费者本轮还断言主题后直接/间接system CSS hash不变（verify-application-consumers.ts:128–130） |

[standards两项复测](standards-retest.md)及[spec四项复测](spec-retest.md)均维持关闭；spec记录的六个产品文件SHA与当前一致。hydration修复的[独立SSR结论](hydration-review.md)现已有Root/Next以及三Profile消费运行复测支持，仍不冒称所有浏览器/版本全覆盖。

## 准入状态与仍需保留的边界

1. **Electron准入已关闭（补充复审）。** 见上节独立核对；无需继续标记“下载中/待runtime”，也不以Vite替代Electron。
2. **P3及最新Root准入已关闭。** [deep-links-result.json](deep-links-result.json)与原nfUeoR一致，精确覆盖CSV 110条原oldRoute×zh/en，保留完整query/hash，目标DOM可见且与垂直viewport相交；错误为空。最新tWSgdA的558项source/live/snapshot一致、120场景及1231HTTP通过，最新tests/check/build成功。Atoms SSR/门控复核源码未再变化。HTTP路由可达、实际hash/滚动及截图人工结论继续分别表述；三Profile图未变，原消费结论维持。
3. **体验/视觉范围必须如实。** Root不是全库交互扫描；消费者五资产运行、24用法编译/SSR、模态touch须分别表述。字体/图片真实加载、Recipe全部slots/states/responsive/assets/fidelity、物理iOS和其他浏览器不能由当前strict audit/截图推断。自动截图存在，已核对的9份保存副本逐字匹配原件，仍不等于人工视觉评审或用户批准；[计划:170](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:170)明确“分别记录”。
4. **阶段6未进入。** 本轮全部来自未发布CLI与本地生产HTTP；npm/Vercel版本及公网复验尚未执行（[计划:182](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:182)）。不将本地工程关闭冒称已对外发布，也不修改台账替统筹作整体准入。

低成本补充核对结果：[源码/Catalog/安装AST](/tmp/uilab-005-final-readonly-evidence.json)、[Node构建产物行为](/tmp/uilab-005-final-cli-artifact.json)、[dist逐字一致](/tmp/uilab-005-final-cli-dist-consistency.json)。这些为只读补充，不是重复高成本验收。


## P3 Atoms旧hash整改effect只读复核

补充时点：2026-10-03T15:40:42+00:00。**未发现新effect造成循环、泄漏或分类回归；随后220条实际oldHash生产证据已核对，P3已关闭。** 此为站点Atoms适配，不要求重新运行已通过的三个独立源码消费者。

- [atoms-explorer.tsx:35](/Users/zhoujw/develop/github/ui-lab/components/app/atoms/atoms-explorer.tsx:35)：useEffect依赖仅category；不setState、不改URL、不监听scroll，不会因scrollIntoView触发自身循环。Effect在分类DOM commit后执行，39使用单次RAF延后至挂载完成之后；所有相关卡片的ID均在其渲染时直接生成。只读验证不冒称实际浏览器滚动已经发生。
- [atoms-explorer.tsx:38](/Users/zhoujw/develop/github/ui-lab/components/app/atoms/atoms-explorer.tsx:38)：每次hashchange先取消上次frame，callback读取执行时最新hash；突发事件合并为一帧，不回放旧fragment。分类变更的cleanup/重新注册以及卸载（50–52）取消待执行帧并精确移除同一listener；StrictMode式setup→cleanup→setup没有双监听或重复滚动。
- [atoms-explorer.tsx:40](/Users/zhoujw/develop/github/ui-lab/components/app/atoms/atoms-explorer.tsx:40)：空fragment直接返回；decodeURIComponent失败保留原始ID，getElementById安全处理特殊字符，目标缺失为no-op，不轮询重试。45以auto/start滚动，没有新增smooth动画，不修改focus、locale/category或query/hash。既有分类按钮replaceState清除fragment行为（56–59）与基线相同，本次未改变。
- 挂载时、hashchange或category变化均可能合法执行一次滚动；同category普通rerender不重新运行。单次RAF不保证更晚异步布局/字体变化后的最终视口位置，此项边界已由随后220条实际生产回归验证。

已执行 `node /tmp/uilab-005-oldhash-effect-probe.cjs`，退出0：AST提取当前effect并使用受控RAF/event/document执行9项检查——目标在RAF前出现、事件突发/最新hash、分类cleanup/重挂载、卸载取消、Unicode解码及URL不变、错误编码、空hash、目标缺失、CSS特殊字符ID。无build、浏览器或产品编辑。[结果](/tmp/uilab-005-oldhash-effect-evidence.json)／[探针](/tmp/uilab-005-oldhash-effect-probe.cjs)。源码SHA256：`b168bdc0a615b524498e4518c6f8da7f5e41896df895fe28144a66bd77b59d23`，报告写入前再次核对一致。

准入闭环：生产重建后的110条CSV原始oldHash×zh/en的220条URL（含原query/hash）、目标ID存在及viewport相交断言和空错误列表已保存并独立核对，见末尾nfUeoR证据；本控制测试仅补充边界检查。registry/CLI和已验收的三Profile无关联源码变化，原结果不撤销。未修改tracker。


## Atoms轨道/AnimatedIcon hydration整改及范围补充复核

补充时点：2026-10-03T15:49:32+00:00。**此次新增修复只读复核通过；当前三Profile已安装目标不变，维持原工程消费准入，不重跑消费者。最新Root生产复测已由末尾最终复核关闭。**

- [motion-explorer.tsx:68](/Users/zhoujw/develop/github/ui-lab/components/app/atoms/motion-explorer.tsx:68)与88不再按reduce提前return StaticEndpoints。静态/动态轨道节点均稳定存在，由 `hidden motion-reduce:block` 与 `motion-reduce:hidden` 选择展示；当前构建CSS包含两种selector。CSS隐藏的动态分支仍在JS层门控：reduce时Curve x=0→0、Spring x=0→0/scale=1→1，transition为0.15s且无spring；因此不是只靠CSS遮住继续运动的位移。静态sr-only说明与原i18n契约保留，普通偏好下随隐藏容器退出可访问树。
- [animated-icon.tsx:46](/Users/zhoujw/develop/github/ui-lab/components/motion/animated-icon.tsx:46)统一以 `!reduce && canHover` 决定hover。draw保留同一motion.svg/path，rest pathLength=1，reduce/触屏不触发hover重绘；其余六变体始终同一motion.div+Icon，只有whileHover门控。useHoverCapable初始false与服务端一致，再由effect读取真实设备；正常鼠标hover能力保留，触屏幽灵hover门控补齐。Icon缺失返回null与variant不受媒体偏好改变。
- 真React/Motion SSR只注入偏好验证：MotionExplorer在null/false/true三模式中13条轨道的节点与文本一致；7图标×3reduce模式×2hover能力共42渲染组合结构一致，实际props的reduce/无hover门控全部符合预期。比较不包含style和Motion自动tabindex，未将其当作真实hydrateRoot/浏览器证明。[结果](/tmp/uilab-005-atoms-hydration-evidence.json)／[探针](/tmp/uilab-005-atoms-hydration-probe.ts)，执行退出0。
- 引用范围：MotionExplorer仅站点Atoms；AnimatedIcon仅Atoms AnimatedIconsSection与自身preview直接import，另有registry/Catalog发现登记。三消费者及模态安装图未含该文件，非通过目录名称猜测范围。当前三run实际冻结16个registry item与最新builder逐字相同；Next/Vite/Electron各34个installed-file SHA仍匹配。snapshot构建时间 `2026-10-03T15:44:11.595Z`，558项与当前buildCatalog逐字一致；与两个消费run的完整Catalog比较，唯一改变身份为 `component/animated-icon`，字段是 **sourceVersion及installationFiles**（新增 `lib/hooks/use-hover-capable.ts`），不应写成仅sourceVersion字段变了。所添加hook由真实import图分发；未进入任何本次已安装目标图。

版本关系以[范围结果](/tmp/uilab-005-atoms-scope-evidence.json)为准：消费run时点一致性是历史事实；当前刷新快照/真源一致是另一项当前只读核对；不再把历史完整冻结Catalog说成与最新完整Catalog逐字相同。动画图标作为单独安装目标的新源码只做本次SSR/graph检查，未冒称已经在三Profile实际安装运行。

Root重建、232tests/check、220真实oldHash与120场景复测均已完成；最后nfUeoR/tWSgdA版本、errors及完整断言结果已核对并关闭最新Root补充验收。该结论使用两文件修复后的最终生产结果，未以较早运行代替，也不撤销未受影响的三Profile记录。本次未改产品、tracker或主报告，未运行build/browser/安装。

本次验证源码SHA256：

- motion-explorer.tsx：`e0aaafdf213becbbe07fa08444f6af7649fb4920270650e2811aba0034b645a0`
- animated-icon.tsx：`10384797019ec50865e483ec47a3340b5711d85c6c1c41941317dbaaddae1e5d`

写入前再次核对一致。


## P3与最新Root最终闭环复核

补充时点：2026-10-03T15:54:29+00:00。**P3关闭；本轮R1–R8实际范围、最新Root与三Profile工程准入均通过，未发现新的实施缺陷或未闭工程准入项。** 未改产品、tracker或主验收报告，未执行安装/build/browser。

- 规格[计划005:89](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:89)：“query/hash 深链纳入检查”。[deep-links-result.json](deep-links-result.json)与原 `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-deep-links-nfUeoR/result.json` 语义完全一致。独立使用标准CSV解析器重算原oldRoute，110个带hash的真实URL×中英构成220个唯一组合；结果的locale/route/解码anchor集合逐项等于预期，无缺漏、重复或替换为示例hash，全部visible=true、errors=[]。
- [verify-catalog-deep-links.ts:19](/Users/zhoujw/develop/github/ui-lab/scripts/verify-catalog-deep-links.ts:19)浏览器直接访问原href，23等待目标DOM可见，24严格比较最终完整URL（含query/hash），25–28断言目标边界与垂直viewport相交；完成后才追加check，失败落failure.json并重新抛出，无错误屏蔽或源码生成。该断言证明目标至少部分进入视口，不扩大为整个卡片完全可见；固定1440×900/reduce/Chromium154范围，pageerror必为空，不检查全部console警告。现有9项effect控制测试只补充cleanup/事件边界，未代替此实际滚动证据。
- 最新[site-result.json](site-result.json)与原 `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-site-tWSgdA/result.json` 完全对应：558项source/live/snapshot通过脚本逐字比较；1231请求全部200，其中878 HTML、174 JSON、158 raw文本、14 CSS、6 machine、1 XML；120场景/12偏好组合、36截图、errors=[]，所有36张原截图存在。最新Root日志为232 pass、0 fail、11120 expect calls；check完整执行typecheck/lint/registry/catalog/skills，build成功编译且1317页生成完成。check的3条既有模板警告及build缓存/metadata/edge提示保留，不写成零warning。
- 只读复核的Atoms effect、MotionExplorer、AnimatedIcon三份源码SHA与前述探针完全一致；13条轨道、42图标偏好组合的结构/位移/hover门控结论可沿用。最新实际220旧hash与120 Root运行无pageerror补足生产回归，不把SSR结构比较自身写成真实hydrateRoot验证；scope探针再次退出0，当前558项快照与真源一致，三Profile冻结registry目标与最新builder仍相同，各34个已安装文件摘要仍匹配。
- 消费run时点完整Catalog一致性仍是历史事实。相较该冻结Catalog，当前仅 `component/animated-icon` 的sourceVersion与installationFiles改变（新增hover hook）；该目标不在本次三Profile安装图。无需重跑独立消费者，也不冒称AnimatedIcon新版本已单独在三Profile安装运行。此前R3/三Profile关闭维持。

当前剩余边界为用户视觉批准、阶段6正式发布/公网复验以及未执行的物理iOS/其他浏览器，均不是本次已验收工程范围的失败。截图存在与已inspect的人工结果仍单独记录。
