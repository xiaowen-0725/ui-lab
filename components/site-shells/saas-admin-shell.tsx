"use client";

// Layout composition from Free AdminCN, MIT, dd1afd2f3a794ea9e746197de314f81d43670ea1.
// Responsibility: responsive navigation and chrome around consumer-owned pages.
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/pages/saas-admin/components/layout/Footer";
import { Header } from "@/components/pages/saas-admin/components/layout/Header";
import { SidebarLayout } from "@/components/pages/saas-admin/components/layout/Sidebar";
import {
	SaasAdminProvider,
	useSaasAdmin,
	SaasAdminText,
	type SaasAdminEnvironmentProps,
} from "@/components/pages/saas-admin/environment";
import { SaasAdminTheme } from "@/components/pages/saas-admin/theme";

export interface SaasAdminShellProps extends SaasAdminEnvironmentProps {
	children?: ReactNode;
	sidebarOpen?: boolean;
	onSidebarOpenChange?: (open: boolean) => void;
}

export function SaasAdminShell({
	children,
	className,
	sidebarOpen,
	onSidebarOpenChange,
	...environment
}: SaasAdminShellProps) {
	return (
		<SaasAdminProvider {...environment}>
			<SaasAdminShellFrame
				className={className}
				sidebarOpen={sidebarOpen}
				onSidebarOpenChange={onSidebarOpenChange}
			>
				{children}
			</SaasAdminShellFrame>
		</SaasAdminProvider>
	);
}

function SaasAdminShellFrame({
	children,
	className,
	sidebarOpen,
	onSidebarOpenChange,
}: Pick<
	SaasAdminShellProps,
	"children" | "className" | "sidebarOpen" | "onSidebarOpenChange"
>) {
	const { appearance, setAppearance, mode } = useSaasAdmin();
	return (
		<SaasAdminTheme className={className}>
			<TooltipProvider>
				<SidebarProvider
					open={sidebarOpen ?? appearance.sidebarOpen}
					onOpenChange={(open) => {
						setAppearance({ ...appearance, sidebarOpen: open });
						onSidebarOpenChange?.(open);
					}}
				>
					<div className="flex h-full w-full min-w-0">
						<a
							href="#saas-admin-content"
							className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:p-3 focus:text-foreground focus:outline focus:outline-2"
						>
							<SaasAdminText>Skip to content</SaasAdminText>
						</a>
						<SidebarLayout />
						<SidebarInset className="flex flex-1 flex-col">
							<Header />
							<div
								id="saas-admin-content"
								tabIndex={-1}
								className="saas-admin-container mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6"
							>
								{children}
							</div>
							<Toaster theme={mode} />
							<Footer />
						</SidebarInset>
					</div>
				</SidebarProvider>
			</TooltipProvider>
		</SaasAdminTheme>
	);
}
