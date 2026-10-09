"use client";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import { AiChatApp } from "./saas-admin/views/apps/ai-chat";

export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminAiChatPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="AI Chat" {...props}>
			<AiChatApp />
		</SaasAdminPageFrame>
	);
}
