"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/types/pages/user-profile-types.ts
// Adaptation: named exports and portable import/navigation boundaries.
// Activity Timeline - Profile Section Types
export type ActivityFileType = "pdf" | "image" | "doc" | "excel";

export type ActivityAttachment = {
	name: string;
	fileType: ActivityFileType;
};

export type ActivityPerson = {
	name: string;
	initials: string;
	avatar?: string;
	role?: string;
};

export type ActivityTeamMember = {
	name: string;
	initials: string;
	avatar?: string;
};

export type UserActivityItem = {
	id: string | number;
	description: string;
	timestamp: string;
	detail?: string;
	attachment?: ActivityAttachment;
	person?: ActivityPerson;
	teamMembers?: ActivityTeamMember[];
	teamExtraCount?: number;
};

// About Section - Profile Section Types
export type UserProfileInfoIconKey =
	| "UserIcon"
	| "CheckCheckIcon"
	| "StarIcon"
	| "FlagIcon"
	| "LanguagesIcon"
	| "PhoneIcon"
	| "MessagesSquareIcon"
	| "MailIcon";

export type UserProfileOverviewIconKey =
	| "CheckIcon"
	| "UserIcon"
	| "LayoutGridIcon";

export type UserProfileSectionItem = {
	label: string;
	value: string;
	iconKey?: UserProfileInfoIconKey | UserProfileOverviewIconKey;
};

export type UserProfileSection = {
	title: string;
	items: UserProfileSectionItem[];
};

// Connections - Profile Section Types
export type UserConnectionItem = {
	id: string | number;
	name: string;
	initials: string;
	avatar?: string;
	totalConnections: string;
	isConnected: boolean;
};

// Connections Card - Connection Section Types
export type ConnectionCardTag = {
	label: string;
};

export type ConnectionCardStats = {
	projects: string;
	tasks: string;
	connections: string;
};

export type ConnectionCardItem = UserConnectionItem & {
	role: string;
	tags: ConnectionCardTag[];
	stats: ConnectionCardStats;
};

// Team - Profile Section Types
export type UserTeamItem = {
	id: string | number;
	teams: string;
	initials: string;
	avatar?: string;
	totalMembers: string;
	teamBadge: {
		label: string;
	};
};

// Project - Profile Section
export type UserProjectTeamMember = {
	avatar?: string;
	initials: string;
};

export interface UserProject {
	id: string;
	name: string;
	type: string;
	logo?: string;
	leader: string;
	team: { avatar?: string; initials: string }[];
	teamExtraCount?: number;
	progress: number;
	updatedAt?: string;
}

export interface ProfileProjectDatatableProps {
	className?: string;
}

export type ProjectDatatableTeamMember = {
	avatar?: string;
	initials: string;
};

export interface ProjectDatatable {
	id: string;
	name: string;
	type: string;
	logo?: string;
	logoDark?: string;
	leader: string;
	team: ProjectDatatableTeamMember[];
	teamExtraCount?: number;
	progress: number;
	updatedAt?: string;
}

// All User Profile Page Data Types
export type UserProfilePageData = {
	profileSections: UserProfileSection[];
	overviewSections: UserProfileSection[];
	activityLog: UserActivityItem[];
	projectDatatable: ProjectDatatable[];
	connectionActions: string[];
	connections: UserConnectionItem[];
	connectionCardActions: string[];
	connectionCards: ConnectionCardItem[];
	teamActions: string[];
	teams: UserTeamItem[];
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
