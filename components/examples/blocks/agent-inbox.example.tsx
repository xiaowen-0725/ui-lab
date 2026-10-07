"use client";

import { useState } from "react";
import {
	ActionReceipt,
	AgentInbox,
	InboxItem,
	type InboxStatus,
} from "@/components/motion/agent-inbox/index";

const REQUESTS = [
	{
		id: "summary",
		title: "将周报加入本地草稿",
		description: "演示内容：整理本周进展与下周计划。",
	},
	{
		id: "archive",
		title: "标记旧纪要为已归档",
		description: "只修改当前演示中的状态，不操作真实文件。",
	},
];

export function AgentInboxExample() {
	const [statuses, setStatuses] = useState<Record<string, InboxStatus>>({
		summary: "pending",
		archive: "pending",
	});
	const [result, setResult] = useState(
		"请选择批准或拒绝；不会执行真实业务动作。",
	);
	const pending = REQUESTS.filter(
		(request) => statuses[request.id] === "pending",
	).length;

	const resolve = (id: string, status: InboxStatus) => {
		setStatuses((current) => ({ ...current, [id]: status }));
		setResult(
			`${REQUESTS.find((request) => request.id === id)?.title}：${status === "approved" ? "本地批准" : "本地拒绝"}。`,
		);
	};

	return (
		<div className="space-y-3">
			<AgentInbox
				title="待确认的演示请求"
				count={pending}
				action={
					<button
						type="button"
						onClick={() => {
							setStatuses({ summary: "pending", archive: "pending" });
							setResult("已重置演示审批队列。");
						}}
						className="text-sm"
					>
						重置
					</button>
				}
			>
				{REQUESTS.map((request) => (
					<InboxItem
						key={request.id}
						source="文档整理助手 · 本地演示"
						title={request.title}
						description={request.description}
						risk="low"
						status={statuses[request.id]}
						approveLabel="批准"
						denyLabel="拒绝"
						onApprove={() => resolve(request.id, "approved")}
						onDeny={() => resolve(request.id, "denied")}
						resolution={
							statuses[request.id] === "approved" ? (
								<ActionReceipt
									title="本地批准记录"
									scope={request.title}
									onUndo={() => {
										setStatuses((current) => ({
											...current,
											[request.id]: "pending",
										}));
										setResult("批准记录已撤销，请重新确认。");
									}}
									undoLabel="撤销批准"
								/>
							) : (
								"已在本地拒绝"
							)
						}
					>
						<p className="text-sm text-muted-foreground">
							此请求只演示审批状态，不连接助手运行时或后端。
						</p>
					</InboxItem>
				))}
			</AgentInbox>
			<p role="status">{result}</p>
		</div>
	);
}
