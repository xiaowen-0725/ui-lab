"use client";

import { useState } from "react";
import { StepForm, type StepFormStep } from "@/components/motion/step-form";

const DEMO_STEPS: StepFormStep[] = [
  {
    id: "name",
    kind: "text",
    eyebrow: "INTRO",
    title: "What should we call you?",
    hint: "A first name is fine.",
    placeholder: "Your name",
    required: true,
  },
  {
    id: "team-size",
    kind: "choice",
    eyebrow: "TEAM",
    title: "How big is the crew?",
    options: [
      { value: "solo", label: "Solo", description: "Just me for now" },
      { value: "small", label: "Small team", description: "2–10 people" },
      { value: "scaling", label: "Scaling up", description: "More than 10" },
    ],
  },
  {
    id: "focus",
    kind: "choice",
    eyebrow: "FOCUS",
    title: "What are you building first?",
    options: [
      { value: "landing", label: "Landing page" },
      { value: "dashboard", label: "Product dashboard" },
      { value: "mobile", label: "Mobile app" },
    ],
  },
  {
    id: "email",
    kind: "text",
    eyebrow: "CONTACT",
    title: "Where should updates go?",
    inputType: "email",
    placeholder: "you@example.com",
    validate: (value) => (value.includes("@") ? null : "Enter a valid email."),
  },
];

export function StepFormPreview() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex w-full justify-center rounded-2xl bg-[#eef1f5] p-6 sm:p-10">
      <StepForm
        key={key}
        steps={DEMO_STEPS}
        successMessage="We'll email you when your workspace is ready."
        onComplete={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }}
        onRestart={() => setKey((k) => k + 1)}
      />
    </div>
  );
}
