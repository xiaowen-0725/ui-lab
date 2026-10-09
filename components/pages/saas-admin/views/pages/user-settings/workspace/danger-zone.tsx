"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/workspace/danger-zone.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// Third-party Imports
import { Trash2Icon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const DangerZone = () => {
	const action = useAdminSubmit("settings.leave-workspace");
	return (
		<div
			data-admin-action="settings.leave-workspace"
			className="grid grid-cols-1 gap-10 lg:grid-cols-3"
		>
			{/* Vertical Tabs List */}
			<div className="flex flex-col space-y-1">
				<h2 className="text-base font-semibold">
					<SaasAdminText>{"Danger zone"}</SaasAdminText>
				</h2>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>
						{
							"Manage general workspace. Contact system admin for more information"
						}
					</SaasAdminText>
					<SaasAdminText> </SaasAdminText>
					<Link
						href="#"
						className="text-card-foreground font-medium hover:underline"
					>
						<SaasAdminText>{"Learn more"}</SaasAdminText>
					</Link>
				</p>
			</div>

			{/* Content */}
			<div className="space-y-6 lg:col-span-2">
				<Card>
					<CardContent className="block">
						<div className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
							<div className="space-y-1">
								<h2 className="text-sm font-medium">
									<SaasAdminText>{"Leave workspace"}</SaasAdminText>
								</h2>
								<p className="text-muted-foreground text-sm">
									<SaasAdminText>
										{
											"Revoke your access to this team. Other people you have added to the workspace will remain."
										}
									</SaasAdminText>
								</p>
							</div>
							<Dialog>
								<DialogTrigger
									render={
										<Button
											variant="outline"
											className="border-destructive! text-red-800 dark:text-red-300! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-lg:w-full"
										/>
									}
								>
									<Trash2Icon />
									<SaasAdminText>{"Leave"}</SaasAdminText>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader className="space-y-2">
										<DialogTitle>
											<SaasAdminText>{"Leave workspace"}</SaasAdminText>
										</DialogTitle>
										<div className="text-muted-foreground text-sm">
											<SaasAdminText>
												{
													"Revoke your access to this team. Other people you have added to the workspace will remain."
												}
											</SaasAdminText>
										</div>
									</DialogHeader>
									<AdminSubmitFeedback {...action} />
									<div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
										<DialogClose render={<Button variant="outline" />}>
											<SaasAdminText>{"Cancel"}</SaasAdminText>
										</DialogClose>
										<Button
											variant="destructive"
											disabled={action.pending}
											onClick={() => void action.run({})}
										>
											<SaasAdminText>{"Leave"}</SaasAdminText>
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</CardContent>
				</Card>
				<Card className="cursor-not-allowed bg-muted/30">
					<CardContent className="block">
						<div className="flex justify-between gap-4 max-lg:flex-col lg:items-center">
							<div className="space-y-1">
								<h2 className="text-sm font-medium">
									<SaasAdminText>{"Delete workspace"}</SaasAdminText>
								</h2>
								<p className="text-muted-foreground text-sm">
									<SaasAdminText>
										{
											"Delete your workspace permanently. This action will remove all data and cannot be undone."
										}
									</SaasAdminText>
								</p>
							</div>
							<Button
								variant="outline"
								className="hover:bg-destructive/10! text-red-800 dark:text-red-300! border-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-lg:w-full"
								disabled
							>
								<Trash2Icon />
								<SaasAdminText>{"Delete workspace"}</SaasAdminText>
							</Button>
						</div>
						<Separator className="my-4" />
						<p className="text-muted-foreground text-sm">
							<SaasAdminText>
								{
									"You cannot delete the workspace because you are not the system admin."
								}
							</SaasAdminText>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export { DangerZone };
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
