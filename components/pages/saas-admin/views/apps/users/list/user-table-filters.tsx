"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/list/user-table-filters.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Type Imports
import type {
	UserFilters,
	UserPlan,
	UserRole,
	UserStatus,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ROLES: UserRole[] = [
	"Admin",
	"Editor",
	"Subscriber",
	"Maintainer",
	"Guest",
];
const PLANS: UserPlan[] = ["Basic", "Team", "Enterprise"];
const STATUSES: UserStatus[] = ["Active", "Pending", "Suspended", "Inactive"];

const ROLE_ITEMS = [
	{ label: "All", value: "all" },
	...ROLES.map((role) => ({ label: role, value: role })),
];
const PLAN_ITEMS = [
	{ label: "All", value: "all" },
	...PLANS.map((plan) => ({ label: plan, value: plan })),
];
const STATUS_ITEMS = [
	{ label: "All", value: "all" },
	...STATUSES.map((status) => ({ label: status, value: status })),
];

export interface UserTableFiltersProps {
	filters: UserFilters;
	onFilterChange: (filters: Partial<UserFilters>) => void;
}

export function UserTableFilters({
	filters,
	onFilterChange,
}: UserTableFiltersProps) {
	return (
		<div className="flex flex-col gap-4 border-b p-6">
			<div className="grid grid-cols-1 gap-6 max-md:*:last:col-span-full sm:grid-cols-2 md:grid-cols-3">
				<div className="flex w-full flex-col gap-2">
					<Label htmlFor="filter-role">
						<SaasAdminText>{"Select Role"}</SaasAdminText>
					</Label>
					<Select
						items={ROLE_ITEMS}
						value={filters.role}
						onValueChange={(value: string | null) => {
							if (value) {
								onFilterChange({ role: value as UserFilters["role"] });
							}
						}}
					>
						<SelectTrigger id="filter-role" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">
									<SaasAdminText>{"All"}</SaasAdminText>
								</SelectItem>
								{ROLES.map((role) => (
									<SelectItem key={role} value={role}>
										<SaasAdminText>{role}</SaasAdminText>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="flex w-full flex-col gap-2">
					<Label htmlFor="filter-plan">
						<SaasAdminText>{"Select Plan"}</SaasAdminText>
					</Label>
					<Select
						items={PLAN_ITEMS}
						value={filters.plan}
						onValueChange={(value: string | null) => {
							if (value) {
								onFilterChange({ plan: value as UserFilters["plan"] });
							}
						}}
					>
						<SelectTrigger id="filter-plan" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">
									<SaasAdminText>{"All"}</SaasAdminText>
								</SelectItem>
								{PLANS.map((plan) => (
									<SelectItem key={plan} value={plan}>
										<SaasAdminText>{plan}</SaasAdminText>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="flex w-full flex-col gap-2">
					<Label htmlFor="filter-status">
						<SaasAdminText>{"Select Status"}</SaasAdminText>
					</Label>
					<Select
						items={STATUS_ITEMS}
						value={filters.status}
						onValueChange={(value: string | null) => {
							if (value) {
								onFilterChange({ status: value as UserFilters["status"] });
							}
						}}
					>
						<SelectTrigger id="filter-status" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="all">
									<SaasAdminText>{"All"}</SaasAdminText>
								</SelectItem>
								{STATUSES.map((status) => (
									<SelectItem key={status} value={status}>
										<SaasAdminText>{status}</SaasAdminText>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
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
