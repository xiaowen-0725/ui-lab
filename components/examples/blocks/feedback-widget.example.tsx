"use client";

import { useRef, useState } from "react";
import { FeedbackWidget } from "@/components/motion/feedback-widget";

export function FeedbackWidgetExample() {
	const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);
	const nextId = useRef(1);

	return (
		<section className="relative min-h-96 rounded-xl border border-border p-4">
			<h2 className="font-medium">本地反馈演示</h2>
			<p className="mt-2 text-sm text-muted-foreground">
				点击右下角反馈按钮并填写建议。提交只会把文本加入此列表。
			</p>
			<div className="mt-4 space-y-2 pr-12" role="status">
				{messages.length ? (
					<>
						<p>已记录 {messages.length} 条本地反馈：</p>
						<ol className="list-inside list-decimal space-y-1 break-words">
							{messages.map((message) => (
								<li key={message.id}>{message.text}</li>
							))}
						</ol>
					</>
				) : (
					<p>尚未记录反馈。</p>
				)}
			</div>
			<FeedbackWidget
				title="留下你的使用建议"
				placeholder="例如：希望筛选条件更清晰"
				onSubmit={({ message }) => {
					const entry = { id: nextId.current++, text: message.trim() };
					setMessages((current) => [...current, entry]);
				}}
			/>
		</section>
	);
}
