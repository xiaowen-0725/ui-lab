# Polish

Polish 是受已批准 contract 约束的有限修改，不是重新设计。

## Bounded loop

1. **一次批量诊断。** 在选定页面、组件族或视觉类别内收集完整偏差，按共同根因聚类。
2. **一次共同根因修复。** 优先修 token、theme import、source family、layout contract 或共享 component anatomy；不要先做孤立像素补丁。
3. **一次确认。** 只重跑受影响的 static/runtime/visual case，记录已修、intentional difference 与 blocker，然后停止。

不得进入无界的 screenshot → tweak 循环。确认后仍不一致时，报告 blocker；若需要改变字体、主题、布局方向或组件语言，停止并回到 `select`。

## 边界

- 保持 approved contract、业务行为、a11y、responsive 与 source-family API。
- 不新增视觉方向，不借 polish 替换 System/Recipe，不扩大到未授权页面。
- 一种根因影响多个实例时修共享源；局部例外必须有产品理由。
- 验证遵循 [quality-gates.md](quality-gates.md)；视觉比较细节以 [visual-acceptance.md](visual-acceptance.md) 为准。

输出本次范围、根因、修改文件、确认 case 和未解决项。一次确认后结束路线。

