import { EASE_OUT } from "@/lib/ease";
import { useHydratedReducedMotion } from "@/lib/hooks/use-hydrated-reduced-motion";

export function textFor(locale: string, en: string, zh: string) {
	return locale === "zh" ? zh : en;
}

export function fill(
	template: string,
	values: Record<string, string | number>,
) {
	return template.replace(/\{(\w+)\}/g, (_, key: string) =>
		String(values[key] ?? ""),
	);
}

/** True while motion preference is unknown or reduced. */
export function useQuietMotion() {
	const reduced = useHydratedReducedMotion();
	return reduced !== false;
}

export function enterTransition(quiet: boolean, delay = 0) {
	if (quiet) {
		return {
			initial: false as const,
			animate: { opacity: 1, y: 0 },
			transition: { duration: 0 },
		};
	}
	return {
		initial: { opacity: 0, y: 8 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.28, delay, ease: EASE_OUT },
	};
}

export const APP_FOCUS =
	"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
