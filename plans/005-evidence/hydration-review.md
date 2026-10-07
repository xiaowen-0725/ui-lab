# 005 hydration 修复独立只读复核

结论：**未发现此次三文件修复引入 reduced-motion 或 label a11y 回归**。14 组场景、42 次真实 React/Motion SSR 渲染通过节点/文本结构、名称及 reduced variants 检查。此次静态复核支持修复方向；真实生产 hydration、120 场景及 Rawls 消费者复测仍为准入待办，不判失败。

## 证据

- **节点稳定**：[action-swap.tsx:185](/Users/zhoujw/develop/github/ui-lab/components/motion/action-swap.tsx:185) cascade 只由 animation 与字符串类型决定；[stateful.tsx:105](/Users/zhoujw/develop/github/ui-lab/components/motion/button/stateful.tsx:105) TextSlot 同样不再根据 reduce 切换节点树。[base.tsx:111](/Users/zhoujw/develop/github/ui-lab/components/motion/button/base.tsx:111) ripple 容器只依赖 ripple prop，初始 ripples 恒为空。模拟服务端偏好 null、普通偏好 false、reduce true，三者节点与文本一致。
- **reduce 保留**：[action-swap.tsx:63](/Users/zhoujw/develop/github/ui-lab/components/motion/action-swap.tsx:63)、[stateful.tsx:35](/Users/zhoujw/develop/github/ui-lab/components/motion/button/stateful.tsx:35) 的降级 initial/animate/exit 仅 opacity，无位移、缩放、blur；分别在 [action-swap.tsx:221](/Users/zhoujw/develop/github/ui-lab/components/motion/action-swap.tsx:221)、[stateful.tsx:146](/Users/zhoujw/develop/github/ui-lab/components/motion/button/stateful.tsx:146) 置 custom=0，降级 transition 不带 delay/stagger。原普通 variants 保持原值。Stateful 宽度降级 duration=0（119）；Button press/hover 继续门控（96–97）。
- **ripple 门控**：[base.tsx:74](/Users/zhoujw/develop/github/ui-lab/components/motion/button/base.tsx:74) 仍要求 ripple && !reduce 才测量并添加波纹。直接调用捕获的 reduce 事件处理器，getBoundingClientRect 设为抛错哨兵：未触发，调用方 onPointerDown 执行一次（87）。稳定的空容器无文本、交互或名称贡献。
- **标签完整**：[action-swap.tsx:199](/Users/zhoujw/develop/github/ui-lab/components/motion/action-swap.tsx:199) 测量副本隐藏；完整标签 sr-only（207），字母层 aria-hidden（211）。Stateful 对应 [stateful.tsx:124](/Users/zhoujw/develop/github/ui-lab/components/motion/button/stateful.tsx:124)、132、136，保留 aria-live=polite（202）、aria-busy 及 loading disabled（200）。可访问名称算法验证长中英字符串、显式 ariaLabel、纯图标回退、富文本以及 idle/loading/success/error，均为预期完整标签，无逐字重复读名。

仓库约定要求位移用 useReducedMotion 门控、降级保留透明度/颜色；[计划:167](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:167) 要求“中英、明暗、桌面/平板/手机、长中文、loading/empty/error/success、键盘与触屏、reduced-motion逐项记录”。上述代码满足本次所涉 JS 动画与 label 检查；loading 的既有 animate-spin 仍由 CSS reduced-motion 规则降级（[globals.css:456](/Users/zhoujw/develop/github/ui-lab/app/globals.css:456)），消费者 CSS 效果由既定消费者验收覆盖。

## 验证边界与准入待办

SSR 探针保留实际 Motion 渲染，仅注入 useReducedMotion 返回值并捕获 motion props；节点比较排除 style 与 Motion 自动生成的 tabindex。**原始 HTML 并非字节相同**：normal 有宽度 transition、字母 transform/filter 和 Motion 的 button tabindex=0，reduce 下相应属性不同。原生 button 不依赖 tabindex=0 获得键盘焦点；名称与节点结构验证通过。这些属性差异不能用本次测试宣称已经无 hydration 警告，也不据此宣称生产失败。父 Agent 正在进行的 production/120 场景和 Rawls 消费者复测继续确认首次加载及状态切换。

未运行 hydrateRoot、build、浏览器或高成本流程；未编辑产品文件，未 commit/push。执行 `bun --no-install /tmp/uilab-005-hydration-probe.ts` 退出码 0；[探针](/tmp/uilab-005-hydration-probe.ts)、[逐场景结果及三文件 SHA-256](/tmp/uilab-005-hydration-evidence.json)。报告落盘前重新校验三文件哈希，均与验证时一致。
