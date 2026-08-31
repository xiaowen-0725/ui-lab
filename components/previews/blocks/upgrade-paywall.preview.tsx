"use client";

import { useState } from "react";
import { UpgradePaywall } from "@/components/motion/upgrade-paywall";

const rows = [
  ["Northwind Labs", "northwind.example", "Series A"],
  ["Harbor Analytics", "harbor.example", "Seed"],
  ["Lumen Freight", "lumen.example", "Series B"],
  ["Atlas Health", "atlas.example", "Growth"],
];

export function UpgradePaywallPreview() {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
        >
          {open ? "Hide gate" : "Show gate"}
        </button>
      </div>
      <UpgradePaywall
        open={open}
        onOpenChange={setOpen}
        title="Upgrade to unlock reports"
        description="This workspace is on the starter plan. Reports, exports, and saved views stay locked until you move to Business."
        actionLabel="Upgrade Plan"
        className="min-h-[360px] border border-border"
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Companies</h3>
            <span className="rounded-md bg-foreground px-2 py-1 text-xs text-background">+ New</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Domain</th>
                <th className="py-2 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, domain, stage]) => (
                <tr key={name} className="border-t border-border">
                  <td className="py-2.5 font-medium text-foreground">{name}</td>
                  <td className="py-2.5 text-muted-foreground">{domain}</td>
                  <td className="py-2.5 text-muted-foreground">{stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </UpgradePaywall>
    </div>
  );
}
