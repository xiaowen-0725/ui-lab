"use client";

import { useState } from "react";
import {
	ExpandableButton,
	ExpandableChip,
} from "@/components/motion/expandable-control";

export function ExpandableControlExample() {
	const [expanded, setExpanded] = useState(false);
	const [chipExpanded, setChipExpanded] = useState(false);
	const [complete, setComplete] = useState(false);

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				点击图标展开标签，点击任务标签显示完成操作。
			</p>
			<div className="flex flex-wrap items-center gap-3">
				<ExpandableButton
					icon={<span aria-hidden="true">＋</span>}
					label="显示添加任务说明"
					expanded={expanded}
					onExpandedChange={setExpanded}
				/>
				<ExpandableChip
					label={complete ? "纪要已整理" : "整理会议纪要"}
					actionIcon={<span aria-hidden="true">✓</span>}
					actionLabel={complete ? "恢复待办" : "标记完成"}
					expanded={chipExpanded}
					onExpandedChange={setChipExpanded}
					onAction={() => setComplete((current) => !current)}
				/>
			</div>
			{expanded ? (
				<p>在任务列表中填写标题与负责人，即可建立一条新任务。</p>
			) : null}
			<p role="status">
				本地任务状态：{complete ? "已完成" : "待处理"}；操作标签
				{chipExpanded ? "已展开" : "已收起"}。
			</p>
		</div>
	);
}
