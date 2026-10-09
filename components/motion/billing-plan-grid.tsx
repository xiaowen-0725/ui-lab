"use client";

import { LayoutGroup, motion } from "motion/react";
import { useHydratedReducedMotion as useReducedMotion } from "@/lib/hooks/use-hydrated-reduced-motion";
import {
	type CSSProperties,
	type ReactNode,
	useCallback, useState } from "react";
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
	appearance?: "original" | "semantic";
	pendingPlanId?: string;
	disabled?: boolean;
	content?: Partial<{
		interval: string;
		monthly: string;
		annual: string;
		current: string;
		manage: string;
		custom: string;
		perMonth: string;
		billedYearly: string;
		pending: string;
	}>;
	/** Explicit consumer-supplied totals or explanatory copy; annualPrice remains a monthly equivalent. */
	priceDescription?: (
		plan: BillingPlan,
		interval: BillingInterval,
	) => ReactNode;
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
	appearance = "original",
	pendingPlanId,
	disabled,
	content,
	priceDescription,
}: BillingPlanGridProps) {
	const c = {
		interval: "Billing interval",
		monthly: "Monthly",
		annual: "Annual",
		current: "Current plan",
		manage: "Manage plan",
		custom: "Custom",
		perMonth: "/month",
		billedYearly: "Billed yearly",
		pending: "Updating…",
		...content,
	};
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
    <div
			style={
				appearance === "semantic"
					? ({
							"--billing-plan-grid-surface": "var(--card)",
							"--billing-plan-grid-text": "var(--foreground)",
							"--billing-plan-grid-muted": "var(--muted-foreground)",
							"--billing-plan-grid-border": "var(--border)",
							"--billing-plan-grid-soft": "var(--muted)",
							"--billing-plan-grid-primary": "var(--primary)",
							"--billing-plan-grid-on-primary": "var(--primary-foreground)",
						} as CSSProperties)
					: undefined
			}
			className={cn("flex w-full flex-col gap-5", className)}>
      <div className="flex justify-center">
        <LayoutGroup>
          <fieldset
            aria-label={c.interval}
						className="m-0 inline-flex min-w-0 rounded-full border border-[var(--billing-plan-grid-border,rgb(255_255_255/0.1))] bg-[var(--billing-plan-grid-surface,#161616)] p-1"
					>
            {(["monthly", "annual"] as const).map((option) => {
              const active = interval === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
									disabled={disabled || !!pendingPlanId}
									onClick={() => setIntervalValue(option)}
                  className={cn(
										"relative rounded-full px-3.5 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-[var(--billing-plan-grid-text,white)]"
											: "text-[var(--billing-plan-grid-muted,#8b8b8b)] hover:text-[var(--billing-plan-grid-text,white)]",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId={reduce ? undefined : "billing-interval-pill"}
                      className="absolute inset-0 rounded-full bg-[var(--billing-plan-grid-soft,#2a2a2a)] shadow-sm"
											transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    />
                  ) : null}
                  <span className="relative z-10">
                    {c[option]}
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
								"relative flex flex-col rounded-[20px] border bg-[var(--billing-plan-grid-surface,#121212)] p-5",
                current ? "border-[var(--billing-plan-grid-primary,#7c5cff)]"
									: "border-[var(--billing-plan-grid-border,rgb(255_255_255/0.1))]",
              )}
            >
              {current ? (
                <span className="absolute top-4 right-4 rounded-full bg-[var(--billing-plan-grid-primary,#7c5cff)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--billing-plan-grid-text,white)] uppercase">
									{c.current}
								</span>
              ) : null}
              <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--billing-plan-grid-muted,#8b8b8b)] uppercase">
                {plan.name}
              </h3>
              <p className="mt-2 min-h-10 text-sm text-[var(--billing-plan-grid-muted,#8b8b8b)]">{plan.description}</p>
              <div className="mt-4 flex items-end gap-1">
                {price === null ? (
                  <span className="text-3xl font-semibold tracking-tight text-[var(--billing-plan-grid-text,white)]">
										{c.custom}
									</span>
                ) : (
                  <>
                    <span className="text-3xl font-semibold tracking-tight text-[var(--billing-plan-grid-text,white)]">
                      <NumberTicker
                        value={price}
                        prefix={plan.currency ?? "$"}
                        startOnView={false}
                        duration={0.55}
                      />
                    </span>
                    <span className="pb-1 text-sm text-[var(--billing-plan-grid-muted,#8b8b8b)]">
											{c.perMonth}
										</span>
                  </>
                )}
              </div>
              {priceDescription ? (
								<div className="mt-1 min-h-4 text-xs text-[var(--billing-plan-grid-muted,#8b8b8b)]">
									{priceDescription(plan, interval)}
								</div>
							) : price !== null && interval === "annual" ? (
                <p className="mt-1 text-xs text-[var(--billing-plan-grid-muted,#8b8b8b)]">
									{c.billedYearly}
								</p>
              ) : (
                <p className="mt-1 text-xs text-transparent">.</p>
              )}
              <motion.button
                type="button"
								disabled={disabled || !!pendingPlanId}
								onClick={() => onSelectPlan?.(plan.id)}
                whileTap={reduce || !canHover ? undefined : { scale: 0.97 }}
                transition={SPRING_PRESS}
                className={cn(
									"mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  current
                    ? "bg-[var(--billing-plan-grid-primary,#7c5cff)] text-[var(--billing-plan-grid-on-primary,white)]"
										: "border border-[var(--billing-plan-grid-border,rgb(255_255_255/0.15))] bg-transparent text-[var(--billing-plan-grid-text,white)] hover:bg-[var(--billing-plan-grid-soft,rgb(255_255_255/0.05))]",
                )}
              >
                {pendingPlanId === plan.id
									? c.pending
									: current ? c.manage
										: plan.cta}
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
      <p className="mb-2 text-[11px] font-medium tracking-wide text-[var(--billing-plan-grid-muted,#8b8b8b)]">{heading}</p>
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-2 text-sm text-[var(--billing-plan-grid-muted,#8b8b8b)]"
					>
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
              className="mt-0.5 text-[#6b6b6b] outline-none hover:text-[var(--billing-plan-grid-text,white)] focus-visible:ring-2 focus-visible:ring-ring"
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
    <p className={cn(
				"text-center text-xs text-[var(--billing-plan-grid-muted,#8b8b8b)]", className)}>
			Annual prices show the monthly equivalent.
		</p>
  );
}
