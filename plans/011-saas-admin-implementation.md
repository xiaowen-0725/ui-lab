# SaaS Admin：整站实施与验证记录

2026-10-08。用户确认[完整规格](010-saas-admin-spec.md)、Free 两个私有区块及1280移动阈值；本记录区分实现、工程证据、用户视觉批准和发布。

## 当前实现

九类页面、十二条路由、外壳和整站已登记，单页/整站引用同一实现。Users详情保留五标签，资料/设置各两分支，三个数据表格及全部约定表单分支接入。基础控件为固定官方 shadcn Base UI 生成结果；页面组合来自固定免费 AdminCN。旧 ProjectWorkspace 未恢复，商业 Sales 不在确认范围。

[中文整站预览](http://localhost:3109/zh/sites/saas-admin-site/preview/dashboard/orders)、[英文默认预览](http://localhost:3109/en/sites/saas-admin-site/preview/dashboard/orders)。提供默认/Blue Ink及明/暗/system，中英文文案和消费导航、数据、异步提交接口。认证是无后台壳的原布局；动作成功只表示消费者回调完成。

来源与允许差异见[来源记录](../docs/sources/saas-admin.md)，实际路径/许可/hash见[文件台账](../docs/sources/saas-admin-inventory.csv)。除已确认的移动helper1280阈值外，未改官方控件API/事件/状态算法；Timeline/BackgroundRipple为来源明确的私有区块。正常props/className适配保留原卡片布局与表单组合。移除异步GitHub推广控件后，顶栏固定60px：Orders及详情/资料样本对齐；其他上游样本曾为57px，卡片整体纵坐标相差3px，尺寸/组合保持。此差异单独列出，不宣称逐像素相同。

## 工程证据

| 检查 | 结果与实际范围 |
| --- | --- |
| 根 check/test | 类型、lint、registry、Catalog、架构、快照和技能通过；263 pass/0 fail，34文件，[工程汇总](011-evidence/full-engineering-summary.json)。架构169安装目标/361活跃源码文件，快照571项；lint保留既有warning |
| 独立用法 | 11个安装身份逐一隔离闭包，strict类型/SSR/打包通过；22次Chrome浏览器hydration通过；最后两行表格配置修复后重跑受影响Table/Site两用法，额外4次通过，[最终复测](011-evidence/full-final-table-site-usages.json)。仅外部包解析复用根node_modules，源码别名不能回退根仓；[结果](011-evidence/full-standalone-usages.json) |
| 真shadcn安装 | shadcn4.21.4实际安装到独立Next15.5.18/Vite6.1.0项目，React19.2.0/Tailwind4.1.18。151个真实文件/803条模块引用；导入目标、TS AST、CSS语义、完整许可均通过，无根node_modules symlink。[安装](011-evidence/full-install-summary.json)、[核验](011-evidence/full-consumers-summary.json) |
| 独立消费者运行 | 两项目类型和生产build通过，每项目20项Chrome154.0.8037.98实测：12路由、query/history、品牌/模式状态保留、真实行目标、刷新偏好、system切换、提交失败保留/重试。捕获page/console errors及requestfailed均0；[Next](011-evidence/full-consumers-next-app-browser.json)、[Vite](011-evidence/full-consumers-vite-app-browser.json) |
| 根生产构建 | 停dev后Next15.5.18生产build通过，1402页面生成完成；保留既有metadataBase回退warning |
| 整站矩阵 | 18页面/分支 × 中英 × 默认/Blue Ink × 明/暗 × 1440/390 = **288/288**；最后两行getRowId修复只影响表格行为，最终生产构建重测16个DataTable组合并替换对应矩阵记录，其余界面源码未变。每项200，无捕获console/page异常、整页横向溢出或破图；主题状态正确。[矩阵](011-evidence/full-matrix.json) |
| 补充体验 | 7组保存/新增/详情/失败重试/存储/Sheet焦点；8组360/768 reduce壳/表格/表单/账号，2组纯键盘登录/品牌菜单，4组初始偏好帧，共21组通过。[状态](011-evidence/full-supplemental.json)、[键盘与窄屏](011-evidence/full-keyboard-widths.json)、[初始帧](011-evidence/full-first-frame.json) |

冻结消费sourceVersion：`1dc842c5355c93a0a9c77dfaa3e2b9b4ebf93fdc372a512655663a7f21b7268e`。CLI曾因同名orders私有文件误改type import，现改为transaction-types/transaction-samples，实际重装复核；Next站点预览controller移到共同layout，避免跨catch-all路由重挂导致新用户详情丢失；可分发源码图与独立消费者不受该站点包装修复影响。CLI也会去掉字体CSS注释，完整OFL另以font-license.ts文字随实际import闭包分发。字体字节未修改。

临时Bun＋Happy DOM数据/表单断言另验证完整筛选排序分页、选择、四种校验时机及ReportIssue全部字段的成功/错误/重试；[范围报告](011-evidence/full-data-form-dom-report.json)是agent归档，不与真实浏览器证据混同。Basic/Filters重排选择问题通过既有TanStack配置getRowId修复，并以[两个真实重排选择测试](../tests/saas-admin-row-selection.test.tsx)锁住行为，其他上游行为保留：Basic无额外排序/翻页入口，Filters的price列禁排序，Users列表禁用行选择。

## 视觉和体验边界

固定上游以英文/neutral/light/1440×1000逐页取得截图与几何数据；完整生产矩阵已留存对应截图，卡片数量/尺寸与固定上游一致；[几何对照](011-evidence/full-default-geometry-comparison.json)。初始偏好验证记录的是wrapper存在后的第一requestAnimationFrame，不等同于物理显示器首帧测量。新增的语言/品牌入口、消费动作反馈、修正目标用户及保存/取消语义是已确认适配；推广API/Pro菜单移除。键盘聚焦侧栏Tooltip后，第一个Escape关闭该浮层、第二个Escape关闭Sheet并恢复焦点，保留官方默认行为；等待初始化焦点进入Sheet后测试限制焦点，未修改原语。用户逐页视觉批准仍未记录，工程通过不能替代这一批准。

Filters的8张商品图仍为原CDN URL：固定仓库无字节及明确许可覆盖，已单独询问用户，未收到素材选择。当前不能宣称模板完全离线或商品素材已分发。53张本地来源图片与Geist/OFL已进入闭包。上游浅色chart-4对比度约1.72:1，保留来源值，不声明所有图表达到可访问性指标。整站直接组合所有首批页，独立Next首屏813kB，Vite minified入口2.50MB（gzip695kB），CSS553kB（gzip313kB）；尚未做路由分包或性能预算验证，保留构建包体warning。首轮浏览器仅Chrome；Safari/Firefox与完整WCAG审计不在已验证范围。

先前仅Orders的19项结果、49文件复制消费者和对应截图保留为历史证据，不用它们覆盖新增整站图。未提交、推送、tag、npm发布或部署。

## 审阅入口

| 页面 | 固定上游 | 当前默认 |
| --- | --- | --- |
| Orders | [上游](011-evidence/full-orders-upstream.png) | [当前](011-evidence/full-orders-default.png) |
| Users | [上游](011-evidence/full-users-upstream.png) | [当前](011-evidence/full-users-default.png) |
| Profile | [上游](011-evidence/full-profile-upstream.png) | [当前](011-evidence/full-profile-default.png) |
| Settings | [上游](011-evidence/full-settings-general-upstream.png) | [当前](011-evidence/full-settings-general-default.png) |
| Data tables | [上游](011-evidence/full-tables-upstream.png) | [当前](011-evidence/full-tables-default.png) |
| Login | [上游](011-evidence/full-login-upstream.png) | [当前](011-evidence/full-login-default.png) |

全部18分支的英文默认截图及14条上游入口截图均在`011-evidence/full-*.png`；用户可由同一预览继续检查中文、Blue Ink及深色。
