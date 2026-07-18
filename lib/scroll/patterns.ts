import type { ScrollPatternEntry } from "./types";

/**
 * Source of truth for the Scroll module. Entries stay in teaching order: from
 * gentle depth cues to increasingly structural scroll choreography.
 */
export const SCROLL_PATTERNS: ScrollPatternEntry[] = [
  {
    slug: "parallax",
    name: "Parallax",
    nameZh: "视差",
    aliases: ["视差滚动", "景深", "parallax scrolling"],
    whenUse: "Give a hero or cover image a restrained sense of depth without moving the reading layer.",
    whenUseZh: "用于 hero 或封面制造克制的景深，同时让正文阅读层保持稳定。",
    recipe: `const containerRef = useRef<HTMLDivElement>(null);
const reducedMotion = useReducedMotion();
const { scrollYProgress } = useScroll({ container: containerRef });
const backgroundY = useTransform(
  scrollYProgress,
  [0, 1],
  ["0%", "30%"],
);

return (
  <motion.div style={reducedMotion ? undefined : { y: backgroundY }} />
);`,
    promptZh:
      "请使用克制的视差滚动（Parallax Scrolling）：只让 hero 的装饰背景层以约前景 0.35 倍的速度反向位移，标题、按钮和正文保持在正常文档流；桌面端位移幅度控制在容器高度的 30% 内，并为 reduced-motion 与移动端提供静态背景。\n\nFORBIDDEN：整页所有元素都做视差、正文跟着漂移、超过 30% 的大幅位移、移动端强制开启、用缩放或 blur 伪装景深导致眩晕。",
    promptEn:
      "Use restrained parallax scrolling: move only the hero's decorative background layer against the scroll at roughly 0.35x the foreground speed, while headings, actions, and body copy remain in normal flow. Cap desktop travel at 30% of the container height and provide a static background for reduced motion and mobile.\n\nFORBIDDEN: page-wide parallax, drifting body copy, travel beyond 30%, forced motion on mobile, or fake depth made from aggressive scaling and blur.",
  },
  {
    slug: "pinned",
    name: "Pinned",
    nameZh: "钉住",
    aliases: ["粘性定位", "吸顶", "sticky", "pin"],
    whenUse: "Keep a chapter title or reference visual present while its supporting content passes beside it.",
    whenUseZh: "让章节标题或参考图常驻，同时相关说明在旁边或下方逐段滚过。",
    recipe: `.chapter {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 2rem;
}

.chapter-title {
  position: sticky;
  top: 1rem;
  align-self: start;
}`,
    promptZh:
      "请使用钉住式章节（Pinned / Sticky Section）：把章节标题面板放在双列布局左侧，用 position: sticky 和明确的 top 偏移固定在局部滚动容器顶部；右侧内容保持正常文档流，滚过标题后再自然释放，移动端改为上下布局。\n\nFORBIDDEN：用 fixed 脱离局部容器、整页永久吸顶、左右两列都钉住、隐藏正文滚动条、移动端保留拥挤双列。",
    promptEn:
      "Use a pinned / sticky chapter: place the chapter title panel in the left column and pin it to the top of its local scroll container with position: sticky and an explicit top offset. Let the supporting content stay in normal flow and release the title naturally at the section end; stack the columns on mobile.\n\nFORBIDDEN: fixed positioning that escapes the local container, permanent page-level pinning, pinning both columns, hiding the content scrollbar, or preserving a cramped two-column layout on mobile.",
  },
  {
    slug: "reveal",
    name: "Scroll Reveal",
    nameZh: "逐段揭示",
    aliases: ["滚动淡入", "进入视口动画", "reveal on scroll", "fade-in-up"],
    whenUse: "Pace a long page by revealing each section as it enters the reader's local viewport.",
    whenUseZh: "用于长页逐段呈现，让读者滚到哪里就看到哪里，而不是一次塞满视野。",
    recipe: `const containerRef = useRef<HTMLDivElement>(null);
const reducedMotion = useReducedMotion();

<motion.section
  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
  viewport={{ root: containerRef, amount: 0.4, once: false }}
  transition={{ duration: 0.24, ease: EASE_OUT }}
/>`,
    promptZh:
      "请使用逐段揭示（Scroll Reveal / Fade-in-up）：每个内容块进入它所属滚动容器约 40% 可见区域时，从 opacity 0、translateY(16px) 在 240ms 内落到原位；离开后允许再次触发，reduced-motion 时直接显示最终态。\n\nFORBIDDEN：监听整个 window、超过 20px 的飞入、同时使用 blur/旋转/弹跳、长串延迟导致内容不可读、reduced-motion 下仍保留位移。",
    promptEn:
      "Use scroll reveal / fade-in-up: when each content block becomes roughly 40% visible inside its own scroll container, animate from opacity 0 and translateY(16px) to rest in 240ms. Allow it to replay after leaving, and show the final state immediately under reduced motion.\n\nFORBIDDEN: observing the window, fly-ins over 20px, combining blur/rotation/bounce, long stagger delays that withhold content, or keeping displacement under reduced motion.",
  },
  {
    slug: "progress",
    name: "Scroll Progress",
    nameZh: "滚动进度",
    aliases: ["阅读进度", "进度条", "scroll progress", "reading indicator"],
    whenUse: "Show readers how much of a long article, document, or contained flow remains.",
    whenUseZh: "用于长文、文档或局部流程，持续告诉读者已经读到哪里、还剩多少。",
    recipe: `const containerRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ container: containerRef });

<motion.div
  style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
  className="h-1"
/>`,
    promptZh:
      "请添加局部滚动进度（Scroll Progress / Reading Indicator）：在阅读容器顶部放一条 3–4px 的细进度条，以容器自身的 scrollYProgress 驱动 scaleX 0→1，并把 transform-origin 固定在 left；进度条保持可见但不遮正文。\n\nFORBIDDEN：绑定 window 进度、用 width 触发布局重排、显示虚假百分比、把进度条做成抢眼的大色块、到达底部前提前填满。",
    promptEn:
      "Add local scroll progress / a reading indicator: place a 3–4px hairline bar at the top of the reading container, drive scaleX from 0 to 1 with that container's own scrollYProgress, and keep transform-origin on the left. Keep it visible without covering the copy.\n\nFORBIDDEN: binding to window progress, animating width and causing layout work, fake percentages, oversized attention-grabbing bars, or filling before the reader reaches the end.",
  },
  {
    slug: "horizontal",
    name: "Horizontal Scroll",
    nameZh: "横向滚动",
    aliases: ["横滚", "卧式画廊", "horizontal scroll", "scroll-jacking gallery"],
    whenUse: "Turn a portfolio, timeline, or sequence of steps into a deliberate sideways narrative.",
    whenUseZh: "用于作品集、时间线或步骤序列，把纵向滚动转换成有节奏的横向叙事。",
    recipe: `const containerRef = useRef<HTMLDivElement>(null);
const reducedMotion = useReducedMotion();
const { scrollYProgress } = useScroll({ container: containerRef });
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

<div ref={containerRef} className="h-[380px] overflow-y-auto">
  <div className="h-[1000px]">
    <div className={reducedMotion ? "sticky top-0 overflow-x-auto" : "sticky top-0 overflow-hidden"}>
      <motion.div
        style={reducedMotion ? undefined : { x }}
        className="flex w-max"
      />
    </div>
  </div>
</div>`,
    promptZh:
      "请使用纵滚驱动横滚（Horizontal Scroll Gallery）：在一个有明确高度的局部滚动容器中，把画廊视口 sticky 在顶部，用容器自身 0→1 的纵向进度将卡片轨道从 x=0 映射到约 -62%；首尾卡必须完整可达，reduced-motion 时退化为原生横向滚动。\n\nFORBIDDEN：劫持整页滚动、吞掉触控板横向手势、让正文一起横移、首尾卡被裁掉、reduced-motion 下继续自动横移。",
    promptEn:
      "Use a vertical-driven horizontal scroll gallery: inside a local scroll container with explicit height, keep the gallery viewport sticky at the top and map that container's 0→1 vertical progress from x=0% to about -62%. Keep the first and last cards fully reachable, and fall back to native horizontal scrolling under reduced motion.\n\nFORBIDDEN: hijacking page scroll, swallowing trackpad horizontal gestures, moving body copy sideways, clipping the first or last card, or preserving automatic sideways travel under reduced motion.",
  },
  {
    slug: "snap",
    name: "Scroll Snap",
    nameZh: "吸附滚动",
    aliases: ["分页吸附", "整屏翻页", "scroll snap", "paginated"],
    whenUse: "Give a short product story or presentation-like sequence one decisive panel per gesture.",
    whenUseZh: "用于短篇产品故事或演示式序列，让一次滚动手势稳定落在一个完整面板。",
    recipe: `.viewport {
  height: 380px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
}

.panel {
  min-height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}`,
    promptZh:
      "请使用纵向吸附滚动（Scroll Snap / Paginated Panels）：局部容器设为 scroll-snap-type: y mandatory，每个面板至少占满容器高度并以 scroll-snap-align: start 对齐；使用 overscroll-behavior: contain，把吸附限制在该设备画框内。\n\nFORBIDDEN：把 body 设为 mandatory snap、面板高度不一致导致半截停留、隐藏滚动条、嵌套多层强制吸附、用 JavaScript 反复纠正原生滚动。",
    promptEn:
      "Use vertical scroll snap / paginated panels: set a local container to scroll-snap-type: y mandatory, make every panel at least one container-height tall, and align each with scroll-snap-align: start. Add overscroll-behavior: contain so snapping remains inside the device frame.\n\nFORBIDDEN: mandatory snap on the body, inconsistent panel heights that stop halfway, hidden scrollbars, nested mandatory snap regions, or JavaScript that repeatedly fights native scrolling.",
  },
  {
    slug: "zoom",
    name: "Scroll Zoom",
    nameZh: "缩放入场",
    aliases: ["缩放揭示", "焦点放大", "zoom on scroll", "scale-in"],
    whenUse: "Bring one key visual or product moment into focus as it reaches the center of a story.",
    whenUseZh: "让关键视觉或产品时刻在抵达叙事中心时获得焦点，适合单个重点内容登场。",
    recipe: `const containerRef = useRef<HTMLDivElement>(null);
const targetRef = useRef<HTMLDivElement>(null);
const reducedMotion = useReducedMotion();
const { scrollYProgress } = useScroll({
  container: containerRef,
  target: targetRef,
  offset: ["start end", "center center"],
});
const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

return (
  <div ref={containerRef} className="h-[380px] overflow-y-auto">
    <motion.div
      ref={targetRef}
      style={reducedMotion ? { scale: 1, opacity: 1 } : { scale, opacity }}
    />
  </div>
);`,
    promptZh:
      "请使用缩放入场（Scroll Zoom / Scale-in）：当主卡从局部滚动容器底部进入并靠近中心时，将 scale 从 0.86 映射到 1、opacity 从 0.4 映射到 1；缩放中心稳定，周围内容不位移，reduced-motion 直接显示 scale 1。\n\nFORBIDDEN：绑定页面滚动、放大超过 1、透视旋转、同时大幅 blur、缩放引发布局跳动、reduced-motion 下保留缩放。",
    promptEn:
      "Use scroll zoom / scale-in: as the primary card enters from the bottom of its local scroll container and approaches center, map scale from 0.86 to 1 and opacity from 0.4 to 1. Keep the transform origin stable, do not displace surrounding content, and render at scale 1 under reduced motion.\n\nFORBIDDEN: binding to page scroll, scaling beyond 1, perspective rotation, heavy simultaneous blur, layout shifts caused by scaling, or retained zoom under reduced motion.",
  },
  {
    slug: "stacking",
    name: "Stacking Cards",
    nameZh: "叠层卡片",
    aliases: ["层叠卡片", "卡片堆叠", "stacking cards", "sticky stack"],
    whenUse: "Close a card-led story by letting successive ideas collect into one visible stack.",
    whenUseZh: "用于卡片式叙事的收束，让连续观点逐张覆盖并最终汇成一个可见卡组。",
    recipe: `.stack-card {
  position: sticky;
  top: calc(1rem + var(--index) * 1.25rem);
  transform: scale(calc(1 - var(--index) * 0.018));
  transform-origin: top center;
}

@media (prefers-reduced-motion: reduce) {
  .stack-card { transform: none; }
}

/* Give each card enough trailing space for the next card to catch it. */`,
    promptZh:
      "请使用叠层卡片（Stacking Cards / Sticky Stack）：四张卡依次放在正常文档流中，每张用 position: sticky，并让 top 按索引递增约 20px，形成清晰露边；越靠下的卡只做约 1.8% 的轻微缩放下压，最后自然释放整组。\n\nFORBIDDEN：所有卡使用同一个 top 完全遮死、fixed 定位、超过 5% 的缩放、卡片永久留在页面上、用高强度阴影制造脏乱层级。",
    promptEn:
      "Use stacking cards / a sticky stack: keep four cards in normal flow, make each position: sticky, and increase top by about 20px per index so every layer leaves a readable edge. Compress later cards by only about 1.8%, then let the complete stack release naturally at the end.\n\nFORBIDDEN: identical top values that fully hide earlier cards, fixed positioning, scaling over 5%, cards that remain pinned to the page forever, or heavy shadows that muddy the layers.",
  },
];
