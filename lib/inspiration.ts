export {
  INSPIRATION_BRANDS,
  INSPIRATION_BRANDS_UPSTREAM,
  type InspirationBrand,
  type InspirationBrandMetadataSource,
  type InspirationBrandParserMode,
} from "@/lib/inspiration-brands";
export { INSPIRATION_SITES, type InspirationSite } from "@/lib/inspiration-sites";
export {
	INSPIRATION_COLLECTION_META,
	INSPIRATION_DOMAIN_META,
	INSPIRATION_PAGE_TYPES,
	INSPIRATION_SITE_BADGES,
	INSPIRATION_VISUAL_TRAITS,
	type InspirationCollectionKey,
	type InspirationDomainKey,
	type InspirationPageTypeKey,
	type InspirationSiteBadgeKey,
	type InspirationVisualTraitKey,
} from "@/lib/inspiration-taxonomy";
import type {
	InspirationAccess,
	InspirationProvenance,
	InspirationRightsStatus,
} from "@/lib/inspiration-taxonomy";
export type { InspirationAccess, InspirationProvenance, InspirationRightsStatus } from "@/lib/inspiration-taxonomy";
import {
	inspirationScreenshot,
	type InspirationScreenshot,
} from "@/lib/inspiration-assets";

export type InspirationEntryKind = "source" | "site" | "brand" | "collection";

export type InspirationThemeKey =
  | "websites"
  | "product-ui"
  | "social-marketing"
  | "brand-identity"
  | "presentation-editorial"
  | "motion-3d";


export type InspirationContentType =
  | "website"
  | "landing-page"
  | "portfolio"
  | "web-interface"
  | "app-screen"
  | "social-post"
  | "og-image"
  | "logo"
  | "wordmark"
  | "brand-guideline"
  | "presentation"
  | "slide"
  | "editorial"
  | "motion"
  | "3d";

export type InspirationUseCase =
  | "web-design-inspiration"
  | "ui-inspiration"
  | "product-design"
  | "social-marketing"
  | "product-launch"
  | "brand-identity"
  | "design-system"
  | "logo-research"
  | "presentation-design"
  | "editorial-design"
  | "motion-reference"
  | "minimal-web-design";

export type InspirationVisualTrait =
  | "minimal"
  | "typographic"
  | "dark-mode"
  | "bold"
  | "animated"
  | "editorial"
  | "illustrative";


export type InspirationTheme = {
  key: InspirationThemeKey;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
};

export type InspirationSource = {
  slug: string;
  entryKind: InspirationEntryKind;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  url: string;
  canonicalUrl: string;
  description: string;
  descriptionZh: string;
  primaryTheme: InspirationThemeKey;
  secondaryThemes: readonly InspirationThemeKey[];
  contentTypes: readonly InspirationContentType[];
  useCases: readonly InspirationUseCase[];
  visualTraits: readonly InspirationVisualTrait[];
  access: InspirationAccess;
  rightsStatus: InspirationRightsStatus;
  provenance: readonly InspirationProvenance[];
  reviewedAt: string;
  screenshot: InspirationScreenshot;
};

export const INSPIRATION_THEMES: readonly InspirationTheme[] = [
  {
    key: "websites",
    name: "Websites",
    nameZh: "网站与页面",
    description: "Websites, landing pages, portfolios, and web craft.",
    descriptionZh: "网站、落地页、作品集与网页视觉工艺。",
  },
  {
    key: "product-ui",
    name: "Product UI",
    nameZh: "产品界面",
    description: "Apps, SaaS interfaces, and reusable interaction patterns.",
    descriptionZh: "App、SaaS 界面与可复用的交互模式。",
  },
  {
    key: "social-marketing",
    name: "Social & Marketing",
    nameZh: "社交与营销",
    description: "Social posts, open graph images, and campaign creative.",
    descriptionZh: "社交帖子、OG 分享图与营销传播视觉。",
  },
  {
    key: "brand-identity",
    name: "Brand Identity",
    nameZh: "品牌视觉",
    description: "Logos, identity systems, and real brand guidelines.",
    descriptionZh: "Logo、视觉识别系统与真实品牌规范。",
  },
  {
    key: "presentation-editorial",
    name: "Presentation & Editorial",
    nameZh: "演示与编辑",
    description: "Decks, reports, editorial, and print projects.",
    descriptionZh: "演示文稿、报告、编辑设计与印刷项目。",
  },
  {
    key: "motion-3d",
    name: "Motion & 3D",
    nameZh: "动效与 3D",
    description: "Motion design, 3D work, and interactive experiments.",
    descriptionZh: "动效设计、3D 作品与交互实验。",
  },
];

type InspirationSourceRecord = Omit<InspirationSource, "screenshot">;

const INSPIRATION_SOURCE_RECORDS: readonly InspirationSourceRecord[] = [
  {
    slug: "dribbble",
    entryKind: "source",
    name: "Dribbble",
    nameZh: "Dribbble 设计社区",
    aliases: ["Dribbble Shots", "dribbble.com"],
    url: "https://dribbble.com/",
    canonicalUrl: "https://dribbble.com/",
    description:
      "A broad designer community for discovering product UI, web, brand, illustration, and motion work.",
    descriptionZh: "覆盖产品界面、网页、品牌、插画与动效作品的综合设计师社区。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites", "brand-identity", "motion-3d"],
    contentTypes: ["web-interface", "app-screen", "website", "landing-page", "logo", "motion", "3d"],
    useCases: [
      "ui-inspiration",
      "web-design-inspiration",
      "product-design",
      "brand-identity",
      "motion-reference",
    ],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://dribbble.com/about",
        kind: "first-party",
        note: "Official history and community positioning.",
        noteZh: "官方历史与社区定位说明。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "behance",
    entryKind: "source",
    name: "Behance",
    nameZh: "Behance 创意作品社区",
    aliases: ["Adobe Behance", "behance.net"],
    url: "https://www.behance.net/",
    canonicalUrl: "https://www.behance.net/",
    description:
      "Adobe's creative network for browsing complete projects across branding, UI/UX, editorial, 3D, and motion.",
    descriptionZh: "Adobe 旗下创意网络，可浏览品牌、UI/UX、编辑、3D 与动效等完整项目案例。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["presentation-editorial", "product-ui", "motion-3d", "websites"],
    contentTypes: ["portfolio", "web-interface", "app-screen", "logo", "presentation", "editorial", "motion", "3d"],
    useCases: [
      "brand-identity",
      "ui-inspiration",
      "product-design",
      "presentation-design",
      "editorial-design",
      "motion-reference",
    ],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.behance.net/about?locale=en_US",
        kind: "first-party",
        note: "Official creative-network overview.",
        noteZh: "官方创意网络说明。",
      },
      {
        url: "https://help.behance.net/hc/en-us/articles/204484044-Guide-Discover-Creative-Work-on-Behance",
        kind: "first-party",
        note: "Official guide to curated discovery.",
        noteZh: "官方精选作品发现指南。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "awwwards",
    entryKind: "source",
    name: "Awwwards",
    nameZh: "Awwwards 网页设计奖",
    aliases: ["Awwwards Website Awards", "awwwards.com"],
    url: "https://www.awwwards.com/",
    canonicalUrl: "https://www.awwwards.com/",
    description:
      "An international award platform and discovery directory for notable websites, digital studios, and interactive craft.",
    descriptionZh: "面向优秀网站、数字工作室与互动技术的国际奖项平台和发现目录。",
    primaryTheme: "websites",
    secondaryThemes: ["product-ui", "motion-3d"],
    contentTypes: ["website", "landing-page", "portfolio", "web-interface", "motion", "3d"],
    useCases: ["web-design-inspiration", "ui-inspiration", "motion-reference"],
    visualTraits: ["animated", "bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.awwwards.com/about-us/",
        kind: "first-party",
        note: "Official awards and community positioning.",
        noteZh: "官方奖项与社区定位说明。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "siteinspire",
    entryKind: "source",
    name: "SiteInspire",
    nameZh: "SiteInspire 网站精选",
    aliases: ["siteinspire.com", "Site Inspire"],
    url: "https://www.siteinspire.com/",
    canonicalUrl: "https://www.siteinspire.com/",
    description:
      "A long-running showcase of carefully selected websites, searchable by style, type, subject, and platform.",
    descriptionZh: "长期维护的网站精选库，可按风格、类型、主题与建站平台筛选。",
    primaryTheme: "websites",
    secondaryThemes: [],
    contentTypes: ["website", "portfolio"],
    useCases: ["web-design-inspiration", "minimal-web-design"],
    visualTraits: ["minimal", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.siteinspire.com/",
        kind: "first-party",
        note: "Official public website inspiration gallery.",
        noteZh: "官方公开网站灵感展馆。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "land-book",
    entryKind: "source",
    name: "Land-book",
    nameZh: "Land-book 网页灵感库",
    aliases: ["Landbook", "land-book.com"],
    url: "https://land-book.com/",
    canonicalUrl: "https://land-book.com/",
    description:
      "A curated website library spanning full sites, page sections, mobile layouts, motion, headlines, and OG images.",
    descriptionZh: "覆盖整站、页面区块、移动布局、动效、标题与 OG 图片的策展灵感库。",
    primaryTheme: "websites",
    secondaryThemes: ["social-marketing", "motion-3d"],
    contentTypes: ["website", "landing-page", "portfolio", "motion", "og-image"],
    useCases: ["web-design-inspiration", "social-marketing", "product-launch", "motion-reference"],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://land-book.com/about_us",
        kind: "first-party",
        note: "Official curation mission.",
        noteZh: "官方策展定位说明。",
      },
      {
        url: "https://land-book.com/pro",
        kind: "first-party",
        note: "Official feature and access tiers.",
        noteZh: "官方功能与访问分层。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "lapa-ninja",
    entryKind: "source",
    name: "Lapa Ninja",
    nameZh: "Lapa Ninja 落地页灵感",
    aliases: ["Lapa", "lapa.ninja"],
    url: "https://www.lapa.ninja/",
    canonicalUrl: "https://www.lapa.ninja/",
    description:
      "A landing-page archive with full-page captures plus section, motion, color, platform, and OG-image browsing.",
    descriptionZh: "以完整落地页截图为核心，并支持按区块、动效、颜色、平台与 OG 图片浏览。",
    primaryTheme: "websites",
    secondaryThemes: ["social-marketing", "motion-3d"],
    contentTypes: ["website", "landing-page", "portfolio", "motion", "og-image"],
    useCases: ["web-design-inspiration", "social-marketing", "product-launch", "motion-reference"],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.lapa.ninja/about/",
        kind: "first-party",
        note: "Official archive history and scope.",
        noteZh: "官方档案历史与内容范围。",
      },
      {
        url: "https://www.lapa.ninja/pro/",
        kind: "first-party",
        note: "Official free and Pro access boundary.",
        noteZh: "官方免费与 Pro 访问边界。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "one-page-love",
    entryKind: "source",
    name: "One Page Love",
    nameZh: "One Page Love 单页网站库",
    aliases: ["OnePageLove", "onepagelove.com"],
    url: "https://onepagelove.com/",
    canonicalUrl: "https://onepagelove.com/",
    description:
      "A focused showcase of one-page websites, long-scrolling landing pages, templates, and individual sections.",
    descriptionZh: "聚焦单页网站、长滚动落地页、模板与独立页面区块的精选库。",
    primaryTheme: "websites",
    secondaryThemes: [],
    contentTypes: ["website", "landing-page", "portfolio"],
    useCases: ["web-design-inspiration", "minimal-web-design", "product-launch"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://onepagelove.com/about",
        kind: "first-party",
        note: "Official definition and project history.",
        noteZh: "官方单页网站定义与项目历史。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "css-design-awards",
    entryKind: "source",
    name: "CSS Design Awards",
    nameZh: "CSS Design Awards 网页奖项",
    aliases: ["CSSDA", "cssdesignawards.com"],
    url: "https://www.cssdesignawards.com/",
    canonicalUrl: "https://www.cssdesignawards.com/",
    description:
      "A judged web design and development gallery organized around UI, UX, innovation, nominees, and daily winners.",
    descriptionZh: "围绕 UI、UX、创新、提名与每日获奖作品组织的网页设计和开发评审展馆。",
    primaryTheme: "websites",
    secondaryThemes: ["motion-3d"],
    contentTypes: ["website", "landing-page", "portfolio"],
    useCases: ["web-design-inspiration", "motion-reference", "ui-inspiration"],
    visualTraits: ["animated", "bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.cssdesignawards.com/about",
        kind: "first-party",
        note: "Official judging system and gallery scope.",
        noteZh: "官方评审机制与展馆范围。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "mobbin",
    entryKind: "source",
    name: "Mobbin",
    nameZh: "Mobbin 产品界面参考",
    aliases: ["Mobbin UI", "mobbin.com"],
    url: "https://www.mobbin.com/",
    canonicalUrl: "https://www.mobbin.com/",
    description:
      "A reference library of production mobile apps, web apps, websites, screens, and reusable product patterns.",
    descriptionZh: "收集真实移动 App、Web App、网站截图与可复用产品模式的界面参考库。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites"],
    contentTypes: ["app-screen", "web-interface", "website", "landing-page"],
    useCases: ["ui-inspiration", "product-design", "web-design-inspiration", "design-system"],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://docs.mobbin.com/",
        kind: "first-party",
        note: "Official product and library overview.",
        noteZh: "官方产品与界面库说明。",
      },
      {
        url: "https://help.mobbin.com/en/articles/691776",
        kind: "first-party",
        note: "Official Free and subscription-plan boundary.",
        noteZh: "官方免费与订阅方案边界。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "page-flows",
    entryKind: "source",
    name: "Page Flows",
    nameZh: "Page Flows 用户流程库",
    aliases: ["PageFlows", "pageflows.com"],
    url: "https://pageflows.com/",
    canonicalUrl: "https://pageflows.com/",
    description:
      "A product UX library centered on recorded user flows, screens, UI elements, and common tasks from real apps.",
    descriptionZh: "以真实产品的录制流程、界面截图、UI 元素与常见任务为核心的 UX 参考库。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites"],
    contentTypes: ["app-screen", "web-interface", "website", "landing-page"],
    useCases: ["ui-inspiration", "product-design", "web-design-inspiration", "design-system"],
    visualTraits: [],
    access: "paid",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://pageflows.com/pricing",
        kind: "first-party",
        note: "Official trial and subscription access boundary.",
        noteZh: "官方试用与订阅访问边界。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "refero",
    entryKind: "source",
    name: "Refero",
    nameZh: "Refero 真实产品设计库",
    aliases: ["Refero Design", "refero.design"],
    url: "https://refero.design/",
    canonicalUrl: "https://refero.design/",
    description:
      "A research-oriented library of real product screens, complete user flows, UX patterns, and UI elements.",
    descriptionZh: "面向设计研究的真实产品截图、完整用户流程、UX 模式与 UI 元素库。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites"],
    contentTypes: ["app-screen", "web-interface", "website", "landing-page"],
    useCases: ["ui-inspiration", "product-design", "web-design-inspiration", "design-system"],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://refero.design/",
        kind: "first-party",
        note: "Official library categories and research positioning.",
        noteZh: "官方内容分类与研究定位。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "saasframe",
    entryKind: "source",
    name: "SaaSFrame",
    nameZh: "SaaSFrame SaaS 设计库",
    aliases: ["SaaS Frame", "saasframe.io"],
    url: "https://www.saasframe.io/",
    canonicalUrl: "https://www.saasframe.io/",
    description:
      "A SaaS-focused UX and UI library spanning marketing pages, product interfaces, onboarding, and email sequences.",
    descriptionZh: "聚焦 SaaS 的 UX/UI 参考库，覆盖营销页面、产品界面、引导流程与邮件序列。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites", "social-marketing"],
    contentTypes: ["app-screen", "web-interface", "website", "landing-page"],
    useCases: ["ui-inspiration", "product-design", "web-design-inspiration", "product-launch"],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.saasframe.io/",
        kind: "first-party",
        note: "Official library scope and access positioning.",
        noteZh: "官方内容范围与访问定位。",
      },
    ],
    reviewedAt: "2026-07-28",
  },
  {
    slug: "posts-design",
    entryKind: "source",
    name: "Posts",
    nameZh: "Posts 社交帖子灵感",
    aliases: ["Posts.design", "posts.design"],
    url: "https://posts.design/",
    canonicalUrl: "https://posts.design/",
    description:
      "A curated reference wall for recent social posts, launches, announcements, and product updates.",
    descriptionZh: "精选近期社交帖子、产品发布、公告与更新内容的设计参考墙。",
    primaryTheme: "social-marketing",
    secondaryThemes: [],
    contentTypes: ["social-post"],
    useCases: ["social-marketing", "product-launch"],
    visualTraits: ["animated", "bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://posts.design/",
        kind: "first-party",
        note: "Official public reference wall.",
        noteZh: "站点公开灵感墙。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "noiced",
    entryKind: "source",
    name: "Noiced",
    nameZh: "Noiced 网页灵感",
    aliases: ["Maze Heart Noiced", "noiced.com"],
    url: "https://noiced.com/",
    canonicalUrl: "https://noiced.com/",
    description: "Curated web design inspiration organized by site type, industry, and visual style.",
    descriptionZh: "按网站类型、行业与视觉风格整理的网页设计灵感。",
    primaryTheme: "websites",
    secondaryThemes: [],
    contentTypes: ["website", "landing-page", "editorial"],
    useCases: ["web-design-inspiration"],
    visualTraits: ["animated", "bold", "dark-mode", "minimal", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://noiced.com/",
        kind: "first-party",
        note: "Official public directory.",
        noteZh: "站点公开目录。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "minimum",
    entryKind: "source",
    name: "Minimum",
    nameZh: "Minimum 极简网站目录",
    aliases: ["mnmm.xyz", "Minimal websites directory"],
    url: "https://mnmm.xyz/",
    canonicalUrl: "https://mnmm.xyz/",
    description: "A focused directory of minimal websites, portfolios, studios, and product pages.",
    descriptionZh: "聚焦极简网站、作品集、工作室与产品页面的精选目录。",
    primaryTheme: "websites",
    secondaryThemes: [],
    contentTypes: ["website", "portfolio"],
    useCases: ["minimal-web-design", "web-design-inspiration"],
    visualTraits: ["minimal", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://mnmm.xyz/",
        kind: "first-party",
        note: "Official public directory.",
        noteZh: "站点公开目录。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "ogpedia",
    entryKind: "source",
    name: "OGPedia",
    nameZh: "OGPedia 分享图目录",
    aliases: ["OGPedia.xyz", "ogpedia.xyz"],
    url: "https://ogpedia.com/",
    canonicalUrl: "https://ogpedia.com/",
    description:
      "A directory of crafted open graph images for links that deserve a stronger first impression.",
    descriptionZh: "收集精心设计的 OG 分享图，帮助链接获得更有辨识度的第一印象。",
    primaryTheme: "social-marketing",
    secondaryThemes: [],
    contentTypes: ["og-image"],
    useCases: ["social-marketing"],
    visualTraits: ["typographic", "illustrative"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://ogpedia.com/",
        kind: "first-party",
        note: "Canonical URL declared by the site.",
        noteZh: "站点声明的 canonical 地址。",
      },
      {
        url: "https://ogpedia.xyz/",
        kind: "first-party",
        note: "User-provided public alias.",
        noteZh: "用户提供的公开别名地址。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "deck-gallery",
    entryKind: "source",
    name: "Deck.gallery",
    nameZh: "Deck.gallery 演示文稿库",
    aliases: ["Deck Gallery", "deck.gallery"],
    url: "https://deck.gallery/",
    canonicalUrl: "https://deck.gallery/",
    description:
      "Curated decks and individual slides spanning pitches, guidelines, reports, talks, and portfolios.",
    descriptionZh: "精选提案、品牌规范、报告、演讲与作品集等整套演示和单页幻灯片。",
    primaryTheme: "presentation-editorial",
    secondaryThemes: ["brand-identity"],
    contentTypes: ["presentation", "slide", "brand-guideline"],
    useCases: ["presentation-design", "brand-identity"],
    visualTraits: ["typographic", "editorial"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://deck.gallery/",
        kind: "first-party",
        note: "Official public gallery.",
        noteZh: "站点公开展馆。",
      },
      {
        url: "https://deck.gallery/info/",
        kind: "first-party",
        note: "Official information page.",
        noteZh: "站点官方说明页。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "logosystem",
    entryKind: "source",
    name: "Logosystem",
    nameZh: "Logosystem 标志系统库",
    aliases: ["Logo System", "logosystem.co"],
    url: "https://logosystem.co/",
    canonicalUrl: "https://logosystem.co/",
    description:
      "A searchable collection of logos, wordmarks, symbols, and animated identity marks.",
    descriptionZh: "可搜索筛选的 Logo、字标、符号与动态品牌标志参考库。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["motion-3d"],
    contentTypes: ["logo", "wordmark", "motion"],
    useCases: ["logo-research", "brand-identity"],
    visualTraits: ["minimal", "animated", "bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://logosystem.co/",
        kind: "first-party",
        note: "Official gallery and rights guidance.",
        noteZh: "站点公开展馆与权利说明。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "visual-journal",
    entryKind: "source",
    name: "Visual Journal",
    nameZh: "Visual Journal 视觉日志",
    aliases: ["visualjournal.it", "Alessandro Scarpellini"],
    url: "https://visualjournal.it/",
    canonicalUrl: "https://visualjournal.it/",
    description:
      "An editorial selection of branding and graphic design projects from around the world.",
    descriptionZh: "编辑精选全球品牌、平面与编辑设计项目的视觉日志。",
    primaryTheme: "presentation-editorial",
    secondaryThemes: ["brand-identity"],
    contentTypes: ["editorial"],
    useCases: ["editorial-design", "brand-identity"],
    visualTraits: ["editorial", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://visualjournal.it/",
        kind: "first-party",
        note: "Official editorial project gallery.",
        noteZh: "站点公开编辑策展页。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "brand-guidelines",
    entryKind: "source",
    name: "Brand Guidelines",
    nameZh: "Brand Guidelines 品牌规范库",
    aliases: ["Brand Styleguide Showcase", "brandguidelines.net"],
    url: "https://www.brandguidelines.net/",
    canonicalUrl: "https://www.brandguidelines.net/",
    description:
      "A handpicked showcase of real brand guidelines and identity resources from around the world.",
    descriptionZh: "精选全球真实品牌规范与视觉识别资源的展示目录。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["presentation-editorial"],
    contentTypes: ["brand-guideline", "presentation"],
    useCases: ["brand-identity", "design-system"],
    visualTraits: ["typographic", "editorial"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.brandguidelines.net/",
        kind: "first-party",
        note: "Official public showcase and rights notice.",
        noteZh: "站点公开展馆与权利声明。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
  {
    slug: "recent-design",
    entryKind: "source",
    name: "Recent",
    nameZh: "Recent 设计发现",
    aliases: ["Recent.design", "Godly", "recent.design"],
    url: "https://recent.design/",
    canonicalUrl: "https://recent.design/",
    description:
      "A broad curated feed spanning websites, interfaces, branding, motion, editorial, and digital products.",
    descriptionZh: "覆盖网站、界面、品牌、动效、编辑设计与数字产品的综合精选流。",
    primaryTheme: "websites",
    secondaryThemes: ["product-ui", "brand-identity", "presentation-editorial", "motion-3d"],
    contentTypes: ["website", "web-interface", "og-image", "app-screen", "motion", "3d"],
    useCases: ["web-design-inspiration", "ui-inspiration", "product-design", "motion-reference"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://recent.design/",
        kind: "first-party",
        note: "Official public curated feed.",
        noteZh: "站点公开精选流。",
      },
      {
        url: "https://recent.design/info",
        kind: "first-party",
        note: "Official information page.",
        noteZh: "站点官方说明页。",
      },
    ],
    reviewedAt: "2026-07-27",
  },
];

export const INSPIRATION_SOURCES: readonly InspirationSource[] =
	INSPIRATION_SOURCE_RECORDS.map((source) => ({
		...source,
		screenshot: inspirationScreenshot("sources", source.slug, source.url),
	}));
