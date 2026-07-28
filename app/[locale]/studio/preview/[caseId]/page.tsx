import { notFound } from "next/navigation";

import { ParkingWorkbenchPreview } from "@/components/app/studio/assembly/parking-workbench-preview";
import {
  findParkingPreviewScenario,
  PARKING_PREVIEW_CASE_IDS,
} from "@/lib/system-presets/parking-preview";
import { parseParkingPreviewSearchParams } from "@/lib/system-presets/parking-preview-config";

export function generateStaticParams() {
  return PARKING_PREVIEW_CASE_IDS.map((caseId) => ({ caseId }));
}

export default async function ParkingPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; caseId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ caseId }, query] = await Promise.all([params, searchParams]);
  const scenario = findParkingPreviewScenario(caseId);
  if (!scenario) notFound();
  const configuration = parseParkingPreviewSearchParams(query);

  return (
    <div
      data-testid="parking-preview-route"
      data-case-id={scenario.caseId}
      className="fixed inset-0 z-[1000] overflow-hidden bg-[var(--wb-surface)]"
    >
      <ParkingWorkbenchPreview
        scenario={scenario}
        configuration={configuration}
      />
    </div>
  );
}
