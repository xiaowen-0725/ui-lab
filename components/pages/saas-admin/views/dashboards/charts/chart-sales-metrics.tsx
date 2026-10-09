"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import { imageImagesBrandsLogoSquareWebp } from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/dashboards/charts/chart-sales-metrics.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Third-party Imports
import { Bar, BarChart, Label, Pie, PieChart } from "recharts";
import {
	TrendingUpIcon,
	BadgePercentIcon,
	DollarSignIcon,
	ShoppingBagIcon,
	ChartNoAxesCombinedIcon,
	CirclePercentIcon,
} from "lucide-react";

// Component Imports
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const salesPlanPercentage = 54;
const totalBars = 24;
const filledBars = Math.round((salesPlanPercentage * totalBars) / 100);

// Sales chart data
const salesChartData = Array.from({ length: totalBars }, (_, index) => {
	const date = new Date(2025, 5, 15);

	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	return {
		date: formattedDate,
		sales: index < filledBars ? 315 : 0.0001,
	};
});

const salesChartConfig = {
	sales: {
		label: "Sales",
	},
} satisfies ChartConfig;

const MetricsData = [
	{
		icons: <TrendingUpIcon className="size-5" />,
		title: "Sales trend",
		value: "$11,548",
	},
	{
		icons: <BadgePercentIcon className="size-5" />,
		title: "Discount offers",
		value: "$1,326",
	},
	{
		icons: <DollarSignIcon className="size-5" />,
		title: "Net profit",
		value: "$17,356",
	},
	{
		icons: <ShoppingBagIcon className="size-5" />,
		title: "Total orders",
		value: "248",
	},
];

const revenueChartData = [
	{ month: "january", sales: 340, fill: "var(--color-january)" },
	{ month: "february", sales: 200, fill: "var(--color-february)" },
	{ month: "march", sales: 200, fill: "var(--color-march)" },
];

const revenueChartConfig = {
	sales: {
		label: "Sales",
	},
	january: {
		label: "January",
		color: "var(--primary)",
	},
	february: {
		label: "February",
		color: "color-mix(in oklab, var(--primary) 60%, transparent)",
	},
	march: {
		label: "March",
		color: "color-mix(in oklab, var(--primary) 20%, transparent)",
	},
} satisfies ChartConfig;

const SalesMetricsCard = ({ className }: { className?: string }) => {
	const { t } = useSaasAdmin();

	return (
		<Card className={className}>
			<CardContent className="block">
				<div className="grid gap-6 lg:grid-cols-5">
					<div className="flex flex-col justify-between gap-7 lg:col-span-3">
						<span className="text-lg font-semibold">
							<SaasAdminText>{"Sales metrics"}</SaasAdminText>
						</span>
						<div className="flex items-center gap-3">
							<img
								width={42}
								height={42}
								src={imageImagesBrandsLogoSquareWebp}
								className="size-10.5 rounded-lg"
								alt={t("logo")}
							/>
							<div className="flex flex-col gap-0.5">
								<span className="text-xl font-medium">
									<SaasAdminText>{"Sandy' Company"}</SaasAdminText>
								</span>
								<span className="text-muted-foreground text-sm">
									<SaasAdminText>{"sandy@company.com"}</SaasAdminText>
								</span>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							{MetricsData.map((metric, index) => (
								<Card
									key={metric.title}
									className="ring-foreground/10 py-2 shadow-none ring-1"
								>
									<CardContent className="flex-row flex items-center gap-3 px-4">
										<Avatar className="rounded-sm after:border-0">
											<AvatarFallback className="bg-primary/10 text-primary shrink-0 rounded-sm">
												<SaasAdminText>{metric.icons}</SaasAdminText>
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col gap-0.5">
											<span className="text-muted-foreground text-sm font-medium">
												<SaasAdminText>{metric.title}</SaasAdminText>
											</span>
											<span className="text-lg font-medium">
												<SaasAdminText>{metric.value}</SaasAdminText>
											</span>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
					<Card className="ring-foreground/10 justify-between gap-4 shadow-none ring-1 lg:col-span-2">
						<CardHeader className="gap-1">
							<CardTitle className="text-lg font-semibold">
								<SaasAdminText>{"Revenue goal"}</SaasAdminText>
							</CardTitle>
						</CardHeader>

						<CardContent className="block space-y-4">
							<ChartContainer
								config={revenueChartConfig}
								className="h-38.5 w-full"
							>
								<PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={revenueChartData}
										dataKey="sales"
										nameKey="month"
										startAngle={300}
										endAngle={660}
										innerRadius={58}
										outerRadius={75}
										paddingAngle={2}
									>
										<Label
											content={({ viewBox }) => {
												if (viewBox && "cx" in viewBox && "cy" in viewBox) {
													return (
														<text
															x={viewBox.cx}
															y={viewBox.cy}
															textAnchor="middle"
															dominantBaseline="middle"
														>
															<tspan
																x={viewBox.cx}
																y={(viewBox.cy || 0) - 12}
																className="fill-card-foreground text-lg font-medium"
															>
																<SaasAdminText>{"256.24"}</SaasAdminText>
															</tspan>
															<tspan
																x={viewBox.cx}
																y={(viewBox.cy || 0) + 19}
																className="fill-muted-foreground text-sm"
															>
																<SaasAdminText>{"Total Profit"}</SaasAdminText>
															</tspan>
														</text>
													);
												}
											}}
										/>
									</Pie>
								</PieChart>
							</ChartContainer>
							<div className="flex items-center justify-between">
								<span className="text-xl">
									<SaasAdminText>{"Plan completed"}</SaasAdminText>
								</span>
								<span className="text-2xl font-medium">
									<SaasAdminText>{"56%"}</SaasAdminText>
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</CardContent>
			<CardContent className="block">
				<Card className="ring-foreground/10 shadow-none ring-1">
					<CardContent className="grid gap-4 lg:grid-cols-5">
						<div className="flex flex-col justify-center gap-6">
							<span className="text-lg font-semibold">
								<SaasAdminText>{"Sales plan"}</SaasAdminText>
							</span>
							<span className="max-lg:5xl text-6xl">
								<SaasAdminText>{salesPlanPercentage}</SaasAdminText>
								<SaasAdminText>{"%"}</SaasAdminText>
							</span>
							<span className="text-muted-foreground text-sm">
								<SaasAdminText>
									{"Percentage profit from total sales"}
								</SaasAdminText>
							</span>
						</div>
						<div className="flex flex-col gap-6 text-lg md:col-span-4">
							<span className="font-medium">
								<SaasAdminText>{"Cohort analysis indicators"}</SaasAdminText>
							</span>
							<span className="text-muted-foreground text-wrap">
								<SaasAdminText>
									{
										"Analyzes the behaviour of a group of users who joined a product/service at the same time. over a certain period."
									}
								</SaasAdminText>
							</span>
							<div className="grid gap-6 md:grid-cols-2">
								<div className="flex items-center gap-2">
									<ChartNoAxesCombinedIcon className="size-6" />
									<span className="text-lg font-medium">
										<SaasAdminText>{"Open Statistics"}</SaasAdminText>
									</span>
								</div>
								<div className="flex items-center gap-2">
									<CirclePercentIcon className="size-6" />
									<span className="text-lg font-medium">
										<SaasAdminText>{"Percentage Change"}</SaasAdminText>
									</span>
								</div>
							</div>

							<ChartContainer
								config={salesChartConfig}
								className="h-7.75 w-full"
							>
								<BarChart
									accessibilityLayer
									data={salesChartData}
									margin={{
										left: 0,
										right: 0,
									}}
									maxBarSize={16}
								>
									<Bar
										dataKey="sales"
										fill="var(--primary)"
										background={{
											fill: "color-mix(in oklab, var(--primary) 10%, transparent)",
											radius: 12,
										}}
										radius={12}
									/>
								</BarChart>
							</ChartContainer>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
};

export { SalesMetricsCard };
/*
MIT License

Copyright (c) 2026 shadcn/studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
