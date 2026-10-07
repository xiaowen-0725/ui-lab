"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button/index";

export function ButtonExample() {
	const [saved, setSaved] = useState(false);

	return (
		<section className="space-y-3 rounded-xl border border-border p-4">
			<h2 className="font-medium">会议纪要草稿</h2>
			<p className="text-sm text-muted-foreground">整理本周进展与下周计划。</p>
			<div className="flex flex-wrap gap-2">
				<Button ripple onClick={() => setSaved(true)}>
					保存到本地演示
				</Button>
				<Button variant="outline" onClick={() => setSaved(false)}>
					撤销保存
				</Button>
			</div>
			<p role="status">
				{saved ? "草稿已在本次演示中标记为保存。" : "草稿尚未保存。"}
			</p>
		</section>
	);
}
