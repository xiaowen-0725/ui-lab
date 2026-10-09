// Consumer-level regression against the actual shadcn CLI, pinned for repeatability.
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildShadcnItem, buildThemeItem, buildWorkbenchSystemItem } from "../lib/registry-server";
import { SITE_URL } from "../lib/site";

const fixture = await mkdtemp(join(tmpdir(), "uilab-system-tokens-"));
await mkdir(join(fixture, "app"));
await writeFile(join(fixture, "package.json"), JSON.stringify({
  name: "uilab-token-consumer", private: true,
  dependencies: { next: "15.5.9", react: "19.2.0", "react-dom": "19.2.0", tailwindcss: "4.1.18" },
}));
await writeFile(join(fixture, "tsconfig.json"), JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } } }));
await writeFile(join(fixture, "app/layout.tsx"), "export default function Layout({children}: {children: React.ReactNode}) {return <html><body>{children}</body></html>}\n");
await writeFile(join(fixture, "components.json"), JSON.stringify({
  $schema: "https://ui.shadcn.com/schema.json", style: "new-york", rsc: true, tsx: true,
  tailwind: { config: "", css: "app/globals.css", baseColor: "neutral", cssVariables: true },
  aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/lib/hooks" },
}));
const initial = "@import 'tailwindcss';\n:root { --wb-surface: hotpink; }\n.dark { --wb-surface: rebeccapurple; }\n";
await writeFile(join(fixture, "app/globals.css"), initial);
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, async fetch(request): Promise<Response> {
  const slug = new URL(request.url).pathname.match(/^\/r\/(.+)\.json$/)?.[1];
  const item = slug === "system-workbench" ? buildWorkbenchSystemItem() : slug === "theme-blue-ink" ? buildThemeItem("blue-ink") : slug === "theme-graphite" ? buildThemeItem("graphite") : slug === "settings-panel" ? await buildShadcnItem("blocks", "settings-panel") : null;
  if (!item) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(item).replaceAll(SITE_URL, `http://127.0.0.1:${server.port}`), { headers: { "content-type": "application/json" } });
} });
async function install(slug: string) {
  const child = Bun.spawn(["node", join(process.cwd(), "benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js"), "add", `http://127.0.0.1:${server.port}/r/${slug}.json`, "--yes", "--cwd", fixture], { stdout: "pipe", stderr: "pipe" });
  const [exitCode, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()]);
  await writeFile(join(fixture, `${slug}-${Date.now()}.log`), `${stdout}\n${stderr}`);
  if (exitCode !== 0) throw new Error(`${slug} failed (${exitCode}) in ${fixture}: ${stdout}\n${stderr}`);
  return readFile(join(fixture, "app/globals.css"), "utf8");
}
function assert(condition: boolean, message: string) { if (!condition) throw new Error(`${message}; fixture ${fixture}`); }
try {
  const direct = await install("system-workbench");
  assert(direct.includes("hotpink") && direct.includes("rebeccapurple"), "Direct system install overwrote custom theme");
  assert(direct.includes("--wb-border:"), "Missing variables were not filled");
  const repeated = await install("system-workbench");
  assert(repeated === direct, "Repeated system installation changed CSS");
  // Start from a partial custom theme to test the dependency path independently.
  await writeFile(join(fixture, "app/globals.css"), initial);
  const indirect = await install("settings-panel");
  assert(indirect.includes("hotpink") && indirect.includes("rebeccapurple"), "Indirect system dependency overwrote custom theme");
  assert(indirect.includes("--wb-border:"), "Indirect dependency did not fill missing variables");
  const themed = await install("theme-graphite");
  assert(!themed.includes("hotpink") && !themed.includes("rebeccapurple"), "Explicit theme did not replace custom variables");
  const after = await install("system-workbench");
  assert(after === themed, "System defaults changed explicit theme");
  await writeFile(join(fixture, "app/globals.css"), after + "\n.consumer-overrides { --primary: hotpink; }\n");
  const blue = await install("theme-blue-ink");
  assert(blue.includes(".consumer-overrides") && blue.includes("hotpink"), "Explicit Blue Ink removed consumer-owned override");
  assert(blue.includes("77%") && blue.includes("48%"), "Blue Ink dual-mode primary tokens missing");
  assert(await install("system-workbench") === blue, "System defaults changed Blue Ink");
  console.log(`PASS shadcn 4.21.1: direct/indirect fill, custom preservation, explicit replacement, idempotence. Evidence: ${fixture}`);
} finally { server.stop(); }
