"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/forms/form-validation/registration-demo-form.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema
const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters."),
	phone: z
		.string()
		.min(1, "Phone is required")
		.regex(/^\+?[0-9()\-\s]{8,20}$/, "Please enter a valid phone number."),
	company: z.string().min(2, "Company name must be at least 2 characters."),
	email: z
		.string()
		.min(1, "Email is required")
		.email({ message: "Please enter a valid email address." }),
	orderId: z.string().min(3, "Order ID is required."),
	issue: z.string().min(1, {
		message: "Kindly select an issue.",
	}),
	department: z.string().min(1, {
		message: "Kindly select a department.",
	}),
	priority: z.string().min(1, {
		message: "Kindly select a priority.",
	}),
	selectedOption: z.enum(["replace", "refund", "support"], {
		required_error: "Selection of an option is required.",
	}),
	message: z
		.string()
		.min(50, "Describe your issue using at least 50 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const ContactUSFormDemo = () => {
	const { t } = useSaasAdmin();
	const submission = useAdminSubmit("form.validation.report-issue");

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			phone: "",
			company: "",
			email: "",
			orderId: "",
			issue: "",
			department: "",
			priority: "",
			selectedOption: undefined,
			message: "",
		},
	});

	async function onSubmit(values: FormValues) {
		await submission.run(values);
	}

	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<CardTitle>
					<SaasAdminText>{"Report Issue"}</SaasAdminText>
				</CardTitle>
				<CardDescription>
					<SaasAdminText>
						{
							"Describe an issue to try this local demo. No request is sent to a team."
						}
					</SaasAdminText>
				</CardDescription>
			</CardHeader>
			<CardContent className="block">
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					aria-busy={submission.pending}
					className="grid w-full grid-cols-1 gap-6 md:grid-cols-2"
				>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									<SaasAdminText>{"Name"}</SaasAdminText>
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={submission.pending}
									placeholder={t("Your full name")}
									autoComplete="name"
								/>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						name="phone"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									<SaasAdminText>{"Phone"}</SaasAdminText>
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="tel"
									aria-invalid={fieldState.invalid}
									disabled={submission.pending}
									placeholder={t("Phone number")}
									autoComplete="tel"
								/>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						name="company"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									<SaasAdminText>{"Company"}</SaasAdminText>
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={submission.pending}
									placeholder={t("Company name")}
									autoComplete="organization"
								/>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Email Field */}
					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									<SaasAdminText>{"Email"}</SaasAdminText>
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									type="email"
									aria-invalid={fieldState.invalid}
									disabled={submission.pending}
									placeholder={t("Email address")}
									autoComplete="email"
								/>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						name="orderId"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									<SaasAdminText>{"Order ID"}</SaasAdminText>
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={submission.pending}
									placeholder={t("Order ID")}
								/>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Issue Select Field */}
					<Controller
						name="issue"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="issue">
									<SaasAdminText>{"Issue"}</SaasAdminText>
								</FieldLabel>
								<Select
									name={field.name}
									disabled={submission.pending}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										id="issue"
										className="w-full"
										aria-invalid={fieldState.invalid}
									>
										<SelectValue placeholder={t("Issue you are facing")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="damaged">
											<SaasAdminText>{"Product is Damaged"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="got-different">
											<SaasAdminText>{"Received wrong product"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="not-like">
											<SaasAdminText>{"Not as expectation"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="other">
											<SaasAdminText>{"Other"}</SaasAdminText>
										</SelectItem>
									</SelectContent>
								</Select>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						name="department"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="department">
									<SaasAdminText>{"Department"}</SaasAdminText>
								</FieldLabel>
								<Select
									name={field.name}
									disabled={submission.pending}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										id="department"
										className="w-full"
										aria-invalid={fieldState.invalid}
									>
										<SelectValue placeholder={t("Select department")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="sales">
											<SaasAdminText>{"Sales"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="billing">
											<SaasAdminText>{"Billing"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="returns">
											<SaasAdminText>{"Returns"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="technical">
											<SaasAdminText>{"Technical Support"}</SaasAdminText>
										</SelectItem>
									</SelectContent>
								</Select>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						name="priority"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="priority">
									<SaasAdminText>{"Priority"}</SaasAdminText>
								</FieldLabel>
								<Select
									name={field.name}
									disabled={submission.pending}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										id="priority"
										className="w-full"
										aria-invalid={fieldState.invalid}
									>
										<SelectValue placeholder={t("Select priority")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">
											<SaasAdminText>{"Low"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="medium">
											<SaasAdminText>{"Medium"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="high">
											<SaasAdminText>{"High"}</SaasAdminText>
										</SelectItem>
										<SelectItem value="urgent">
											<SaasAdminText>{"Urgent"}</SaasAdminText>
										</SelectItem>
									</SelectContent>
								</Select>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Radio Group Field */}
					<Controller
						name="selectedOption"
						control={form.control}
						render={({ field, fieldState }) => (
							<FieldSet className="md:col-span-2">
								<FieldLegend variant="label">
									<SaasAdminText>{"How can we help you?"}</SaasAdminText>
								</FieldLegend>
								<RadioGroup
									name={field.name}
									disabled={submission.pending}
									value={field.value ?? ""}
									onValueChange={field.onChange}
								>
									<Field
										orientation="horizontal"
										data-invalid={fieldState.invalid}
									>
										<RadioGroupItem
											value="replace"
											id="want-replace"
											aria-invalid={fieldState.invalid}
										/>
										<FieldLabel htmlFor="want-replace" className="font-normal">
											<SaasAdminText>
												{"Need a product replacement"}
											</SaasAdminText>
										</FieldLabel>
									</Field>
									<Field
										orientation="horizontal"
										data-invalid={fieldState.invalid}
									>
										<RadioGroupItem
											value="refund"
											id="want-refund"
											aria-invalid={fieldState.invalid}
										/>
										<FieldLabel htmlFor="want-refund" className="font-normal">
											<SaasAdminText>{"Need a refund"}</SaasAdminText>
										</FieldLabel>
									</Field>
									<Field
										orientation="horizontal"
										data-invalid={fieldState.invalid}
									>
										<RadioGroupItem
											value="support"
											id="want-support"
											aria-invalid={fieldState.invalid}
										/>
										<FieldLabel htmlFor="want-support" className="font-normal">
											<SaasAdminText>
												{"Need guidance or support"}
											</SaasAdminText>
										</FieldLabel>
									</Field>
								</RadioGroup>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</FieldSet>
						)}
					/>

					{/* Message Textarea Field */}
					<Controller
						name="message"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="md:col-span-2"
							>
								<FieldLabel htmlFor={field.name}>
									<SaasAdminText>{"Please describe your issue"}</SaasAdminText>
								</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={submission.pending}
									placeholder={t(
										"Provide detailed information about your issue",
									)}
									className="min-h-30 resize-none"
								/>
								{fieldState.invalid && (
									<FieldError>{t(fieldState.error?.message ?? "")}</FieldError>
								)}
							</Field>
						)}
					/>

					<Button
						type="submit"
						disabled={submission.pending}
						className="md:col-span-2 md:w-fit"
					>
						<SaasAdminText>{"Submit"}</SaasAdminText>
					</Button>
				</form>
				<AdminSubmitFeedback {...submission} />
				{submission.complete && (
					<FieldDescription>
						<SaasAdminText>
							{"Local demo completed. No request was sent to a team."}
						</SaasAdminText>
					</FieldDescription>
				)}
			</CardContent>
		</Card>
	);
};

export { ContactUSFormDemo };
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
