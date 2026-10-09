"use client";
import { SaasAdminText } from "@/components/pages/saas-admin/environment";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/components/layout/Footer.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Next Imports
import { SaasAdminLink as Link } from "@/components/pages/saas-admin/environment";

const Footer = () => {
	return (
		<footer>
			<div className="text-muted-foreground mx-auto flex size-full max-w-360 items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
				<p className="text-sm text-balance max-sm:text-center">
					<SaasAdminText>{`©${new Date().getFullYear()}`}</SaasAdminText>
					<SaasAdminText> </SaasAdminText>
					<Link
						href="https://shadcnstudio.com"
						target="_blank"
						className="text-primary underline underline-offset-4"
					>
						<SaasAdminText>{"shadcn/studio"}</SaasAdminText>
					</Link>
					<SaasAdminText>{", Made for better web design"}</SaasAdminText>
				</p>
				<div className="flex items-center gap-5 max-sm:hidden">
					<Link
						href="https://shadcnstudio.com/license"
						target="_blank"
						className="text-muted-foreground hover:text-foreground text-sm transition duration-300"
					>
						<SaasAdminText>{"License"}</SaasAdminText>
					</Link>
					<Link
						href="https://shadcnstudio.com/templates/admin-dashboard"
						target="_blank"
						className="text-muted-foreground hover:text-foreground text-sm transition duration-300"
					>
						<SaasAdminText>{"More Dashboards"}</SaasAdminText>
					</Link>
					<Link
						href="https://shadcnstudio.com/docs/documentation-admin/getting-started"
						target="_blank"
						className="text-muted-foreground hover:text-foreground text-sm transition duration-300"
					>
						<SaasAdminText>{"Documentation"}</SaasAdminText>
					</Link>
					<Link
						href="https://shadcnstudio.com/support"
						target="_blank"
						className="text-muted-foreground hover:text-foreground text-sm transition duration-300"
					>
						<SaasAdminText>{"Support"}</SaasAdminText>
					</Link>
				</div>
			</div>
		</footer>
	);
};

export { Footer };
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
