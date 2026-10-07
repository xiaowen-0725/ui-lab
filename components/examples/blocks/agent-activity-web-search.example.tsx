"use client";

import { useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity/index";

const items: AgentActivityItem[] = [{
  id: "search", type: "search", query: "前端表单的可访问性参考", results: [
    { id: "forms", title: "表单教程", domain: "w3.org", url: "https://www.w3.org/WAI/tutorials/forms/" },
    { id: "labels", title: "表单标签与说明", domain: "w3.org", url: "https://www.w3.org/WAI/tutorials/forms/labels/" },
  ],
}];

export function AgentActivityWebSearchExample() {
  const [open, setOpen] = useState(true);
  return (
    <section className="w-full max-w-lg space-y-3">
      <h2 className="font-medium">搜索结果记录 · 静态演示数据</h2>
      <AgentActivity items={items} status="complete" summary="查看 2 条参考链接" open={open} onOpenChange={setOpen} />
      <p role="status" className="text-sm text-muted-foreground">结果已{open ? "展开" : "收起"}；此示例不发起搜索请求。</p>
    </section>
  );
}
