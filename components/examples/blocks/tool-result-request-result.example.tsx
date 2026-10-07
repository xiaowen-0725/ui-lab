"use client";

import { useState } from "react";
import { ToolResult, ToolResultOutput } from "@/components/agents/tool-result";

const RESPONSE = JSON.stringify({
  source: "本地模拟响应",
  notes: [{ id: "reading-01", title: "阅读方法", status: "已整理" }],
}, null, 2);

export function ToolResultRequestResultExample() {
  const [open, setOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [feedback, setFeedback] = useState("预置失败响应，点击重试展示本地模拟数据。");

  return (
    <div className="w-full max-w-xl space-y-3">
      <ToolResult
        tool="请求结果"
        title="读取笔记列表"
        kind="request"
        status={loaded ? "success" : "error"}
        meta={loaded ? "200 · 本地模拟" : "503 · 本地模拟"}
        open={open}
        onOpenChange={setOpen}
        collapseOnComplete={false}
        onRetry={() => {
          setLoaded(true);
          setOpen(true);
          setFeedback("已载入预置 JSON；没有向服务器发送请求。");
        }}
      >
        <ToolResultOutput language="json">
          {loaded ? RESPONSE : '{"error":"示例服务暂不可用，请重试"}'}
        </ToolResultOutput>
      </ToolResult>
      <p role="status" className="text-sm text-muted-foreground">{feedback}</p>
    </div>
  );
}
