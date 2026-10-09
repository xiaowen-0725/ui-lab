"use client";

import { workspaceCopy, type WorkspacePageProps } from "./workspace-copy";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";
import { enterTransition, focusRing, IconButton, PageIntro, textFor, useQuietMotion } from "./workspace-app-ui";
import {
  buildMonthGrid,
  DEMO_TODAY,
  type EventKind,
  eventsOn,
  isoDate,
  shiftMonth,
} from "./calendar-data";

const KIND_CLASS: Record<EventKind, string> = {
  focus: "bg-foreground/[0.06] text-foreground",
  customer: "bg-accent text-accent-foreground",
  ship: "bg-success/15 text-foreground",
};

export function CalendarPage({
  locale = "zh",
  showHeading = true,
  className,
}: WorkspacePageProps) {
  const copy = workspaceCopy(locale);
  const quiet = useQuietMotion();
  const [cursor, setCursor] = useState<{ year: number; month: number }>({
    year: DEMO_TODAY.year,
    month: DEMO_TODAY.month,
  });
  const [selected, setSelected] = useState(isoDate(DEMO_TODAY.year, DEMO_TODAY.month, DEMO_TODAY.day));
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const cells = buildMonthGrid(cursor.year, cursor.month);
  const today = isoDate(DEMO_TODAY.year, DEMO_TODAY.month, DEMO_TODAY.day);
  const monthLabel = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(cursor.year, cursor.month - 1, 1)));
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 0, 5 + index))),
  );
  const agenda = eventsOn(selected);

  function moveSelection(index: number, delta: number) {
    const next = cells[index + delta];
    if (!next?.inMonth) return;
    setSelected(next.date);
    buttons.current[next.date]?.focus();
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 md:flex-row md:items-end md:justify-between md:px-6">
        <PageIntro show={showHeading} title={copy.calendarTitle} description={copy.calendarDescription} />
        <div className="flex items-center gap-2">
          <IconButton label={copy.previousMonth} onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}>
            <ChevronLeft aria-hidden="true" className="size-4" />
          </IconButton>
          <p className="min-w-32 text-center text-sm font-medium">{monthLabel}</p>
          <IconButton label={copy.nextMonth} onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}>
            <ChevronRight aria-hidden="true" className="size-4" />
          </IconButton>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              setCursor({ year: DEMO_TODAY.year, month: DEMO_TODAY.month });
              setSelected(today);
            }}
          >
            {copy.sampleDay}
          </Button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem] lg:overflow-hidden">
        <div className="min-h-0 p-3 md:p-6 lg:overflow-auto">
          <div className="grid h-full min-h-[28rem] grid-rows-[auto_minmax(0,1fr)]">
          <div className="grid grid-cols-7 gap-1 pb-1">
            {weekdays.map((label) => (
              <div key={label} className="px-1 text-center text-[11px] font-medium text-muted-foreground">
                {label}
              </div>
            ))}
          </div>
          <fieldset className="m-0 min-h-0 min-w-0 border-0 p-0">
            <legend className="sr-only">{monthLabel}</legend>
            <div className="grid h-full grid-cols-7 auto-rows-fr gap-1">
            {cells.map((cell, index) => {
              const items = eventsOn(cell.date);
              const isSelected = cell.date === selected;
              const isToday = cell.date === today;
              return (
                <button
                  key={cell.date}
                  ref={(node) => {
                    buttons.current[cell.date] = node;
                  }}
                  type="button"
                  disabled={!cell.inMonth}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  onClick={() => setSelected(cell.date)}
                  onKeyDown={(event) => {
                    const step: Record<string, number> = {
                      ArrowLeft: -1,
                      ArrowRight: 1,
                      ArrowUp: -7,
                      ArrowDown: 7,
                    };
                    const delta = step[event.key] ?? 0;
                    if (!delta) return;
                    event.preventDefault();
                    moveSelection(index, delta);
                  }}
                  className={cn(
                    "flex min-h-16 flex-col items-stretch rounded-xl border border-transparent p-1 text-left transition-colors motion-reduce:transition-none md:min-h-24 md:p-1.5",
                    focusRing,
                    cell.inMonth ? "hover:bg-foreground/[0.04]" : "opacity-40",
                    isSelected && "border-border bg-foreground/[0.05]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full text-xs tabular-nums",
                      isToday && "bg-foreground text-background",
                    )}
                  >
                    {cell.day}
                  </span>
                  <span className="mt-1 hidden flex-col gap-1 md:flex">
                    {items.slice(0, 2).map((event) => (
                      <span
                        key={event.id}
                        className={cn("truncate rounded-md px-1.5 py-0.5 text-[10px]", KIND_CLASS[event.kind])}
                      >
                        {textFor(locale, event.title, event.titleZh)}
                      </span>
                    ))}
                    {items.length > 2 ? (
                      <span className="px-1 text-[10px] text-muted-foreground">+{items.length - 2}</span>
                    ) : null}
                  </span>
                  {items.length > 0 ? (
                    <span className="mx-auto mt-1 size-1.5 rounded-full bg-foreground/70 md:hidden" />
                  ) : null}
                </button>
              );
            })}
            </div>
          </fieldset>
          </div>
        </div>
        <aside className="min-h-0 overflow-y-auto border-t border-border p-4 lg:border-l lg:border-t-0 md:p-6">
          <h2 className="text-sm font-medium">{copy.agenda}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{selected}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selected} {...enterTransition(quiet)} className="mt-4 space-y-3">
              {agenda.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noEvents}</p>
              ) : (
                agenda.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-border bg-card/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", KIND_CLASS[event.kind])}>
                        {copy.kinds[event.kind]}
                      </span>
                      <time className="tabular-nums text-xs text-muted-foreground">{event.time}</time>
                    </div>
                    <h3 className="mt-2 text-sm font-medium">
                      {textFor(locale, event.title, event.titleZh)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {textFor(locale, event.detail, event.detailZh)}
                    </p>
                  </article>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
