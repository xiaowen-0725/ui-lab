"use client";

import { useState } from "react";
import {
	AISidebar,
	type SidebarResource,
} from "@/components/agents/ai-sidebar/index";

const INITIAL_RESOURCES: SidebarResource[] = [
	{
		id: "project",
		label: "资料整理项目",
		kind: "project",
		children: [
			{ id: "minutes", label: "会议纪要", kind: "file" },
			{ id: "plan", label: "实施计划", kind: "file" },
		],
	},
	{
		id: "notes",
		label: "个人笔记",
		kind: "folder",
		children: [{ id: "reading", label: "阅读摘要", kind: "file" }],
	},
];

function findLabel(
	items: SidebarResource[],
	id: string | null,
): string | undefined {
	for (const item of items) {
		if (item.id === id) return item.label;
		const label = item.children ? findLabel(item.children, id) : undefined;
		if (label) return label;
	}
}

export function AiSidebarExample() {
	const [items, setItems] = useState(INITIAL_RESOURCES);
	const [active, setActive] = useState<string | null>("minutes");
	const [result, setResult] = useState(
		"选择文件；行菜单可重命名或移动。所有更改仅用于本地演示。",
	);

	return (
		<div className="flex min-h-80 flex-wrap overflow-hidden rounded-xl border border-border">
			<aside className="w-56 shrink-0 border-r border-border p-3">
				<h2 className="mb-2 text-sm font-medium">项目资料</h2>
				<AISidebar
					items={items}
					activeId={active}
					defaultExpandedIds={["project", "notes"]}
					ariaLabel="项目资料树"
					onItemsChange={setItems}
					onActiveChange={(id) => {
						setActive(id);
						setResult(`已选择：${findLabel(items, id) ?? id}`);
					}}
					onRename={(_, label) => setResult(`本地资源已重命名为：${label}`)}
					onMove={({ itemId, targetId }) =>
						setResult(
							`已在本地移动${findLabel(items, itemId) ?? itemId}，目标：${findLabel(items, targetId) ?? "顶层"}。`,
						)
					}
					renderMenu={(_, { rename, moves, close }) => (
						<div className="space-y-1 p-1">
							<button
								type="button"
								className="block w-full rounded px-2 py-1 text-left text-sm"
								onClick={rename}
							>
								重命名
							</button>
							{moves.up ? (
								<button
									type="button"
									className="block w-full rounded px-2 py-1 text-left text-sm"
									onClick={() => {
										moves.up?.();
										close();
									}}
								>
									向上移动
								</button>
							) : null}
							{moves.down ? (
								<button
									type="button"
									className="block w-full rounded px-2 py-1 text-left text-sm"
									onClick={() => {
										moves.down?.();
										close();
									}}
								>
									向下移动
								</button>
							) : null}
							{moves.into ? (
								<button
									type="button"
									className="block w-full rounded px-2 py-1 text-left text-sm"
									onClick={() => {
										moves.into?.run();
										close();
									}}
								>
									移入{moves.into.label}
								</button>
							) : null}
							{moves.out ? (
								<button
									type="button"
									className="block w-full rounded px-2 py-1 text-left text-sm"
									onClick={() => {
										moves.out?.();
										close();
									}}
								>
									移出文件夹
								</button>
							) : null}
						</div>
					)}
				/>
			</aside>
			<section className="min-w-0 flex-1 space-y-3 p-5">
				<p className="text-sm text-muted-foreground">当前资源</p>
				<h3 className="font-semibold">
					{findLabel(items, active) ?? "请选择资源"}
				</h3>
				<p role="status">{result}</p>
			</section>
		</div>
	);
}
