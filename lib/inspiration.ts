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
  {
    slug: "shadcn-studio",
    entryKind: "source",
    name: "Shadcn Studio",
    nameZh: "Shadcn Studio 组件库",
    aliases: ["shadcnstudio", "shadcnstudio.com", "shadcn/studio"],
    url: "https://shadcnstudio.com/",
    canonicalUrl: "https://shadcnstudio.com/",
    description:
      "A shadcn/ui block and template marketplace for marketing pages, dashboards, ecommerce, and themes, with free and pro assets plus CLI/copy-paste install.",
    descriptionZh:
      "面向 shadcn/ui 的区块与模板市场，覆盖营销页、仪表盘、电商与主题；提供免费与付费资产，支持 CLI 或复制粘贴安装。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites", "motion-3d"],
    contentTypes: ["web-interface", "app-screen", "website", "landing-page"],
    useCases: ["ui-inspiration", "product-design", "web-design-inspiration"],
    visualTraits: ["minimal", "dark-mode", "animated"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://shadcnstudio.com/",
        kind: "first-party",
        note: "Official product positioning for blocks, templates, themes, and AI tooling.",
        noteZh: "官方对区块、模板、主题与 AI 工具的产品定位。",
      },
      {
        url: "https://shadcnstudio.com/blocks",
        kind: "first-party",
        note: "Public blocks catalog spanning marketing, dashboard, ecommerce, and bento layouts.",
        noteZh: "公开区块目录，覆盖营销、仪表盘、电商与 bento 布局。",
      },
    ],
    reviewedAt: "2026-08-08",
  },
  {
    slug: "react-bits",
    entryKind: "source",
    name: "React Bits",
    nameZh: "React Bits 动效组件",
    aliases: ["reactbits", "reactbits.dev", "DavidHDev/react-bits"],
    url: "https://reactbits.dev/",
    canonicalUrl: "https://reactbits.dev/",
    description:
      "An open-source gallery of animated React components and backgrounds—text effects, cursors, shaders—shipped as copy-paste source rather than a lock-in package.",
    descriptionZh:
      "开源 React 动效组件与背景图库（文字特效、光标、着色器等），以复制源码方式分发，而非锁死依赖包。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["product-ui", "websites"],
    contentTypes: ["motion", "3d", "web-interface", "website"],
    useCases: ["motion-reference", "ui-inspiration", "web-design-inspiration"],
    visualTraits: ["animated", "dark-mode", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://reactbits.dev/",
        kind: "first-party",
        note: "Official homepage: animated components for creative developers, free tier plus Pro.",
        noteZh: "官方首页：面向创意开发者的动效组件，免费层与 Pro。",
      },
      {
        url: "https://github.com/DavidHDev/react-bits",
        kind: "first-party",
        note: "Official GitHub repository for the open-source component collection.",
        noteZh: "开源组件集合的官方 GitHub 仓库。",
      },
    ],
    reviewedAt: "2026-08-08",
  },
  {
    slug: "motionsites",
    entryKind: "source",
    name: "MotionSites",
    nameZh: "MotionSites 动效网站提示库",
    aliases: ["MotionSites AI", "Motion Sites", "motionsites.ai"],
    url: "https://motionsites.ai/",
    canonicalUrl: "https://motionsites.ai/",
    description:
      "A freemium gallery of AI-ready website prompts, section concepts, and animated backgrounds for motion-forward landing pages.",
    descriptionZh:
      "面向动效型落地页的免费增值图库，提供可交给 AI 编码工具的网站提示词、区块概念与动态背景。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["websites", "product-ui"],
    contentTypes: ["motion", "3d", "website", "landing-page", "web-interface"],
    useCases: ["motion-reference", "web-design-inspiration", "ui-inspiration", "product-launch"],
    visualTraits: ["animated", "dark-mode", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://motionsites.ai/",
        kind: "first-party",
        note: "Official prompt gallery for animated websites, landing pages, and hero concepts.",
        noteZh: "官方动效网站、落地页与 Hero 概念提示词图库。",
      },
      {
        url: "https://motionsites.ai/unlimited",
        kind: "first-party",
        note: "Official access page documenting yearly and lifetime premium prompt plans.",
        noteZh: "官方访问说明页，列出年度与终身付费提示词方案。",
      },
    ],
    reviewedAt: "2026-08-10",
  },
  {
    slug: "uiverse",
    entryKind: "source",
    name: "Uiverse",
    nameZh: "Uiverse 开源 UI 元素库",
    aliases: ["Uiverse.io", "Uiverse Elements", "uiverse.io/elements"],
    url: "https://uiverse.io/elements",
    canonicalUrl: "https://uiverse.io/",
    description:
      "A community-built library of open-source UI elements that can be browsed by category and copied as CSS, Tailwind, React, or Figma assets.",
    descriptionZh:
      "社区共建的开源 UI 元素库，可按类别浏览，并以 CSS、Tailwind、React 或 Figma 形式复制使用。",
    primaryTheme: "product-ui",
    secondaryThemes: ["motion-3d", "websites"],
    contentTypes: ["web-interface", "motion", "website"],
    useCases: ["ui-inspiration", "design-system", "motion-reference"],
    visualTraits: ["animated", "bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://uiverse.io/elements",
        kind: "first-party",
        note: "Official browsable catalog of open-source CSS and Tailwind UI elements.",
        noteZh: "官方可浏览的开源 CSS 与 Tailwind UI 元素目录。",
      },
      {
        url: "https://uiverse.io/",
        kind: "first-party",
        note: "Official homepage describing community-made elements and supported copy formats.",
        noteZh: "官方首页说明社区共建属性与可复制的实现格式。",
      },
    ],
    reviewedAt: "2026-08-10",
  },
  {
    slug: "aceternity-ui",
    entryKind: "source",
    name: "Aceternity UI",
    nameZh: "Aceternity UI 动效组件库",
    aliases: ["Aceternity", "Aceternity Components", "ui.aceternity.com"],
    url: "https://ui.aceternity.com/components",
    canonicalUrl: "https://ui.aceternity.com/",
    description:
      "A freemium catalog of copy-paste React and Next.js components, animated effects, sections, blocks, and templates built with Tailwind CSS and Motion.",
    descriptionZh:
      "免费增值的 React 与 Next.js 组件目录，收录可复制的动效、区块、页面段与模板，主要基于 Tailwind CSS 和 Motion。",
    primaryTheme: "product-ui",
    secondaryThemes: ["motion-3d", "websites"],
    contentTypes: ["web-interface", "motion", "3d", "website", "landing-page"],
    useCases: ["ui-inspiration", "design-system", "motion-reference", "web-design-inspiration"],
    visualTraits: ["animated", "dark-mode", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://ui.aceternity.com/components",
        kind: "first-party",
        note: "Official component catalog covering free components, premium blocks, templates, and motion effects.",
        noteZh: "官方组件目录，覆盖免费组件、付费区块、模板与动效。",
      },
      {
        url: "https://ui.aceternity.com/pricing",
        kind: "first-party",
        note: "Official pricing page documenting the free tier and paid block and template access.",
        noteZh: "官方定价页说明免费层及付费区块、模板的访问边界。",
      },
    ],
    reviewedAt: "2026-08-10",
  },
  {
    slug: "checklist-design",
    entryKind: "source",
    name: "Checklist Design",
    nameZh: "Checklist Design 设计清单",
    aliases: ["checklist.design", "Checklist Design by George Hatzis"],
    url: "https://www.checklist.design/",
    canonicalUrl: "https://www.checklist.design/",
    description:
      "A browsable library of UX/UI quality checklists for websites, web apps, mobile, design-system components, and multi-step flows.",
    descriptionZh:
      "可浏览的 UX/UI 质量清单库，覆盖网站、Web App、移动端、设计系统组件与多步流程。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites"],
    contentTypes: ["web-interface", "app-screen", "website"],
    useCases: ["product-design", "ui-inspiration", "design-system"],
    visualTraits: ["minimal", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.checklist.design/",
        kind: "first-party",
        note: "Official homepage: browse and search checklists across product surfaces.",
        noteZh: "官方首页：跨产品面浏览与搜索设计清单。",
      },
      {
        url: "https://www.checklist.design/browse",
        kind: "first-party",
        note: "Public catalog of checklists for websites, apps, mobile, systems, and flows.",
        noteZh: "公开清单目录，覆盖网站、应用、移动端、系统与流程。",
      },
    ],
    reviewedAt: "2026-08-08",
  },
  {
    slug: "ramps-studio",
    entryKind: "source",
    name: "Ramps Studio",
    nameZh: "Ramps Studio 配色阶梯生成器",
    aliases: ["Ramps", "ramps.studio", "Color Ramp Generator"],
    url: "https://www.ramps.studio/",
    canonicalUrl: "https://www.ramps.studio/",
    description:
      "A brand-color ramp generator that derives perceptually uniform OKLCH scales and ready-to-use light/dark semantic tokens with selectable WCAG targets, shareable via URL parameters.",
    descriptionZh:
      "从单一品牌色派生感知均匀 OKLCH 色阶并输出明暗语义化设计 Token 的生成器，可指定 WCAG 等级，配置通过 URL 参数共享。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["product-ui"],
    contentTypes: ["web-interface", "website"],
    useCases: ["design-system", "brand-identity", "product-design"],
    visualTraits: ["minimal", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.ramps.studio/",
        kind: "first-party",
        note: "Official generator homepage documenting the brand-color input and semantic-token output.",
        noteZh: "官方生成器首页，说明品牌色输入与语义化 Token 输出。",
      },
    ],
    reviewedAt: "2026-08-11",
  },
  {
    slug: "colorable",
    entryKind: "source",
    name: "Colorable",
    nameZh: "Colorable 对比度检查器",
    aliases: ["Colorable Jxnblk", "colorable.jxnblk.com", "jxnblk/colorable"],
    url: "https://colorable.jxnblk.com/",
    canonicalUrl: "https://colorable.jxnblk.com/",
    description:
      "An open-source WCAG contrast checker by Brent Jackson that takes two colors in almost any format and reports the contrast ratio with AA/AAA pass status, also distributed as an npm module for palette-wide checks.",
    descriptionZh:
      "Brent Jackson 开源的 WCAG 对比度检查器，支持任意颜色格式输入两色并给出对比度比值与 AA/AAA 通过状态，同时以 npm 模块形式提供整组色板的批量检查。",
    primaryTheme: "product-ui",
    secondaryThemes: [],
    contentTypes: ["web-interface", "website"],
    useCases: ["design-system", "product-design"],
    visualTraits: ["minimal", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://colorable.jxnblk.com/",
        kind: "first-party",
        note: "Official contrast-checker tool.",
        noteZh: "官方对比度检查工具。",
      },
      {
        url: "https://github.com/jxnblk/colorable",
        kind: "first-party",
        note: "Official open-source repository for the Colorable contrast module.",
        noteZh: "Colorable 对比度模块的官方开源仓库。",
      },
    ],
    reviewedAt: "2026-08-11",
  },
  {
    slug: "gradient-lab",
    entryKind: "source",
    name: "Gradient Lab",
    nameZh: "Gradient Lab 动态渐变背景",
    aliases: ["Backgrounds Supply Gradient Lab", "backgrounds.supply/gradient-lab"],
    url: "https://backgrounds.supply/gradient-lab",
    canonicalUrl: "https://backgrounds.supply/gradient-lab",
    description:
      "A real-time shader-based animated gradient background generator with 20+ modes (Mesh, Smoke, Aurora, Plasma), tuning color, motion, and grading, exporting watermark-free stills or video up to 4K plus an iframe embed code.",
    descriptionZh:
      "实时着色器驱动的动态渐变背景生成器，内置 20 余种模式（Mesh、Smoke、Aurora、Plasma），可调色、运动与画面参数，导出无水印静图或最高 4K 视频，并提供 iframe 嵌入代码。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["websites"],
    contentTypes: ["motion", "3d", "website"],
    useCases: ["motion-reference", "web-design-inspiration", "product-launch"],
    visualTraits: ["animated", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://backgrounds.supply/gradient-lab",
        kind: "first-party",
        note: "Official Gradient Lab tool with shader modes, export options, and embed-code sharing.",
        noteZh: "官方 Gradient Lab 工具，含着色器模式、导出选项与嵌入代码分享。",
      },
    ],
    reviewedAt: "2026-08-11",
  },
  {
    slug: "colir",
    entryKind: "source",
    name: "Colir",
    nameZh: "Colir 曲线渐变编辑器",
    aliases: ["Colir.space", "colir.space"],
    url: "https://colir.space/app/",
    canonicalUrl: "https://colir.space/",
    description:
      "A mesh-gradient editor driven by two interactive X/Y curves, layered with wave distortion, sparkle, and pattern effects, exporting PNG/WebP images or a Copy JSON configuration.",
    descriptionZh:
      "以两条交互式 X/Y 曲线驱动的网格渐变编辑器，可叠加波浪扭曲、星点闪光与图案特效，导出 PNG/WebP 图片或可复制的 JSON 配置。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["websites"],
    contentTypes: ["motion", "3d", "website"],
    useCases: ["ui-inspiration", "web-design-inspiration", "motion-reference"],
    visualTraits: ["animated", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://colir.space/app/",
        kind: "first-party",
        note: "Official curve-driven gradient editor with effects, templates, and Pro export tiers.",
        noteZh: "官方曲线渐变编辑器，含特效、模板与 Pro 导出分层。",
      },
    ],
    reviewedAt: "2026-08-11",
  },
  {
    slug: "colorflow",
    entryKind: "source",
    name: "ColorFlow",
    nameZh: "ColorFlow 网格渐变工具",
    aliases: ["ColorFlow", "colorflow.ls.graphics"],
    url: "https://colorflow.ls.graphics/",
    canonicalUrl: "https://colorflow.ls.graphics/",
    description:
      "An interactive mesh-gradient creation tool for crafting layered gradient graphics with fine control over color stops, nodes, and transitions in real time.",
    descriptionZh:
      "交互式网格渐变创作工具，可实时精细调整色标、节点与过渡，产出多层渐变图形。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["websites"],
    contentTypes: ["motion", "3d", "website"],
    useCases: ["ui-inspiration", "web-design-inspiration", "motion-reference"],
    visualTraits: ["animated", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://colorflow.ls.graphics/",
        kind: "first-party",
        note: "Official mesh-gradient editor for layered gradient graphics.",
        noteZh: "官方网格渐变编辑器，用于创作多层渐变图形。",
      },
    ],
    reviewedAt: "2026-08-11",
  },
  {
    slug: "gradient-studio",
    entryKind: "source",
    name: "Gradient Studio",
    nameZh: "Gradient Studio CSS 渐变生成器",
    aliases: ["gradientsaas", "gradientsaas.blogspot.com", "Procedural CSS Gradient Generator"],
    url: "https://gradientsaas.blogspot.com/",
    canonicalUrl: "https://gradientsaas.blogspot.com/",
    description:
      "A procedural CSS gradient generator for editorial-grade backgrounds with light treatments, mesh glow, aurora, and film-grain effects, exporting free CSS, Tailwind, or SCSS ready to paste.",
    descriptionZh:
      "程序化生成编辑级 CSS 渐变背景的生成器，含光照、mesh 辉光、极光与胶片颗粒等效果，可直接导出 CSS、Tailwind 或 SCSS 使用。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["websites"],
    contentTypes: ["motion", "website"],
    useCases: ["web-design-inspiration", "ui-inspiration", "product-launch"],
    visualTraits: ["animated", "bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://gradientsaas.blogspot.com/",
        kind: "first-party",
        note: "Official procedural CSS gradient generator with CSS, Tailwind, and SCSS export.",
        noteZh: "官方程序化 CSS 渐变生成器，支持 CSS、Tailwind 与 SCSS 导出。",
      },
    ],
    reviewedAt: "2026-08-11",
  },
  {
    slug: "collect-ui",
    entryKind: "source",
    name: "Collect UI",
    nameZh: "Collect UI 界面灵感库",
    aliases: ["CollectUI", "collectui.com", "c4.collectui.com"],
    url: "https://collectui.com/",
    canonicalUrl: "https://collectui.com/",
    description:
      "A curated directory of interface and website references organized by UI challenge, category, designer, and recent selection.",
    descriptionZh:
      "按 UI 挑战、类别、设计师与近期精选组织的界面和网站参考目录。",
    primaryTheme: "product-ui",
    secondaryThemes: ["websites", "motion-3d"],
    contentTypes: ["web-interface", "app-screen", "website", "landing-page", "motion"],
    useCases: ["ui-inspiration", "product-design", "web-design-inspiration", "motion-reference"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://collectui.com/",
        kind: "first-party",
        note: "Official homepage positioning Collect UI as a curated source of interface and website inspiration.",
        noteZh: "官方首页将 Collect UI 定位为经策展的界面与网站灵感来源。",
      },
      {
        url: "https://collectui.com/categories",
        kind: "first-party",
        note: "Official category browser for design topics, styles, and trends.",
        noteZh: "官方类别浏览页，覆盖设计主题、风格与趋势。",
      },
    ],
    reviewedAt: "2026-08-17",
  },
  {
    slug: "codrops",
    entryKind: "source",
    name: "Codrops",
    nameZh: "Codrops 创意 Web 实验与教程",
    aliases: ["Tympanus Codrops", "tympanus.net/codrops", "Codrops Creative Hub"],
    url: "https://tympanus.net/codrops/",
    canonicalUrl: "https://tympanus.net/codrops/",
    description:
      "A creative-web publication and discovery hub for frontend tutorials, interactive demos, motion experiments, case studies, and hand-picked websites.",
    descriptionZh:
      "聚合前端教程、交互 Demo、动效实验、案例研究与精选网站的创意 Web 出版物和发现中心。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["websites", "product-ui"],
    contentTypes: ["motion", "3d", "website", "web-interface", "landing-page"],
    useCases: ["motion-reference", "web-design-inspiration", "ui-inspiration", "product-design"],
    visualTraits: ["animated", "bold", "editorial"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://tympanus.net/codrops/about/",
        kind: "first-party",
        note: "Official about page describing Codrops as a publication for web craft, inspiration, tutorials, and technical insight.",
        noteZh: "官方介绍页将 Codrops 定位为关注 Web 工艺、灵感、教程与技术洞察的出版物。",
      },
      {
        url: "https://tympanus.net/codrops/hub/",
        kind: "first-party",
        note: "Official Creative Hub showcasing original and hand-picked open-source demos and design experiments.",
        noteZh: "官方 Creative Hub，展示原创与精选的开源 Demo 和设计实验。",
      },
      {
        url: "https://tympanus.net/codrops/licensing/",
        kind: "first-party",
        note: "Official licensing guidance for demos, design freebies, and article excerpts.",
        noteZh: "官方许可说明，覆盖 Demo、设计赠品与文章摘录的使用边界。",
      },
    ],
    reviewedAt: "2026-08-21",
  },
  {
    slug: "muzli",
    entryKind: "source",
    name: "Muzli",
    nameZh: "Muzli 每日设计灵感",
    aliases: ["Muzli Inspiration", "Muzli for Chrome", "muz.li"],
    url: "https://muz.li/",
    canonicalUrl: "https://muz.li/",
    description:
      "A human-curated design feed and new-tab extension that brings together current web, product, brand, illustration, typography, motion, and visual-culture references.",
    descriptionZh:
      "以人工策展信息流和新标签页插件聚合最新网页、产品、品牌、插画、排版、动效与视觉文化参考。",
    primaryTheme: "websites",
    secondaryThemes: ["product-ui", "brand-identity", "presentation-editorial", "motion-3d"],
    contentTypes: ["website", "web-interface", "app-screen", "logo", "editorial", "motion", "3d"],
    useCases: [
      "web-design-inspiration",
      "ui-inspiration",
      "product-design",
      "brand-identity",
      "editorial-design",
      "motion-reference",
    ],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://muz.li/",
        kind: "first-party",
        note: "Official homepage describing Muzli as a human-curated design feed delivered through a new-tab extension and searchable collections.",
        noteZh: "官方首页将 Muzli 定位为通过新标签页插件与可搜索合集提供的人工策展设计信息流。",
      },
    ],
    reviewedAt: "2026-08-31",
  },
  {
    slug: "designspiration",
    entryKind: "source",
    name: "Designspiration",
    nameZh: "Designspiration 视觉情绪板灵感库",
    aliases: ["Design Inspiration", "designspiration.com", "Designspiration Visions"],
    url: "https://www.designspiration.com/",
    canonicalUrl: "https://www.designspiration.com/",
    description:
      "A community-powered visual discovery and mood-board platform spanning graphic design, typography, photography, branding, editorial work, app design, and 3D references.",
    descriptionZh:
      "由社区内容驱动的视觉发现与情绪板平台，覆盖平面设计、排版、摄影、品牌、编辑设计、App 界面与 3D 参考。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["presentation-editorial", "product-ui", "websites", "motion-3d"],
    contentTypes: ["logo", "editorial", "presentation", "app-screen", "web-interface", "website", "3d"],
    useCases: [
      "brand-identity",
      "logo-research",
      "presentation-design",
      "editorial-design",
      "ui-inspiration",
      "product-design",
    ],
    visualTraits: [],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.designspiration.com/explore/",
        kind: "first-party",
        note: "Official topic browser showing community references across graphic, editorial, app, typography, photography, and 3D design.",
        noteZh: "官方主题浏览页，展示社区上传的平面、编辑、App、排版、摄影与 3D 设计参考。",
      },
      {
        url: "https://www.designspiration.com/pro/",
        kind: "first-party",
        note: "Official membership page documenting free discovery and collections plus paid mood-board and deeper-search features.",
        noteZh: "官方会员页，说明免费发现与收藏能力，以及付费情绪板和深度搜索功能。",
      },
    ],
    reviewedAt: "2026-08-31",
  },
  {
    slug: "design-spells",
    entryKind: "source",
    name: "Design Spells",
    nameZh: "Design Spells 微交互细节库",
    aliases: ["DesignSpells", "designspells.com", "Spells Digest"],
    url: "https://designspells.com/",
    canonicalUrl: "https://designspells.com/",
    description:
      "A curated archive of delightful product details, micro-interactions, motion, easter eggs, and playful interface behaviors found across apps and websites.",
    descriptionZh:
      "精选 App 与网站中的愉悦细节、微交互、动效、彩蛋和趣味界面行为，适合拆解产品为何显得精致而有生命力。",
    primaryTheme: "product-ui",
    secondaryThemes: ["motion-3d", "websites"],
    contentTypes: ["app-screen", "web-interface", "motion", "website"],
    useCases: ["ui-inspiration", "product-design", "motion-reference", "web-design-inspiration"],
    visualTraits: ["animated"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.designspells.com/newsletter",
        kind: "first-party",
        note: "Official about and newsletter page explaining the archive's focus on micro-interactions, easter eggs, delight, and design-engineering craft.",
        noteZh: "官方介绍与通讯页，说明该档案关注微交互、彩蛋、愉悦感及设计工程细节。",
      },
      {
        url: "https://www.designspells.com/newsletters",
        kind: "first-party",
        note: "Official digest archive demonstrating the site's continuing collection of interface details and motion examples.",
        noteZh: "官方通讯归档，展示持续更新的界面细节与动效案例。",
      },
    ],
    reviewedAt: "2026-08-31",
  },
  {
    slug: "loadmore",
    entryKind: "source",
    name: "loadmo.re",
    nameZh: "loadmo.re 实验型移动网页档案",
    aliases: ["Loadmore", "Load More", "loadmo.re", "Mobile Web Design Archive"],
    url: "https://loadmo.re/",
    canonicalUrl: "https://loadmo.re/",
    description:
      "A curated archive dedicated to alternative mobile websites and unconventional digital experiences, searchable across animation, 3D, brutalism, generative work, immersive interaction, and experimental typography.",
    descriptionZh:
      "专门收录另类移动网站与非常规数字体验的策展档案，可按动画、3D、粗野主义、生成式作品、沉浸交互与实验排版等维度浏览。",
    primaryTheme: "websites",
    secondaryThemes: ["motion-3d", "product-ui"],
    contentTypes: ["website", "landing-page", "portfolio", "web-interface", "motion", "3d"],
    useCases: ["web-design-inspiration", "motion-reference", "ui-inspiration", "product-design"],
    visualTraits: ["bold", "animated", "typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://loadmo.re/",
        kind: "first-party",
        note: "Official archive describing its exclusive focus on alternative mobile websites and unconventional digital experiences since 2021.",
        noteZh: "官方档案说明其自 2021 年起专注另类移动网站与非常规数字体验。",
      },
    ],
    reviewedAt: "2026-08-31",
  },
  {
    slug: "seesaw",
    entryKind: "source",
    name: "Seesaw",
    nameZh: "Seesaw 网页设计精选",
    aliases: ["SEESAW", "Seesaw Design Inspiration", "seesaw.website"],
    url: "https://www.seesaw.website/",
    canonicalUrl: "https://www.seesaw.website/",
    description:
      "A hand-picked web design gallery for quickly scanning current agency, AI, design-tool, developer-tool, ecommerce, fintech, portfolio, productivity, and social websites.",
    descriptionZh:
      "人工精选的网页设计画廊，适合快速浏览机构、AI、设计工具、开发工具、电商、金融、作品集、效率与社交网站。",
    primaryTheme: "websites",
    secondaryThemes: ["product-ui", "brand-identity"],
    contentTypes: ["website", "landing-page", "portfolio", "web-interface"],
    useCases: ["web-design-inspiration", "ui-inspiration", "product-design", "brand-identity"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.seesaw.website/",
        kind: "first-party",
        note: "Official gallery positioning Seesaw as a hand-picked web-design inspiration source with industry and site-type browsing.",
        noteZh: "官方画廊将 Seesaw 定位为人工精选的网页设计灵感来源，并提供行业与站点类型浏览。",
      },
    ],
    reviewedAt: "2026-09-06",
  },
  {
    slug: "game-ui-database",
    entryKind: "source",
    name: "Game UI Database",
    nameZh: "Game UI Database 游戏界面资料库",
    aliases: ["The Game UI Database", "gameuidatabase.com", "GameUIDatabase"],
    url: "https://www.gameuidatabase.com/",
    canonicalUrl: "https://www.gameuidatabase.com/",
    description:
      "A research and reference database for studying game interface screenshots and videos across screen types, platforms, genres, art styles, controls, and interaction patterns.",
    descriptionZh:
      "用于研究游戏界面截图与视频的资料库，可从屏幕类型、平台、游戏类型、美术风格、控制方式与交互模式等维度查找参考。",
    primaryTheme: "product-ui",
    secondaryThemes: ["motion-3d"],
    contentTypes: ["app-screen", "web-interface", "motion", "3d"],
    useCases: ["ui-inspiration", "product-design", "motion-reference"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.gameuidatabase.com/",
        kind: "first-party",
        note: "Official public database presenting searchable game UI screens and videos for UI, UX, and game-design research.",
        noteZh: "官方公开资料库，为 UI、UX 与游戏设计研究提供可搜索的游戏界面截图和视频。",
      },
      {
        url: "https://buymeacoffee.com/gameuidatabase",
        kind: "first-party",
        note: "The project's official creator page describes Game UI Database as a research and reference tool for game UI/UX artists and designers.",
        noteZh: "项目官方作者页将 Game UI Database 描述为面向游戏 UI/UX 美术与设计师的研究和参考工具。",
      },
    ],
    reviewedAt: "2026-09-06",
  },
  {
    slug: "threeui",
    entryKind: "source",
    name: "ThreeUI",
    nameZh: "ThreeUI 三维交互组件库",
    aliases: ["Three UI", "Three.js Components by ThreeUI", "threeui.com"],
    url: "https://threeui.com/browse",
    canonicalUrl: "https://threeui.com/",
    description:
      "A browsable library of Three.js components, interactive shaders, WebGL backgrounds, hero sections, UI effects, motion studies, and complete website templates with free Community and paid Pro tiers.",
    descriptionZh:
      "可浏览的 Three.js 组件、交互式着色器、WebGL 背景、首屏区块、UI 特效、动效研究与完整网站模板库，分为免费 Community 与付费 Pro 层。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["product-ui", "websites"],
    contentTypes: ["3d", "motion", "web-interface", "website", "landing-page"],
    useCases: ["motion-reference", "ui-inspiration", "web-design-inspiration", "product-design"],
    visualTraits: ["animated", "bold"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://threeui.com/browse",
        kind: "first-party",
        note: "Official browse catalog for Three.js components, templates, WebGL backgrounds, shaders, UI effects, and motion design.",
        noteZh: "官方浏览目录，覆盖 Three.js 组件、模板、WebGL 背景、着色器、UI 特效与动效设计。",
      },
      {
        url: "https://github.com/MengTo/threeui",
        kind: "first-party",
        note: "Official Community repository documenting the login-free MIT-licensed subset and the separate Pro catalog boundary.",
        noteZh: "官方 Community 仓库，说明免登录的 MIT 开源子集及其与 Pro 目录的授权边界。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "boardui",
    entryKind: "source",
    name: "BoardUI",
    nameZh: "BoardUI Agent 与仪表盘设计系统",
    aliases: ["Board UI", "BoardUI Design System", "boardui.com"],
    url: "https://www.boardui.com/components",
    canonicalUrl: "https://www.boardui.com/",
    description:
      "A React and Tailwind CSS design system for agentic products and dashboards, with source-distributed components, application blocks, data charts, templates, semantic tokens, CLI installation, and agent integrations.",
    descriptionZh:
      "面向 Agent 产品与仪表盘的 React、Tailwind CSS 设计系统，提供源码分发的组件、应用区块、数据图表、模板、语义 Token、CLI 安装与 Agent 集成。",
    primaryTheme: "product-ui",
    secondaryThemes: ["motion-3d"],
    contentTypes: ["web-interface", "app-screen", "motion"],
    useCases: ["ui-inspiration", "product-design", "design-system", "motion-reference"],
    visualTraits: ["minimal", "dark-mode", "animated"],
    access: "freemium",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.boardui.com/components",
        kind: "first-party",
        note: "Official component catalog covering agent interfaces, dashboard primitives, application blocks, charts, templates, and design tokens.",
        noteZh: "官方组件目录，覆盖 Agent 界面、仪表盘原语、应用区块、图表、模板与设计 Token。",
      },
      {
        url: "https://github.com/BoardUI/boardui",
        kind: "first-party",
        note: "Official repository distributing the complete free tier as editable source under the MIT license.",
        noteZh: "官方仓库以 MIT 许可分发完整免费层的可编辑源码。",
      },
      {
        url: "https://www.boardui.com/license",
        kind: "first-party",
        note: "Official license page defining the separate commercial terms for BoardUI Pro components and templates.",
        noteZh: "官方许可页，界定 BoardUI Pro 组件与模板的独立商业使用条款。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "inspora",
    entryKind: "source",
    name: "Inspora",
    nameZh: "Inspora 视觉设计档案",
    aliases: ["Inspora Design", "inspora.design"],
    url: "https://www.inspora.design/",
    canonicalUrl: "https://www.inspora.design/",
    description:
      "A curated archive of recent visual and creative work spanning web, branding, product, motion, illustration, 3D, and print.",
    descriptionZh:
      "精选近期视觉设计与创意作品的综合档案，覆盖网页、品牌、产品、动效、插画、3D 与印刷设计。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["websites", "product-ui", "motion-3d", "presentation-editorial"],
    contentTypes: ["website", "web-interface", "app-screen", "logo", "editorial", "motion", "3d"],
    useCases: [
      "brand-identity",
      "web-design-inspiration",
      "ui-inspiration",
      "product-design",
      "editorial-design",
      "motion-reference",
    ],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.inspora.design/",
        kind: "first-party",
        note: "Official public archive and category browser for recent visual and creative work.",
        noteZh: "官方公开档案与分类浏览页，收录近期视觉设计和创意作品。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "refero-styles",
    entryKind: "source",
    name: "Refero Styles",
    nameZh: "Refero Styles AI 可读设计系统库",
    aliases: ["DESIGN.md Examples", "Refero DESIGN.md", "styles.refero.design"],
    url: "https://styles.refero.design/",
    canonicalUrl: "https://styles.refero.design/",
    description:
      "A searchable library of AI-readable design-system references extracted from real product websites, with DESIGN.md, Tailwind, CSS variable, and token views.",
    descriptionZh:
      "从真实产品网站提取的 AI 可读设计系统参考库，可查看 DESIGN.md、Tailwind、CSS 变量与 Design Token 版本。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["product-ui", "websites"],
    contentTypes: ["brand-guideline", "website", "web-interface"],
    useCases: ["design-system", "brand-identity", "ui-inspiration", "product-design", "web-design-inspiration"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://styles.refero.design/",
        kind: "first-party",
        note: "Official library for browsing AI-readable design systems and DESIGN.md examples from product websites.",
        noteZh: "官方资料库，用于浏览从产品网站提取的 AI 可读设计系统与 DESIGN.md 示例。",
      },
      {
        url: "https://styles.refero.design/design-md/design-md-resources",
        kind: "first-party",
        note: "Official guide documenting free browsing and copying of DESIGN.md references plus the separate Refero MCP path.",
        noteZh: "官方指南说明 DESIGN.md 参考可免费浏览与复制，并将 Refero MCP 作为独立接入路径。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "60fps-design",
    entryKind: "source",
    name: "60fps.design",
    nameZh: "60fps.design UI 动画参考库",
    aliases: ["60 FPS Design", "60fps", "60fps.design"],
    url: "https://60fps.design/",
    canonicalUrl: "https://60fps.design/",
    description:
      "A UI and UX animation reference library for mobile and web apps, organized around interaction patterns, app examples, motion snippets, and animation vocabulary.",
    descriptionZh:
      "面向移动端与 Web App 的 UI/UX 动画参考库，按交互模式、真实应用、动效片段与动画词汇组织。",
    primaryTheme: "motion-3d",
    secondaryThemes: ["product-ui", "websites"],
    contentTypes: ["motion", "app-screen", "web-interface", "website"],
    useCases: ["motion-reference", "ui-inspiration", "product-design", "web-design-inspiration"],
    visualTraits: ["animated"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://60fps.design/",
        kind: "first-party",
        note: "Official public library and pattern browser for mobile and web UI animation references.",
        noteZh: "官方公开资料库与模式浏览页，提供移动端及 Web UI 动画参考。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "navbar-gallery",
    entryKind: "source",
    name: "Navbar Gallery",
    nameZh: "Navbar Gallery 导航栏灵感库",
    aliases: ["Navbar Design Gallery", "navbar.gallery"],
    url: "https://www.navbar.gallery/",
    canonicalUrl: "https://www.navbar.gallery/",
    description:
      "A navigation-focused web design gallery covering static and sticky navbars, dropdowns, mega menus, sidebars, search, announcements, and full-screen navigation.",
    descriptionZh:
      "聚焦网站导航设计的专题画廊，覆盖静态与吸顶导航、下拉菜单、Mega Menu、侧栏、搜索、公告条与全屏导航。",
    primaryTheme: "websites",
    secondaryThemes: ["product-ui"],
    contentTypes: ["website", "landing-page", "web-interface"],
    useCases: ["web-design-inspiration", "ui-inspiration", "product-design"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.navbar.gallery/",
        kind: "first-party",
        note: "Official curated gallery and navigation-pattern category browser.",
        noteZh: "官方精选画廊与导航模式分类浏览页。",
      },
      {
        url: "https://www.navbar.gallery/about",
        kind: "first-party",
        note: "Official project background and curator information.",
        noteZh: "官方项目背景与策展人信息。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "uigradients",
    entryKind: "source",
    name: "uiGradients",
    nameZh: "uiGradients 渐变配色库",
    aliases: ["UI Gradients", "uigradients.com", "ui.gradients.com"],
    url: "https://uigradients.com/",
    canonicalUrl: "https://uigradients.com/",
    description:
      "A handpicked, community-contributed collection of color gradients for designers and developers, with reusable gradient data published in its official repository.",
    descriptionZh: "面向设计师与开发者的精选社区渐变配色库，官方仓库同时公开可复用的渐变数据。",
    primaryTheme: "brand-identity",
    secondaryThemes: ["websites", "product-ui"],
    contentTypes: ["website", "web-interface", "brand-guideline"],
    useCases: ["brand-identity", "design-system", "web-design-inspiration", "ui-inspiration"],
    visualTraits: ["bold"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://uigradients.com/",
        kind: "first-party",
        note: "Official public gradient browser and collection positioning.",
        noteZh: "官方公开渐变浏览器与合集定位。",
      },
      {
        url: "https://github.com/ghosh/uiGradients",
        kind: "first-party",
        note: "Official MIT-licensed repository documenting the community gradient dataset and contribution workflow.",
        noteZh: "官方 MIT 仓库，记录社区渐变数据集与贡献方式。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "cta-gallery",
    entryKind: "source",
    name: "CTA Gallery",
    nameZh: "CTA Gallery 行动号召设计库",
    aliases: ["Call-to-Action Gallery", "CTA Design Gallery", "cta.gallery"],
    url: "https://www.cta.gallery/",
    canonicalUrl: "https://www.cta.gallery/",
    description:
      "A curated call-to-action design gallery covering buttons, forms, modals, newsletters, navigation, pricing, subscriptions, downloads, and purchase prompts.",
    descriptionZh:
      "精选行动号召设计画廊，覆盖按钮、表单、弹窗、Newsletter、导航、定价订阅、下载与购买提示。",
    primaryTheme: "websites",
    secondaryThemes: ["product-ui", "social-marketing"],
    contentTypes: ["landing-page", "website", "web-interface"],
    useCases: ["web-design-inspiration", "product-launch", "ui-inspiration", "social-marketing"],
    visualTraits: [],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://www.cta.gallery/",
        kind: "first-party",
        note: "Official curated CTA gallery, category browser, and screenshot ownership notice.",
        noteZh: "官方 CTA 精选画廊、分类浏览页与截图权利声明。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "logobook",
    entryKind: "source",
    name: "Logobook",
    nameZh: "Logobook 标志档案库",
    aliases: ["Logo Book", "logobook.com"],
    url: "https://logobook.com/",
    canonicalUrl: "https://logobook.com/",
    description:
      "A searchable logo archive organized by letterforms, numbers, shapes, objects, nature, and business, with designer, year, country, and subject metadata on individual records.",
    descriptionZh:
      "可按字母、数字、形状、物件、自然与商业主题检索的 Logo 档案，单条记录附设计师、年份、国家与主题信息。",
    primaryTheme: "brand-identity",
    secondaryThemes: [],
    contentTypes: ["logo", "wordmark"],
    useCases: ["logo-research", "brand-identity"],
    visualTraits: ["typographic"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://logobook.com/",
        kind: "first-party",
        note: "Official public logo archive, taxonomy, and record browser.",
        noteZh: "官方公开 Logo 档案、分类体系与条目浏览页。",
      },
    ],
    reviewedAt: "2026-09-07",
  },
  {
    slug: "startup-visuals",
    entryKind: "source",
    name: "Startup Visuals",
    nameZh: "Startup Visuals 产品界面参考",
    aliases: ["@startupvisuals", "Louis Nguyen", "louisdainguyen"],
    url: "https://x.com/startupvisuals",
    canonicalUrl: "https://x.com/startupvisuals",
    description:
      "A B2B SaaS product-UI motion reference — sidebars, command palettes, integrations, paywalls, tables, and agent workspaces — published as an X and Dribbble feed, not a marketing-site eye-candy gallery and not a case-study CMS. The official homepage is a studio hero, client-logo marquee, testimonials, and a non-clickable full-bleed ticker of Dribbble shots (ClickUp-hosted PNGs named \"<Project> Dribbble <n>.png\"); named ticker projects include netair™, Revisions, Boards/Starline™ AI, aether.ai, Adaptio, Stacks, CRM App/Evergreen, AI Host, AI Chatbot, thoughts™, Unpaid, and appship.us. The site light/dark toggle restyles chrome only, not the gallery set.",
    descriptionZh:
      "B2B SaaS 产品界面动效参考（侧栏、命令面板、集成、付费墙、数据表、Agent 工作区），以 X / Dribbble 动态发布，既不是营销站花活图库，也不是案例 CMS。官网首页是工作室 Hero、客户 logo 跑马灯、客户评价，外加一条不可点击的 Dribbble 全幅 ticker（ClickUp 托管的「项目名 Dribbble n.png」）；ticker 上出现的项目包括 netair™、Revisions、Boards/Starline™ AI、aether.ai、Adaptio、Stacks、CRM App/Evergreen、AI Host、AI Chatbot、thoughts™、Unpaid、appship.us。站点亮暗切换只改外壳，不换图库。",
    primaryTheme: "product-ui",
    secondaryThemes: ["motion-3d", "social-marketing"],
    contentTypes: ["web-interface", "app-screen", "motion"],
    useCases: ["ui-inspiration", "product-design", "motion-reference"],
    visualTraits: ["minimal", "dark-mode", "animated"],
    access: "public",
    rightsStatus: "external-only",
    provenance: [
      {
        url: "https://x.com/startupvisuals",
        kind: "first-party",
        note: "Official X feed by Louis Nguyen, posting B2B SaaS product-UI motion cases.",
        noteZh: "Louis Nguyen 的官方 X 动态，发布 B2B SaaS 产品界面动效案例。",
      },
      {
        url: "https://startupvisuals.com/",
        kind: "first-party",
        note: "Official studio homepage: hero, client-logo marquee, testimonials, and a non-clickable full-bleed Dribbble image ticker (ClickUp-hosted PNGs). Outbound links go to X, Dribbble, and Cal.com. Light/dark changes chrome only, not the gallery set. First-viewport capture used for the inspiration screenshot.",
        noteZh: "官方工作室首页：Hero、客户 logo 跑马灯、客户评价，以及不可点击的 Dribbble 全幅图片 ticker（ClickUp 托管 PNG）。出站链接为 X、Dribbble 与 Cal.com。亮暗切换只改外壳，不换图库。灵感截图取自此站首屏。",
      },
      {
        url: "https://dribbble.com/louisdainguyen",
        kind: "first-party",
        note: "Official Dribbble profile; the homepage ticker is a non-clickable reel of these shots, not an on-site case CMS.",
        noteZh: "官方 Dribbble 主页；官网 ticker 是这些稿件的不可点击转轮，不是站内案例 CMS。",
      },
    ],
    reviewedAt: "2026-08-31",
  },
];

export const INSPIRATION_SOURCES: readonly InspirationSource[] =
	INSPIRATION_SOURCE_RECORDS.map((source) => ({
		...source,
		screenshot: inspirationScreenshot("sources", source.slug, source.url),
	}));
