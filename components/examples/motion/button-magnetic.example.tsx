"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/motion/button/magnetic";

export function ButtonMagneticExample() {
	const [favorite, setFavorite] = useState(false);

	return (
		<div className="space-y-4 p-6">
			<p className="text-sm text-muted-foreground">
				移动指针靠近按钮，点击收藏这份阅读笔记。
			</p>
			<MagneticButton
				strength={0.25}
				aria-pressed={favorite}
				onClick={() => setFavorite((current) => !current)}
			>
				{favorite ? "取消收藏" : "收藏笔记"}
			</MagneticButton>
			<p role="status">{favorite ? "笔记已加入本地收藏。" : "笔记未收藏。"}</p>
		</div>
	);
}
