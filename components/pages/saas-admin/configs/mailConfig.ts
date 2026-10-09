"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/configs/mailConfig.ts
// Adaptation: named exports and portable import/navigation boundaries.
// Third-party Imports
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

// Type Imports
import type {
	EmailLabel,
	EmailStatus,
} from "@/components/pages/saas-admin/types/apps/mail-types";

export const MAIL_CURRENT_USER = {
	name: "You",
	email: "you@example.com",
	avatar: undefined as string | undefined,
};

export type MailNavStatusItem = {
	id: EmailStatus;
	label: string;
};

export type MailNavLabelItem = {
	id: EmailLabel;
	label: string;
};

export type MailNavLabelStyle = MailNavLabelItem & {
	color: string;
};

export type MailNavStatusItemWithCount = MailNavStatusItem & {
	count: number;
};

export type MailNavLabelItemWithCount = MailNavLabelItem & {
	count: number;
};

export const MAIL_STATUS_NAV_ITEMS: MailNavStatusItem[] = [
	{ id: "inbox", label: "Inbox" },
	{ id: "drafts", label: "Drafts" },
	{ id: "sent", label: "Sent" },
	{ id: "spam", label: "Spam" },
	{ id: "trash", label: "Trash" },
	{ id: "archive", label: "Archive" },
];

export const MAIL_LABEL_NAV_ITEMS: MailNavLabelItem[] = [
	{ id: "social", label: "Social" },
	{ id: "updates", label: "Updates" },
	{ id: "forums", label: "Forums" },
	{ id: "shopping", label: "Shopping" },
	{ id: "promotions", label: "Promotions" },
];

export const MAIL_LABEL_STYLES: MailNavLabelStyle[] = [
	{ id: "social", label: "Social", color: "bg-violet-500" },
	{ id: "updates", label: "Updates", color: "bg-teal-500" },
	{ id: "forums", label: "Forums", color: "bg-orange-500" },
	{ id: "shopping", label: "Shopping", color: "bg-lime-500" },
	{ id: "promotions", label: "Promotions", color: "bg-pink-500" },
];

export const getInitialsFromName = (name: string) => {
	return name
		.split(" ")
		.map((namePart) => namePart[0])
		.join("");
};

export const formatMailDate = (date: Date) => {
	const diffMs = Date.now() - date.getTime();

	if (diffMs < 60_000) {
		return "Just now";
	}

	if (isToday(date)) {
		return formatDistanceToNow(date, { addSuffix: true }).replace(
			/^about /,
			"",
		);
	}

	if (isYesterday(date)) {
		return "Yesterday";
	}

	return format(date, "MMM d");
};

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
