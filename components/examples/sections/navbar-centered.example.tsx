"use client";

import type { ComponentProps } from "react";
import { NavbarCentered } from "@/components/sections/basics";

// Supply your own content, data, and callbacks through the installed component's props.
export function NavbarCenteredExample(props: ComponentProps<typeof NavbarCentered>) {
  return <NavbarCentered locale="zh" {...props} />;
}
