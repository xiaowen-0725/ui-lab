"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/forms/form-layouts/horizontal/basic-form.tsx
// Adaptation: named exports and portable import/navigation boundaries.
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

const BasicForm = () => {
	const { t } = useSaasAdmin();

	const submission = useAdminSubmit("form.horizontal.basic-form");

	return (
		<form onSubmit={submission.handleSubmit} aria-busy={submission.pending}>
			<FieldGroup className="gap-6">
				<Field className="grid grid-cols-1 gap-2 sm:grid-cols-6">
					<FieldLabel htmlFor="horizontal-basic-name">
						<SaasAdminText>{"Name"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="horizontal-basic-name"
						className="sm:col-span-5"
						placeholder={t("John Doe")}
						name="horizontal-basic-name"
						autoComplete="off"
					/>
				</Field>

				<Field className="grid grid-cols-1 gap-2 sm:grid-cols-6">
					<FieldLabel htmlFor="horizontal-basic-company">
						<SaasAdminText>{"Company"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="horizontal-basic-company"
						className="sm:col-span-5"
						placeholder={t("ACME Inc.")}
						name="horizontal-basic-company"
						autoComplete="off"
					/>
				</Field>

				<Field className="grid grid-cols-1 gap-2 sm:grid-cols-6">
					<FieldLabel htmlFor="horizontal-basic-email">
						<SaasAdminText>{"Email"}</SaasAdminText>
					</FieldLabel>
					<InputGroup className="sm:col-span-5">
						<InputGroupInput
							id="horizontal-basic-email"
							placeholder={t("john.doe")}
							name="horizontal-basic-email"
							autoComplete="off"
						/>
						<InputGroupAddon
							align="inline-end"
							className="text-foreground font-normal"
						>
							<SaasAdminText>{"@example.com"}</SaasAdminText>
						</InputGroupAddon>
					</InputGroup>
				</Field>

				<Field className="grid grid-cols-1 gap-2 sm:grid-cols-6">
					<FieldLabel htmlFor="horizontal-basic-phone">
						<SaasAdminText>{"Phone No"}</SaasAdminText>
					</FieldLabel>
					<Input
						id="horizontal-basic-phone"
						className="sm:col-span-5"
						type="tel"
						placeholder={t("658 799 8941")}
						name="horizontal-basic-phone"
						autoComplete="off"
					/>
				</Field>

				<Field className="grid grid-cols-1 items-start gap-2 sm:grid-cols-6">
					<FieldLabel htmlFor="horizontal-basic-message">
						<SaasAdminText>{"Message"}</SaasAdminText>
					</FieldLabel>
					<Textarea
						id="horizontal-basic-message"
						className="sm:col-span-5"
						placeholder={t("Hi, Do you have a moment to talk Joe?")}
						rows={4}
						name="horizontal-basic-message"
					/>
				</Field>

				<Field className="grid grid-cols-1 sm:grid-cols-6">
					<div className="sm:col-start-2">
						<Button type="submit" disabled={submission.pending}>
							<SaasAdminText>{"Send"}</SaasAdminText>
						</Button>
					</div>
				</Field>
			</FieldGroup>
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
