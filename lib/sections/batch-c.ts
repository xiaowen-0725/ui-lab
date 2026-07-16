import type { SectionEntry } from "./types";

// Batch C: pricing / faq / footer.

export const batchCSections: SectionEntry[] = [
  {
    slug: "pricing",
    name: "Pricing",
    nameZh: "定价表",
    aliases: ["定价表", "Pricing", "价格方案", "套餐表"],
    description:
      "The pricing section — plan cards side by side, with one of them clearly the intended choice.",
    descriptionZh:
      "定价表就是「把价格摆出来讨论」的区块:几张方案卡并排,其中一档就是希望你选的那个。",
    bestFor: "SaaS and subscription products deciding how many tiers to show",
    bestForZh: "SaaS 与订阅制产品,用来决定该摆几档方案",
    recipeZh: [
      "结构 = 分段标题(可选)+ N 张方案卡,每卡 = 方案名 + 大字价格 + 功能清单 + 按钮",
      "价格数字是全区块最大字号;清单只写与其他档的差异,不写全集",
      "推荐档放中间(锚定效应),配描边高亮或顶部小徽标标注",
      "按钮动词开头,推荐档实色、其余描边,拉开视觉优先级",
      "年付/月付切换是常见增强,不是必需项",
    ],
    recipe: [
      "Structure = optional section title + N plan cards, each card = plan name + large price + feature list + button",
      "The price is the largest text in the whole section; the list states differences from other tiers, not the full feature set",
      "The recommended tier sits in the middle (anchoring effect), marked with a border highlight or a small top badge",
      "Buttons are verb-first; solid for the recommended tier, outlined for the rest, to separate visual priority",
      "A monthly/annual toggle is a common enhancement, not a requirement",
    ],
    variants: [
      {
        key: "tiers",
        name: "Tiers",
        nameZh: "三档式",
        whenToUse:
          "Standard SaaS three-tier pricing — let visitors anchor on the middle plan instead of doing the math themselves.",
        whenToUseZh: "标准 SaaS 三档定价,让访客用「中间档」做决定,而不是自己算账。",
        promptZh:
          "请做一个三档式定价表(pricing tiers):三张方案卡横向并排(免费版/专业版/团队版),每卡从上到下是方案名、大字价格(约为正文 3 倍,数字最大,后面跟小字「/月」)、一条分隔线、4 条带对勾图标的功能清单(小字灰色,只写与其他档的差异)、底部一个按钮。中间的专业版卡片用细描边高亮(不整卡换色),并在卡片顶部悬浮一个小徽标写「最受欢迎」;专业版按钮用实色,其余两档按钮用描边弱化。三卡等宽,间距一致。禁止:三张卡片视觉权重相同(没有推荐档)、清单写成产品的全部功能而非该档差异、价格数字比标题还小、按钮文案含糊如「查看」而非动词开头、把徽标做成刺眼的贴纸。",
        promptEn:
          "Build a three-tier pricing table: three plan cards side by side (Free / Pro / Team), each stacking a plan name, a large price (~3x body size, the biggest number on the page, with a small '/mo' after it), a divider, a 4-item feature list with check icons (small muted text, differences only, not the full set), and a button at the bottom. Highlight the middle Pro card with a hairline ring (not a full color swap) and float a small 'Most popular' badge on top; give Pro a solid button and outline the other two. Keep the three cards equal width with consistent gaps. Forbidden: giving all three cards equal visual weight with no recommended tier, listing the entire feature set instead of tier differences, making the price smaller than the heading, vague button copy like 'View' instead of a verb, and loud sticker-style badges.",
      },
      {
        key: "simple",
        name: "Simple",
        nameZh: "单档式",
        whenToUse:
          "A single product or one-time purchase — skip the choice entirely and turn the decision into yes/no.",
        whenToUseZh: "单一产品或买断制,只有一个价格——省掉选择成本,把决定变成是/否。",
        promptZh:
          "请做一个单档式定价表(pricing simple):单张卡片居中放置,不需要网格对比。卡片从上到下是产品/方案名、全区块最大字号的价格(可加「一个价格,解锁全部功能」这类说明小字)、一条分隔线、4-6 条带对勾图标的功能清单(这次可以写全集,因为只有一档)、一个占满卡片宽度的实色主按钮。卡片本身居中于页面,宽度控制在一屏可读的窄栏内。禁止:旁边配一张「参照对比」的虚拟档位、清单写成营销口号而非具体功能点、按钮做成描边弱化(唯一选择应该敢用实色)、卡片宽度铺满整个容器。",
        promptEn:
          "Build a simple single-tier pricing block: one card centered on the page, no grid comparison. It stacks a product/plan name, the largest price on the page (optionally with a note like 'One price, everything unlocked'), a divider, a 4-6 item feature list with check icons (the full set is fine here since there's only one tier), and a full-width solid primary button. Keep the card centered and narrow enough to read in one glance. Forbidden: adding a fake comparison tier next to it, writing marketing slogans instead of concrete features, using an outlined button (the only option should commit to solid), and stretching the card to the full container width.",
      },
    ],
  },
  {
    slug: "faq",
    name: "FAQ",
    nameZh: "常见问题",
    aliases: ["常见问题", "FAQ", "问答区", "答疑"],
    description:
      "The FAQ section — pre-answering objections before the reader has to ask, right before the final decision.",
    descriptionZh:
      "常见问题就是「提前替访客把疑虑说完」的区块,通常卡在决定购买前的最后一关。",
    bestFor: "Any page with friction left after pricing — cancellation, security, payment doubts",
    bestForZh: "定价之后仍有顾虑的页面——取消政策、数据安全、付款方式等疑问",
    recipeZh: [
      "结构 = 分段标题(可选)+ N 条问答,每条 = 问题 + 回答",
      "问题用访客的原话提问(「可以...吗」「支不支持...」),不要写成功能条目",
      "回答先给结论句,再补充细节,不要让人读完还要猜答案",
      "放在 pricing 之后、CTA 之前,这是转化路径上疑虑最集中的位置",
      "有条件时补 FAQPage 结构化数据,搜索结果里能直接展开问答",
    ],
    recipe: [
      "Structure = optional section title + N Q&A items, each = question + answer",
      "Write questions in the visitor's own words ('Can I...', 'Do you support...'), not as feature bullets",
      "Lead the answer with the conclusion, then add detail — don't make readers guess the answer",
      "Place it after pricing and before the CTA, where doubts peak in the conversion path",
      "Add FAQPage structured data when possible so search results can expand the Q&A directly",
    ],
    variants: [
      {
        key: "accordion",
        name: "Accordion",
        nameZh: "手风琴式",
        whenToUse:
          "Many questions and limited vertical space — only one answer expands at a time, so the list can grow without bloating the page.",
        whenToUseZh: "问题数量多、想省纵向空间时——一次只展开一条,列表再长也不占地方。",
        promptZh:
          "请做一个手风琴式常见问题(faq accordion):使用真实的 <details>/<summary> 元素,纵向堆叠 4 条问答,条目之间用细分隔线隔开。每条的 summary 是问题本身(字重加粗、鼠标悬停可点击),点击展开后在下方显示 2 行左右的回答(灰色小字)。第一条默认展开,其余默认收起。问题要写得像真人会问的话,比如「可以随时取消吗」「数据安全吗」。禁止:用 JS 模拟手风琴而不用原生 details/summary、一次性展开全部 4 条、回答写成一整段没有断句的长文字、问题写成术语堆砌(如「取消策略说明」)。",
        promptEn:
          "Build an accordion FAQ: use real <details>/<summary> elements, stacking 4 Q&A items vertically with hairline dividers between them. Each summary is the question itself (bold, cursor-pointer), expanding to reveal a ~2-line muted answer below it. The first item is open by default, the rest closed. Write questions the way a real user would ask them, e.g. 'Can I cancel anytime?' or 'Is my data safe?'. Forbidden: faking the accordion with JS instead of native details/summary, expanding all 4 items at once, writing answers as one unbroken paragraph, and phrasing questions as jargon like 'Cancellation policy overview'.",
      },
      {
        key: "two-column",
        name: "Two Column",
        nameZh: "两列式",
        whenToUse:
          "Fewer than six questions — lay them all out at once and save the reader a click.",
        whenToUseZh: "问题少于六个时直接全部亮出来,省掉一次点击,访客扫一眼就能读完。",
        promptZh:
          "请做一个两列式常见问题(faq two-column):移动端单列堆叠,桌面端(md 断点起)分两列网格铺开 4 条问答,全部同时可见、不需要点击展开。每条从上到下是加粗的问题和其下方的回答(灰色小字,2 行左右)。列间与行间留白要宽松,避免看起来像一份考卷。禁止:塞入超过 6 条问答(超过就该换手风琴)、把问答做成可点击展开(两列式的意义就是不用点)、两列文字长度差异悬殊导致参差不齐、问题不分段直接堆成一段导语。",
        promptEn:
          "Build a two-column FAQ: single column on mobile, a two-column grid from the md breakpoint up, laying out 4 Q&A items all at once with no click needed. Each item stacks a bold question and a muted ~2-line answer below it. Give columns and rows generous gaps so it doesn't read like an exam sheet. Forbidden: cramming in more than 6 items (switch to an accordion past that), making items click-to-expand (the whole point of two-column is skipping the click), wildly mismatched answer lengths that break the grid rhythm, and running the questions together into one intro paragraph.",
      },
    ],
  },
  {
    slug: "footer",
    name: "Footer",
    nameZh: "页脚",
    aliases: ["页脚", "Footer", "底栏", "站尾"],
    description: "The footer — the page's last word: sitemap, legal links and a final signature.",
    descriptionZh:
      "页脚是整页的收尾:站内导航、法律链接与最后的落款,访客读到这里说明已经认真看完了。",
    bestFor: "Every page — but how much it carries should match how much content the site actually has",
    bestForZh: "所有页面都需要——但该放多少内容,要匹配站点本身的信息量",
    recipeZh: [
      "结构 = 品牌/链接分组区(可选)+ 分隔线 + 版权行",
      "用语义 <footer> 标签包裹整个区块,而不是普通 div",
      "链接最多分 4 组,每组配一个小标题,组内链接不超过 5 条",
      "版权行必须带年份,年份要维护而不是硬编码成开站那年",
      "页脚不是杂物抽屉——放不进任何分组的链接,宁可不放",
    ],
    recipe: [
      "Structure = optional brand/link-group area + divider + copyright row",
      "Wrap the whole block in a semantic <footer>, not a plain div",
      "Group links into at most 4 groups, each with a small heading and no more than 5 links",
      "The copyright row must carry a year, kept current rather than hardcoded to launch day",
      "The footer isn't a junk drawer — a link that doesn't fit any group is better left out",
    ],
    variants: [
      {
        key: "columns",
        name: "Columns",
        nameZh: "分组式",
        whenToUse:
          "A content-heavy product site where visitors sometimes come here to re-find a page, not just to see the copyright.",
        whenToUseZh: "内容多的正式产品站,访客可能想从页脚重新找到某个页面的入口。",
        promptZh:
          "请做一个分组式页脚(footer columns):上半部分是网格布局——最左侧是品牌列(logo 占位方块 + 一句话简介),右侧并排 3 个链接组(产品/资源/公司),每组一个小标题(灰色大写小字)加 3-4 条链接(灰色文字)。下半部分用一条细分隔线隔开,单行左右排布:左边版权文字(含年份),右边 2-3 个图标占位方块(社交媒体入口)。整体用 <footer> 语义标签包裹。禁止:链接组超过 4 组、每组链接超过 5 条、版权行没有年份、品牌列和链接组挤在同一列导致分不清主次、移动端网格不换行导致文字挤压。",
        promptEn:
          "Build a columned footer: the top half is a grid — a brand column on the left (logo placeholder block + one-line tagline) and 3 link groups (Product / Resources / Company) beside it, each with a small uppercase heading and 3-4 muted links. Below it, a hairline divider separates a single row: copyright text (with year) on the left, 2-3 icon placeholder squares (social links) on the right. Wrap it all in a semantic <footer>. Forbidden: more than 4 link groups, more than 5 links per group, a copyright row missing the year, cramming the brand column and link groups into one indistinct column, and a grid that doesn't reflow on mobile.",
      },
      {
        key: "minimal",
        name: "Minimal",
        nameZh: "极简式",
        whenToUse:
          "A single-page app or portfolio — the footer is just a signal that you've reached the bottom, not a navigation surface.",
        whenToUseZh: "单页应用或作品集,页脚只是「到底了」的信号,不需要承担导航职责。",
        promptZh:
          "请做一个极简式页脚(footer minimal):单行 flex 布局,移动端换行堆叠居中,桌面端左右分布——左侧是品牌名加版权文字(同一行,灰色小字),右侧并排 3-4 个文字链接(隐私政策/服务条款/联系我们,灰色小字,横向间距均匀)。不要网格、不要多组标题,整行高度克制。用 <footer> 语义标签包裹。禁止:塞入产品/资源/公司这类多组链接(超过一组就该换分组式)、加大号品牌 logo 抢视觉、链接换成按钮样式、页脚高度明显厚于正文行高。",
        promptEn:
          "Build a minimal footer: a single flex row that wraps to a centered stack on mobile, split left/right on desktop — brand name plus copyright text on the left (same line, small muted text), and 3-4 text links on the right (Privacy / Terms / Contact, small muted text, even spacing). No grid, no group headings, keep the row height restrained. Wrap it in a semantic <footer>. Forbidden: adding multi-group links like Product/Resources/Company (past one group, switch to the columned variant), an oversized brand logo stealing attention, styling links as buttons, and a footer visibly taller than body line height.",
      },
    ],
  },
];
