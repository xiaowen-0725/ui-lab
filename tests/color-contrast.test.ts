import { describe, expect, test } from "bun:test";
import { contrastRatio, mixHex } from "@/lib/color";

describe("contrast + mix helpers", () => {
  test("black on white is the maximum WCAG contrast ratio", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  test("identical colors have no contrast", () => {
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
  });

  test("mixing white over black at 50% lands exactly at mid-gray", () => {
    expect(mixHex("#ffffff", "#000000", 50)).toBe("#808080");
  });
});
