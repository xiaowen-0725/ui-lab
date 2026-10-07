"use client";

import { useState } from "react";
import { MetallicButton } from "@/components/motion/button/metallic";

export function ButtonMetallicExample() {
	const [count, setCount] = useState(0);
	const [paused, setPaused] = useState(false);

	return (
		<div className="space-y-4">
			<MetallicButton
				paused={paused}
				onClick={() => setCount((current) => current + 1)}
			>
				加入阅读清单
			</MetallicButton>
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={paused}
					onChange={(event) => setPaused(event.target.checked)}
				/>
				暂停金属反光
			</label>
			<p role="status">本地演示清单已添加 {count} 次。</p>
		</div>
	);
}
