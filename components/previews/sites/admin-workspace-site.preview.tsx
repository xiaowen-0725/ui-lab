"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  AdminWorkspaceSite,
  type AdminWorkspaceScreen,
} from "@/components/site-shells/admin-workspace-site";

export function AdminWorkspaceSitePreview() {
  const [locale, setLocale] = useState<"zh" | "en">(useLocale() === "en" ? "en" : "zh");
  const [screen, setScreen] = useState<AdminWorkspaceScreen>("overview");
  const href =
    screen === "overview"
      ? "/sites/admin-workspace-site/demo"
      : `/sites/admin-workspace-site/demo/${screen}`;
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => setLocale((current) => (current === "zh" ? "en" : "zh"))}
        >
          {locale === "zh" ? "English" : "中文"}
        </button>
        <Link href={href} className="font-medium text-foreground underline-offset-4 hover:underline">
          {locale === "zh" ? "打开完整演示" : "Open the full demo"}
        </Link>
      </div>
      <div className="h-[44rem] overflow-hidden rounded-xl border border-border">
        <AdminWorkspaceSite key={`${locale}-${screen}`} locale={locale} value={screen} onChange={setScreen} />
      </div>
    </div>
  );
}
