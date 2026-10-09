"use client";
import {
	imageImagesAvatarsAvatar10Webp,
	imageImagesAvatarsAvatar11Webp,
	imageImagesAvatarsAvatar12Webp,
	imageImagesAvatarsAvatar1Webp,
	imageImagesAvatarsAvatar2Webp,
	imageImagesAvatarsAvatar3Webp,
	imageImagesAvatarsAvatar4Webp,
	imageImagesAvatarsAvatar5Webp,
	imageImagesAvatarsAvatar6Webp,
	imageImagesAvatarsAvatar7Webp,
	imageImagesAvatarsAvatar8Webp,
	imageImagesAvatarsAvatar9Webp,
	imageImagesBrandsFigmaIconWebp,
	imageImagesBrandsGithubIconWebp,
	imageImagesBrandsGithubWhiteWebp,
	imageImagesBrandsLaravelLogoWebp,
	imageImagesBrandsMcpIconDarkWebp,
	imageImagesBrandsMcpIconWebp,
	imageImagesBrandsNextLogoDarkWebp,
	imageImagesBrandsNextLogoWebp,
	imageImagesBrandsReactLogoWebp,
	imageImagesBrandsShadcnLogoWebp,
} from "@/components/pages/saas-admin/assets/images";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/fake-db/pages/user-profile.ts
// Adaptation: named exports and portable import/navigation boundaries.
import type { UserProfilePageData } from "@/components/pages/saas-admin/types/pages/user-profile-types";

export const db: UserProfilePageData = {
	// About Section - Profile Section Data
	profileSections: [
		{
			title: "About",
			items: [
				{ iconKey: "UserIcon", label: "Full Name", value: "John Doe" },
				{ iconKey: "CheckCheckIcon", label: "Status", value: "Active" },
				{ iconKey: "StarIcon", label: "Role", value: "Developer" },
				{ iconKey: "FlagIcon", label: "Country", value: "USA" },
				{ iconKey: "LanguagesIcon", label: "Languages", value: "English" },
			],
		},
		{
			title: "Contacts",
			items: [
				{ iconKey: "PhoneIcon", label: "Contact", value: "(123) 456-7890" },
				{ iconKey: "MessagesSquareIcon", label: "Skype", value: "John.doe" },
				{ iconKey: "MailIcon", label: "Email", value: "john.doe@example.com" },
			],
		},
		{
			title: "Teams",
			items: [
				{ label: "Backend Developer", value: "(126 Members)" },
				{ label: "React Developer", value: "(34 Members)" },
			],
		},
	],
	overviewSections: [
		{
			title: "Overview",
			items: [
				{ iconKey: "CheckIcon", label: "Task Compiled", value: "13.5k" },
				{ iconKey: "UserIcon", label: "Connections", value: "897" },
				{ iconKey: "LayoutGridIcon", label: "Projects Compiled", value: "146" },
			],
		},
	],

	// Activity Timeline - Profile Section Data
	activityLog: [
		{
			id: 1,
			description: "12 Invoices have been paid",
			timestamp: "12 min ago",
			detail: "Invoices have been paid to the company.",
			attachment: {
				name: "invoice.pdf",
				fileType: "pdf",
			},
		},
		{
			id: 2,
			description: "Client Meeting",
			timestamp: "45 min ago",
			detail: "Project meeting with john @10:15am",
			person: {
				name: "Lester McCarthy (Client)",
				initials: "LM",
				role: "CEO of ThemeSelection",
				avatar: imageImagesAvatarsAvatar3Webp,
			},
		},
		{
			id: 3,
			description: "Create a new project for client",
			timestamp: "2 Day Ago",
			detail: "6 team members in a project",
			teamMembers: [
				{
					name: "Alex Carter",
					initials: "AC",
					avatar: imageImagesAvatarsAvatar1Webp,
				},
				{
					name: "Mia Stewart",
					initials: "MS",
					avatar: imageImagesAvatarsAvatar2Webp,
				},
				{
					name: "Noah Wilson",
					initials: "NW",
					avatar: imageImagesAvatarsAvatar4Webp,
				},
			],
			teamExtraCount: 3,
		},
	],

	// Project - Profile Section Data
	projectDatatable: [
		{
			id: "upp-001",
			name: "Atlas CRM Revamp",
			type: "Figma Project",
			logo: imageImagesBrandsFigmaIconWebp,
			logoDark: imageImagesBrandsFigmaIconWebp,
			leader: "Olivia Reed",
			team: [
				{ avatar: imageImagesAvatarsAvatar1Webp, initials: "OR" },
				{ avatar: imageImagesAvatarsAvatar3Webp, initials: "JD" },
			],
			teamExtraCount: 2,
			progress: 82,
			updatedAt: "Updated 2 days ago",
		},
		{
			id: "upp-002",
			name: "Nimbus Analytics Portal",
			type: "Next Project",
			logo: imageImagesBrandsNextLogoWebp,
			logoDark: imageImagesBrandsNextLogoDarkWebp,
			leader: "Liam Cooper",
			team: [
				{ avatar: imageImagesAvatarsAvatar2Webp, initials: "LC" },
				{ avatar: imageImagesAvatarsAvatar4Webp, initials: "MP" },
			],
			teamExtraCount: 1,
			progress: 64,
			updatedAt: "Updated 5 days ago",
		},
		{
			id: "upp-003",
			name: "Shadcn UI Admin Dashboard",
			type: "Shadcn Project",
			logo: imageImagesBrandsShadcnLogoWebp,
			logoDark: imageImagesBrandsShadcnLogoWebp,
			leader: "Sophia Patel",
			team: [
				{ avatar: imageImagesAvatarsAvatar5Webp, initials: "SP" },
				{ initials: "AL" },
			],
			teamExtraCount: 3,
			progress: 47,
			updatedAt: "Updated 1 day ago",
		},
		{
			id: "upp-004",
			name: "Vertex System",
			type: "Laravel Project",
			logo: imageImagesBrandsLaravelLogoWebp,
			logoDark: imageImagesBrandsLaravelLogoWebp,
			leader: "Noah Bennett",
			team: [
				{ avatar: imageImagesAvatarsAvatar7Webp, initials: "NB" },
				{ avatar: imageImagesAvatarsAvatar8Webp, initials: "EA" },
				{ initials: "RB" },
			],
			teamExtraCount: 2,
			progress: 91,
			updatedAt: "Updated 3 days ago",
		},
		{
			id: "upp-005",
			name: "Pulse API Gateway",
			type: "MCP Project",
			logo: imageImagesBrandsMcpIconWebp,
			logoDark: imageImagesBrandsMcpIconDarkWebp,
			leader: "Ava Collins",
			team: [
				{ avatar: imageImagesAvatarsAvatar9Webp, initials: "AC" },
				{
					avatar: imageImagesAvatarsAvatar10Webp,
					initials: "DN",
				},
			],
			teamExtraCount: 1,
			progress: 58,
			updatedAt: "Updated 6 days ago",
		},
		{
			id: "upp-006",
			name: "eCommerce Website",
			type: "React Project",
			logo: imageImagesBrandsReactLogoWebp,
			logoDark: imageImagesBrandsReactLogoWebp,
			leader: "Ethan Miles",
			team: [
				{
					avatar: imageImagesAvatarsAvatar11Webp,
					initials: "EM",
				},
				{
					avatar: imageImagesAvatarsAvatar12Webp,
					initials: "HS",
				},
			],
			teamExtraCount: 4,
			progress: 36,
			updatedAt: "Updated 4 days ago",
		},
		{
			id: "upp-007",
			name: "Mercury Billing Engine",
			type: "MCP Project",
			logo: imageImagesBrandsMcpIconWebp,
			logoDark: imageImagesBrandsMcpIconDarkWebp,
			leader: "Mia Turner",
			team: [
				{ avatar: imageImagesAvatarsAvatar1Webp, initials: "MT" },
				{ avatar: imageImagesAvatarsAvatar6Webp, initials: "CK" },
				{ initials: "FG" },
			],
			teamExtraCount: 0,
			progress: 73,
			updatedAt: "Updated 7 days ago",
		},
		{
			id: "upp-008",
			name: "Quasar Support Desk",
			type: "Next Project",
			logo: imageImagesBrandsNextLogoWebp,
			logoDark: imageImagesBrandsNextLogoDarkWebp,
			leader: "Jacob Lee",
			team: [
				{ avatar: imageImagesAvatarsAvatar3Webp, initials: "JL" },
				{ avatar: imageImagesAvatarsAvatar8Webp, initials: "RW" },
				{ initials: "NH" },
			],
			teamExtraCount: 0,
			progress: 69,
			updatedAt: "Updated 8 days ago",
		},
		{
			id: "upp-009",
			name: "Beacon Knowledge Base",
			type: "Nuxt Project",
			logo: imageImagesBrandsGithubIconWebp,
			logoDark: imageImagesBrandsGithubWhiteWebp,
			leader: "Isabella Gray",
			team: [
				{ avatar: imageImagesAvatarsAvatar4Webp, initials: "IG" },
				{ avatar: imageImagesAvatarsAvatar9Webp, initials: "PS" },
			],
			teamExtraCount: 3,
			progress: 54,
			updatedAt: "Updated 10 days ago",
		},
		{
			id: "upp-010",
			name: "Figma Design System",
			type: "UI Project",
			logo: imageImagesBrandsFigmaIconWebp,
			logoDark: imageImagesBrandsFigmaIconWebp,
			leader: "Henry Foster",
			team: [
				{ avatar: imageImagesAvatarsAvatar2Webp, initials: "HF" },
				{ avatar: imageImagesAvatarsAvatar5Webp, initials: "KT" },
				{ initials: "UE" },
			],
			teamExtraCount: 2,
			progress: 88,
			updatedAt: "Updated 12 days ago",
		},
	],

	// Connections - Profile Section Data
	connectionActions: ["Share", "Suggest Edits", "Report Bug"],
	connections: [
		{
			id: 1,
			name: "Cecilia Payne",
			initials: "CP",
			avatar: imageImagesAvatarsAvatar1Webp,
			totalConnections: "45 Connections",
			isConnected: false,
		},
		{
			id: 2,
			name: "Curtis Fletcher",
			initials: "CF",
			avatar: imageImagesAvatarsAvatar2Webp,
			totalConnections: "1.32k Connections",
			isConnected: true,
		},
		{
			id: 3,
			name: "Alice Stone",
			initials: "AS",
			avatar: imageImagesAvatarsAvatar3Webp,
			totalConnections: "125 Connections",
			isConnected: true,
		},
		{
			id: 4,
			name: "Darrell Barnes",
			initials: "DB",
			avatar: imageImagesAvatarsAvatar4Webp,
			totalConnections: "456 Connections",
			isConnected: false,
		},
		{
			id: 5,
			name: "Eugenia Moore",
			initials: "EM",
			avatar: imageImagesAvatarsAvatar5Webp,
			totalConnections: "1.2k Connections",
			isConnected: false,
		},
	],

	// Connections Card - Connection Section Data
	connectionCardActions: ["Share Connection", "Block Connection", "Delete"],
	connectionCards: [
		{
			id: 1,
			name: "Mark Gilbert",
			role: "UI Designer",
			initials: "MG",
			avatar: imageImagesAvatarsAvatar1Webp,
			tags: [{ label: "Figma" }, { label: "Sketch" }],
			stats: {
				projects: "18",
				tasks: "834",
				connections: "129",
			},
			totalConnections: "129 Connections",
			isConnected: true,
		},
		{
			id: 2,
			name: "Eugenia Parsons",
			role: "Developer",
			initials: "EP",
			avatar: imageImagesAvatarsAvatar2Webp,
			tags: [{ label: "Angular" }, { label: "React" }],
			stats: {
				projects: "112",
				tasks: "2.31k",
				connections: "1.28k",
			},
			totalConnections: "1.28k Connections",
			isConnected: false,
		},
		{
			id: 3,
			name: "Francis Byrd",
			role: "Developer",
			initials: "FB",
			avatar: imageImagesAvatarsAvatar3Webp,
			tags: [{ label: "HTML" }, { label: "React" }],
			stats: {
				projects: "32",
				tasks: "1.25k",
				connections: "890",
			},
			totalConnections: "890 Connections",
			isConnected: false,
		},
		{
			id: 4,
			name: "Leon Lucas",
			role: "UI/UX Designer",
			initials: "LL",
			avatar: imageImagesAvatarsAvatar4Webp,
			tags: [{ label: "Figma" }, { label: "Sketch" }, { label: "Photoshop" }],
			stats: {
				projects: "86",
				tasks: "12.4k",
				connections: "890",
			},
			totalConnections: "890 Connections",
			isConnected: false,
		},
		{
			id: 5,
			name: "Jayden Rogers",
			role: "Full Stack Developer",
			initials: "JR",
			avatar: imageImagesAvatarsAvatar5Webp,
			tags: [{ label: "React" }, { label: "HTML" }, { label: "Node.js" }],
			stats: {
				projects: "244",
				tasks: "23.8k",
				connections: "2.14k",
			},
			totalConnections: "2.14k Connections",
			isConnected: true,
		},
		{
			id: 6,
			name: "Jeanette Powell",
			role: "SEO",
			initials: "JP",
			avatar: imageImagesAvatarsAvatar6Webp,
			tags: [{ label: "Analysis" }, { label: "Writing" }],
			stats: {
				projects: "32",
				tasks: "1.28k",
				connections: "1.27k",
			},
			totalConnections: "1.27k Connections",
			isConnected: false,
		},
	],

	// Team - Profile Section Data
	teamActions: ["Share Teams", "Suggest Edits", "Report Bug"],
	teams: [
		{
			id: 1,
			teams: "React Developers",
			initials: "RD",
			avatar: imageImagesAvatarsAvatar1Webp,
			totalMembers: "72 Members",
			teamBadge: {
				label: "Developer",
			},
		},
		{
			id: 2,
			teams: "Vue Developers",
			initials: "VD",
			avatar: imageImagesAvatarsAvatar2Webp,
			totalMembers: "58 Members",
			teamBadge: {
				label: "Developer",
			},
		},
		{
			id: 3,
			teams: "Angular Developers",
			initials: "AD",
			avatar: imageImagesAvatarsAvatar3Webp,
			totalMembers: "65 Members",
			teamBadge: {
				label: "Developer",
			},
		},
		{
			id: 4,
			teams: "UI Designers",
			initials: "UD",
			avatar: imageImagesAvatarsAvatar4Webp,
			totalMembers: "72 Members",
			teamBadge: {
				label: "Designer",
			},
		},
		{
			id: 5,
			teams: "Digital Marketing",
			initials: "DM",
			avatar: imageImagesAvatarsAvatar2Webp,
			totalMembers: "58 Members",
			teamBadge: {
				label: "Marketing",
			},
		},
	],
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
