import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export type CatalogSource = {
  id: string;
  href: string;
  name: string;
  nameZh: string;
  description?: string;
  descriptionZh?: string;
  aliases?: readonly string[];
};

export type CatalogLink = {
  id: string;
  href: string;
  name: string;
  altName?: string;
  description?: string;
  aliases: readonly string[];
  /** Shown on the card so the thing is visible before the detail page. */
  preview?: ReactNode;
};

export type CatalogGroup = {
  title?: string;
  items: readonly CatalogLink[];
};

type Described = {
  slug: string;
  name: string;
  nameZh?: string;
  aliases?: readonly string[];
  description?: string;
  descriptionZh?: string;
  whenUse?: string;
  whenUseZh?: string;
};

export function toCatalogLink(
  locale: Locale,
  source: CatalogSource,
): CatalogLink {
  const zh = locale === "zh";
  const name = zh && source.nameZh ? source.nameZh : source.name;
  const altName = zh ? source.name : source.nameZh;
  return {
    id: source.id,
    href: source.href,
    name,
    altName: altName && altName !== name ? altName : undefined,
    description:
      (zh ? source.descriptionZh : source.description) ||
      source.description ||
      source.descriptionZh,
    aliases: (source.aliases ?? []).filter(Boolean).slice(0, 4),
  };
}

export function describedLink(
  locale: Locale,
  href: string,
  entry: Described,
): CatalogLink {
  return toCatalogLink(locale, {
    id: `${href}#${entry.slug}`,
    href,
    name: entry.name,
    nameZh: entry.nameZh ?? entry.name,
    description: entry.description ?? entry.whenUse,
    descriptionZh: entry.descriptionZh ?? entry.whenUseZh,
    aliases: entry.aliases,
  });
}

export function CatalogDoor({
  eyebrow,
  title,
  intro,
  groups,
  alsoCalled,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  groups: readonly CatalogGroup[];
  alsoCalled: string;
}) {
  const visible = groups.filter((group) => group.items.length > 0);

  return (
    <section>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {intro}
      </p>
      <div className="mt-10 flex flex-col gap-12">
        {visible.map((group) => (
          <section key={group.title ?? "items"}>
            {group.title ? (
              <h2 className="text-sm font-medium text-foreground">
                {group.title}
              </h2>
            ) : null}
            <ul
              className={
                group.title
                  ? "mt-4 grid gap-3 sm:grid-cols-2"
                  : "grid gap-3 sm:grid-cols-2"
              }
            >
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/20 transition-colors hover:border-(--color-border-strong)"
                >
                  {item.preview ? (
                    <div
                      inert
                      aria-hidden="true"
                      className="flex h-36 items-center justify-center overflow-hidden border-b border-border/70 bg-background/60 px-4"
                    >
                      {item.preview}
                    </div>
                  ) : null}
                  <div className="p-4">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    {item.altName ? (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {item.altName}
                      </span>
                    ) : null}
                    {item.description ? (
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                    {item.aliases.length > 0 ? (
                      <span className="mt-2 block text-xs text-muted-foreground">
                        {alsoCalled} {item.aliases.join(" · ")}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={item.href}
                    aria-label={
                      item.description
                        ? `${item.name}. ${item.description}`
                        : item.name
                    }
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
