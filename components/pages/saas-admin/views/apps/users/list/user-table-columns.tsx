"use client";
import { useState } from "react";
import { DeleteConfirmation } from "@/components/pages/saas-admin/blocks/delete-confirmation";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/list/user-table-columns.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import type { ReactNode } from "react";

// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

// Third-party Imports
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	BrushIcon,
	CrownIcon,
	EllipsisVerticalIcon,
	EyeIcon,
	PencilIcon,
	PencilLineIcon,
	PencilRulerIcon,
	Trash2Icon,
	UserCheckIcon,
	UserRoundIcon,
	UserXIcon,
} from "lucide-react";

// Type Imports
import type {
	AppUser,
	UserBilling,
	UserRole,
	UserStatus,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Config Imports
import { getInitialsFromName } from "@/components/pages/saas-admin/configs/mailConfig";

// Util Imports
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<UserRole, ReactNode> = {
	Admin: (
		<UserRoundIcon className="size-4 text-green-800 dark:text-green-400" />
	),
	Editor: <BrushIcon className="text-chart-2 size-4" />,
	Subscriber: <CrownIcon className="text-chart-5 size-4" />,
	Maintainer: <PencilRulerIcon className="text-chart-3 size-4" />,
	Guest: <PencilLineIcon className="text-chart-1 size-4" />,
};

const STATUS_STYLES: Record<UserStatus, string> = {
	Active:
		"bg-green-600/10 text-green-800 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5",
	Pending:
		"bg-amber-600/10 text-amber-800 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5",
	Suspended:
		"bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-red-800 dark:text-red-300",
	Inactive:
		"bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-red-800 dark:text-red-300",
};

const formatBilling = (billing: UserBilling): string => {
	if (billing === "Auto Debit") {
		return "Auto debit";
	}

	if (billing === "Credit Card") {
		return "Credit Card";
	}

	return "Manual - PayPal";
};

function UserRowActions({ user }: { user: AppUser }) {
	const { t, setUsers } = useSaasAdmin();
	const [deleting, setDeleting] = useState(false);

	return (
		<div className="flex items-center gap-1">
			<DeleteConfirmation
				open={deleting}
				onOpenChange={setDeleting}
				name={user.name}
				onConfirm={() => {
					setUsers((previous) =>
						previous.filter((item) => item.id !== user.id),
					);
					setDeleting(false);
				}}
			/>
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							aria-label={t("View user")}
							render={
								<Link
									href={`/apps/users/view?user=${encodeURIComponent(user.id)}`}
								/>
							}
							nativeButton={false}
						/>
					}
				>
					<EyeIcon className="size-4.5" />
				</TooltipTrigger>
				<TooltipContent>
					<p>
						<SaasAdminText>{"View"}</SaasAdminText>
					</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							aria-label={t("Delete user")}
							onClick={() => setDeleting(true)}
						/>
					}
				>
					<Trash2Icon className="size-4.5" />
				</TooltipTrigger>
				<TooltipContent>
					<p>
						<SaasAdminText>{"Delete"}</SaasAdminText>
					</p>
				</TooltipContent>
			</Tooltip>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							size="icon"
							variant="ghost"
							aria-label={t("Open actions")}
						/>
					}
				>
					<EllipsisVerticalIcon className="size-4.5" aria-hidden="true" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem
							render={
								<Link
									href={`/apps/users/view?user=${encodeURIComponent(user.id)}&edit=1`}
								/>
							}
						>
							<PencilIcon className="size-4" />
							<SaasAdminText>{"Edit User"}</SaasAdminText>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{user.status !== "Suspended" ? (
							<DropdownMenuItem
								onClick={() =>
									setUsers((previous) =>
										previous.map((item) =>
											item.id === user.id
												? { ...item, status: "Suspended" }
												: item,
										),
									)
								}
							>
								<UserXIcon className="size-4" />
								<SaasAdminText>{"Suspend"}</SaasAdminText>
							</DropdownMenuItem>
						) : null}
						{user.status !== "Active" ? (
							<DropdownMenuItem
								onClick={() =>
									setUsers((previous) =>
										previous.map((item) =>
											item.id === user.id
												? { ...item, status: "Active" }
												: item,
										),
									)
								}
							>
								<UserCheckIcon className="size-4" />
								<SaasAdminText>{"Activate"}</SaasAdminText>
							</DropdownMenuItem>
						) : null}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							onClick={() => setDeleting(true)}
						>
							<Trash2Icon className="size-4" />
							<SaasAdminText>{"Delete"}</SaasAdminText>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export const userTableColumns: ColumnDef<AppUser>[] = [
	{
		id: "user",
		header: "User",
		accessorKey: "name",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-9">
					{row.original.avatar ? (
						<AvatarImage src={row.original.avatar} alt={row.original.name} />
					) : null}
					<AvatarFallback className="text-xs">
						<SaasAdminText>
							{getInitialsFromName(row.original.name)}
						</SaasAdminText>
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="font-medium">
						<SaasAdminText>{row.original.name}</SaasAdminText>
					</span>
					<span className="text-muted-foreground">
						<SaasAdminText>{row.original.email}</SaasAdminText>
					</span>
				</div>
			</div>
		),
		size: 360,
		enableSorting: true,
	},
	{
		id: "role",
		header: "Role",
		accessorKey: "role",
		cell: ({ row }) => {
			const role = row.original.role;

			return (
				<div className="flex items-center gap-2">
					<SaasAdminText>{ROLE_ICONS[role]}</SaasAdminText>
					<span className="capitalize">
						<SaasAdminText>{role}</SaasAdminText>
					</span>
				</div>
			);
		},
		enableSorting: true,
	},
	{
		id: "plan",
		header: "Plan",
		accessorKey: "plan",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				<SaasAdminText>{row.original.plan}</SaasAdminText>
			</span>
		),
		enableSorting: true,
	},
	{
		id: "billing",
		header: "Billing",
		accessorKey: "billing",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				<SaasAdminText>{formatBilling(row.original.billing)}</SaasAdminText>
			</span>
		),
		enableSorting: true,
	},
	{
		id: "status",
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => {
			const status = row.original.status;

			return (
				<Badge
					className={cn(
						"h-auto rounded-sm border-none capitalize focus-visible:outline-none",
						STATUS_STYLES[status],
					)}
				>
					<SaasAdminText>{status}</SaasAdminText>
				</Badge>
			);
		},
		enableSorting: true,
	},
	{
		id: "joinedDate",
		header: "Joined Date",
		accessorKey: "joinedDate",
		cell: ({ row }) => (
			<span>
				<SaasAdminText>
					{format(new Date(row.original.joinedDate), "dd MMM yyyy")}
				</SaasAdminText>
			</span>
		),
		enableSorting: true,
	},
	{
		id: "actions",
		header: () => <SaasAdminText>{"Actions"}</SaasAdminText>,
		cell: ({ row }) => <UserRowActions user={row.original} />,
		enableHiding: false,
		enableSorting: false,
	},
];

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
