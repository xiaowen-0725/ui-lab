/** Portable route contract; consumers supply URL generation and navigation. */
export const SAAS_ADMIN_ROUTES = [
	"/dashboard/orders",
	"/apps/users/list",
	"/apps/users/view",
	"/apps/kanban",
	"/apps/mail",
	"/apps/calendar",
	"/apps/ai-chat",
	"/apps/ai-usage",
	"/pages/user-profile",
	"/pages/user-settings",
	"/datatable",
	"/forms/form-layouts/vertical",
	"/forms/form-layouts/horizontal",
	"/forms/form-validation",
	"/pages/auth/login",
	"/pages/auth/register",
	"/pages/auth/forgot-password",
] as const;
export type SaasAdminRoute = (typeof SAAS_ADMIN_ROUTES)[number];
export function isSaasAdminRoute(path: string): path is SaasAdminRoute {
	return (SAAS_ADMIN_ROUTES as readonly string[]).includes(path);
}
