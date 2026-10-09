import type { ApplicationProfile } from "./pages";

export interface SiteDefinition {
	slug: string;
	name: string;
	nameZh: string;
	description: string;
	descriptionZh: string;
	aliases: string[];
	componentSlug: string;
	components: string[];
	profiles: ApplicationProfile[];
	shellComponent: string;
	pages: string[];
	recommendedSystem: string;
	pagePath: `/sites/${string}`;
	useCase?: "workspace" | "marketing" | "personal";
}

export const SITES: readonly SiteDefinition[] = [
	{
		useCase: "workspace",
		slug: "agent-workbench-site",
		name: "Agent Workbench Site",
		nameZh: "Agent 多页工作台",
		description:
			"Conversation, artifact and settings pages sharing the existing responsive Workbench shell and theme.",
		descriptionZh:
			"会话、制品与设置三个独立页面，共享现有响应式 Workbench 外壳与主题。",
		aliases: [
			"multi-page workbench",
			"多页工作台",
			"Agent workspace",
			"工作台模板",
			"整站模板",
		],
		componentSlug: "agent-workbench-site",
		shellComponent: "agent-workbench",
		components: [
			"agent-workbench",
			"thread-list",
			"workbench-conversation-page",
			"workbench-artifact-page",
			"workbench-settings-page",
		],
		pages: [
			"workbench-conversation-page",
			"workbench-artifact-page",
			"workbench-settings-page",
		],
		profiles: ["next-app", "vite-app", "electron-renderer"],
		recommendedSystem: "graphite",
		pagePath: "/sites/agent-workbench-site",
	},
	{
		useCase: "workspace",
		slug: "saas-admin-site",
		name: "SaaS Admin Site",
		nameZh: "SaaS 后台整站",
		description:
			"Nine frontend page responsibilities and twelve routes sharing an official Base UI shell, neutral and Blue Ink themes.",
		descriptionZh:
			"九类前端页面、十二个路由，共用官方 Base UI 控件外壳，支持默认与 Blue Ink 主题。",
		aliases: ["SaaS admin", "后台模板", "整站模板"],
		componentSlug: "saas-admin-site",
		shellComponent: "saas-admin-shell",
		components: [
			"saas-admin-shell",
			"saas-admin-orders-page",
			"saas-admin-users-page",
			"saas-admin-profile-page",
			"saas-admin-settings-page",
			"saas-admin-data-table-page",
			"saas-admin-forms-page",
			"saas-admin-login-page",
			"saas-admin-register-page",
			"saas-admin-forgot-password-page",
		],
		pages: [
			"saas-admin-orders-page",
			"saas-admin-users-page",
			"saas-admin-profile-page",
			"saas-admin-settings-page",
			"saas-admin-data-table-page",
			"saas-admin-forms-page",
			"saas-admin-login-page",
			"saas-admin-register-page",
			"saas-admin-forgot-password-page",
		],
		profiles: ["next-app", "vite-app"],
		recommendedSystem: "saas-admin-default",
		pagePath: "/sites/saas-admin-site",
	},
];
