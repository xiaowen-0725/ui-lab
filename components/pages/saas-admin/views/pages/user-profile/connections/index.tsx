"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-profile/connections/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// Third-party Imports
import {
	EllipsisVerticalIcon,
	MailIcon,
	UserPlus2Icon,
	UserRoundCheckIcon,
} from "lucide-react";

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// Data Imports
import { useSaasAdmin } from "@/components/pages/saas-admin/environment";

function ConnectionsCard() {
	const { profile: db, setProfile, t } = useSaasAdmin();
	const { connectionCardActions, connectionCards } = db;
	const action = useAdminSubmit("profile.connection");
	const runMenu = async (operation: string, id: string | number) => {
		if ((await action.run({ operation, id })) && operation === "Delete")
			setProfile((previous) => ({
				...previous,
				connectionCards: previous.connectionCards.filter(
					(item) => item.id !== id,
				),
			}));
	};
	const connect = async (id: string | number, connected: boolean) => {
		if (await action.run({ id, connected }))
			setProfile((previous) => ({
				...previous,
				connectionCards: previous.connectionCards.map((item) =>
					item.id === id ? { ...item, isConnected: connected } : item,
				),
			}));
	};
	return (
		<>
			<AdminSubmitFeedback {...action} />
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{connectionCards.map((connection) => (
					<Card
						key={connection.id}
						className="relative flex flex-col items-center justify-center transition-[transform,opacity] hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0"
					>
						<div className="absolute top-4 right-4 z-10">
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button
											variant="ghost"
											size="icon"
											className="text-muted-foreground size-8 rounded-full"
										/>
									}
								>
									<EllipsisVerticalIcon className="size-4" />
									<span className="sr-only">
										<SaasAdminText>{"Open "}</SaasAdminText>
										<SaasAdminText>{connection.name}</SaasAdminText>{" "}
										<SaasAdminText>{" actions"}</SaasAdminText>
									</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44">
									<DropdownMenuGroup>
										{connectionCardActions.map((action) => (
											<DropdownMenuItem
												key={action}
												onClick={() => void runMenu(action, connection.id)}
												variant={
													action === "Delete" ? "destructive" : "default"
												}
											>
												<SaasAdminText>{action}</SaasAdminText>
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<CardContent className="block">
							<Avatar className="size-25">
								{connection.avatar ? (
									<AvatarImage src={connection.avatar} alt={connection.name} />
								) : null}
								<AvatarFallback>
									<SaasAdminText>{connection.initials}</SaasAdminText>
								</AvatarFallback>
							</Avatar>
						</CardContent>

						<CardContent className="block text-center">
							<h3 className="text-xl font-medium">
								<SaasAdminText>{connection.name}</SaasAdminText>
							</h3>
							<p className="text-muted-foreground text-base">
								<SaasAdminText>{connection.role}</SaasAdminText>
							</p>
						</CardContent>

						<CardContent className="flex-row flex flex-wrap items-center justify-center gap-2">
							{connection.tags.map((tag) => (
								<Badge
									key={`${connection.id}-${tag.label}`}
									variant="outline"
									className="h-6 px-3 py-1"
								>
									<SaasAdminText>{tag.label}</SaasAdminText>
								</Badge>
							))}
						</CardContent>

						<CardContent className="flex-row flex w-full items-center justify-evenly gap-4">
							<div className="text-center">
								<p className="text-lg font-medium">
									<SaasAdminText>{connection.stats.projects}</SaasAdminText>
								</p>
								<p className="text-muted-foreground text-base">
									<SaasAdminText>{"Projects"}</SaasAdminText>
								</p>
							</div>
							<Separator orientation="vertical" />
							<div className="text-center">
								<p className="text-lg font-medium">
									<SaasAdminText>{connection.stats.tasks}</SaasAdminText>
								</p>
								<p className="text-muted-foreground text-base">
									<SaasAdminText>{"Tasks"}</SaasAdminText>
								</p>
							</div>
							<Separator orientation="vertical" />
							<div className="text-center">
								<p className="text-lg font-medium">
									<SaasAdminText>{connection.stats.connections}</SaasAdminText>
								</p>
								<p className="text-muted-foreground text-base">
									<SaasAdminText>{"Connections"}</SaasAdminText>
								</p>
							</div>
						</CardContent>

						<CardContent className="flex-row flex items-center gap-4">
							<Button
								disabled={action.pending}
								onClick={() =>
									void connect(connection.id, !connection.isConnected)
								}
								variant={connection.isConnected ? "default" : "outline"}
							>
								{connection.isConnected ? (
									<UserRoundCheckIcon />
								) : (
									<UserPlus2Icon />
								)}
								<SaasAdminText>
									{connection.isConnected ? "Connected" : "Connect"}
								</SaasAdminText>
							</Button>
							<Button
								variant="outline"
								size="icon"
								aria-label={`${t("Message")} ${connection.name}`}
								onClick={() =>
									void action.run({ operation: "message", id: connection.id })
								}
							>
								<MailIcon />
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}

export { ConnectionsCard };
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
