"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/auth/forgot-password/forgot-password-form.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Component Import
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ForgotPasswordForm = () => {
	const { t } = useSaasAdmin();

	const submission = useAdminSubmit("auth.forgot-password");

	return (
		<form onSubmit={submission.handleSubmit} aria-busy={submission.pending}>
			<FieldGroup className="gap-4">
				{/* Email */}
				<Field>
					<FieldLabel className="leading-5" htmlFor="userEmail">
						<SaasAdminText>{"Email address*"}</SaasAdminText>
					</FieldLabel>
					<Input
						type="email"
						id="userEmail"
						placeholder={t("Enter your email address")}
						name="userEmail"
						required
						autoComplete="email"
						spellCheck={false}
					/>
				</Field>
				<Field>
					<Button
						className="w-full"
						type="submit"
						disabled={submission.pending}
					>
						<SaasAdminText>{"Send Reset Link"}</SaasAdminText>
					</Button>
				</Field>
			</FieldGroup>
			<AdminSubmitFeedback {...submission} />
			{submission.complete && (
				<FieldDescription>
					<SaasAdminText>
						{
							"Local demo completed. No account was created or reset email sent."
						}
					</SaasAdminText>
				</FieldDescription>
			)}
		</form>
	);
};

export { ForgotPasswordForm };
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
