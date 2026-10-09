"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	imageImagesWidgetsBitbankWebp,
	imageImagesWidgetsZipcarWebp,
} from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/app/(pages)/dashboard/orders/page.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import { TruckIcon, TriangleAlertIcon, CalendarX2Icon } from "lucide-react";

import { Card } from "@/components/ui/card";

import { ProductInsightsCard } from "@/components/pages/saas-admin/views/dashboards/widgets/widget-product-insights";
import { SalesMetricsCard } from "@/components/pages/saas-admin/views/dashboards/charts/chart-sales-metrics";
import { StatisticsCard } from "@/components/pages/saas-admin/views/dashboards/statistics/statistics-card-01";
import { TotalEarningCard } from "@/components/pages/saas-admin/views/dashboards/widgets/widget-total-earning";
import { TransactionDatatable } from "@/components/pages/saas-admin/views/datatables/datatable-transaction";

// Statistics card data
const StatisticsCardData = [
	{
		icon: <TruckIcon className="size-4" />,
		value: "42",
		title: "Shipped Orders",
		changePercentage: "+18.2%",
	},
	{
		icon: <TriangleAlertIcon className="size-4" />,
		value: "8",
		title: "Damaged Returns",
		changePercentage: "-8.7%",
	},
	{
		icon: <CalendarX2Icon className="size-4" />,
		value: "27",
		title: "Missed Delivery Slots",
		changePercentage: "+4.3%",
	},
];

// Earning data for Total Earning card
const earningData = [
	{
		img: imageImagesWidgetsZipcarWebp,
		platform: "Zipcar",
		technologies: "Vuejs & HTML",
		earnings: "-$23,569.26",
		progressPercentage: 75,
	},
	{
		img: imageImagesWidgetsBitbankWebp,
		platform: "Bitbank",
		technologies: "Figma & React",
		earnings: "-$12,650.31",
		progressPercentage: 25,
	},
];

// Transaction table data

const OrdersDashboard = () => {
	const { t, transactions } = useSaasAdmin();

	return (
		<div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
			{/* Statistics Cards */}
			<div className="col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1">
				<SaasAdminText>
					{StatisticsCardData.map((card, index) => (
						<StatisticsCard
							key={card.title}
							icon={card.icon}
							title={card.title}
							value={card.value}
							changePercentage={card.changePercentage}
						/>
					))}
				</SaasAdminText>
			</div>

			<div className="grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2">
				{/* Product Insights Card */}
				<ProductInsightsCard className="justify-between gap-3 *:data-[slot=card-content]:space-y-5" />

				{/* Total Earning Card */}
				<TotalEarningCard
					title={t("Total Earning")}
					earning={24650}
					trend="up"
					percentage={10}
					comparisonText="Compare to last year ($84,325)"
					earningData={earningData}
					className="justify-between gap-5 sm:min-w-0"
				/>
			</div>

			<SalesMetricsCard className="col-span-full *:data-[slot=card-content]:space-y-6 xl:col-span-2" />

			<Card className="col-span-full w-full py-0">
				<TransactionDatatable data={transactions} />
			</Card>
		</div>
	);
};

export { OrdersDashboard };
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
