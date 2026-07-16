"use client";

import { FileText, MessageSquare, Pin, Plus, Trash2 } from "lucide-react";
import { type ComponentType, useState } from "react";
import {
  ThreadList,
  ThreadListAction,
  ThreadListItem,
  ThreadListSection,
} from "@/components/motion/thread-list";

interface PinnedItem {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  unread?: boolean;
}

interface RecentItem {
  id: string;
  title: string;
  meta: string;
}

const PINNED_ITEMS: PinnedItem[] = [
  { id: "pinned-1", title: "Draft launch checklist", icon: MessageSquare, unread: true },
  { id: "pinned-2", title: "Q3 roadmap notes", icon: FileText },
];

const RECENT_ITEMS: RecentItem[] = [
  { id: "recent-1", title: "Refactor auth middleware", meta: "2m" },
  { id: "recent-2", title: "Fix flaky CI on macOS runners", meta: "1h" },
  { id: "recent-3", title: "Update onboarding docs", meta: "3h" },
  { id: "recent-4", title: "Investigate memory leak in worker pool", meta: "1d" },
  { id: "recent-5", title: "Migrate billing service to v2 API", meta: "3d" },
  { id: "recent-6", title: "Clean up unused feature flags", meta: "1w" },
];

/**
 * Sidebar-panel mockup — a pinned section (icons, one unread) and a recent
 * section (relative timestamps that swap for pin/delete actions on hover)
 * inside a hairline-ringed card that stands in for a real app's sidebar
 * surface. Clicking any row moves `activeId`, so the acceptance signal —
 * the active pill gliding between rows via `layoutId="active"` — is easy to
 * see; hovering any recent row swaps its timestamp for the action buttons.
 */
export function ThreadListPreview() {
  const [activeId, setActiveId] = useState<string>(RECENT_ITEMS[0].id);

  return (
    <div className="flex h-[520px] w-full items-center justify-center rounded-xl border bg-neutral-100 dark:bg-neutral-950">
      <div
        style={{ boxShadow: "0 0 0 0.5px var(--tl-hairline)" }}
        className="w-[280px] rounded-2xl bg-white p-2 dark:bg-neutral-900 [--tl-hairline:rgba(0,0,0,0.08)] dark:[--tl-hairline:rgba(255,255,255,0.157)]"
      >
        <ThreadList>
          <ThreadListSection title="Pinned">
            {PINNED_ITEMS.map((item) => (
              <ThreadListItem
                key={item.id}
                active={activeId === item.id}
                unread={item.unread}
                icon={<item.icon className="h-4 w-4" />}
                onSelect={() => setActiveId(item.id)}
              >
                {item.title}
              </ThreadListItem>
            ))}
          </ThreadListSection>

          <ThreadListSection
            title="Recent"
            action={
              <ThreadListAction aria-label="New thread" onClick={() => {}}>
                <Plus className="h-3 w-3" />
              </ThreadListAction>
            }
          >
            {RECENT_ITEMS.map((item) => (
              <ThreadListItem
                key={item.id}
                active={activeId === item.id}
                meta={item.meta}
                onSelect={() => setActiveId(item.id)}
                actions={
                  <>
                    <ThreadListAction aria-label="Pin thread" onClick={() => {}}>
                      <Pin className="h-3 w-3" />
                    </ThreadListAction>
                    <ThreadListAction aria-label="Delete thread" onClick={() => {}}>
                      <Trash2 className="h-3 w-3" />
                    </ThreadListAction>
                  </>
                }
              >
                {item.title}
              </ThreadListItem>
            ))}
          </ThreadListSection>
        </ThreadList>
      </div>
    </div>
  );
}
