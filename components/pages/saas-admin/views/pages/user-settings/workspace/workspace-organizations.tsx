"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
import {
	imageImagesBrandsDiscordWebp,
	imageImagesBrandsGithubWhiteWebp,
	imageImagesBrandsNotionWhiteWebp,
} from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/workspace/workspace-organizations.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";
import { useState } from "react";

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

const WorkspaceOrganizations = () => {
	const submission = useAdminSubmit("settings.leave-organization");
	const { t } = useSaasAdmin();
	const [openOrganizationId, setOpenOrganizationId] = useState<string | null>(
		null,
	);
	const [actionOrganizationId, setActionOrganizationId] = useState<
		string | null
	>(null);

	const organizations = [
		{
			id: "notion",
			name: "Notion",
			img: imageImagesBrandsNotionWhiteWebp,
			description: "member and collaborator on product and docs projects",
		},
		{
			id: "github",
			name: "Github",
			img: imageImagesBrandsGithubWhiteWebp,
			description: "repository collaborator and CI maintainer",
		},
		{
			id: "discord",
			name: "Discord",
			img: imageImagesBrandsDiscordWebp,
			description: "community moderator and support channel member",
		},
	];

	return (
		<div data-admin-action="settings.leave-organization">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
				{/* Workspace Organizations */}
				<div className="flex flex-col space-y-1">
					<h2 className="text-base font-semibold">
						<SaasAdminText>{"Organizations"}</SaasAdminText>
					</h2>
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Manage your workspace organizations and settings."}
						</SaasAdminText>
					</p>
				</div>
				{/* Content */}
				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardContent className="block">
							{organizations.map((org) => (
								<div key={org.id}>
									<div className="flex items-center justify-between gap-4 max-sm:flex-wrap">
										<div className="flex items-center gap-4">
											<img
												width={org.id === "discord" ? 60 : 32}
												height={org.id === "discord" ? 61 : 32}
												src={org.img}
												alt={t(org.name)}
												className="h-8 w-auto"
											/>
											<p className="text-muted-foreground text-sm">
												<Link
													href="#"
													className="font-medium text-sky-800 hover:underline dark:text-sky-400"
												>
													<SaasAdminText>{org.name}</SaasAdminText>
												</Link>
												<SaasAdminText> </SaasAdminText>
												<SaasAdminText>{org.description}</SaasAdminText>
											</p>
										</div>
										<Dialog
											open={openOrganizationId === org.id}
											onOpenChange={(open) => {
												if (submission.pending) return;
												setOpenOrganizationId(open ? org.id : null);
												setActionOrganizationId(null);
											}}
										>
											<DialogTrigger
												render={
													<Button
														type="button"
														variant="outline"
														disabled={submission.pending}
														aria-label={t("Leave organization {name}").replace(
															"{name}",
															t(org.name),
														)}
														className="border-destructive! text-red-800 dark:text-red-300! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-sm:w-full"
													/>
												}
											>
												<Trash2Icon />
												<SaasAdminText>{"Leave"}</SaasAdminText>
											</DialogTrigger>
											<DialogContent className="sm:max-w-md">
												<DialogHeader className="space-y-2">
													<DialogTitle>
														<SaasAdminText>{"Are you sure?"}</SaasAdminText>
													</DialogTitle>
													<div className="text-muted-foreground text-sm">
														<SaasAdminText>
															{
																"Are you sure you want to leave this organization?"
															}
														</SaasAdminText>
													</div>
												</DialogHeader>
												<div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
													<DialogClose
														render={
															<Button
																type="button"
																variant="outline"
																disabled={submission.pending}
															/>
														}
													>
														<SaasAdminText>{"Cancel"}</SaasAdminText>
													</DialogClose>
													<Button
														type="button"
														variant="destructive"
														disabled={submission.pending}
														onClick={async () => {
															setActionOrganizationId(org.id);
															if (
																await submission.run({ organizationId: org.id })
															) {
																setOpenOrganizationId((current) =>
																	current === org.id ? null : current,
																);
															}
														}}
													>
														<SaasAdminText>{"Leave"}</SaasAdminText>
													</Button>
												</div>
												{actionOrganizationId === org.id && (
													<AdminSubmitFeedback
														{...submission}
														error={t(submission.error)}
													/>
												)}
											</DialogContent>
										</Dialog>
									</div>
									{org !== organizations[organizations.length - 1] && (
										<Separator className="my-4" />
									)}
								</div>
							))}
							{submission.complete && <AdminSubmitFeedback {...submission} />}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export { WorkspaceOrganizations };
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
