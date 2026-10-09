"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/types/apps/mail-types.ts
// Adaptation: named exports and portable import/navigation boundaries.
export type ThreadMessage = {
	id: string;
	from: string;
	fromEmail: string;
	body: string;
	date: Date;
	isFromMe?: boolean;
};

export type EmailLabel =
	| "social"
	| "updates"
	| "forums"
	| "shopping"
	| "promotions";

export type EmailStatus =
	| "inbox"
	| "sent"
	| "drafts"
	| "spam"
	| "trash"
	| "archive";

export type Email = {
	id: string;
	from: string;
	fromEmail: string;
	to?: string;
	toEmail?: string;
	cc?: string;
	bcc?: string;
	avatar?: string;
	subject: string;
	preview: string;
	body: string;
	date: Date;
	isRead: boolean;
	isStarred: boolean;
	labels: EmailLabel[];
	status: EmailStatus;
	thread: {
		messages: ThreadMessage[];
	};
};

export type MailData = {
	emails: Email[];
};

export type MailFilterTab = "all" | "unread";

export type MailNavType = "status" | "label";

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
