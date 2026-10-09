"use client";

// Source: Free AdminCN ModeToggle, MIT, dd1afd2f3a794ea9e746197de314f81d43670ea1.
// Approved adaptation: official menu composition for brand and light/dark/system.
import { MoonStarIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useSaasAdmin,
	type SaasAdminBrand,
	type SaasAdminMode,
} from "../../environment";

export function ModeToggle() {
	const { brand, mode, setBrand, setMode, t } = useSaasAdmin();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="relative"
						aria-label={t("Appearance")}
					/>
				}
			>
				<MoonStarIcon className="scale-100 dark:scale-0" />
				<SunIcon className="absolute scale-0 dark:scale-100" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("Brand")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={brand}
						onValueChange={(value) => setBrand(value as SaasAdminBrand)}
					>
						<DropdownMenuRadioItem value="default">
							{t("Default")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="blue-ink">
							Blue Ink
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>{t("Theme")}</DropdownMenuLabel>
					<DropdownMenuRadioGroup
						value={mode}
						onValueChange={(value) => setMode(value as SaasAdminMode)}
					>
						<DropdownMenuRadioItem value="light">
							{t("Light")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="dark">
							{t("Dark")}
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="system">
							{t("System")}
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

/*
MIT License

Copyright (c) 2026 shadcn/studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
