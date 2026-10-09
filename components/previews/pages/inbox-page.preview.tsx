"use client";

import { useLocale } from "next-intl";
import { InboxPage } from "@/components/pages/inbox-page";

export function InboxPagePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return (
    <div className="h-[42rem] w-full overflow-hidden rounded-xl border border-border">
      <InboxPage locale={locale} />
    </div>
  );
}
