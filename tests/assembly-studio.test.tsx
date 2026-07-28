import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AssemblyStudio } from "@/components/app/studio/assembly/assembly-studio";
import { encodeOrderShare } from "@/lib/assembly-order";
import type { OrderManifest } from "@/lib/order-manifest";

const CASES = [
  ["wide-light-task-dense", "1440x900", "light", ["dense"], ["task", "artifact"]],
  [
    "wide-dark-task-streaming",
    "1440x900",
    "dark",
    ["dense", "streaming"],
    ["task", "artifact"],
  ],
  [
    "collapse-light-approval",
    "1000x760",
    "light",
    ["approval"],
    ["task", "artifact"],
  ],
  ["narrow-light-empty", "375x760", "light", ["empty"], ["task"]],
  [
    "wide-dark-error-artifact",
    "1440x900",
    "dark",
    ["error"],
    ["task", "artifact"],
  ],
  [
    "wide-light-board-focus",
    "1440x900",
    "light",
    ["dense"],
    ["board"],
  ],
  [
    "collapse-dark-connectors-overlay",
    "1000x760",
    "dark",
    ["dense"],
    ["connectors", "settings"],
  ],
  [
    "wide-light-settings-reduced-motion",
    "1440x900",
    "light",
    ["dense"],
    ["settings"],
  ],
] as const;

const preset = {
  slug: "codex-desktop-v1",
  calibrationSources: [
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
    },
  ],
  profiles: ["electron-renderer", "next-app"],
  recipe: "agent-workbench",
  capabilities: [
    { slug: "tasks", name: "Tasks", required: true },
    { slug: "artifact", name: "Artifact", required: true },
    { slug: "board", name: "Board", required: false },
    { slug: "connectors", name: "Connectors", required: false },
    { slug: "settings", name: "Settings", required: true },
  ],
  cases: CASES.map(([id, size, theme, states, surfaces]) => ({
    id,
    size,
    theme,
    states,
    surfaces,
    calibrationSourceIds: [
      theme === "dark" ? "codex-composer-dark" : "codex-workbench-light",
    ],
  })),
} as const;

const evidence = {
  available: true as const,
  acceptanceStatus: "approved" as const,
  captures: CASES.map(([caseId], index) => ({
    caseId,
    path: `/reference/${caseId}.png`,
    sha256: index.toString(16).padStart(64, "a"),
  })),
};

function createOrder({
  status = "draft",
  revision = 1,
  safeOverrides = {
    branding: { productName: "Parking Agent" },
    navigation: ["tasks", "artifact", "board", "connectors", "settings"],
    locale: ["en"],
    platformChrome: "native",
  },
  profile = "electron-renderer",
  platformChrome = "native",
  lineage,
}: {
  status?: "draft" | "confirmed";
  revision?: number;
  safeOverrides?: OrderManifest["safeOverrides"];
  profile?: OrderManifest["target"]["profile"];
  platformChrome?: OrderManifest["target"]["platformChrome"];
  lineage?: OrderManifest["lineage"];
} = {}): OrderManifest {
  const confirmedAt = "2026-07-28T10:00:00.000Z";
  return {
    schemaVersion: 1,
    identity: {
      orderId: "parking-order",
      revision,
      status,
      createdAt: "2026-07-28T09:00:00.000Z",
      ...(status === "confirmed" ? { confirmedAt } : {}),
      manifestHash: String(revision).padStart(64, status === "confirmed" ? "c" : "d"),
    },
    ...(lineage ? { lineage } : {}),
    target: {
      category: "application",
      profile,
      productId: "parking-agent",
      locales: ["en"],
      platformChrome,
    },
    preset: {
      slug: preset.slug,
      version: 1,
      contractHash: "1".repeat(64),
      catalogSource: "test",
      catalogSnapshotHash: "2".repeat(64),
    },
    composition: {
      recipe: { slug: preset.recipe, contractHash: "3".repeat(64) },
      capabilities: ["tasks", "artifact", "board", "connectors", "settings"],
      components: [
        {
          slug: "agent-workbench",
          contractHash: "4".repeat(64),
          sourceFiles: ["agent-workbench.tsx"],
        },
      ],
      assets: [
        {
          kind: "font",
          id: "system-font",
          requirement: "System UI stack",
          required: true,
          source: "system-preset",
        },
      ],
    },
    safeOverrides,
    lockedVisualSnapshot: {
      typography: {},
      icons: {},
      surfaces: {},
      selection: {},
      density: {},
      geometry: {},
      shadows: {},
      motion: {},
      responsive: {},
    },
    previewScenarios: {
      fixture: {
        id: "parking-high-density-v1",
        version: 1,
        fixtureHash: "5".repeat(64),
      },
      caseIds: CASES.map(([id]) => id),
    },
    referenceEvidence: {
      referencePackId: preset.slug,
      referencePackHash: "6".repeat(64),
      cases: CASES.map(([id, size, theme, states, surfaces], index) => ({
        id,
        viewport: size === "375x760" ? "narrow" : size === "1000x760" ? "collapse" : "wide",
        size,
        scale: 1,
        theme,
        states: [...states],
        surfaces: [...surfaces],
        keyboardFocus: false,
        reducedMotion: false,
        fixtureId: "parking-high-density-v1",
        fontLoadingState: "ready",
        captureTiming: "settled",
        calibrationSourceIds: ["codex-workbench"],
        goldenSha256:
          status === "confirmed"
            ? index.toString(16).padStart(64, "a")
            : null,
      })),
    },
    ...(status === "confirmed"
      ? {
          confirmation: {
            confirmedAt,
            previewMatrixHash: "7".repeat(64),
            visualAcceptance: {
              approvedAt: "2026-07-28T09:45:00.000Z",
              approvedBy: "visual-reviewer",
              decisionEvidence: "Reference Board decision #1",
              reviewedCaseIds: CASES.map(([id]) => id),
            },
          },
        }
      : {}),
    derivedArtifacts: {},
  };
}

function renderStudio(
  evidenceProp: Parameters<typeof AssemblyStudio>[0]["evidence"] = evidence,
) {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <AssemblyStudio preset={preset} evidence={evidenceProp} />
    </NextIntlClientProvider>,
  );
}

function response(order: OrderManifest) {
  return new Response(JSON.stringify({ ok: true, order }));
}

function reviewCase(caseId: (typeof CASES)[number][0]) {
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: `Review ${caseId} current order`,
    }),
  );
}

function reviewAllCases() {
  for (const [caseId] of CASES) reviewCase(caseId);
}

beforeEach(() => {
  window.location.href = "about:blank";
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: mock(async () => undefined) },
  });
  URL.createObjectURL = mock(() => "blob:assembly-order");
  URL.revokeObjectURL = mock(() => undefined);
});

afterEach(() => {
  cleanup();
  mock.restore();
  window.location.href = "about:blank";
});

describe("Assembly Studio checkout", () => {
  test("auto-resolves, renders the exact evidence matrix, and enforces review before confirmation", async () => {
    const draft = createOrder();
    const confirmed = createOrder({ status: "confirmed" });
    const calls: unknown[] = [];
    globalThis.fetch = mock(async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      calls.push(body);
      return body.action === "confirm" ? response(confirmed) : response(draft);
    }) as unknown as typeof fetch;

    renderStudio();

    await waitFor(() => {
      expect(calls).toHaveLength(1);
    });
    expect((calls[0] as { action: string }).action).toBe("resolve");
    expect(
      screen.getAllByAltText(/candidate regression capture$/),
    ).toHaveLength(9);
    expect(
      screen.getByTestId("evidence-matrix").querySelectorAll("article"),
    ).toHaveLength(8);
    expect(
      within(screen.getByTestId("evidence-matrix")).getAllByText(
        "1440x900 · light",
      ),
    ).toHaveLength(3);
    expect(screen.getByText("states: empty")).toBeTruthy();
    expect(screen.getByText("surfaces: connectors, settings")).toBeTruthy();

    const confirm = screen.getByRole("button", { name: "Confirm order" });
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText("Reviewer ID"), {
      target: { value: "reviewer-1" },
    });
    const firstCase = screen.getByTestId("evidence-matrix").querySelector("article");
    if (!firstCase) throw new Error("Missing first checkout case");
    expect(
      within(firstCase).getByRole("link", {
        name: "Open current order preview wide-light-task-dense",
      }).getAttribute("href"),
    ).toContain("/en/studio/preview/wide-light-task-dense");
    for (const [caseId] of CASES.slice(0, 7)) reviewCase(caseId);
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    reviewCase(CASES[7][0]);
    expect((confirm as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(confirm);

    await waitFor(() => {
      expect(screen.getByText("confirmed")).toBeTruthy();
    });
    const confirmPayload = calls[1] as {
      action: string;
      captures: Array<{ caseId: string }>;
      review: { explicitlyConfirmed: boolean; reviewedCaseIds: string[] };
      reviewerId: string;
    };
    expect(confirmPayload.action).toBe("confirm");
    expect(confirmPayload.captures.map((item) => item.caseId)).toEqual(
      CASES.map(([id]) => id),
    );
    expect(confirmPayload.reviewerId).toBe("reviewer-1");
    expect(confirmPayload.review).toEqual({
      explicitlyConfirmed: true,
      reviewedCaseIds: CASES.map(([id]) => id),
    });
    expect((screen.getByLabelText("Runtime") as HTMLSelectElement).disabled).toBe(
      true,
    );
    expect(
      (screen.getByLabelText("Product name") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(screen.getByRole("button", { name: "Create revision" })).toBeTruthy();
  });

  test("shows a blocker when evidence does not exactly cover the preset", async () => {
    globalThis.fetch = mock(
      async () => response(createOrder()),
    ) as unknown as typeof fetch;

    renderStudio({
      available: true,
      acceptanceStatus: "approved",
      captures: evidence.captures.slice(0, 7),
    });

    await waitFor(() => {
      expect(screen.getByText("Checkout blocked")).toBeTruthy();
    });
    expect(screen.queryByTestId("evidence-matrix")).toBeNull();
    expect(screen.queryAllByRole("checkbox", { name: /current order/ })).toHaveLength(0);
    expect(
      (screen.getByRole("button", { name: "Confirm order" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  test("keeps candidate captures visible but blocks review while acceptance is pending", async () => {
    globalThis.fetch = mock(
      async () => response(createOrder()),
    ) as unknown as typeof fetch;

    renderStudio({
      ...evidence,
      acceptanceStatus: "pending",
    });

    await waitFor(() => {
      expect(screen.getByText("Acceptance pending")).toBeTruthy();
    });
    expect(screen.getByText("Checkout blocked")).toBeTruthy();
    expect(
      screen.getByTestId("evidence-matrix").querySelectorAll("article"),
    ).toHaveLength(8);
    expect(
      screen
        .getAllByRole("checkbox", { name: /Review .* current order/ })
        .every((checkbox) => (checkbox as HTMLInputElement).disabled),
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Confirm order" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  test("keeps runtime target and safe override synchronized and reuses draft identity", async () => {
    const draft = createOrder();
    const calls: Array<Record<string, unknown>> = [];
    globalThis.fetch = mock(async (_url, init) => {
      calls.push(JSON.parse(String(init?.body)));
      return response(draft);
    }) as unknown as typeof fetch;

    renderStudio();
    await waitFor(() => {
      expect(calls).toHaveLength(1);
    });

    fireEvent.change(screen.getByLabelText("Runtime"), {
      target: { value: "next-app" },
    });
    await waitFor(() => {
      expect(calls).toHaveLength(2);
    });
    expect(calls[1].profile).toBe("next-app");
    expect(calls[1].platformChrome).toBe("web");
    expect(
      (calls[1].safeOverrides as Record<string, unknown>).platformChrome,
    ).toBe("web");
    expect(calls[1].orderId).toBe("parking-order");
    expect(calls[1].createdAt).toBe("2026-07-28T09:00:00.000Z");
    expect((screen.getByText("web chrome"))).toBeTruthy();
  });

  test("blocks confirmation for un-resolved overrides until the current selection resolves", async () => {
    const calls: Array<Record<string, unknown>> = [];
    globalThis.fetch = mock(async (_url, init) => {
      calls.push(JSON.parse(String(init?.body)));
      return response(createOrder());
    }) as unknown as typeof fetch;
    renderStudio();
    await waitFor(() => expect(calls).toHaveLength(1));

    reviewAllCases();
    expect(
      (screen.getByRole("button", { name: "Confirm order" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);

    fireEvent.change(screen.getByLabelText("Product name"), {
      target: { value: "Parking Agent Next" },
    });
    expect(
      screen
        .getAllByRole("checkbox", { name: /Review .* current order/ })
        .every((checkbox) => !(checkbox as HTMLInputElement).checked),
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Confirm order" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(screen.getByText(/Current selection has not been resolved/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Apply overrides" }));
    await waitFor(() => expect(calls).toHaveLength(2));
    reviewAllCases();
    expect(
      (screen.getByRole("button", { name: "Confirm order" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    expect(String(calls[1].productId)).toBe("parking-agent");
  });

  test("keeps the last resolve response when requests finish in reverse order", async () => {
    let firstResolve!: (value: Response) => void;
    let secondResolve!: (value: Response) => void;
    const calls: Array<Record<string, unknown>> = [];
    globalThis.fetch = mock((_url, init) => {
      calls.push(JSON.parse(String(init?.body)));
      return new Promise<Response>((resolve) => {
        if (calls.length === 1) firstResolve = resolve;
        else secondResolve = resolve;
      });
    }) as unknown as typeof fetch;
    renderStudio();
    await waitFor(() => expect(calls).toHaveLength(1));
    fireEvent.change(screen.getByLabelText("Runtime"), {
      target: { value: "next-app" },
    });
    await waitFor(() => expect(calls).toHaveLength(2));
    const newest = createOrder({ profile: "next-app", platformChrome: "web" });
    newest.identity.orderId = "latest-order";
    act(() => secondResolve(response(newest)));
    await waitFor(() => expect(screen.getByText("latest-order")).toBeTruthy());
    const stale = createOrder();
    stale.identity.orderId = "stale-order";
    act(() => firstResolve(response(stale)));
    await act(async () => await Promise.resolve());
    expect(screen.queryByText("stale-order")).toBeNull();
    expect(screen.getByText("latest-order")).toBeTruthy();
  });
});

describe("Assembly Studio revisions and read-only orders", () => {
  test("creates a lineage-preserving revision and reports stable changes and affected cases", async () => {
    const draft = createOrder();
    const parent = createOrder({ status: "confirmed" });
    parent.composition.capabilities = [
      "artifact",
      "tasks",
      "settings",
      "connectors",
      "board",
    ];
    const revision = createOrder({
      revision: 2,
      safeOverrides: {
        branding: { productName: "Parking Agent Next" },
        navigation: ["tasks", "artifact", "board", "connectors", "settings"],
        locale: ["en"],
        platformChrome: "native",
      },
      lineage: {
        parentOrderId: parent.identity.orderId,
        parentRevision: parent.identity.revision,
        parentHash: parent.identity.manifestHash,
        reason: "Approved naming change",
      },
    });
    revision.composition.capabilities = [
      ...parent.composition.capabilities,
    ];
    const parentBefore = JSON.stringify(parent);
    const calls: Array<Record<string, unknown>> = [];
    globalThis.fetch = mock(async (_url, init) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      calls.push(body);
      if (body.action === "confirm") return response(parent);
      if (body.action === "revise") {
        const nextRevision = structuredClone(revision);
        const nextSelection = body.nextSelection as {
          safeOverrides: { navigation: string[] };
        };
        nextRevision.safeOverrides.navigation = [
          ...nextSelection.safeOverrides.navigation,
        ];
        return response(nextRevision);
      }
      return response(draft);
    }) as unknown as typeof fetch;

    renderStudio();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Confirm order" })).toBeTruthy();
    });
    reviewAllCases();
    fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Create revision" })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Create revision" }));
    expect(
      (screen.getByLabelText("Product name") as HTMLInputElement).disabled,
    ).toBe(false);
    fireEvent.change(screen.getByLabelText("Product name"), {
      target: { value: "Parking Agent Next" },
    });
    fireEvent.change(screen.getByLabelText("Revision reason"), {
      target: { value: "Approved naming change" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate revision" }));

    await waitFor(() => {
      expect(screen.getByText("safeOverrides.branding.productName")).toBeTruthy();
    });
    const revisePayload = calls.find(
      (call) => call.action === "revise",
    ) as Record<string, unknown>;
    expect(revisePayload.reason).toBe("Approved naming change");
    expect(revisePayload.parent).toEqual(parent);
    expect(
      (
        (revisePayload.nextSelection as Record<string, unknown>)
          .safeOverrides as {
          branding: { productName: string };
          navigation: string[];
        }
      ).branding.productName,
    ).toBe("Parking Agent Next");
    expect(
      (
        (revisePayload.nextSelection as Record<string, unknown>)
          .safeOverrides as {
          navigation: string[];
        }
      ).navigation,
    ).toEqual(["tasks", "artifact", "board", "connectors", "settings"]);
    expect(JSON.stringify(parent)).toBe(parentBefore);
    expect(
      screen.queryByText(
        (content) => content.startsWith("safeOverrides.navigation"),
      ),
    ).toBeNull();
    expect(screen.getByText("Parking Agent")).toBeTruthy();
    expect(screen.getByText("Parking Agent Next")).toBeTruthy();
    expect(
      screen.getByText(/conservative full-matrix recheck/).textContent,
    ).toContain("wide-light-settings-reduced-motion");
    const visualReview = screen.getByTestId("revision-visual-review");
    const revisionFrames = visualReview.querySelectorAll("iframe");
    expect(revisionFrames).toHaveLength(2);
    expect(revisionFrames[0]?.getAttribute("src")).not.toBe(
      revisionFrames[1]?.getAttribute("src"),
    );
    expect(revisionFrames[1]?.getAttribute("src")).toContain(
      "productName=Parking+Agent+Next",
    );
    expect(
      Array.from(visualReview.querySelectorAll("a")).some(
        (link) =>
          link.textContent === "before" &&
          link.getAttribute("href")?.includes("wide-light-task-dense"),
      ),
    ).toBe(true);
    expect(
      Array.from(visualReview.querySelectorAll("a")).some(
        (link) =>
          link.textContent === "after" &&
          link.getAttribute("href")?.includes("wide-light-task-dense"),
      ),
    ).toBe(true);
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText(/Parent revision 1/)).toBeTruthy();
  });

  test("imports as read-only, keeps preview and export available, and disables all selection controls", async () => {
    const initial = createOrder();
    const imported = createOrder({
      safeOverrides: {
        branding: { productName: "Imported Parking" },
        navigation: ["tasks", "artifact", "board", "connectors", "settings"],
        locale: ["en"],
        platformChrome: "native",
      },
    });
    const calls: Array<Record<string, unknown>> = [];
    globalThis.fetch = mock(async (_url, init) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      calls.push(body);
      return response(body.action === "import" ? imported : initial);
    }) as unknown as typeof fetch;

    renderStudio();
    await waitFor(() => {
      expect(calls).toHaveLength(1);
    });
    const file = new File([JSON.stringify(imported)], "order.json", {
      type: "application/json",
    });
    fireEvent.change(screen.getByLabelText("Import manifest"), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText("Read-only order")).toBeTruthy();
    });
    expect(
      (screen.getByLabelText("Product name") as HTMLInputElement).value,
    ).toBe("Imported Parking");
    expect((screen.getByLabelText("Runtime") as HTMLSelectElement).disabled).toBe(
      true,
    );
    expect(
      (screen.getByRole("checkbox", { name: "Board" }) as HTMLInputElement)
        .disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Confirm order" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);

    fireEvent.click(
      within(
        screen.getByRole("tablist", { name: "Assembly preview cases" }),
      ).getByRole("tab", { name: "narrow-light-empty" }),
    );
    const importedPreview = screen.getByTitle("Assembly preview");
    expect(importedPreview.getAttribute("src")).toBe(
      "/en/studio/preview/narrow-light-empty?productName=Imported+Parking&locale=en",
    );
    expect(importedPreview.getAttribute("width")).toBe("375");
    expect(importedPreview.getAttribute("height")).toBe("760");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy manifest" }));
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "JSON" }));
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  test("loads shared orders through trusted import and locks their controls", async () => {
    const shared = createOrder({ status: "confirmed" });
    window.location.href = `about:blank?order=${encodeOrderShare(shared)}`;
    expect(window.location.search).toContain("?order=");
    const calls: Array<Record<string, unknown>> = [];
    globalThis.fetch = mock(async (_url, init) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      calls.push(body);
      return response(shared);
    }) as unknown as typeof fetch;

    renderStudio();
    await waitFor(() => {
      expect(screen.getByText("Read-only order")).toBeTruthy();
    });

    expect(calls).toHaveLength(1);
    expect(calls[0].action).toBe("import");
    expect((screen.getByLabelText("Runtime") as HTMLSelectElement).disabled).toBe(
      true,
    );
    expect(
      screen.getAllByAltText(/candidate regression capture$/),
    ).toHaveLength(9);
  });
});
