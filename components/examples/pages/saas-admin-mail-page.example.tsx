"use client";
import { useEffect, useState } from "react";
import { SaasAdminMailPage } from "@/components/pages/saas-admin-mail-page";

export function SaasAdminMailPageExample() {
	const [path, setPath] = useState("/apps/mail");
	const [brand, setBrand] = useState<"default" | "blue-ink">("default");
	const [mode, setMode] = useState<"light" | "dark" | "system">("light");
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
		<SaasAdminMailPage
			locale="zh"
			pathname={path.split("?")[0]}
			search={path.split("?")[1] ?? ""}
			onNavigate={setPath}
			brand={brand}
			mode={mode}
			onBrandChange={setBrand}
			onModeChange={setMode}
			documentTheme
		/>
	);
}
