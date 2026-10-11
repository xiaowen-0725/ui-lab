"use client";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import { AiUsageApp } from "./saas-admin/views/apps/ai-usage";

export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminAiUsagePage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="AI Usage" {...props}>
			<AiUsageApp />
		</SaasAdminPageFrame>
	);
}
