import { describe, expect, test } from "bun:test";
import { CONCEPTS, conceptHaystack, findConcept } from "@/lib/concepts";
import { findComponent } from "@/lib/registry";

describe("concept dictionary", () => {
  test("slugs are unique", () => {
    const slugs = CONCEPTS.map((entry) => entry.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("confusable pairs exist and point both ways", () => {
    for (const entry of CONCEPTS) {
      for (const other of entry.confusableWith ?? []) {
        expect(other).not.toBe(entry.slug);
        const target = findConcept(other);
        expect(target, `${entry.slug} -> ${other}`).toBeDefined();
        expect(target?.confusableWith ?? [], `${other} must list ${entry.slug}`).toContain(entry.slug);
      }
    }
  });

  test("components point at shipped registry entries", () => {
    for (const entry of CONCEPTS) {
      if (entry.component) {
        expect(findComponent(entry.component.category, entry.component.slug), entry.slug).toBeDefined();
      }
      if (entry.related) {
        expect(findComponent(entry.related.category, entry.related.slug), entry.slug).toBeDefined();
      }
    }
  });

  test("merged words stay aliases, not entries", () => {
    for (const merged of ["modal", "chip", "disclosure"]) {
      expect(findConcept(merged)).toBeUndefined();
    }
    expect(findConcept("dialog")?.aliases).toContain("modal");
    expect(findConcept("tag")?.aliases).toContain("chip");
    expect(findConcept("accordion")?.aliases).toContain("disclosure");
  });

  test("colloquial queries find the formal name", () => {
    const hits = (query: string) =>
      CONCEPTS.filter((entry) => conceptHaystack(entry).includes(query.toLowerCase().replace(/[\s\-_·]+/g, ""))).map((entry) => entry.slug);
    expect(hits("三个点")).toEqual(["dropdown-menu"]);
    expect(hits("灰块")).toEqual(["skeleton"]);
    expect(hits("蒙层")).toEqual(["scrim"]);
    expect(hits("⌘K")).toContain("command");
  });
});
