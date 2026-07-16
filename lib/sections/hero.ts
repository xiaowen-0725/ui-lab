import type { SectionEntry } from "./types";

// hero 是整个模块的范例条目:variant 粒度的 prompt、whenToUse 的写法、
// recipe 的结构化程度都以此为准。

export const heroSections: SectionEntry[] = [
  {
    slug: "hero",
    name: "Hero",
    nameZh: "首屏",
    aliases: ["英雄区", "Hero Section", "Banner", "头图区"],
    description:
      "The opening block above the fold — one headline, one promise, one action. Most visitors never scroll past it.",
    descriptionZh:
      "首屏就是「开头那一大块」:一句主张、一个承诺、一个按钮。大多数访客的去留在这里决定。",
    bestFor: "Every landing page — the only section you can't skip",
    bestForZh: "所有落地页——这是唯一不能省的区块",
    recipeZh: [
      "结构 = 徽章(可选)+ 主标题 + 副标题 + 主/次双按钮 + 信任小字(可选)",
      "主标题 ≤2 行、说结果不说功能;副标题一句话补充「怎么做到」",
      "主按钮只有一个,动词开头;次按钮弱化为描边或文字链接",
      "标题字号至少 3 倍正文,首屏内完整可见(注意 fold 线)",
      "语义用 <header>/<h1>,一页只有一个 h1,就在这里",
    ],
    recipe: [
      "Structure = optional badge + headline + subline + primary/secondary buttons + optional trust note",
      "Headline ≤2 lines, sells the outcome not the feature; the subline explains how in one sentence",
      "Exactly one primary button, verb-first; demote the secondary to outline or text link",
      "Headline at least 3x body size, fully visible above the fold",
      "Semantics: <header> with the page's single <h1> living here",
    ],
    variants: [
      {
        key: "centered",
        name: "Centered",
        nameZh: "居中式",
        whenToUse:
          "One clear message and nothing to show yet — pre-launch pages, waitlists, single-purpose tools.",
        whenToUseZh: "只有一句话要说、还没有视觉物料的时候:预发布页、候补名单、单一用途工具。",
        promptZh:
          "请做一个居中式首屏(centered hero):所有内容水平居中、垂直排列——顶部一个小徽章(圆角胶囊,写最新动态),然后是不超过两行的大标题(字号约为正文的 3-4 倍,粗体),一句副标题(灰色次要文字,最多 50 字),下面并排两个按钮(主按钮实色圆角、动词开头,次按钮描边弱化),按钮下方一行更小的信任文字(如「无需信用卡」)。上下留白要大方,整个首屏在第一屏内完整可见。禁止:两个实色按钮抢注意力、标题超过两行、放走马灯轮播、副标题写成一段话、居中的同时又塞侧边图。",
        promptEn:
          "Build a centered hero: everything horizontally centered and vertically stacked — a small pill badge on top (latest news), then a headline of at most two lines (3-4x body size, bold), a one-sentence subline in muted text, two buttons side by side (solid rounded primary starting with a verb, outlined secondary), and a smaller trust note under the buttons (e.g. 'No credit card required'). Be generous with vertical whitespace and keep the whole hero visible above the fold. Forbidden: two competing solid buttons, headlines over two lines, carousels, paragraph-length sublines, and side images fighting the centered layout.",
      },
      {
        key: "split",
        name: "Split",
        nameZh: "左文右图",
        whenToUse:
          "You have a strong visual — product shot, illustration or demo — that's worth half the screen.",
        whenToUseZh: "有值得占半屏的视觉物料时:产品图、插画或演示画面。",
        promptZh:
          "请做一个左文右图的首屏(split hero):两列网格布局,左列从上到下是徽章、两行以内的大标题、一句副标题、主次双按钮,全部左对齐;右列放产品截图或主视觉,带圆角和细描边,与左列垂直居中对齐。移动端时右图移到文案下方、单列堆叠。左右比例约 1:1,间距要宽。禁止:图片压过文字(图不加遮罩时避免叠字)、左右都居中对齐、图片无圆角直接贴边、移动端仍然左右挤在一行。",
        promptEn:
          "Build a split hero: a two-column grid — the left column stacks a badge, a headline of at most two lines, a one-sentence subline and primary/secondary buttons, all left-aligned; the right column holds a product screenshot or key visual with rounded corners and a hairline border, vertically centered against the text. On mobile the image drops below the copy in a single column. Keep roughly a 1:1 ratio with generous gap. Forbidden: images overpowering the copy, center-aligning both columns, edge-to-edge images without radius, and cramming both columns side-by-side on mobile.",
      },
      {
        key: "screenshot",
        name: "Screenshot",
        nameZh: "大截图式",
        whenToUse:
          "SaaS and tools where the product UI itself is the proof — show the real thing at full width.",
        whenToUseZh: "SaaS / 工具类产品,界面本身就是说服力——把真实产品全宽亮出来。",
        promptZh:
          "请做一个大截图式首屏(screenshot hero):上半部分与居中式相同(徽章、大标题、副标题、双按钮,全部居中),下方压轴放一张大产品截图——外面包一层浏览器窗口框(顶部一条带三个圆点的栏),整体圆角、细描边,宽度约占容器的八成,可以让它略微超出首屏底部制造「继续往下看」的暗示。禁止:截图糊或用假线框充数、截图宽度顶满无留白、窗口框做得花哨(阴影厚、彩色圆点太抢)、截图上叠大段文字。",
        promptEn:
          "Build a screenshot hero: the top half matches the centered variant (badge, headline, subline, two buttons, all centered); below it, the star of the section — a large product screenshot wrapped in a browser-window frame (a top bar with three dots), rounded with a hairline border, about 80% of the container width. Letting it bleed slightly past the fold invites scrolling. Forbidden: blurry screenshots or fake wireframes, full-bleed screenshots with no margin, over-decorated window chrome (heavy shadows, loud traffic-light dots), and paragraphs overlaid on the screenshot.",
      },
    ],
  },
];
