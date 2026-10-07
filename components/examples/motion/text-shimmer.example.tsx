import { TextShimmer } from "@/components/motion/text-shimmer";

export function TextShimmerExample() {
  return (
    <section className="mx-auto max-w-md space-y-3 rounded-xl border border-border bg-card p-6 text-foreground">
      <h2 className="text-lg font-semibold">资料摘要</h2>
      <TextShimmer as="p" duration={2.5} className="text-sm">正在整理资料…</TextShimmer>
      <p className="text-xs text-muted-foreground">加载提示的视觉示例。</p>
    </section>
  );
}
