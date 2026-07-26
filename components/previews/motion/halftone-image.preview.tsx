"use client";

import { useEffect, useState } from "react";
import { HalftoneImage } from "@/components/motion/halftone-image";

/**
 * The lab ships no photographs, so the demo plates are drawn here: a lit sphere
 * over a horizon. Smooth tonal ramps are exactly what a halftone screen is for,
 * so a synthetic subject shows the dots off as well as a photo would — and it
 * works offline, with no asset in the repo.
 *
 * `mono` is the resting plate; `color` is the one hover reveals.
 */
function drawPlate(mode: "mono" | "color"): string {
  const size = 640;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const sky = ctx.createLinearGradient(0, 0, 0, size);
  if (mode === "color") {
    sky.addColorStop(0, "#1d2a6b");
    sky.addColorStop(0.55, "#8d3f86");
    sky.addColorStop(1, "#e2703a");
  } else {
    sky.addColorStop(0, "#0d0d0d");
    sky.addColorStop(0.55, "#6b6b6b");
    sky.addColorStop(1, "#d8d8d8");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, size, size);

  // Lit sphere: an off-centre radial makes a terminator, which screens into a
  // visible tonal ramp rather than a flat disc.
  const cx = size * 0.5;
  const cy = size * 0.46;
  const radius = size * 0.28;
  const body = ctx.createRadialGradient(
    cx - radius * 0.4,
    cy - radius * 0.45,
    radius * 0.05,
    cx,
    cy,
    radius,
  );
  if (mode === "color") {
    body.addColorStop(0, "#fff6de");
    body.addColorStop(0.45, "#f2b25c");
    body.addColorStop(1, "#3a1f4e");
  } else {
    body.addColorStop(0, "#ffffff");
    body.addColorStop(0.45, "#a8a8a8");
    body.addColorStop(1, "#141414");
  }
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  // Ground plane, darker than the sky so the horizon survives screening.
  const ground = ctx.createLinearGradient(0, size * 0.72, 0, size);
  if (mode === "color") {
    ground.addColorStop(0, "#2b1530");
    ground.addColorStop(1, "#0b0710");
  } else {
    ground.addColorStop(0, "#2a2a2a");
    ground.addColorStop(1, "#070707");
  }
  ctx.fillStyle = ground;
  ctx.fillRect(0, size * 0.72, size, size * 0.28);

  return canvas.toDataURL("image/png");
}

const SAMPLES = [
  { cell: 4, label: "cell 4 · fine", angle: 45, shape: "circle" as const },
  { cell: 7, label: "cell 7 · 45° screen", angle: 45, shape: "circle" as const },
  { cell: 9, label: "cell 9 · square, 0°", angle: 0, shape: "square" as const },
];

export function HalftoneImagePreview() {
  const [plates, setPlates] = useState<{ mono: string; color: string } | null>(null);

  // Canvas is unavailable during SSR, so the plates are generated after mount.
  useEffect(() => {
    setPlates({ mono: drawPlate("mono"), color: drawPlate("color") });
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4 p-6">
      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {SAMPLES.map((sample) => (
          <figure key={sample.label} className="flex flex-col gap-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-950">
              {plates ? (
                <HalftoneImage
                  src={plates.mono}
                  colorSrc={plates.color}
                  alt="A lit sphere above a horizon, rendered as a halftone screen"
                  cell={sample.cell}
                  angle={sample.angle}
                  shape={sample.shape}
                  className="h-full w-full text-white"
                />
              ) : null}
            </div>
            <figcaption className="text-center font-mono text-[0.65rem] text-muted-foreground">
              {sample.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Hover any plate: the grey screen crossfades to a colour one, each dot inked
        with the tone it sits on.
      </p>
    </div>
  );
}
