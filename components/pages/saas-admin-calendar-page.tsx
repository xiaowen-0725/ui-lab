"use client";
import type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import { CalendarApp } from "./saas-admin/views/apps/calendar";

export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";
export function SaasAdminCalendarPage(props: SaasAdminEnvironmentProps) {
	return (
		<SaasAdminPageFrame pageTitle="Calendar" {...props}>
			<CalendarApp />
		</SaasAdminPageFrame>
	);
}
