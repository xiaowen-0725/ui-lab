"use client";

import { useState } from "react";
import { UpgradePaywall } from "@/components/motion/upgrade-paywall";

export function UpgradePaywallExample() {
	const [open, setOpen] = useState(true);
	const [result, setResult] = useState(
		"这是升级提示演示，点击只会关闭遮罩并预览内容。",
	);

	return (
		<div className="space-y-3">
			<UpgradePaywall
				title="预览进阶报表"
				description="了解报告内容。此演示不创建订单或开通付费权益。"
				actionLabel="体验本地预览"
				open={open}
				onOpenChange={setOpen}
				onAction={() => setResult("已打开本地报表预览，未创建订单或开通权益。")}
			>
				<section className="min-h-96 space-y-4 bg-card p-6 text-card-foreground">
					<h2 className="text-xl font-semibold">项目进展报表</h2>
					<p className="text-sm text-muted-foreground">示例数据 · 本周</p>
					<dl className="grid grid-cols-2 gap-4">
						<div>
							<dt className="text-sm">已完成任务</dt>
							<dd className="text-2xl font-semibold">12</dd>
						</div>
						<div>
							<dt className="text-sm">待办任务</dt>
							<dd className="text-2xl font-semibold">4</dd>
						</div>
					</dl>
					<p>下一步：整理验收记录，补齐项目说明。</p>
				</section>
			</UpgradePaywall>
			<button
				type="button"
				onClick={() => {
					setOpen((current) => !current);
					setResult(open ? "已关闭升级提示。" : "已重新打开升级提示。");
				}}
				className="rounded-lg border border-border px-3 py-2"
			>
				{open ? "关闭演示提示" : "重新打开提示"}
			</button>
			<p role="status">{result}</p>
		</div>
	);
}
