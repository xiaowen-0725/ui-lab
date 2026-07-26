import { describe, expect, test } from "bun:test";
import { formatElapsed } from "@/components/motion/recording-card";

describe("formatElapsed", () => {
  test("pads seconds so the timer never changes width mid-recording", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(5)).toBe("0:05");
    expect(formatElapsed(9)).toBe("0:09");
  });

  test("rolls over at the minute rather than showing 0:60", () => {
    expect(formatElapsed(59)).toBe("0:59");
    expect(formatElapsed(60)).toBe("1:00");
    expect(formatElapsed(61)).toBe("1:01");
  });

  test("keeps counting past ten minutes without dropping a digit", () => {
    expect(formatElapsed(605)).toBe("10:05");
    expect(formatElapsed(3600)).toBe("60:00");
  });

  test("floors fractional seconds instead of rendering decimals", () => {
    expect(formatElapsed(7.9)).toBe("0:07");
    expect(formatElapsed(119.6)).toBe("1:59");
  });
});
