"use client";

import { useState } from "react";
import {
	MorphPopover,
	MorphPopoverContent,
	MorphPopoverTrigger,
} from "@/components/motion/popover-morph";

export function PopoverMorphExample() {
	const [open, setOpen] = useState(false);
	const [result, setResult] = useState("请选择本地文档操作。");

	return (
		<div className="min-h-64 space-y-4 p-4">
			<MorphPopover open={open} onOpenChange={setOpen}>
				<MorphPopoverTrigger>
					<button
						type="button"
						className="rounded-lg border border-border px-4 py-2"
					>
						文档操作
					</button>
				</MorphPopoverTrigger>
				<MorphPopoverContent align="start" className="w-52 p-2">
					<fieldset className="space-y-1">
						<legend className="sr-only">文档操作</legend>
						{["复制为本地草稿", "标记为已读"].map((label) => (
							<button
								key={label}
								type="button"
								onClick={() => {
									setResult(`本地演示已执行：${label}。`);
									setOpen(false);
								}}
								className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
							>
								{label}
							</button>
						))}
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
						>
							取消
						</button>
					</fieldset>
				</MorphPopoverContent>
			</MorphPopover>
			<p role="status">{result}</p>
			<p className="text-sm text-muted-foreground">
				操作浮层{open ? "已展开" : "已收起"}。
			</p>
		</div>
	);
}
