"use client";

import { cn } from "@/lib/utils";
import { SectionAction, type SectionProps } from "./shared";

const NAV_SIMPLE_COPY = {
  zh: {
    brand: "Acme",
    links: ["产品", "定价", "文档", "关于"],
    cta: "登录",
  },
  en: {
    brand: "Acme",
    links: ["Product", "Pricing", "Docs", "About"],
    cta: "Sign in",
  },
};

/** simple:单行三段式的默认之选 — logo + 文字链接 + 一个主按钮。 */
export type NavbarSimpleProps = SectionProps<typeof NAV_SIMPLE_COPY.zh>;

export function NavbarSimple(props: NavbarSimpleProps = {}) {
  const { locale = "zh", content, className } = props;
  const c = { ...NAV_SIMPLE_COPY[locale], ...content };
  return (
    <nav
      className={cn(
        "flex h-14 w-full items-center justify-between border-b border-border px-6 sm:px-10",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-accent" />
        <span className="text-sm font-bold text-foreground">{c.brand}</span>
      </div>
      <div className="hidden items-center gap-6 sm:flex">
        {c.links.map((link) => (
          <SectionAction
            action={link}
            onAction={props.onAction}
            hrefs={props.hrefs}
            key={link}
            className="text-sm text-muted-foreground"
          >
            {link}
          </SectionAction>
        ))}
      </div>
      <SectionAction
        action="sign-in"
        onAction={props.onAction}
        hrefs={props.hrefs}
        className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
      >
        {c.cta}
      </SectionAction>
    </nav>
  );
}

const NAV_CENTERED_COPY = {
  zh: {
    brand: "Acme",
    leftLinks: ["产品", "案例"],
    rightLinks: ["定价", "文档"],
    cta: "登录",
  },
  en: {
    brand: "Acme",
    leftLinks: ["Product", "Showcase"],
    rightLinks: ["Pricing", "Docs"],
    cta: "Sign in",
  },
};

/** centered:logo 居中占主位,左右各挂两个链接 — 品牌感优先的三段式。 */
export type NavbarCenteredProps = SectionProps<typeof NAV_CENTERED_COPY.zh>;

export function NavbarCentered(props: NavbarCenteredProps = {}) {
  const { locale = "zh", content, className } = props;
  const c = { ...NAV_CENTERED_COPY[locale], ...content };
  return (
    <nav
      className={cn(
        "flex h-14 w-full items-center justify-between border-b border-border px-6 sm:px-10",
        className,
      )}
    >
      <div className="hidden items-center gap-6 sm:flex">
        {c.leftLinks.map((link) => (
          <SectionAction
            action={link}
            onAction={props.onAction}
            hrefs={props.hrefs}
            key={link}
            className="text-sm text-muted-foreground"
          >
            {link}
          </SectionAction>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-accent" />
        <span className="text-sm font-bold text-foreground">{c.brand}</span>
      </div>
      <div className="flex items-center gap-4">
        {c.rightLinks.map((link) => (
          <SectionAction
            action={link}
            onAction={props.onAction}
            hrefs={props.hrefs}
            key={link}
            className="hidden text-sm text-muted-foreground sm:inline"
          >
            {link}
          </SectionAction>
        ))}
        <SectionAction
          action="sign-in"
          onAction={props.onAction}
          hrefs={props.hrefs}
          className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
        >
          {c.cta}
        </SectionAction>
      </div>
    </nav>
  );
}

const LOGO_WALL_COPY = {
  zh: {
    caption: "被 2,000+ 团队信任",
    logos: ["ACME", "Nova", "Vertex", "Orbit", "Lumen"],
  },
  en: {
    caption: "Trusted by 2,000+ teams",
    logos: ["ACME", "Nova", "Vertex", "Orbit", "Lumen"],
  },
};

/** row:一行居中小字说明 + 一排灰度 wordmark,紧跟 hero 的信任背书。 */
export type LogoWallRowProps = SectionProps<typeof LOGO_WALL_COPY.zh>;

export function LogoWallRow(props: LogoWallRowProps = {}) {
  const { locale = "zh", content, className } = props;
  const c = { ...LOGO_WALL_COPY[locale], ...content };
  return (
    <section
      className={cn("flex w-full flex-col items-center gap-6 px-6 py-14 sm:px-10", className)}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {c.caption}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {c.logos.map((logo) => (
          <span key={logo} className="text-lg font-semibold tracking-wide text-muted-foreground/50">
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}

const STATS_ROW_COPY = {
  zh: {
    stats: [
      { value: "10k+", label: "活跃用户" },
      { value: "99.9%", label: "服务可用性" },
      { value: "4.9", label: "用户评分" },
    ],
  },
  en: {
    stats: [
      { value: "10k+", label: "Active users" },
      { value: "99.9%", label: "Uptime" },
      { value: "4.9", label: "User rating" },
    ],
  },
};

/** row:三个大数字并排,列间细线分隔 — 页面中段的最小信任证明。 */
export type StatsRowProps = SectionProps<typeof STATS_ROW_COPY.zh>;

export function StatsRow(props: StatsRowProps = {}) {
  const { locale = "zh", content, className } = props;
  const c = { ...STATS_ROW_COPY[locale], ...content };
  return (
    <section className={cn("w-full px-6 py-14 sm:px-10", className)}>
      <div className="grid grid-cols-3 divide-x divide-border">
        {c.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 px-2 text-center">
            <span className="text-3xl font-semibold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const CTA_BANNER_COPY = {
  zh: { title: "准备好开始了吗?", cta: "立即免费试用" },
  en: { title: "Ready to get started?", cta: "Start free trial" },
};

/** banner:全宽实色色带压轴,页面最后一次强推转化。 */
export type CtaBannerProps = SectionProps<typeof CTA_BANNER_COPY.zh>;

export function CtaBanner(props: CtaBannerProps = {}) {
  const { locale = "zh", content, className } = props;
  const c = { ...CTA_BANNER_COPY[locale], ...content };
  return (
    <section className={cn("w-full px-6 py-14 sm:px-10", className)}>
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-12 text-center">
        <h3 className="max-w-lg text-balance text-2xl font-semibold leading-tight text-primary-foreground sm:text-3xl">
          {c.title}
        </h3>
        <SectionAction
          action={"start"}
          onAction={props.onAction}
          hrefs={props.hrefs}
          className="inline-flex h-10 items-center rounded-full bg-background px-5 text-sm font-semibold text-foreground"
        >
          {c.cta}
        </SectionAction>
      </div>
    </section>
  );
}

const CTA_BOXED_COPY = {
  zh: {
    title: "还在犹豫?",
    subtitle: "3 分钟接入,随时可以取消。",
    cta: "免费开始",
  },
  en: {
    title: "Still on the fence?",
    subtitle: "Set up in 3 minutes, cancel anytime.",
    cta: "Start for free",
  },
};

/** boxed:卡片式盒子插在正文中段,不打断阅读节奏的轻量召唤。 */
export type CtaBoxedProps = SectionProps<typeof CTA_BOXED_COPY.zh>;

export function CtaBoxed(props: CtaBoxedProps = {}) {
  const { locale = "zh", content, className } = props;
  const c = { ...CTA_BOXED_COPY[locale], ...content };
  return (
    <section className={cn("w-full px-6 py-14 sm:px-10", className)}>
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-12 text-center">
        <h3 className="max-w-lg text-balance text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {c.title}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">{c.subtitle}</p>
        <SectionAction
          action={"start"}
          onAction={props.onAction}
          hrefs={props.hrefs}
          className="mt-1 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          {c.cta}
        </SectionAction>
      </div>
    </section>
  );
}
