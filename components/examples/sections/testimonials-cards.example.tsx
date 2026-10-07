"use client";

import type { ComponentProps } from "react";
import { TestimonialCards } from "@/components/sections/content";

// Supply your own content, data, and callbacks through the installed component's props.
export function TestimonialCardsExample(props: ComponentProps<typeof TestimonialCards>) {
  return <TestimonialCards locale="zh" {...props} />;
}
