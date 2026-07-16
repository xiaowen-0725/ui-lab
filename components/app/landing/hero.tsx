"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_OUT } from "@/lib/ease";
import { Link } from "@/i18n/navigation";
import { PressLink } from "@/components/app/press-link";
import { TextReveal } from "@/components/motion/text-reveal";
import { INSTALLABLE_COUNT } from "@/lib/registry";
import { STYLES } from "@/lib/styles";

const STAGGER = 0.09;
const START = 0.12;

export function Hero() {
  const t = useTranslations("hero");
  const headline = t.raw("headline") as string[];
  const headlineWords = headline.reduce(
    (n, line) => n + line.split(" ").length,
    0,
  );
  const headlineEnd = START + headlineWords * STAGGER;
  const subDelay = headlineEnd + 0.05;
  const ctaDelay = subDelay + 0.25;

  return (
    <div className="mx-auto max-w-7xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.05 }}
        className="flex justify-center"
      >
        <div className="mb-7 inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t("badge", { count: INSTALLABLE_COUNT, styles: STYLES.length })}
        </div>
      </motion.div>

      <TextReveal
        as="h1"
        text={headline}
        delay={START}
        stagger={STAGGER}
        className="mx-auto font-display text-5xl font-semibold leading-[0.92] tracking-tight text-foreground sm:text-6xl md:text-7xl"
      />

      <motion.p
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: subDelay }}
        className="mx-auto mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground"
      >
        {t("subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: ctaDelay }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <PressLink
          href="/components/motion"
          className="group inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t("browse")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </PressLink>
        <Link
          href="/docs/ai-agents"
          className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t("aiAgents")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </div>
  );
}
