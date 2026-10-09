"use client";

// Source: Free AdminCN LanguageDropdown, MIT, dd1afd2f3a794ea9e746197de314f81d43670ea1.
// Approved adaptation: Chinese/English content controlled by the consumer.
import type { ReactElement } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSaasAdmin, type SaasAdminLocale } from "../../environment";

export function LanguageDropdown({
	trigger,
	defaultOpen,
	align = "end",
}: {
	trigger: ReactElement;
	defaultOpen?: boolean;
	align?: "start" | "center" | "end";
}) {
	const { locale, setLocale } = useSaasAdmin();
	return (
		<DropdownMenu defaultOpen={defaultOpen}>
			<DropdownMenuTrigger render={trigger} />
			<DropdownMenuContent className="w-50" align={align}>
				<DropdownMenuRadioGroup
					value={locale}
					onValueChange={(value) => setLocale(value as SaasAdminLocale)}
				>
					<DropdownMenuRadioItem value="zh">中文</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
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
