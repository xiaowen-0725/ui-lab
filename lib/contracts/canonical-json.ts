import { createHash } from "node:crypto";

export type JsonPrimitive = null | boolean | number | string;
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

function isPlainObject(value: object): value is Record<string, unknown> {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function stringify(value: unknown): string {
  if (value === null) return "null";
  switch (typeof value) {
    case "boolean":
      return value ? "true" : "false";
    case "string":
      return JSON.stringify(value);
    case "number":
      if (!Number.isFinite(value)) throw new TypeError("Canonical JSON requires finite numbers.");
      return JSON.stringify(value);
    case "undefined":
    case "function":
    case "symbol":
    case "bigint":
      throw new TypeError(`Canonical JSON does not support ${typeof value}.`);
    case "object":
      if (Array.isArray(value)) return `[${value.map(stringify).join(",")}]`;
      if (!isPlainObject(value)) throw new TypeError("Canonical JSON requires plain objects.");
      return `{${Object.keys(value)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stringify(value[key])}`)
        .join(",")}}`;
    default:
      throw new TypeError("Canonical JSON received an unsupported value.");
  }
}

export function canonicalStringify(value: unknown): string {
  return stringify(value);
}

export function canonicalSha256(value: unknown): string {
  return createHash("sha256").update(canonicalStringify(value)).digest("hex");
}
