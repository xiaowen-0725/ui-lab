"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/forms/form-layouts/vertical/basic-form-with-icon.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Third-party Imports
import {
	Building2Icon,
	MapIcon,
	MapPinIcon,
	PhoneIcon,
	SignpostIcon,
	UserIcon,
} from "lucide-react";

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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

const BasicFormWithIcon = () => {
	const { t } = useSaasAdmin();

	const submission = useAdminSubmit("form.vertical.basic-form-with-icon");

	return (
		<form onSubmit={submission.handleSubmit} aria-busy={submission.pending}>
			<FieldGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Field className="gap-2">
					<FieldLabel htmlFor="basic-with-icons-first-name">
						<SaasAdminText>{"First Name"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<UserIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"First Name"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-first-name"
							placeholder={t("John")}
							name="basic-with-icons-first-name"
							autoComplete="given-name"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="basic-with-icons-last-name">
						<SaasAdminText>{"Last Name"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<UserIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"Last Name"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-last-name"
							placeholder={t("Doe")}
							name="basic-with-icons-last-name"
							autoComplete="family-name"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="basic-with-icons-mobile">
						<SaasAdminText>{"Mobile"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<PhoneIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"Mobile"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-mobile"
							type="tel"
							placeholder={t("+1 (555) 123-4567")}
							name="basic-with-icons-mobile"
							inputMode="tel"
							autoComplete="tel"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="basic-with-icons-pincode">
						<SaasAdminText>{"Pincode"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<MapPinIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"Pincode"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-pincode"
							placeholder={t("Postal Code")}
							name="basic-with-icons-pincode"
							autoComplete="postal-code"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2 sm:col-span-2">
					<FieldLabel htmlFor="basic-with-icons-address">
						<SaasAdminText>{"Address"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<MapPinIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"Address"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-address"
							placeholder={t("123 Main St")}
							name="basic-with-icons-address"
							autoComplete="off"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2 sm:col-span-2">
					<FieldLabel htmlFor="basic-with-icons-landmark">
						<SaasAdminText>{"Landmark"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<SignpostIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"Landmark"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-landmark"
							placeholder={t("Near Central Park, New York")}
							name="basic-with-icons-landmark"
							autoComplete="off"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="basic-with-icons-city">
						<SaasAdminText>{"City"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<Building2Icon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"City"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-city"
							placeholder={t("New York")}
							name="basic-with-icons-city"
							autoComplete="off"
						/>
					</InputGroup>
				</Field>

				<Field className="gap-2">
					<FieldLabel htmlFor="basic-with-icons-state">
						<SaasAdminText>{"State"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupAddon>
							<MapIcon className="size-4" />
							<span className="sr-only">
								<SaasAdminText>{"State"}</SaasAdminText>
							</span>
						</InputGroupAddon>
						<InputGroupInput
							id="basic-with-icons-state"
							placeholder={t("NY")}
							name="basic-with-icons-state"
							autoComplete="off"
						/>
					</InputGroup>
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

export { BasicFormWithIcon };
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
