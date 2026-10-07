"use client";

import { useState } from "react";
import { FileDiff, type FileDiffLine } from "@/components/agents/file-diff";

const LINES: FileDiffLine[] = [
	{
		id: "context",
		type: "context",
		oldLine: 1,
		newLine: 1,
		content: "export const document = {",
	},
	{
		id: "removed",
		type: "removed",
		oldLine: 2,
		content: '  title: "未命名草稿",',
	},
	{
		id: "added",
		type: "added",
		newLine: 2,
		content: '  title: "项目会议纪要",',
	},
	{ id: "end", type: "context", oldLine: 3, newLine: 3, content: "};" },
];
const COPY_TEXT = LINES.map(
	(line) =>
		`${line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}${line.content}`,
).join("\n");

export function FileDiffExample() {
	const [open, setOpen] = useState(true);
	const [copyPreview, setCopyPreview] = useState("");
	const [result, setResult] = useState(
		"静态差异示例，不会修改真实文件。复制按钮会将文本放入下方本地预览。",
	);

	return (
		<div className="space-y-3">
			<FileDiff
				file="draft.ts · 会议纪要标题"
				lines={LINES}
				status="complete"
				collapseOnComplete={false}
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					setResult(next ? "差异详情已展开。" : "差异详情已收起。");
				}}
				onCopy={() => {
					setCopyPreview(COPY_TEXT);
					setResult("差异文本已复制到本地预览区，未写入系统剪贴板。");
				}}
			/>
			<p role="status">{result}</p>
			{copyPreview ? (
				<section aria-label="本地复制预览">
					<pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
						{copyPreview}
					</pre>
				</section>
			) : null}
		</div>
	);
}
