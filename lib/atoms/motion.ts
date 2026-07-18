import {
  EASE_DRAWER,
  EASE_IN_OUT,
  EASE_OUT,
  SPRING_LAYOUT,
  SPRING_MOUSE,
  SPRING_PANEL,
  SPRING_PRESS,
  SPRING_SWAP,
} from "@/lib/ease";
import type {
  MotionCurveAtom,
  MotionDurationAtom,
  MotionSpringAtom,
} from "@/lib/atoms/types";

export const MOTION_CURVES: readonly MotionCurveAtom[] = [
  {
    slug: "swift-out",
    name: "Swift Out",
    nameZh: "疾出",
    aliases: ["ease-out-quint style", "ease-out-quint 风", "quick out", "快出", "snappy out"],
    whenUse: "The default workhorse for entrances, expansion, and hover feedback; fast in, soft stop.",
    whenUseZh: "默认工作马——进场、展开、hover 反馈；快进缓停。",
    value: EASE_OUT,
  },
  {
    slug: "push-pull",
    name: "Push-Pull",
    nameZh: "推拉",
    aliases: ["symmetric easing", "对称缓动", "strong in-out"],
    whenUse: "Symmetric two-way motion: position swaps, flips, and back-and-forth travel.",
    whenUseZh: "双向对称运动——位置互换、翻转、往返。",
    value: EASE_IN_OUT,
  },
  {
    slug: "drawer",
    name: "Drawer",
    nameZh: "抽屉",
    aliases: ["sheet curve", "sheet 曲线", "iOS drawer", "iOS 抽屉"],
    whenUse: "Drawers and bottom sheets with the feel of an iOS sheet.",
    whenUseZh: "抽屉与底部弹层，呈现 iOS sheet 手感。",
    value: EASE_DRAWER,
  },
] as const;

export const MOTION_SPRINGS: readonly MotionSpringAtom[] = [
  {
    slug: "press",
    name: "Press",
    nameZh: "按压",
    aliases: ["button spring", "按钮弹簧", "tap feedback", "点击反馈"],
    whenUse: "Press feedback for buttons and other tappable surfaces.",
    whenUseZh: "按钮与可点表面的按压反馈。",
    value: SPRING_PRESS,
  },
  {
    slug: "swap",
    name: "Swap",
    nameZh: "换位",
    aliases: ["content swap", "内容换位", "slot spring", "槽位弹簧"],
    whenUse: "Icon or text slots trading places inside a control.",
    whenUseZh: "控件内图标或文字槽位互换。",
    value: SPRING_SWAP,
  },
  {
    slug: "panel",
    name: "Panel",
    nameZh: "面板",
    aliases: ["overlay spring", "弹层弹簧", "modal spring", "模态弹簧"],
    whenUse: "Entrances for modals, sheets, and overlay panels.",
    whenUseZh: "模态与弹层入场。",
    value: SPRING_PANEL,
  },
  {
    slug: "glide",
    name: "Glide",
    nameZh: "滑移",
    aliases: ["layout spring", "布局弹簧", "shared layout", "共享布局"],
    whenUse: "Selected backgrounds and indicators gliding through shared layouts.",
    whenUseZh: "共享布局的选中块与指示器滑动。",
    value: SPRING_LAYOUT,
  },
  {
    slug: "follow",
    name: "Follow",
    nameZh: "跟随",
    aliases: ["cursor spring", "光标弹簧", "magnetic follow", "磁吸跟随"],
    whenUse: "Cursor-follow physics for magnetic, tilt, and dock effects.",
    whenUseZh: "磁吸、tilt、dock 的光标跟随物理。",
    value: SPRING_MOUSE,
  },
] as const;

export const MOTION_DURATIONS: readonly MotionDurationAtom[] = [
  {
    slug: "instant",
    name: "Instant",
    nameZh: "瞬时",
    aliases: ["micro feedback", "微反馈"],
    whenUse: "Hover micro-feedback.",
    whenUseZh: "hover 微反馈。",
    milliseconds: 90,
  },
  {
    slug: "quick",
    name: "Quick",
    nameZh: "快速",
    aliases: ["small state", "小状态"],
    whenUse: "State changes on small elements.",
    whenUseZh: "小元素状态切换。",
    milliseconds: 150,
  },
  {
    slug: "standard",
    name: "Standard",
    nameZh: "标准",
    aliases: ["default duration", "默认时长"],
    whenUse: "Everyday UI transitions.",
    whenUseZh: "常规 UI 过渡。",
    milliseconds: 220,
  },
  {
    slug: "deliberate",
    name: "Deliberate",
    nameZh: "从容",
    aliases: ["panel duration", "面板时长"],
    whenUse: "Panels and large interface regions.",
    whenUseZh: "面板与大区域。",
    milliseconds: 320,
  },
  {
    slug: "ambient",
    name: "Ambient",
    nameZh: "氛围",
    aliases: ["background duration", "背景时长"],
    whenUse: "Ambient and background layers.",
    whenUseZh: "氛围与背景层。",
    milliseconds: 600,
  },
] as const;

export function curveCssValue(value: MotionCurveAtom["value"]): string {
  return `cubic-bezier(${value.join(", ")})`;
}

export function springJsValue(value: MotionSpringAtom["value"]): string {
  return `{ type: "spring", stiffness: ${value.stiffness}, damping: ${value.damping}, mass: ${value.mass} }`;
}

export function durationCssValue(milliseconds: number): string {
  return `${milliseconds}ms`;
}
