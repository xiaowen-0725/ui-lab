"use client";

// Live sample for Vercel AI Elements Confirmation (Apache-2.0).

import { Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
  type ConfirmationState,
} from "@/components/agents/confirmation";

export function ConfirmationPreview() {
  const [state, setState] = useState<ConfirmationState>("approval-requested");
  const [approved, setApproved] = useState<boolean | undefined>(undefined);

  return (
    <div className="relative h-[200px] w-full max-w-lg">
      <Confirmation
        state={state}
        approval={
          approved === undefined
            ? { id: "run-tests" }
            : { id: "run-tests", approved }
        }
      >
        <ConfirmationRequest>
          <ConfirmationTitle>
            Allow the agent to run <code>bun test ./tests</code>?
          </ConfirmationTitle>
          <ConfirmationActions>
            <ConfirmationAction
              variant="outline"
              onClick={() => {
                setApproved(false);
                setState("approval-responded");
              }}
            >
              Deny
            </ConfirmationAction>
            <ConfirmationAction
              onClick={() => {
                setApproved(true);
                setState("approval-responded");
              }}
            >
              Allow once
            </ConfirmationAction>
          </ConfirmationActions>
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <ConfirmationTitle className="inline-flex items-center gap-2 text-emerald-600">
            <Check className="size-4" />
            Allowed. The test run may continue.
          </ConfirmationTitle>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <ConfirmationTitle className="inline-flex items-center gap-2 text-destructive">
            <X className="size-4" />
            Denied. The agent will skip the command.
          </ConfirmationTitle>
        </ConfirmationRejected>
      </Confirmation>
      <button
        type="button"
        onClick={() => {
          setApproved(undefined);
          setState("approval-requested");
        }}
        className="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="size-3" />
        Reset
      </button>
    </div>
  );
}
