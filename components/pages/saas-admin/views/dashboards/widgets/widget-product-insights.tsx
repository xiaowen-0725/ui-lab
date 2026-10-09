"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import { imageImagesWidgetsImage7Webp } from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/dashboards/widgets/widget-product-insights.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Third-party Imports
import { Bar, BarChart } from "recharts";

// Component Imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

// Product reached data
const productReachChartData = [
	{ month: "January", reached: 168 },
	{ month: "February", reached: 305 },
	{ month: "March", reached: 213 },
	{ month: "April", reached: 330 },
	{ month: "May", reached: 305 },
];

const productReachChartConfig = {
	reached: {
		label: "Reached",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

// Order placed data
const orderPlacedChartData = [
	{ month: "January", orders: 168 },
	{ month: "February", orders: 305 },
	{ month: "March", orders: 213 },
	{ month: "April", orders: 330 },
	{ month: "May", orders: 305 },
];

const orderPlacedChartConfig = {
	orders: {
		label: "Orders",
		color: "color-mix(in oklab, var(--primary) 10%, transparent)",
	},
} satisfies ChartConfig;

const ProductInsightsCard = ({ className }: { className?: string }) => {
	const { t } = useSaasAdmin();

	return (
		<Card className={className}>
			<CardHeader className="flex justify-between">
				<div className="flex flex-col gap-1">
					<span className="text-lg font-semibold">
						<SaasAdminText>{"Product insight"}</SaasAdminText>
					</span>
					<span className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Published on 12 MAY 2025 - 6:10 PM"}
						</SaasAdminText>
					</span>
				</div>
				<img
					src={imageImagesWidgetsImage7Webp}
					alt={t("Product")}
					width={164}
					height={128}
					className="w-20.5 h-auto rounded-md"
				/>
			</CardHeader>
			<CardContent className="block">
				<Separator />
			</CardContent>
			<CardContent className="block space-y-4">
				<div className="flex items-center justify-between gap-1">
					<div className="flex flex-col gap-1">
						<span className="text-xs">
							<SaasAdminText>{"Product reached"}</SaasAdminText>
						</span>
						<span className="text-2xl font-semibold">
							<SaasAdminText>{"21,153"}</SaasAdminText>
						</span>
					</div>
					<ChartContainer
						config={productReachChartConfig}
						className="min-h-13 max-w-18"
					>
						<BarChart
							accessibilityLayer
							data={productReachChartData}
							barSize={8}
						>
							<Bar dataKey="reached" fill="var(--color-reached)" radius={2} />
						</BarChart>
					</ChartContainer>
				</div>

				<div className="flex items-center justify-between gap-1">
					<div className="flex flex-col gap-1">
						<span className="text-xs">
							<SaasAdminText>{"Order placed "}</SaasAdminText>
						</span>
						<span className="text-2xl font-semibold">
							<SaasAdminText>{"2,123"}</SaasAdminText>
						</span>
					</div>
					<ChartContainer
						config={orderPlacedChartConfig}
						className="min-h-13 max-w-18"
					>
						<BarChart
							accessibilityLayer
							data={orderPlacedChartData}
							barSize={8}
						>
							<Bar dataKey="orders" fill="var(--color-orders)" radius={2} />
						</BarChart>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export { ProductInsightsCard };
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
