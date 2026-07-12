import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * next-intl locale routing. Only page routes are localized. Machine endpoints
 * stay locale-agnostic and are excluded from the matcher below:
 *   - `/r`, `/r/*`             shadcn registry (JSON + raw source)
 *   - `/registry.json`         directory registry
 *   - `/llms.txt`              AI agent catalog
 *   - `/opengraph-image`       generated OG image
 *   - anything with a `.` (sitemap.xml, robots.txt, theme.css, manifest, …)
 *   - `/api`, `/_next`, `/_vercel`
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|r|registry\\.json|opengraph-image|.*\\..*).*)",
  ],
};
