"use client";

import type { JSX, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	type SaasAdminEnvironmentProps,
	SaasAdminProvider,
	SaasAdminText,
	useSaasAdminOptional,
} from "./environment";
import { SaasAdminTheme } from "./theme";

interface SaasAdminPageFrameProps extends SaasAdminEnvironmentProps {
	children: ReactNode;
	pageTitle?: string;
}

export function SaasAdminPageFrame({
	children,
	className,
	pageTitle,
	...environment
}: SaasAdminPageFrameProps): JSX.Element {
	const inherited = useSaasAdminOptional();
	const heading = pageTitle ? (
		<h1 className="sr-only">
			<SaasAdminText>{pageTitle}</SaasAdminText>
		</h1>
	) : null;
	let content: ReactNode;
	if (inherited) {
		content = (
			<div className={className}>
				{heading}
				{children}
			</div>
		);
	} else {
		content = (
			<SaasAdminTheme className={className}>
				<TooltipProvider>
					{heading}
					{children}
					<Toaster theme={environment.mode ?? "system"} />
				</TooltipProvider>
			</SaasAdminTheme>
		);
	}
	return (
		<SaasAdminProvider {...environment}>{content}</SaasAdminProvider>
	);
}
