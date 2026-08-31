"use client";

import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

function safePaintId(raw: string) {
  return raw.replace(/:/g, "");
}

type IconProps = {
  className?: string;
};

function Glyph({
  className,
  sharp,
  children,
}: {
  className?: string;
  sharp?: boolean;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap={sharp ? "butt" : "round"}
      strokeLinejoin={sharp ? "miter" : "round"}
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      {children}
    </svg>
  );
}

export function SidebarToggleIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M9.4 8.2v7.6M14.6 8.2v7.6" />
    </Glyph>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4.5 10.6 12 4.2l7.5 6.4V19.5a.8.8 0 0 1-.8.8H5.3a.8.8 0 0 1-.8-.8Z" />
      <path d="M10.4 20.3v-3.6h3.2v3.6" />
    </Glyph>
  );
}

export function UpdatesIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 3.2 13.55 10.2 20.8 12 13.55 13.8 12 20.8 10.45 13.8 3.2 12l7.25-1.8Z" />
    </Glyph>
  );
}

export function InboxIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M3.6 8.4h5.1l1.6 3.7h3.4l1.6-3.7h5.1v10.2H3.6Z" />
      <path d="M3.6 8.4 8.7 12.1h6.6l5.1-3.7" />
    </Glyph>
  );
}

export function TasksIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="5" y="5" width="14" height="14" rx="3.2" />
      <path d="m8.4 12.2 2.3 2.3 4.9-5.1" />
    </Glyph>
  );
}

export function ProjectsIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="3.8" y="3.8" width="7" height="7" rx="1.6" />
      <rect x="13.2" y="3.8" width="7" height="7" rx="1.6" />
      <rect x="3.8" y="13.2" width="7" height="7" rx="1.6" />
      <rect x="13.2" y="13.2" width="7" height="7" rx="1.6" />
    </Glyph>
  );
}

export function ViewsIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="7.6" y="3.6" width="12.2" height="12.2" rx="2.4" />
      <rect x="4.2" y="8.2" width="12.2" height="12.2" rx="2.4" />
    </Glyph>
  );
}

export function TeamsIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="8.4" cy="8.1" r="2.35" />
      <path d="M4.4 17.6c.3-2.7 1.8-4.1 4-4.1s3.7 1.4 4 4.1" />
      <circle cx="15.5" cy="8.1" r="2.35" />
      <path d="M12.1 17.6c.35-2.5 1.7-3.8 3.4-3.8 1.8 0 3.2 1.3 3.5 3.8" />
    </Glyph>
  );
}

export function ReportsIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="6.2" y="3.4" width="11.6" height="17.2" rx="2.1" />
      <path d="M8.8 9h6.4M8.8 12.2h6.4M8.8 15.4h4.2" />
    </Glyph>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4.2v1.7M12 18.1v1.7M4.2 12h1.7M18.1 12h1.7M6.5 6.5l1.2 1.2M16.3 16.3l1.2 1.2M17.5 6.5l-1.2 1.2M7.7 16.3l-1.2 1.2" />
    </Glyph>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="8.2" r="2.6" />
      <path d="M6.2 18.6c.45-3.2 2.5-4.8 5.8-4.8s5.35 1.6 5.8 4.8" />
    </Glyph>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4.4 7.2h15.2M4.4 12h15.2M4.4 16.8h15.2" />
      <circle cx="8.2" cy="7.2" r="1.35" fill="currentColor" />
      <circle cx="15.8" cy="12" r="1.35" fill="currentColor" />
      <circle cx="12" cy="16.8" r="1.35" fill="currentColor" />
    </Glyph>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Glyph className={cn("size-3", className)}>
      <path d="m6 9 6 6 6-6" />
    </Glyph>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Glyph className={cn("size-3.5", className)}>
      <path d="m9 6 6 6-6 6" />
    </Glyph>
  );
}

export function ListViewIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M5 7.2h14M5 12h14M5 16.8h14" />
    </Glyph>
  );
}

export function KanbanViewIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M6.4 16.8V8.6M12 18.4V5.6M17.6 16.8V8.6" />
    </Glyph>
  );
}

export function GanttViewIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4.6 8.4h9.2M10.2 15.6h9.2" />
    </Glyph>
  );
}

export function CalendarViewIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.6" y="5.6" width="14.8" height="13.6" rx="3" />
      <circle cx="12" cy="5.6" r="1.05" fill="currentColor" />
    </Glyph>
  );
}

export function DashboardViewIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="3" />
      <path d="M12 4.4v15.2M4.4 12h15.2" />
    </Glyph>
  );
}

export function SideDrawerIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.2" />
      <path d="M16.1 4.2v15.6" />
    </Glyph>
  );
}

export function FullPageIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.2" />
    </Glyph>
  );
}

export function PopUpIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="8.4" y="6.2" width="11.2" height="11.2" rx="2.4" />
      <rect x="4.4" y="4.2" width="10.4" height="10.4" rx="2.2" />
    </Glyph>
  );
}

export function MinimizeIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M7.2 12h9.6" />
    </Glyph>
  );
}

export function SelectedCheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <path
        d="M6.4 12.4 10.1 16l7.5-8.2"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BillingCheckIcon({ className }: IconProps) {
  return (
    <Glyph sharp className={className}>
      <path d="M5.6 12.4 9.8 16.6 18.4 7.2" />
    </Glyph>
  );
}

export function BillingXIcon({ className }: IconProps) {
  return (
    <Glyph sharp className={className}>
      <path d="m7 7 10 10M17 7 7 17" />
    </Glyph>
  );
}

export function BillingInfoIcon({ className }: IconProps) {
  return (
    <Glyph className={cn("size-3.5", className)}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 11.1v5.1" />
      <circle cx="12" cy="8" r="0.85" fill="currentColor" />
    </Glyph>
  );
}

export function UpgradeGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 14.2V6.4M8.4 9.6 12 6.1l3.6 3.5" />
      <path d="M7.2 17.8a6.4 6.4 0 0 1 9.6 0" />
    </Glyph>
  );
}

export function UpgradePlusMark({ className }: IconProps) {
  const id = safePaintId(useId());
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-11", className)}>
      <defs>
        <linearGradient id={id} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill={`url(#${id})`} />
      <circle cx="12" cy="12" r="5.2" fill="none" stroke="white" strokeWidth="1.4" />
      <path d="M12 9.1v5.8M9.1 12h5.8" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark({ className }: IconProps) {
  const id = safePaintId(useId());
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-8", className)}>
      <defs>
        <linearGradient id={id} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${id})`} />
    </svg>
  );
}

export function GradientAvatar({ className }: IconProps) {
  const id = safePaintId(useId());
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-7", className)}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop stopColor="#60A5FA" />
          <stop offset="0.45" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#F97316" />
        </radialGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill={`url(#${id})`} />
    </svg>
  );
}

export function ProjectTile({
  letter,
  from,
  to,
  className,
}: {
  letter: string;
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-[4px] text-[8px] font-semibold text-white",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(180deg, ${from}, ${to})` }}
    >
      {letter}
    </span>
  );
}

export const PROJECT_TILES = {
  tuesday: { letter: "T", from: "#F43F5E", to: "#FB923C" },
  jammio: { letter: "J", from: "#E879F9", to: "#7C3AED" },
  create: { letter: "C", from: "#34D399", to: "#22D3EE" },
  thoughts: { letter: "T", from: "#F97316", to: "#FBBF24" },
  consumex: { letter: "C", from: "#38BDF8", to: "#2563EB" },
} as const;
