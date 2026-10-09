"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/pages/user-settings/general/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Component Imports
import { Separator } from "@/components/ui/separator";

// Component Imports
import { ConnectedAccount as ConnectAccount } from "@/components/pages/saas-admin/views/pages/user-settings/general/connect-account";
import { DangerZone } from "@/components/pages/saas-admin/views/pages/user-settings/general/danger-zone";
import { EmailPass } from "@/components/pages/saas-admin/views/pages/user-settings/general/email-password";
import { PersonalInfo } from "@/components/pages/saas-admin/views/pages/user-settings/general/personal-info";
import { SocialUrl } from "@/components/pages/saas-admin/views/pages/user-settings/general/social-url";

const UserGeneral = () => {
	return (
		<section className="py-3">
			<PersonalInfo />
			<Separator className="my-10" />
			<EmailPass />
			<Separator className="my-10" />
			<ConnectAccount />
			<Separator className="my-10" />
			<SocialUrl />
			<Separator className="my-10" />
			<DangerZone />
		</section>
	);
};

export { UserGeneral };
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
