// This barrel remains browser-safe. Server callers import
// `@/lib/assembly-order/service` explicitly.
export {
  createAssemblyOrderSelection,
  decodeOrderShare,
  diffAssemblyOrders,
  encodeOrderShare,
  MAX_ORDER_SHARE_ENCODED_LENGTH,
  serializeAssemblyOrder,
  updateAssemblyOrderSelection,
} from "./client";
export type {
  AssemblyOrderActionRequest,
  AssemblyOrderApiResult,
  AssemblyOrderErrorCode,
  AssemblyOrderErrorResult,
  AssemblyOrderPlatformChrome,
  AssemblyOrderSelection,
  ConfirmAssemblyOrderRequest,
  ImportAssemblyOrderRequest,
  ResolveAssemblyOrderRequest,
  ReviseAssemblyOrderRequest,
  SemanticOrderChange,
} from "./types";
