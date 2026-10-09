"use client";

import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
	SaasAdminProvider,
	useSaasAdminOptional,
	SaasAdminText,
	type SaasAdminEnvironmentProps,
} from "./environment";
import { SaasAdminTheme } from "./theme";

export function SaasAdminPageFrame({
	children,
	className,
	pageTitle,
	...environment
}: SaasAdminEnvironmentProps & { children: ReactNode; pageTitle?: string }) {
	const inherited = useSaasAdminOptional();
	const title = pageTitle;
	const heading = title ? (
		<h1 className="sr-only">
			<SaasAdminText>{title}</SaasAdminText>
		</h1>
	) : null;
	if (inherited)
		return (
			<SaasAdminProvider {...environment}>
				<div className={className}>
					{heading}
					{children}
				</div>
			</SaasAdminProvider>
		);
	return (
		<SaasAdminProvider {...environment}>
			<SaasAdminTheme className={className}>
				<TooltipProvider>
					{heading}
					{children}
					<Toaster theme={environment.mode ?? "system"} />
				</TooltipProvider>
			</SaasAdminTheme>
		</SaasAdminProvider>
	);
}
