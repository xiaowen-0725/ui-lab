/**
 * Canonical site origin (server-only). Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL          — explicit override (any host)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — auto-set on Vercel, stable prod domain
 *   3. http://localhost:3000         — local dev
 * So a Vercel deploy points registry/OG/canonical URLs at the real domain with
 * zero config; set NEXT_PUBLIC_SITE_URL to use a custom domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Source repository URL shown in the header / footer. Override per environment
 * via NEXT_PUBLIC_REPO_URL.
 */
export const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ??
  "https://github.com/xiaowen-0725/ui-lab";

/**
 * shadcn registry name. This is what consumers reference as the install
 * namespace (`@uilab/<component>`) after adding this registry to their
 * components.json. Change it here to rebrand every install command at once.
 */
export const REGISTRY_NAME = "uilab";
export const REGISTRY_NAMESPACE = `@${REGISTRY_NAME}`;
