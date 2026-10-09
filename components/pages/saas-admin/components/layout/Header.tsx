"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/components/layout/Header.tsx
// Adaptation: named exports and portable import/navigation boundaries.

// Next Imports
import { Fragment } from "react";

import {
	useAdminPathname as usePathname,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";

// Third-party Imports
import { LanguagesIcon } from "lucide-react";

// Component Imports
import { LanguageDropdown } from "@/components/pages/saas-admin/components/shared/LanguageDropdown";
import { ModeToggle } from "@/components/pages/saas-admin/components/layout/ModeToggle";
import { ProfileDropdown } from "@/components/pages/saas-admin/components/shared/ProfileDropdown";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppearanceCustomizer } from "./AppearanceCustomizer";

const Header = () => {
	const pathname = usePathname();
	const { t, showCustomizer } = useSaasAdmin();

	const segments = pathname.split("/").filter(Boolean);

	return (
		<header className="bg-card sticky top-0 z-50 border-b">
			<div className="saas-admin-container mx-auto flex min-h-[59px] max-w-360 items-center justify-between gap-6 px-4 py-2 sm:px-6">
				<div className="flex items-center gap-4">
					<SidebarTrigger
						aria-label={t("Toggle Sidebar")}
						className="[&_svg]:size-5!"
					/>
					<Separator
						orientation="vertical"
						className="hidden h-4! data-vertical:self-center sm:block"
					/>
					<Breadcrumb className="hidden sm:block">
						<BreadcrumbList>
							{segments.map((segment, index) => {
								const isLast = index === segments.length - 1;
								const label = segment
									.replace(/-/g, " ")
									.replace(/\b\w/g, (c) => c.toUpperCase());
								const href = "/" + segments.slice(0, index + 1).join("/");

								return (
									<Fragment key={href}>
										<BreadcrumbItem>
											{isLast ? (
												<BreadcrumbPage>
													<SaasAdminText>{label}</SaasAdminText>
												</BreadcrumbPage>
											) : (
												<BreadcrumbLink>
													<SaasAdminText>{label}</SaasAdminText>
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
										{!isLast && <BreadcrumbSeparator />}
									</Fragment>
								);
							})}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="flex items-center gap-1.5">
					<ModeToggle />
					{showCustomizer && <AppearanceCustomizer />}
					<LanguageDropdown
						trigger={
							<Button variant="ghost" size="icon-lg" aria-label={t("Language")}>
								<LanguagesIcon />
							</Button>
						}
					/>
					<ProfileDropdown />
				</div>
			</div>
		</header>
	);
};

export { Header };
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
