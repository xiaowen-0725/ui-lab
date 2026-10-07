import { AssetDetail, generateAssetMetadata } from "@/components/app/catalog/asset-detail";
import { PAGES } from "@/lib/pages";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return PAGES.map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  return generateAssetMetadata({ params: params.then((value) => ({ ...value, category: "pages" })) });
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  return AssetDetail({ params: params.then((value) => ({ ...value, category: "pages" })) });
}
