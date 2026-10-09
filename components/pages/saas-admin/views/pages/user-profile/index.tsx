"use client";
import { useHydratedReducedMotion } from "@/lib/hooks/use-hydrated-reduced-motion";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-profile/index.tsx
import { imageImagesAvatarsAvatar1Webp } from "@/components/pages/saas-admin/assets/images";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// React Imports
import { Suspense, useState } from "react";

// Third-party Imports
import {
	BriefcaseBusinessIcon,
	CalendarDaysIcon,
	MapPinIcon,
	UserRoundCheckIcon,
} from "lucide-react";

// Component Imports
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BackgroundRippleEffect } from "@/components/pages/saas-admin/blocks/profile-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfileTabs } from "@/components/pages/saas-admin/views/pages/user-profile/user-profile-tabs";

const UserProfile = () => {
	const reducedMotion = useHydratedReducedMotion();
	const [decoration, setDecoration] = useState(true);
	const { t, profileHeader } = useSaasAdmin();
	const identity = profileHeader ?? {
		name: "John Doe",
		avatar: imageImagesAvatarsAvatar1Webp,
		role: "UX Designer",
		location: "India",
		memberSince: "April 2021",
		connected: true,
	};
	const action = useAdminSubmit("profile.connect");
	const [localConnected, setLocalConnected] = useState(true);
	const connected = profileHeader?.connected ?? localConnected;

	return (
		<div>
			<div className="mb-4 md:mb-6 lg:mb-10">
				<Card className="py-0 pb-6">
					<div className="bg-muted relative h-44 overflow-hidden">
						<Button
							className="absolute right-2 top-2 z-10"
							variant="outline"
							size="sm"
							onClick={() => setDecoration((previous) => !previous)}
						>
							{t(decoration ? "Pause background" : "Resume background")}
						</Button>
						<div
							className="absolute inset-0 motion-reduce:hidden"
							aria-hidden="true"
						>
							{reducedMotion === false && decoration && (
								<BackgroundRippleEffect
									cellSize={45}
									rows={8}
									activeSquares={18}
									cols={45}
								/>
							)}
						</div>
					</div>

					<CardContent className="block">
						<div className="flex items-end gap-4 pb-1 max-md:flex-col max-md:items-center md:flex-nowrap md:gap-6">
							<Avatar className="ring-card z-3 -mt-12 size-28 rounded-md ring-4 after:rounded-[inherit] md:-mt-14">
								<AvatarImage
									src={identity.avatar}
									alt={identity.name}
									className="rounded-[inherit]"
								/>
							</Avatar>

							<div className="min-w-0 flex-1 space-y-2 text-center md:text-left">
								<h2 className="text-2xl font-medium">{identity.name}</h2>
								<div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 max-md:justify-center">
									<span className="inline-flex items-center gap-2">
										<BriefcaseBusinessIcon className="size-4.5" />
										<SaasAdminText>{identity.role}</SaasAdminText>
									</span>
									<span className="inline-flex items-center gap-2">
										<MapPinIcon className="size-4.5" />
										<SaasAdminText>{identity.location}</SaasAdminText>
									</span>
									<span className="inline-flex items-center gap-2">
										<CalendarDaysIcon className="size-4.5" />
										<SaasAdminText>{identity.memberSince}</SaasAdminText>
									</span>
								</div>
							</div>

							<Button
								className="md:ml-auto md:self-end"
								disabled={action.pending}
								onClick={async () => {
									const next = !connected;
									if (
										await action.run({ connected: next, name: identity.name })
									)
										setLocalConnected(next);
								}}
							>
								<UserRoundCheckIcon className="size-4" />
								<SaasAdminText>
									{connected ? "Connected" : "Connect"}
								</SaasAdminText>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
			<AdminSubmitFeedback {...action} />
			<Suspense>
				<UserProfileTabs />
			</Suspense>
		</div>
	);
};

export { UserProfile };

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
