"use client";
import { useLocale } from "next-intl";
export function SaasAdminCatalogPreview({
	path = "/dashboard/orders",
	page = false,
}: {
	path?: string;
	page?: boolean;
}) {
	const locale = useLocale() === "en" ? "en" : "zh";
	const href = `/${locale}/sites/saas-admin-site/preview${path}${page ? "?frame=page" : ""}`;
	return (
		<div className="w-full space-y-3">
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className="text-sm underline"
			>
				{locale === "zh" ? "在完整窗口打开" : "Open full preview"}
			</a>
			<iframe
				src={href}
				title={
					locale === "zh" ? "SaaS 后台独立预览" : "SaaS admin isolated preview"
				}
				className="h-[850px] w-full rounded-lg border border-border"
			/>
		</div>
	);
}
