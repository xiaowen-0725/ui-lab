import { makeWbSkin } from "./skin";
import type { DesignSystemEntry } from "./types";

export const graphiteDesignSystem: DesignSystemEntry = {
  slug: "graphite",
  name: "Graphite",
  nameZh: "石墨",
  aliases: [
    "工具型 Agent 工作台",
    "agent workbench baseline",
    "三栏任务控制台",
    "graphite console",
  ],
  description:
    "The baseline light-and-dark skin for a tool-first Agent workbench: quiet graphite surfaces, hairline structure, compact controls, and one restrained accent keep long-running work legible without competing with it.",
  descriptionZh:
    "工具型 Agent 工作台的基准深浅双态皮肤：安静的石墨表面、发丝结构线、紧凑控件与单一克制强调色，让长时间运行的任务始终清楚而不喧宾夺主。",
  skin: {
    vars: {},
    siteVars: {},
    scheme: "auto",
  },
  promptZh:
    "采用「Graphite / 石墨 Agent 工作台」设计系统：搭建可拖拽的三栏工作台，左侧是紧凑会话轨，中间是固定阅读宽度的 Agent 线程与贴底输入台，右侧是按需打开的产物区，提供产物预览、原始源码与版本恢复；用近中性的石墨灰分层、0.5–1px 发丝描边、低对比悬停面和单一冷色强调来表达层级；信息密度高但行高克制，代码和命令使用等宽字体，状态只在成功、警告、错误时短暂引入语义色；同时提供浅色与深色主题，组件尺寸和空间关系保持一致。FORBIDDEN：彩色渐变大背景、厚重投影、玻璃拟态泛滥、多个竞争强调色、超大圆角卡片堆叠、把桌面三栏降级成普通营销页、用装饰动画遮盖任务状态。",
  promptEn:
    "Use the 'Graphite Agent Workbench' design system: build a resizable three-column workbench with a compact conversation rail on the left, a fixed-reading-width Agent thread plus bottom composer in the center, and an on-demand artifact area on the right with rendered preview, raw source, and version restore. Establish hierarchy with near-neutral graphite surfaces, 0.5–1px hairlines, low-contrast hover fills, and one restrained cool accent. Keep density high but line-height controlled; use monospace for code and commands, and introduce semantic color only for success, warning, and error states. Support matching light and dark themes without changing component sizing or spatial relationships. FORBIDDEN: colorful gradient backdrops, heavy drop shadows, glassmorphism everywhere, competing accent colors, stacks of oversized rounded cards, collapsing the desktop workbench into a generic marketing page, or decorative animation that obscures task state.",
  designMd: `# Graphite

Graphite is a baseline light-and-dark design system for tool-first Agent workbenches.

## Principles

- Keep the work visible: chrome is quiet, dense, and subordinate to the task.
- Build hierarchy with graphite surface steps and 0.5–1px hairlines.
- Reserve one cool accent for selection, focus, and active execution.
- Use semantic color only for success, warning, approval, and failure.

## Workbench anatomy

- Header: compact global controls and the current task title.
- Sidebar: resizable conversation rail with grouped, selectable threads.
- Thread: fixed reading width for user prompts, work logs, tools, and artifacts.
- Composer: pinned input with explicit context, model, effort, and attachments.
- Artifacts: optional resizable preview/source panel with version navigation and restore; it squeezes the main column in flow.

## Typography and motion

Use a neutral system sans stack for UI and a system monospace stack for commands. Animate transform and opacity only; keep routine feedback below 300ms, respect reduced motion, and never animate away critical state.
`,
  keywords: [
    "agent ui",
    "ai workbench",
    "coding agent",
    "developer console",
    "three pane app",
    "thread composer artifacts",
    "artifact panel",
  ],
};

export const nightflightDesignSystem: DesignSystemEntry = {
  slug: "nightflight",
  name: "Nightflight",
  nameZh: "夜航",
  aliases: ["夜间任务舱", "近黑工艺工作台", "lavender dark console", "蓝紫单强调"],
  description:
    "A near-black workbench with cool graphite depth, precise lavender-blue focus states, and restrained contrast for long-running tasks after dark.",
  descriptionZh:
    "以近黑层次、冷静石墨深度与精准薰衣草蓝焦点构成的夜间工作台，适合长时间运行与持续监看任务。",
  skin: makeWbSkin(
    {
      scheme: "dark",
      canvas: "#0a0a0b",
      surface: "#0f1011",
      raised: "#18191a",
      ink: "#f7f8f8",
      inkSecondary: "#d0d6e0",
      inkMuted: "#8a8f98",
      inkFaint: "#62666d",
      hairline: "#23252a",
      accent: "#5e6ad2",
      success: "#27a644",
      danger: "#eb5757",
      warning: "#f2994a",
      fonts: {
        body: "'SF Pro Display', Inter, system-ui, sans-serif",
        display: "'SF Pro Display', Inter, system-ui, sans-serif",
        mono: "'SF Mono', ui-monospace, monospace",
      },
    },
    { "--wb-border-strong": "#34343a" },
  ),
  promptZh:
    "采用「Nightflight / 夜航工作台」设计系统：用 #0a0a0b 近黑画布、#0f1011 主表面和 #18191a 浮层建立低照度纵深，以细密冷灰发丝线切分侧栏、线程、输入台和产物区；正文保持清晰冷白，次级信息逐级退到灰蓝，#5e6ad2 只用于焦点、选中态和主行动，成功、危险、警告仅在真实状态出现；排版采用紧凑系统无衬线与等宽代码字，交互短促、安静、可预期。\n\nFORBIDDEN：多彩渐变、暖色基底、粗边框、大面积阴影、把强调色当装饰铺满界面，或让强调色出现在焦点、选中和主按钮之外。",
  promptEn:
    "Use the 'Nightflight Workbench' design system: establish low-light depth with a #0a0a0b canvas, #0f1011 primary surfaces, and #18191a raised layers, then separate the sidebar, thread, composer, and artifact area with precise cool-gray hairlines. Keep primary copy crisp and cool, step secondary information down through blue-gray tones, and reserve #5e6ad2 for focus, selection, and primary actions. Semantic green, red, and orange appear only when the underlying state is real; typography is a compact system sans paired with a technical monospace, and motion stays brief, quiet, and predictable.\n\nFORBIDDEN: multicolor gradients, warm foundations, thick borders, large shadows, decorative accent coverage, or using the accent anywhere beyond focus, selection, and primary controls.",
  designMd: `---
name: Nightflight
description: A near-black workbench with a single lavender-blue focus color.
---

# Nightflight

## Colors

colors:
  canvas: "#0a0a0b"
  surface: "#0f1011"
  raised: "#18191a"
  ink: "#f7f8f8"
  ink-secondary: "#d0d6e0"
  ink-muted: "#8a8f98"
  ink-faint: "#62666d"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  accent: "#5e6ad2"
  accent-hover: "#828fff"
  success: "#27a644"
  danger: "#eb5757"
  warning: "#f2994a"

## Typography

typography:
  body: "'SF Pro Display', Inter, system-ui, sans-serif"
  display: "'SF Pro Display', Inter, system-ui, sans-serif"
  mono: "'SF Mono', ui-monospace, monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep the canvas almost black and distinguish depth with small value steps.
- Use 0.5–1px cool hairlines; reserve the strong line for active boundaries.
- Avoid ambient shadows. Raised layers should read through tone and adjacency.
- Keep routine radii compact and consistent across controls and panels.

## Components

- Sidebar: use the primary surface with faint rows and one lavender selection.
- Thread: keep the reading field quiet; logs and code sit on restrained insets.
- Composer: raise it one step, show a precise focus line, and avoid glow.
- Artifact panel: match the main surface, retain hairlines, and show version state clearly.
- Buttons: solid accent is only for the primary action; secondary actions stay neutral.
- Status: introduce semantic color only for actual success, danger, or warning.

## FORBIDDEN

- Multicolor or decorative gradients.
- Warm foundations and amber-tinted neutrals.
- Thick borders, large shadows, or luminous glows.
- Accent color used outside focus, selection, and primary actions.
`,
  keywords: ["linear", "linear.app style", "lavender dark"],
};

export const starkDesignSystem: DesignSystemEntry = {
  slug: "stark",
  name: "Stark",
  nameZh: "锋白",
  aliases: ["纯黑工具台", "高对比几何", "monochrome console", "单蓝链接色"],
  description:
    "A pure-black, high-contrast tool surface shaped by crisp geometry, compact radii, and a single electric-blue action color.",
  descriptionZh:
    "以纯黑底、高对比灰阶、利落几何和单一电蓝行动色构成的紧凑工具界面。",
  skin: makeWbSkin(
    {
      scheme: "dark",
      canvas: "#000000",
      surface: "#0a0a0a",
      raised: "#111111",
      ink: "#ededed",
      inkSecondary: "#cccccc",
      inkMuted: "#a1a1a1",
      inkFaint: "#666666",
      hairline: "#2e2e2e",
      accent: "#0070f3",
      success: "#50e3c2",
      danger: "#ff4d4f",
      warning: "#f5a623",
      fonts: {
        body: "Geist, Inter, system-ui, sans-serif",
        display: "Geist, Inter, system-ui, sans-serif",
        mono: "'Geist Mono', 'SF Mono', ui-monospace",
      },
    },
    { "--wb-border-strong": "#444444" },
  ),
  promptZh:
    "采用「Stark / 锋白工作台」设计系统：以纯黑 #000000 为画布，使用 #0a0a0a 与 #111111 形成极小但清楚的表面阶梯，所有信息依靠高对比灰阶、紧凑网格、短标签和不超过 8px 的圆角组织；#0070f3 只承担链接、焦点和主行动，侧栏、线程、输入台和产物面板共享锋利的发丝边界，等宽字体负责代码、版本与运行状态。\n\nFORBIDDEN：灰阶之外的底色、彩色渐变背景、超过 8px 的大圆角卡片、发光阴影，以及用柔软装饰削弱几何秩序。",
  promptEn:
    "Use the 'Stark Workbench' design system: start from a pure #000000 canvas and build only small but legible surface steps with #0a0a0a and #111111. Organize the interface through high-contrast grayscale, a compact grid, short labels, and radii no larger than 8px. Reserve #0070f3 for links, focus, and the primary action; give the sidebar, thread, composer, and artifact panel the same crisp hairline boundaries, while monospace carries code, versions, and execution state.\n\nFORBIDDEN: tinted foundations outside grayscale, colorful gradient backgrounds, large cards with radii above 8px, glowing shadows, or soft decoration that weakens the geometric order.",
  designMd: `---
name: Stark
description: A pure-black geometric workbench with one electric-blue action color.
---

# Stark

## Colors

colors:
  canvas: "#000000"
  surface: "#0a0a0a"
  raised: "#111111"
  ink: "#ededed"
  ink-secondary: "#cccccc"
  ink-muted: "#a1a1a1"
  ink-faint: "#666666"
  hairline: "#2e2e2e"
  hairline-strong: "#444444"
  accent: "#0070f3"
  success: "#50e3c2"
  danger: "#ff4d4f"
  warning: "#f5a623"

## Typography

typography:
  body: "Geist, Inter, system-ui, sans-serif"
  display: "Geist, Inter, system-ui, sans-serif"
  mono: "'Geist Mono', 'SF Mono', ui-monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep foundations strictly black and neutral gray.
- Separate layers with exact value steps and 1px hairlines, not atmospheric depth.
- Cap large container radii at 8px; small controls may be tighter.
- Do not use glow. If elevation is necessary, prefer a hard local boundary.

## Components

- Sidebar: compact rows, square rhythm, and one high-contrast selected state.
- Thread: maximize readable contrast and keep metadata visibly subordinate.
- Composer: use a clear border and compact controls with no floating-card effect.
- Artifact panel: align to the grid and preserve crisp preview/code boundaries.
- Buttons: blue is primary only; neutral buttons use monochrome hover fills.
- Status: use semantic colors as small state signals, never as backgrounds.

## FORBIDDEN

- Tinted or colored foundation surfaces.
- Colorful gradient backgrounds.
- Large cards with radii above 8px.
- Glowing shadows or soft decorative effects.
`,
  keywords: ["vercel", "geist", "triangle"],
};

export const paperDesignSystem: DesignSystemEntry = {
  slug: "paper",
  name: "Paper",
  nameZh: "纸感",
  aliases: ["暖白纸面", "柔和灰墨", "paper-like workspace", "留白驱动"],
  description:
    "A warm-white, paper-like workspace where gentle gray ink, generous breathing room, and one clear blue action color replace heavy chrome.",
  descriptionZh:
    "以暖白纸面、温和灰墨、充足留白和单一清蓝行动色取代厚重界面外壳的工作空间。",
  skin: makeWbSkin({
    scheme: "light",
    canvas: "#ffffff",
    surface: "#f7f7f5",
    raised: "#ffffff",
    ink: "#37352f",
    inkSecondary: "#4d4a42",
    inkMuted: "#787774",
    inkFaint: "#9b9a97",
    hairline: "#e9e9e7",
    accent: "#0075de",
    success: "#1aae39",
    danger: "#eb5757",
    warning: "#dd5b00",
    fonts: {
      body: "ui-sans-serif, -apple-system, 'Segoe UI', sans-serif",
      display: "ui-sans-serif, -apple-system, 'Segoe UI', sans-serif",
      mono: "'SFMono-Regular', Consolas, ui-monospace",
    },
  }),
  promptZh:
    "采用「Paper / 纸感工作台」设计系统：以 #ffffff 暖白画布与 #f7f7f5 柔灰表面形成纸张般的层次，用 #37352f 灰墨书写正文，让元信息逐级退到 #787774 与 #9b9a97；层级主要依赖留白、段落节奏和极浅发丝线，#0075de 只标记链接、焦点和主行动；侧栏像目录，线程像文稿，输入台像页脚批注，产物区像可切换版本的并排文档。\n\nFORBIDDEN：高饱和大面积色块、深色基底、硬阴影、霓虹强调，或用密集线框堆叠替代留白和浅灰表面。",
  promptEn:
    "Use the 'Paper Workbench' design system: create paper-like depth with a warm #ffffff canvas and soft #f7f7f5 surfaces, write primary content in #37352f gray ink, and step metadata down through #787774 and #9b9a97. Build hierarchy mainly with whitespace, paragraph rhythm, and very pale hairlines; reserve #0075de for links, focus, and the primary action. Treat the sidebar as a table of contents, the thread as a working manuscript, the composer as a footer annotation, and the artifact area as a parallel document with versions.\n\nFORBIDDEN: large high-saturation color fields, dark foundations, hard shadows, neon accents, or dense frames used in place of whitespace and pale surfaces.",
  designMd: `---
name: Paper
description: A warm-white workbench organized by whitespace and gentle gray ink.
---

# Paper

## Colors

colors:
  canvas: "#ffffff"
  surface: "#f7f7f5"
  raised: "#ffffff"
  ink: "#37352f"
  ink-secondary: "#4d4a42"
  ink-muted: "#787774"
  ink-faint: "#9b9a97"
  hairline: "#e9e9e7"
  accent: "#0075de"
  success: "#1aae39"
  danger: "#eb5757"
  warning: "#dd5b00"

## Typography

typography:
  body: "ui-sans-serif, -apple-system, 'Segoe UI', sans-serif"
  display: "ui-sans-serif, -apple-system, 'Segoe UI', sans-serif"
  mono: "'SFMono-Regular', Consolas, ui-monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Let whitespace and text rhythm establish most of the hierarchy.
- Use warm off-white surfaces and very pale hairlines only where needed.
- Keep shadows nearly absent; a raised sheet should feel adjacent, not floating.
- Use modest, consistent radii and avoid pill shapes for large containers.

## Components

- Sidebar: read as a quiet table of contents with one soft selected row.
- Thread: format the conversation like a working document with calm measure.
- Composer: resemble a footer annotation, separated by space and one hairline.
- Artifact panel: present preview and source as parallel paper documents.
- Buttons: reserve blue for the primary action and text links.
- Status: use compact semantic labels instead of broad colored surfaces.

## FORBIDDEN

- Large high-saturation color fields.
- Dark foundations, hard shadows, or neon accents.
- Dense frame stacking used instead of whitespace.
- Excess decorative chrome around text content.
`,
  keywords: ["notion", "notion style", "paper ui"],
};

export const terracottaDesignSystem: DesignSystemEntry = {
  slug: "terracotta",
  name: "Terracotta",
  nameZh: "陶土",
  aliases: ["奶油陶土", "温暖编辑台", "serif craft console", "低频橙强调"],
  description:
    "A quiet cream workbench with terracotta emphasis, crafted serif display type, and warm tactile surfaces for thoughtful collaboration.",
  descriptionZh:
    "以奶油暖底、陶土橙强调、手作感衬线展示字与温润表面构成的安静协作工作台。",
  skin: makeWbSkin({
    scheme: "light",
    canvas: "#faf9f5",
    surface: "#f5f0e8",
    raised: "#ffffff",
    ink: "#141413",
    inkSecondary: "#3d3d3a",
    inkMuted: "#6c6a64",
    inkFaint: "#8e8b82",
    hairline: "#e6dfd8",
    accent: "#cc785c",
    success: "#5db872",
    danger: "#c64545",
    warning: "#d4a017",
    fonts: {
      body: "-apple-system, 'Segoe UI', sans-serif",
      display: "'Copernicus', 'Tiempos Headline', Georgia, serif",
      mono: "ui-monospace, 'SF Mono', monospace",
    },
  }),
  promptZh:
    "采用「Terracotta / 陶土工作台」设计系统：以 #faf9f5 奶油画布和 #f5f0e8 暖表面营造安静触感，正文使用近黑 #141413，标题用克制的书卷感衬线，操作与代码仍用清楚的无衬线和等宽字体；#cc785c 陶土橙低频出现于主行动、焦点和选中，侧栏、线程、输入台与产物区通过暖灰发丝线和柔和表面阶梯衔接，状态色保持朴素。\n\nFORBIDDEN：冷灰基底、纯白大底、科技感渐变、锐利直角、频繁铺陈陶土强调色，或用重阴影制造悬浮层堆叠。",
  promptEn:
    "Use the 'Terracotta Workbench' design system: create a quiet tactile field with a #faf9f5 cream canvas and #f5f0e8 warm surfaces. Set body copy in near-black #141413, use a restrained literary serif for display moments, and keep controls and code in clear sans and monospace faces. Introduce #cc785c terracotta sparingly for primary actions, focus, and selection; connect the sidebar, thread, composer, and artifact area through warm-gray hairlines and gentle surface steps, with plain semantic status colors.\n\nFORBIDDEN: cool-gray foundations, a vast pure-white base, technological gradients, sharp square corners, frequent decorative accent use, or heavy stacked shadows.",
  designMd: `---
name: Terracotta
description: A cream workbench with quiet terracotta emphasis and serif display type.
---

# Terracotta

## Colors

colors:
  canvas: "#faf9f5"
  surface: "#f5f0e8"
  raised: "#ffffff"
  ink: "#141413"
  ink-secondary: "#3d3d3a"
  ink-muted: "#6c6a64"
  ink-faint: "#8e8b82"
  hairline: "#e6dfd8"
  accent: "#cc785c"
  success: "#5db872"
  danger: "#c64545"
  warning: "#d4a017"

## Typography

typography:
  body: "-apple-system, 'Segoe UI', sans-serif"
  display: "'Copernicus', 'Tiempos Headline', Georgia, serif"
  mono: "ui-monospace, 'SF Mono', monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 500

## Surfaces & lines

- Keep the canvas creamy and the working surfaces softly warm.
- Use warm-gray hairlines and small tonal steps instead of hard separation.
- Prefer gentle local depth; shadows should be rare, short, and low contrast.
- Use softened corners consistently without turning every control into a pill.

## Components

- Sidebar: use a warm surface and a low-frequency terracotta selection mark.
- Thread: keep body copy sans; reserve serif for titles and artifact headings.
- Composer: make it tactile and calm with one warm hairline and clear focus.
- Artifact panel: feel like a crafted sheet with explicit preview and version controls.
- Buttons: terracotta is primary only; secondary controls remain warm neutral.
- Status: keep green, red, and ochre compact and informational.

## FORBIDDEN

- Cool-gray foundations or a vast pure-white base.
- Technological gradients and sharp square corners.
- Heavy stacks of floating shadows.
- Frequent or decorative use of the terracotta accent.
`,
  keywords: ["claude", "anthropic", "cream terracotta"],
};

export const indigoDesignSystem: DesignSystemEntry = {
  slug: "indigo",
  name: "Indigo",
  nameZh: "靛蓝",
  aliases: ["冷白金融工具台", "雾蓝灰界面", "indigo control desk", "克制蓝紫"],
  description:
    "A cool-white precision workbench with misted blue-gray structure and a controlled indigo action color for data-heavy operations.",
  descriptionZh:
    "以冷白底、雾蓝灰结构和克制靛蓝行动色构成的精密工作台，适合数据密集型操作。",
  skin: makeWbSkin({
    scheme: "light",
    canvas: "#ffffff",
    surface: "#f6f9fc",
    raised: "#ffffff",
    ink: "#0d253d",
    inkSecondary: "#273951",
    inkMuted: "#64748d",
    inkFaint: "#8ca2ba",
    hairline: "#e3e8ee",
    accent: "#533afd",
    success: "#1ea672",
    danger: "#df1b41",
    warning: "#d97917",
    fonts: {
      body: "'sohne-var', 'SF Pro Display', system-ui, sans-serif",
      display: "'sohne-var', 'SF Pro Display', system-ui, sans-serif",
      mono: "'SF Mono', Menlo, ui-monospace",
    },
  }),
  promptZh:
    "采用「Indigo / 靛蓝工作台」设计系统：以 #ffffff 冷白画布和 #f6f9fc 雾蓝表面建立精密但不冰冷的金融工具感，正文采用深海军蓝 #0d253d，次级信息沿蓝灰阶退后；用 #e3e8ee 发丝线组织紧凑数据、侧栏、线程、输入台和产物版本，#533afd 只用于主行动与选中态，成功、危险、警告作为小面积状态信号，避免层层漂浮。\n\nFORBIDDEN：暖纸底、衬线字体、重阴影浮层堆叠、大面积蓝紫装饰，或让强调色逃离主行动、焦点和选中状态。",
  promptEn:
    "Use the 'Indigo Workbench' design system: establish a precise but approachable operational field with a #ffffff cool canvas and #f6f9fc mist-blue surfaces. Set primary copy in deep navy #0d253d and step secondary information back through blue-gray tones. Organize dense data, the sidebar, thread, composer, and artifact versions with #e3e8ee hairlines; reserve #533afd for the primary action and selected state, and keep success, danger, and warning as compact signals rather than broad decoration.\n\nFORBIDDEN: warm paper foundations, serif typography, stacks of heavy floating shadows, large indigo decorations, or accent color outside primary actions, focus, and selection.",
  designMd: `---
name: Indigo
description: A cool-white precision workbench with mist-blue structure and indigo action states.
---

# Indigo

## Colors

colors:
  canvas: "#ffffff"
  surface: "#f6f9fc"
  raised: "#ffffff"
  ink: "#0d253d"
  ink-secondary: "#273951"
  ink-muted: "#64748d"
  ink-faint: "#8ca2ba"
  hairline: "#e3e8ee"
  accent: "#533afd"
  success: "#1ea672"
  danger: "#df1b41"
  warning: "#d97917"

## Typography

typography:
  body: "'sohne-var', 'SF Pro Display', system-ui, sans-serif"
  display: "'sohne-var', 'SF Pro Display', system-ui, sans-serif"
  mono: "'SF Mono', Menlo, ui-monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep foundations cool white with mist-blue working surfaces.
- Use pale blue-gray hairlines to structure dense information precisely.
- Prefer borders and tonal adjacency over stacked elevation or heavy shadow.
- Keep radii controlled and consistent for a dependable operational feel.

## Components

- Sidebar: use compact blue-gray rows and one indigo selected state.
- Thread: keep navy text crisp and metadata visibly lighter without losing contrast.
- Composer: frame it with a pale line and use indigo only for focus and send.
- Artifact panel: maintain exact preview/code and version boundaries on cool surfaces.
- Buttons: indigo is reserved for primary action; secondary controls stay neutral.
- Status: use small green, red, and orange signals tied to real state.

## FORBIDDEN

- Warm paper foundations or serif typography.
- Heavy stacks of floating shadows.
- Large decorative indigo fields.
- Accent use beyond primary actions, focus, and selection.
`,
  keywords: ["stripe", "blurple", "fintech ui"],
};

export const DESIGN_SYSTEMS: DesignSystemEntry[] = [
  graphiteDesignSystem,
  nightflightDesignSystem,
  starkDesignSystem,
  paperDesignSystem,
  terracottaDesignSystem,
  indigoDesignSystem,
];
