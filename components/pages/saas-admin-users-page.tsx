"use client";
import { UserViewApp } from "./saas-admin/views/apps/users/view";
import { UserListApp } from "./saas-admin/views/apps/users/list";
import { SaasAdminPageFrame } from "./saas-admin/page-frame";
import {
	useSaasAdmin,
	type SaasAdminEnvironmentProps,
} from "./saas-admin/environment";
export type { SaasAdminEnvironmentProps } from "./saas-admin/environment";

function UsersPageContent({ view }: { view: "list" | "detail" }) {
	const { search, users } = useSaasAdmin();
	const userId = new URLSearchParams(search).get("user") || users[0]?.id;
	return view === "detail" ? <UserViewApp key={userId} /> : <UserListApp />;
}

export function SaasAdminUsersPage({
	view = "list",
	...props
}: SaasAdminEnvironmentProps & { view?: "list" | "detail" }) {
	return (
		<SaasAdminPageFrame pageTitle="Users" {...props}>
			<UsersPageContent view={view} />
		</SaasAdminPageFrame>
	);
}
