"use client";

import { useState } from "react";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
  type ConfirmationApproval,
} from "@/components/agents/confirmation";

export function ConfirmationExample() {
  const [approved, setApproved] = useState<boolean | null>(null);
  const approval: ConfirmationApproval = approved === null ? { id: "reading-plan" } : { id: "reading-plan", approved };
  return (
    <section className="max-w-xl space-y-4">
      <h2 className="font-medium">计划操作确认</h2>
      <Confirmation approval={approval} state={approved === null ? "approval-requested" : "approval-responded"}>
        <ConfirmationRequest><ConfirmationTitle>是否将三篇文章加入本地阅读计划？</ConfirmationTitle></ConfirmationRequest>
        <ConfirmationAccepted><ConfirmationTitle>已在本地记录同意，无后端操作。</ConfirmationTitle></ConfirmationAccepted>
        <ConfirmationRejected><ConfirmationTitle>已在本地记录拒绝，演示计划未更新。</ConfirmationTitle></ConfirmationRejected>
        <ConfirmationActions>
          <ConfirmationAction variant="outline" onClick={() => setApproved(false)}>拒绝</ConfirmationAction>
          <ConfirmationAction onClick={() => setApproved(true)}>同意</ConfirmationAction>
        </ConfirmationActions>
      </Confirmation>
      {approved !== null && <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setApproved(null)}>重新请求确认</button>}
    </section>
  );
}
