"use client";

// Samples for the concepts added with confusable pairs. Interactive ones reuse
// the shadcn primitives in components/ui; scrim, focus ring, caret, banner and
// navigation menu have no primitive here and stay plain markup.
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function useZh() {
  return useLocale() === "zh";
}

function AlertDialogSample() {
  const zh = useZh();
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        {zh ? "删除项目" : "Delete project"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{zh ? "删除这个项目？" : "Delete this project?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {zh ? "删除后无法恢复。" : "This cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{zh ? "取消" : "Cancel"}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => setOpen(false)}>
            {zh ? "删除" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertDialogFace() {
  const zh = useZh();
  return (
    <div className="w-48 rounded-xl border border-border bg-card p-3 shadow-sm">
      <p className="text-sm font-medium">{zh ? "删除这个项目？" : "Delete this project?"}</p>
      <p className="mt-1 text-xs text-muted-foreground">{zh ? "删除后无法恢复。" : "This cannot be undone."}</p>
      <div className="mt-2 flex justify-end gap-1.5">
        <span className="rounded-md border border-border px-2 py-1 text-xs">{zh ? "取消" : "Cancel"}</span>
        <span className="rounded-md bg-destructive px-2 py-1 text-xs text-white">{zh ? "删除" : "Delete"}</span>
      </div>
    </div>
  );
}

function SegmentedSample() {
  const zh = useZh();
  const options = zh ? ["日", "周", "月"] : ["Day", "Week", "Month"];
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      defaultValue={["1"]}
      aria-label={zh ? "时间范围" : "Range"}
    >
      {options.map((option, index) => (
        <ToggleGroupItem key={option} value={String(index)}>
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function SheetFace() {
  const zh = useZh();
  return (
    <div className="flex h-28 w-40 flex-col justify-end overflow-hidden rounded-xl border border-border bg-foreground/5">
      <div className="rounded-t-xl border-t border-border bg-card px-3 pb-2 pt-1.5">
        <span className="mx-auto mb-1.5 block h-1 w-8 rounded-full bg-foreground/20" />
        <span className="block text-xs">{zh ? "分享" : "Share"}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{zh ? "复制链接" : "Copy link"}</span>
      </div>
    </div>
  );
}

function CommandFace() {
  const zh = useZh();
  return (
    <div className="w-52 overflow-hidden rounded-xl border border-border bg-card text-xs shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 text-muted-foreground">
        <span>{zh ? "输入命令…" : "Type a command…"}</span>
        <kbd className="rounded border border-border px-1">⌘K</kbd>
      </div>
      <div className="bg-foreground/5 px-3 py-1.5">{zh ? "新建文件" : "New file"}</div>
      <div className="px-3 py-1.5 text-muted-foreground">{zh ? "切换主题" : "Toggle theme"}</div>
    </div>
  );
}

function NavigationMenuSample() {
  const zh = useZh();
  const links = zh ? ["产品", "价格", "文档"] : ["Product", "Pricing", "Docs"];
  return (
    <nav aria-label={zh ? "示例导航" : "Sample navigation"} className="w-64">
      <ul className="flex gap-1 rounded-lg border border-border bg-card p-1 text-sm">
        {links.map((link, index) => (
          <li key={link}>
            <a
              href={`#nav-${index}`}
              aria-current={index === 0 ? "page" : undefined}
              className={index === 0 ? "block rounded-md bg-foreground/[0.06] px-3 py-1 font-medium" : "block rounded-md px-3 py-1 text-muted-foreground"}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-1 grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-2 text-xs">
        <span>{zh ? "分析" : "Analytics"}</span>
        <span>{zh ? "自动化" : "Automation"}</span>
      </div>
    </nav>
  );
}

function BannerSample() {
  const zh = useZh();
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border">
      <section aria-label={zh ? "公告" : "Announcement"} className="flex items-center justify-between gap-2 bg-foreground px-3 py-1.5 text-xs text-background">
        <span>{zh ? "周六 2 点维护，期间只读。" : "Read-only during Saturday maintenance."}</span>
        <span aria-hidden="true">×</span>
      </section>
      <div className="h-14 bg-card" />
    </div>
  );
}

function CollapsibleSample() {
  const zh = useZh();
  return (
    <Collapsible className="w-56 rounded-lg border border-border text-sm">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 font-medium">
        {zh ? "高级设置" : "Advanced"}
        <span aria-hidden="true">▾</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        {zh ? "这里放不常用的选项。" : "Options you rarely need."}
      </CollapsibleContent>
    </Collapsible>
  );
}

function CollapsibleFace() {
  const zh = useZh();
  return (
    <div className="w-48 rounded-lg border border-border text-sm">
      <div className="flex items-center justify-between px-3 py-1.5 font-medium">
        <span>{zh ? "高级设置" : "Advanced"}</span>
        <span aria-hidden="true">▴</span>
      </div>
      <p className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">{zh ? "这里放不常用的选项。" : "Options you rarely need."}</p>
    </div>
  );
}

function ScrimSample() {
  const zh = useZh();
  return (
    <div className="relative h-32 w-56 overflow-hidden rounded-lg border border-border bg-card">
      <div className="space-y-1.5 p-3">
        <span className="block h-2 w-3/4 rounded bg-foreground/15" />
        <span className="block h-2 w-1/2 rounded bg-foreground/15" />
      </div>
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 rounded-lg bg-card px-3 py-2 text-center text-xs shadow-sm">
        {zh ? "遮罩把页面压暗" : "The scrim dims the page"}
      </div>
    </div>
  );
}

function FocusRingSample() {
  const zh = useZh();
  return (
    <div className="flex gap-3">
      <span className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm">{zh ? "取消" : "Cancel"}</span>
      <span className="inline-flex h-9 items-center rounded-lg bg-foreground px-3 text-sm text-background outline-2 outline-offset-2 outline-foreground outline">
        {zh ? "保存" : "Save"}
      </span>
    </div>
  );
}

function CaretSample() {
  const zh = useZh();
  return (
    <div className="flex h-9 w-56 items-center rounded-lg border border-border bg-background px-3 text-sm">
      <span>{zh ? "搜索组件" : "Search comp"}</span>
      <span aria-hidden="true" className="ml-px inline-block h-4 w-px animate-pulse bg-primary" />
    </div>
  );
}

export const MORE_SAMPLES = {
  "alert-dialog": AlertDialogSample,
  "segmented-control": SegmentedSample,
  "navigation-menu": NavigationMenuSample,
  banner: BannerSample,
  collapsible: CollapsibleSample,
  scrim: ScrimSample,
  "focus-ring": FocusRingSample,
  caret: CaretSample,
} as const;

export const MORE_FACES = {
  sheet: SheetFace,
  command: CommandFace,
  "alert-dialog": AlertDialogFace,
  "segmented-control": SegmentedSample,
  "navigation-menu": NavigationMenuSample,
  banner: BannerSample,
  collapsible: CollapsibleFace,
  scrim: ScrimSample,
  "focus-ring": FocusRingSample,
  caret: CaretSample,
} as const;
