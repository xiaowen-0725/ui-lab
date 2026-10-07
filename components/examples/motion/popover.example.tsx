"use client";

import { useId, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/motion/popover";

export function PopoverExample() {
	const checkboxId = useId();
	const [open, setOpen] = useState(false);
	const [notify, setNotify] = useState(true);
	const [result, setResult] = useState("尚未应用通知偏好。");

	return (
		<div className="min-h-64 space-y-4 p-4">
			<Popover open={open} onOpenChange={setOpen} align="start">
				<PopoverTrigger>
					<button
						type="button"
						className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
					>
						通知偏好
					</button>
				</PopoverTrigger>
				<PopoverContent aria-label="任务提醒" className="w-64 p-4">
					<form
						className="space-y-3"
						onSubmit={(event) => {
							event.preventDefault();
							setResult(
								`本地通知偏好：${notify ? "接收任务提醒" : "暂停任务提醒"}。`,
							);
							setOpen(false);
						}}
					>
						<h3 className="font-medium">任务提醒</h3>
						<label
							htmlFor={checkboxId}
							className="flex items-center gap-2 text-sm"
						>
							<input
								id={checkboxId}
								type="checkbox"
								checked={notify}
								onChange={(event) => setNotify(event.target.checked)}
							/>
							接收任务提醒
						</label>
						<div className="flex gap-2">
							<button
								type="submit"
								className="rounded-lg bg-primary px-3 py-2 text-primary-foreground"
							>
								应用
							</button>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="rounded-lg border border-border px-3 py-2"
							>
								关闭
							</button>
						</div>
					</form>
				</PopoverContent>
			</Popover>
			<p role="status">{result}</p>
			<p className="text-sm text-muted-foreground">
				浮层{open ? "已打开" : "已关闭"}；偏好仅用于当前演示。
			</p>
		</div>
	);
}
