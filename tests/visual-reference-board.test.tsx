import { afterEach, describe, expect, test } from "bun:test";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { VisualReferenceBoard } from "@/components/app/studio/assembly/visual-reference-board";

const calibrationSources = [
  {
    id: "codex-workbench-light",
    role: "authoritative" as const,
    path: "/references/codex-workbench-light.png",
    width: 888,
    height: 596,
    theme: "light",
    scope: "Workbench hierarchy and task density.",
    comparisonUse: "Calibration only; not an acceptance golden.",
  },
  {
    id: "codex-composer-dark",
    role: "supporting" as const,
    path: "/references/codex-composer-dark.png",
    width: 1864,
    height: 980,
    theme: "dark",
    scope: "Dark composer anatomy only.",
    comparisonUse: "Calibration only; not a workbench golden.",
    excludedFeatures: ["ambient-gradient"],
  },
  {
    id: "codex-desktop-private",
    role: "authoritative" as const,
    width: 1440,
    height: 900,
    theme: "light",
    scope: "Private desktop source retained as hash-only metadata.",
    comparisonUse: "Calibration metadata only.",
  },
] as const;

const candidateCases = [
  {
    caseId: "wide-light-task-dense",
    path: "/candidate/wide-light-task-dense.png",
    size: "1440x900",
    theme: "light",
    calibrationSourceIds: ["codex-workbench-light"],
  },
  {
    caseId: "collapse-dark-connectors-overlay",
    path: "/candidate/collapse-dark-connectors-overlay.png",
    size: "1000x760",
    theme: "dark",
    calibrationSourceIds: ["codex-composer-dark"],
  },
] as const;

afterEach(cleanup);

function renderBoard(acceptanceStatus: "pending" | "approved" = "pending") {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <VisualReferenceBoard
        presetSlug="codex-desktop-v1"
        calibrationSources={calibrationSources}
        candidateCases={candidateCases}
        acceptanceStatus={acceptanceStatus}
      />
    </NextIntlClientProvider>,
  );
}

describe("VisualReferenceBoard", () => {
  test("separates calibration direction, acceptance master, and checkout status", () => {
    renderBoard();

    expect(screen.getByText("Calibration direction").parentElement?.textContent).toContain(
      "approved",
    );
    expect(screen.getByText("Acceptance master").parentElement?.textContent).toContain(
      "pending",
    );
    expect(screen.getByText("Checkout").parentElement?.textContent).toContain(
      "blocked",
    );
    expect(screen.getAllByText("codex-workbench-light").length).toBeGreaterThan(0);
    expect(screen.getAllByText("authoritative")).toHaveLength(2);
    expect(screen.getAllByText("888×596 · light").length).toBeGreaterThan(0);
    expect(screen.getByText("codex-composer-dark")).toBeTruthy();
    expect(screen.getByText("supporting")).toBeTruthy();
    expect(screen.getByText("codex-desktop-private")).toBeTruthy();
    expect(screen.getByText(/bytes private · hash-only/i)).toBeTruthy();
    expect(screen.getByText(/candidate-regression only/i)).toBeTruthy();
    expect(screen.getByText(/cannot become an acceptance golden/i)).toBeTruthy();
  });

  test("shows mapped sources without claiming pixel or overlay comparison", () => {
    renderBoard();

    const comparison = screen.getByTestId("reference-candidate-comparison");
    expect(within(comparison).getByText("wide-light-task-dense")).toBeTruthy();
    expect(within(comparison).getByText("codex-workbench-light")).toBeTruthy();
    expect(
      within(comparison).getByText("Calibration only · no pixel/overlay claim"),
    ).toBeTruthy();
    expect(screen.queryByText(/similarity score/i)).toBeNull();

    fireEvent.click(
      screen.getByRole("tab", { name: "collapse-dark-connectors-overlay" }),
    );
    expect(within(comparison).getByText("collapse-dark-connectors-overlay")).toBeTruthy();
    expect(within(comparison).getByText("codex-composer-dark")).toBeTruthy();
    expect(
      within(comparison).getByText("1000x760 · dark"),
    ).toBeTruthy();
  });

  test("keeps every difference category pending until visual acceptance", () => {
    renderBoard();
    const categories = [
      "layout",
      "typography",
      "color / surface",
      "component anatomy",
      "assets / icons",
      "state",
      "responsive",
      "focus / motion",
    ];
    for (const category of categories) {
      expect(screen.getByText(category).parentElement?.textContent).toContain("pending");
    }
  });

  test("marks every difference category approved with the acceptance master", () => {
    renderBoard("approved");
    for (const category of [
      "layout",
      "typography",
      "color / surface",
      "component anatomy",
      "assets / icons",
      "state",
      "responsive",
      "focus / motion",
    ]) {
      expect(screen.getByText(category).parentElement?.textContent).toContain(
        "approved",
      );
    }
  });

  test("never claims pixel or overlay equivalence even at the same size and theme", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <VisualReferenceBoard
          presetSlug="codex-desktop-v1"
          calibrationSources={[calibrationSources[2]]}
          candidateCases={[
            {
              ...candidateCases[0],
              calibrationSourceIds: ["codex-desktop-private"],
            },
          ]}
          acceptanceStatus="pending"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByText("Calibration only · no pixel/overlay claim"),
    ).toBeTruthy();
  });
});
