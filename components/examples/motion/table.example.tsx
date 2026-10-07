"use client";

import { useState } from "react";
import {
	Table,
	type SortState,
	type TableColumn,
} from "@/components/motion/table/index";

type Member = { id: string; name: string; team: string; tasks: number };

const MEMBERS: Member[] = [
	{ id: "lin", name: "林晓", team: "设计", tasks: 4 },
	{ id: "chen", name: "陈远", team: "开发", tasks: 7 },
	{ id: "xu", name: "许宁", team: "产品", tasks: 3 },
];

const COLUMNS: TableColumn<Member>[] = [
	{ key: "name", header: "成员", sortable: true },
	{ key: "team", header: "团队", sortable: true },
	{ key: "tasks", header: "待办数", sortable: true, align: "right" },
];

export function TableExample() {
	const [selected, setSelected] = useState<string[]>([]);
	const [sort, setSort] = useState<SortState | null>({
		key: "tasks",
		direction: "desc",
	});
	const [result, setResult] = useState(
		"可选择成员、排序、调整列宽或拖动列顺序。",
	);

	return (
		<div className="space-y-3">
			<h2 className="font-medium">团队待办概览</h2>
			<Table
				data={MEMBERS}
				columns={COLUMNS}
				getRowId={(row) => row.id}
				selectable
				resizable
				reorderable
				selectedRowIds={selected}
				onSelectionChange={setSelected}
				sort={sort}
				onSortChange={setSort}
				onColumnResize={(key, width) =>
					setResult(
						`列 ${COLUMNS.find((column) => column.key === key)?.header} 宽度：${Math.round(width)} 像素`,
					)
				}
				onColumnOrderChange={(keys) =>
					setResult(
						`列顺序：${keys.map((key) => COLUMNS.find((column) => column.key === key)?.header).join("、")}`,
					)
				}
				height={240}
				emptyState="暂无成员"
			/>
			<p role="status">
				已选：
				{selected.length
					? MEMBERS.filter((row) => selected.includes(row.id))
							.map((row) => row.name)
							.join("、")
					: "无"}
				；排序：
				{sort
					? `${COLUMNS.find((column) => column.key === sort.key)?.header}（${sort.direction === "asc" ? "升序" : "降序"}）`
					: "原始顺序"}
			</p>
			<p role="status" className="text-sm text-muted-foreground">
				{result}
			</p>
		</div>
	);
}
