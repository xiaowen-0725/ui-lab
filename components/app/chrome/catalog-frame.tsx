"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { PreferencesPanel } from "../preferences/preferences-panel";
import { PreferencesProvider } from "../preferences/preferences-provider";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { SiteShell } from "./site-shell";
import { ThemeProvider } from "./theme-provider";

interface CatalogFrameProps {
	children: ReactNode;
	githubStarCount: number | null;
	analytics?: ReactNode;
}

/** Fullscreen template documents own their theme, shortcuts and preferences. */
export function CatalogFrame({
	children,
	githubStarCount,
	analytics,
}: CatalogFrameProps): ReactNode {
	const pathname = usePathname();
	if (pathname.startsWith("/sites/saas-admin-site/preview")) return children;
	return (
		<ThemeProvider>
			<PreferencesProvider>
				<KeyboardShortcuts />
				<SiteShell githubStarCount={githubStarCount}>{children}</SiteShell>
				<PreferencesPanel />
				{analytics}
			</PreferencesProvider>
		</ThemeProvider>
	);
}
