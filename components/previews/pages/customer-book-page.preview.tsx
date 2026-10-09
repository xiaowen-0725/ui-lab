"use client";

import { useLocale } from "next-intl";
import { CustomerBookPage } from "@/components/pages/customer-book-page";

export function CustomerBookPagePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return (
    <div className="h-[42rem] w-full overflow-hidden rounded-xl border border-border">
      <CustomerBookPage locale={locale} />
    </div>
  );
}
