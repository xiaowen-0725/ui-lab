"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useEffect, useState } from "react";

// Component Imports
import { AddEditUserSheet } from "@/components/pages/saas-admin/views/apps/users/dialogs/add-edit-user-sheet";
import { UserViewLeftPanel } from "@/components/pages/saas-admin/views/apps/users/view/user-view-left-panel";
import { UserViewTabs } from "@/components/pages/saas-admin/views/apps/users/view/user-view-tabs";

// Data Imports
import {
	SaasAdminLink,
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

const UserViewApp = () => {
	const { users, search, setUsers } = useSaasAdmin();
	const selectedId = new URLSearchParams(search).get("user");
	const STATIC_USER = selectedId
		? users.find((user) => user.id === selectedId)
		: users[0];

	const [isEditSheetOpen, setIsEditSheetOpen] = useState(
		() => new URLSearchParams(search).get("edit") === "1",
	);

	useEffect(() => {
		setIsEditSheetOpen(new URLSearchParams(search).get("edit") === "1");
	}, [search]);
	if (!STATIC_USER)
		return (
			<div role="status">
				<p>
					<SaasAdminText>User not found</SaasAdminText>
				</p>
				<SaasAdminLink href="/apps/users/list">
					<SaasAdminText>Back to users</SaasAdminText>
				</SaasAdminLink>
			</div>
		);

	return (
		<>
			<div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
				<UserViewLeftPanel
					user={STATIC_USER}
					onEdit={() => setIsEditSheetOpen(true)}
				/>
				<UserViewTabs user={STATIC_USER} />
			</div>

			<AddEditUserSheet
				mode={isEditSheetOpen ? "edit" : null}
				user={STATIC_USER}
				onClose={() => setIsEditSheetOpen(false)}
				onAdd={() => {}}
				onEdit={(id, data) => {
					setUsers((previous) =>
						previous.map((user) =>
							user.id === id ? { ...user, ...data } : user,
						),
					);
					setIsEditSheetOpen(false);
				}}
			/>
		</>
	);
};

export { UserViewApp };
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
