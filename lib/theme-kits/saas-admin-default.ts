import { baselineKit } from "./compose";
import { SAAS_ADMIN_COLORS } from "./saas-admin-default-colors";
import type { ThemeKit, ThemeMode, ThemeTokenSet } from "./types";

/** The source template's neutral palette; layout and fonts retain their own roles. */
export function saasAdminDefaultKit(): ThemeKit {
  const base = baselineKit();
  const fonts = { body: "var(--font-geist-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif", display: "var(--font-geist-sans, ui-sans-serif), ui-sans-serif, system-ui, sans-serif", mono: "var(--font-geist-mono, ui-monospace), ui-monospace, monospace" };
  const tokens = (mode: ThemeMode): ThemeTokenSet => {
    const previous = base[mode];
    if (!previous) throw new Error(`Missing baseline ${mode}`);
    const values = SAAS_ADMIN_COLORS[mode];
    return {
      ...previous,
      shadcn: { ...previous.shadcn, ...Object.fromEntries(Object.entries(values).filter(([key]) => !key.startsWith("chart-") && key !== "radius")) },
      wb: { ...previous.wb, "wb-surface": values.background, "wb-surface-raised": values.card, "wb-accent": values.primary, "wb-accent-fg": values["primary-foreground"] },
      // Upstream has five charts. The sixth Catalog role reuses chart-1, leaving those five unchanged.
      charts: { ...Object.fromEntries(Object.entries(values).filter(([key]) => key.startsWith("chart-"))), "chart-6": values["chart-1"] },
    };
  };
  return {
    ...base,
    slug: "saas-admin-default", name: "SaaS Admin Default", nameZh: "后台默认",
    description: "Neutral light and dark tokens from the upstream frontend template.", descriptionZh: "保留上游前端模板的 neutral 明暗主题及侧栏颜色。",
    source: "brand-theme", fonts,
    statics: { ...base.statics, radius: "0.625rem", "font-sans": fonts.body, "font-display": fonts.display, "font-mono": fonts.mono },
    light: tokens("light"), dark: tokens("dark"),
  };
}
