"use client";

import type { ComponentProps } from "react";
import { InboxPage } from "@/components/pages/inbox-page";

// Supply your own content and callbacks through the installed component's props.
export function InboxPageExample(props: ComponentProps<typeof InboxPage>) {
  return <InboxPage locale="zh" {...props} />;
}
