import type { Metadata } from "next";
import { Suspense } from "react";
import { VisualWorkPrototype } from "@/components/app/playground/visual-work-prototype";

export const metadata: Metadata = {
  title: "Visual work session prototype",
  description:
    "Throwaway prototype for testing a visual, code-backed frontend implementation session.",
};

export default function VisualWorkPrototypePage() {
  return (
    <Suspense>
      <VisualWorkPrototype />
    </Suspense>
  );
}
