// Motion words people already say. An entry may point at a component we ship.
// It never invents an install for a motion we do not have.
//
// The shelf is the overlap of what keeps getting shared and what we can show:
// Motion, Magic UI, Motion Primitives, React Bits (star border, glare, bounce
// cards, and text scramble are already ported here), Number Flow's rolling
// digits, Lenis smooth scroll, and Vaul's dragging sheet. Samples reuse those
// shipped components. A word with no component stays a name and a sample.

export const MOTION_GROUPS = [
  "appear",
  "feedback",
  "text",
  "scroll",
  "loop",
  "change",
  "motionRules",
  "iconMotion",
] as const;

export type MotionGroup = (typeof MOTION_GROUPS)[number];

export type MotionComponent = {
  category: "motion" | "blocks";
  slug: string;
  previewKey?: string;
  installSlug: string;
};

export type MotionEntry = {
  slug: string;
  group: MotionGroup;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  sentence: string;
  sentenceZh: string;
  prompt: string;
  promptZh: string;
  component?: MotionComponent;
  /** One way we ship the idea. The sample on the page stays the plain motion. */
  related?: {
    category: "motion" | "blocks";
    slug: string;
    name: string;
    nameZh: string;
  };
};

export const MOTIONS: readonly MotionEntry[] = [
  {
    slug: "fade",
    group: "appear",
    name: "Fade",
    nameZh: "淡入",
    aliases: ["fade in", "opacity", "渐显"],
    sentence: "Something appears by changing how solid it is.",
    sentenceZh: "东西靠变实在来出现。",
    prompt:
      "Fade the element in with opacity only, on the swift-out curve, and keep it under 300ms. Reduced motion shows the final opacity at once.",
    promptZh:
      "只用透明度做淡入，走疾出曲线，300 毫秒以内。系统要求减少动效时，直接显示最终透明度。",
  },
  {
    slug: "exit",
    group: "appear",
    name: "Exit",
    nameZh: "退出",
    aliases: ["fade out", "leave", "消失"],
    sentence: "Something leaves along the same path it used to arrive.",
    sentenceZh: "东西沿进来的那条路离开。",
    prompt:
      "Exit along the entrance path. A fade uses opacity only. A slide uses a short travel plus opacity. Both use the swift-out curve. Reduced motion drops the travel.",
    promptZh:
      "沿进来的同一条路退出。淡出只用透明度，滑出用短位移加透明度，都走疾出。系统要求减少动效时去掉位移。",
  },
  {
    slug: "slide",
    group: "appear",
    name: "Slide in",
    nameZh: "滑入",
    aliases: ["slide", "enter", "移入"],
    sentence: "Something arrives from a short distance away.",
    sentenceZh: "东西从近处滑到它该在的位置。",
    prompt:
      "Slide the element in with translate and opacity, about 12px of travel, on the swift-out curve. Reduced motion keeps the fade and drops the movement.",
    promptZh:
      "用位移加透明度滑入，路程大约 12 像素，走疾出曲线。系统要求减少动效时保留淡入，去掉位移。",
  },
  {
    slug: "pop-in",
    group: "appear",
    name: "Pop in",
    nameZh: "弹入",
    aliases: ["pop", "scale in", "过冲出现"],
    sentence: "Something arrives a little past its size, then settles.",
    sentenceZh: "东西出现时会稍微过一点，再落回该有的大小。",
    prompt:
      "Pop the element in with scale and opacity, letting it pass full size once before it settles. Reduced motion fades it in at scale 1.",
    promptZh:
      "用缩放加透明度弹入，允许超过完整大小一次再落稳。系统要求减少动效时，以原始大小淡入。",
  },
  {
    slug: "blur-fade",
    group: "appear",
    name: "Blur fade",
    nameZh: "模糊淡入",
    aliases: ["blur in", "soft entrance", "虚化出现"],
    sentence: "Something comes into focus as it becomes solid.",
    sentenceZh: "东西变实的同时，从发虚变得清楚。",
    prompt:
      "Bring the element in with opacity, a short rise, and blur of 8px or less. Reduced motion fades it in with no blur and no movement.",
    promptZh:
      "用透明度、一小段上移和不超过 8 像素的模糊出现。系统要求减少动效时只淡入，不要模糊，也不要位移。",
  },
  {
    slug: "clip-reveal",
    group: "appear",
    name: "Clip reveal",
    nameZh: "裁切显现",
    aliases: ["clip-path reveal", "wipe", "擦出"],
    sentence: "A cover slides away and the content underneath is uncovered.",
    sentenceZh: "遮罩挪开，底下的内容露出来。",
    prompt:
      "Reveal by animating clip-path from covered to open. The content itself stays still. Reduced motion shows it uncovered.",
    promptZh: "用裁切从盖住变成敞开，内容本身不动。系统要求减少动效时直接敞开。",
  },
  {
    slug: "stagger",
    group: "appear",
    name: "Stagger",
    nameZh: "错峰",
    aliases: ["cascade", "staggered entrance", "依次出现"],
    sentence: "Several things start one after another, a short beat apart.",
    sentenceZh: "好几件东西错开一小拍，一个接一个开始。",
    prompt:
      "Stagger a group by starting each item about 60ms after the previous one. The gap is for order, not for hiding the content. Reduced motion shows the whole group at once.",
    promptZh:
      "一组东西错峰出现，后一个比前一个晚大约 60 毫秒。这点间隔只为了排出先后，不要把内容藏太久。系统要求减少动效时，整组一起出现。",
    related: {
      category: "motion",
      slug: "text-animation",
      name: "Text cascade",
      nameZh: "文字瀑布",
    },
  },
  {
    slug: "press",
    group: "feedback",
    name: "Press",
    nameZh: "按压",
    aliases: ["tap feedback", "press scale", "按下"],
    sentence: "A control sinks slightly while a finger is on it.",
    sentenceZh: "手指按着的时候，控件会轻轻陷下去。",
    prompt:
      "Install UI Lab button-base and use Button. The press scale is the spring already in that component.",
    promptZh: "安装 UI Lab 的 button-base，用里面的 Button。按下的缩放用它自带的弹簧。",
    component: {
      category: "motion",
      slug: "button",
      previewKey: "motion/button-base",
      installSlug: "button-base",
    },
  },
  {
    slug: "magnetic",
    group: "feedback",
    name: "Magnetic",
    nameZh: "磁吸",
    aliases: ["magnetic button", "cursor pull", "跟着指针"],
    sentence: "A control leans toward the pointer when it comes close.",
    sentenceZh: "指针靠近时，控件会朝指针那边偏一点。",
    prompt:
      "Install UI Lab button-magnetic and use MagneticButton when the control should lean toward the pointer.",
    promptZh: "控件要跟着指针偏的时候，安装 UI Lab 的 button-magnetic，用 MagneticButton。",
    component: {
      category: "motion",
      slug: "button",
      previewKey: "motion/button-magnetic",
      installSlug: "button-magnetic",
    },
  },
  {
    slug: "tilt",
    group: "feedback",
    name: "Tilt",
    nameZh: "倾斜",
    aliases: ["3d tilt", "perspective tilt", "透视倾斜"],
    sentence: "A card turns in space to follow the pointer.",
    sentenceZh: "卡片随着指针在空间里转一个角度。",
    prompt:
      "Install UI Lab tilt-card and use it for a card that tilts toward the pointer. Keep the tilt on the card, not on the whole page.",
    promptZh: "安装 UI Lab 的 tilt-card，用在要跟着指针倾斜的卡片上。只倾斜这张卡片，不要整页一起转。",
    component: {
      category: "motion",
      slug: "tilt-card",
      previewKey: "motion/tilt-card",
      installSlug: "tilt-card",
    },
  },
  {
    slug: "glare",
    group: "feedback",
    name: "Glare",
    nameZh: "掠光",
    aliases: ["glare hover", "sheen", "扫光"],
    sentence: "A narrow band of light crosses a surface.",
    sentenceZh: "一道窄光从表面扫过去。",
    prompt:
      "Install UI Lab glare-hover and wrap the card. The light band plays when the pointer is over it.",
    promptZh: "安装 UI Lab 的 glare-hover，包住这张卡片。指针在上面时，光带扫过。",
    component: {
      category: "motion",
      slug: "glare-hover",
      previewKey: "motion/glare-hover",
      installSlug: "glare-hover",
    },
  },
  {
    slug: "ripple",
    group: "feedback",
    name: "Ripple",
    nameZh: "涟漪",
    aliases: ["ripple button", "ink", "水波"],
    sentence: "A ring grows from the place that was pressed.",
    sentenceZh: "从按下的那个点长出一圈。",
    prompt:
      "Install UI Lab button-base and set ripple on Button. The ring grows from the press point, and the press scale stays the button's own spring.",
    promptZh:
      "安装 UI Lab 的 button-base，给 Button 打开 ripple。圆环从按下的位置长出，按下的缩放仍用按钮自己的弹簧。",
    component: {
      category: "motion",
      slug: "button",
      installSlug: "button-base",
    },
  },
  {
    slug: "shake",
    group: "feedback",
    name: "Shake",
    nameZh: "错误抖动",
    aliases: ["error shake", "rejected", "校验失败"],
    sentence: "A field jitters once when the input is rejected.",
    sentenceZh: "输入被拒绝时，这一栏左右抖一下。",
    prompt:
      "Install UI Lab input and pass error when validation fails. The field shakes once and then rests. This is a rejection, not an icon wiggle.",
    promptZh:
      "安装 UI Lab 的 input。校验失败时传入 error，输入框抖一下后停住。这是拒绝，不是图标的摆动。",
    component: {
      category: "motion",
      slug: "input",
      previewKey: "motion/input",
      installSlug: "input",
    },
  },
  {
    slug: "swipe-dismiss",
    group: "feedback",
    name: "Swipe to dismiss",
    nameZh: "划走",
    aliases: ["swipe dismiss", "flick away", "滑动关闭"],
    sentence: "A flick carries a panel off screen and closes it.",
    sentenceZh: "轻轻一甩，面板滑出画面并关掉。",
    prompt:
      "Install UI Lab animated-toast-stack. A toast or panel leaves on a fast flick and returns if the flick is too slow. It leaves along the same side it entered.",
    promptZh:
      "安装 UI Lab 的 animated-toast-stack。通知或面板甩得够快就离开，不够快就回到原位。离开的一侧和进来的一侧相同。",
    component: {
      category: "motion",
      slug: "animated-toast-stack",
      previewKey: "motion/animated-toast-stack",
      installSlug: "animated-toast-stack",
    },
  },
  {
    slug: "reorder",
    group: "feedback",
    name: "Drag to reorder",
    nameZh: "拖拽排序",
    aliases: ["reorder", "drag list", "拖着换顺序"],
    sentence: "A grabbed row moves, and the others make a gap for it.",
    sentenceZh: "抓住的那一行跟着走，其余的让出空位。",
    prompt:
      "When a row is dragged, follow the pointer with that row and let the others ease aside with the layout spring. On release it rests in the new order.",
    promptZh:
      "拖动一行时，这一行跟着指针，其余行用布局弹簧让出空位。松手后停在新的顺序上。",
  },
  {
    slug: "rubber-band",
    group: "feedback",
    name: "Rubber-banding",
    nameZh: "橡皮筋",
    aliases: ["overscroll", "rubber band", "拉过边界"],
    sentence: "Pulling past the edge meets resistance, then snaps back.",
    sentenceZh: "拉过边界时越来越沉，松手后弹回去。",
    prompt:
      "Past the edge, movement shrinks as the pull grows. On release, spring back to the edge. Do not stop hard against an invisible wall.",
    promptZh: "拉过边界后，拉得越远，动得越少。松手后弹回边界。不要在边界上突然停死。",
  },
  {
    slug: "hold",
    group: "feedback",
    name: "Hold to confirm",
    nameZh: "按住确认",
    aliases: ["hold to delete", "press and hold", "长按确认"],
    sentence: "A fill completes only while the press is held.",
    sentenceZh: "只有一直按着，确认才会慢慢填满。",
    prompt:
      "While the press is held, fill the confirmation at a constant speed. On release, clear it quickly with the swift-out curve. Keep the press scale separate and small.",
    promptZh:
      "按住期间用匀速把确认填满。松开时用疾出很快退回。按下的缩放另做，并且很小。",
  },
  {
    slug: "check",
    group: "feedback",
    name: "Check draw",
    nameZh: "打勾",
    aliases: ["checkmark", "draw check", "勾上"],
    sentence: "A check draws itself when the choice turns on.",
    sentenceZh: "选中的时候，对勾把自己画出来。",
    prompt: "Install UI Lab checkbox. The check draws in when it turns on, and leaves when it turns off.",
    promptZh: "安装 UI Lab 的 checkbox。勾上时对勾画出来，取消时收回去。",
    component: {
      category: "motion",
      slug: "checkbox",
      previewKey: "motion/checkbox",
      installSlug: "checkbox",
    },
  },
  {
    slug: "thumb",
    group: "feedback",
    name: "Thumb slide",
    nameZh: "滑块",
    aliases: ["switch thumb", "toggle thumb", "开关滑块"],
    sentence: "A thumb slides from one end of a track to the other.",
    sentenceZh: "滑块从轨道这一头滑到那一头。",
    prompt: "Install UI Lab switch. The thumb slides along the track when the value changes.",
    promptZh: "安装 UI Lab 的 switch。值改变时，滑块沿轨道滑到另一头。",
    component: {
      category: "motion",
      slug: "switch",
      previewKey: "motion/switch",
      installSlug: "switch",
    },
  },
  {
    slug: "pull-refresh",
    group: "feedback",
    name: "Pull to refresh",
    nameZh: "下拉刷新",
    aliases: ["pull refresh", "pull down", "下拉更新"],
    sentence: "A pull down the top brings a spinner, then the content settles back.",
    sentenceZh: "从顶上往下拉，转圈出现，然后内容回到原位。",
    prompt:
      "Follow the pull with the content. Show the spinner once the pull passes the threshold, then ease the content back. A short pull returns without refreshing.",
    promptZh: "内容跟着下拉走。拉过阈值才出转圈，然后缓回原位。拉得不够就直接回去，不刷新。",
  },
  {
    slug: "indeterminate",
    group: "feedback",
    name: "Indeterminate",
    nameZh: "来回进度",
    aliases: ["indeterminate progress", "busy bar", "不知道还有多久"],
    sentence: "A short bar travels along the track while the wait has no end yet.",
    sentenceZh: "还不知道要多久，一段短条在轨道上来回走。",
    prompt:
      "Use a short bar that travels the track and repeats. Fill a bar to the end only when the amount finished is known.",
    promptZh: "还不知道完成了多少时，用一段短条在轨道上走并重复。知道进度时，才让整条填到尽头。",
  },
  {
    slug: "text-reveal",
    group: "text",
    name: "Text reveal",
    nameZh: "文字显现",
    aliases: ["text animate", "word reveal", "逐词出现"],
    sentence: "Words arrive one after another.",
    sentenceZh: "词一个接一个出现。",
    prompt:
      "Install UI Lab text-reveal and use TextReveal. Split by word for a sentence, by character for a short label.",
    promptZh: "安装 UI Lab 的 text-reveal，用 TextReveal。一句话按词拆，很短的标签按字拆。",
    component: {
      category: "motion",
      slug: "text-animation",
      previewKey: "motion/text-reveal",
      installSlug: "text-reveal",
    },
  },
  {
    slug: "text-shimmer",
    group: "text",
    name: "Text shimmer",
    nameZh: "文字扫光",
    aliases: ["shiny text", "loading text", "微光"],
    sentence: "A light sweeps across the letters.",
    sentenceZh: "一道光从字上扫过。",
    prompt:
      "Install UI Lab text-shimmer and use TextShimmer for a loading or emphasized line.",
    promptZh: "安装 UI Lab 的 text-shimmer，用 TextShimmer 做加载中或需要被看见的一行字。",
    component: {
      category: "motion",
      slug: "text-animation",
      previewKey: "motion/text-shimmer",
      installSlug: "text-shimmer",
    },
  },
  {
    slug: "text-scramble",
    group: "text",
    name: "Text scramble",
    nameZh: "乱序文字",
    aliases: ["decrypted text", "hyper text", "字符解码"],
    sentence: "Letters shuffle, then settle into the real word.",
    sentenceZh: "字母先乱跳，再落成要读的那个词。",
    prompt:
      "Install UI Lab text-scramble and use TextScramble. Play it when the text changes or when it enters view.",
    promptZh: "安装 UI Lab 的 text-scramble，用 TextScramble。文字改变时，或进入画面时，再播一次。",
    component: {
      category: "motion",
      slug: "text-scramble",
      previewKey: "motion/text-scramble",
      installSlug: "text-scramble",
    },
  },
  {
    slug: "number-ticker",
    group: "text",
    name: "Number ticker",
    nameZh: "数字跳动",
    aliases: ["rolling digits", "odometer", "滚轮数字"],
    sentence: "Each digit rolls into its new place.",
    sentenceZh: "每一位数字滚到新的位置。",
    prompt:
      "Install UI Lab number-ticker and use NumberTicker when each digit should roll. Use tabular numbers so the width stays still.",
    promptZh:
      "每一位要滚动时，安装 UI Lab 的 number-ticker，用 NumberTicker。数字用等宽，宽度才不会跟着跳。",
    component: {
      category: "motion",
      slug: "number",
      previewKey: "motion/number-ticker",
      installSlug: "number-ticker",
    },
  },
  {
    slug: "count-up",
    group: "text",
    name: "Count up",
    nameZh: "数字递增",
    aliases: ["animated number", "count-up", "数到"],
    sentence: "A value counts from where it was to where it is.",
    sentenceZh: "一个数从旧值数到新值。",
    prompt:
      "Install UI Lab animated-number and use AnimatedNumber when the value should count up as one number. For rolling digits, use number-ticker.",
    promptZh:
      "整个数要往上数时，安装 UI Lab 的 animated-number，用 AnimatedNumber。要每一位分开滚，用 number-ticker。",
    component: {
      category: "motion",
      slug: "number",
      previewKey: "motion/animated-number",
      installSlug: "animated-number",
    },
  },
  {
    slug: "text-cascade",
    group: "text",
    name: "Text cascade",
    nameZh: "逐字换",
    aliases: ["letter cascade", "slot text", "字母掉落"],
    sentence: "Old letters drop away as the new ones land.",
    sentenceZh: "旧字母掉下去，新字母落上来。",
    prompt:
      "Install UI Lab text-cascade and use TextCascade when a word changes letter by letter.",
    promptZh: "一个词要逐个字母换成新词时，安装 UI Lab 的 text-cascade，用 TextCascade。",
    component: {
      category: "motion",
      slug: "text-animation",
      previewKey: "motion/text-cascade",
      installSlug: "text-cascade",
    },
  },
  {
    slug: "typewriter",
    group: "text",
    name: "Typewriter",
    nameZh: "打字机",
    aliases: ["type on", "character by character", "逐字打出"],
    sentence: "Letters appear one at a time, as if they are being typed.",
    sentenceZh: "字一个一个出现，像正在被打出来。",
    prompt:
      "Reveal a short generated line one character at a time. Keep body copy that is already written fully visible.",
    promptZh: "正在生成的短句按一个字一个字出现。已经写好的正文直接显示全文。",
  },
  {
    slug: "word-rotate",
    group: "text",
    name: "Word rotate",
    nameZh: "轮换",
    aliases: ["rotating words", "word cycle", "换词"],
    sentence: "One word slot shows the next word by sliding it into place.",
    sentenceZh: "同一个词位滑出旧词，滑进下一个词。",
    prompt:
      "Keep one word slot. Slide the next whole word into it. Letters that scramble or drop one by one are a different motion.",
    promptZh: "留一个词位，整个词滑进去换成下一个。逐字乱跳或逐字掉落是另外的动效。",
  },
  {
    slug: "parallax",
    group: "scroll",
    name: "Parallax",
    nameZh: "视差",
    aliases: ["parallax scrolling", "视差滚动", "景深"],
    sentence: "A background drifts slower than the words in front of it.",
    sentenceZh: "背景比前面的字移动得更慢。",
    prompt:
      "Install UI Lab parallax and move only the decorative layer. Leave the heading and the actions in normal flow, and keep a static layer under reduced motion.",
    promptZh:
      "安装 UI Lab 的 parallax，只移动装饰层。标题和按钮留在正常排版里。系统要求减少动效时，这层保持不动。",
    component: {
      category: "motion",
      slug: "scroll-animation",
      previewKey: "motion/parallax",
      installSlug: "parallax",
    },
  },
  {
    slug: "scroll-reveal",
    group: "scroll",
    name: "Scroll reveal",
    nameZh: "滚动显现",
    aliases: ["reveal on scroll", "fade-in-up", "进入视口"],
    sentence: "A block appears as it comes into view.",
    sentenceZh: "一块内容进入视线时才出现。",
    prompt:
      "Install UI Lab scroll-reveal and wrap each block that should appear as it enters. Reduced motion keeps a fade.",
    promptZh:
      "安装 UI Lab 的 scroll-reveal，包住每一块要在进入视线时出现的内容。系统要求减少动效时保留淡入。",
    component: {
      category: "motion",
      slug: "scroll-animation",
      previewKey: "motion/scroll-reveal",
      installSlug: "scroll-reveal",
    },
  },
  {
    slug: "scroll-progress",
    group: "scroll",
    name: "Scroll progress",
    nameZh: "滚动进度",
    aliases: ["reading progress", "阅读进度", "进度条"],
    sentence: "A thin bar shows how far the reading has gone.",
    sentenceZh: "一条细线告诉你这篇已经读到哪里。",
    prompt:
      "Install UI Lab scroll-progress and tie the bar to the reading container. Grow it with scaleX from the left edge.",
    promptZh: "安装 UI Lab 的 scroll-progress，让细条跟着这篇的滚动容器走。从左边缘用 scaleX 变长。",
    component: {
      category: "motion",
      slug: "scroll-animation",
      previewKey: "motion/scroll-progress",
      installSlug: "scroll-progress",
    },
  },
  {
    slug: "smooth-scroll",
    group: "scroll",
    name: "Smooth scroll",
    nameZh: "平滑滚动",
    aliases: ["lenis", "momentum scroll", "顺滑滚动"],
    sentence: "The page eases along instead of jumping with the wheel.",
    sentenceZh: "页面跟着滚轮缓缓走，而不是一下跳一截。",
    prompt:
      "Install UI Lab smooth-scroll and wrap the page in its provider. Reduced motion uses the browser's own scroll.",
    promptZh:
      "安装 UI Lab 的 smooth-scroll，用它的 provider 包住页面。系统要求减少动效时，用浏览器自己的滚动。",
    component: {
      category: "motion",
      slug: "scroll-animation",
      previewKey: "motion/smooth-scroll",
      installSlug: "smooth-scroll",
    },
  },
  {
    slug: "pinned",
    group: "scroll",
    name: "Pinned",
    nameZh: "钉住",
    aliases: ["sticky", "pin", "吸顶"],
    sentence: "A title stays while the notes beside it move on.",
    sentenceZh: "标题留在原处，旁边的说明继续往下走。",
    prompt:
      "Pin the title with position: sticky and a clear top offset inside its own section. Let the notes scroll past it, and stack the columns on a narrow screen.",
    promptZh:
      "标题用 position: sticky，并在它所在的这一段里写明 top。说明从它旁边滚过去。窄屏改成上下排列。",
  },
  {
    slug: "stacking",
    group: "scroll",
    name: "Stacking cards",
    nameZh: "叠卡",
    aliases: ["sticky stack", "层叠卡片", "卡片堆叠"],
    sentence: "Cards catch up and sit on top of one another.",
    sentenceZh: "后面的卡片追上来，叠在前面的卡片上。",
    prompt:
      "Stack the cards with position: sticky and a slightly larger top on each next card, so every card leaves a visible edge.",
    promptZh: "卡片用 position: sticky，后一张的 top 比前一张多一截，让每一张都露出一条边。",
  },
  {
    slug: "snap",
    group: "scroll",
    name: "Scroll snap",
    nameZh: "吸附",
    aliases: ["scroll snap", "paginated", "整屏停住"],
    sentence: "A scroll comes to rest on one whole panel.",
    sentenceZh: "滚动会停在一整块面板上。",
    prompt:
      "Use scroll-snap-type: y mandatory on the local container, and scroll-snap-align: start on each panel. Keep the snap inside that container.",
    promptZh:
      "局部容器用 scroll-snap-type: y mandatory，每一块用 scroll-snap-align: start。吸附留在这个容器里。",
  },
  {
    slug: "horizontal",
    group: "scroll",
    name: "Horizontal scroll",
    nameZh: "横向滚动",
    aliases: ["side scroll", "horizontal gallery", "横滑"],
    sentence: "A row moves sideways while the page itself stays put.",
    sentenceZh: "这一排往旁边走，页面本身还在原处。",
    prompt:
      "Put the sideways movement in its own row. Let several items stay visible, and keep the page scrolling vertically.",
    promptZh: "横向移动放在它自己的这一排里，同时能看见好几项。页面仍是上下滚动。",
  },
  {
    slug: "zoom",
    group: "scroll",
    name: "Scroll zoom",
    nameZh: "滚动缩放",
    aliases: ["ken burns", "zoom on scroll", "越滚越大"],
    sentence: "An image grows as the reading moves past it.",
    sentenceZh: "读着往下走，画面跟着变大。",
    prompt:
      "Scale only the image as its section moves through view. Keep the caption still, and stop the zoom under reduced motion.",
    promptZh: "只放大那张图，字幕留在原处。系统要求减少动效时停止放大。",
  },
  {
    slug: "scroll-hint",
    group: "scroll",
    name: "Scroll hint",
    nameZh: "滚动提示",
    aliases: ["scroll cue", "more below", "下面还有"],
    sentence: "A small mark keeps pointing downward so the reader knows there is more.",
    sentenceZh: "一个小标记一直往下指，告诉人下面还有。",
    prompt: "Install UI Lab scroll-hint and place it at the foot of a hero. It loops until the reader moves on.",
    promptZh: "安装 UI Lab 的 scroll-hint，放在首屏底下。它一直循环，直到读者往下走。",
    component: {
      category: "motion",
      slug: "scroll-hint",
      previewKey: "motion/scroll-hint",
      installSlug: "scroll-hint",
    },
  },
  {
    slug: "marquee",
    group: "loop",
    name: "Marquee",
    nameZh: "走马灯",
    aliases: ["infinite slider", "ticker tape", "跑马灯"],
    sentence: "A row of items keeps sliding, and the end joins the start.",
    sentenceZh: "一排东西一直滑，尾接上了头。",
    prompt:
      "Install UI Lab marquee and use Marquee for a row that should loop. Pause it when the pointer is over it.",
    promptZh: "一排内容要循环滑下去时，安装 UI Lab 的 marquee，用 Marquee。指针放上去时暂停。",
    component: {
      category: "motion",
      slug: "marquee",
      previewKey: "motion/marquee",
      installSlug: "marquee",
    },
  },
  {
    slug: "star-border",
    group: "loop",
    name: "Border light",
    nameZh: "流光边",
    aliases: ["star border", "border beam", "边框光"],
    sentence: "A point of light travels around a border.",
    sentenceZh: "一个光点沿着边框走。",
    prompt: "Install UI Lab star-border and wrap the control with StarBorder.",
    promptZh: "安装 UI Lab 的 star-border，用 StarBorder 包住这个控件。",
    component: {
      category: "motion",
      slug: "star-border",
      previewKey: "motion/star-border",
      installSlug: "star-border",
    },
  },
  {
    slug: "bounce-cards",
    group: "loop",
    name: "Bounce cards",
    nameZh: "弹开卡片",
    aliases: ["bounce cards", "fan cards", "扇开"],
    sentence: "A stack of cards springs open into a fan.",
    sentenceZh: "一叠卡片弹开，变成一把扇子。",
    prompt:
      "Install UI Lab bounce-cards and use BounceCards when a stack should spring open into a fan as it enters.",
    promptZh: "一叠卡片进入画面时要弹开成扇形，安装 UI Lab 的 bounce-cards，用 BounceCards。",
    component: {
      category: "motion",
      slug: "bounce-cards",
      previewKey: "motion/bounce-cards",
      installSlug: "bounce-cards",
    },
  },
  {
    slug: "magnify",
    group: "loop",
    name: "Magnify",
    nameZh: "靠近放大",
    aliases: ["dock magnification", "hover grow", "指针放大"],
    sentence: "The item nearest the pointer grows, and the others make room.",
    sentenceZh: "离指针最近的那一项变大，旁边的让出位置。",
    prompt:
      "Grow the item closest to the pointer and let the neighbors ease aside with the layout spring. Reduced motion keeps every item at its resting size.",
    promptZh:
      "离指针最近的一项放大，旁边的项用布局弹簧让开。系统要求减少动效时，每一项都停在原来的大小。",
  },
  {
    slug: "skeleton",
    group: "loop",
    name: "Skeleton",
    nameZh: "骨架闪动",
    aliases: ["shimmer", "placeholder", "加载占位"],
    sentence: "A placeholder block waits with a light moving across it.",
    sentenceZh: "内容还没到，占位块上有一道光在走。",
    prompt:
      "Install UI Lab skeleton and use it while content is still loading. Reduced motion replaces the sweep with a calm opacity pulse.",
    promptZh:
      "安装 UI Lab 的 skeleton，内容还没到时用它。系统要求减少动效时，扫光改成平静的透明度脉冲。",
    component: {
      category: "motion",
      slug: "skeleton",
      previewKey: "motion/skeleton",
      installSlug: "skeleton",
    },
  },
  {
    slug: "spinner",
    group: "loop",
    name: "Spinner",
    nameZh: "转圈",
    aliases: ["loading spinner", "activity indicator", "加载中"],
    sentence: "A mark turns while work is still going.",
    sentenceZh: "事情还在进行，标记一直转。",
    prompt: "Install UI Lab loader and use the spinner variant while a request is in flight.",
    promptZh: "安装 UI Lab 的 loader，请求还没回来时用它的 spinner。",
    component: {
      category: "motion",
      slug: "loader",
      previewKey: "motion/loader",
      installSlug: "loader",
    },
  },
  {
    slug: "carousel",
    group: "loop",
    name: "Carousel",
    nameZh: "轮播",
    aliases: ["slider", "slideshow", "一张张换"],
    sentence: "One item fills the frame, then the next item takes its place.",
    sentenceZh: "框里一次放一项，然后换成下一项。",
    prompt:
      "Advance one item at a time until it rests in the frame. A row that never stops is a marquee.",
    promptZh: "一次推进一项，并在框里停住。一直不停滑过去的是走马灯。",
    related: {
      category: "motion",
      slug: "cylinder-carousel",
      name: "Cylinder carousel",
      nameZh: "圆柱轮播",
    },
  },
  {
    slug: "orbit",
    group: "loop",
    name: "Orbit",
    nameZh: "环绕",
    aliases: ["orbiting", "circle around", "绕圈"],
    sentence: "A mark travels in a circle around a center.",
    sentenceZh: "一个标记绕着中心转圈。",
    prompt: "Move the mark on a circular path at a constant speed. Keep the center still.",
    promptZh: "标记沿圆周匀速走，中心留在原处。",
  },
  {
    slug: "float",
    group: "loop",
    name: "Float",
    nameZh: "浮动",
    aliases: ["bob", "levitate", "轻轻浮着"],
    sentence: "Something drifts up and down without going anywhere.",
    sentenceZh: "东西轻轻上下浮，并不离开这处。",
    prompt: "Drift a few pixels up and down on a repeating ease-in-out. Keep it off controls people use all day.",
    promptZh: "用缓入缓出上下浮几个像素并重复。一天要点很多次的控件不要加这个。",
  },
  {
    slug: "confetti",
    group: "loop",
    name: "Confetti",
    nameZh: "彩纸",
    aliases: ["celebration", "confetti burst", "撒花"],
    sentence: "Small pieces fall and tumble after a success.",
    sentenceZh: "做成一件事之后，碎纸掉下来并翻滚。",
    prompt: "Play a short fall of a few pieces after a rare success, then stop. Do not loop it on an everyday screen.",
    promptZh: "少见的成功之后，让几片碎纸落下并翻滚，然后停。日常页面不要一直循环。",
  },
  {
    slug: "beam",
    group: "loop",
    name: "Beam",
    nameZh: "光束",
    aliases: ["animated beam", "light trail", "两点之间的光"],
    sentence: "A light travels from one point to another.",
    sentenceZh: "一道光从一个点走到另一个点。",
    prompt: "Run a short bright segment along the line that joins the two points, then repeat.",
    promptZh: "让一小段亮光沿着连接两点的线走，然后重复。",
  },
  {
    slug: "spotlight",
    group: "loop",
    name: "Spotlight",
    nameZh: "追光",
    aliases: ["pointer light", "radial glow", "光跟着走"],
    sentence: "A pool of light moves across a dark surface.",
    sentenceZh: "一团光在深色表面上移动。",
    prompt: "Move a soft radial light across the surface. Leave the content underneath still.",
    promptZh: "让一团柔和的圆光在表面上移动，底下的内容不动。",
  },
  {
    slug: "progressive-blur",
    group: "loop",
    name: "Progressive blur",
    nameZh: "边缘模糊",
    aliases: ["gradient blur", "fade blur", "一边清楚一边糊"],
    sentence: "One edge of a surface is sharp and the other edge dissolves into blur.",
    sentenceZh: "一边清楚，另一边逐渐糊掉。",
    prompt: "Blur only toward the edge that meets other content. Keep the part being read sharp.",
    promptZh: "只在和别的内容相接的那一边逐渐模糊。正在读的部分保持清楚。",
  },
  {
    slug: "shared-layout",
    group: "change",
    name: "Shared layout",
    nameZh: "共享位移",
    aliases: ["layout animation", "glide", "指示块滑动"],
    sentence: "A highlight travels from the old choice to the new one.",
    sentenceZh: "高亮从旧选项滑到新选项。",
    prompt:
      "Install UI Lab shared-layout-bg and use one shared pill for the moving highlight. For tabs, install tabs; the indicator uses the same layout spring.",
    promptZh:
      "安装 UI Lab 的 shared-layout-bg，用同一块胶囊做滑动的高亮。选项卡安装 tabs，指示条用的是同一档布局弹簧。",
    component: {
      category: "motion",
      slug: "shared-layout-bg",
      previewKey: "motion/shared-layout-bg",
      installSlug: "shared-layout-bg",
    },
  },
  {
    slug: "morph",
    group: "change",
    name: "Morph",
    nameZh: "变形",
    aliases: ["morphing", "shape change", "形变"],
    sentence: "One shape turns into the next without being replaced.",
    sentenceZh: "一个形状变成下一个，中间没有被换掉。",
    prompt:
      "Morph by animating the same element from one size and corner radius to the next. Keep the content crossfading inside it.",
    promptZh: "变形时改的是同一个元素的大小和圆角。里面的内容用交叉淡化换掉。",
    related: {
      category: "motion",
      slug: "morphing-modal",
      name: "Morphing modal",
      nameZh: "变形弹窗",
    },
  },
  {
    slug: "crossfade",
    group: "change",
    name: "Crossfade",
    nameZh: "交叉淡化",
    aliases: ["cross fade", "dissolve", "叠化"],
    sentence: "The old layer fades out while the new one fades in, in the same place.",
    sentenceZh: "旧的一层变淡，新的一层在同一处变实。",
    prompt:
      "Crossfade two layers in the same spot: one opacity falls while the other rises. Keep both layers still.",
    promptZh: "两层待在同一处，一层透明度下降，另一层同时上升。两层都不要挪位。",
  },
  {
    slug: "origin-aware",
    group: "change",
    name: "Origin-aware",
    nameZh: "从触发点长出",
    aliases: ["transform origin", "from trigger", "从按钮长出"],
    sentence: "A popover grows from the control that opened it.",
    sentenceZh: "浮层从打开它的那个控件长出来。",
    prompt:
      "Install UI Lab dropdown-menu. The panel grows from the trigger's corner. A dialog stays centered on the screen.",
    promptZh:
      "安装 UI Lab 的 dropdown-menu。面板从触发它的那个角长出来。对话框仍留在画面中央。",
    component: {
      category: "motion",
      slug: "dropdown-menu",
      previewKey: "motion/dropdown-menu",
      installSlug: "dropdown-menu",
    },
  },
  {
    slug: "shared-element",
    group: "change",
    name: "Shared element",
    nameZh: "共享元素",
    aliases: ["hero transition", "card expand", "同一张展开"],
    sentence: "One surface travels from a thumbnail into the detail.",
    sentenceZh: "同一块表面从缩略处走到详情。",
    prompt:
      "Install UI Lab expanding-card. The same card grows from its place into the detail, and shrinks back there on close.",
    promptZh: "安装 UI Lab 的 expanding-card。同一张卡片从原位展开成详情，关掉时缩回原处。",
    component: {
      category: "motion",
      slug: "expanding-card",
      previewKey: "motion/expanding-card",
      installSlug: "expanding-card",
    },
  },
  {
    slug: "direction",
    group: "change",
    name: "Direction-aware",
    nameZh: "方向过渡",
    aliases: ["directional transition", "forward and back", "来回不同向"],
    sentence: "Forward travel leaves one way, and back travel arrives from the other.",
    sentenceZh: "往前走时从一侧离开，返回时从另一侧进来。",
    prompt:
      "Slide forward content off one side, and bring back content in from the opposite side, so the trip has a direction.",
    promptZh: "前进时内容从一侧滑走，返回时从相反的一侧进来，让这次移动有方向。",
    related: {
      category: "blocks",
      slug: "step-form",
      name: "Step form",
      nameZh: "分步表单",
    },
  },
  {
    slug: "page-transition",
    group: "change",
    name: "Page transition",
    nameZh: "页面过渡",
    aliases: ["route transition", "page change", "换页"],
    sentence: "The old page leaves and the next page comes in.",
    sentenceZh: "旧页面离开，下一页进来。",
    prompt:
      "When navigating, let the old page leave and the next page enter from the opposite side. Keep the travel short and use the swift-out curve.",
    promptZh: "换页时旧页面离开，下一页从相反一侧进来。路程短，走疾出。",
  },
  {
    slug: "view-transition",
    group: "change",
    name: "View transition",
    nameZh: "视图过渡",
    aliases: ["view transitions", "shared state morph", "同一视图变形"],
    sentence: "The browser connects the before and after of one view.",
    sentenceZh: "切换前后的同一块被连在一起。",
    prompt:
      "Use a view transition to connect the same element before and after a state change. Keep the element recognizable across the change.",
    promptZh: "状态切换时用视图过渡把前后的同一块连起来，让人认得这还是它。",
    related: {
      category: "motion",
      slug: "theme-toggle",
      name: "Theme toggle",
      nameZh: "主题切换",
    },
  },
  {
    slug: "swap",
    group: "change",
    name: "Swap",
    nameZh: "换位",
    aliases: ["content swap", "blur swap", "内容替换"],
    sentence: "The old label leaves as the new one takes its place.",
    sentenceZh: "旧文案离开，新文案占上这个位置。",
    prompt:
      "Install UI Lab action-swap-blur and use ActionSwapText for a label that changes in place. Letter-by-letter uses action-swap-cascade. A roll from below uses action-swap-roll.",
    promptZh:
      "文案要在原地换掉时，安装 UI Lab 的 action-swap-blur，用 ActionSwapText。要逐个字母换，用 action-swap-cascade。要从下面滚上来，用 action-swap-roll。",
    component: {
      category: "motion",
      slug: "action-swap",
      previewKey: "motion/action-swap-blur",
      installSlug: "action-swap-blur",
    },
  },
  {
    slug: "expand",
    group: "change",
    name: "Expand",
    nameZh: "弹性展开",
    aliases: ["accordion", "collapse", "高度展开"],
    sentence: "A section opens its height and the rest move to make room.",
    sentenceZh: "一块区域把高度打开，其余的让出位置。",
    prompt:
      "Install UI Lab bouncy-accordion and use BouncyAccordion when one section opens and the rows around it move with it.",
    promptZh:
      "一块要打开、周围的行也跟着让位时，安装 UI Lab 的 bouncy-accordion，用 BouncyAccordion。",
    component: {
      category: "motion",
      slug: "bouncy-accordion",
      previewKey: "motion/bouncy-accordion",
      installSlug: "bouncy-accordion",
    },
  },
  {
    slug: "inertia",
    group: "change",
    name: "Inertia drag",
    nameZh: "惯性拖拽",
    aliases: ["vaul", "sheet drag", "拖拽跟手"],
    sentence: "A panel follows the finger, then coasts to a rest.",
    sentenceZh: "面板跟着手指走，松手后还会滑一段再停下。",
    prompt:
      "Install UI Lab bottom-sheet and use it for a panel that follows the drag and settles on a snap point.",
    promptZh: "面板要跟着拖拽走、再停在吸附点上时，安装 UI Lab 的 bottom-sheet，用它。",
    component: {
      category: "motion",
      slug: "bottom-sheet",
      previewKey: "motion/bottom-sheet",
      installSlug: "bottom-sheet",
    },
  },
  {
    slug: "drawer-slide",
    group: "change",
    name: "Drawer slide",
    nameZh: "侧滑",
    aliases: ["side drawer", "slide over", "从旁边滑入"],
    sentence: "A panel slides in from the side and covers part of the page.",
    sentenceZh: "一块面板从旁边滑入，盖住页面的一部分。",
    prompt:
      "Install UI Lab drawer. The panel slides in from the side on the drawer curve and leaves the same way.",
    promptZh: "安装 UI Lab 的 drawer。面板从旁边沿抽屉曲线滑入，并沿同一边离开。",
    component: {
      category: "motion",
      slug: "drawer",
      previewKey: "motion/drawer",
      installSlug: "drawer",
    },
  },
  {
    slug: "compare",
    group: "change",
    name: "Before / after",
    nameZh: "对比滑杆",
    aliases: ["comparison slider", "wipe compare", "前后对比"],
    sentence: "A divider wipes between two layers stacked in the same frame.",
    sentenceZh: "一道分隔线在同一框里的两层之间来回擦。",
    prompt:
      "Stack the two images and move one clip from side to side with the divider. The images stay still.",
    promptZh: "两张图叠在一起，只移动裁切和那道分隔线。图本身不动。",
  },
  {
    slug: "flip",
    group: "change",
    name: "Flip",
    nameZh: "翻转",
    aliases: ["card flip", "rotate y", "翻面"],
    sentence: "A card turns over and shows its other face.",
    sentenceZh: "卡片翻过去，露出另一面。",
    prompt: "Turn the card on its vertical axis so the front hides and the back arrives. Keep both faces the same size.",
    promptZh: "绕竖直轴把卡片翻过去，正面让开，背面到达。两面一样大。",
  },
  {
    slug: "insert",
    group: "change",
    name: "Insert",
    nameZh: "插入补位",
    aliases: ["list insert", "auto animate", "新的一项挤进来"],
    sentence: "A new row appears and the rows around it move to make room.",
    sentenceZh: "新的一行出现，旁边的行让出位置。",
    prompt:
      "When a row is added or removed, move the surrounding rows to their new places with the layout spring. The new row fades in.",
    promptZh: "增加或去掉一行时，周围的行用布局弹簧走到新位置。新的一行淡入。",
  },
  {
    slug: "ease-out",
    group: "motionRules",
    name: "Ease out",
    nameZh: "缓出",
    aliases: ["ease-out", "swift out", "快出慢停"],
    sentence: "It starts fast and arrives slowly.",
    sentenceZh: "起步快，停下来的时候慢。",
    prompt:
      "Use the swift-out curve for something entering, opening, or answering a pointer. It starts fast and settles slowly.",
    promptZh: "进场、展开、回应指针时用疾出曲线。起步快，收尾慢。",
  },
  {
    slug: "ease-in-out",
    group: "motionRules",
    name: "Ease in-out",
    nameZh: "缓入缓出",
    aliases: ["ease-in-out", "push-pull", "两头慢"],
    sentence: "It leaves slowly, crosses quickly, and arrives slowly.",
    sentenceZh: "离开时慢，中间快，到达时又慢。",
    prompt:
      "Use the push-pull curve when something already on screen travels from one place to another.",
    promptZh: "已经在画面上的东西，从一处走到另一处时，用推拉曲线。",
  },
  {
    slug: "spring",
    group: "motionRules",
    name: "Spring",
    nameZh: "弹簧",
    aliases: ["spring physics", "overshoot", "回弹"],
    sentence: "It moves like it has weight, and may pass the target once.",
    sentenceZh: "它带着重量走，有时会超过目标再回来。",
    prompt:
      "Use a spring when the motion can be interrupted or should settle with weight. Press uses the button spring. A moving highlight uses the layout spring.",
    promptZh:
      "动效可能被打断，或需要有重量地停住时，用弹簧。按压用按钮那一档。高亮滑动用布局那一档。",
  },
  {
    slug: "draw",
    group: "iconMotion",
    name: "Draw",
    nameZh: "描边",
    aliases: ["line draw", "draw-on", "画出来"],
    sentence: "A stroke draws itself.",
    sentenceZh: "线条把自己画出来。",
    prompt:
      "Install UI Lab animated-icon and use AnimatedIcon with variant draw. The stroke draws itself with pathLength.",
    promptZh:
      "安装 UI Lab 的 animated-icon，用 AnimatedIcon，variant 设为 draw。描边用 pathLength 把自己画出来。",
    component: {
      category: "motion",
      slug: "animated-icon",
      previewKey: "motion/animated-icon",
      installSlug: "animated-icon",
    },
  },
  {
    slug: "wiggle",
    group: "iconMotion",
    name: "Wiggle",
    nameZh: "摆动",
    aliases: ["shake", "wobble", "摇一下"],
    sentence: "An icon shakes once from side to side.",
    sentenceZh: "图标左右摇一下。",
    prompt:
      "Install UI Lab animated-icon and use AnimatedIcon with variant wiggle for a notification icon.",
    promptZh: "通知图标要摇一下时，安装 UI Lab 的 animated-icon，用 AnimatedIcon，variant 设为 wiggle。",
    component: {
      category: "motion",
      slug: "animated-icon",
      previewKey: "motion/animated-icon",
      installSlug: "animated-icon",
    },
  },
  {
    slug: "spin",
    group: "iconMotion",
    name: "Spin",
    nameZh: "旋转",
    aliases: ["rotate", "refresh spin", "转一圈"],
    sentence: "An icon turns one full circle.",
    sentenceZh: "图标转一整圈。",
    prompt:
      "Install UI Lab animated-icon and use AnimatedIcon with variant spin for refresh or sync.",
    promptZh: "刷新或同步要转一圈时，安装 UI Lab 的 animated-icon，用 AnimatedIcon，variant 设为 spin。",
    component: {
      category: "motion",
      slug: "animated-icon",
      previewKey: "motion/animated-icon",
      installSlug: "animated-icon",
    },
  },
  {
    slug: "pulse",
    group: "iconMotion",
    name: "Pulse",
    nameZh: "脉动",
    aliases: ["heartbeat", "throb", "轻轻胀"],
    sentence: "An icon gently grows and shrinks while it waits.",
    sentenceZh: "图标在等待时轻轻变大再变小。",
    prompt:
      "Install UI Lab animated-icon and use AnimatedIcon with variant pulse for a live or waiting status.",
    promptZh:
      "在线或等待中的状态要轻轻胀缩时，安装 UI Lab 的 animated-icon，用 AnimatedIcon，variant 设为 pulse。",
    component: {
      category: "motion",
      slug: "animated-icon",
      installSlug: "animated-icon",
    },
  },
];

export function findMotion(slug: string) {
  return MOTIONS.find((entry) => entry.slug === slug);
}
