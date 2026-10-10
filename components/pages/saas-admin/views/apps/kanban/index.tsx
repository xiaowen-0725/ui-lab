"use client";

import { Calendar, GripVertical, MoreHorizontal, Plus, Search } from "lucide-react";
import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconTip, PersonAvatar } from "../chrome";
import { fill, textFor, useQuietMotion } from "../surface";
import {
	addColumn,
	addTask,
	type BoardColumn,
	COLUMNS,
	clearColumn,
	moveTask,
	neighborColumn,
	removeColumn,
	TASKS,
	type Task,
	type TaskPriority,
	taskMatches,
	tasksInColumn,
} from "./data";

const PRIORITY_KEY: Record<TaskPriority, string> = {
	high: "High",
	medium: "Medium",
	low: "Low",
};

const PRIORITY_BADGE: Record<TaskPriority, string> = {
	high: "border-transparent bg-destructive/10 text-destructive capitalize",
	medium: "border-transparent bg-amber-600/10 text-amber-600 capitalize",
	low: "border-transparent bg-sky-600/10 text-sky-700 capitalize dark:text-sky-400",
};

const HOVER_CHROME =
	"opacity-100 md:opacity-0 md:group-hover/item:opacity-100 md:group-focus-within/item:opacity-100";
const COLUMN_HOVER_CHROME =
	"opacity-100 md:opacity-0 md:group-hover/column:opacity-100 md:group-focus-within/column:opacity-100";

interface DragState {
	id: string;
	x: number;
	y: number;
	width: number;
	offsetX: number;
	offsetY: number;
	over: string | null;
}

export function KanbanApp() {
	const { locale, t } = useSaasAdmin();
	const quiet = useQuietMotion();
	const [columns, setColumns] = useState<BoardColumn[]>(() =>
		COLUMNS.map((column) => ({ ...column })),
	);
	const [tasks, setTasks] = useState<Task[]>(() =>
		TASKS.map((task) => ({ ...task, assignees: [...task.assignees] })),
	);
	const [query, setQuery] = useState("");
	const [drag, setDrag] = useState<DragState | null>(null);
	const dragRef = useRef<DragState | null>(null);
	const [live, setLive] = useState("");
	const [serial, setSerial] = useState(1);
	const wells = useRef<Partial<Record<string, HTMLElement | null>>>({});
	const columnIds = columns.map((column) => column.id);

	function setDragState(next: DragState | null) {
		dragRef.current = next;
		setDrag(next);
	}

	function columnTitle(column: BoardColumn | string) {
		if (typeof column === "string") {
			const found = columns.find((item) => item.id === column);
			if (!found) return column;
			return textFor(locale, found.title, found.titleZh);
		}
		return textFor(locale, column.title, column.titleZh);
	}

	function announce(message: string) {
		setLive(message);
	}

	function move(id: string, column: string) {
		const task = tasks.find((item) => item.id === id);
		if (!task || task.column === column) return;
		setTasks((current) => moveTask(current, id, column));
		const title = textFor(locale, task.title, task.titleZh);
		const columnName = columnTitle(column);
		announce(
			locale === "zh"
				? `已将${title}移到${columnName}`
				: `Moved ${title} to ${columnName}`,
		);
	}

	function columnAt(x: number, y: number) {
		for (const id of columnIds) {
			const node = wells.current[id];
			if (!node) continue;
			const rect = node.getBoundingClientRect();
			if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
				return id;
		}
		return null;
	}

	function onGripDown(event: PointerEvent<HTMLElement>, task: Task) {
		if (event.button !== 0) return;
		if (
			event.target instanceof Element &&
			event.target.closest("button") &&
			!event.currentTarget.matches("button")
		)
			return;
		const card = event.currentTarget.closest("[data-task-id]");
		if (!(card instanceof HTMLElement)) return;
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

	function onGripMove(event: PointerEvent<HTMLElement>) {
		const current = dragRef.current;
		if (
			!current ||
			current.id !==
				event.currentTarget.closest<HTMLElement>("[data-task-id]")?.dataset
					.taskId
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

	function onCardKey(event: KeyboardEvent<HTMLElement>, task: Task) {
		const earlier = neighborColumn(task.column, -1, columnIds);
		const later = neighborColumn(task.column, 1, columnIds);
		if (event.key === "ArrowLeft" && earlier) {
			event.preventDefault();
			move(task.id, earlier);
		}
		if (event.key === "ArrowRight" && later) {
			event.preventDefault();
			move(task.id, later);
		}
	}

	function createItem(column: BoardColumn) {
		const next = serial;
		setSerial((value) => value + 1);
		setTasks((current) => addTask(current, column.id, next));
		announce(
			fill(t("Added {title} to {column}"), {
				title: t("Untitled item"),
				column: columnTitle(column),
			}),
		);
	}

	function createColumn() {
		const next = serial;
		setSerial((value) => value + 1);
		setColumns((current) => addColumn(current, next));
		announce(t("Added a column"));
	}

	function emptyColumn(column: BoardColumn) {
		setTasks((current) => clearColumn(current, column.id));
		announce(fill(t("Cleared {column}"), { column: columnTitle(column) }));
	}

	function deleteColumn(column: BoardColumn) {
		if (columns.length <= 1) return;
		const result = removeColumn(columns, tasks, column.id);
		setColumns(result.columns);
		setTasks(result.tasks);
		announce(fill(t("Removed {column}"), { column: columnTitle(column) }));
	}

	const dragging = tasks.find((task) => task.id === drag?.id) ?? null;

	return (
		<div className="flex min-h-[36rem] flex-col gap-4">
			<header className="flex shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<p className="text-sm text-muted-foreground">
					<SaasAdminText>
						Move work with the grip or the arrow keys.
					</SaasAdminText>
				</p>
				<InputGroup className="md:max-w-xs">
					<InputGroupAddon>
						<Search aria-hidden="true" />
					</InputGroupAddon>
					<InputGroupInput
						type="search"
						value={query}
						placeholder={t("Search tasks")}
						aria-label={t("Search tasks")}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</InputGroup>
			</header>
			<p className="sr-only" aria-live="polite">
				{live}
			</p>
			<div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
				<div className="flex h-full min-w-max items-start gap-4 pb-1">
					{columns.map((column) => {
						const cards = tasksInColumn(tasks, column.id).filter((task) =>
							taskMatches(task, query),
						);
						const hot = drag?.over === column.id;
						const name = columnTitle(column);
						return (
							<Card
								key={column.id}
								size="sm"
								data-slot="kanban-column"
								ref={(node) => {
									wells.current[column.id] = node;
								}}
								role="region"
								aria-label={name}
								className={cn(
									"group/column mb-2.5 w-64 max-w-[85vw] shrink-0 gap-0 bg-muted py-4 shadow-xs transition-colors motion-reduce:transition-none",
									hot && "bg-muted/80",
								)}
							>
								<CardHeader className="grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 px-4">
									<h2 className="min-w-0 truncate text-sm font-medium">
										{name}
									</h2>
									<Badge variant="outline" className="tabular-nums">
										{cards.length}
									</Badge>
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													type="button"
													variant="ghost"
													size="icon-xs"
													aria-label={t("Column actions")}
													className={cn(
														"text-muted-foreground",
														COLUMN_HOVER_CHROME,
													)}
												/>
											}
										>
											<MoreHorizontal aria-hidden="true" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-40">
											<DropdownMenuItem onClick={() => emptyColumn(column)}>
												<SaasAdminText>Clear column</SaasAdminText>
											</DropdownMenuItem>
											<DropdownMenuItem
												variant="destructive"
												disabled={columns.length <= 1}
												onClick={() => deleteColumn(column)}
											>
												<SaasAdminText>Delete column</SaasAdminText>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</CardHeader>
								<CardContent className="gap-2.5 px-4">
									<ScrollArea className="max-h-[calc(100vh-18rem)] min-h-0 flex-1">
										<div className="flex flex-col gap-2.5 pr-1 pb-1">
											{cards.length === 0 ? (
												<p className="px-1 py-8 text-center text-xs text-muted-foreground">
													<SaasAdminText>
														{query
															? "No matching results"
															: "This column is empty"}
													</SaasAdminText>
												</p>
											) : (
												cards.map((task) => (
													<TaskCard
														key={task.id}
														task={task}
														dragging={drag?.id === task.id}
														onGripDown={onGripDown}
														onGripMove={onGripMove}
														onGripUp={onGripUp}
														onKeyDown={onCardKey}
													/>
												))
											)}
										</div>
									</ScrollArea>
									<Button
										type="button"
										variant="ghost"
										data-slot="kanban-add-item"
										className="h-8 w-full justify-start text-xs text-muted-foreground"
										onClick={() => createItem(column)}
									>
										<Plus className="size-3.5" aria-hidden="true" />
										<SaasAdminText>Add New Item</SaasAdminText>
									</Button>
								</CardContent>
							</Card>
						);
					})}
					<Button
						type="button"
						variant="outline"
						data-slot="kanban-add-column"
						className="h-9 w-64 shrink-0 justify-start border-dashed"
						onClick={createColumn}
					>
						<Plus className="size-4" aria-hidden="true" />
						<SaasAdminText>Add New Column</SaasAdminText>
					</Button>
				</div>
			</div>
			{drag && dragging ? (
				<Card
					size="sm"
					aria-hidden="true"
					className={cn(
						"pointer-events-none fixed z-50 gap-0 py-3 shadow-lg",
						!quiet && "scale-[1.02]",
					)}
					style={{
						width: drag.width,
						left: drag.x - drag.offsetX,
						top: drag.y - drag.offsetY,
					}}
				>
					<CardContent className="px-3">
						<PriorityBadge priority={dragging.priority} />
						<p className="mt-2 text-sm font-medium">
							{textFor(locale, dragging.title, dragging.titleZh)}
						</p>
					</CardContent>
				</Card>
			) : null}
		</div>
	);
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
	return (
		<Badge variant="outline" className={PRIORITY_BADGE[priority]}>
			<SaasAdminText>{PRIORITY_KEY[priority]}</SaasAdminText>
		</Badge>
	);
}

function TaskCard({
	task,
	dragging,
	onGripDown,
	onGripMove,
	onGripUp,
	onKeyDown,
}: {
	task: Task;
	dragging: boolean;
	onGripDown: (event: PointerEvent<HTMLElement>, task: Task) => void;
	onGripMove: (event: PointerEvent<HTMLElement>) => void;
	onGripUp: () => void;
	onKeyDown: (event: KeyboardEvent<HTMLElement>, task: Task) => void;
}) {
	const { locale, t } = useSaasAdmin();
	const title = textFor(locale, task.title, task.titleZh);
	const due = textFor(locale, task.due, task.dueZh);
	const owners = task.assignees
		.map((person) => textFor(locale, person.name, person.nameZh))
		.join(", ");
	return (
		<Card
			size="sm"
			data-task-id={task.id}
			data-slot="kanban-item"
			tabIndex={0}
			aria-label={fill(t("Move {title} with the arrow keys"), { title })}
			onKeyDown={(event) => onKeyDown(event, task)}
			onPointerDown={(event) => onGripDown(event, task)}
			onPointerMove={onGripMove}
			onPointerUp={onGripUp}
			onPointerCancel={onGripUp}
			className={cn(
				"group/item cursor-move gap-0 bg-card py-3 shadow-xs",
				dragging && "opacity-40",
			)}
		>
			<CardContent className="gap-2 px-3">
				<div className="flex items-start justify-between gap-2">
					<PriorityBadge priority={task.priority} />
					<IconTip
						label={fill(t("Drag {title}"), { title })}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								aria-label={fill(t("Drag {title}"), { title })}
								className={cn(
									"-mr-1 -mt-0.5 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing",
									HOVER_CHROME,
								)}
								onPointerDown={(event) => onGripDown(event, task)}
								onPointerMove={onGripMove}
								onPointerUp={onGripUp}
								onPointerCancel={onGripUp}
								onKeyDown={(event) => onKeyDown(event, task)}
							/>
						}
					>
						<GripVertical aria-hidden="true" />
					</IconTip>
				</div>
				{task.cover ? (
					<div
						aria-hidden="true"
						className="aspect-video overflow-hidden rounded-md bg-muted bg-cover bg-center"
						style={{ backgroundImage: `url("${task.cover}")` }}
					/>
				) : null}
				<p className="line-clamp-2 text-sm leading-snug font-medium">{title}</p>
				<div className="flex items-center justify-between gap-2">
					<AvatarGroup className="*:data-[slot=avatar]:size-5">
						{task.assignees.map((person) => {
							const name = textFor(locale, person.name, person.nameZh);
							return (
								<Tooltip key={`${task.id}-${person.name}`}>
									<TooltipTrigger render={<span className="inline-flex" />}>
										<PersonAvatar name={name} size="sm" />
									</TooltipTrigger>
									<TooltipContent>{name}</TooltipContent>
								</Tooltip>
							);
						})}
					</AvatarGroup>
					<span
						className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground"
						title={owners}
					>
						<Calendar className="size-3.5" aria-hidden="true" />
						<time>{due}</time>
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
