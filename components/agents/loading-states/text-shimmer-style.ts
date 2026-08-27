// Ported from beUI (starc007/ui-components, MIT).
// Local helper so registry copies keep reduced-motion on the inline shimmer.

import type { CSSProperties } from "react";

export const TEXT_SHIMMER_KEYFRAMES =
  "@keyframes uilab-text-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}" +
  "@media (prefers-reduced-motion: reduce){.uilab-text-shimmer{animation:none !important}}";

export const TEXT_SHIMMER_CLASS_NAME =
  "uilab-text-shimmer bg-[length:200%_100%] bg-clip-text text-transparent bg-[linear-gradient(110deg,var(--muted-foreground)_30%,var(--foreground)_50%,var(--muted-foreground)_70%)]";

export function textShimmerStyle(duration: number): CSSProperties {
  return {
    animation: `uilab-text-shimmer ${duration}s linear infinite`,
  };
}
