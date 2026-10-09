# SaaS 后台视觉候选原型

> 历史候选：2026-10-08 用户改选免费 AdminCN + shadcn/ui Base UI 基线，并要求删除正式工作区的旧自写模板。本文记录此前隔离原型比较，不代表现行 SaaS 模板的方向、运行入口或视觉批准；当前讨论见[计划009](../009-saas-admin-realignment.md)。

日期：2026-10-07。状态：用户已选择 A 外壳与总览 + B 项目列表布局；具体产品实现尚未验收。关联问题：[首版后台的明暗视觉与响应式交互采用哪种方案？](https://github.com/xiaowen-0725/ui-lab/issues/31)；[候选与验证记录](https://github.com/xiaowen-0725/ui-lab/issues/31#issuecomment-6035625986)。

## 用户选择

用户回复“按你的推荐”，确认 A 的外壳与总览、B 的项目列表布局。详细决定见[视觉方向 resolution](https://github.com/xiaowen-0725/ui-lab/issues/31#issuecomment-6035669569)。C 的并排详情不作为首版默认；成员、账单、设置与账号页沿用同一视觉规则，但没有分别进行原型视觉审查。原型仍保留完整候选，尚未拼成正式产品源码；不把这次方向选择当成实现或上线验收。

## 本地入口与重启

原型位于隔离 worktree `/tmp/uilab-wayfinder-saas-ui`，分支 `prototype/saas-workspace`，基于 `bca736ad89052406667e186d7f2b852943064906`。当前未提交，不能只凭分支名在其他机器恢复；保留 worktree 中的源码和截图。没有修改主工作区的产品源码。

```sh
cd /tmp/uilab-wayfinder-saas-ui
bun run prototype:saas
```

开发服务监听 `127.0.0.1:3107`，链接仅在这台机器可用。worktree 的 `node_modules` 复用主工作区已有依赖；该运行方式未验证独立安装。

| 结构 | 比较重点 | 入口 |
| --- | --- | --- |
| A 指标优先 | 展开侧栏、指标卡、趋势与近期活动、下方项目列表 | [A 深色总览](http://127.0.0.1:3107/zh/playground/saas-workspace-prototype?variant=A&mode=dark) |
| B 项目优先 | 紧凑指标、主项目表格、右侧活动与趋势 | [B 浅色总览](http://127.0.0.1:3107/zh/playground/saas-workspace-prototype?variant=B) |
| C 并排工作区 | 图标侧栏、横向导航、列表与详情并排；窄屏切为单列详情 | [C 浅色总览](http://127.0.0.1:3107/zh/playground/saas-workspace-prototype?variant=C) |

底部工具可切换结构、浅/深模式、中性/蓝色品牌和保存失败模拟。左右方向键切结构，输入框内保持正常编辑。侧栏进入项目列表，项目名称打开详情，详情中可改项目名称并保存/取消。原型状态只在本次会话内存中保留，刷新会重置。

## 已观察的范围

通过 Playwright CLI 在 Chrome 检查了三个结构的桌面表现（1440×1050），以及 A 深色总览、B 浅色项目列表、C 深色详情的窄屏表现（390×844）。窄屏页面宽度为 390px，表格在自己的容器内横向滚动。A 的移动菜单可打开、选页后关闭；C 的移动菜单可打开和关闭，详情视图显示详情并隐藏并排列表。

交互检查：详情草稿在切换明暗、品牌和结构后保留；失败反馈保留草稿，关闭失败模拟后可以重试成功；未保存时离开触发提示，继续编辑保留原页面和草稿；方向键在输入框中不切结构。

截图保存在 worktree 的 `output/playwright/`：`a-light-desktop.png`、`b-light-desktop.png`、`c-light-desktop.png`、`a-dark-desktop.png`、`c-dark-draft.png`、`a-dark-mobile.png`、`b-light-mobile.png`、`c-dark-mobile-detail.png`。截图与 Agent 检查只证明这些观察范围，不能代替用户视觉批准。

## 原型边界与后续

这轮主要比较总览、列表和详情的层级；设置页仍按已确认的复用方向，尚未提供设置视觉候选。成员、账单、账号界面和新建项目流程没有实现。趋势图为静态 CSS 图形，正式实现按已确认的 Recharts 方向处理。品牌色仅为原型 token，并非已经登记的双模式 Theme Kit。

为了独立评估后台外壳，worktree 使用简化 locale layout，并对显式 locale 的原型路径绕过原站点 middleware；这些临时改动不可直接带入正式实现。未验证生产构建、SSR 首屏主题、system 偏好/持久化、完整路由历史与刷新恢复、所有焦点与背景隔离、屏幕阅读器、独立消费者或安装闭包。

视觉组合已经确定；下一步收敛发现/安装与验收规格，再按正式页面、外壳、示例与预览分层实现，不直接推广整段原型源码。地图 Notes 明确本轮不提交/推送，因而未执行原型分支的提交捕获；当前恢复依赖保留的本地 worktree。
