"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	imageImagesBrandsAsanaIconCircleWebp,
	imageImagesBrandsGithubWhiteWebp,
	imageImagesBrandsGoogleIconWebp,
	imageImagesBrandsMailchimpIconWebp,
	imageImagesBrandsSlackIconWebp,
} from "@/components/pages/saas-admin/assets/images";
import {
	useAdminSubmit,
	AdminSubmitFeedback,
} from "@/components/pages/saas-admin/use-submit";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/tabs/connections-tab.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useState, type ComponentType, type SVGAttributes } from "react";

// Third-party Imports
import { LinkIcon, PaletteIcon, Trash2Icon } from "lucide-react";

// Type Imports
import type {
	AppUser,
	SocialPlatform,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import { FacebookIcon } from "@/components/pages/saas-admin/assets/svg/facebook-icon";
import { GithubIcon } from "@/components/pages/saas-admin/assets/svg/github-icon";
import { LinkedinIcon } from "@/components/pages/saas-admin/assets/svg/linkedin-icon";
import { TwitterIcon } from "@/components/pages/saas-admin/assets/svg/twitter-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Util Imports
import { cn } from "@/lib/utils";

interface BrandItem {
	image?: string;
	icon?: string;
}

interface ConnectedIntegration extends BrandItem {
	id: string;
	name: string;
	description: string;
	enabled?: boolean;
}

interface SocialAccount extends BrandItem {
	platform: SocialPlatform;
	label: string;
}

const ICONS: Record<string, ComponentType<SVGAttributes<SVGElement>>> = {
	facebook: FacebookIcon,
	twitter: TwitterIcon,
	linkedin: LinkedinIcon,
	github: GithubIcon,
	dribbble: PaletteIcon,
	mailchimp: PaletteIcon,
};

const CONNECTED_INTEGRATIONS: ConnectedIntegration[] = [
	{
		id: "google",
		name: "Google",
		description: "Calendar and contacts",
		image: imageImagesBrandsGoogleIconWebp,
		enabled: true,
	},
	{
		id: "slack",
		name: "Slack",
		description: "Communication",
		image: imageImagesBrandsSlackIconWebp,
		enabled: false,
	},
	{
		id: "github",
		name: "Github",
		description: "Manage your Git repository",
		image: imageImagesBrandsGithubWhiteWebp,
		enabled: true,
	},
	{
		id: "mailchimp",
		name: "Mailchimp",
		description: "Email marketing service",
		image: imageImagesBrandsMailchimpIconWebp,
		enabled: false,
	},
	{
		id: "asana",
		name: "Asana",
		description: "Communication",
		image: imageImagesBrandsAsanaIconCircleWebp,
		enabled: false,
	},
];

const SOCIAL_ACCOUNTS: SocialAccount[] = [
	{ platform: "facebook", label: "Facebook", icon: "facebook" },
	{ platform: "twitter", label: "Twitter", icon: "twitter" },
	{ platform: "linkedin", label: "LinkedIn", icon: "linkedin" },
	{ platform: "dribbble", label: "Dribbble", icon: "dribbble" },
];

function BrandAvatar({ item, alt }: { item: BrandItem; alt: string }) {
	const Icon = item.icon ? ICONS[item.icon] : null;

	return (
		<Avatar className="size-10 rounded-lg after:rounded-lg">
			{item.image ? (
				<AvatarImage
					src={item.image}
					alt={alt}
					className="rounded-lg object-contain p-1.5"
				/>
			) : null}
			<AvatarFallback className="rounded-lg">
				{Icon ? <Icon className="size-5" /> : null}
			</AvatarFallback>
		</Avatar>
	);
}

function getSocialHandle(url: string): string {
	const handle = url.replace(/\/$/, "").split("/").pop() ?? url;

	return handle.startsWith("@") ? handle : `@${handle}`;
}

export interface ConnectionsTabProps {
	user: AppUser;
}

export function ConnectionsTab({ user }: ConnectionsTabProps) {
	const { t } = useSaasAdmin();
	const action = useAdminSubmit("users.social-account");
	const [connectionOverrides, setConnectionOverrides] = useState<
		Record<string, boolean>
	>({});
	const [integrationToggles, setIntegrationToggles] = useState<
		Record<string, boolean>
	>(() =>
		Object.fromEntries(
			CONNECTED_INTEGRATIONS.map((integration) => [
				integration.id,
				integration.enabled ?? false,
			]),
		),
	);

	const socialLinks = user.socialLinks ?? [];

	return (
		<div className="space-y-6">
			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-6 py-4!">
					<CardTitle className="text-base">
						<SaasAdminText>{"Connected Accounts"}</SaasAdminText>
					</CardTitle>
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Display content from your connected accounts on your site"}
						</SaasAdminText>
					</p>
				</CardHeader>
				<CardContent className="block px-0 pb-0">
					<div className="divide-y">
						{CONNECTED_INTEGRATIONS.map((integration) => (
							<div
								key={integration.id}
								className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
							>
								<div className="flex min-w-0 flex-1 items-center gap-4">
									<BrandAvatar item={integration} alt={integration.name} />
									<div className="min-w-0">
										<p className="font-medium">
											<SaasAdminText>{integration.name}</SaasAdminText>
										</p>
										<p className="text-muted-foreground text-sm">
											<SaasAdminText>{integration.description}</SaasAdminText>
										</p>
									</div>
								</div>
								<Switch
									checked={integrationToggles[integration.id] ?? false}
									onCheckedChange={(value) =>
										setIntegrationToggles((prev) => ({
											...prev,
											[integration.id]: value,
										}))
									}
									aria-label={`${t("Toggle")} ${t(integration.name)}`}
								/>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card className="gap-0 py-0">
				<CardHeader className="border-b px-6 py-4!">
					<CardTitle className="text-base">
						<SaasAdminText>{"Social Accounts"}</SaasAdminText>
					</CardTitle>
					<p className="text-muted-foreground text-sm">
						<SaasAdminText>
							{"Display content from social accounts on your site"}
						</SaasAdminText>
					</p>
				</CardHeader>
				<CardContent className="block px-0 pb-0">
					<div className="divide-y">
						{SOCIAL_ACCOUNTS.map((account) => {
							const linkedAccount = socialLinks.find(
								(link) => link.platform === account.platform,
							);
							const isConnected =
								connectionOverrides[account.platform] ?? Boolean(linkedAccount);

							return (
								<div
									key={account.platform}
									className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
								>
									<div className="flex min-w-0 flex-1 items-center gap-4">
										<BrandAvatar item={account} alt={account.label} />
										<div className="min-w-0">
											<p className="font-medium">
												<SaasAdminText>{account.label}</SaasAdminText>
											</p>
											{isConnected && linkedAccount ? (
												<a
													href={linkedAccount.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary text-sm hover:underline"
												>
													<SaasAdminText>
														{getSocialHandle(linkedAccount.url)}
													</SaasAdminText>
												</a>
											) : (
												<p className="text-muted-foreground text-sm">
													<SaasAdminText>
														{isConnected ? "Connected" : "Not Connected"}
													</SaasAdminText>
												</p>
											)}
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										disabled={action.pending}
										onClick={async () => {
											const platform = account.platform;
											const connected = !isConnected;
											if (
												await action.run({
													userId: user.id,
													platform,
													operation: connected ? "connect" : "disconnect",
												})
											) {
												setConnectionOverrides((previous) => ({
													...previous,
													[platform]: connected,
												}));
											}
										}}
										className={cn(
											"size-9 shrink-0 rounded-lg",
											isConnected
												? "bg-destructive/10 text-red-800 dark:text-red-300 hover:bg-destructive/15 hover:text-red-800 dark:text-red-300"
												: "bg-muted text-muted-foreground hover:bg-muted/80",
										)}
										aria-label={
											isConnected
												? `${t("Disconnect")} ${t(account.label)}`
												: `${t("Connect")} ${t(account.label)}`
										}
									>
										{isConnected ? (
											<Trash2Icon className="size-4.5" />
										) : (
											<LinkIcon className="size-4.5" />
										)}
									</Button>
								</div>
							);
						})}
					</div>
					<AdminSubmitFeedback {...action} error={t(action.error)} />
				</CardContent>
			</Card>
		</div>
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
