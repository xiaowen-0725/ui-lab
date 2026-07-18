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

export const pearlDesignSystem: DesignSystemEntry = {
  slug: "pearl",
  name: "Pearl",
  nameZh: "珍珠",
  aliases: ["珍珠白", "系统原生风", "羊皮纸灰白", "pearl white", "frosted minimal"],
  description:
    "A system-native pearl-white workbench where quiet gray zoning, fine hairlines, and one restrained blue accent keep focused tools immediately legible.",
  descriptionZh:
    "以珍珠灰白分区、轻柔发丝线与单一克制蓝色构成的系统原生工作台，让专注型工具保持清楚、轻盈且熟悉。",
  skin: makeWbSkin(
    {
      scheme: "light",
      canvas: "#ffffff",
      surface: "#f5f5f7",
      raised: "#ffffff",
      ink: "#1d1d1f",
      inkSecondary: "#333333",
      inkMuted: "#7a7a7a",
      inkFaint: "#a1a1a6",
      hairline: "#e0e0e0",
      accent: "#0071e3",
      success: "#34c759",
      danger: "#ff3b30",
      warning: "#ff9500",
      fonts: {
        body: "'SF Pro Text', -apple-system, system-ui, sans-serif",
        display: "'SF Pro Display', -apple-system, system-ui, sans-serif",
        mono: "'SF Mono', ui-monospace, Menlo, monospace",
      },
    },
    {
      "--wb-border-subtle": "#f0f0f0",
      "--wb-divider": "#f0f0f0",
      "--wb-hairline-soft": "#f0f0f0",
      "--wb-hairline-subtle": "#f0f0f0",
    },
  ),
  promptZh:
    "采用「Pearl / 珍珠工作台」设计系统：以 #ffffff 珍珠白画布和 #f5f5f7 灰白分区建立系统原生的轻盈层级，使用 #e0e0e0 主发丝线与 #f0f0f0 轻分隔组织侧栏、线程、输入台和产物区；正文以 #1d1d1f 为主，次级信息逐级退到柔和中灰，#0071e3 只用于焦点、选中态和主行动；标题、正文与代码分别使用清晰的展示、文本和等宽字体，层级依靠留白、分区与精确对齐而非投影。\n\nFORBIDDEN：深色大背景、高饱和冲突色、粗硬边框、系统蓝之外的强调色、用层层阴影堆叠界面层级。",
  promptEn:
    "Use the 'Pearl Workbench' design system: build a light, system-native hierarchy with a #ffffff pearl-white canvas and #f5f5f7 gray-white zoning, then organize the sidebar, thread, composer, and artifact area with #e0e0e0 structural hairlines and #f0f0f0 quiet dividers. Set primary text in #1d1d1f, step secondary information down through soft neutral grays, and reserve #0071e3 for focus, selection, and primary actions. Give display, body, and code distinct clear type stacks, and create depth through whitespace, zoning, and exact alignment instead of shadows.\n\nFORBIDDEN: large dark backgrounds, high-saturation clashing colors, thick hard borders, accent colors outside the system blue, or shadow-stacked hierarchy.",
  designMd: `---
name: Pearl
description: A system-native pearl-white workbench shaped by quiet zoning and one blue accent.
---

# Pearl

## Colors

colors:
  canvas: "#ffffff"
  surface: "#f5f5f7"
  raised: "#ffffff"
  ink: "#1d1d1f"
  ink-secondary: "#333333"
  ink-muted: "#7a7a7a"
  ink-faint: "#a1a1a6"
  hairline: "#e0e0e0"
  divider: "#f0f0f0"
  accent: "#0071e3"
  success: "#34c759"
  danger: "#ff3b30"
  warning: "#ff9500"

## Typography

typography:
  body: "'SF Pro Text', -apple-system, system-ui, sans-serif"
  display: "'SF Pro Display', -apple-system, system-ui, sans-serif"
  mono: "'SF Mono', ui-monospace, Menlo, monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep the canvas pearl white and use #f5f5f7 to zone working regions.
- Use #e0e0e0 for structural hairlines and #f0f0f0 for quiet dividers.
- Establish hierarchy with spacing and tonal adjacency rather than shadow.
- Keep radii controlled, smooth, and consistent across panels and controls.

## Components

- Sidebar: use the gray-white surface with one restrained blue selection.
- Thread: preserve generous reading space and step metadata down in neutral gray.
- Composer: define it with zoning and a fine focus line, never a floating shadow.
- Artifact panel: keep preview, source, and version boundaries light but explicit.
- Buttons: reserve system blue for the primary action and selected controls.
- Status: use green, red, and orange only for real semantic state.

## FORBIDDEN

- Large dark backgrounds.
- High-saturation clashing colors.
- Thick hard borders or accent colors outside the system blue.
- Shadow-stacked hierarchy.
`,
  keywords: ["apple", "cupertino", "sf pro", "human interface guidelines", "apple.com"],
};

export const jadeDesignSystem: DesignSystemEntry = {
  slug: "jade",
  name: "Jade",
  nameZh: "翡翠",
  aliases: ["墨底翡翠", "深色数据工具", "emerald developer console", "数据库控制台"],
  description:
    "A dark developer workbench with ink-black depth, precise emerald action states, and the dense clarity of a database operations tool.",
  descriptionZh:
    "以墨色纵深、精准翡翠绿行动态与数据库运维工具般的高密度清晰度构成的深色开发者工作台。",
  skin: makeWbSkin({
    scheme: "dark",
    canvas: "#1c1c1c",
    surface: "#202020",
    raised: "#262626",
    ink: "#ffffff",
    inkSecondary: "#d4d4d4",
    inkMuted: "#9a9a9a",
    inkFaint: "#707070",
    hairline: "#303030",
    accent: "#3ecf8e",
    accentFg: "#171717",
    success: "#4ade80",
    danger: "#f56565",
    warning: "#ffdb13",
    fonts: {
      body: "Circular, 'Helvetica Neue', Helvetica, sans-serif",
      display: "Circular, 'Helvetica Neue', Helvetica, sans-serif",
      mono: "ui-monospace, 'SF Mono', monospace",
    },
  }),
  promptZh:
    "采用「Jade / 翡翠工作台」设计系统：以 #1c1c1c 墨色画布、#202020 主表面和 #262626 浮层构成数据库开发工具般的紧凑纵深，用 #303030 发丝线组织侧栏、线程、输入台与产物区；正文保持纯白，元信息沿中性灰阶退后，#3ecf8e 翡翠绿只用于主行动、选中与焦点，并以 #171717 深色文字形成绿底深字的身份特征；代码、查询和版本信息采用等宽字体，成功绿、危险红与警告黄只在真实状态出现。\n\nFORBIDDEN：亮色大底、蓝紫强调、暖色渐变、把绿色铺满装饰界面，或让绿色出现在主行动、选中与成功状态之外。",
  promptEn:
    "Use the 'Jade Workbench' design system: establish compact database-tool depth with a #1c1c1c ink canvas, #202020 primary surfaces, and #262626 raised layers, then organize the sidebar, thread, composer, and artifact area with #303030 hairlines. Keep primary copy white and step metadata down through neutral grays. Reserve #3ecf8e emerald for primary actions, selection, and focus, pairing it with #171717 dark foreground text as the system's defining green-control treatment. Set queries, code, and version data in monospace, and show semantic green, red, or yellow only for real state.\n\nFORBIDDEN: large light foundations, blue-violet accents, warm gradients, decorative green coverage, or green used outside primary actions, selection, and success.",
  designMd: `---
name: Jade
description: A dark database workbench with precise emerald action states.
---

# Jade

## Colors

colors:
  canvas: "#1c1c1c"
  surface: "#202020"
  raised: "#262626"
  ink: "#ffffff"
  ink-secondary: "#d4d4d4"
  ink-muted: "#9a9a9a"
  ink-faint: "#707070"
  hairline: "#303030"
  accent: "#3ecf8e"
  accent-foreground: "#171717"
  success: "#4ade80"
  danger: "#f56565"
  warning: "#ffdb13"

## Typography

typography:
  body: "Circular, 'Helvetica Neue', Helvetica, sans-serif"
  display: "Circular, 'Helvetica Neue', Helvetica, sans-serif"
  mono: "ui-monospace, 'SF Mono', monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Build depth through close ink-black value steps and exact hairlines.
- Keep surfaces opaque, compact, and free of atmospheric glow or gradients.
- Use emerald controls with dark foreground text for the system identity.
- Let dense grids and alignment communicate a dependable database-tool rhythm.

## Components

- Sidebar: use compact neutral rows with one emerald selected state.
- Thread: keep prose white and set queries, code, and paths in monospace.
- Composer: raise it one value step and reserve emerald for focus and send.
- Artifact panel: preserve crisp source, preview, and version boundaries.
- Buttons: primary controls use emerald with #171717 text; others stay neutral.
- Status: use green, red, and yellow only when the underlying state is real.

## FORBIDDEN

- Large light foundations or blue-violet accents.
- Warm gradients.
- Decorative or broad green coverage.
- Green outside primary actions, selection, and success.
`,
  keywords: ["supabase", "postgres", "database"],
};

export const prismDesignSystem: DesignSystemEntry = {
  slug: "prism",
  name: "Prism",
  nameZh: "棱彩",
  aliases: ["棱彩白板", "柔色设计台", "soft-block canvas", "黑墨蓝点"],
  description:
    "A white design workbench with crisp black ink, one clear blue action color, and soft color blocks reserved for labels and illustration.",
  descriptionZh:
    "以白底黑墨、单一清蓝行动色与仅用于标签和插画的柔和色块构成的设计工具工作台。",
  skin: makeWbSkin(
    {
      scheme: "light",
      canvas: "#ffffff",
      surface: "#f7f7f5",
      raised: "#ffffff",
      ink: "#000000",
      inkSecondary: "#333333",
      inkMuted: "#6b6b6b",
      inkFaint: "#9a9a9a",
      hairline: "#e6e6e6",
      accent: "#0d99ff",
      success: "#1ea64a",
      danger: "#f24822",
      warning: "#ffcd29",
      fonts: {
        body: "'Figma Sans', Inter, system-ui, sans-serif",
        display: "'Figma Sans', Inter, system-ui, sans-serif",
        mono: "'SF Mono', ui-monospace, monospace",
      },
    },
    { "--wb-divider": "#f1f1f1" },
  ),
  promptZh:
    "采用「Prism / 棱彩工作台」设计系统：以 #ffffff 白画布、#f7f7f5 柔灰分区和 #000000 清晰黑墨建立设计工具般的直接层级，用 #e6e6e6 发丝线与 #f1f1f1 轻分隔组织侧栏、线程、输入台和产物区；#0d99ff 设计蓝只负责主行动、焦点和选中，lime #dceeb1、lilac #c5b0f4、cream #f4ecd6、mint #c8e6cd 仅作为标签或插画底，让界面保留一点柔和棱彩而不争夺主色。\n\nFORBIDDEN：深色大底、单色性冷淡到没有任何柔色点缀、粗黑边框；黑色只用作文字墨色，不用作界面框线。",
  promptEn:
    "Use the 'Prism Workbench' design system: establish direct design-tool hierarchy with a #ffffff canvas, #f7f7f5 soft zoning, and crisp #000000 ink, then organize the sidebar, thread, composer, and artifact area with #e6e6e6 hairlines and #f1f1f1 quiet dividers. Reserve #0d99ff for primary actions, focus, and selection. Introduce lime #dceeb1, lilac #c5b0f4, cream #f4ecd6, and mint #c8e6cd only as label or illustration backgrounds so the interface retains a soft prismatic note without competing with blue.\n\nFORBIDDEN: large dark foundations, monochrome minimalism so severe that no soft color remains, or thick black borders; black is ink for text, never interface framing.",
  designMd: `---
name: Prism
description: A white design workbench with black ink, blue actions, and soft color blocks.
---

# Prism

## Colors

colors:
  canvas: "#ffffff"
  surface: "#f7f7f5"
  raised: "#ffffff"
  ink: "#000000"
  ink-secondary: "#333333"
  ink-muted: "#6b6b6b"
  ink-faint: "#9a9a9a"
  hairline: "#e6e6e6"
  divider: "#f1f1f1"
  accent: "#0d99ff"
  success: "#1ea64a"
  danger: "#f24822"
  warning: "#ffcd29"
  illustration-lime: "#dceeb1"
  illustration-lilac: "#c5b0f4"
  illustration-cream: "#f4ecd6"
  illustration-mint: "#c8e6cd"

## Typography

typography:
  body: "'Figma Sans', Inter, system-ui, sans-serif"
  display: "'Figma Sans', Inter, system-ui, sans-serif"
  mono: "'SF Mono', ui-monospace, monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep the main interface white, direct, and structured by pale gray zoning.
- Use fine gray hairlines; black belongs to text and never to interface frames.
- Reserve soft color blocks for labels, annotations, and illustration grounds.
- Avoid shadow depth; prefer adjacency, spacing, and canvas-like alignment.

## Components

- Sidebar: use soft gray zoning and one clear blue selected state.
- Thread: keep black ink crisp and allow small pastel annotation labels.
- Composer: remain white with a pale divider and a blue focus or send action.
- Artifact panel: feel like a precise canvas with light preview/source boundaries.
- Buttons: blue is primary; pastel colors never become competing controls.
- Status: use semantic colors only for actual state.

## FORBIDDEN

- Large dark foundations.
- Colorless minimalism with no soft accent blocks.
- Thick black borders; black is text ink only.
- Pastel blocks used as the primary interface color.
`,
  keywords: ["figma", "design tool", "canvas"],
};

export const coralDesignSystem: DesignSystemEntry = {
  slug: "coral",
  name: "Coral",
  nameZh: "珊瑚",
  aliases: ["象牙珊瑚", "学术暖调", "warm research console", "石底橙点"],
  description:
    "An ivory-stone workbench with coral action states and an academic warmth suited to thoughtful enterprise research and language tools.",
  descriptionZh:
    "以象牙石分区、珊瑚橙行动态与学术暖感构成的工作台，适合审慎的企业研究与语言工具。",
  skin: makeWbSkin({
    scheme: "light",
    canvas: "#ffffff",
    surface: "#eeece7",
    raised: "#ffffff",
    ink: "#212121",
    inkSecondary: "#616161",
    inkMuted: "#75758a",
    inkFaint: "#93939f",
    hairline: "#d9d9dd",
    accent: "#ff7759",
    success: "#1ea64a",
    danger: "#b30000",
    warning: "#d97917",
    fonts: {
      body: "'Cohere Text', -apple-system, system-ui, sans-serif",
      display: "'Cohere Text', -apple-system, system-ui, sans-serif",
      mono: "ui-monospace, monospace",
    },
  }),
  promptZh:
    "采用「Coral / 珊瑚工作台」设计系统：以 #ffffff 画布和 #eeece7 象牙石表面建立温暖、审慎的学术层级，用 #212121 炭黑正文与灰紫中间色承载长篇研究内容，#d9d9dd 发丝线轻分侧栏、线程、输入台和产物区；#ff7759 珊瑚橙只作为界面主行动、焦点与选中，deep green #003c33 和 action blue #1863dc 仅用于链接或图形辅助，不取代珊瑚界面强调。\n\nFORBIDDEN：冷灰蓝主导、深色大底、把珊瑚色用作正文色、高饱和颜色彼此撞色并置。",
  promptEn:
    "Use the 'Coral Workbench' design system: establish warm, considered academic hierarchy with a #ffffff canvas and #eeece7 ivory-stone surfaces. Carry long-form research in #212121 charcoal text with muted gray-violet secondary tones, and separate the sidebar, thread, composer, and artifact area using #d9d9dd hairlines. Reserve #ff7759 coral for primary interface actions, focus, and selection. Deep green #003c33 and action blue #1863dc may support links or graphics, but never replace coral as the interface accent.\n\nFORBIDDEN: cool gray-blue dominance, large dark foundations, coral used as body text, or adjacent high-saturation colors that clash.",
  designMd: `---
name: Coral
description: An ivory-stone workbench with coral actions and academic warmth.
---

# Coral

## Colors

colors:
  canvas: "#ffffff"
  surface: "#eeece7"
  raised: "#ffffff"
  ink: "#212121"
  ink-secondary: "#616161"
  ink-muted: "#75758a"
  ink-faint: "#93939f"
  hairline: "#d9d9dd"
  accent: "#ff7759"
  success: "#1ea64a"
  danger: "#b30000"
  warning: "#d97917"
  supporting-deep-green: "#003c33"
  supporting-action-blue: "#1863dc"

## Typography

typography:
  body: "'Cohere Text', -apple-system, system-ui, sans-serif"
  display: "'Cohere Text', -apple-system, system-ui, sans-serif"
  mono: "ui-monospace, monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Use ivory-stone zoning to create warmth without reducing text clarity.
- Keep hairlines cool enough for precision but subordinate to the warm surface.
- Prefer quiet adjacency and editorial spacing over elevated shadow stacks.
- Use deep green and action blue only for links or supporting graphics.

## Components

- Sidebar: use ivory stone with one restrained coral selected state.
- Thread: support long-form reading with charcoal ink and generous measure.
- Composer: stay white, lightly framed, and coral only at focus or send.
- Artifact panel: feel editorial, with clear but quiet preview/version structure.
- Buttons: coral owns interface emphasis; blue remains a link or graphic aid.
- Status: semantic colors appear in small, factual state indicators.

## FORBIDDEN

- Cool gray-blue dominance or large dark foundations.
- Coral used as body text.
- High-saturation colors placed in direct competition.
- Supporting colors promoted to the primary interface accent.
`,
  keywords: ["cohere", "nlp", "enterprise ai"],
};

export const stoneDesignSystem: DesignSystemEntry = {
  slug: "stone",
  name: "Stone",
  nameZh: "石纹",
  aliases: ["暖石灰阶", "单色语音台", "serif monochrome console", "黑墨克制"],
  description:
    "A warm-stone monochrome workbench with pure-black emphasis, restrained serif display type, and illustration-only waveform color.",
  descriptionZh:
    "以暖石灰阶、纯黑强调、克制衬线展示字与仅限插画波形的柔色构成的单色工作台。",
  skin: makeWbSkin({
    scheme: "light",
    canvas: "#f5f5f5",
    surface: "#fafafa",
    raised: "#ffffff",
    ink: "#0c0a09",
    inkSecondary: "#292524",
    inkMuted: "#777169",
    inkFaint: "#a8a29e",
    hairline: "#e7e5e4",
    accent: "#0c0a09",
    accentFg: "#ffffff",
    success: "#1ea64a",
    danger: "#dc2626",
    warning: "#d97706",
    fonts: {
      body: "ui-sans-serif, -apple-system, sans-serif",
      display: "Waldenburg, 'Times New Roman', serif",
      mono: "ui-monospace, monospace",
    },
  }),
  promptZh:
    "采用「Stone / 石纹工作台」设计系统：以 #f5f5f5 画布、#fafafa 表面和 #ffffff 浮层搭建温暖石灰阶，使用 #0c0a09 近纯黑承担正文、焦点、主行动与选中，#e7e5e4 暖发丝线组织侧栏、线程、输入台和产物区；展示标题使用衬线字，正文保持清晰无衬线，mint #a7e5d3、peach #f4c5a8、lavender #c8b8e0 只进入插画或波形，不进入控件与界面强调。\n\nFORBIDDEN：彩色界面强调、冷灰基底、深色大底、超过 12px 的大圆角；必须保持暖石灰阶和单色控件秩序。",
  promptEn:
    "Use the 'Stone Workbench' design system: build a warm stone grayscale with a #f5f5f5 canvas, #fafafa surfaces, and #ffffff raised layers. Use near-black #0c0a09 for body ink, focus, primary actions, and selection, while #e7e5e4 warm hairlines organize the sidebar, thread, composer, and artifact area. Set display moments in serif and working text in a clear sans. Mint #a7e5d3, peach #f4c5a8, and lavender #c8b8e0 belong only to illustration or waveform graphics, never controls or interface emphasis.\n\nFORBIDDEN: colored interface accents, cool-gray foundations, large dark backgrounds, or radii above 12px; preserve a warm-stone grayscale and monochrome control hierarchy.",
  designMd: `---
name: Stone
description: A warm-stone monochrome workbench with serif display type.
---

# Stone

## Colors

colors:
  canvas: "#f5f5f5"
  surface: "#fafafa"
  raised: "#ffffff"
  ink: "#0c0a09"
  ink-secondary: "#292524"
  ink-muted: "#777169"
  ink-faint: "#a8a29e"
  hairline: "#e7e5e4"
  accent: "#0c0a09"
  accent-foreground: "#ffffff"
  success: "#1ea64a"
  danger: "#dc2626"
  warning: "#d97706"
  illustration-mint: "#a7e5d3"
  illustration-peach: "#f4c5a8"
  illustration-lavender: "#c8b8e0"

## Typography

typography:
  body: "ui-sans-serif, -apple-system, sans-serif"
  display: "Waldenburg, 'Times New Roman', serif"
  mono: "ui-monospace, monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep every foundation inside a warm stone grayscale.
- Use near-black controls and fine warm hairlines instead of color emphasis.
- Cap all radii at 12px and prefer restrained tonal adjacency over shadow.
- Confine the mint-to-peach-to-lavender accent gradient to illustration and waveform graphics.

## Components

- Sidebar: use warm gray zoning with a near-black selected state.
- Thread: pair serif display moments with highly readable sans body copy.
- Composer: stay monochrome, compact, and clearly bounded by a warm hairline.
- Artifact panel: preserve quiet structure and let content carry the hierarchy.
- Buttons: primary is near black with white text; secondary controls stay stone.
- Status: semantic color remains factual and never becomes the visual accent.

## FORBIDDEN

- Colored interface accents or cool-gray foundations.
- Large dark backgrounds.
- Radii above 12px.
- Illustration colors used inside controls.
`,
  keywords: ["elevenlabs", "voice ai", "waveform"],
};

export const parchmentDesignSystem: DesignSystemEntry = {
  slug: "parchment",
  name: "Parchment",
  nameZh: "羊皮纸",
  aliases: ["奶油羊皮纸", "炭墨胶囊", "warm handmade console", "玫粉心跳点"],
  description:
    "A cream-parchment workbench defined by charcoal pill controls and a heartbeat of rose, distinct from Terracotta's serif type and clay-orange craft.",
  descriptionZh:
    "以奶油羊皮纸、炭墨胶囊控件与一点玫粉心跳构成的人文手作工作台，区别于 Terracotta 的衬线字与陶土橙。",
  skin: makeWbSkin({
    scheme: "light",
    canvas: "#f7f4ed",
    surface: "#f1eee5",
    raised: "#fcfbf8",
    ink: "#1c1c1c",
    inkSecondary: "#3a3a38",
    inkMuted: "#5f5f5d",
    inkFaint: "#8a8a86",
    hairline: "#eceae4",
    accent: "#ff4d84",
    success: "#1ea64a",
    danger: "#c64545",
    warning: "#d97917",
    fonts: {
      body: "'Camera Plain', ui-sans-serif, system-ui, sans-serif",
      display: "'Camera Plain', ui-sans-serif, system-ui, sans-serif",
      mono: "ui-monospace, monospace",
    },
  }),
  promptZh:
    "采用「Parchment / 羊皮纸工作台」设计系统：以 #f7f4ed 奶油羊皮纸画布、#f1eee5 主表面和 #fcfbf8 浮层建立人文手作感，文字与灰阶由 #1c1c1c 炭墨及其 3% / 4% / 40% / 82% 透明度派生，按钮偏好全圆角胶囊；#ff4d84 玫粉只作为主行动、选中或心跳般的小点缀。它不同于 Terracotta 的衬线展示字与陶土橙：这里用同一无衬线语气、炭墨胶囊和低频玫粉建立身份。\n\nFORBIDDEN：冷白底、纯黑 #000000、科技蓝、锐利直角、把玫粉大面积铺陈；玫粉只允许作为克制的心跳点缀与关键行动。",
  promptEn:
    "Use the 'Parchment Workbench' design system: establish a human, handmade field with a #f7f4ed cream-parchment canvas, #f1eee5 surfaces, and #fcfbf8 raised layers. Derive the grayscale from #1c1c1c charcoal at 3%, 4%, 40%, and 82% opacity steps, and favor fully rounded pill buttons. Reserve #ff4d84 rose for primary actions, selection, or a small heartbeat accent. Unlike Terracotta's serif display type and clay-orange craft, this system uses one sans voice, charcoal pills, and low-frequency rose.\n\nFORBIDDEN: cool-white foundations, pure #000000, technology blue, sharp square corners, or broad rose coverage; rose is only a restrained heartbeat accent and key action signal.",
  designMd: `---
name: Parchment
description: A cream-parchment workbench with charcoal pills and a heartbeat of rose.
---

# Parchment

## Colors

colors:
  canvas: "#f7f4ed"
  surface: "#f1eee5"
  raised: "#fcfbf8"
  ink: "#1c1c1c"
  ink-secondary: "#3a3a38"
  ink-muted: "#5f5f5d"
  ink-faint: "#8a8a86"
  hairline: "#eceae4"
  accent: "#ff4d84"
  success: "#1ea64a"
  danger: "#c64545"
  warning: "#d97917"
  charcoal-03: "color-mix(in srgb, #1c1c1c 3%, transparent)"
  charcoal-04: "color-mix(in srgb, #1c1c1c 4%, transparent)"
  charcoal-40: "color-mix(in srgb, #1c1c1c 40%, transparent)"
  charcoal-82: "color-mix(in srgb, #1c1c1c 82%, transparent)"

## Typography

typography:
  body: "'Camera Plain', ui-sans-serif, system-ui, sans-serif"
  display: "'Camera Plain', ui-sans-serif, system-ui, sans-serif"
  mono: "ui-monospace, monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Derive gray fills and text hierarchy from #1c1c1c opacity steps.
- Keep canvas and surfaces cream, tactile, and visibly warmer than pure white.
- Prefer fully rounded pill buttons and soft continuous control silhouettes.
- Use rose as a heartbeat accent, never as a broad surface or body color.

## Components

- Sidebar: use parchment zoning with a charcoal pill selected state.
- Thread: keep the sans voice warm, conversational, and comfortably spaced.
- Composer: form a full pill with charcoal controls and one restrained rose action.
- Artifact panel: feel like a clean handmade sheet with very soft hairlines.
- Buttons: default to fully rounded pills; reserve rose for the key action.
- Status: use semantic colors sparingly and keep charcoal dominant.

## FORBIDDEN

- Cool-white foundations, pure black, or technology blue.
- Sharp square corners.
- Broad rose surfaces or repeated decorative pink.
- Terracotta-like serif and clay-orange styling.
`,
  keywords: ["lovable", "vibe coding", "warm cream"],
};

export const frostDesignSystem: DesignSystemEntry = {
  slug: "frost",
  name: "Frost",
  nameZh: "霜玻",
  aliases: ["玻璃拟态", "毛玻璃", "frosted glass", "acrylic", "glass ui"],
  description:
    "An in-house glass workbench with pearl translucency, bright glass edges, and soft aurora color visibly diffused behind every working surface.",
  descriptionZh:
    "以珍珠半透明表面、明亮玻璃边缘与在工作层后清晰漫射的柔和极光构成的自研霜玻工作台。",
  skin: {
    ...makeWbSkin(
      {
        scheme: "light",
        canvas: "rgba(255,255,255,0.2)",
        surface: "rgba(255,255,255,0.55)",
        raised: "rgba(255,255,255,0.72)",
        ink: "#1e293b",
        inkSecondary: "#334155",
        inkMuted: "#64748b",
        inkFaint: "#94a3b8",
        hairline: "rgba(255,255,255,0.65)",
        accent: "#6d5dfc",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      {
        "--wb-divider": "rgba(30,41,59,0.08)",
        "--wb-hover": "rgba(255,255,255,0.5)",
      },
    ),
    backdrop: "aurora",
    frost: true,
  },
  promptZh:
    "采用「Frost / 霜玻工作台」设计系统：在白色基底上铺设天蓝 #7dd3fc、柔紫 #c4b5fd、粉色 #f9a8d4 与薄荷 #6ee7b7 的大尺度低饱和极光，让颜色真实穿透 rgba(255,255,255,0.55) 主表面与 rgba(255,255,255,0.72) 浮层；侧栏、线程卡、输入台和产物面板在自身半透明底色上执行 18px backdrop blur，以明亮玻璃发丝边和低对比分隔组织层级，#6d5dfc 仅用于焦点、选中和主行动，深灰蓝文字保证可读性。\n\nFORBIDDEN：大面积纯色不透明表面、深色背景、硬投影、背后没有任何可见内容穿透的空洞玻璃面板、对比度过高而像实线框的发丝边。",
  promptEn:
    "Use the 'Frost Workbench' design system: place large, low-saturation aurora fields of sky #7dd3fc, violet #c4b5fd, pink #f9a8d4, and mint #6ee7b7 over a white base, keeping that color visibly present through rgba(255,255,255,0.55) primary surfaces and rgba(255,255,255,0.72) raised layers. Apply 18px backdrop blur directly to the translucent sidebar, thread cards, composer, and artifact panel. Build hierarchy with bright glass hairlines and quiet dividers, reserve #6d5dfc for focus, selection, and primary actions, and protect readability with deep slate ink.\n\nFORBIDDEN: solid opaque large-area surfaces, dark backgrounds, hard drop shadows, glass panels with no visible content bleeding through behind them, or hairlines with excessive contrast that read as hard frames.",
  designMd: `---
name: Frost
description: An in-house glass workbench with aurora color diffused behind pearl surfaces.
---

# Frost

## Colors

colors:
  canvas: "rgba(255,255,255,0.2)"
  surface: "rgba(255,255,255,0.55)"
  raised: "rgba(255,255,255,0.72)"
  ink: "#1e293b"
  ink-secondary: "#334155"
  ink-muted: "#64748b"
  ink-faint: "#94a3b8"
  hairline: "rgba(255,255,255,0.65)"
  divider: "rgba(30,41,59,0.08)"
  hover: "rgba(255,255,255,0.5)"
  accent: "#6d5dfc"
  success: "#10b981"
  danger: "#ef4444"
  warning: "#f59e0b"
  aurora-sky: "#7dd3fc"
  aurora-violet: "#c4b5fd"
  aurora-pink: "#f9a8d4"
  aurora-mint: "#6ee7b7"

## Typography

typography:
  body: "inherit the site default sans"
  display: "inherit the site default display face"
  mono: "inherit the site default monospace"
  body-weight: 400
  label-weight: 500
  heading-weight: 600

## Surfaces & lines

- Keep the white-base aurora visibly bleeding through every glass surface.
- Apply 18px backdrop blur on the element that owns each translucent background.
- Use bright glass edges and low-contrast slate dividers instead of hard frames.
- Avoid opaque elevation; depth comes from diffusion, overlap, and tonal alpha.

## Components

- Sidebar: blur its clipped content layer so the resize handle remains unobstructed.
- Thread: place file, diff, and approval cards on translucent blurred glass.
- Composer: use raised pearl glass with a quiet edge and violet focus or send.
- Artifact panel: preserve visible aurora diffusion behind preview and version content.
- Buttons: reserve violet for primary action and selected controls.
- Status: keep green, red, and amber compact, factual, and readable on glass.

## FORBIDDEN

- Solid opaque large-area surfaces or dark backgrounds.
- Hard drop shadows.
- Glass panels with no visible content bleeding through behind them.
- Hairlines with enough contrast to read as hard frames.
`,
  keywords: ["glassmorphism", "vision pro", "aero", "acrylic"],
};

export const DESIGN_SYSTEMS: DesignSystemEntry[] = [
  graphiteDesignSystem,
  nightflightDesignSystem,
  starkDesignSystem,
  paperDesignSystem,
  terracottaDesignSystem,
  indigoDesignSystem,
  pearlDesignSystem,
  jadeDesignSystem,
  prismDesignSystem,
  coralDesignSystem,
  stoneDesignSystem,
  parchmentDesignSystem,
  frostDesignSystem,
];
