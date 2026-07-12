import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { findCategory, registry } from "@/lib/registry";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import { ComponentCard } from "@/components/app/docs/component-card";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { SITE_NAME, breadcrumbJsonLd, categoryJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return registry.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) return {};

  const title = `${cat.name} · React motion components`;
  const ogTitle = `${title} · ${SITE_NAME}`;
  const pageUrl = `/components/${cat.slug}`;
  const imageUrl = `/api/og?category=${cat.slug}`;
  const componentNames = cat.components.map((comp) => comp.name);

  return {
    title,
    description: cat.description,
    keywords: [
      `${cat.name} components`,
      "React motion components",
      "best motion components",
      "free motion components",
      "open source motion components",
      "framer motion components",
      "best framer motion components",
      "framer motion templates",
      "Tailwind CSS components",
      "shadcn-compatible components",
      "shadcn registry",
      SITE_NAME,
      ...componentNames,
    ],
    openGraph: {
      title: ogTitle,
      description: cat.description,
      url: pageUrl,
      type: "website",
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${cat.name} components by ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: cat.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: pageUrl,
      types: {
        "application/json": "/registry.json",
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("category");
  const cat = findCategory(category);
  if (!cat) notFound();
  const catName = localizedName(cat, locale);
  const catDescription = localizedDescription(cat, locale);
  const newComponents = cat.components.filter((comp) => comp.badge === "new");
  const components = cat.components.filter((comp) => comp.badge !== "new");

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: SITE_NAME, path: "/" },
            { name: cat.name, path: `/components/${cat.slug}` },
          ]),
          categoryJsonLd(cat),
        ]}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm"
      >
        <span className="font-medium text-foreground">{catName}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {catName}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {catDescription}
      </p>

      {newComponents.length ? (
        <section className="mt-10">
          <p className="font-display text-xs font-medium uppercase text-muted-foreground">
            {t("new")}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {newComponents.map((comp) => (
              <ComponentCard
                key={comp.slug}
                categorySlug={cat.slug}
                slug={comp.slug}
                name={localizedName(comp, locale)}
                description={localizedDescription(comp, locale) ?? comp.description}
                badge={comp.badge}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <p className="font-display text-xs font-medium uppercase text-muted-foreground">
          {t("all", { name: catName })}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {components.map((comp) => (
            <ComponentCard
              key={comp.slug}
              categorySlug={cat.slug}
              slug={comp.slug}
              name={localizedName(comp, locale)}
              description={localizedDescription(comp, locale) ?? comp.description}
              badge={comp.badge}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
