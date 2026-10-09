"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/user-settings-tabs.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports

// Third-party Imports
import { useAdminQuery } from "@/components/pages/saas-admin/environment";

// Component Imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserGeneral } from "@/components/pages/saas-admin/views/pages/user-settings/general";
import { Workspace } from "@/components/pages/saas-admin/views/pages/user-settings/workspace";

const tabs = [
	{
		name: "General",
		value: "general",
		content: <UserGeneral />,
	},
	{
		name: "Workspace",
		value: "workspace",
		content: <Workspace />,
	},
];

const UserSettingsTabs = () => {
	const [activeSetting, setActiveSetting] = useAdminQuery(
		"setting",
		"general",
		["general", "workspace"],
	);

	return (
		<div className="w-full">
			<Tabs
				value={activeSetting}
				onValueChange={(value) => {
					setActiveSetting(value);
				}}
			>
				<div className="overflow-x-auto sm:overflow-visible">
					<TabsList
						variant="line"
						className="h-fit! w-max min-w-full flex-nowrap justify-start gap-0 rounded-none border-b p-0 sm:w-full sm:flex-wrap"
					>
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="not-data-active:hover:group-data-horizontal/tabs:after:bg-muted-foreground/30 shrink-0 border-0 group-data-horizontal/tabs:after:bottom-[-0.5px] not-data-active:hover:group-data-horizontal/tabs:after:opacity-100 sm:flex-0"
							>
								<SaasAdminText>{tab.name}</SaasAdminText>
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value} keepMounted>
						<SaasAdminText>{tab.content}</SaasAdminText>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export { UserSettingsTabs };
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
