import manifestJson from "@/content/inspiration/screenshots-manifest.json";

export type InspirationAssetKind =
	| "screenshot"
	| "og-image"
	| "official-image"
	| "archival-screenshot";
export type InspirationScreenshotStatus = "captured" | "fallback";

export type InspirationScreenshot = {
	path: string;
	sourceUrl: string;
	finalUrl: string;
	capturedAt: string;
	width: 1440;
	height: 900;
	status: InspirationScreenshotStatus;
	assetKind: InspirationAssetKind;
	title?: string;
};

type InspirationScreenshotManifest = {
	generatedAt: string;
	viewport: { width: 1440; height: 900 };
	entries: Record<string, InspirationScreenshot>;
};

const manifest = manifestJson as InspirationScreenshotManifest;

export function inspirationScreenshot(
	kind: "sources" | "sites" | "brands",
	slug: string,
	sourceUrl: string,
): InspirationScreenshot {
	return (
		manifest.entries[`${kind}/${slug}`] ?? {
			path: `/inspiration/screenshots/${kind}/${slug}.webp`,
			sourceUrl,
			finalUrl: sourceUrl,
			capturedAt: "2026-07-28",
			width: 1440,
			height: 900,
			status: "captured",
			assetKind: "screenshot",
		}
	);
}

export const INSPIRATION_BRAND_OFFICIAL_URLS = {
	airbnb: "https://www.airbnb.com/",
	airtable: "https://www.airtable.com/",
	apple: "https://www.apple.com/",
	binance: "https://www.binance.com/",
	bmw: "https://www.bmw.com/",
	"bmw-m": "https://www.bmw-m.com/",
	bugatti: "https://www.bugatti.com/",
	cal: "https://cal.com/",
	claude: "https://www.anthropic.com/claude",
	clay: "https://www.clay.com/",
	clickhouse: "https://clickhouse.com/",
	cohere: "https://cohere.com/",
	coinbase: "https://www.coinbase.com/",
	composio: "https://composio.dev/",
	cursor: "https://cursor.com/",
	"dell-1996": "https://web.archive.org/web/1996/https://www.dell.com/",
	elevenlabs: "https://elevenlabs.io/",
	expo: "https://expo.dev/",
	ferrari: "https://www.ferrari.com/",
	figma: "https://www.figma.com/",
	framer: "https://www.framer.com/",
	hashicorp: "https://www.hashicorp.com/",
	hp: "https://www.hp.com/",
	ibm: "https://www.ibm.com/",
	intercom: "https://www.intercom.com/",
	kraken: "https://www.kraken.com/",
	lamborghini: "https://www.lamborghini.com/",
	"linear.app": "https://linear.app/",
	lovable: "https://lovable.dev/",
	mastercard: "https://www.mastercard.com/",
	meta: "https://about.meta.com/",
	minimax: "https://www.minimax.io/",
	mintlify: "https://www.mintlify.com/",
	miro: "https://miro.com/",
	"mistral.ai": "https://mistral.ai/",
	mongodb: "https://www.mongodb.com/",
	nike: "https://www.nike.com/",
	"nintendo-2001": "https://web.archive.org/web/2001/https://www.nintendo.com/",
	notion: "https://www.notion.com/",
	nvidia: "https://www.nvidia.com/",
	ollama: "https://ollama.com/",
	"opencode.ai": "https://opencode.ai/",
	pinterest: "https://www.pinterest.com/",
	playstation: "https://www.playstation.com/",
	posthog: "https://posthog.com/",
	raycast: "https://www.raycast.com/",
	renault: "https://www.renault.com/",
	replicate: "https://replicate.com/",
	resend: "https://resend.com/",
	revolut: "https://www.revolut.com/",
	runwayml: "https://runwayml.com/",
	sanity: "https://www.sanity.io/",
	sentry: "https://sentry.io/welcome/",
	shopify: "https://www.shopify.com/",
	slack: "https://slack.com/",
	spacex: "https://www.spacex.com/",
	spotify: "https://open.spotify.com/",
	starbucks: "https://www.starbucks.com/",
	stripe: "https://stripe.com/",
	supabase: "https://supabase.com/",
	superhuman: "https://superhuman.com/",
	tesla: "https://www.tesla.com/",
	theverge: "https://www.theverge.com/",
	"together.ai": "https://www.together.ai/",
	uber: "https://www.uber.com/",
	vercel: "https://vercel.com/",
	vodafone: "https://www.vodafone.com/",
	voltagent: "https://voltagent.dev/",
	warp: "https://www.warp.dev/",
	webflow: "https://webflow.com/",
	wired: "https://www.wired.com/",
	wise: "https://wise.com/",
	"x.ai": "https://x.ai/",
	zapier: "https://zapier.com/",
} as const;
