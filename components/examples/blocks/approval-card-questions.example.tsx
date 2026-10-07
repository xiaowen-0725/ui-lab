"use client";

import { useState } from "react";
import {
  ApprovalCard,
  type ApprovalCardAnswers,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/agents/approval-card/index";

const questions: ApprovalCardQuestion[] = [
  {
    id: "format",
    title: "你希望怎样阅读？",
    autoAdvance: false,
    options: [
      { value: "paper", label: "纸质书" },
      { value: "digital", label: "电子书" },
    ],
  },
  {
    id: "topics",
    title: "选择感兴趣的主题",
    multiple: true,
    options: [
      { value: "design", label: "设计" },
      { value: "science", label: "科学" },
      { value: "literature", label: "文学" },
    ],
    allowCustom: true,
    customPlaceholder: "也可以补充其他主题",
  },
];

export function ApprovalCardQuestionsExample() {
  const [answers, setAnswers] = useState<ApprovalCardAnswers>({});
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<ApprovalCardStatus>("pending");
  const [submitted, setSubmitted] = useState<ApprovalCardAnswers | null>(null);

  return (
    <section className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground">
        填写阅读偏好，答案仅保留在当前示例中。
      </p>
      <ApprovalCard
        questions={questions}
        answers={answers}
        onAnswersChange={setAnswers}
        step={step}
        onStepChange={setStep}
        status={status}
        submitLabel="保存偏好"
        onSubmit={(next) => {
          setSubmitted(next);
          setStatus("answered");
        }}
        result="阅读偏好已保存到本地演示状态。"
      />
      {submitted ? (
        <div role="status" className="rounded-lg bg-muted p-4">
          {questions.map((question) => {
            const answer = submitted[question.id];
            const labels =
              answer?.selected.map(
                (value) =>
                  question.options?.find((option) => option.value === value)
                    ?.label ?? value,
              ) ?? [];
            return (
              <p key={question.id}>
                {question.title}：
                {[...labels, answer?.custom].filter(Boolean).join("、")}
              </p>
            );
          })}
        </div>
      ) : null}
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          setAnswers({});
          setStep(0);
          setStatus("pending");
          setSubmitted(null);
        }}
      >
        重新填写
      </button>
    </section>
  );
}
