"use client";
import {
	SaasAdminText,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import {
	imageImagesBrandsGoogleIconWebp,
	imageImagesBrandsSlackIconWebp,
} from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/general/connect-account.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// React Imports
import { useState } from "react";

// Third-party Imports
import { PlusIcon, XIcon } from "lucide-react";

// Component Imports
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectedAccount {
	id: string;
	name: string;
	iconUrl: string;
}

const initialAccounts: ConnectedAccount[] = [
	{
		id: "google",
		name: "Google",
		iconUrl: imageImagesBrandsGoogleIconWebp,
	},
	{
		id: "slack",
		name: "Slack",
		iconUrl: imageImagesBrandsSlackIconWebp,
	},
];

const ConnectedAccount = () => {
	const { t } = useSaasAdmin();

	const [connectedAccounts, setConnectedAccounts] =
		useState<ConnectedAccount[]>(initialAccounts);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [appName, setAppName] = useState("");
	const [appUrl, setAppUrl] = useState("");
	const [appIconUrl, setAppIconUrl] = useState("");
	const [description, setDescription] = useState("");

	const handleRemoveAccount = (accountId: string) => {
		setConnectedAccounts((prev) =>
			prev.filter((account) => account.id !== accountId),
		);
	};

	const resetForm = () => {
		setAppName("");
		setAppUrl("");
		setAppIconUrl("");
		setDescription("");
	};

	const handleConnect = () => {
		if (!appName.trim() || !appUrl.trim()) return;

		const id = appName.toLowerCase().replace(/\s+/g, "-");

		setConnectedAccounts((prev) => [
			...prev,
			{
				id,
				name: appName,
				iconUrl: appIconUrl.trim() || "",
			},
		]);

		resetForm();
		setIsDialogOpen(false);
	};

	return (
		<div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
			{/* Vertical Tabs List */}
			<div className="flex flex-col">
				<h2 className="text-base font-semibold">
					<SaasAdminText>{"Connect Accounts"}</SaasAdminText>
				</h2>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>{"Manage your connected accounts."}</SaasAdminText>
				</p>
			</div>

			{/* Content */}
			<div className="space-y-4 lg:col-span-2">
				<div className="flex flex-wrap items-center gap-4">
					{connectedAccounts.map((account) => (
						<div
							key={account.id}
							className="flex h-9 w-fit items-center gap-2 rounded-md border px-2.5 text-sm"
						>
							{account.iconUrl ? (
								<img
									width={16}
									height={16}
									src={account.iconUrl}
									alt={account.name}
									className="size-4 rounded"
								/>
							) : (
								<div className="bg-muted-foreground/10 text-muted-foreground flex size-4 items-center justify-center rounded text-sm font-medium">
									<SaasAdminText>{account.name.charAt(0)}</SaasAdminText>
								</div>
							)}

							<p className="text-sm font-medium">
								<SaasAdminText>{account.name}</SaasAdminText>
							</p>
							<Button
								size="icon-xs"
								variant="ghost"
								className="text-primary bg-primary/10 size-5 shrink-0 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
								aria-label={`Remove ${account.name}`}
								onClick={() => handleRemoveAccount(account.id)}
							>
								<XIcon className="size-3" aria-hidden="true" />
							</Button>
						</div>
					))}

					{/* Add App Button + Modal */}
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger
							render={
								<Button
									variant="outline"
									className="bg-background h-9 gap-2 rounded-md px-3"
									onClick={() => setIsDialogOpen(true)}
								/>
							}
						>
							<PlusIcon className="size-4" />
							<SaasAdminText>{"Add App"}</SaasAdminText>
						</DialogTrigger>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									<SaasAdminText>{"Connect New App"}</SaasAdminText>
								</DialogTitle>
								<DialogDescription>
									<SaasAdminText>
										{"Add a new integration by providing the details below."}
									</SaasAdminText>
								</DialogDescription>
							</DialogHeader>

							<div className="grid gap-3 py-2">
								<div className="grid gap-1">
									<Label>
										<SaasAdminText>{"App Name"}</SaasAdminText>
									</Label>
									<Input
										value={appName}
										onChange={(e) => setAppName(e.target.value)}
										placeholder={t("e.g., Zoom")}
									/>
								</div>

								<div className="grid gap-1">
									<Label>
										<SaasAdminText>
											{"App URL or Integration Key"}
										</SaasAdminText>
									</Label>
									<Input
										value={appUrl}
										onChange={(e) => setAppUrl(e.target.value)}
										placeholder={t("https://app.example.com or key_abc123")}
									/>
								</div>

								<div className="grid gap-1">
									<Label>
										<SaasAdminText>{"Optional Description"}</SaasAdminText>
									</Label>
									<Input
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder={t("Notes about this integration (optional)")}
									/>
								</div>
							</div>

							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => {
										resetForm();
										setIsDialogOpen(false);
									}}
								>
									<SaasAdminText>{"Cancel"}</SaasAdminText>
								</Button>
								<Button
									onClick={handleConnect}
									disabled={!appName.trim() || !appUrl.trim()}
								>
									<SaasAdminText>{"Connect"}</SaasAdminText>
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<p className="text-muted-foreground text-sm">
					<SaasAdminText>
						{
							"Connected accounts allow you to integrate with third-party services for enhanced functionality."
						}
					</SaasAdminText>
				</p>
			</div>
		</div>
	);
};

export { ConnectedAccount };
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
