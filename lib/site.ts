/** Canonical site origin. Override per environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Source repository URL shown in the header / footer. Set NEXT_PUBLIC_REPO_URL
 * once this library has its own repo; until then it points at a placeholder.
 */
export const REPO_URL = process.env.NEXT_PUBLIC_REPO_URL ?? "#";

/**
 * shadcn registry name. This is what consumers reference as the install
 * namespace (`@uilab/<component>`) after adding this registry to their
 * components.json. Change it here to rebrand every install command at once.
 */
export const REGISTRY_NAME = "uilab";
export const REGISTRY_NAMESPACE = `@${REGISTRY_NAME}`;
