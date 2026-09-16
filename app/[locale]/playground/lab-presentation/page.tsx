import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { LabPresentationPrototype } from "@/components/app/playground/lab-presentation-prototype";

export const metadata: Metadata = {
  title: "Lab presentation prototype",
  description:
    "Throwaway prototype: see a noun, replay a motion, twist one token step, copy the same source.",
};

export default function LabPresentationPrototypePage() {
  return (
    <div className="relative">
      <Suspense>
        <LabPresentationPrototype />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
