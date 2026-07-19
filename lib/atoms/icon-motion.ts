import type { IconMotionAtom } from "@/lib/atoms/types";

export const ICON_MOTIONS: readonly IconMotionAtom[] = [
  {
    slug: "draw",
    name: "Draw-on",
    nameZh: "描边绘制",
    aliases: ["draw-on", "描边", "line draw", "路径绘制"],
    whenUse:
      "Entrance flourish for a confirm or success icon; the stroke draws itself in.",
    whenUseZh: "确认、成功类图标的入场；描边像被手写出来。",
    prompt:
      "On hover, animate the icon stroke with pathLength from 0 to 1 so it draws itself in over ~0.6s.",
    promptZh: "hover 时用 pathLength 从 0 到 1 让图标描边自我绘制入场（约 0.6s）。",
    pattern: "draw",
  },
  {
    slug: "wiggle",
    name: "Wiggle",
    nameZh: "摆动",
    aliases: ["shake", "摇铃", "摆动", "wobble"],
    whenUse:
      "Notification and alert icons; a quick side-to-side wiggle draws the eye.",
    whenUseZh: "通知、提醒类图标；快速左右摆动吸引注意。",
    prompt:
      "On hover, rotate the icon in a keyframe wiggle of [0, -14, 10, -6, 0] degrees over ~0.6s.",
    promptZh: "hover 时按关键帧 [0, -14, 10, -6, 0] 度左右摆动，约 0.6s。",
    pattern: "wiggle",
  },
  {
    slug: "spin",
    name: "Spin",
    nameZh: "旋转",
    aliases: ["rotate", "旋转", "转圈", "refresh"],
    whenUse:
      "Settings, sync, and refresh icons; a full 360° rotation signals process.",
    whenUseZh: "设置、同步、刷新类图标；360° 旋转表示进行中。",
    prompt:
      "On hover, rotate the icon 360 degrees once with an easeInOut curve over ~0.6s.",
    promptZh: "hover 时以 easeInOut 旋转一圈 360°，约 0.6s。",
    pattern: "spin",
  },
  {
    slug: "bounce",
    name: "Bounce",
    nameZh: "弹跳",
    aliases: ["hop", "弹跳", "跳动", "spring"],
    whenUse:
      "Download and scroll-down cues; a springy vertical bounce implies action.",
    whenUseZh: "下载、下滑提示；上下弹跳暗示动作。",
    prompt:
      "On hover, bounce the icon vertically with a spring, y from 0 to 4 and back, stiffness ~400.",
    promptZh: "hover 时用弹簧（刚度约 400）让图标垂直弹跳，y 从 0 到 4 再回弹。",
    pattern: "bounce",
  },
  {
    slug: "pop",
    name: "Pop",
    nameZh: "弹入",
    aliases: ["scale", "弹入", "放大", "zoom"],
    whenUse: "Add and create actions; a quick scale pop gives tactile feedback.",
    whenUseZh: "新增、创建动作；快速放大回弹给出触觉反馈。",
    prompt: "On hover, pop the icon scale from 1 to 1.25 and back with a spring.",
    promptZh: "hover 时用弹簧让缩放从 1 到 1.25 再回弹。",
    pattern: "pop",
  },
  {
    slug: "pulse",
    name: "Pulse",
    nameZh: "脉动",
    aliases: ["heartbeat", "脉动", "心跳", "throb"],
    whenUse:
      "Like and live-status icons; a continuous gentle pulse while hovered.",
    whenUseZh: "点赞、在线状态类图标；hover 期间持续轻微脉动。",
    prompt: "While hovered, loop the icon scale between 1 and 1.15 every ~0.8s.",
    promptZh: "hover 期间循环缩放 1 到 1.15，约 0.8s 一次。",
    pattern: "pulse",
  },
  {
    slug: "nudge",
    name: "Nudge",
    nameZh: "微移",
    aliases: ["slide", "微移", "位移", "shift"],
    whenUse:
      "'Next', 'send', and link icons; a small directional nudge hints at travel.",
    whenUseZh: "'下一步'、'发送'、链接类图标；朝方向轻微位移暗示前进。",
    prompt: "On hover, nudge the icon along x by 4px and back with a spring.",
    promptZh: "hover 时让图标沿 x 轻移 4px 再弹回。",
    pattern: "nudge",
  },
] as const;
