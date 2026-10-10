"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/projects-datatable.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// React Imports
import { useState } from "react";

// Third-party Imports
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisVerticalIcon,
} from "lucide-react";

// Type Imports
import type { UserProject } from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
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

const PROJECT_PROGRESS_COLORS = [
	"**:data-[slot=progress-indicator]:bg-chart-1",
	"**:data-[slot=progress-indicator]:bg-chart-2",
	"**:data-[slot=progress-indicator]:bg-chart-3",
	"**:data-[slot=progress-indicator]:bg-chart-5",
];

const PROJECT_LOGO_COLORS = [
	"bg-primary/10 text-primary",
	"bg-chart-1/10 text-chart-1",
	"bg-chart-2/10 text-chart-2",
	"bg-chart-3/10 text-chart-3",
];

const getProjectInitials = (name: string): string => {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
};

const getProjectLogoColor = (id: string): string => {
	const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

	return PROJECT_LOGO_COLORS[hash % PROJECT_LOGO_COLORS.length];
};

const getProjectProgressColor = (id: string): string => {
	const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

	return PROJECT_PROGRESS_COLORS[hash % PROJECT_PROGRESS_COLORS.length];
};

function ProjectTeamAvatars({ project }: { project: UserProject }) {
	const visibleTeam = project.team.slice(0, 3);

	return (
		<AvatarGroup>
			{visibleTeam.map((member, index) => (
				<Avatar
					key={`${project.id}-team-${member.initials}`}
					className="ring-background ring-2"
					size="sm"
				>
					{member.avatar ? (
						<AvatarImage src={member.avatar} alt={member.initials} />
					) : null}
					<AvatarFallback className="text-[10px]">
						<SaasAdminText>{member.initials}</SaasAdminText>
					</AvatarFallback>
				</Avatar>
			))}
			{project.teamExtraCount ? (
				<AvatarGroupCount>
					<SaasAdminText>{"+"}</SaasAdminText>
					<SaasAdminText>{project.teamExtraCount}</SaasAdminText>
				</AvatarGroupCount>
			) : null}
		</AvatarGroup>
	);
}

export interface ProjectsDatatableProps {
	search: string;
	projects: UserProject[];
	totalProjects: number;
	showingFrom: number;
	showingTo: number;
	currentPage: number;
	totalPages: number;
	pages: number[];
	showLeftEllipsis: boolean;
	showRightEllipsis: boolean;
	onSearchChange: (value: string) => void;
	onPageChange: (page: number) => void;
}

export function ProjectsDatatable({
	search,
	projects,
	totalProjects,
	showingFrom,
	showingTo,
	currentPage,
	totalPages,
	pages,
	showLeftEllipsis,
	showRightEllipsis,
	onSearchChange,
	onPageChange,
}: ProjectsDatatableProps) {
	const action = useAdminSubmit("profile.project");
	const { t } = useSaasAdmin();

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const allSelected =
		projects.length > 0 &&
		projects.every((project) => selectedIds.has(project.id));
	const someSelected =
		projects.some((project) => selectedIds.has(project.id)) && !allSelected;

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedIds(new Set(projects.map((project) => project.id)));

			return;
		}

		setSelectedIds(new Set());
	};

	const handleSelectRow = (projectId: string, checked: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);

			if (checked) {
				next.add(projectId);
			} else {
				next.delete(projectId);
			}

			return next;
		});
	};

	const handleSearchChange = (value: string) => {
		setSelectedIds(new Set());
		onSearchChange(value);
	};

	const handlePageChange = (page: number) => {
		setSelectedIds(new Set());
		onPageChange(page);
	};

	return (
		<>
			<AdminSubmitFeedback {...action} />
			<div className="w-full">
				<div className="border-b">
					<div className="flex min-h-17 flex-wrap items-center justify-between gap-3 px-4 py-3">
						<span className="text-lg font-medium">
							<SaasAdminText>{"Projects List"}</SaasAdminText>
						</span>
						<div>
							<Label htmlFor="search-projects" className="sr-only">
								<SaasAdminText>{"Search projects"}</SaasAdminText>
							</Label>
							<Input
								id="search-projects"
								value={search}
								onChange={(event) => handleSearchChange(event.target.value)}
								placeholder={t("Search project")}
								type="text"
							/>
						</div>
					</div>

					<Table>
						<TableHeader>
							<TableRow className="h-17 border-t">
								<TableHead className="text-muted-foreground w-12.5 pl-4">
									<Checkbox
										checked={allSelected}
										indeterminate={someSelected}
										onCheckedChange={(value) => handleSelectAll(!!value)}
										aria-label={t("Select all projects")}
									/>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Project"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Leader"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Team"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Progress"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground w-12 px-4 text-right">
									<SaasAdminText>{"Action"}</SaasAdminText>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{projects.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center">
										<SaasAdminText>{"No projects found"}</SaasAdminText>
									</TableCell>
								</TableRow>
							) : (
								projects.map((project) => (
									<TableRow key={project.id}>
										<TableCell className="w-12.5 pl-4">
											<Checkbox
												checked={selectedIds.has(project.id)}
												onCheckedChange={(value) =>
													handleSelectRow(project.id, !!value)
												}
												aria-label={`Select ${project.name}`}
											/>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-4">
												<Avatar className="size-8 rounded-md after:border-none">
													{project.logo ? (
														<AvatarImage
															src={project.logo}
															alt={project.name}
															className="rounded-md object-cover"
														/>
													) : null}
													<AvatarFallback
														className={cn(
															"rounded-md text-xs",
															getProjectLogoColor(project.id),
														)}
													>
														<SaasAdminText>
															{getProjectInitials(project.name)}
														</SaasAdminText>
													</AvatarFallback>
												</Avatar>
												<div className="flex flex-col gap-1">
													<span>
														<SaasAdminText>{project.name}</SaasAdminText>
													</span>
													<span className="text-muted-foreground text-xs">
														<SaasAdminText>{project.type}</SaasAdminText>
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<span className="text-muted-foreground">
												<SaasAdminText>{project.leader}</SaasAdminText>
											</span>
										</TableCell>
										<TableCell>
											<ProjectTeamAvatars project={project} />
										</TableCell>
										<TableCell className="w-40">
											<div className="flex items-center gap-3">
												<Progress
													aria-label={project.name}
													value={project.progress}
													className={cn(
														"w-40 *:data-[slot=progress-track]:h-1.5",
														getProjectProgressColor(project.id),
													)}
												/>
												<span className="text-muted-foreground">
													<SaasAdminText>{project.progress}</SaasAdminText>
													<SaasAdminText>{"%"}</SaasAdminText>
												</span>
											</div>
										</TableCell>
										<TableCell className="px-4 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger
													render={
														<Button
															variant="ghost"
															size="icon"
															aria-label={t("Project actions")}
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
														<DropdownMenuItem
															disabled={action.pending}
															onClick={() =>
																void action.run({
																	operation: "view",
																	project: { ...project },
																})
															}
														>
															<SaasAdminText>{"View"}</SaasAdminText>
														</DropdownMenuItem>
														<DropdownMenuItem
															disabled={action.pending}
															onClick={() =>
																void action.run({
																	operation: "edit",
																	project: { ...project },
																})
															}
														>
															<SaasAdminText>{"Edit"}</SaasAdminText>
														</DropdownMenuItem>
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{totalProjects > 0 && (
					<div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
						<p
							className="text-muted-foreground text-sm whitespace-nowrap"
							aria-live="polite"
						>
							<SaasAdminText>{"Showing "}</SaasAdminText>
							<span>
								<SaasAdminText>{showingFrom}</SaasAdminText>
							</span>{" "}
							<SaasAdminText>{" to "}</SaasAdminText>
							<span>
								<SaasAdminText>{showingTo}</SaasAdminText>
							</span>{" "}
							<SaasAdminText>{" of "}</SaasAdminText>
							<span>
								<SaasAdminText>{totalProjects}</SaasAdminText>
							</span>{" "}
							<SaasAdminText>{" entries"}</SaasAdminText>
						</p>

						<div>
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<Button
											className="disabled:pointer-events-none disabled:opacity-50"
											variant="ghost"
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage <= 1}
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
										const isActive = page === currentPage;

										return (
											<PaginationItem key={page}>
												<Button
													size="icon"
													className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
													onClick={() => handlePageChange(page)}
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
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage >= totalPages}
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
				)}
			</div>
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
