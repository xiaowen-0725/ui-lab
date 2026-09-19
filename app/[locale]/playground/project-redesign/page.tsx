import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectRedesign } from "@/components/app/playground/project-redesign";

export const metadata: Metadata = {
  title: "Project redesign prototype",
  description:
    "Throwaway prototype for redesigning the whole site: live composition, terms on the samples, and a system rail that restyles every token-fed surface.",
  robots: { index: false, follow: false },
};

export default function ProjectRedesignPage() {
  return (
    <Suspense>
      <ProjectRedesign />
    </Suspense>
  );
}
