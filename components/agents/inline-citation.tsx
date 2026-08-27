"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to a hover/focus popover + simple pager; no Radix HoverCard or Carousel.

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface InlineCitationProps extends HTMLAttributes<HTMLSpanElement> {}

export function InlineCitation({ className, ...props }: InlineCitationProps) {
  return (
    <span className={cn("group inline items-center gap-1", className)} {...props} />
  );
}

export interface InlineCitationTextProps extends HTMLAttributes<HTMLSpanElement> {}

export function InlineCitationText({
  className,
  ...props
}: InlineCitationTextProps) {
  return (
    <span
      className={cn("transition-colors group-hover:bg-accent", className)}
      {...props}
    />
  );
}

interface CardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CardContext = createContext<CardContextValue | null>(null);

export interface InlineCitationCardProps extends HTMLAttributes<HTMLSpanElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InlineCitationCard({
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: InlineCitationCardProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isOpen = open ?? uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  return (
    <CardContext.Provider value={{ open: isOpen, setOpen }}>
      <span className={cn("relative inline-flex", className)} {...props}>
        {children}
      </span>
    </CardContext.Provider>
  );
}

export interface InlineCitationCardTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {
  sources: string[];
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function InlineCitationCardTrigger({
  sources,
  className,
  ...props
}: InlineCitationCardTriggerProps) {
  const context = useContext(CardContext);
  const canHover = useHoverCapable();

  return (
    <button
      type="button"
      aria-expanded={context?.open}
      className={cn(
        "ml-1 inline-flex rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onMouseEnter={() => {
        if (canHover) context?.setOpen(true);
      }}
      onMouseLeave={() => {
        if (canHover) context?.setOpen(false);
      }}
      onFocus={() => context?.setOpen(true)}
      onBlur={() => context?.setOpen(false)}
      onClick={() => context?.setOpen(!(context?.open ?? false))}
      {...props}
    >
      {sources[0] ? (
        <>
          {hostnameOf(sources[0])}
          {sources.length > 1 ? ` +${sources.length - 1}` : ""}
        </>
      ) : (
        "unknown"
      )}
    </button>
  );
}

export interface InlineCitationCardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export function InlineCitationCardBody({
  className,
  children,
  ...props
}: InlineCitationCardBodyProps) {
  const context = useContext(CardContext);
  if (!context?.open) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-30 mt-1 w-80 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CarouselContextValue {
  index: number;
  count: number;
  setIndex: (index: number) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export interface InlineCitationCarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function InlineCitationCarousel({
  className,
  children,
  ...props
}: InlineCitationCarouselProps) {
  const [index, setIndex] = useState(0);
  const slides = Array.isArray(children) ? children : [children];
  const count = slides.filter(Boolean).length;
  const value = useMemo(
    () => ({ index, count, setIndex }),
    [index, count],
  );

  return (
    <CarouselContext.Provider value={value}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export interface InlineCitationCarouselContentProps
  extends HTMLAttributes<HTMLDivElement> {}

export function InlineCitationCarouselContent({
  className,
  children,
  ...props
}: InlineCitationCarouselContentProps) {
  const carousel = useContext(CarouselContext);
  const items = Array.isArray(children) ? children : [children];
  const index = carousel?.index ?? 0;

  return (
    <div className={cn("relative", className)} {...props}>
      {items[index] ?? items[0]}
    </div>
  );
}

export interface InlineCitationCarouselItemProps
  extends HTMLAttributes<HTMLDivElement> {}

export function InlineCitationCarouselItem({
  className,
  ...props
}: InlineCitationCarouselItemProps) {
  return <div className={cn("w-full space-y-2 p-4 pl-8", className)} {...props} />;
}

export interface InlineCitationCarouselHeaderProps
  extends HTMLAttributes<HTMLDivElement> {}

export function InlineCitationCarouselHeader({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2",
        className,
      )}
      {...props}
    />
  );
}

export interface InlineCitationCarouselIndexProps
  extends HTMLAttributes<HTMLDivElement> {}

export function InlineCitationCarouselIndex({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) {
  const carousel = useContext(CarouselContext);
  const current = (carousel?.index ?? 0) + 1;
  const count = carousel?.count ?? 0;

  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-end px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? `${current}/${count}`}
    </div>
  );
}

export interface InlineCitationCarouselPrevProps
  extends HTMLAttributes<HTMLButtonElement> {}

export function InlineCitationCarouselPrev({
  className,
  ...props
}: InlineCitationCarouselPrevProps) {
  const carousel = useContext(CarouselContext);

  return (
    <button
      type="button"
      aria-label="Previous"
      className={cn("shrink-0", className)}
      onClick={() => {
        if (!carousel || carousel.count === 0) return;
        carousel.setIndex(
          (carousel.index - 1 + carousel.count) % carousel.count,
        );
      }}
      {...props}
    >
      <ArrowLeft className="size-4 text-muted-foreground" />
    </button>
  );
}

export interface InlineCitationCarouselNextProps
  extends HTMLAttributes<HTMLButtonElement> {}

export function InlineCitationCarouselNext({
  className,
  ...props
}: InlineCitationCarouselNextProps) {
  const carousel = useContext(CarouselContext);

  return (
    <button
      type="button"
      aria-label="Next"
      className={cn("shrink-0", className)}
      onClick={() => {
        if (!carousel || carousel.count === 0) return;
        carousel.setIndex((carousel.index + 1) % carousel.count);
      }}
      {...props}
    >
      <ArrowRight className="size-4 text-muted-foreground" />
    </button>
  );
}

export interface InlineCitationSourceProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  url?: string;
  description?: string;
}

export function InlineCitationSource({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {title ? (
        <h4 className="truncate text-sm font-medium leading-tight">{title}</h4>
      ) : null}
      {url ? (
        <p className="truncate break-all text-xs text-muted-foreground">{url}</p>
      ) : null}
      {description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export interface InlineCitationQuoteProps
  extends HTMLAttributes<HTMLQuoteElement> {}

export function InlineCitationQuote({
  children,
  className,
  ...props
}: InlineCitationQuoteProps) {
  return (
    <blockquote
      className={cn(
        "border-l-2 border-muted pl-3 text-sm text-muted-foreground italic",
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}
