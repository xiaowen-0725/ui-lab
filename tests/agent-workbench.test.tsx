import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import {
  useWorkbench,
  Workbench,
  WorkbenchHeader,
  WorkbenchMain,
  WorkbenchPanel,
  WorkbenchSidebar,
} from "@/components/motion/agent-workbench";

let width = 1440;

class MeasuringResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element) {
    this.callback(
      [{ contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }

  unobserve() {}
  disconnect() {}
}

function Controls() {
  const { layoutMode, panelOpen, setPanelOpen, setSidebarOpen, sidebarOpen } = useWorkbench();
  return (
    <output
      data-layout-mode={layoutMode}
      data-panel-open={String(panelOpen)}
      data-sidebar-open={String(sidebarOpen)}
      data-testid="workbench-state"
    >
      <button type="button" onClick={() => setPanelOpen(true)}>
        Open artifact
      </button>
      <button type="button" onClick={() => setSidebarOpen(true)}>
        Open navigation
      </button>
    </output>
  );
}

function TestWorkbench({ initialPanelOpen = false }: { initialPanelOpen?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(initialPanelOpen);
  return (
    <Workbench
      panelOpen={panelOpen}
      sidebarOpen={sidebarOpen}
      onPanelOpenChange={setPanelOpen}
      onSidebarOpenChange={setSidebarOpen}
    >
      <WorkbenchHeader />
      <WorkbenchSidebar>navigation</WorkbenchSidebar>
      <WorkbenchMain>main task</WorkbenchMain>
      <WorkbenchPanel>artifact</WorkbenchPanel>
      <Controls />
    </Workbench>
  );
}

afterEach(() => {
  cleanup();
  width = 1440;
});

describe("AgentWorkbench responsive contract", () => {
  test("uses the desktop inline layout at 1440px", async () => {
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = MeasuringResizeObserver as unknown as typeof ResizeObserver;
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () =>
      ({ width, height: 800, top: 0, right: width, bottom: 800, left: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    render(<TestWorkbench initialPanelOpen />);

    await waitFor(() => {
      expect(screen.getByTestId("workbench-state").dataset.layoutMode).toBe("desktop");
    });
    expect(screen.getByLabelText("Resize sidebar")).toBeTruthy();
    expect(screen.getByLabelText("Resize panel")).toBeTruthy();

    globalThis.ResizeObserver = original;
    HTMLElement.prototype.getBoundingClientRect = rect;
  });

  test("uses an artifact overlay and collapses navigation first at 1000px", async () => {
    width = 1000;
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = MeasuringResizeObserver as unknown as typeof ResizeObserver;
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () =>
      ({ width, height: 800, top: 0, right: width, bottom: 800, left: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    render(<TestWorkbench initialPanelOpen />);

    await waitFor(() => {
      const state = screen.getByTestId("workbench-state");
      expect(state.dataset.layoutMode).toBe("tablet");
      expect(state.dataset.sidebarOpen).toBe("false");
    });
    expect(screen.getByTestId("workbench-state").dataset.panelOpen).toBe("true");
    expect(screen.getByLabelText("Artifact overlay")).toBeTruthy();
    const panelScrim = screen.getByRole("button", {
      name: "Close artifact overlay",
    });
    expect(panelScrim.className).toContain("bg-[var(--wb-overlay-scrim)]");
    expect(panelScrim.className).not.toContain("wb-surface-translucent");
    expect(panelScrim.className).not.toContain("opacity-70");
    expect(screen.queryByLabelText("Resize panel")).toBeNull();
    expect(document.querySelector("main")?.hasAttribute("inert")).toBe(true);

    globalThis.ResizeObserver = original;
    HTMLElement.prototype.getBoundingClientRect = rect;
  });

  test("uses one mobile task surface at a time and backdrop close", async () => {
    width = 640;
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = MeasuringResizeObserver as unknown as typeof ResizeObserver;
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () =>
      ({ width, height: 800, top: 0, right: width, bottom: 800, left: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    render(<TestWorkbench />);

    await waitFor(() => {
      const state = screen.getByTestId("workbench-state");
      expect(state.dataset.layoutMode).toBe("mobile");
      expect(state.dataset.sidebarOpen).toBe("false");
    });
    fireEvent.click(screen.getByRole("button", { name: "Open artifact" }));
    expect(screen.getByTestId("workbench-state").dataset.panelOpen).toBe("true");
    expect(document.querySelector("main")?.hasAttribute("inert")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByTestId("workbench-state").dataset.panelOpen).toBe("false");
    expect(screen.getByTestId("workbench-state").dataset.sidebarOpen).toBe("true");

    const sidebarScrim = screen.getByRole("button", {
      name: "Close sidebar overlay",
    });
    expect(sidebarScrim.className).toContain("bg-[var(--wb-overlay-scrim)]");
    expect(sidebarScrim.className).not.toContain("wb-surface-translucent");
    expect(sidebarScrim.className).not.toContain("opacity-70");
    fireEvent.click(sidebarScrim);
    expect(screen.getByTestId("workbench-state").dataset.sidebarOpen).toBe("false");

    globalThis.ResizeObserver = original;
    HTMLElement.prototype.getBoundingClientRect = rect;
  });
});
