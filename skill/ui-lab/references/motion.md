# Motion

先选择一个模式；三种模式互斥。

| 模式 | 行为 | 是否修改 |
|---|---|---:|
| `find` | 找出真正需要动效的 seam，并列出主动拒绝的候选 | 否 |
| `review` | 检查现有动效是否符合 contract 与门禁 | 否 |
| `apply` | 只实现用户已授权且通过门禁的动效 | 是 |

## Motion gate

每个候选依次回答：

1. **Frequency**：用户多常触发？Operate 应用里的核心导航、键盘与高频任务最克制；优先即时状态反馈，不加入阻塞任务的展示性位移。
2. **Purpose**：必须服务于反馈、状态解释、空间连续性、防止突变或经批准的低频 delight；“更酷”不是理由。
3. **Duration**：复用现有具名 duration/ease/spring token，并保持交互及时；超过 approved contract 或现有 UI 预算时必须给出产品理由。
4. **Interruptibility**：可重复触发、可反向或手势驱动的动效必须从当前状态继续，不能锁住输入或每次从头播放。
5. **Reduced motion**：位移动效用 `useReducedMotion()` 门控；降级时保留必要的透明度、颜色或静态状态反馈。
6. **Hover capability**：装饰性 hover 用 `useHoverCapable()` 门控，避免触屏幽灵 hover。

## 实现纪律

- 复用 `lib/ease.ts` 的 `EASE_*`、`EASE_*_CSS` 与 `SPRING_*`。不得从外部文章或个人偏好复制曲线，也不在组件里散落一次性 easing/spring。
- 复用项目已有 Motion/CSS 约定；只在真实 contract 缺口下提议新增 token，并把 token 变更单独说明。
- 保持 approved motion personality、component anatomy、a11y 与 target runtime 行为。
- `find` 输出按收益排序的机会、精确位置与 evidence，并保留主动拒绝的候选及拒绝门槛。
- `review` 输出 findings、evidence、rejected candidates，并固定以 **Pass**、**Block** 或 **Insufficient evidence** 之一结论收尾；`Pass` 不等于用户批准。
- `apply` 行动前额外完整读取 [project-contract.md](project-contract.md)、[audit.md](audit.md) 与 [visual-acceptance.md](visual-acceptance.md)，并通过 [quality-gates.md](quality-gates.md) 的适用门禁；不得只依赖间接链接或摘要。

动效无法从代码判断手感时，要求目标 runtime 的慢放、逐帧或真实设备证据，不自报“丝滑”。
