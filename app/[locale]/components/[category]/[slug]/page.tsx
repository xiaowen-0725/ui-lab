import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import {
  findCategory,
  findComponent,
  registry,
  type ComponentExample,
} from "@/lib/registry";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import { CodeBlock } from "@/components/app/docs/code-block";
import { InstallBlock } from "@/components/app/docs/install-block";
import { KeepInMind } from "@/components/app/docs/keep-in-mind";
import { PageNav, type PageNavItem } from "@/components/app/docs/page-nav";
import { PropsTable } from "@/components/app/docs/props-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs";
import { NewBadge } from "@/components/app/docs/new-badge";
import { ComponentCard } from "@/components/app/docs/component-card";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { getPreview, previews } from "@/components/previews";
import { pageUrlFor, withSignature } from "@/lib/signature";
import { readSourceFile } from "@/lib/source-files";
import { getComponentProps } from "@/lib/props-extractor";
import {
  SITE_NAME,
  breadcrumbJsonLd,
  componentJsonLd,
  componentKeywords,
  componentMetaDescription,
  relatedComponents,
} from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.flatMap((c) =>
    c.components.map((comp) => ({ category: c.slug, slug: comp.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const cat = findCategory(category);
  const comp = findComponent(category, slug);
  if (!cat || !comp) return {};
  const installSlugs =
    comp.examples?.flatMap((example) =>
      example.installSlug ? [example.installSlug] : [],
    ) ?? [];
  const registryItem = installSlugs[0]
    ? `/r/${installSlugs[0]}.json`
    : `/r/${comp.slug}.json`;
  const directoryItem = installSlugs[0]
    ? `/${installSlugs[0]}.json`
    : `/${comp.slug}.json`;

  const title = `${comp.name} · React motion component`;
  const ogTitle = `${title} · ${SITE_NAME}`;
  const pageUrl = `/components/${cat.slug}/${comp.slug}`;
  const imageUrl = `/api/og?component=${comp.slug}`;
  const keywords = componentKeywords(cat, comp);
  const metaDescription = componentMetaDescription(comp);

  return {
    title,
    description: metaDescription,
    keywords,
    openGraph: {
      title: ogTitle,
      description: metaDescription,
      url: pageUrl,
      type: "article",
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${comp.name} component preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: metaDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
      types: {
        "application/json":
          installSlugs.length > 0 ? `/r/${comp.slug}` : `/r/${comp.slug}.json`,
        "text/plain": `/r/${comp.slug}/raw`,
      },
    },
    other: {
      "uilab:category": cat.slug,
      "uilab:component": comp.slug,
      "uilab:registry-item": registryItem,
      "uilab:directory-item": directoryItem,
      ...(installSlugs.length > 0
        ? {
            "uilab:variant-registry-items": installSlugs.map(
              (installSlug) => `/r/${installSlug}.json`,
            ),
          }
        : {}),
    },
  };
}

async function loadSource(file: string) {
  return readSourceFile(file);
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("detail");
  const cat = findCategory(category);
  const comp = findComponent(category, slug);
  if (!cat || !comp) notFound();
  const catName = localizedName(cat, locale);
  const compName = localizedName(comp, locale);
  const compDescription = localizedDescription(comp, locale);
  const hasVariantInstallCommands =
    comp.examples?.some((example) => example.installSlug) ?? false;
  const related = relatedComponents(cat.slug, comp.slug, 3);
  const propsDocs = comp.examples?.length ? [] : getComponentProps(comp.file);
  const variantNavItems: PageNavItem[] =
    comp.examples?.map((example) => ({
      id: example.slug,
      label: localizedName(example, locale),
      children: [
        { id: `${example.slug}-preview`, label: t("tabPreview") },
        ...(example.installSlug
          ? [{ id: `${example.slug}-install`, label: t("install") }]
          : []),
        ...(getComponentProps(example.file).length
          ? [
              {
                id: `${example.slug}-api-reference`,
                label: t("apiReference"),
              },
            ]
          : []),
      ],
    })) ?? [];
  const pageNavItems: PageNavItem[] = [
    ...(variantNavItems.length
      ? variantNavItems
      : [
          {
            id: "overview",
            label: compName,
            children: [
              { id: "preview", label: t("tabPreview") },
              ...(!hasVariantInstallCommands
                ? [{ id: "install", label: t("install") }]
                : []),
              ...(propsDocs.length
                ? [{ id: "api-reference", label: t("apiReference") }]
                : []),
            ],
          },
        ]),
    ...(related.length
      ? [{ id: "related-components", label: t("relatedComponents") }]
      : []),
  ];

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-10 2xl:gap-14">
      <div className="min-w-0">
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: SITE_NAME, path: "/" },
              { name: cat.name, path: `/components/${cat.slug}` },
              { name: comp.name, path: `/components/${cat.slug}/${comp.slug}` },
            ]),
            componentJsonLd(cat, comp),
          ]}
        />
        <div id="overview" className="scroll-mt-24">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm"
          >
            <Link
              href={`/components/${cat.slug}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {catName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{compName}</span>
          </nav>
          <div className="mt-4 flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {compName}
            </h1>
            {comp.badge === "new" ? <NewBadge className="mt-1" /> : null}
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {compDescription}
          </p>
        </div>

        {comp.examples?.length ? (
          <div className="mt-10 flex flex-col gap-12">
            {comp.examples.map((ex) => (
              <ExampleBlock
                key={ex.slug}
                category={cat.slug}
                pageSlug={comp.slug}
                example={ex}
              />
            ))}
          </div>
        ) : (
          <DefaultTabs category={category} slug={slug} file={comp.file} />
        )}

        {!hasVariantInstallCommands ? (
          <section
            id="install"
            className="mt-12 scroll-mt-24 border-t border-border pt-8"
          >
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground">
                {t("install")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("installHint")}
              </p>
              <div className="mt-3">
                <InstallBlock category={cat.slug} slug={comp.slug} />
              </div>
            </div>
          </section>
        ) : null}

        {propsDocs.length ? (
          <section
            id="api-reference"
            className="mt-12 scroll-mt-24 border-t border-border pt-8"
          >
            <h2 className="text-sm font-semibold text-foreground">
              {t("apiReference")}
            </h2>
            <div className="mt-4">
              <PropsTable docs={propsDocs} />
            </div>
          </section>
        ) : null}

        {related.length ? (
          <section
            id="related-components"
            className="mt-12 scroll-mt-24 border-t border-border pt-8"
          >
            <h2 className="text-sm font-semibold text-foreground">
              {t("relatedComponents")}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => {
                const relComp = findComponent(rel.category, rel.slug);
                return (
                  <ComponentCard
                    key={`${rel.category}/${rel.slug}`}
                    categorySlug={rel.category}
                    slug={rel.slug}
                    name={relComp ? localizedName(relComp, locale) : rel.name}
                    description={
                      (relComp && localizedDescription(relComp, locale)) ??
                      rel.description
                    }
                    badge={rel.badge}
                  />
                );
              })}
            </div>
          </section>
        ) : null}

        <KeepInMind />
      </div>
      <PageNav items={pageNavItems} />
    </div>
  );
}

async function ExampleBlock({
  category,
  pageSlug,
  example,
}: {
  category: string;
  pageSlug: string;
  example: ComponentExample;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("detail");
  const Preview = previews[example.previewKey];
  const source = await loadSource(example.file);
  const usage = await loadSource(example.previewFile);
  const installSlug = example.installSlug ?? null;
  const propsDocs = getComponentProps(example.file);
  const exampleDescription = localizedDescription(example, locale);

  return (
    <section id={example.slug} className="scroll-mt-24">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {localizedName(example, locale)}
        </h2>
        <code className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          {example.file.split("/").pop()}
        </code>
      </div>
      {exampleDescription ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {exampleDescription}
        </p>
      ) : null}
      <div id={`${example.slug}-preview`} className="scroll-mt-24">
        <Tabs defaultValue="preview" variant="pill">
          <TabsList>
            <TabsTrigger value="preview">{t("tabPreview")}</TabsTrigger>
            <TabsTrigger value="usage">{t("tabUsage")}</TabsTrigger>
            <TabsTrigger value="source">{t("tabCode")}</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="flex min-h-[260px] items-center justify-center py-10">
              {Preview ? <Preview /> : null}
            </div>
          </TabsContent>
          <TabsContent value="usage" className="mt-4">
            <CodeBlock code={usage} filename={example.previewFile} />
          </TabsContent>
          <TabsContent value="source" className="mt-4">
            <CodeBlock
              code={withSignature(
                source,
                example.file,
                pageUrlFor(category, pageSlug),
              )}
              filename={example.file}
            />
          </TabsContent>
        </Tabs>
      </div>
      {installSlug ? (
        <div
          id={`${example.slug}-install`}
          className="mt-5 min-w-0 scroll-mt-24 border-t border-border pt-5"
        >
          <h3 className="text-sm font-semibold text-foreground">
            {t("install")}
          </h3>
          <div className="mt-3">
            <InstallBlock category={category} slug={installSlug} />
          </div>
        </div>
      ) : null}
      {propsDocs.length ? (
        <div
          id={`${example.slug}-api-reference`}
          className="mt-5 min-w-0 scroll-mt-24 border-t border-border pt-5"
        >
          <h3 className="text-sm font-semibold text-foreground">
            {t("apiReference")}
          </h3>
          <div className="mt-3">
            <PropsTable docs={propsDocs} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

async function DefaultTabs({
  category,
  slug,
  file,
}: {
  category: string;
  slug: string;
  file: string;
}) {
  const t = await getTranslations("detail");
  const Preview = getPreview(category, slug);
  const previewFile = `components/previews/${category}/${slug}.preview.tsx`;
  const source = await loadSource(file);
  const usage = await loadSource(previewFile);

  return (
    <section id="preview" className="mt-8 scroll-mt-24">
      <Tabs defaultValue="preview" variant="pill">
        <TabsList>
          <TabsTrigger value="preview">{t("tabPreview")}</TabsTrigger>
          <TabsTrigger value="usage">{t("tabUsage")}</TabsTrigger>
          <TabsTrigger value="source">{t("tabCode")}</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <div className="flex min-h-[320px] items-center justify-center py-10">
            {Preview ? <Preview /> : null}
          </div>
        </TabsContent>
        <TabsContent value="usage" className="mt-4">
          <CodeBlock code={usage} filename={previewFile} />
        </TabsContent>
        <TabsContent value="source" className="mt-4">
          <CodeBlock
            code={withSignature(source, file, pageUrlFor(category, slug))}
            filename={file}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
