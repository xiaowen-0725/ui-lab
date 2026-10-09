"use client";
import { DeleteConfirmation } from "@/components/pages/saas-admin/blocks/delete-confirmation";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	imageImagesDatatableImage1Webp,
	imageImagesDatatableImage2Webp,
} from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/datatables/datatable-transaction.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
import { useState } from "react";

import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisVerticalIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { usePagination } from "@/components/pages/saas-admin/hooks/use-pagination";

import type { Item } from "@/components/pages/saas-admin/types/transaction-types";
export type { Item } from "@/components/pages/saas-admin/types/transaction-types";

export const columns: ColumnDef<Item>[] = [
	{
		accessorKey: "name",
		header: "Customer",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-9">
					<AvatarImage src={row.original.avatar} alt={row.original.name} />
					<AvatarFallback className="text-xs">
						<SaasAdminText>{row.original.avatarFallback}</SaasAdminText>
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col text-sm">
					<span className="text-card-foreground font-medium">
						<SaasAdminText>{row.getValue("name")}</SaasAdminText>
					</span>
					<span className="text-muted-foreground">
						<SaasAdminText>{row.original.email}</SaasAdminText>
					</span>
				</div>
			</div>
		),
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const { locale } = useSaasAdmin();
			const navigatorLocale = locale === "zh" ? "zh-CN" : "en-US";
			const amount = parseFloat(row.getValue("amount"));

			const formatted = new Intl.NumberFormat(navigatorLocale, {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return (
				<span>
					<SaasAdminText>{formatted}</SaasAdminText>
				</span>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge className="bg-primary/10 text-primary h-auto rounded-sm px-1.5 capitalize">
				<SaasAdminText>{row.getValue("status")}</SaasAdminText>
			</Badge>
		),
	},
	{
		accessorKey: "paidBy",
		header: () => (
			<span className="w-fit">
				<SaasAdminText>{"Paid by"}</SaasAdminText>
			</span>
		),
		cell: ({ row }) => (
			<img
				src={
					row.getValue("paidBy") === "mastercard"
						? imageImagesDatatableImage1Webp
						: imageImagesDatatableImage2Webp
				}
				alt="Payment platform"
				width={63}
				height={42}
				className="w-10.5 h-auto"
			/>
		),
	},
	{
		id: "actions",
		header: () => <SaasAdminText>{"Actions"}</SaasAdminText>,
		cell: ({ row }) => <RowActions item={row.original} />,
		size: 60,
		enableHiding: false,
	},
];

const TransactionDatatable = ({ data }: { data: Item[] }) => {
	const { t } = useSaasAdmin();

	const pageSize = 5;

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: pageSize,
	});

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
	});

	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage: table.getState().pagination.pageIndex + 1,
		totalPages: table.getPageCount(),
		paginationItemsToDisplay: 2,
	});

	return (
		<div className="w-full">
			<div className="border-b">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-muted-foreground h-14 first:pl-4"
										>
											<SaasAdminText>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</SaasAdminText>
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="first:pl-4">
											<SaasAdminText>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</SaasAdminText>
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<SaasAdminText>{"No results."}</SaasAdminText>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
				<p
					className="text-muted-foreground text-sm whitespace-nowrap"
					aria-live="polite"
				>
					<SaasAdminText>{"Showing"}</SaasAdminText>
					<SaasAdminText> </SaasAdminText>
					<span>
						<SaasAdminText>
							{table.getRowCount() === 0
								? 0
								: table.getState().pagination.pageIndex *
										table.getState().pagination.pageSize +
									1}
						</SaasAdminText>{" "}
						<SaasAdminText>{" to"}</SaasAdminText>
						<SaasAdminText> </SaasAdminText>
						<SaasAdminText>
							{Math.min(
								Math.max(
									table.getState().pagination.pageIndex *
										table.getState().pagination.pageSize +
										table.getState().pagination.pageSize,
									0,
								),
								table.getRowCount(),
							)}
						</SaasAdminText>
					</span>
					<SaasAdminText> </SaasAdminText>
					<SaasAdminText>{"of "}</SaasAdminText>
					<span>
						<SaasAdminText>{table.getRowCount().toString()}</SaasAdminText>{" "}
						<SaasAdminText>{" entries"}</SaasAdminText>
					</span>
				</p>

				<div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<Button
									className="disabled:pointer-events-none disabled:opacity-50"
									variant="ghost"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label={t("Go to previous page")}
								>
									<ChevronLeftIcon aria-hidden="true" />
									<SaasAdminText>{"Previous"}</SaasAdminText>
								</Button>
							</PaginationItem>

							{showLeftEllipsis && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}

							{pages.map((page) => {
								const isActive =
									page === table.getState().pagination.pageIndex + 1;

								return (
									<PaginationItem key={page}>
										<Button
											size="icon"
											className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
											onClick={() => table.setPageIndex(page - 1)}
											aria-current={isActive ? "page" : undefined}
										>
											<SaasAdminText>{page}</SaasAdminText>
										</Button>
									</PaginationItem>
								);
							})}

							{showRightEllipsis && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}

							<PaginationItem>
								<Button
									className="disabled:pointer-events-none disabled:opacity-50"
									variant="ghost"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									aria-label={t("Go to next page")}
								>
									<SaasAdminText>{"Next"}</SaasAdminText>
									<ChevronRightIcon aria-hidden="true" />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
};

export { TransactionDatatable };
function RowActions({ item }: { item: Item }) {
	const { setTransactions } = useSaasAdmin();
	const [deleting, setDeleting] = useState(false);
	const perform = async (operation: string) => {
		const target = { ...item };
		if (!(await action.run({ action: operation, item: target }))) return;
		if (operation === "delete") {
			setDeleting(false);
			setTransactions((previous) =>
				previous.filter((entry) => entry.id !== target.id),
			);
		}
		if (operation === "duplicate")
			setTransactions((previous) => [
				...previous,
				{ ...target, id: crypto.randomUUID() },
			]);
	};
	const action = useAdminSubmit("orders.action");
	const { t } = useSaasAdmin();

	return (
		<>
			<DeleteConfirmation
				open={deleting}
				onOpenChange={setDeleting}
				name={item.name}
				pending={action.pending}
				error={action.error}
				onConfirm={async () => {
					await perform("delete");
				}}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button size="icon" variant="ghost" aria-label={t("Edit item")} />
					}
				>
					<EllipsisVerticalIcon className="size-5" aria-hidden="true" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem
							disabled={action.pending}
							onClick={() => void perform("edit")}
						>
							<span>
								<SaasAdminText>{"Edit"}</SaasAdminText>
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={action.pending}
							onClick={() => void perform("duplicate")}
						>
							<span>
								<SaasAdminText>{"Duplicate"}</SaasAdminText>
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							disabled={action.pending}
							onClick={() => setDeleting(true)}
						>
							<span>
								<SaasAdminText>{"Delete"}</SaasAdminText>
							</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			{!deleting && <AdminSubmitFeedback {...action} />}
		</>
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
