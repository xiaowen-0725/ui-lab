import type { DensityAtom, SpacingAtom } from "@/lib/atoms/types";

export const SPACING_SCALE: readonly SpacingAtom[] = [
  {
    slug: "micro",
    name: "Micro",
    nameZh: "微隙",
    aliases: ["icon gap", "图标间距", "badge inset", "徽章内距"],
    whenUse: "Between an icon and its label, or inside a badge.",
    whenUseZh: "图标与文字之间，或徽章内。",
    pixels: 4,
  },
  {
    slug: "tight",
    name: "Tight",
    nameZh: "紧凑",
    aliases: ["chip padding", "chip 内边距", "compact control", "紧凑控件"],
    whenUse: "Chip padding and compact controls.",
    whenUseZh: "chip 内边距与紧凑控件。",
    pixels: 8,
  },
  {
    slug: "element",
    name: "Element",
    nameZh: "元素",
    aliases: ["control gap", "控件间距", "sibling gap", "相邻间距"],
    whenUse: "Between adjacent controls.",
    whenUseZh: "相邻控件之间。",
    pixels: 12,
  },
  {
    slug: "base",
    name: "Base",
    nameZh: "基础",
    aliases: ["card padding", "卡片内边距", "default inset", "默认内距"],
    whenUse: "The default padding inside a card.",
    whenUseZh: "卡片内边距的默认值。",
    pixels: 16,
  },
  {
    slug: "group",
    name: "Group",
    nameZh: "组距",
    aliases: ["group gap", "组内间距", "cluster gap", "簇间距"],
    whenUse: "Separation within a related group.",
    whenUseZh: "组内区隔。",
    pixels: 24,
  },
  {
    slug: "block",
    name: "Block",
    nameZh: "区块",
    aliases: ["block gap", "区块间距", "large gap", "大间隔"],
    whenUse: "Large gaps inside a content block.",
    whenUseZh: "区块内大间隔。",
    pixels: 32,
  },
  {
    slug: "section",
    name: "Section",
    nameZh: "小节",
    aliases: ["section gap", "小节间距", "content section", "内容小节"],
    whenUse: "Between sections on the same page.",
    whenUseZh: "小节之间。",
    pixels: 48,
  },
  {
    slug: "region",
    name: "Region",
    nameZh: "大区",
    aliases: ["page region", "页面大区", "major gap", "大区间距"],
    whenUse: "Between major page regions.",
    whenUseZh: "页面大区之间。",
    pixels: 64,
  },
] as const;

export const DENSITIES: readonly DensityAtom[] = [
  {
    slug: "compact",
    name: "Compact",
    nameZh: "紧凑",
    aliases: ["dense", "高密度", "32px row", "32px 行高"],
    whenUse: "Dense tools and scan-heavy tables.",
    whenUseZh: "高密度工具与需要快速扫读的表格。",
    rowHeight: 32,
    padding: 8,
  },
  {
    slug: "standard",
    name: "Standard",
    nameZh: "标准",
    aliases: ["default density", "默认密度", "40px row", "40px 行高"],
    whenUse: "The default density for general product interfaces.",
    whenUseZh: "通用产品界面的默认密度。",
    rowHeight: 40,
    padding: 12,
  },
  {
    slug: "comfortable",
    name: "Comfortable",
    nameZh: "舒适",
    aliases: ["relaxed", "宽松密度", "48px row", "48px 行高"],
    whenUse: "Touch-friendly and reading-led interfaces.",
    whenUseZh: "触控友好与阅读优先的界面。",
    rowHeight: 48,
    padding: 16,
  },
] as const;

export function spacingCssValue(pixels: number): string {
  return `${pixels}px`;
}
