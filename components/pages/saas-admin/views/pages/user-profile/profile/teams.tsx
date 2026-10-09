"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-profile/profile/teams.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// Third-party Imports
import { EllipsisVerticalIcon } from "lucide-react";

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

type TeamsProps = {
	className?: string;
};

function Teams({ className }: TeamsProps) {
	const { profile: db } = useSaasAdmin();
	const action = useAdminSubmit("profile.teams");
	const { teamActions, teams } = db;

	return (
		<Card className={cn(className)}>
			<CardHeader className="flex items-center justify-between">
				<span className="text-lg font-medium">
					<SaasAdminText>{"Teams"}</SaasAdminText>
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
							{teamActions.map((item, index) => (
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
				{teams.map((team) => (
					<div
						key={team.id}
						className="flex items-center justify-between gap-2"
					>
						<div className="flex items-center justify-between gap-4">
							<Avatar size="lg">
								{team.avatar ? (
									<AvatarImage src={team.avatar} alt={team.teams} />
								) : null}
								<AvatarFallback>
									<SaasAdminText>{team.initials}</SaasAdminText>
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-0.5">
								<span className="text-base font-medium">
									<SaasAdminText>{team.teams}</SaasAdminText>
								</span>
								<span className="text-muted-foreground text-sm">
									<SaasAdminText>{team.totalMembers}</SaasAdminText>
								</span>
							</div>
						</div>
						<Badge variant="outline" className="h-6 px-2 py-1">
							<SaasAdminText>{team.teamBadge.label}</SaasAdminText>
						</Badge>
					</div>
				))}
			</CardContent>
			<CardContent className="block">
				<AdminSubmitFeedback {...action} />
				<Button
					variant="outline"
					className="w-full"
					disabled={action.pending}
					onClick={() => void action.run({ operation: "view-all" })}
				>
					<SaasAdminText>{"View All Teams"}</SaasAdminText>
				</Button>
			</CardContent>
		</Card>
	);
}

export { Teams };
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
