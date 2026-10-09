import { expect, test } from "bun:test";
import { isSpaceActive, NAV_SPACES } from "@/lib/nav";

test("semantic navigation follows historical detail paths without double activation", () => {
  for (const [pathname, space] of [
    ["/components/blocks/voice-orb", "components"],
    ["/components/blocks/login-card", "blocks"],
    ["/components/blocks/not-found", "pages"],
    ["/components/blocks/agent-workbench", "sites"],
    ["/components/sections", "blocks"],
    ["/components/pages", "pages"],
    ["/components/sites", "sites"],
    ["/sites/agent-workbench-site", "sites"],
    ["/scroll", "dictionary"],
  ] as const) {
    expect(NAV_SPACES.filter((item) => isSpaceActive(item, pathname)).map((item) => item.key), pathname).toEqual([space]);
  }
});
