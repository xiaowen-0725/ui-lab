import { describe, expect, test } from "bun:test";
import { coverFit, dotRadius, screenLattice } from "@/components/motion/halftone-image";

describe("coverFit", () => {
  test("fills the box on the constrained axis and centres the overflow", () => {
    // A wide bitmap in a square box: height constrains, width overflows equally.
    const { scale, dx, dy } = coverFit(200, 100, 100, 100);

    expect(scale).toBe(1);
    expect(dy).toBe(0);
    expect(dx).toBe(-50);
  });

  test("never letterboxes — the scaled bitmap covers both axes", () => {
    for (const [iw, ih] of [
      [300, 100],
      [100, 300],
      [640, 480],
      [37, 991],
    ]) {
      const { scale } = coverFit(iw, ih, 256, 144);
      expect(iw * scale).toBeGreaterThanOrEqual(256 - 1e-9);
      expect(ih * scale).toBeGreaterThanOrEqual(144 - 1e-9);
    }
  });
});

describe("dotRadius", () => {
  test("makes dot area — not radius — proportional to tone", () => {
    const cell = 10;
    const full = dotRadius(1, cell, 1);
    const quarter = dotRadius(0.25, cell, 1);

    // A quarter tone must cover a quarter of the ink, so half the radius.
    expect(quarter).toBeCloseTo(full / 2, 10);
    expect(Math.PI * quarter ** 2).toBeCloseTo((Math.PI * full ** 2) / 4, 10);
  });

  test("a full tone at dotScale 1 exactly spans the cell", () => {
    expect(dotRadius(1, 8, 1)).toBe(4);
  });

  test("clamps tones outside 0..1 instead of producing NaN", () => {
    expect(dotRadius(-0.5, 10, 1)).toBe(0);
    expect(dotRadius(2, 10, 1)).toBe(5);
    expect(Number.isNaN(dotRadius(-1, 10, 1))).toBe(false);
  });
});

describe("screenLattice", () => {
  test("leaves no bare corner when the screen is rotated", () => {
    const w = 80;
    const h = 50;
    const cell = 5;
    const points = [...screenLattice(w, h, cell, 45)];

    // Every corner needs a lattice point within one cell of it, or the rotated
    // grid has failed to cover the box.
    for (const [cx, cy] of [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ]) {
      const nearest = Math.min(
        ...points.map((p) => Math.hypot(p.x - cx, p.y - cy)),
      );
      expect(nearest).toBeLessThanOrEqual(cell);
    }
  });

  test("keeps the grid pitch under rotation", () => {
    const points = [...screenLattice(60, 60, 6, 30)];
    const nearestNeighbour = (i: number) =>
      Math.min(
        ...points
          .map((p, j) =>
            j === i ? Infinity : Math.hypot(p.x - points[i].x, p.y - points[i].y),
          )
          .filter((d) => d > 0),
      );

    // A rotation is rigid, so spacing must survive it.
    expect(nearestNeighbour(0)).toBeCloseTo(6, 6);
    expect(nearestNeighbour(points.length - 1)).toBeCloseTo(6, 6);
  });

  test("an unrotated screen lands on an axis-aligned grid", () => {
    const points = [...screenLattice(20, 20, 5, 0)];
    const xs = new Set(points.map((p) => Math.round(p.x * 1e6) / 1e6));

    for (const x of xs) expect((x - 10) % 5).toBeCloseTo(0, 6);
  });

  test("stays bounded — no runaway lattice for a thin box", () => {
    const points = [...screenLattice(400, 4, 4, 45)];

    expect(points.length).toBeGreaterThan(0);
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(-4);
      expect(p.x).toBeLessThanOrEqual(404);
      expect(p.y).toBeGreaterThanOrEqual(-4);
      expect(p.y).toBeLessThanOrEqual(8);
    }
  });
});
