import type { PaletteEntry } from "./types";

// 鲜活明快组:高饱和、高对比、靠撞色出情绪的活泼配色。

export const vividPalettes: PaletteEntry[] = [
  {
    slug: "dopamine",
    name: "Dopamine",
    nameZh: "多巴胺",
    group: "vivid",
    aliases: ["多巴胺配色", "Dopamine Colors", "快乐色", "candy colors"],
    description:
      "Hot rose crashing into tangerine — like biting into a fruit candy that glows from the inside.",
    descriptionZh: "玫红撞橙黄,像一口咬开的水果糖,甜得发光。",
    bestFor: "Young-brand marketing pages, events and festivals, creative studios, consumer apps",
    bestForZh: "年轻品牌营销页、活动 / festival、创意工作室、消费类 App",
    promptZh:
      "请用多巴胺(Dopamine)配色:整体高饱和、高能量,像走进一家糖果店。背景 #FFF7EC(奶油橙白)、卡片 #FFFFFF(纯白)、描边 #FFE3D3(浅杏粉);正文 #33202A(深莓紫,不用纯黑)、次要文字 #8A6470;主按钮 #FF477E(玫红)配纯白字 #FFFFFF;点缀色 #FF9F1C(橙黄),用于徽标、图标和强调数字。玫红与橙黄双高饱和撞色是这套配色的签名,情绪要跳、要甜、要有糖果感。禁止:低饱和灰调、深色背景、细字重、莫兰迪式雾感、单一冷色系。",
    promptEn:
      "Use a Dopamine palette: high-saturation, high-energy color like walking into a candy store. Background #FFF7EC (creamy orange-white), cards #FFFFFF (pure white), borders #FFE3D3 (pale apricot-pink); body text #33202A (deep berry-plum, never pure black), secondary text #8A6470; primary buttons #FF477E (hot rose) with pure white text #FFFFFF; the accent is #FF9F1C (tangerine), reserved for badges, icons and emphasized numbers. The rose + orange dual high-saturation clash is this palette's signature — keep the mood bouncy, sweet, candy-shop bright. Forbidden: low-saturation grays, dark backgrounds, thin font weights, Morandi-style haze, a single cool-only hue family.",
    recipeZh: [
      "60-30-10:奶油橙白背景 60%,白卡片留白 30%,玫红主色 + 橙黄点缀合计 ≤10%",
      "玫红 #FF477E 与橙黄 #FF9F1C 是签名撞色,两者饱和度都要保持在 80% 以上,不可调灰",
      "文字禁纯黑:深莓紫 #33202A 与背景 #FFF7EC 对比度约 11:1,够读又不失甜感",
      "主按钮 #FF477E 上用纯白 #FFFFFF,保证一屏之内视线第一落点",
      "点缀 #FF9F1C 只用于徽标、图标、强调数字,一屏 2-3 处为宜,过多会盖过主色",
    ],
    recipe: [
      "60-30-10: creamy orange-white background 60%, white card space 30%, rose primary plus tangerine accent ≤10% combined",
      "Rose #FF477E and tangerine #FF9F1C are the signature clash — keep both above ~80% saturation, never gray them down",
      "No pure black text: deep berry #33202A gives ~11:1 contrast on #FFF7EC — readable without losing the sweetness",
      "Pure white #FFFFFF on the #FF477E button keeps it the first thing the eye lands on",
      "Reserve #FF9F1C for badges, icons and emphasized numbers — 2-3 spots per screen, more and it overpowers the primary",
    ],
    colors: {
      bg: "#FFF7EC",
      surface: "#FFFFFF",
      border: "#FFE3D3",
      text: "#33202A",
      muted: "#8A6470",
      primary: "#FF477E",
      primaryFg: "#FFFFFF",
      accent: "#FF9F1C",
    },
  },
  {
    slug: "neon",
    name: "Neon",
    nameZh: "赛博霓虹",
    group: "vivid",
    aliases: ["霓虹色", "Neon", "赛博配色", "Cyberpunk colors"],
    description:
      "Electric cyan and magenta bursting off a deep indigo base — the smell of neon signage on a rainy night.",
    descriptionZh: "深靛蓝底上炸开电青与品红,雨夜霓虹灯牌的味道。",
    bestFor: "Esports and gaming, music events, tech streetwear brands, nightlife brands",
    bestForZh: "电竞 / 游戏、音乐活动、科技潮牌、夜生活品牌",
    promptZh:
      "请用赛博霓虹(Neon)配色:整体深色底、高对比,像夜店霓虹灯牌打在雨夜街道上。背景 #0C0C16(近黑靛蓝)、卡片 #161626(深紫灰)、描边 #2C2C46(暗紫蓝);正文 #F2F2FF(冷白,不用纯白)、次要文字 #9C9CC0;主按钮 #00F0FF(电青)配深底字 #061018;点缀色 #FF2EA6(品红),用于标签、图标和强调线条。电青与品红双霓虹在深底上对撞,是这套配色的签名。禁止:浅色背景、大地色系、柔和粉彩、低对比灰调、莫兰迪式雾感。",
    promptEn:
      "Use a Neon (Cyberpunk) palette: dark background, high contrast, like neon signage reflecting off a rainy night street. Background #0C0C16 (near-black indigo), cards #161626 (deep violet-gray), borders #2C2C46 (dim indigo); body text #F2F2FF (cool white, never pure white), secondary text #9C9CC0; primary buttons #00F0FF (electric cyan) with deep-toned text #061018; the accent is #FF2EA6 (magenta), used on tags, icons and emphasis lines. Electric cyan clashing with magenta over a dark base is this palette's signature. Forbidden: light backgrounds, earthy tones, soft pastels, low-contrast grays, Morandi-style haze.",
    recipeZh: [
      "60-30-10:近黑靛蓝背景 60%,深紫灰卡片与留白 30%,电青主色 + 品红点缀合计 ≤10%",
      "电青 #00F0FF 与品红 #FF2EA6 是签名双霓虹,亮度都拉满,不可混入灰调",
      "文字禁纯白:冷白 #F2F2FF 与背景 #0C0C16 对比度约 15:1,发光感强但不刺眼",
      "主按钮 #00F0FF 上用深底字 #061018 而非黑色,保持电光的通透感",
      "点缀 #FF2EA6 集中用在标签角标、状态点、强调线,避免大面积铺色变成刺眼撞色",
    ],
    recipe: [
      "60-30-10: near-black indigo background 60%, deep violet-gray cards and whitespace 30%, cyan primary plus magenta accent ≤10% combined",
      "Electric cyan #00F0FF and magenta #FF2EA6 are the signature neon pair — keep both at full brightness, never desaturate",
      "No pure white text: cool white #F2F2FF gives ~15:1 contrast on #0C0C16 — glow-strong without glare",
      "Use deep-toned text #061018 on the #00F0FF button rather than black, to keep the electric clarity",
      "Keep #FF2EA6 concentrated on badges, status dots and emphasis lines — large fills turn the clash harsh",
    ],
    colors: {
      bg: "#0C0C16",
      surface: "#161626",
      border: "#2C2C46",
      text: "#F2F2FF",
      muted: "#9C9CC0",
      primary: "#00F0FF",
      primaryFg: "#061018",
      accent: "#FF2EA6",
    },
  },
  {
    slug: "sunset",
    name: "Sunset",
    nameZh: "日落暖调",
    group: "vivid",
    aliases: ["日落色", "Sunset", "珊瑚橙暖调", "落日渐变色系"],
    description: "Coral melting into gold — the last hour of a holiday beach before the sun goes down.",
    descriptionZh: "珊瑚橙融进金黄,是假日海滩上太阳落下前的最后一小时。",
    bestFor: "Travel and vacation brands, dining, lifestyle products, summer event pages",
    bestForZh: "旅行 / 度假品牌、餐饮、生活方式产品、夏日活动页",
    promptZh:
      "请用日落暖调(Sunset)配色:整体温暖、渐变感,像假日海滩上黄昏最后一小时的光。背景 #FFF4EC(暖杏白)、卡片 #FFFBF7(近白暖调)、描边 #FFDFC7(浅杏橙);正文 #4A3226(暖棕,不用纯黑)、次要文字 #A07A62;主按钮 #F4633A(珊瑚橙)配暖白字 #FFF8F4;点缀色 #FFC53D(金黄),用于标签、图标和高光数字。珊瑚橙与金黄的暖色渐变是这套配色的签名,要有夕阳融化的松弛感。禁止:冷蓝主导、灰调、深色背景、荧光色、高饱和撞色。",
    promptEn:
      "Use a Sunset palette: warm, gradient-like light, like the last hour of dusk on a holiday beach. Background #FFF4EC (warm apricot-white), cards #FFFBF7 (near-white warm tone), borders #FFDFC7 (pale apricot-orange); body text #4A3226 (warm brown, never pure black), secondary text #A07A62; primary buttons #F4633A (coral orange) with warm-white text #FFF8F4; the accent is #FFC53D (golden yellow), used on tags, icons and highlighted numbers. The coral-to-gold warm gradient is this palette's signature — keep the mood loose, like a melting sunset. Forbidden: cool-blue dominance, gray tones, dark backgrounds, neon/fluorescent colors, high-saturation clashes.",
    recipeZh: [
      "60-30-10:暖杏白背景 60%,近白卡片与留白 30%,珊瑚橙主色 + 金黄点缀合计 ≤10%",
      "珊瑚橙 #F4633A 到金黄 #FFC53D 按暖色相邻过渡,避免中间插入冷色打断渐变感",
      "文字禁纯黑:暖棕 #4A3226 与背景 #FFF4EC 对比度约 8:1,温暖且够读",
      "主按钮 #F4633A 上用暖白 #FFF8F4 而非纯白,延续整体的暖调而非冷白跳脱",
      "点缀 #FFC53D 用于价格、评分、图标高光,一屏 2-3 处,维持夕阳的松弛感而非喧闹",
    ],
    recipe: [
      "60-30-10: warm apricot-white background 60%, near-white cards and whitespace 30%, coral primary plus golden accent ≤10% combined",
      "Let coral #F4633A ease into gold #FFC53D as adjacent warm hues — don't cut in a cool color and break the gradient feel",
      "No pure black text: warm brown #4A3226 gives ~8:1 contrast on #FFF4EC — warm and still legible",
      "Use warm-white #FFF8F4 on the #F4633A button instead of pure white, to keep the warmth unbroken",
      "Reserve #FFC53D for prices, ratings and icon highlights — 2-3 spots per screen keeps the sunset relaxed, not loud",
    ],
    colors: {
      bg: "#FFF4EC",
      surface: "#FFFBF7",
      border: "#FFDFC7",
      text: "#4A3226",
      muted: "#A07A62",
      primary: "#F4633A",
      primaryFg: "#FFF8F4",
      accent: "#FFC53D",
    },
  },
  {
    slug: "pop",
    name: "Pop",
    nameZh: "波普电光",
    group: "vivid",
    aliases: ["波普撞色", "Pop Colors", "电光蓝黄", "蓝黄互补色"],
    description: "Cobalt slamming into bright yellow, pinned down by near-black text — crisp as a sports poster.",
    descriptionZh: "钴蓝对撞明黄,近黑文字压住阵脚,体育海报般干脆。",
    bestFor: "Sports and athletic brands, tech launch pages, recruiting and campus events, streetwear e-commerce",
    bestForZh: "体育 / 运动品牌、科技发布会页、招聘 / 校园活动、潮流电商",
    promptZh:
      "请用波普电光(Pop)配色:整体利落、自信,像体育海报和潮流杂志的排版。背景 #F7F7FB(冷白灰)、卡片 #FFFFFF(纯白)、描边 #E2E2F0(浅灰蓝);正文 #14141A(近黑,不用纯黑)、次要文字 #6E6E85;主按钮 #2456F0(钴蓝)配冷白字 #F5F8FF;点缀色 #FFD400(明黄),用于标签、图标和强调数字。钴蓝与明黄是互补撞色,近黑文字要给足对比,情绪干净利落不暧昧。禁止:粉彩色调、低对比、暖棕色调、超过三种高饱和色相、莫兰迪式雾感。",
    promptEn:
      "Use a Pop (Pop Art) palette: crisp and confident, like sports-poster and streetwear-magazine layout. Background #F7F7FB (cool off-white), cards #FFFFFF (pure white), borders #E2E2F0 (pale gray-blue); body text #14141A (near-black, never pure black), secondary text #6E6E85; primary buttons #2456F0 (cobalt blue) with cool-white text #F5F8FF; the accent is #FFD400 (bright yellow), used on tags, icons and emphasized numbers. Cobalt and yellow form a complementary clash, and the near-black text must carry full contrast — keep the mood sharp, not soft. Forbidden: pastel tones, low contrast, warm brown tones, more than three high-saturation hues, Morandi-style haze.",
    recipeZh: [
      "60-30-10:冷白灰背景 60%,纯白卡片与留白 30%,钴蓝主色 + 明黄点缀合计 ≤10%",
      "钴蓝 #2456F0 与明黄 #FFD400 是互补撞色,只用这两个高饱和色相,不叠加第三种",
      "文字禁纯黑但要够深:近黑 #14141A 与背景 #F7F7FB 对比度约 17:1,干净利落",
      "主按钮 #2456F0 上用冷白 #F5F8FF 而非暖白,保持整体冷色调统一",
      "点缀 #FFD400 用于标签、图标、强调数字,大面积铺色会失去波普的克制感",
    ],
    recipe: [
      "60-30-10: cool off-white background 60%, pure white cards and whitespace 30%, cobalt primary plus yellow accent ≤10% combined",
      "Cobalt #2456F0 and yellow #FFD400 form the complementary clash — use only these two saturated hues, don't stack a third",
      "No pure black text but keep it deep: near-black #14141A gives ~17:1 contrast on #F7F7FB — sharp and clean",
      "Use cool-white #F5F8FF on the #2456F0 button rather than warm white, to keep the whole palette cool-toned",
      "Reserve #FFD400 for tags, icons and emphasized numbers — large fills lose the pop-art restraint",
    ],
    colors: {
      bg: "#F7F7FB",
      surface: "#FFFFFF",
      border: "#E2E2F0",
      text: "#14141A",
      muted: "#6E6E85",
      primary: "#2456F0",
      primaryFg: "#F5F8FF",
      accent: "#FFD400",
    },
  },
];
