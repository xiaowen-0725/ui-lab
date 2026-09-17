import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { LabPresentation } from "@/components/app/playground/lab-presentation";

export const metadata: Metadata = {
  title: "Lab presentation (throwaway)",
  description:
    "Throwaway overall-feel preview of the lab hall. Not acceptance, and not the official homepage.",
  robots: { index: false, follow: false },
};

export default async function LabPresentationPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return (
    <div className="relative">
      <Suspense>
        <LabPresentation initialView={view} />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
