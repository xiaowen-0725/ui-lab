import type { PaletteEntry } from "./types";

// 自然经典组:取材于泥土、水色与传统美学的沉稳配色。

export const earthyPalettes: PaletteEntry[] = [
  {
    slug: "earth",
    name: "Earth Tones",
    nameZh: "大地色",
    group: "earthy",
    aliases: ["大地色系", "Earth Tones", "陶土色", "Terracotta"],
    description:
      "Clay pots, linen sheets, and wood left out in the sun — terracotta grounded by a touch of olive.",
    descriptionZh: "陶罐、亚麻布、晒透了的木头 —— 赭陶打底,一点橄榄绿收尾。",
    bestFor:
      "Furniture and home brands, artisan/craft goods, coffee roasters, sustainable fashion",
    bestForZh: "家具/家居品牌、手工艺品牌、咖啡烘焙、可持续时尚",
    promptZh:
      "请用大地色(Earth Tones)配色:陶土、亚麻、晒过太阳的木头质感。背景 #F7F1E8(亚麻米)、卡片 #FCF9F3(暖白)、描边 #E5D8C4(浅陶土);正文 #4A3B2B(深赭棕,不用纯黑)、次要文字 #97835F(暖褐灰);主按钮 #A9744A(赭陶)配暖白字 #FBF6EE;点缀色 #6B7F4F(橄榄绿),只用在图标、标签或少量强调文字上。整体沉稳温暖,像被太阳晒透的陶器和木材。禁止:荧光色、冷蓝主导、纯黑 #000 或纯白 #fff、塑料感高饱和、光泽金属渐变。",
    promptEn:
      "Use an Earth Tones palette: clay, linen, and sun-warmed wood. Background #F7F1E8 (linen beige), cards #FCF9F3 (warm white), borders #E5D8C4 (pale terracotta); body text #4A3B2B (deep umber, never pure black), secondary text #97835F (warm taupe); primary buttons #A9744A (terracotta) with warm-white text #FBF6EE; the accent is #6B7F4F (olive green), reserved for icons, tags, or small emphasis text. The overall feel should be grounded and warm, like fired clay and weathered wood. Forbidden: neon colors, cool-blue dominance, pure #000 or #fff, plastic-slick high saturation, glossy metallic gradients.",
    recipeZh: [
      "60-30-10:亚麻米背景 60%,卡片与留白 30%,赭陶主色 + 橄榄绿点缀合计 ≤10%",
      "层次靠明度阶梯推进:#F7F1E8 → #E5D8C4 → #97835F → #4A3B2B,色相保持在暖棕橙一侧",
      "正文用深赭棕 #4A3B2B 而非纯黑,和背景 #F7F1E8 对比度足够阅读又不生硬",
      "主按钮 #A9744A 上配暖白字 #FBF6EE,不用纯白,避免跳出整体色温",
      "橄榄绿 #6B7F4F 一屏只做点缀,面积超过 10% 就压过了陶土主调",
    ],
    recipe: [
      "60-30-10: linen background 60%, cards and whitespace 30%, terracotta primary plus olive accent ≤10% combined",
      "Step lightness rather than hue: #F7F1E8 → #E5D8C4 → #97835F → #4A3B2B, staying within warm browns and oranges",
      "Body text uses deep umber #4A3B2B instead of pure black — readable against #F7F1E8 without feeling harsh",
      "Pair the #A9744A button with warm-white #FBF6EE text, never pure white, to keep the color temperature consistent",
      "Keep #6B7F4F olive as a true accent — past ~10% of the screen it overpowers the terracotta lead",
    ],
    colors: {
      bg: "#F7F1E8",
      surface: "#FCF9F3",
      border: "#E5D8C4",
      text: "#4A3B2B",
      muted: "#97835F",
      primary: "#A9744A",
      primaryFg: "#FBF6EE",
      accent: "#6B7F4F",
    },
  },
  {
    slug: "ocean",
    name: "Ocean Blue",
    nameZh: "海洋蓝",
    group: "earthy",
    aliases: ["海洋蓝", "Ocean Blue", "青蓝色系", "水色系"],
    description:
      "Clean and cool, like a tide pool at low water — deep teal grounded by a flash of sky blue.",
    descriptionZh: "清爽干净,像退潮后的浅滩 —— 深青打底,一点天蓝跳色。",
    bestFor:
      "Healthcare and wellness, travel/island tourism, ocean conservation orgs, clean-tech products",
    bestForZh: "健康医疗、旅行/海岛度假、环保海洋组织、清洁类产品",
    promptZh:
      "请用海洋蓝(Ocean Blue)配色:清爽干净,像退潮后的浅滩。背景 #F2F8FA(浅水蓝)、卡片 #FBFDFE(近白)、描边 #D5E6EC(浅青);正文 #173B4A(深青蓝,不用纯黑)、次要文字 #5E8494(灰青);主按钮 #0E7490(深青)配浅蓝白字 #F0FAFD;点缀色 #38BDF8(天蓝),只用在图标、标签或数据高亮上。整体明亮通透,不带一点暖调。禁止:暖棕、艳粉、深色底、脏灰、高饱和撞色。",
    promptEn:
      "Use an Ocean Blue palette: clean and cool, like a tide pool at low water. Background #F2F8FA (pale aqua), cards #FBFDFE (near-white), borders #D5E6EC (light cyan); body text #173B4A (deep teal, never pure black), secondary text #5E8494 (slate blue-gray); primary buttons #0E7490 (deep teal) with pale-blue text #F0FAFD; the accent is #38BDF8 (sky blue), reserved for icons, tags, or highlighted data. The feel should be bright and airy, with no warm tones creeping in. Forbidden: warm browns, hot pink, dark backgrounds, muddy grays, high-saturation color clashes.",
    recipeZh: [
      "60-30-10:浅水蓝背景 60%,卡片与留白 30%,深青主色 + 天蓝点缀合计 ≤10%",
      "层次靠明度阶梯:#F2F8FA → #D5E6EC → #5E8494 → #173B4A,色相全程锁在青蓝一侧",
      "正文用深青蓝 #173B4A 而非纯黑,和浅水蓝背景对比度够清晰,读起来仍是冷调",
      "主按钮 #0E7490 上配浅蓝白字 #F0FAFD,不用纯白,保留一点水色",
      "天蓝 #38BDF8 饱和度高,只做数据点、图标或小徽标,大面积用会刺眼",
    ],
    recipe: [
      "60-30-10: pale-aqua background 60%, cards and whitespace 30%, deep-teal primary plus sky-blue accent ≤10% combined",
      "Step lightness, not hue: #F2F8FA → #D5E6EC → #5E8494 → #173B4A, staying within blues and teals throughout",
      "Body text uses deep teal #173B4A instead of pure black — clear against the pale-aqua background while staying cool",
      "Pair the #0E7490 button with pale-blue #F0FAFD text, never pure white, to keep a trace of water in it",
      "Sky blue #38BDF8 is highly saturated — reserve it for data points, icons, or small badges; large areas turn glaring",
    ],
    colors: {
      bg: "#F2F8FA",
      surface: "#FBFDFE",
      border: "#D5E6EC",
      text: "#173B4A",
      muted: "#5E8494",
      primary: "#0E7490",
      primaryFg: "#F0FAFD",
      accent: "#38BDF8",
    },
  },
  {
    slug: "business",
    name: "Corporate Blue",
    nameZh: "商务蓝灰",
    group: "earthy",
    aliases: ["商务蓝", "Corporate Blue", "企业级配色", "蓝灰商务"],
    description:
      "Professional, trustworthy, unshakeably corporate — the blue that never surprises anyone.",
    descriptionZh: "专业、可信、不出错的企业蓝 —— 一种永远不会让人意外的颜色。",
    bestFor: "B2B corporate websites, finance and legal, enterprise SaaS, consulting firms",
    bestForZh: "B2B 企业官网、金融/法务、企业级 SaaS、咨询公司",
    promptZh:
      "请用商务蓝灰(Corporate Blue)配色:专业、可信、不出错的企业感。背景 #F6F8FA(冷白灰)、卡片 #FFFFFF(纯白)、描边 #DDE3EA(浅灰蓝);正文 #1F2A37(深石墨蓝,不用纯黑)、次要文字 #64748B(石板灰);主按钮 #1D4ED8(标准蓝)配浅蓝白字 #F5F8FF;点缀色 #0EA5E9(亮天蓝),只用在图表、状态标签或链接悬停上。整体克制、规整,像一份排版严谨的企业报告。禁止:娱乐化糖果色、大红大紫、暗黑底、装饰性渐变、手写体或涂鸦元素。",
    promptEn:
      "Use a Corporate Blue palette: professional, trustworthy, unshakeably enterprise. Background #F6F8FA (cool off-white), cards #FFFFFF (pure white), borders #DDE3EA (pale blue-gray); body text #1F2A37 (deep graphite blue, never pure black), secondary text #64748B (slate gray); primary buttons #1D4ED8 (standard blue) with pale-blue text #F5F8FF; the accent is #0EA5E9 (bright sky blue), reserved for charts, status tags, or link hover states. The overall feel is restrained and orderly, like a tightly typeset corporate report. Forbidden: playful candy colors, saturated reds or purples, dark-mode-only backgrounds, decorative gradients, handwritten or doodle-style elements.",
    recipeZh: [
      "60-30-10:冷白灰背景 60%,纯白卡片与留白 30%,标准蓝主色 + 亮天蓝点缀合计 ≤10%",
      "层次靠明度阶梯:#F6F8FA → #DDE3EA → #64748B → #1F2A37,色相锁死在蓝灰一侧,不引入第三色相",
      "正文用深石墨蓝 #1F2A37 而非纯黑,对比度足够但比纯黑柔和,长文阅读不累眼",
      "主按钮 #1D4ED8 上配浅蓝白字 #F5F8FF,不用纯白,统一冷色调温度",
      "亮天蓝 #0EA5E9 只用于图表数据点或极少数交互反馈,面积一大就失去企业感",
    ],
    recipe: [
      "60-30-10: cool off-white background 60%, white cards and whitespace 30%, standard-blue primary plus sky-blue accent ≤10% combined",
      "Step lightness, not hue: #F6F8FA → #DDE3EA → #64748B → #1F2A37, staying strictly within blue-grays with no third hue",
      "Body text uses deep graphite blue #1F2A37 instead of pure black — sufficient contrast but softer for long reading sessions",
      "Pair the #1D4ED8 button with pale-blue #F5F8FF text, never pure white, to keep the cool temperature consistent",
      "Reserve #0EA5E9 for chart data points or rare interactive feedback — any larger footprint breaks the corporate restraint",
    ],
    colors: {
      bg: "#F6F8FA",
      surface: "#FFFFFF",
      border: "#DDE3EA",
      text: "#1F2A37",
      muted: "#64748B",
      primary: "#1D4ED8",
      primaryFg: "#F5F8FF",
      accent: "#0EA5E9",
    },
  },
  {
    slug: "ink-wash",
    name: "Ink Wash",
    nameZh: "水墨丹青",
    group: "earthy",
    aliases: ["水墨色", "Ink Wash", "新中式配色", "宣纸墨色"],
    description:
      "Rice paper, pine-soot ink, and a single stroke of cinnabar — Chinese aesthetics translated for a screen.",
    descriptionZh: "宣纸、松烟墨、一点朱砂印 —— 中国传统审美的数字化转译。",
    bestFor: "Tea, calligraphy, and guofeng brands, museums and exhibitions, Chinese dining, cultural publishing",
    bestForZh: "茶/书法/国风品牌、博物馆/展览、中式餐饮、文化出版",
    promptZh:
      "请用水墨丹青(Ink Wash)配色:宣纸底、墨色文字、一点朱砂印。背景 #F7F5F0(宣纸米)、卡片 #FDFCF8(米白)、描边 #E2DDD2(浅灰米);正文 #26241F(松烟墨黑,不用纯黑)、次要文字 #7D786C(灰褐);主按钮 #2F3A44(黛蓝墨)配米白字 #F5F4EE;点缀色 #B5432A(朱砂红),只用在印章式的小面积强调上,比如标签角标或关键数字。整体是新中式的克制美学,墨色为主、朱砂点睛。禁止:大红灯笼式的艳俗红(朱砂只做印章式点睛,不做大面积色块)、金色堆砌、高饱和撞色、科技蓝。",
    promptEn:
      "Use an Ink Wash palette: rice-paper background, ink-black text, one seal-stamp of cinnabar. Background #F7F5F0 (rice paper), cards #FDFCF8 (warm white), borders #E2DDD2 (pale greige); body text #26241F (pine-soot black, never pure black), secondary text #7D786C (taupe gray); primary buttons #2F3A44 (indigo ink) with warm-white text #F5F4EE; the accent is #B5432A (cinnabar red), reserved for seal-stamp-sized emphasis only — a badge corner or a key number. The overall look is restrained new-Chinese aesthetics: ink dominates, cinnabar merely punctuates. Forbidden: garish lantern-red (cinnabar stays seal-sized, never a large color block), heaps of gold, high-saturation clashes, tech-blue accents.",
    recipeZh: [
      "60-30-10:宣纸米背景 60%,卡片与留白 30%,黛蓝墨主色 + 朱砂点缀合计 ≤10%",
      "层次靠明度阶梯:#F7F5F0 → #E2DDD2 → #7D786C → #26241F,主色相是墨黑与黛蓝,不掺第三色",
      "正文用松烟墨黑 #26241F 而非纯黑,留一点温度,像手写的墨迹而非印刷体",
      "主按钮 #2F3A44 上配米白字 #F5F4EE,不用纯白,呼应宣纸的暖底色",
      "朱砂红 #B5432A 面积严格控制在印章大小,一旦铺开就从水墨变年画",
    ],
    recipe: [
      "60-30-10: rice-paper background 60%, cards and whitespace 30%, indigo-ink primary plus cinnabar accent ≤10% combined",
      "Step lightness, not hue: #F7F5F0 → #E2DDD2 → #7D786C → #26241F, keeping to ink black and indigo with no third hue",
      "Body text uses pine-soot black #26241F instead of pure black, keeping a trace of warmth like brushed ink rather than print",
      "Pair the #2F3A44 button with warm-white #F5F4EE text, never pure white, to echo the rice-paper undertone",
      "Keep cinnabar #B5432A strictly seal-stamp sized — spread it wider and the look shifts from ink wash to New Year print",
    ],
    colors: {
      bg: "#F7F5F0",
      surface: "#FDFCF8",
      border: "#E2DDD2",
      text: "#26241F",
      muted: "#7D786C",
      primary: "#2F3A44",
      primaryFg: "#F5F4EE",
      accent: "#B5432A",
    },
  },
];
