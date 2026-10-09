"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/workspace/workspace-data.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Third-party Imports
import { CheckCircle2Icon, DownloadIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const WorkspaceData = () => {
	const submission = useAdminSubmit("settings.workspace-data");
	const { t } = useSaasAdmin();

	const exports = [
		{
			id: 1,
			type: "CSV Export",
			date: "Mar 12, 2023",
			status: "progress",
			progress: 25,
		},
		{
			id: 2,
			type: "CSV Export",
			date: "Jan 12, 2023",
			status: "completed",
			progress: 100,
		},
	];

	return (
		<div data-admin-action="settings.workspace-data">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
				{/* Workspace Data */}
				<div className="flex flex-col space-y-1">
					<h2 className="text-base font-semibold">
						<SaasAdminText>{"Export Workspace data"}</SaasAdminText>
					</h2>
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Export your workspace data for backup or migration purposes."}
						</SaasAdminText>
					</p>
				</div>
				{/* Content */}
				<div className="space-y-6 lg:col-span-2">
					<Button
						type="button"
						variant="outline"
						disabled={submission.pending}
						onClick={() =>
							void submission.run({ operation: "export", format: "csv" })
						}
					>
						<DownloadIcon />
						<SaasAdminText>{"Get started"}</SaasAdminText>
					</Button>

					<div className="overflow-hidden rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted">
									<TableHead className="px-6">
										<SaasAdminText>{"TYPE"}</SaasAdminText>
									</TableHead>
									<TableHead className="px-6">
										<SaasAdminText>{"DATE"}</SaasAdminText>
									</TableHead>
									<TableHead className="px-6">
										<span className="sr-only">
											<SaasAdminText>Usage</SaasAdminText>
										</span>
									</TableHead>
									<TableHead className="w-[50px]">
										<span className="sr-only">
											<SaasAdminText>Actions</SaasAdminText>
										</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{exports.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="px-6 font-medium">
											<SaasAdminText>{item.type}</SaasAdminText>
										</TableCell>
										<TableCell className="px-6">
											<SaasAdminText>{item.date}</SaasAdminText>
										</TableCell>
										<TableCell className="px-6">
											{item.status === "progress" ? (
												<div className="flex flex-col items-start gap-1">
													<span className="text-xs">
														<SaasAdminText>{"Progress "}</SaasAdminText>
														<SaasAdminText>{item.progress}</SaasAdminText>
														<SaasAdminText>{"%"}</SaasAdminText>
													</span>
													<Progress
														aria-label={t("Usage")}
														value={item.progress}
														className="**:data-[slot=progress-track]:bg-primary/20 w-20 **:data-[slot=progress-track]:h-2 md:w-60"
													/>
												</div>
											) : (
												<div className="flex items-center gap-2">
													<span className="text-sm">
														<SaasAdminText>{"Completed"}</SaasAdminText>
													</span>
													<CheckCircle2Icon className="h-4 w-4 text-green-800 dark:text-green-400" />
												</div>
											)}
										</TableCell>
										<TableCell>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												disabled={submission.pending}
												aria-label={t("Download export {id}").replace(
													"{id}",
													String(item.id),
												)}
												onClick={() =>
													void submission.run({
														operation: "download",
														format: "csv",
														exportId: item.id,
													})
												}
											>
												<DownloadIcon className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<AdminSubmitFeedback {...submission} error={t(submission.error)} />
				</div>
			</div>
		</div>
	);
};

export { WorkspaceData };
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
