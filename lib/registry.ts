export type ComponentExample = {
  slug: string;
  name: string;
  description?: string;
  /** Chinese display name. Falls back to `name` when absent. */
  nameZh?: string;
  /** Chinese description. Falls back to `description` when absent. */
  descriptionZh?: string;
  /** Optional install slug for variants that have their own registry command. */
  installSlug?: string;
  /** Source file shown under Source tab. */
  file: string;
  /** Key into the previews registry (e.g. "motion/button-base"). */
  previewKey: string;
  /** Path to the preview file used for the Usage tab. */
  previewFile: string;
};

export type ComponentEntry = {
  slug: string;
  name: string;
  description: string;
  /** Chinese display name. Falls back to `name` when absent. */
  nameZh?: string;
  /** Chinese description. Falls back to `description` when absent. */
  descriptionZh?: string;
  file: string;
  badge?: "new";
  /** ISO date the component shipped. Drives newest-first order in the landing
   * "Recently launched" section. Set it when adding a "new" component. */
  launchedAt?: string;
  /** Optional hand-tuned SEO keywords, merged on top of generated ones. */
  keywords?: string[];
  /** Extra source files bundled under this slug (e.g. multi-file components). */
  extraFiles?: string[];
  /** Per-variant breakdown rendered as separate Preview / Usage / Source on the page. */
  examples?: ComponentExample[];
};

export type CategoryEntry = {
  slug: string;
  name: string;
  description: string;
  /** Chinese display name. Falls back to `name` when absent. */
  nameZh?: string;
  /** Chinese description. Falls back to `description` when absent. */
  descriptionZh?: string;
  components: ComponentEntry[];
};

export const registry: CategoryEntry[] = [
  {
    slug: "motion",
    name: "Components",
    nameZh: "组件",
    description: "Motion primitives with shadcn-compatible registry endpoints.",
    descriptionZh: "兼容 shadcn 注册表规范的动效基础组件。",
    components: [
      {
        slug: "tilt-card",
        name: "Tilt Card",
        nameZh: "3D 倾斜卡片",
        description: "3D perspective tilt on hover with cursor-tracked glare.",
        descriptionZh: "悬停时呈现 3D 透视倾斜效果,并带有跟随光标的高光。",
        file: "components/motion/tilt-card.tsx",
      },
      {
        slug: "button",
        name: "Button",
        nameZh: "按钮",
        description: "Spring-pressed Button plus StatefulButton (idle → loading → success / error) and MagneticButton.",
        descriptionZh: "带弹簧按压反馈的按钮,还包含状态按钮 StatefulButton(空闲 → 加载中 → 成功 / 失败)与磁吸按钮 MagneticButton。",
        file: "components/motion/button/index.tsx",
        extraFiles: [
          "components/motion/button/base.tsx",
          "components/motion/button/stateful.tsx",
          "components/motion/button/magnetic.tsx",
        ],
        examples: [
          {
            slug: "base",
            name: "Button",
            nameZh: "基础按钮",
            description: "Press scale, hover lift, variants and sizes.",
            descriptionZh: "按压缩放、悬停上浮,支持多种样式与尺寸。",
            installSlug: "button-base",
            file: "components/motion/button/base.tsx",
            previewKey: "motion/button-base",
            previewFile: "components/previews/motion/button-base.preview.tsx",
          },
          {
            slug: "stateful",
            name: "Stateful Button",
            nameZh: "状态按钮",
            description: "Idle → loading → success / error with blur-swap slots and morphing width.",
            descriptionZh: "空闲 → 加载中 → 成功 / 失败状态切换,内容以模糊过渡方式替换,宽度随之变形。",
            installSlug: "button-stateful",
            file: "components/motion/button/stateful.tsx",
            previewKey: "motion/button-stateful",
            previewFile: "components/previews/motion/button-stateful.preview.tsx",
          },
          {
            slug: "magnetic",
            name: "Magnetic Button",
            nameZh: "磁吸按钮",
            description: "Button composed with the Magnetic wrapper for cursor-attracted pull.",
            descriptionZh: "由 Magnetic 包裹组成的按钮,能被光标吸引产生跟随位移。",
            installSlug: "button-magnetic",
            file: "components/motion/button/magnetic.tsx",
            previewKey: "motion/button-magnetic",
            previewFile: "components/previews/motion/button-magnetic.preview.tsx",
          },
        ],
      },
      {
        slug: "marquee",
        name: "Marquee",
        nameZh: "跑马灯",
        description: "Infinite horizontal or vertical scroll with pause-on-hover.",
        descriptionZh: "支持水平或垂直方向的无限滚动,悬停时暂停。",
        file: "components/motion/marquee.tsx",
      },
      {
        slug: "tabs",
        name: "Tabs",
        nameZh: "选项卡",
        description: "Pill, segment or underline tabs with a spring layoutId indicator.",
        descriptionZh: "胶囊、分段或下划线样式的选项卡,配合 layoutId 实现弹簧动效的指示条切换。",
        file: "components/motion/tabs.tsx",
      },
      {
        slug: "switch",
        name: "Switch",
        nameZh: "开关",
        description: "Toggle with a spring-driven thumb and press feedback.",
        descriptionZh: "带弹簧驱动滑块与按压反馈的切换开关。",
        file: "components/motion/switch.tsx",
      },
      {
        slug: "input",
        name: "Input",
        nameZh: "输入框",
        description: "Text input with label, left/right icons, error shake and success check draw.",
        descriptionZh: "带标签、左右图标的文本输入框,支持错误抖动提示与成功状态的对勾绘制动画。",
        file: "components/motion/input.tsx",
        keywords: [
          "react animated input",
          "input error shake",
          "floating label input",
          "react form input animation",
          "animated text field",
        ],
      },
      {
        slug: "select",
        name: "Select",
        nameZh: "下拉选择器",
        description: "Composable select primitives whose panel bouncily unfolds out of the trigger and separates, plus a Morph variant where the trigger grows into the panel via shared layout.",
        descriptionZh: "可组合的下拉选择器,面板以弹性动画从触发器展开并分离,另提供 Morph 变体,通过共享布局让触发器直接生长为面板。",
        file: "components/motion/select.tsx",
        badge: "new",
        launchedAt: "2026-06-28",
        examples: [
          {
            slug: "default",
            name: "Select",
            nameZh: "标准下拉选择器",
            description: "Composable primitives (Select, SelectTrigger, SelectValue, SelectContent, SelectItem); the panel pinches off the trigger and separates, with staggered items. Position-aware (opens upward when needed).",
            descriptionZh: "由 Select、SelectTrigger、SelectValue、SelectContent、SelectItem 组成的可组合原语;面板从触发器上「掐断」分离,选项依次错落展开。可感知位置,必要时向上打开。",
            installSlug: "select",
            file: "components/motion/select.tsx",
            previewKey: "motion/select",
            previewFile: "components/previews/motion/select.preview.tsx",
          },
          {
            slug: "morph",
            name: "Morph Select",
            nameZh: "变形下拉选择器",
            description: "Composable primitives (MorphSelect, MorphSelectTrigger, MorphSelectValue, MorphSelectContent, MorphSelectItem) where the trigger morphs into the panel via a shared layoutId — one continuous surface that grows open and shrinks back, never detaching.",
            descriptionZh: "由 MorphSelect、MorphSelectTrigger、MorphSelectValue、MorphSelectContent、MorphSelectItem 组成;触发器通过共享 layoutId 直接变形为面板——始终是同一整块表面,展开与收起都不会分离。",
            installSlug: "select-morph",
            file: "components/motion/select-morph.tsx",
            previewKey: "motion/select-morph",
            previewFile: "components/previews/motion/select-morph.preview.tsx",
          },
        ],
      },
      {
        slug: "checkbox",
        name: "Checkbox",
        nameZh: "复选框",
        description:
          "Form choice control with a draw-on checkmark, spring press feedback and indeterminate state support.",
        descriptionZh:
          "表单选择控件,支持对勾绘制动画、弹簧按压反馈以及不确定(indeterminate)状态。",
        file: "components/motion/checkbox.tsx",
        badge: "new",
        launchedAt: "2026-06-23",
      },
      {
        slug: "radio",
        name: "Radio Group",
        nameZh: "单选组",
        description:
          "Single-select choice control with a gliding layoutId indicator dot and spring press feedback.",
        descriptionZh:
          "单选控件,指示圆点通过 layoutId 平滑滑动定位,并带有弹簧按压反馈。",
        file: "components/motion/radio.tsx",
        badge: "new",
        launchedAt: "2026-06-23",
      },
      {
        slug: "bottom-sheet",
        name: "Bottom Sheet",
        nameZh: "底部弹出面板",
        description: "Vaul-inspired draggable bottom sheet with snap points, inertia and glass surface.",
        descriptionZh: "参考 Vaul 设计的可拖拽底部面板,支持吸附点、惯性滑动与毛玻璃质感表面。",
        file: "components/motion/bottom-sheet.tsx",
      },
      {
        slug: "shared-layout-bg",
        name: "Shared Layout Background",
        nameZh: "共享布局背景块",
        description: "A pill that glides between hovered items via motion's shared layout, with blur enter/exit.",
        descriptionZh: "借助 Framer Motion 的共享布局,让一枚胶囊背景块在悬停项之间平滑滑动,进出场带模糊过渡。",
        file: "components/motion/shared-layout-bg.tsx",
      },
      {
        slug: "preview-rail",
        name: "Preview Rail",
        nameZh: "预览导航栏",
        description: "Codex app-inspired navigation rail with compact ticks that form a hover pyramid and reveal a floating destination preview.",
        descriptionZh: "参考 Codex 应用设计的导航栏,紧凑刻度在悬停时呈金字塔状展开,并浮现目标页面的预览。",
        file: "components/motion/preview-rail.tsx",
        badge: "new",
        launchedAt: "2026-07-11",
        keywords: [
          "codex app navigation",
          "codex style navigation",
          "openai codex navigation",
          "codex navigation react",
          "preview rail",
          "navigation rail",
          "hover navigation",
          "navigation preview",
          "vertical navigation react",
          "horizontal navigation react",
        ],
      },
      {
        slug: "dock",
        name: "Dock",
        nameZh: "Dock 程序坞",
        description: "macOS-style dock with grouped actions and a gliding active pill.",
        descriptionZh: "macOS 风格的程序坞,操作项分组排列,配合滑动的高亮胶囊标记当前项。",
        file: "components/motion/dock.tsx",
      },
      {
        slug: "tooltip",
        name: "Tooltip",
        nameZh: "文字提示 / Tooltip",
        description: "Hover or focus tooltip with blur enter/exit and spring spawn.",
        descriptionZh: "悬停或聚焦触发的文字提示,进出场带模糊过渡与弹簧生成动画。",
        file: "components/motion/tooltip.tsx",
      },
      {
        slug: "popover",
        name: "Popover",
        nameZh: "气泡浮层",
        description:
          "Gooey popover whose panel oozes out of the trigger through an SVG goo filter — a liquid neck that stretches and pinches — with crisp content fading in on top, plus a Morph variant that clip-morphs open from the trigger corner. Click or hover trigger, controlled or uncontrolled.",
        descriptionZh:
          "粘性气泡浮层,面板通过 SVG 果冻滤镜(goo filter)从触发器中渗出——如液态颈部先拉伸后收缩,清晰内容随后淡入;另提供 Morph 变体,面板从触发器一角以裁剪动画展开。支持点击或悬停触发,可受控也可非受控。",
        file: "components/motion/popover.tsx",
        badge: "new",
        launchedAt: "2026-07-07",
        keywords: [
          "react popover",
          "gooey popover",
          "animated popover",
          "svg goo filter",
          "metaball popover",
          "hover popover react",
          "morph popover react",
          "dropdown menu react",
        ],
        examples: [
          {
            slug: "gooey",
            name: "Gooey Popover",
            nameZh: "果冻气泡浮层",
            description:
              "Composable Popover, PopoverTrigger, PopoverContent; the panel oozes out of the trigger through an SVG goo filter with a liquid neck, crisp content fading in on top. Click or hover, controlled or uncontrolled.",
            descriptionZh:
              "由 Popover、PopoverTrigger、PopoverContent 组成的可组合原语;面板通过 SVG 果冻滤镜从触发器中渗出,呈液态颈部效果,清晰内容随后淡入。支持点击或悬停触发,可受控也可非受控。",
            installSlug: "popover",
            file: "components/motion/popover.tsx",
            previewKey: "motion/popover",
            previewFile: "components/previews/motion/popover.preview.tsx",
          },
          {
            slug: "morph",
            name: "Morph Popover",
            nameZh: "变形气泡浮层",
            description:
              "Composable MorphPopover, MorphPopoverTrigger, MorphPopoverContent; the panel is laid out full size but clipped to the corner nearest the trigger, then unclips as one piece — a single-surface morph with a drop-shadow that hugs the shape. Side/align aware, controlled or uncontrolled.",
            descriptionZh:
              "由 MorphPopover、MorphPopoverTrigger、MorphPopoverContent 组成;面板始终按完整尺寸布局,但被裁剪固定在离触发器最近的一角,再整体展开为一整块表面,阴影随形状贴合。支持感知方位对齐,可受控也可非受控。",
            installSlug: "popover-morph",
            file: "components/motion/popover-morph.tsx",
            previewKey: "motion/popover-morph",
            previewFile: "components/previews/motion/popover-morph.preview.tsx",
          },
        ],
      },
      {
        slug: "morphing-modal",
        name: "Morphing Modal",
        nameZh: "变形弹窗",
        description: "Family-app-style modal. A single panel that morphs its height as you navigate between inner views, with blur cross-fade on content.",
        descriptionZh: "类似 Family App 风格的弹窗。单一面板会随内部视图切换而变形高度,内容以模糊交叉淡化过渡。",
        file: "components/motion/morphing-modal.tsx",
      },
      {
        slug: "text-animation",
        name: "Text Animation",
        nameZh: "文字动效",
        description: "Animated text primitives for reveal sequences, shimmer loading states and letter-cascade swaps.",
        descriptionZh: "一组文字动效原语,涵盖逐字揭示、加载态微光扫过与字母级瀑布切换。",
        file: "components/motion/text-reveal.tsx",
        extraFiles: [
          "components/motion/text-shimmer.tsx",
          "components/motion/text-cascade.tsx",
        ],
        examples: [
          {
            slug: "reveal",
            name: "Text Reveal",
            nameZh: "文字揭示",
            description: "Word or character reveal with spring slide-up and blur.",
            descriptionZh: "按词或按字揭示文字,配合弹簧上滑与模糊过渡。",
            installSlug: "text-reveal",
            file: "components/motion/text-reveal.tsx",
            previewKey: "motion/text-reveal",
            previewFile: "components/previews/motion/text-reveal.preview.tsx",
          },
          {
            slug: "shimmer",
            name: "Text Shimmer",
            nameZh: "文字微光",
            description: "Gradient sweep across text for loading or emphasis.",
            descriptionZh: "渐变光效在文字上扫过,用于加载态或强调效果。",
            installSlug: "text-shimmer",
            file: "components/motion/text-shimmer.tsx",
            previewKey: "motion/text-shimmer",
            previewFile: "components/previews/motion/text-shimmer.preview.tsx",
          },
          {
            slug: "cascade",
            name: "Text Cascade",
            nameZh: "文字瀑布流",
            description: "Letter-by-letter slot roll for standalone text — old letters drop away as new ones land, left to right.",
            descriptionZh: "独立文字的逐字符老虎机式滚动切换——旧字母依次掉落,新字母从左到右落位。",
            installSlug: "text-cascade",
            file: "components/motion/text-cascade.tsx",
            previewKey: "motion/text-cascade",
            previewFile: "components/previews/motion/text-cascade.preview.tsx",
          },
        ],
      },
      {
        slug: "number",
        name: "Number Animation",
        nameZh: "数字动效",
        description: "Animated number primitives for count-up values and rolling digit tickers.",
        descriptionZh: "一组数字动效原语,涵盖数值递增计数与滚轮式数字翻转。",
        file: "components/motion/animated-number.tsx",
        extraFiles: ["components/motion/number-ticker.tsx"],
        examples: [
          {
            slug: "ticker",
            name: "Number Ticker",
            nameZh: "数字翻转器",
            description: "Slot-machine rolling digits with staggered entry.",
            descriptionZh: "老虎机式滚动数字,各位数依次错落进场。",
            installSlug: "number-ticker",
            file: "components/motion/number-ticker.tsx",
            previewKey: "motion/number-ticker",
            previewFile: "components/previews/motion/number-ticker.preview.tsx",
          },
          {
            slug: "animated",
            name: "Animated Number",
            nameZh: "数字递增动画",
            description: "Spring-driven count-up triggered when in view.",
            descriptionZh: "进入视口时触发的弹簧驱动数值递增动画。",
            installSlug: "animated-number",
            file: "components/motion/animated-number.tsx",
            previewKey: "motion/animated-number",
            previewFile: "components/previews/motion/animated-number.preview.tsx",
          },
        ],
      },
      {
        slug: "animated-badge",
        name: "Animated Badge",
        nameZh: "动效徽标",
        description: "Status badge with animated state icons, pulse feedback and compact size variants.",
        descriptionZh: "状态徽标,图标随状态变化播放动画,带脉冲反馈,并提供紧凑尺寸变体。",
        file: "components/motion/animated-badge.tsx",
      },
      {
        slug: "action-swap",
        name: "Action Swap",
        nameZh: "操作切换器",
        description: "CTA button and slot primitives for swapping text and icons with blur motion.",
        descriptionZh: "用于按钮文字与图标切换的 CTA 按钮及插槽原语,切换时带模糊过渡动效。",
        file: "components/motion/action-swap.tsx",
        examples: [
          {
            slug: "cascade",
            name: "Cascade",
            nameZh: "瀑布流切换",
            description: "Letter-by-letter slot roll — the old label's letters drop away as the new ones land, left to right.",
            descriptionZh: "逐字符老虎机式滚动切换——旧文案的字母依次掉落,新字母从左到右落位。",
            installSlug: "action-swap-cascade",
            file: "components/motion/action-swap-cascade.tsx",
            previewKey: "motion/action-swap-cascade",
            previewFile: "components/previews/motion/action-swap-cascade.preview.tsx",
          },
          {
            slug: "blur",
            name: "Blur",
            nameZh: "模糊切换",
            description: "Copy-button style swap with blur, opacity and scale.",
            descriptionZh: "类似复制按钮的切换效果,结合模糊、透明度与缩放变化。",
            installSlug: "action-swap-blur",
            file: "components/motion/action-swap-blur.tsx",
            previewKey: "motion/action-swap-blur",
            previewFile: "components/previews/motion/action-swap-blur.preview.tsx",
          },
          {
            slug: "roll",
            name: "Roll",
            nameZh: "滚动切换",
            description: "The next text or icon rolls in from below with blur.",
            descriptionZh: "新的文字或图标从下方带模糊滚入。",
            installSlug: "action-swap-roll",
            file: "components/motion/action-swap-roll.tsx",
            previewKey: "motion/action-swap-roll",
            previewFile: "components/previews/motion/action-swap-roll.preview.tsx",
          },
        ],
      },
      {
        slug: "animated-toast-stack",
        name: "Animated Toast Stack",
        nameZh: "动效消息通知栈",
        description: "Stacked toasts with status morphs, swipe dismissal, actions and layout-aware motion.",
        descriptionZh: "堆叠式消息通知,支持状态变形、滑动关闭、操作按钮以及感知布局的动效。",
        file: "components/motion/animated-toast-stack.tsx",
      },
      {
        slug: "theme-toggle",
        name: "Theme Toggle",
        nameZh: "主题切换按钮",
        description: "Theme toggle button with a full-page rectangle clip-path reveal via the View Transition API.",
        descriptionZh: "主题切换按钮,借助 View Transition API 以全屏矩形裁剪路径展开切换效果。",
        file: "components/motion/theme-toggle.tsx",
      },
      {
        slug: "bouncy-accordion",
        name: "Bouncy Accordion",
        nameZh: "弹性手风琴",
        description: "Single-open accordion with weighted spring layout, icon rows and reduced-motion-safe content reveals.",
        descriptionZh: "单项展开的手风琴组件,采用带权重的弹簧布局与图标行,内容展开对「减少动效」偏好友好。",
        file: "components/motion/bouncy-accordion.tsx",
      },
      {
        slug: "drawer",
        name: "Drawer",
        nameZh: "抽屉面板",
        description: "Side panel that slides in from the left or right with a spring, backdrop blur, body scroll lock and esc-to-close.",
        descriptionZh: "从左侧或右侧弹簧滑入的侧边面板,带背景模糊、页面滚动锁定,支持 Esc 键关闭。",
        file: "components/motion/drawer.tsx",
      },
      {
        slug: "scroll-animation",
        name: "Scroll Animation",
        nameZh: "滚动动效",
        description: "Scroll-driven motion: a Lenis smooth-scroll provider and a reading-progress indicator that reads from it.",
        descriptionZh: "由滚动驱动的动效:基于 Lenis 的平滑滚动 Provider,以及读取其状态的阅读进度指示器。",
        file: "components/motion/smooth-scroll.tsx",
        extraFiles: [
          "components/motion/scroll-progress.tsx",
          "components/motion/parallax.tsx",
          "components/motion/scroll-to.tsx",
          "components/motion/scroll-reveal.tsx",
        ],
        keywords: [
          "smooth scroll",
          "lenis",
          "scroll progress",
          "reading progress",
          "momentum scroll",
          "scroll velocity",
        ],
        examples: [
          {
            slug: "smooth-scroll",
            name: "Smooth Scroll",
            nameZh: "平滑滚动",
            description: "Smooth-scroll provider over Lenis with a useSmoothScroll hook exposing scroll offset, progress and velocity. Reduced-motion safe.",
            descriptionZh: "基于 Lenis 的平滑滚动 Provider,提供 useSmoothScroll hook 暴露滚动偏移、进度与速度。对「减少动效」偏好友好。",
            installSlug: "smooth-scroll",
            file: "components/motion/smooth-scroll.tsx",
            previewKey: "motion/smooth-scroll",
            previewFile: "components/previews/motion/smooth-scroll.preview.tsx",
          },
          {
            slug: "scroll-progress",
            name: "Scroll Progress",
            nameZh: "滚动进度条",
            description: "Reading-progress indicator — fixed bar or circular ring — driven by scroll position via useSmoothScroll, with spring smoothing.",
            descriptionZh: "阅读进度指示器——固定条形或环形样式——通过 useSmoothScroll 读取滚动位置驱动,并带弹簧平滑处理。",
            installSlug: "scroll-progress",
            file: "components/motion/scroll-progress.tsx",
            previewKey: "motion/scroll-progress",
            previewFile: "components/previews/motion/scroll-progress.preview.tsx",
          },
          {
            slug: "parallax",
            name: "Parallax",
            nameZh: "视差滚动",
            description: "Wrapper that drifts its children at a speed factor as they cross the viewport, on either axis. Reduced-motion safe.",
            descriptionZh: "包裹组件,子元素随进入视口的过程按设定速度因子偏移,支持任意轴向。对「减少动效」偏好友好。",
            installSlug: "parallax",
            file: "components/motion/parallax.tsx",
            previewKey: "motion/parallax",
            previewFile: "components/previews/motion/parallax.preview.tsx",
          },
          {
            slug: "scroll-to",
            name: "Scroll To",
            nameZh: "滚动至指定位置",
            description: "Button that smooth-scrolls to a target (offset, selector or element) via the active SmoothScroll provider; reduced-motion jumps instantly.",
            descriptionZh: "点击后通过当前 SmoothScroll Provider 平滑滚动到目标位置(偏移量、选择器或元素);「减少动效」偏好下直接跳转。",
            installSlug: "scroll-to",
            file: "components/motion/scroll-to.tsx",
            previewKey: "motion/scroll-to",
            previewFile: "components/previews/motion/scroll-to.preview.tsx",
          },
          {
            slug: "scroll-reveal",
            name: "Scroll Reveal",
            nameZh: "滚动揭示",
            description: "Reveals its children with a spring slide and blur as they enter the viewport, once or every time. Reduced-motion keeps a fade.",
            descriptionZh: "子元素进入视口时以弹簧滑动加模糊效果揭示,可设置只触发一次或每次都触发。「减少动效」偏好下保留淡入效果。",
            installSlug: "scroll-reveal",
            file: "components/motion/scroll-reveal.tsx",
            previewKey: "motion/scroll-reveal",
            previewFile: "components/previews/motion/scroll-reveal.preview.tsx",
          },
        ],
      },
      {
        slug: "range-slider",
        name: "Range Slider",
        nameZh: "范围滑块",
        description: "Range slider with tick dots and a bouncy vertical-bar thumb that glides between snapped steps; drag and keyboard control, reduced-motion safe.",
        descriptionZh: "带刻度点的范围滑块,弹性竖条滑块在吸附步进间平滑滑动;支持拖拽与键盘操作,对「减少动效」偏好友好。",
        file: "components/motion/range-slider.tsx",
        badge: "new",
        launchedAt: "2026-06-24",
        keywords: ["slider", "range slider", "range input", "stepped slider", "ticks"],
      },
      {
        slug: "wheel-picker",
        name: "Wheel Picker",
        nameZh: "滚轮选择器",
        description: "iOS-style picker wheel: a 3D drum on native momentum scroll that snaps to the nearest notch, with wheel, drag and keyboard control. Composes side by side for date and time pickers, reduced-motion safe.",
        descriptionZh: "iOS 风格的滚轮选择器:基于原生惯性滚动的 3D 转筒,自动吸附至最近刻度,支持滚轮、拖拽与键盘操作。可并排组合成日期与时间选择器,对「减少动效」偏好友好。",
        file: "components/motion/wheel-picker.tsx",
        badge: "new",
        launchedAt: "2026-07-09",
        keywords: ["picker", "wheel picker", "ios picker", "drum picker", "spinner", "time picker", "date picker", "scroll picker"],
      },
      {
        slug: "table",
        name: "Table",
        nameZh: "表格",
        description:
          "Virtualized data table that stays smooth at 10k+ rows, with sortable headers, row selection, column resize and reorder, and a sticky header. Minimal, reduced-motion-safe motion.",
        descriptionZh:
          "虚拟滚动数据表格,万行以上依然流畅,支持表头排序、行选择、列宽调整与列重排,并带粘性表头。动效克制,对「减少动效」偏好友好。",
        file: "components/motion/table/index.tsx",
        badge: "new",
        launchedAt: "2026-07-01",
        keywords: [
          "react data table",
          "virtualized table",
          "sortable table",
          "table row selection",
          "react table 10k rows",
          "editable table react",
        ],
        examples: [
          {
            slug: "data",
            name: "Data Table",
            nameZh: "数据表格",
            description:
              "10k virtualized rows with sortable headers, row selection, column resize and reorder.",
            descriptionZh:
              "支持万行级虚拟滚动,表头可排序,支持行选择、列宽调整与列重排。",
            installSlug: "table",
            file: "components/motion/table/index.tsx",
            previewKey: "motion/table",
            previewFile: "components/previews/motion/table.preview.tsx",
          },
          {
            slug: "editable",
            name: "Editable Table",
            nameZh: "可编辑表格",
            description:
              "Edit cells inline and insert or delete rows and columns via border handles; the table re-renders from the updated data and column defs.",
            descriptionZh:
              "行内编辑单元格,通过边框手柄插入或删除行列;表格会根据更新后的数据与列定义重新渲染。",
            installSlug: "table-editable",
            file: "components/motion/table/index.tsx",
            previewKey: "motion/table-editable",
            previewFile: "components/previews/motion/table-editable.preview.tsx",
          },
          {
            slug: "async",
            name: "Async Table",
            nameZh: "异步加载表格",
            description:
              "Loads pages on demand — skeleton rows on first load, then infinite scroll via onEndReached as the virtualized list nears the bottom.",
            descriptionZh:
              "按需分页加载——首次加载展示骨架行,随后虚拟列表接近底部时通过 onEndReached 触发无限滚动加载。",
            installSlug: "table-async",
            file: "components/motion/table/index.tsx",
            previewKey: "motion/table-async",
            previewFile: "components/previews/motion/table-async.preview.tsx",
          },
        ],
      },
      {
        slug: "shader-background",
        name: "Shader Background",
        nameZh: "着色器背景",
        description:
          "Canvas shader backgrounds (mesh gradient, grain, warp, waves, voronoi, dot orbit and more) with a single typed variant prop. Reduced-motion freezes animated variants.",
        descriptionZh:
          "基于 Canvas 着色器的背景效果(网格渐变、颗粒噪点、扭曲、波浪、Voronoi 图案、点阵环绕等),通过单一类型化的 variant 属性切换。「减少动效」偏好下动态效果会静止。",
        file: "components/motion/shader-background.tsx",
        badge: "new",
        launchedAt: "2026-07-02",
        keywords: [
          "shader background react",
          "webgl background",
          "mesh gradient react",
          "animated background react",
          "canvas shader",
          "gradient background component",
        ],
      },
      {
        slug: "cylinder-carousel",
        name: "Cylinder Carousel",
        nameZh: "圆柱轮播",
        description:
          "A carousel whose items line the inside of a cylinder, receding into the center and growing toward the edges. Drag, scroll or arrow-key to roll it, with a springy glide and snap. Reduced-motion drops the glide.",
        descriptionZh:
          "轮播项排列在圆柱体内壁,越靠中心越远、越靠边缘越大。可拖拽、滚动或方向键滚动切换,带弹性滑动与吸附。「减少动效」偏好下取消滑动过渡。",
        file: "components/motion/cylinder-carousel.tsx",
        badge: "new",
        launchedAt: "2026-07-04",
        keywords: [
          "3d carousel react",
          "cylinder carousel",
          "coverflow react",
          "rolling carousel",
          "draggable carousel react",
        ],
      },
      {
        slug: "loader",
        name: "Loader",
        nameZh: "加载指示器",
        description:
          "Loading indicator with seventeen variants: spinner, dots, bars, dot-matrix, dither, morph, comet, scramble, metaballs, newton, helix, percent, and five terminal-style ascii spinners. Scales from one size prop, uses currentColor, and reduced-motion swaps every transform for a calm opacity pulse.",
        descriptionZh:
          "加载指示器,内置十七种样式:旋转圈、圆点、条形、点阵、抖动噪点、变形、彗星、乱码扫描、融球、牛顿摆、螺旋、百分比,以及五款终端风格的 ASCII 动画。单一 size 属性即可缩放,使用 currentColor 取色,「减少动效」偏好下所有变换动效都会替换为平缓的透明度脉冲。",
        file: "components/motion/loader.tsx",
        badge: "new",
        launchedAt: "2026-07-04",
        keywords: [
          "loader react",
          "loading spinner",
          "dot matrix loader",
          "dithering loader",
          "loading indicator",
        ],
      },
    ],
  },
  {
    slug: "blocks",
    name: "Blocks",
    nameZh: "区块",
    description: "Composed, product-ready widgets built from UI Lab motion primitives.",
    descriptionZh: "基于 UI Lab 动效原语组合而成、可直接用于产品的复合组件。",
    components: [
      {
        slug: "agent-thread",
        name: "Agent Thread",
        nameZh: "Agent 会话流",
        description:
          "AI agent conversation stream: user message pills, turn headers, markdown typography, thinking & tool-call status rows, approval card, streaming caret, file & diff artifact cards with expand animation, command rows, and hover-revealed turn actions.",
        descriptionZh:
          "AI agent 会话流组件族:用户消息 pill、回合头、Markdown 排版容器、思考与工具调用状态行、审批请求卡、流式输出光标、带展开动画的文件与变更产物卡、命令执行行,以及悬停显现的回合操作栏。",
        file: "components/motion/agent-thread/index.tsx",
        extraFiles: [
          "components/motion/agent-thread/cards.tsx",
          "components/motion/agent-thread/status.tsx",
        ],
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "agent thread react",
          "ai chat messages react",
          "conversation stream component",
          "tool call cards react",
          "diff card component",
          "agent status states",
          "reasoning indicator",
          "tool call status",
          "approval card",
          "codex style thread",
        ],
      },
      {
        slug: "agent-composer",
        name: "Agent Composer",
        nameZh: "Agent 输入台",
        description:
          "AI agent chat composer with context chips, access chip, model picker with a segmented reasoning-effort slider, and a morphing send/stop button, plus an add menu and a voice dictation bar.",
        descriptionZh:
          "AI agent 聊天输入台组件族:上下文 chips、权限 chip、内置分段推理力度滑杆的模型选择器,以及可变形的发送/停止按钮,并带添加菜单与语音听写态。",
        file: "components/motion/agent-composer/index.tsx",
        extraFiles: ["components/motion/agent-composer/effort-slider.tsx"],
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "agent composer react",
          "ai chat input react",
          "prompt input component",
          "chat composer react",
          "reasoning effort slider",
          "model picker react",
          "voice dictation bar",
          "attachment menu",
          "codex style composer",
        ],
      },
      {
        slug: "agent-workbench",
        name: "Agent Workbench",
        nameZh: "Agent 工作台",
        description:
          "Three-pane agent app shell: a resizable translucent sidebar, thread column and utility panel with drag-to-close, spring open/collapse, and a full-width 46px toolbar overlay. Includes a pinned summary card overlay.",
        descriptionZh:
          "三栏式 Agent 应用外壳:半透明可拖宽侧栏、会话主列与右侧工具面板,支持拖到底关闭、弹簧展开/折叠,以及横跨全宽的 46px 顶部工具栏。并内置置顶摘要浮层卡片。",
        file: "components/motion/agent-workbench/index.tsx",
        extraFiles: [
          "components/motion/agent-workbench/resize-handle.tsx",
          "components/motion/agent-workbench/summary-card.tsx",
        ],
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "agent workbench react",
          "three pane layout react",
          "resizable sidebar react",
          "app shell component",
          "codex style app shell",
          "ai chat workbench",
          "split pane layout",
        ],
      },
      {
        slug: "availability-scheduler",
        name: "Availability Scheduler",
        nameZh: "可用时间编辑器",
        description: "Weekly availability editor where each day springs between available and unavailable, time ranges add and remove with blur-slide motion, times pick from a scrollable dropdown, and a copy menu clones hours to other days.",
        descriptionZh: "每周可用时间编辑器,每一天在「可用/不可用」之间弹簧切换,时间段的增删带模糊滑动动效,时间通过可滚动下拉菜单选取,并可通过复制菜单将时段套用到其他天。",
        file: "components/motion/availability-scheduler/index.tsx",
        badge: "new",
        launchedAt: "2026-07-10",
        keywords: [
          "availability scheduler react",
          "weekly hours picker react",
          "working hours component",
          "cal.com availability component",
          "time range picker react",
          "business hours editor",
        ],
      },
      {
        slug: "swap",
        name: "Multi-chain Swap",
        nameZh: "多链兑换",
        description: "Cross-chain swap widget with chain + token selectors, morphing views, animated flip and quote.",
        descriptionZh: "跨链兑换组件,内置链与代币选择器、视图变形动效、翻转动画与实时报价。",
        file: "components/motion/swap.tsx",
      },
      {
        slug: "dynamic-island",
        name: "Dynamic Island",
        nameZh: "灵动岛",
        description: "iOS-style island pill that morphs between live activity views with bouncy shell resize and blur crossfades.",
        descriptionZh: "iOS 风格的灵动岛胶囊组件,在多个实时活动视图间变形切换,外壳弹性缩放并带模糊交叉淡化。",
        file: "components/motion/dynamic-island.tsx",
      },
      {
        slug: "command-palette",
        name: "Command Palette",
        nameZh: "命令面板",
        description: "⌘K palette with fuzzy filter, spring-animated active row and glass surface.",
        descriptionZh: "⌘K 呼出的命令面板,支持模糊搜索过滤,当前行带弹簧动效高亮,毛玻璃质感表面。",
        file: "components/motion/command-palette.tsx",
      },
      {
        slug: "expandable-action-bar",
        name: "Expandable Action Bar",
        nameZh: "可展开操作栏",
        description: "Compact icon actions that expand into labeled controls on hover or focus with shared layout motion.",
        descriptionZh: "紧凑的图标操作项,在悬停或聚焦时通过共享布局动效展开为带文字标签的控件。",
        file: "components/motion/expandable-action-bar.tsx",
      },
      {
        slug: "overflow-actions",
        name: "Overflow Actions",
        nameZh: "溢出操作栏",
        description: "Connected pill rail for primary actions that springs open to reveal extra controls.",
        descriptionZh: "连体胶囊式主操作栏,弹簧展开后可露出更多附加操作。",
        file: "components/motion/overflow-actions.tsx",
      },
      {
        slug: "expandable-tabs",
        name: "Expandable Tabs",
        nameZh: "可展开选项卡",
        description: "Icon tab bar where the active tab expands to a labelled pill, with a panel above that morphs height and slides content direction-aware on switch.",
        descriptionZh: "图标选项卡栏,当前选项卡展开为带文字标签的胶囊,上方面板随切换变形高度,内容按方向感知滑动。",
        file: "components/motion/expandable-tabs.tsx",
      },
      {
        slug: "swipeable-list",
        name: "Swipeable List",
        nameZh: "可滑动列表",
        description: "Mobile-style list rows that swipe left or right to reveal contextual action buttons.",
        descriptionZh: "移动端风格的列表行,左右滑动可露出上下文操作按钮。",
        file: "components/motion/swipeable-list.tsx",
      },
      {
        slug: "file-upload",
        name: "File Upload",
        nameZh: "文件上传",
        description: "Drag-and-drop upload queue with progress rows, retry/remove actions and reduced-motion-safe state changes.",
        descriptionZh: "支持拖拽上传的队列组件,带进度行、重试/移除操作,状态切换对「减少动效」偏好友好。",
        file: "components/motion/file-upload.tsx",
      },
      {
        slug: "prediction-market",
        name: "Prediction Market",
        nameZh: "预测市场交易卡",
        description: "Prediction market trade ticket with buy/sell modes, outcome prices, rolling amount entry, quick add chips and trade states.",
        descriptionZh: "预测市场交易面板,支持买入/卖出模式、结果价格展示、滚动数字输入、快捷金额芯片以及多种交易状态。",
        file: "components/motion/prediction-market.tsx",
      },
      {
        slug: "wallet-card",
        name: "Wallet Card",
        nameZh: "钱包卡片",
        description: "Wallet overview card with an account switcher and search that morph open from their triggers, a cascading balance with a live change pill and privacy toggle, copy-address, and Send / Deposit / Swap / Buy actions.",
        descriptionZh: "钱包概览卡片,账户切换器与搜索均从触发器变形展开,余额以瀑布动效呈现并带实时涨跌胶囊与隐私开关,支持一键复制地址以及转账/充值/兑换/购买等操作。",
        file: "components/motion/wallet-card/index.tsx",
        badge: "new",
        launchedAt: "2026-07-03",
        keywords: [
          "wallet card react",
          "web3 wallet component",
          "crypto balance component",
          "account switcher react",
          "chain switcher react",
        ],
      },
      {
        slug: "otp-input",
        name: "OTP Input",
        nameZh: "验证码输入框",
        description: "One-time-code input with a gliding focus ring, digits that roll in per slot, error shake and a success check draw.",
        descriptionZh: "一次性验证码输入框,聚焦环平滑滑动定位,数字逐格滚入,错误时抖动提示,成功时绘制对勾动画。",
        file: "components/motion/otp-input.tsx",
      },
      {
        slug: "bloom-menu",
        name: "Bloom Menu",
        nameZh: "绽放菜单",
        description: "A button that morphs open into a menu and blooms iris-out from the center, the grid revealing in every direction with radially staggered items.",
        descriptionZh: "按钮变形展开为菜单,以虹膜式效果从中心向外绽放,网格项沿径向错落展开。",
        file: "components/motion/bloom-menu.tsx",
        badge: "new",
        launchedAt: "2026-06-26",
      },
      {
        slug: "feedback-widget",
        name: "Feedback Widget",
        nameZh: "反馈小组件",
        description: "Corner trigger that morphs open into a feedback popup with message entry and animated sending, success and retry states.",
        descriptionZh: "角落触发按钮变形展开为反馈弹窗,支持消息输入,并带发送中、成功、重试等动效状态。",
        file: "components/motion/feedback-widget.tsx",
        badge: "new",
        launchedAt: "2026-06-29",
        keywords: [
          "react feedback widget",
          "feedback popover react",
          "in-app feedback component",
          "feedback form animation",
          "react feedback button",
        ],
      },
      {
        slug: "not-found",
        name: "404 / Not Found",
        nameZh: "404 页面",
        description: "Animated 404 pages in five styles: glitch scramble, magnetic digits, cursor spotlight, a fanning card stack and a typed terminal.",
        descriptionZh: "五种风格的动效 404 页面:故障扫描、磁吸数字、光标聚光灯、扇形卡片堆叠与打字终端。",
        file: "components/motion/not-found/index.tsx",
        extraFiles: [
          "components/motion/not-found/shared.tsx",
          "components/motion/not-found/glitch.tsx",
          "components/motion/not-found/magnetic.tsx",
          "components/motion/not-found/spotlight.tsx",
          "components/motion/not-found/stacked.tsx",
          "components/motion/not-found/terminal.tsx",
        ],
        examples: [
          {
            slug: "glitch",
            name: "Glitch",
            nameZh: "故障风格",
            description:
              "Digits scramble through random glyphs before resolving, with a chromatic split on hover.",
            descriptionZh:
              "数字在随机字符间闪烁扫描后定格,悬停时出现色差分离效果。",
            installSlug: "not-found-glitch",
            file: "components/motion/not-found/glitch.tsx",
            previewKey: "blocks/not-found-glitch",
            previewFile: "components/previews/blocks/not-found-glitch.preview.tsx",
          },
          {
            slug: "magnetic",
            name: "Magnetic",
            nameZh: "磁吸风格",
            description:
              "Each digit is cursor-attracted via the Magnetic wrapper and springs back on leave.",
            descriptionZh:
              "每个数字都通过 Magnetic 包裹被光标吸引跟随,离开后弹簧回位。",
            installSlug: "not-found-magnetic",
            file: "components/motion/not-found/magnetic.tsx",
            previewKey: "blocks/not-found-magnetic",
            previewFile: "components/previews/blocks/not-found-magnetic.preview.tsx",
          },
          {
            slug: "spotlight",
            name: "Spotlight",
            nameZh: "聚光灯风格",
            description:
              "A dark panel where a cursor-tracked spotlight reveals the bright code from a dim base.",
            descriptionZh:
              "深色面板中,跟随光标的聚光灯从昏暗底色中照亮下方的代码。",
            installSlug: "not-found-spotlight",
            file: "components/motion/not-found/spotlight.tsx",
            previewKey: "blocks/not-found-spotlight",
            previewFile: "components/previews/blocks/not-found-spotlight.preview.tsx",
          },
          {
            slug: "stacked",
            name: "Stacked",
            nameZh: "堆叠风格",
            description:
              "A code card over a hidden stack that fans out with a spring on hover.",
            descriptionZh:
              "代码卡片下方藏有一叠卡片,悬停时以弹簧动效扇形展开。",
            installSlug: "not-found-stacked",
            file: "components/motion/not-found/stacked.tsx",
            previewKey: "blocks/not-found-stacked",
            previewFile: "components/previews/blocks/not-found-stacked.preview.tsx",
          },
          {
            slug: "terminal",
            name: "Terminal",
            nameZh: "终端风格",
            description:
              "A terminal window that types a failed cd command and a 404 status, with a blinking caret.",
            descriptionZh:
              "模拟终端窗口逐字打出失败的 cd 命令与 404 状态,光标闪烁。",
            installSlug: "not-found-terminal",
            file: "components/motion/not-found/terminal.tsx",
            previewKey: "blocks/not-found-terminal",
            previewFile: "components/previews/blocks/not-found-terminal.preview.tsx",
          },
        ],
      },
    ],
  },
  {
    slug: "layout",
    name: "Layout",
    nameZh: "布局",
    description:
      "Static building blocks — layouts, cards, forms and other non-motion pieces. Empty for now; drop components here as you collect them.",
    descriptionZh:
      "静态构建块 —— 布局、卡片、表单等非动效组件。暂时为空,以后收到合适的就往这里加。",
    components: [],
  },
];

export function findCategory(slug: string) {
  return registry.find((c) => c.slug === slug);
}

export function findComponent(categorySlug: string, slug: string) {
  return findCategory(categorySlug)?.components.find((c) => c.slug === slug);
}

export function allComponents() {
  return registry.flatMap((c) =>
    c.components.map((comp) => ({ ...comp, category: c }))
  );
}

/** Top-level components and total installable targets (counting variants). */
export const COMPONENT_COUNT = registry.reduce(
  (n, c) => n + c.components.length,
  0,
);

export const INSTALLABLE_COUNT = registry.reduce(
  (n, c) =>
    n +
    c.components.reduce((m, comp) => {
      const variants = (comp.examples ?? []).filter((e) => e.installSlug).length;
      return m + (variants || 1);
    }, 0),
  0,
);
