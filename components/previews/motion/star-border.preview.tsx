"use client";

import { StarBorder } from "@/components/motion/star-border";

export function StarBorderPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 p-6">
      <StarBorder className="rounded-full text-white" thickness={1.5}>
        <button
          type="button"
          className="rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-white"
        >
          ✦ Get started
        </button>
      </StarBorder>

      <StarBorder className="rounded-2xl" color="var(--accent)" speed={4}>
        <div className="w-56 rounded-2xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Featured</div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">Pro plan</h3>
          <p className="mt-2 text-sm text-muted-foreground">A slow light circles the card.</p>
        </div>
      </StarBorder>
    </div>
  );
}
