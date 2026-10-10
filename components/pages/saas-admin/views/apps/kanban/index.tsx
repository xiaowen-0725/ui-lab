"use client";

import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconTip, PersonAvatar, TruncateTip } from "../chrome";
import { fill, textFor, useQuietMotion } from "../surface";
import {
	COLUMN_IDS,
	type ColumnId,
	moveTask,
	neighborColumn,
	TASKS,
	type Task,
	taskMatches,
	tasksInColumn,
} from "./data";

const LABEL_CLASS: Record<Task["label"], string> = {
	product: "bg-muted text-foreground",
	billing: "bg-accent text-accent-foreground",
	support: "bg-secondary text-secondary-foreground",
};

const COLUMN_KEY: Record<ColumnId, string> = {
	queued: "Queued",
	doing: "In progress",
	review: "Review",
	done: "Done",
};

const LABEL_KEY: Record<Task["label"], string> = {
	product: "Product",
	billing: "Billing",
	support: "Support",
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

export function KanbanApp() {
	const { locale, t } = useSaasAdmin();
	const quiet = useQuietMotion();
	const [tasks, setTasks] = useState<Task[]>(() =>
		TASKS.map((task) => ({ ...task })),
	);
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
		const title = textFor(locale, task.title, task.titleZh);
		const columnName = t(COLUMN_KEY[column]);
		setLive(
			locale === "zh"
				? `已将${title}移到${columnName}`
				: `Moved ${title} to ${columnName}`,
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
			if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
				return id;
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
		if (
			!current ||
			current.id !== event.currentTarget.closest("article")?.dataset.taskId
		)
			return;
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
		<div className="flex min-h-[36rem] flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
			<header className="flex shrink-0 flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-sm text-muted-foreground">
						<SaasAdminText>
							Move work between columns with the grip or the buttons.
						</SaasAdminText>
					</p>
				</div>
				<Input
					type="search"
					value={query}
					placeholder={t("Search tasks")}
					aria-label={t("Search tasks")}
					className="md:max-w-xs"
					onChange={(event) => setQuery(event.target.value)}
				/>
			</header>
			<Separator />
			<p className="sr-only" aria-live="polite">
				{live}
			</p>
			<div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
				<div className="flex h-full min-w-max gap-3 p-4">
					{COLUMN_IDS.map((column) => {
						const cards = tasksInColumn(tasks, column).filter((task) =>
							taskMatches(task, query),
						);
						const hot = drag?.over === column;
						return (
							<section
								key={column}
								ref={(node) => {
									columns.current[column] = node;
								}}
								aria-label={t(COLUMN_KEY[column])}
								className={cn(
									"flex h-full w-[min(85vw,17rem)] flex-col rounded-xl bg-muted/50 p-2 ring-1 ring-transparent transition-colors motion-reduce:transition-none",
									hot && "bg-muted ring-border",
								)}
							>
								<header className="flex items-center justify-between px-2 py-2">
									<h2 className="text-sm font-medium">
										<SaasAdminText>{COLUMN_KEY[column]}</SaasAdminText>
									</h2>
									<Badge variant="secondary" className="tabular-nums">
										{cards.length}
									</Badge>
								</header>
								<ScrollArea className="min-h-0 flex-1">
								<div className="flex min-h-0 flex-1 flex-col gap-2 px-1 pb-2">
									{cards.length === 0 ? (
										<p className="px-2 py-6 text-center text-xs text-muted-foreground">
											<SaasAdminText>
												{query ? "No matching results" : "This column is empty"}
											</SaasAdminText>
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
														"rounded-xl bg-card p-3 shadow-xs ring-1 ring-foreground/10",
														drag?.id === task.id && "opacity-40",
													)}
												>
													<div className="flex items-start gap-2">
														<IconTip
															label={fill(t("Drag {title}"), { title })}
															trigger={
																<Button
																	type="button"
																	variant="ghost"
																	size="icon-xs"
																	aria-label={fill(t("Drag {title}"), { title })}
																	className="mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
																	onPointerDown={(event) => onGripDown(event, task)}
																	onPointerMove={onGripMove}
																	onPointerUp={onGripUp}
																	onPointerCancel={onGripUp}
																	onKeyDown={(event) => {
																		if (event.key === "ArrowLeft" && earlier)
																			move(task.id, earlier);
																		if (event.key === "ArrowRight" && later)
																			move(task.id, later);
																	}}
																/>
															}
														>
															<GripVertical aria-hidden="true" />
														</IconTip>
														<div className="min-w-0 flex-1">
															<h3 className="text-sm leading-snug font-medium">
																{title}
															</h3>
															<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
																{textFor(locale, task.detail, task.detailZh)}
															</p>
														</div>
													</div>
													<div className="mt-3 flex items-center justify-between gap-2">
														<Badge
															variant="secondary"
															className={cn("border-0", LABEL_CLASS[task.label])}
														>
															<SaasAdminText>
																{LABEL_KEY[task.label]}
															</SaasAdminText>
														</Badge>
														<span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
															<PersonAvatar
																name={textFor(locale, task.owner, task.ownerZh)}
																size="sm"
															/>
															<TruncateTip
																text={`${textFor(locale, task.owner, task.ownerZh)} · ${textFor(locale, task.due, task.dueZh)}`}
															>
																{textFor(locale, task.owner, task.ownerZh)} ·{" "}
																{textFor(locale, task.due, task.dueZh)}
															</TruncateTip>
														</span>
													</div>
													<div className="mt-2 flex justify-end gap-1">
														<IconTip
															label={fill(
																t("Move {title} to the previous column"),
																{ title },
															)}
															trigger={
																<Button
																	type="button"
																	variant="ghost"
																	size="icon-xs"
																	disabled={!earlier}
																	aria-label={fill(
																		t("Move {title} to the previous column"),
																		{ title },
																	)}
																	onClick={() => earlier && move(task.id, earlier)}
																/>
															}
														>
															<ChevronLeft aria-hidden="true" />
														</IconTip>
														<IconTip
															label={fill(
																t("Move {title} to the next column"),
																{ title },
															)}
															trigger={
																<Button
																	type="button"
																	variant="ghost"
																	size="icon-xs"
																	disabled={!later}
																	aria-label={fill(
																		t("Move {title} to the next column"),
																		{ title },
																	)}
																	onClick={() => later && move(task.id, later)}
																/>
															}
														>
															<ChevronRight aria-hidden="true" />
														</IconTip>
													</div>
												</article>
											);
										})
									)}
								</div>
								</ScrollArea>
							</section>
						);
					})}
				</div>
			</div>
			{drag && dragging ? (
				<div
					aria-hidden="true"
					className={cn(
						"pointer-events-none fixed z-50 rounded-xl bg-card p-3 shadow-lg ring-1 ring-foreground/20",
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
