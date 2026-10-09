"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/auth/login/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

// Components Import
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
import { LoginForm } from "@/components/pages/saas-admin/views/pages/auth/login/login-form";

// SVG Import
import { AuthBackgroundShape } from "@/components/pages/saas-admin/assets/svg/auth-background-shape";

const Login = () => {
	const quickSubmission = useAdminSubmit("auth.login");
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
							<SaasAdminText>{"Sign in to SaaS Admin"}</SaasAdminText>
						</CardTitle>
						<CardDescription className="text-base">
							<SaasAdminText>
								{"Ship Faster and Focus on Growth."}
							</SaasAdminText>
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="block px-6">
					<p className="text-muted-foreground mb-6 text-base">
						<SaasAdminText>{"Login with"}</SaasAdminText>
						<SaasAdminText> </SaasAdminText>
						<Link
							href="#"
							className="text-card-foreground underline underline-offset-4"
							aria-disabled={quickSubmission.pending}
							onClick={(event) => {
								event.preventDefault();
								void quickSubmission.run({ method: "magic-link", demo: true });
							}}
						>
							<SaasAdminText>{"Magic Link"}</SaasAdminText>
						</Link>
					</p>

					{/* Quick Login Buttons */}
					<div className="mb-6 flex flex-wrap gap-4 sm:gap-6">
						<Button
							variant="outline"
							className="grow"
							disabled={quickSubmission.pending}
							onClick={() =>
								void quickSubmission.run({
									method: "quick-login",
									role: "user",
									demo: true,
								})
							}
						>
							<SaasAdminText>{"Login as User"}</SaasAdminText>
						</Button>
						<Button
							variant="outline"
							className="grow"
							disabled={quickSubmission.pending}
							onClick={() =>
								void quickSubmission.run({
									method: "quick-login",
									role: "admin",
									demo: true,
								})
							}
						>
							<SaasAdminText>{"Login as Admin"}</SaasAdminText>
						</Button>
					</div>

					{/* Login Form */}
					<div className="space-y-4">
						<LoginForm />

						<p className="text-muted-foreground text-center text-base">
							<SaasAdminText>{"New on our platform?"}</SaasAdminText>
							<SaasAdminText> </SaasAdminText>
							<Link
								href="/pages/auth/register"
								className="text-card-foreground underline underline-offset-4"
							>
								<SaasAdminText>{"Create an account"}</SaasAdminText>
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
							disabled={quickSubmission.pending}
							onClick={(event) => {
								event.preventDefault();
								void quickSubmission.run({ method: "google", demo: true });
							}}
						>
							<SaasAdminText>{"Sign in with google"}</SaasAdminText>
						</Button>
					</div>
					<AdminSubmitFeedback {...quickSubmission} />
					{quickSubmission.complete && (
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

export { Login };
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
