"use client";
import { Register } from "./saas-admin/views/pages/auth/register";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminRegisterPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Sign Up" {...props}>
			<Register />
		</SaasAdminPageFrame>
	);
}
