import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { ParkingWorkbenchPreview } from "@/components/app/studio/assembly/parking-workbench-preview";
import {
  findParkingPreviewScenario,
  PARKING_PREVIEW_CASE_IDS,
} from "@/lib/system-presets/parking-preview";
import {
  buildParkingPreviewSearchParams,
  parseParkingPreviewSearchParams,
} from "@/lib/system-presets/parking-preview-config";

const EXPECTED_CASES = [
  "wide-light-task-dense",
  "wide-dark-task-streaming",
  "collapse-light-approval",
  "narrow-light-empty",
  "wide-dark-error-artifact",
  "wide-light-board-focus",
  "collapse-dark-connectors-overlay",
  "wide-light-settings-reduced-motion",
] as const;

const EXPECTED_TEXT_BY_CASE = {
  "wide-light-task-dense": "查询月票有效期",
  "wide-dark-task-streaming": "读取在场车辆",
  "collapse-light-approval": "允许执行受控的访客写入前检查。",
  "narrow-light-empty": "暂无任务",
  "wide-dark-error-artifact": "连接器暂时不可用；请在恢复后重试，不会重复写入。",
  "wide-light-board-focus": "运营核验看板",
  "collapse-dark-connectors-overlay": "智汇云",
  "wide-light-settings-reduced-motion": "执行授权与连接器设置",
} as const;

const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;
const originalFontsDescriptor = Object.getOwnPropertyDescriptor(document, "fonts");
const originalResizeObserver = globalThis.ResizeObserver;
const originalGetBoundingClientRect =
  HTMLElement.prototype.getBoundingClientRect;

afterEach(() => {
  cleanup();
  window.requestAnimationFrame = originalRequestAnimationFrame;
  window.cancelAnimationFrame = originalCancelAnimationFrame;
  globalThis.ResizeObserver = originalResizeObserver;
  HTMLElement.prototype.getBoundingClientRect =
    originalGetBoundingClientRect;
  if (originalFontsDescriptor) {
    Object.defineProperty(document, "fonts", originalFontsDescriptor);
  } else {
    Reflect.deleteProperty(document, "fonts");
  }
  delete window.__UILAB_PREVIEW_READY__;
});

describe("Parking preview scenario contract", () => {
  test("resolves the exact eight reference cases from one deterministic fixture", () => {
    expect(PARKING_PREVIEW_CASE_IDS).toEqual(EXPECTED_CASES);

    const scenarios = PARKING_PREVIEW_CASE_IDS.map((caseId) => {
      const scenario = findParkingPreviewScenario(caseId);
      expect(scenario).toBeDefined();
      if (!scenario) throw new Error(`Missing fixture scenario: ${caseId}`);
      return scenario;
    });

    expect(new Set(scenarios.map(({ fixture }) => fixture.id))).toEqual(
      new Set(["parking-high-density-v1"]),
    );
    expect(scenarios.every(({ fixture }) => fixture.deterministic)).toBe(true);
  });

  test("rejects an unknown case id", () => {
    expect(findParkingPreviewScenario("not-a-reference-case")).toBeUndefined();
  });

  test("round-trips bounded order preview configuration and rejects unsafe values", () => {
    const parsed = parseParkingPreviewSearchParams(
      buildParkingPreviewSearchParams({
        productName: "Parking Agent",
        composerPlaceholder: "Review exit evidence",
        activeLocale: "en-US",
        platformChrome: "web",
        capabilitySlugs: ["tasks", "artifact"],
        semanticStateColors: { success: "#0ea5e9", danger: "rgb(255 0 0)" },
      }),
    );
    expect(parsed).toMatchObject({
      productName: "Parking Agent",
      composerPlaceholder: "Review exit evidence",
      activeLocale: "en-US",
      platformChrome: "web",
      capabilitySlugs: ["tasks", "artifact"],
      semanticStateColors: { success: "#0ea5e9", danger: "rgb(255 0 0)" },
    });
    expect(
      parseParkingPreviewSearchParams(
        new URLSearchParams("color.success=red&capabilities=tasks,unknown"),
      ),
    ).toMatchObject({
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
      semanticStateColors: {},
    });
    expect(
      buildParkingPreviewSearchParams({
        productName: "x".repeat(513),
        semanticStateColors: { success: "red" },
      }).toString(),
    ).toBe("");
  });
});

describe("ParkingWorkbenchPreview", () => {
  for (const caseId of EXPECTED_CASES) {
    test(`renders the fixture-backed surfaces and state for ${caseId}`, () => {
      const scenario = findParkingPreviewScenario(caseId);
      if (!scenario) throw new Error(`Missing test scenario: ${caseId}`);

      const { container, getByTestId } = render(
        <ParkingWorkbenchPreview scenario={scenario} />,
      );
      const root = getByTestId("parking-workbench-preview");

      expect(root.dataset.caseId).toBe(caseId);
      expect(root.dataset.fixtureId).toBe("parking-high-density-v1");
      expect(root.dataset.theme).toBe(scenario.referenceCase.theme);
      expect(root.dataset.states?.split(" ")).toEqual([
        ...scenario.referenceCase.states,
      ]);
      expect(root.dataset.surfaces?.split(" ")).toEqual([
        ...scenario.referenceCase.surfaces,
      ]);
      expect(root.dataset.reducedMotion).toBe(
        String(scenario.referenceCase.reducedMotion),
      );
      expect(root.dataset.fixtureSelectors?.split(" ")).toEqual([
        ...scenario.selectors,
      ]);
      expect(container.textContent).toContain(EXPECTED_TEXT_BY_CASE[caseId]);

      for (const selector of scenario.selectors) {
        expect(
          container.querySelector(`[data-fixture-selector="${selector}"]`),
        ).not.toBeNull();
      }
      for (const surface of scenario.referenceCase.surfaces) {
        expect(
          container.querySelector(`[data-preview-surface="${surface}"]`),
        ).not.toBeNull();
      }
    });
  }

  test("applies scoped Codex Desktop tokens instead of ambient page theme values", () => {
    const scenario = findParkingPreviewScenario("wide-dark-task-streaming");
    if (!scenario) throw new Error("Missing dark preview scenario");

    const { getByTestId } = render(
      <ParkingWorkbenchPreview
        scenario={scenario}
        className="capture-contract"
      />,
    );
    const root = getByTestId("parking-workbench-preview");

    expect(root.classList.contains("dark")).toBe(true);
    expect(root.style.getPropertyValue("--wb-surface")).toBe("#181818");
    expect(root.style.getPropertyValue("--font-sans")).toContain("-apple-system");
    expect(root.style.colorScheme).toBe("dark");
    expect(root.classList.contains("capture-contract")).toBe(true);
  });

  test("keeps no-query calibration copy unchanged", () => {
    const scenario = findParkingPreviewScenario("wide-light-task-dense");
    if (!scenario) throw new Error("Missing default scenario");
    const { container } = render(<ParkingWorkbenchPreview scenario={scenario} />);
    expect(container.textContent).toContain("Parking Ops");
    expect(container.textContent).toContain("停车运营");
    expect(container.querySelector("textarea")?.getAttribute("placeholder")).toBe(
      "描述下一步停车运营核验…",
    );
  });

  test("renders native window controls only for native platform chrome", () => {
    const scenario = findParkingPreviewScenario("wide-light-task-dense");
    if (!scenario) throw new Error("Missing native chrome scenario");

    const native = render(<ParkingWorkbenchPreview scenario={scenario} />);
    expect(native.getByTestId("parking-native-window-controls")).toBeTruthy();
    expect(native.getByRole("button", { name: "后退" })).toBeTruthy();
    expect(native.getByRole("button", { name: "前进" })).toBeTruthy();
    native.unmount();

    const web = render(
      <ParkingWorkbenchPreview
        scenario={scenario}
        configuration={{
          productName: "Parking Agent",
          logoReference: "",
          composerPlaceholder: "Configured placeholder",
          activeLocale: "en-US",
          platformChrome: "web",
          semanticStateColors: {},
          capabilitySlugs: ["tasks", "artifact"],
        }}
      />,
    );
    expect(web.queryByTestId("parking-native-window-controls")).toBeNull();
    expect(web.queryByRole("button", { name: "Back" })).toBeNull();
    expect(web.queryByRole("button", { name: "Forward" })).toBeNull();
  });

  test("keeps narrow native chrome compact without desktop navigation", () => {
    const narrowScenario = findParkingPreviewScenario("narrow-light-empty");
    const collapseScenario = findParkingPreviewScenario("collapse-light-approval");
    if (!narrowScenario || !collapseScenario) {
      throw new Error("Missing compact chrome scenarios");
    }

    const narrow = render(
      <ParkingWorkbenchPreview scenario={narrowScenario} />,
    );
    expect(narrow.getByTestId("parking-native-window-controls")).toBeTruthy();
    expect(narrow.queryByRole("button", { name: "后退" })).toBeNull();
    expect(narrow.queryByRole("button", { name: "前进" })).toBeNull();
    expect(narrow.getByRole("button", { name: "切换任务导航" })).toBeTruthy();
    expect(narrow.getByRole("button", { name: "搜索" })).toBeTruthy();
    expect(narrow.queryByText("narrow")).toBeNull();
    const localeChip = narrow.getByTestId("parking-locale-chip");
    expect(localeChip.textContent).toBe("ZH");
    expect(localeChip.className).toContain("whitespace-nowrap");
    expect(narrow.queryByText("ZH-CN")).toBeNull();
    narrow.unmount();

    const collapse = render(
      <ParkingWorkbenchPreview scenario={collapseScenario} />,
    );
    expect(collapse.getByRole("button", { name: "后退" })).toBeTruthy();
    expect(collapse.getByRole("button", { name: "前进" })).toBeTruthy();
    expect(collapse.getByText("collapse")).toBeTruthy();
  });

  test("places workspace navigation before current and recent parking tasks", () => {
    const scenario = findParkingPreviewScenario("wide-light-task-dense");
    if (!scenario) throw new Error("Missing sidebar hierarchy scenario");

    const view = render(<ParkingWorkbenchPreview scenario={scenario} />);
    const navigation = view.getByRole("navigation", { name: "任务历史" });
    const workspace = navigation.querySelector('[data-sidebar-section="workspace"]');
    const tasks = navigation.querySelector('[data-sidebar-section="tasks"]');

    expect(workspace).toBeTruthy();
    expect(tasks).toBeTruthy();
    expect(
      workspace && tasks
        ? workspace.compareDocumentPosition(tasks) & Node.DOCUMENT_POSITION_FOLLOWING
        : 0,
    ).toBeTruthy();
    expect(workspace?.textContent).toContain("新建任务");
    expect(workspace?.textContent).toContain("计划任务");
    expect(workspace?.textContent).toContain("待审批");
    expect(workspace?.textContent).toContain("会话");
    expect(tasks?.textContent).toContain("当前任务");
    expect(tasks?.textContent).toContain("最近");
    view.unmount();

    const english = render(
      <ParkingWorkbenchPreview
        scenario={scenario}
        configuration={{
          productName: "Parking Agent",
          logoReference: "",
          composerPlaceholder: "Review parking records",
          activeLocale: "en-US",
          platformChrome: "web",
          semanticStateColors: {},
          capabilitySlugs: ["tasks", "artifact"],
        }}
      />,
    );
    const englishWorkspace = english.container.querySelector(
      '[data-sidebar-section="workspace"]',
    );
    expect(englishWorkspace?.textContent).toContain("New task");
    expect(englishWorkspace?.textContent).toContain("Scheduled");
    expect(englishWorkspace?.textContent).toContain("Pending approvals");
    expect(englishWorkspace?.textContent).toContain("Sessions");
  });

  test("renders the dense parking task as a worked-thought-tool-result flow", () => {
    const scenario = findParkingPreviewScenario("wide-light-task-dense");
    if (!scenario) throw new Error("Missing dense task scenario");

    const { container, getByRole, getByTestId } = render(
      <ParkingWorkbenchPreview scenario={scenario} />,
    );
    expect(getByRole("button", { name: /处理了 2 分 4 秒/ })).toBeTruthy();
    expect(getByRole("button", { name: /思考了 8 秒/ })).toBeTruthy();

    const taskFlow = getByTestId("parking-task-flow");
    const summary = getByTestId("parking-result-summary");
    expect(summary.querySelectorAll('[data-parking-result-row="true"]')).toHaveLength(3);
    for (const label of scenario.fixture.conversation.toolStreaming) {
      expect(taskFlow.textContent).toContain(label);
      expect(summary.textContent).toContain(label);
    }
    expect(summary.textContent).toContain("核验了 3 项结果");
    expect(container.textContent).not.toContain("pom.xml");
    expect(container.textContent).not.toContain("commit");
    expect(container.textContent).not.toContain("pull request");
  });

  test("composes board and connector capabilities from quiet preset components", () => {
    const boardScenario = findParkingPreviewScenario("wide-light-board-focus");
    const connectorsScenario = findParkingPreviewScenario(
      "collapse-dark-connectors-overlay",
    );
    if (!boardScenario || !connectorsScenario) {
      throw new Error("Missing quiet capability scenarios");
    }

    const board = render(
      <ParkingWorkbenchPreview scenario={boardScenario} />,
    );
    const boardInbox = board.container.querySelector(
      '[data-slot="agent-inbox"][data-variant="quiet"]',
    );
    expect(boardInbox?.getAttribute("role")).toBeNull();
    const boardItems = boardInbox?.querySelectorAll(
      '[data-slot="agent-inbox-item"][data-variant="quiet"]',
    );
    expect(boardItems).toHaveLength(3);
    expect(
      Array.from(boardItems ?? []).every(
        (item) => item.getAttribute("role") === null,
      ),
    ).toBe(true);
    for (const widget of boardScenario.fixture.board.widgets) {
      expect(boardInbox?.textContent).toContain(widget);
    }
    const focusTarget = board.getByTestId("parking-board-focus-target");
    expect(focusTarget.getAttribute("data-keyboard-focus")).toBe("true");
    expect(document.activeElement).toBe(focusTarget);
    board.unmount();

    const connectors = render(
      <ParkingWorkbenchPreview scenario={connectorsScenario} />,
    );
    const connectorGroup = connectors.container.querySelector(
      '[data-preview-surface="connectors"] [data-slot="settings-group"][data-variant="quiet"]',
    );
    expect(connectorGroup).toBeTruthy();
    expect(
      connectorGroup?.querySelectorAll('[data-slot="settings-row"]'),
    ).toHaveLength(4);
    expect(
      connectorGroup?.querySelectorAll('[data-slot="settings-select"]'),
    ).toHaveLength(1);
    expect(
      connectorGroup?.querySelectorAll('[data-connector-state="true"]'),
    ).toHaveLength(3);
    expect(connectorGroup?.textContent).toContain(
      connectorsScenario.fixture.connectors.runtime,
    );
    for (const state of connectorsScenario.fixture.connectors.states) {
      expect(connectorGroup?.textContent).toContain(state);
    }
    expect(
      connectors.container.querySelector(
        '[data-preview-surface="connectors"] [data-slot="settings-group"][data-variant="card"]',
      ),
    ).toBeNull();
    expect(
      connectors.container.querySelector(
        '[data-preview-surface="connectors"] [data-slot="agent-inbox"]',
      ),
    ).toBeNull();
  });

  test("preserves streaming, approval, and recoverable error states", () => {
    const streamingScenario = findParkingPreviewScenario(
      "wide-dark-task-streaming",
    );
    const approvalScenario = findParkingPreviewScenario(
      "collapse-light-approval",
    );
    const errorScenario = findParkingPreviewScenario(
      "wide-dark-error-artifact",
    );
    if (!streamingScenario || !approvalScenario || !errorScenario) {
      throw new Error("Missing task state scenarios");
    }

    const streaming = render(
      <ParkingWorkbenchPreview scenario={streamingScenario} />,
    );
    expect(
      streaming
        .getByTestId("parking-static-streaming-state")
        .getAttribute("data-state"),
    ).toBe("streaming");
    expect(streaming.getByText("固定流式快照")).toBeTruthy();
    streaming.unmount();

    const approval = render(
      <ParkingWorkbenchPreview scenario={approvalScenario} />,
    );
    expect(approval.getAllByText("需要人工批准")).not.toHaveLength(0);
    expect(
      approval.getAllByText(approvalScenario.fixture.conversation.approval),
    ).not.toHaveLength(0);
    approval.unmount();

    const error = render(<ParkingWorkbenchPreview scenario={errorScenario} />);
    expect(
      error.getAllByText(errorScenario.fixture.conversation.recoverableError),
    ).not.toHaveLength(0);
    expect(error.getByRole("button", { name: "重试" })).toBeTruthy();
  });

  test("projects configured order values and makes excluded capabilities explicit", () => {
    const scenario = findParkingPreviewScenario("wide-light-board-focus");
    if (!scenario) throw new Error("Missing board scenario");
    const { container, getByTestId, unmount } = render(
      <ParkingWorkbenchPreview
        scenario={scenario}
        configuration={{
          productName: "Parking Agent",
          logoReference: "logo.svg",
          composerPlaceholder: "Configured placeholder",
          activeLocale: "en-US",
          platformChrome: "web",
          semanticStateColors: { success: "#0ea5e9" },
          capabilitySlugs: ["tasks", "artifact"],
        }}
      />,
    );
    const root = getByTestId("parking-workbench-preview");
    expect(root.dataset.previewLocale).toBe("en-US");
    expect(root.dataset.platformChrome).toBe("web");
    expect(root.dataset.logoReference).toBe("logo.svg");
    expect(root.style.getPropertyValue("--wb-success")).toBe("#0ea5e9");
    expect(container.textContent).toContain("Parking Agent");
    expect(screen.getByLabelText("Logo reference: logo.svg")).toBeTruthy();
    expect(screen.getByText("EN-US")).toBeTruthy();
    expect(container.querySelector('[data-excluded-capability="board"]')).toBeTruthy();
    unmount();

    const taskScenario = findParkingPreviewScenario("wide-light-task-dense");
    if (!taskScenario) throw new Error("Missing task scenario");
    const task = render(
      <ParkingWorkbenchPreview
        scenario={taskScenario}
        configuration={{
          productName: "Parking Agent",
          logoReference: "",
          composerPlaceholder: "Configured placeholder",
          activeLocale: "en-US",
          platformChrome: "web",
          semanticStateColors: {},
          capabilitySlugs: ["tasks", "artifact"],
        }}
      />,
    );
    expect(task.getByPlaceholderText("Configured placeholder")).toBeTruthy();
    expect(task.getByRole("button", { name: "Toggle task navigation" })).toBeTruthy();
    expect(task.getByRole("button", { name: "Search" })).toBeTruthy();
    expect(task.getByRole("navigation", { name: "Task history" })).toBeTruthy();
    expect(task.getByRole("textbox", { name: "Task message" })).toBeTruthy();
    expect(task.getByText("Controlled access")).toBeTruthy();
    task.unmount();
  });

  test("marks capture ready only after fonts and two animation frames, then resets", async () => {
    let resolveFonts!: () => void;
    const fontsReady = new Promise<void>((resolve) => {
      resolveFonts = resolve;
    });
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: fontsReady },
    });

    const frames: FrameRequestCallback[] = [];
    window.requestAnimationFrame = (callback) => {
      frames.push(callback);
      return frames.length;
    };
    window.cancelAnimationFrame = () => {};

    const initial = findParkingPreviewScenario("wide-light-task-dense");
    const next = findParkingPreviewScenario("wide-dark-task-streaming");
    if (!initial || !next) throw new Error("Missing readiness scenarios");

    const view = render(<ParkingWorkbenchPreview scenario={initial} />);
    const root = view.getByTestId("parking-workbench-preview");
    expect(root.dataset.previewReady).toBe("false");
    expect(window.__UILAB_PREVIEW_READY__).toBe(false);

    resolveFonts();
    await act(async () => {
      await fontsReady;
    });
    expect(frames).toHaveLength(1);

    act(() => {
      frames.shift()?.(16);
    });
    expect(root.dataset.previewReady).toBe("false");
    expect(frames).toHaveLength(1);

    act(() => {
      frames.shift()?.(32);
    });
    expect(root.dataset.previewReady).toBe("true");
    expect(window.__UILAB_PREVIEW_READY__).toBe(true);

    view.rerender(<ParkingWorkbenchPreview scenario={next} />);
    expect(root.dataset.previewReady).toBe("false");
    expect(window.__UILAB_PREVIEW_READY__).toBe(false);

    view.unmount();
    expect(window.__UILAB_PREVIEW_READY__).toBe(false);
  });

  test("waits for the reference layout before starting the two ready frames", async () => {
    let workbenchObserver:
      | {
          callback: ResizeObserverCallback;
          target: Element;
        }
      | undefined;

    class ControlledResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}

      observe(target: Element) {
        if (target.hasAttribute("data-layout-mode")) {
          workbenchObserver = { callback: this.callback, target };
        }
      }
      unobserve() {}
      disconnect() {}
    }

    globalThis.ResizeObserver =
      ControlledResizeObserver as unknown as typeof ResizeObserver;
    HTMLElement.prototype.getBoundingClientRect = () =>
      ({
        width: 1000,
        height: 760,
        top: 0,
        right: 1000,
        bottom: 760,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const frames: FrameRequestCallback[] = [];
    window.requestAnimationFrame = (callback) => {
      frames.push(callback);
      return frames.length;
    };
    window.cancelAnimationFrame = () => {};

    const scenario = findParkingPreviewScenario("collapse-light-approval");
    if (!scenario) throw new Error("Missing collapse readiness scenario");

    const view = render(<ParkingWorkbenchPreview scenario={scenario} />);
    const root = view.getByTestId("parking-workbench-preview");
    await act(async () => {
      await Promise.resolve();
    });

    expect(
      root.querySelector<HTMLElement>("[data-layout-mode]")?.dataset.layoutMode,
    ).toBe("desktop");
    expect(root.dataset.previewReady).toBe("false");
    expect(frames).toHaveLength(1);

    act(() => {
      frames.shift()?.(16);
    });
    expect(root.dataset.previewReady).toBe("false");

    if (!workbenchObserver) {
      throw new Error("Workbench ResizeObserver was not attached");
    }
    act(() => {
      workbenchObserver?.callback(
        [
          {
            target: workbenchObserver.target,
            contentRect: workbenchObserver.target.getBoundingClientRect(),
          } as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      );
    });
    expect(
      root.querySelector<HTMLElement>("[data-layout-mode]")?.dataset.layoutMode,
    ).toBe("tablet");

    act(() => {
      frames.shift()?.(32);
    });
    expect(root.dataset.previewReady).toBe("false");
    act(() => {
      frames.shift()?.(48);
    });
    expect(root.dataset.previewReady).toBe("false");
    act(() => {
      frames.shift()?.(64);
    });
    expect(root.dataset.previewReady).toBe("true");
  });

  for (const caseId of EXPECTED_CASES) {
    test(`${caseId} has no serious accessibility violations`, async () => {
      const scenario = findParkingPreviewScenario(caseId);
      if (!scenario) throw new Error(`Missing a11y scenario: ${caseId}`);
      window.requestAnimationFrame = () => 1;
      window.cancelAnimationFrame = () => {};

      const { container } = render(<ParkingWorkbenchPreview scenario={scenario} />);
      const results = await axe(container);
      const serious = results.violations.filter(
        ({ impact }) => impact === "serious" || impact === "critical",
      );

      expect(
        serious.map(({ id, impact, nodes }) => ({
          id,
          impact,
          targets: nodes.map(({ target }) => target),
        })),
      ).toEqual([]);
    });
  }
});
