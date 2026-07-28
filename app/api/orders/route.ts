import {
  AssemblyOrderServiceError,
  processAssemblyOrderAction,
} from "@/lib/assembly-order/service";
import { loadVisualEvidence } from "@/lib/assembly-order/visual-evidence";
import type {
  AssemblyOrderApiResult,
  AssemblyOrderErrorCode,
} from "@/lib/assembly-order/types";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 1_000_000;

function errorResponse(
  code: AssemblyOrderErrorCode,
  message: string,
): Response {
  const body: AssemblyOrderApiResult = {
    ok: false,
    error: { code, message },
  };
  return Response.json(body, { status: 400 });
}

/**
 * Single stateless action endpoint. The capture provider independently reads
 * and verifies repository-owned visual acceptance evidence; client hashes are
 * never promoted to trusted evidence by this route.
 */
export async function POST(request: Request): Promise<Response> {
  let input: unknown;
  try {
    const text = await request.text();
    if (!text || new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
      return errorResponse("INVALID_REQUEST", "Invalid JSON request body.");
    }
    input = JSON.parse(text) as unknown;
  } catch {
    return errorResponse("INVALID_REQUEST", "Invalid JSON request body.");
  }

  try {
    const order = await processAssemblyOrderAction(input, {
      loadTrustedVisualEvidence: async () => {
        const evidence = await loadVisualEvidence();
        if (!evidence.available) return null;
        return evidence.trustedEvidence;
      },
    });
    const body: AssemblyOrderApiResult = { ok: true, order };
    return Response.json(body);
  } catch (error) {
    if (error instanceof AssemblyOrderServiceError) {
      return errorResponse(error.code, error.message);
    }
    return errorResponse(
      "INVALID_REQUEST",
      "Assembly Order request could not be processed.",
    );
  }
}
