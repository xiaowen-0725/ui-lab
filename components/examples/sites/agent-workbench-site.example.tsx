"use client";

import type { ComponentProps } from "react";
import { AgentWorkbenchSite } from "@/components/site-shells/agent-workbench-site";

// Supply your own content, data, and callbacks through the installed component's props.
export function AgentWorkbenchSiteExample(props: ComponentProps<typeof AgentWorkbenchSite>) {
  return <AgentWorkbenchSite locale="zh" {...props} />;
}
