// biome-ignore-all lint/suspicious/noArrayIndexKey: Append-only URL fields retain their original positions across edits.
"use client";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/general/social-url.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useState } from "react";

// Third-party Imports
import { PlusIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SocialUrl = () => {
	const submission = useAdminSubmit("settings.social-url");

	const { t, settingsDraftChanged } = useSaasAdmin();

	const { settings } = useSaasAdmin();
	const saved = settings["settings.social-url"] ?? {};
	const [urls, setUrls] = useState<string[]>(() =>
		Array.isArray(saved.urls)
			? saved.urls.filter((url): url is string => typeof url === "string")
			: ["", "", ""],
	);

	const addUrl = () => {
		settingsDraftChanged?.("settings.social-url");
		setUrls((prev) => [...prev, ""]);
	};

	const updateUrl = (index: number, value: string) =>
		setUrls((prev) => prev.map((u, i) => (i === index ? value : u)));

	return (
		<div
			data-admin-action="settings.social-url"
			className="grid grid-cols-1 gap-10 lg:grid-cols-3"
		>
			{/* Vertical Tabs List */}
			<div className="flex flex-col">
				<h2 className="text-base font-semibold">
					<SaasAdminText>{"Social URLs"}</SaasAdminText>
				</h2>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>{"Manage your social URLs."}</SaasAdminText>
				</p>
			</div>

			{/* Content */}
			<div className="space-y-6 lg:col-span-2">
				<div className="space-y-4">
					{urls.map((url, idx) => (
						<Input
							key={idx}
							type="url"
							aria-label={`${t("Social URL")} ${idx + 1}`}
							name={`social-url-${idx + 1}`}
							autoComplete="off"
							spellCheck={false}
							placeholder={t("Link to social profile")}
							value={url}
							onChange={(e) => updateUrl(idx, e.target.value)}
						/>
					))}
				</div>
				<div className="flex items-center justify-between gap-4">
					<Button type="button" variant="outline" onClick={addUrl}>
						<PlusIcon className="size-4" />
						<SaasAdminText>{"Add URL"}</SaasAdminText>
					</Button>
					<Button
						type="button"
						disabled={submission.pending}
						onClick={() => void submission.run({ urls })}
					>
						<SaasAdminText>{"Save Changes"}</SaasAdminText>
					</Button>
				</div>
				<AdminSubmitFeedback {...submission} />
			</div>
		</div>
	);
};

export { SocialUrl };
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
