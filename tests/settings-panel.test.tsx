import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";

import {
  SettingsGhostButton,
  SettingsGroup,
  SettingsRow,
  SettingsSelectButton,
  SettingsTextField,
} from "@/components/motion/settings-panel";

afterEach(cleanup);

describe("SettingsPanel token contract", () => {
  test("uses workbench semantic surfaces for the group and controls", () => {
    const { container } = render(
      <SettingsGroup title="Runtime" actions={<SettingsGhostButton>Import</SettingsGhostButton>}>
        <SettingsRow label="Name">
          <SettingsTextField value="Parking" aria-label="Name" />
        </SettingsRow>
        <SettingsRow label="Mode">
          <SettingsSelectButton aria-label="Mode">Native</SettingsSelectButton>
        </SettingsRow>
      </SettingsGroup>,
    );

    const group = container.querySelector('[data-slot="settings-group"]');
    const rows = container.querySelector('[data-slot="settings-group-rows"]');
    const textField = container.querySelector('[data-slot="settings-text-field"]');
    const select = container.querySelector('[data-slot="settings-select"]');
    const ghost = container.querySelector('[data-slot="settings-ghost"]');

    expect(group?.className).toContain("border-[var(--wb-border)]");
    expect(group?.className).toContain("bg-[var(--wb-surface-raised)]");
    expect(rows?.className).toContain("border-[var(--wb-border-subtle)]");
    expect(textField?.className).toContain("border-[var(--wb-control-hairline)]");
    expect(textField?.className).toContain("bg-[var(--wb-inset-faint)]");
    expect(select?.className).toContain("border-[var(--wb-control-hairline)]");
    expect(select?.className).toContain("bg-[var(--wb-inset-faint)]");
    expect(ghost?.className).toContain("hover:bg-[var(--wb-hover-subtle)]");

    for (const element of [group, rows, textField, select, ghost]) {
      expect(element?.className).not.toContain("dark:");
    }
  });

  test("keeps card as the default and exposes a quiet row group", () => {
    const card = render(
      <SettingsGroup title="Runtime">
        <SettingsRow label="Mode">Native</SettingsRow>
      </SettingsGroup>,
    );
    const cardGroup = card.container.querySelector(
      '[data-slot="settings-group"]',
    );
    expect(cardGroup?.getAttribute("data-variant")).toBe("card");
    expect(cardGroup?.className).toContain("rounded-[20px]");
    expect(cardGroup?.className).toContain("border-[var(--wb-border)]");
    card.unmount();

    const quiet = render(
      <SettingsGroup variant="quiet" title="Runtime">
        <SettingsRow label="Runtime">智汇云</SettingsRow>
        <SettingsRow label="State">connected</SettingsRow>
      </SettingsGroup>,
    );
    const quietGroup = quiet.container.querySelector(
      '[data-slot="settings-group"]',
    );
    expect(quietGroup?.getAttribute("data-variant")).toBe("quiet");
    expect(quietGroup?.className).toContain("bg-transparent");
    expect(quietGroup?.className).toContain("border-y-[0.5px]");
    expect(quietGroup?.className).toContain("border-x-0");
    expect(quietGroup?.className).not.toContain("rounded-[20px]");
    expect(
      quiet.container.querySelectorAll('[data-slot="settings-row"]'),
    ).toHaveLength(2);
  });
});
