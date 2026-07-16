import type { SectionEntry } from "./types";

// Batch B: features / testimonials.

export const batchBSections: SectionEntry[] = [
  {
    slug: "features",
    name: "Features",
    nameZh: "卖点区",
    aliases: ["功能区", "Features", "卖点网格", "特性区"],
    description:
      "The block that answers 'okay, but what does it actually do' — a short list of the product's strongest selling points.",
    descriptionZh:
      "卖点区回答「它到底能干什么」——把产品最能打的几个卖点摆出来,一目了然。",
    bestFor: "Right after the hero, once you've earned a second look",
    bestForZh: "紧跟首屏之后,访客愿意多看一眼的时候",
    recipeZh: [
      "一卡一卖点,不要把两个功能塞进一张卡里",
      "标题写收益(用户得到什么),不写功能名(系统做了什么)",
      "同组图标风格要统一——同一描边粗细、同一色系,不要混搭实心/线性",
      "3-6 个卖点是舒适区,超过 6 个考虑分组或分页",
      "语义用 <section> 包裹,每张卡是一个独立的 <article> 或 <div> 列表项",
    ],
    recipe: [
      "One card, one selling point — never merge two features into a single card",
      "Titles sell the outcome (what the user gets), not the feature name (what the system does)",
      "Keep icon style consistent within a group — same stroke weight and palette, don't mix filled and outline",
      "3-6 selling points is the comfort zone; group or paginate past that",
      "Wrap in <section>, with each card as its own list item",
    ],
    variants: [
      {
        key: "grid",
        name: "Grid",
        nameZh: "网格式",
        whenToUse:
          "You have 3-6 selling points of similar weight that can all land in one glance.",
        whenToUseZh: "有 3-6 个分量相近的卖点,可以一次性摆开、一眼扫完的时候。",
        promptZh:
          "请做一个网格式卖点区(features grid):上方居中放一个小标题(灰色、大写字距)+ 一句大标题 + 一句副文,下面是一个三列卡片网格(每张卡圆角、细描边、内边距适中)——每张卡从上到下是:一个装在圆角小方块里的图标(线性风格,统一粗细)、一行加粗小标题、两行灰色描述。三张卡等高对齐、左对齐文字。禁止:一张卡里塞两个卖点、图标风格混用(有的实心有的线性)、标题写成功能名而不是收益、卡片高度参差不齐、放超过三列挤在一行。",
        promptEn:
          "Build a features grid: a centered eyebrow (small, muted, uppercase tracking) plus a headline and one-sentence subline on top, then a three-column card grid (rounded corners, hairline border, comfortable padding) — each card stacks an icon in a small rounded square (consistent line-style stroke), a bold short title, and a two-line muted description, all left-aligned within equal-height cards. Forbidden: cramming two selling points into one card, mixing filled and outline icon styles, titles that name the feature instead of the benefit, uneven card heights, and squeezing more than three columns into one row.",
      },
      {
        key: "alternating",
        name: "Alternating",
        nameZh: "图文交替",
        whenToUse:
          "Each selling point deserves a real explanation and a picture to back it up.",
        whenToUseZh: "每个卖点都值得展开讲、并且配得上一张图的时候。",
        promptZh:
          "请做一个图文交替卖点区(features alternating):纵向堆叠 2-3 组,每组是两列布局——一边是文字块(小标题 eyebrow + 一句大标题 + 一段描述 + 一个看起来像链接的文字,带下划线),另一边是图片占位(圆角、细描边、16:9 比例)。第一组文字在左图在右,第二组左右互换(用 order 类实现,不是重排 DOM),第三组再换回来。移动端统一单列堆叠、图片始终在文字下方。禁止:所有组都是同一个方向(不交替)、文字块和图片比例失衡、移动端仍然强制两列、链接文字没有任何视觉区分。",
        promptEn:
          "Build an alternating features section: stack 2-3 groups vertically, each a two-column layout — one side a text block (eyebrow + headline + description + an underlined text link), the other an image placeholder (rounded, hairline border, 16:9). The first group has text left / image right; the second flips the order with responsive order classes (not DOM reordering); a third group flips back. On mobile everything collapses to a single column with the image below the text. Forbidden: every group facing the same direction, unbalanced text-to-image ratio, forcing two columns on mobile, and link text with no visual distinction.",
      },
    ],
  },
  {
    slug: "testimonials",
    name: "Testimonials",
    nameZh: "用户评价",
    aliases: ["用户评价", "Testimonials", "口碑区", "客户证言"],
    description:
      "Proof that real people already trust this product — quotes from customers, placed where doubt is highest.",
    descriptionZh:
      "用户评价区是「别听我说,听用户说」的地方——放在访客最容易犹豫的位置,用真实反馈打消疑虑。",
    bestFor: "After you've explained what it does, before you ask for the sale",
    bestForZh: "讲完产品是什么之后、开口要转化之前",
    recipeZh: [
      "真实姓名 + 头衔远比匿名「某用户」可信,哪怕只是首字母头像",
      "引言要具体到结果(数字、场景),不要写「很好用」这种空话",
      "语义用 <blockquote> 包裹引言、<figure>/<figcaption> 包裹署名",
      "头像统一风格(全用首字母圆形或全用图片),不要混搭",
      "一屏不要塞超过一句话量级的重复夸奖,内容要有差异化",
    ],
    recipe: [
      "Real names and titles read far more credible than 'a happy user', even with just an initial avatar",
      "Quotes should cite a concrete result (a number, a scenario) — never vague praise like 'works great'",
      "Wrap quotes in <blockquote> and attribution in <figure>/<figcaption>",
      "Keep avatar style consistent (all initials or all photos), never mixed",
      "Don't stack near-duplicate praise — each quote should say something different",
    ],
    variants: [
      {
        key: "cards",
        name: "Cards",
        nameZh: "卡片式",
        whenToUse:
          "Volume is the argument — show several different kinds of people vouching for it.",
        whenToUseZh: "用数量说话的时候——展示不同类型的人都在为它背书。",
        promptZh:
          "请做一个卡片式用户评价区(testimonial cards):上方居中一个小标题 + 一句大标题,下面是三列引言卡(圆角、细描边、内边距适中)——每张卡上半部分是两三行引言(<blockquote>,正常字号),下半部分是一行署名信息:圆形首字母头像 + 姓名(加粗)+ 头衔(灰色小字)。三张卡文字量接近、高度对齐。禁止:引言写成空洞的形容词堆砌、头像风格不统一(有的图片有的首字母)、署名信息只有姓名没有头衔、三张卡内容重复度过高。",
        promptEn:
          "Build testimonial cards: a centered eyebrow and headline on top, then a three-column grid of quote cards (rounded, hairline border, comfortable padding) — each card has a two-to-three-line quote (<blockquote>, regular size) on top and an attribution row below it: a circular initial avatar, a bold name, and a muted title. Keep the three cards similar in length and aligned in height. Forbidden: vague adjective-only quotes, mixed avatar styles (some photos, some initials), attributions missing a title, and near-duplicate quotes across cards.",
      },
      {
        key: "quote",
        name: "Quote",
        nameZh: "单条大引言",
        whenToUse:
          "One credible name (a known customer or publication) can carry the whole section alone.",
        whenToUseZh: "有一条足够重磅的背书(知名客户或媒体),一条就能撑起整个区块。",
        promptZh:
          "请做一个单条大引言用户评价区(testimonial quote):整体居中,最上面一排五颗实心星标(强调色),中间是一句大字号引言(<blockquote>,字号明显大于正文、行距紧凑),下方是署名行:圆形首字母头像 + 姓名(加粗)+ 头衔(灰色小字),同样居中。整体上下留白宽松,让这一条引言成为视觉焦点。禁止:塞进第二条引言分散注意力、星标用空心或和背景同色导致看不清、引言字号和正文差不多大、署名信息缺失头衔。",
        promptEn:
          "Build a single large testimonial quote: everything centered, a row of five filled star icons (accent color) on top, a large-size quote in the middle (<blockquote>, noticeably bigger than body text, tight line height), and a centered attribution row below — a circular initial avatar, a bold name, and a muted title. Use generous vertical whitespace so this one quote is the clear focal point. Forbidden: adding a second competing quote, outline stars or stars that blend into the background, quote text sized close to body copy, and attributions missing a title.",
      },
    ],
  },
];
