import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { CodeBlock } from "@/components/app/docs/code-block";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { REGISTRY_NAME, REGISTRY_NAMESPACE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agents",
  description:
    "Connect the UI Lab MCP server, or use the agent-friendly endpoints (llms.txt, JSON registry, raw source) to consume components programmatically.",
  alternates: { canonical: "/docs/ai-agents" },
  openGraph: {
    title: "AI Agents · UI Lab",
    description:
      "Connect the UI Lab MCP server, or use the agent-friendly endpoints (llms.txt, JSON registry, raw source) to consume components programmatically.",
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
    label: "llms.txt",
    url: "/llms.txt",
    desc: "Markdown index in llmstxt.org format.",
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
    label: "shadcn catalog",
    url: "/registry.json",
    desc: "Directory-compatible registry catalog.",
  },
  {
    label: "shadcn item",
    url: "/r/{slug}.json",
    desc: "Install item with inline file content and shadcn semantic color classes.",
  },
  {
    label: "Raw source",
    url: "/r/{slug}/raw",
    desc: "Plain text .tsx ready to drop in.",
  },
];

const ENDPOINTS_ZH: { label: string; url: string; desc: string }[] = [
  {
    label: "llms.txt",
    url: "/llms.txt",
    desc: "llmstxt.org 格式的 Markdown 索引。",
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
    label: "shadcn catalog",
    url: "/registry.json",
    desc: "与 shadcn directory 兼容的注册表目录。",
  },
  {
    label: "shadcn item",
    url: "/r/{slug}.json",
    desc: "包含内联文件内容和 shadcn 语义化颜色类的安装条目。",
  },
  {
    label: "Raw source",
    url: "/r/{slug}/raw",
    desc: "可直接使用的纯文本 .tsx 源码。",
  },
];

const MCP_URL = `${SITE_URL}/mcp`;

const MCP_CLI_SNIPPET = `# Claude Code
claude mcp add --transport http ${REGISTRY_NAME} ${SITE_URL}/mcp

# Codex
codex mcp add ${REGISTRY_NAME} --url ${SITE_URL}/mcp

# Amp
amp mcp add ${REGISTRY_NAME} ${SITE_URL}/mcp`;

const MCP_MANUAL_SNIPPET = `{
  "mcpServers": {
    "${REGISTRY_NAME}": {
      "type": "http",
      "url": "${SITE_URL}/mcp"
    }
  }
}`;

const FETCH_SNIPPET = `// 1. Discover what exists
const idx = await fetch('${SITE_URL}/r').then((r) => r.json());

// 2. Fetch a component
const entry = await fetch(\`${SITE_URL}/r/\${slug}\`).then((r) => r.json());

// 3. Write files into the user's project
for (const file of entry.files) {
  await writeFile(file.path, file.content);
}

// 4. Install external deps
await runShell(['bun', 'add', ...entry.dependencies]);`;

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
        UI Lab exposes a static, agent-friendly surface. Connect the MCP server
        below, or hit the raw endpoints directly. Coding agents (Claude, Codex,
        Cursor, Amp) can list components, fetch source with all deps, and drop
        files into the user&apos;s project.
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        MCP server
      </h2>
      <p className="mt-2 text-muted-foreground">
        The fastest path: connect the UI Lab MCP server and your agent can list,
        search and install components directly. Hosted at{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
          {MCP_URL}
        </code>
        .
      </p>
      <div className="mt-4">
        <CodeBlock code={MCP_CLI_SNIPPET} lang="bash" filename="terminal" />
      </div>
      <p className="mt-4 text-muted-foreground">
        Any other client: add it manually to your MCP config.
      </p>
      <div className="mt-4">
        <CodeBlock code={MCP_MANUAL_SNIPPET} lang="json" filename="mcp.json" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Tools:{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          list_components
        </code>
        ,{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          search_components
        </code>
        ,{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          get_component
        </code>
        ,{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          get_install_command
        </code>
        .
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
        Four calls, then install. Components are self-contained and own their
        files.
      </p>
      <div className="mt-4">
        <CodeBlock code={FETCH_SNIPPET} lang="ts" filename="agent.ts" />
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
        UI Lab 提供一套静态的、对 Agent 友好的接口。可以连接下方的 MCP
        服务器，也可以直接调用原始端点。编码 Agent（Claude、Codex、Cursor、Amp）
        可以列出组件、拉取带全部依赖的源码，并将文件写入用户的项目。
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
        MCP 服务器
      </h2>
      <p className="mt-2 text-muted-foreground">
        最快的方式：连接 UI Lab 的 MCP 服务器，你的 Agent 就能直接列出、搜索和安装组件。地址为{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
          {MCP_URL}
        </code>
        。
      </p>
      <div className="mt-4">
        <CodeBlock code={MCP_CLI_SNIPPET} lang="bash" filename="terminal" />
      </div>
      <p className="mt-4 text-muted-foreground">
        其他任意客户端：手动添加到你的 MCP 配置中即可。
      </p>
      <div className="mt-4">
        <CodeBlock code={MCP_MANUAL_SNIPPET} lang="json" filename="mcp.json" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        工具：{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          list_components
        </code>
        、{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          search_components
        </code>
        、{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          get_component
        </code>
        、{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
          get_install_command
        </code>
        。
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
        四次调用，然后安装。组件是自包含的，拥有自己的文件。
      </p>
      <div className="mt-4">
        <CodeBlock code={FETCH_SNIPPET} lang="ts" filename="agent.ts" />
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
