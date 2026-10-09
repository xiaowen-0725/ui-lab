"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/forms/form-validation/validation-demos.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Third-party Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

// Component Imports
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// Schema for validation mode demo
const modeSchema = z.object({
	onChange: z
		.string()
		.min(5, "Must be at least 5 characters")
		.max(20, "Must be at most 20 characters"),
	onBlur: z
		.string()
		.min(5, "Must be at least 5 characters")
		.max(20, "Must be at most 20 characters"),
	onSubmit: z
		.string()
		.min(5, "Must be at least 5 characters")
		.max(20, "Must be at most 20 characters"),
	onTouched: z
		.string()
		.min(5, "Must be at least 5 characters")
		.max(20, "Must be at most 20 characters"),
});

type ModeFormValues = z.infer<typeof modeSchema>;

const ValidationModesDemo = () => {
	const { t } = useSaasAdmin();
	const onChangeSubmission = useAdminSubmit("form.validation.onChange");
	const onBlurSubmission = useAdminSubmit("form.validation.onBlur");
	const onSubmitSubmission = useAdminSubmit("form.validation.onSubmit");
	const onTouchedSubmission = useAdminSubmit("form.validation.onTouched");

	// Form with onChange mode
	const onChangeForm = useForm<Pick<ModeFormValues, "onChange">>({
		resolver: zodResolver(z.object({ onChange: modeSchema.shape.onChange })),
		mode: "onChange",
		defaultValues: {
			onChange: "",
		},
	});

	// Form with onBlur mode
	const onBlurForm = useForm<Pick<ModeFormValues, "onBlur">>({
		resolver: zodResolver(z.object({ onBlur: modeSchema.shape.onBlur })),
		mode: "onBlur",
		defaultValues: {
			onBlur: "",
		},
	});

	// Form with onSubmit mode
	const onSubmitForm = useForm<Pick<ModeFormValues, "onSubmit">>({
		resolver: zodResolver(z.object({ onSubmit: modeSchema.shape.onSubmit })),
		mode: "onSubmit",
		defaultValues: {
			onSubmit: "",
		},
	});

	// Form with onTouched mode
	const onTouchedForm = useForm<Pick<ModeFormValues, "onTouched">>({
		resolver: zodResolver(z.object({ onTouched: modeSchema.shape.onTouched })),
		mode: "onTouched",
		defaultValues: {
			onTouched: "",
		},
	});

	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<h2 className="text-lg font-semibold">
					<SaasAdminText>{"Validation Modes Demo"}</SaasAdminText>
				</h2>
				<p className="text-muted-foreground">
					<SaasAdminText>
						{
							"Experience how different validation modes affect user experience. Try typing in each field to see when validation occurs."
						}
					</SaasAdminText>
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				{/* onChange Mode */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							<SaasAdminText>{"onChange Mode"}</SaasAdminText>
						</CardTitle>
						<CardDescription>
							<SaasAdminText>{"Validates on every keystroke"}</SaasAdminText>
						</CardDescription>
					</CardHeader>
					<CardContent className="block">
						<form
							onSubmit={onChangeForm.handleSubmit(async (values) => {
								if (await onChangeSubmission.run(values)) onChangeForm.reset();
							})}
							aria-busy={onChangeSubmission.pending}
							className="space-y-4"
						>
							<Controller
								name="onChange"
								control={onChangeForm.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<SaasAdminText>{"Demo Input"}</SaasAdminText>
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={t("Type here...")}
											disabled={onChangeSubmission.pending}
										/>
										<FieldDescription>
											<SaasAdminText>{"Error appears "}</SaasAdminText>
											<strong>
												<SaasAdminText>{"instantly"}</SaasAdminText>
											</strong>{" "}
											<SaasAdminText>{" as you type"}</SaasAdminText>
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>
												{t(fieldState.error?.message ?? "")}
											</FieldError>
										)}
									</Field>
								)}
							/>
							<div className="flex gap-2">
								<Button
									type="submit"
									size="sm"
									disabled={onChangeSubmission.pending}
								>
									<SaasAdminText>{"Submit"}</SaasAdminText>
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onChangeForm.reset()}
									disabled={onChangeSubmission.pending}
								>
									<SaasAdminText>{"Reset"}</SaasAdminText>
								</Button>
							</div>
							<AdminSubmitFeedback {...onChangeSubmission} />
							{onChangeSubmission.complete && (
								<FieldDescription>
									<SaasAdminText>
										{"Local demo completed. No request was sent to a team."}
									</SaasAdminText>
								</FieldDescription>
							)}
						</form>
					</CardContent>
				</Card>

				{/* onBlur Mode */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							<SaasAdminText>{"onBlur Mode"}</SaasAdminText>
						</CardTitle>
						<CardDescription>
							<SaasAdminText>
								{"Validates when you leave the field"}
							</SaasAdminText>
						</CardDescription>
					</CardHeader>
					<CardContent className="block">
						<form
							onSubmit={onBlurForm.handleSubmit(async (values) => {
								if (await onBlurSubmission.run(values)) onBlurForm.reset();
							})}
							aria-busy={onBlurSubmission.pending}
							className="space-y-4"
						>
							<Controller
								name="onBlur"
								control={onBlurForm.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<SaasAdminText>{"Demo Input"}</SaasAdminText>
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={t("Type here...")}
											disabled={onBlurSubmission.pending}
										/>
										<FieldDescription>
											<SaasAdminText>{"Error appears "}</SaasAdminText>
											<strong>
												<SaasAdminText>{"after"}</SaasAdminText>
											</strong>{" "}
											<SaasAdminText>{" you leave the field"}</SaasAdminText>
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>
												{t(fieldState.error?.message ?? "")}
											</FieldError>
										)}
									</Field>
								)}
							/>
							<div className="flex gap-2">
								<Button
									type="submit"
									size="sm"
									disabled={onBlurSubmission.pending}
								>
									<SaasAdminText>{"Submit"}</SaasAdminText>
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onBlurForm.reset()}
									disabled={onBlurSubmission.pending}
								>
									<SaasAdminText>{"Reset"}</SaasAdminText>
								</Button>
							</div>
							<AdminSubmitFeedback {...onBlurSubmission} />
							{onBlurSubmission.complete && (
								<FieldDescription>
									<SaasAdminText>
										{"Local demo completed. No request was sent to a team."}
									</SaasAdminText>
								</FieldDescription>
							)}
						</form>
					</CardContent>
				</Card>

				{/* onSubmit Mode */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							<SaasAdminText>{"onSubmit Mode (Default)"}</SaasAdminText>
						</CardTitle>
						<CardDescription>
							<SaasAdminText>
								{"Validates only when you click submit"}
							</SaasAdminText>
						</CardDescription>
					</CardHeader>
					<CardContent className="block">
						<form
							onSubmit={onSubmitForm.handleSubmit(async (values) => {
								if (await onSubmitSubmission.run(values)) onSubmitForm.reset();
							})}
							aria-busy={onSubmitSubmission.pending}
							className="space-y-4"
						>
							<Controller
								name="onSubmit"
								control={onSubmitForm.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<SaasAdminText>{"Demo Input"}</SaasAdminText>
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={t("Type here...")}
											disabled={onSubmitSubmission.pending}
										/>
										<FieldDescription>
											<SaasAdminText>{"Error appears "}</SaasAdminText>
											<strong>
												<SaasAdminText>{"only"}</SaasAdminText>
											</strong>{" "}
											<SaasAdminText>{" after clicking submit"}</SaasAdminText>
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>
												{t(fieldState.error?.message ?? "")}
											</FieldError>
										)}
									</Field>
								)}
							/>
							<div className="flex gap-2">
								<Button
									type="submit"
									size="sm"
									disabled={onSubmitSubmission.pending}
								>
									<SaasAdminText>{"Submit"}</SaasAdminText>
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onSubmitForm.reset()}
									disabled={onSubmitSubmission.pending}
								>
									<SaasAdminText>{"Reset"}</SaasAdminText>
								</Button>
							</div>
							<AdminSubmitFeedback {...onSubmitSubmission} />
							{onSubmitSubmission.complete && (
								<FieldDescription>
									<SaasAdminText>
										{"Local demo completed. No request was sent to a team."}
									</SaasAdminText>
								</FieldDescription>
							)}
						</form>
					</CardContent>
				</Card>

				{/* onTouched Mode */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							<SaasAdminText>{"onTouched Mode"}</SaasAdminText>
						</CardTitle>
						<CardDescription>
							<SaasAdminText>
								{"Validates on blur, then on every change"}
							</SaasAdminText>
						</CardDescription>
					</CardHeader>
					<CardContent className="block">
						<form
							onSubmit={onTouchedForm.handleSubmit(async (values) => {
								if (await onTouchedSubmission.run(values))
									onTouchedForm.reset();
							})}
							aria-busy={onTouchedSubmission.pending}
							className="space-y-4"
						>
							<Controller
								name="onTouched"
								control={onTouchedForm.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											<SaasAdminText>{"Demo Input"}</SaasAdminText>
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={t("Type here...")}
											disabled={onTouchedSubmission.pending}
										/>
										<FieldDescription>
											<SaasAdminText>
												{"First validation on blur, then"}
											</SaasAdminText>
											<strong>
												<SaasAdminText>{"real-time"}</SaasAdminText>
											</strong>
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError>
												{t(fieldState.error?.message ?? "")}
											</FieldError>
										)}
									</Field>
								)}
							/>
							<div className="flex gap-2">
								<Button
									type="submit"
									size="sm"
									disabled={onTouchedSubmission.pending}
								>
									<SaasAdminText>{"Submit"}</SaasAdminText>
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onTouchedForm.reset()}
									disabled={onTouchedSubmission.pending}
								>
									<SaasAdminText>{"Reset"}</SaasAdminText>
								</Button>
							</div>
							<AdminSubmitFeedback {...onTouchedSubmission} />
							{onTouchedSubmission.complete && (
								<FieldDescription>
									<SaasAdminText>
										{"Local demo completed. No request was sent to a team."}
									</SaasAdminText>
								</FieldDescription>
							)}
						</form>
					</CardContent>
				</Card>
			</div>

			{/* Comparison Table */}
			<div className="overflow-hidden rounded-lg border">
				<table className="w-full text-sm">
					<thead className="bg-muted">
						<tr>
							<th className="p-4 text-left font-semibold">
								<SaasAdminText>{"Mode"}</SaasAdminText>
							</th>
							<th className="p-4 text-left font-semibold">
								<SaasAdminText>{"When Validation Occurs"}</SaasAdminText>
							</th>
							<th className="p-4 text-left font-semibold">
								<SaasAdminText>{"Best For"}</SaasAdminText>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						<tr className="hover:bg-muted/20 transition-colors">
							<td className="p-4 font-medium">
								<SaasAdminText>{"onChange"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>{"Every keystroke"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>
									{"Real-time feedback (e.g., password strength)"}
								</SaasAdminText>
							</td>
						</tr>
						<tr className="hover:bg-muted/20 transition-colors">
							<td className="p-4 font-medium">
								<SaasAdminText>{"onBlur"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>{"When leaving the field"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>
									{"Less intrusive validation (recommended for most cases)"}
								</SaasAdminText>
							</td>
						</tr>
						<tr className="hover:bg-muted/20 transition-colors">
							<td className="p-4 font-medium">
								<SaasAdminText>{"onSubmit"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>{"When form is submitted"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>
									{"Simple forms, minimal interruption"}
								</SaasAdminText>
							</td>
						</tr>
						<tr className="hover:bg-muted/20 transition-colors">
							<td className="p-4 font-medium">
								<SaasAdminText>{"onTouched"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>{"First blur, then every change"}</SaasAdminText>
							</td>
							<td className="p-4">
								<SaasAdminText>
									{"Balance between UX and feedback"}
								</SaasAdminText>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export { ValidationModesDemo };
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
