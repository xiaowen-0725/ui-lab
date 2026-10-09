"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/tabs/notifications-tab.tsx
// Adaptation: named exports and portable import/navigation boundaries.


// Third-party Imports
import { MailIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
// React Imports
import { useState } from "react";
// Type Imports
import type {
	AppUser,
	UserNotificationSetting,
} from "@/components/pages/saas-admin/types/apps/user-types";
import {
	AdminSubmitFeedback,
	useAdminSubmit,
} from "@/components/pages/saas-admin/use-submit";

// Component Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type NotificationChannel = keyof Pick<
	UserNotificationSetting,
	"email" | "browser" | "app"
>;

export interface NotificationsTabProps {
	user: AppUser;
}

export function NotificationsTab({ user }: NotificationsTabProps) {
	const { setUsers, t } = useSaasAdmin();
	const action = useAdminSubmit("users.notifications");
	const [settings, setSettings] = useState<UserNotificationSetting[]>(
		user.notificationSettings ?? [],
	);

	const handleToggle = (
		id: string,
		channel: NotificationChannel,
		value: boolean,
	) => {
		setSettings((prev) =>
			prev.map((setting) =>
				setting.id === id ? { ...setting, [channel]: value } : setting,
			),
		);
	};

	return (
		<Card className="gap-0 py-0">
			<CardHeader className="border-b px-6 py-4">
				<CardTitle className="text-base">
					<SaasAdminText>{"Notifications"}</SaasAdminText>
				</CardTitle>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>{"Choose how "}</SaasAdminText>
					<SaasAdminText>{user.name}</SaasAdminText>{" "}
					<SaasAdminText>
						{"receives notifications for account activity."}
					</SaasAdminText>
				</p>
			</CardHeader>
			<CardContent className="block px-0 pb-0">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="text-muted-foreground pl-6">
								<SaasAdminText>{"Type"}</SaasAdminText>
							</TableHead>
							<TableHead className="text-muted-foreground text-center">
								<div className="flex items-center justify-center gap-1.5">
									<MailIcon className="size-4" />
									<SaasAdminText>{"Email"}</SaasAdminText>
								</div>
							</TableHead>
							<TableHead className="text-muted-foreground text-center">
								<div className="flex items-center justify-center gap-1.5">
									<MonitorIcon className="size-4" />
									<SaasAdminText>{"Browser"}</SaasAdminText>
								</div>
							</TableHead>
							<TableHead className="text-muted-foreground pr-6 text-center">
								<div className="flex items-center justify-center gap-1.5">
									<SmartphoneIcon className="size-4" />
									<SaasAdminText>{"App"}</SaasAdminText>
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{settings.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={4}
									className="text-muted-foreground py-8 text-center text-sm"
								>
									<SaasAdminText>
										{"No notification settings found."}
									</SaasAdminText>
								</TableCell>
							</TableRow>
						) : (
							settings.map((setting) => (
								<TableRow key={setting.id}>
									<TableCell className="pl-6">
										<p className="font-medium">
											<SaasAdminText>{setting.title}</SaasAdminText>
										</p>
										<p className="text-muted-foreground text-sm">
											<SaasAdminText>{setting.description}</SaasAdminText>
										</p>
									</TableCell>
									<TableCell className="text-center">
										<Switch
											checked={setting.email}
											onCheckedChange={(value) =>
												handleToggle(setting.id, "email", value)
											}
											aria-label={`${t(setting.title)} ${t("Email Notifications")}`}
										/>
									</TableCell>
									<TableCell className="text-center">
										<Switch
											checked={setting.browser}
											onCheckedChange={(value) =>
												handleToggle(setting.id, "browser", value)
											}
											aria-label={`${t(setting.title)} ${t("Browser Notifications")}`}
										/>
									</TableCell>
									<TableCell className="pr-6 text-center">
										<Switch
											checked={setting.app}
											onCheckedChange={(value) =>
												handleToggle(setting.id, "app", value)
											}
											aria-label={`${t(setting.title)} ${t("App Notifications")}`}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<AdminSubmitFeedback {...action} />
				<div className="flex justify-end border-t px-6 py-4">
					<Button
						disabled={action.pending}
						onClick={async () => {
							const saved = settings.map((setting) => ({ ...setting }));
							if (await action.run({ userId: user.id, settings: saved }))
								setUsers((previous) =>
									previous.map((entry) =>
										entry.id === user.id
											? { ...entry, notificationSettings: saved }
											: entry,
									),
								);
						}}
					>
						<SaasAdminText>{"Save Changes"}</SaasAdminText>
					</Button>
				</div>
			</CardContent>
		</Card>
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
