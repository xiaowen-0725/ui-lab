"use client";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	imageImagesFlagsChinaWebp,
	imageImagesFlagsIndiaWebp,
	imageImagesFlagsIraqWebp,
	imageImagesFlagsKoreaWebp,
	imageImagesFlagsMayotteWebp,
	imageImagesFlagsMonacoWebp,
	imageImagesFlagsRomaniaWebp,
	imageImagesFlagsSerbiaWebp,
	imageImagesFlagsSyriaWebp,
	imageImagesFlagsZimbabweWebp,
} from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/general/personal-info.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useEffect, useId, useRef, useState } from "react";

// Third-party Imports
import { ImageIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const countries = [
	{
		value: "india",
		label: "India",
		flag: imageImagesFlagsIndiaWebp,
	},
	{
		value: "china",
		label: "China",
		flag: imageImagesFlagsChinaWebp,
	},
	{
		value: "monaco",
		label: "Monaco",
		flag: imageImagesFlagsMonacoWebp,
	},
	{
		value: "serbia",
		label: "Serbia",
		flag: imageImagesFlagsSerbiaWebp,
	},
	{
		value: "romania",
		label: "Romania",
		flag: imageImagesFlagsRomaniaWebp,
	},
	{
		value: "mayotte",
		label: "Mayotte",
		flag: imageImagesFlagsMayotteWebp,
	},
	{
		value: "iraq",
		label: "Iraq",
		flag: imageImagesFlagsIraqWebp,
	},
	{
		value: "syria",
		label: "Syria",
		flag: imageImagesFlagsSyriaWebp,
	},
	{
		value: "korea",
		label: "Korea",
		flag: imageImagesFlagsKoreaWebp,
	},
	{
		value: "zimbabwe",
		label: "Zimbabwe",
		flag: imageImagesFlagsZimbabweWebp,
	},
];

const PersonalInfo = () => {
	const submission = useAdminSubmit("settings.personal-info");

	const { t, settings, settingsDraftChanged } = useSaasAdmin();
	const saved = settings["settings.personal-info"] ?? {};

	const formId = useId();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | null>(() =>
		typeof File !== "undefined" && saved.avatar instanceof File
			? saved.avatar
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
		settingsDraftChanged?.("settings.personal-info");
		setFile(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<div
			data-admin-action="settings.personal-info"
			className="grid grid-cols-1 gap-10 lg:grid-cols-3"
		>
			{/* Vertical Tabs List */}
			<div className="flex flex-col space-y-1">
				<h2 className="text-base font-semibold">
					<SaasAdminText>{"Personal Information"}</SaasAdminText>
				</h2>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>
						{"Manage your personal information and role."}
					</SaasAdminText>
				</p>
			</div>

			{/* Content */}
			<div className="space-y-6 lg:col-span-2">
				<form
					id={formId}
					onSubmit={(event) => {
						event.preventDefault();
						void submission.run({
							...Object.fromEntries(new FormData(event.currentTarget)),
							avatar: file,
						});
					}}
					aria-busy={submission.pending}
					className="mx-auto"
				>
					<div className="mb-6 w-full space-y-2">
						<Label>
							<SaasAdminText>{"Your Avatar"}</SaasAdminText>
						</Label>
						<div className="flex items-center gap-4">
							<button
								type="button"
								tabIndex={0}
								aria-label={t("Upload your avatar")}
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
										alt={t("avatar preview")}
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
									<SaasAdminText>{"Upload avatar"}</SaasAdminText>
								</Button>
								<Button
									type="button"
									variant="ghost"
									onClick={remove}
									disabled={!file}
									aria-label={t("Remove avatar")}
									className="text-destructive!"
								>
									<Trash2Icon />
								</Button>
							</div>
						</div>
						<p className="text-muted-foreground text-sm">
							<SaasAdminText>{"Pick a photo up to 1MB."}</SaasAdminText>
						</p>
					</div>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div className="flex flex-col items-start gap-2">
							<Label htmlFor="multi-step-personal-info-first-name">
								<SaasAdminText>{"First Name"}</SaasAdminText>
							</Label>
							<Input
								id="multi-step-personal-info-first-name"
								placeholder={t("John")}
								name="multi-step-personal-info-first-name"
								defaultValue={
									typeof saved["multi-step-personal-info-first-name"] ===
									"string"
										? saved["multi-step-personal-info-first-name"]
										: ""
								}
							/>
						</div>
						<div className="flex flex-col items-start gap-2">
							<Label htmlFor="multi-step-personal-info-last-name">
								<SaasAdminText>{"Last Name"}</SaasAdminText>
							</Label>
							<Input
								id="multi-step-personal-info-last-name"
								placeholder={t("Doe")}
								name="multi-step-personal-info-last-name"
								defaultValue={
									typeof saved["multi-step-personal-info-last-name"] ===
									"string"
										? saved["multi-step-personal-info-last-name"]
										: ""
								}
							/>
						</div>
						<div className="flex flex-col items-start gap-2">
							<Label htmlFor="multi-step-personal-info-mobile">
								<SaasAdminText>{"Mobile"}</SaasAdminText>
							</Label>
							<Input
								id="multi-step-personal-info-mobile"
								type="tel"
								placeholder={t("+1 (555) 123-4567")}
								name="multi-step-personal-info-mobile"
								defaultValue={
									typeof saved["multi-step-personal-info-mobile"] === "string"
										? saved["multi-step-personal-info-mobile"]
										: ""
								}
							/>
						</div>
						<div className="flex flex-col items-start gap-2">
							<Label htmlFor="country">
								<SaasAdminText>{"Country"}</SaasAdminText>
							</Label>
							<Select
								defaultValue={
									typeof saved["country"] === "string"
										? (saved["country"] as string)
										: undefined
								}
								name="country"
								required
								items={countries}
							>
								<SelectTrigger id="country" className="w-full">
									<SelectValue placeholder={t("Select Country")}>
										{(value: string) => {
											const country = countries.find((c) => c.value === value);

											return country ? (
												<span className="flex items-center gap-2">
													<img
														width={20}
														height={16}
														src={country.flag}
														alt={t("{country} flag").replace(
															"{country}",
															t(country.label),
														)}
														className="h-4 w-5 shrink-0"
													/>
													<span className="truncate">
														<SaasAdminText>{country.label}</SaasAdminText>
													</span>
												</span>
											) : (
												<span>
													<SaasAdminText>{"Select Country"}</SaasAdminText>
												</span>
											);
										}}
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="max-h-100">
									<SelectGroup>
										{countries.map((country) => (
											<SelectItem key={country.value} value={country.value}>
												<img
													width={20}
													height={16}
													src={country.flag}
													alt={t("{country} flag").replace(
														"{country}",
														t(country.label),
													)}
													className="h-4 w-5"
												/>
												<SaasAdminText> </SaasAdminText>
												<span className="truncate">
													<SaasAdminText>{country.label}</SaasAdminText>
												</span>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="gender">
								<SaasAdminText>{"Gender"}</SaasAdminText>
							</Label>
							<Select
								defaultValue={
									typeof saved["gender"] === "string"
										? (saved["gender"] as string)
										: undefined
								}
								name="gender"
							>
								<SelectTrigger id="gender" className="w-full">
									<SelectValue placeholder={t("Select a gender")} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="male">
											<SaasAdminText>{"Male"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="female">
											<SaasAdminText>{"Female"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="other">
											<SaasAdminText>{"Other"}</SaasAdminText>
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="role">
								<SaasAdminText>{"Role"}</SaasAdminText>
							</Label>
							<Select
								defaultValue={
									typeof saved["role"] === "string"
										? (saved["role"] as string)
										: undefined
								}
								name="role"
							>
								<SelectTrigger id="role" className="w-full">
									<SelectValue placeholder={t("Select a role")} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="admin">
											<SaasAdminText>{"Admin"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="user">
											<SaasAdminText>{"User"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="other">
											<SaasAdminText>{"Other"}</SaasAdminText>
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<AdminSubmitFeedback {...submission} error={t(submission.error)} />
				</form>
				<div className="flex justify-end">
					<Button
						type="submit"
						form={formId}
						disabled={submission.pending}
						className="max-sm:w-full"
					>
						<SaasAdminText>{"Save Changes"}</SaasAdminText>
					</Button>
				</div>
			</div>
		</div>
	);
};

export { PersonalInfo };
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
