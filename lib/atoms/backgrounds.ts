import type { BackgroundAtom } from "@/lib/atoms/types";

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
    aliases: ["圆点", "dotted", "polka", "网点"],
    whenUse: "For airy empty states and card backgrounds.",
    whenUseZh: "轻盈的空态与卡片底。",
    light:
      "background-image: radial-gradient(rgb(0 0 0 / 0.12) 1px, transparent 1.5px); background-size: 20px 20px;",
    dark: "background-image: radial-gradient(rgb(255 255 255 / 0.14) 1px, transparent 1.5px); background-size: 20px 20px;",
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
      `background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/></svg>");`,
    dark:
      `background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/></svg>");`,
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
