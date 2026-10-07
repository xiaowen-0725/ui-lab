"use client";

import type { ComponentProps } from "react";
import { WorkbenchConversationPage } from "@/components/pages/workbench-conversation-page";

// Supply your own content, data, and callbacks through the installed component's props.
export function WorkbenchConversationPageExample(props: ComponentProps<typeof WorkbenchConversationPage>) {
  return <WorkbenchConversationPage locale="zh" {...props} />;
}
