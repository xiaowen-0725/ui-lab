"use client";
import { Login } from "./saas-admin/views/pages/auth/login";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminLoginPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Sign In" {...props}>
			<Login />
		</SaasAdminPageFrame>
	);
}
