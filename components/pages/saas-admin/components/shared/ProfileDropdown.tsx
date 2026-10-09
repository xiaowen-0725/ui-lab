"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";
import { imageImagesAvatarsAvatar1Webp } from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/components/shared/ProfileDropdown.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

// Third-party Imports
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATIC_USER = {
	fullName: "John Doe",
	email: "john.doe@example.com",
	imageUrl: imageImagesAvatarsAvatar1Webp,
	initials: "JD",
};

const ProfileDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="relative rounded-full hover:bg-transparent"
					/>
				}
			>
				<Avatar>
					<AvatarImage src={STATIC_USER.imageUrl} alt={STATIC_USER.fullName} />
					<AvatarFallback>
						<SaasAdminText>{STATIC_USER.initials}</SaasAdminText>
					</AvatarFallback>
				</Avatar>
				<span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex items-center gap-4 px-2 py-2.5 font-normal">
						<div className="relative">
							<Avatar className="size-10">
								<AvatarImage
									src={STATIC_USER.imageUrl}
									alt={STATIC_USER.fullName}
								/>
								<AvatarFallback>
									<SaasAdminText>{STATIC_USER.initials}</SaasAdminText>
								</AvatarFallback>
							</Avatar>
							<span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
						</div>
						<div className="flex flex-1 flex-col items-start">
							<span className="text-foreground text-base font-semibold">
								<SaasAdminText>{STATIC_USER.fullName}</SaasAdminText>
							</span>
							<span className="text-muted-foreground text-sm">
								<SaasAdminText>{STATIC_USER.email}</SaasAdminText>
							</span>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						render={<Link href="/pages/user-profile?view=profile" />}
					>
						<UserIcon />
						<span>
							<SaasAdminText>{"My Account"}</SaasAdminText>
						</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						render={<Link href="/pages/user-settings?setting=general" />}
					>
						<SettingsIcon />
						<span>
							<SaasAdminText>{"Settings"}</SaasAdminText>
						</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						render={<Link href="/pages/auth/login" />}
					>
						<LogOutIcon />
						<span>
							<SaasAdminText>{"Sign out"}</SaasAdminText>
						</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { ProfileDropdown };
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
