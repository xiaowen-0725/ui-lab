"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/dashboards/widgets/widget-total-earning.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Third-party Imports
import {
	EllipsisVerticalIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from "lucide-react";

// Component Imports
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const listItems = ["Share", "Update", "Refresh"];

type Props = {
	title: string;
	earning: number;
	trend: "up" | "down";
	percentage: number;
	comparisonText: string;
	earningData: {
		img: string;
		platform: string;
		technologies: string;
		earnings: string;
		progressPercentage: number;
	}[];
	className?: string;
};

const TotalEarningCard = ({
	earningData,
	title,
	earning,
	trend,
	percentage,
	comparisonText,
	className,
}: Props) => {
	const { t } = useSaasAdmin();
	const action = useAdminSubmit("orders.earning");
	return (
		<Card className={className}>
			<CardContent className="flex flex-col gap-6">
				<span className="flex items-center justify-between">
					<div className="text-lg font-semibold">
						<SaasAdminText>{title}</SaasAdminText>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground size-6 rounded-full"
								/>
							}
						>
							<EllipsisVerticalIcon />
							<span className="sr-only">
								<SaasAdminText>{"Menu"}</SaasAdminText>
							</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuGroup>
								{listItems.map((item) => (
									<DropdownMenuItem
										key={item}
										disabled={action.pending}
										onClick={() =>
											void action.run({ operation: item.toLowerCase() })
										}
									>
										<SaasAdminText>{item}</SaasAdminText>
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</span>
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className="text-2xl font-semibold">
							<SaasAdminText>{"$"}</SaasAdminText>
							<SaasAdminText>{earning}</SaasAdminText>
						</span>
						<span className="flex items-center gap-1">
							{trend === "up" ? (
								<ChevronUpIcon className="size-4" />
							) : (
								<ChevronDownIcon className="size-4" />
							)}
							<span className="text-sm">
								<SaasAdminText>{percentage}</SaasAdminText>
								<SaasAdminText>{"%"}</SaasAdminText>
							</span>
						</span>
					</div>
					<span className="text-muted-foreground text-sm">
						<SaasAdminText>{comparisonText}</SaasAdminText>
					</span>
				</div>
			</CardContent>
			<CardContent className="flex flex-1 flex-col gap-4">
				<div className="flex flex-1 flex-col justify-evenly gap-4">
					{earningData.map((earning, index) => (
						<div
							key={earning.platform}
							className="flex items-center justify-between gap-2.5"
						>
							<div className="flex items-center justify-between gap-2.5">
								<Avatar className="size-11 rounded-sm after:rounded-[inherit] after:border-0">
									<AvatarFallback className="bg-primary/10 shrink-0 rounded-sm">
										<img
											width={24}
											height={24}
											src={earning.img}
											alt={earning.platform}
											className="size-6"
										/>
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col gap-1">
									<span className="text-base font-medium">
										<SaasAdminText>{earning.platform}</SaasAdminText>
									</span>
									<span className="text-muted-foreground text-sm">
										<SaasAdminText>{earning.technologies}</SaasAdminText>
									</span>
								</div>
							</div>
							<div className="space-y-2">
								<p className="text-sm">
									<SaasAdminText>{earning.earnings}</SaasAdminText>
								</p>
								<Progress
									aria-label={earning.platform}
									value={earning.progressPercentage}
									className="w-36 **:data-[slot=progress-track]:h-1.5"
								/>
							</div>
						</div>
					))}
				</div>
				<AdminSubmitFeedback {...action} error={t(action.error)} />
			</CardContent>
		</Card>
	);
};

export { TotalEarningCard };
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
