# Standards 整改复测

范围：仅复测原 P2/P3；只读当前工作区，未编辑产品、未 commit/push。

- **P2：关闭。** `lib/registry.ts:31,68,73,78` 为 24 个新增资产登记 `usageFile`；`components/app/catalog/asset-detail.tsx:414,415,431` 读取并展示对应示例。逐项检查 19 个 sections、4 个 pages、1 个 sites：示例唯一非 React import 直接解析到条目的真实安装入口，该文件存在于实际 `buildShadcnItem()` 输出；安装闭包无站点 app/previews 源码或 Next/next-intl 依赖。24 个示例均在未提供站点 provider 的情况下完成 SSR 渲染。原“复制用法缺 barrel/预览控件/provider”触发条件已消除。
- **P3：关闭。** `components/previews/pages/preview-controls.tsx:20,24,33,38` 使用 `useTranslations("catalog.previewControls")`；`messages/zh.json:190`、`messages/en.json:190` 均提供两项标签和四种状态。实际 SSR 渲染两种站点 locale，六项文案全部匹配；中文输出“预览语言 / 预览状态 / 正常 / 加载中 / 空白 / 错误”。语言自称“中文 / English”保持合理。

验证：内存中运行 Bun 只读脚本，逐项解析 import、构建 registry 数据、导入示例并 SSR；退出码 0，P2 24/24，P3 zh/en 均通过。

结论仅关闭本轴原两条发现；不代表跨 Profile 实际安装/浏览器运行或其他实施的总体验收通过。
