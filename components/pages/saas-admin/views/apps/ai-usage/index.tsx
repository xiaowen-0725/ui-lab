"use client";

import { animate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ThreadUsage } from "@/components/motion/agent-thread";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { textFor, useQuietMotion } from "../surface";
import {
	DAILY_USAGE,
	dailyForFilter,
	formatTokens,
	formatUsd,
	MODEL_USAGE,
	modelsForFilter,
	queriesForFilter,
	RECENT_QUERIES,
	summaryForFilter,
	USAGE_TODAY,
	type UsageModelFilter,
} from "./data";

const FILTERS: { id: UsageModelFilter; label: string }[] = [
	{ id: "all", label: "All models" },
	...MODEL_USAGE.map((model) => ({ id: model.id, label: model.name })),
];

const chartConfig = {
	tokens: {
		label: "Tokens",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export function AiUsageApp() {
	const { locale, t } = useSaasAdmin();
	const [filter, setFilter] = useState<UsageModelFilter>("all");
	const summary = useMemo(() => summaryForFilter(filter), [filter]);
	const limits = useMemo(() => modelsForFilter(MODEL_USAGE, filter), [filter]);
	const queries = useMemo(() => queriesForFilter(RECENT_QUERIES, filter), [filter]);
	const days = useMemo(
		() =>
			dailyForFilter(DAILY_USAGE, filter).map((day) => ({
				...day,
				dayLabel: textFor(locale, day.label, day.labelZh),
			})),
		[filter, locale],
	);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<p className="text-sm text-muted-foreground">
					<SaasAdminText>
						Sample token spend for the October window. Figures stay in this visit.
					</SaasAdminText>
				</p>
				<fieldset className="m-0 border-0 p-0">
					<legend className="sr-only">{t("Filter usage")}</legend>
					<div className="flex flex-wrap gap-1.5">
						{FILTERS.map((item) => (
							<Button
								key={item.id}
								type="button"
								size="sm"
								variant={filter === item.id ? "default" : "outline"}
								aria-pressed={filter === item.id}
								onClick={() => setFilter(item.id)}
							>
								<SaasAdminText>{item.label}</SaasAdminText>
							</Button>
						))}
					</div>
				</fieldset>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Metric
					label="Requests"
					value={summary.requests}
					format={(value) =>
						Math.round(value).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")
					}
				/>
				<Metric label="Tokens" value={summary.tokens} format={formatTokens} />
				<Metric label="Cost" value={summary.cost} format={formatUsd} />
				<Metric
					label="Error rate"
					value={summary.errorRate}
					format={(value) => `${(value * 100).toFixed(1)}%`}
				/>
			</div>
			<div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
				<Card>
					<CardHeader className="border-b">
						<CardTitle>
							<SaasAdminText>Usage by model</SaasAdminText>
						</CardTitle>
					</CardHeader>
					<CardContent className="px-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										<SaasAdminText>Model</SaasAdminText>
									</TableHead>
									<TableHead className="text-right">
										<SaasAdminText>Requests</SaasAdminText>
									</TableHead>
									<TableHead className="text-right">
										<SaasAdminText>Tokens</SaasAdminText>
									</TableHead>
									<TableHead className="text-right">
										<SaasAdminText>Cost</SaasAdminText>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{MODEL_USAGE.map((model) => {
									const selected = filter === model.id;
									return (
										<TableRow
											key={model.id}
											data-state={selected ? "selected" : undefined}
											className={cn(
												filter !== "all" && !selected && "opacity-50",
											)}
										>
											<TableCell className="font-medium">{model.name}</TableCell>
											<TableCell className="text-right tabular-nums">
												{model.requests.toLocaleString(
													locale === "zh" ? "zh-CN" : "en-US",
												)}
											</TableCell>
											<TableCell className="text-right tabular-nums">
												{formatTokens(model.inputTokens + model.outputTokens)}
											</TableCell>
											<TableCell className="text-right tabular-nums">
												{formatUsd(model.cost)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="border-b">
						<CardTitle>
							<SaasAdminText>Daily tokens</SaasAdminText>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={chartConfig}
							className="aspect-auto h-56 w-full"
							aria-label={t("Daily tokens")}
						>
							<BarChart
								accessibilityLayer
								data={days}
								margin={{ left: 4, right: 8, top: 8, bottom: 0 }}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="dayLabel"
									tickLine={false}
									axisLine={false}
									interval={0}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									width={40}
									tickFormatter={(value) => formatTokens(Number(value))}
								/>
								<ChartTooltip
									cursor={{
										fill: "color-mix(in oklab, var(--primary) 8%, transparent)",
									}}
									content={
										<ChartTooltipContent
											labelFormatter={(_, payload) => {
												const day = payload?.[0]?.payload as
													| { dayLabel?: string; date?: string }
													| undefined;
												if (!day?.dayLabel) return "";
												return day.date === USAGE_TODAY
													? `${day.dayLabel} · ${t("Today")}`
													: day.dayLabel;
											}}
											formatter={(value) => (
												<>
													<span className="text-muted-foreground">
														{t("Tokens")}
													</span>
													<span className="ml-auto font-mono font-medium tabular-nums">
														{formatTokens(Number(value))}
													</span>
												</>
											)}
										/>
									}
								/>
								<Bar dataKey="tokens" radius={6} maxBarSize={36}>
									{days.map((day) => (
										<Cell
											key={day.date}
											fill={
												day.date === USAGE_TODAY
													? "var(--primary)"
													: "color-mix(in oklab, var(--primary) 55%, transparent)"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 xl:grid-cols-2">
				<Card>
					<CardHeader className="border-b">
						<CardTitle>
							<SaasAdminText>Rate limits</SaasAdminText>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{limits.map((model) => (
							<Progress
								key={model.id}
								value={Math.round((model.used / model.limit) * 100)}
							>
								<ProgressLabel className="flex w-full justify-between text-sm">
									<span>{model.name}</span>
									<span className="tabular-nums text-muted-foreground">
										{formatTokens(model.used)} / {formatTokens(model.limit)}
									</span>
								</ProgressLabel>
							</Progress>
						))}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="border-b">
						<CardTitle>
							<SaasAdminText>Recent queries</SaasAdminText>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{queries.map((query) => (
							<article key={query.id} className="space-y-1">
								<div className="flex items-baseline justify-between gap-3">
									<h3 className="text-sm font-medium">
										{textFor(locale, query.title, query.titleZh)}
									</h3>
									<span className="text-xs text-muted-foreground">
										{query.model}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									{textFor(locale, query.at, query.atZh)}
								</p>
								<ThreadUsage
									cost={query.cost}
									inputTokens={query.inputTokens}
									outputTokens={query.outputTokens}
								/>
							</article>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function Metric({
	label,
	value,
	format,
}: {
	label: string;
	value: number;
	format: (value: number) => string;
}) {
	const display = useTweenedNumber(value);
	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle className="text-muted-foreground text-xs font-medium">
					<SaasAdminText>{label}</SaasAdminText>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-semibold tabular-nums">{format(display)}</p>
			</CardContent>
		</Card>
	);
}

function useTweenedNumber(value: number) {
	const quiet = useQuietMotion();
	const [display, setDisplay] = useState(value);
	const fromRef = useRef(value);

	useEffect(() => {
		if (quiet) {
			fromRef.current = value;
			setDisplay(value);
			return;
		}
		const controls = animate(fromRef.current, value, {
			duration: 0.4,
			ease: EASE_OUT,
			onUpdate: (next) => setDisplay(next),
		});
		fromRef.current = value;
		return () => controls.stop();
	}, [value, quiet]);

	return display;
}
