Standards｜a00c627；排除 skills-lock.json/.grok，只读。

- P2 硬违规（PRODUCT_DEFINITION.md:46）：saas-landing-page.preview.tsx:3–6 引入 next-intl、barrel、预览控件；asset-detail.tsx:414 当作“用法”。安装后复制缺模块/provider；只读构建确认五个新资产不分发 barrel/控件。提供直接导入安装入口、无站点依赖的用法。
- P3 硬违规（AGENTS.md:57）：preview-controls.tsx:22、31、36–39 硬编码英文标签/状态；中文预览仍是英文。补双语 messages/useTranslations。

无 heuristic。文档/台账、跨 Profile、触屏/reduced-motion 验收列待办，不判失败。
