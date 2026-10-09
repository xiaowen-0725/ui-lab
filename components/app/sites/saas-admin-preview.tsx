"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ThemeProvider, useTheme } from "next-themes";
import {
	SaasAdminSite,
	type SaasAdminAction,
	type SaasAdminBrand,
	type SaasAdminMode,
	type SaasAdminLocale,
} from "@/components/site-shells/saas-admin-site";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { installSaasAdminHistoryGuard } from "./saas-admin-history-guard";
const STORAGE_KEY = "uilab.saas-admin.preferences.v1";
const MODE_KEY = "uilab.saas-admin.mode.v1";

function SyncDocumentMode({
	mode,
	ready,
}: {
	mode: SaasAdminMode;
	ready: boolean;
}) {
	const { setTheme } = useTheme();
	useEffect(() => {
		if (ready) setTheme(mode);
	}, [mode, ready, setTheme]);
	return null;
}

/** Explicit local demo service. Passwords are never stored. */
async function submitDemo(action: SaasAdminAction) {
	await new Promise<void>((resolve) => setTimeout(resolve, 350));
	if (
		String(action.values.email ?? action.values.userEmail ?? "").startsWith(
			"fail@",
		)
	) {
		throw new Error("fail@ → demo error; change the email and retry.");
	}
}

export function SaasAdminPreview({
	locale,
	initialPath = "/dashboard/orders",
}: {
	locale: SaasAdminLocale;
	initialPath?: string;
}) {
	const router = useRouter();
	const fullPath = usePathname();
	const search = useSearchParams().toString();
	const base = `/${locale}/sites/saas-admin-site/preview`;
	const routeBase = "/sites/saas-admin-site/preview";
	const pathname = fullPath.startsWith(routeBase)
		? fullPath.slice(routeBase.length) || "/dashboard/orders"
		: initialPath;
	const [brand, setBrand] = useState<SaasAdminBrand>("default");
	const [mode, setMode] = useState<SaasAdminMode>("system");
	const [ready, setReady] = useState(false);
	const dirty = useRef(new Map<string, number>());
	const revision = useRef(0);
	const [pendingNavigation, setPendingNavigation] = useState<
		(() => void) | null
	>(null);
	const guardNavigation = useCallback((action: () => void) => {
		if (dirty.current.size) setPendingNavigation(() => action);
		else action();
	}, []);
	const markDraft = useCallback((actionType: string) => {
		revision.current++;
		dirty.current.set(actionType, revision.current);
	}, []);
	useEffect(() => {
		const mark = (event: Event) => {
			if (
				(event.target as HTMLElement)?.closest("[data-saas-admin-settings]")
			) {
				const action =
					(event.target as HTMLElement).closest<HTMLElement>(
						"[data-admin-action]",
					)?.dataset.adminAction ?? "settings";
				markDraft(action);
			}
		};
		const unload = (event: BeforeUnloadEvent) => {
			if (dirty.current.size) {
				event.preventDefault();
				event.returnValue = "";
			}
		};
		const intercept = (event: MouseEvent) => {
			const link = (event.target as HTMLElement)?.closest<HTMLAnchorElement>(
				"a[href]",
			);
			if (
				!dirty.current.size ||
				!link ||
				link.target === "_blank" ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey ||
				event.button !== 0
			)
				return;
			const target = new URL(link.href);
			if (
				target.origin === location.origin &&
				target.pathname === location.pathname &&
				target.search === location.search
			)
				return;
			event.preventDefault();
			event.stopPropagation();
			setPendingNavigation(() => () => {
				if (target.origin === location.origin) {
					const unlocalized = target.pathname.replace(/^\/(?:en|zh)(?=\/)/, "");
					const targetLocale = target.pathname.startsWith("/zh/")
						? "zh"
						: target.pathname.startsWith("/en/")
							? "en"
							: undefined;
					router.push(`${unlocalized}${target.search}${target.hash}`, {
						locale: targetLocale,
					});
				} else location.assign(link.href);
			});
		};
		document.addEventListener("input", mark, true);
		document.addEventListener("change", mark, true);
		document.addEventListener("click", intercept, true);
		window.addEventListener("beforeunload", unload);
		return () => {
			document.removeEventListener("input", mark, true);
			document.removeEventListener("change", mark, true);
			document.removeEventListener("click", intercept, true);
			window.removeEventListener("beforeunload", unload);
		};
	}, [router, markDraft]);
	useEffect(
		() =>
			installSaasAdminHistoryGuard({
				isDirty: (target, current) =>
					dirty.current.size > 0 && target.pathname !== current.pathname,
				confirm: (next) => setPendingNavigation(() => next),
			}),
		[],
	);

	const [settings, setSettings] = useState<
		Record<string, Record<string, unknown>>
	>({});
	useEffect(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
			if (saved?.brand === "default" || saved?.brand === "blue-ink")
				setBrand(saved.brand);
			if (["light", "dark", "system"].includes(saved?.mode))
				setMode(saved.mode);
		} catch {
			/* Default/system remains usable without storage. */
		}
		setReady(true);
	}, []);
	useEffect(() => {
		if (!ready) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ brand, mode }));
		} catch {
			/* Optional persistence. */
		}
	}, [brand, mode, ready]);
	useEffect(() => {
		if (!ready) return;
		document.documentElement.dataset.saasAdminBrand = brand;
		return () => {
			delete document.documentElement.dataset.saasAdminBrand;
		};
	}, [brand, ready]);
	const hrefFor = useCallback(
		(path: string) =>
			path.startsWith("/")
				? `${base}${path === "/" ? "/dashboard/orders" : path}`
				: path,
		[base],
	);
	const navigate = useCallback(
		(path: string) => {
			const destination = `${routeBase}${path === "/" ? "/dashboard/orders" : path}`;
			if (
				pathname === "/pages/user-settings" &&
				path.startsWith("/pages/user-settings")
			)
				router.push(destination, { scroll: false });
			else
				guardNavigation(() => {
					// Query-only user search replaces the current history entry; page/tab changes push.
					const next = new URL(path, "https://consumer.invalid");
					const sameUserSearch =
						pathname === "/apps/users/list" &&
						next.pathname === pathname &&
						new URLSearchParams(search).get("q") !== next.searchParams.get("q");
					if (sameUserSearch) router.replace(destination, { scroll: false });
					else router.push(destination, { scroll: false });
				});
		},
		[guardNavigation, pathname, router, search],
	);
	const submit = useCallback(async (action: SaasAdminAction) => {
		const savedRevision = dirty.current.get(action.type);
		await submitDemo(action);
		if (action.type.startsWith("settings.")) {
			setSettings((previous) => ({
				...previous,
				[action.type]: Object.fromEntries(
					Object.entries(action.values).filter(
						([key]) => !key.toLowerCase().includes("password"),
					),
				),
			}));
			// Other unsaved forms remain dirty; the route guard is conservative.
			if (dirty.current.get(action.type) === savedRevision)
				dirty.current.delete(action.type);
		}
	}, []);

	return (
		<ThemeProvider
			attribute="class"
			storageKey={MODE_KEY}
			defaultTheme="system"
			enableSystem
		>
			<SyncDocumentMode mode={mode} ready={ready} />
			<SaasAdminSite
				shell={new URLSearchParams(search).get("frame") !== "page"}
				pathname={pathname}
				search={search}
				hrefFor={hrefFor}
				onNavigate={navigate}
				locale={locale}
				brand={brand}
				mode={mode}
				settings={settings}
				onSubmit={submit}
				onSettingsDraftChange={markDraft}
				onLocaleChange={(next) =>
					guardNavigation(() =>
						router.replace(
							`${routeBase}${pathname}${search ? `?${search}` : ""}`,
							{ locale: next, scroll: false },
						),
					)
				}
				onBrandChange={setBrand}
				onModeChange={(next) => {
					try {
						localStorage.setItem(MODE_KEY, next);
					} catch {
						/* Optional persistence. */
					}
					setMode(next);
				}}
				documentTheme
			/>
			<AlertDialog
				open={pendingNavigation !== null}
				onOpenChange={(open) => {
					if (!open) setPendingNavigation(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{locale === "zh"
								? "放弃未保存的修改？"
								: "Discard unsaved changes?"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{locale === "zh"
								? "离开此页会丢失未保存的内容。"
								: "Leaving this page will discard your unsaved changes."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							{locale === "zh" ? "继续编辑" : "Keep editing"}
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							onClick={() => {
								dirty.current.clear();
								const next = pendingNavigation;
								setPendingNavigation(null);
								next?.();
							}}
						>
							{locale === "zh" ? "放弃并离开" : "Discard & leave"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ThemeProvider>
	);
}
