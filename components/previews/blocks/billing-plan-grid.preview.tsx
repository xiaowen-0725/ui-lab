"use client";

import { useState } from "react";
import {
  BillingIntervalHint,
  BillingPlanGrid,
  DEFAULT_BILLING_PLANS,
  type BillingInterval,
} from "@/components/motion/billing-plan-grid";
import {
  GradientAvatar,
  HomeIcon,
  ReportsIcon,
  SearchGlyph,
  SlidersIcon,
  SunIcon,
  TeamsIcon,
} from "@/components/motion/startup-visuals-icons";
import { ProductChrome } from "@/components/previews/blocks/product-chrome";

const NAV = [
  { id: "overview", label: "Overview", icon: <HomeIcon /> },
  { id: "alerts", label: "Alerts", icon: <ReportsIcon /> },
  { id: "teams", label: "Organization", icon: <TeamsIcon />, active: true },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const TABS = ["Organization", "Members", "Roles", "Providers", "Billing"];

export function BillingPlanGridPreview() {
  const [interval, setInterval] = useState<BillingInterval>("annual");

  return (
    <ProductChrome scheme="dark" className="flex min-h-[640px]">
      <aside className="hidden w-[200px] shrink-0 flex-col border-r border-white/10 bg-[#0c0c0c] px-3 py-4 sm:flex">
        <p className="px-2 text-[16px] font-semibold tracking-tight text-white">Aegis.</p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#161616] px-3 py-1.5 text-left text-[12px] text-[#d4d4d4]"
        >
          <span className="size-2 rounded-full bg-[#7c5cff]" />
          Northwind Inc.
        </button>
        <p className="mt-5 px-2 text-[10px] tracking-[0.16em] text-[#6b6b6b] uppercase">Workspace</p>
        <ul className="mt-2 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <li key={item.id}>
              <span
                className={`flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[13px] ${
                  item.active ? "bg-[#2a1f4d] text-white" : "text-[#8b8b8b]"
                }`}
              >
                <span className="size-4">{item.icon}</span>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-[12px] border border-white/10 px-3 py-2.5">
          <p className="flex items-center gap-2 text-[12px] text-[#d4d4d4]">
            <span className="size-1.5 rounded-full bg-[#22c55e]" />
            Team Pro Plan
          </p>
          <span className="mt-2 inline-flex h-8 w-full items-center justify-center rounded-lg border border-white/15 text-[12px] text-white">
            Upgrade
          </span>
        </div>
      </aside>
      <div className="min-w-0 flex-1 bg-[#0a0a0a]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <p className="text-[12px] text-[#8b8b8b]">
            Workspace <span className="text-[#3f3f46]">/</span> Organization{" "}
            <span className="text-[#3f3f46]">/</span>{" "}
            <span className="text-white">Billing</span>
          </p>
          <div className="flex items-center gap-2 text-[#8b8b8b]">
            <span className="hidden h-8 items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-3 text-[12px] sm:inline-flex">
              <SearchGlyph className="size-3.5" />
              Search...
              <span className="text-[#5c5c5c]">⌘</span>
            </span>
            <SunIcon className="size-4" />
            <GradientAvatar className="size-6" />
          </div>
        </div>
        <div className="flex gap-4 border-b border-white/10 px-5">
          {TABS.map((tab) => (
            <span
              key={tab}
              className={`py-2.5 text-[13px] ${
                tab === "Billing"
                  ? "border-b border-white font-medium text-white"
                  : "text-[#8b8b8b]"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="px-5 py-5">
          <BillingPlanGrid
            plans={DEFAULT_BILLING_PLANS}
            currentPlanId="pro"
            interval={interval}
            onIntervalChange={setInterval}
          />
          <BillingIntervalHint className="mt-4" />
        </div>
      </div>
    </ProductChrome>
  );
}
