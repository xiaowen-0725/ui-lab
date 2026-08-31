"use client";

import { useState } from "react";
import {
  BillingIntervalHint,
  BillingPlanGrid,
  DEFAULT_BILLING_PLANS,
  type BillingInterval,
} from "@/components/motion/billing-plan-grid";

export function BillingPlanGridPreview() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  return (
    <div className="w-full rounded-2xl border border-border bg-background p-4 sm:p-6">
      <BillingPlanGrid
        plans={DEFAULT_BILLING_PLANS}
        currentPlanId="pro"
        interval={interval}
        onIntervalChange={setInterval}
      />
      <BillingIntervalHint className="mt-4" />
    </div>
  );
}
