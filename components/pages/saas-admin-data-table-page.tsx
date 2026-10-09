"use client";
import { DataTable } from "./saas-admin/views/datatables";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminDataTablePage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Data Tables" {...props}>
			<DataTable />
		</SaasAdminPageFrame>
	);
}
