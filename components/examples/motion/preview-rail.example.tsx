"use client";

import { useId, useState } from "react";
import {
	PreviewRail,
	type PreviewRailItem,
} from "@/components/motion/preview-rail";

export function PreviewRailExample() {
	const baseId = useId();
	const [active, setActive] = useState("overview");
	const items: PreviewRailItem[] = [
		{
			id: "overview",
			label: "项目概览",
			description: "确认目标与交付范围。",
			href: `#${baseId}-overview`,
		},
		{
			id: "schedule",
			label: "实施计划",
			description: "先完善使用说明，再组织验收。",
			href: `#${baseId}-schedule`,
		},
		{
			id: "review",
			label: "验收记录",
			description: "记录实际验证结果与待办。",
			href: `#${baseId}-review`,
		},
	];

	return (
		<div className="space-y-3">
			<p className="text-sm text-muted-foreground">
				悬停或用键盘聚焦导航线查看预览，点击跳转到对应本地区段。
			</p>
			<PreviewRail items={items} activeId={active} onActiveChange={setActive}>
				<div className="space-y-4 p-5">
					{items.map((item) => (
						<section
							key={item.id}
							id={`${baseId}-${item.id}`}
							className="rounded-xl border border-border p-4"
						>
							<h2 className="font-medium">{item.label}</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								{item.description}
							</p>
						</section>
					))}
				</div>
			</PreviewRail>
			<p role="status">
				当前导航：{items.find((item) => item.id === active)?.label}
			</p>
		</div>
	);
}
