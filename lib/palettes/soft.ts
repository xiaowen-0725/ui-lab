import type { PaletteEntry } from "./types";

// 柔和淡雅组:低饱和、低对比、靠明度分层的安静配色。

export const softPalettes: PaletteEntry[] = [
  {
    slug: "morandi",
    name: "Morandi",
    nameZh: "莫兰迪",
    group: "soft",
    aliases: ["莫兰迪色系", "Morandi Colors", "高级灰", "低饱和灰调"],
    description:
      "Grays that remember being colors — dusty green, muted rose and warm greige, all hushed to a whisper.",
    descriptionZh: "记得自己曾是颜色的灰:灰绿、灰粉、暖米,全都压低了嗓音说话。",
    bestFor: "Lifestyle and home brands, women-focused products, portfolio sites, wellness apps",
    bestForZh: "生活方式 / 家居品牌、女性向产品、个人作品集、疗愈类应用",
    promptZh:
      "请用莫兰迪(Morandi)配色:整体低饱和灰调,颜色像蒙了一层灰雾。背景 #EAE6E0(暖灰米)、卡片 #F4F1EB、描边 #DAD3C9;正文 #4C4842(暖炭灰,不用纯黑)、次要文字 #8E877C;主按钮 #97A094(灰绿)配米白字 #F7F6F2;点缀色 #C0A9A2(灰粉),只用在徽标和小图标上。所有颜色饱和度不超过 25%,层次靠明度差而非色相差。禁止:高饱和原色、纯黑 #000 或纯白 #fff、强对比撞色、超过三种色相、鲜艳渐变。",
    promptEn:
      "Use a Morandi palette: low-saturation grays that feel dusted with fog. Background #EAE6E0 (warm greige), cards #F4F1EB, borders #DAD3C9; body text #4C4842 (warm charcoal, never pure black), secondary text #8E877C; primary buttons #97A094 (gray-green) with off-white text #F7F6F2; the accent is #C0A9A2 (dusty rose), reserved for badges and small icons. Keep every color under ~25% saturation and build hierarchy with lightness, not hue. Forbidden: saturated primaries, pure #000 or #fff, high-contrast clashes, more than three hues, vivid gradients.",
    recipeZh: [
      "60-30-10:背景灰米 60%,卡片与留白 30%,灰绿主色 + 灰粉点缀合计 ≤10%",
      "全色板饱和度 ≤25%,色相差小,层次靠明度阶梯(#EAE6E0 → #DAD3C9 → #8E877C → #4C4842)",
      "文字禁纯黑:正文用暖炭灰 #4C4842,和背景对比度约 9:1,够读但不刺",
      "主按钮 #97A094 上用米白 #F7F6F2 而非纯白,保持雾感",
      "点缀 #C0A9A2 一屏最多出现两处,多了灰调就散了",
    ],
    recipe: [
      "60-30-10: greige background 60%, cards and whitespace 30%, gray-green primary plus dusty-rose accent ≤10% combined",
      "Cap saturation at ~25% across the board; keep hues close and step lightness instead (#EAE6E0 → #DAD3C9 → #8E877C → #4C4842)",
      "No pure black text: warm charcoal #4C4842 gives ~9:1 contrast on the background — readable without the sting",
      "Off-white #F7F6F2 on the #97A094 button, never pure white, to keep the foggy feel",
      "Limit the #C0A9A2 accent to two appearances per screen or the hush falls apart",
    ],
    colors: {
      bg: "#EAE6E0",
      surface: "#F4F1EB",
      border: "#DAD3C9",
      text: "#4C4842",
      muted: "#8E877C",
      primary: "#97A094",
      primaryFg: "#F7F6F2",
      accent: "#C0A9A2",
    },
  },
  {
    slug: "cream",
    name: "Cream",
    nameZh: "奶油风",
    group: "soft",
    aliases: ["奶油风", "Cream Tone", "奶油色系", "暖调奶咖"],
    description:
      "Butter and clotted cream stacked fresh from the oven — warm, sweet without tipping into cloying.",
    descriptionZh: "刚出炉的黄油与淡奶油堆叠在一起:温暖、甜而不腻,像烘焙店的下午。",
    bestFor: "Dessert and bakery brands, baby and parenting products, lifestyle blogs, warm-toned personal sites",
    bestForZh: "甜品 / 烘焙品牌、母婴产品、生活方式博客、暖调个人站",
    promptZh:
      "请用奶油风(Cream)配色:整体暖调柔和,像刚出炉的黄油和淡奶油堆叠在一起。背景 #FFF8F0(奶油白)、卡片 #FFFDFA(接近纸白但仍偏暖)、描边 #F2E5D8(浅烘焙色);正文 #5C4F43(暖可可棕,不用纯黑)、次要文字 #A6968A(奶咖灰棕);主按钮 #E8B88A(焦糖奶油)配深棕字 #4A3B2C;点缀色 #F5D89E(奶油黄),只用于标签、图标或强调数字。整体饱和度中低,靠暖色相的明度差堆出层次,不引入冷色。禁止:冷色调(蓝、青、冷灰)、高饱和撞色、深色/黑色背景、锐利强对比描边、金属感渐变、任何冷调阴影。",
    promptEn:
      "Use a Cream palette: warm and soft, like butter and clotted cream stacked fresh from the oven. Background #FFF8F0 (creamy white), cards #FFFDFA (near-paper white, still warm), borders #F2E5D8 (pale baked tone); body text #5C4F43 (warm cocoa brown, never pure black), secondary text #A6968A (milky taupe); primary buttons #E8B88A (caramel cream) with deep brown text #4A3B2C; the accent #F5D89E (custard yellow) reserved for tags, icons, or highlighted numbers. Keep overall saturation low-to-mid and build hierarchy through lightness within the warm hue family — no cool colors allowed in. Forbidden: cool tones (blue, cyan, cool gray), high-saturation clashes, dark or black backgrounds, sharp high-contrast borders, metallic gradients, any cool-toned shadows.",
    recipeZh: [
      "60-30-10:奶油白背景 60%,卡片与留白 30%,焦糖主色 + 奶油黄点缀合计 ≤10%",
      "全色板偏暖,饱和度中低,层次靠明度阶梯(#FFF8F0 → #F2E5D8 → #A6968A → #5C4F43)",
      "文字禁纯黑:正文用暖可可棕 #5C4F43,和背景对比度约 8:1,读起来不刺眼",
      "主按钮 #E8B88A 上用深棕字 #4A3B2C 而非纯黑,延续暖调而不破坏甜感",
      "点缀 #F5D89E 一屏最多两到三处,多了就从'甜'变'腻'",
    ],
    recipe: [
      "60-30-10: cream-white background 60%, cards and whitespace 30%, caramel primary plus custard-yellow accent ≤10% combined",
      "Keep the whole palette warm and mid-to-low saturation; step lightness for hierarchy (#FFF8F0 → #F2E5D8 → #A6968A → #5C4F43)",
      "No pure black text: cocoa brown #5C4F43 gives ~8:1 contrast on the background — legible without being harsh",
      "Deep brown #4A3B2C on the #E8B88A button, not pure black, to keep the warmth intact",
      "Cap the #F5D89E accent at two or three spots per screen, or sweet tips into cloying",
    ],
    colors: {
      bg: "#FFF8F0",
      surface: "#FFFDFA",
      border: "#F2E5D8",
      text: "#5C4F43",
      muted: "#A6968A",
      primary: "#E8B88A",
      primaryFg: "#4A3B2C",
      accent: "#F5D89E",
    },
  },
  {
    slug: "macaron",
    name: "Macaron",
    nameZh: "马卡龙",
    group: "soft",
    aliases: ["马卡龙色", "Macaron", "粉彩", "Pastel"],
    description:
      "Frosted pastries lined up in a dessert window — light, girlish, with pink and mint as the signature duo.",
    descriptionZh: "甜品橱窗里码得整整齐齐的糖霜色:轻盈少女感,粉与薄荷蓝是这组配色的签名双色。",
    bestFor: "Female-oriented products, beauty brands, dessert shops, stickers and creative merchandise",
    bestForZh: "女性向产品、美妆品牌、甜品店、贴纸 / 文创周边",
    promptZh:
      "请用马卡龙(Macaron)配色:轻盈甜美,像甜品橱窗里码得整整齐齐的糖霜色。背景 #FDF6F8(浅粉白)、卡片 #FFFFFF(纯白,拉开层次)、描边 #F3DEE6(浅粉描边);正文 #55464E(深莓灰紫,不用纯黑)、次要文字 #A38B96(灰粉棕);主按钮 #F2A7C3(马卡龙粉)配深莓字 #4A2C3A;点缀色 #A7D8DE(薄荷蓝),是这组配色的签名双色,只用在图标、标签或强调元素上,和粉色形成呼应而非对撞。禁止:脏色(灰浊的粉/蓝)、深灰或纯黑大面积使用、原色红/原色蓝、粗黑描边、高饱和撞色渐变。",
    promptEn:
      "Use a Macaron palette: light and girlish, like frosted pastries lined up in a dessert window. Background #FDF6F8 (blush white), cards #FFFFFF (pure white, for lift), borders #F3DEE6 (soft pink outline); body text #55464E (deep berry-gray, never pure black), secondary text #A38B96 (dusty pink-brown); primary buttons #F2A7C3 (macaron pink) with deep berry text #4A2C3A; the accent #A7D8DE (mint blue) is this palette's signature second color — reserved for icons, tags, or emphasis, echoing the pink rather than clashing with it. Forbidden: muddy tones (grayed-out pink or blue), large blocks of dark gray or pure black, primary red/blue, thick black outlines, high-saturation clashing gradients.",
    recipeZh: [
      "60-30-10:浅粉白背景 60%,纯白卡片与留白 30%,马卡龙粉主色 + 薄荷蓝点缀合计 ≤10%",
      "粉与薄荷蓝是签名双色,比例上粉更多、蓝更少,蓝只做点睛不做主角",
      "文字禁纯黑:正文用深莓灰紫 #55464E,和背景对比度约 8.5:1,少女感不牺牲可读性",
      "主按钮 #F2A7C3 上用深莓字 #4A2C3A 而非纯黑,保持粉调的柔和边界",
      "描边 #F3DEE6 要细,粗黑描边会瞬间把马卡龙感变成漫画感",
    ],
    recipe: [
      "60-30-10: blush-white background 60%, white cards and whitespace 30%, macaron-pink primary plus mint accent ≤10% combined",
      "Pink and mint are the signature duo — weight pink heavier, let mint stay a supporting flourish, not a co-lead",
      "No pure black text: deep berry-gray #55464E gives ~8.5:1 contrast on the background — girlish without sacrificing legibility",
      "Deep berry #4A2C3A on the #F2A7C3 button, not pure black, to keep the pink's soft edge",
      "Keep the #F3DEE6 border hairline-thin — a thick black outline turns macaron into comic-book instantly",
    ],
    colors: {
      bg: "#FDF6F8",
      surface: "#FFFFFF",
      border: "#F3DEE6",
      text: "#55464E",
      muted: "#A38B96",
      primary: "#F2A7C3",
      primaryFg: "#4A2C3A",
      accent: "#A7D8DE",
    },
  },
  {
    slug: "sage",
    name: "Sage",
    nameZh: "鼠尾草绿",
    group: "soft",
    aliases: ["鼠尾草绿", "Sage Green", "灰绿色系", "植物系配色"],
    description:
      "A row of matte glass bottles on an organic skincare counter — botanical, quiet, restrained.",
    descriptionZh: "有机护肤品柜台上一排哑光玻璃瓶:植物系、安静克制,不喧哗也不刺眼。",
    bestFor: "Skincare and wellness brands, yoga and meditation apps, eco-friendly products, minimalist portfolios",
    bestForZh: "护肤 / 健康品牌、瑜伽冥想应用、环保产品、极简作品集",
    promptZh:
      "请用鼠尾草绿(Sage)配色:安静克制,像有机护肤品柜台上一排哑光玻璃瓶。背景 #F2F4EF(浅灰绿)、卡片 #FAFBF8(近白,略偏冷)、描边 #DCE2D6(浅灰绿描边);正文 #3F4A3C(深橄榄绿,不用纯黑)、次要文字 #83907E(灰绿);主按钮 #7C9473(鼠尾草绿)配浅米字 #F5F8F2;点缀色 #C8B394(木质卡其),用在图标、标签或小面积强调上,给植物绿添一点大地暖度。禁止:荧光绿、高饱和撞色、纯黑大面积、工业感深灰、任何塑料感高光渐变。",
    promptEn:
      "Use a Sage palette: quiet and restrained, like a row of matte glass bottles on an organic skincare counter. Background #F2F4EF (pale sage), cards #FAFBF8 (near-white, slightly cool), borders #DCE2D6 (soft sage outline); body text #3F4A3C (deep olive green, never pure black), secondary text #83907E (grayed sage); primary buttons #7C9473 (sage green) with pale cream text #F5F8F2; the accent #C8B394 (woody khaki) belongs on icons, tags, or small emphasis — it warms the green with a touch of earth. Forbidden: neon green, high-saturation clashes, large blocks of pure black, industrial dark gray, any glossy plastic-like gradient.",
    recipeZh: [
      "60-30-10:浅灰绿背景 60%,近白卡片与留白 30%,鼠尾草绿主色 + 木质卡其点缀合计 ≤10%",
      "全色板压在灰绿-橄榄区间,层次靠明度阶梯(#F2F4EF → #DCE2D6 → #83907E → #3F4A3C)",
      "文字禁纯黑:正文用深橄榄绿 #3F4A3C,和背景对比度约 8:1,安静但不失清晰",
      "主按钮 #7C9473 上用浅米字 #F5F8F2 而非纯白,避免冷调跳脱",
      "点缀 #C8B394 一屏一到两处即可,过多会让植物系变成军绿工装风",
    ],
    recipe: [
      "60-30-10: pale-sage background 60%, near-white cards and whitespace 30%, sage-green primary plus khaki accent ≤10% combined",
      "Keep the whole palette in the sage-to-olive range; step lightness for hierarchy (#F2F4EF → #DCE2D6 → #83907E → #3F4A3C)",
      "No pure black text: deep olive #3F4A3C gives ~8:1 contrast on the background — calm without losing clarity",
      "Pale cream #F5F8F2 on the #7C9473 button, not pure white, to avoid a cold jump",
      "Limit the #C8B394 accent to one or two spots per screen, or the botanical mood tips into workwear khaki",
    ],
    colors: {
      bg: "#F2F4EF",
      surface: "#FAFBF8",
      border: "#DCE2D6",
      text: "#3F4A3C",
      muted: "#83907E",
      primary: "#7C9473",
      primaryFg: "#F5F8F2",
      accent: "#C8B394",
    },
  },
];
