"use client";
// Third-party Imports
import {
	DownloadIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	PlusIcon,
	SearchIcon,
	UploadIcon,
} from "lucide-react";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/list/user-table-toolbar.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	AdminSubmitFeedback,
	useAdminSubmit,
} from "@/components/pages/saas-admin/use-submit";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const ROWS_PER_PAGE_ITEMS = ROWS_PER_PAGE_OPTIONS.map((option) => ({
	label: String(option),
	value: String(option),
}));

export interface UserTableToolbarProps {
	onAdd?: () => void;
	search: string;
	rowsPerPage: number;
	onSearch: (search: string) => void;
	onRowsPerPageChange: (rowsPerPage: number) => void;
}

export function UserTableToolbar({
	onAdd,
	search,
	rowsPerPage,
	onSearch,
	onRowsPerPageChange,
}: UserTableToolbarProps) {
	const { t, users } = useSaasAdmin();
	const action = useAdminSubmit("users.transfer");

	return (
		<>
			<div className="flex gap-4 p-6 max-sm:flex-col sm:items-center sm:justify-between">
				<div className="w-full max-w-2xs">
					<Label htmlFor="search-user" className="sr-only">
						<SaasAdminText>{"Search User"}</SaasAdminText>
					</Label>
					<InputGroup>
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
						<InputGroupInput
							id="search-user"
							value={search}
							onChange={(event) => onSearch(event.target.value)}
							placeholder={t("Search user")}
							type="text"
						/>
					</InputGroup>
				</div>

				<div className="flex flex-wrap items-center gap-2 sm:justify-between">
					<div className="flex items-center gap-2">
						<Label htmlFor="rows-per-page" className="sr-only">
							<SaasAdminText>{"Show"}</SaasAdminText>
						</Label>
						<Select
							items={ROWS_PER_PAGE_ITEMS}
							value={String(rowsPerPage)}
							onValueChange={(value: string | null) => {
								if (value) {
									onRowsPerPageChange(Number(value));
								}
							}}
						>
							<SelectTrigger
								id="rows-per-page"
								className="w-fit whitespace-nowrap"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{ROWS_PER_PAGE_OPTIONS.map((option) => (
										<SelectItem key={option} value={String(option)}>
											<SaasAdminText>{option}</SaasAdminText>
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									aria-label={t("Export")}
									className="bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"
								/>
							}
						>
							<UploadIcon />
							<span className="max-lg:hidden">
								<SaasAdminText>{"Export"}</SaasAdminText>
							</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-auto">
							<DropdownMenuItem
								disabled={action.pending}
								onClick={() =>
									void action.run({ action: "export", format: "csv", users })
								}
							>
								<FileTextIcon className="size-4" />
								<SaasAdminText>{"Export as CSV"}</SaasAdminText>
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={action.pending}
								onClick={() =>
									void action.run({ action: "export", format: "xlsx", users })
								}
							>
								<FileSpreadsheetIcon className="size-4" />
								<SaasAdminText>{"Export as Excel"}</SaasAdminText>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								disabled={action.pending}
								onClick={() =>
									void action.run({ action: "export", format: "json", users })
								}
							>
								<FileTextIcon className="size-4" />
								<SaasAdminText>{"Export as JSON"}</SaasAdminText>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="outline"
						aria-label={t("Import")}
						disabled={action.pending}
						onClick={() => void action.run({ action: "import" })}
					>
						<DownloadIcon className="size-4" />
						<span className="max-lg:hidden">
							<SaasAdminText>{"Import"}</SaasAdminText>
						</span>
					</Button>

					<Button onClick={onAdd} aria-label={t("Add New User")}>
						<PlusIcon />
						<span className="max-lg:hidden">
							<SaasAdminText>{"Add New User"}</SaasAdminText>
						</span>
					</Button>
				</div>
			</div>
			<AdminSubmitFeedback {...action} />
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
