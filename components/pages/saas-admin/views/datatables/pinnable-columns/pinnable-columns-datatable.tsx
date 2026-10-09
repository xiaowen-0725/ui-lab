"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/datatables/pinnable-columns/pinnable-columns-datatable.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import type { CSSProperties } from "react";
import { useState } from "react";

import type { Column, ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	ArrowLeftFromLineIcon,
	ArrowRightFromLineIcon,
	EllipsisIcon,
	PinOffIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type Product = {
	productId: number;
	productName: string;
	category: string;
	stockQuantity: number;
	price: number;
	supplier: string;
	discontinued: "no" | "yes";
};

const getPinningStyles = (column: Column<Product>): CSSProperties => {
	const isPinned = column.getIsPinned();

	return {
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		position: isPinned ? "sticky" : "relative",
		zIndex: isPinned ? 1 : 0,
	};
};

export const columns: ColumnDef<Product>[] = [
	{
		header: "Product Name",
		accessorKey: "productName",
		cell: ({ row }) => (
			<div className="font-medium">
				<SaasAdminText>{row.getValue("productName")}</SaasAdminText>
			</div>
		),
	},
	{
		header: "Category",
		accessorKey: "category",
		cell: ({ row }) => (
			<div>
				<SaasAdminText>{row.getValue("category")}</SaasAdminText>
			</div>
		),
	},
	{
		header: "Stock Quantity",
		accessorKey: "stockQuantity",
		cell: ({ row }) => (
			<div>
				<SaasAdminText>{row.getValue("stockQuantity")}</SaasAdminText>
			</div>
		),
	},
	{
		header: "Price",
		accessorKey: "price",
		cell: ({ row }) => {
			const { locale } = useSaasAdmin();
			const navigatorLocale = locale === "zh" ? "zh-CN" : "en-US";
			const price = parseFloat(row.getValue("price"));

			const formatted = new Intl.NumberFormat(navigatorLocale, {
				style: "currency",
				currency: "USD",
			}).format(price);

			return (
				<div>
					<SaasAdminText>{formatted}</SaasAdminText>
				</div>
			);
		},
	},
	{
		header: "Supplier",
		accessorKey: "supplier",
		cell: ({ row }) => (
			<div>
				<SaasAdminText>{row.getValue("supplier")}</SaasAdminText>
			</div>
		),
	},
	{
		header: "Discontinued",
		accessorKey: "discontinued",
		cell: ({ row }) => (
			<div className="capitalize">
				<SaasAdminText>{row.getValue("discontinued")}</SaasAdminText>
			</div>
		),
	},
];

const DataTablePinnableColumns = ({ data }: { data: Product[] }) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
		enableSortingRemoval: false,
	});

	return (
		<div className="w-full">
			<div className="rounded-md">
				<Table className="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const { column } = header;
									const isPinned = column.getIsPinned();
									const isLastLeftPinned =
										isPinned === "left" && column.getIsLastColumn("left");
									const isFirstRightPinned =
										isPinned === "right" && column.getIsFirstColumn("right");

									return (
										<TableHead
											key={header.id}
											className="data-pinned:bg-muted/90 relative h-10 truncate data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0"
											colSpan={header.colSpan}
											style={{ ...getPinningStyles(column) }}
											data-pinned={isPinned || undefined}
											data-last-col={
												isLastLeftPinned
													? "left"
													: isFirstRightPinned
														? "right"
														: undefined
											}
										>
											<div className="flex items-center justify-between gap-2">
												<span className="truncate">
													<SaasAdminText>
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
													</SaasAdminText>
												</span>

												{!header.isPlaceholder &&
													header.column.getCanPin() &&
													(header.column.getIsPinned() ? (
														<Button
															size="icon"
															variant="ghost"
															className="-mr-1 size-7"
															onClick={() => header.column.pin(false)}
															aria-label={`Unpin ${header.column.columnDef.header as string} column`}
															title={`Unpin ${header.column.columnDef.header as string} column`}
														>
															<PinOffIcon
																className="opacity-60"
																aria-hidden="true"
															/>
														</Button>
													) : (
														<DropdownMenu>
															<DropdownMenuTrigger
																render={
																	<Button
																		size="icon"
																		variant="ghost"
																		className="-mr-1 size-7"
																		aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
																		title={`Pin options for ${header.column.columnDef.header as string} column`}
																	>
																		<EllipsisIcon
																			className="opacity-60"
																			aria-hidden="true"
																		/>
																	</Button>
																}
															/>
															<DropdownMenuContent align="end" className="w-35">
																<DropdownMenuItem
																	onClick={() => header.column.pin("left")}
																>
																	<ArrowLeftFromLineIcon
																		size={16}
																		className="opacity-60"
																		aria-hidden="true"
																	/>
																	<SaasAdminText>
																		{"Stick to left"}
																	</SaasAdminText>
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => header.column.pin("right")}
																>
																	<ArrowRightFromLineIcon
																		size={16}
																		className="opacity-60"
																		aria-hidden="true"
																	/>
																	<SaasAdminText>
																		{"Stick to right"}
																	</SaasAdminText>
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													))}
											</div>
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
									{row.getVisibleCells().map((cell) => {
										const { column } = cell;
										const isPinned = column.getIsPinned();
										const isLastLeftPinned =
											isPinned === "left" && column.getIsLastColumn("left");
										const isFirstRightPinned =
											isPinned === "right" && column.getIsFirstColumn("right");

										return (
											<TableCell
												key={cell.id}
												className="data-pinned:bg-background/90 truncate data-pinned:backdrop-blur-xs"
												style={{ ...getPinningStyles(column) }}
												data-pinned={isPinned || undefined}
												data-last-col={
													isLastLeftPinned
														? "left"
														: isFirstRightPinned
															? "right"
															: undefined
												}
											>
												<SaasAdminText>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</SaasAdminText>
											</TableCell>
										);
									})}
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
		</div>
	);
};

export { DataTablePinnableColumns };
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
