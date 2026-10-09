import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { SaasAdminPreview } from "@/components/app/sites/saas-admin-preview";
import {
	SAAS_ADMIN_APPEARANCE_COOKIE,
	readSaasAdminAppearanceCookie,
	SAAS_ADMIN_PREFERENCE_SCRIPT,
} from "@/components/app/sites/saas-admin-preferences";

/** The consumer controller persists while the catch-all page changes routes. */
export default async function SaasAdminPreviewLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const cookieStore = await cookies();
	const appearance = readSaasAdminAppearanceCookie(
		cookieStore.get(SAAS_ADMIN_APPEARANCE_COOKIE)?.value,
	);
	return (
		<>
			<script
				dangerouslySetInnerHTML={{ __html: SAAS_ADMIN_PREFERENCE_SCRIPT }}
			/>
			<SaasAdminPreview
				locale={locale === "en" ? "en" : "zh"}
				initialAppearance={appearance}
			/>
			{children}
		</>
	);
}
