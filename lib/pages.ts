export type ApplicationProfile = "next-app" | "vite-app" | "electron-renderer";

export interface PageDefinition {
	slug: string;
	name: string;
	nameZh: string;
	description: string;
	descriptionZh: string;
	aliases: string[];
	componentSlug: string;
	components: string[];
	profiles: ApplicationProfile[];
	pagePath: `/pages/${string}`;
}

export const PAGES: readonly PageDefinition[] = [
	{
		slug: "saas-landing-page",
		name: "SaaS Landing Page",
		nameZh: "SaaS 落地页",
		description:
			"A complete landing page composed of distributable sections with navigation, pricing, FAQ and conversion actions.",
		descriptionZh:
			"由可分发区块组成的完整落地页，包含导航、定价、常见问题与转化操作。",
		aliases: [
			"marketing page",
			"产品落地页",
			"SaaS 首页",
			"SaaS 模板",
			"页面模板",
		],
		componentSlug: "saas-landing-page",
		components: [
			"navbar-simple",
			"hero-screenshot",
			"logo-wall-row",
			"features-grid",
			"features-alternating",
			"stats-row",
			"testimonials-cards",
			"pricing-tiers",
			"faq-accordion",
			"cta-banner",
			"footer-columns",
		],
		profiles: ["next-app", "vite-app", "electron-renderer"],
		pagePath: "/pages/saas-landing-page",
	},
	{
		slug: "workbench-conversation-page",
		name: "Workbench Conversation Page",
		nameZh: "工作台会话页",
		description:
			"A reusable conversation page with message history, a composer and explicit loading, empty and error states.",
		descriptionZh:
			"可独立复用的会话页面，包含消息记录、输入区和加载、空白、错误状态。",
		aliases: ["chat page", "会话页面", "Agent 对话"],
		componentSlug: "workbench-conversation-page",
		components: ["agent-thread", "agent-composer"],
		profiles: ["next-app", "vite-app", "electron-renderer"],
		pagePath: "/pages/workbench-conversation-page",
	},
	{
		slug: "workbench-artifact-page",
		name: "Workbench Artifact Page",
		nameZh: "工作台制品页",
		description:
			"A reusable artifact library and detail page with preview/code switching and consumer-owned actions.",
		descriptionZh:
			"可独立复用的制品列表与详情页面，支持预览、源码切换及消费方操作回调。",
		aliases: ["artifact library", "制品库", "生成结果页"],
		componentSlug: "workbench-artifact-page",
		components: ["artifact-panel"],
		profiles: ["next-app", "vite-app", "electron-renderer"],
		pagePath: "/pages/workbench-artifact-page",
	},
	{
		slug: "workbench-settings-page",
		name: "Workbench Settings Page",
		nameZh: "工作台设置页",
		description:
			"A reusable workspace preferences page with controlled or local form values and save callbacks.",
		descriptionZh: "可独立复用的工作区设置页，支持受控或本地表单值及保存回调。",
		aliases: ["preferences page", "偏好设置", "工作区设置"],
		componentSlug: "workbench-settings-page",
		components: ["settings-panel", "switch"],
		profiles: ["next-app", "vite-app", "electron-renderer"],
		pagePath: "/pages/workbench-settings-page",
	},
	{
		slug: "saas-admin-orders-page",
		name: "SaaS Admin Orders Page",
		nameZh: "SaaS 后台订单总览页",
		description: "Orders metrics, charts and transaction table.",
		descriptionZh: "订单指标、图表与交易表格。",
		aliases: ["SaaS admin", "订单总览"],
		componentSlug: "saas-admin-orders-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-orders-page",
	},
	{
		slug: "saas-admin-users-page",
		name: "SaaS Admin Users Page",
		nameZh: "SaaS 后台用户管理页",
		description: "User list and five-tab detail with a shared data boundary.",
		descriptionZh: "用户列表及五标签详情，共用数据与动作接口。",
		aliases: ["SaaS admin", "用户管理"],
		componentSlug: "saas-admin-users-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-users-page",
	},
	{
		slug: "saas-admin-profile-page",
		name: "SaaS Admin Profile Page",
		nameZh: "SaaS 后台个人资料页",
		description: "Profile and connections with URL-compatible tabs.",
		descriptionZh: "个人资料与连接，标签可由 URL 控制。",
		aliases: ["SaaS admin", "个人资料"],
		componentSlug: "saas-admin-profile-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-profile-page",
	},
	{
		slug: "saas-admin-settings-page",
		name: "SaaS Admin Settings Page",
		nameZh: "SaaS 后台设置页",
		description:
			"General and workspace preferences with consumer save callbacks.",
		descriptionZh: "常规与工作区设置，通过回调接入保存。",
		aliases: ["SaaS admin", "设置"],
		componentSlug: "saas-admin-settings-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-settings-page",
	},
	{
		slug: "saas-admin-data-table-page",
		name: "SaaS Admin Data Table Page",
		nameZh: "SaaS 后台数据表格页",
		description: "Basic, pinnable and filterable table examples.",
		descriptionZh: "基础、列固定和筛选三个表格示例。",
		aliases: ["SaaS admin", "数据表格"],
		componentSlug: "saas-admin-data-table-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-data-table-page",
	},
	{
		slug: "saas-admin-forms-page",
		name: "SaaS Admin Forms Page",
		nameZh: "SaaS 后台表单页",
		description: "Vertical, horizontal and four validation modes.",
		descriptionZh: "纵向、横向与四种校验模式表单。",
		aliases: ["SaaS admin", "表单"],
		componentSlug: "saas-admin-forms-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-forms-page",
	},
	{
		slug: "saas-admin-login-page",
		name: "SaaS Admin Login Page",
		nameZh: "SaaS 后台登录页",
		description: "Login form with a consumer submit boundary.",
		descriptionZh: "通过消费者回调提交的登录表单。",
		aliases: ["SaaS admin", "登录"],
		componentSlug: "saas-admin-login-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-login-page",
	},
	{
		slug: "saas-admin-register-page",
		name: "SaaS Admin Register Page",
		nameZh: "SaaS 后台注册页",
		description: "Registration form with a consumer submit boundary.",
		descriptionZh: "通过消费者回调提交的注册表单。",
		aliases: ["SaaS admin", "注册"],
		componentSlug: "saas-admin-register-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-register-page",
	},
	{
		slug: "saas-admin-forgot-password-page",
		name: "SaaS Admin Forgot Password Page",
		nameZh: "SaaS 后台找回密码页",
		description: "Password recovery form with a consumer submit boundary.",
		descriptionZh: "通过消费者回调提交的找回密码表单。",
		aliases: ["SaaS admin", "找回密码"],
		componentSlug: "saas-admin-forgot-password-page",
		components: [],
		profiles: ["next-app", "vite-app"],
		pagePath: "/pages/saas-admin-forgot-password-page",
	},
];
