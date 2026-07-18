import type { LayoutPatternEntry } from "./types";

/** Full-page layout skeletons, ordered from simplest to most application-like. */
export const LAYOUT_PATTERNS: LayoutPatternEntry[] = [
  {
    slug: "centered",
    name: "Centered Column",
    nameZh: "居中单栏",
    aliases: ["单列", "阅读版心", "centered", "reading column", "article layout"],
    whenUse:
      "Use for blogs, documentation articles, and reading-led marketing pages where one narrative should hold attention.",
    whenUseZh: "适合博客、文档正文和以连续阅读为主的营销页，让一条叙事线始终占据视觉中心。",
    recipe: `.page {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
}

.page > header,
.page > footer {
  inline-size: 100%;
}

.content {
  flex: 1;
  max-inline-size: 72ch;
  inline-size: calc(100% - 32px);
  margin-inline: auto;
}

@media (max-width: 640px) {
  .content { inline-size: calc(100% - 24px); }
}`,
    responsiveNote:
      "It is already a single column; on mobile, only tighten the inline page gutters.",
    responsiveNoteZh: "结构本来就是单列；移动端只需收窄左右页边距。",
    promptZh:
      "使用「居中单栏 / Centered Column」整页结构：header 与 footer 通栏，中间正文列限制为 72ch，并用 margin-inline: auto 居中；页面外层纵向 flex，正文区填满剩余高度，移动端只收窄左右边距。\n\nFORBIDDEN: 把 header/footer 也锁进正文版心、让正文无限变宽、用固定像素宽度替代 max-width、在移动端保留过大的页边距。",
    promptEn:
      "Use a Centered Column full-page layout: keep the header and footer full width, constrain the middle reading column to 72ch with margin-inline: auto, and use a vertical flex shell so the content fills the remaining height; only tighten side gutters on mobile.\n\nFORBIDDEN: trapping the header or footer inside the reading measure, allowing unlimited line length, replacing max-width with a fixed pixel width, or keeping oversized mobile gutters.",
  },
  {
    slug: "sidebar",
    name: "Sidebar + Content",
    nameZh: "侧栏布局",
    aliases: ["边栏", "左导航", "sidebar", "nav + content", "app shell"],
    whenUse:
      "Use for admin tools, documentation sites, and application shells with persistent primary navigation.",
    whenUseZh: "适合后台、文档站和带持久主导航的应用外壳。",
    recipe: `.page {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-block-size: 100vh;
}

.main { min-inline-size: 0; }

@media (max-width: 768px) {
  .page { grid-template-columns: 1fr; }
  .sidebar { display: none; } /* Move it into a drawer or top bar. */
}`,
    responsiveNote: "On narrow screens, move the sidebar into a drawer or compact top bar.",
    responsiveNoteZh: "窄屏时把侧栏收进抽屉，或改成紧凑顶栏。",
    promptZh:
      "使用「侧栏布局 / Sidebar + Content」整页结构：页面用两列 CSS Grid，左侧导航固定 260px，右侧 main 用 1fr 流式占满，并设置 min-inline-size: 0 防止内容撑破；窄屏把侧栏移入抽屉或顶栏。\n\nFORBIDDEN: 用绝对定位固定侧栏、同时给主区固定宽度、让长内容撑宽网格、在手机上继续常驻 260px 侧栏。",
    promptEn:
      "Use a Sidebar + Content full-page layout: create a two-column CSS Grid with a fixed 260px navigation rail and a fluid 1fr main area, set min-inline-size: 0 on main, and move navigation into a drawer or top bar on narrow screens.\n\nFORBIDDEN: absolutely positioning the sidebar, fixing the width of both columns, letting long content blow out the grid, or keeping a permanent 260px sidebar on phones.",
  },
  {
    slug: "holy-grail",
    name: "Holy Grail",
    nameZh: "圣杯布局",
    aliases: ["三明治", "经典三栏", "holy grail", "header-footer-3col"],
    whenUse:
      "Use for portals and classic web applications that need global chrome plus secondary navigation and contextual content.",
    whenUseZh: "适合门户和经典 Web 应用：既有全局头尾，又需要次级导航与上下文侧栏。",
    recipe: `.page {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  min-block-size: 100vh;
}

header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; min-inline-size: 0; }
aside { grid-area: aside; }
footer { grid-area: footer; }

@media (max-width: 768px) {
  .page {
    grid-template: auto auto 1fr auto auto / 1fr;
    grid-template-areas: "header" "nav" "main" "aside" "footer";
  }
}`,
    responsiveNote: "On narrow screens, stack the three middle regions into a single column.",
    responsiveNoteZh: "窄屏时把中间三列按 nav、main、aside 的顺序叠成单列。",
    promptZh:
      "使用「圣杯布局 / Holy Grail」整页结构：CSS Grid 划分 header、nav、main、aside、footer 五个命名区域，header/footer 横跨三列，中段由自适应宽 nav、1fr 主区和自适应宽 aside 组成，页面至少占满视口；窄屏把中间三列顺序叠放。\n\nFORBIDDEN: 用绝对定位硬摆三栏、固定像素高度、三列在窄屏不塌缩、nav/aside 抢主区宽度。",
    promptEn:
      "Use a Holy Grail full-page layout: define named CSS Grid areas for header, nav, main, aside, and footer; span the header and footer across all three columns, keep the center as auto / 1fr / auto, fill at least the viewport, and stack the middle regions in order on narrow screens.\n\nFORBIDDEN: hard-positioning the three columns with absolute coordinates, fixed pixel heights, refusing to collapse on narrow screens, or letting nav and aside steal the main area's width.",
  },
  {
    slug: "split",
    name: "Split Screen",
    nameZh: "双栏分屏",
    aliases: ["对半分", "分屏", "split screen", "50/50", "two-pane hero"],
    whenUse:
      "Use for sign-in or registration flows and high-contrast landing pages that pair an action with imagery or a brand field.",
    whenUseZh: "适合登录/注册流程，以及把操作与图片或品牌色块并置的强对比落地页。",
    recipe: `.page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-block-size: 100vh;
}

.panel { min-inline-size: 0; }

@media (max-width: 768px) {
  .page { grid-template-columns: 1fr; }
}`,
    responsiveNote: "On narrow screens, stack the two panels vertically.",
    responsiveNoteZh: "窄屏时把左右面板改为上下堆叠。",
    promptZh:
      "使用「双栏分屏 / Split Screen」整页结构：页面用两列等宽 CSS Grid 并至少占满视口，一侧承载表单或核心文案，另一侧承载图片、插画或纯色品牌面；两个 panel 都允许内容收缩，窄屏上下堆叠。\n\nFORBIDDEN: 用 absolute 把两半拼起来、两侧内容重复、为了 50/50 裁掉关键表单、在手机上仍强制并排。",
    promptEn:
      "Use a Split Screen full-page layout: fill at least the viewport with two equal CSS Grid columns, place the form or primary message on one side and imagery, illustration, or a brand field on the other, allow both panels to shrink, and stack them on narrow screens.\n\nFORBIDDEN: assembling the halves with absolute positioning, duplicating content across both sides, clipping the primary form to preserve 50/50, or forcing side-by-side panels on phones.",
  },
  {
    slug: "three-pane",
    name: "Three-Pane",
    nameZh: "三栏工作台",
    aliases: ["三栏", "rail+list+detail", "IDE 布局", "chat 布局", "three-pane console"],
    whenUse:
      "Use for chat, mail, IDE, and Agent applications where global navigation, a browsable list, and focused detail stay visible together. See the complete, product-level version in Design Systems at /layouts.",
    whenUseZh:
      "适合聊天、邮件、IDE 和 Agent 应用，让全局导航、可浏览列表与详情同时在场；完整血肉版见「设计系统」模块 /layouts。",
    recipe: `.workbench {
  display: grid;
  grid-template-columns: 64px 320px 1fr;
  block-size: 100vh;
}

.rail,
.list,
.detail { min-block-size: 0; }
.list,
.detail { overflow-y: auto; }

@media (max-width: 900px) {
  .workbench { grid-template-columns: 1fr; }
  .rail { display: none; }
  .list[hidden], .detail[hidden] { display: none; }
}`,
    responsiveNote:
      "On narrow screens, collapse the rail and show either the list or the detail view at a time.",
    responsiveNoteZh: "窄屏时折叠 rail，并让列表与详情二选一显示。",
    promptZh:
      "使用「三栏工作台 / Three-Pane」整页结构：CSS Grid 三列依次为 64px 图标 rail、320px 可独立滚动列表和 1fr 详情/上下文区，工作台固定为视口高度且各列 min-block-size: 0；窄屏隐藏 rail，列表与详情改成二级切换。\n\nFORBIDDEN: 把三栏做成三个浮层、让整个页面和列表同时抢滚动、给详情列固定宽度、在窄屏把三列等比缩小后硬塞并排。",
    promptEn:
      "Use a Three-Pane workbench layout: define a 64px icon rail, a 320px independently scrolling list, and a fluid 1fr detail or context pane in CSS Grid; pin the workbench to the viewport height with min-block-size: 0 on each pane, then hide the rail and alternate list/detail on narrow screens.\n\nFORBIDDEN: turning the three panes into floating overlays, giving both the page and list competing scroll containers, fixing the detail width, or squeezing all three columns side by side on narrow screens.",
  },
  {
    slug: "dashboard",
    name: "Dashboard Grid",
    nameZh: "仪表盘网格",
    aliases: ["看板", "卡片网格", "dashboard", "widget grid", "bento admin"],
    whenUse:
      "Use for analytics back offices, monitoring surfaces, and overview pages made of independent summary widgets.",
    whenUseZh: "适合分析后台、监控面板和由独立摘要组件组成的概览页。",
    recipe: `.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.widget--primary {
  grid-column: span 2;
  grid-row: span 2;
}

@media (max-width: 520px) {
  .widget--primary { grid-column: auto; grid-row: auto; }
}`,
    responsiveNote:
      "auto-fit reduces the column count automatically; return the primary widget to one cell on the narrowest screens.",
    responsiveNoteZh: "auto-fit 会自动降列；最窄屏时把主卡恢复为单格。",
    promptZh:
      "使用「仪表盘网格 / Dashboard Grid」整页结构：内容区用 auto-fit + minmax(220px, 1fr) 生成自适应卡片网格，间距 16px；一个主 widget 横跨两列两行，其余指标卡自动补位，最窄屏把主卡恢复为单格。\n\nFORBIDDEN: 为每个断点手写固定列数、让所有卡同等强调、用绝对定位填洞、在单列屏保留 span 2 导致溢出。",
    promptEn:
      "Use a Dashboard Grid full-page structure: build an adaptive widget grid with repeat(auto-fit, minmax(220px, 1fr)) and a 16px gap; let one primary widget span two columns and two rows while smaller metric cards auto-place, then reset the primary widget to one cell on the narrowest screens.\n\nFORBIDDEN: hard-coding a column count at every breakpoint, giving every card equal emphasis, filling holes with absolute positioning, or keeping span 2 on a single-column screen.",
  },
  {
    slug: "list-detail",
    name: "List-Detail",
    nameZh: "列表详情",
    aliases: ["主从", "master-detail", "收件箱布局", "inbox", "list + pane"],
    whenUse:
      "Use for mail, settings, messaging, and any workflow where selecting one item reveals its detail.",
    whenUseZh: "适合邮件、设置、消息，以及任何“选一项看详情”的工作流。",
    recipe: `.view {
  display: grid;
  grid-template-columns: 340px 1fr;
  block-size: 100vh;
}

.list {
  min-block-size: 0;
  overflow-y: auto;
}

.detail { min-inline-size: 0; }

@media (max-width: 768px) {
  .view { display: block; }
  /* Navigate between list and detail as two route states. */
}`,
    responsiveNote:
      "On narrow screens, treat the list and detail as two route-level screens instead of compressed columns.",
    responsiveNoteZh: "窄屏时把列表与详情作为两级页面，通过路由切换，不压缩成两列。",
    promptZh:
      "使用「列表详情 / List-Detail」整页结构：CSS Grid 左侧 340px 列表独立纵向滚动，右侧 1fr 详情面板承载选中项内容，整体占满视口高度；窄屏将列表与详情改成两个路由层级。\n\nFORBIDDEN: 让列表与整页形成双重滚动、把详情也设成固定宽度、选择项后仍在手机上挤出两列、依赖 hover 才能进入详情。",
    promptEn:
      "Use a List-Detail full-page layout: create a 340px independently scrolling list beside a fluid 1fr detail pane in CSS Grid and fill the viewport height; on narrow screens, turn list and detail into two route-level states.\n\nFORBIDDEN: creating competing page/list scroll, fixing the detail width too, squeezing both columns onto phones after selection, or requiring hover to open detail.",
  },
  {
    slug: "canvas",
    name: "Full Canvas",
    nameZh: "全屏画布",
    aliases: ["画布", "无限画布", "canvas", "floating panels", "design tool shell"],
    whenUse:
      "Use for design tools, maps, whiteboards, and node editors where the workspace is primary and controls sit above it.",
    whenUseZh: "适合设计工具、地图、白板和节点编辑器，让工作画布成为主角，控制面板覆盖其上。",
    recipe: `.canvas-shell {
  position: relative;
  block-size: 100vh;
  overflow: hidden;
}

.canvas { position: absolute; inset: 0; }
.toolbar { position: absolute; inset-block-start: 16px; inset-inline-start: 16px; }
.inspector { position: absolute; inset-block: 16px; inset-inline-end: 16px; inline-size: 280px; }

@media (max-width: 768px) {
  .inspector {
    inset: auto 12px 12px;
    inline-size: auto;
  }
}`,
    responsiveNote: "On narrow screens, collapse floating side panels into a bottom drawer.",
    responsiveNoteZh: "窄屏时把悬浮侧面板收成底部抽屉。",
    promptZh:
      "使用「全屏画布 / Full Canvas」整页结构：外壳 position: relative、占满视口并裁掉溢出，工作画布 absolute inset: 0 全铺；工具条悬浮左上，约 280px 属性面板停靠右侧，覆盖层保持明确层级；窄屏把属性面板收成底部抽屉。\n\nFORBIDDEN: 用普通文档流挤压画布、让页面本身滚动、每个控制都散成独立浮窗、在手机上保留遮住大半画布的右侧面板。",
    promptEn:
      "Use a Full Canvas page shell: make a position: relative viewport-height container with overflow hidden, stretch the workspace with absolute inset: 0, float a toolbar at the top left, and dock an approximately 280px inspector on the right with an explicit overlay hierarchy; collapse the inspector into a bottom drawer on narrow screens.\n\nFORBIDDEN: shrinking the canvas with normal document flow, allowing the page itself to scroll, scattering every control into an independent floating window, or keeping a right panel that covers most of the canvas on phones.",
  },
];
