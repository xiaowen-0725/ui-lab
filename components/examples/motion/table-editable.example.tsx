"use client";

import { useRef, useState } from "react";
import { Table, type TableColumn } from "@/components/motion/table/index";

type DraftRow = { id: string; title: string; owner: string };

const INITIAL_ROWS: DraftRow[] = [
	{ id: "draft-1", title: "整理会议纪要", owner: "林晓" },
	{ id: "draft-2", title: "校对使用说明", owner: "陈远" },
];

export function TableEditableExample() {
	const [rows, setRows] = useState(INITIAL_ROWS);
	const [labels, setLabels] = useState({ title: "任务", owner: "负责人" });
	const [result, setResult] = useState(
		"直接编辑单元格；行菜单可插入或删除任务，列标题也可编辑。",
	);
	const nextId = useRef(3);
	const columns: TableColumn<DraftRow>[] = [
		{ key: "title", header: labels.title, editable: true },
		{ key: "owner", header: labels.owner, editable: true },
	];

	const addRow = (index: number) => {
		const row: DraftRow = {
			id: `draft-${nextId.current++}`,
			title: "新任务",
			owner: "待分配",
		};
		setRows((current) => [
			...current.slice(0, index),
			row,
			...current.slice(index),
		]);
		setResult("已在本地插入新任务。");
	};

	return (
		<div className="space-y-3">
			<h2 className="font-medium">可编辑任务草稿</h2>
			<Table
				data={rows}
				columns={columns}
				getRowId={(row) => row.id}
				height={280}
				onCellEdit={(id, key, value) => {
					if (key !== "title" && key !== "owner") return;
					setRows((current) =>
						current.map((row) =>
							row.id === id ? { ...row, [key]: value } : row,
						),
					);
					setResult(`已在本地更新${labels[key]}：${value}`);
				}}
				onColumnRename={(key, value) => {
					if (key !== "title" && key !== "owner") return;
					setLabels((current) => ({ ...current, [key]: value }));
					setResult(`列标题已改为：${value}`);
				}}
				onInsertRow={(index, position) =>
					addRow(position === "after" ? index + 1 : index)
				}
				onDeleteRow={(id) => {
					setRows((current) => current.filter((row) => row.id !== id));
					setResult("已从本地草稿删除任务。");
				}}
				emptyState="暂无任务，点击下方按钮添加。"
			/>
			<button
				type="button"
				className="rounded-lg border border-border px-3 py-2"
				onClick={() => addRow(rows.length)}
			>
				添加任务
			</button>
			<p role="status">{result}</p>
			<p className="text-sm text-muted-foreground">
				当前 {rows.length} 条任务，所有编辑仅保存在本次演示中。
			</p>
		</div>
	);
}
