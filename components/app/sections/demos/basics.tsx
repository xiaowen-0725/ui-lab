"use client";

import { useLocale } from "next-intl";

// Batch A demos: navbar / logo-wall / stats / cta.
// Demo copy stays local to each component (zh/en pairs) — section demos are
// placeholder content, not site UI, so they don't go through messages/*.json.

function useCopy<T>(copy: { zh: T; en: T }): T {
  const locale = useLocale();
  return locale === "zh" ? copy.zh : copy.en;
}

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
export function NavbarSimple() {
  const c = useCopy(NAV_SIMPLE_COPY);
  return (
    <nav className="flex h-14 w-full items-center justify-between border-b border-border px-6 sm:px-10">
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-accent" />
        <span className="text-sm font-bold text-foreground">{c.brand}</span>
      </div>
      <div className="hidden items-center gap-6 sm:flex">
        {c.links.map((link) => (
          <span key={link} className="text-sm text-muted-foreground">
            {link}
          </span>
        ))}
      </div>
      <span className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground">
        {c.cta}
      </span>
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
export function NavbarCentered() {
  const c = useCopy(NAV_CENTERED_COPY);
  return (
    <nav className="flex h-14 w-full items-center justify-between border-b border-border px-6 sm:px-10">
      <div className="hidden items-center gap-6 sm:flex">
        {c.leftLinks.map((link) => (
          <span key={link} className="text-sm text-muted-foreground">
            {link}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-accent" />
        <span className="text-sm font-bold text-foreground">{c.brand}</span>
      </div>
      <div className="flex items-center gap-4">
        {c.rightLinks.map((link) => (
          <span
            key={link}
            className="hidden text-sm text-muted-foreground sm:inline"
          >
            {link}
          </span>
        ))}
        <span className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground">
          {c.cta}
        </span>
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
export function LogoWallRow() {
  const c = useCopy(LOGO_WALL_COPY);
  return (
    <section className="flex w-full flex-col items-center gap-6 px-6 py-14 sm:px-10">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {c.caption}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {c.logos.map((logo) => (
          <span
            key={logo}
            className="text-lg font-semibold tracking-wide text-muted-foreground/50"
          >
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
export function StatsRow() {
  const c = useCopy(STATS_ROW_COPY);
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="grid grid-cols-3 divide-x divide-border">
        {c.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 px-2 text-center"
          >
            <span className="text-3xl font-semibold text-foreground">
              {stat.value}
            </span>
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
export function CtaBanner() {
  const c = useCopy(CTA_BANNER_COPY);
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary px-6 py-12 text-center">
        <h3 className="max-w-lg text-balance text-2xl font-semibold leading-tight text-primary-foreground sm:text-3xl">
          {c.title}
        </h3>
        <span className="inline-flex h-10 items-center rounded-full bg-background px-5 text-sm font-semibold text-foreground">
          {c.cta}
        </span>
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
export function CtaBoxed() {
  const c = useCopy(CTA_BOXED_COPY);
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-12 text-center">
        <h3 className="max-w-lg text-balance text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          {c.title}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">{c.subtitle}</p>
        <span className="mt-1 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          {c.cta}
        </span>
      </div>
    </section>
  );
}
