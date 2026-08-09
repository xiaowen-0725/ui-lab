import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("UI Lab benchmark contract", () => {
  it("binds the technical fixture stack and full required source family", () => {
    const config = JSON.parse(readFileSync("ui-lab.config.json", "utf8"));
    expect(config).toMatchObject({ profile: "vite-app", system: "graphite", recipe: "agent-workbench", mode: "replace" });
    expect(config.components).toEqual(expect.arrayContaining(["agent-workbench", "thread-list", "agent-thread", "agent-composer", "artifact-panel"]));
  });

  it("vendors all Catalog-declared family files and active workbench tokens", () => {
    const paths = [
      "src/components/motion/agent-workbench/index.tsx", "src/components/motion/agent-workbench/resize-handle.tsx", "src/components/motion/agent-workbench/summary-card.tsx",
      "src/components/motion/thread-list/index.tsx", "src/components/motion/agent-thread/index.tsx", "src/components/motion/agent-thread/cards.tsx", "src/components/motion/agent-thread/status.tsx",
      "src/components/motion/agent-composer/index.tsx", "src/components/motion/agent-composer/effort-slider.tsx", "src/components/motion/agent-composer/autonomy-dial.tsx", "src/components/motion/artifact-panel/index.tsx",
    ];
    for (const path of paths) expect(readFileSync(path, "utf8").length).toBeGreaterThan(100);
    expect(readFileSync("src/styles.css", "utf8")).toContain("--wb-surface:");
  });
});
