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
        description: "Spring-pressed Button plus StatefulButton (idle → loading → success / error), MagneticButton, and MetallicButton.",
        descriptionZh: "带弹簧按压反馈的按钮,还包含状态按钮 StatefulButton(空闲 → 加载中 → 成功 / 失败)、磁吸按钮 MagneticButton 与金属按钮 MetallicButton。",
        file: "components/motion/button/index.tsx",
        extraFiles: [
          "components/motion/button/base.tsx",
          "components/motion/button/stateful.tsx",
          "components/motion/button/magnetic.tsx",
          "components/motion/button/metallic.tsx",
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
          {
            slug: "metallic",
            name: "Metallic Button",
            nameZh: "金属按钮",
            description:
              "A neutral button surface framed by a pronounced chrome rim with a straight traveling reflection.",
            descriptionZh:
              "中性按钮表面,外圈是明显的铬金属边框,并带有直线移动的高光反射。",
            installSlug: "button-metallic",
            file: "components/motion/button/metallic.tsx",
            previewKey: "motion/button-metallic",
            previewFile: "components/previews/motion/button-metallic.preview.tsx",
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
        description:
          "Hover or focus tooltip with blur enter/exit and spring spawn, plus a Morph variant where one shared bubble glides and resizes between neighboring triggers.",
        descriptionZh:
          "悬停或聚焦触发的文字提示,进出场带模糊过渡与弹簧生成动画;另有 Morph 变体,一块共享气泡在相邻触发器之间滑移变形。",
        file: "components/motion/tooltip.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "morphing tooltip react",
          "shared tooltip surface",
          "toolbar tooltip",
          "tooltip morphs between triggers",
        ],
        examples: [
          {
            slug: "default",
            name: "Tooltip",
            nameZh: "标准文字提示",
            description:
              "Single-trigger tooltip with blur enter/exit, spring spawn and four placement sides.",
            descriptionZh:
              "单触发器文字提示:进出场模糊过渡、弹簧生成,支持四个方向定位。",
            installSlug: "tooltip",
            file: "components/motion/tooltip.tsx",
            previewKey: "motion/tooltip",
            previewFile: "components/previews/motion/tooltip.preview.tsx",
          },
          {
            slug: "morph",
            name: "Morph Tooltip",
            nameZh: "变形文字提示",
            description:
              "MorphTooltipGroup shares one bubble across a cluster of triggers — it springs in on first hover, then glides and resizes between neighbors with a blur cross-fade instead of exiting and re-entering.",
            descriptionZh:
              "MorphTooltipGroup 让一组触发器共享同一块气泡:首次悬停弹簧入场,移到相邻触发器时不退场,而是滑移并改变宽度,文字带模糊交叉淡变。",
            installSlug: "tooltip-morph",
            file: "components/motion/tooltip-morph.tsx",
            previewKey: "motion/tooltip-morph",
            previewFile: "components/previews/motion/tooltip-morph.preview.tsx",
          },
        ],
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
      {
        slug: "text-scramble",
        name: "Text Scramble",
        nameZh: "文字解密",
        description:
          "Scrambled glyphs resolve left-to-right into the real text — on view, on hover, or whenever the text prop changes. Width stays stable mid-scramble; reduced-motion shows the final text instantly.",
        descriptionZh:
          "随机字符从左到右逐个解析为真实文本——进入视口、悬停或 text 变化时播放。解码过程中宽度不抖动,「减少动效」偏好下直接显示最终文本。",
        file: "components/motion/text-scramble.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "text scramble react",
          "decrypted text effect",
          "decode on hover",
          "matrix text reveal",
          "glyph shuffle text",
        ],
      },
      {
        slug: "webgl-background",
        name: "WebGL Background",
        nameZh: "WebGL 着色器背景",
        description:
          "Fragment-shader hero backgrounds (aurora, silk, plasma, light rays, pixel blast with click ripples, dither) behind a single typed variant prop. Reduced-motion renders one static frame; no WebGL falls back to a matching CSS gradient.",
        descriptionZh:
          "基于 fragment shader 的主视觉背景(极光、丝绸、等离子、光芒射线、像素爆裂(点击涟漪)、抖动噪点),单一类型化 variant 属性切换。「减少动效」偏好下渲染静态一帧;无 WebGL 时回退为同色系 CSS 渐变。",
        file: "components/motion/webgl-background.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "webgl shader background",
          "aurora background react",
          "silk shader effect",
          "plasma background",
          "glsl hero background react",
        ],
      },
      {
        slug: "halftone-image",
        name: "Halftone Image",
        nameZh: "网点图像",
        description:
          "Renders any bitmap as a printed halftone screen on canvas: tone drives dot size on a grid you can rotate (45° reads as print), with circle or square dots and adjustable pitch. Pass a second plate and the grey screen crossfades to colour on hover, each dot inked with the tone beneath it. Transparent between dots, so it composes over any surface.",
        descriptionZh:
          "把任意位图在 canvas 上渲染成印刷网点:明暗决定网点大小,网格可旋转(45° 才是印刷味),圆点或方点、疏密可调。再给一张彩色版,灰网点便在悬停时交叉淡入彩色版,每个点取它所在位置的颜色。点与点之间透明,可直接叠在任何表面上。",
        file: "components/motion/halftone-image.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "halftone image react",
          "dithered photo canvas",
          "print screen dots",
          "risograph image effect",
          "newsprint halftone",
        ],
      },
      {
        slug: "star-border",
        name: "Star Border",
        nameZh: "星光描边",
        description:
          "A slow light orbits the border of a CTA button or card — a pure-CSS conic-gradient wrapper with color, speed and thickness props. Reduced-motion freezes it into a static ring.",
        descriptionZh:
          "一束缓慢的光沿按钮或卡片边框环绕运行——纯 CSS 锥形渐变包裹器,可调光色、速度与描边厚度。「减少动效」偏好下静止为固定描边。",
        file: "components/motion/star-border.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "star border button",
          "animated border react",
          "orbiting border light",
          "glowing border cta",
          "conic gradient border",
        ],
      },
      {
        slug: "bounce-cards",
        name: "Bounce Cards",
        nameZh: "弹跳卡组",
        description:
          "A stacked deck of cards fans open with a staggered spring bounce when it enters the view. Spacing, rotation and stagger are tunable; reduced-motion keeps the fanned layout and only fades in.",
        descriptionZh:
          "一叠卡片进入视口时错峰弹跳着扇形展开。间距、旋转与错峰节奏可调;「减少动效」偏好下保留扇形布局,仅做透明度渐入。",
        file: "components/motion/bounce-cards.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "bounce cards react",
          "card stack fan out",
          "staggered card entrance",
          "spring card deck",
        ],
      },
      {
        slug: "glare-hover",
        name: "Glare Hover",
        nameZh: "眩光悬停",
        description:
          "A diagonal band of light sweeps across a card or button on hover. Color, angle and duration props; touch devices skip it, reduced-motion swaps the sweep for a soft opacity highlight.",
        descriptionZh:
          "悬停时一道斜向光带扫过卡片或按钮表面。光色、角度、时长可调;触屏设备不渲染,「减少动效」偏好下换成轻微透明度高亮。",
        file: "components/motion/glare-hover.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "glare hover effect",
          "light sweep card",
          "sheen hover react",
          "shine sweep button",
        ],
      },
      {
        slug: "skeleton",
        name: "Skeleton",
        nameZh: "骨架屏",
        description:
          "Loading placeholder block with a soft shimmer sweep — shape it entirely with className, compose avatars, text bars and image blocks. Reduced-motion swaps the sweep for a calm opacity pulse.",
        descriptionZh:
          "内容加载占位块,自带柔和微光扫过——形状完全由 className 决定,可组合出头像、文本条、图块。「减少动效」偏好下换成平缓的透明度脉冲。",
        file: "components/motion/skeleton.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "skeleton loading react",
          "shimmer placeholder",
          "loading skeleton component",
          "content placeholder",
        ],
      },
      {
        slug: "scroll-hint",
        name: "Scroll Hint",
        nameZh: "滚动提示",
        description:
          "A hero-section scroll-down indicator in two shapes: a mouse outline with a dropping dot, or a pair of pulsing chevrons. currentColor sizing, optional label, reduced-motion shows the static glyph.",
        descriptionZh:
          "首屏底部的向下滚动指示器,两种形态:鼠标轮廓内圆点下落,或两枚 chevron 依次脉冲。跟随 currentColor,可带文字标签,「减少动效」偏好下静态显示。",
        file: "components/motion/scroll-hint.tsx",
        badge: "new",
        launchedAt: "2026-07-17",
        keywords: [
          "scroll down indicator",
          "scroll hint react",
          "mouse scroll icon animated",
          "hero scroll cue",
        ],
      },
      {
        slug: "animated-icon",
        name: "Animated Icon",
        nameZh: "动效图标",
        description:
          "Hover-played icon micro-interactions in one component — draw, wiggle, spin, bounce, pop, pulse, nudge — driven by a single variant prop. Built on motion + lucide, reduced-motion safe.",
        descriptionZh:
          "一个组件承载七种 hover 动效图标(描边/摆动/旋转/弹跳/弹入/脉动/微移),用单个 variant prop 切换。基于 motion + lucide,尊重减少动态偏好。",
        file: "components/motion/animated-icon.tsx",
        badge: "new",
        launchedAt: "2026-07-19",
        keywords: [
          "animated icon react",
          "hover icon animation",
          "icon micro interaction",
          "lucide animated icon",
        ],
      },
      {
        slug: "dropdown-menu",
        name: "Dropdown Menu",
        nameZh: "下拉菜单",
        description:
          "Composable animated dropdown menu: a corner-origin spring entrance with viewport collision flip, one shared focus surface that glides between rows for both pointer and keyboard, grouped labels, two-line items with icons and shortcuts, checkbox items, a hover/arrow-key submenu, and full roving-focus keyboard navigation.",
        descriptionZh:
          "可组合的动效下拉菜单:面板从触发器近角弹簧展开并带视口碰撞翻转;hover 与键盘共用一块在行间滑动的焦点表面;支持分组标签、图标+双行描述+快捷键、勾选项、悬停/方向键子菜单,以及完整的键盘循环导航。",
        file: "components/motion/dropdown-menu.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "dropdown menu react",
          "animated dropdown",
          "context menu react",
          "menu keyboard navigation",
          "submenu react",
          "shared highlight menu",
        ],
      },
      {
        slug: "expanding-card",
        name: "Expanding Card",
        nameZh: "卡片展开弹层",
        description:
          "App Store-style card expansion: the card itself morphs into a centered modal over a heavily blurred backdrop via a shared layoutId FLIP — expanded content fades in once the surface lands, and the card shrinks back on close.",
        descriptionZh:
          "App Store 式卡片展开:卡片经共享 layoutId 直接变形为居中弹层,背景整页重模糊;扩展内容在表面落定后淡入,关闭时沿原路缩回原位并归还焦点。",
        file: "components/motion/expanding-card.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "app store card expansion",
          "card to modal react",
          "shared layout modal",
          "morphing card react",
          "expanding card animation",
        ],
      },
      {
        slug: "expandable-control",
        name: "Expandable Control",
        nameZh: "可展开控件",
        description:
          "Click-to-expand button and chip controls that reveal a label or trailing action through spring layout continuity.",
        descriptionZh:
          "点击展开的按钮与芯片控件,通过弹簧布局连续性揭示标签或尾部操作。",
        file: "components/motion/expandable-control.tsx",
        badge: "new",
        launchedAt: "2026-08-22",
        keywords: [
          "expandable button react",
          "animated chip react",
          "click to expand",
          "layout animation button",
          "reveal action control",
        ],
      },
      {
        slug: "file-tree",
        name: "File Tree",
        nameZh: "文件树",
        description:
          "Composable file and folder primitives with springing branches, a gliding selection, and complete keyboard navigation.",
        descriptionZh:
          "可组合的文件与文件夹原语,带弹簧展开的树枝、滑动选中态与完整键盘导航。",
        file: "components/motion/file-tree.tsx",
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "animated file tree react",
          "file explorer component",
          "folder tree",
          "project tree",
          "accessible tree view",
          "react tree component",
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
        slug: "recording-card",
        name: "Recording Card",
        nameZh: "录屏演示卡",
        description:
          "Presents any content as a screen recording: wallpaper and scrim behind a window mock, a webcam bubble that doubles as the play control, a running timer with a blinking record dot, and a “tap for sound” pill that slides back behind the bubble once playing. Sized entirely in container-query units, so one card scales from grid thumbnail to full-width hero with no breakpoints — plus an optional aspect-locked theatre view.",
        descriptionZh:
          "把任意内容呈现成一段录屏:窗口 mock 背后是壁纸与压暗层,摄像头气泡兼作播放按钮,计时器带闪烁录制红点,「点击听声音」药丸在播放后滑回气泡背后藏起来。全部尺寸用容器查询单位写成,同一张卡从网格缩略图到整宽 hero 都是等比的,不需要任何断点;另可开启锁定 16:9 的剧场视图。",
        file: "components/motion/recording-card.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "screen recording card react",
          "loom style video card",
          "webcam bubble overlay",
          "product demo card",
          "container query scaling",
        ],
      },
      {
        slug: "login-card",
        name: "Login Card",
        nameZh: "登录卡片",
        description:
          "Chinese product sign-in modal: a blue gradient header with floating bokeh, a WeChat QR-scan column beside phone quick-login (country-code dropdown, code field with a 60s resend countdown), an agreement checkbox that shakes on invalid submit, and an ICP footer.",
        descriptionZh:
          "中文产品登录弹窗:蓝色渐变头部带漂浮光斑,微信扫码列与手机号快捷登录并排(区号下拉、验证码 60 秒重发倒计时),未勾选协议提交时协议行抖动提示,并带 ICP 备案页脚。",
        file: "components/motion/login-card.tsx",
        badge: "new",
        launchedAt: "2026-07-19",
        keywords: [
          "login card react",
          "sign in modal react",
          "wechat qr login",
          "phone otp login form",
          "chinese login page component",
          "验证码登录",
        ],
      },
      {
        slug: "thread-list",
        name: "Thread List",
        nameZh: "会话列表",
        description:
          "Sidebar conversation list: section headers with action slots, 30px rows with unread dots and time metas that swap to hover actions, and an active pill that glides between rows via shared layout.",
        descriptionZh:
          "侧栏会话列表:带操作槽的分组标题、30px 行(未读圆点、时间与悬停操作钮互换),以及用共享布局在行间平滑滑动的选中底块。",
        file: "components/motion/thread-list/index.tsx",
        badge: "new",
        launchedAt: "2026-07-16",
        keywords: [
          "thread list react",
          "conversation list sidebar",
          "chat history list",
          "shared layout active indicator",
          "sidebar rows hover actions",
        ],
      },
      {
        slug: "artifact-panel",
        name: "Artifact Panel",
        nameZh: "制品画布面板",
        description:
          "Side-pane canvas for AI-generated artifacts: hairline panel shell, header with action cluster, preview/code view toggle with cross-fade, and a version navigator with restore.",
        descriptionZh:
          "AI 产物的画布侧栏:发丝面板壳、带操作簇的头部、交叉淡切的预览/代码双视图切换,以及带恢复按钮的版本导航。",
        file: "components/motion/artifact-panel/index.tsx",
        badge: "new",
        launchedAt: "2026-07-14",
        keywords: [
          "artifact panel react",
          "ai canvas component",
          "side pane preview code",
          "artifact version history",
          "canvas split view chat",
        ],
      },
      {
        slug: "agent-inbox",
        name: "Agent Inbox",
        nameZh: "Agent 审批收件箱",
        description:
          "Human-in-the-loop approval queue: risk-tiered request items with expiry and detail expand, approve/deny flows that settle in place, and an action receipt card with scope, diff stats and undo.",
        descriptionZh:
          "人机协同审批队列:带风险分级与过期时间的请求项、可展开详情、原地落定的批准/拒绝流转,以及带影响范围、增删统计与撤销的操作回执卡。",
        file: "components/motion/agent-inbox/index.tsx",
        badge: "new",
        launchedAt: "2026-07-14",
        keywords: [
          "human in the loop react",
          "approval queue component",
          "agent approval inbox",
          "action receipt card",
          "hitl ui component",
          "risk badge component",
        ],
      },
      {
        slug: "agent-trace",
        name: "Agent Trace",
        nameZh: "Agent 执行轨迹",
        description:
          "Activity rail for agent runs: kind-styled step nodes on a hairline rail, live steps with pulse ring and cadenced shimmer, raw-output expand, parallel tool groups, and nested sub-agent mini traces.",
        descriptionZh:
          "Agent 执行轨迹组件族:发丝竖轨上按类型着装的步骤节点、带脉冲环与节奏扫光的进行中步骤、原始输出展开、并行工具组,以及可嵌套展开的子 Agent 迷你轨迹。",
        file: "components/motion/agent-trace/index.tsx",
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "agent trace react",
          "activity rail component",
          "agent steps timeline",
          "nested subagent trace",
          "tool execution trace",
          "claude code style trace",
        ],
      },
      {
        slug: "streaming-json",
        name: "Streaming JSON",
        nameZh: "流式结构化输出",
        description:
          "Tolerant syntax-colored rendering for partial JSON as it streams in: an incremental tokenizer that survives unclosed strings, fade-in for freshly arrived spans, a streaming caret, and a function-call wrapper.",
        descriptionZh:
          "流式结构化输出组件族:对不完整 JSON 容错的分色渲染——可承受未闭合字符串的增量 tokenizer、仅对新到片段做淡入、流式光标,以及函数调用外壳。",
        file: "components/motion/streaming-json/index.tsx",
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "streaming json react",
          "partial json renderer",
          "tool call arguments stream",
          "structured output component",
          "json syntax highlight stream",
        ],
      },
      {
        slug: "citations",
        name: "Citations",
        nameZh: "引用与来源",
        description:
          "Inline citation chips with a hover source-preview popover, plus source cards and a staggered source list for the answer footer.",
        descriptionZh:
          "引用与来源组件族:行内引用角标(悬停弹出来源预览浮层)、来源卡片,以及答案尾部带级联进场的来源列表。",
        file: "components/motion/citations/index.tsx",
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "inline citation react",
          "source preview popover",
          "citation chip component",
          "ai answer sources list",
          "perplexity style citations",
        ],
      },
      {
        slug: "voice-orb",
        name: "Voice Orb",
        nameZh: "语音律动球",
        description:
          "Immersive voice-mode orb: one continuous gradient sphere whose breathing, hue drift, echo rings and thinking sheen follow idle / listening / thinking / speaking states.",
        descriptionZh:
          "沉浸式语音模式光球:单一连续渐变球体,呼吸、色相漂移、回声环与思考高光随待机/聆听/思考/说话四态切换。",
        file: "components/motion/voice-orb/index.tsx",
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "voice orb react",
          "voice assistant animation",
          "ai voice mode ui",
          "breathing orb component",
          "voice mode sphere",
        ],
      },
      {
        slug: "activity-stats",
        name: "Activity Stats",
        nameZh: "活动统计",
        description:
          "Usage-summary widgets: a connected stats bar for headline metrics, a GitHub-style contribution heatmap with a color-mix intensity scale and column-cascade entrance, and a text period switch.",
        descriptionZh:
          "使用量统计组件族:用于关键指标的连体统计条、基于 color-mix 强度色阶与逐列级联淡入的 GitHub 风格贡献热力图,以及纯文本周期切换器。",
        file: "components/motion/activity-stats/index.tsx",
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "activity stats react",
          "contribution heatmap react",
          "github style activity graph",
          "stats summary bar",
          "usage dashboard component",
          "codex style activity heatmap",
        ],
      },
      {
        slug: "settings-panel",
        name: "Settings Panel",
        nameZh: "设置面板",
        description:
          "Preference-form building blocks: a titled settings group with hairline-divided rows, a hex color field with auto-contrasting text, a text field, a preset-picker button and a ghost header action.",
        descriptionZh:
          "偏好设置表单组件族:带发丝分隔行的带标题设置分组、文字自动反差的十六进制颜色输入胶囊、文本框、预设选择按钮,以及头部幽灵操作按钮。",
        file: "components/motion/settings-panel/index.tsx",
        badge: "new",
        launchedAt: "2026-07-12",
        keywords: [
          "settings form react",
          "preferences panel",
          "color picker field",
          "settings group component",
          "theme editor react",
          "codex style settings panel",
        ],
      },
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
        extraFiles: [
          "components/motion/agent-composer/effort-slider.tsx",
          "components/motion/agent-composer/autonomy-dial.tsx",
        ],
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
          "Responsive agent app shell: a resizable three-pane desktop layout, tablet side overlays, and mobile single-surface navigation, with spring transitions and a full-width 46px toolbar overlay. Includes a pinned summary card overlay.",
        descriptionZh:
          "响应式 Agent 应用外壳:桌面端为可拖宽三栏布局,平板端将侧区切换为覆盖层,移动端一次只展示一个任务表面;支持弹簧过渡与横跨全宽的 46px 顶部工具栏,并内置置顶摘要浮层卡片。",
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
        slug: "morphing-search",
        name: "Morphing Search",
        nameZh: "变形搜索",
        description:
          "Search field or compact icon that morphs into a glass results surface, whether opened by click or keyboard shortcut.",
        descriptionZh:
          "搜索框或紧凑图标会变形为玻璃感结果面板,支持点击或键盘快捷键打开。",
        file: "components/motion/morphing-search.tsx",
        badge: "new",
        launchedAt: "2026-08-18",
        keywords: [
          "morphing search react",
          "animated search component",
          "search overlay react",
          "keyboard search shortcut",
          "command search ui",
        ],
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
      {
        slug: "step-form",
        name: "Step Form",
        nameZh: "分步表单",
        description:
          "Focused one-question-at-a-time multi-step form: segmented progress with a mono counter, directional slide transitions with container height morph, text and choice steps, shake-on-invalid validation with reserved error space, Enter-to-advance, and a drawn-check success state.",
        descriptionZh:
          "「一次一题」聚焦式多步表单:分段进度条配等宽计数,方向性滑动切换配合容器高度变形;支持文本题与选择卡题,校验失败抖动且错误行预留空间不跳版,Enter 直接推进,完成态画圈打勾。",
        file: "components/motion/step-form.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "multi step form react",
          "step form animation",
          "typeform style form",
          "onboarding form react",
          "wizard form react",
          "directional form transitions",
        ],
      },
      {
        slug: "empty-state",
        name: "Empty State",
        nameZh: "空状态",
        description:
          "Animated empty-state blocks with hand-drawn line-art illustrations, concise copy and a primary action — an inbox-zero envelope, a hover-to-open archive cabinet, and a scanning search lens.",
        descriptionZh:
          "带线稿动画插图的空状态区块:信封收件箱清零、悬停弹开抽屉的档案柜、来回扫描的搜索放大镜;统一「插图 + 短文案 + 主操作」结构。",
        file: "components/motion/empty-state/index.tsx",
        extraFiles: [
          "components/motion/empty-state/shared.tsx",
          "components/motion/empty-state/inbox.tsx",
          "components/motion/empty-state/archive.tsx",
          "components/motion/empty-state/search.tsx",
        ],
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "empty state react",
          "animated empty state",
          "inbox zero illustration",
          "no results state",
          "empty state component",
        ],
        examples: [
          {
            slug: "inbox",
            name: "Inbox Zero",
            nameZh: "收件箱清零",
            description:
              "A line-art envelope whose flap opens and last letter lifts out, capped by a spring check badge and a slow idle float.",
            descriptionZh:
              "线稿信封开盖,最后一封信轻轻抬出,弹簧对勾徽章落定,随后缓慢浮动待机。",
            installSlug: "empty-state-inbox",
            file: "components/motion/empty-state/inbox.tsx",
            previewKey: "blocks/empty-state-inbox",
            previewFile: "components/previews/blocks/empty-state-inbox.preview.tsx",
          },
          {
            slug: "archive",
            name: "Archive Drawer",
            nameZh: "档案柜抽屉",
            description:
              "An isometric filing cabinet whose drawer springs open on hover or focus, papers peeking out.",
            descriptionZh:
              "等距视角档案柜,悬停或聚焦时抽屉弹簧滑开,纸页从中探出。",
            installSlug: "empty-state-archive",
            file: "components/motion/empty-state/archive.tsx",
            previewKey: "blocks/empty-state-archive",
            previewFile:
              "components/previews/blocks/empty-state-archive.preview.tsx",
          },
          {
            slug: "search",
            name: "Search Lens",
            nameZh: "搜索无果",
            description:
              "A magnifying glass sweeps over dashed result rows that flicker and never settle — no matches found.",
            descriptionZh:
              "放大镜在几行虚线结果上来回扫动,行影闪烁始终落不定——查无匹配。",
            installSlug: "empty-state-search",
            file: "components/motion/empty-state/search.tsx",
            previewKey: "blocks/empty-state-search",
            previewFile:
              "components/previews/blocks/empty-state-search.preview.tsx",
          },
        ],
      },
      {
        slug: "prompt-bar",
        name: "Prompt Bar",
        nameZh: "AI 提示输入条",
        description:
          "Compact credits-aware AI prompt bar: a dismissible credits banner, queued messages you can steer, edit or drop while streaming, slash-commands that morph into a removable skill chip, demo attachments, a web-search toggle pill, a model menu, and a morphing send-to-stop button.",
        descriptionZh:
          "紧凑的积分感知 AI 输入条:可关闭的积分横幅;流式进行中再提交会入队,可插队(Steer)、编辑或删除;输入 / 唤起技能面板并把命令凝固成可移除的技能 chip;附件演示、联网搜索开关、模型菜单与发送⇄停止变形按钮。",
        file: "components/motion/prompt-bar.tsx",
        badge: "new",
        launchedAt: "2026-07-26",
        keywords: [
          "ai prompt bar react",
          "chat input with credits",
          "queued messages steer",
          "slash command skill chip",
          "compact ai composer",
          "prompt input component",
        ],
      },
      {
        slug: "prompt-input",
        name: "Prompt Input",
        nameZh: "提示输入",
        description:
          "An auto-growing agent composer with prompt actions, model selection, keyboard submission, and animated send and stop states.",
        descriptionZh:
          "可自动增高的 Agent 输入台:动作菜单、模型选择、Enter 发送、多行输入,以及发送/停止的动效切换。",
        file: "components/agents/prompt-input.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI prompt input React",
          "model selector dropdown",
          "chat composer component",
          "agent input UI",
          "AI textarea React",
          "LLM model picker",
        ],
      },
      {
        slug: "todo-list",
        name: "Todo List",
        nameZh: "任务清单",
        description:
          "A collapsible agent task plan with morphing status marks, a completion count, compact metadata, and smooth list updates.",
        descriptionZh:
          "可折叠的 Agent 任务计划:待办/进行中/完成/取消状态、进度变形为对勾、完成计数、稳定流式行与紧凑元数据。",
        file: "components/agents/todo-list.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI agent todo list React",
          "agent task progress UI",
          "LLM task plan component",
          "AI checklist React",
          "streaming todo list",
          "agent workflow status",
        ],
      },
      {
        slug: "code-block",
        name: "Code Block",
        nameZh: "代码块",
        description:
          "A syntax-highlighted code surface with stable streaming updates, line numbers, focused lines, smooth following, and copy feedback.",
        descriptionZh:
          "面向 Agent 的语法高亮代码面:稳定流式更新、可选行号与高亮行、有界平滑跟随、文件名/语言元数据与复制反馈。",
        file: "components/agents/code-block.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI code block React",
          "streaming code component",
          "syntax highlighted code block",
          "LLM code response UI",
          "agent generated code",
          "Shiki React code block",
        ],
      },
      {
        slug: "approval-card",
        name: "Approval Card",
        nameZh: "审批卡片",
        description:
          "A human-in-the-loop decision surface for approvals, single or multiple-choice questions, custom responses, and multi-step review flows.",
        descriptionZh:
          "人机协同决策面:批准/拒绝/修订,以及单选、多选、自由文本或多步问题;提交后折叠为已记录结果。",
        file: "components/agents/approval-card/index.tsx",
        extraFiles: ["components/agents/approval-card/types.ts"],
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI approval card React",
          "human in the loop UI",
          "agent clarification question",
          "AI multiple choice prompt",
          "approve agent decision",
          "agent review workflow",
        ],
        examples: [
          {
            slug: "questions",
            name: "Questions",
            nameZh: "提问澄清",
            description:
              "Guides the user through single-choice, multiple-choice, and freeform questions before returning the completed response to the agent.",
            descriptionZh:
              "引导用户完成单选、多选与自由文本问题,再把完整回答交回 Agent。",
            file: "components/agents/approval-card/index.tsx",
            previewKey: "blocks/approval-card-question",
            previewFile:
              "components/previews/blocks/approval-card-question.preview.tsx",
          },
          {
            slug: "review",
            name: "Review and Approve",
            nameZh: "审阅批准",
            description:
              "Pauses an agent workflow for approval, revision, or rejection and collapses into the recorded decision.",
            descriptionZh:
              "暂停 Agent 流程等待批准、修订或拒绝,并折叠为已记录的决策结果。",
            file: "components/agents/approval-card/index.tsx",
            previewKey: "blocks/approval-card-review",
            previewFile:
              "components/previews/blocks/approval-card-review.preview.tsx",
          },
        ],
      },
      {
        slug: "file-diff",
        name: "File Diff",
        nameZh: "文件差异",
        description:
          "A syntax-highlighted file change disclosure with progressive rows, line numbers, live change counts, smooth following, and completion collapse.",
        descriptionZh:
          "语法高亮的文件变更披露:渐进行、行号、实时增删计数、有界平滑跟随,完成后可折叠。",
        file: "components/agents/file-diff.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI file diff React",
          "agent code changes UI",
          "streaming diff component",
          "file edit result",
          "code additions deletions",
        ],
      },
      {
        slug: "tool-result",
        name: "Tool Result",
        nameZh: "工具结果",
        description:
          "A lightweight execution disclosure for syntax-highlighted terminal output and request responses that collapses into a compact completed state.",
        descriptionZh:
          "轻量执行披露:语法高亮的终端输出与请求响应、有界自动跟随、成功/错误/取消态,完成后折叠,支持复制与重试。",
        file: "components/agents/tool-result.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI tool result React",
          "agent terminal output UI",
          "streaming command result",
          "agent API response",
          "tool execution status",
        ],
        examples: [
          {
            slug: "terminal-output",
            name: "Terminal Output",
            nameZh: "终端输出",
            description:
              "Streams command output into a bounded viewport, follows new lines, then collapses into the completed run summary.",
            descriptionZh:
              "把命令输出流进有界视口并跟随新行,完成后折叠为运行摘要。",
            file: "components/agents/tool-result.tsx",
            previewKey: "blocks/tool-result-terminal",
            previewFile:
              "components/previews/blocks/tool-result-terminal.preview.tsx",
          },
          {
            slug: "request-result",
            name: "Request Result",
            nameZh: "请求结果",
            description:
              "Presents an in-flight request and its highlighted response payload with retry and copy actions.",
            descriptionZh:
              "展示进行中的请求与高亮响应载荷,并提供重试与复制操作。",
            file: "components/agents/tool-result.tsx",
            previewKey: "blocks/tool-result-request",
            previewFile:
              "components/previews/blocks/tool-result-request.preview.tsx",
          },
        ],
      },
      {
        slug: "streaming-response",
        name: "Streaming Response",
        nameZh: "流式回复",
        description:
          "A stable response surface with completion actions, rendered content, and an expandable source summary.",
        descriptionZh:
          "稳定的流式回答面:完成后复制/重试/反馈、可选可展开来源摘要,以及嵌套 live region 播报控制。",
        file: "components/agents/streaming-response.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI streaming response React",
          "LLM token stream UI",
          "chat response actions",
          "AI response sources",
          "AI answer component",
          "streaming text React",
        ],
      },
      {
        slug: "image-generation",
        name: "Image Generation",
        nameZh: "图像生成",
        description:
          "A stable generated-image surface that moves from queued work through progressive refinement to a completed result without layout shift.",
        descriptionZh:
          "稳定的生成图画面:排队→生成→精修→完成/可恢复错误,逐步解析媒体且不 remount、不挤压周围会话。",
        file: "components/agents/image-generation.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI image generation React",
          "generated image loading UI",
          "AI image progress component",
          "image generation animation",
          "text to image interface",
          "AI media result",
        ],
      },
      {
        slug: "tool-approval",
        name: "Tool Approval",
        nameZh: "工具授权",
        description:
          "A human-in-the-loop permission card for reviewing tool details, allowing once, remembering access, or denying execution.",
        descriptionZh:
          "人机协同权限卡:审阅工具详情与参数、允许一次/始终允许/拒绝,可选 Shiki 高亮代码值。",
        file: "components/agents/tool-approval.tsx",
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI tool approval UI",
          "agent permission component",
          "human in the loop React",
          "approve agent action",
          "AI tool confirmation",
        ],
      },
      {
        slug: "agent-activity",
        name: "Agent Activity",
        nameZh: "Agent 活动流",
        description:
          "One adaptive activity stream for reasoning, searches, tool calls, structured execution traces, or a chronological mix.",
        descriptionZh:
          "自适应 Agent 活动流:推理文本、搜索结果、工具调用、结构化执行轨迹,或按时间混排;进行中有界跟随,完成后折叠为可重开摘要。",
        file: "components/agents/agent-activity/index.tsx",
        extraFiles: [
          "components/agents/agent-activity/activity-row.tsx",
          "components/agents/agent-activity/types.ts",
        ],
        badge: "new",
        launchedAt: "2026-08-07",
        keywords: [
          "AI agent activity component",
          "agent tool calls UI",
          "AI search results React",
          "agent reasoning timeline",
          "mixed agent activity stream",
          "agent execution trace UI",
          "collapsible AI activity",
        ],
        examples: [
          {
            slug: "streaming-text",
            name: "Streaming Text",
            nameZh: "流式文本",
            description:
              "Streams freeform reasoning text into the capped viewport and keeps the completed log available behind a timed disclosure.",
            descriptionZh:
              "把自由推理文本流进有界视口,完成后以计时披露保留完整日志。",
            file: "components/agents/agent-activity/index.tsx",
            previewKey: "blocks/agent-activity-text",
            previewFile:
              "components/previews/blocks/agent-activity-text.preview.tsx",
          },
          {
            slug: "reasoning-steps",
            name: "Reasoning Steps",
            nameZh: "推理步骤",
            description:
              "Shows completed, active, and pending reasoning steps with optional trailing metadata.",
            descriptionZh:
              "展示已完成、进行中与待定的推理步骤,并可附带尾部元数据。",
            file: "components/agents/agent-activity/index.tsx",
            previewKey: "blocks/agent-activity-steps",
            previewFile:
              "components/previews/blocks/agent-activity-steps.preview.tsx",
          },
          {
            slug: "web-search",
            name: "Web Search",
            nameZh: "网页搜索",
            description:
              "Presents a search query, progressively rendered result rows, and an overflow count.",
            descriptionZh:
              "展示搜索查询、逐步渲染的结果行与溢出计数。",
            file: "components/agents/agent-activity/index.tsx",
            previewKey: "blocks/agent-activity-search",
            previewFile:
              "components/previews/blocks/agent-activity-search.preview.tsx",
          },
          {
            slug: "tool-calls",
            name: "Tool Calls",
            nameZh: "工具调用",
            description:
              "Summarizes read, edit, and run events with monospace targets and optional line-change counts.",
            descriptionZh:
              "汇总读/改/运行事件,目标路径等宽展示,可选行变更计数。",
            file: "components/agents/agent-activity/index.tsx",
            previewKey: "blocks/agent-activity-tools",
            previewFile:
              "components/previews/blocks/agent-activity-tools.preview.tsx",
          },
          {
            slug: "mixed-activity",
            name: "Mixed Activity",
            nameZh: "混合活动",
            description:
              "Streams reasoning, search, and tool events in one chronological run while the viewport smoothly follows new work.",
            descriptionZh:
              "在同一时间线混排推理、搜索与工具事件,视口平滑跟随新进度。",
            file: "components/agents/agent-activity/index.tsx",
            previewKey: "blocks/agent-activity-mixed",
            previewFile:
              "components/previews/blocks/agent-activity.preview.tsx",
          },
          {
            slug: "activity-trace",
            name: "Agent Trace",
            nameZh: "执行轨迹",
            description:
              "Streams messages and structured actions into a compact execution ledger, then summarizes the completed run by tool-call and message counts.",
            descriptionZh:
              "把消息与结构化动作流进紧凑执行账本,完成后按工具调用与消息数汇总。",
            file: "components/agents/agent-activity/index.tsx",
            previewKey: "blocks/agent-activity-trace",
            previewFile:
              "components/previews/blocks/agent-activity-trace.preview.tsx",
          },
        ],
      },
      {
        slug: "reasoning-text",
        name: "Reasoning Text",
        nameZh: "推理文案",
        description:
          "Cycling agent-status phrases with an ASCII loader and cascade, swap, or scramble transitions plus a shimmer sweep.",
        descriptionZh:
          "Agent 推理状态文案：ASCII 加载指示配合 cascade / swap / scramble 切换，并带微光扫过。",
        file: "components/agents/loading-states/reasoning-text.tsx",
        extraFiles: ["components/agents/loading-states/text-shimmer-style.ts"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI reasoning text",
          "agent thinking animation",
          "reasoning indicator",
          "LLM loading phrase",
          "推理文案",
          "思考中动画",
        ],
      },
      {
        slug: "agent-progress",
        name: "Agent Progress",
        nameZh: "Agent 进度",
        description:
          "A compact 3×3 activity glyph, action verb, and live tabular timer for longer-running agent work.",
        descriptionZh:
          "紧凑的 Agent 进度指示：3×3 活动格、动作动词与等宽计时。",
        file: "components/agents/loading-states/agent-progress.tsx",
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI agent progress",
          "agent timer",
          "thinking grid",
          "LLM loading indicator",
          "Agent 进度",
          "思考计时",
        ],
      },
      {
        slug: "ai-sidebar",
        name: "AI Sidebar",
        nameZh: "AI 侧栏",
        description:
          "A workspace resource tree for folders, projects, files, and bookmarks with keyboard navigation, optimistic moves, inline rename, and overflow-aware labels.",
        descriptionZh:
          "AI 工作区资源树：文件夹/项目/文件/书签，支持键盘导航、乐观移动、行内重命名与溢出跑马灯标签。",
        file: "components/agents/ai-sidebar.tsx",
        extraFiles: ["lib/hooks/use-touch-capable.ts"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI sidebar React",
          "agent workspace sidebar",
          "draggable resource tree",
          "project file sidebar",
          "AI 侧栏",
          "资源树",
        ],
      },
      {
        slug: "reasoning",
        name: "Reasoning",
        nameZh: "推理披露",
        description:
          "A collapsible reasoning disclosure that stays open while tokens stream, then collapses to a timed thought summary.",
        descriptionZh:
          "可折叠推理披露：流式进行中保持展开，结束后收成「思考了 N 秒」摘要。",
        file: "components/agents/reasoning.tsx",
        extraFiles: ["components/agents/agent-collapsible.tsx"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI reasoning disclosure",
          "thinking summary",
          "collapsible reasoning",
          "LLM thought process",
          "推理披露",
          "思考摘要",
        ],
      },
      {
        slug: "chain-of-thought",
        name: "Chain of Thought",
        nameZh: "思维链",
        description:
          "A step-by-step thought trail with status, search chips, and an optional image caption under a collapsible header.",
        descriptionZh:
          "逐步思维链：完成/进行中/待定步骤、搜索结果芯片，以及可选配图说明。",
        file: "components/agents/chain-of-thought.tsx",
        extraFiles: ["components/agents/agent-collapsible.tsx"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "chain of thought UI",
          "AI reasoning steps",
          "thought trail",
          "LLM step list",
          "思维链",
          "推理步骤",
        ],
      },
      {
        slug: "sources",
        name: "Sources",
        nameZh: "来源列表",
        description:
          "A compact collapsible footer that lists the sources used to write an answer.",
        descriptionZh:
          "答案尾部的可折叠来源列表，展示本次回答用到的出处。",
        file: "components/agents/sources.tsx",
        extraFiles: ["components/agents/agent-collapsible.tsx"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI sources list",
          "answer citations footer",
          "used N sources",
          "LLM references",
          "来源列表",
          "引用出处",
        ],
      },
      {
        slug: "inline-citation",
        name: "Inline Citation",
        nameZh: "行内引用",
        description:
          "Inline citation chips that open a source-preview card with a simple pager, quote, and hostname badge.",
        descriptionZh:
          "行内引用角标：悬停或点击打开带翻页的来源预览卡、摘录与域名徽章。",
        file: "components/agents/inline-citation.tsx",
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "inline citation chip",
          "source preview popover",
          "AI citation badge",
          "行内引用",
          "引用角标",
        ],
      },
      {
        slug: "plan",
        name: "Plan",
        nameZh: "计划卡",
        description:
          "A collapsible plan card with streaming title/description shimmer and room for nested task steps.",
        descriptionZh:
          "可折叠计划卡：流式标题/描述微光，内容区可嵌套任务步骤。",
        file: "components/agents/plan.tsx",
        extraFiles: ["components/agents/agent-collapsible.tsx"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI plan card",
          "agent plan",
          "streaming plan",
          "LLM task plan",
          "计划卡",
          "执行计划",
        ],
      },
      {
        slug: "task",
        name: "Task",
        nameZh: "任务步骤",
        description:
          "A collapsible task step with a search-style trigger, file chips, and a left-ruled detail list.",
        descriptionZh:
          "可折叠任务步骤：搜索式触发器、文件芯片与左侧竖线明细。",
        file: "components/agents/task.tsx",
        extraFiles: ["components/agents/agent-collapsible.tsx"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI task step",
          "agent task disclosure",
          "file chip",
          "任务步骤",
          "工具步骤",
        ],
      },
      {
        slug: "queue",
        name: "Queue",
        nameZh: "待办队列",
        description:
          "A queued follow-up list with collapsible sections, completion marks, attachments, and hover actions.",
        descriptionZh:
          "待办/排队跟进列表：可折叠分组、完成态、附件与悬停操作。",
        file: "components/agents/queue.tsx",
        extraFiles: ["components/agents/agent-collapsible.tsx"],
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI message queue",
          "queued follow-ups",
          "agent todo queue",
          "待办队列",
          "排队消息",
        ],
      },
      {
        slug: "confirmation",
        name: "Confirmation",
        nameZh: "确认条",
        description:
          "A human-in-the-loop confirmation strip that swaps request, accepted, and rejected slots from approval state.",
        descriptionZh:
          "人机协同确认条：按审批状态切换请求 / 已允许 / 已拒绝插槽。",
        file: "components/agents/confirmation.tsx",
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI confirmation",
          "tool approval strip",
          "human in the loop",
          "确认条",
          "工具确认",
        ],
      },
      {
        slug: "suggestion",
        name: "Suggestion",
        nameZh: "建议芯片",
        description:
          "A horizontal row of follow-up prompt chips that call back with the selected suggestion.",
        descriptionZh:
          "横向建议芯片：点击把选中的后续提示交回输入台。",
        file: "components/agents/suggestion.tsx",
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "AI suggestion chips",
          "follow-up prompts",
          "chat suggestions",
          "建议芯片",
          "后续提示",
        ],
      },
      {
        slug: "jsx-preview",
        name: "JSX Preview",
        nameZh: "JSX 预览",
        description:
          "A streaming-safe allowlisted JSX/HTML preview that completes unfinished tags while tokens arrive.",
        descriptionZh:
          "流式安全的 JSX/HTML 预览：白名单标签，流式未闭合标签会先补全再渲染。",
        file: "components/agents/jsx-preview.tsx",
        badge: "new",
        launchedAt: "2026-08-27",
        keywords: [
          "JSX preview",
          "streaming JSX",
          "generated UI preview",
          "JSX 预览",
          "生成界面预览",
        ],
      },
      {
        slug: "collapsible-sidebar",
        name: "Collapsible Sidebar",
        nameZh: "可折叠侧栏",
        description:
          "A multi-level workspace nav that springs between an expanded tree and an icon rail, with nested folders, count badges, and fading labels. Pattern inspired by @startupvisuals / Startup Visuals; original implementation.",
        descriptionZh:
          "多级工作区导航：在展开树与图标轨之间弹簧切换，支持嵌套文件夹、计数徽章与标签淡出。模式受 @startupvisuals / Startup Visuals 启发，实现为原创。",
        file: "components/motion/collapsible-sidebar.tsx",
        badge: "new",
        launchedAt: "2026-08-31",
        keywords: [
          "collapsible sidebar react",
          "icon rail navigation",
          "workspace sidebar",
          "nested nav tree",
          "可折叠侧栏",
          "图标轨导航",
        ],
      },
      {
        slug: "upgrade-paywall",
        name: "Upgrade Paywall",
        nameZh: "升级付费墙",
        description:
          "A product paywall that blurs and desaturates the page underneath, then pops in a centered upgrade card. Pattern inspired by @startupvisuals / Startup Visuals; original implementation.",
        descriptionZh:
          "产品内付费墙：底层内容模糊并降饱和，中央升级卡片弹出。模式受 @startupvisuals / Startup Visuals 启发，实现为原创。",
        file: "components/motion/upgrade-paywall.tsx",
        badge: "new",
        launchedAt: "2026-08-31",
        keywords: [
          "upgrade paywall react",
          "feature gate overlay",
          "blurred content lock",
          "升级付费墙",
          "功能门禁",
        ],
      },
      {
        slug: "view-layout-switch",
        name: "View Layout Switch",
        nameZh: "视图布局切换",
        description:
          "A shared-layout switcher for List, Kanban, Gantt, Calendar, and Dashboard, as a sliding-pill tab strip or a compact menu. Pattern inspired by @startupvisuals / Startup Visuals; original implementation.",
        descriptionZh:
          "List / Kanban / Gantt / Calendar / Dashboard 的共享布局切换器，提供滑动胶囊页签或紧凑菜单。模式受 @startupvisuals / Startup Visuals 启发，实现为原创。",
        file: "components/motion/view-layout-switch.tsx",
        badge: "new",
        launchedAt: "2026-08-31",
        keywords: [
          "view layout switch react",
          "kanban gantt calendar toggle",
          "sliding pill tabs",
          "视图布局切换",
          "看板甘特切换",
        ],
      },
      {
        slug: "billing-plan-grid",
        name: "Billing Plan Grid",
        nameZh: "账单方案网格",
        description:
          "An organization billing grid with Free / Pro / Enterprise columns, a monthly↔annual toggle, current-plan highlight, and a number morph on price. Pattern inspired by @startupvisuals / Startup Visuals; original implementation.",
        descriptionZh:
          "组织账单方案网格：Free / Pro / Enterprise 三列、月付与年付切换、当前方案高亮，价格数字滚动变形。模式受 @startupvisuals / Startup Visuals 启发，实现为原创。",
        file: "components/motion/billing-plan-grid.tsx",
        extraFiles: ["components/motion/number-ticker.tsx"],
        badge: "new",
        launchedAt: "2026-08-31",
        keywords: [
          "billing plan grid react",
          "pricing table monthly annual",
          "current plan highlight",
          "账单方案网格",
          "月付年付定价",
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
