"use client";
import { VerticalForm } from "./saas-admin/views/forms/form-layouts/vertical";
import { HorizontalForm } from "./saas-admin/views/forms/form-layouts/horizontal";
import { FormValidation } from "./saas-admin/views/forms/form-validation";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminFormsPage({
	variant = "vertical",
	...props
}: SaasAdminEnvironmentProps & {
	variant?: "vertical" | "horizontal" | "validation";
}) {
	return (
		<SaasAdminPageFrame pageTitle="Forms" {...props}>
			{variant === "vertical" ? (
				<VerticalForm />
			) : variant === "horizontal" ? (
				<HorizontalForm />
			) : (
				<FormValidation />
			)}
		</SaasAdminPageFrame>
	);
}
