"use client";

import type { ComponentProps } from "react";
import { AdminWorkspaceSite } from "@/components/site-shells/admin-workspace-site";

// Supply your own locale, screen, and header actions through the installed component's props.
export function AdminWorkspaceSiteExample(props: ComponentProps<typeof AdminWorkspaceSite>) {
  return <AdminWorkspaceSite locale="zh" {...props} />;
}
