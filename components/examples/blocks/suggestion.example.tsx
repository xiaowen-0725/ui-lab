"use client";

import { useId, useState } from "react";
import { Suggestion, Suggestions } from "@/components/agents/suggestion";

const suggestions = ["总结这段内容", "列出下一步行动", "改写为简短说明"];

export function SuggestionExample() {
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState("点击建议可填入草稿。");
  return (
    <section className="w-full max-w-xl space-y-3">
      <Suggestions>
        {suggestions.map((suggestion) => <Suggestion key={suggestion} suggestion={suggestion} onClick={(text) => { setDraft(text); setResult(`已采用建议：${text}`); }} />)}
      </Suggestions>
      <label htmlFor={inputId} className="block text-sm font-medium">提示草稿</label>
      <textarea id={inputId} value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} className="w-full rounded-xl border border-border bg-background p-3 text-sm" placeholder="选择建议或自行输入…" />
      <p role="status" className="text-sm text-muted-foreground">{result}</p>
    </section>
  );
}
