"use client";

// Live sample for Vercel AI Elements Queue (Apache-2.0).

import { X } from "lucide-react";
import {
  Queue,
  QueueItem,
  QueueItemAction,
  QueueItemActions,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "@/components/agents/queue";

export function QueuePreview() {
  return (
    <div className="w-full max-w-md">
      <Queue>
        <QueueSection defaultOpen>
          <QueueSectionTrigger>
            <QueueSectionLabel count={3} label="queued follow-ups" />
          </QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              <QueueItem>
                <span className="flex items-start gap-2">
                  <QueueItemIndicator />
                  <QueueItemContent>Review the registry snapshot after adding slugs.</QueueItemContent>
                  <QueueItemActions>
                    <QueueItemAction aria-label="Remove">
                      <X className="size-3.5" />
                    </QueueItemAction>
                  </QueueItemActions>
                </span>
                <QueueItemDescription>Keeps CLI search in sync.</QueueItemDescription>
              </QueueItem>
              <QueueItem>
                <span className="flex items-start gap-2">
                  <QueueItemIndicator completed />
                  <QueueItemContent completed>
                    Port reasoning-text and agent-progress.
                  </QueueItemContent>
                </span>
              </QueueItem>
              <QueueItem>
                <span className="flex items-start gap-2">
                  <QueueItemIndicator />
                  <QueueItemContent>Attach the license notice.</QueueItemContent>
                </span>
                <QueueItemFile>NOTICE</QueueItemFile>
              </QueueItem>
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    </div>
  );
}
