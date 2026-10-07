# UI Lab 独立用法第 2 / 3 组只读审查

审查日期：2026-10-07（会话环境日期）。范围：`/tmp/ui-lab-usage-group-2.json` 和 `/tmp/ui-lab-usage-group-3.json` 中全部 48 个 usageFile，以及对应真实源码 API 和与问题有关的 helper。按当前工作区内容审查，不以 git diff 或尚未提交的登记为需求替代。

## 结论

- **需求符合性：尚未完全通过。** 48 个示例均提供零参数具名入口和有意义演示内容；发现 2 处 P2 问题，影响鼠标操作或多实例约束，另有 2 处 P3 反馈文案问题。
- **规范符合性：尚未完全通过。** 没有发现示例引入站点预览、Catalog/registry、站点 provider、未分发的站点 barrel、真实业务后端或远程媒体依赖；固定 DOM id 和交互/状态说明问题仍需修正。
- 本次仅写这份报告，未修改示例、源码、登记、脚本或其他文件，未提交、推送或发布。

## 按重要程度排列的发现

### 1. P2 — 圆柱轮播子按钮的鼠标选择被父容器 pointer capture 接管

- 路径：`components/examples/motion/cylinder-carousel.example.tsx:18`（说明位于第 15 行）。
- 具体原因：示例把每个主题做成带 `onClick={() => setSelected(topic)}` 的子按钮，并提示“再点击主题”。真实 `components/motion/cylinder-carousel.tsx:306` 的父容器 `onPointerDown` 无条件 `preventDefault()` 和 `e.currentTarget.setPointerCapture(e.pointerId)`，第 338 行的 `onPointerUp` 在父容器释放 capture。鼠标按下任一主题时，该事件会冒泡到轮播父容器；后续 pointerup/click 定位到父容器，子按钮的选择回调不触发。因此“轮播位置”可以变化，但“已选择”不会按承诺随鼠标点击变化。
- 证据：Chrome 154.0.8037.98 headless 中，使用与源码相同的原生 pointerdown/up 处理做内存 DOM 定向复现：点击“写作”后 `result="阅读"`、`clickTargets=["stage"]`；聚焦该按钮后 Enter 得到 `keyboardResult="写作"`、点击目标包含 `topic`。验证的是 pointer capture 机制，未对完整 React 轮播进行浏览器构建/运行验收。
- 建议：在现有 API 内，将“选择当前主题”按钮放到轮播之外，根据 `onIndexChange` 保存当前主题；或明确隔离子按钮 pointer 事件并保留可拖动区域。不要为了修示例改公共组件接口。
- 归属：既有源码机制与新示例使用方式之间的冲突，示例可在当前接口内绕开。对应任务的可操作 callback 要求及 `CODING_STANDARDS.md` 的交互规则。

### 2. P2 — 行内引用的固定 DOM id 在多实例中重复

- 路径：`components/examples/blocks/inline-citation.example.tsx:101`，同时涉及第 102 行及第 24 / 30 行的固定 fragment URL。
- 具体原因：每个 `InlineCitationExample` 都渲染 `id="reading-note"` 和 `id="discussion-note"`。同页渲染两份会产生重复 id，片段目标无法区分所属实例；这直接违反本任务的“固定 DOM id 多实例冲突”约束。`sources` 中的 `#reading-note` / `#discussion-note` 也固定在模块作用域，不能只改段落 id。
- API 核对：真实 `InlineCitationSource` 将 `url` 显示为文本，并没有自动为示例生成唯一标识或把它解析成当前实例链接；不能依赖组件替用法修复固定 id。该示例目前也没有真正可点击的来源锚点，所以这里不声称已复现组件内部跳转错误。
- 建议：在示例内部使用 `useId()` 生成实例前缀，同时更新两个段落 id 和 `sources[].url`。保留中文纯演示来源及真实入口导入。
- 归属：示例缺陷；需求不符合，违反可组合/多实例使用边界。

### 3. P3 — 任务完成后重新展开，状态文案仍断言清单已收起

- 路径：`components/examples/blocks/todo-list.example.tsx:85`。
- 具体原因：文案仅由 `complete` 决定：一旦全部任务完成，就持续显示“清单已自动收起”。真实 `TodoList` 只在完成的转换时自动关闭（`components/agents/todo-list.tsx` 的 `previousComplete` effect），用户仍可用标题按钮再次展开并经 `onOpenChange` 更新示例的 `open`。此时清单已展开，但 `role="status"` 仍说已收起。
- 建议：用 `complete` 表示完成状态，并另外按受控 `open` 描述“展开/收起”；或完成时只说明任务全部完成。
- 归属：示例状态反馈文案；不阻止任务推进/重置。

### 4. P3 — 工具结果示例指向不存在的右上角重试按钮

- 路径：`components/examples/blocks/tool-result.example.tsx:37`。
- 具体原因：提示“点击右上角重试按钮”，但实际 `ToolResult` 的 `onRetry` 对应 `ToolResultAction` 在展开内容底部的操作栏内（`components/agents/tool-result.tsx`，`Run again` 分支），并不在右上角。首次渲染即显示这段错误指引，会让用户寻找错误位置。
- 建议：改为“点击下方重试按钮”或不指定位置；不改组件实现。
- 归属：示例操作说明；实际重试回调和本地结果均可用。

## 不应误报为迁移缺陷的实际 API 边界

- `theme-toggle.example.tsx` 的 `ThemeProvider` 来自组件本身已使用的 `next-themes`，并非 UI Lab 的站点 provider。真实 `ThemeToggle` 无受控 `theme/onThemeChange` 入口，通过 `useTheme()` 切换消费者页面的根主题；示例提供最小消费上下文、mounted 门控及准确的页面级说明，在当前接口内可操作。多个应用主题提供者的全局协调不属于这个单项示例验收。
- `swap.example.tsx` 的真实 `MultiChainSwapProps` 仅提供 chains/tokens/default ids/className，没有兑换或设置 callback。示例通过自有中文演示网络、积分、固定比率与内部输入/选择/方向/地址状态展示职责，并明确说明操作按钮只展示状态、不会执行交易。未把源码缺失 callback 误报为示例漏接后台。
- `not-found.example.tsx` 从 job 指定的真实 `not-found/index` 安装入口导入；其余五个窄变体各自直接导入对应源码文件。这里的 index 是实际分发入口，不能按“未分发站点 barrel”误报。
- `JSXPreviewContent` 的真实实现通过 effect 设置展示节点；零参数首屏有编辑器和示例字符串，浏览器挂载后显示允许标签内容。这是已有 API 渲染方式，不等价于本次完成了所有 hydration / 流式异常场景验收。
- 行内引用的分页计数由 `InlineCitationCarousel` 的直接 children 数量计算；此用法恰好两个直接部件、两条来源，当前样本页数相符。新增来源时该源码契约可能不足，本次不把尚未发生的扩展示例错误列成当前缺陷。
- 复读时 `overflow-actions.example.tsx` 已由并行工作者将 `onExpandedChange` 改为 `setExpanded`；原先观察到的自动收起覆盖 `onAction` 消息问题已经不在当前文件中，不计入未解决发现。

## 48 个示例逐项覆盖

下表“未发现同级缺陷”仅指本次人工语义/API/资源/实例边界审查，不代表构建、SSR、完整浏览器可访问性、视觉或发布批准。

### 第 2 组（24 项）

| 路径 | API 与职责核对 | 结论 |
| --- | --- | --- |
| `components/examples/motion/scroll-animation.example.tsx` | 中文阅读内容；组合 SmoothScroll、进度、导航与渐入；useId 生成导航目标。 | 未发现同级缺陷 |
| `components/examples/motion/smooth-scroll.example.tsx` | 容器滚动与内部 useSmoothScroll 返回开头；请求反馈保存在本地。 | 未发现同级缺陷 |
| `components/examples/motion/scroll-progress.example.tsx` | 容器 onScroll 更新 MotionValue 与百分比；条形和圆环共享同一实际进度。 | 未发现同级缺陷 |
| `components/examples/motion/parallax.example.tsx` | 两个速度不同的中文层次；container ref 指向当前实例滚动区域。 | 未发现同级缺陷 |
| `components/examples/motion/scroll-to.example.tsx` | 三段中文章节及返回目录；useId 前缀避免多实例目标重复。 | 未发现同级缺陷 |
| `components/examples/motion/scroll-reveal.example.tsx` | 中文段落；root ref 指向当前滚动区，once=false 支持再次进入。 | 未发现同级缺陷 |
| `components/examples/blocks/approval-card.example.tsx` | 批准、拒绝、关闭与重新确认；受控状态和本地结果，不创建日程。 | 未发现同级缺陷 |
| `components/examples/blocks/approval-card-questions.example.tsx` | 两道中文问题，单选/多选/自定义答案；受控 answers、step、status，提交展示具体答案。 | 未发现同级缺陷 |
| `components/examples/blocks/approval-card-review.example.tsx` | 中文审阅内容和 useId 意见输入；通过/拒绝/请求修改均保留本地意见。 | 未发现同级缺陷 |
| `components/examples/motion/tabs.example.tsx` | 受控选项卡，三个中文内容面板及当前选择反馈。 | 未发现同级缺陷 |
| `components/examples/motion/bottom-sheet.example.tsx` | 受控打开/关闭；中文名称编辑、保存/取消；useId 输入标签关联。 | 未发现同级缺陷 |
| `components/examples/motion/animated-toast-stack.example.tsx` | 源码 hook 管理本地通知；添加、撤销、关闭、清空；初始通知为空，避免初始随机标识。 | 未发现同级缺陷 |
| `components/examples/motion/shader-background.example.tsx` | 自有装饰配色、中文正文表面；speed=0 暂停，实际 wrapper 尊重 reduced motion。 | 未发现同级缺陷 |
| `components/examples/motion/star-border.example.tsx` | 真实 StarBorder 包裹中文可操作按钮；本地选择反馈；关键帧由组件自带。 | 未发现同级缺陷 |
| `components/examples/motion/dropdown-menu.example.tsx` | 受控菜单与置顶状态；复制/归档/勾选的本地反馈，对应真实 onSelect/onCheckedChange。 | 未发现同级缺陷 |
| `components/examples/blocks/thread-list.example.tsx` | 真实组合部件；选择更新阅读内容与未读状态，归档移除条目并处理空列表，可恢复。 | 未发现同级缺陷 |
| `components/examples/blocks/voice-orb.example.tsx` | 四个真实状态及中文文字反馈；明确不采集麦克风或调用语音服务。 | 未发现同级缺陷 |
| `components/examples/blocks/availability-scheduler.example.tsx` | defaultWeek 懒初始化；受控周安排，编辑回调更新中文摘要，支持恢复默认。 | 未发现同级缺陷 |
| `components/examples/blocks/overflow-actions.example.tsx` | 最终复读时 onExpandedChange 已为 setExpanded；操作消息不会被 collapseOnAction 覆盖。 | 未发现同级缺陷 |
| `components/examples/blocks/otp-input.example.tsx` | 六位演示验证码；真实 onChange 与 onComplete 校验、错误恢复和清空；无登录请求。 | 未发现同级缺陷 |
| `components/examples/blocks/todo-list.example.tsx` | 受控条目与展开状态，推进/重置、完成自动折叠可用；P3：重新展开后文案仍称已收起。 | P3 #3 |
| `components/examples/blocks/reasoning-text.example.tsx` | 中文 phrases 与真实 swap API；切换进行中/演示结果，明确无模型服务。 | 未发现同级缺陷 |
| `components/examples/blocks/inline-citation.example.tsx` | 受控卡片、两条中文来源与分页；P2：两个固定 DOM id 在多实例中重复。 | P2 #2 |
| `components/examples/blocks/jsx-preview.example.tsx` | 本地静态片段、编辑/更新/重置；真实 JSXPreviewContent 在 effect 中渲染允许标签，不执行表达式。 | 未发现同级缺陷 |

### 第 3 组（24 项）

| 路径 | API 与职责核对 | 结论 |
| --- | --- | --- |
| `components/examples/blocks/not-found.example.tsx` | 从指定真实 index 入口导入默认 Glitch；中文 404 与当前实例的 useId 锚点目标。 | 未发现同级缺陷 |
| `components/examples/blocks/not-found-glitch.example.tsx` | 从指定窄入口导入 Glitch；中文文案及 useId 本地恢复导航。 | 未发现同级缺陷 |
| `components/examples/blocks/not-found-magnetic.example.tsx` | 从指定窄入口导入 Magnetic；中文文案及 useId 本地恢复导航。 | 未发现同级缺陷 |
| `components/examples/blocks/not-found-spotlight.example.tsx` | 从指定窄入口导入 Spotlight；中文文案及 useId 本地恢复导航。 | 未发现同级缺陷 |
| `components/examples/blocks/not-found-stacked.example.tsx` | 从指定窄入口导入 Stacked；中文文案及 useId 本地恢复导航。 | 未发现同级缺陷 |
| `components/examples/blocks/not-found-terminal.example.tsx` | 从指定窄入口导入 Terminal；中文文案及 useId 本地恢复导航，不执行终端命令。 | 未发现同级缺陷 |
| `components/examples/blocks/tool-result.example.tsx` | 受控错误/成功、重试及重置，展示真实本地记录；P3：重试按钮位置说明与源码不符。 | P3 #4 |
| `components/examples/blocks/tool-result-terminal-output.example.tsx` | 固定中文终端输出；本地重试计数及剪贴板回调，失败后隐藏复制入口；不执行命令。 | 未发现同级缺陷 |
| `components/examples/blocks/tool-result-request-result.example.tsx` | 预置失败/成功 JSON；真实 onRetry 切换本地响应，明确无服务器请求。 | 未发现同级缺陷 |
| `components/examples/motion/switch.example.tsx` | 受控 checked/onCheckedChange 与中文提醒反馈。 | 未发现同级缺陷 |
| `components/examples/motion/shared-layout-bg.example.tsx` | 真实共享背景包装中文按钮；本地选择反馈，无固定共享 layoutId。 | 未发现同级缺陷 |
| `components/examples/motion/theme-toggle.example.tsx` | 按实际 useTheme API 提供 next-themes 最小消费上下文；mounted 门控主题文字，操作作用于消费者页面。 | 未发现同级缺陷 |
| `components/examples/motion/cylinder-carousel.example.tsx` | 实际滚动索引回调和中文内容有意义；P2：父容器 pointer capture 与子按钮鼠标选择冲突。 | P2 #1 |
| `components/examples/motion/bounce-cards.example.tsx` | 三个中文卡片，展示堆叠/扇形入场；无外部图片或额外业务状态。 | 未发现同级缺陷 |
| `components/examples/motion/expanding-card.example.tsx` | 受控卡片详情与关闭；中文详细计划及本地加入清单结果。 | 未发现同级缺陷 |
| `components/examples/blocks/artifact-panel.example.tsx` | 中文草稿、预览/代码、1-based 版本导航和恢复为新版本；复制失败切到可手动复制的代码视图。 | 未发现同级缺陷 |
| `components/examples/blocks/activity-stats.example.tsx` | 固定列优先演示数据；受控周期、实际汇总与中文单元格 title，无时间/随机初始差异。 | 未发现同级缺陷 |
| `components/examples/blocks/swap.example.tsx` | 真实自定义 chains/tokens、固定余额/比率、内部数量/方向/选择/地址交互；准确说明无兑换/设置回调。 | 未发现同级缺陷 |
| `components/examples/blocks/expandable-tabs.example.tsx` | 受控 null/活动 id；两个中文内容面板及内部操作反馈。 | 未发现同级缺陷 |
| `components/examples/blocks/bloom-menu.example.tsx` | 当前安装已有 lucide 图标；真实 onSelect 添加本地草稿反馈，菜单内部负责关闭。 | 未发现同级缺陷 |
| `components/examples/blocks/code-block.example.tsx` | 固定中文 TypeScript 示例与高亮行；复制回调真实写剪贴板，失败后关闭复制入口。 | 未发现同级缺陷 |
| `components/examples/blocks/agent-progress.example.tsx` | 受控 elapsedSeconds，本地计时 effect 清理；暂停/继续/结束/重新开始。 | 未发现同级缺陷 |
| `components/examples/blocks/plan.example.tsx` | 真实组合部件与受控展开；中文步骤、采用/重置反馈，明确尚未执行任务。 | 未发现同级缺陷 |
| `components/examples/blocks/collapsible-sidebar.example.tsx` | 受控折叠/活动项；中文分组及子项；搜索、添加、更多回调均有本地反馈。 | 未发现同级缺陷 |

## 验证范围与未验证项

1. 逐项读取 48 个 usageFile，核对零参数导出、初始内容、local state、事件处理、回调结果与恢复路径；读取所有对应入口的公开 API，并针对上述发现阅读具体实现。
2. 检查示例 imports、providers、DOM id/fragment、资源引用及业务声明；重点人工核对滚动 parent/窄变体、404 index/窄变体、next-themes 与 swap 的实际接口。没有重新运行安装图机械门禁，完整分发闭包的 TypeScript/bundle/SSR 结果以统筹的隔离消费者验收为准。
3. 仅进行了圆柱轮播 pointer capture 机制的定向原生内存 DOM 复现（Chrome channel），没有写测试 fixture、截图或浏览器构建产物。Playwright 默认 headless binary 未安装，改用已安装的 Chrome；没有安装依赖或下载浏览器。
4. 未跑根全量 check/test/build、未修改 `.next`，未重复统筹的 48 项编译/SSR/bundle/浏览器验收。未验证完整组件的所有键盘/焦点、模态嵌套、主题/reduced-motion、GPU/WebGL、剪贴板权限、响应式尺寸及视觉表现。
5. 审查以最终复读时的工作区为准。报告中的行号对应当时文件；并行后续修改应重新核对相关发现，不将旧快照结论套到新代码。
