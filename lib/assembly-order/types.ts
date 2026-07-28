import type { JsonObject } from "@/lib/contracts/canonical-json";
import type {
  OrderManifest,
  OrderAcceptanceCapture,
} from "@/lib/order-manifest";
import type { ApplicationProfile } from "@/lib/recipes";

export type AssemblyOrderPlatformChrome = "native" | "web";

export type AssemblyOrderSelection = {
  presetSlug: string;
  recipeSlug: string;
  profile: ApplicationProfile;
  capabilitySlugs: string[];
  safeOverrides: JsonObject;
  productId: string;
  locales: string[];
  platformChrome: AssemblyOrderPlatformChrome;
};

export type ResolveAssemblyOrderRequest = AssemblyOrderSelection & {
  action: "resolve";
  orderId?: string;
  createdAt?: string;
};

export type ImportAssemblyOrderRequest = {
  action: "import";
  manifest: unknown;
};

export type ConfirmAssemblyOrderRequest = {
  action: "confirm";
  draft: unknown;
  captures: OrderAcceptanceCapture[];
  review: {
    explicitlyConfirmed: true;
    reviewedCaseIds: string[];
  };
  reviewerId?: string;
  confirmedAt?: string;
};

export type ReviseAssemblyOrderRequest = {
  action: "revise";
  parent: unknown;
  nextSelection: AssemblyOrderSelection;
  reason: string;
  createdAt?: string;
};

export type AssemblyOrderActionRequest =
  | ResolveAssemblyOrderRequest
  | ImportAssemblyOrderRequest
  | ConfirmAssemblyOrderRequest
  | ReviseAssemblyOrderRequest;

export type AssemblyOrderActionResult = {
  ok: true;
  order: Readonly<OrderManifest>;
};

export type AssemblyOrderErrorCode =
  | "INVALID_REQUEST"
  | "ORDER_POLICY_MISMATCH"
  | "REFERENCE_EVIDENCE_UNAVAILABLE"
  | "REFERENCE_EVIDENCE_MISMATCH";

export type AssemblyOrderErrorResult = {
  ok: false;
  error: {
    code: AssemblyOrderErrorCode;
    message: string;
  };
};

export type AssemblyOrderApiResult =
  | AssemblyOrderActionResult
  | AssemblyOrderErrorResult;

export type SemanticOrderChange = {
  path: string;
  before: unknown;
  after: unknown;
};
