"use client";

import type { ReactElement, ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function initialsOf(name: string) {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.slice(0, 1))
		.join("")
		.toUpperCase();
}

export function PersonAvatar({
	name,
	size = "default",
}: {
	name: string;
	size?: "default" | "sm";
}) {
	return (
		<Avatar size={size} aria-hidden="true">
			<AvatarFallback>{initialsOf(name)}</AvatarFallback>
		</Avatar>
	);
}

export function IconTip({
	label,
	trigger,
	children,
}: {
	label: string;
	trigger: ReactElement;
	children?: ReactNode;
}) {
	return (
		<Tooltip>
			<TooltipTrigger render={trigger}>{children}</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}

export function TruncateTip({
	text,
	children,
}: {
	text: string;
	children: ReactNode;
}) {
	return (
		<Tooltip>
			<TooltipTrigger render={<span className="min-w-0 truncate" />}>
				{children}
			</TooltipTrigger>
			<TooltipContent>{text}</TooltipContent>
		</Tooltip>
	);
}
