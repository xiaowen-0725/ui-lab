"use client";
import { useEffect, useState } from "react";
import { SaasAdminOrdersPage } from "@/components/pages/saas-admin-orders-page";

/** This consumer owns document preferences, routing and the local demo service. */
export function SaasAdminOrdersPageExample() {
	const [path, setPath] = useState("/dashboard/orders");
	const [brand, setBrand] = useState<"default" | "blue-ink">("default");
	const [mode, setMode] = useState<"light" | "dark" | "system">("light");
	const [action, setAction] = useState("");
	useEffect(() => {
		const root = document.documentElement;
		const oldBrand = root.dataset.saasAdminBrand;
		const oldDark = root.classList.contains("dark");
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const apply = () => {
			root.dataset.saasAdminBrand = brand;
			root.classList.toggle(
				"dark",
				mode === "dark" || (mode === "system" && media.matches),
			);
		};
		apply();
		media.addEventListener("change", apply);
		return () => {
			if (oldBrand === undefined) delete root.dataset.saasAdminBrand;
			else root.dataset.saasAdminBrand = oldBrand;
			root.classList.toggle("dark", oldDark);
			media.removeEventListener("change", apply);
		};
	}, [brand, mode]);
	return (
		<div>
			<SaasAdminOrdersPage
				locale="zh"
				pathname={path.split("?")[0]}
				search={path.split("?")[1] ?? ""}
				onNavigate={setPath}
				brand={brand}
				mode={mode}
				onBrandChange={setBrand}
				onModeChange={setMode}
				documentTheme
				onSubmit={async (event) => {
					await new Promise<void>((resolve) => setTimeout(resolve, 250));
					if (
						Object.entries(event.values).some(
							([key, value]) =>
								/email/i.test(key) && String(value).startsWith("fail@"),
						)
					)
						throw new Error("请修改邮箱后重试");
					setAction(event.type);
				}}
			/>
			<p role="status">
				{action
					? `本地演示：${action}`
					: "提交使用本地回调；fail@ 邮箱演示失败与重试。"}
			</p>
		</div>
	);
}
