"use client";

import { GlareHover } from "@/components/motion/glare-hover";

export function GlareHoverPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 p-6">
      <GlareHover className="w-64 rounded-2xl border border-border shadow-lg">
        {/* biome-ignore lint/performance/noImgElement: plain img keeps the copy-paste preview portable (no next/image host config). */}
        <img
          src="https://picsum.photos/seed/uilab-glare-hover/480/320"
          alt=""
          className="block aspect-[3/2] w-full object-cover"
        />
      </GlareHover>

      <GlareHover className="rounded-full" angle={-25} duration={450}>
        <button
          type="button"
          className="rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-white"
        >
          Get started
        </button>
      </GlareHover>
    </div>
  );
}
