"use client";

import { ArrowDown, ArrowRight, Bell, Heart, Plus, Settings } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { CopyValue } from "@/components/app/atoms/copy-value";
import { IconLibraryLinks } from "@/components/app/atoms/icon-library-links";
import type { IconLibrary } from "@/components/app/atoms/icon-library-links";
import { AnimatedIcon } from "@/components/motion/animated-icon";
import type { Locale } from "@/i18n/routing";
import { ICON_MOTIONS } from "@/lib/atoms";
import type { IconMotionPattern } from "@/lib/atoms";

const PATTERN_ICON: Record<Exclude<IconMotionPattern, "draw">, typeof Bell> = {
  wiggle: Bell,
  spin: Settings,
  bounce: ArrowDown,
  pop: Plus,
  pulse: Heart,
  nudge: ArrowRight,
};

function iconFor(pattern: IconMotionPattern) {
  return pattern === "draw" ? undefined : PATTERN_ICON[pattern];
}

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

function SampleShell({
  pattern,
  hint,
}: {
  pattern: IconMotionPattern;
  hint: string;
}) {
  return (
    <div className="relative flex h-16 w-full items-center justify-center text-foreground">
      <AnimatedIcon variant={pattern} icon={iconFor(pattern)} />
      <span className="pointer-events-none absolute right-1 top-1 text-[0.6rem] uppercase tracking-wide text-muted-foreground/60">
        {hint}
      </span>
    </div>
  );
}

export function AnimatedIconsSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
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
            sample={<SampleShell pattern={entry.pattern} hint={hint} />}
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
