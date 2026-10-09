import type { ReactNode } from "react";
import { SaasAdminPreview } from "@/components/app/sites/saas-admin-preview";
import { SAAS_ADMIN_PREFERENCE_SCRIPT } from "@/components/app/sites/saas-admin-preferences";

/** The consumer controller persists while the catch-all page changes routes. */
export default async function SaasAdminPreviewLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	return (
		<>
			<script
				dangerouslySetInnerHTML={{ __html: SAAS_ADMIN_PREFERENCE_SCRIPT }}
			/>
			<SaasAdminPreview locale={locale === "en" ? "en" : "zh"} />
			{children}
		</>
	);
}
