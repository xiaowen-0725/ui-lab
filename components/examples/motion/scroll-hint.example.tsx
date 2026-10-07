import { ScrollHint } from "@/components/motion/scroll-hint";

export function ScrollHintExample() {
  return (
    <section className="h-80 overflow-y-auto rounded-xl border border-border">
      <div className="flex min-h-80 flex-col items-center justify-center gap-8 p-6 text-center">
        <div><h2 className="text-2xl font-semibold">探索阅读空间</h2><p className="mt-2 text-muted-foreground">向下滚动这个区域，查看更多内容。</p></div>
        <ScrollHint variant="mouse" label="下方还有内容" />
      </div>
      <div className="min-h-56 border-t border-border bg-muted p-6">
        <h3 className="font-medium">继续探索</h3>
        <p className="mt-2">这里可以放置文章目录、功能介绍或下一段正文。</p>
      </div>
    </section>
  );
}
