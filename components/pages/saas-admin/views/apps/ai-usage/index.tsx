"use client";

import { ThreadUsage } from "@/components/motion/agent-thread";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { textFor } from "../surface";
import {
	DAILY_USAGE,
	formatTokens,
	formatUsd,
	MODEL_USAGE,
	RECENT_QUERIES,
	USAGE_SUMMARY,
} from "./data";

const peak = Math.max(...DAILY_USAGE.map((day) => day.tokens));

export function AiUsageApp() {
	const { locale } = useSaasAdmin();

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				<SaasAdminText>
					Sample token spend for the October window. Figures stay in this visit.
				</SaasAdminText>
			</p>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Metric
					label="Requests"
					value={USAGE_SUMMARY.requests.toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}
				/>
				<Metric label="Tokens" value={formatTokens(USAGE_SUMMARY.tokens)} />
				<Metric label="Cost" value={formatUsd(USAGE_SUMMARY.cost)} />
				<Metric
					label="Error rate"
					value={`${(USAGE_SUMMARY.errorRate * 100).toFixed(1)}%`}
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
								{MODEL_USAGE.map((model) => (
									<TableRow key={model.id}>
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
								))}
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
					<CardContent className="space-y-3">
						{DAILY_USAGE.map((day) => (
							<div key={day.date} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
								<span className="text-xs text-muted-foreground">
									{textFor(locale, day.label, day.labelZh)}
								</span>
								<div className="h-2 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-primary"
										style={{ width: `${Math.round((day.tokens / peak) * 100)}%` }}
									/>
								</div>
								<span className="text-right text-xs tabular-nums text-muted-foreground">
									{formatTokens(day.tokens)}
								</span>
							</div>
						))}
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
						{MODEL_USAGE.map((model) => (
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
						{RECENT_QUERIES.map((query) => (
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

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle className="text-muted-foreground text-xs font-medium">
					<SaasAdminText>{label}</SaasAdminText>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-semibold tabular-nums">{value}</p>
			</CardContent>
		</Card>
	);
}
