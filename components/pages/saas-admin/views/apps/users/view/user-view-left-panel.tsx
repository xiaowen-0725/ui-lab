"use client";
// Third-party Imports
import { CheckSquareIcon, LayoutGridIcon } from "lucide-react";
// Config Imports
import { getInitialsFromName } from "@/components/pages/saas-admin/configs/mailConfig";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Type Imports
import type {
	AppUser,
	UserStatus,
} from "@/components/pages/saas-admin/types/apps/user-types";
// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/user-view-left-panel.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	AdminSubmitFeedback,
	useAdminSubmit,
} from "@/components/pages/saas-admin/use-submit";
// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Util Imports
import { cn } from "@/lib/utils";

const STATUS_DOT_STYLES: Record<UserStatus, string> = {
	Active: "bg-green-500",
	Pending: "bg-amber-500",
	Suspended: "bg-destructive",
	Inactive: "bg-muted-foreground",
};

const formatCompactNumber = (value: number | undefined): string => {
	if (value === undefined) {
		return "—";
	}

	if (value >= 1000) {
		return `${(value / 1000).toFixed(2)}k`;
	}

	return String(value);
};

export interface UserViewLeftPanelProps {
	user: AppUser;
	onEdit: () => void;
}

export function UserViewLeftPanel({ user, onEdit }: UserViewLeftPanelProps) {
	const { setUsers } = useSaasAdmin();
	const action = useAdminSubmit("users.status");
	const detailRows = [
		{ label: "Username", value: user.username ?? "—" },
		{ label: "Email", value: user.email },
		{ label: "Status", value: user.status, isStatus: true },
		{ label: "Role", value: user.role },
		{ label: "Tax ID", value: user.taxId ?? "—" },
		{ label: "Contact", value: user.contact ?? "—" },
		{ label: "Language", value: user.language ?? "—" },
		{ label: "Country", value: user.country ?? "—" },
	] as const;

	return (
		<Card className="overflow-y-auto lg:sticky lg:top-20 lg:h-[calc(100dvh-7.5rem)]">
			<CardContent className="block space-y-6 pt-6">
				<div className="flex flex-col items-center text-center">
					<Avatar className="size-24">
						{user.avatar ? (
							<AvatarImage src={user.avatar} alt={user.name} />
						) : null}
						<AvatarFallback className="text-2xl">
							<SaasAdminText>{getInitialsFromName(user.name)}</SaasAdminText>
						</AvatarFallback>
					</Avatar>
					<h2 className="mt-4 line-clamp-4 text-xl font-semibold">
						<SaasAdminText>{user.name}</SaasAdminText>
					</h2>
					<Badge variant="secondary" className="mt-2">
						<SaasAdminText>{user.role}</SaasAdminText>
					</Badge>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="bg-muted/40 flex flex-col items-center rounded-lg border p-4 text-center">
						<CheckSquareIcon className="text-primary mb-2 size-5" />
						<span className="text-lg font-semibold">
							<SaasAdminText>
								{formatCompactNumber(user.tasksDone)}
							</SaasAdminText>
						</span>
						<span className="text-muted-foreground text-xs">
							<SaasAdminText>{"Task Done"}</SaasAdminText>
						</span>
					</div>
					<div className="bg-muted/40 flex flex-col items-center rounded-lg border p-4 text-center">
						<LayoutGridIcon className="text-primary mb-2 size-5" />
						<span className="text-lg font-semibold">
							<SaasAdminText>
								{formatCompactNumber(user.projectsDone)}
							</SaasAdminText>
						</span>
						<span className="text-muted-foreground text-xs">
							<SaasAdminText>{"Project Done"}</SaasAdminText>
						</span>
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="text-sm font-semibold">
						<SaasAdminText>{"Details"}</SaasAdminText>
					</h3>
					<Separator />
					{detailRows.map((row) => (
						<div
							key={row.label}
							className="flex items-center justify-between gap-4 text-sm"
						>
							<span className="text-muted-foreground">
								<SaasAdminText>{row.label}</SaasAdminText>
							</span>
							{"isStatus" in row && row.isStatus ? (
								<span className="flex items-center gap-2 font-medium">
									<span
										className={cn(
											"size-2 rounded-full",
											STATUS_DOT_STYLES[user.status],
										)}
									/>
									<SaasAdminText>{row.value}</SaasAdminText>
								</span>
							) : (
								<span className="truncate text-right font-medium">
									<SaasAdminText>{row.value}</SaasAdminText>
								</span>
							)}
						</div>
					))}
				</div>

				<AdminSubmitFeedback {...action} />
				<div className="flex gap-2 max-sm:flex-col">
					<Button className="sm:flex-1" onClick={onEdit}>
						<SaasAdminText>{"Edit"}</SaasAdminText>
					</Button>
					<Button
						variant="outline"
						disabled={action.pending}
						onClick={async () => {
							const status =
								user.status === "Suspended" ? "Active" : "Suspended";
							if (await action.run({ userId: user.id, status }))
								setUsers((previous) =>
									previous.map((entry) =>
										entry.id === user.id ? { ...entry, status } : entry,
									),
								);
						}}
						className="text-red-800 dark:text-red-300 hover:bg-destructive/10 hover:text-red-800 dark:text-red-300 sm:flex-1"
					>
						<SaasAdminText>
							{user.status === "Suspended" ? "Activate" : "Suspend"}
						</SaasAdminText>
					</Button>
				</div>
			</CardContent>
		</Card>
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
