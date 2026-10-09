import { isSaasAdminRoute } from "@/components/pages/saas-admin/routes";
import { notFound } from "next/navigation";
export const metadata = {
	title: "SaaS Admin preview",
	robots: { index: false, follow: false },
};
export default async function Preview({
	params,
}: {
	params: Promise<{ locale: string; path?: string[] }>;
}) {
	const { path } = await params;
	const pathname = path?.length ? `/${path.join("/")}` : "/dashboard/orders";
	if (!isSaasAdminRoute(pathname)) notFound();
	return null;
}
