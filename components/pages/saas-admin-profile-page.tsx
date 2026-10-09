"use client";
import { UserProfile } from "./saas-admin/views/pages/user-profile";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminProfilePage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="User Profile" {...props}>
			<UserProfile />
		</SaasAdminPageFrame>
	);
}
