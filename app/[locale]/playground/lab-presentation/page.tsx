import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { LabPresentation } from "@/components/app/playground/lab-presentation";

export const metadata: Metadata = {
  title: "Lab presentation (throwaway)",
  description:
    "Throwaway verification page: see a live sample, try it, take the same source. Not a product surface.",
  robots: { index: false, follow: false },
};

export default function LabPresentationPage() {
  return (
    <div className="relative">
      <Suspense>
        <LabPresentation />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
