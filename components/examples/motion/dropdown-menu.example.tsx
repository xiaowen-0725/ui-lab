"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/motion/dropdown-menu";

export function DropdownMenuExample() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [message, setMessage] = useState("选择一个笔记操作。");

  return (
    <section className="space-y-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>笔记操作</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>阅读笔记</DropdownMenuLabel>
          <DropdownMenuItem
            description="在本地演示中创建副本"
            onSelect={() => setMessage("已在本地演示状态中复制笔记。")}
          >
            复制笔记
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={pinned}
            onCheckedChange={(next) => {
              setPinned(next);
              setMessage(next ? "笔记已在本地置顶。" : "已取消本地置顶。");
            }}
          >
            置顶笔记
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setMessage("已在本地标记笔记为归档。")}
          >
            归档笔记
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p role="status">{message}</p>
      <p className="text-sm text-muted-foreground">
        置顶状态：{pinned ? "已置顶" : "未置顶"}。这些操作仅演示回调反馈。
      </p>
    </section>
  );
}
