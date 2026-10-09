"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/auth/register/register-form.tsx
// Adaptation: named exports and portable import/navigation boundaries.

import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// React Import
import { useState } from "react";

// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

// Third-party Imports
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Component Import
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

const RegisterForm = () => {
	const { t } = useSaasAdmin();

	const submission = useAdminSubmit("auth.register");

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	return (
		<form onSubmit={submission.handleSubmit} aria-busy={submission.pending}>
			<FieldGroup className="gap-4">
				{/* Username */}
				<Field className="gap-2">
					<FieldLabel className="leading-5" htmlFor="username">
						<SaasAdminText>{"Username*"}</SaasAdminText>
					</FieldLabel>
					<Input
						type="text"
						id="username"
						placeholder={t("Enter your username")}
						name="username"
						required
						autoComplete="username"
						spellCheck={false}
					/>
				</Field>
				{/* Email */}
				<Field className="gap-2">
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
				{/* Password */}
				<Field className="w-full gap-2">
					<FieldLabel className="leading-5" htmlFor="password">
						<SaasAdminText>{"Password*"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupInput
							id="password"
							type={isPasswordVisible ? "text" : "password"}
							placeholder={t("••••••••••••••••")}
							name="password"
							required
							autoComplete="new-password"
						/>
						<InputGroupAddon align="inline-end" className="pr-1.5">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setIsPasswordVisible((prevState) => !prevState)}
								className="text-muted-foreground rounded-l-none hover:bg-transparent"
							>
								{isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
								<span className="sr-only">
									<SaasAdminText>
										{isPasswordVisible ? "Hide password" : "Show password"}
									</SaasAdminText>
								</span>
							</Button>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				{/* Confirm Password */}
				<Field className="w-full gap-2">
					<FieldLabel className="leading-5" htmlFor="confirmPassword">
						<SaasAdminText>{"Confirm Password*"}</SaasAdminText>
					</FieldLabel>
					<InputGroup>
						<InputGroupInput
							id="confirmPassword"
							type={isConfirmPasswordVisible ? "text" : "password"}
							placeholder={t("••••••••••••••••")}
							name="confirmPassword"
							required
							autoComplete="new-password"
						/>
						<InputGroupAddon align="inline-end" className="pr-1.5">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() =>
									setIsConfirmPasswordVisible((prevState) => !prevState)
								}
								className="text-muted-foreground rounded-l-none hover:bg-transparent"
							>
								{isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
								<span className="sr-only">
									<SaasAdminText>
										{isConfirmPasswordVisible
											? "Hide password"
											: "Show password"}
									</SaasAdminText>
								</span>
							</Button>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				{/* Privacy policy */}
				<Field orientation="horizontal" className="flex items-center gap-2">
					<Checkbox id="privacyPolicy" name="privacyPolicy" required />
					<FieldLabel htmlFor="privacyPolicy">
						<span className="text-muted-foreground">
							<SaasAdminText>{"I agree to"}</SaasAdminText>
						</span>{" "}
						<Link href="#">
							<SaasAdminText>{"privacy policy & terms"}</SaasAdminText>
						</Link>
					</FieldLabel>
				</Field>
				<Field>
					<Button
						className="w-full"
						type="submit"
						disabled={submission.pending}
					>
						<SaasAdminText>{"Sign Up to SaaS Admin"}</SaasAdminText>
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

export { RegisterForm };
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
