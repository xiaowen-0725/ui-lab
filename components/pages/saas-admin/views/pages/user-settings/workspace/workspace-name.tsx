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
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/workspace/workspace-name.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useEffect, useId, useMemo, useState } from "react";

// Third-party Imports
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const TIMEZONES = Intl.supportedValuesOf("timeZone");
const WorkspaceName = () => {
	const submission = useAdminSubmit("settings.workspace-name");

	const { t, settings, settingsDraftChanged } = useSaasAdmin();
	const saved = settings["settings.workspace-name"] ?? {};

	const id = useId();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string>(
		typeof saved.timezone === "string" ? saved.timezone : "Indian/Cocos",
	);

	// Fetch supported timezones
	const [referenceDate, setReferenceDate] = useState<Date | null>(null);
	useEffect(() => {
		setReferenceDate(new Date());
	}, []);
	const timezones = TIMEZONES;

	const formattedTimezones = useMemo(() => {
		return timezones
			.map((timezone) => {
				if (!referenceDate)
					return {
						value: timezone,
						label: timezone.replace(/_/g, " "),
						numericOffset: 0,
					};
				const formatter = new Intl.DateTimeFormat("en", {
					timeZone: timezone,
					timeZoneName: "shortOffset",
				});

				const parts = formatter.formatToParts(referenceDate);

				const offset =
					parts.find((part) => part.type === "timeZoneName")?.value || "";

				const formattedOffset = offset === "GMT" ? "GMT+0" : offset;

				return {
					value: timezone,
					label: `(${formattedOffset}) ${timezone.replace(/_/g, " ")}`,
					numericOffset: (() => {
						const match = formattedOffset.match(
							/GMT([+-])(\d{1,2})(?::(\d{2}))?/,
						);
						return match
							? (Number(match[2]) * 60 + Number(match[3] ?? 0)) *
									(match[1] === "-" ? -1 : 1)
							: 0;
					})(),
				};
			})
			.sort((a, b) => a.numericOffset - b.numericOffset); // Sort by numeric offset
	}, [referenceDate]);

	return (
		<div data-admin-action="settings.workspace-name">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
				{/* Workspace Name */}
				<div className="flex flex-col space-y-1">
					<h2 className="text-base font-semibold">
						<SaasAdminText>{"Workspace Name & TimeZone"}</SaasAdminText>
					</h2>
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Manage your workspace name and time zone settings."}
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
							timezone: value,
						});
					}}
					aria-busy={submission.pending}
				>
					{/* Workspace Name */}
					<div className="flex flex-col items-start gap-1">
						<Label htmlFor="workspace-name">
							<SaasAdminText>{"Workspace Name"}</SaasAdminText>
						</Label>
						<Input
							id="workspace-name"
							placeholder={t("Shadcn Studio")}
							defaultValue={
								typeof saved["workspace-name"] === "string"
									? saved["workspace-name"]
									: "Shadcn Studio"
							}
							name="workspace-name"
						/>
					</div>
					{/* Workspace ID */}
					<div className="w-full space-y-2">
						<Label htmlFor="app-id">
							<SaasAdminText>{"App ID"}</SaasAdminText>
						</Label>
						<Input
							id="app-id"
							type="text"
							placeholder={t("App ID")}
							defaultValue={
								typeof saved["app-id"] === "string"
									? saved["app-id"]
									: "0b1c2d3e"
							}
							className="read-only:bg-muted"
							readOnly
							name="app-id"
						/>
					</div>
					{/* Workspace timezone */}
					<div className="w-full space-y-2">
						<Label htmlFor={id}>
							<SaasAdminText>{"Timezone"}</SaasAdminText>
						</Label>
						<Popover
							open={open}
							onOpenChange={(next) => {
								setOpen(next);
								if (
									next &&
									referenceDate?.toISOString().slice(0, 10) !==
										new Date().toISOString().slice(0, 10)
								)
									setReferenceDate(new Date());
							}}
						>
							<PopoverTrigger
								render={
									<Button
										id={id}
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-full justify-between"
									/>
								}
							>
								<span className={cn("truncate")}>
									{value ? (
										formattedTimezones.find(
											(timezone) => timezone.value === value,
										)?.label
									) : (
										<span className="text-muted-foreground">
											<SaasAdminText>{"Select timezone"}</SaasAdminText>
										</span>
									)}
								</span>
								<ChevronsUpDownIcon
									className="text-muted-foreground/80 shrink-0"
									aria-hidden="true"
								/>
							</PopoverTrigger>
							<PopoverContent className="w-(--anchor-width) p-0">
								<Command>
									<CommandInput placeholder={t("Search timezone")} />
									<CommandList>
										<CommandEmpty>
											<SaasAdminText>{"No timezone found."}</SaasAdminText>
										</CommandEmpty>
										<CommandGroup>
											{formattedTimezones.map(({ value: itemValue, label }) => (
												<CommandItem
													style={{
														contentVisibility: "auto",
														containIntrinsicSize: "auto 36px",
													}}
													key={itemValue}
													value={itemValue}
													onSelect={(currentValue) => {
														settingsDraftChanged?.("settings.workspace-name");
														setValue(
															currentValue === value ? "" : currentValue,
														);
														setOpen(false);
													}}
												>
													<span className="flex-1 truncate">
														<SaasAdminText>{label}</SaasAdminText>
													</span>
													{value === itemValue && (
														<CheckIcon className="ml-auto" />
													)}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
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

export { WorkspaceName };
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
