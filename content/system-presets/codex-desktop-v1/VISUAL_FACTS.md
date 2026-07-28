# 视觉事实：Codex Desktop v1

## Authority hierarchy

1. `codex-workbench-light` 与 `codex-desktop-light` 是 authoritative calibration 角色；后者是 hash-only/private evidence，公开仓库不发布 bytes。
2. 本机 Codex desktop/ChatGPT.app bundle token 是 measured evidence，只校准可观察 token。
3. `codex-composer-dark` 只参考 composer anatomy/geometry；ambient gradient 与 studio presentation frame 被排除。没有 dark full-workbench screenshot；dark surface 由 bundle token、light anatomy 和 dark composer calibration 合成，仍需 checkout 人工确认。
4. 当前 Parking mobile 和合成对比截图是 failure evidence，绝不是 reference。

仓库仅 vendored safe generic workbench 与 dark supporting 图。OpenAI Sans 仅是安装包具名资产证据，不复制也不 vendoring；实际基础字体是 platform system sans。图标为 Lucide，默认 16px、2px stroke。保留原生 platform chrome。

## Observed

- Type：14px 基础字，11/12/14/16/18/24 阶，400/500/600；system sans 与 system mono。
- Layout：4px 间距基准；46px toolbar、36px small toolbar、40px pane；sidebar clamp；thread content max width 为 48rem。
- Color：低对比灰阶、白色主画布/`#181818` 暗主画布、低色度蓝选择面；前景混色边框 5/8/12%。
- Geometry：2–24px 圆角阶、10px row、22px 单行 composer、9999px pill；shadow 精确为 hairline `0px 0px 0px .5px #0000001a`、sm `0px 1px 2px -1px #00000014`、md `0px 2px 4px -1px #00000014`、lg `0px 4px 8px -2px #0000001a`、xl `0px 8px 16px -4px #0000001f`、2xl `0px 16px 32px -8px #00000030`。
- Motion：.15s basic、.3s relaxed，进入 `.19,1,.22,1`，snappy `.23,1,.32,1`。
- Anatomy：quiet header、tinted sidebar、plain main canvas、bottom composer、compact popover、sparse shadow。

## Derived target

Parking 以 fixture 的任务/历史、agent conversation/execution、operation/result、connector/runtime、task composer、task workspace 进行语义映射；Board 和 Connectors 继承 anatomy，不伪造 Codex 数据。目标验收尺寸为 wide 1440×900、collapse 1000×760、narrow 375×760。原始 calibration source 可有不同尺寸，不能当作同尺寸 golden。

## Forbidden

禁止选中背景/文字/图标同时使用高饱和青色、generic dashboard cards、过大圆角、无关 gradient/glass、混用图标族、竞争型字号阶，或以装饰动效隐藏状态。
