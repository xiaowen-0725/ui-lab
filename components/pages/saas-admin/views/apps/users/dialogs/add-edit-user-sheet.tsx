"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/dialogs/add-edit-user-sheet.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useEffect } from "react";

// Third-party Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Type Imports
import type {
	AppUser,
	UserFormData,
	UserPlan,
	UserRole,
	UserSheetMode,
	UserStatus,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

const ROLES: UserRole[] = [
	"Admin",
	"Editor",
	"Subscriber",
	"Maintainer",
	"Guest",
];
const PLANS: UserPlan[] = ["Basic", "Team", "Enterprise"];
const STATUSES: UserStatus[] = ["Active", "Pending", "Suspended", "Inactive"];

const COUNTRIES = [
	"United States",
	"United Kingdom",
	"Canada",
	"Australia",
	"Germany",
	"France",
	"India",
	"Japan",
	"Brazil",
	"Netherlands",
	"Singapore",
	"Spain",
	"Italy",
	"Mexico",
	"South Korea",
];

const userFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required").email("Enter a valid email"),
	contact: z.string().optional(),
	company: z.string().optional(),
	country: z.string().optional(),
	role: z.enum(["Admin", "Editor", "Subscriber", "Maintainer", "Guest"]),
	plan: z.enum(["Basic", "Team", "Enterprise"]),
	status: z.enum(["Active", "Pending", "Suspended", "Inactive"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const defaultValues: UserFormValues = {
	name: "",
	email: "",
	contact: "",
	company: "",
	country: "",
	role: "Subscriber",
	plan: "Basic",
	status: "Active",
};

export interface AddEditUserSheetProps {
	mode: UserSheetMode | null;
	user: AppUser | null;
	onClose: () => void;
	onAdd: (data: UserFormData) => void;
	onEdit: (id: string, data: Partial<UserFormData>) => void;
}

export function AddEditUserSheet({
	mode,
	user,
	onClose,
	onAdd,
	onEdit,
}: AddEditUserSheetProps) {
	const { t } = useSaasAdmin();

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues,
	});

	useEffect(() => {
		if (mode === "edit" && user) {
			form.reset({
				name: user.name,
				email: user.email,
				contact: user.contact ?? "",
				company: user.company ?? "",
				country: user.country ?? "",
				role: user.role,
				plan: user.plan,
				status: user.status,
			});

			return;
		}

		if (mode === "add") {
			form.reset(defaultValues);
		}
	}, [form, mode, user]);

	const handleSubmit = (values: UserFormValues) => {
		const data: UserFormData = {
			name: values.name,
			email: values.email,
			contact: values.contact || undefined,
			company: values.company || undefined,
			country: values.country || undefined,
			role: values.role,
			plan: values.plan,
			status: values.status,
		};

		if (mode === "add") {
			onAdd(data);
		}

		if (mode === "edit" && user) {
			onEdit(user.id, data);
		}
	};

	return (
		<Sheet open={mode !== null} onOpenChange={(open) => !open && onClose()}>
			<SheetContent
				side="right"
				className="w-full overflow-y-auto sm:max-w-[420px]"
			>
				<SheetHeader className="pb-0">
					<SheetTitle className="text-lg font-medium">
						<SaasAdminText>
							{mode === "edit" ? "Edit User" : "Add New User"}
						</SaasAdminText>
					</SheetTitle>
				</SheetHeader>

				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex flex-col gap-4 px-4 pb-4"
				>
					<FieldGroup className="gap-4">
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor={field.name}>
										<SaasAdminText>{"Name"}</SaasAdminText>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										placeholder={t("Full name")}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor={field.name}>
										<SaasAdminText>{"Email"}</SaasAdminText>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="email"
										placeholder={t("name@example.com")}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="contact"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor={field.name}>
										<SaasAdminText>{"Contact"}</SaasAdminText>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="tel"
										placeholder={t("+1 (555) 000-0000")}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="company"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor={field.name}>
										<SaasAdminText>{"Company"}</SaasAdminText>
									</FieldLabel>
									<Input
										{...field}
										id={field.name}
										placeholder={t("Company name")}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="country"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor="country">
										<SaasAdminText>{"Country"}</SaasAdminText>
									</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id="country" className="w-full">
											<SelectValue placeholder={t("Select country")} />
										</SelectTrigger>
										<SelectContent alignItemWithTrigger={false}>
											<SelectGroup>
												{COUNTRIES.map((country) => (
													<SelectItem key={country} value={country}>
														<SaasAdminText>{country}</SaasAdminText>
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="role"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor="role">
										<SaasAdminText>{"Role"}</SaasAdminText>
									</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id="role" className="w-full">
											<SelectValue placeholder={t("Select role")} />
										</SelectTrigger>
										<SelectContent alignItemWithTrigger={false}>
											<SelectGroup>
												{ROLES.map((role) => (
													<SelectItem key={role} value={role}>
														<SaasAdminText>{role}</SaasAdminText>
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="plan"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor="plan">
										<SaasAdminText>{"Plan"}</SaasAdminText>
									</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id="plan" className="w-full">
											<SelectValue placeholder={t("Select plan")} />
										</SelectTrigger>
										<SelectContent alignItemWithTrigger={false}>
											<SelectGroup>
												{PLANS.map((plan) => (
													<SelectItem key={plan} value={plan}>
														<SaasAdminText>{plan}</SaasAdminText>
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>

						<Controller
							name="status"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid} className="gap-2">
									<FieldLabel htmlFor="status">
										<SaasAdminText>{"Status"}</SaasAdminText>
									</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger id="status" className="w-full">
											<SelectValue placeholder={t("Select status")} />
										</SelectTrigger>
										<SelectContent alignItemWithTrigger={false}>
											<SelectGroup>
												{STATUSES.map((status) => (
													<SelectItem key={status} value={status}>
														<SaasAdminText>{status}</SaasAdminText>
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{fieldState.invalid ? (
										<FieldError>
											{t(fieldState.error?.message ?? "")}
										</FieldError>
									) : null}
								</Field>
							)}
						/>
					</FieldGroup>

					<SheetFooter className="px-0 sm:flex-row">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="sm:flex-1"
						>
							<SaasAdminText>{"Cancel"}</SaasAdminText>
						</Button>
						<Button type="submit" className="sm:flex-1">
							<SaasAdminText>{"Save Changes"}</SaasAdminText>
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
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
