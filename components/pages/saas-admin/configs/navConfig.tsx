"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/configs/navConfig.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Third-party Imports
import {
	Package,
	UsersRound,
	UserRound,
	Settings,
	Table2,
	TextCursorInput,
	ListChecks,
	LogIn,
	UserPlus,
	KeyRound,
} from "lucide-react";
export const NAV_ICONS = {
	Package,
	UsersRound,
	UserRound,
	Settings,
	Table2,
	TextCursorInput,
	ListChecks,
	LogIn,
	UserPlus,
	KeyRound,
};

type IconName = keyof typeof NAV_ICONS;

export type MenuLeafSubItem = {
	label: string;
	href: string;
	activePath?: string;
	badge?: string;
	badgeClassName?: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
};

export type MenuGroupSubItem = {
	label: string;
	childItems: MenuLeafSubItem[];
};

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem;

export type MenuItem = {
	icon: IconName;
	label: string;
} & (
	| {
			href: string;
			badge?: string;
			badgeClassName?: string;
			childItems?: never;
			target?: "_blank" | "_self" | "_parent" | "_top";
	  }
	| {
			href?: never;
			badge?: string;
			badgeClassName?: string;
			childItems: MenuSubItem[];
	  }
);

export type NavItem = {
	groupLabel?: string;
	items: MenuItem[];
};

export const navItems: NavItem[] = [
	{
		groupLabel: "Dashboard & Layouts",
		items: [{ icon: "Package", label: "Orders", href: "/dashboard/orders" }],
	},
	{
		groupLabel: "Apps",
		items: [
			{
				icon: "UsersRound",
				label: "Users",
				childItems: [
					{ label: "List", href: "/apps/users/list" },
					{ label: "View", href: "/apps/users/view" },
				],
			},
		],
	},
	{
		groupLabel: "Pages",
		items: [
			{
				icon: "UserRound",
				label: "User Profile",
				href: "/pages/user-profile?view=profile",
			},
			{
				icon: "Settings",
				label: "User Settings",
				href: "/pages/user-settings?setting=general",
			},
		],
	},
	{
		groupLabel: "Forms & Tables",
		items: [
			{ icon: "Table2", label: "Data Table", href: "/datatable" },
			{
				icon: "TextCursorInput",
				label: "Form Layouts",
				childItems: [
					{ label: "Vertical", href: "/forms/form-layouts/vertical" },
					{ label: "Horizontal", href: "/forms/form-layouts/horizontal" },
				],
			},
			{
				icon: "ListChecks",
				label: "Form Validation",
				href: "/forms/form-validation",
			},
		],
	},
	{
		groupLabel: "Authentication",
		items: [
			{ icon: "LogIn", label: "Login", href: "/pages/auth/login" },
			{ icon: "UserPlus", label: "Register", href: "/pages/auth/register" },
			{
				icon: "KeyRound",
				label: "Forgot Password",
				href: "/pages/auth/forgot-password",
			},
		],
	},
];

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
