"use client";

import { useState } from "react";
import {
	SettingsColorField,
	SettingsGhostButton,
	SettingsGroup,
	SettingsRow,
	SettingsSelectButton,
	SettingsTextField,
} from "@/components/motion/settings-panel/index";

export function SettingsPanelExample() {
	const [name, setName] = useState("我的工作区");
	const [color, setColor] = useState("#2563EB");
	const [notify, setNotify] = useState(true);
	const [presetsOpen, setPresetsOpen] = useState(false);
	const [result, setResult] = useState("偏好只保存在当前演示中。");

	return (
		<div className="space-y-3">
			<SettingsGroup
				title="工作区偏好"
				actions={
					<>
						<SettingsGhostButton
							onClick={() => {
								setName("我的工作区");
								setColor("#2563EB");
								setNotify(true);
								setPresetsOpen(false);
								setResult("已恢复演示默认偏好。");
							}}
						>
							重置
						</SettingsGhostButton>
						<SettingsSelectButton
							aria-label={presetsOpen ? "关闭颜色预设" : "打开颜色预设"}
							onClick={() => setPresetsOpen((current) => !current)}
						>
							颜色预设
						</SettingsSelectButton>
					</>
				}
			>
				<SettingsRow label="工作区名称" description="显示在下方本地预览中">
					<SettingsTextField
						aria-label="工作区名称"
						value={name}
						onChange={(value) => {
							setName(value);
							setResult(`工作区名称已改为：${value}`);
						}}
						placeholder="填写名称"
					/>
				</SettingsRow>
				<SettingsRow
					label="标记颜色"
					description="输入十六进制颜色，回车或失焦应用"
				>
					<SettingsColorField
						aria-label="标记颜色"
						value={color}
						onChange={(value) => {
							setColor(value);
							setResult(`本地标记颜色已改为：${value}`);
						}}
					/>
				</SettingsRow>
				<SettingsRow label="任务提醒" description="本地通知偏好">
					<input
						type="checkbox"
						aria-label="接收任务提醒"
						checked={notify}
						onChange={(event) => {
							setNotify(event.target.checked);
							setResult(
								event.target.checked
									? "已开启本地提醒偏好。"
									: "已关闭本地提醒偏好。",
							);
						}}
					/>
				</SettingsRow>
			</SettingsGroup>
			{presetsOpen ? (
				<fieldset className="flex gap-2">
					<legend className="sr-only">颜色预设</legend>
					{[
						{ label: "蓝色", value: "#2563EB" },
						{ label: "绿色", value: "#047857" },
					].map((preset) => (
						<button
							key={preset.value}
							type="button"
							className="rounded-lg border border-border px-3 py-2"
							onClick={() => {
								setColor(preset.value);
								setPresetsOpen(false);
								setResult(`已应用${preset.label}预设。`);
							}}
						>
							{preset.label}
						</button>
					))}
				</fieldset>
			) : null}
			<div className="flex items-center gap-2 rounded-xl border border-border p-4">
				<span
					aria-hidden="true"
					className="size-3 rounded-full"
					style={{ backgroundColor: color }}
				/>
				<span>
					{name || "未命名工作区"} · {color} · 提醒{notify ? "开启" : "关闭"}
				</span>
			</div>
			<p role="status">{result}</p>
		</div>
	);
}
