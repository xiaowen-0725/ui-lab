import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { CodeBlock } from "@/components/app/docs/code-block";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { REGISTRY_NAMESPACE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agents",
  description:
    "Reuse the whole UI Lab vocabulary from an AI agent: the ui-lab CLI and skill, or plain HTTP endpoints (catalog.json, llms.txt, llms-full.txt) and the shadcn registry.",
  alternates: { canonical: "/docs/ai-agents" },
  openGraph: {
    title: "AI Agents · UI Lab",
    description:
      "Reuse the whole UI Lab vocabulary from an AI agent: the ui-lab CLI and skill, or plain HTTP endpoints (catalog.json, llms.txt, llms-full.txt) and the shadcn registry.",
    url: "/docs/ai-agents",
    type: "article",
    siteName: "UI Lab",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents · UI Lab",
    images: ["/api/og"],
  },
};

const ENDPOINTS: { label: string; url: string; desc: string }[] = [
  {
    label: "catalog.json",
    url: "/catalog.json",
    desc: "The whole vocabulary as structured JSON — components, tokens, icons, styles, palettes, design systems.",
  },
  {
    label: "llms.txt",
    url: "/llms.txt",
    desc: "Grouped Markdown index of the whole vocabulary with per-item fetch hints.",
  },
  {
    label: "llms-full.txt",
    url: "/llms-full.txt",
    desc: "Every item's prompt or token block inlined — one fetch, everything.",
  },
  {
    label: "Registry index",
    url: "/r",
    desc: "JSON catalogue of every component.",
  },
  {
    label: "Component detail",
    url: "/r/{slug}",
    desc: "JSON with files, deps, source.",
  },
  {
    label: "shadcn item",
    url: "/r/{slug}.json",
    desc: "Install item with inline file content.",
  },
  {
    label: "Raw source",
    url: "/r/{slug}/raw",
    desc: "Plain text .tsx ready to drop in.",
  },
];

const ENDPOINTS_ZH: { label: string; url: string; desc: string }[] = [
  {
    label: "catalog.json",
    url: "/catalog.json",
    desc: "整套词汇的结构化 JSON——组件、token、图标、风格、配色、设计系统。",
  },
  {
    label: "llms.txt",
    url: "/llms.txt",
    desc: "整套词汇的分组 Markdown 索引，每项带取用提示。",
  },
  {
    label: "llms-full.txt",
    url: "/llms-full.txt",
    desc: "每项的 prompt 或 token 块内联——一次拉取拿全部。",
  },
  {
    label: "Registry index",
    url: "/r",
    desc: "所有组件的 JSON 目录。",
  },
  {
    label: "Component detail",
    url: "/r/{slug}",
    desc: "包含文件、依赖、源码的 JSON。",
  },
  {
    label: "shadcn item",
    url: "/r/{slug}.json",
    desc: "包含内联文件内容的安装条目。",
  },
  {
    label: "Raw source",
    url: "/r/{slug}/raw",
    desc: "可直接使用的纯文本 .tsx 源码。",
  },
];

const CLI_SNIPPET = `# \`ui-lab\` is on PATH after \`bun link\` (or run \`bun cli/src/index.ts\` in the repo)
ui-lab search "bottom sheet"     # find across every kind
ui-lab list --kind icon-motion   # browse one kind
ui-lab show minimal-light        # description, AI prompt, page URL, and the fetch block
ui-lab add bottom-sheet          # prints the shadcn install command (never runs it)
# add --json to any command for structured, agent-friendly output`;

const CATALOG_SNIPPET = `// 1. Discover the whole vocabulary in one call
const { items } = await fetch('${SITE_URL}/catalog.json').then((r) => r.json());

// 2. Pick what you need, then fetch it by kind
const item = items.find((i) => i.slug === slug);

if (item.kind === 'component') {
  // components install through the shadcn registry
  await runShell(item.fetch.command.split(' '));
} else {
  // tokens, icons, styles, palettes, design systems arrive inline
  applyPromptOrTokens(item.fetch.value);
}`;

const SHADCN_SNIPPET = `# Registry namespace (after adding this registry to components.json)
npx shadcn@latest add ${REGISTRY_NAMESPACE}/animated-toast-stack

# Direct URL, no namespace needed
npx shadcn@latest add ${SITE_URL}/r/animated-toast-stack.json`;

const ENTRY_SHAPE = `{
  "slug": "swap",
  "name": "Multi-chain Swap",
  "description": "Cross-chain swap widget with chain + token selectors, animated flip and quote.",
  "category": "motion",
  "page_url": "${SITE_URL}/components/motion/swap",
  "detail_url": "${SITE_URL}/r/swap",
  "raw_url": "${SITE_URL}/r/swap/raw",
  "dependencies": ["motion", "lucide-react", "react"],
  "internal": ["@/lib/utils"],
  "files": [
    { "path": "components/motion/swap.tsx", "type": "component", "content": "..." },
    { "path": "components/previews/motion/swap.preview.tsx", "type": "preview", "content": "..." },
    { "path": "lib/utils.ts", "type": "util", "content": "..." }
  ]
}`;

export default async function AiAgentsPage() {
  const locale = (await getLocale()) as Locale;
  return locale === "zh" ? <ContentZh /> : <ContentEn />;
}

function ContentEn() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Intro
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        For AI agents
      </h1>
      <p className="mt-3 text-muted-foreground">
        UI Lab exposes its whole visual vocabulary to agents — not just
        components, but design tokens, icons, styles, palettes, and full
        design systems. Two ways in: the ui-lab CLI and skill for agents with
        a shell, or plain HTTP endpoints for any agent.
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        CLI &amp; skill
      </h2>
      <p className="mt-2 text-muted-foreground">
        The fastest path for a coding agent: the ui-lab CLI discovers and
        fetches everything from the terminal. It&apos;s on PATH after bun
        link, or run bun cli/src/index.ts inside the repo.
      </p>
      <div className="mt-4">
        <CodeBlock code={CLI_SNIPPET} lang="bash" filename="terminal" />
      </div>
      <p className="mt-4 text-muted-foreground">
        The ui-lab skill packages when to reach for UI Lab and how to apply
        each kind — bridge it to Claude Code, Codex, generic Agents and Grok.
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        Endpoints
      </h2>
      <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {ENDPOINTS.map((e) => (
          <li
            key={e.url}
            className="flex items-start justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <code className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground">
                  {e.url}
                </code>
                <span className="text-sm font-medium text-foreground">
                  {e.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
            </div>
            {!e.url.includes("{") ? (
              <Link
                href={e.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Open
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            ) : null}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        Agent flow
      </h2>
      <p className="mt-2 text-muted-foreground">
        Discover from the catalog, then fetch by kind — components install
        through shadcn, everything else arrives as an inline prompt or token
        block.
      </p>
      <div className="mt-4">
        <CodeBlock code={CATALOG_SNIPPET} lang="ts" filename="agent.ts" />
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        shadcn flow
      </h2>
      <p className="mt-2 text-muted-foreground">
        The shadcn item installs source files and package dependencies.
        Components use shadcn semantic color utilities directly, so they inherit
        the target app&apos;s theme without UI Lab-specific color variables.
      </p>
      <div className="mt-4">
        <CodeBlock code={SHADCN_SNIPPET} lang="bash" filename="terminal" />
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        Entry shape
      </h2>
      <p className="mt-2 text-muted-foreground">
        Internal helpers (e.g.{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          @/lib/utils
        </code>
        ) ship inline as{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          type: util
        </code>{" "}
        so the agent does not have to chase imports.
      </p>
      <div className="mt-4">
        <CodeBlock code={ENTRY_SHAPE} lang="json" filename="r/swap.json" />
      </div>
    </>
  );
}

function ContentZh() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        简介
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        面向 AI Agent
      </h1>
      <p className="mt-3 text-muted-foreground">
        UI Lab 把整套视觉词汇暴露给 Agent——不只是组件，还有设计 token、图标、风格、配色、整套设计系统。两条路：给有 shell 的 Agent 用 ui-lab CLI 和 skill，或任意 Agent 直接调用 HTTP 端点。
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        CLI 与 skill
      </h2>
      <p className="mt-2 text-muted-foreground">
        编码 Agent 最快的方式：ui-lab CLI 从终端发现并取用一切。bun link 后它在 PATH 上，或在仓库内跑 bun cli/src/index.ts。
      </p>
      <div className="mt-4">
        <CodeBlock code={CLI_SNIPPET} lang="bash" filename="terminal" />
      </div>
      <p className="mt-4 text-muted-foreground">
        ui-lab skill 打包了「何时来 UI Lab、怎么按类应用」——桥接到 Claude Code、Codex、通用 Agents 和 Grok。
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        端点
      </h2>
      <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {ENDPOINTS_ZH.map((e) => (
          <li
            key={e.url}
            className="flex items-start justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <code className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground">
                  {e.url}
                </code>
                <span className="text-sm font-medium text-foreground">
                  {e.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
            </div>
            {!e.url.includes("{") ? (
              <Link
                href={e.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                打开
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            ) : null}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        Agent 流程
      </h2>
      <p className="mt-2 text-muted-foreground">
        从 catalog 发现，再按类取用——组件走 shadcn 安装，其余都以内联 prompt 或 token 块给到。
      </p>
      <div className="mt-4">
        <CodeBlock code={CATALOG_SNIPPET} lang="ts" filename="agent.ts" />
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        shadcn 流程
      </h2>
      <p className="mt-2 text-muted-foreground">
        shadcn 条目会安装源码文件和依赖包。组件直接使用 shadcn
        语义化颜色工具类，因此无需 UI Lab 专属的颜色变量即可继承目标应用的主题。
      </p>
      <div className="mt-4">
        <CodeBlock code={SHADCN_SNIPPET} lang="bash" filename="terminal" />
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        条目结构
      </h2>
      <p className="mt-2 text-muted-foreground">
        内部辅助模块（例如{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          @/lib/utils
        </code>
        ）以{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          type: util
        </code>{" "}
        的形式内联提供，Agent 无需再追踪 import 依赖。
      </p>
      <div className="mt-4">
        <CodeBlock code={ENTRY_SHAPE} lang="json" filename="r/swap.json" />
      </div>
    </>
  );
}
