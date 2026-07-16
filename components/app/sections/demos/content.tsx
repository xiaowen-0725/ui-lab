"use client";

import { ImageIcon, Shield, Sparkles, Star, Zap } from "lucide-react";
import { useLocale } from "next-intl";

// Demo copy stays local to the demo (zh/en pairs) — section demos are
// placeholder content, not site UI, so they don't go through messages/*.json.
const COPY = {
  zh: {
    grid: {
      eyebrow: "为什么选它",
      title: "三件事,做到极致",
      subtitle: "不追求功能堆砌,只把最常用的路径打磨到位。",
      cards: [
        {
          icon: Zap,
          title: "秒级响应",
          desc: "从输入到结果不超过一秒,团队协作时不再互相等待。",
        },
        {
          icon: Shield,
          title: "数据始终安全",
          desc: "端到端加密存储,权限精确到每一份文档、每一个人。",
        },
        {
          icon: Sparkles,
          title: "越用越懂你",
          desc: "根据历史习惯自动排好优先级,少一次手动整理。",
        },
      ],
    },
    alternating: {
      groups: [
        {
          eyebrow: "自动整理",
          title: "杂乱的输入,自动变成有序的结构",
          desc: "上传截图、语音或文字,系统会自动归类打标签,不用再手动建文件夹。",
          link: "看看它是怎么工作的",
          media: "功能截图 / 演示",
        },
        {
          eyebrow: "团队协作",
          title: "一处修改,所有人实时看到",
          desc: "评论、@提醒、版本记录全部内置,不用再在群里反复确认最新版本。",
          link: "了解协作细节",
          media: "功能截图 / 演示",
        },
      ],
    },
  },
  en: {
    grid: {
      eyebrow: "Why teams pick it",
      title: "Three things, done well",
      subtitle: "No feature bloat — just the paths people actually use, polished.",
      cards: [
        {
          icon: Zap,
          title: "Instant response",
          desc: "Under a second from input to result, so nobody waits on anyone else.",
        },
        {
          icon: Shield,
          title: "Secure by default",
          desc: "End-to-end encrypted storage with permissions down to every document.",
        },
        {
          icon: Sparkles,
          title: "Learns your habits",
          desc: "Priorities sort themselves based on history — one less thing to organize.",
        },
      ],
    },
    alternating: {
      groups: [
        {
          eyebrow: "Auto-organized",
          title: "Messy input becomes tidy structure, automatically",
          desc: "Drop in screenshots, voice notes or text — it tags and files them without folders.",
          link: "See how it works",
          media: "Feature screenshot",
        },
        {
          eyebrow: "Built for teams",
          title: "Edit once, everyone sees it live",
          desc: "Comments, mentions and version history are built in — no more 'which version is this'.",
          link: "See the collaboration details",
          media: "Feature screenshot",
        },
      ],
    },
  },
  cards: {
    zh: {
      eyebrow: "客户怎么说",
      title: "来自真实团队的反馈",
      quotes: [
        {
          quote: "上线三周,支持工单量下降了四成,团队终于不用天天救火。",
          name: "林薇",
          title: "某 SaaS 公司客户成功负责人",
        },
        {
          quote: "把三个工具的活儿合并成一个,新人培训时间直接砍半。",
          name: "陈昊",
          title: "初创公司联合创始人",
        },
        {
          quote: "迁移过程比想象中顺利很多,一周就全团队切换完毕。",
          name: "赵敏",
          title: "增长团队负责人",
        },
      ],
    },
    en: {
      eyebrow: "What customers say",
      title: "Feedback from real teams",
      quotes: [
        {
          quote: "Support tickets dropped 40% in three weeks — the team stopped firefighting daily.",
          name: "Lin Wei",
          title: "Head of Customer Success, SaaS company",
        },
        {
          quote: "We merged three tools into one and cut onboarding time in half.",
          name: "Chen Hao",
          title: "Co-founder, early-stage startup",
        },
        {
          quote: "The migration was smoother than expected — the whole team switched in a week.",
          name: "Zhao Min",
          title: "Head of Growth",
        },
      ],
    },
  },
  quote: {
    zh: {
      quote:
        "这是我们用过唯一一款,上线第一周就让整个运营团队主动要求推广到其他部门的工具。",
      name: "周然",
      title: "某上市公司数字化负责人",
    },
    en: {
      quote:
        "This is the only tool we've adopted where the ops team asked, unprompted, to roll it out to other departments in week one.",
      name: "Zhou Ran",
      title: "Head of Digital, publicly listed company",
    },
  },
} as const;

function useLocaleKey() {
  const locale = useLocale();
  return locale === "zh" ? "zh" : "en";
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary-foreground">
      {name.slice(0, 1)}
    </div>
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

/** 卖点网格:小标题 + 副文,下方三张并列卡片,一卡一卖点。 */
export function FeaturesGrid() {
  const locale = useLocaleKey();
  const c = COPY[locale].grid;
  return (
    <section className="flex w-full flex-col items-center gap-10 px-6 py-14 text-center sm:px-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {c.eyebrow}
        </span>
        <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          {c.title}
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {c.subtitle}
        </p>
      </div>
      <div className="grid w-full gap-4 text-left sm:grid-cols-3">
        {c.cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border">
              <card.icon className="h-4 w-4 text-foreground" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** 图文交替:每个卖点单独一组,左右交替配图,适合深讲。 */
export function FeaturesAlternating() {
  const locale = useLocaleKey();
  const c = COPY[locale].alternating;
  return (
    <section className="flex w-full flex-col gap-14 px-6 py-14 sm:px-10">
      {c.groups.map((group, i) => (
        <div key={group.title} className="grid w-full items-center gap-8 md:grid-cols-2">
          <div
            className={`flex flex-col items-start gap-4 ${i % 2 === 1 ? "md:order-2" : ""}`}
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.eyebrow}
            </span>
            <h4 className="text-balance text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
              {group.title}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{group.desc}</p>
            <span className="text-sm font-medium text-foreground underline underline-offset-4">
              {group.link}
            </span>
          </div>
          <MediaPlaceholder
            label={group.media}
            className={`aspect-video w-full ${i % 2 === 1 ? "md:order-1" : ""}`}
          />
        </div>
      ))}
    </section>
  );
}

/** 用户评价卡片:三列引言,数量取胜,覆盖不同人群。 */
export function TestimonialCards() {
  const locale = useLocaleKey();
  const c = COPY.cards[locale];
  return (
    <section className="flex w-full flex-col items-center gap-10 px-6 py-14 text-center sm:px-10">
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {c.eyebrow}
        </span>
        <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          {c.title}
        </h3>
      </div>
      <div className="grid w-full gap-4 text-left sm:grid-cols-3">
        {c.quotes.map((item) => (
          <figure
            key={item.name}
            className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-5"
          >
            <blockquote className="text-sm leading-relaxed text-foreground">
              “{item.quote}”
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar name={item.name} />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.title}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** 单条大引言:居中大字 + 五星 + 头像行,适合一条重磅背书。 */
export function TestimonialQuote() {
  const locale = useLocaleKey();
  const c = COPY.quote[locale];
  return (
    <section className="flex w-full flex-col items-center gap-6 px-6 py-16 text-center sm:px-10">
      <div className="flex items-center gap-1">
        {["s1", "s2", "s3", "s4", "s5"].map((id) => (
          <Star key={id} className="h-4 w-4 fill-current text-accent" />
        ))}
      </div>
      <figure className="flex flex-col items-center gap-6">
        <blockquote className="max-w-2xl text-balance text-xl font-medium leading-snug tracking-tight text-foreground sm:text-2xl">
          “{c.quote}”
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <Avatar name={c.name} />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">{c.name}</span>
            <span className="text-xs text-muted-foreground">{c.title}</span>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
