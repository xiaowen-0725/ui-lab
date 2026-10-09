import { notFound } from "next/navigation";
import { AdminWorkspaceDemo } from "@/components/app/admin-workspace-demo";
import {
  ADMIN_WORKSPACE_SCREENS,
  isAdminWorkspaceScreen,
} from "@/components/site-shells/admin-workspace-screens";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ADMIN_WORKSPACE_SCREENS.map((screen) => ({
    screen: screen === "overview" ? [] : [screen],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; screen?: string[] }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Admin workspace" : "管理工作区" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; screen?: string[] }>;
}) {
  const { screen } = await params;
  const current = screen?.[0] ?? "overview";
  if ((screen?.length ?? 0) > 1 || !isAdminWorkspaceScreen(current)) notFound();
  return <AdminWorkspaceDemo screen={current} />;
}
