"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/list/user-table.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Third-party Imports
import type { SortingState, Updater } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

// Type Imports
import type {
	AppUser,
	UserSorting,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
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
import { userTableColumns } from "@/components/pages/saas-admin/views/apps/users/list/user-table-columns";

export interface UserTableProps {
	paginatedUsers: AppUser[];
	totalPages: number;
	sorting: UserSorting | null;
	onSortingChange: (sorting: UserSorting | null) => void;
}

export function UserTable({
	paginatedUsers,
	totalPages,
	sorting,
	onSortingChange,
}: UserTableProps) {
	const sortingState: SortingState = sorting ? [sorting] : [];

	const handleSortingChange = (updater: Updater<SortingState>) => {
		const nextSorting =
			typeof updater === "function" ? updater(sortingState) : updater;

		if (nextSorting.length === 0) {
			onSortingChange(null);

			return;
		}

		onSortingChange({
			id: nextSorting[0].id as UserSorting["id"],
			desc: nextSorting[0].desc,
		});
	};

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data: paginatedUsers,
		columns: userTableColumns,
		manualPagination: true,
		manualFiltering: true,
		manualSorting: true,
		pageCount: totalPages,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id,
		enableRowSelection: false,
		enableSortingRemoval: false,
		state: {
			sorting: sortingState,
		},
		onSortingChange: handleSortingChange,
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id} className="h-14 border-t">
						{headerGroup.headers.map((header) => (
							<TableHead
								key={header.id}
								style={{ width: `${header.getSize()}px` }}
								className="text-muted-foreground first:pl-4 last:px-4 last:text-center"
							>
								{header.isPlaceholder ? null : header.column.getCanSort() ? (
									<button
										type="button"
										className={cn(
											header.column.getCanSort() &&
												"flex h-full cursor-pointer items-center justify-between gap-2 select-none",
										)}
										onClick={header.column.getToggleSortingHandler()}
										onKeyDown={(event) => {
											if (
												header.column.getCanSort() &&
												(event.key === "Enter" || event.key === " ")
											) {
												event.preventDefault();
												header.column.getToggleSortingHandler()?.(event);
											}
										}}
										tabIndex={header.column.getCanSort() ? 0 : undefined}
									>
										<SaasAdminText>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</SaasAdminText>
										{{
											asc: (
												<ChevronUpIcon
													className="size-4 shrink-0 opacity-60"
													aria-hidden="true"
												/>
											),
											desc: (
												<ChevronDownIcon
													className="size-4 shrink-0 opacity-60"
													aria-hidden="true"
												/>
											),
										}[header.column.getIsSorted() as string] ?? null}
									</button>
								) : (
									flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)
								)}
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className="h-14 first:w-12.5 first:pl-4 last:w-29 last:px-4"
								>
									<SaasAdminText>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</SaasAdminText>
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell
							colSpan={userTableColumns.length}
							className="h-24 text-center"
						>
							<SaasAdminText>{"No results."}</SaasAdminText>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
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
