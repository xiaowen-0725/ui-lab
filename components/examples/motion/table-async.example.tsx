"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Table, type TableColumn } from "@/components/motion/table/index";

type RecordRow = { id: string; title: string; status: string };
const PAGE_SIZE = 8;
const PAGE_COUNT = 3;

function createPage(page: number): RecordRow[] {
	return Array.from({ length: PAGE_SIZE }, (_, index) => {
		const number = page * PAGE_SIZE + index + 1;
		return {
			id: `record-${number}`,
			title: `资料整理 ${number}`,
			status: number % 2 ? "待整理" : "已归档",
		};
	});
}

const COLUMNS: TableColumn<RecordRow>[] = [
	{ key: "title", header: "资料" },
	{ key: "status", header: "状态" },
];

export function TableAsyncExample() {
	const [rows, setRows] = useState(() => createPage(0));
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const busy = useRef(false);
	const done = page >= PAGE_COUNT;

	const loadMore = useCallback(() => {
		if (busy.current || page >= PAGE_COUNT) return;
		busy.current = true;
		setLoading(true);
	}, [page]);

	useEffect(() => {
		if (!loading) return;
		// 模拟异步分页，数据来自本文件，不连接业务服务。
		const timer = setTimeout(() => {
			setRows((current) => [...current, ...createPage(page)]);
			setPage((current) => current + 1);
			busy.current = false;
			setLoading(false);
		}, 700);
		return () => clearTimeout(timer);
	}, [loading, page]);

	return (
		<div className="space-y-3">
			<h2 className="font-medium">资料列表 · 本地分页演示</h2>
			<Table
				data={rows}
				columns={COLUMNS}
				getRowId={(row) => row.id}
				height={280}
				loading={loading}
				onEndReached={done ? undefined : loadMore}
				emptyState="暂无资料"
			/>
			<button
				type="button"
				disabled={loading || done}
				onClick={loadMore}
				className="rounded-lg border border-border px-3 py-2 disabled:opacity-50"
			>
				{done ? "已加载全部" : loading ? "模拟加载中……" : "加载下一页"}
			</button>
			<p role="status">
				已加载 {rows.length} 条；
				{loading
					? "正在模拟读取下一页。"
					: done
						? "全部演示资料已加载。"
						: "向下滚动或点击按钮继续加载。"}
			</p>
		</div>
	);
}
