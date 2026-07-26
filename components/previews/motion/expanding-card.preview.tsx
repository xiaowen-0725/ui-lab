"use client";

import { FileCode2 } from "lucide-react";
import { ExpandingCard } from "@/components/motion/expanding-card";

function FileRow({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <FileCode2 className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate font-mono text-xs text-foreground">
        {name}
      </span>
    </div>
  );
}

export function ExpandingCardPreview() {
  return (
    <div className="flex w-full justify-center rounded-2xl bg-[#eef1f5] p-6 sm:p-10">
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <ExpandingCard
          title="Design tokens"
          summary="Radius, shadow and type scales, ready to paste."
        >
          <div className="flex flex-col gap-2">
            <FileRow name="tokens.css" />
            <FileRow name="radius.md" />
            <FileRow name="shadows.md" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Drop the file straight into your project — every value already
            matches the components on this page.
          </p>
        </ExpandingCard>

        <ExpandingCard
          title="Motion recipes"
          summary="Spring presets tuned for product UI."
        >
          <div className="flex flex-col gap-2">
            <FileRow name="springs.ts" />
            <FileRow name="easing.md" />
            <FileRow name="guidelines.md" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            The same curves driving this card power every other motion
            component in the library.
          </p>
        </ExpandingCard>
      </div>
    </div>
  );
}
