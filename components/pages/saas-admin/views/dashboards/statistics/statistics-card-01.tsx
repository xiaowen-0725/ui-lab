"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/dashboards/statistics/statistics-card-01.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Type Imports
import type { ReactNode } from "react";

// Component Imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Statistics card data type
type StatisticsCardProps = {
	icon: ReactNode;
	value: string;
	title: string;
	changePercentage: string;
	className?: string;
};

const StatisticsCard = ({
	icon,
	value,
	title,
	changePercentage,
	className,
}: StatisticsCardProps) => {
	return (
		<Card className={className}>
			<CardHeader className="flex items-center gap-2">
				<div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
					<SaasAdminText>{icon}</SaasAdminText>
				</div>
				<span className="text-2xl">
					<SaasAdminText>{value}</SaasAdminText>
				</span>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<span className="text-base font-semibold">
					<SaasAdminText>{title}</SaasAdminText>
				</span>
				<p className="space-x-2">
					<span>
						<SaasAdminText>{changePercentage}</SaasAdminText>
					</span>
					<span className="text-muted-foreground">
						<SaasAdminText>{"than last week"}</SaasAdminText>
					</span>
				</p>
			</CardContent>
		</Card>
	);
};

export { StatisticsCard };
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
