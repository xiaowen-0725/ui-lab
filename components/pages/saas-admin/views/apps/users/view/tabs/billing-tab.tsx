"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/tabs/billing-tab.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// Third-party Imports

import { CheckIcon, DownloadIcon } from "lucide-react";

// Type Imports
import type {
	AppUser,
	InvoiceStatus,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Util Imports
import { cn } from "@/lib/utils";

const INVOICE_STATUS_STYLES: Record<InvoiceStatus, string> = {
	paid: "bg-green-600/10 text-green-800 dark:bg-green-400/10 dark:text-green-400",
	pending:
		"bg-amber-600/10 text-amber-800 dark:bg-amber-400/10 dark:text-amber-400",
	cancelled: "bg-destructive/10 text-red-800 dark:text-red-300",
	draft: "bg-muted text-muted-foreground",
};

const formatInvoiceStatus = (status: InvoiceStatus): string => {
	return status.charAt(0).toUpperCase() + status.slice(1);
};

export interface BillingTabProps {
	user: AppUser;
}

export function BillingTab({ user }: BillingTabProps) {
	const { t, locale } = useSaasAdmin();
	const action = useAdminSubmit("users.billing");
	const billingPlan = user.billingPlan;
	const invoices = user.invoices ?? [];
	const daysProgress = billingPlan
		? Math.round((billingPlan.daysUsed / billingPlan.totalDays) * 100)
		: 0;

	return (
		<div className="space-y-6">
			<AdminSubmitFeedback {...action} />
			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						<SaasAdminText>{"Current Plan"}</SaasAdminText>
					</CardTitle>
				</CardHeader>
				<CardContent className="block space-y-6">
					{!billingPlan ? (
						<p className="text-muted-foreground text-sm">
							<SaasAdminText>{"No billing plan assigned."}</SaasAdminText>
						</p>
					) : (
						<>
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<div className="flex items-center gap-2">
										<h3 className="text-lg font-semibold">
											<SaasAdminText>{billingPlan.name}</SaasAdminText>
										</h3>
										{billingPlan.isPopular ? (
											<Badge variant="secondary">
												<SaasAdminText>{"Popular"}</SaasAdminText>
											</Badge>
										) : null}
									</div>
									<p className="text-muted-foreground mt-1 text-sm">
										<SaasAdminText>{user.plan}</SaasAdminText>{" "}
										<SaasAdminText>{" plan · "}</SaasAdminText>
										<SaasAdminText>{user.billing}</SaasAdminText>
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-semibold">
										<SaasAdminText>{"$"}</SaasAdminText>
										<SaasAdminText>{billingPlan.price}</SaasAdminText>
										<span className="text-muted-foreground text-sm font-normal">
											<SaasAdminText>{"/"}</SaasAdminText>
											<SaasAdminText>{billingPlan.period}</SaasAdminText>
										</span>
									</p>
									<Button
										variant="outline"
										size="sm"
										className="mt-2"
										disabled={action.pending}
										onClick={() =>
											void action.run({ operation: "upgrade", userId: user.id })
										}
									>
										<SaasAdminText>{"Upgrade Plan"}</SaasAdminText>
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										<SaasAdminText>{"Days"}</SaasAdminText>
									</span>
									<span>
										<SaasAdminText>{billingPlan.daysUsed}</SaasAdminText>{" "}
										<SaasAdminText>{" of "}</SaasAdminText>
										<SaasAdminText>{billingPlan.totalDays}</SaasAdminText>{" "}
										<SaasAdminText>{"Days"}</SaasAdminText>
									</span>
								</div>
								<Progress
									aria-label={t("Current Plan")}
									value={daysProgress}
									className="*:data-[slot=progress-track]:h-2"
								/>
								<p className="text-muted-foreground text-xs">
									<SaasAdminText>{daysProgress}</SaasAdminText>
									<SaasAdminText>{"% of billing period used"}</SaasAdminText>
								</p>
							</div>

							<ul className="grid gap-2 sm:grid-cols-2">
								{billingPlan.features.map((feature) => (
									<li
										key={feature}
										className="text-muted-foreground flex items-center gap-2 text-sm"
									>
										<CheckIcon className="text-muted-foreground size-4 shrink-0" />
										<SaasAdminText>{feature}</SaasAdminText>
									</li>
								))}
							</ul>
						</>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						<SaasAdminText>{"Billing Details"}</SaasAdminText>
					</CardTitle>
				</CardHeader>
				<CardContent className="block">
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<p className="text-muted-foreground text-sm">
								<SaasAdminText>{"Company"}</SaasAdminText>
							</p>
							<p className="font-medium">
								<SaasAdminText>{user.company ?? "—"}</SaasAdminText>
							</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								<SaasAdminText>{"Billing Email"}</SaasAdminText>
							</p>
							<p className="font-medium">
								<SaasAdminText>{user.billingEmail ?? user.email}</SaasAdminText>
							</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								<SaasAdminText>{"Tax ID"}</SaasAdminText>
							</p>
							<p className="font-medium">
								<SaasAdminText>{user.taxId ?? "—"}</SaasAdminText>
							</p>
						</div>
						<div>
							<p className="text-muted-foreground text-sm">
								<SaasAdminText>{"Country"}</SaasAdminText>
							</p>
							<p className="font-medium">
								<SaasAdminText>{user.country ?? "—"}</SaasAdminText>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-6 py-4">
					<CardTitle className="text-base">
						<SaasAdminText>{"Invoice History"}</SaasAdminText>
					</CardTitle>
				</CardHeader>
				{invoices.length === 0 ? (
					<CardContent className="block py-8">
						<p className="text-muted-foreground text-sm">
							<SaasAdminText>{"No invoices found."}</SaasAdminText>
						</p>
					</CardContent>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="text-muted-foreground pl-6">
									<SaasAdminText>{"Invoice"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Status"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Total"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Issued Date"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground pr-6 text-right">
									<SaasAdminText>{"Action"}</SaasAdminText>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell className="pl-6 font-medium">
										<SaasAdminText>{invoice.number}</SaasAdminText>
									</TableCell>
									<TableCell>
										<Badge
											className={cn(
												"rounded-sm font-normal capitalize",
												INVOICE_STATUS_STYLES[invoice.status],
											)}
										>
											<SaasAdminText>
												{formatInvoiceStatus(invoice.status)}
											</SaasAdminText>
										</Badge>
									</TableCell>
									<TableCell>
										<SaasAdminText>
											{new Intl.NumberFormat(
												locale === "zh" ? "zh-CN" : "en-US",
												{ style: "currency", currency: "USD" },
											).format(invoice.total)}
										</SaasAdminText>
									</TableCell>
									<TableCell className="text-muted-foreground">
										<SaasAdminText>
											{new Intl.DateTimeFormat(
												locale === "zh" ? "zh-CN" : "en-US",
												{
													month: "short",
													day: "2-digit",
													year: "numeric",
													timeZone: "UTC",
												},
											).format(new Date(invoice.issuedDate))}
										</SaasAdminText>
									</TableCell>
									<TableCell className="pr-6 text-right">
										<Button
											variant="ghost"
											size="icon"
											aria-label={`${t("Download")} ${invoice.number}`}
											disabled={action.pending}
											onClick={() =>
												void action.run({
													operation: "download",
													userId: user.id,
													invoiceId: invoice.id,
												})
											}
										>
											<DownloadIcon className="size-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</Card>
		</div>
	);
}

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
