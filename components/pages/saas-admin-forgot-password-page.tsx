"use client";
import { ForgotPassword } from "./saas-admin/views/pages/auth/forgot-password";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminForgotPasswordPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Forgot Password" {...props}>
			<ForgotPassword />
		</SaasAdminPageFrame>
	);
}
