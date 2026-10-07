"use client";

import type { ComponentProps } from "react";
import { WorkbenchSettingsPage } from "@/components/pages/workbench-settings-page";

// Supply your own content, data, and callbacks through the installed component's props.
export function WorkbenchSettingsPageExample(props: ComponentProps<typeof WorkbenchSettingsPage>) {
  return <WorkbenchSettingsPage locale="zh" {...props} />;
}
