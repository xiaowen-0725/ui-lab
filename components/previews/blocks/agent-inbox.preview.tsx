"use client";

import { Database, Mail, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useState } from "react";
import {
  ActionReceipt,
  AgentInbox,
  type InboxRisk,
  InboxItem,
  type InboxStatus,
} from "@/components/motion/agent-inbox";
import { EASE_OUT } from "@/lib/ease";

type ItemId = "report" | "migrate" | "cleanup";

interface DemoItem {
  id: ItemId;
  icon: ReactNode;
  source: string;
  title: string;
  description: string;
  risk: InboxRisk;
  expires?: string;
  status: InboxStatus;
}

const INITIAL_ITEMS: DemoItem[] = [
  {
    id: "report",
    icon: <Mail className="h-4 w-4" />,
    source: "report-agent",
    title: "Send weekly usage report",
    description: "Email to 3 recipients",
    risk: "low",
    expires: "expires in 6h",
    status: "pending",
  },
  {
    id: "migrate",
    icon: <Database className="h-4 w-4" />,
    source: "migrate-agent",
    title: "Run database migration",
    description: "2 tables altered, backup taken first",
    risk: "medium",
    expires: "expires in 2h",
    status: "pending",
  },
  {
    id: "cleanup",
    icon: <Trash2 className="h-4 w-4" />,
    source: "cleanup-agent",
    title: "Delete 12 stale branches",
    description: "Includes 2 branches with unmerged commits",
    risk: "high",
    status: "pending",
  },
];

/** Ghost "Clear" button in `AgentInbox`'s action slot — decorative, no behavior. */
function ClearButton() {
  return (
    <button
      type="button"
      className="h-6 rounded-md px-2 text-muted-foreground text-xs transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
    >
      Clear
    </button>
  );
}

function resolutionFor(status: InboxStatus) {
  if (status === "approved") return "Approved · running";
  if (status === "denied") return "Denied";
  if (status === "expired") return "Expired";
  return undefined;
}

/**
 * HITL approval queue — three pending requests spanning the three risk
 * tiers, driven by local state. Approving/denying an item flips its status
 * (the row dims and the buttons swap for a resolution line); approving the
 * low-risk report additionally appends a completed `ActionReceipt` below it,
 * fading in via `AnimatePresence`. The header count badge tracks how many
 * items remain pending; "Reset" (top-right of the frame) restores the
 * initial state.
 */
export function AgentInboxPreview() {
  const [items, setItems] = useState<DemoItem[]>(INITIAL_ITEMS);

  const pendingCount = items.filter((item) => item.status === "pending").length;
  const reportApproved = items.find((item) => item.id === "report")?.status === "approved";

  const resolve = (id: ItemId, status: InboxStatus) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-xl border border-border bg-neutral-100 dark:bg-neutral-950">
      <button
        type="button"
        onClick={() => setItems(INITIAL_ITEMS)}
        className="absolute top-3 right-3 z-10 h-7 rounded-full border border-border bg-white/80 px-3 text-muted-foreground text-xs backdrop-blur transition-colors hover:text-foreground dark:bg-neutral-900/80"
      >
        Reset
      </button>

      <div className="mx-auto h-full max-w-md overflow-y-auto px-4 py-8">
        <AgentInbox title="Approvals" count={pendingCount} action={<ClearButton />}>
          <InboxItem
            icon={items[0].icon}
            source={items[0].source}
            title={items[0].title}
            description={items[0].description}
            risk={items[0].risk}
            expires={items[0].status === "pending" ? items[0].expires : undefined}
            status={items[0].status}
            resolution={resolutionFor(items[0].status)}
            onApprove={() => resolve("report", "approved")}
            onDeny={() => resolve("report", "denied")}
          >
            <div className="flex flex-col gap-0.5 text-[13px] text-muted-foreground">
              <span>alex@acme.co, priya@acme.co</span>
              <span>eng-leads@acme.co</span>
            </div>
          </InboxItem>

          <AnimatePresence>
            {reportApproved ? (
              <motion.div
                key="report-receipt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="px-4 py-3"
              >
                <ActionReceipt
                  title="Report sent"
                  scope="3 recipients · usage-weekly.pdf"
                  timestamp="just now"
                  onUndo={() => {}}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <InboxItem
            icon={items[1].icon}
            source={items[1].source}
            title={items[1].title}
            description={items[1].description}
            risk={items[1].risk}
            expires={items[1].status === "pending" ? items[1].expires : undefined}
            status={items[1].status}
            resolution={resolutionFor(items[1].status)}
            onApprove={() => resolve("migrate", "approved")}
            onDeny={() => resolve("migrate", "denied")}
          >
            <ActionReceipt
              title="Planned changes"
              scope="db: production/users, sessions"
              added={14}
              removed={3}
            />
          </InboxItem>

          <InboxItem
            icon={items[2].icon}
            source={items[2].source}
            title={items[2].title}
            description={items[2].description}
            risk={items[2].risk}
            status={items[2].status}
            resolution={resolutionFor(items[2].status)}
            onApprove={() => resolve("cleanup", "approved")}
            onDeny={() => resolve("cleanup", "denied")}
          />
        </AgentInbox>
      </div>
    </div>
  );
}
