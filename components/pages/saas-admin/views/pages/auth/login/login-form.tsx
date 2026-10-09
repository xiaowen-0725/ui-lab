"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/auth/login/login-form.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Rect Import
import { useState } from "react";

// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

// Third-party Imports
import { EyeIcon, EyeOffIcon } from "lucide-react";

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Components Import
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const LoginForm = () => {
	const { t } = useSaasAdmin();

	const submission = useAdminSubmit("auth.login");

	const [isVisible, setIsVisible] = useState(false);

	return (
		<form onSubmit={submission.handleSubmit} aria-busy={submission.pending}>
			<FieldGroup className="gap-4">
				{/* Email */}
				<Field className="gap-2">
					<FieldLabel htmlFor="userEmail" className="leading-5">
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
				{/* Password */}
				<Field className="w-full gap-2">
					<FieldLabel htmlFor="password" className="leading-5">
						<SaasAdminText>{"Password*"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupInput
							id="password"
							type={isVisible ? "text" : "password"}
							placeholder={t("••••••••••••••••")}
							name="password"
							required
							autoComplete="current-password"
						/>
						<InputGroupAddon align="inline-end" className="pr-1.5">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setIsVisible((prevState) => !prevState)}
								className="text-muted-foreground rounded-l-none hover:bg-transparent"
							>
								{isVisible ? <EyeOffIcon /> : <EyeIcon />}
								<span className="sr-only">
									<SaasAdminText>
										{isVisible ? "Hide password" : "Show password"}
									</SaasAdminText>
								</span>
							</Button>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				{/* Remember Me and Forgot Password */}
				<div className="flex items-center justify-between gap-y-2">
					<Field orientation="horizontal" className="flex items-center gap-2">
						<Checkbox id="rememberMe" name="rememberMe" />
						<FieldLabel htmlFor="rememberMe" className="text-muted-foreground">
							<SaasAdminText> </SaasAdminText>
							<SaasAdminText>{"Remember Me"}</SaasAdminText>
						</FieldLabel>
					</Field>
					<Link
						href="/pages/auth/forgot-password"
						className="text-base text-nowrap underline underline-offset-4"
					>
						<SaasAdminText>{"Forgot Password?"}</SaasAdminText>
					</Link>
				</div>
				<Field>
					<Button
						className="w-full"
						type="submit"
						disabled={submission.pending}
					>
						<SaasAdminText>{"Sign in to SaaS Admin"}</SaasAdminText>
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

export { LoginForm };
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
