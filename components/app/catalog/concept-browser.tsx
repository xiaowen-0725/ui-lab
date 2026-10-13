"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ConceptCardFace } from "@/components/app/catalog/concept-samples";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ConceptBrowserItem = {
  slug: string;
  group: string;
  name: string;
  altName?: string;
  description: string;
  aliases: readonly string[];
  /** Lower-cased zh/en names, slug and every alias. */
  haystack: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s\-_·]+/g, "");
}

export function ConceptBrowser({
  items,
  groups,
  labels,
}: {
  items: readonly ConceptBrowserItem[];
  groups: readonly { key: string; title: string }[];
  labels: {
    search: string;
    placeholder: string;
    empty: string;
    all: string;
    alsoCalled: string;
  };
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    return items.filter(
      (item) =>
        (group === null || item.group === group) &&
        (needle === "" || item.haystack.includes(needle)),
    );
  }, [items, query, group]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs transition-colors",
      active
        ? "border-foreground bg-foreground text-background"
        : "border-border text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="mt-8">
      <label className="relative block max-w-xl">
        <span className="sr-only">{labels.search}</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.placeholder}
          className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" aria-pressed={group === null} className={chip(group === null)} onClick={() => setGroup(null)}>
          {labels.all}
        </button>
        {groups.map((entry) => (
          <button
            key={entry.key}
            type="button"
            aria-pressed={group === entry.key}
            className={chip(group === entry.key)}
            onClick={() => setGroup(group === entry.key ? null : entry.key)}
          >
            {entry.title}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li
              key={item.slug}
              className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/20 transition-colors hover:border-(--color-border-strong)"
            >
              <div
                inert
                aria-hidden="true"
                className="flex h-36 items-center justify-center overflow-hidden border-b border-border/70 bg-background/60 px-4"
              >
                <ConceptCardFace slug={item.slug} />
              </div>
              <div className="p-4">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                {item.altName ? (
                  <span className="ml-2 text-sm text-muted-foreground">{item.altName}</span>
                ) : null}
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
                {item.aliases.length > 0 ? (
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {labels.alsoCalled} {item.aliases.join(" · ")}
                  </span>
                ) : null}
              </div>
              <Link
                href={`/dictionary/concepts/${item.slug}`}
                aria-label={`${item.name}. ${item.description}`}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
