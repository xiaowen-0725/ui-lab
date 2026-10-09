"use client";
// Only chart tooltips use the mono face; keep it with the Orders route.
import "./saas-admin/assets/fonts-mono.css";
import { OrdersDashboard } from "./saas-admin/views/orders";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminOrdersPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Orders" {...props}>
			<OrdersDashboard />
		</SaasAdminPageFrame>
	);
}
