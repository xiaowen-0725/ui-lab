import { createHash } from "node:crypto";
import { canonicalStringify } from "./canonical-stringify";

export { canonicalStringify } from "./canonical-stringify";

export type JsonPrimitive = null | boolean | number | string;
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

export function canonicalSha256(value: unknown): string {
  return createHash("sha256").update(canonicalStringify(value)).digest("hex");
}
