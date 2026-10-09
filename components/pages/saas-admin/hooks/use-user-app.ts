"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/hooks/use-user-app.ts
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useCallback, useMemo, useState } from "react";

// Type Imports
import type {
	AppUser,
	UserFilters,
	UserFormData,
	UserSheetMode,
	UserSortColumn,
	UserSorting,
	UserStatus,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Data Imports
import {
	useSaasAdmin,
	useAdminQueryValues,
} from "@/components/pages/saas-admin/environment";

const USER_QUERY_DEFAULTS = {
	role: "all",
	plan: "all",
	status: "all",
	q: "",
	page: "1",
	size: "10",
	sort: "",
	direction: "asc",
};

const filterUsers = (users: AppUser[], filters: UserFilters): AppUser[] => {
	const normalizedSearch = filters.search.trim().toLowerCase();

	return users.filter((user) => {
		if (filters.role !== "all" && user.role !== filters.role) {
			return false;
		}

		if (filters.plan !== "all" && user.plan !== filters.plan) {
			return false;
		}

		if (filters.status !== "all" && user.status !== filters.status) {
			return false;
		}

		if (normalizedSearch) {
			const matchesName = user.name.toLowerCase().includes(normalizedSearch);
			const matchesEmail = user.email.toLowerCase().includes(normalizedSearch);

			if (!matchesName && !matchesEmail) {
				return false;
			}
		}

		return true;
	});
};

const compareUsers = (
	a: AppUser,
	b: AppUser,
	column: UserSortColumn,
): number => {
	switch (column) {
		case "user":
			return a.name.localeCompare(b.name);
		case "role":
			return a.role.localeCompare(b.role);
		case "plan":
			return a.plan.localeCompare(b.plan);
		case "billing":
			return a.billing.localeCompare(b.billing);
		case "status":
			return a.status.localeCompare(b.status);
		case "joinedDate":
			return (
				new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
			);
		default:
			return 0;
	}
};

const sortUsers = (
	users: AppUser[],
	sorting: UserSorting | null,
): AppUser[] => {
	if (!sorting) {
		return users;
	}

	return [...users].sort((a, b) => {
		const comparison = compareUsers(a, b, sorting.id);

		return sorting.desc ? -comparison : comparison;
	});
};

const buildNewUser = (data: UserFormData): AppUser => ({
	id: crypto.randomUUID(),
	name: data.name.trim(),
	email: data.email.trim(),
	role: data.role,
	plan: data.plan,
	status: data.status,
	billing: "Manual",
	company: data.company?.trim() || undefined,
	country: data.country?.trim() || undefined,
	contact: data.contact?.trim() || undefined,
	joinedDate: new Date().toISOString(),
});

const removeIdsFromSelection = (
	selectedUserIds: string[],
	ids: string[],
): string[] => {
	const idSet = new Set(ids);

	return selectedUserIds.filter((id) => !idSet.has(id));
};

export function useUserApp() {
	const { users, setUsers } = useSaasAdmin();
	const [query, updateQuery] = useAdminQueryValues(USER_QUERY_DEFAULTS);
	const filters = useMemo<UserFilters>(
		() => ({
			role: ["Admin", "Editor", "Subscriber", "Maintainer", "Guest"].includes(
				query.role,
			)
				? (query.role as UserFilters["role"])
				: "all",
			plan: ["Basic", "Team", "Enterprise"].includes(query.plan)
				? (query.plan as UserFilters["plan"])
				: "all",
			status: ["Active", "Pending", "Suspended", "Inactive"].includes(
				query.status,
			)
				? (query.status as UserFilters["status"])
				: "all",
			search: query.q,
		}),
		[query.role, query.plan, query.status, query.q],
	);
	const rowsPerPage = [10, 25, 50, 100].includes(Number(query.size))
		? Number(query.size)
		: 10;
	const requestedPage = /^\d+$/.test(query.page)
		? Math.max(1, Number(query.page))
		: 1;
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const sorting = useMemo<UserSorting | null>(
		() =>
			["user", "role", "plan", "billing", "status", "joinedDate"].includes(
				query.sort,
			)
				? { id: query.sort as UserSortColumn, desc: query.direction === "desc" }
				: null,
		[query.sort, query.direction],
	);
	const [sheetMode, setSheetMode] = useState<UserSheetMode | null>(null);
	const [editingUserId, setEditingUserId] = useState<string | null>(null);

	const stats = useMemo(
		() => ({
			totalUsers: users.length,
			activeUsers: users.filter((user) => user.status === "Active").length,
			pendingUsers: users.filter((user) => user.status === "Pending").length,
			paidUsers: users.filter((user) => user.plan !== "Basic").length,
		}),
		[users],
	);

	const filteredUsers = useMemo(
		() => filterUsers(users, filters),
		[filters, users],
	);

	const sortedUsers = useMemo(
		() => sortUsers(filteredUsers, sorting),
		[filteredUsers, sorting],
	);

	const totalFilteredCount = sortedUsers.length;

	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalFilteredCount / rowsPerPage)),
		[rowsPerPage, totalFilteredCount],
	);

	// A consumer may remove the last row on a page while this view stays mounted.
	const currentPage = Math.min(requestedPage, totalPages);

	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * rowsPerPage;

		return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
	}, [currentPage, rowsPerPage, sortedUsers]);

	const showingFrom =
		totalFilteredCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

	const showingTo = Math.min(currentPage * rowsPerPage, totalFilteredCount);

	const editingUser = useMemo(
		() => users.find((user) => user.id === editingUserId) ?? null,
		[editingUserId, users],
	);

	const paginatedUserIds = useMemo(
		() => paginatedUsers.map((user) => user.id),
		[paginatedUsers],
	);

	const isAllSelected =
		paginatedUsers.length > 0 &&
		paginatedUserIds.every((id) => selectedUserIds.includes(id));

	const isIndeterminate =
		paginatedUserIds.some((id) => selectedUserIds.includes(id)) &&
		!isAllSelected;

	// Vars
	// Converts string[] → Record<string, boolean> for TanStack controlled selection
	const rowSelection = Object.fromEntries(
		selectedUserIds.map((id) => [id, true]),
	);

	const handleFilterChange = useCallback(
		(nextFilters: Partial<UserFilters>) => {
			const patch: Record<string, string> = { page: "1" };
			for (const [key, value] of Object.entries(nextFilters))
				patch[key === "search" ? "q" : key] = value;
			updateQuery(patch);
		},
		[updateQuery],
	);
	const handleSearchChange = useCallback(
		(search: string) => updateQuery({ q: search, page: "1" }),
		[updateQuery],
	);
	const handleRowsPerPageChange = useCallback(
		(size: number) => updateQuery({ size: String(size), page: "1" }),
		[updateQuery],
	);
	const handlePageChange = useCallback(
		(page: number) => updateQuery({ page: String(page) }),
		[updateQuery],
	);
	const handleSortingChange = useCallback(
		(sorting: UserSorting | null) =>
			updateQuery({
				sort: sorting?.id ?? "",
				direction: sorting?.desc ? "desc" : "asc",
				page: "1",
			}),
		[updateQuery],
	);
	const handleSelectUser = useCallback((id: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(id)
				? prev.filter((selectedId) => selectedId !== id)
				: [...prev, id],
		);
	}, []);

	const handleSelectAll = useCallback((userIds: string[]) => {
		setSelectedUserIds((prev) => {
			const allSelected =
				userIds.length > 0 && userIds.every((id) => prev.includes(id));

			if (allSelected) {
				return removeIdsFromSelection(prev, userIds);
			}

			return [...new Set([...prev, ...userIds])];
		});
	}, []);

	const handleClearSelection = useCallback(() => {
		setSelectedUserIds([]);
	}, []);

	const handleAddUser = useCallback(
		(data: UserFormData) => {
			const newUser = buildNewUser(data);

			setUsers((prev) => [...prev, newUser]);
			setSheetMode(null);
			setEditingUserId(null);
		},
		[setUsers],
	);

	const handleUpdateUser = useCallback(
		(id: string, data: Partial<UserFormData>) => {
			setUsers((prev) =>
				prev.map((user) =>
					user.id === id
						? {
								...user,
								...data,
								name: data.name?.trim() ?? user.name,
								email: data.email?.trim() ?? user.email,
								company: data.company?.trim() ?? user.company,
								country: data.country?.trim() ?? user.country,
								contact: data.contact?.trim() ?? user.contact,
							}
						: user,
				),
			);
			setSheetMode(null);
			setEditingUserId(null);
		},
		[setUsers],
	);

	const handleDeleteUser = useCallback(
		(id: string) => {
			setUsers((prev) => prev.filter((user) => user.id !== id));
			setSelectedUserIds((prev) => removeIdsFromSelection(prev, [id]));
		},
		[setUsers],
	);

	const handleBulkDelete = useCallback(() => {
		setUsers((prev) =>
			prev.filter((user) => !selectedUserIds.includes(user.id)),
		);
		setSelectedUserIds((prev) => removeIdsFromSelection(prev, selectedUserIds));
	}, [selectedUserIds, setUsers]);

	const handleUpdateStatus = useCallback(
		(id: string, status: UserStatus) => {
			setUsers((prev) =>
				prev.map((user) => (user.id === id ? { ...user, status } : user)),
			);
		},
		[setUsers],
	);

	const handleBulkUpdateStatus = useCallback(
		(status: UserStatus) => {
			setUsers((prev) =>
				prev.map((user) =>
					selectedUserIds.includes(user.id) ? { ...user, status } : user,
				),
			);
		},
		[selectedUserIds, setUsers],
	);

	const handleOpenAddSheet = useCallback(() => {
		setSheetMode("add");
		setEditingUserId(null);
	}, []);

	const handleOpenEditSheet = useCallback((userId: string) => {
		setSheetMode("edit");
		setEditingUserId(userId);
	}, []);

	const handleCloseSheet = useCallback(() => {
		setSheetMode(null);
		setEditingUserId(null);
	}, []);

	return {
		users,
		stats,
		filters,
		paginatedUsers,
		filteredUsers,
		sortedUsers,
		totalPages,
		totalFilteredCount,
		showingFrom,
		showingTo,
		rowsPerPage,
		currentPage,
		selectedUserIds,
		isAllSelected,
		isIndeterminate,
		rowSelection,
		sorting,
		sheetMode,
		editingUser,
		handleFilterChange,
		handleSearchChange,
		handleRowsPerPageChange,
		handlePageChange,
		handleSortingChange,
		handleSelectUser,
		handleSelectAll,
		handleClearSelection,
		handleAddUser,
		handleUpdateUser,
		handleDeleteUser,
		handleBulkDelete,
		handleUpdateStatus,
		handleBulkUpdateStatus,
		handleOpenAddSheet,
		handleOpenEditSheet,
		handleCloseSheet,
	};
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
