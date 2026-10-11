"use client";

import { ArrowUpRight, FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { ExpandableCode } from "@/components/app/docs/expandable-code";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Already present in any React project; not worth a copy-paste install line.
const SKIP_DEPS = new Set(["react", "react-dom", "next"]);

const LANG_LABELS: Record<string, string> = {
  tsx: "TSX",
  ts: "TS",
  js: "JS",
  jsx: "JSX",
  css: "CSS",
  json: "JSON",
  bash: "Shell",
  sh: "Shell",
};

type ManualFile = {
  path: string;
  type: string;
  content: string;
};

type ManualEntry = {
  category?: string;
  dependencies?: string[];
  files?: ManualFile[];
};

const entryCache = new Map<string, ManualEntry>();
const inflight = new Map<string, Promise<ManualEntry>>();

function langLabelFor(filename?: string, fallback = "TSX") {
  if (!filename) return fallback;
  const ext = filename.split(".").pop()?.toLowerCase() ?? fallback.toLowerCase();
  return LANG_LABELS[ext] ?? ext.toUpperCase();
}

function SourceFileBlock({
  code,
  filename,
  lang,
  className,
}: {
  code: string;
  filename?: string;
  lang?: string;
  className?: string;
}) {
  const langLabel = langLabelFor(filename, lang ?? "TSX");
  const fileDir = filename ? filename.split("/").slice(0, -1).join("/") : null;
  const fileName = filename ? filename.split("/").pop() : null;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "font-mono text-[13px]",
        className,
      )}
    >
      {filename ? (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2 text-xs">
            <span className="inline-flex h-5 shrink-0 items-center rounded border border-border bg-card px-1.5 font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {langLabel}
            </span>
            <FileIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-mono text-muted-foreground">
              {fileDir && <span className="opacity-60">{fileDir}/</span>}
              <span className="font-medium text-foreground">{fileName}</span>
            </span>
          </div>
          <CopyButton text={code} eventLabel={filename ?? lang} />
        </div>
      ) : (
        <div className="absolute right-3 top-3 z-10">
          <CopyButton text={code} eventLabel={filename ?? lang} />
        </div>
      )}
      <ExpandableCode>
        <pre className="overflow-x-auto px-5 py-4 text-[13px] leading-relaxed">
          <code className="font-mono text-[13px]">{code}</code>
        </pre>
      </ExpandableCode>
    </div>
  );
}

async function loadEntry(slug: string): Promise<ManualEntry> {
  const cached = entryCache.get(slug);
  if (cached) return cached;
  const pending = inflight.get(slug);
  if (pending) return pending;

  const request = fetch(`/r/${encodeURIComponent(slug)}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load /r/${slug}`);
      }
      const entry = (await response.json()) as ManualEntry;
      if (!Array.isArray(entry.files)) {
        throw new Error(`Invalid registry entry for ${slug}`);
      }
      entryCache.set(slug, entry);
      return entry;
    })
    .finally(() => {
      inflight.delete(slug);
    });

  inflight.set(slug, request);
  return request;
}

/**
 * shadcn-free install path. File contents come from `/r/<slug>` after the
 * Manual tab opens so catalog ISR pages do not embed the highlighted source
 * graph (saas-admin-site is 200+ files).
 */
export function ManualInstall({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  const [entry, setEntry] = useState<ManualEntry | null>(
    () => entryCache.get(slug) ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadEntry(slug)
      .then((next) => {
        if (cancelled) return;
        if (next.category && next.category !== category) {
          setError("Could not load source files.");
          return;
        }
        setEntry(next);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setEntry(null);
          setError("Could not load source files.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [category, slug]);

  if (error) {
    return <p className="text-sm text-muted-foreground">{error}</p>;
  }

  if (!entry) {
    return <p className="text-sm text-muted-foreground">Loading source…</p>;
  }

  const deps = (entry.dependencies ?? []).filter((dep) => !SKIP_DEPS.has(dep));
  const utilFiles = (entry.files ?? []).filter((file) =>
    file.path.startsWith("lib/"),
  );
  const sourceFiles = (entry.files ?? []).filter(
    (file) => file.type !== "preview" && !file.path.startsWith("lib/"),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        Needs the theme tokens once. Already ran{" "}
        <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
          shadcn init
        </code>
        ? You are set.{" "}
        <Link
          href="/docs/theme"
          className="inline-flex items-center gap-1 text-foreground underline underline-offset-4"
        >
          Theme setup
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {deps.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Install dependencies
          </h3>
          <div className="mt-3">
            <SourceFileBlock code={`npm i ${deps.join(" ")}`} lang="bash" />
          </div>
        </section>
      ) : null}

      {utilFiles.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Add util file{utilFiles.length > 1 ? "s" : ""}
          </h3>
          <div className="mt-3 flex flex-col gap-4">
            {utilFiles.map((file) => (
              <SourceFileBlock
                key={file.path}
                code={file.content}
                filename={file.path}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold text-foreground">
          Copy the source code
        </h3>
        <div className="mt-3 flex flex-col gap-4">
          {sourceFiles.map((file) => (
            <SourceFileBlock
              key={file.path}
              code={file.content}
              filename={file.path}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
