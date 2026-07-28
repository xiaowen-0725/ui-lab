import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { InspirationSource } from "@/lib/inspiration";
import type { InspirationScreenshot } from "@/lib/inspiration-assets";
import type { InspirationBrand } from "@/lib/inspiration-brands";
import type { InspirationSite } from "@/lib/inspiration-sites";
import { cn } from "@/lib/utils";

type PreviewSize = "card" | "detail";

type BrandReferencePreviewProps = {
	brand: Pick<InspirationBrand, "name" | "officialUrl" | "screenshot">;
	className?: string;
	size?: PreviewSize;
	ariaLabel?: string;
};

type SiteReferencePreviewProps = {
	site: Pick<InspirationSite, "name" | "url" | "screenshot">;
	className?: string;
	size?: PreviewSize;
	ariaLabel?: string;
};

type SourceReferencePreviewProps = {
	source: Pick<InspirationSource, "name" | "url" | "screenshot">;
	className?: string;
	ariaLabel?: string;
};

function ScreenshotPreview({
	name,
	href,
	screenshot,
	className,
	size = "card",
	ariaLabel,
}: {
	name: string;
	href: string;
	screenshot: InspirationScreenshot;
	className?: string;
	size?: PreviewSize;
	ariaLabel?: string;
}) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={ariaLabel ?? `Visit ${name}`}
			className={cn(
				"group relative block aspect-[8/5] overflow-hidden rounded-2xl border border-border bg-muted",
				size === "detail" && "rounded-3xl",
				className,
			)}
		>
			<Image
				src={screenshot.path}
				alt={
					screenshot.assetKind === "screenshot"
						? `${name} official website, captured ${screenshot.capturedAt}`
						: screenshot.assetKind === "archival-screenshot"
							? `${name} historical website archive capture, collected ${screenshot.capturedAt}`
							: screenshot.assetKind === "official-image"
								? `${name} official website image, collected ${screenshot.capturedAt}`
								: `${name} official social preview image, collected ${screenshot.capturedAt}`
				}
				width={screenshot.width}
				height={screenshot.height}
				loading={size === "card" ? "lazy" : "eager"}
				decoding="async"
				className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
			/>
			<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[0.65rem] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
				{name}
				<ArrowUpRight aria-hidden="true" className="h-3 w-3" />
			</span>
		</a>
	);
}

export function SourceReferencePreview({
	source,
	className,
	ariaLabel,
}: SourceReferencePreviewProps) {
	return (
		<ScreenshotPreview
			name={source.name}
			href={source.url}
			screenshot={source.screenshot}
			className={className}
			ariaLabel={ariaLabel}
		/>
	);
}

export function BrandReferencePreview({
	brand,
	className,
	size,
	ariaLabel,
}: BrandReferencePreviewProps) {
	return (
		<ScreenshotPreview
			name={brand.name}
			href={brand.officialUrl}
			screenshot={brand.screenshot}
			className={className}
			size={size}
			ariaLabel={ariaLabel}
		/>
	);
}

export function SiteReferencePreview({
	site,
	className,
	size,
	ariaLabel,
}: SiteReferencePreviewProps) {
	return (
		<ScreenshotPreview
			name={site.name}
			href={site.url}
			screenshot={site.screenshot}
			className={className}
			size={size}
			ariaLabel={ariaLabel}
		/>
	);
}
