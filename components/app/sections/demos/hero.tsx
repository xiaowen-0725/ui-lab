"use client";

import { ArrowRight, ImageIcon } from "lucide-react";
import { useLocale } from "next-intl";

// Demo copy stays local to the demo (zh/en pairs) — section demos are
// placeholder content, not site UI, so they don't go through messages/*.json.
const COPY = {
  zh: {
    badge: "全新 2.0 发布",
    title: "把想法直接做成网站",
    subtitle: "描述你想要的感觉,剩下的交给它。三分钟,从一句话到上线。",
    primary: "免费开始",
    secondary: "看看示例",
    note: "无需信用卡,注册即用",
    media: "产品截图 / 主视觉",
  },
  en: {
    badge: "Version 2.0 is here",
    title: "Turn ideas into websites",
    subtitle:
      "Describe the feeling you want and let it handle the rest. One sentence to live in three minutes.",
    primary: "Start for free",
    secondary: "See examples",
    note: "No credit card required",
    media: "Product screenshot / key visual",
  },
} as const;

function useCopy() {
  const locale = useLocale();
  return locale === "zh" ? COPY.zh : COPY.en;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
      {children}
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground">
      {children}
    </span>
  );
}

function MediaPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/40 text-xs text-muted-foreground ${className ?? ""}`}
    >
      <ImageIcon className="h-4 w-4" />
      {label}
    </div>
  );
}

/** 居中式:一句话定生死的经典开场 — 徽章 + 大标题 + 副标题 + 双按钮。 */
export function HeroCentered() {
  const c = useCopy();
  return (
    <section className="flex w-full flex-col items-center gap-5 px-6 py-14 text-center sm:px-10">
      <Badge>{c.badge}</Badge>
      <h3 className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        {c.title}
      </h3>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        {c.subtitle}
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton>{c.primary}</PrimaryButton>
        <SecondaryButton>{c.secondary}</SecondaryButton>
      </div>
      <p className="text-xs text-muted-foreground/80">{c.note}</p>
    </section>
  );
}

/** 左文右图:文案与视觉平分秋色,信息密度更高的开场。 */
export function HeroSplit() {
  const c = useCopy();
  return (
    <section className="grid w-full items-center gap-8 px-6 py-14 sm:px-10 md:grid-cols-2">
      <div className="flex flex-col items-start gap-5">
        <Badge>{c.badge}</Badge>
        <h3 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {c.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{c.subtitle}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <PrimaryButton>{c.primary}</PrimaryButton>
          <SecondaryButton>{c.secondary}</SecondaryButton>
        </div>
      </div>
      <MediaPlaceholder label={c.media} className="aspect-[4/3] w-full" />
    </section>
  );
}

/** 大截图式:居中文案 + 下方产品截图压轴,SaaS 最常见的开场。 */
export function HeroScreenshot() {
  const c = useCopy();
  return (
    <section className="flex w-full flex-col items-center gap-5 px-6 pb-10 pt-14 text-center sm:px-10">
      <Badge>{c.badge}</Badge>
      <h3 className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        {c.title}
      </h3>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        {c.subtitle}
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
        <PrimaryButton>{c.primary}</PrimaryButton>
        <SecondaryButton>{c.secondary}</SecondaryButton>
      </div>
      <div className="mt-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/40">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        <MediaPlaceholder label={c.media} className="h-48 rounded-none border-0" />
      </div>
    </section>
  );
}
