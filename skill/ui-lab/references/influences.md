# Influences and licenses

UI Lab 综合借鉴公开项目的流程思想，但维护自己的中文优先术语、路由、Catalog 契约和视觉资产。不要复制外部 prompt、品牌、课程话术、固定 picker 皮肤或作者个人偏好；需要复用源码时另行核对具体文件许可与 attribution。

| Project | License | 综合借鉴 | 不直接复制 |
|---|---|---|---|
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT | 动效目的/频率门、只读 review、分叉原型与 feel check | prompt 原文、个人品牌、固定数值作为跨项目绝对规则 |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT | 将视觉判断拆成显式选择与检查维度 | 品牌表达、原始 prompt 与项目特定偏好 |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | polish / harden 的有界工作流和质量分类 | prompt 原文、命名空间与未经验证的审美禁令 |

这些来源只影响方法论。UI Lab 的目标真源是 versioned Design System Package、Recipe、registry/source family、Compatibility Graph、OrderLock 与 EvidenceBundle；当前 System Preset/config/CatalogLock 只是 bridge。

`awesome-design-md` 固定审计来源 commit 为 `664b3e78fd1a298ba11973822da988483256d4b4`，当前仅作为 74 条 reference（64 structured、10 legacy Markdown），不等于官方设计系统或 production-ready Package。MIT 只覆盖其中可许可的文档/代码表达；品牌、商标、字体、截图和其他资产必须分别核验，不能随 reference 自动 vendor。

Codex 可作为 optional Package/reference，不是 UI Lab 的产品目标；Parking 只作为 Existing Adoption benchmark fixture，二者都不能定义全局 contract。
