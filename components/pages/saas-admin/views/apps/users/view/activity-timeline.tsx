// biome-ignore-all lint/suspicious/noArrayIndexKey: Approved upstream structure and stable sample ordering are retained.
"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";
// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/apps/users/view/activity-timeline.tsx
// Third-party Imports
import {
	FileIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	ImageIcon,
} from "lucide-react";

// Type Imports
import type {
	ActivityFileType,
	UserActivityItem,
} from "@/components/pages/saas-admin/types/apps/user-types";

// Component Imports
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Timeline,
	TimelineContent,
	TimelineDot,
	TimelineHeading,
	TimelineItem,
	TimelineLine,
} from "@/components/pages/saas-admin/blocks/activity-timeline-primitives";

// Util Imports
import { cn } from "@/lib/utils";

const ATTACHMENT_FILE_ICONS: Record<ActivityFileType, typeof FileTextIcon> = {
	pdf: FileTextIcon,
	image: ImageIcon,
	doc: FileIcon,
	excel: FileSpreadsheetIcon,
};

const ATTACHMENT_BADGE_STYLES: Record<ActivityFileType, string> = {
	pdf: "border-red-600 text-red-600 dark:border-red-400 dark:text-red-400",
	image: "border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400",
	doc: "border-primary text-primary",
	excel:
		"border-green-600 text-green-800 dark:border-green-400 dark:text-green-400",
};

function ActivityAttachment({
	attachment,
}: {
	attachment: NonNullable<UserActivityItem["attachment"]>;
}) {
	const FileIconComponent = ATTACHMENT_FILE_ICONS[attachment.fileType];

	return (
		<Badge
			variant="outline"
			className={cn(
				"h-auto gap-1.5 rounded-sm px-2 py-1 font-normal",
				ATTACHMENT_BADGE_STYLES[attachment.fileType],
			)}
		>
			<FileIconComponent className="size-3.5" />
			<SaasAdminText>{attachment.name}</SaasAdminText>
		</Badge>
	);
}

function ActivityPersonCard({
	person,
}: {
	person: NonNullable<UserActivityItem["person"]>;
}) {
	return (
		<div className="bg-muted/50 flex w-fit max-w-sm items-center gap-3 rounded-md border px-3 py-2.5">
			<Avatar className="size-8">
				{person.avatar ? (
					<AvatarImage src={person.avatar} alt={person.name} />
				) : null}
				<AvatarFallback className="text-xs">
					<SaasAdminText>{person.initials}</SaasAdminText>
				</AvatarFallback>
			</Avatar>
			<div className="min-w-0">
				<p className="truncate text-sm font-medium">
					<SaasAdminText>{person.name}</SaasAdminText>
				</p>
				{person.role ? (
					<p className="text-muted-foreground truncate text-xs">
						<SaasAdminText>{person.role}</SaasAdminText>
					</p>
				) : null}
			</div>
		</div>
	);
}

function ActivityTeamAvatars({
	teamMembers,
	teamExtraCount,
}: {
	teamMembers: NonNullable<UserActivityItem["teamMembers"]>;
	teamExtraCount?: number;
}) {
	const visibleMembers = teamMembers.slice(0, 3);

	return (
		<AvatarGroup>
			{visibleMembers.map((member, index) => (
				<Avatar
					key={`${member.name}-${index}`}
					className="ring-background ring-2"
					size="sm"
				>
					{member.avatar ? (
						<AvatarImage src={member.avatar} alt={member.name} />
					) : null}
					<AvatarFallback className="text-[10px]">
						<SaasAdminText>{member.initials}</SaasAdminText>
					</AvatarFallback>
				</Avatar>
			))}
			{teamExtraCount ? (
				<AvatarGroupCount>
					<SaasAdminText>{"+"}</SaasAdminText>
					<SaasAdminText>{teamExtraCount}</SaasAdminText>
				</AvatarGroupCount>
			) : null}
		</AvatarGroup>
	);
}

export interface ActivityTimelineProps {
	activityLog: UserActivityItem[];
}

export function ActivityTimeline({ activityLog }: ActivityTimelineProps) {
	return (
		<div className="flex flex-col gap-2.5">
			<Timeline>
				{activityLog.map((item, index) => {
					const isLast = index === activityLog.length - 1;

					return (
						<TimelineItem key={item.id} status="done" className="gap-x-0">
							<TimelineDot
								status="custom"
								className="bg-primary/20 flex size-4.5 shrink-0 items-center justify-center rounded-full"
							>
								<span className="bg-primary size-3 rounded-full" />
							</TimelineDot>
							{!isLast && <TimelineLine done className="bg-muted min-h-10" />}
							<TimelineHeading className="text-foreground flex w-full items-center justify-between pt-2.5 pb-2 pl-4 text-sm font-medium text-wrap md:text-base">
								<SaasAdminText>{item.description}</SaasAdminText>
								<span className="text-muted-foreground text-xs font-normal text-nowrap md:text-sm">
									<SaasAdminText>{item.timestamp}</SaasAdminText>
								</span>
							</TimelineHeading>
							{item.detail ||
							item.attachment ||
							item.person ||
							(item.teamMembers && item.teamMembers.length) ? (
								<TimelineContent className="flex flex-col gap-2 pb-3 pl-4">
									{item.detail ? (
										<span className="text-muted-foreground text-sm">
											<SaasAdminText>{item.detail}</SaasAdminText>
										</span>
									) : null}
									{item.attachment ? (
										<ActivityAttachment attachment={item.attachment} />
									) : null}
									{item.person ? (
										<ActivityPersonCard person={item.person} />
									) : null}
									{item.teamMembers?.length ? (
										<ActivityTeamAvatars
											teamMembers={item.teamMembers}
											teamExtraCount={item.teamExtraCount}
										/>
									) : null}
								</TimelineContent>
							) : null}
						</TimelineItem>
					);
				})}
			</Timeline>
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
