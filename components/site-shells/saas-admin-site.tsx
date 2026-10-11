"use client";

import { type JSX, lazy, Suspense } from "react";
import {
	type SaasAdminEnvironmentProps,
	SaasAdminProvider,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import { SaasAdminTheme } from "@/components/pages/saas-admin/theme";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SaasAdminShell } from "./saas-admin-shell";

const SaasAdminOrdersPage = lazy(() =>
	import("@/components/pages/saas-admin-orders-page").then((module) => ({
		default: module.SaasAdminOrdersPage,
	})),
);
const SaasAdminUsersPage = lazy(() =>
	import("@/components/pages/saas-admin-users-page").then((module) => ({
		default: module.SaasAdminUsersPage,
	})),
);
const SaasAdminProfilePage = lazy(() =>
	import("@/components/pages/saas-admin-profile-page").then((module) => ({
		default: module.SaasAdminProfilePage,
	})),
);
const SaasAdminSettingsPage = lazy(() =>
	import("@/components/pages/saas-admin-settings-page").then((module) => ({
		default: module.SaasAdminSettingsPage,
	})),
);
const SaasAdminDataTablePage = lazy(() =>
	import("@/components/pages/saas-admin-data-table-page").then((module) => ({
		default: module.SaasAdminDataTablePage,
	})),
);
const SaasAdminFormsPage = lazy(() =>
	import("@/components/pages/saas-admin-forms-page").then((module) => ({
		default: module.SaasAdminFormsPage,
	})),
);
const SaasAdminLoginPage = lazy(() =>
	import("@/components/pages/saas-admin-login-page").then((module) => ({
		default: module.SaasAdminLoginPage,
	})),
);
const SaasAdminRegisterPage = lazy(() =>
	import("@/components/pages/saas-admin-register-page").then((module) => ({
		default: module.SaasAdminRegisterPage,
	})),
);
const SaasAdminForgotPasswordPage = lazy(() =>
	import("@/components/pages/saas-admin-forgot-password-page").then(
		(module) => ({ default: module.SaasAdminForgotPasswordPage }),
	),
);
const SaasAdminKanbanPage = lazy(() =>
	import("@/components/pages/saas-admin-kanban-page").then((module) => ({
		default: module.SaasAdminKanbanPage,
	})),
);
const SaasAdminMailPage = lazy(() =>
	import("@/components/pages/saas-admin-mail-page").then((module) => ({
		default: module.SaasAdminMailPage,
	})),
);
const SaasAdminCalendarPage = lazy(() =>
	import("@/components/pages/saas-admin-calendar-page").then((module) => ({
		default: module.SaasAdminCalendarPage,
	})),
);
const SaasAdminAiChatPage = lazy(() =>
	import("@/components/pages/saas-admin-ai-chat-page").then((module) => ({
		default: module.SaasAdminAiChatPage,
	})),
);
const SaasAdminAiUsagePage = lazy(() =>
	import("@/components/pages/saas-admin-ai-usage-page").then((module) => ({
		default: module.SaasAdminAiUsagePage,
	})),
);

export type {
	SaasAdminAction,
	SaasAdminAppearance,
	SaasAdminBrand,
	SaasAdminEnvironmentProps,
	SaasAdminLocale,
	SaasAdminMode,
} from "@/components/pages/saas-admin/environment";
export type { SaasAdminRoute } from "@/components/pages/saas-admin/routes";
export {
	isSaasAdminRoute,
	SAAS_ADMIN_ROUTES,
} from "@/components/pages/saas-admin/routes";

function PageContent(): JSX.Element {
	const { pathname, search, t } = useSaasAdmin();
	switch (pathname) {
		case "/":
		case "/dashboard/orders":
			return <SaasAdminOrdersPage />;
		case "/apps/users/list":
			return <SaasAdminUsersPage />;
		case "/apps/users/view":
			return (
				<SaasAdminUsersPage
					key={new URLSearchParams(search).get("user")}
					view="detail"
				/>
			);
		case "/apps/kanban":
			return <SaasAdminKanbanPage />;
		case "/apps/mail":
			return <SaasAdminMailPage />;
		case "/apps/calendar":
			return <SaasAdminCalendarPage />;
		case "/apps/ai-chat":
			return <SaasAdminAiChatPage />;
		case "/apps/ai-usage":
			return <SaasAdminAiUsagePage />;
		case "/pages/user-profile":
			return <SaasAdminProfilePage />;
		case "/pages/user-settings":
			return <SaasAdminSettingsPage />;
		case "/datatable":
			return <SaasAdminDataTablePage />;
		case "/forms/form-layouts/vertical":
			return <SaasAdminFormsPage variant="vertical" />;
		case "/forms/form-layouts/horizontal":
			return <SaasAdminFormsPage variant="horizontal" />;
		case "/forms/form-validation":
			return <SaasAdminFormsPage variant="validation" />;
		case "/pages/auth/login":
			return <SaasAdminLoginPage />;
		case "/pages/auth/register":
			return <SaasAdminRegisterPage />;
		case "/pages/auth/forgot-password":
			return <SaasAdminForgotPasswordPage />;
		default:
			return <p role="status">{t("Page not found")}</p>;
	}
}

function CurrentPage(): JSX.Element {
	const { t } = useSaasAdmin();
	return (
		<Suspense
			fallback={
				<div role="status" aria-live="polite">
					<span className="sr-only">{t("Loading…")}</span>
					<Skeleton className="h-64 w-full" />
				</div>
			}
		>
			<PageContent />
		</Suspense>
	);
}

interface SaasAdminSiteProps extends SaasAdminEnvironmentProps {
	shell?: boolean;
}

/** Fourteen page entries share one environment, data store and shell. */
export function SaasAdminSite({
	className,
	shell = true,
	...props
}: SaasAdminSiteProps): JSX.Element {
	const auth = props.pathname?.startsWith("/pages/auth/");
	return (
		<SaasAdminProvider {...props}>
			{auth || !shell ? (
				<SaasAdminTheme className={className}>
					<TooltipProvider>
						<main>
							<CurrentPage />
						</main>
						<Toaster theme={props.mode ?? "system"} />
					</TooltipProvider>
				</SaasAdminTheme>
			) : (
				<SaasAdminShell className={className}>
					<CurrentPage />
				</SaasAdminShell>
			)}
		</SaasAdminProvider>
	);
}
