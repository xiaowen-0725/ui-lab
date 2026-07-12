"use client";

import { BookOpen, FileText, Globe } from "lucide-react";
import {
  CitationChip,
  type CitationSource,
  SourceCard,
  SourceList,
} from "@/components/motion/citations";

const SOURCES: CitationSource[] = [
  {
    title: "Design Tokens: The Deep Dive",
    domain: "spec.design-tokens.dev",
    favicon: <Globe className="h-4 w-4" />,
    snippet:
      "Tokens are the smallest named values in a design system — color, spacing, and type — shared across every platform that renders the product.",
    href: "https://spec.design-tokens.dev",
  },
  {
    title: "Naming Conventions for Token Systems",
    domain: "docs.tokens-studio.io",
    favicon: <BookOpen className="h-4 w-4" />,
    snippet:
      "A consistent tier naming scheme (core, semantic, component) keeps large token sets legible as they grow across teams and brands.",
    href: "https://docs.tokens-studio.io",
  },
  {
    title: "Cross-Platform Token Pipelines",
    domain: "guide.tokenize.dev",
    favicon: <FileText className="h-4 w-4" />,
    snippet:
      "Build pipelines transform a single token source into platform-native formats, so one edit propagates to web, iOS, and Android alike.",
    href: "https://guide.tokenize.dev",
  },
];

/**
 * Answer paragraph with three inline `CitationChip`s, each previewing one of
 * `SOURCES` on hover/focus, followed by a `SourceList` summarizing the same
 * three sources as cards — the two ends of the same citation set.
 */
export function CitationsPreview() {
  return (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-neutral-100 p-8 dark:bg-neutral-900">
      <div className="w-full max-w-xl">
        <p className="text-sm leading-[22px]">
          Design tokens act as the single source of truth for a product&apos;s visual language
          <CitationChip index={1} source={SOURCES[0]} />, typically encoding color, spacing, and
          typography as named values that both designers and code can reference
          <CitationChip index={2} source={SOURCES[1]} />. Because tokens are platform-agnostic, a
          single edit can propagate to web, iOS, and Android without touching component code
          directly
          <CitationChip index={3} source={SOURCES[2]} />.
        </p>
        <div className="mt-4">
          <SourceList title="Sources">
            {SOURCES.map((source, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: SOURCES is a static, never-reordered list.
              <SourceCard key={index} source={source} index={index + 1} />
            ))}
          </SourceList>
        </div>
      </div>
    </div>
  );
}
