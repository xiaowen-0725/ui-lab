import { AssetDetail, generateAssetMetadata } from "@/components/app/catalog/asset-detail";
import { SITES } from "@/lib/sites";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return SITES.map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  return generateAssetMetadata({ params: params.then((value) => ({ ...value, category: "sites" })) });
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  return AssetDetail({ params: params.then((value) => ({ ...value, category: "sites" })) });
}
