"use client";
import { UserSettings } from "./saas-admin/views/pages/user-settings";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminSettingsPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame {...props}>
			<UserSettings />
		</SaasAdminPageFrame>
	);
}
