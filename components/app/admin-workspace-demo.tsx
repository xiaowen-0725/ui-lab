"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  AdminWorkspaceSite,
  type AdminWorkspaceScreen,
} from "@/components/site-shells/admin-workspace-site";
import { focusRing } from "@/components/pages/workspace-app-ui";
import { cn } from "@/lib/utils";

export function AdminWorkspaceDemo({ screen }: { screen: AdminWorkspaceScreen }) {
  const router = useRouter();
  const locale = useLocale() === "en" ? "en" : "zh";
  return (
    <AdminWorkspaceSite
      className="h-dvh"
      locale={locale}
      value={screen}
      onChange={(next) => {
        const href =
          next === "overview"
            ? "/sites/admin-workspace-site/demo"
            : `/sites/admin-workspace-site/demo/${next}`;
        router.push(href);
      }}
      headerActions={<DemoThemeToggle locale={locale} />}
    />
  );
}

function DemoThemeToggle({ locale }: { locale: "zh" | "en" }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={locale === "zh" ? "切换明暗" : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground",
        focusRing,
      )}
    >
      {mounted ? (
        isDark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
