# 005 R8 独立只读复审（spec）

结论：**R8 可关闭**，无新增缺陷。默认系统补缺保留消费者深浅两态自定义值，显式 Theme Kit 替换有效，重复系统安装及主题后补缺幂等。结论限于已验证的 shadcn 4.21.1、Tailwind 4 安装契约，不代表跨 Profile 或视觉验收完成。

规格 [计划:118](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:118)：“全新项目补缺；已有自定义主题直接/间接安装均按契约保留；显式主题替换有效；重复安装幂等；深浅两态实测”。[计划:120](/Users/zhoujw/develop/github/ui-lab/plans/005-catalog-realignment-implementation-and-acceptance.md:120)：“R8 不预设所有间接安装都有覆盖缺陷。”

| 场景 | 代码与现有执行证据 | 只读复核结果 |
| --- | --- | --- |
| 默认补缺、保留消费者 | [分发:378](/Users/zhoujw/develop/github/ui-lab/lib/registry-server.ts:378) 系统为 registry:lib；[脚本:38](/Users/zhoujw/develop/github/ui-lab/scripts/verify-system-tokens.ts:38) 直装并断言保留；[脚本:45](/Users/zhoujw/develop/github/ui-lab/scripts/verify-system-tokens.ts:45) settings-panel 间接安装独立断言 | 现有直装、间接安装日志成功；间接项实际依赖 system-workbench。调用已安装 CLI 的纯 CSS 转换器，空 CSS 补齐两态各 43 个 token；部分自定义 CSS 补齐其余 token，surface 仍为 hotpink/rebeccapurple，无重复声明 |
| 显式 theme 替换 | [分发:358](/Users/zhoujw/develop/github/ui-lab/lib/registry-server.ts:358) Theme Kit 为 registry:theme；[脚本:48](/Users/zhoujw/develop/github/ui-lab/scripts/verify-system-tokens.ts:48) 安装并断言自定义值消失 | theme 日志成功；最终 CSS :root 第4行、.dark 第5行各 76 个 token 与当前 Graphite 契约逐项一致，无缺失、错值或重复声明 |
| 重复幂等 | [脚本:41](/Users/zhoujw/develop/github/ui-lab/scripts/verify-system-tokens.ts:41) 第二次系统安装全文相等；[脚本:50](/Users/zhoujw/develop/github/ui-lab/scripts/verify-system-tokens.ts:50) 主题后补缺全文相等 | 对应两份系统日志齐备；内存复测两项均字节相等，显式主题转换结果还与现有 fixture 最终 CSS 字节相等 |

已有消费者：[fixture](/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-system-tokens-Tn5XJ9/app/globals.css:4)。五份日志依次为 `system-workbench-1791035239145.log`、`system-workbench-1791035239673.log`、`settings-panel-1791035302567.log`、`theme-graphite-1791035303283.log`、`system-workbench-1791035303764.log`。[台账:69](/Users/zhoujw/develop/github/ui-lab/plans/005-acceptance-tracker.md:69) 记录完整脚本退出码 0。

核对该次 bunx 缓存的实际 @shadcn/registry 实现：覆盖判定检查直接请求项类型，registry:lib 与普通 block 默认不覆盖，registry:theme 覆盖；Tailwind 4 更新器存在声明则保留，覆盖模式则替换。现有日志显示脚本已推进到最后一次安装，前序断言必须已通过；最终相等断言另有台账成功记录及本次纯函数结果交叉支持。

证据边界：原 fixture 未留阶段 CSS 快照，保留与幂等证据由执行断言、连续日志及本次内存复测共同提供；不把它误称为已独立读取的历史中间态。没有重跑 bunx、安装依赖、起服务、构建或修改消费者/产品文件。

低成本验证：`bun --no-install /tmp/uilab-005-r8-readonly-probe.ts`，退出码 0。逐项结果及源码/最终 CSS 哈希见 [evidence.json](/tmp/uilab-005-r8-evidence.json)，复核脚本见 [readonly-probe.ts](/tmp/uilab-005-r8-readonly-probe.ts)。准入动作：统筹可仅将 R8 标记关闭；其他未验收项继续按原台账管理。
