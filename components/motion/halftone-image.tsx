"use client";

import { useEffect, useRef } from "react";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type HalftoneDotShape = "circle" | "square";

export interface HalftoneImageProps {
  /** Source bitmap. Any image the browser can decode; it is screened, not displayed. */
  src: string;
  /**
   * Optional second plate revealed on hover. Same framing as `src` — usually the
   * colour original against a desaturated `src`. Omit for a screen that never
   * changes; on touch devices it is never rendered, since there is no hover.
   */
  colorSrc?: string;
  /** Describes the picture. The canvases are hidden from AT; the wrapper carries this. */
  alt: string;
  /** Grid pitch in CSS px — the screen's coarseness. 4–6 reads as print, 10+ as a poster. */
  cell?: number;
  /** Largest dot as a fraction of `cell`. Above ~0.7 the darkest dots touch and the grid closes up. */
  dotScale?: number;
  /** Screen rotation in degrees. Print screens sit at 45° so the grid stops reading as rows. */
  angle?: number;
  shape?: HalftoneDotShape;
  /** Screen the inverse: dark dots for a light surface. */
  invert?: boolean;
  /**
   * Dot colour. Defaults to the wrapper's computed `color`, so a `text-*` class
   * drives it and it follows the theme.
   */
  color?: string;
  className?: string;
}

/** Rec. 709 luma. Matches how the eye weights the channels, so tone survives screening. */
function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * `object-fit: cover` in numbers: the scale and offset that fill `w`×`h` with an
 * `iw`×`ih` bitmap without distorting it.
 */
export function coverFit(
  iw: number,
  ih: number,
  w: number,
  h: number,
): { scale: number; dx: number; dy: number } {
  const scale = Math.max(w / iw, h / ih);
  return { scale, dx: (w - iw * scale) / 2, dy: (h - ih * scale) / 2 };
}

/**
 * Dot radius for a tone. Area — not radius — is proportional to the tone, which
 * is how a real halftone reproduces greys: a 25% dot must cover a quarter of its
 * cell, so the radius goes as the square root.
 */
export function dotRadius(tone: number, cell: number, dotScale: number): number {
  const clamped = tone < 0 ? 0 : tone > 1 ? 1 : tone;
  return Math.sqrt(clamped) * (cell / 2) * dotScale;
}

/**
 * Lattice points of a screen rotated `angle` degrees about the centre of a
 * `w`×`h` box, covering it completely. Yields device-space coordinates.
 */
export function* screenLattice(
  w: number,
  h: number,
  cell: number,
  angle: number,
): Generator<{ x: number; y: number }> {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = w / 2;
  const cy = h / 2;
  // A rotated grid must cover the box's diagonal to leave no bare corner.
  const reach = Math.hypot(w, h) / 2 + cell;
  // Snapped to a whole cell so a dot always lands on the exact centre and the
  // grid's phase does not depend on the box size — otherwise the whole screen
  // shifts as the container resizes.
  const start = -Math.ceil(reach / cell) * cell;

  for (let v = start; v <= reach; v += cell) {
    for (let u = start; u <= reach; u += cell) {
      const x = cx + u * cos - v * sin;
      const y = cy + u * sin + v * cos;
      if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
      yield { x, y };
    }
  }
}

type Plate = { kind: "flat"; color: string } | { kind: "sampled" };

/**
 * Screens one bitmap onto one canvas. `plate: "sampled"` colours every dot with
 * the tone it sat on, which is what separates the colour plate from the grey one.
 *
 * Exported so you can screen onto a canvas you own — the React component is a
 * thin wrapper over this.
 */
export function paintHalftone(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  options: {
    cell: number;
    dotScale: number;
    angle: number;
    shape: HalftoneDotShape;
    invert: boolean;
    plate: Plate;
    dpr: number;
    cssWidth: number;
    cssHeight: number;
  },
): void {
  const { cell, dotScale, angle, shape, invert, plate, dpr, cssWidth, cssHeight } =
    options;

  const w = Math.max(1, Math.round(cssWidth * dpr));
  const h = Math.max(1, Math.round(cssHeight * dpr));
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);

  // The source is rasterised once at output size, then sampled per dot.
  const source = document.createElement("canvas");
  source.width = w;
  source.height = h;
  const sourceCtx = source.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) return;

  const { scale, dx, dy } = coverFit(image.naturalWidth, image.naturalHeight, w, h);
  sourceCtx.drawImage(
    image,
    dx,
    dy,
    image.naturalWidth * scale,
    image.naturalHeight * scale,
  );

  let pixels: Uint8ClampedArray;
  try {
    pixels = sourceCtx.getImageData(0, 0, w, h).data;
  } catch {
    // A cross-origin bitmap taints the canvas and blocks reads. Showing the
    // picture unscreened beats showing nothing.
    ctx.drawImage(
      image,
      dx,
      dy,
      image.naturalWidth * scale,
      image.naturalHeight * scale,
    );
    return;
  }

  const deviceCell = cell * dpr;
  const maxRadius = deviceCell / 2;

  if (plate.kind === "flat") ctx.fillStyle = plate.color;

  for (const { x, y } of screenLattice(w, h, deviceCell, angle)) {
    const px = Math.min(w - 1, Math.max(0, Math.round(x)));
    const py = Math.min(h - 1, Math.max(0, Math.round(y)));
    const i = (py * w + px) * 4;
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3] / 255;
    if (alpha === 0) continue;

    const lum = luminance(r, g, b);
    const tone = (invert ? 1 - lum : lum) * alpha;
    const radius = dotRadius(tone, deviceCell, dotScale);
    if (radius < 0.05) continue;

    if (plate.kind === "sampled") ctx.fillStyle = `rgb(${r} ${g} ${b})`;

    if (shape === "square") {
      // Match the circle's ink coverage so the two shapes read at the same weight.
      const side = radius * Math.sqrt(Math.PI);
      ctx.fillRect(x - side / 2, y - side / 2, side, side);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, Math.min(radius, maxRadius), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Renders a bitmap as a printed halftone screen: the image's tone drives dot
 * size on a rotated grid, drawn to canvas. Give it a second plate via
 * `colorSrc` and the grey screen crossfades to a colour one on hover.
 *
 * The canvas is transparent between dots, so it composes over whatever sits
 * behind it — pair it with a `halftone-*` background atom or plain surface.
 * For a generative dithered *wave* rather than a screened picture, see the
 * `dither` variant of `webgl-background`.
 */
export function HalftoneImage({
  src,
  colorSrc,
  alt,
  cell = 6,
  dotScale = 0.62,
  angle = 45,
  shape = "circle",
  invert = false,
  color,
  className,
}: HalftoneImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef<HTMLCanvasElement>(null);
  const hoverCapable = useHoverCapable();
  const showColorPlate = Boolean(colorSrc) && hoverCapable;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frame = 0;
    const loaded = new Map<string, HTMLImageElement>();

    function paintAll() {
      if (disposed) return;
      const width = container?.clientWidth ?? 0;
      const height = container?.clientHeight ?? 0;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resolvedColor =
        color ?? getComputedStyle(container as Element).color ?? "#ffffff";

      const base = baseRef.current;
      const baseImage = loaded.get(src);
      if (base && baseImage) {
        paintHalftone(base, baseImage, {
          cell,
          dotScale,
          angle,
          shape,
          invert,
          plate: { kind: "flat", color: resolvedColor },
          dpr,
          cssWidth: width,
          cssHeight: height,
        });
      }

      const plate = colorRef.current;
      const plateImage = colorSrc ? loaded.get(colorSrc) : undefined;
      if (plate && plateImage) {
        paintHalftone(plate, plateImage, {
          cell,
          dotScale,
          angle,
          shape,
          invert,
          plate: { kind: "sampled" },
          dpr,
          cssWidth: width,
          cssHeight: height,
        });
      }
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paintAll);
    }

    const sources = showColorPlate && colorSrc ? [src, colorSrc] : [src];
    for (const source of sources) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.decoding = "async";
      image.onload = () => {
        loaded.set(source, image);
        schedule();
      };
      image.src = source;
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [src, colorSrc, cell, dotScale, angle, shape, invert, color, showColorPlate]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={cn("group relative overflow-hidden", className)}
    >
      <canvas ref={baseRef} aria-hidden className="block h-full w-full" />
      {showColorPlate ? (
        <canvas
          ref={colorRef}
          aria-hidden
          className="absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}
