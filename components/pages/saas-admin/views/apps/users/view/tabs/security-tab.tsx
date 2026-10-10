"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/tabs/security-tab.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
// React Imports
import { useRef, useState } from "react";

// Type Imports
import type { AppUser } from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export interface SecurityTabProps {
	user: AppUser;
}

export function SecurityTab({ user }: SecurityTabProps) {
	const { t, setUsers } = useSaasAdmin();
	const verification = useAdminSubmit("users.two-factor");
	const action = useAdminSubmit("users.password");
	const fields = useRef<HTMLDivElement>(null);

	const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
		user.twoFactorEnabled ?? false,
	);
	const recentDevices = user.recentDevices ?? [];

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">
						<SaasAdminText>{"Change Password"}</SaasAdminText>
					</CardTitle>
				</CardHeader>
				<CardContent ref={fields} className="block space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="current-password">
								<SaasAdminText>{"Current Password"}</SaasAdminText>
							</Label>
							<Input
								id="current-password"
								type="password"
								placeholder={t("············")}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="new-password">
								<SaasAdminText>{"New Password"}</SaasAdminText>
							</Label>
							<Input
								id="new-password"
								type="password"
								placeholder={t("············")}
							/>
						</div>
					</div>
					<div className="space-y-2 md:max-w-md">
						<Label htmlFor="confirm-password">
							<SaasAdminText>{"Confirm New Password"}</SaasAdminText>
						</Label>
						<Input
							id="confirm-password"
							type="password"
							placeholder={t("············")}
						/>
					</div>
					<ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
						<li>
							<SaasAdminText>
								{"Minimum 8 characters long — the more, the better"}
							</SaasAdminText>
						</li>
						<li>
							<SaasAdminText>
								{"At least one lowercase & one uppercase character"}
							</SaasAdminText>
						</li>
						<li>
							<SaasAdminText>
								{"At least one number, symbol, or whitespace character"}
							</SaasAdminText>
						</li>
					</ul>
					<AdminSubmitFeedback {...action} />
					<Button
						disabled={action.pending}
						onClick={() => {
							const values = Object.fromEntries(
								Array.from(fields.current?.querySelectorAll("input") ?? []).map(
									(input) => [input.id, input.value],
								),
							);
							void action.run({ userId: user.id, ...values });
						}}
					>
						<SaasAdminText>{"Save Changes"}</SaasAdminText>
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between gap-4">
					<div>
						<CardTitle className="text-base">
							<SaasAdminText>{"Two-steps verification"}</SaasAdminText>
						</CardTitle>
						<p className="text-muted-foreground mt-1 text-sm">
							<SaasAdminText>
								{"Keep your account secure with authentication step."}
							</SaasAdminText>
						</p>
					</div>
					<Switch
						checked={user.twoFactorEnabled ?? isTwoFactorEnabled}
						disabled={verification.pending}
						onCheckedChange={async (enabled) => {
							if (await verification.run({ userId: user.id, enabled })) {
								setIsTwoFactorEnabled(enabled);
								setUsers((previous) =>
									previous.map((entry) =>
										entry.id === user.id
											? { ...entry, twoFactorEnabled: enabled }
											: entry,
									),
								);
							}
						}}
						aria-label={t("Two-step verification")}
					/>
				</CardHeader>
				<CardContent className="block">
					<AdminSubmitFeedback {...verification} />
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{(user.twoFactorEnabled ?? isTwoFactorEnabled)
								? "Two-factor authentication is enabled for this account."
								: "Two-factor authentication is not enabled yet."}
						</SaasAdminText>
					</p>
				</CardContent>
			</Card>

			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-6 py-4">
					<CardTitle className="text-base">
						<SaasAdminText>{"Recent Devices"}</SaasAdminText>
					</CardTitle>
				</CardHeader>
				<section
					aria-label={t("Recent Devices")}
					// biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need access to this horizontal scroll region.
					tabIndex={0}
					className="overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring [&>[data-slot=table-container]]:overflow-visible"
				>
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="text-muted-foreground pl-6">
									<SaasAdminText>{"Browser"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Device"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground">
									<SaasAdminText>{"Location"}</SaasAdminText>
								</TableHead>
								<TableHead className="text-muted-foreground pr-6 text-right">
									<SaasAdminText>{"Recent Activity"}</SaasAdminText>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentDevices.length === 0 ? (
								<TableRow className="hover:bg-transparent">
									<TableCell
										colSpan={4}
										className="text-muted-foreground py-8 text-center text-sm"
									>
										<SaasAdminText>{"No recent devices found."}</SaasAdminText>
									</TableCell>
								</TableRow>
							) : (
								recentDevices.map((device) => (
									<TableRow key={device.id}>
										<TableCell className="pl-6 font-medium">
											<SaasAdminText>{device.browser}</SaasAdminText>
										</TableCell>
										<TableCell className="text-muted-foreground">
											<SaasAdminText>{device.device}</SaasAdminText>
										</TableCell>
										<TableCell className="text-muted-foreground">
											<SaasAdminText>{device.location}</SaasAdminText>
										</TableCell>
										<TableCell className="pr-6 text-right">
											{device.isCurrentDevice ? (
												<span className="text-primary text-sm font-medium">
													<SaasAdminText>{device.lastActive}</SaasAdminText>
												</span>
											) : (
												<span className="text-muted-foreground text-sm">
													<SaasAdminText>{device.lastActive}</SaasAdminText>
												</span>
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</section>
			</Card>
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
