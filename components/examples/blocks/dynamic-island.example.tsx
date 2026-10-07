"use client";

import { useState } from "react";
import {
	DynamicIsland,
	DynamicIslandView,
} from "@/components/motion/dynamic-island";

export function DynamicIslandExample() {
	const [view, setView] = useState<string | null>(null);

	return (
		<div className="space-y-4">
			<h2 className="font-medium">本地文件准备演示</h2>
			<div className="flex min-h-40 justify-center">
				<DynamicIsland view={view} compact={<span>等待任务</span>}>
					<DynamicIslandView id="preparing" className="w-72 flex-col gap-3 p-5">
						<p className="font-medium">正在准备资料</p>
						<p className="text-sm">会议纪要与项目计划 · 本地演示</p>
						<button
							type="button"
							onClick={() => setView("complete")}
							className="rounded-full border border-current px-3 py-1"
						>
							模拟完成
						</button>
					</DynamicIslandView>
					<DynamicIslandView id="complete" className="w-72 flex-col gap-3 p-5">
						<p className="font-medium">演示资料已准备好</p>
						<button
							type="button"
							onClick={() => setView(null)}
							className="rounded-full border border-current px-3 py-1"
						>
							收起通知
						</button>
					</DynamicIslandView>
				</DynamicIsland>
			</div>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setView("preparing")}
					className="rounded-lg border border-border px-3 py-2"
				>
					开始演示
				</button>
				<button
					type="button"
					onClick={() => setView(null)}
					className="rounded-lg border border-border px-3 py-2"
				>
					关闭
				</button>
			</div>
			<p role="status">
				{view === "preparing"
					? "资料准备视图已打开。"
					: view === "complete"
						? "本地演示已完成。"
						: "通知已收起。"}
			</p>
		</div>
	);
}
