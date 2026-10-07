"use client";

import { useState } from "react";
import { GlareHover } from "@/components/motion/glare-hover";

export function GlareHoverExample() {
	const [saved, setSaved] = useState(false);

	return (
		<div className="space-y-3">
			<GlareHover className="rounded-xl" duration={550}>
				<article className="rounded-xl border border-border bg-card p-6 text-card-foreground">
					<p className="text-sm text-muted-foreground">阅读推荐</p>
					<h2 className="mt-2 text-xl font-semibold">让任务记录更清晰</h2>
					<p className="my-4 text-sm">
						按目标、进展和下一步组织团队记录。悬停卡片可查看眩光反馈。
					</p>
					<button
						type="button"
						aria-pressed={saved}
						onClick={() => setSaved((current) => !current)}
						className="rounded-lg bg-primary px-3 py-2 text-primary-foreground"
					>
						{saved ? "移出阅读清单" : "加入阅读清单"}
					</button>
				</article>
			</GlareHover>
			<p role="status">
				{saved ? "已加入本地演示阅读清单。" : "尚未加入阅读清单。"}
			</p>
		</div>
	);
}
