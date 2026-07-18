import type { LineAtom } from "@/lib/atoms/types";

export const LINES: readonly LineAtom[] = [
  {
    slug: "divider",
    name: "Divider",
    nameZh: "分隔线",
    aliases: ["row separator", "行分隔", "weak line", "弱线"],
    whenUse: "Between list rows as the weakest structural line.",
    whenUseZh: "列表行之间，最弱的一级。",
    property: "border",
    light: "1px solid rgb(0 0 0 / 0.05)",
    dark: "1px solid rgb(255 255 255 / 0.06)",
  },
  {
    slug: "border",
    name: "Border",
    nameZh: "边框",
    aliases: ["control border", "控件描边", "default line", "常规线"],
    whenUse: "The regular outline for controls.",
    whenUseZh: "常规控件描边。",
    property: "border",
    light: "1px solid rgb(0 0 0 / 0.1)",
    dark: "1px solid rgb(255 255 255 / 0.1)",
  },
  {
    slug: "border-strong",
    name: "Strong Border",
    nameZh: "强边框",
    aliases: ["active border", "激活边框", "hover input", "输入框 hover"],
    whenUse: "Frames that must stand up, such as hovered inputs and active cards.",
    whenUseZh: "需要立住的框，例如输入框 hover 与激活卡。",
    property: "border",
    light: "1px solid rgb(0 0 0 / 0.15)",
    dark: "1px solid rgb(255 255 255 / 0.15)",
  },
  {
    slug: "hairline-ring",
    name: "Hairline Ring",
    nameZh: "发丝环",
    aliases: ["shadow border", "阴影描边", "0.5px ring", "0.5px 环"],
    whenUse: "Flush hierarchy; the preferred border replacement without layout cost.",
    whenUseZh: "贴面层级，替代边框的首选，不占布局。",
    property: "box-shadow",
    light: "0 0 0 0.5px rgb(0 0 0 / 0.08)",
    dark: "0 0 0 0.5px rgb(255 255 255 / 0.157)",
  },
  {
    slug: "focus-ring",
    name: "Focus Ring",
    nameZh: "焦点环",
    aliases: ["keyboard focus", "键盘焦点", "a11y ring", "可达性焦点"],
    whenUse: "The required keyboard-focus treatment for interactive controls.",
    whenUseZh: "键盘可达性的规定动作。",
    property: "outline",
    light: "2px solid color-mix(in srgb, var(--accent) 55%, transparent)",
    dark: "2px solid color-mix(in srgb, var(--accent) 55%, transparent)",
    offset: "2px",
  },
] as const;

export function lineCssValue(entry: LineAtom, scheme: "light" | "dark"): string {
  const declaration = `${entry.property}: ${entry[scheme]};`;
  return entry.offset ? `${declaration}\noutline-offset: ${entry.offset};` : declaration;
}
