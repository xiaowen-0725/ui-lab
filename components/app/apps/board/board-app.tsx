"use client";

import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type PointerEvent, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { focusRing, IconButton, SearchField, textFor, useQuietMotion } from "../ui";
import {
  COLUMN_IDS,
  type ColumnId,
  moveTask,
  neighborColumn,
  type Task,
  TASKS,
  taskMatches,
  tasksInColumn,
} from "./model";

const LABEL_CLASS: Record<Task["label"], string> = {
  product: "bg-foreground/[0.06] text-foreground",
  billing: "bg-accent text-accent-foreground",
  support: "bg-card text-foreground",
};

interface DragState {
  id: string;
  x: number;
  y: number;
  width: number;
  offsetX: number;
  offsetY: number;
  over: ColumnId | null;
}

export function BoardApp() {
  const t = useTranslations("apps");
  const locale = useLocale() as Locale;
  const quiet = useQuietMotion();
  const [tasks, setTasks] = useState<Task[]>(() => TASKS.map((task) => ({ ...task })));
  const [query, setQuery] = useState("");
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [live, setLive] = useState("");
  const columns = useRef<Partial<Record<ColumnId, HTMLElement | null>>>({});

  function setDragState(next: DragState | null) {
    dragRef.current = next;
    setDrag(next);
  }

  function announce(task: Task, column: ColumnId) {
    setLive(
      t("moved", {
        title: textFor(locale, task.title, task.titleZh),
        column: t(`columns.${column}`),
      }),
    );
  }

  function move(id: string, column: ColumnId) {
    const task = tasks.find((item) => item.id === id);
    if (!task || task.column === column) return;
    setTasks((current) => moveTask(current, id, column));
    announce(task, column);
  }

  function columnAt(x: number, y: number) {
    for (const id of COLUMN_IDS) {
      const node = columns.current[id];
      if (!node) continue;
      const rect = node.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return id;
    }
    return null;
  }

  function onGripDown(event: PointerEvent<HTMLButtonElement>, task: Task) {
    if (event.button !== 0) return;
    const card = event.currentTarget.closest("article");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      id: task.id,
      x: event.clientX,
      y: event.clientY,
      width: rect.width,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      over: task.column,
    });
  }

  function onGripMove(event: PointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    if (!current || current.id !== event.currentTarget.closest("article")?.dataset.taskId) return;
    setDragState({
      ...current,
      x: event.clientX,
      y: event.clientY,
      over: columnAt(event.clientX, event.clientY),
    });
  }

  function onGripUp() {
    const current = dragRef.current;
    if (!current) return;
    if (current.over) move(current.id, current.over);
    setDragState(null);
  }

  const dragging = tasks.find((task) => task.id === drag?.id) ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t("boardTitle")}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("boardDescription")}</p>
        </div>
        <SearchField
          label={t("searchTasks")}
          placeholder={t("searchTasks")}
          value={query}
          onChange={setQuery}
        />
      </header>
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-max gap-3 p-4 md:p-6">
          {COLUMN_IDS.map((column) => {
            const cards = tasksInColumn(tasks, column).filter((task) => taskMatches(task, query));
            const hot = drag?.over === column;
            return (
              <section
                key={column}
                ref={(node) => {
                  columns.current[column] = node;
                }}
                aria-label={t(`columns.${column}`)}
                className={cn(
                  "flex h-full w-[min(85vw,18rem)] flex-col rounded-2xl border border-transparent bg-foreground/[0.03] p-2 transition-colors motion-reduce:transition-none",
                  hot && "border-foreground/20 bg-foreground/[0.05]",
                )}
              >
                <header className="flex items-center justify-between px-2 py-2">
                  <h2 className="text-sm font-medium">{t(`columns.${column}`)}</h2>
                  <span className="tabular-nums text-xs text-muted-foreground">{cards.length}</span>
                </header>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pb-2">
                  {cards.length === 0 ? (
                    <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                      {query ? t("emptySearch") : t("emptyColumn")}
                    </p>
                  ) : (
                    cards.map((task) => {
                      const earlier = neighborColumn(task.column, -1);
                      const later = neighborColumn(task.column, 1);
                      const title = textFor(locale, task.title, task.titleZh);
                      return (
                        <article
                          key={task.id}
                          data-task-id={task.id}
                          className={cn(
                            "rounded-xl border border-border bg-background p-3 shadow-sm transition-colors hover:border-(--color-border-strong) motion-reduce:transition-none",
                            drag?.id === task.id && "opacity-40",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <button
                              type="button"
                              aria-label={t("dragHandle", { title })}
                              className={cn(
                                "mt-0.5 cursor-grab touch-none rounded-md text-muted-foreground hover:text-foreground active:cursor-grabbing",
                                focusRing,
                              )}
                              onPointerDown={(event) => onGripDown(event, task)}
                              onPointerMove={onGripMove}
                              onPointerUp={onGripUp}
                              onPointerCancel={onGripUp}
                              onKeyDown={(event) => {
                                if (event.key === "ArrowLeft" && earlier) move(task.id, earlier);
                                if (event.key === "ArrowRight" && later) move(task.id, later);
                              }}
                            >
                              <GripVertical aria-hidden="true" className="size-4" />
                            </button>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-medium leading-snug">{title}</h3>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {textFor(locale, task.detail, task.detailZh)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                LABEL_CLASS[task.label],
                              )}
                            >
                              {t(`labels.${task.label}`)}
                            </span>
                            <span className="truncate text-[11px] text-muted-foreground">
                              {textFor(locale, task.owner, task.ownerZh)} · {textFor(locale, task.due, task.dueZh)}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-end gap-1">
                            <IconButton
                              label={t("moveEarlier", { title })}
                              disabled={!earlier}
                              onClick={() => earlier && move(task.id, earlier)}
                            >
                              <ChevronLeft aria-hidden="true" className="size-4" />
                            </IconButton>
                            <IconButton
                              label={t("moveLater", { title })}
                              disabled={!later}
                              onClick={() => later && move(task.id, later)}
                            >
                              <ChevronRight aria-hidden="true" className="size-4" />
                            </IconButton>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      {drag && dragging ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none fixed z-50 rounded-xl border border-foreground/20 bg-background p-3 shadow-lg",
            !quiet && "scale-[1.02]",
          )}
          style={{
            width: drag.width,
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
          }}
        >
          <p className="text-sm font-medium">
            {textFor(locale, dragging.title, dragging.titleZh)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
