"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-profile/profile/connections.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// Third-party Imports
import {
	EllipsisVerticalIcon,
	UserIcon,
	UserRoundCheckIcon,
} from "lucide-react";

// Components Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Data Imports
import { useSaasAdmin } from "@/components/pages/saas-admin/environment";

// Util Imports
import { cn } from "@/lib/utils";

type ConnectionsProps = {
	className?: string;
	onNavigateTab?: (view: string) => void;
};

function Connections({ className, onNavigateTab }: ConnectionsProps) {
	const { profile: db, setProfile, navigate, t } = useSaasAdmin();
	const action = useAdminSubmit("profile.connections");
	const { connectionActions, connections } = db;

	return (
		<Card className={cn(className)}>
			<CardHeader className="flex items-center justify-between">
				<span className="text-lg font-medium">
					<SaasAdminText>{"Connections"}</SaasAdminText>
				</span>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground size-6 rounded-full"
							/>
						}
					>
						<EllipsisVerticalIcon />
						<span className="sr-only">
							<SaasAdminText>{"Menu"}</SaasAdminText>
						</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-32">
						<DropdownMenuGroup>
							{connectionActions.map((item, index) => (
								<DropdownMenuItem
									key={item}
									disabled={action.pending}
									onClick={() => void action.run({ operation: item })}
								>
									<SaasAdminText>{item}</SaasAdminText>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col justify-between gap-4">
				{connections.map((connection) => (
					<div
						key={connection.id}
						className="flex items-center justify-between gap-2"
					>
						<div className="flex items-center justify-between gap-4">
							<Avatar size="lg">
								{connection.avatar ? (
									<AvatarImage src={connection.avatar} alt={connection.name} />
								) : null}
								<AvatarFallback>
									<SaasAdminText>{connection.initials}</SaasAdminText>
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-0.5">
								<span className="text-base font-medium">
									<SaasAdminText>{connection.name}</SaasAdminText>
								</span>
								<span className="text-muted-foreground text-sm">
									<SaasAdminText>{connection.totalConnections}</SaasAdminText>
								</span>
							</div>
						</div>
						<Button
							size="icon"
							aria-label={`${t(connection.isConnected ? "Connected" : "Connect")} ${connection.name}`}
							disabled={action.pending}
							onClick={async () => {
								const connected = !connection.isConnected;
								if (await action.run({ id: connection.id, connected }))
									setProfile((previous) => ({
										...previous,
										connections: previous.connections.map((item) =>
											item.id === connection.id
												? { ...item, isConnected: connected }
												: item,
										),
									}));
							}}
							variant={connection.isConnected ? "default" : "outline"}
						>
							{connection.isConnected ? <UserRoundCheckIcon /> : <UserIcon />}
						</Button>
					</div>
				))}
			</CardContent>
			<CardContent className="block">
				<AdminSubmitFeedback {...action} />
				<Button
					variant="outline"
					className="w-full"
					onClick={() => {
						if (onNavigateTab) onNavigateTab("connections");
						else navigate?.("/pages/user-profile?view=connections");
					}}
				>
					<SaasAdminText>{"View All Connections"}</SaasAdminText>
				</Button>
			</CardContent>
		</Card>
	);
}

export { Connections };
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
