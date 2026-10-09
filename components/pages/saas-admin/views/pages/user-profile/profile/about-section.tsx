"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-profile/profile/about-section.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Third-party Imports
import {
	CheckCheckIcon,
	CheckIcon,
	FlagIcon,
	LanguagesIcon,
	LayoutGridIcon,
	type LucideIcon,
	MailIcon,
	MessagesSquareIcon,
	PhoneIcon,
	StarIcon,
	UserIcon,
} from "lucide-react";

// Components Imports
import { Card, CardContent } from "@/components/ui/card";

// Data Imports
import { useSaasAdmin } from "@/components/pages/saas-admin/environment";

// Type Imports
import type {
	UserProfileInfoIconKey,
	UserProfileOverviewIconKey,
} from "@/components/pages/saas-admin/types/pages/user-profile-types";

type AboutItem = {
	label: string;
	value: string;
	icon?: LucideIcon;
};

const profileIconMap: Record<UserProfileInfoIconKey, LucideIcon> = {
	UserIcon,
	CheckCheckIcon,
	StarIcon,
	FlagIcon,
	LanguagesIcon,
	PhoneIcon,
	MessagesSquareIcon,
	MailIcon,
};

const overviewIconMap: Record<UserProfileOverviewIconKey, LucideIcon> = {
	CheckIcon,
	UserIcon,
	LayoutGridIcon,
};

function AboutSection() {
	const { profile: db } = useSaasAdmin();
	const profileSections = db.profileSections.map((section) => ({
		title: section.title,
		items: section.items.map<AboutItem>((item) => ({
			label: item.label,
			value: item.value,
			icon:
				item.iconKey && item.iconKey in profileIconMap
					? profileIconMap[item.iconKey as UserProfileInfoIconKey]
					: undefined,
		})),
	}));

	const overviewSections = db.overviewSections.map((section) => ({
		title: section.title,
		items: section.items.map<AboutItem>((item) => ({
			label: item.label,
			value: item.value,
			icon:
				item.iconKey && item.iconKey in overviewIconMap
					? overviewIconMap[item.iconKey as UserProfileOverviewIconKey]
					: undefined,
		})),
	}));

	return (
		<div className="space-y-6">
			<Card>
				<CardContent className="block space-y-5">
					{profileSections.map((section) => (
						<div className="space-y-2" key={section.title}>
							<p className="text-muted-foreground text-xs font-medium uppercase">
								<SaasAdminText>{section.title}</SaasAdminText>
							</p>
							<ul className="space-y-3">
								{section.items.map((item) => {
									const Icon = item.icon;

									return (
										<li className="flex items-center gap-2" key={item.label}>
											{Icon ? <Icon className="size-4" /> : null}
											<span className="text-sm font-medium">
												<SaasAdminText>{item.label}</SaasAdminText>
												<SaasAdminText>{":"}</SaasAdminText>
											</span>
											<span className="text-sm">
												<SaasAdminText>{item.value}</SaasAdminText>
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</CardContent>
			</Card>
			<Card>
				<CardContent className="block space-y-5">
					{overviewSections.map((section) => (
						<div className="space-y-2" key={section.title}>
							<p className="text-muted-foreground text-xs font-medium uppercase">
								<SaasAdminText>{section.title}</SaasAdminText>
							</p>
							<ul className="space-y-3">
								{section.items.map((item) => {
									const Icon = item.icon;

									return (
										<li className="flex items-center gap-2" key={item.label}>
											{Icon ? <Icon className="size-4" /> : null}
											<span className="text-sm font-medium">
												<SaasAdminText>{item.label}</SaasAdminText>
												<SaasAdminText>{":"}</SaasAdminText>
											</span>
											<span className="text-sm">
												<SaasAdminText>{item.value}</SaasAdminText>
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

export { AboutSection };
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
