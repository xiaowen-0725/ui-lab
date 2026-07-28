import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import {
  AgentInbox,
  InboxItem,
} from "@/components/motion/agent-inbox";

afterEach(cleanup);

describe("AgentInbox variants", () => {
  test("inherits quiet composition without promising list semantics", () => {
    const card = render(
      <AgentInbox title="Approvals">
        <InboxItem title="Write access" status="approved" resolution="Done" />
      </AgentInbox>,
    );
    const cardRoot = card.container.querySelector<HTMLElement>(
      '[data-slot="agent-inbox"]',
    );
    const cardItem = card.container.querySelector<HTMLElement>(
      '[data-slot="agent-inbox-item"]',
    );
    expect(cardRoot?.getAttribute("data-variant")).toBe("card");
    expect(cardRoot?.getAttribute("role")).toBeNull();
    expect(cardRoot?.className).toContain("rounded-2xl");
    expect(cardRoot?.style.boxShadow).toContain("var(--wb-hairline)");
    expect(cardItem?.getAttribute("data-variant")).toBe("card");
    expect(cardItem?.getAttribute("role")).toBeNull();
    card.unmount();

    const standalone = render(<InboxItem title="Standalone" />);
    const standaloneItem = standalone.container.querySelector<HTMLElement>(
      '[data-slot="agent-inbox-item"]',
    );
    expect(standaloneItem?.getAttribute("data-variant")).toBe("card");
    expect(standaloneItem?.getAttribute("role")).toBeNull();
    standalone.unmount();

    const quiet = render(
      <AgentInbox variant="quiet">
        <InboxItem
          icon={<span aria-hidden>•</span>}
          source="Parking Ops"
          title="异常分布"
          description="board-fixture-001"
          status="approved"
          resolution="01"
        />
        <InboxItem variant="card" title="Explicit card override" />
      </AgentInbox>,
    );
    const quietRoot = quiet.container.querySelector<HTMLElement>(
      '[data-slot="agent-inbox"]',
    );
    const quietItem = quiet.container.querySelector<HTMLElement>(
      '[data-slot="agent-inbox-item"]',
    );
    expect(quietRoot?.getAttribute("data-variant")).toBe("quiet");
    expect(quietRoot?.getAttribute("role")).toBeNull();
    expect(quietRoot?.className).toContain("bg-transparent");
    expect(quietRoot?.className).toContain("border-y-[0.5px]");
    expect(quietRoot?.className).not.toContain("rounded-2xl");
    expect(quietRoot?.style.boxShadow).toBe("");
    expect(quietItem?.getAttribute("data-variant")).toBe("quiet");
    expect(quietItem?.getAttribute("role")).toBeNull();
    expect(quietItem?.className).toContain("min-h-12");
    expect(quietItem?.textContent).toContain("异常分布");
    expect(quietItem?.textContent).toContain("Parking Ops");
    expect(quietItem?.textContent).toContain("board-fixture-001");
    expect(quietItem?.textContent).toContain("01");
    const explicitCard = Array.from(
      quiet.container.querySelectorAll<HTMLElement>(
        '[data-slot="agent-inbox-item"]',
      ),
    ).find((item) => item.textContent?.includes("Explicit card override"));
    expect(explicitCard?.getAttribute("data-variant")).toBe("card");
    expect(explicitCard?.getAttribute("role")).toBeNull();
  });
});
