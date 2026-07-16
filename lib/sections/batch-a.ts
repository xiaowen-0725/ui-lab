import type { SectionEntry } from "./types";

// Batch A: navbar / logo-wall / stats / cta.

export const batchASections: SectionEntry[] = [
  {
    slug: "navbar",
    name: "Navbar",
    nameZh: "导航栏",
    aliases: ["导航栏", "Navbar", "顶栏", "Header bar"],
    description:
      "The strip pinned across the very top of every page — brand mark, a handful of links, one way in.",
    descriptionZh:
      "贴在每个页面最顶端的一条窄带——品牌标志、几个链接、一个入口按钮。",
    bestFor:
      "Every page on the site — it's the one section users see before anything else",
    bestForZh: "站内所有页面——用户在看到任何内容之前先看到它",
    recipe: [
      "Structure = logo/brand + a handful of nav links + one primary action (login/CTA)",
      "Semantics: wrap it in <nav>, keep it sticky so it survives scrolling",
      "3-5 links max — anything more belongs in a mega menu, not the top bar",
      "Collapse links into a hamburger on mobile; never let the row overflow",
      "Exactly one solid button; demote everything else to plain text links",
    ],
    recipeZh: [
      "结构 = logo/品牌名 + 若干导航链接 + 一个主入口按钮(登录/CTA)",
      "语义用 <nav> 包裹,通常做成 sticky,滚动后依然可见",
      "链接数量控制在 3-5 个,更多内容应该收进二级菜单而不是塞满顶栏",
      "移动端把链接收进汉堡菜单,不要让整行溢出换行",
      "只保留一个实色按钮,其余全部降级为纯文字链接",
    ],
    variants: [
      {
        key: "simple",
        name: "Simple",
        nameZh: "单行式",
        whenToUse:
          "The default choice — most landing pages, few links, one clear button.",
        whenToUseZh: "默认之选——多数落地页的第一选择,链接少、按钮清晰。",
        promptZh:
          "请做一个单行式导航栏(simple navbar):固定高度约 56px(h-14),内容在一行内左中右三段——最左是 logo(一个圆角小方块色块 + 加粗品牌名),中间是 3-4 个纯文字链接(灰色次要文字),最右是一个小尺寸的实色圆角主按钮(如「登录」)。整行两端对齐,底部可加一条极细的分隔线把它和下方内容分开。禁止:链接超过 5 个、logo 和链接互换位置、放两个实色按钮、给导航栏加阴影或做成悬浮卡片、移动端不做任何收起处理还硬塞满一行。",
        promptEn:
          "Build a simple navbar: a fixed height row (about 56px / h-14) split into three zones — leftmost a logo (a small rounded color square plus a bold brand name), the middle holds 3-4 plain text links in muted color, the right end holds one small solid rounded primary button (e.g. 'Sign in'). Align the row edge-to-edge and optionally add a hairline border at the bottom to separate it from the content below. Forbidden: more than 5 links, swapping the logo and link positions, two solid buttons, adding shadows or turning it into a floating card, and cramming every link into one row on mobile without any collapse.",
      },
      {
        key: "centered",
        name: "Centered",
        nameZh: "居中式",
        whenToUse:
          "Brand-forward editorial or fashion sites that want the logo to be the visual anchor.",
        whenToUseZh: "品牌感优先的编辑/时尚类站,想让 logo 成为视觉焦点时选它。",
        promptZh:
          "请做一个居中式导航栏(centered navbar):三段式布局——左侧 2 个文字链接,正中间是 logo(色块+品牌名,视觉上最突出),右侧 2 个文字链接紧跟一个小尺寸实色按钮。三段左右对称,logo 保持真正居中而不是被右侧内容挤偏。禁止:左右链接数量不对称、logo 偏离中心、链接总数超过 2+2、把按钮放在左侧、去掉品牌名只留色块。",
        promptEn:
          "Build a centered navbar: a three-zone layout — 2 text links on the left, the logo (color square plus brand name) dead center as the visual anchor, and 2 text links on the right followed by one small solid button. Keep both sides symmetric so the logo stays truly centered instead of getting pushed off by the right-side content. Forbidden: uneven link counts on each side, an off-center logo, more than 2+2 links total, putting the button on the left, and dropping the brand name to leave only the color square.",
      },
    ],
  },
  {
    slug: "logo-wall",
    name: "Logo Wall",
    nameZh: "客户标墙",
    aliases: ["客户墙", "Logo Cloud", "信任背书", "Social Proof"],
    description:
      "A quiet row of customer logos right under the hero — no pitch, just proof that real companies already use this.",
    descriptionZh:
      "紧跟在首屏下方的一排客户 logo——不说一句推销话,只用「这些公司都在用」证明可信。",
    bestFor:
      "B2B products and tools that need social proof before the pitch even starts",
    bestForZh: "需要在正式介绍产品之前先建立信任的 B2B 产品和工具",
    recipe: [
      "Structure = optional caption line + one row of 5-7 logo wordmarks",
      "Keep every logo the same grayscale treatment — no brand colors competing for attention",
      "5-7 logos per row is the sweet spot; fewer looks thin, more feels cluttered",
      "Place it immediately after the hero, before any feature explanation",
      "Logos are decorative, not interactive — no hover states, no links needed in the demo",
    ],
    recipeZh: [
      "结构 = 可选的一句说明文字 + 一行 5-7 个 logo/wordmark",
      "所有 logo 统一灰度处理,不要让品牌色互相抢镜",
      "一行 5-7 个是黄金数量,太少显得单薄,太多显得拥挤",
      "紧跟在 hero 之后出现,早于任何功能介绍",
      "logo 是装饰性的,不需要可点击或悬停效果",
    ],
    variants: [
      {
        key: "row",
        name: "Row",
        nameZh: "横排式",
        whenToUse:
          "The go-to shape right after the hero — a quick, low-effort trust signal before you explain anything.",
        whenToUseZh:
          "紧跟 hero 出现的默认形态——不需要解释,先甩一眼可信度再往下讲。",
        promptZh:
          "请做一个横排客户标墙(logo wall, row 形态):最上面一行居中的小号大写字母间距文字,写明社会认同的一句话(如「被 2,000+ 团队信任」),字号小、颜色为次要灰;下面一行水平居中排列 5 个客户 wordmark 占位(用加粗字母词代替真实 logo,统一为浅灰色、不加边框不加背景),彼此间距均匀且比行内文字间距更宽。禁止:超过 7 个或少于 5 个 logo、logo 颜色深浅不一或用彩色、给每个 logo 加卡片背景框、放在首屏以外很靠后的位置、用真实品牌的图片资源。",
        promptEn:
          "Build a row logo wall: a centered caption line on top in small uppercase tracked text stating social proof (e.g. 'Trusted by 2,000+ teams'), muted gray and small; below it, one horizontally centered row of 5 logo wordmarks (bold letter-marks standing in for real logos, all the same light gray, no border or background), spaced evenly and wider than the caption's own letter spacing. Forbidden: more than 7 or fewer than 5 logos, inconsistent logo shades or colored logos, wrapping each logo in a card background, placing it far from the hero, and using real brand image assets.",
      },
    ],
  },
  {
    slug: "stats",
    name: "Stats",
    nameZh: "数据区",
    aliases: ["数据带", "Stats", "数字证明", "成绩单"],
    description:
      "A short band of big numbers — users, uptime, ratings — that turns a claim into a fact at a glance.",
    descriptionZh:
      "一条由大号数字组成的窄带——用户数、可用性、评分——把一句话主张变成一眼可信的事实。",
    bestFor:
      "Products with real traction that want to prove scale or reliability mid-page",
    bestForZh: "已经有真实数据、想在页面中段证明规模或可靠性的产品",
    recipe: [
      "Structure = 3-4 stat pairs, each a big number over a small label",
      "Every number should be sourced/credible — no fabricated precision",
      "Never exceed 4 stats; more than that dilutes which number matters",
      "Number is always the largest text in the pair — label stays small and muted",
      "Thin dividers between columns, no card backgrounds needed",
    ],
    recipeZh: [
      "结构 = 3-4 组「大数字+小标签」",
      "每个数字都要有可信来源,不要编造精确到小数点的假数据",
      "最多 4 个,超过这个数量就没人记得住哪个数字重要",
      "数字永远是这一组里字号最大的,标签保持小号、弱化",
      "列间用细线分隔即可,不需要额外的卡片背景",
    ],
    variants: [
      {
        key: "row",
        name: "Row",
        nameZh: "横排式",
        whenToUse:
          "The default shape for a quick trust band mid-page — three numbers, evenly weighted, no ranking implied.",
        whenToUseZh:
          "页面中段快速插入信任证据的默认形态——三个数字权重相同,不暗示排序。",
        promptZh:
          "请做一个三栏数据带(stats, row 形态):一行三等分网格(grid-cols-3),每栏垂直居中——上面是一个大号数字(约是正文 2.5-3 倍字号,加粗),下面是一行更小的灰色说明文字;三栏之间用一条极细竖线分隔。整体内边距充足,不需要标题或按钮。禁止:超过 4 个数字、数字没有单位或说明就裸放、用彩色强调某一栏破坏平衡、给每栏加独立卡片背景、数字字号小于说明文字。",
        promptEn:
          "Build a row stats band: a three-column grid (grid-cols-3), each column vertically centered — a big bold number on top (roughly 2.5-3x body size), a smaller muted label underneath; separate the columns with a hairline vertical divider. Give it generous padding and skip any heading or button. Forbidden: more than 4 numbers, a bare number with no unit or label, coloring one column to break the visual balance, wrapping each column in its own card background, and making the number smaller than its label.",
      },
    ],
  },
  {
    slug: "cta",
    name: "CTA",
    nameZh: "行动召唤",
    aliases: ["行动召唤", "CTA", "转化区", "尾部召唤"],
    description:
      "The moment a page stops explaining and asks for the click — a headline that restates the value and one button.",
    descriptionZh:
      "页面停止解释、开口要求点击的那一刻——一句重申价值的标题,加一个按钮。",
    bestFor:
      "The end of a landing page, or any natural pause point mid-page where a reader is ready to act",
    bestForZh: "落地页的结尾,或者正文中读者读到一个自然停顿、可能已经被说服的地方",
    recipe: [
      "Structure = headline restating the value + one primary button, nothing else",
      "Appears 1-2 times per page — more than that and every CTA loses urgency",
      "Copy reaffirms the outcome ('Start shipping faster'), never generic ('Click here')",
      "Exactly one button — a second option just adds a decision to postpone",
      "Pick banner for the page's final push, boxed for a mid-page nudge that doesn't interrupt reading",
    ],
    recipeZh: [
      "结构 = 一句重申价值的标题 + 一个主按钮,不需要更多元素",
      "一个页面出现 1-2 次即可,太多次每一次都会失去紧迫感",
      "文案要重申结果(如「现在就开始更快地交付」),而不是空洞的「点击这里」",
      "只放一个按钮,第二个选项只会让用户多一个「以后再说」的借口",
      "banner 适合放在页面结尾做最后一推,boxed 适合插在正文中段做轻量提醒",
    ],
    variants: [
      {
        key: "banner",
        name: "Banner",
        nameZh: "色带式",
        whenToUse:
          "The page's final push before the footer — visually loud, unmissable.",
        whenToUseZh: "页尾最后一推,视觉强烈,适合作为整页的收尾。",
        promptZh:
          "请做一个色带式 CTA(cta, banner 形态):一个全宽的大圆角色块,背景填满主题主色(bg-primary),内部居中排列——一句号召式标题(反色文字,加粗,不超过一行),下方一个反色按钮(浅色背景、深色文字,与色带形成对比)。色块本身内边距充足,通常放在整页的最后位置,紧邻页脚之前。禁止:色带背景用浅色导致按钮对比度不够、标题写成一段话、放两个按钮、加次要链接分散注意力、色带不做圆角直接通栏到边缘。",
        promptEn:
          "Build a banner CTA: a full-width large-radius block filled with the primary theme color, with centered content inside — a bold one-line headline in inverted (light) text, and below it one inverted button (light background, dark text) that contrasts against the colored block. Give the block generous padding and place it near the very end of the page, right before the footer. Forbidden: a light background color that kills the button's contrast, a paragraph-length headline, two buttons, secondary links stealing attention, and running the block edge-to-edge with no rounded corners.",
      },
      {
        key: "boxed",
        name: "Boxed",
        nameZh: "卡片式",
        whenToUse:
          "A mid-page nudge that reinforces the pitch without interrupting the reading flow.",
        whenToUseZh: "想在长页面中途再提醒一次转化,又不想打断阅读节奏时选它。",
        promptZh:
          "请做一个卡片式 CTA(cta, boxed 形态):一个独立的圆角卡片(细描边+浅背景色,而非通栏色带),内部居中——一句标题、一句更短的副文案说明价值,下方一个实色主按钮。卡片不通栏,四周留白让它像插在正文中间的一段「插播」。禁止:卡片背景用主题强色抢了正文视觉、放两个按钮制造选择、副文案写成努力推销的祈使句「点击这里」、卡片贴着页面边缘不留外边距、标题超过一行。",
        promptEn:
          "Build a boxed CTA: a self-contained rounded card (hairline border plus a subtle card background, not a full-bleed color band) with centered content inside — a headline, a shorter subline restating the value, and one solid primary button below. Keep the card inset with margin on both sides so it reads as an interruption dropped into the middle of the page, not a full-width band. Forbidden: a loud theme-color background that outcompetes the surrounding copy, two buttons offering a choice, a pushy 'click here' style subline, a card that touches the page edges with no margin, and a headline longer than one line.",
      },
    ],
  },
];
