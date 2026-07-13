import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { CodeBlock } from "@/components/app/docs/code-block";
import { THEME_CSS } from "@/lib/theme-css";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Theme setup",
  description:
    "One-time theme setup for UI Lab components: install the shadcn token layer, or paste the UI Lab theme CSS into your globals.css.",
  alternates: { canonical: "/docs/theme" },
  openGraph: {
    title: "Theme setup · UI Lab",
    description:
      "One-time theme setup for UI Lab components: shadcn tokens or the UI Lab theme CSS.",
    url: "/docs/theme",
    type: "article",
    siteName: "UI Lab",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theme setup · UI Lab",
    images: ["/api/og"],
  },
};

const SHADCN_INIT = `npx shadcn@latest init`;

export default async function ThemePage() {
  const locale = (await getLocale()) as Locale;
  return locale === "zh" ? <ContentZh /> : <ContentEn />;
}

function ContentEn() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Setup
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        Theme setup
      </h1>
      <p className="mt-3 text-muted-foreground">
        UI Lab components style themselves with shadcn semantic tokens
        (<code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">bg-primary</code>,
        {" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">text-muted-foreground</code>,
        {" "}border, ring). Set those tokens up once and every component works.
        Two ways:
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        Option 1 — shadcn init (recommended)
      </h2>
      <p className="mt-2 text-muted-foreground">
        If your project uses shadcn, you already have these tokens. Otherwise
        run init once; it writes the token layer into your CSS.
      </p>
      <div className="mt-4">
        <CodeBlock code={SHADCN_INIT} lang="bash" filename="terminal" />
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        Option 2 — paste the theme CSS
      </h2>
      <p className="mt-2 text-muted-foreground">
        Not using shadcn? Paste this into your{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">globals.css</code>{" "}
        directly below{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">@import "tailwindcss";</code>.
        It defines the tokens, motion animations and surface utilities the
        components use. Requires Tailwind CSS v4.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Also available at{" "}
        <Link
          href="/theme.css"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-foreground underline underline-offset-4"
        >
          /theme.css
          <ArrowUpRight className="h-3 w-3" />
        </Link>
        .
      </p>
      <div className="mt-4">
        <CodeBlock code={THEME_CSS} lang="css" filename="globals.css" />
      </div>
    </div>
  );
}

function ContentZh() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        设置
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        主题设置
      </h1>
      <p className="mt-3 text-muted-foreground">
        UI Lab 组件使用 shadcn 语义化令牌
        (<code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">bg-primary</code>,
        {" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">text-muted-foreground</code>,
        {" "}border、ring 等）来设置自身样式。只需配置一次这些令牌，所有组件即可正常工作。
        有两种方式：
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        方式一 — shadcn init（推荐）
      </h2>
      <p className="mt-2 text-muted-foreground">
        如果你的项目已经使用 shadcn，那么这些令牌已经存在。否则运行一次 init
        命令，它会将令牌层写入你的 CSS 中。
      </p>
      <div className="mt-4">
        <CodeBlock code={SHADCN_INIT} lang="bash" filename="terminal" />
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        方式二 — 粘贴主题 CSS
      </h2>
      <p className="mt-2 text-muted-foreground">
        没有使用 shadcn？将以下内容粘贴到你的{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">globals.css</code>{" "}
        中，紧跟在{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">@import "tailwindcss";</code>{" "}
        之后即可。它定义了组件所使用的令牌、动效动画和表面（surface）工具类。
        需要 Tailwind CSS v4。
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        也可以在{" "}
        <Link
          href="/theme.css"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-foreground underline underline-offset-4"
        >
          /theme.css
          <ArrowUpRight className="h-3 w-3" />
        </Link>
        中获取。
      </p>
      <div className="mt-4">
        <CodeBlock code={THEME_CSS} lang="css" filename="globals.css" />
      </div>
    </div>
  );
}
