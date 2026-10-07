# 计划005：目录调整与红队修复验收报告

2026-10-03。基线 `a00c6278b57012d791c14825857e411b5e208455`；验收对象为未提交工作区。**阶段0–5本地工程验收通过，八项红队问题全部闭环；独立两轴及最终准入通过。** npm、Vercel、Git均未发布；用户视觉批准未作。最终状态以[验收台账](005-acceptance-tracker.md)为准。

## 实施结果与职责边界

七个用户入口不变，资产按界面职责归类：词典负责命名发现，组件负责单一界面职责，区块负责组织布局，页面区分完整实现与骨架，整站区分多页组合与外壳，主题区分取值/ThemeKit/共享系统，灵感保留来源与权利边界。模板是检索语言，引用已有页面/整站/Recipe；没有额外复制模板源码。

```text
app/
  [locale]/                    # 中文默认、/en双语浏览路由
    dictionary/                # 概念/动效，关联真实资产
    components/ blocks/        # 职责分类视图；历史category详情兼容
    pages/[slug]/              # 4完整页 + 404家族；另有8布局骨架
    sites/[slug]/              # 1多页组合；共享外壳另行标明
    themes/[slug]/             # 14真实Theme Kit；旧取值页继续可达
    inspiration/ docs/         # 参考来源/网站/品牌；操作文档
  r/ catalog.json/ llms.txt/    # 非本地化机器协议；路径契约保留
  themes/[slug]/route.ts       # 发布 /themes/<slug>.css 双态主题
components/
  motion/ agents/              # 既有可复用源码，原位置保留
  ui/modal.tsx                # 共享原生模态行为
  sections/                    # 19区段变体，站点演示引用同一实现
  pages/                       # SaaS/会话/制品/设置4页 + shared state
  site-shells/                 # 多页组合引用页面及原Workbench壳
  examples/                    # 可复制用法，直接import真实安装入口
  previews/                    # 双语演示，演示数据/控制器不进必需闭包
  app/                         # 站点chrome、目录、文档、展示适配
lib/
  registry.ts                  # 展示登记 + 显式assetRole + 变体身份
  registry-server.ts           # 安装target、真实import闭包与sourceVersion
  catalog.ts                   # 10种Catalog契约的统一只读投影
  concepts.ts motions.ts      # 独立词典领域真源
  sections/ patterns/ scroll/ # 独立组合知识真源，不以Catalog替代
  pages.ts sites.ts recipes.ts # 完整源码登记/多页引用/组合约束
  styles.ts palettes/ atoms/   # 风格、配色和视觉/动效取值
  theme-kits.ts ease.ts hooks/ # ThemeKit、motion token、共享行为
cli/                           # 独立package，只消费Catalog与冻结快照
skill/ui-lab/                  # discover/install两路线
benchmarks/runs/                # 独立工程与真实消费者fixture
scripts/ tests/                # 契约门禁、负向场景和运行验证
plans/005-* docs/adr/0002-*     # 迁移对账、准入、复测及架构决策
```

`motion`/`blocks`是保留的历史URL与源码category；产品角色是`component|block|page|shell|site`。七导航、Catalog kind、shadcn type各按自身职责消费事实。保留595条基线记录，新增24源码资产及30独立安装变体，共649条有归属/来源/身份/旧新URL/原因/回滚；128展示条目对应158安装身份，Catalog有558条机器记录。这些数值统计不同层，不把649称为649个组件。

来源所有权与安装闭包分别公开；闭包和sourceVersion由真实分发builder派生。CLI不import主仓库lib；写操作显式来源失败时拒绝写入，只读回退标明来源；增量Lock保留旧项基准，显式lock才重建。Audit读取消费者TS AST及模块解析，不宣称源码/API等价或视觉通过。

## 关卡及可复查证据

| 验收关卡 | 实际结果 | 证据 |
| --- | --- | --- |
| 根仓持续门禁 | check退出0；3条原有技能模板warning，无新增error；新增check:catalog覆盖649对账/158target/领域全覆盖/Usage/导航 | 根仓脚本与tests/catalog-coverage.test.ts |
| 全量根仓测试 | 232pass、0fail、11120assertions、28文件 | [日志](005-evidence/root-tests.txt) |
| 根仓生产构建 | dev停止后build退出0；修复后重新生产运行 | [日志](005-evidence/root-build.txt) |
| CLI | typecheck/build及真实构建产物命令通过；558快照与机器端点/源码一致 | cli/catalog.snapshot.json；site-result.json |
| HTTP及双语站点 | 1231请求；158JSON+158raw；14Theme/CSS；439旧新路由中英；旧OTP URL保持回归 | [结果](005-evidence/site-result.json) |
| 站点浏览器 | Chrome154；中英×深浅×390/768/1440共12组合、120场景；36截图，pageerror0 | [结果](005-evidence/site-result.json)；[截图](005-evidence/screenshots/) |
| Next消费者 | 真shadcn安装、同dir CLI链、负向缺helper/恢复、独立typecheck/build、生产运行，129检查/66截图/0error | [结果](005-evidence/next-app-browser.json)、[命令](005-evidence/consumer-next-vite-commands.json) |
| Vite消费者 | 同上，运行构建后的preview，129检查/66截图/0error | [结果](005-evidence/vite-app-browser.json) |
| Electron消费者 | 实际Electron38.2.0 hidden BrowserWindow/file renderer，129检查/66截图/0error | [运行结果](005-evidence/electron-renderer-browser.json)；[消费者全过程](../benchmarks/runs/catalog-assets/ACCEPTANCE.md) |
| 模态安装消费 | 真shadcn独立package，typecheck/build、Tab/Shift-Tab、初始/恢复focus、inert、nestedEscape、真实touch事件、reduce通过 | [结果](005-evidence/modal-consumer-result.json) |
| 共享系统/主题 | shadcn4.21.1，直装/间接保留自定义两态、补缺、显式theme替换、幂等 | [独立复核](005-evidence/r8-review.md) |
| Greenfield | 当前Catalog显式更新Lock后，完整verify退出0，8E2E通过；只覆盖原Graphite/Workbench工程回归 | `/tmp/uilab-005-greenfield-final.log` |

消费者采用分发builder冻结后的源码，示例数据和业务回调由消费方提供；4完整页及多页组合验证loading/empty/error/ready、navigationfocus、send/save/download、表单保持、FAQ/锚点、无横向溢出和共享主题。24个复制用法无站点provider，经独立SSR与消费者编译检查；它们不是必须分发的演示控件。没有从截图重新生成实现，没有过滤React/控制台错误来获得通过。

原CSV110条完整query/hash×zh/en的220锚点已在浏览器逐项验证URL保持、目标存在和进入viewport，错误0：[深链结果](005-evidence/deep-links-result.json)。首验Atoms异步挂载定位失败，修复并复测；动效/图标取值的reduce结构不一致也一并修复，最新生产120场景+220锚点均无异常。

人工视觉检查由统筹实际查看中文手机站点、SaaS完整站点截图、英文暗色桌面Next工作台和英文手机Electron工作台，未观察到主要内容遮挡、横向溢出或主题错位；其他自动截图不冒充逐项人工视觉批准。

## 红队与复审闭环

[最终独立准入](005-evidence/final-independent-acceptance.md)支持全部R-ID及三Profile工程关闭。原八项R1–R8的修复和首验/复测追踪见[台账](005-acceptance-tracker.md)。独立两轴报告保持分开：

- 标准轴：P2用法带站点provider、P3中文预览标签未翻译，均关闭。[首审](005-evidence/standards-initial.md)／[复测](005-evidence/standards-retest.md)。
- 规格轴：E1依赖解析误报漏报、E2无效section仍写入、E3Recipe缺完整资产关联、E4页面重复展示，均关闭。[首审](005-evidence/spec-initial.md)／[复测](005-evidence/spec-retest.md)。
- 生产运行发现F-HYDRATION：媒体偏好导致SSR/客户端文字节点不同；修复结构稳定、reduce仅透明度且0stagger，复测120场景0异常。[独立复核](005-evidence/hydration-review.md)。
- fixture失败保留：浏览器缺下载、CSS误作HTML、networkidle超时、summary多匹配、FAQ初始状态、favicon缺资源、退出动画未清理即重开、Electron网络超时。修正测试边界后再执行原真实场景；未抹去原失败或替换产品预期。

## 范围与发布边界

已运行的触屏证据来自Chrome触摸模拟/CDP touch事件；物理iOS Safari、Firefox/WebKit未执行。浏览器工程检查及截图人工检查不等于用户视觉批准，也不代表全库每一变体在每一浏览器逐项视觉验收。消费者后端/鉴权/数据库/发布运维在本次范围外。

本轮没有恢复Studio、Order、创建器、订单或批准产品状态机。没有commit/push/tag/npm/Vercel发布，线上仍可能是旧代码；发布与线上复验属于阶段6，需要明确授权后另行闭环。源码改动已构建但版本号未发版，不能把未发布CLI描述为npm当前能力。
