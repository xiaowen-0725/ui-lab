"use client";

import type { ComponentProps } from "react";
import { FaqAccordion } from "@/components/sections/commerce";

// Supply your own content, data, and callbacks through the installed component's props.
export function FaqAccordionExample(props: ComponentProps<typeof FaqAccordion>) {
  return <FaqAccordion locale="zh" {...props} />;
}
