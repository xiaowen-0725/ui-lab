// Ported from motion-anything (nexu-io, Apache-2.0), "Loading Shimmer" recipe.
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  /** Sweeps a soft highlight across the block. Defaults to true; set false for a flat static base color. */
  shimmer?: boolean;
  className?: string;
}

// A skeleton block: a muted base color with an optional CSS-only sweeping
// highlight. Size, radius and shape all come from className — this component
// only owns the fill and the sweep.
export function Skeleton({ shimmer = true, className }: SkeletonProps) {
  return (
    <>
      {shimmer && (
        <style>
          {`
@keyframes uilab-skeleton-sweep { 100% { transform: translateX(100%); } }
.uilab-skeleton-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, color-mix(in oklch, var(--foreground) 14%, transparent), transparent);
  animation: uilab-skeleton-sweep 1.4s ease-in-out infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .uilab-skeleton-shimmer::after { animation: none; display: none; }
}
`}
        </style>
      )}
      <div
        aria-hidden="true"
        className={cn(
          "relative overflow-hidden rounded-md bg-muted",
          shimmer && "uilab-skeleton-shimmer motion-reduce:animate-pulse",
          className,
        )}
      />
    </>
  );
}
