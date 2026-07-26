---
name: design-ingest
description: |
  把「看到的一套好风格」沉淀成 UI Lab 的正式设计系统：输入截图、网址或口头描述，提炼 14 个基色经 `makeWbSkin()` 展开为 42 个 `--wb-*` token，配齐 DESIGN.md、双语 prompt 与词汇，落进 `lib/layouts/design-systems.ts`——工作台立刻多一套可视皮肤，且自动进入 catalog/CLI 供后续项目复用。仅在 UI Lab 仓库内使用。
  触发方式：/design-ingest、「把这个风格沉淀下来」「收录这套设计系统」「照这个截图/网站做一套皮肤」「这个配色字体我想留着复用」，或用户贴出某个界面截图/链接并表示想要这种感觉。
  Ingest a style you've seen (screenshot / URL / verbal description) into UI Lab as a formal design system: distill 14 base colors, expand them through `makeWbSkin()` into the 42-token workbench contract, author the DESIGN.md + bilingual prompts + vocabulary, and land it in `lib/layouts/design-systems.ts` — instantly visible as a switchable workbench skin and reusable via catalog/CLI. Repo-internal skill for the UI Lab repository.
  Trigger: /design-ingest, "sediment this style", "capture this design system", "make a skin from this screenshot/site".
---

# Design Ingest — 看到 → 沉淀 → 复用

把野外看到的一套风格（背景/文字/字体/强调色这一整套）变成 UI Lab 的正式资产。产出物是一个 `DesignSystemEntry`：落库那一刻，`/layouts?ds=<slug>` 就能实时换肤看效果，`ui-lab show <slug>` 就能取回完整 DESIGN.md。**整条流水线的验收标准是肉眼对照，不是文字自洽。**

## 输入

三种任选，信息越多越准：

- **截图**（首选）：直接读图取色。多要几张——亮态/暗态、有弹层的、有按钮悬停态的。
- **网址**：用浏览器工具打开截图，并读取计算样式（背景色、文字色、边框色、`font-family`）辅助定值。
- **口头描述**：「近黑背景、暖白文字、薰衣草蓝点缀」也能开工，但落库前必须过第 5 步的可视对照。

## 第 1 步 · 提炼 14 个基色（唯一的取色工作）

**只挑基色，绝不手写 `--wb-*` 变量**——`makeWbSkin()`（`lib/layouts/skin.ts`）会按与 globals.css 相同的比例把基色展开成 42 个 token，保证新皮肤和其余 13 套有一致的深度与交互层级。逐字段取法：

| 字段 | 取什么 | 提示 |
|---|---|---|
| `scheme` | `"light"` 或 `"dark"` | 决定所有透明度配比 |
| `canvas` | 页面最底层背景 | 暗色系用小明度阶差（如 #0a0a0b） |
| `surface` | 面板/侧栏背景 | 与 canvas 差半档 |
| `raised` | 弹层/菜单背景 | 再抬半档 |
| `ink` | 主文字色 | 同时驱动 hover/inset 等透明度层 |
| `inkSecondary` | 次级文字 | |
| `inkMuted` | 弱化文字 | |
| `inkFaint` | 最弱文字/占位符 | 四档 ink 必须能排出清晰层级 |
| `hairline` | 发丝边框色 | 实色，透明度由展开逻辑处理 |
| `accent` | 唯一强调色 | 只用于焦点/选中/主操作 |
| `accentFg?` | 强调色上的文字 | 默认 #fff，深色强调色可省略 |
| `success` / `danger` / `warning` | 语义三色 | 样本里有就用样本的；没有就选与整体和谐的常规值 |
| `fonts?` | `{ body, display, mono }` 字体栈 | 仅展示用栈，**不加载任何 webfont** |

个别表面确实偏离配比时，才用 `makeWbSkin(base, overrides)` 的第二参精调个别 `--wb-*`（参考 frost 等现有条目），默认不用。

## 第 2 步 · 命名与词汇

- **`name`/`nameZh` 用中性名**（Graphite/石墨、Nightflight/夜航这个路数）——**真实产品名只能进 `keywords`**（隐藏检索词，永不渲染），这是 `lib/layouts/types.ts` 里写明的约定。
- `aliases`：2–4 个中英混合的「别人会怎么叫它」（如 "蓝紫单强调"、"lavender dark console"）。
- `description`/`descriptionZh`：一句话说清气质与适用场景。

## 第 3 步 · designMd（复用的主载荷）

照 nightflight 条目的模板写，**全部用具体值，不写氛围词**：

- frontmatter：`name` + 一句 `description`；
- `## Colors`：yaml 块逐角色列 hex（canvas/surface/raised/ink…/accent/语义三色）；
- `## Typography`：字体栈 + 常规/标签/标题三档字重；
- `## Surfaces & lines`：3–5 条表面与线的用法规则；
- `## Components` / `## Motion`：控件形制与动效纪律（时长、只动 transform/opacity、尊重 reduced motion）。

## 第 4 步 · 双语 prompt

公式 = **命名风格 + 带 hex 的具体视觉动作 + FORBIDDEN 反面清单**。正面写怎么搭层级、强调色管什么、字体怎么配；FORBIDDEN 至少 4 条（如：多彩渐变、厚投影、多强调色打架、装饰动画盖状态）。中英各一条，信息对等。

## 第 5 步 · 落库并肉眼验收

1. 在 `lib/layouts/design-systems.ts` 末尾（`DESIGN_SYSTEMS` 数组之前）新增 `export const <slug>DesignSystem: DesignSystemEntry = {...}`，并把它加进 `DESIGN_SYSTEMS` 数组。
2. dev server 打开 `/layouts?ds=<slug>`，与源样本**并排对照**：底色气质、四档文字层级、发丝线强度、强调色克制度、悬停/选中态。不像就回第 1 步调基色，直到像为止。数据文件自带双语文案，不需要动 messages/。

## 第 6 步 · 收尾（让它可复用）

```bash
bun run check                # typecheck + lint + registry check
NEXT_PUBLIC_SITE_URL=https://ui-lab-ten.vercel.app bun run cli:snapshot   # 刷 CLI 快照（必须带 prod 域名）
```

落库后 `/catalog.json`、`/llms.txt`、`/llms-full.txt` 随构建自动带上新条目；本地 `ui-lab show <slug>` 应能吐出完整 DESIGN.md。提交遵循仓库规范；提醒用户：**外部 `npx uilab-cli` 用户要看到新条目，需 bump 版本重发 npm**。

## 纪律（防走样）

- 一套皮肤只有一个 accent；语义色只描述真实状态。
- 基色不够像 ≠ 多写 overrides——先怀疑基色挑错了。
- 暗色系层级靠小明度阶差，不靠加边框加阴影。
- 任何展示组件不读 `window` 初值（hydration 教训）。
