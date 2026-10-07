"use client";

import { useId, useState } from "react";
import { Button } from "@/components/motion/button/base";

export function ButtonBaseExample() {
	const titleId = useId();
	const [title, setTitle] = useState("整理组件使用说明");
	const [result, setResult] = useState("填写标题后创建本地任务。");

	return (
		<form
			className="space-y-3"
			onSubmit={(event) => {
				event.preventDefault();
				if (title.trim()) setResult(`已创建本地演示任务：${title.trim()}`);
			}}
		>
			<label htmlFor={titleId} className="block text-sm">
				任务标题
			</label>
			<input
				id={titleId}
				required
				value={title}
				onChange={(event) => setTitle(event.target.value)}
				className="w-full rounded-lg border border-border bg-background p-2"
			/>
			<Button type="submit" disabled={!title.trim()} ripple>
				创建任务
			</Button>
			<p role="status">{result}</p>
		</form>
	);
}
