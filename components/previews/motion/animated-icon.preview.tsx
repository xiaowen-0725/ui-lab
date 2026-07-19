"use client";

import { Bell, Plus, Settings } from "lucide-react";
import {
  AnimatedIcon,
  type AnimatedIconVariant,
} from "@/components/motion/animated-icon";

const SAMPLES: { variant: AnimatedIconVariant; label: string; icon?: typeof Bell }[] = [
  { variant: "draw", label: "Draw" },
  { variant: "wiggle", label: "Wiggle", icon: Bell },
  { variant: "spin", label: "Spin", icon: Settings },
  { variant: "pop", label: "Pop", icon: Plus },
];

export function AnimatedIconPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 p-8 text-foreground">
      {SAMPLES.map(({ variant, label, icon }) => (
        <div key={variant} className="flex flex-col items-center gap-3">
          <AnimatedIcon variant={variant} icon={icon} size={32} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
