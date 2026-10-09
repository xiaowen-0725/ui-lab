"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/tabs/account-tab.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useMemo, useState } from "react";

// Type Imports
import type { AppUser } from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Card, CardContent } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/pages/saas-admin/views/apps/users/view/activity-timeline";
import { ProjectsDatatable } from "@/components/pages/saas-admin/views/apps/users/view/projects-datatable";

// Hook Imports
import { usePagination } from "@/components/pages/saas-admin/hooks/use-pagination";

const PAGE_SIZE = 5;

export interface AccountTabProps {
	user: AppUser;
}

export function AccountTab({ user }: AccountTabProps) {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const activityLog = user.activityLog ?? [];

	const filteredProjects = useMemo(() => {
		const projects = user.projects ?? [];
		const query = search.trim().toLowerCase();

		if (!query) {
			return projects;
		}

		return projects.filter((project) =>
			project.name.toLowerCase().includes(query),
		);
	}, [user.projects, search]);

	const totalProjects = filteredProjects.length;
	const totalPages = Math.max(1, Math.ceil(totalProjects / PAGE_SIZE));
	const safeCurrentPage = Math.min(currentPage, totalPages);

	const paginatedProjects = useMemo(() => {
		const start = (safeCurrentPage - 1) * PAGE_SIZE;

		return filteredProjects.slice(start, start + PAGE_SIZE);
	}, [filteredProjects, safeCurrentPage]);

	const showingFrom =
		totalProjects === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
	const showingTo = Math.min(safeCurrentPage * PAGE_SIZE, totalProjects);

	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage: safeCurrentPage,
		totalPages,
		paginationItemsToDisplay: 2,
	});

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setCurrentPage(1);
	};

	return (
		<div className="space-y-6">
			<Card className="py-0">
				<ProjectsDatatable
					search={search}
					projects={paginatedProjects}
					totalProjects={totalProjects}
					showingFrom={showingFrom}
					showingTo={showingTo}
					currentPage={safeCurrentPage}
					totalPages={totalPages}
					pages={pages}
					showLeftEllipsis={showLeftEllipsis}
					showRightEllipsis={showRightEllipsis}
					onSearchChange={handleSearchChange}
					onPageChange={setCurrentPage}
				/>
			</Card>

			<Card>
				<CardContent className="block">
					<div className="flex items-center">
						<span className="text-lg font-medium">
							<SaasAdminText>{"User Activity Timeline"}</SaasAdminText>
						</span>
					</div>
					<div>
						{activityLog.length === 0 ? (
							<p className="text-muted-foreground py-4 text-sm">
								<SaasAdminText>{"No activity yet"}</SaasAdminText>
							</p>
						) : (
							<ActivityTimeline activityLog={activityLog} />
						)}
					</div>
				</CardContent>
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
