"use client";

import { ScrollHint } from "@/components/motion/scroll-hint";

export function ScrollHintPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 p-8">
      <div className="flex flex-col items-center gap-4">
        <ScrollHint variant="mouse" />
        <span className="text-xs text-muted-foreground">Mouse</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <ScrollHint variant="mouse" label="Scroll" />
        <span className="text-xs text-muted-foreground">Mouse + label</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <ScrollHint variant="chevron" />
        <span className="text-xs text-muted-foreground">Chevron</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <ScrollHint variant="chevron" label="Scroll" />
        <span className="text-xs text-muted-foreground">Chevron + label</span>
      </div>
    </div>
  );
}
