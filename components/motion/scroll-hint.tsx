import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ScrollHintVariant = "mouse" | "chevron";

export interface ScrollHintProps {
  /** Which glyph to render. */
  variant?: ScrollHintVariant;
  className?: string;
  /** Optional caption under the glyph, e.g. "Scroll". */
  label?: string;
}

/**
 * A quiet "there's more below" cue for the foot of a hero section. Two
 * glyphs, both pure CSS loops: a mouse shell with a dot that falls and fades,
 * or a pair of chevrons pulsing downward out of step with each other.
 * `motion-reduce:` freezes the loop and leaves the glyph sitting still.
 */
export function ScrollHint({
  variant = "mouse",
  className,
  label,
}: ScrollHintProps) {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className={cn(
          "inline-flex flex-col items-center gap-2 text-foreground",
          className,
        )}
      >
        {variant === "mouse" && <MouseGlyph />}
        {variant === "chevron" && <ChevronGlyph />}
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </>
  );
}

const KEYFRAMES = `
@keyframes uilab-scroll-hint-dot {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  60% { opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}
@keyframes uilab-scroll-hint-chevron {
  0%, 100% { opacity: 0.3; transform: translateY(-2px); }
  50% { opacity: 1; transform: translateY(2px); }
}
`;

function MouseGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="30"
      viewBox="0 0 20 30"
      fill="none"
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="27.5"
        rx="8.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="10"
        cy="8.5"
        r="2"
        fill="currentColor"
        className="animate-[uilab-scroll-hint-dot_1.8s_infinite] motion-reduce:animate-none"
        style={{ animationTimingFunction: EASE_OUT_CSS }}
      />
    </svg>
  );
}

function ChevronGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="28"
      viewBox="0 0 24 28"
      fill="none"
    >
      <path
        d="M6 6L12 12L18 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[uilab-scroll-hint-chevron_1.6s_infinite] motion-reduce:animate-none"
        style={{ animationTimingFunction: EASE_OUT_CSS }}
      />
      <path
        d="M6 15L12 21L18 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[uilab-scroll-hint-chevron_1.6s_infinite] motion-reduce:animate-none"
        style={{ animationTimingFunction: EASE_OUT_CSS, animationDelay: "0.35s" }}
      />
    </svg>
  );
}
