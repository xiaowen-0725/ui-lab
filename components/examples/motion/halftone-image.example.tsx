"use client";

import { useState } from "react";
import { HalftoneImage } from "@/components/motion/halftone-image";

// A self-contained landscape avoids remote image/CORS and site asset dependencies.
const landscape = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#94c7e6"/><stop offset="1" stop-color="#f5e8c8"/></linearGradient></defs><rect width="480" height="320" fill="url(#sky)"/><circle cx="360" cy="80" r="40" fill="#f3c258"/><path d="M0 245L140 90L290 260L385 135L480 250V320H0Z" fill="#527b78"/><path d="M0 280Q130 205 250 280T480 265V320H0Z" fill="#294955"/></svg>`)}`;

export function HalftoneImageExample() {
  const [cell, setCell] = useState(6);
  return (
    <figure className="w-full max-w-lg space-y-3">
      <HalftoneImage src={landscape} colorSrc={landscape} alt="太阳照耀山峦的网点风景图" cell={cell} invert className="h-64 w-full rounded-xl bg-background text-foreground" />
      <figcaption className="text-sm text-muted-foreground">山峦网点画；悬停查看彩色网点。</figcaption>
      <label className="flex items-center gap-3 text-sm">
        网点间距
        <input type="range" min={4} max={12} step={1} value={cell} onChange={(event) => setCell(Number(event.target.value))} />
        <output aria-live="polite">{cell} 像素</output>
      </label>
    </figure>
  );
}
