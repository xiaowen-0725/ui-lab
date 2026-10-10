"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/list/user-pagination.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Third-party Imports
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";

// Hook Imports
import { usePagination } from "@/components/pages/saas-admin/hooks/use-pagination";

export interface UserPaginationProps {
	showingFrom: number;
	showingTo: number;
	total: number;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function UserPagination({
	showingFrom,
	showingTo,
	total,
	currentPage,
	totalPages,
	onPageChange,
}: UserPaginationProps) {
	const { t } = useSaasAdmin();

	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage,
		totalPages,
		paginationItemsToDisplay: 2,
	});

	return (
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
					<SaasAdminText>{total}</SaasAdminText>
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
								onClick={() => onPageChange(currentPage - 1)}
								disabled={currentPage <= 1}
								aria-label={t("Go to previous page")}
							>
								<ChevronLeftIcon aria-hidden="true" />
								<span className="max-sm:hidden">
									<SaasAdminText>{"Previous"}</SaasAdminText>
								</span>
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
										onClick={() => onPageChange(page)}
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
								onClick={() => onPageChange(currentPage + 1)}
								disabled={currentPage >= totalPages}
								aria-label={t("Go to next page")}
							>
								<span className="max-sm:hidden">
									<SaasAdminText>{"Next"}</SaasAdminText>
								</span>
								<ChevronRightIcon aria-hidden="true" />
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
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
