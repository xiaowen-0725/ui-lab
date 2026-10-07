import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { CodeBlock } from "@/components/app/docs/code-block";
import { InstallCommand } from "@/components/app/docs/install-command";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { findThemeKit, THEME_KITS, themeKitToCss } from "@/lib/theme-kits";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return THEME_KITS.map((kit) => ({ slug: kit.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const kit = findThemeKit((await params).slug);
  return kit ? { title: kit.name, description: kit.description, alternates: { canonical: `/themes/${kit.slug}` } } : {};
}
export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const kit = findThemeKit((await params).slug);
  if (!kit) notFound();
  const locale = await getLocale();
  const t = await getTranslations("catalog.themeDetail");
  return <div className="relative">
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-24 md:pt-28">
      <Link href="/themes" className="text-sm text-muted-foreground">{t("back")}</Link>
      <h1 className="mt-6 text-3xl font-semibold">{locale === "zh" ? kit.nameZh : kit.name}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{locale === "zh" ? kit.descriptionZh : kit.description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {kit.modes.map((mode) => {
          const tokens = kit[mode]?.shadcn;
          if (!tokens) return null;
          return <section key={mode} className="rounded-2xl border p-6" style={{ background: tokens.background, color: tokens.foreground, borderColor: tokens.border }}>
            <h2 className="font-semibold">{t(mode)}</h2>
            <div className="mt-4 rounded-xl border p-4" style={{ background: tokens.card, color: tokens["card-foreground"], borderColor: tokens.border }}>
              <p>{kit.name}</p>
              <div className="mt-4 flex gap-2">{["primary", "secondary", "accent", "muted"].map((token) => <span key={token} title={token} className="h-10 w-10 rounded-lg border" style={{ background: tokens[token], borderColor: tokens.border }} />)}</div>
            </div>
          </section>;
        })}
      </div>
      <section className="mt-10"><h2 className="mb-4 text-xl font-semibold">{t("install")}</h2><p className="mb-4 text-sm text-muted-foreground">{t("note")}</p><InstallCommand slug={`theme-${kit.slug}`} /></section>
      <section className="mt-10"><h2 className="mb-4 text-xl font-semibold">{t("css")}</h2><a href={`${SITE_URL}/themes/${kit.slug}.css`} className="text-sm underline">{t("download")}</a><div className="mt-4"><CodeBlock code={themeKitToCss(kit)} lang="css" /></div></section>
    </main><SiteFooter />
  </div>;
}
