// biome-ignore-all lint/suspicious/noArrayIndexKey: Fixed-position strength slots; IDs do not change or reorder.
"use client";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/general/email-password.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useMemo, useState } from "react";

// Third-party Imports
import { CheckIcon, EyeIcon, EyeOffIcon, MailIcon, XIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

// Util Imports
import { cn } from "@/lib/utils";

const requirements = [
	{ regex: /.{12,}/, text: "At least 12 characters" },
	{ regex: /[a-z]/, text: "At least 1 lowercase letter" },
	{ regex: /[A-Z]/, text: "At least 1 uppercase letter" },
	{ regex: /[0-9]/, text: "At least 1 number" },
	{
		regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
		text: "At least 1 special character",
	},
];

const EmailPass = () => {
	const submission = useAdminSubmit("settings.email-password");

	const { t, settings } = useSaasAdmin();
	const saved = settings["settings.email-password"] ?? {};

	const [isVisible, setIsVisible] = useState(false);

	const [password, setPassword] = useState("");

	const toggleVisibility = () => setIsVisible((prevState) => !prevState);

	const strength = requirements.map((req) => ({
		met: req.regex.test(password),
		text: req.text,
	}));

	const strengthScore = useMemo(() => {
		return strength.filter((req) => req.met).length;
	}, [strength]);

	const getColor = (score: number) => {
		if (score === 0) return "bg-border";
		if (score <= 1) return "bg-destructive";
		if (score <= 2) return "bg-orange-500 ";
		if (score <= 3) return "bg-amber-500";
		if (score === 4) return "bg-yellow-400";

		return "bg-green-500";
	};

	const getText = (score: number) => {
		if (score === 0) return "Enter a password";
		if (score <= 2) return "Weak password";
		if (score <= 3) return "Medium password";
		if (score === 4) return "Strong password";

		return "Very strong password";
	};

	return (
		<div
			data-admin-action="settings.email-password"
			className="grid grid-cols-1 gap-10 lg:grid-cols-3"
		>
			{/* Vertical Tabs List */}
			<div className="flex flex-col space-y-1">
				<h2 className="text-base font-semibold">
					<SaasAdminText>{"Email & Password"}</SaasAdminText>
				</h2>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>
						{"Manage your email and password settings."}
					</SaasAdminText>
				</p>
			</div>

			{/* Content */}
			<div className="lg:col-span-2">
				<form
					onSubmit={submission.handleSubmit}
					aria-busy={submission.pending}
					className="mx-auto space-y-6"
				>
					<div className="w-full space-y-2">
						<Label htmlFor="email" className="gap-1">
							<SaasAdminText>{"Email"}</SaasAdminText>
							<span className="text-destructive">
								<SaasAdminText>{"*"}</SaasAdminText>
							</span>
						</Label>
						<InputGroup>
							<InputGroupInput
								id="email"
								type="email"
								placeholder={t("Email address")}
								required
								name="email"
								defaultValue={
									typeof saved["email"] === "string" ? saved["email"] : ""
								}
							/>
							<InputGroupAddon align="inline-end" className="pr-2.75">
								<MailIcon className="size-4" />
								<span className="sr-only">
									<SaasAdminText>{"Email"}</SaasAdminText>
								</span>
							</InputGroupAddon>
						</InputGroup>
					</div>
					<div className="w-full space-y-2">
						<Label htmlFor="current-password" className="gap-1">
							<SaasAdminText>{"Current Password"}</SaasAdminText>
							<span className="text-destructive">
								<SaasAdminText>{"*"}</SaasAdminText>
							</span>
						</Label>
						<InputGroup>
							<InputGroupInput
								id="current-password"
								type={isVisible ? "text" : "password"}
								placeholder={t("Password")}
								required
								name="current-password"
							/>
							<InputGroupAddon align="inline-end" className="pr-1.5">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsVisible((prevState) => !prevState)}
									className="text-muted-foreground focus-visible:ring-ring/50 rounded-l-none hover:bg-transparent"
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
					</div>
					<div className="w-full space-y-2">
						<Label htmlFor="new-password" className="gap-1">
							<SaasAdminText>{"New Password"}</SaasAdminText>
							<span className="text-destructive">
								<SaasAdminText>{"*"}</SaasAdminText>
							</span>
						</Label>
						<InputGroup className="mb-3">
							<InputGroupInput
								id="new-password"
								type={isVisible ? "text" : "password"}
								placeholder={t("Password")}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								name="new-password"
							/>
							<InputGroupAddon align="inline-end" className="pr-1.5">
								<Button
									variant="ghost"
									size="icon"
									onClick={toggleVisibility}
									className="text-muted-foreground focus-visible:ring-ring/50 rounded-l-none hover:bg-transparent"
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

						<div className="mb-4 flex h-1 w-full gap-1">
							{Array.from({ length: 5 }).map((_, index) => (
								<span
									key={String(index)}
									className={cn(
										"h-full flex-1 rounded-full transition-[transform,opacity] duration-500 ease-out",
										index < strengthScore
											? getColor(strengthScore)
											: "bg-border",
									)}
								/>
							))}
						</div>

						<p className="text-foreground text-sm font-medium">
							<SaasAdminText>{getText(strengthScore)}</SaasAdminText>
							<SaasAdminText>{". Must contain :"}</SaasAdminText>
						</p>

						<ul className="mb-4 space-y-1.5">
							{strength.map((req, index) => (
								<li key={req.text} className="flex items-center gap-2">
									{req.met ? (
										<CheckIcon className="size-4 text-green-800 dark:text-green-400" />
									) : (
										<XIcon className="text-muted-foreground size-4" />
									)}
									<span
										className={cn(
											"text-xs",
											req.met
												? "text-green-800 dark:text-green-400"
												: "text-muted-foreground",
										)}
									>
										<SaasAdminText>{req.text}</SaasAdminText>
										<span className="sr-only">
											<SaasAdminText>
												{req.met
													? " - Requirement met"
													: " - Requirement not met"}
											</SaasAdminText>
										</span>
									</span>
								</li>
							))}
						</ul>
					</div>

					<div className="mt-6 flex justify-end">
						<Button
							type="submit"
							disabled={submission.pending}
							className="max-sm:w-full"
						>
							<SaasAdminText>{"Save Changes"}</SaasAdminText>
						</Button>
					</div>
					<AdminSubmitFeedback {...submission} />
				</form>
			</div>
		</div>
	);
};

export { EmailPass };
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
