"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import {
  BillingCheckIcon,
  BillingInfoIcon,
  BillingXIcon,
} from "@/components/motion/startup-visuals-icons";
import { SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type BillingInterval = "monthly" | "annual";

export type BillingPlanFeature = {
  label: string;
  included: boolean;
};

export type BillingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  currency?: string;
  cta: string;
  includedHeading?: string;
  excludedHeading?: string;
  features: BillingPlanFeature[];
};

export interface BillingPlanGridProps {
  plans: BillingPlan[];
  currentPlanId?: string;
  interval?: BillingInterval;
  defaultInterval?: BillingInterval;
  onIntervalChange?: (interval: BillingInterval) => void;
  onSelectPlan?: (id: string) => void;
  className?: string;
}

export const DEFAULT_BILLING_PLANS: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For solo evaluation and small experiments.",
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "€",
    cta: "Downgrade to Free",
    includedHeading: "What's included",
    excludedHeading: "Not included",
    features: [
      { label: "3 workspaces", included: true },
      { label: "Basic analytics", included: true },
      { label: "Community support", included: true },
      { label: "SSO and audit log", included: false },
      { label: "Custom roles", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing product teams that need controls.",
    monthlyPrice: 49,
    annualPrice: 39,
    currency: "€",
    cta: "Choose Pro",
    includedHeading: "Everything in Free, plus:",
    excludedHeading: "Not included",
    features: [
      { label: "Unlimited workspaces", included: true },
      { label: "Shared views and exports", included: true },
      { label: "Priority support", included: true },
      { label: "SSO and audit log", included: true },
      { label: "Custom roles", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For orgs that need procurement and security review.",
    monthlyPrice: null,
    annualPrice: null,
    cta: "Choose Enterprise Plan",
    includedHeading: "Everything in Pro, plus:",
    excludedHeading: "Not included",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Custom roles", included: true },
      { label: "Dedicated support", included: true },
      { label: "Data residency", included: true },
      { label: "Contracted SLA", included: true },
    ],
  },
];

export function BillingPlanGrid({
  plans,
  currentPlanId,
  interval: intervalProp,
  defaultInterval = "monthly",
  onIntervalChange,
  onSelectPlan,
  className,
}: BillingPlanGridProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [internalInterval, setInternalInterval] = useState<BillingInterval>(defaultInterval);
  const interval = intervalProp ?? internalInterval;

  const setIntervalValue = useCallback(
    (next: BillingInterval) => {
      if (intervalProp === undefined) setInternalInterval(next);
      onIntervalChange?.(next);
    },
    [intervalProp, onIntervalChange],
  );

  return (
    <div className={cn("flex w-full flex-col gap-5", className)}>
      <div className="flex justify-center">
        <LayoutGroup>
          <fieldset
            aria-label="Billing interval"
            className="m-0 inline-flex min-w-0 rounded-full border border-white/10 bg-[#161616] p-1"
          >
            {(["monthly", "annual"] as const).map((option) => {
              const active = interval === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setIntervalValue(option)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                    active ? "text-white" : "text-[#8b8b8b] hover:text-white",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId={reduce ? undefined : "billing-interval-pill"}
                      className="absolute inset-0 rounded-full bg-[#2a2a2a] shadow-sm"
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    />
                  ) : null}
                  <span className="relative z-10">
                    {option === "monthly" ? "Monthly" : "Annual"}
                  </span>
                </button>
              );
            })}
          </fieldset>
        </LayoutGroup>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((plan) => {
          const current = plan.id === currentPlanId;
          const price = interval === "annual" ? plan.annualPrice : plan.monthlyPrice;
          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-[20px] border bg-[#121212] p-5",
                current ? "border-[#7c5cff]" : "border-white/10",
              )}
            >
              {current ? (
                <span className="absolute top-4 right-4 rounded-full bg-[#7c5cff] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                  Current plan
                </span>
              ) : null}
              <h3 className="text-xs font-semibold tracking-[0.16em] text-[#8b8b8b] uppercase">
                {plan.name}
              </h3>
              <p className="mt-2 min-h-10 text-sm text-[#8b8b8b]">{plan.description}</p>
              <div className="mt-4 flex items-end gap-1">
                {price === null ? (
                  <span className="text-3xl font-semibold tracking-tight text-white">Custom</span>
                ) : (
                  <>
                    <span className="text-3xl font-semibold tracking-tight text-white">
                      <NumberTicker
                        value={price}
                        prefix={plan.currency ?? "$"}
                        startOnView={false}
                        duration={0.55}
                      />
                    </span>
                    <span className="pb-1 text-sm text-[#8b8b8b]">/month</span>
                  </>
                )}
              </div>
              {price !== null && interval === "annual" ? (
                <p className="mt-1 text-xs text-[#8b8b8b]">Billed yearly</p>
              ) : (
                <p className="mt-1 text-xs text-transparent">.</p>
              )}
              <motion.button
                type="button"
                onClick={() => onSelectPlan?.(plan.id)}
                whileTap={reduce || !canHover ? undefined : { scale: 0.97 }}
                transition={SPRING_PRESS}
                className={cn(
                  "mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                  current
                    ? "bg-[#7c5cff] text-white"
                    : "border border-white/15 bg-transparent text-white hover:bg-white/5",
                )}
              >
                {current ? "Manage plan" : plan.cta}
              </motion.button>
              <FeatureList plan={plan} />
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FeatureList({ plan }: { plan: BillingPlan }) {
  const included = plan.features.filter((feature) => feature.included);
  const excluded = plan.features.filter((feature) => !feature.included);

  return (
    <div className="mt-5 flex flex-col gap-3">
      {included.length ? (
        <FeatureGroup heading={plan.includedHeading ?? "What's included"} features={included} />
      ) : null}
      {excluded.length ? (
        <FeatureGroup heading={plan.excludedHeading ?? "Not included"} features={excluded} />
      ) : null}
    </div>
  );
}

function FeatureGroup({
  heading,
  features,
}: {
  heading: string;
  features: BillingPlanFeature[];
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium tracking-wide text-[#8b8b8b]">{heading}</p>
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2 text-sm text-[#8b8b8b]">
            {feature.included ? (
              <BillingCheckIcon className="mt-0.5 size-4 shrink-0 text-[#c4c4c4]" />
            ) : (
              <BillingXIcon className="mt-0.5 size-4 shrink-0 text-[#5c5c5c]" />
            )}
            <span className={cn("min-w-0 flex-1", feature.included ? "text-[#d4d4d4]" : "text-[#6b6b6b]")}>
              {feature.label}
            </span>
            <button
              type="button"
              aria-label={`About ${feature.label}`}
              className="mt-0.5 text-[#6b6b6b] outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <BillingInfoIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BillingIntervalHint({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-xs text-[#8b8b8b]", className)}>
      Annual prices show the monthly equivalent.
    </p>
  );
}
