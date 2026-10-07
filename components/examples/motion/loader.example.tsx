"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/motion/loader";

export function LoaderExample() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!loading) return;
		const timer = setTimeout(() => setLoading(false), 1200);
		return () => clearTimeout(timer);
	}, [loading]);

	return (
		<section
			className="space-y-3 rounded-xl border border-border p-4"
			aria-busy={loading}
		>
			<h2 className="font-medium">本地资料加载演示</h2>
			{loading ? (
				<div className="flex items-center gap-3">
					<Loader variant="dots" label="正在模拟加载资料" />
					<span>正在模拟加载资料……</span>
				</div>
			) : (
				<p role="status">演示资料已就绪：会议纪要、项目计划、验收记录。</p>
			)}
			<button
				type="button"
				disabled={loading}
				onClick={() => setLoading(true)}
				className="rounded-lg border border-border px-3 py-2 disabled:opacity-50"
			>
				重新演示加载
			</button>
		</section>
	);
}
