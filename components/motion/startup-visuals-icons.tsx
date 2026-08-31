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
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3" />
      <path d="M8.6 4.2v15.6" strokeWidth="2.4" />
    </Glyph>
  );
}

export function FullPageIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="2.6" strokeWidth="2.3" />
    </Glyph>
  );
}

export function PopUpIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="2.4" />
      <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.6" />
    </Glyph>
  );
}

export function MinimizeIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M7 12h10" strokeWidth="2.4" />
    </Glyph>
  );
}

export function LayoutToggleIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3" />
      <path d="M8.8 4.2v15.6" />
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
      <circle cx="12" cy="12" r="8.1" />
      <path d="M12 15.4V8.8M9.3 11.4 12 8.6l2.7 2.8" />
    </Glyph>
  );
}

export function UpgradeBowlGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8.1" />
      <path d="M12 8.6v6M9.3 12.6 12 15.4l2.7-2.8" />
      <path d="M8.2 16.6h7.6" />
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
        <linearGradient id={id} x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" />
          <stop offset="0.45" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#F97316" />
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

export function MenuGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M5 7.2h14M5 12h14M5 16.8h14" />
    </Glyph>
  );
}

export function SearchGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="11" cy="11" r="5.4" />
      <path d="m15.6 15.6 3.2 3.2" />
    </Glyph>
  );
}

export function BellGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M6.4 16.6h11.2c-1-1.1-1.6-2.4-1.6-4.2V11c0-2.3-1.7-4.2-3.9-4.6V5.6a.9.9 0 0 0-1.8 0v.8C8.1 6.8 6.4 8.7 6.4 11v1.4c0 1.8-.6 3.1-1.6 4.2Z" />
      <path d="M10.2 18.4a1.8 1.8 0 0 0 3.6 0" />
    </Glyph>
  );
}

export function PuzzleGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M9.2 5.2h5.6v2.2a1.8 1.8 0 1 0 2.4 1.7h1.6v5.6h-2.2a1.8 1.8 0 1 0-1.7 2.4v1.7H9.2v-2.2a1.8 1.8 0 1 0-2.4-1.7H5.2V9.1h2.2A1.8 1.8 0 1 0 9.2 7.4Z" />
    </Glyph>
  );
}

export function MoreGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="6.2" cy="12" r="1.15" fill="currentColor" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" />
      <circle cx="17.8" cy="12" r="1.15" fill="currentColor" />
    </Glyph>
  );
}

export function PlusGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 6.4v11.2M6.4 12h11.2" />
    </Glyph>
  );
}

export function CloseGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m7 7 10 10M17 7 7 17" />
    </Glyph>
  );
}

export function StarGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M12 4.4 13.9 9.3l5.3.4-4 3.5 1.3 5.2L12 15.8 7.5 18.4 8.8 13.2 4.8 9.7l5.3-.4Z" />
    </Glyph>
  );
}

export function HelpGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.6 2.1c-.8.5-1.2 1-1.2 2" />
      <circle cx="12" cy="16.4" r="0.8" fill="currentColor" />
    </Glyph>
  );
}

export function FilterGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M5 7.2h14L13.6 13v5.2l-3.2-1.6V13Z" />
    </Glyph>
  );
}

export function SortGlyph({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M7.2 8.2h9.6M8.6 12h6.8M10.2 15.8h3.6" />
    </Glyph>
  );
}

export function PlayGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <circle cx="12" cy="12" r="9" fill="white" />
      <path d="M10.2 8.6v6.8L16 12Z" fill="#111113" />
    </svg>
  );
}

export function TuesdayMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <rect width="24" height="24" rx="6" fill="#2F6BFF" />
      <path
        d="M7 9.2h10M9 6.6v3M15 6.6v3"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="6.6" y="9.4" width="10.8" height="8.4" rx="1.8" fill="none" stroke="white" strokeWidth="1.4" />
      <path d="M8.6 12.2h2.2M13.2 12.2h2.2M8.6 15h2.2" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function JammioMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <path
        d="M5.2 11.2c0-4 3.2-7 6.8-7s6.8 3 6.8 7-3.2 7-6.8 7c-1.1 0-2.2-.2-3.1-.7L5 19.2l.9-3.2c-.5-1.2-.7-2.5-.7-4.8Z"
        fill="#F43F8C"
      />
    </svg>
  );
}

export function CreateMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <rect width="24" height="24" rx="6" fill="#22C55E" />
      <path d="M12 6.6v10.8M6.6 12h10.8" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.2 8.2h7.6v7.6H8.2Z" fill="none" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}

export function ThoughtsMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="#F97316" />
      <path
        d="M8 10.2c0-2 1.7-3.4 4-3.4s4 1.4 4 3.4c0 1.6-1 2.6-2.3 3.2l.3 2.4-2.8-1.4C9.5 13.8 8 12.4 8 10.2Z"
        fill="white"
      />
    </svg>
  );
}

export function ConsumexMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <circle cx="12" cy="12" r="9" fill="#2F6BFF" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="white" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill="white" />
    </svg>
  );
}
