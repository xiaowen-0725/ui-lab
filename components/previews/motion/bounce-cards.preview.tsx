"use client";

import { BounceCards } from "@/components/motion/bounce-cards";

const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-pink-400 to-fuchsia-600",
  "from-amber-400 to-orange-600",
  "from-sky-400 to-blue-600",
];

export function BounceCardsPreview() {
  return (
    <div className="flex min-h-96 w-full items-center justify-center">
      <BounceCards>
        {GRADIENTS.map((gradient) => (
          <div key={gradient} className={`h-full w-full bg-gradient-to-br ${gradient}`} />
        ))}
      </BounceCards>
    </div>
  );
}
