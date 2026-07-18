"use client";

import { useEffect, useState } from "react";
import { TextScramble } from "@/components/motion/text-scramble";

const PHRASES = ["motion, anything", "ship, tasteful"];

export function TextScramblePreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <TextScramble
        text="Hover to decode"
        trigger="hover"
        duration={500}
        className="text-sm font-medium"
      />
      <TextScramble text={PHRASES[index]} className="text-3xl font-semibold" />
    </div>
  );
}
