"use client";

import {
	type AnchorHTMLAttributes,
	type Dispatch,
	type JSX,
	type ReactNode,
	type SetStateAction,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { ADMIN_ZH } from "./content";
import { users as sampleUsers } from "./fake-db/apps/users";
import { db as sampleProfile } from "./fake-db/pages/user-profile";
import { transactionData as sampleTransactions } from "./fake-db/transaction-samples";
import type { AppUser } from "./types/apps/user-types";
import type { UserProfilePageData } from "./types/pages/user-profile-types";
import type { Item } from "./types/transaction-types";

export type SaasAdminLocale = "zh" | "en";
export type SaasAdminBrand = "default" | "blue-ink";
export type SaasAdminMode = "light" | "dark" | "system";
export type SaasAdminAction = { type: string; values: Record<string, unknown> };
export interface SaasAdminProfileHeader {
	name: string;
	role: string;
	location: string;
	memberSince: string;
	avatar?: string;
	connected?: boolean;
}
export type SaasAdminSettingsValues = Record<string, Record<string, unknown>>;
export interface SaasAdminEnvironmentProps {
	settings?: SaasAdminSettingsValues;
	profileHeader?: SaasAdminProfileHeader;
	locale?: SaasAdminLocale;
	pathname?: string;
	search?: string;
	brand?: SaasAdminBrand;
	mode?: SaasAdminMode;
	users?: AppUser[];
	transactions?: Item[];
	profile?: UserProfilePageData;
	content?: Record<string, string>;
	hrefFor?: (path: string) => string;
	onNavigate?: (path: string) => void;
	onLocaleChange?: (locale: SaasAdminLocale) => void;
	onBrandChange?: (brand: SaasAdminBrand) => void;
	onModeChange?: (mode: SaasAdminMode) => void;
	onUsersChange?: Dispatch<SetStateAction<AppUser[]>>;
	onTransactionsChange?: Dispatch<SetStateAction<Item[]>>;
	onProfileChange?: Dispatch<SetStateAction<UserProfilePageData>>;
	onSubmit?: (action: SaasAdminAction) => Promise<void>;
	/** Optional consumer signal for controlled settings drafts (including keyboard selection). */
	onSettingsDraftChange?: (actionType: string) => void;
	/** Consumer applies the same brand/mode to its document, including portals. */
	documentTheme?: boolean;
	className?: string;
}

interface AdminEnvironment
	extends Required<
		Pick<
			SaasAdminEnvironmentProps,
			| "locale"
			| "pathname"
			| "search"
			| "brand"
			| "mode"
			| "users"
			| "documentTheme"
		>
	> {
	settings: SaasAdminSettingsValues;
	profileHeader?: SaasAdminProfileHeader;
	transactions: Item[];
	profile: UserProfilePageData;
	setTransactions: Dispatch<SetStateAction<Item[]>>;
	setProfile: Dispatch<SetStateAction<UserProfilePageData>>;
	t: (text: string) => string;
	hrefFor: (path: string) => string;
	navigate?: (path: string) => void;
	setLocale: (locale: SaasAdminLocale) => void;
	setBrand: (brand: SaasAdminBrand) => void;
	setMode: (mode: SaasAdminMode) => void;
	setUsers: (users: AppUser[] | ((previous: AppUser[]) => AppUser[])) => void;
	submit: (action: SaasAdminAction) => Promise<void>;
	settingsDraftChanged?: (actionType: string) => void;
}

type AdminNavigation = Pick<
	AdminEnvironment,
	"pathname" | "search" | "navigate" | "hrefFor"
>;

interface SaasAdminProviderProps extends SaasAdminEnvironmentProps {
	children: ReactNode;
}

interface SaasAdminTextProps {
	children: ReactNode;
}

function translateAdminText(text: string): string {
	const key = text.trim();
	const translated = ADMIN_ZH[key];
	if (translated) return translated;
	const invoices = key.match(/^(\d+) Invoices have been paid$/);
	if (invoices) return `${invoices[1]} 张发票已付款`;
	const minutes = key.match(/^(\d+) min ago$/);
	if (minutes) return `${minutes[1]} 分钟前`;
	const days = key.match(/^(\d+) Day Ago$/);
	if (days) return `${days[1]} 天前`;
	const members = key.match(/^\((\d+) Members\)$/);
	if (members) return `（${members[1]} 位成员）`;
	const meeting = key.match(/^Project meeting with (.+) @10:15am$/);
	if (meeting) return `10:15 与 ${meeting[1]} 的项目会议`;
	return text;
}
const EMPTY_SETTINGS: SaasAdminSettingsValues = {};

function identityHref(path: string): string {
	return path;
}

const TextContext = createContext<(text: string) => string>((text) => text);
const NavigationContext = createContext<AdminNavigation | null>(null);
const AdminContext = createContext<AdminEnvironment | null>(null);

export function SaasAdminProvider({
	children,
	...props
}: SaasAdminProviderProps): JSX.Element {
	const inherited = useContext(AdminContext);
	const [localLocale, setLocalLocale] = useState<SaasAdminLocale>("zh");
	const [localBrand, setLocalBrand] = useState<SaasAdminBrand>("default");
	const [localMode, setLocalMode] = useState<SaasAdminMode>("system");
	const [localUsers, setLocalUsers] = useState(sampleUsers);
	const [localTransactions, setLocalTransactions] =
		useState(sampleTransactions);
	const [localProfile, setLocalProfile] = useState(sampleProfile);
	const locale = props.locale ?? inherited?.locale ?? localLocale;
	const pathname = props.pathname ?? inherited?.pathname ?? "/dashboard/orders";
	const search = props.search ?? inherited?.search ?? "";
	const brand = props.brand ?? inherited?.brand ?? localBrand;
	const mode = props.mode ?? inherited?.mode ?? localMode;
	const users = props.users ?? inherited?.users ?? localUsers;
	const settings = props.settings ?? inherited?.settings ?? EMPTY_SETTINGS;
	const profileHeader = props.profileHeader ?? inherited?.profileHeader;
	const transactions =
		props.transactions ?? inherited?.transactions ?? localTransactions;
	const profile = props.profile ?? inherited?.profile ?? localProfile;
	const setTransactions =
		props.onTransactionsChange ??
		inherited?.setTransactions ??
		setLocalTransactions;
	const setProfile =
		props.onProfileChange ?? inherited?.setProfile ?? setLocalProfile;
	const setUsers = props.onUsersChange ?? inherited?.setUsers ?? setLocalUsers;
	const documentTheme =
		props.documentTheme ?? inherited?.documentTheme ?? false;
	const content = props.content;
	const inheritedT = inherited?.t;
	const inheritLocale = props.locale === undefined;
	const t = useCallback(
		function translate(text: string): string {
			const override = content?.[text];
			if (override != null) return override;
			if (inheritLocale && inheritedT) return inheritedT(text);
			if (locale === "zh") return translateAdminText(text);
			return text;
		},
		[content, inheritLocale, inheritedT, locale],
	);
	const hrefFor = props.hrefFor ?? inherited?.hrefFor ?? identityHref;
	const navigate = props.onNavigate ?? inherited?.navigate;
	const setLocale =
		props.onLocaleChange ?? inherited?.setLocale ?? setLocalLocale;
	const setBrand = props.onBrandChange ?? inherited?.setBrand ?? setLocalBrand;
	const setMode = props.onModeChange ?? inherited?.setMode ?? setLocalMode;
	const missingSubmit = useCallback(async () => {
		throw new Error(
			locale === "zh"
				? "请由消费者提供提交回调。"
				: "Provide a consumer submit callback.",
		);
	}, [locale]);
	const submit = props.onSubmit ?? inherited?.submit ?? missingSubmit;
	const settingsDraftChanged =
		props.onSettingsDraftChange ?? inherited?.settingsDraftChanged;
	const value = useMemo<AdminEnvironment>(
		() => ({
			locale,
			pathname,
			search,
			brand,
			mode,
			users,
			settings,
			profileHeader,
			transactions,
			profile,
			setTransactions,
			setProfile,
			setUsers,
			documentTheme,
			t,
			hrefFor,
			navigate,
			setLocale,
			setBrand,
			setMode,
			submit,
			settingsDraftChanged,
		}),
		[
			locale,
			pathname,
			search,
			brand,
			mode,
			users,
			settings,
			profileHeader,
			transactions,
			profile,
			setTransactions,
			setProfile,
			setUsers,
			documentTheme,
			t,
			hrefFor,
			navigate,
			setLocale,
			setBrand,
			setMode,
			submit,
			settingsDraftChanged,
		],
	);
	const navigation = useMemo(
		() => ({ pathname, search, hrefFor, navigate }),
		[pathname, search, hrefFor, navigate],
	);
	return (
		<AdminContext.Provider value={value}>
			<TextContext.Provider value={t}>
				<NavigationContext.Provider value={navigation}>
					{children}
				</NavigationContext.Provider>
			</TextContext.Provider>
		</AdminContext.Provider>
	);
}

export function useSaasAdminOptional(): AdminEnvironment | null {
	return useContext(AdminContext);
}

export function useSaasAdmin(): AdminEnvironment {
	const environment = useContext(AdminContext);
	if (!environment)
		throw new Error("Wrap this template view in SaasAdminProvider.");
	return environment;
}

/** Text adaptation only: returns text without introducing a DOM wrapper. */
export function SaasAdminText({ children }: SaasAdminTextProps): ReactNode {
	const t = useContext(TextContext);
	return typeof children === "string" && children.trim()
		? t(children)
		: children;
}

export function SaasAdminLink({
	href = "#",
	onClick,
	...props
}: AnchorHTMLAttributes<HTMLAnchorElement>): JSX.Element {
	const { hrefFor, navigate } = useAdminNavigation();
	return (
		<a
			{...props}
			href={hrefFor(href)}
			onClick={(event) => {
				onClick?.(event);
				if (
					!event.defaultPrevented &&
					navigate &&
					href.startsWith("/") &&
					!event.metaKey &&
					!event.ctrlKey &&
					!event.shiftKey &&
					!event.altKey &&
					event.button === 0 &&
					(!props.target || props.target === "_self")
				) {
					event.preventDefault();
					navigate(href);
				}
			}}
		/>
	);
}

export function useAdminPathname(): string {
	return useAdminNavigation().pathname;
}
export function useAdminSearchParams(): URLSearchParams {
	const { search } = useAdminNavigation();
	return useMemo(() => new URLSearchParams(search), [search]);
}

export function useAdminQuery(
	key: string,
	fallback: string,
	allowed: readonly string[] = [],
): readonly [string, (next: string) => void] {
	const { pathname, search, navigate } = useAdminNavigation();
	const params = useMemo(() => new URLSearchParams(search), [search]);
	const queryValue = params.get(key) ?? fallback;
	const [local, setLocal] = useState({ key, search, value: queryValue });
	// A new consumer query replaces local tab state; theme changes do not.
	if (local.key !== key || local.search !== search) {
		setLocal({ key, search, value: queryValue });
	}
	const candidate = navigate ? queryValue : local.value;
	const value =
		allowed.length && !allowed.includes(candidate) ? fallback : candidate;
	const setValue = (next: string) => {
		setLocal({ key, search, value: next });
		if (navigate) {
			const updated = new URLSearchParams(search);
			updated.set(key, next);
			navigate(`${pathname}?${updated}`);
		}
	};
	return [value, setValue] as const;
}

export function useAdminNavigation(): AdminNavigation {
	const value = useContext(NavigationContext);
	if (!value) throw new Error("Wrap this template in SaasAdminProvider.");
	return value;
}

/** Atomic query updates preserve unrelated consumer parameters and local-only usage. */
export function useAdminQueryValues(
	defaults: Readonly<Record<string, string>>,
): readonly [Record<string, string>, (patch: Record<string, string>) => void] {
	const { pathname, search, navigate } = useAdminNavigation();
	const parsed = useMemo(() => {
		const params = new URLSearchParams(search);
		return Object.fromEntries(
			Object.entries(defaults).map(([key, fallback]) => [
				key,
				params.get(key) ?? fallback,
			]),
		);
	}, [defaults, search]);
	const [local, setLocal] = useState(() => ({
		pathname,
		search,
		values: parsed,
	}));
	if (local.search !== search || local.pathname !== pathname)
		setLocal({ pathname, search, values: parsed });
	const values =
		local.search === search && local.pathname === pathname
			? local.values
			: parsed;
	const update = useCallback(
		(patch: Record<string, string>) => {
			const next = { ...values, ...patch };
			setLocal({ pathname, search, values: next });
			if (!navigate) return;
			const params = new URLSearchParams(search);
			for (const [key, value] of Object.entries(next)) {
				if (value === defaults[key]) params.delete(key);
				else params.set(key, value);
			}
			navigate(`${pathname}${params.size ? `?${params}` : ""}`);
		},
		[defaults, navigate, pathname, search, values],
	);
	return [values, update] as const;
}
