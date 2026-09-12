import { describe, expect, test } from "bun:test";
import {
  canContain,
  findResource,
  flattenResources,
  moveResource,
  renameResource,
} from "@/components/agents/ai-sidebar/tree-utils";
import type { SidebarResource } from "@/components/agents/ai-sidebar/types";

const TREE: SidebarResource[] = [
  { id: "alpha", label: "Alpha", kind: "file" },
  {
    id: "platform",
    label: "Platform",
    kind: "project",
    children: [
      { id: "api", label: "API", kind: "file" },
      { id: "docs", label: "Docs", kind: "bookmark" },
    ],
  },
  { id: "notes", label: "Notes", kind: "file" },
];

describe("ai-sidebar tree-utils", () => {
  test("moveResource reorders siblings and reparents into a folder", () => {
    const before = moveResource(TREE, {
      itemId: "notes",
      targetId: "alpha",
      position: "before",
    });
    expect(before?.map((item) => item.id)).toEqual([
      "notes",
      "alpha",
      "platform",
    ]);

    const after = moveResource(TREE, {
      itemId: "alpha",
      targetId: "notes",
      position: "after",
    });
    expect(after?.map((item) => item.id)).toEqual([
      "platform",
      "notes",
      "alpha",
    ]);

    const inside = moveResource(TREE, {
      itemId: "notes",
      targetId: "platform",
      position: "inside",
    });
    expect(inside?.find((item) => item.id === "platform")?.children?.map((item) => item.id)).toEqual([
      "api",
      "docs",
      "notes",
    ]);
    expect(inside?.some((item) => item.id === "notes")).toBe(false);
  });

  test("moveResource rejects disabled items, cycles, and non-containers", () => {
    const withDisabled: SidebarResource[] = [
      { id: "locked", label: "Locked", kind: "file", disabled: true },
      { id: "page", label: "Page", kind: "file" },
      {
        id: "folder",
        label: "Folder",
        kind: "folder",
        children: [{ id: "child", label: "Child", kind: "file" }],
      },
    ];

    expect(
      moveResource(withDisabled, {
        itemId: "locked",
        targetId: "page",
        position: "after",
      }),
    ).toBeNull();

    expect(
      moveResource(TREE, {
        itemId: "platform",
        targetId: "api",
        position: "after",
      }),
    ).toBeNull();

    expect(
      moveResource(TREE, {
        itemId: "alpha",
        targetId: "notes",
        position: "inside",
      }),
    ).toBeNull();
  });

  test("renameResource updates a nested label and flatten respects expand state", () => {
    const renamed = renameResource(TREE, "api", "API migration");
    expect(findResource(renamed, "api")?.label).toBe("API migration");
    expect(findResource(renamed, "docs")?.label).toBe("Docs");

    const collapsed = flattenResources(TREE, new Set());
    expect(collapsed.map((row) => row.item.id)).toEqual([
      "alpha",
      "platform",
      "notes",
    ]);

    const expanded = flattenResources(TREE, new Set(["platform"]));
    expect(expanded.map((row) => ({ id: row.item.id, parentId: row.parentId }))).toEqual([
      { id: "alpha", parentId: null },
      { id: "platform", parentId: null },
      { id: "api", parentId: "platform" },
      { id: "docs", parentId: "platform" },
      { id: "notes", parentId: null },
    ]);

    expect(canContain({ id: "folder", label: "Folder", kind: "folder" })).toBe(
      true,
    );
    expect(canContain({ id: "file", label: "File", kind: "file" })).toBe(false);
  });
});
