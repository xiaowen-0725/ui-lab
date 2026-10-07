"use client";

import { useState } from "react";
import { EmptyStateArchive } from "@/components/motion/empty-state/archive";

export function EmptyStateArchiveExample() {
  const [archived, setArchived] = useState(false);

  return (
    <section className="mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-foreground">
      {archived ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">归档记录</h2>
          <p role="status">已在本地归档：界面草图评审记录</p>
          <button type="button" onClick={() => setArchived(false)} className="rounded-lg border border-border px-3 py-2 text-sm">移出归档</button>
        </div>
      ) : (
        <EmptyStateArchive title="还没有归档记录" message="将已完成的记录归档，方便以后回顾。" actionLabel="归档示例记录" onAction={() => setArchived(true)} />
      )}
    </section>
  );
}
