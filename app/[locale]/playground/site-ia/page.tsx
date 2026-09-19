import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteIaPrototype } from "@/components/app/playground/site-ia/site-ia-prototype";

export const metadata: Metadata = {
  title: "Site IA chrome prototype",
  description:
    "Throwaway playground prototype of the approved whole-site chrome. Not the production homepage.",
  robots: { index: false, follow: false },
};

export default function SiteIaPrototypePage() {
  return (
    <Suspense>
      <SiteIaPrototype />
    </Suspense>
  );
}
