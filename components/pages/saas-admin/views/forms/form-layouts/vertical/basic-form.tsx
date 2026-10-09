"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/forms/form-layouts/vertical/basic-form.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";

const BasicForm = () => {
	const { t } = useSaasAdmin();

	const submission = useAdminSubmit("form.vertical.basic-form");

	return (
		<form onSubmit={submission.handleSubmit} aria-busy={submission.pending}>
			<FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Field className="gap-2">
					<FieldLabel htmlFor="multi-step-personal-info-first-name">
						<SaasAdminText>{"First Name"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-first-name"
						placeholder={t("John")}
						name="multi-step-personal-info-first-name"
						autoComplete="given-name"
					/>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="multi-step-personal-info-last-name">
						<SaasAdminText>{"Last Name"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-last-name"
						placeholder={t("Doe")}
						name="multi-step-personal-info-last-name"
						autoComplete="family-name"
					/>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="multi-step-personal-info-mobile">
						<SaasAdminText>{"Mobile"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-mobile"
						placeholder={t("+1 (555) 123-4567")}
						name="multi-step-personal-info-mobile"
						type="tel"
						inputMode="tel"
						autoComplete="tel"
					/>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="multi-step-personal-info-pincode">
						<SaasAdminText>{"Pincode"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-pincode"
						placeholder={t("Postal Code")}
						name="multi-step-personal-info-pincode"
						autoComplete="postal-code"
					/>
				</Field>

				<Field className="gap-2 sm:col-span-2">
					<FieldLabel htmlFor="multi-step-personal-info-address">
						<SaasAdminText>{"Address"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-address"
						placeholder={t("123 Main St")}
						name="multi-step-personal-info-address"
						autoComplete="off"
					/>
				</Field>

				<Field className="gap-2 sm:col-span-2">
					<FieldLabel htmlFor="multi-step-personal-info-landmark">
						<SaasAdminText>{"Landmark"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-landmark"
						placeholder={t("Near Central Park, New York")}
						name="multi-step-personal-info-landmark"
						autoComplete="off"
					/>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="multi-step-personal-info-city">
						<SaasAdminText>{"City"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-city"
						placeholder={t("New York")}
						name="multi-step-personal-info-city"
						autoComplete="off"
					/>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="multi-step-personal-info-state">
						<SaasAdminText>{"State"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="multi-step-personal-info-state"
						placeholder={t("NY")}
						name="multi-step-personal-info-state"
						autoComplete="off"
					/>
				</Field>
			</FieldGroup>

			<div className="mt-8">
				<Button type="submit" disabled={submission.pending}>
					<SaasAdminText>{"Save Information"}</SaasAdminText>
				</Button>
			</div>
			<AdminSubmitFeedback {...submission} />
			{submission.complete && (
				<FieldDescription>
					<SaasAdminText>
						{"Local demo completed. No request was sent to a team."}
					</SaasAdminText>
				</FieldDescription>
			)}
		</form>
	);
};

export { BasicForm };
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
