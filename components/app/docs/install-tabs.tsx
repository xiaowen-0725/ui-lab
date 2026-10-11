"use client";

import { useState, type ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs";

/**
 * CLI / Manual switch. Manual mounts after the tab is opened so catalog pages
 * do not prerender the install source graph into the ISR HTML.
 */
export function InstallTabs({
  cli,
  manual,
}: {
  cli: ReactNode;
  manual: ReactNode;
}) {
  const [value, setValue] = useState("cli");
  const [manualOpened, setManualOpened] = useState(false);

  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        setValue(next);
        if (next === "manual") setManualOpened(true);
      }}
      variant="segment"
    >
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli" className="mt-4">
        {cli}
      </TabsContent>
      <TabsContent value="manual" className="mt-4">
        {manualOpened ? manual : null}
      </TabsContent>
    </Tabs>
  );
}
