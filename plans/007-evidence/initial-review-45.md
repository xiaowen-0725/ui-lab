# UI Lab 第 4/5 组独立源码用法只读审查

审查日期：2026-10-07。仓库：`/Users/zhoujw/develop/github/ui-lab`。

范围：`/tmp/ui-lab-usage-group-4.json` 与 `/tmp/ui-lab-usage-group-5.json` 指定的全部 48 个 `jobs.usageFile` 当前工作区文件及其实际源码 API。按照任务清单审查，不以 Git diff 或已提交版本作为范围。只写本报告，没有编辑示例、组件、登记、校验脚本或其他文件。

## 结论

发现 2 项 P2 问题，无 P0/P1：第 5 组分步表单的正常自动完成路径遗漏最后一次选择；第 4 组通知偏好浮层没有 dialog 可访问名称。其余 46 个示例在本次审查范围内未发现具体缺陷。

需求符合性：部分符合。48 个示例均为具名零参数函数，具有实际内容；交互示例接入本地状态或可见回调结果。分步表单的完成结果不完整，见 F1。

规范符合性：部分符合。示例直接导入清单对应的真实安装入口，没有引入站点 provider、预览或登记模块；内容与业务动作基本明确为本地演示。通知偏好浮层缺少可访问名称，违反 `CODING_STANDARDS.md`「交互、SSR 与动效」中“语义元素、可访问名称、键盘和焦点行为跟随职责”，见 F2。

P2 表示正常用法或辅助技术使用受到影响，需要修复，但不是仓库级阻断或安全事件。以下按用户影响排序。

## 缺陷

### F1 · P2 · 分步表单自动完成时丢失最后一个必填选项

- 示例位置：`components/examples/blocks/step-form.example.tsx:8`，以及 `:20`、`:21`。
- 源码证据：`components/motion/step-form.tsx:309` 的 `handleChoiceSelect` 先调用 `handleValueChange(value)`，随后创建闭包定时器调用该次渲染的 `advance()`；`:260` 的 `handleComplete` 将闭包中的旧 `values` 传给 `onComplete`。
- 触发：输入“卡片练习” → 点击 Continue → 在最后一步点击“布局” → 等待自动完成。无需任何异常操作或真实服务。
- 实际结果：组件显示成功视图，示例状态区显示 **`练习：卡片练习；重点：undefined`**。本轮 `goal` 不在完成回调数据中。用户已完成必填选择，但“本地练习信息已保存”未保存完整结果。
- 原因归属：底层 `StepForm` 最后一步为 choice 时的旧状态闭包缺陷；示例 props 和回调签名本身使用正确。本例选择了直接暴露该缺陷的步骤顺序，因此不能作为完整可操作的独立表单用法通过。
- 当前接口内的处理建议：把 choice 放在前一步、text 放在最后一步，让选择先提交到状态后，再通过最后一步显式完成。不能只隐藏显示层的 `undefined`，否则回调数据仍然缺失。底层修复应另行处理，本次只读审查不修改组件。
- 验证证据：使用现有 `tests/setup.ts`、Happy DOM 与 Testing Library，零参数挂载 `StepFormExample`，输入并点击上述操作，实际读取 `role=status` 得到上述文本。没有改写组件或示例，没有创建测试文件。
- 两轴归类：需求不符合（完成结果遗漏必填数据）；接口调用形式符合，主要根因在已有组件。

### F2 · P2 · 通知偏好浮层打开后是无名称 dialog

- 示例位置：`components/examples/motion/popover.example.tsx:27`。
- 源码证据：`components/motion/popover.tsx` 的 `PopoverContentProps` 提供 `"aria-label"`，`PopoverContent` 默认 `role="dialog"`，并将 `aria-label={ariaLabel}` 输出到内容根节点（`:534` 附近）。示例没有传该 prop。
- 触发：点击“通知偏好”打开浮层。
- 实际结果：dialog 的 `aria-label`、`aria-labelledby` 均为空；内部虽有“任务提醒”标题，但标题没有关联到 dialog 的可访问名称。屏幕阅读器定位到这个 dialog 时缺少用途名称。
- 当前接口内的处理建议：在示例的 `PopoverContent` 上传 `aria-label="任务提醒"`，无需修改源码或引入固定 DOM id。
- 验证证据：在同样的测试 DOM 中零参数挂载并打开 `PopoverExample`，`getByRole("dialog", { name: "" })` 找到浮层；读取属性均为 `null`，内部 `h3` 为“任务提醒”。
- 两轴归类：典型本地偏好操作和回调能够完成；规范不符合（dialog 缺少可访问名称）。

## 指定风险核对

- **零参数与内容**：48 个主示例函数均不需要传参，均提供对应职责的中文内容、数据或子部件。没有发现只做 `ComponentProps` 透传的空包装。除 F1 外，所读状态与回调路径能够在当前 API 中构成相应演示；这属于源码审查结论，并非声称已运行全部 48 个示例。
- **受控状态与回调**：核对了表格选择/排序/编辑/插删/分页、审批及撤销、设置、灵动岛视图、滑动操作、反馈提交、侧栏树修改、队列、命令执行、上传重试、会话发送、回复反馈与抽屉关闭等源码接口。表格列顺序/宽度由组件内部维护，示例回调显示结果，未误判为“只有回调没有状态”。上传重试先收到组件的 uploading 更新，再在示例中转为 queued；这符合其“重新排队后模拟完成”的说明，不是被覆盖的无效回调。付费墙 action 在源码中同时触发 `onOpenChange(false)`，示例不需要在 `onAction` 再次关闭。
- **安装入口与站点依赖**：48 个示例的主 import 均来自清单 sourceFile 对应去扩展名路径。按钮、表格、空状态、执行轨迹、会话流等 `index` 是指定的真实分发入口，不是未分发的站点 barrel。示例没有额外从宽入口借用窄变体的组件或 helper。示例外部 import 只使用 React；没有新增外部包需求。
- **业务动作表述**：保存、审批、归档、删除、文件处理、消息回复和升级操作均以演示/本地状态说明限定范围，未发现宣称接入后端、真实模型、交易或开通权益。`file-diff` 明确“复制到本地预览”且覆写 `onCopy`，没有冒充系统剪贴板复制。
- **固定 DOM id**：示例原生表单、预览导航锚点使用 `useId`。`DynamicIslandView` 的 `id="preparing"` / `id="complete"` 被源码用作视图匹配及 React key，并未输出成 DOM id；各数据条目的稳定 id 同样不是固定 DOM id。不因字符串名重复而报 DOM 冲突。抽查相关组件的 input、popover、折叠内容与 SVG filter id 生成，未发现本组示例引入的固定 DOM id 多实例冲突。
- **资源自包含**：示例没有远程图片、站点 public 资源路径、外部 href、fetch 或业务接口调用。空状态使用组件内联 SVG，其他内容为本地文本/数据。文件上传接受用户主动选择的浏览器 File，但初始渲染只需本地元数据，不依赖用户文件或外部服务。预览导航 href 指向实例内 `useId` 生成的锚点。

## 全部文件的审查记录

“未发现”指本次静态语义/API 审查未发现具体问题；不是浏览器通过标记。

### 第 4 组 · 24 个示例

| 路径 | 实际职责与交互核对 | 结果 |
| --- | --- | --- |
| `components/examples/motion/button.example.tsx` | 草稿本地保存/撤销与状态反馈 | 未发现 |
| `components/examples/motion/button-base.example.tsx` | 真实 submit 表单、标题受控、空值禁用、useId 标签 | 未发现 |
| `components/examples/motion/button-stateful.example.tsx` | idle/loading/success/error、本地延时、失败重试和清理 | 未发现 |
| `components/examples/motion/button-magnetic.example.tsx` | 磁吸入口、收藏开关及 aria-pressed | 未发现 |
| `components/examples/motion/button-metallic.example.tsx` | 金属反光、暂停及本地计数回调 | 未发现 |
| `components/examples/motion/table.example.tsx` | 中文成员数据、受控选择/排序、列宽/顺序反馈 | 未发现 |
| `components/examples/motion/table-editable.example.tsx` | 受控编辑、标题重命名、行插删、稳定行 id | 未发现 |
| `components/examples/motion/table-async.example.tsx` | 自包含分页、busy 防重入、延时清理、全部加载反馈 | 未发现 |
| `components/examples/motion/popover.example.tsx` | 受控打开/关闭、偏好表单和应用回调 | F2：无名称 dialog |
| `components/examples/motion/popover-morph.example.tsx` | 专属变形入口、本地操作、关闭状态 | 未发现 |
| `components/examples/motion/preview-rail.example.tsx` | 本地锚点、预览内容、选中回调、实例唯一锚点 | 未发现 |
| `components/examples/motion/bouncy-accordion.example.tsx` | 中文问答、受控展开及全收起 | 未发现 |
| `components/examples/motion/loader.example.tsx` | 本地延时加载、资料结果和重新加载 | 未发现 |
| `components/examples/motion/glare-hover.example.tsx` | 卡片有不透明背景、眩光和收藏反馈 | 未发现 |
| `components/examples/motion/expandable-control.example.tsx` | 两类控件受控展开、任务完成/恢复、action 后收起 | 未发现 |
| `components/examples/blocks/agent-inbox.example.tsx` | 审批/拒绝、本地结果、批准撤销和队列重置 | 未发现 |
| `components/examples/blocks/settings-panel.example.tsx` | 名称/颜色/提醒、预设、重置和实际预览 | 未发现 |
| `components/examples/blocks/dynamic-island.example.tsx` | compact/preparing/complete 状态、关闭；视图 id 非 DOM id | 未发现 |
| `components/examples/blocks/swipeable-list.example.tsx` | 左右动作、受控展开、移除与恢复、本地反馈 | 未发现 |
| `components/examples/blocks/feedback-widget.example.tsx` | 相对定位容器、真实文本输入回调、局部反馈列表 | 未发现 |
| `components/examples/blocks/file-diff.example.tsx` | 有意义增删行、受控折叠、本地复制预览 | 未发现 |
| `components/examples/blocks/ai-sidebar.example.tsx` | 真实资源树、选择、重命名、移动及受控 items 更新 | 未发现 |
| `components/examples/blocks/task.example.tsx` | 任务步骤/文件内容、受控折叠和校对勾选 | 未发现 |
| `components/examples/blocks/upgrade-paywall.example.tsx` | 完整中文报告内容、受控遮罩、action 关闭和重新打开 | 未发现 |

### 第 5 组 · 24 个示例

| 路径 | 实际职责与交互核对 | 结果 |
| --- | --- | --- |
| `components/examples/motion/text-animation.example.tsx` | 多行中文标题逐字入场、key 重播及计数 | 未发现 |
| `components/examples/motion/text-reveal.example.tsx` | 专属入口、进入视野展开、重播 | 未发现 |
| `components/examples/motion/text-shimmer.example.tsx` | 静态加载提示文字、纯 CSS shimmer，无多余状态 | 未发现 |
| `components/examples/motion/text-cascade.example.tsx` | 专属入口、受控阶段变化和级联文字更新 | 未发现 |
| `components/examples/blocks/empty-state.example.tsx` | 空收件箱到本地消息、清空恢复 | 未发现 |
| `components/examples/blocks/empty-state-inbox.example.tsx` | 窄入口、撰写/取消/保存本地草稿、useId 文本标签 | 未发现 |
| `components/examples/blocks/empty-state-archive.example.tsx` | 窄入口、空归档到记录、移出归档 | 未发现 |
| `components/examples/blocks/empty-state-search.example.tsx` | 窄入口、真实本地过滤、无结果和清空恢复 | 未发现 |
| `components/examples/motion/tilt-card.example.tsx` | 自包含内容卡片、指针倾斜/高光职责 | 未发现 |
| `components/examples/motion/input.example.tsx` | 受控文本、错误/成功状态、修改后清除状态 | 未发现 |
| `components/examples/motion/dock.example.tsx` | 程序坞选中视图、对应内容及可访问按钮名 | 未发现 |
| `components/examples/motion/drawer.example.tsx` | 受控抽屉、偏好编辑/取消/保存、重开恢复已保存值 | 未发现 |
| `components/examples/motion/text-scramble.example.tsx` | hover 与文本更新解密、固定本地提示 | 未发现 |
| `components/examples/motion/skeleton.example.tsx` | 骨架到实际正文、加载语义与重播 | 未发现 |
| `components/examples/motion/file-tree.example.tsx` | 中文文件树、受控选择/目录展开、结果反馈 | 未发现 |
| `components/examples/blocks/agent-trace.example.tsx` | 本地步骤推进、原始数据折叠、子步骤和完成结果 | 未发现 |
| `components/examples/blocks/agent-thread.example.tsx` | 本地模板回复、发送/建议填入、说明折叠、赞同开关 | 未发现 |
| `components/examples/blocks/command-palette.example.tsx` | 搜索命令、本地视图/新建回调、受控关闭 | 未发现 |
| `components/examples/blocks/file-upload.example.tsx` | 初始队列、添加/删除/重试/模拟完成/重置 | 未发现 |
| `components/examples/blocks/step-form.example.tsx` | 两种步骤、名称校验、完成结果和重启 | F1：末步 choice 自动完成遗漏 goal |
| `components/examples/blocks/streaming-response.example.tsx` | 本地分段文本、受控反馈、重播清理；未提供复制输入故不显示复制按钮 | 未发现 |
| `components/examples/blocks/reasoning.example.tsx` | 中文分析内容、受控展开、明确本地耗时 | 未发现 |
| `components/examples/blocks/queue.example.tsx` | 待办列表、受控折叠、完成/恢复、新增与计数 | 未发现 |
| `components/examples/blocks/view-layout-switch.example.tsx` | 布局选择实际改变列表/网格、有内容和反馈 | 未发现 |

## 验证与审查边界

1. 对全部 48 个示例逐行阅读，并核对实际入口声明、关键受控行为与回调实现；复杂入口继续读取 helper，例如 table 的列排序/重排、editable cell、侧栏类型与树操作、agent-thread suggestions、折叠基础实现等。
2. 仅对 F1/F2 做了定向交互复现，使用仓库已安装的 React、Happy DOM 与 Testing Library，开启 reduced-motion。复现代码通过 `bun -e` 执行，没有落盘测试、安装依赖或修改文件。这不是原始安装图隔离消费者，也不是 Playwright/真实浏览器。
3. 没有重复全量 build、类型/lint/登记/安装图检查、browser bundle、SSR 或统筹验收，没有改动 `.next`。本报告不替代这些检查。
4. 没有逐一验证所有交互的真实浏览器焦点、触摸手势、明暗主题、普通动效、动画完成时序或水合；没有做视觉批准。零参数、DOM id 与独立性结论基于本次源码阅读，不能推广为任意消费者/任意并发多实例组合均已通过。
5. 源码的已有英文默认文案、全局快捷键和组件内部动效/焦点机制不因示例可用而被认定全面合规；本次不是对全部底层组件的独立质量审计。除直接影响示例正常完成的 F1 外，不把未验证的底层疑点作为示例缺陷上报。

需求轴：1 项明确完成结果缺陷（F1）。规范轴：1 项明确可访问名称缺陷（F2）。全部 48 个示例已覆盖，未执行修复、提交、推送或发布。
