# SaaS Admin 主题定制面板：确认范围与实施记录

2026-10-09。用户提供顶栏调色板按钮和 Theme Customizer 截图，随后回复“可以”，确认完整面板，并补充 shadcn-admin 截图要求增加 Sidebar / Layout 两组。当前已接入本地代码，工程验证另见下文；产品与源码基线继续以 PRODUCT_DEFINITION.md、ADR0004及计划010为准，用户视觉批准与发布独立记录。

## 来源与控件选择

免费 AdminCN README 将 Theme Customizer列在Pro功能中，当前冻结免费源码只有模式切换，无该完整面板。截图及公开文档用于界面与功能参考，不将商业面板宣称为已取得的MIT源码：

- https://github.com/shadcnstudio/shadcn-nextjs-admincn-admin-template-free
- https://shadcnstudio.com/docs/documentation-admin/customization

新增模板私有的外观设置组合，暂不新增独立Catalog安装身份。弹层、选择和分段选项使用官方shadcn/ui Base家族的Popover、Select、ToggleGroup、Field、Button、Tooltip。已有控件复用；缺少的Toggle/ToggleGroup按同一已冻结shadcn 4.21.4、base-vega来源生成，保留来源和许可。官方控件源码/API/状态算法不改。

## 已确认的首版范围

顶栏新增Palette图标按钮，位于当前外观入口与用户菜单所在操作区。桌面以320px 宽 Popover向下展开，标题、说明、帮助提示及重置按钮对照截图。短视口内部滚动，移动端限制为可用视口宽高，不产生页面横向溢出。中英文跟随现有模板语言。

| 截图选项 | 首版实现 | 默认与实际行为 |
| --- | --- | --- |
| Theme Preset | Default / Blue Ink | 复用已有品牌状态与同一份token，不引入未登记Pro主题 |
| Font | Geist / 系统无衬线 | 默认Geist；系统字体不新增下载，中文保留系统fallback |
| Color Mode | Light / Dark / System | 复用已有模式状态，现有快捷模式入口共享同一状态 |
| Radius | None / SM / MD / LG | MD保留当前0.625rem；建议None=0、SM=0.375rem、LG=0.875rem，只配置主题变量 |
| Content Layout | Compact / Full | Compact保留当前90rem最大宽度；Full移除外壳内容及顶栏相应最大宽度限制 |
| Scale | SM / MD / LG | MD保留当前尺寸；SM/LG使用明确的模板字号及间距token，建议相对基准0.9/1.1；不使用transform或CSS zoom模拟，不修改全站html字号 |
| Sidebar | Inset / Floating / Sidebar 可视卡片 | 默认Sidebar；分别使用官方inset/floating/sidebar props |
| Layout | Default / Compact / Full layout 可视卡片 | 分别为展开侧栏、折为图标、隐藏侧栏；与Content Layout的内容宽度独立 |
| Sidebar Mode | Default / Icon / Full | 对应官方offcanvas/icon/none；默认沿用当前Icon。移动端保留Sheet导航，Full不在窄屏强制固定侧栏 |

重置恢复Default、Geist、System、MD圆角、Compact、MD尺寸、Sidebar侧栏样式、Icon折叠和展开状态。只重置外观偏好，保留当前路径、查询、数据、选中项和设置草稿。帮助按钮使用真实说明Tooltip，无占位外链。

Scale配置需覆盖正文、控件、表格、卡片间距、侧栏与浮层的一致性；仅列出选项而不能真实生效不算完成。圆角配置沿用官方组件的既有圆角角色，头像等语义上的圆形不强制变方。字体与尺寸变化后重新核对中文长文案、图表与移动端溢出。

## 目录与消费边界

实现位置：

```text
components/pages/saas-admin/components/layout/AppearanceCustomizer.tsx
components/pages/saas-admin/appearance.ts
components/pages/saas-admin/environment.tsx
components/pages/saas-admin/theme.tsx
components/pages/saas-admin/components/layout/{Header,Sidebar}.tsx
components/site-shells/saas-admin-shell.tsx
components/app/sites/saas-admin-{preview,preferences}.tsx/.ts
```

`appearance.ts`拥有首版选项、默认值和类型；新增`appearance`及`onAppearanceChange`可选props，通过环境Provider提供受控/非受控使用。现有brand/mode及回调继续使用，不创建第二份主题状态。外壳可通过可选配置隐藏面板。

存储和首帧预加载继续归消费者；UI Lab预览扩展自身偏好格式，并兼容现有brand/mode记录。可分发源码不读取localStorage/cookie，不引入Next或next-intl。独立页面不强带面板与外壳，但可以接收相同的外观配置。Sidebar配置是调用方传入官方props，不能为切换模式修改官方Sidebar/Sheet内部实现。

## 验收

- 默认值对应当前模板外观，未配置新增props的既有使用方式继续成立。
- 九组控件真实改变相应外观；切换和重置不重挂页面或丢失输入、URL及数据状态。
- 首帧、刷新、跨路由、浅深色、system变化及popover/select浮层使用一致配置；存储不可用仍可使用。
- Escape关闭并恢复触发按钮焦点；分段组和下拉支持键盘及可访问名称；390px与1440px无横向溢出。
- Sidebar三样式/三模式覆盖桌面与移动；消费者受控开合回调继续有效。
- 来源台账、实际安装闭包、用法、CLI快照与Unreleased同步；根check/test及受影响独立用法、Next/Vite消费验证按实际范围执行。
- 工程检查与用户截图对照批准分别记录，不以测试宣称视觉一致。

## 授权与职责

用户已确认完整面板，并明确加入 shadcn-admin 的 Sidebar / Layout 可视卡片。组合职责是“集中配置模板外观与导航布局”，项目命名为私有 `AppearanceCustomizer`，不增加 Catalog 安装身份。保留既有页面、外壳和整站安装契约，新增可选 props。Layout 卡片与 Sidebar Mode 共享同一官方开合/折叠状态，不维护互相冲突的第二份配置。

## shadcn-admin 来源核对

参考仓库为satnaing/shadcn-admin，固定revision `e16c87f213a5ba5e45964e9b67c792105ec74d26`。`src/components/config-drawer.tsx`中的Layout选择以open和collapsible派生：Default展开；Compact设置icon并关闭展开状态；Full layout设置offcanvas并关闭展开状态。该含义已用于本模板调用方组合。

六份`src/assets/custom/icon-{sidebar,layout}-*.tsx`示意图按MIT许可复用，保留完整许可及来源。调用方提供fill/stroke语义色及尺寸；SVG增加装饰性aria-hidden/focusable默认属性，调用方仍可通过props覆盖。未移植上游Radix控件、Cookie Context或完整配置Drawer；配置组合仍使用官方shadcn Base家族。许可见[shadcn-admin-LICENSE.md](../docs/sources/shadcn-admin-LICENSE.md)。

预览继续兼容现有v1偏好记录，在其中追加appearance；本地cookie将布局偏好提供给Next服务端初值。可分发组件通过props/回调受控，未读取存储。Scale配置改变模板及浮层字号/间距变量，保持文档根字号和浏览器缩放不变。MD保持原基准值。浮层边界、移动Sheet、草稿、刷新和SSR在工程验证中分别检查。

## 工程验证与交付状态

日期：2026-10-09。当前整站安装闭包为 165 文件，`sourceVersion=092dc45f9871b853eabac0c88cee06f6d2bc3e579000c116e250849308492db7`。来源台账为 166 文件（包含未进入安装闭包的 ScrollArea），全部 hash 一致；既有 33 份官方控件保持不变，额外两份官方控件为 Toggle / ToggleGroup。CLI 快照已刷新。

| 验证 | 本轮结果与证据 |
| --- | --- |
| 根 check / test | 通过；269 tests / 0 fail。见 [check](014-evidence/root-check.log)、[test](014-evidence/root-test.log) |
| UI Lab 生产构建 | 停 dev 后 build / start，构建通过。见 [build](014-evidence/root-build.log) |
| 独立用法 | 11 个实际安装闭包的 strict typecheck / SSR / browser bundle，22 项桌面普通动效与移动 reduce hydration 检查通过。见 [结果](014-evidence/standalone-usages.json) |
| 实际 shadcn 安装 | Next / Vite 各重新安装冻结闭包；每份 854 条引用的语义审计无错误导入、函数体差异、CSS 差异或许可缺口。见 [安装](014-evidence/install-summary.json)、[消费](014-evidence/consumers-summary.json) |
| 独立消费者 | Next / Vite strict typecheck、production build、真实浏览器各 23 项检查通过，无 console / page errors。覆盖 12 路由与既有关键交互，新增配置、草稿保留、重置和刷新恢复。见 [Next](014-evidence/consumers-next-app-browser.json)、[Vite](014-evidence/consumers-vite-app-browser.json) |
| 面板与状态 | Chrome 154.0.8037.98，22 项实际生产检查通过：三侧栏样式、三导航模式、导航布局与内容宽度独立、圆角/字体/尺寸/品牌/明暗、重置保留草稿和 URL、刷新与 cookie SSR、键盘分段操作、嵌套 Select Escape、面板关闭焦点恢复、移动 Sheet、中文及 localStorage 不可用。见 [结果](014-evidence/appearance-result.json)、[可复跑脚本](../scripts/verify-saas-admin-appearance.ts) |
| 可访问性与几何 | 390 / 1440px × Light / Dark，三侧栏样式与三模式均无页面横向溢出；面板位于可用视口，内部滚动。四个稳定显示后的 axe-core 4.11.0 整页扫描均 0 violations；incomplete 仍需人工判断。见 [axe](014-evidence/appearance-axe.json) |

提交前再次运行根 check / test：check 通过；首次并行运行的 CLI 来源提示审计用例超过 5000ms，单独复跑完整 test 后 269 pass / 0 fail，未改测试或超时阈值。上述根日志保留最终运行结果。

实际消费者解析 React / React DOM 19.2.0、Tailwind 4.1.18、Base UI 1.6.0、shadcn 4.21.4、Next 15.5.18、motion 11.18.2；其余版本见两份 `install-*-installation.json`。该样本不能证明未运行的依赖版本与浏览器。

扫描曾在主题过渡期间捕获旧文字色和新背景色；复查稳定显示正常，脚本在颜色继承与过渡完成后扫描，没有通过改原语或排除规则隐藏问题。截图见 [桌面面板](014-evidence/appearance-panel-default-desktop.png)、[中文移动可视卡片](014-evidence/appearance-panel-390-zh.png)、[深色移动面板](014-evidence/appearance-panel-390-dark.png)。截图和自动扫描不代表用户已批准视觉一致性，也不证明全部路由、组合或浏览器的可访问性。

需求符合性：本轮已确认的九组配置及 Sidebar / Layout 可视卡片已实现并验证上述范围。规范符合性：官方 Base 控件组合、私有外观 token、来源与 MIT 许可、props/回调消费边界、安装闭包及双语均符合相关规则；存储和 SSR 只在消费包装层。8 条历史远程商品图的来源缺口仍沿用已有记录。已完成本地实现与验证；代码提交以 Git 记录为准，尚未发布或部署，用户视觉批准待完成。
