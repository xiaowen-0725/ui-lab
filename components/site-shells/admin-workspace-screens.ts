export const ADMIN_WORKSPACE_SCREENS = [
  "overview",
  "board",
  "inbox",
  "calendar",
  "customers",
] as const;

export type AdminWorkspaceScreen = (typeof ADMIN_WORKSPACE_SCREENS)[number];

export function isAdminWorkspaceScreen(value: string): value is AdminWorkspaceScreen {
  return (ADMIN_WORKSPACE_SCREENS as readonly string[]).includes(value);
}
