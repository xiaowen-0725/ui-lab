"use client";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import { MailApp } from "./saas-admin/views/apps/mail";

export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminMailPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Mail" {...props}>
			<MailApp />
		</SaasAdminPageFrame>
	);
}
