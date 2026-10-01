"use client";

import { Bell, Heart, Settings } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ActionSwapText } from "@/components/motion/action-swap";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { BounceCards } from "@/components/motion/bounce-cards";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { Button } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { Input } from "@/components/motion/input";
import { Loader } from "@/components/motion/loader";
import { Marquee } from "@/components/motion/marquee";
import { NumberTicker } from "@/components/motion/number-ticker";
import { ScrollHint } from "@/components/motion/scroll-hint";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Skeleton } from "@/components/motion/skeleton";
import { StarBorder } from "@/components/motion/star-border";
import { Switch } from "@/components/motion/switch";
import { TextCascade } from "@/components/motion/text-cascade";
import { TextReveal } from "@/components/motion/text-reveal";
import { TextScramble } from "@/components/motion/text-scramble";
import { TextShimmer } from "@/components/motion/text-shimmer";
import { EASE_IN_OUT, EASE_OUT, SPRING_LAYOUT, SPRING_MOUSE, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

/** Visible settle past the target. The product springs are too damped to read as a bounce in one short loop. */
const SPRING_SAMPLE = { type: "spring" as const, stiffness: 420, damping: 12, mass: 0.6 };

function useZh() {
  return useLocale() === "zh";
}

function useCycle<T>(values: readonly T[], ms: number): T {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  useEffect(() => {
    if (reduce || valuesRef.current.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % valuesRef.current.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [reduce, ms]);
  const list = valuesRef.current;
  return list[reduce ? 0 : index] ?? list[0];
}

function FadeFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-24 rounded-lg bg-foreground"
      animate={reduce ? { opacity: 1 } : { opacity: [0.15, 1, 1, 0.15] }}
      transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT }}
    />
  );
}

function SlideFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-24 rounded-lg bg-foreground"
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0], y: [12, 0, 0, 12] }}
      transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT }}
    />
  );
}

function PopFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-10 rounded-lg bg-foreground"
      animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 1, 1, 0], scale: [0.8, 1.08, 1, 0.8] }}
      transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT }}
    />
  );
}

function BlurFadeFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-24 rounded-lg bg-foreground"
      animate={
        reduce
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: [0, 1, 1, 0], y: [10, 0, 0, 10], filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"] }
      }
      transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT }}
    />
  );
}

function StaggerFace() {
  const reduce = useReducedMotion();
  return (
    <div className="flex w-36 flex-col gap-1.5">
      {["one", "two", "three"].map((id, index) => (
        <motion.div
          key={id}
          className="h-2.5 rounded-full bg-foreground"
          style={{ width: `${100 - index * 18}%` }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0], y: [8, 0, 0, 8] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, delay: index * 0.12 }
          }
        />
      ))}
    </div>
  );
}

function PressFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={reduce ? { scale: 1 } : { scale: [1, 0.96, 1] }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.7, ease: EASE_OUT }}
    >
      <Button tabIndex={-1}>{zh ? "按下" : "Press"}</Button>
    </motion.div>
  );
}

function MagneticFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
      animate={reduce ? { x: 0, y: 0 } : { x: [0, 14, 0, -10, 0], y: [0, -6, 0, 4, 0] }}
      transition={reduce ? { duration: 0 } : { ...SPRING_MOUSE, repeat: Number.POSITIVE_INFINITY }}
    >
      {zh ? "靠近" : "Near"}
    </motion.div>
  );
}

function TiltFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-16 w-24 rounded-xl border border-border bg-card shadow-sm"
      style={{ transformPerspective: 400 }}
      animate={reduce ? { rotateX: 0, rotateY: 0 } : { rotateX: [0, 8, 0, -6, 0], rotateY: [0, -10, 0, 8, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
    />
  );
}

function GlareFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-28 overflow-hidden rounded-xl border border-border bg-card">
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        animate={reduce ? { x: -40, opacity: 0 } : { x: [-40, 140], opacity: [0, 1, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5, ease: EASE_OUT }}
      />
    </div>
  );
}

function RippleFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <div className="relative grid place-items-center">
      {reduce ? null : (
        <motion.span
          aria-hidden
          className="absolute size-8 rounded-full border border-foreground/40"
          animate={{ scale: [0.4, 2.1], opacity: [0.55, 0] }}
          transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, repeatDelay: 0.35 }}
        />
      )}
      <Button tabIndex={-1} ripple>{zh ? "点按" : "Tap"}</Button>
    </div>
  );
}

function TextRevealFace() {
  const zh = useZh();
  return (
    <TextReveal
      text={zh ? "看见动效" : "See motion"}
      split={zh ? "char" : "word"}
      blur={8}
      yOffset={8}
      className="text-sm font-medium"
    />
  );
}

function TextShimmerFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  const label = zh ? "加载中" : "Loading";
  if (reduce) return <span className="text-sm">{label}</span>;
  return <TextShimmer className="text-sm font-medium">{label}</TextShimmer>;
}

function TextScrambleFace() {
  const word = useCycle(["Motion", "Replay"], 1600);
  return <TextScramble text={word} className="text-sm font-medium" />;
}

function NumberTickerFace() {
  const value = useCycle([1280, 2048], 1800);
  return <NumberTicker value={value} startOnView={false} className="text-lg font-medium tabular-nums" />;
}

function CountUpFace() {
  const value = useCycle([24, 86], 1800);
  return (
    <AnimatedNumber
      value={value}
      startOnView={false}
      duration={0.7}
      className="text-lg font-medium"
    />
  );
}

function TextCascadeFace() {
  const zh = useZh();
  const word = useCycle(zh ? ["看见", "动效"] : ["See", "Move"], 1400);
  return <TextCascade text={word} className="text-sm font-medium" />;
}

function ParallaxFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-32 overflow-hidden rounded-lg border border-border bg-card">
      <motion.div
        className="absolute inset-x-2 top-2 h-8 rounded-md bg-foreground/15"
        animate={reduce ? { y: 0 } : { y: [0, 10, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
      <motion.div
        className="absolute inset-x-6 top-4 h-6 rounded-md bg-foreground"
        animate={reduce ? { y: 0 } : { y: [0, 18, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function ScrollRevealFace() {
  const zh = useZh();
  return (
    <ScrollReveal y={10} blur={6} className="text-sm">
      {zh ? "进入视线" : "In view"}
    </ScrollReveal>
  );
}

function ProgressFace() {
  const reduce = useReducedMotion();
  return (
    <div className="h-1 w-32 overflow-hidden rounded-full bg-foreground/15">
      <motion.div
        className="h-full origin-left bg-foreground"
        animate={reduce ? { scaleX: 0.6 } : { scaleX: [0, 1, 1, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT }}
      />
    </div>
  );
}

function SmoothFace() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-16 items-start gap-4 pt-1">
      <motion.div
        className="size-3 rounded-full bg-foreground/30"
        animate={reduce ? { y: 20 } : { y: [4, 4, 40, 40] }}
        transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, times: [0, 0.46, 0.54, 1], ease: "linear" }}
      />
      <motion.div
        className="size-3 rounded-full bg-foreground"
        animate={reduce ? { y: 20 } : { y: [4, 40] }}
        transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function PinnedFace() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-16 w-36 gap-2 overflow-hidden">
      <div className="w-10 shrink-0 rounded-md bg-foreground/80" />
      <motion.div
        className="flex flex-1 flex-col gap-1"
        animate={reduce ? { y: 0 } : { y: [8, -28] }}
        transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      >
        <div className="h-2 rounded-full bg-foreground/30" />
        <div className="h-2 rounded-full bg-foreground/20" />
        <div className="h-2 rounded-full bg-foreground/15" />
        <div className="h-2 rounded-full bg-foreground/10" />
      </motion.div>
    </div>
  );
}

function StackingFace() {
  const reduce = useReducedMotion();
  const cards = [
    { id: "a", y: 18 },
    { id: "b", y: 8 },
    { id: "c", y: 0 },
  ];
  return (
    <div className="relative h-16 w-24">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute inset-x-0 h-8 rounded-md border border-border bg-card"
          animate={reduce ? { y: card.y, scale: 1 } : { y: [28, card.y], scale: [0.96, 1] }}
          transition={reduce ? { duration: 0 } : { duration: 1.4, delay: index * 0.12, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.6, ease: EASE_OUT }}
        />
      ))}
    </div>
  );
}

function SnapFace() {
  const reduce = useReducedMotion();
  return (
    <div className="h-16 w-24 overflow-hidden rounded-lg border border-border">
      <motion.div
        animate={reduce ? { y: 0 } : { y: [0, 0, -64, -64] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, times: [0, 0.42, 0.58, 1], ease: EASE_OUT }}
      >
        <div className="flex h-16 items-center justify-center bg-foreground/10 text-xs">1</div>
        <div className="flex h-16 items-center justify-center bg-foreground/20 text-xs">2</div>
      </motion.div>
    </div>
  );
}

function MarqueeFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  const words = zh ? ["看见", "动效", "再看"] : ["See", "Move", "Again"];
  if (reduce) {
    return <div className="flex gap-3 text-xs">{words.map((word) => <span key={word}>{word}</span>)}</div>;
  }
  return (
    <Marquee speed={10} pauseOnHover={false} className="w-40" gap="0.75rem">
      {words.map((word) => (
        <span key={word} className="text-xs">{word}</span>
      ))}
    </Marquee>
  );
}

function StarBorderFace() {
  const zh = useZh();
  return (
    <StarBorder className="text-foreground" speed={4} thickness={1}>
      <span className="block rounded-2xl bg-background px-3 py-1.5 text-xs">{zh ? "沿着边走" : "Around"}</span>
    </StarBorder>
  );
}

function BounceCardsFace() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="origin-center scale-[0.36]">
        <BounceCards spacing={36} rotation={8}>
          {["bg-foreground/80", "bg-foreground/50", "bg-foreground/25"].map((tone) => (
            <div key={tone} className={cn("h-full w-full", tone)} />
          ))}
        </BounceCards>
      </div>
    </div>
  );
}

function MagnifyFace() {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-end gap-1.5">
      {[
        { id: "left", scale: [1, 0.92, 1] as const, delay: 0 },
        { id: "middle", scale: [1, 1.45, 1] as const, delay: 0.05 },
        { id: "right", scale: [1, 0.92, 1] as const, delay: 0.1 },
      ].map((item) => (
        <motion.div
          key={item.id}
          className="size-7 rounded-full bg-foreground"
          animate={reduce ? { scale: 1 } : { scale: [...item.scale] }}
          transition={reduce ? { duration: 0 } : { ...SPRING_MOUSE, repeat: Number.POSITIVE_INFINITY, delay: item.delay }}
        />
      ))}
    </div>
  );
}

function SharedLayoutFace() {
  const reduce = useReducedMotion();
  const index = useCycle([0, 1, 2], 900);
  const items = ["A", "B", "C"];
  return (
    <div className="flex rounded-full border border-border p-1">
      {items.map((item, itemIndex) => (
        <span key={item} className="relative px-3 py-1 text-xs">
          {itemIndex === index ? (
            <motion.span
              layoutId="motion-dictionary-pill"
              className="absolute inset-0 rounded-full bg-foreground/10"
              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            />
          ) : null}
          <span className="relative">{item}</span>
        </span>
      ))}
    </div>
  );
}

function MorphFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="bg-foreground"
      animate={
        reduce
          ? { scaleX: 1, scaleY: 1, borderRadius: 12 }
          : { scaleX: [1, 1.45, 1], scaleY: [1, 0.72, 1], borderRadius: [12, 28, 12] }
      }
      style={{ width: 56, height: 40 }}
      transition={reduce ? { duration: 0 } : { ...SPRING_PANEL, repeat: Number.POSITIVE_INFINITY }}
    />
  );
}

function SwapFace() {
  const zh = useZh();
  const label = useCycle(zh ? ["保存", "已存"] : ["Save", "Saved"], 1400);
  return <ActionSwapText value={label} className="text-sm font-medium">{label}</ActionSwapText>;
}

function ExpandFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  const open = useCycle([true, false], 1400);
  return (
    <BouncyAccordion
      className="w-40"
      value={reduce || open ? "size" : null}
      onValueChange={() => undefined}
      collapsible
      items={[
        {
          id: "size",
          title: zh ? "尺寸" : "Size",
          description: zh ? "中号" : "Medium",
        },
      ]}
    />
  );
}

function InertiaFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-28 overflow-hidden rounded-lg border border-border bg-foreground/5">
      <motion.div
        className="absolute inset-x-1 bottom-0 h-10 rounded-t-lg border border-border bg-card"
        animate={reduce ? { y: 0 } : { y: [28, 0, 0, 28] }}
        transition={reduce ? { duration: 0 } : { ...SPRING_SAMPLE, duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  );
}

function EaseOutFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-8 w-36">
      <motion.div
        className="absolute top-1 size-5 rounded-full bg-foreground"
        animate={reduce ? { x: 96 } : { x: [0, 96] }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.45, ease: EASE_OUT }}
      />
    </div>
  );
}

function EaseInOutFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-8 w-36">
      <motion.div
        className="absolute top-1 size-5 rounded-full bg-foreground"
        animate={reduce ? { x: 48 } : { x: [0, 96, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function SpringFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-14 w-28">
      <div className="absolute inset-x-0 bottom-1 h-px bg-foreground/20" />
      <motion.div
        className="absolute left-10 size-5 rounded-full bg-foreground"
        animate={reduce ? { y: 28 } : { y: [0, 28] }}
        transition={reduce ? { duration: 0 } : { ...SPRING_SAMPLE, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.35 }}
      />
    </div>
  );
}

function ExitFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-24 rounded-lg bg-foreground"
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: [1, 1, 0, 1], y: [0, 0, 12, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, times: [0, 0.45, 0.7, 1] }}
    />
  );
}

function ShakeFace() {
  const invalid = useCycle([false, true], 1200);
  return <Input className="w-36" aria-label="email" defaultValue="name@" error={invalid || undefined} />;
}

function SwipeDismissFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <div className="w-32 overflow-hidden">
      <motion.div
        className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
        animate={reduce ? { x: 0, opacity: 1 } : { x: [0, 0, 56, 0], opacity: [1, 1, 0.15, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, times: [0, 0.4, 0.62, 1] }}
      >
        {zh ? "已保存" : "Saved"}
      </motion.div>
    </div>
  );
}

function ReorderFace() {
  const reduce = useReducedMotion();
  const flipped = useCycle([false, true], 1200);
  const items = !reduce && flipped ? ["b", "a", "c"] : ["a", "b", "c"];
  return (
    <div className="flex w-28 flex-col gap-1.5">
      {items.map((id) => (
        <motion.div
          key={id}
          layout
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          className={cn("h-2.5 rounded-full", id === "b" ? "bg-foreground" : "bg-foreground/25")}
        />
      ))}
    </div>
  );
}

function RubberBandFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-28">
      <div className="absolute inset-x-3 top-2 h-px bg-foreground/25" />
      <motion.div
        className="absolute left-5 top-2 h-4 w-px origin-top bg-foreground/40"
        animate={reduce ? { scaleY: 1 } : { scaleY: [1, 3.2, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT }}
      />
      <motion.div
        className="absolute left-10 top-1 size-4 rounded-full bg-foreground"
        animate={reduce ? { y: 0 } : { y: [0, 12, 0] }}
        transition={reduce ? { duration: 0 } : { ...SPRING_SAMPLE, duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  );
}

function HoldFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <div className="relative h-8 w-28 overflow-hidden rounded-full border border-border">
      <motion.div
        className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
        animate={reduce ? { scaleX: 1 } : { scaleX: [0, 1, 1, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, times: [0, 0.72, 0.82, 1], ease: "linear" }}
      />
      <span className="relative grid h-full place-items-center text-xs text-background mix-blend-difference">
        {zh ? "按住" : "Hold"}
      </span>
    </div>
  );
}

function TypewriterFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  const full = zh ? "正在写" : "Typing";
  const count = useCycle(
    Array.from({ length: full.length }, (_, index) => index + 1),
    280,
  );
  const shown = reduce ? full : full.slice(0, count);
  return (
    <span className="text-sm font-medium">
      {shown}
      <span className="ml-px inline-block w-px bg-foreground" aria-hidden="true">&nbsp;</span>
    </span>
  );
}

function SkeletonFace() {
  return (
    <div className="flex w-36 items-center gap-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-2/3" />
      </div>
    </div>
  );
}

function CrossfadeFace() {
  const zh = useZh();
  const next = useCycle([false, true], 1100);
  const oldLabel = zh ? "旧的" : "Old";
  const newLabel = zh ? "新的" : "New";
  return (
    <div className="relative h-6 w-16 text-sm font-medium">
      <motion.span className="absolute inset-0" animate={{ opacity: next ? 0 : 1 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
        {oldLabel}
      </motion.span>
      <motion.span className="absolute inset-0" animate={{ opacity: next ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
        {newLabel}
      </motion.span>
    </div>
  );
}

function OriginAwareFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-28">
      <div className="absolute left-1 top-1 size-2 rounded-full bg-foreground" />
      <motion.div
        className="absolute left-1 top-4 h-9 w-20 rounded-lg border border-border bg-card"
        style={{ transformOrigin: "top left" }}
        animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [1, 1, 0, 1], scale: [1, 1, 0.9, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, times: [0, 0.5, 0.72, 1] }}
      />
    </div>
  );
}

function SharedElementFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-16 rounded-lg bg-foreground"
      animate={reduce ? { x: 0, y: 0, scale: 1 } : { x: [0, 22], y: [8, -4], scale: [0.65, 1] }}
      transition={reduce ? { duration: 0 } : { duration: 1.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.35, ease: EASE_OUT }}
    />
  );
}

function DirectionFace() {
  const zh = useZh();
  const forward = useCycle([true, false], 1100);
  const reduce = useReducedMotion();
  return (
    <div className="w-24 overflow-hidden text-center text-sm">
      <motion.div
        key={forward ? "forward" : "back"}
        initial={reduce ? false : { x: forward ? 28 : -28, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        {forward ? (zh ? "前进" : "Forward") : zh ? "返回" : "Back"}
      </motion.div>
    </div>
  );
}

function PageTransitionFace() {
  const reduce = useReducedMotion();
  const next = useCycle([0, 1], 1400);
  return (
    <div className="h-12 w-28 overflow-hidden rounded-lg border border-border">
      <motion.div
        className="flex h-full w-[200%]"
        animate={reduce ? { x: 0 } : { x: next ? "-50%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        <div className="flex h-full w-1/2 items-center justify-center bg-foreground/10 text-xs">1</div>
        <div className="flex h-full w-1/2 items-center justify-center bg-foreground/25 text-xs">2</div>
      </motion.div>
    </div>
  );
}

function ViewTransitionFace() {
  const reduce = useReducedMotion();
  const wide = useCycle([false, true], 1400);
  return (
    <div className="relative h-16 w-32">
      {wide ? (
        <motion.div
          layoutId="motion-dictionary-view"
          className="absolute left-2 top-1 h-7 w-24 rounded-md bg-foreground"
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
        />
      ) : (
        <motion.div
          layoutId="motion-dictionary-view"
          className="absolute bottom-1 left-2 size-7 rounded-md bg-foreground"
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
        />
      )}
    </div>
  );
}

function ClipRevealFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="rounded-md bg-foreground px-3 py-2 text-xs text-background"
      animate={reduce ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"] }}
      transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, times: [0, 0.4, 0.7, 1] }}
    >
      {zh ? "露出来" : "Uncover"}
    </motion.div>
  );
}

function CheckFace() {
  const zh = useZh();
  const on = useCycle([false, true], 1100);
  return (
    <Checkbox
      checked={on}
      onCheckedChange={() => undefined}
      aria-label={zh ? "完成" : "Done"}
    />
  );
}

function ThumbFace() {
  const on = useCycle([false, true], 1100);
  return <Switch checked={on} onCheckedChange={() => undefined} />;
}

function PullRefreshFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border">
      <motion.div
        className="absolute inset-x-0 top-1 flex justify-center"
        animate={reduce ? { opacity: 0, y: 0 } : { opacity: [0, 1, 1, 0], y: [0, 8, 8, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2, repeat: Number.POSITIVE_INFINITY, times: [0, 0.35, 0.7, 1] }}
      >
        <Loader variant="spinner" size={14} />
      </motion.div>
      <motion.div
        className="absolute inset-x-2 top-7 h-6 rounded-md bg-foreground/15"
        animate={reduce ? { y: 0 } : { y: [0, 12, 12, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, times: [0, 0.35, 0.7, 1] }}
      />
    </div>
  );
}

function IndeterminateFace() {
  const reduce = useReducedMotion();
  return (
    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-foreground/15">
      <motion.div
        className="h-full w-2/5 rounded-full bg-foreground"
        animate={reduce ? { x: "30%" } : { x: ["-120%", "260%"] }}
        transition={reduce ? { duration: 0 } : { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function WordRotateFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  const words = zh ? ["看见", "动效", "再看"] : ["See", "Move", "Again"];
  return (
    <div className="h-6 overflow-hidden text-sm font-medium">
      <motion.div
        animate={reduce ? { y: 0 } : { y: [0, -24, -48, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, times: [0, 0.28, 0.56, 1], ease: EASE_OUT }}
      >
        {words.map((word) => (
          <div key={word} className="h-6">{word}</div>
        ))}
      </motion.div>
    </div>
  );
}

function HorizontalFace() {
  const reduce = useReducedMotion();
  return (
    <div className="w-32 overflow-hidden">
      <motion.div
        className="flex gap-2"
        animate={reduce ? { x: 0 } : { x: [0, -72, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      >
        {["1", "2", "3", "4"].map((item) => (
          <div key={item} className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-foreground/80 text-xs text-background">{item}</div>
        ))}
      </motion.div>
    </div>
  );
}

function ZoomFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-foreground/10">
      <motion.div
        className="absolute inset-0 bg-foreground/70"
        animate={reduce ? { scale: 1 } : { scale: [1, 1.45, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
      <div className="absolute inset-x-0 bottom-1 text-center text-[11px] text-background">{zh ? "字幕" : "Caption"}</div>
    </div>
  );
}

function ScrollHintFace() {
  return <ScrollHint variant="chevron" />;
}

function SpinnerFace() {
  return <Loader variant="spinner" size={28} />;
}

function CarouselFace() {
  const reduce = useReducedMotion();
  return (
    <div className="h-12 w-28 overflow-hidden rounded-lg border border-border">
      <motion.div
        className="flex h-full w-[300%]"
        animate={reduce ? { x: "0%" } : { x: ["0%", "-33.333%", "-66.666%", "0%"] }}
        transition={reduce ? { duration: 0 } : { duration: 3.2, repeat: Number.POSITIVE_INFINITY, times: [0, 0.28, 0.56, 1], ease: EASE_OUT }}
      >
        {["1", "2", "3"].map((item) => (
          <div key={item} className="grid h-full w-1/3 place-items-center bg-foreground/10 text-sm">{item}</div>
        ))}
      </motion.div>
    </div>
  );
}

function OrbitFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid size-16 place-items-center">
      <div className="size-2 rounded-full bg-foreground/30" />
      <motion.div
        className="absolute inset-0"
        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
        transition={reduce ? { duration: 0 } : { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="mx-auto size-2.5 rounded-full bg-foreground" />
      </motion.div>
    </div>
  );
}

function FloatFace() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="h-10 w-16 rounded-lg border border-border bg-card shadow-sm"
      animate={reduce ? { y: 0 } : { y: [0, -8, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
    />
  );
}

function ConfettiFace() {
  const reduce = useReducedMotion();
  const pieces = [
    { id: "a", left: 8, delay: 0 },
    { id: "b", left: 28, delay: 0.12 },
    { id: "c", left: 48, delay: 0.05 },
    { id: "d", left: 68, delay: 0.18 },
  ];
  return (
    <div className="relative h-14 w-24 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0 h-2 w-1.5 rounded-sm bg-foreground"
          style={{ left: piece.left }}
          animate={reduce ? { y: 8, opacity: 1, rotate: 0 } : { y: [0, 52], rotate: [0, 160], opacity: [1, 0] }}
          transition={reduce ? { duration: 0 } : { duration: 1.2, repeat: Number.POSITIVE_INFINITY, delay: piece.delay, ease: EASE_OUT }}
        />
      ))}
    </div>
  );
}

function BeamFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-8 w-32">
      <div className="absolute left-2 top-1/2 size-2 -translate-y-1/2 rounded-full bg-foreground" />
      <div className="absolute right-2 top-1/2 size-2 -translate-y-1/2 rounded-full bg-foreground" />
      <div className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-foreground/20" />
      <motion.div
        className="absolute top-1/2 h-1 w-6 -translate-y-1/2 rounded-full bg-foreground"
        animate={reduce ? { x: 12 } : { x: [8, 88] }}
        transition={reduce ? { duration: 0 } : { duration: 1.3, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function SpotlightFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-foreground">
      <motion.div
        className="absolute size-14 rounded-full bg-white/50 blur-md"
        animate={reduce ? { x: 28, y: 4 } : { x: [0, 56, 12], y: [0, 12, 4] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function ProgressiveBlurFace() {
  const zh = useZh();
  return (
    <div className="relative h-14 w-32 overflow-hidden text-xs leading-5">
      <p>{zh ? "这一行清楚。往下接到别的内容，边缘渐渐糊掉。" : "This line stays sharp. The edge that meets other content softens."}</p>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-background backdrop-blur-[2px]" />
    </div>
  );
}

function DrawerSlideFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-16 w-32 overflow-hidden rounded-lg border border-border bg-foreground/5">
      <motion.div
        className="absolute inset-y-1 right-0 w-16 rounded-l-lg border border-border bg-card"
        animate={reduce ? { x: 0 } : { x: ["100%", "0%", "0%", "100%"] }}
        transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: EASE_OUT, times: [0, 0.35, 0.7, 1] }}
      />
    </div>
  );
}

function CompareFace() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-14 w-28 overflow-hidden rounded-lg bg-foreground/15">
      <motion.div
        className="absolute inset-0 bg-foreground"
        animate={reduce ? { clipPath: "inset(0 50% 0 0)" } : { clipPath: ["inset(0 80% 0 0)", "inset(0 20% 0 0)", "inset(0 80% 0 0)"] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
      <motion.div
        className="absolute inset-y-1 w-0.5 bg-background"
        animate={reduce ? { left: "50%" } : { left: ["20%", "80%", "20%"] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
      />
    </div>
  );
}

function FlipFace() {
  const zh = useZh();
  const reduce = useReducedMotion();
  return (
    <div style={{ perspective: 500 }}>
      <motion.div
        className="relative h-12 w-20"
        style={{ transformStyle: "preserve-3d" }}
        animate={reduce ? { rotateY: 0 } : { rotateY: [0, 180, 180, 360] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, times: [0, 0.4, 0.62, 1], ease: EASE_IN_OUT }}
      >
        <div className="absolute inset-0 grid place-items-center rounded-lg bg-foreground text-xs text-background [backface-visibility:hidden]">
          {zh ? "正" : "A"}
        </div>
        <div className="absolute inset-0 grid place-items-center rounded-lg bg-foreground/70 text-xs [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {zh ? "反" : "B"}
        </div>
      </motion.div>
    </div>
  );
}

function InsertFace() {
  const reduce = useReducedMotion();
  const open = useCycle([false, true], 1200);
  const items = !reduce && open ? ["new", "a", "b"] : ["a", "b"];
  return (
    <div className="flex w-28 flex-col gap-1.5">
      {items.map((id) => (
        <motion.div
          key={id}
          layout
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          className={cn("h-2.5 rounded-full", id === "new" ? "bg-foreground" : "bg-foreground/25")}
        />
      ))}
    </div>
  );
}

function DrawFace() {
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M5 13l4 4L19 7"
        animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.6, ease: EASE_OUT }}
      />
    </svg>
  );
}

function WiggleFace() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-flex"
      animate={reduce ? { rotate: 0 } : { rotate: [0, -14, 10, -6, 0] }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.7 }}
    >
      <Bell className="size-6" />
    </motion.span>
  );
}

function SpinFace() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-flex"
      animate={reduce ? { rotate: 0 } : { rotate: 360 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5, ease: EASE_IN_OUT }}
    >
      <Settings className="size-6" />
    </motion.span>
  );
}

function PulseFace() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-flex"
      animate={reduce ? { scale: 1 } : { scale: [1, 1.15, 1] }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: EASE_IN_OUT }}
    >
      <Heart className="size-6" />
    </motion.span>
  );
}

const FACES = {
  fade: FadeFace,
  exit: ExitFace,
  slide: SlideFace,
  "pop-in": PopFace,
  "blur-fade": BlurFadeFace,
  "clip-reveal": ClipRevealFace,
  stagger: StaggerFace,
  press: PressFace,
  magnetic: MagneticFace,
  tilt: TiltFace,
  glare: GlareFace,
  ripple: RippleFace,
  shake: ShakeFace,
  "swipe-dismiss": SwipeDismissFace,
  reorder: ReorderFace,
  "rubber-band": RubberBandFace,
  hold: HoldFace,
  check: CheckFace,
  thumb: ThumbFace,
  "pull-refresh": PullRefreshFace,
  indeterminate: IndeterminateFace,
  "text-reveal": TextRevealFace,
  "text-shimmer": TextShimmerFace,
  "text-scramble": TextScrambleFace,
  "number-ticker": NumberTickerFace,
  "count-up": CountUpFace,
  "text-cascade": TextCascadeFace,
  typewriter: TypewriterFace,
  "word-rotate": WordRotateFace,
  parallax: ParallaxFace,
  "scroll-reveal": ScrollRevealFace,
  "scroll-progress": ProgressFace,
  "smooth-scroll": SmoothFace,
  pinned: PinnedFace,
  stacking: StackingFace,
  snap: SnapFace,
  horizontal: HorizontalFace,
  zoom: ZoomFace,
  "scroll-hint": ScrollHintFace,
  marquee: MarqueeFace,
  "star-border": StarBorderFace,
  "bounce-cards": BounceCardsFace,
  magnify: MagnifyFace,
  skeleton: SkeletonFace,
  spinner: SpinnerFace,
  carousel: CarouselFace,
  orbit: OrbitFace,
  float: FloatFace,
  confetti: ConfettiFace,
  beam: BeamFace,
  spotlight: SpotlightFace,
  "progressive-blur": ProgressiveBlurFace,
  "shared-layout": SharedLayoutFace,
  morph: MorphFace,
  crossfade: CrossfadeFace,
  "origin-aware": OriginAwareFace,
  "shared-element": SharedElementFace,
  direction: DirectionFace,
  "page-transition": PageTransitionFace,
  "view-transition": ViewTransitionFace,
  swap: SwapFace,
  expand: ExpandFace,
  inertia: InertiaFace,
  "drawer-slide": DrawerSlideFace,
  compare: CompareFace,
  flip: FlipFace,
  insert: InsertFace,
  "ease-out": EaseOutFace,
  "ease-in-out": EaseInOutFace,
  spring: SpringFace,
  draw: DrawFace,
  wiggle: WiggleFace,
  spin: SpinFace,
  pulse: PulseFace,
} as const;

export function MotionCardFace({ slug }: { slug: string }) {
  const Face = FACES[slug as keyof typeof FACES];
  if (!Face) return null;
  return <Face />;
}
