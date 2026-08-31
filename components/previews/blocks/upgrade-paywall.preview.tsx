"use client";

import { useState } from "react";
import { UpgradePaywall } from "@/components/motion/upgrade-paywall";
import {
  BrandMark,
  FilterGlyph,
  PlusGlyph,
  SearchGlyph,
  SortGlyph,
} from "@/components/motion/startup-visuals-icons";
import { ProductChrome } from "@/components/previews/blocks/product-chrome";

const ROWS = [
  {
    name: "Nimble Tech",
    domain: "nimble.tech",
    funding: "$10M – $20M",
    date: "12 Mar 2026",
    mark: "bg-[#f43f8c]",
  },
  {
    name: "Harbor Analytics",
    domain: "harborhq.io",
    funding: "$4M – $8M",
    date: "02 Feb 2026",
    mark: "bg-[#2f6bff]",
  },
  {
    name: "Quantum North",
    domain: "quantumnorth.com",
    funding: "$20M – $40M",
    date: "18 Jan 2026",
    mark: "bg-[#22c55e]",
  },
  {
    name: "Lumen Freight",
    domain: "lumenfreight.co",
    funding: "$8M – $12M",
    date: "09 Dec 2025",
    mark: "bg-[#f97316]",
  },
  {
    name: "Atlas Health",
    domain: "atlas.health",
    funding: "$15M – $25M",
    date: "21 Nov 2025",
    mark: "bg-[#7c5cff]",
  },
];

function CompaniesWorkspace() {
  return (
    <div className="min-h-[440px] bg-[#f7f7f8]">
      <div className="flex items-center justify-between gap-3 border-b border-[#ececee] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <BrandMark className="size-6" />
          <p className="text-[13px] text-[#8a8a93]">
            Workspace <span className="text-[#c4c4c8]">/</span>{" "}
            <span className="font-medium text-[#111113]">Companies</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[#8a8a93]">
          <span className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-[12px] sm:inline-flex">
            Customize
          </span>
          <span className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-[12px] sm:inline-flex">
            <SortGlyph className="size-3.5" />
            Sort
          </span>
          <span className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-[12px] sm:inline-flex">
            <FilterGlyph className="size-3.5" />
            Filter
          </span>
          <span className="inline-flex size-8 items-center justify-center rounded-full">
            <SearchGlyph className="size-4" />
          </span>
          <span className="inline-flex h-8 items-center gap-1 rounded-full bg-[#111113] px-3 text-[12px] font-medium text-white">
            <PlusGlyph className="size-3.5" />
            New
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-hidden rounded-[16px] border border-[#ececee] bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[11px] tracking-wide text-[#8a8a93] uppercase">
              <tr className="border-b border-[#f0f0f2]">
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="px-4 py-2.5 font-medium">Domain</th>
                <th className="px-4 py-2.5 font-medium">Funding</th>
                <th className="px-4 py-2.5 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.name} className="border-t border-[#f3f3f5]">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-medium text-[#111113]">
                      <span className={`size-5 rounded-md ${row.mark}`} />
                      {row.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6f6f78] underline decoration-[#d4d4d8] underline-offset-2">
                    {row.domain}
                  </td>
                  <td className="px-4 py-3 text-[#6f6f78]">{row.funding}</td>
                  <td className="px-4 py-3 text-[#8a8a93]">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function UpgradePaywallPreview() {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-lg border border-[#e8e8ea] bg-white px-3 py-1.5 text-xs font-medium text-[#111113]"
        >
          {open ? "Hide gate" : "Show gate"}
        </button>
      </div>
      <ProductChrome scheme="light">
        <UpgradePaywall
          open={open}
          onOpenChange={setOpen}
          title="Get Business+ to access reports"
          description="You can start by adding a new company list or connecting your tools. To use company reports, upgrade to Business Plus."
          actionLabel="Upgrade Plan"
        >
          <CompaniesWorkspace />
        </UpgradePaywall>
      </ProductChrome>
    </div>
  );
}
