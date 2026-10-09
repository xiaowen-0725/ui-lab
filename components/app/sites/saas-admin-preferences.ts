/** Runs before paint; the server falls back to default/system without reading browser storage. */
export const SAAS_ADMIN_PREFERENCE_SCRIPT = `try {
  var saved = JSON.parse(localStorage.getItem("uilab.saas-admin.preferences.v1") || "null");
  var brand = saved && ["default", "blue-ink"].includes(saved.brand) ? saved.brand : "default";
  var mode = saved && ["light", "dark", "system"].includes(saved.mode) ? saved.mode : "system";
  document.documentElement.dataset.saasAdminBrand = brand;
  document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches));
  localStorage.setItem("uilab.saas-admin.mode.v1", mode);
} catch { document.documentElement.dataset.saasAdminBrand = "default"; }`;
