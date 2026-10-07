"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/motion/theme-toggle";

function ThemeSample() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-5 text-foreground">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-medium">阅读空间</h2>
        <ThemeToggle variant="rectangle" start="bottom-up" aria-label="切换阅读空间明暗主题" className="size-10 rounded-full border border-border" />
      </div>
      <p className="text-sm text-muted-foreground">点击按钮，切换这个消费者页面的明暗主题。</p>
      <p role="status" className="text-sm">{mounted ? `当前主题：${resolvedTheme === "dark" ? "深色" : "浅色"}` : "正在读取主题设置。"}</p>
    </div>
  );
}

export function ThemeToggleExample() {
  // 当前入口通过 useTheme 读取上下文，消费者需提供已有依赖的最小配置。
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="ui-lab-theme-example">
      <ThemeSample />
    </ThemeProvider>
  );
}
