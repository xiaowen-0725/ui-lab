"use client";

import { useState } from "react";
import { ReasoningText } from "@/components/agents/loading-states/reasoning-text";

const phrases = ["梳理问题", "整理阅读线索", "组织回答思路"];

export function ReasoningTextExample() {
  const [working, setWorking] = useState(true);

  return (
    <section className="space-y-4 rounded-xl border border-border bg-background p-4 text-foreground">
      <h2 className="font-semibold">整理阅读问题</h2>
      <p className="text-sm text-muted-foreground">
        本地状态演示，未连接模型或推理服务。
      </p>
      {working ? (
        <ReasoningText phrases={phrases} variant="swap" interval={1800} />
      ) : (
        <p role="status">演示结果：先明确问题，再寻找支持结论的阅读线索。</p>
      )}
      <div>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2"
          onClick={() => setWorking((value) => !value)}
        >
          {working ? "完成演示" : "重新演示"}
        </button>
      </div>
    </section>
  );
}
