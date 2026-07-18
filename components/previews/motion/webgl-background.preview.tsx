"use client";

import {
  WebGLBackground,
  type WebGLBackgroundProps,
} from "@/components/motion/webgl-background";

const CARDS: { id: string; label: string; props: WebGLBackgroundProps }[] = [
  {
    id: "aurora",
    label: "Aurora",
    props: {
      variant: "aurora",
      colorStops: ["#5227ff", "#7cff67", "#5227ff"],
      amplitude: 1,
      blend: 0.5,
    },
  },
  {
    id: "silk",
    label: "Silk",
    props: {
      variant: "silk",
      color: "#7b7482",
      speed: 0.5,
      scale: 1,
      noiseIntensity: 1.5,
    },
  },
  {
    id: "plasma",
    label: "Plasma",
    props: {
      variant: "plasma",
      color: "#8c7dff",
      speed: 1,
      scale: 1,
      opacity: 1,
    },
  },
  {
    id: "light-rays",
    label: "Light Rays",
    props: {
      variant: "light-rays",
      color: "#ffffff",
      speed: 1,
      spread: 1,
    },
  },
  {
    id: "pixel-blast",
    label: "Pixel Blast",
    props: {
      variant: "pixel-blast",
      color: "#b497cf",
      pixelSize: 3,
      rippleIntensity: 1,
    },
  },
  {
    id: "dither",
    label: "Dither",
    props: {
      variant: "dither",
      color: "#808080",
      speed: 0.05,
      pixelSize: 2,
    },
  },
];

export function WebGLBackgroundPreview() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 p-6 sm:grid-cols-3">
      {CARDS.map((card) => (
        <div
          key={card.id}
          className="relative flex h-56 w-full flex-col justify-end overflow-hidden rounded-2xl border border-border"
        >
          <WebGLBackground {...card.props} className="absolute inset-0" />
          <span className="relative z-10 m-3 w-fit rounded-full bg-black/40 px-3 py-1 text-xs uppercase tracking-wide text-white backdrop-blur-sm">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  );
}
