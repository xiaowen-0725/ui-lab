import { describe, expect, test } from "bun:test";
import { buildCatalog } from "@/lib/catalog";
import { allComponents } from "@/lib/registry";

const catalog = await buildCatalog();
const components = catalog.filter((item) => item.kind === "component");

describe("catalog component items", () => {
  test("carries every registry Chinese name through to agents", () => {
    // Regression: buildIndex() only exposes English fields, so the catalog used
    // to fall back to the English name for nameZh on all 74 components. Chinese
    // search found nothing for components while atoms and styles matched fine.
    const withChineseName = allComponents().filter((entry) => entry.nameZh);
    expect(withChineseName.length).toBeGreaterThan(0);

    for (const entry of withChineseName) {
      const item = components.find((candidate) => candidate.slug === entry.slug);
      expect(item?.nameZh).toBe(entry.nameZh);
      expect(item?.nameZh).not.toBe(item?.name);
    }
  });

  test("carries Chinese descriptions through as well", () => {
    for (const entry of allComponents().filter((e) => e.descriptionZh)) {
      const item = components.find((candidate) => candidate.slug === entry.slug);
      expect(item?.descriptionZh).toBe(entry.descriptionZh);
    }
  });

  test("surfaces registry keywords as catalog aliases", () => {
    for (const entry of allComponents().filter((e) => e.keywords?.length)) {
      const item = components.find((candidate) => candidate.slug === entry.slug);
      expect(item?.aliases).toEqual(entry.keywords ?? []);
    }
  });

  test("keeps a Chinese query reaching the component it names", () => {
    // The substring match the CLI and site search both rely on.
    const hit = (query: string) =>
      components.filter(
        (item) => item.nameZh.includes(query) || item.descriptionZh.includes(query),
      );

    expect(hit("网点").map((item) => item.slug)).toContain("halftone-image");
    expect(hit("录屏").map((item) => item.slug)).toContain("recording-card");
    expect(hit("倾斜").map((item) => item.slug)).toContain("tilt-card");
    expect(hit("文件树").map((item) => item.slug)).toContain("file-tree");
    expect(hit("可展开控件").map((item) => item.slug)).toContain(
      "expandable-control",
    );
    expect(hit("变形搜索").map((item) => item.slug)).toContain("morphing-search");
    expect(hit("金属按钮").map((item) => item.slug)).toContain("button");
  });

  test("registers the four newly ported beUI MIT components", () => {
    const bySlug = new Map(components.map((item) => [item.slug, item]));
    const fileTree = bySlug.get("file-tree");
    const expandable = bySlug.get("expandable-control");
    const morphingSearch = bySlug.get("morphing-search");
    const button = bySlug.get("button");
    const registryButton = allComponents().find((entry) => entry.slug === "button");

    expect(fileTree).toMatchObject({
      category: "motion",
      name: "File Tree",
      nameZh: "文件树",
    });
    expect(expandable).toMatchObject({
      category: "motion",
      name: "Expandable Control",
      nameZh: "可展开控件",
    });
    expect(morphingSearch).toMatchObject({
      category: "blocks",
      name: "Morphing Search",
      nameZh: "变形搜索",
    });
    expect(button?.nameZh).toBe("按钮");
    expect(
      registryButton?.examples?.some(
        (example) => example.installSlug === "button-metallic",
      ),
    ).toBe(true);
    expect(bySlug.has("button-metallic")).toBe(false);
  });
});
