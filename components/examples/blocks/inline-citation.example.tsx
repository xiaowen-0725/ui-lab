"use client";

import { useId, useState } from "react";
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationSource,
  InlineCitationQuote,
} from "@/components/agents/inline-citation";

// Fragment references point to self-contained source excerpts below.
const sourceExcerpts = [
  {
    id: "reading-note",
    title: "示例阅读笔记",
    description: "记录问题能够帮助组织阅读线索。",
    quote: "每读完一节，写下一个仍然好奇的问题。",
  },
  {
    id: "discussion-note",
    title: "示例讨论纪要",
    description: "交流问题可以发现不同的阅读角度。",
    quote: "先分享问题，再讨论各自找到的证据。",
  },
];

function keepCitationOpen() {
  // Keep the card available while the pointer moves to the source pager.
}

export function InlineCitationExample() {
  const instanceId = useId();
  const [open, setOpen] = useState(false);
  const sources = sourceExcerpts.map((source) => ({
    ...source,
    url: `#${instanceId}-${source.id}`,
  }));

  return (
    <section className="max-w-lg space-y-4">
      <div className="leading-7">
        <InlineCitation>
          <InlineCitationText>
            阅读时记录问题，有助于整理思路。
          </InlineCitationText>
          <InlineCitationCard open={open} onOpenChange={setOpen}>
            <InlineCitationCardTrigger
              sources={sources.map((source) => source.url)}
              aria-label="查看两条示例引用"
              onMouseLeave={keepCitationOpen}
              onBlur={(event) => {
                if (
                  !event.currentTarget.parentElement?.contains(
                    event.relatedTarget,
                  )
                )
                  setOpen(false);
              }}
            />
            <InlineCitationCardBody>
              <InlineCitationCarousel>
                <InlineCitationCarouselHeader>
                  <InlineCitationCarouselPrev aria-label="上一条引用" />
                  <InlineCitationCarouselIndex />
                  <InlineCitationCarouselNext aria-label="下一条引用" />
                </InlineCitationCarouselHeader>
                <InlineCitationCarouselContent>
                  {sources.map((source) => (
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
      </div>
      <button
        type="button"
        aria-expanded={open}
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "关闭引用卡片" : "打开引用卡片"}
      </button>
      <p role="status" className="text-sm">
        {open ? "引用卡片已打开，可以翻页查看来源。" : "引用卡片已关闭。"}
      </p>
      <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
        <p id={sources[0].url.slice(1)}>示例阅读笔记：{sources[0].quote}</p>
        <p id={sources[1].url.slice(1)}>示例讨论纪要：{sources[1].quote}</p>
      </div>
    </section>
  );
}
