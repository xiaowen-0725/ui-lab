"use client";

import { useState } from "react";
import {
  CloseGlyph,
  GradientAvatar,
  HelpGlyph,
  LayoutToggleIcon,
  MoreGlyph,
  StarGlyph,
  SunIcon,
} from "@/components/motion/startup-visuals-icons";
import {
  DEFAULT_SURFACE_LAYOUTS,
  DEFAULT_VIEW_LAYOUTS,
  ViewLayoutSwitch,
} from "@/components/motion/view-layout-switch";
import { ProductChrome } from "@/components/previews/blocks/product-chrome";

const AGENTS = [
  { id: "rune", name: "Rune", mark: "from-[#60a5fa] to-[#a78bfa]" },
  { id: "aether", name: "Aether", mark: "from-[#34d399] to-[#22d3ee]" },
  { id: "syntax", name: "Syntax", mark: "from-[#f97316] to-[#f43f8c]" },
];

export function ViewLayoutSwitchPreview() {
  const [layout, setLayout] = useState("list");
  const [surface, setSurface] = useState("side-drawer");

  return (
    <ProductChrome scheme="light" className="min-h-[560px] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#f0f0f2] px-5 py-3">
        <p className="text-[13px] text-[#8a8a93]">
          Agent <span className="text-[#c4c4c8]">/</span>{" "}
          <span className="font-medium text-[#111113]">Ask Rune</span>
        </p>
        <div className="flex items-center gap-2 text-[12px] text-[#6f6f78]">
          <span className="hidden rounded-full bg-[#f4f4f6] px-2.5 py-1 sm:inline">Quick Chat</span>
          <span className="hidden rounded-full px-2.5 py-1 sm:inline">Memory</span>
          <span className="hidden rounded-full px-2.5 py-1 sm:inline">Share</span>
          <GradientAvatar className="size-6" />
          <HelpGlyph className="size-4" />
          <SunIcon className="size-4" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex items-center gap-2">
          {AGENTS.map((agent) => (
            <span
              key={agent.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] ${
                agent.id === "rune"
                  ? "bg-[#f4f4f6] font-medium text-[#111113]"
                  : "text-[#8a8a93]"
              }`}
            >
              <span className={`size-3.5 rounded-full bg-gradient-to-br ${agent.mark}`} />
              {agent.name}
            </span>
          ))}
        </div>
        <ViewLayoutSwitch value={layout} onValueChange={setLayout} />
      </div>

      <div className="relative flex min-h-[460px]">
        <div className="min-w-0 flex-1 px-6 py-8">
          <p className="text-[22px] font-semibold tracking-tight text-[#111113]">Good morning</p>
          <div className="mt-5 rounded-[18px] border border-[#ececee] bg-[#f7f7f8] px-4 py-4">
            <p className="text-[14px] text-[#8a8a93]">Ask Rune to draft the quarterly sales report…</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Message someone", "Summarize contract", DEFAULT_VIEW_LAYOUTS.find((item) => item.id === layout)?.label].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#ececee] bg-white px-3 py-1 text-[12px] text-[#6f6f78]"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <aside className="relative w-[320px] shrink-0 border-l border-[#ececee] bg-white">
          <div className="flex items-center justify-between gap-2 border-b border-[#f0f0f2] px-3 py-2.5">
            <p className="min-w-0 truncate text-[12px] text-[#8a8a93]">
              Agent / Rune /{" "}
              <span className="font-medium text-[#111113]">Quarterly sales report</span>
            </p>
            <div className="flex items-center text-[#8a8a93]">
              <span className="inline-flex size-7 items-center justify-center">
                <StarGlyph className="size-3.5" />
              </span>
              <ViewLayoutSwitch
                variant="menu"
                layouts={DEFAULT_SURFACE_LAYOUTS}
                value={surface}
                onValueChange={setSurface}
                defaultOpen
                trigger={<LayoutToggleIcon className="size-4" />}
              />
              <span className="inline-flex size-7 items-center justify-center">
                <MoreGlyph className="size-3.5" />
              </span>
              <span className="inline-flex size-7 items-center justify-center">
                <CloseGlyph className="size-3.5" />
              </span>
            </div>
          </div>
          <div className="space-y-3 p-3 pt-16">
            <p className="text-[11px] text-[#8a8a93]">3 tools used</p>
            <div className="rounded-[14px] border border-[#ececee] bg-[#f7f7f8] p-3">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-lg bg-gradient-to-br from-[#60a5fa] to-[#f97316]" />
                <div>
                  <p className="text-[13px] font-medium text-[#111113]">Northwind Labs</p>
                  <p className="text-[11px] text-[#8a8a93]">Matched in the company list</p>
                </div>
              </div>
            </div>
            <div className="rounded-[14px] border border-[#ececee] p-3 text-[13px] leading-6 text-[#3f3f46]">
              I found two companies named Northwind. The quarterly report below is attached to the
              active workspace.
            </div>
            <div className="rounded-[14px] border border-[#ececee] bg-white p-3">
              <p className="text-[12px] font-medium text-[#111113]">
                Quarterly sales report for Northwind.pdf
              </p>
              <div className="mt-2 flex gap-2 text-[11px] text-[#6f6f78]">
                <span className="rounded-full bg-[#f4f4f6] px-2 py-1">Share</span>
                <span className="rounded-full bg-[#f4f4f6] px-2 py-1">Download</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </ProductChrome>
  );
}
