# 计划005 spec 复测

结论：**原 E1–E4 均可关闭；本轮未发现阻碍这四项关闭的缺陷。** 仅关闭原发现，不代表 R1–R8、整体工程或视觉验收通过。

基线 `a00c627`，2026-10-03 未提交工作区。只读产品代码；仅在临时目录保存脚本、编译产物和证据，未 commit/push。读取时点源码 SHA-256 见 [版本记录](/tmp/uilab-005-spec-retest-versions.txt)。

| 原发现 | 复测结果与证据行 | 关闭判断 |
| --- | --- | --- |
| **E1／P2** 实际 import 审计误报/漏报 | [audit.ts:364](/Users/zhoujw/develop/github/ui-lab/cli/src/audit.ts:364)动态加载消费者 TS；:374/:378 读取 config、extends 和 references；:393/:402 用 AST 与 TS 模块解析。原三个未改动夹具：root shadow 从错误通过变为正确报缺失，`.js`→`.ts` 与 import 字符串从错误拒绝变为通过。另 extends、solution references 均通过正向解析，并拦截 helper 的传递缺失。 | **关闭**。对应规格005:115“移除必需helper时能发现；可选变体不误报”。 |
| **E2／P2** 无效 section 引用仍写 config/Lock | [registry.ts:68](/Users/zhoujw/develop/github/ui-lab/lib/registry.ts:68)登记19个 section 身份；全部 metadata 与可构建安装目标核对通过。[catalog.ts:504](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:504)本地错误引用终止构建；[catalog-source.ts:342](/Users/zhoujw/develop/github/ui-lab/cli/src/catalog-source.ts:342)远端逐项校验。HTTP compose 的无效必需变体、无效可选变体、缺目标 section metadata 均退出1；config/Lock 字节不变，无旧Lock时仍不创建。 | **关闭**。对应规格005:15“Recipe 引用有效”、:117“显式源失败的写命令不改config/lock”。 |
| **E3／P2** Recipe 缺少完整资产关联 | [recipes.ts:63](/Users/zhoujw/develop/github/ui-lab/lib/recipes.ts:63)、:175 添加 site/page 示例；[catalog.ts:447](/Users/zhoujw/develop/github/ui-lab/lib/catalog.ts:447)输出 `relationship=example`。临时编译CLI在 Node 下，snapshot 与 live 的 show 均返回正确关联。剔除新增 examples 后，两份 Recipe 的全部字段与 a00c627 深比较一致；entry 仍分别为 agent-workbench、recording-card。 | **关闭**。对应规格005:99“补 Recipe/页面/整站关联”。保留原语义，未声明等价。 |
| **E4／P3** 页面列表重复 | [pages/page.tsx:28](/Users/zhoujw/develop/github/ui-lab/app/[locale]/pages/page.tsx:28)排除 PAGES 已登记的 registry 投影。调用真实页面函数、仅替换 locale/翻译依赖：zh/en 均由9卡变5卡，四个完整页各1卡，原 not-found 保留。 | **关闭**。对应规格005:168“一个名字指向明确资产”。此项为页面数据验证，未冒充浏览器/HTTP验收。 |

相关仓库回归：`bun test tests/installation-audit.test.ts tests/catalog-contract.test.ts tests/cli-integrity.test.ts`，**17 pass、0 fail、266 assertions、退出0**；[完整日志](/tmp/uilab-005-spec-retest-tests.log)。CLI `tsc -p cli/tsconfig.json --outDir <临时目录>/dist` 退出0，未改仓库 dist。隔离产物在 Node 下：消费者 TypeScript 代理（调用真实TS API、记录加载标记）可用时通过；无消费者/CLI编译器时硬错误。`cli/package.json` 仍无 runtime dependencies。

旧 E2 [v1脚本](/tmp/uilab-005-spec-section-probe.v1.ts)与原脚本 SHA-256 同为 `d6f43983a87224e79f25e0815a1ec55d0687d052833ac8bf664fa6f8b1f518d3`；[整改前结果](/tmp/uilab-005-spec-section-probe.v1.json)保持原退出0/写Lock证据。原脚本原样重跑后因假设Lock存在而报 ENOENT（[日志](/tmp/uilab-005-spec-section-probe.v1-current.log)），这是旧脚本假设失效。新 [v2脚本](/tmp/uilab-005-spec-section-probe.v2.ts)检查退出码及文件字节，不假设Lock存在，确认实际CLI退出1、拒绝来源、零写入（[结果](/tmp/uilab-005-spec-section-probe.v2.json)）。未覆盖或改写旧脚本/旧结果。

其他可复查证据：[E1原夹具结果](/tmp/uilab-005-spec-e1-original-fixtures.jsonl)、[E1扩展脚本](/tmp/uilab-005-spec-e1-extended-retest.ts)、[E1扩展结果](/tmp/uilab-005-spec-e1-extended-retest.json)、[E3/E4与19目标脚本](/tmp/uilab-005-spec-e3-e4-retest.ts)、[结果](/tmp/uilab-005-spec-e3-e4-retest.json)。

整体准入待办仍由主 Agent/台账依据真实证据关闭；本轮不判跨Profile、视觉、发布等未复测事项失败，也不替其填通过。
