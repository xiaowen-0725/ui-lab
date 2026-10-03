# UI Lab Visual Implementation

UI Lab makes tacit visual preferences explicit and executable while changing an existing frontend product. This language describes the user-facing visual implementation workflow, not its technical machinery.

## Language

**Visual Work Session**:
A task-scoped collaboration in which a person chooses, refines, and approves a frontend result for a Target Project.
_Avoid_: Studio, design order

**Target Project**:
The existing frontend product whose behavior, content, and established design constraints bound a Visual Work Session.
_Avoid_: Canvas, generated app

**Visual Reference**:
A screenshot, live surface, or sample used as evidence for specific visual qualities; it is not the implementation source of truth.
_Avoid_: Design spec, source design

**Executable Candidate**:
A proposed frontend result rendered from the same implementation that can be approved and promoted into the Target Project.
_Avoid_: Mockup, concept image

**Explore**:
The stage where a person compares Executable Candidates and selects the overall direction to continue.
_Avoid_: Gallery, style picker

**Refine**:
The stage where a person adjusts and locks regions of the selected Executable Candidate.
_Avoid_: Recreate, redesign from scratch

**Focus**:
A temporary viewing mode that shows the selected Executable Candidate without the surrounding decision controls; it is not a workflow stage.
_Avoid_: Preview stage

**Visual Decision**:
An explicit user choice that binds a visual preference to part of an Executable Candidate.
_Avoid_: Prompt preference

**Locked Region**:
A region whose accepted Visual Decisions are excluded from later changes until the person unlocks it.
_Avoid_: Finished page, approval record

**Promotion**:
Adopting the approved Executable Candidate as the Target Project result without regenerating its visual implementation.
_Avoid_: Handoff, reimplementation

## 目录语言

这些词描述目录里的东西。上一节的词描述视觉实现流程。

**组件**:
一个名字、一个安装入口、只承担一件界面职责的源码。体积不改变它是不是组件。动效组件和 shadcn/ui 原语都是组件。
_Avoid_: 大组件, 小组件, 基础组件

**区块**:
一段已经排好的布局。一次安装带走它引用的组件。
_Avoid_: 大组件, 复合组件

**页面**:
一屏。由区块和组件组成。
_Avoid_: 整站, 模板

**整站**:
多屏共用的一套壳。只登记页面名字，不另存一份页面源码。
_Avoid_: 模板, 单页

**系统**:
多个组件共用的具名规则，例如一档弹簧或一个控件高度。安装组件时只带走它引用的系统。
_Avoid_: 主题, 组件私有值

**主题**:
一套语义 Token 的具体取值，含明暗两态。项目里先有主题，安装组件时不覆盖它。
_Avoid_: 系统

**词典**:
给已经看见、还叫不出正式名字的东西准备的词。概念和动效是其中的两份名单。已有组件、区块、页面、整站、主题或系统时，词条指向它。
_Avoid_: 术语表, 词汇表

**概念词典**:
前端日常会用到的界面概念和黑话，例如按钮、侧边栏。一条含活样本、中文名、英文名、别名和一句人话。某个概念正好有我们的组件时可以指向它；没有就只留名字和样本。
_Avoid_: 术语表, 界面词典, 组件说明书

**动效词典**:
可以重放、可以对 AI 说出的动效行话。一条含名字、一句人话和样本；已有对应组件或系统时指向它，没有则只留名字和样本。
_Avoid_: 动画词典, 动效词汇表
