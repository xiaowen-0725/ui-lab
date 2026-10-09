"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { APPS } from "@/lib/apps";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { enterTransition, focusRing, useQuietMotion } from "./ui";

export function AppsHome() {
  const t = useTranslations("apps");
  const locale = useLocale() as Locale;
  const quiet = useQuietMotion();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
        <motion.header {...enterTransition(quiet)} className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("workspace")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {t("overviewTitle")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("overviewIntro")}
          </p>
        </motion.header>
        <div className="grid gap-4 sm:grid-cols-2">
          {APPS.map((app, index) => (
            <motion.div key={app.slug} {...enterTransition(quiet, quiet ? 0 : index * 0.04)}>
              <Link
                href={app.href}
                className={cn(
                  "group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-(--color-border-strong) motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{localizedName(app, locale)}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-none"
                  />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {localizedDescription(app, locale)}
                </span>
                <span className="text-xs font-medium text-foreground">{t("open")}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
