import parkingFixture from "@/content/system-presets/codex-desktop-v1/fixtures/parking-high-density-v1.json";
import { CODEX_DESKTOP_V1 } from "@/lib/system-presets/codex-desktop-v1";
import type { SystemPresetReferenceCase } from "@/lib/system-presets/types";

const EXPECTED_PARKING_PREVIEW_CASE_IDS = [
  "wide-light-task-dense",
  "wide-dark-task-streaming",
  "collapse-light-approval",
  "narrow-light-empty",
  "wide-dark-error-artifact",
  "wide-light-board-focus",
  "collapse-dark-connectors-overlay",
  "wide-light-settings-reduced-motion",
] as const;

export type ParkingPreviewCaseId =
  (typeof EXPECTED_PARKING_PREVIEW_CASE_IDS)[number];
export type ParkingPreviewFixture = typeof parkingFixture;

export interface ParkingPreviewScenario {
  caseId: ParkingPreviewCaseId;
  fixture: ParkingPreviewFixture;
  selectors: readonly string[];
  referenceCase: SystemPresetReferenceCase;
  viewportSize: {
    width: number;
    height: number;
  };
}

function parseViewportSize(size: string): ParkingPreviewScenario["viewportSize"] {
  const match = /^(\d+)x(\d+)$/.exec(size);
  if (!match) throw new Error(`Invalid Parking preview size: ${size}`);

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function deriveParkingPreviewCaseIds(): readonly ParkingPreviewCaseId[] {
  const referenceIds = CODEX_DESKTOP_V1.referencePack.cases.map(
    ({ id }) => id,
  );
  const selectorIds = Object.keys(parkingFixture.caseSelectors);
  const expectedIds = [...EXPECTED_PARKING_PREVIEW_CASE_IDS];

  if (
    referenceIds.length !== expectedIds.length ||
    referenceIds.some((id, index) => id !== expectedIds[index]) ||
    selectorIds.length !== expectedIds.length ||
    selectorIds.some((id, index) => id !== expectedIds[index])
  ) {
    throw new Error(
      "Parking preview requires the exact ordered eight-case reference and selector matrix.",
    );
  }

  return referenceIds as readonly ParkingPreviewCaseId[];
}

export const PARKING_PREVIEW_CASE_IDS = deriveParkingPreviewCaseIds();

function buildScenario(caseId: ParkingPreviewCaseId): ParkingPreviewScenario {
  const referenceCase = CODEX_DESKTOP_V1.referencePack.cases.find(
    (candidate) => candidate.id === caseId,
  );
  const selectors = parkingFixture.caseSelectors[caseId];

  if (!referenceCase) {
    throw new Error(`Missing Codex Desktop reference case: ${caseId}`);
  }
  if (!selectors) {
    throw new Error(`Missing Parking fixture selectors for case: ${caseId}`);
  }
  if (
    parkingFixture.id !== CODEX_DESKTOP_V1.referencePack.fixture.id ||
    referenceCase.fixtureId !== parkingFixture.id
  ) {
    throw new Error(`Parking preview fixture mismatch for case: ${caseId}`);
  }

  return {
    caseId,
    fixture: parkingFixture,
    selectors,
    referenceCase: {
      ...referenceCase,
      states: [...referenceCase.states],
      surfaces: [...referenceCase.surfaces],
      calibrationSourceIds: [...referenceCase.calibrationSourceIds],
    },
    viewportSize: parseViewportSize(referenceCase.size),
  };
}

export const PARKING_PREVIEW_SCENARIOS: readonly ParkingPreviewScenario[] =
  PARKING_PREVIEW_CASE_IDS.map(buildScenario);

const scenariosById = new Map(
  PARKING_PREVIEW_SCENARIOS.map((scenario) => [scenario.caseId, scenario]),
);

export function findParkingPreviewScenario(
  caseId: string,
): ParkingPreviewScenario | undefined {
  return scenariosById.get(caseId as ParkingPreviewCaseId);
}
