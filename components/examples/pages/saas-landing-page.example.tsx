"use client";

import type { ComponentProps } from "react";
import { SaasLandingPage } from "@/components/pages/saas-landing-page";

// Supply your own content, data, and callbacks through the installed component's props.
export function SaasLandingPageExample(props: ComponentProps<typeof SaasLandingPage>) {
  return <SaasLandingPage locale="zh" {...props} />;
}
