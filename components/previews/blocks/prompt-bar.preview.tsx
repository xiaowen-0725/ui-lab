"use client";

import { PromptBar } from "@/components/motion/prompt-bar";

const SKILLS = [
  { id: "summarize", label: "/summarize", hint: "Condense the thread into key points" },
  { id: "translate", label: "/translate", hint: "Translate the reply to another language" },
  { id: "review", label: "/review", hint: "Review the latest diff" },
];

const MODELS = [
  { id: "gpt-5-6", label: "GPT 5.6" },
  { id: "sonnet-5", label: "Sonnet 5" },
  { id: "o5-mini", label: "o5-mini" },
];

export function PromptBarPreview() {
  return (
    <div className="flex w-full justify-center rounded-2xl bg-[#eef1f5] p-6 sm:p-10">
      <div className="w-full max-w-xl">
        <PromptBar credits={490} skills={SKILLS} models={MODELS} onSubmit={() => {}} />
      </div>
    </div>
  );
}
