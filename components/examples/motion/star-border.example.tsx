"use client";

import { useState } from "react";
import { StarBorder } from "@/components/motion/star-border";

export function StarBorderExample() {
  const [selected, setSelected] = useState(false);

  return (
    <section className="space-y-4">
      <StarBorder className="text-primary" thickness={2} speed={8}>
        <button
          type="button"
          aria-pressed={selected}
          className="rounded-2xl bg-background px-6 py-3 text-foreground"
          onClick={() => setSelected((value) => !value)}
        >
          {selected ? "已加入阅读清单" : "加入阅读清单"}
        </button>
      </StarBorder>
      <p role="status" className="text-sm text-muted-foreground">
        {selected
          ? "本地阅读清单已选中这篇文章。"
          : "点击星光描边按钮，将文章加入本地阅读清单。"}
      </p>
    </section>
  );
}
