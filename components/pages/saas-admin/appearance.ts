export interface SaasAdminAppearance {
	font: "geist" | "system";
	radius: "none" | "sm" | "md" | "lg";
	contentLayout: "compact" | "full";
	scale: "sm" | "md" | "lg";
	sidebarVariant: "sidebar" | "inset" | "floating";
	sidebarMode: "offcanvas" | "icon" | "none";
	sidebarOpen: boolean;
}

export const DEFAULT_SAAS_ADMIN_APPEARANCE: Readonly<SaasAdminAppearance> = {
	font: "geist",
	radius: "md",
	contentLayout: "compact",
	scale: "md",
	sidebarVariant: "sidebar",
	sidebarMode: "icon",
	sidebarOpen: true,
};

const OPTIONS = {
	font: ["geist", "system"],
	radius: ["none", "sm", "md", "lg"],
	contentLayout: ["compact", "full"],
	scale: ["sm", "md", "lg"],
	sidebarVariant: ["sidebar", "inset", "floating"],
	sidebarMode: ["offcanvas", "icon", "none"],
} as const;

/** Validate persisted or consumer-supplied values before using them in styles. */
export function normalizeSaasAdminAppearance(
	value: unknown,
): SaasAdminAppearance {
	const result = { ...DEFAULT_SAAS_ADMIN_APPEARANCE };
	if (!value || typeof value !== "object") return result;
	for (const key of Object.keys(OPTIONS) as (keyof typeof OPTIONS)[]) {
		const candidate = (value as Record<string, unknown>)[key];
		if (
			typeof candidate === "string" &&
			(OPTIONS[key] as readonly string[]).includes(candidate)
		) {
			Object.assign(result, { [key]: candidate });
		}
	}
	if ("sidebarOpen" in value && typeof value.sidebarOpen === "boolean") {
		result.sidebarOpen = value.sidebarOpen;
	}
	return result;
}

export function saasAdminAppearanceCss(
	appearance: SaasAdminAppearance,
	documentTheme: boolean,
): string {
	const scale = { sm: 0.9, md: 1, lg: 1.1 }[appearance.scale];
	const radius = { none: 0, sm: 0.375, md: 0.625, lg: 0.875 }[
		appearance.radius
	];
	const font =
		appearance.font === "geist"
			? '"SaaS Admin Geist",ui-sans-serif,system-ui,sans-serif'
			: "ui-sans-serif,system-ui,sans-serif";
	const selector = documentTheme
		? "html[data-saas-admin-brand],.saas-admin-theme"
		: ".saas-admin-theme";
	const textSizes = {
		xs: 0.75,
		sm: 0.875,
		base: 1,
		lg: 1.125,
		xl: 1.25,
		"2xl": 1.5,
		"3xl": 1.875,
		"4xl": 2.25,
		"5xl": 3,
		"6xl": 3.75,
		"7xl": 4.5,
		"8xl": 6,
		"9xl": 8,
	};
	const text = Object.entries(textSizes)
		.map(([key, size]) => `--text-${key}:${size * scale}rem;`)
		.join("");
	return `${selector}{--saas-admin-scale:${scale};--spacing:${0.25 * scale}rem;--radius:${radius}rem;--radius-sm:${radius * 0.6}rem;--radius-md:${radius * 0.8}rem;--radius-lg:${radius}rem;--radius-xl:${radius * 1.4}rem;--radius-2xl:${radius * 1.8}rem;--saas-admin-content-width:${appearance.contentLayout === "full" ? "none" : "90rem"};--font-geist-sans:${font};font-family:${font};${text}}`;
}
