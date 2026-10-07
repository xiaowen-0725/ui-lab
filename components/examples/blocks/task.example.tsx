"use client";

import { useState } from "react";
import {
	Task,
	TaskContent,
	TaskItem,
	TaskItemFile,
	TaskTrigger,
} from "@/components/agents/task";

export function TaskExample() {
	const [open, setOpen] = useState(true);
	const [reviewed, setReviewed] = useState(false);

	return (
		<div className="space-y-3 rounded-xl border border-border p-4">
			<Task open={open} onOpenChange={setOpen}>
				<TaskTrigger title="校对文档草稿 · 2 个步骤" />
				<TaskContent>
					<TaskItem>
						1. 检查标题与段落：<TaskItemFile>会议纪要.md</TaskItemFile>
					</TaskItem>
					<TaskItem>
						2. 确认负责人和下一步：<TaskItemFile>实施计划.md</TaskItemFile>
					</TaskItem>
					<TaskItem>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={reviewed}
								onChange={(event) => setReviewed(event.target.checked)}
							/>
							我已完成本地校对演示
						</label>
					</TaskItem>
				</TaskContent>
			</Task>
			<p role="status">
				任务详情{open ? "已展开" : "已收起"}；校对
				{reviewed ? "已标记完成" : "尚未完成"}。
			</p>
		</div>
	);
}
