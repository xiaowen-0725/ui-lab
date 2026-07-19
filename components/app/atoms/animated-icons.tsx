"use client";

import { ArrowDown, ArrowRight, Bell, Heart, Plus, Settings } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { CopyValue } from "@/components/app/atoms/copy-value";
import { IconLibraryLinks } from "@/components/app/atoms/icon-library-links";
import type { IconLibrary } from "@/components/app/atoms/icon-library-links";
import type { Locale } from "@/i18n/routing";
import { ICON_MOTIONS } from "@/lib/atoms";
import type { IconMotionAtom, IconMotionPattern } from "@/lib/atoms";

const PATTERN_ICON: Record<Exclude<IconMotionPattern, "draw">, typeof Bell> = {
  wiggle: Bell,
  spin: Settings,
  bounce: ArrowDown,
  pop: Plus,
  pulse: Heart,
  nudge: ArrowRight,
};

const MORE_LIBRARIES: readonly IconLibrary[] = [
  {
    name: "Lucide Animated",
    href: "https://lucide-animated.com",
    desc: "Same stack as this lab (motion + lucide), MIT, copy the source in.",
    descZh: "和本 lab 同款技术栈（motion + lucide），MIT，复制源码即用",
  },
  {
    name: "AnimateIcons",
    href: "https://animateicons.in",
    desc: "281 icons, MIT, ships an npm package @animateicons/react.",
    descZh: "281 个，MIT，提供 npm 包 @animateicons/react",
  },
  {
    name: "LottieFiles",
    href: "https://lottiefiles.com",
    desc: "Huge library of Lottie animations; check each asset's license.",
    descZh: "海量 Lottie 动画素材，许可需逐个确认",
  },
  {
    name: "Lordicon",
    href: "https://lordicon.com",
    desc: "Lottie icons, freemium; free tier needs attribution / non-commercial.",
    descZh: "Lottie 图标，freemium，免费部分需署名/非商用",
  },
] as const;

function SampleShell({ children, hint }: { children: ReactNode; hint: string }) {
  return (
    <div className="relative flex h-16 w-full items-center justify-center">
      {children}
      <span className="pointer-events-none absolute right-1 top-1 text-[0.6rem] uppercase tracking-wide text-muted-foreground/60">
        {hint}
      </span>
    </div>
  );
}

function CheckmarkPath({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StaticIcon({ pattern }: { pattern: IconMotionPattern }) {
  if (pattern === "draw") {
    return <CheckmarkPath className="h-7 w-7 text-foreground" />;
  }
  const Icon = PATTERN_ICON[pattern];
  return <Icon size={28} className="text-foreground" />;
}

function DrawSample({ hint }: { hint: string }) {
  return (
    <SampleShell hint={hint}>
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="rest"
        whileHover="hover"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          variants={{
            rest: { pathLength: 1 },
            hover: { pathLength: [0, 1] },
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.svg>
    </SampleShell>
  );
}

function IconMotionSample({
  entry,
  reduce,
  hint,
}: {
  entry: IconMotionAtom;
  reduce: boolean;
  hint: string;
}) {
  if (reduce) {
    return (
      <SampleShell hint={hint}>
        <StaticIcon pattern={entry.pattern} />
      </SampleShell>
    );
  }

  switch (entry.pattern) {
    case "draw":
      return <DrawSample hint={hint} />;
    case "wiggle":
      return (
        <SampleShell hint={hint}>
          <motion.div
            style={{ display: "inline-flex" }}
            whileHover={{ rotate: [0, -14, 10, -6, 0] }}
            transition={{ duration: 0.6 }}
          >
            <Bell size={28} className="text-foreground" />
          </motion.div>
        </SampleShell>
      );
    case "spin":
      return (
        <SampleShell hint={hint}>
          <motion.div
            style={{ display: "inline-flex" }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Settings size={28} className="text-foreground" />
          </motion.div>
        </SampleShell>
      );
    case "bounce":
      return (
        <SampleShell hint={hint}>
          <motion.div
            style={{ display: "inline-flex" }}
            whileHover={{ y: [0, 4, 0] }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
          >
            <ArrowDown size={28} className="text-foreground" />
          </motion.div>
        </SampleShell>
      );
    case "pop":
      return (
        <SampleShell hint={hint}>
          <motion.div
            style={{ display: "inline-flex" }}
            whileHover={{ scale: [1, 1.25, 1] }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
          >
            <Plus size={28} className="text-foreground" />
          </motion.div>
        </SampleShell>
      );
    case "pulse":
      return (
        <SampleShell hint={hint}>
          <motion.div
            style={{ display: "inline-flex" }}
            whileHover={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          >
            <Heart size={28} className="text-foreground" />
          </motion.div>
        </SampleShell>
      );
    case "nudge":
      return (
        <SampleShell hint={hint}>
          <motion.div
            style={{ display: "inline-flex" }}
            whileHover={{ x: [0, 4, 0] }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
          >
            <ArrowRight size={28} className="text-foreground" />
          </motion.div>
        </SampleShell>
      );
    default:
      return null;
  }
}

export function AnimatedIconsSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
  const reduce = useReducedMotion();
  const hint = t("iconMotionHoverHint");

  return (
    <section aria-labelledby="icons-motion-title">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {t("entryList")}
      </p>
      <h2 id="icons-motion-title" className="mt-2 text-2xl font-semibold text-foreground">
        {t("iconMotionTitle")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t("iconMotionHint")}
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ICON_MOTIONS.map((entry) => (
          <AtomCard
            key={entry.slug}
            id={entry.slug}
            {...entry}
            sample={<IconMotionSample entry={entry} reduce={!!reduce} hint={hint} />}
            valueLabel={t("iconMotionPromptLabel")}
            value={
              <CopyValue
                value={locale === "zh" ? entry.promptZh : entry.prompt}
                label={`icon-motion-${entry.slug}`}
              />
            }
          />
        ))}
      </div>

      <IconLibraryLinks
        title={t("iconMotionMoreTitle")}
        hint={t("iconMotionMoreHint")}
        libraries={MORE_LIBRARIES}
      />
    </section>
  );
}
