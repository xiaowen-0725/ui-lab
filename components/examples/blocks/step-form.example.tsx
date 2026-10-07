"use client";

import { useState } from "react";
import { StepForm, type StepFormStep } from "@/components/motion/step-form";

const steps: StepFormStep[] = [
  // Keep choice before the final text step so its value is committed before completion.
  { id: "goal", kind: "choice", title: "这次练习的重点是什么？", hint: "选择一个重点，然后填写练习名称。", required: true, options: [
    { value: "布局", label: "布局", description: "练习留白和内容层级" },
    { value: "交互", label: "交互", description: "练习操作反馈和状态变化" },
  ] },
  { id: "name", kind: "text", title: "给练习起个名字", eyebrow: "练习信息", hint: "请输入至少两个字符，再点击完成保存本地结果。", placeholder: "例如：卡片布局练习", required: true, validate: (value) => value.trim().length >= 2 ? null : "名称至少需要两个字符" },
];

export function StepFormExample() {
  const [run, setRun] = useState(0);
  const [values, setValues] = useState<Record<string, string> | null>(null);

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <StepForm key={run} steps={steps} onComplete={(next) => setValues(next)} successTitle="本地练习信息已保存" successMessage="下方可以查看填写结果。" onRestart={() => { setValues(null); setRun((value) => value + 1); }} />
      <p role="status" className="text-sm text-muted-foreground">{values ? `练习：${values.name}；重点：${values.goal}` : "填写结果仅保留在当前示例中"}</p>
    </section>
  );
}
