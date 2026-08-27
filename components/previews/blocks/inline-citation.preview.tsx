"use client";

// Live sample for Vercel AI Elements Inline Citation (Apache-2.0).

import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "@/components/agents/inline-citation";

const SOURCES = [
  {
    title: "Design Tokens: The Deep Dive",
    url: "https://spec.design-tokens.dev",
    description:
      "Tokens are the smallest named values in a design system — color, spacing, and type.",
    quote: "A token is a named value both design and code can share.",
  },
  {
    title: "UI Lab catalog",
    url: "https://ui-lab-ten.vercel.app/catalog.json",
    description: "Machine-readable vocabulary for components, recipes, and kits.",
    quote: "Prompt is a discovery aid, not a substitute for the contract.",
  },
];

export function InlineCitationPreview() {
  return (
    <div className="w-full max-w-lg text-sm leading-7">
      <InlineCitation>
        <InlineCitationText>
          Design tokens keep a product&apos;s visual language in one named source
        </InlineCitationText>
        <InlineCitationCard defaultOpen>
          <InlineCitationCardTrigger
            sources={SOURCES.map((source) => source.url)}
          />
          <InlineCitationCardBody>
            <InlineCitationCarousel>
              <InlineCitationCarouselHeader>
                <InlineCitationCarouselPrev />
                <InlineCitationCarouselIndex />
                <InlineCitationCarouselNext />
              </InlineCitationCarouselHeader>
              <InlineCitationCarouselContent>
                {SOURCES.map((source) => (
                  <InlineCitationCarouselItem key={source.url}>
                    <InlineCitationSource
                      title={source.title}
                      url={source.url}
                      description={source.description}
                    />
                    <InlineCitationQuote>{source.quote}</InlineCitationQuote>
                  </InlineCitationCarouselItem>
                ))}
              </InlineCitationCarouselContent>
            </InlineCitationCarousel>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      .
    </div>
  );
}
