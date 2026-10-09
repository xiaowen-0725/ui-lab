"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-profile/user-profile-tabs.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports

// Third-party Imports
import { useAdminQuery } from "@/components/pages/saas-admin/environment";

// Component Imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ConnectionsCard } from "@/components/pages/saas-admin/views/pages/user-profile/connections";
import { Profile } from "@/components/pages/saas-admin/views/pages/user-profile/profile";

const UserProfileTabs = () => {
	const [activeView, setActiveView] = useAdminQuery("view", "profile", [
		"profile",
		"connections",
	]);

	const tabs = [
		{
			name: "Profile",
			value: "profile",
			content: <Profile onNavigateTab={setActiveView} />,
		},
		{
			name: "Connections",
			value: "connections",
			content: <ConnectionsCard />,
		},
	];

	return (
		<div className="w-full">
			<Tabs
				className="gap-4"
				value={activeView}
				onValueChange={(value) => {
					setActiveView(value);
				}}
			>
				<TabsList className="max-sm:w-full">
					{tabs.map((tab) => (
						<TabsTrigger key={tab.value} value={tab.value}>
							<SaasAdminText>{tab.name}</SaasAdminText>
						</TabsTrigger>
					))}
				</TabsList>
				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value}>
						<SaasAdminText>{tab.content}</SaasAdminText>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export { UserProfileTabs };
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
