"use client";

import type { ComponentProps } from "react";
import { CustomerBookPage } from "@/components/pages/customer-book-page";

// Supply your own content and callbacks through the installed component's props.
export function CustomerBookPageExample(props: ComponentProps<typeof CustomerBookPage>) {
  return <CustomerBookPage locale="zh" {...props} />;
}
