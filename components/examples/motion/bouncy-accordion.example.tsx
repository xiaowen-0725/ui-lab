"use client";

import { useState } from "react";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";

const QUESTIONS = [
	{
		id: "save",
		title: "如何保存草稿？",
		description: "填写内容后选择保存。本示例仅展示说明，不连接业务服务。",
	},
	{
		id: "edit",
		title: "如何继续编辑？",
		description: "从草稿列表选择记录，修改后再次保存。",
	},
	{
		id: "review",
		title: "提交前需要检查什么？",
		description: "检查标题、正文与附件内容是否完整。",
	},
];

export function BouncyAccordionExample() {
	const [value, setValue] = useState<string | null>("save");

	return (
		<div className="space-y-3">
			<h2 className="font-medium">草稿常见问题</h2>
			<BouncyAccordion
				items={QUESTIONS}
				value={value}
				onValueChange={setValue}
				collapsible
			/>
			<p role="status">
				{value
					? `正在查看：${QUESTIONS.find((item) => item.id === value)?.title}`
					: "所有问题已收起。"}
			</p>
		</div>
	);
}
