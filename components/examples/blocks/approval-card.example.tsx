"use client";

import { useState } from "react";
import {
  ApprovalCard,
  type ApprovalCardStatus,
} from "@/components/agents/approval-card/index";

export function ApprovalCardExample() {
  const [status, setStatus] = useState<ApprovalCardStatus>("pending");
  const [visible, setVisible] = useState(true);
  const [result, setResult] = useState("等待你的决定。");

  return (
    <section className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground">
        本地演示：确认不会创建真实日程。
      </p>
      {visible ? (
        <ApprovalCard
          title="确认这份阅读计划？"
          description="每周三下午留出半小时，回顾本周的阅读笔记。"
          status={status}
          approveLabel="确认计划"
          onApprove={() => {
            setStatus("approved");
            setResult("已在本地确认阅读计划。");
          }}
          onReject={() => {
            setStatus("rejected");
            setResult("已在本地拒绝这份计划。");
          }}
          onDismiss={() => {
            setVisible(false);
            setResult("已关闭确认卡片。");
          }}
          result={result}
        >
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt>时间</dt>
            <dd>周三 15:00–15:30</dd>
            <dt>内容</dt>
            <dd>整理阅读笔记</dd>
          </dl>
        </ApprovalCard>
      ) : null}
      <p role="status" className="text-sm">
        {result}
      </p>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          setStatus("pending");
          setVisible(true);
          setResult("等待你的决定。");
        }}
      >
        重新确认
      </button>
    </section>
  );
}
