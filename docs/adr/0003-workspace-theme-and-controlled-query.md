# ADR 0003：后台主题作用域与受控查询

状态：旧模板已于 2026-10-08 按用户要求删除，本文保留历史取舍。专属主题作用域、页面与整站不再存在；共享 Table、Modal 和设置等兼容增强仍保留，不以此 ADR 规定新 Base UI 模板的实现。日期：2026-10-07。依据：[历史首版规格](../../plans/research/2026-10-07-saas-frontend-spec.md)；当前对齐见[计划009](../../plans/009-saas-admin-realignment.md)。

## 决定

新增后台页面和整站继续按 ADR 0002 独立登记；消费者提供当前 screen、数据、查询、保存状态、导航回调。示例控制器拥有本地样本和模拟操作，不进入通用页面的业务契约。Next 路由、history、cookie 与 locale Link 留在站点包装。

Table 新增默认关闭的 `manualSorting`：全量筛选/排序/分页由消费者完成，Table 只展示本页顺序与排序操作。旧本地排序默认值及安装身份保持。选择状态由消费者控制，示例在查询/分页变化时清空当前页选择。

新增 WorkspaceThemeScope 接收品牌、模式与明确的 light/dark token。作用域 CSS 使用原生媒体查询满足 system 首帧；挂载后响应媒体变化。品牌、模式与业务状态独立，偏好存储由消费者拥有，inline CSS 覆盖保持最高优先级。示例的两品牌数据由 Theme Kit 真源生成，组件安装不写全局主题。

Modal 新增可选 ModalPortalProvider：浮层可进入当前主题根并沿用 native dialog 的模态、焦点与关闭生命周期；未提供 provider 时仍使用 document.body。Drawer/Sidebar/Stats/Billing/设置页新增选项均保持旧默认能力。

主题 CSS 使用 [CSS Cascade 6 的隐式 @scope](https://www.w3.org/TR/css-cascade-6/#scoping-roots)：style 元素的父元素就是作用域根。它独立于周围 React useId 路径，支持同品牌不同 token、并列/嵌套作用域与 inline 覆盖。原 ID 选择器在真实 Next 详情/深链循环中出现 server/client 身份差异，导致 CSS 文本 hydration 失败；显式同步 locale Provider 只能通过局部循环，生产完整检查仍失败，因此该候选改动已撤回。不关闭 SSR 或压制 hydration 错误；真实页面循环和无 JS 多作用域浏览器检查均保留为验收。

详情页在使用翻译 API 前设置路由 locale，避免依赖父 layout 的执行次序。语言和框架包装继续留在站点层。

## 后果及验证

单页不依赖 Next 或整站 provider，也不强带 Recharts。整站安装包含真实闭包，展示层不会产生第二份页面实现。Graphite 与 Blue Ink 各有独立主题安装载荷；多品牌运行示例显式绑定作用域载荷，不能拼接多个全局 :root。

验证包括受控排序回归、作用域 SSR/覆盖、浮层焦点、安装图隔离、真实 Next/Vite 安装、手动 Vite 复制及共享 Modal 消费者。主题运行浏览器需要支持 CSS @scope；本轮实际浏览器和未覆盖范围以[实施证据](../../plans/008-project-workspace-implementation.md)为准。
