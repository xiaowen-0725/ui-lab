import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { GithubIcon } from "@/components/app/icons";
import { registry } from "@/lib/registry";
import { localizedName } from "@/lib/i18n-content";
import { REPO_URL } from "@/lib/site";

// The catalog keeps growing — the footer shows only the newest few per column.
const FOOTER_LIMIT = 8;

const allMotion = registry.find((c) => c.slug === "motion")?.components ?? [];
const allBlocks = registry.find((c) => c.slug === "blocks")?.components ?? [];
const motionComponents = allMotion.slice(-FOOTER_LIMIT).reverse();
const blockComponents = allBlocks.slice(-FOOTER_LIMIT).reverse();

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  return (
    <footer className="border-t border-border px-4 pt-14 pb-10">
      <div className="mx-auto max-w-7xl">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg font-medium text-foreground">
              {tNav("brand")}
            </p>
            <p className="mt-2 max-w-[220px] text-sm leading-6 text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href={REPO_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Components */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("components")}
            </p>
            <ul className="space-y-2.5">
              {motionComponents.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/components/motion/${c.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {localizedName(c, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components/motion"
                  className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                >
                  {t("viewAll", { count: allMotion.length })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Blocks */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("blocks")}
            </p>
            <ul className="space-y-2.5">
              {blockComponents.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/components/blocks/${c.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {localizedName(c, locale)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components/blocks"
                  className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                >
                  {t("viewAll", { count: allBlocks.length })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("links")}
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/components/motion"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("browseAll")}
                </Link>
              </li>
              <li>
                <Link
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("github")}
                </Link>
              </li>
              <li>
                <Link
                  href="/llms.txt"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  llms.txt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
