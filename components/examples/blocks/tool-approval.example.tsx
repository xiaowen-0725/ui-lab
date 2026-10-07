"use client";

import { useState } from "react";
import { ToolApproval, type ToolApprovalStatus } from "@/components/agents/tool-approval";

export function ToolApprovalExample() {
  const [status, setStatus] = useState<ToolApprovalStatus>("pending");
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState("请选择允许或拒绝；本示例不会执行工具。");
  return (
    <section className="w-full max-w-lg space-y-3">
      <ToolApproval
        tool="read_demo_notes" title="允许读取演示笔记吗？"
        description="授权状态仅保存在本页面，不读取真实文件。"
        parameters={[{ id: "file", label: "演示文件", value: "会议笔记.md" }, { id: "mode", label: "操作范围", value: "只读" }]}
        status={status} open={open} onOpenChange={setOpen}
        onApprove={() => { setStatus("approved"); setResult("已记录本次允许（本地演示，未执行工具）。"); }}
        onAlwaysAllow={() => { setStatus("approved"); setResult("已记录始终允许的演示选择；刷新页面即重置，未持久化权限。"); }}
        onDeny={() => { setStatus("denied"); setResult("已拒绝本次演示请求。"); }}
      />
      <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setStatus("pending"); setOpen(true); setResult("已重置演示授权请求。"); }}>重置请求</button>
      <p role="status" className="text-sm text-muted-foreground">{result} 参数详情已{open ? "展开" : "收起"}。</p>
    </section>
  );
}
