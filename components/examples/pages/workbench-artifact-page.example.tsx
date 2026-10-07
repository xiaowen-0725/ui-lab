"use client";

import type { ComponentProps } from "react";
import { WorkbenchArtifactPage } from "@/components/pages/workbench-artifact-page";

// Supply your own content, data, and callbacks through the installed component's props.
export function WorkbenchArtifactPageExample(props: ComponentProps<typeof WorkbenchArtifactPage>) {
  return <WorkbenchArtifactPage locale="zh" {...props} />;
}
