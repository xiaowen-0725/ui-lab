/** Shared classification vocabulary for the Inspiration Library. */
export const INSPIRATION_DOMAINS = [
	["ai-llm", "AI & LLM", "AI 与大模型", "Model providers, AI products, and AI-native tools.", "模型提供商、AI 产品与 AI 原生工具。"],
	["developer-tools", "Developer Tools & IDE", "开发工具与 IDE", "Editors, frameworks, terminals, and developer workflows.", "编辑器、框架、终端与开发者工作流。"],
	["cloud-data-devops", "Cloud, Data & DevOps", "云服务、数据与 DevOps", "Infrastructure, data platforms, observability, and operations.", "基础设施、数据平台、可观测性与运维。"],
	["productivity-saas", "Productivity & SaaS", "效率工具与 SaaS", "Workspaces, communication, and business software.", "工作空间、协作沟通与商业软件。"],
	["design-creative", "Design & Creative", "设计与创意工具", "Design software, creative platforms, and visual making.", "设计软件、创意平台与视觉创作。"],
	["fintech-crypto", "Fintech & Crypto", "金融科技与加密货币", "Payments, banking, transfers, and crypto products.", "支付、银行、转账与加密产品。"],
	["ecommerce-retail", "E-commerce & Retail", "电商与零售", "Commerce platforms, storefronts, and retail brands.", "电商平台、店铺与零售品牌。"],
	["media-content", "Media & Content", "媒体与内容", "Newsrooms, publishing, entertainment, and content platforms.", "新闻媒体、出版、娱乐与内容平台。"],
	["consumer-tech", "Consumer Tech & Telecom", "消费科技与通信", "Consumer devices, connectivity, and technology brands.", "消费设备、通信连接与科技品牌。"],
	["automotive-mobility", "Automotive & Mobility", "汽车与出行", "Vehicles, transport, and mobility services.", "车辆、交通与出行服务。"],
	["aerospace-industrial", "Aerospace & Industrial Tech", "航天与工业科技", "Space, aviation, manufacturing, and industrial technology.", "航天、航空、制造与工业科技。"],
	["travel-hospitality", "Travel & Hospitality", "旅行与酒店", "Travel, stays, and destination experiences.", "旅行、住宿与目的地体验。"],
	["education-knowledge", "Education & Knowledge", "教育与知识", "Learning products, research, and knowledge systems.", "学习产品、研究与知识系统。"],
	["health-wellness", "Health & Wellness", "健康与生活方式", "Health, wellbeing, and lifestyle services.", "健康、身心疗愈与生活方式服务。"],
	["fashion-luxury", "Fashion & Luxury", "时尚与奢侈品", "Fashion, luxury, and high-end commerce.", "时尚、奢侈品牌与高端零售。"],
	["agency-portfolio", "Agency & Portfolio", "机构与作品集", "Studios, agencies, and individual portfolios.", "工作室、创意机构与个人作品集。"],
	["food-beverage", "Food & Beverage", "食品与饮品", "Food, drinks, and hospitality brands.", "食品、饮品与餐饮品牌。"],
	["culture-nonprofit", "Culture & Nonprofit", "文化与非营利", "Museums, cultural institutions, and public-good organizations.", "博物馆、文化机构与公益组织。"],
] as const;

export type InspirationDomainKey = (typeof INSPIRATION_DOMAINS)[number][0];
export type InspirationDomain = {
	key: InspirationDomainKey;
	name: string;
	nameZh: string;
	description: string;
	descriptionZh: string;
};

export const INSPIRATION_DOMAIN_META: readonly InspirationDomain[] = INSPIRATION_DOMAINS.map(
	([key, name, nameZh, description, descriptionZh]) => ({ key, name, nameZh, description, descriptionZh }),
);

export const INSPIRATION_COLLECTIONS = [
	["retro-web", "Retro Web", "复古网页", "Period-specific references from the early web.", "来自早期互联网的年代网页参考。"],
] as const;
export type InspirationCollectionKey = (typeof INSPIRATION_COLLECTIONS)[number][0];
export type InspirationCollection = { key: InspirationCollectionKey; name: string; nameZh: string; description: string; descriptionZh: string };
export const INSPIRATION_COLLECTION_META: readonly InspirationCollection[] = INSPIRATION_COLLECTIONS.map(
	([key, name, nameZh, description, descriptionZh]) => ({ key, name, nameZh, description, descriptionZh }),
);

export const INSPIRATION_PAGE_TYPES = [
	["marketing-site", "Marketing Site", "品牌官网"], ["landing-page", "Landing Page", "落地页"], ["product-page", "Product Page", "产品页"], ["docs", "Documentation", "文档"], ["ecommerce", "E-commerce", "电商"], ["editorial", "Editorial", "编辑内容"], ["portfolio", "Portfolio", "作品集"], ["experimental", "Experimental", "实验性页面"],
] as const;
export type InspirationPageTypeKey = (typeof INSPIRATION_PAGE_TYPES)[number][0];
export const INSPIRATION_VISUAL_TRAITS = [
	["minimal", "Minimal", "极简"], ["typographic", "Typography-led", "排版驱动"], ["monochrome", "Monochrome", "黑白单色"], ["dark-mode", "Dark", "暗黑科技"], ["bold", "Bold", "大胆"], ["playful", "Playful", "趣味"], ["editorial", "Editorial", "编辑感"], ["illustrative", "Illustrative", "插画"], ["futuristic", "Futuristic", "未来感"], ["animated", "Animated", "动效"], ["three-dimensional", "3D", "三维"], ["photography-led", "Photography-led", "摄影驱动"],
] as const;
export type InspirationVisualTraitKey = (typeof INSPIRATION_VISUAL_TRAITS)[number][0];
export const INSPIRATION_SITE_BADGES = [
	["industry-reference", "Industry Reference", "行业标杆"], ["editor-pick", "Editor Pick", "编辑精选"], ["independent-gem", "Independent Gem", "独立佳作"],
] as const;
export type InspirationSiteBadgeKey = (typeof INSPIRATION_SITE_BADGES)[number][0];

export type InspirationAccess = "public" | "login-required" | "freemium" | "paid" | "unknown";
export type InspirationRightsStatus = "external-only" | "licensed-reuse" | "permission-required" | "unknown";
export type InspirationProvenance = { url: string; kind: "first-party"; note: string; noteZh: string };
