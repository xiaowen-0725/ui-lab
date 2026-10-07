"use client";

import type { ComponentProps } from "react";
import { NavbarSimple } from "@/components/sections/basics";

// Supply your own content, data, and callbacks through the installed component's props.
export function NavbarSimpleExample(props: ComponentProps<typeof NavbarSimple>) {
  return <NavbarSimple locale="zh" {...props} />;
}
