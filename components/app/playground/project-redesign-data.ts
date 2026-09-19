import { DENSITIES, RADII, SHADOWS, TYPE_SCALE } from "@/lib/atoms";
import { PALETTES } from "@/lib/palettes";

export type GroupId =
  | "actions"
  | "inputs"
  | "feedback"
  | "nav"
  | "display"
  | "blocks";

export type PieceId =
  | "button"
  | "button-stateful"
  | "button-magnetic"
  | "input"
  | "select"
  | "switch"
  | "checkbox"
  | "radio"
  | "range-slider"
  | "otp-input"
  | "animated-badge"
  | "loader"
  | "skeleton"
  | "tooltip"
  | "tabs"
  | "theme-toggle"
  | "scroll-hint"
  | "tilt-card"
  | "glare-hover"
  | "star-border"
  | "marquee"
  | "number-ticker"
  | "text-scramble"
  | "animated-icon"
  | "suggestion"
  | "empty-state";

export type ColorId = "graphite" | "morandi" | "dopamine" | "earth" | "luxe";

export type SystemState = {
  radius: string;
  shadow: string;
  color: ColorId;
  density: string;
  type: string;
};

export type Piece = {
  id: PieceId;
  group: GroupId;
  category: "motion" | "blocks";
  registrySlug: string;
  installSlug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  notNeighborZh: string;
  notNeighborEn: string;
};

export const GROUPS: readonly {
  id: GroupId;
  name: string;
  nameZh: string;
}[] = [
  { id: "actions", name: "Actions", nameZh: "动作" },
  { id: "inputs", name: "Inputs", nameZh: "输入" },
  { id: "feedback", name: "Feedback", nameZh: "反馈" },
  { id: "nav", name: "Navigation", nameZh: "导航" },
  { id: "display", name: "Display", nameZh: "展示" },
  { id: "blocks", name: "Blocks", nameZh: "区块" },
];

export const PIECES: readonly Piece[] = [
  {
    id: "button",
    group: "actions",
    category: "motion",
    registrySlug: "button",
    installSlug: "button-base",
    name: "Button",
    nameZh: "按钮",
    aliases: ["按键", "CTA", "press button"],
    notNeighborZh: "磁吸按钮（跟随指针）或状态按钮（异步过程）",
    notNeighborEn: "Magnetic Button (cursor pull) or Stateful Button (async process)",
  },
  {
    id: "button-stateful",
    group: "actions",
    category: "motion",
    registrySlug: "button",
    installSlug: "button-stateful",
    name: "Stateful Button",
    nameZh: "状态按钮",
    aliases: ["过程按钮", "loading button"],
    notNeighborZh: "基础按钮——这是闲/载/成/败，不是一次按压",
    notNeighborEn: "Button — this is idle/loading/success/error, not a single press",
  },
  {
    id: "button-magnetic",
    group: "actions",
    category: "motion",
    registrySlug: "button",
    installSlug: "button-magnetic",
    name: "Magnetic Button",
    nameZh: "磁吸按钮",
    aliases: ["跟随按钮", "magnetic"],
    notNeighborZh: "基础按钮——这是指针吸引，不是按压缩放",
    notNeighborEn: "Button — this is cursor attraction, not press scale",
  },
  {
    id: "input",
    group: "inputs",
    category: "motion",
    registrySlug: "input",
    installSlug: "input",
    name: "Input",
    nameZh: "输入框",
    aliases: ["文本框", "text field"],
    notNeighborZh: "下拉选择（封闭选项）或提示输入（对话输入台）",
    notNeighborEn: "Select (closed options) or Prompt Input (chat composer)",
  },
  {
    id: "select",
    group: "inputs",
    category: "motion",
    registrySlug: "select",
    installSlug: "select",
    name: "Select",
    nameZh: "下拉选择器",
    aliases: ["选择器", "dropdown select"],
    notNeighborZh: "下拉菜单（动作列表）或命令面板（搜命令）",
    notNeighborEn: "Dropdown Menu (actions) or Command Palette (search commands)",
  },
  {
    id: "switch",
    group: "inputs",
    category: "motion",
    registrySlug: "switch",
    installSlug: "switch",
    name: "Switch",
    nameZh: "开关",
    aliases: ["切换", "toggle"],
    notNeighborZh: "复选框——立刻生效的偏好，不是表单多项勾选",
    notNeighborEn: "Checkbox — instant preference, not a form multi-select",
  },
  {
    id: "checkbox",
    group: "inputs",
    category: "motion",
    registrySlug: "checkbox",
    installSlug: "checkbox",
    name: "Checkbox",
    nameZh: "复选框",
    aliases: ["勾选", "tick"],
    notNeighborZh: "开关（立刻切换）或单选（互斥一组）",
    notNeighborEn: "Switch (instant toggle) or Radio (exclusive set)",
  },
  {
    id: "radio",
    group: "inputs",
    category: "motion",
    registrySlug: "radio",
    installSlug: "radio",
    name: "Radio",
    nameZh: "单选",
    aliases: ["互斥选项", "radio group"],
    notNeighborZh: "复选框——互斥一组，不是多选",
    notNeighborEn: "Checkbox — exclusive set, not multi-select",
  },
  {
    id: "range-slider",
    group: "inputs",
    category: "motion",
    registrySlug: "range-slider",
    installSlug: "range-slider",
    name: "Range Slider",
    nameZh: "范围滑杆",
    aliases: ["滑块", "slider"],
    notNeighborZh: "数字输入——连续/分档滑，不是键入数字",
    notNeighborEn: "Number input — slide a range, don't type a digit",
  },
  {
    id: "otp-input",
    group: "inputs",
    category: "blocks",
    registrySlug: "otp-input",
    installSlug: "otp-input",
    name: "OTP Input",
    nameZh: "验证码输入",
    aliases: ["一次性密码", "PIN slots"],
    notNeighborZh: "输入框——格子验证码，不是单行文本",
    notNeighborEn: "Input — slotted code, not a single text field",
  },
  {
    id: "animated-badge",
    group: "feedback",
    category: "motion",
    registrySlug: "animated-badge",
    installSlug: "animated-badge",
    name: "Animated Badge",
    nameZh: "动效徽章",
    aliases: ["状态徽标", "chip"],
    notNeighborZh: "吐司——贴在现场的状态，不是会自己走的通知",
    notNeighborEn: "Toast — stays on the surface, does not walk away",
  },
  {
    id: "loader",
    group: "feedback",
    category: "motion",
    registrySlug: "loader",
    installSlug: "loader",
    name: "Loader",
    nameZh: "加载器",
    aliases: ["转圈", "spinner"],
    notNeighborZh: "骨架屏——过程还在转，不是占位形状",
    notNeighborEn: "Skeleton — the process is spinning, not a placeholder shape",
  },
  {
    id: "skeleton",
    group: "feedback",
    category: "motion",
    registrySlug: "skeleton",
    installSlug: "skeleton",
    name: "Skeleton",
    nameZh: "骨架屏",
    aliases: ["占位", "shimmer"],
    notNeighborZh: "加载器——内容形状的占位，不是转圈",
    notNeighborEn: "Loader — a content-shaped placeholder, not a spinner",
  },
  {
    id: "tooltip",
    group: "feedback",
    category: "motion",
    registrySlug: "tooltip",
    installSlug: "tooltip",
    name: "Tooltip",
    nameZh: "提示气泡",
    aliases: ["悬停提示", "hint"],
    notNeighborZh: "弹出层——短提示，里面不能操作",
    notNeighborEn: "Popover — a short hint, not an interactive layer",
  },
  {
    id: "tabs",
    group: "nav",
    category: "motion",
    registrySlug: "tabs",
    installSlug: "tabs",
    name: "Tabs",
    nameZh: "选项卡",
    aliases: ["页签", "segmented control"],
    notNeighborZh: "手风琴或可展开页签——同级切换，不是挤开空间",
    notNeighborEn: "Accordion / Expandable Tabs — peer switch, not space-splitting",
  },
  {
    id: "theme-toggle",
    group: "nav",
    category: "motion",
    registrySlug: "theme-toggle",
    installSlug: "theme-toggle",
    name: "Theme Toggle",
    nameZh: "主题切换",
    aliases: ["日夜开关", "dark mode toggle"],
    notNeighborZh: "开关——换日夜主题，不是通用布尔",
    notNeighborEn: "Switch — day/night theme, not a generic boolean",
  },
  {
    id: "scroll-hint",
    group: "nav",
    category: "motion",
    registrySlug: "scroll-hint",
    installSlug: "scroll-hint",
    name: "Scroll Hint",
    nameZh: "滚动提示",
    aliases: ["向下看", "scroll cue"],
    notNeighborZh: "滚动进度——提示下面还有，不是读了多少",
    notNeighborEn: "Scroll Progress — more below, not how far you've read",
  },
  {
    id: "tilt-card",
    group: "display",
    category: "motion",
    registrySlug: "tilt-card",
    installSlug: "tilt-card",
    name: "Tilt Card",
    nameZh: "3D 倾斜卡片",
    aliases: ["透视倾", "tilt"],
    notNeighborZh: "高光扫过——3D 倾斜，不是一层光扫",
    notNeighborEn: "Glare Hover — 3D tilt, not a light sweep",
  },
  {
    id: "glare-hover",
    group: "display",
    category: "motion",
    registrySlug: "glare-hover",
    installSlug: "glare-hover",
    name: "Glare Hover",
    nameZh: "高光扫过",
    aliases: ["光扫", "sheen"],
    notNeighborZh: "倾斜卡片——光扫过表面，不是透视倾",
    notNeighborEn: "Tilt Card — a sheen across the face, not perspective tilt",
  },
  {
    id: "star-border",
    group: "display",
    category: "motion",
    registrySlug: "star-border",
    installSlug: "star-border",
    name: "Star Border",
    nameZh: "星轨描边",
    aliases: ["走边光", "orbiting border"],
    notNeighborZh: "高光扫过——边上走一圈光，不是表面扫过",
    notNeighborEn: "Glare Hover — light travels the rim, not the face",
  },
  {
    id: "marquee",
    group: "display",
    category: "motion",
    registrySlug: "marquee",
    installSlug: "marquee",
    name: "Marquee",
    nameZh: "跑马灯",
    aliases: ["无限滚", "ticker"],
    notNeighborZh: "文字动画——轨道循环，不是字本身变形",
    notNeighborEn: "Text Animation — a looping track, not glyph morphing",
  },
  {
    id: "number-ticker",
    group: "display",
    category: "motion",
    registrySlug: "number",
    installSlug: "number",
    name: "Number Ticker",
    nameZh: "数字翻滚",
    aliases: ["计数器", "odometer"],
    notNeighborZh: "文字扰乱——数字翻格，不是解码乱码",
    notNeighborEn: "Text Scramble — digits roll, they don't decode",
  },
  {
    id: "text-scramble",
    group: "display",
    category: "motion",
    registrySlug: "text-scramble",
    installSlug: "text-scramble",
    name: "Text Scramble",
    nameZh: "文字扰乱",
    aliases: ["解码字", "decrypted text"],
    notNeighborZh: "跑马灯——字解码成形，不是轨道滚",
    notNeighborEn: "Marquee — glyphs decode in place, they don't scroll",
  },
  {
    id: "animated-icon",
    group: "display",
    category: "motion",
    registrySlug: "animated-icon",
    installSlug: "animated-icon",
    name: "Animated Icon",
    nameZh: "动效图标",
    aliases: ["图标微交互", "icon motion"],
    notNeighborZh: "图标样式——这是动法，不是线/面风格",
    notNeighborEn: "Icon style — this is the motion, not outline vs solid",
  },
  {
    id: "suggestion",
    group: "blocks",
    category: "blocks",
    registrySlug: "suggestion",
    installSlug: "suggestion",
    name: "Suggestion",
    nameZh: "建议条",
    aliases: ["快捷建议", "chip suggestions"],
    notNeighborZh: "命令面板——点一条建议，不是搜全部命令",
    notNeighborEn: "Command Palette — tap one suggestion, don't search all commands",
  },
  {
    id: "empty-state",
    group: "blocks",
    category: "blocks",
    registrySlug: "empty-state",
    installSlug: "empty-state",
    name: "Empty State",
    nameZh: "空状态",
    aliases: ["无内容", "inbox zero"],
    notNeighborZh: "骨架屏——真的没有内容，不是正在加载",
    notNeighborEn: "Skeleton — truly empty, not still loading",
  },
];

export const DEFAULT_SYSTEM: SystemState = {
  radius: "md",
  shadow: "raised",
  color: "graphite",
  density: "standard",
  type: "body-sm",
};

export const NAMED_PRESETS: readonly {
  slug: string;
  name: string;
  nameEn: string;
  state: SystemState;
}[] = [
  {
    slug: "graphite",
    name: "石墨",
    nameEn: "Graphite",
    state: {
      radius: "md",
      shadow: "raised",
      color: "graphite",
      density: "standard",
      type: "body-sm",
    },
  },
  {
    slug: "morandi",
    name: "莫兰迪",
    nameEn: "Morandi",
    state: {
      radius: "lg",
      shadow: "hairline",
      color: "morandi",
      density: "comfortable",
      type: "body",
    },
  },
  {
    slug: "dopamine",
    name: "多巴胺",
    nameEn: "Dopamine",
    state: {
      radius: "xl",
      shadow: "floating",
      color: "dopamine",
      density: "standard",
      type: "body-sm",
    },
  },
  {
    slug: "earth",
    name: "大地",
    nameEn: "Earth",
    state: {
      radius: "sm",
      shadow: "raised",
      color: "earth",
      density: "compact",
      type: "caption",
    },
  },
  {
    slug: "luxe",
    name: "暗金",
    nameEn: "Dark Luxe",
    state: {
      radius: "2xl",
      shadow: "prominent",
      color: "luxe",
      density: "comfortable",
      type: "body",
    },
  },
];

const COLOR_PALETTE_SLUG: Record<Exclude<ColorId, "graphite">, string> = {
  morandi: "morandi",
  dopamine: "dopamine",
  earth: "earth",
  luxe: "dark-luxe",
};

function paletteFor(color: ColorId) {
  if (color === "graphite") return undefined;
  return PALETTES.find((entry) => entry.slug === COLOR_PALETTE_SLUG[color]);
}

export const COLOR_OPTIONS: readonly { id: ColorId; name: string; nameEn: string }[] = [
  { id: "graphite", name: "石墨", nameEn: "Graphite" },
  { id: "morandi", name: "莫兰迪", nameEn: "Morandi" },
  { id: "dopamine", name: "多巴胺", nameEn: "Dopamine" },
  { id: "earth", name: "大地", nameEn: "Earth" },
  { id: "luxe", name: "暗金", nameEn: "Dark Luxe" },
];

export const TYPE_KNOBS = TYPE_SCALE.filter((entry) =>
  entry.slug === "caption" ||
  entry.slug === "body-sm" ||
  entry.slug === "body" ||
  entry.slug === "title",
);

export function findPiece(id: string): Piece | undefined {
  return PIECES.find((piece) => piece.id === id);
}

export function piecesInGroup(group: GroupId): Piece[] {
  return PIECES.filter((piece) => piece.group === group);
}

export function matchingPreset(state: SystemState): string | undefined {
  return NAMED_PRESETS.find(
    (preset) =>
      preset.state.radius === state.radius &&
      preset.state.shadow === state.shadow &&
      preset.state.color === state.color &&
      preset.state.density === state.density &&
      preset.state.type === state.type,
  )?.slug;
}

export function parseSystem(params: URLSearchParams): SystemState {
  const named = NAMED_PRESETS.find((preset) => preset.slug === params.get("preset"));
  if (named && !params.get("r") && !params.get("c")) return named.state;
  return {
    radius: RADII.some((entry) => entry.slug === params.get("r"))
      ? (params.get("r") ?? DEFAULT_SYSTEM.radius)
      : DEFAULT_SYSTEM.radius,
    shadow: SHADOWS.some((entry) => entry.slug === params.get("s"))
      ? (params.get("s") ?? DEFAULT_SYSTEM.shadow)
      : DEFAULT_SYSTEM.shadow,
    color: COLOR_OPTIONS.some((entry) => entry.id === params.get("c"))
      ? (params.get("c") as ColorId)
      : DEFAULT_SYSTEM.color,
    density: DENSITIES.some((entry) => entry.slug === params.get("d"))
      ? (params.get("d") ?? DEFAULT_SYSTEM.density)
      : DEFAULT_SYSTEM.density,
    type: TYPE_KNOBS.some((entry) => entry.slug === params.get("t"))
      ? (params.get("t") ?? DEFAULT_SYSTEM.type)
      : DEFAULT_SYSTEM.type,
  };
}

export function systemSearch(state: SystemState, focus?: PieceId): string {
  const named = matchingPreset(state);
  const params = new URLSearchParams();
  if (named) {
    params.set("preset", named);
  } else {
    params.set("r", state.radius);
    params.set("s", state.shadow);
    params.set("c", state.color);
    params.set("d", state.density);
    params.set("t", state.type);
  }
  if (focus) params.set("focus", focus);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function tokenBlock(state: SystemState, dark: boolean): string {
  const radius = RADII.find((entry) => entry.slug === state.radius);
  const shadow = SHADOWS.find((entry) => entry.slug === state.shadow);
  const density = DENSITIES.find((entry) => entry.slug === state.density);
  const type = TYPE_SCALE.find((entry) => entry.slug === state.type);
  const palette = paletteFor(state.color);
  const shadowValue = shadow
    ? dark || state.color === "luxe"
      ? shadow.dark
      : shadow.light
    : "";
  const lines = [
    `--radius: ${radius?.value ?? ""};`,
    `--shadow: ${shadowValue};`,
    `--row-height: ${density?.rowHeight ?? ""}px;`,
    `--control-padding: ${density?.padding ?? ""}px;`,
    `--type-size: ${type?.fontSize ?? ""};`,
  ];
  if (palette) {
    lines.push(`--background: ${palette.colors.bg};`);
    lines.push(`--foreground: ${palette.colors.text};`);
    lines.push(`--card: ${palette.colors.surface};`);
    lines.push(`--primary: ${palette.colors.primary};`);
    lines.push(`--border: ${palette.colors.border};`);
  } else {
    lines.push("/* graphite: inherit site tokens */");
  }
  return lines.join("\n");
}

export function systemStyle(
  state: SystemState,
  dark: boolean,
): Record<string, string> {
  const radius = RADII.find((entry) => entry.slug === state.radius);
  const shadow = SHADOWS.find((entry) => entry.slug === state.shadow);
  const density = DENSITIES.find((entry) => entry.slug === state.density);
  const type = TYPE_SCALE.find((entry) => entry.slug === state.type);
  const palette = paletteFor(state.color);
  const vars: Record<string, string> = {
    "--pr-radius": radius?.value ?? "10px",
    "--pr-shadow":
      shadow == null
        ? "none"
        : dark || state.color === "luxe"
          ? shadow.dark
          : shadow.light,
    "--pr-pad": `${density?.padding ?? 12}px`,
    "--pr-gap": `${density?.padding ?? 12}px`,
    "--pr-row": `${density?.rowHeight ?? 40}px`,
    "--pr-type-size": type?.fontSize ?? "14px",
    "--pr-type-leading": String(type?.lineHeight ?? 1.5),
  };
  if (palette) {
    const c = palette.colors;
    vars["--background"] = c.bg;
    vars["--foreground"] = c.text;
    vars["--card"] = c.surface;
    vars["--card-foreground"] = c.text;
    vars["--primary"] = c.primary;
    vars["--primary-foreground"] = c.primaryFg;
    vars["--border"] = c.border;
    vars["--muted-foreground"] = c.muted;
    vars["--accent"] = c.accent;
    vars["--accent-foreground"] = c.text;
    vars["--popover"] = c.surface;
    vars["--popover-foreground"] = c.text;
    vars["--secondary"] = c.surface;
    vars["--secondary-foreground"] = c.text;
    vars["--muted"] = c.surface;
    vars["--input"] = c.border;
    vars["--ring"] = c.border;
  }
  return vars;
}
