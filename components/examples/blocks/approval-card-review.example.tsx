"use client";

import { useId, useState } from "react";
import {
  ApprovalCard,
  type ApprovalCardStatus,
} from "@/components/agents/approval-card/index";

export function ApprovalCardReviewExample() {
  const noteId = useId();
  const [status, setStatus] = useState<ApprovalCardStatus>("pending");
  const [note, setNote] = useState("");
  const [result, setResult] = useState("等待审阅意见。");

  function decide(next: ApprovalCardStatus, label: string) {
    setStatus(next);
    setResult(
      `${label}，仅记录在本地。${note.trim() ? `意见：${note.trim()}` : ""}`,
    );
  }

  return (
    <section className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground">
        审阅演示：操作不会发布或发送任何内容。
      </p>
      <ApprovalCard
        title="审阅读书会邀请文案"
        description="请确认时间和说明是否清楚，或填写需要修改的内容。"
        status={status}
        approveLabel="通过审阅"
        onApprove={() => decide("approved", "已通过审阅")}
        onReject={() => decide("rejected", "已拒绝文案")}
        onRequestChanges={() => decide("changes-requested", "已记录修改请求")}
        result={result}
      >
        <p className="rounded-lg bg-muted p-3">
          周六 10:00，欢迎带上最近读过的一本书，一起分享阅读心得。
        </p>
        <label htmlFor={noteId} className="mt-3 block text-sm">
          审阅意见
        </label>
        <textarea
          id={noteId}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="例如：补充活动地点"
          className="mt-1 w-full rounded-lg border border-border bg-background p-2"
        />
      </ApprovalCard>
      <p role="status" className="text-sm">
        {result}
      </p>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          setStatus("pending");
          setNote("");
          setResult("等待审阅意见。");
        }}
      >
        重新审阅
      </button>
    </section>
  );
}
