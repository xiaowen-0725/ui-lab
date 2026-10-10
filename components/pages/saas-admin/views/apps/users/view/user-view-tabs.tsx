"use client";
import {
	SaasAdminText,
	useAdminQuery,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/user-view-tabs.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Type Imports
import type { AppUser } from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountTab } from "@/components/pages/saas-admin/views/apps/users/view/tabs/account-tab";
import { BillingTab } from "@/components/pages/saas-admin/views/apps/users/view/tabs/billing-tab";
import { ConnectionsTab } from "@/components/pages/saas-admin/views/apps/users/view/tabs/connections-tab";
import { NotificationsTab } from "@/components/pages/saas-admin/views/apps/users/view/tabs/notifications-tab";
import { SecurityTab } from "@/components/pages/saas-admin/views/apps/users/view/tabs/security-tab";

export interface UserViewTabsProps {
	user: AppUser;
}

export function UserViewTabs({ user }: UserViewTabsProps) {
	const [tab, setTab] = useAdminQuery("tab", "account", [
		"account",
		"security",
		"billing",
		"notifications",
		"connections",
	]);
	return (
		<Tabs
			value={tab}
			onValueChange={setTab}
			className="flex-1 justify-between gap-6"
		>
			<div className="overflow-x-auto">
				<TabsList className="w-max min-w-full **:group-data-[orientation=horizontal]/tabs:after:h-0">
					<TabsTrigger value="account">
						<SaasAdminText>{"Account"}</SaasAdminText>
					</TabsTrigger>
					<TabsTrigger value="security">
						<SaasAdminText>{"Security"}</SaasAdminText>
					</TabsTrigger>
					<TabsTrigger value="billing">
						<SaasAdminText>{"Billing & Plans"}</SaasAdminText>
					</TabsTrigger>
					<TabsTrigger value="notifications">
						<SaasAdminText>{"Notifications"}</SaasAdminText>
					</TabsTrigger>
					<TabsTrigger value="connections">
						<SaasAdminText>{"Connections"}</SaasAdminText>
					</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="account">
				<AccountTab user={user} />
			</TabsContent>
			<TabsContent value="security">
				<SecurityTab user={user} />
			</TabsContent>
			<TabsContent value="billing">
				<BillingTab user={user} />
			</TabsContent>
			<TabsContent value="notifications">
				<NotificationsTab user={user} />
			</TabsContent>
			<TabsContent value="connections">
				<ConnectionsTab user={user} />
			</TabsContent>
		</Tabs>
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
