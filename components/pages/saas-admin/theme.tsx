"use client";
// Neutral tokens: Free AdminCN, MIT, dd1afd2f3a794ea9e746197de314f81d43670ea1.
// Scoped configuration only; official component APIs are unchanged.
import { BLUE_INK_COLORS } from "@/lib/theme-kits/blue-ink-colors";
import { useSaasAdmin } from "./environment";
import type { ReactNode } from "react";
import "./styles.css";
import "./assets/font-license";
import { SAAS_ADMIN_COLORS as NEUTRAL } from "@/lib/theme-kits/saas-admin-default-colors";
function vars(values: Record<string, string>) {
	return Object.entries(values)
		.map(([key, value]) => `--${key}:${value};`)
		.join("");
}
function themeValues(brand: "default" | "blue-ink", mode: "light" | "dark") {
	const neutral = NEUTRAL[mode];
	if (brand === "default") return neutral;
	const colors = BLUE_INK_COLORS[mode];
	return {
		...neutral,
		...colors,
		sidebar: colors.background,
		"sidebar-foreground": colors.foreground,
		"sidebar-primary": colors.primary,
		"sidebar-primary-foreground": colors["primary-foreground"],
		"sidebar-accent": colors.accent,
		"sidebar-accent-foreground": colors["accent-foreground"],
		"sidebar-border": colors.border,
		"sidebar-ring": colors.ring,
	};
}
export const SAAS_ADMIN_THEME_CSS =
	`html:not([data-saas-admin-brand]) .saas-admin-theme{${vars(NEUTRAL.light)}}@media(prefers-color-scheme:dark){html:not([data-saas-admin-brand]) .saas-admin-theme{${vars(NEUTRAL.dark)}}}\n` +
	(["default", "blue-ink"] as const)
		.map((brand) => {
			const light = vars(themeValues(brand, "light"));
			const dark = vars(themeValues(brand, "dark"));
			return `.saas-admin-theme[data-brand="${brand}"],html[data-saas-admin-brand="${brand}"]{${light}}
 .saas-admin-theme[data-brand="${brand}"][data-mode="dark"],html.dark[data-saas-admin-brand="${brand}"]{${dark}}
 @media(prefers-color-scheme:dark){.saas-admin-theme[data-brand="${brand}"][data-mode="system"]{${dark}}}`;
		})
		.join("\n") +
	`
html[data-saas-admin-brand]{--font-geist-sans:"SaaS Admin Geist";--font-geist-mono:"SaaS Admin Geist Mono";font-family:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif;}
@layer base{.saas-admin-theme *,html[data-saas-admin-brand] [data-base-ui-portal] *{border-color:var(--border);outline-color:color-mix(in oklab,var(--ring) 50%,transparent)}}
.saas-admin-theme{--font-geist-sans:"SaaS Admin Geist";--font-geist-mono:"SaaS Admin Geist Mono";font-family:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif;color:var(--foreground);background:var(--background);--radius:0.625rem;}
.saas-admin-theme .rounded-sm{border-radius:calc(var(--radius)*.6)}.saas-admin-theme .rounded-md{border-radius:calc(var(--radius)*.8)}.saas-admin-theme .rounded-lg{border-radius:var(--radius)}.saas-admin-theme .rounded-xl{border-radius:calc(var(--radius)*1.4)}.saas-admin-theme .rounded-2xl{border-radius:calc(var(--radius)*1.8)}
.saas-admin-theme .input-default{height:2.25rem}.saas-admin-theme .input-lg{height:2.5rem}.saas-admin-theme .input-sm{height:2rem}.saas-admin-theme .input-size-lg{width:2.5rem;height:2.5rem}
.saas-admin-theme [data-slot=button].h-10:not(.px-6){padding-inline:1rem}.saas-admin-theme [data-slot=button].h-9:not(.px-6){padding-inline:.75rem}
.saas-admin-theme [data-slot=button],html[data-saas-admin-brand] [data-base-ui-portal] [data-slot=button]{transition-property:transform,opacity,color,background-color,border-color,box-shadow;}
.saas-admin-theme input,.saas-admin-theme textarea{touch-action:manipulation;}
.saas-admin-theme [data-slot=avatar-fallback],.saas-admin-theme [data-slot=avatar-group-count]{color:var(--foreground);}
.saas-admin-theme .cell{filter:none!important;will-change:auto;transition-property:transform,opacity;}
.saas-admin-theme button:not(:disabled),.saas-admin-theme [role=button]:not(:disabled){cursor:pointer}
@media(prefers-reduced-motion:reduce){.saas-admin-theme *,html[data-saas-admin-brand] [data-base-ui-portal] *{animation-duration:.01ms!important;transition-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
`;
export function SaasAdminTheme({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	const { brand, mode, documentTheme } = useSaasAdmin();
	return (
		<div
			data-saas-admin=""
			data-brand={documentTheme ? undefined : brand}
			data-mode={documentTheme ? undefined : mode}
			className={`saas-admin-theme ${!documentTheme && mode === "dark" ? "dark" : ""} ${className}`}
		>
			<style>{SAAS_ADMIN_THEME_CSS}</style>
			{children}
		</div>
	);
}
