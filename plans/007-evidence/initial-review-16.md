# UI Lab 独立源码用法审查：第 1、6 组

日期：2026-10-07。范围：两个任务清单中的 48 个 `jobs.usageFile`，以及理解这些用法所需的真实安装入口/相关 helper。基准是当前工作区文件，不是提交 diff。

**结论：发现 3 处可在示例层解决的迁移缺陷，全部属于第 6 组；第 1 组未发现本次范围内的示例缺陷。另记录 1 处已复现的继承源码限制。** 未修改任何示例、源码、登记或文档；唯一写入文件是本报告。

## Spec：需求符合性

### R1 · P1 · 录屏示例没有播放入口，回调无法触发

- 文件：[components/examples/blocks/recording-card.example.tsx:11](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/recording-card.example.tsx:11)。
- 示例传了 `hint="点击播放演示"`、`onPlayingChange={setPlaying}`，但没有传 `bubble`，而 `RecordingCard` 唯一调用 `togglePlaying` 的按钮只在 `bubble` 非空时渲染。相关源码：[recording-card.tsx:253](/Users/zhoujw/develop/github/ui-lab/components/motion/recording-card.tsx:253)。
- 零参数挂载后只存在 `Expand to theatre view` 按钮；没有播放/暂停按钮。`defaultPlaying` 为 false，外部 `playing` 永远保持 false，计时器也不会启动。展开/收起剧场不能替代播放操作。
- 影响：看似已接回调，用户却无法演示这项职责的播放、暂停、计时反馈，不满足“state/callback 可操作”。
- 建议：通过现有 `bubble` 槽传入有意义的自包含节点，例如演示头像或播放标识，使原组件的播放控制出现。无需加真实录屏/音视频服务，也无需修改组件 API。
- 定向证据：Happy DOM 挂载后按钮列表为 `["Expand to theatre view"]`，`button[aria-pressed]` 不存在。

### R2 · P2 · 切换弹窗视图后焦点丢失，Tab 限制失效

- 文件：[components/examples/motion/morphing-modal.example.tsx:15](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/morphing-modal.example.tsx:15)，重点是 effect 的 `[open]` 依赖及 25–34 行的边界判断。
- 路径：打开“编辑计划” → 聚焦并点击“下一步” → `viewId` 从 `edit` 变为 `review`。组件的内部内容以 `viewId` 为 key，旧视图退出后被移除，但 `open` 始终为 true，因此 effect 不会为新视图重新设置焦点。
- 原来聚焦的按钮被卸载，焦点落到 `body`；现有 Tab 处理只覆盖 activeElement 等于 first/last/dialog 的情况，不覆盖焦点已在弹窗外的情况。于是下一次 Tab 不会被拦截，可以走到背景触发按钮等外部元素。
- 影响：两步确认流程在典型操作路径中失去键盘焦点限制。只有初次打开时移动焦点，不能说明整个流程可操作。
- 建议：在新视图实际挂载后移动焦点，并在焦点意外移到 dialog 外时将 Tab 收回；关闭后的焦点恢复应与视图切换分开处理。无需更改公共 props。
- 定向证据：Happy DOM 中初次打开的 activeElement 是 dialog；切换并等待 350ms 后为 `BODY`，`closest("[role=dialog]")` 为 false；在此位置发送可取消 Tab 事件，`defaultPrevented` 为 false。

### R3 · P2 · 卖出回调把份数当成金额展示

- 文件：[components/examples/blocks/prediction-market.example.tsx:27](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/prediction-market.example.tsx:27)；30 行的草稿反馈也有相同问题。
- 真实 API 的 `amount` 随 mode 改变语义：buy 时表示支出金额，sell 时表示卖出份数。源码明确在 sell 下渲染 `Shares` 标签，且计算 `shares = amount`、`payout = amount * price`。相关源码：[prediction-market.tsx:174](/Users/zhoujw/develop/github/ui-lab/components/motion/prediction-market.tsx:174)。
- 路径：Connect 进入本地演示会话 → Sell → `+10` → Trade。“会完成”价格为 0.6，卖出 10 份所得金额应为 6.00；示例却显示“10.00 份，演示金额 10.00”，并在草稿中显示“卖出，金额 10”。
- 影响：虽然已明确没有真实交易，演示仍把真实 API 的数量单位解释错了，会给消费者错误的回调使用范式。
- 建议：草稿根据 mode 使用“金额”或“份数”；卖出成交反馈使用 `quote.payout` 表示所得演示金额，买入支出继续使用 `quote.amount`。本地会话和“未执行真实交易”说明可以保留。
- 定向证据：Happy DOM 依次执行上述动作，结果为 `本地订单：卖出「会完成」，10.00 份，演示金额 10.00。未执行真实交易。`。

需求轴：3 处缺陷。优先解决 R1，使播放职责真正可操作。

## Standards：规范符合性

依据 `CODING_STANDARDS.md`，与需求轴分别给出结论；以下与 R1–R3 是同一组问题，不能相加计为 6 处。

- **S1 / R2：不符合“交互、SSR 与动效”的模态焦点限制要求。** 示例自行声明 `role="dialog"`、`aria-modal="true"` 并承担键盘控制，但视图切换后没有维持焦点。文件：[morphing-modal.example.tsx:15](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/morphing-modal.example.tsx:15)。
- **S2 / R3：不符合“组件化与依赖方向”的 API、状态及复制用法一致要求。** sell 的数值语义被写成 buy 的金额语义。文件：[prediction-market.example.tsx:27](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/prediction-market.example.tsx:27)。
- **S3 / R1：不符合可操作的职责展示要求。** 必要槽位缺失使源码已有操作不能在复制用法里触发，回调声明无法成为交互证据。文件：[recording-card.example.tsx:11](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/recording-card.example.tsx:11)。

规范轴：3 处对应问题。优先解决 S1，恢复多视图模态的键盘边界。没有把独立示例中的相似数据/state 重复当成抽象缺陷：它们需要各自安装、各自复制。

## 已复现的继承源码限制（不计入上面 3 处迁移缺陷）

**Agent 输入台的中文 IME Enter 会提前提交。**

- 示例：[components/examples/blocks/agent-composer.example.tsx:38](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-composer.example.tsx:38)。源码：[components/motion/agent-composer/index.tsx:182](/Users/zhoujw/develop/github/ui-lab/components/motion/agent-composer/index.tsx:182)。
- `ComposerTextarea` 对所有非 Shift 的 Enter 直接 `preventDefault()` + `onSubmit()`，没有检查 `nativeEvent.isComposing`；公共 API 也没有原始 `onKeyDown`/composition 回调。示例的 `send` 会清空草稿，因此中文选词确认 Enter 有误提交/丢失草稿的风险。
- Happy DOM 向“整理需求”输入框发送 `key="Enter", isComposing=true`，本地消息立即出现，输入值变为空。该定向结果说明事件处理路径；具体操作系统输入法时序仍需实际浏览器复验。
- 这是已有源码行为，不是示例使用了错误 props。消费层可在包装元素的 capture 阶段拦截 composing Enter 的传播，保留其默认选词行为；或由统筹另行评估原组件修复，本审查未作任何修改。

## 其余检查结论与边界

- **零参数与内容：** 48 个具名 Example 均无需传参，现有文件都提供中文演示数据/内容或明确的本地说明；没有仅做 ComponentProps 透传的包装。静态装饰资产不强求业务 callback。这里是源码及接口审阅结论，不替代逐条浏览器渲染验收。
- **入口：** 示例均直接 import 对应 `job.sourceFile` 的去扩展名 `@/` 路径。变体使用自身入口；`agent-activity`、`wallet-card`、`agent-workbench`、`agent-composer` 等 index 是任务指定的真实安装入口，不能因为其导出多个部件就判为“未分发 barrel”。没发现站点 preview、Catalog/registry 或其他资产 barrel 的用法导入。`AnimatedIcon` 使用的 lucide 类型依赖也在源文件导入中声明。
- **provider：** 没发现示例 import 站点主题/语言/业务 provider。Workbench/Composer/ChainOfThought 等真实组件内部的 context 属于安装实现，不是站点 provider。
- **state/callback：** 除 R1/R2/R3 外，选择、开关、展开、发送、授权、方案选择等参数和消费状态可按真实 API 连通。Agent 活动 working 阶段始终展开是组件契约，不能要求其在工作中被 open=false 收起。独立变体条目也有专属示例。
- **后端边界：** 登录、工具授权、提示输入、兑换相关展示、预测市场、账单方案等用法均有本地/静态/未请求或未交易说明。没有把 stub callback 说成后端已完成。RecordingCard 明确是静态外观与计时，不是假装已经录制视频。
- **DOM id：** 未发现示例自身固定 DOM id 冲突。Workbench 与 Suggestion 的输入 id 来自 useId；Confirmation 的 `approval.id="reading-plan"` 是数据身份，没有输出为 DOM id；Halftone 的 `id="sky"` 位于 data SVG 图像文档中，不在宿主 DOM，重复挂载不会冲突。key/data id 不作为 DOM id 处理。
- **外部资源：** 图像生成使用内联 SVG，网点图像使用 data SVG；钱包账户都提供了本地 avatar，不会进入 dicebear 的远程头像 fallback。录屏、WebGL、滚动提示等无需站点 public 文件、远程图像或外部服务才能渲染。
- **主动外链边界：** `agent-activity-web-search.example.tsx`、`agent-activity-mixed-activity.example.tsx`、`citations.example.tsx`、`sources.example.tsx` 含 W3C 文档链接。它们不在渲染时下载页面/图像，也没有发起搜索 API；只有用户点击链接才导航到外网。离线环境中打开原文不能完成，本次没有浏览或核验外链可用性。若统筹要求所有点击也完全离线，这四条需改为本地内容导航；当前不将正常引用外链算作外部渲染资源依赖。
- **其他继承边界：** LoginCard 的协议/反馈链接仍是源码写死的 `href="#"`，现有 API 不能配置；示例只声明登录表单本地演示。StreamingFunctionCall 的 streaming 同时控制尾部光标和是否显示右括号，暂停时保留“不完整调用”的光标是该示例用 `length < total` 表达未闭合输入，不能据此断言它正在执行工具。录屏剧场的全局焦点行为、Tooltip 在粗指针设备上的聚焦行为属于现有组件的实现边界，本次没有做完整可访问性审计。

## 实际验证范围

只读逐文件检查全部 48 个示例，并阅读真实 props、回调执行与相关分支。没有运行类型、bundle、根 check、build、安装依赖或写入 .next；没有编辑工作区文件。

对 R1/R2/R3 与输入台 IME 限制，在现有依赖上执行了内存中的 Bun + Happy DOM + React Testing Library 定向行为核对。使用减少动效分支让退出节点可确定地卸载；测试完成后清理 DOM。不是实际浏览器、不是独立安装消费者，也不是视觉批准。

未验证：完整浏览器焦点导航/背景隔离、多实例真实布局、普通动效时序、系统输入法、剪贴板、WebGL/canvas 像素、SSR hydration、浏览器差异，以及用户视觉验收。统筹的安装图 TypeScript/browser bundle/SSR/真实浏览器验收仍负责这些范围。

## 逐文件覆盖清单

“未发现额外缺陷”表示在以上静态/API 审阅范围内无新增问题，不能理解为全部浏览器行为已通过。

### 第 1 组（24 个）

| 路径 | 结论 |
| --- | --- |
| [components/examples/blocks/agent-activity.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-activity-streaming-text.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity-streaming-text.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-activity-reasoning-steps.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity-reasoning-steps.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-activity-web-search.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity-web-search.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-activity-tool-calls.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity-tool-calls.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-activity-mixed-activity.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity-mixed-activity.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-activity-activity-trace.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-activity-activity-trace.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/select.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/select.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/select-morph.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/select-morph.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/marquee.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/marquee.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/radio.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/radio.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/animated-badge.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/animated-badge.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/wheel-picker.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/wheel-picker.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/halftone-image.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/halftone-image.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/animated-icon.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/animated-icon.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/login-card.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/login-card.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/citations.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/citations.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-workbench.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-workbench.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/expandable-action-bar.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/expandable-action-bar.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/wallet-card.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/wallet-card.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/prompt-input.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/prompt-input.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/tool-approval.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/tool-approval.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/sources.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/sources.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/suggestion.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/suggestion.example.tsx) | 未发现额外缺陷 |

### 第 6 组（24 个）

| 路径 | 结论 |
| --- | --- |
| [components/examples/motion/action-swap.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/action-swap.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/action-swap-cascade.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/action-swap-cascade.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/action-swap-blur.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/action-swap-blur.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/action-swap-roll.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/action-swap-roll.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/number.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/number.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/number-ticker.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/number-ticker.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/animated-number.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/animated-number.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/tooltip.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/tooltip.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/tooltip-morph.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/tooltip-morph.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/checkbox.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/checkbox.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/morphing-modal.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/morphing-modal.example.tsx) | R2：切视图焦点失效 |
| [components/examples/motion/range-slider.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/range-slider.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/webgl-background.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/webgl-background.example.tsx) | 未发现额外缺陷 |
| [components/examples/motion/scroll-hint.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/motion/scroll-hint.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/recording-card.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/recording-card.example.tsx) | R1：无播放入口 |
| [components/examples/blocks/streaming-json.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/streaming-json.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/agent-composer.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/agent-composer.example.tsx) | 迁移用法无额外缺陷；继承 IME 限制已记录 |
| [components/examples/blocks/morphing-search.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/morphing-search.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/prediction-market.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/prediction-market.example.tsx) | R3：卖出单位错误 |
| [components/examples/blocks/prompt-bar.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/prompt-bar.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/image-generation.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/image-generation.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/chain-of-thought.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/chain-of-thought.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/confirmation.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/confirmation.example.tsx) | 未发现额外缺陷 |
| [components/examples/blocks/billing-plan-grid.example.tsx](/Users/zhoujw/develop/github/ui-lab/components/examples/blocks/billing-plan-grid.example.tsx) | 未发现额外缺陷 |
