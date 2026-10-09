"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/list/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.


// Hook Imports
import { useUserApp } from "@/components/pages/saas-admin/hooks/use-user-app";
import { UserPagination } from "@/components/pages/saas-admin/views/apps/users/list/user-pagination";
import { UserTable } from "@/components/pages/saas-admin/views/apps/users/list/user-table";
import { UserTableFilters } from "@/components/pages/saas-admin/views/apps/users/list/user-table-filters";
import { UserTableToolbar } from "@/components/pages/saas-admin/views/apps/users/list/user-table-toolbar";
// Component Imports
import { Card } from "@/components/ui/card";
import { AddEditUserSheet } from "../dialogs/add-edit-user-sheet";

const UserListApp = () => {
	const {
		sheetMode,
		editingUser,
		handleOpenAddSheet,
		handleCloseSheet,
		handleAddUser,
		handleUpdateUser,
		filters,
		paginatedUsers,
		totalPages,
		totalFilteredCount,
		showingFrom,
		showingTo,
		rowsPerPage,
		currentPage,
		sorting,
		handleFilterChange,
		handleSearchChange,
		handleRowsPerPageChange,
		handlePageChange,
		handleSortingChange,
	} = useUserApp();

	return (
		<div className="flex flex-col gap-3 lg:gap-6">
			<AddEditUserSheet
				mode={sheetMode}
				user={editingUser}
				onClose={handleCloseSheet}
				onAdd={handleAddUser}
				onEdit={handleUpdateUser}
			/>
			<Card className="py-0 shadow-none">
				<div className="w-full">
					<div className="border-b">
						<UserTableFilters
							filters={filters}
							onFilterChange={handleFilterChange}
						/>
						<UserTableToolbar
							onAdd={handleOpenAddSheet}
							search={filters.search}
							rowsPerPage={rowsPerPage}
							onSearch={handleSearchChange}
							onRowsPerPageChange={handleRowsPerPageChange}
						/>
						<UserTable
							paginatedUsers={paginatedUsers}
							totalPages={totalPages}
							sorting={sorting}
							onSortingChange={handleSortingChange}
						/>
					</div>

					<UserPagination
						showingFrom={showingFrom}
						showingTo={showingTo}
						total={totalFilteredCount}
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			</Card>
		</div>
	);
};

export { UserListApp };
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
