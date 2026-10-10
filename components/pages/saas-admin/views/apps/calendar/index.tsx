"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconTip, TruncateTip } from "../chrome";
import { enterTransition, textFor, useQuietMotion } from "../surface";
import {
	buildMonthGrid,
	DEMO_TODAY,
	type EventKind,
	eventsOn,
	isoDate,
	shiftMonth,
} from "./data";

const KIND_CLASS: Record<EventKind, string> = {
	focus: "bg-muted text-foreground",
	meeting: "bg-accent text-accent-foreground",
	ship: "bg-secondary text-secondary-foreground",
};

const KIND_KEY: Record<EventKind, string> = {
	focus: "Focus",
	meeting: "Meeting",
	ship: "Ship",
};

export function CalendarApp() {
	const { locale, t } = useSaasAdmin();
	const quiet = useQuietMotion();
	const [cursor, setCursor] = useState<{ year: number; month: number }>({
		year: DEMO_TODAY.year,
		month: DEMO_TODAY.month,
	});
	const [selected, setSelected] = useState(
		isoDate(DEMO_TODAY.year, DEMO_TODAY.month, DEMO_TODAY.day),
	);
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
		<div className="flex min-h-[36rem] flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
			<header className="flex shrink-0 flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
				<p className="text-sm text-muted-foreground">
					<SaasAdminText>
						The sample month stays on October 2026. The sample day is the 9th.
					</SaasAdminText>
				</p>
				<div className="flex items-center gap-2">
					<IconTip
						label={t("Previous month")}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={t("Previous month")}
								onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}
							/>
						}
					>
						<ChevronLeft aria-hidden="true" />
					</IconTip>
					<p className="min-w-32 text-center text-sm font-medium">{monthLabel}</p>
					<IconTip
						label={t("Next month")}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={t("Next month")}
								onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}
							/>
						}
					>
						<ChevronRight aria-hidden="true" />
					</IconTip>
					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							setCursor({ year: DEMO_TODAY.year, month: DEMO_TODAY.month });
							setSelected(today);
						}}
					>
						<SaasAdminText>Sample day</SaasAdminText>
					</Button>
				</div>
			</header>
			<Separator />
			<div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem] lg:overflow-hidden">
				<div className="min-h-0 p-3 md:p-6 lg:overflow-auto">
					<div className="grid h-full min-h-[28rem] grid-rows-[auto_minmax(0,1fr)]">
						<div className="grid grid-cols-7 gap-1 pb-1">
							{weekdays.map((label) => (
								<div
									key={label}
									className="px-1 text-center text-[11px] font-medium text-muted-foreground"
								>
									{label}
								</div>
							))}
						</div>
						<fieldset className="m-0 min-h-0 min-w-0 border-0 p-0">
							<legend className="sr-only">{monthLabel}</legend>
							<div className="grid h-full auto-rows-fr grid-cols-7 gap-1">
								{cells.map((cell, index) => {
									const items = eventsOn(cell.date);
									const isSelected = cell.date === selected;
									const isToday = cell.date === today;
									return (
										<Button
											key={cell.date}
											ref={(node) => {
												buttons.current[cell.date] = node;
											}}
											type="button"
											variant="ghost"
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
												"h-auto min-h-16 flex-col items-stretch justify-start whitespace-normal rounded-xl border border-transparent p-1 text-left md:min-h-24 md:p-1.5",
												!cell.inMonth && "opacity-40",
												isSelected && "border-border bg-muted",
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
											<span className="mt-1 hidden w-full flex-col gap-1 md:flex">
												{items.slice(0, 2).map((event) => {
													const title = textFor(locale, event.title, event.titleZh);
													return (
														<TruncateTip key={event.id} text={title}>
															<Badge
																variant="secondary"
																className={cn(
																	"h-auto max-w-full justify-start border-0 px-1.5 py-0.5 text-[10px] font-normal",
																	KIND_CLASS[event.kind],
																)}
															>
																{title}
															</Badge>
														</TruncateTip>
													);
												})}
												{items.length > 2 ? (
													<span className="px-1 text-[10px] text-muted-foreground">
														+{items.length - 2}
													</span>
												) : null}
											</span>
											{items.length > 0 ? (
												<span className="mx-auto mt-1 size-1.5 rounded-full bg-foreground/70 md:hidden" />
											) : null}
										</Button>
									);
								})}
							</div>
						</fieldset>
					</div>
				</div>
				<aside className="min-h-0 border-t lg:border-t-0 lg:border-l">
					<ScrollArea className="h-full">
					<div className="p-4 md:p-6">
					<h2 className="text-sm font-medium">
						<SaasAdminText>Agenda</SaasAdminText>
					</h2>
					<p className="mt-1 text-xs text-muted-foreground">{selected}</p>
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={selected}
							{...enterTransition(quiet)}
							className="mt-4 space-y-3"
						>
							{agenda.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									<SaasAdminText>No events this day</SaasAdminText>
								</p>
							) : (
								agenda.map((event) => (
									<article
										key={event.id}
										className="rounded-xl bg-muted/40 p-3 ring-1 ring-foreground/10"
									>
										<div className="flex items-center justify-between gap-2">
											<Badge
												variant="secondary"
												className={cn("border-0", KIND_CLASS[event.kind])}
											>
												<SaasAdminText>{KIND_KEY[event.kind]}</SaasAdminText>
											</Badge>
											<time className="text-xs text-muted-foreground tabular-nums">
												{event.time}
											</time>
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
					</div>
					</ScrollArea>
				</aside>
			</div>
		</div>
	);
}
