"use client";

import { CitationChip, SourceCard, SourceList, type CitationSource } from "@/components/motion/citations/index";

const source: CitationSource = {
  title: "表单标签教程", domain: "w3.org",
  snippet: "了解如何为表单控件提供标签与说明。",
  href: "https://www.w3.org/WAI/tutorials/forms/labels/",
  favicon: <span aria-hidden="true">文</span>,
};

export function CitationsExample() {
  return (
    <article className="w-full max-w-lg space-y-4 pt-24">
      <p className="text-sm leading-7">设计表单时，为输入项提供清楚的标签与填写说明。<CitationChip index={1} source={source} /></p>
      <p className="text-xs text-muted-foreground">悬停或聚焦编号可预览来源；点击来源卡片可阅读原文。</p>
      <SourceList title="参考来源 · 1"><SourceCard source={source} index={1} /></SourceList>
    </article>
  );
}
