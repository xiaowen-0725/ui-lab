"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";

const SPACES = [
  { value: "components", labelKey: "components", href: "/components/motion" },
  { value: "blocks", labelKey: "blocks", href: "/components/blocks" },
] as const;

/** Top-level space switcher — the library's own Tabs in controlled mode, driven by the route. */
export function HeaderTabs({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname.startsWith("/components/blocks")
    ? "blocks"
    : pathname.startsWith("/components")
      ? "components"
      : "";

  return (
    <Tabs
      value={active}
      onValueChange={(v) => {
        const space = SPACES.find((s) => s.value === v);
        if (space) {
          router.push(space.href);
          onNavigate?.();
        }
      }}
    >
      <TabsList>
        {SPACES.map((s) => (
          <TabsTrigger key={s.value} value={s.value} className="text-xs">
            {t(s.labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
