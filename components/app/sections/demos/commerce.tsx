"use client";

import { Check } from "lucide-react";
import { useLocale } from "next-intl";

// Demo copy stays local to the demo (zh/en pairs) — section demos are
// placeholder content, not site UI, so they don't go through messages/*.json.
const COPY = {
  zh: {
    pricing: {
      eyebrow: "定价",
      title: "简单透明的价格",
      popular: "最受欢迎",
      perMonth: "/月",
      cta: "开始使用",
      ctaPrimary: "立即升级",
      tiers: [
        {
          name: "免费版",
          price: "¥0",
          features: ["1 个项目", "社区支持", "基础统计", "1 GB 存储"],
        },
        {
          name: "专业版",
          price: "¥99",
          features: ["无限项目", "优先邮件支持", "高级统计与报表", "50 GB 存储"],
        },
        {
          name: "团队版",
          price: "¥299",
          features: ["专业版全部功能", "无限成员席位", "单点登录 SSO", "专属客户经理"],
        },
      ],
      simple: {
        name: "全功能版",
        price: "¥199",
        note: "一个价格,解锁全部功能",
        features: [
          "所有功能无锁定",
          "无限项目与成员",
          "优先技术支持",
          "免费更新,永久使用",
        ],
        cta: "立即购买",
      },
    },
    faq: {
      eyebrow: "常见问题",
      title: "还有疑问?",
      items: [
        {
          q: "可以随时取消吗?",
          a: "可以,在设置页面点击「取消订阅」即可,当前计费周期结束前仍可正常使用,不会扣取下期费用。",
        },
        {
          q: "我的数据安全吗?",
          a: "所有数据传输均使用 TLS 加密,静态数据在数据库层加密存储,并每日自动备份到异地。",
        },
        {
          q: "支持哪些付款方式?",
          a: "支持主流信用卡、支付宝与银行转账,团队版还支持按月开具增值税发票。",
        },
        {
          q: "有免费试用吗?",
          a: "专业版和团队版都提供 14 天免费试用,无需绑定信用卡,到期前会提前邮件提醒。",
        },
      ],
    },
    footer: {
      brand: "Acme",
      tagline: "把想法变成产品的最短路径。",
      groups: [
        { title: "产品", links: ["功能", "定价", "更新日志", "路线图"] },
        { title: "资源", links: ["文档", "博客", "社区", "帮助中心"] },
        { title: "公司", links: ["关于我们", "招聘", "联系我们"] },
      ],
      copyright: "© 2026 Acme, Inc. 保留所有权利。",
      minimalLinks: ["隐私政策", "服务条款", "联系我们"],
    },
  },
  en: {
    pricing: {
      eyebrow: "Pricing",
      title: "Simple, transparent pricing",
      popular: "Most popular",
      perMonth: "/mo",
      cta: "Get started",
      ctaPrimary: "Upgrade now",
      tiers: [
        {
          name: "Free",
          price: "$0",
          features: ["1 project", "Community support", "Basic analytics", "1 GB storage"],
        },
        {
          name: "Pro",
          price: "$99",
          features: [
            "Unlimited projects",
            "Priority email support",
            "Advanced analytics & reports",
            "50 GB storage",
          ],
        },
        {
          name: "Team",
          price: "$299",
          features: [
            "Everything in Pro",
            "Unlimited member seats",
            "Single sign-on (SSO)",
            "Dedicated account manager",
          ],
        },
      ],
      simple: {
        name: "All-access",
        price: "$199",
        note: "One price. Every feature unlocked.",
        features: [
          "No feature gates",
          "Unlimited projects & members",
          "Priority support",
          "Free updates, forever",
        ],
        cta: "Buy now",
      },
    },
    faq: {
      eyebrow: "FAQ",
      title: "Still have questions?",
      items: [
        {
          q: "Can I cancel anytime?",
          a: "Yes — hit \"Cancel subscription\" in settings. You'll keep access until the end of the current billing period, and won't be charged again.",
        },
        {
          q: "Is my data safe?",
          a: "All traffic is encrypted with TLS, data at rest is encrypted at the database layer, and we run automated off-site backups daily.",
        },
        {
          q: "What payment methods do you support?",
          a: "Major credit cards, PayPal and bank transfer. Team plans can also request monthly invoices.",
        },
        {
          q: "Is there a free trial?",
          a: "Pro and Team both include a 14-day free trial, no card required — we'll email you before it ends.",
        },
      ],
    },
    footer: {
      brand: "Acme",
      tagline: "The shortest path from idea to product.",
      groups: [
        { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
        { title: "Resources", links: ["Docs", "Blog", "Community", "Help center"] },
        { title: "Company", links: ["About", "Careers", "Contact"] },
      ],
      copyright: "© 2026 Acme, Inc. All rights reserved.",
      minimalLinks: ["Privacy", "Terms", "Contact"],
    },
  },
} as const;

function useCopy() {
  const locale = useLocale();
  return locale === "zh" ? COPY.zh : COPY.en;
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
      {children}
    </span>
  );
}

function OutlineButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-full items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground">
      {children}
    </span>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
      {children}
    </li>
  );
}

/** 定价表·三档式:锚定效应经典布局——专业版居中高亮,清单只写差异。 */
export function PricingTiers() {
  const c = useCopy().pricing;
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {c.eyebrow}
        </p>
        <h3 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground">
          {c.title}
        </h3>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
        {c.tiers.map((tier, i) => {
          const popular = i === 1;
          return (
            <div
              key={tier.name}
              className={`relative flex flex-col gap-6 rounded-2xl border bg-card p-6 ${
                popular ? "border-border ring-1 ring-(--color-border-strong)" : "border-border"
              }`}
            >
              {popular ? (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                  {c.popular}
                </span>
              ) : null}
              <div>
                <p className="text-sm font-medium text-foreground">{tier.name}</p>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{c.perMonth}</span>
                </p>
              </div>
              <ul className="flex flex-1 flex-col gap-2.5">
                {tier.features.map((f) => (
                  <FeatureItem key={f}>{f}</FeatureItem>
                ))}
              </ul>
              {popular ? (
                <PrimaryButton>{c.ctaPrimary}</PrimaryButton>
              ) : (
                <OutlineButton>{c.cta}</OutlineButton>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 定价表·单档式:一个价格解锁全部功能,砍掉选择成本的买断制布局。 */
export function PricingSimple() {
  const c = useCopy().pricing;
  const s = c.simple;
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">{s.name}</p>
        <p className="flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight text-foreground">
            {s.price}
          </span>
          <span className="text-sm text-muted-foreground">{c.perMonth}</span>
        </p>
        <p className="text-sm text-muted-foreground">{s.note}</p>
        <ul className="flex w-full flex-col gap-2.5 text-left">
          {s.features.map((f) => (
            <FeatureItem key={f}>{f}</FeatureItem>
          ))}
        </ul>
        <PrimaryButton>{s.cta}</PrimaryButton>
      </div>
    </section>
  );
}

/** 常见问题·手风琴式:问题多、省空间——一次只展开一条,真实 details/summary。 */
export function FaqAccordion() {
  const c = useCopy().faq;
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {c.eyebrow}
        </p>
        <h3 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground">
          {c.title}
        </h3>
        <div className="mt-8 flex flex-col">
          {c.items.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="group border-b border-border py-4 first:pt-0"
            >
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 常见问题·两列式:问题少于六个时直接全亮出来,少一次点击。 */
export function FaqTwoColumn() {
  const c = useCopy().faq;
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {c.eyebrow}
        </p>
        <h3 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-foreground">
          {c.title}
        </h3>
        <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {c.items.map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-foreground">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 页脚·分组式:内容多的正式产品站——品牌列 + 多组链接 + 版权行。 */
export function FooterColumns() {
  const c = useCopy().footer;
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <footer className="mx-auto max-w-4xl">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">{c.brand}</span>
            <p className="text-sm text-muted-foreground">{c.tagline}</p>
          </div>
          {c.groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{c.copyright}</p>
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-md border border-border bg-card" />
            <span className="h-7 w-7 rounded-md border border-border bg-card" />
          </div>
        </div>
      </footer>
    </section>
  );
}

/** 页脚·极简式:单页/作品集用,页脚只是收尾——单行 logo + 版权 + 三两个链接。 */
export function FooterMinimal() {
  const c = useCopy().footer;
  return (
    <section className="w-full px-6 py-14 sm:px-10">
      <footer className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{c.brand}</span>
          <span>{c.copyright}</span>
        </div>
        <div className="flex items-center gap-5">
          {c.minimalLinks.map((link) => (
            <span key={link} className="text-sm text-muted-foreground">
              {link}
            </span>
          ))}
        </div>
      </footer>
    </section>
  );
}
