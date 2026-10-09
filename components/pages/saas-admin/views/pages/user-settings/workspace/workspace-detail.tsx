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
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/workspace/workspace-detail.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useEffect, useRef, useState } from "react";

// Third-party Imports
import { ImageIcon, TrashIcon, UploadCloudIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const WorkspaceDetail = () => {
	const submission = useAdminSubmit("settings.workspace-detail");

	const { t, settings, settingsDraftChanged } = useSaasAdmin();
	const saved = settings["settings.workspace-detail"] ?? {};

	const inputRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | null>(() =>
		typeof File !== "undefined" && saved.logo instanceof File
			? saved.logo
			: null,
	);
	const [preview, setPreview] = useState<string | null>(null);

	useEffect(() => {
		if (!file) {
			const t = window.setTimeout(() => setPreview(null), 0);

			return () => clearTimeout(t);
		}

		const url = URL.createObjectURL(file);

		const t = window.setTimeout(() => setPreview(url), 0);

		return () => {
			clearTimeout(t);
			URL.revokeObjectURL(url);
		};
	}, [file]);

	const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];

		if (!f) return;

		if (!f.type.startsWith("image/")) {
			window.alert(t("Please select an image file"));
			e.currentTarget.value = "";

			return;
		}

		if (f.size > 1024 * 1024) {
			window.alert(t("File must be smaller than 1MB"));
			e.currentTarget.value = "";

			return;
		}

		setFile(f);
	};

	const openPicker = () => inputRef.current?.click();

	const remove = () => {
		settingsDraftChanged?.("settings.workspace-detail");
		setFile(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<div data-admin-action="settings.workspace-detail">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
				{/* Workspace Detail */}
				<div className="flex flex-col space-y-1">
					<h2 className="text-base font-semibold">
						<SaasAdminText>{"Workspace Detail"}</SaasAdminText>
					</h2>
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Manage your workspace details and settings."}
						</SaasAdminText>
					</p>
				</div>
				{/* Content */}
				<form
					className="space-y-6 lg:col-span-2"
					onSubmit={(event) => {
						event.preventDefault();
						void submission.run({
							...Object.fromEntries(new FormData(event.currentTarget)),
							logo: file,
						});
					}}
					aria-busy={submission.pending}
				>
					{/* Workspace logo */}
					<div className="w-full space-y-2">
						<Label>
							<SaasAdminText>{"Workspace Logo"}</SaasAdminText>
						</Label>
						<div className="flex items-center gap-4">
							<button
								type="button"
								tabIndex={0}
								aria-label={t("Upload workspace logo")}
								onClick={openPicker}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										openPicker();
									}
								}}
								className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95"
							>
								{preview ? (
									<img
										width={80}
										height={80}
										src={preview}
										alt={t("logo preview")}
										className="h-full w-full object-cover"
									/>
								) : (
									<ImageIcon />
								)}
							</button>

							<div className="flex items-center gap-2">
								<input
									ref={inputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={onSelect}
								/>
								<Button
									type="button"
									variant="outline"
									onClick={openPicker}
									className="flex items-center gap-2"
								>
									<UploadCloudIcon />
									<SaasAdminText>{"Upload logo"}</SaasAdminText>
								</Button>
								<Button
									type="button"
									variant="ghost"
									onClick={remove}
									disabled={!file}
									aria-label={t("Remove logo")}
									className="text-destructive"
								>
									<TrashIcon />
								</Button>
							</div>
						</div>
						<p className="text-muted-foreground text-sm">
							<SaasAdminText>{"Pick a photo up to 1MB."}</SaasAdminText>
						</p>
					</div>
					{/* Workspace URl */}
					<div className="w-full space-y-2">
						<Label htmlFor="workspace-url">
							<SaasAdminText>{"Workspace URL"}</SaasAdminText>
						</Label>
						<InputGroup>
							<InputGroupAddon className="text-foreground font-normal">
								<SaasAdminText>{"https://example.com/"}</SaasAdminText>
							</InputGroupAddon>
							<InputGroupInput
								id="workspace-url"
								placeholder={t("shadcnstudio")}
								name="workspace-url"
								defaultValue={
									typeof saved["workspace-url"] === "string"
										? saved["workspace-url"]
										: ""
								}
							/>
							<InputGroupAddon
								align="inline-end"
								className="text-foreground font-normal"
							>
								<SaasAdminText>{".com"}</SaasAdminText>
							</InputGroupAddon>
						</InputGroup>
					</div>
					{/* Workspace slug */}
					<div className="w-full space-y-2">
						<Label htmlFor="workspace-slug">
							<SaasAdminText>{"Workspace Slug"}</SaasAdminText>
						</Label>
						<Input
							id="workspace-slug"
							type="text"
							placeholder={t("shadcn-studio")}
							name="workspace-slug"
							defaultValue={
								typeof saved["workspace-slug"] === "string"
									? saved["workspace-slug"]
									: ""
							}
						/>
						<p className="text-muted-foreground text-xs">
							<SaasAdminText>
								{
									"Only lowercase letters, numbers, and hyphens. Max 48 Characters"
								}
							</SaasAdminText>
						</p>
					</div>
					{/* Workspace Description */}
					<div className="w-full space-y-2">
						<Label htmlFor="workspace-description">
							<SaasAdminText>{"Workspace Description"}</SaasAdminText>
						</Label>
						<Textarea
							placeholder={t("Type your feedback here")}
							id="workspace-description"
							name="workspace-description"
							defaultValue={
								typeof saved["workspace-description"] === "string"
									? saved["workspace-description"]
									: ""
							}
						/>
					</div>
					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={submission.pending}
							className="max-sm:w-full"
						>
							<SaasAdminText>{"Save Changes"}</SaasAdminText>
						</Button>
					</div>
					<AdminSubmitFeedback {...submission} error={t(submission.error)} />
				</form>
			</div>
		</div>
	);
};

export { WorkspaceDetail };
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
