# UI Lab 独立用法基础设施只读审查

日期：2026-10-07。范围：`lib/standalone-usage.ts`、`scripts/verify-standalone-usage.ts`、`lib/registry-server.ts` 的 usage 元数据、`scripts/check-architecture.ts`。

结论：当前实现能隔离正常 `@/` 源码导入，但尚不足以证明“只使用本安装项依赖”和“客户端 hydration 已完成”。发现 3 项 P1、3 项 P2。建议先修复 P1，再将结果用于完整独立消费验收。

本次按 code-review 技能分别判断需求与规范；以用户指定的工作区文件为审查对象。只读相关实现、辅助规则与现有测试，执行少量内存探针与登记枚举，没有运行全量验证、实际浏览器或生产构建，没有改仓库文件。唯一写入为本报告。

## 需求符合性

### R1 — P1：共享整份 node_modules，允许借用安装项未声明的包

位置：`scripts/verify-standalone-usage.ts:49`、`:64`、`:79`；`scripts/check-architecture.ts:38`、`:39`。

验证器将主仓整份 `node_modules` 链接进每个 fixture，没有检查示例的外部依赖是否属于 `buildShadcnItem(...).dependencies`。架构门禁只排除指定服务端模块；其他裸包引用不进入安装图检查。比如 button-base 示例同时导入正确入口及 `next-themes`，后者不属于 button-base 安装项，仍能从主仓找到。

只读证据：用内存中的 TypeScript filesystem host 模拟该 node_modules 链接，`next-themes` 解析到主仓 `node_modules/next-themes/dist/index.d.ts`；`inspectModule` 能识别此引用，但 `isServerModule("next-themes")` 为 false，也不满足内部导入分支。

影响：主仓恰好安装的第三方包掩盖真实消费者的缺依赖；普通源码文件没有借包，不等于外部包依赖隔离已经成立。

建议：检查示例直接外部导入的包根，只允许安装项声明依赖与明确的 React/Profile 基线；解析已允许包的传递依赖另行处理。共享依赖缓存可以保留，但不能把整份缓存的可解析性当作安装项依赖白名单。补“主仓存在、当前安装项未声明”的负例。

### R2 — P1：绝对路径可以绕过架构检查并直接借用主仓源码

位置：`scripts/check-architecture.ts:39`；`scripts/verify-standalone-usage.ts:64`、`:66`、`:71`、`:79`。

`@/` 指向 fixture 是正确的，但 TypeScript、Bun SSR 和 browser bundler 没有限制源码实际解析路径。架构检查只将 `@/` 和 `.` 开头的引用视为内部引用。示例先导入要求的安装入口，再额外导入 `/Users/zhoujw/develop/github/ui-lab/components/motion/button/metallic`，该绝对路径不会被归属检查拒绝，也不会使 `importsEntry` 失败。

只读证据：同一个内存 TypeScript 解析探针中，不存在于虚拟 fixture 的 `@/components/motion/button/base` 解析失败；主仓绝对路径 `/Users/zhoujw/develop/github/ui-lab/components/motion/button/base` 则直接解析到真实 `.tsx`。AST 探针确认绝对引用既未被标记为服务端引用，也不会进入内部依赖检查。

影响：可以借用主仓源码、其他 fixture 或其他安装包源码，产生“isolated”假阳性；这不是宣称当前示例已经这样做，而是门禁未封住该失败路径。

建议：为源码解析结果检查 realpath 归属，限定为当前 fixture 已分发文件与允许的外部包；架构门禁拒绝绝对路径等未经支持的源码引用。检查文件复制目标也应保持在 fixture 内，防止相对路径越界。为绝对路径及穿越 fixture 的导入提供负例。

### R3 — P1：SSR 子节点存在不能证明 hydration 已提交

位置：`scripts/verify-standalone-usage.ts:78`、`:102`、`:117`–`:120`、`:134`。

浏览器启动前已经把 SSR markup 写进 `#root`。之后 `#root > *` 的计数只证明服务端节点存在；即使客户端没有提交 hydration，节点也可能一直存在。生成的客户端入口没有提交标记，检查只等待固定 350ms，因此挂起或延迟的 hydration 可能被记作 `mounted: true` 并计入“browser hydration checks”。

现有 console/pageerror 监听确实能捕获许多 React hydration 错误，这是有效的辅助证据；但“没有捕获到错误 + SSR DOM 存在”不是完成证据。350ms 之后的异步异常也未覆盖。这里不主张所有 hydration mismatch 都会被漏掉。

建议：在客户端验收包装层通过 effect 设置 hydration 提交标记，等待该标记并设置明确超时；将 `onRecoverableError` 等 React 错误与 pageerror/requestfailed 明确收集，使用每个页面独立的错误归属。保留 SSR 到 hydrateRoot 的真实路径。将 hydration、交互动作与视觉检查分别记录，不用 mounted 一个布尔值替代。

### R4 — P2：架构门禁遗漏无独立 installSlug 变体的专属示例

位置：`lib/standalone-usage.ts:25`–`:29`；`scripts/check-architecture.ts:66`–`:75`。

`allStandaloneUsages()` 正确追加了无 installSlug 的变体，但架构检查只遍历 `allShadcnTargets()`，没有检查这些专属 usage 文件。当前只读枚举得到 168 个 usages，其中 10 个是这类变体：approval-card 的 questions/review、tool-result 的 terminal-output/request-result，以及 agent-activity 的 6 个变体。

这些专属示例若引入站点 provider、默认导出或错误源码入口，架构命令仍可能通过。独立验证器可能在编译/运行时抓到其中部分问题，但它未承担相同的架构规则；当前根 `check`/CI 也没有调用 `check:usage`，不能视为自动兜底。

建议：架构检查复用完整 usage 枚举。安装图选 `usage.installSlug`，入口要求选 `usage.sourceFile`，因为无独立安装变体的源码入口可能与父入口不同；不能仅将父 slug 传给现有函数。补一个无 installSlug 变体引用 provider 的负例。

### R5 — P2：错误退出通常保留，但证据文件缺少全局失败及原始错误详情

位置：`scripts/verify-standalone-usage.ts:84`–`:86`、`:90`–`:106`、`:128`–`:133`。

单例失败后继续其他例子，并在最后退出 1，这条传播路径正确。但单例错误只保存 `String(error)`，会丢失 stack/cause/code。只读探针中，带 EACCES cause 的 `Missing source file` 错误只剩通用消息，真实权限错误消失。

CSS 处理、浏览器启动、导航及清理等全局异常没有写入 result.json。假设所有单例的 typecheck/SSR/bundle 已成功，随后浏览器启动失败，JSON 仍可能表现为 `browserEnabled: true`、单例全 true、`browserChecks: []`，没有全局失败原因或最终 verdict。未捕获异常会令命令失败，所以这不是声称 CLI 会在该路径输出 PASS；问题在证据消费者无法准确判断失败/未完成。

另外，finally 内读取版本、写证据或关闭浏览器若失败，会替换原异常；`await browser.close(); server.stop(true)` 在 close 失败时不再执行 server.stop。

建议：记录顶层阶段、globalErrors、期望/实际浏览器检查数、最终 passed/failed/skipped/incomplete 状态；按结构保存 error.name/message/stack/cause/code。证据和清理失败作为附加错误保留，不覆盖首次失败；资源逐一 finally 清理。验收判断同时要求阶段完成，不能只看已完成单例的布尔值。

### R6 — P2：检查未覆盖示例的零参数调用契约

位置：`scripts/verify-standalone-usage.ts:33`–`:37`、`:66`、`:70`、`:78`。

导出检查只要求一个以 Example 结尾的具名函数，不检查参数或准确导出名。TypeScript program 只有 usage 文件及分发源码；随后生成的 `<Example />` SSR/browser 包装只由 Bun 转译，没有纳入 strict TypeScript 检查。

只读内存探针：`export function ReviewExample(props: { title: string }) { return <div>演示内容</div>; }` 单独编译零诊断；将生成的 `<ReviewExample />` 调用包装加入 program 后，产生 TS2741（缺少必填 title）。这种函数若不读取 props，运行时仍能渲染，现有检查因而不能证明符合零参数函数要求。

建议：将两个调用包装纳入类型检查，并按使用示例契约检查零参数具名导出。若要求 PascalCase(slug)+Example，还应在 usage 元数据中携带期望 exportName，避免仅靠后缀发现任意函数。

## 规范符合性

- **独立消费与依赖方向：不完全符合。** R1/R2 对应 CONTRIBUTING.md 第 4 节的实际独立消费者验证，以及 CODING_STANDARDS.md“组件化与依赖方向”的消费边界。现有解析证明普通 alias 隔离，但不能支持完整依赖隔离结论。
- **SSR 与完成条件：不完全符合。** R3 对应 CODING_STANDARDS.md“交互、SSR 与动效”的 hydration 验证及“审查完成条件”的实际验证范围；R5 对应实际失败与复测证据的准确留存。运行失败不可由不完整结果 JSON 暗示已完成。
- **专属用法与复制契约：不完全符合。** R4/R6 对应 CONTRIBUTING.md 第 3 节独立变体用法要求及 CODING_STANDARDS.md 的公共 props/导出/复制用法一致要求。
- **usage 元数据分层：符合本次边界。** `RegistryTarget.usageFile` 分别选择变体/父用法；`buildEntry` 将 `{ path, content }` 放在独立 usage 字段，未塞入安装 files。`buildShadcnItem` 仍从真实组件图收集安装源码。usage 元数据缺文件会通过 readSourceFile 抛错，没有静默回退到预览内容。
- **来源信息：未发现本次元数据新增越界。** 安装源码现有来源/许可注释不会被 usage 字段替换，withSignature 的文档 URL 是源码注释而非运行时站点依赖。本地证据包含 root/evidence 路径，但当前写入 /tmp，不是新增公开接口。usage 字段返回登记的示例内容，不能据此推断所有示例文本或上游许可证已完成全面审计；本次未作该范围声明。

## 已成立的边界与尚未验证的范围

- 每个 usage 使用独立目录，仅复制对应 buildShadcnItem.files；正常 `@/` 指向该目录。这会阻止普通 alias 缺 helper 时退回主仓，属于有效隔离措施。
- SSR 用单独 Bun 子进程，退出码非零会导致该例失败；浏览器使用实际 SSR markup 与 hydrateRoot，而非 createRoot。这一方向正确，缺少的是完成判据与完整错误证据。
- CSS 是共享消费者环境：`:94` 以主仓为 Tailwind base、扫描整份 evidence，再注入完整 Graphite。它没有按单个 item 安装 registryDependencies/cssVars，也没有以 source(none) 限定扫描。可用于统一 Graphite 下的挂载检查，不能证明单项 CSS/Token 分发闭包完整或没有借用其他例子的样式。CONTRIBUTING.md 已明确架构脚本不判断 CSS 完整依赖，因此此处作为验收范围限制，不额外判为规范违例。
- 浏览器仅覆盖 light 页面中 no-preference/1440 与 reduce/390 两个组合；没有操作控件，也未切 .dark。报告应保持这个实际范围，不扩展为交互回归、明暗验收或视觉批准。
- 未重复执行 168 项验收、check、test、build，未启动浏览器，未安装依赖。

## 只读证据与复核入口

1. 读取四个目标文件及 source-files、architecture-rules、signature、相关测试和 CSS 模板；静态定位见以上行号。
2. `allStandaloneUsages()` 枚举：168 usages、10 个无独立安装身份变体、当前没有重复 key。
3. TypeScript 内存解析探针：绝对主仓源码可解析，fixture alias 在缺源码时不可解析；共享缓存使 next-themes 可解析。没有创建 fixture 文件。
4. AST 内存探针：next-themes 与绝对路径引用不会进入当前内部安装图检查。
5. TypeScript 内存调用探针：只检查示例定义为零诊断，加入零 props 调用后报 TS2741。
6. Error cause 字符串化探针：String(error) 丢失 EACCES cause。一次 write:false 的缺失入口 Bun.build 探针直接抛出 ModuleNotFound，因此未将未经证实的 build.logs 字符串化行为列为发现。

审查快照 SHA-256：

```text
cb784b2b122b815e09cdd8e0dbfda0054a399091a83d3ee48f833d9b41eb66a2  lib/standalone-usage.ts
3e7dbec1f2090b0d2e2d7e5dcae569dde9452861d90bdc9e0c8bf51f34649213  scripts/verify-standalone-usage.ts
ae42e629e00311a638ae8c1dd815957900e6f5f9549c3d3f236e6d44970a7084  lib/registry-server.ts
90fe54f8d2e5e5ec71fec482979fbfef4af29fb7fa3537a80747079a65659afa  scripts/check-architecture.ts
```

需求轴：6 项发现，其中 3 项 P1，最严重为依赖/源码隔离与 hydration 完成证据不足。规范轴：独立消费、验证证据和复制契约三类不完全符合；usage 分层及本次来源信息边界符合。
