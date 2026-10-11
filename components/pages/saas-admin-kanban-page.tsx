"use client";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import { KanbanApp } from "./saas-admin/views/apps/kanban";

export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminKanbanPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Kanban" {...props}>
			<KanbanApp />
		</SaasAdminPageFrame>
	);
}
