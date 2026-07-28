# Harden

Harden 补齐产品韧性，不改变已批准视觉方向。若缺口要求更换主题、字体、布局语言或组件 anatomy，停止并回到 `select`。

## 必查矩阵

- 状态：loading、empty、error、success、disabled；
- 环境：offline、permission denied、目标 runtime 的恢复与降级；
- 内容：i18n、长文本、不同数字/日期格式、缺失资产；
- 布局：规定 viewport、overflow、zoom、字体放大与窄容器；
- 输入：keyboard、focus order、快捷键冲突、触摸与精细指针；
- a11y：语义、accessible name、对比度、focus visible、reduced motion；
- 性能：首屏、长列表、重复渲染、动效负载与目标 runtime；
- 应用契约：路由、API/IPC、存储、自动化选择器与业务状态。

Recipe 或 approved contract 已声明的全部 state、responsive、asset、required 与 forbidden 字段必须逐项覆盖。未适用项也要记录理由，不能靠 demo happy path 推定。

## 修改边界

- 复用所选 System、Recipe、Block、Component 与 source family；不另造一套状态视觉。
- 只补缺失行为、内容承载和适应性；不借 harden 做美化或重排。
- 在真实 target runtime 验证，不用浏览器 mock 代替 Electron 或其他桌面壳。
- 通过 [quality-gates.md](quality-gates.md) 后，列出覆盖 case、证据和仍受外部条件阻塞的项。

