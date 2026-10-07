import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { assertSnapshotMatches } from "../scripts/gen-catalog-snapshot";

const frozen = JSON.parse(readFileSync(new URL("../cli/catalog.snapshot.json", import.meta.url), "utf8"));

test("snapshot checking ignores its timestamp but rejects changed discovery and source revisions", () => {
  expect(() => assertSnapshotMatches({ ...frozen, generatedAt: "a different date" }, frozen.items)).not.toThrow();
  const renamed = structuredClone(frozen.items);
  renamed[0].nameZh = "新的中文名称";
  expect(() => assertSnapshotMatches(frozen, renamed)).toThrow("snapshot is stale");
  const revised = structuredClone(frozen.items);
  revised[0].sourceVersion = "0".repeat(64);
  expect(() => assertSnapshotMatches(frozen, revised)).toThrow("snapshot is stale");
});

test("snapshot checking rejects malformed counts and broken installation identities", () => {
  expect(() => assertSnapshotMatches({ ...frozen, count: 1 }, frozen.items)).toThrow();
  const invalid = structuredClone(frozen);
  invalid.items[0].fetch.method = "unknown";
  expect(() => assertSnapshotMatches(invalid, frozen.items)).toThrow();
});
