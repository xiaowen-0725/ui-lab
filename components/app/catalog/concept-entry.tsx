import type { ReactNode } from "react";
import { ConceptSample } from "@/components/app/catalog/concept-samples";
import { CopyButton } from "@/components/app/docs/copy-button";
import { InstallCommand } from "@/components/app/docs/install-command";
import { previews } from "@/components/previews";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedName } from "@/lib/i18n-content";
import { findComponent } from "@/lib/registry";

type DictionaryEntry = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  sentence: string;
  sentenceZh: string;
  prompt: string;
  promptZh: string;
  component?: {
    category: "motion" | "blocks";
    slug: string;
    previewKey?: string;
    installSlug: string;
  };
  related?: {
    category: "motion" | "blocks";
    slug: string;
    name: string;
    nameZh: string;
  };
  crossNames?: { antd?: string; shadcn?: string; spectrum?: string };
};

type Confusable = {
  slug: string;
  name: string;
  nameZh: string;
  sentence: string;
  sentenceZh: string;
};

export function ConceptEntryView({
  entry,
  locale,
  sample,
  confusables = [],
  labels,
}: {
  entry: DictionaryEntry;
  locale: Locale;
  /** Shown when this entry has no component preview. */
  sample?: ReactNode;
  /** Concept entries people mix this one up with; each links back here. */
  confusables?: readonly Confusable[];
  labels: {
    eyebrow: string;
    alsoCalled: string;
    sayToAi: string;
    install: string;
    openComponent: string;
    sameComponent: string;
    oneWay: string;
    confusable?: string;
    crossNames?: string;
  };
}) {
  const zh = locale === "zh";
  const name = zh ? entry.nameZh : entry.name;
  const altName = zh ? entry.name : entry.nameZh;
  const sentence = zh ? entry.sentenceZh : entry.sentence;
  const prompt = zh ? entry.promptZh : entry.prompt;
  const component = entry.component;
  const Preview = component?.previewKey ? previews[component.previewKey] : null;
  const shipped = component
    ? findComponent(component.category, component.slug)
    : undefined;
  const variants =
    shipped?.examples?.filter(
      (example) => example.previewKey !== component?.previewKey,
    ) ?? [];
  const componentHref = component
    ? `/components/${component.category}/${component.slug}`
    : null;

  return (
    <article>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {labels.eyebrow}
      </p>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
        <div className="order-2 min-w-0 lg:order-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{altName}</p>
          {entry.aliases.length > 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {labels.alsoCalled} {entry.aliases.join(" · ")}
            </p>
          ) : null}
          <p className="mt-4 text-sm leading-relaxed text-foreground">{sentence}</p>
          {entry.crossNames && labels.crossNames ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {labels.crossNames}{" "}
              {Object.entries(entry.crossNames)
                .map(([library, crossName]) => `${library} ${crossName}`)
                .join(" · ")}
            </p>
          ) : null}

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-foreground">
                {labels.sayToAi}
              </h2>
              <CopyButton
                text={prompt}
                eventName="copy_prompt"
                eventLabel={entry.slug}
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {prompt}
            </p>
          </section>

          {confusables.length > 0 && labels.confusable ? (
            <section className="mt-8">
              <h2 className="text-sm font-medium text-foreground">
                {labels.confusable}
              </h2>
              <ul className="mt-3 grid gap-2">
                {confusables.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/dictionary/concepts/${other.slug}`}
                      className="block rounded-xl border border-border px-3 py-2 transition-colors hover:border-(--color-border-strong)"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {zh ? other.nameZh : other.name}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {zh ? other.name : other.nameZh}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {zh ? other.sentenceZh : other.sentence}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {component && componentHref ? (
            <section className="mt-8">
              <h2 className="text-sm font-medium text-foreground">{labels.install}</h2>
              <div className="mt-3">
                <InstallCommand slug={component.installSlug} />
              </div>
              <Link
                href={componentHref}
                className="mt-3 inline-flex text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {labels.openComponent}
              </Link>
              {variants.length > 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {labels.sameComponent}{" "}
                  {variants.map((variant, index) => (
                    <span key={variant.slug}>
                      {index > 0 ? " · " : null}
                      <Link
                        href={`${componentHref}#${variant.slug}`}
                        className="text-foreground underline-offset-4 hover:underline"
                      >
                        {localizedName(variant, locale)}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </section>
          ) : null}

          {entry.related ? (
            <p className="mt-8 text-sm text-muted-foreground">
              {labels.oneWay}{" "}
              <Link
                href={`/components/${entry.related.category}/${entry.related.slug}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {zh ? entry.related.nameZh : entry.related.name}
              </Link>
            </p>
          ) : null}
        </div>

        <div className="order-1 flex min-h-[320px] min-w-0 items-center justify-center overflow-auto rounded-2xl border border-border bg-card/20 p-6 lg:order-2">
          {Preview ? <Preview /> : (sample ?? <ConceptSample slug={entry.slug} />)}
        </div>
      </div>
    </article>
  );
}
