import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { CODEX_DESKTOP_V1 } from "@/lib/system-presets/codex-desktop-v1";

const baseUrl = process.env.UILAB_CAPTURE_BASE_URL ?? "http://localhost:3000";
const outputRoot = resolve("public/system-presets/codex-desktop-v1");
const referenceDir = resolve(outputRoot, "reference");

async function main() {
  await mkdir(referenceDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    const cases = [];
    for (const reference of CODEX_DESKTOP_V1.referencePack.cases) {
      const [width, height] = reference.size.split("x").map(Number);
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: reference.scale,
        colorScheme: reference.theme,
      });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/studio/preview/${reference.id}`, {
        waitUntil: "networkidle",
      });
      await page
        .locator('[data-preview-ready="true"]')
        .waitFor({ state: "attached" });
      await page.evaluate(async () => {
        await document.fonts?.ready;
      });
      await page.locator("nextjs-portal").evaluateAll((portals) => {
        for (const portal of portals) portal.remove();
      });
      const target = page.locator(
        '[data-testid="parking-workbench-preview"]',
      );
      const path = resolve(referenceDir, `${reference.id}.png`);
      await target.screenshot({ path, animations: "disabled" });
      const bytes = await Bun.file(path).arrayBuffer();
      cases.push({
        caseId: reference.id,
        path: `reference/${reference.id}.png`,
        size: reference.size,
        scale: reference.scale,
        theme: reference.theme,
        sha256: createHash("sha256")
          .update(Buffer.from(bytes))
          .digest("hex"),
      });
      await context.close();
    }
    await writeFile(
      resolve(
        "content/system-presets/codex-desktop-v1/candidate-evidence.json",
      ),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          evidenceRole: "candidate-regression",
          presetSlug: CODEX_DESKTOP_V1.slug,
          referencePackId: CODEX_DESKTOP_V1.referencePack.id,
          referencePackHash: CODEX_DESKTOP_V1.referencePack.contractHash,
          fixtureId: CODEX_DESKTOP_V1.referencePack.fixture.id,
          fixtureHash: CODEX_DESKTOP_V1.referencePack.fixture.fixtureHash,
          acceptance: { status: "pending" },
          cases,
        },
        null,
        2,
      )}\n`,
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
