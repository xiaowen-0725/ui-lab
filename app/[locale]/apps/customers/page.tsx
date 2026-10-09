import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppsShell } from "@/components/app/apps/apps-shell";
import { CustomersApp } from "@/components/app/apps/customers/customers-app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apps");
  return {
    title: t("customersTitle"),
    description: t("customersDescription"),
  };
}

export default function CustomersPage() {
  return (
    <AppsShell>
      <CustomersApp />
    </AppsShell>
  );
}
