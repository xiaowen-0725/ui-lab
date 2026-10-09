"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/auth/register/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

// Component Import
import { Logo } from "@/components/pages/saas-admin/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "@/components/pages/saas-admin/views/pages/auth/register/register-form";

// SVG Import
import { AuthBackgroundShape } from "@/components/pages/saas-admin/assets/svg/auth-background-shape";

const Register = () => {
	const googleSubmission = useAdminSubmit("auth.register");
	return (
		<div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
			<div className="absolute">
				<AuthBackgroundShape />
			</div>

			<Card className="z-1 w-full gap-6 py-6 sm:max-w-lg">
				<CardHeader className="gap-6 px-6">
					<Link href="/">
						<Logo className="gap-3" />
					</Link>

					<div>
						<CardTitle className="mb-2 text-2xl font-semibold">
							<SaasAdminText>{"Sign Up to SaaS Admin"}</SaasAdminText>
						</CardTitle>
						<CardDescription className="text-base">
							<SaasAdminText>
								{"Ship Faster and Focus on Growth."}
							</SaasAdminText>
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="block px-6">
					{/* Register Form */}
					<div className="space-y-4">
						<RegisterForm />

						<p className="text-muted-foreground text-center">
							<SaasAdminText>{"Already have an account?"}</SaasAdminText>
							<SaasAdminText> </SaasAdminText>
							<Link
								href="/pages/auth/login"
								className="text-card-foreground underline underline-offset-4"
							>
								<SaasAdminText>{"Sign in instead"}</SaasAdminText>
							</Link>
						</p>

						<div className="flex items-center gap-4">
							<Separator className="flex-1" />
							<p className="text-base">
								<SaasAdminText>{"or"}</SaasAdminText>
							</p>
							<Separator className="flex-1" />
						</div>

						<Button
							variant="ghost"
							className="w-full"
							render={<Link href="#" />}
							nativeButton={false}
							disabled={googleSubmission.pending}
							onClick={(event) => {
								event.preventDefault();
								void googleSubmission.run({ method: "google", demo: true });
							}}
						>
							<SaasAdminText>{"Sign in with google"}</SaasAdminText>
						</Button>
					</div>
					<AdminSubmitFeedback {...googleSubmission} />
					{googleSubmission.complete && (
						<CardDescription>
							<SaasAdminText>
								{
									"Local demo completed. No account was created or reset email sent."
								}
							</SaasAdminText>
						</CardDescription>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export { Register };
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
