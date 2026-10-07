"use client";

import { useState } from "react";
import {
	SwipeableList,
	type SwipeableListItem,
	type SwipeableListValue,
} from "@/components/motion/swipeable-list";

const INITIAL_ITEMS = [
	{ id: "minutes", title: "会议纪要", description: "待校对的本地草稿" },
	{ id: "plan", title: "项目计划", description: "待整理的本地草稿" },
];

export function SwipeableListExample() {
	const [rows, setRows] = useState(INITIAL_ITEMS);
	const [value, setValue] = useState<SwipeableListValue | null>(null);
	const [result, setResult] = useState(
		"左右滑动或聚焦行后按方向键，显示归档和删除操作。",
	);
	const items: SwipeableListItem[] = rows.map((row) => ({
		...row,
		leftActions: [
			{
				id: "archive",
				label: "归档",
				icon: <span aria-hidden="true">✓</span>,
				tone: "success",
			},
		],
		rightActions: [
			{
				id: "delete",
				label: "删除",
				icon: <span aria-hidden="true">×</span>,
				tone: "danger",
			},
		],
	}));

	return (
		<div className="space-y-3">
			<h2 className="font-medium">本地草稿列表</h2>
			<SwipeableList
				items={items}
				value={value}
				onValueChange={setValue}
				onAction={({ item, action }) => {
					setRows((current) => current.filter((row) => row.id !== item.id));
					setValue(null);
					setResult(
						`${item.title}已在本地${action.id === "archive" ? "归档" : "删除"}。`,
					);
				}}
			/>
			{rows.length === 0 ? <p>草稿列表为空。</p> : null}
			<button
				type="button"
				onClick={() => {
					setRows(INITIAL_ITEMS);
					setValue(null);
					setResult("已恢复两条演示草稿。");
				}}
				className="rounded-lg border border-border px-3 py-2"
			>
				恢复演示草稿
			</button>
			<p role="status">{result}</p>
			<p className="text-sm text-muted-foreground">
				{value
					? `${rows.find((row) => row.id === value.id)?.title}：${value.side === "left" ? "归档" : "删除"}操作已展开。`
					: "所有行操作已收起。"}
			</p>
		</div>
	);
}
