"use client";

import type { ComponentProps } from "react";
import { TestimonialQuote } from "@/components/sections/content";

// Supply your own content, data, and callbacks through the installed component's props.
export function TestimonialQuoteExample(props: ComponentProps<typeof TestimonialQuote>) {
  return <TestimonialQuote locale="zh" {...props} />;
}
