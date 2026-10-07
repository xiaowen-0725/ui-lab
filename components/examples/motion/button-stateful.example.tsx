"use client";

import { useEffect, useState } from "react";
import {
	StatefulButton,
	type ButtonState,
} from "@/components/motion/button/stateful";

export function ButtonStatefulExample() {
	const [state, setState] = useState<ButtonState>("idle");
	const [fail, setFail] = useState(false);

	useEffect(() => {
		if (state !== "loading") return;
		// 本地延时演示，不发送网络请求。
		const timer = setTimeout(() => setState(fail ? "error" : "success"), 700);
		return () => clearTimeout(timer);
	}, [state, fail]);

	return (
		<div className="space-y-3">
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={fail}
					disabled={state === "loading"}
					onChange={(event) => setFail(event.target.checked)}
				/>
				模拟失败（取消勾选后可重试）
			</label>
			<StatefulButton
				state={state}
				loadingText="演示保存中"
				successText="演示保存完成"
				errorText="重试保存"
				onClick={() => setState("loading")}
			>
				保存草稿
			</StatefulButton>
			<p role="status">
				{state === "success"
					? "本地演示完成，未请求后端。"
					: state === "error"
						? "模拟保存失败，请重试。"
						: state === "loading"
							? "正在模拟保存……"
							: "点击体验保存状态。"}
			</p>
		</div>
	);
}
