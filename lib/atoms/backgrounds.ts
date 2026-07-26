import type { BackgroundAtom, BackgroundFadeAtom } from "@/lib/atoms/types";

export const BACKGROUNDS: readonly BackgroundAtom[] = [
  {
    slug: "grid",
    name: "Grid",
    nameZh: "网格线",
    aliases: ["方格", "栅格", "graph paper", "blueprint grid"],
    whenUse: "For dashboard and technical backdrops.",
    whenUseZh: "仪表盘、技术感底纹。",
    light:
      "background-image: linear-gradient(rgb(0 0 0 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / 0.06) 1px, transparent 1px); background-size: 24px 24px;",
    dark: "background-image: linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px); background-size: 24px 24px;",
  },
  {
    slug: "dots",
    name: "Dot Matrix",
    nameZh: "点阵",
    aliases: ["圆点", "dotted", "polka", "波点"],
    whenUse: "For airy empty states and card backgrounds.",
    whenUseZh: "轻盈的空态与卡片底。",
    light:
      "background-image: radial-gradient(rgb(0 0 0 / 0.12) 1px, transparent 1.5px); background-size: 20px 20px;",
    dark: "background-image: radial-gradient(rgb(255 255 255 / 0.14) 1px, transparent 1.5px); background-size: 20px 20px;",
  },
  {
    slug: "halftone-fine",
    name: "Halftone Fine",
    nameZh: "细网点",
    aliases: ["网点", "halftone", "印刷网点", "丝印", "screen tone"],
    whenUse:
      "As a whole-surface print grain that stays texture rather than pattern — it should read as paper, not polka dots.",
    whenUseZh: "作为整面印刷底纹，只读成纸的质感而非图案。",
    light:
      "background-image: radial-gradient(circle, rgb(0 0 0 / 0.26) 0.55px, transparent 1.05px); background-size: 5px 5px;",
    dark: "background-image: radial-gradient(circle, rgb(255 255 255 / 0.32) 0.55px, transparent 1.05px); background-size: 5px 5px;",
  },
  {
    slug: "halftone-med",
    name: "Halftone Medium",
    nameZh: "中网点",
    aliases: ["网点", "halftone", "印刷网点", "riso", "报纸网点"],
    whenUse:
      "The default print screen — coarse enough to see the dots, fine enough to sit under body copy.",
    whenUseZh: "默认的印刷网点：看得见点，又压得住正文。",
    light:
      "background-image: radial-gradient(circle, rgb(0 0 0 / 0.36) 0.7px, transparent 1.25px); background-size: 7px 7px;",
    dark: "background-image: radial-gradient(circle, rgb(255 255 255 / 0.45) 0.7px, transparent 1.25px); background-size: 7px 7px;",
  },
  {
    slug: "halftone-coarse",
    name: "Halftone Coarse",
    nameZh: "粗网点",
    aliases: ["网点", "halftone", "印刷网点", "丝网", "newsprint"],
    whenUse:
      "For editorial art direction where the screen itself is the statement — behind display headings and hero art.",
    whenUseZh: "网点本身就是主张的编辑风场景：大标题与 hero 图背后。",
    light:
      "background-image: radial-gradient(circle, rgb(0 0 0 / 0.46) 1.1px, transparent 1.7px); background-size: 11px 11px;",
    dark: "background-image: radial-gradient(circle, rgb(255 255 255 / 0.55) 1.1px, transparent 1.7px); background-size: 11px 11px;",
  },
  {
    slug: "blueprint",
    name: "Blueprint",
    nameZh: "蓝图",
    aliases: ["图纸", "工程网格", "双层网格", "cad"],
    whenUse: "For engineering and technical narratives.",
    whenUseZh: "工程与技术叙事。",
    light:
      "background-color: #f4f7fb; background-image: linear-gradient(rgb(37 99 235 / 0.10) 1px, transparent 1px), linear-gradient(90deg, rgb(37 99 235 / 0.10) 1px, transparent 1px), linear-gradient(rgb(37 99 235 / 0.20) 1px, transparent 1px), linear-gradient(90deg, rgb(37 99 235 / 0.20) 1px, transparent 1px); background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;",
    dark: "background-color: #0b1220; background-image: linear-gradient(rgb(37 99 235 / 0.16) 1px, transparent 1px), linear-gradient(90deg, rgb(37 99 235 / 0.16) 1px, transparent 1px), linear-gradient(rgb(37 99 235 / 0.28) 1px, transparent 1px), linear-gradient(90deg, rgb(37 99 235 / 0.28) 1px, transparent 1px); background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;",
  },
  {
    slug: "noise",
    name: "Noise Grain",
    nameZh: "噪点颗粒",
    aliases: ["颗粒", "grain", "film noise", "磨砂"],
    whenUse: "As an overlay that removes digital flatness and adds texture.",
    whenUseZh: "作为去塑料感、增加质感的叠加层。",
    light:
      `background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>"); background-size: 120px 120px;`,
    dark:
      `background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.10'/></svg>"); background-size: 120px 120px;`,
  },
  {
    slug: "mesh",
    name: "Mesh Gradient",
    nameZh: "网状渐变",
    aliases: ["mesh gradient", "弥散光", "多色渐变", "aurora 静态"],
    whenUse: "For a soft atmospheric backdrop behind heroes and landing pages.",
    whenUseZh: "hero 与落地页的柔和氛围底。",
    light:
      "background-color: #fafafa; background-image: radial-gradient(at 18% 22%, rgb(99 102 241 / 0.18), transparent 50%), radial-gradient(at 82% 28%, rgb(236 72 153 / 0.15), transparent 48%), radial-gradient(at 50% 82%, rgb(45 212 191 / 0.16), transparent 50%);",
    dark: "background-color: #0c0d10; background-image: radial-gradient(at 18% 22%, rgb(99 102 241 / 0.22), transparent 50%), radial-gradient(at 82% 28%, rgb(236 72 153 / 0.19), transparent 48%), radial-gradient(at 50% 82%, rgb(45 212 191 / 0.20), transparent 50%);",
  },
  {
    slug: "glow",
    name: "Radial Glow",
    nameZh: "径向光晕",
    aliases: ["顶部光", "spotlight", "聚光", "radial glow"],
    whenUse: "To guide attention toward a top heading or primary action.",
    whenUseZh: "引导视线到顶部标题或主按钮。",
    light:
      "background-image: radial-gradient(120% 80% at 50% 0%, rgb(51 156 255 / 0.16), transparent 60%);",
    dark: "background-image: radial-gradient(120% 80% at 50% 0%, rgb(51 156 255 / 0.22), transparent 60%);",
  },
  {
    slug: "stripes",
    name: "Diagonal Stripes",
    nameZh: "对角条纹",
    aliases: ["斜纹", "条纹", "hazard", "repeating stripes"],
    whenUse: "For emphasis areas, warnings, and retro treatments.",
    whenUseZh: "强调区、警示区与复古处理。",
    light:
      "background-image: repeating-linear-gradient(45deg, rgb(0 0 0 / 0.04) 0 10px, transparent 10px 20px);",
    dark: "background-image: repeating-linear-gradient(45deg, rgb(255 255 255 / 0.05) 0 10px, transparent 10px 20px);",
  },
  {
    slug: "scanlines",
    name: "Scanlines",
    nameZh: "扫描线",
    aliases: ["CRT", "显像管", "行扫", "复古终端"],
    whenUse: "For retro, technical, and terminal-inspired interfaces.",
    whenUseZh: "复古、科技与终端风界面。",
    light:
      "background-image: repeating-linear-gradient(0deg, rgb(0 0 0 / 0.05) 0 1px, transparent 1px 3px);",
    dark: "background-image: repeating-linear-gradient(0deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 3px);",
  },
  {
    slug: "vignette",
    name: "Vignette",
    nameZh: "渐晕",
    aliases: ["暗角", "edge fade", "聚焦暗边", "vignette"],
    whenUse: "To focus the center and subdue the edges.",
    whenUseZh: "聚焦中心、压低边缘。",
    light:
      "background-image: radial-gradient(120% 120% at 50% 50%, transparent 55%, rgb(0 0 0 / 0.10));",
    dark: "background-image: radial-gradient(120% 120% at 50% 50%, transparent 55%, rgb(0 0 0 / 0.28));",
  },
] as const;

/**
 * Fades make a texture usable. A tiled pattern that runs edge to edge reads as
 * wallpaper; the same pattern dissolving into the page reads as atmosphere.
 * Apply one to the texture *layer*, never to the container — a mask on the
 * container fades the content with it.
 */
export const BACKGROUND_FADES: readonly BackgroundFadeAtom[] = [
  {
    slug: "fade-bottom",
    name: "Fade Bottom",
    nameZh: "向下淡出",
    aliases: ["淡出", "fade out", "溶入页面", "bottom fade"],
    whenUse:
      "The default. A hero texture dissolves into the page so the section below needs no divider.",
    whenUseZh: "默认款。hero 底纹溶进页面，下一段就不必再画分割线。",
    mask: "mask-image: linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%);",
  },
  {
    slug: "fade-top",
    name: "Fade Top",
    nameZh: "向上淡出",
    aliases: ["顶部淡出", "top fade", "接住上一段"],
    whenUse:
      "For a texture that belongs to the section below it — it grows in from the seam instead of starting abruptly.",
    whenUseZh: "底纹属于下一段时用：从接缝里长出来，而不是突然开始。",
    mask: "mask-image: linear-gradient(to bottom, transparent 0%, #000 55%, #000 100%);",
  },
  {
    slug: "fade-ring",
    name: "Fade Ring",
    nameZh: "中心留白",
    aliases: ["环形", "中心镂空", "ring", "keep center clean"],
    whenUse:
      "Punches a hole in the middle of the texture so headline and copy sit on clean ground while the edges stay textured.",
    whenUseZh: "在底纹中间挖个洞：标题正文落在干净地面上，四周仍有质感。",
    mask: "mask-image: radial-gradient(transparent 14%, #000 60%, transparent 100%);",
  },
  {
    slug: "fade-edges",
    name: "Fade Edges",
    nameZh: "四周淡出",
    aliases: ["聚焦中心", "soft edges", "spotlight texture", "无边界"],
    whenUse:
      "Concentrates the texture at the centre and dissolves it before the edges, so a card or panel has no hard texture boundary.",
    whenUseZh: "把质感聚到中心、在边缘前消失，卡片与面板就不会有硬邦邦的纹理边界。",
    mask: "mask-image: radial-gradient(#000 30%, transparent 92%);",
  },
] as const;
