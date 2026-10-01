import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { MOTION_GROUPS, MOTIONS } from "@/lib/motions";
import { findComponent } from "@/lib/registry";

const previewIndex = readFileSync("components/previews/index.tsx", "utf8");
const sampleSource = readFileSync("components/app/catalog/motion-samples.tsx", "utf8");

describe("motion dictionary", () => {
  test("every entry is a unique word in a known group", () => {
    const slugs = MOTIONS.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const entry of MOTIONS) {
      expect(MOTION_GROUPS).toContain(entry.group);
      expect(entry.sentence.length).toBeGreaterThan(0);
      expect(entry.sentenceZh.length).toBeGreaterThan(0);
      expect(entry.prompt.length).toBeGreaterThan(0);
      expect(entry.promptZh.length).toBeGreaterThan(0);
      const faceKey = entry.slug.includes("-") ? `"${entry.slug}":` : `${entry.slug}:`;
      expect(sampleSource, entry.slug).toContain(faceKey);
    }
  });

  test("an install points at a component we already ship", () => {
    for (const entry of MOTIONS) {
      const component = entry.component;
      if (!component) continue;
      const shipped = findComponent(component.category, component.slug);
      expect(shipped, entry.slug).toBeDefined();
      if (!shipped) continue;
      const installable = shipped.examples?.length
        ? shipped.examples.some((example) => example.installSlug === component.installSlug)
        : shipped.slug === component.installSlug;
      expect(installable, `${entry.slug} -> ${component.installSlug}`).toBe(true);
      if (component.previewKey) {
        expect(previewIndex).toContain(`"${component.previewKey}"`);
      }
    }
  });

  test("a related link points at a real component", () => {
    for (const entry of MOTIONS) {
      if (!entry.related) continue;
      expect(findComponent(entry.related.category, entry.related.slug), entry.slug).toBeDefined();
    }
  });
});
