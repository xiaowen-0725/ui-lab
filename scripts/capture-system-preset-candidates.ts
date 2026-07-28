import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, type Page } from "playwright";
import { CODEX_DESKTOP_V1 } from "@/lib/system-presets/codex-desktop-v1";

const baseUrl = process.env.UILAB_CAPTURE_BASE_URL ?? "http://localhost:3000";
const outputRoot = resolve("public/system-presets/codex-desktop-v1");
const referenceDir = resolve(outputRoot, "reference");
const previewSelector = '[data-testid="parking-workbench-preview"]';

function runtimeAssertionError(caseId: string, message: string) {
  return new Error(`[${caseId}] candidate runtime assertion failed: ${message}`);
}

async function assertRuntimeContract(page: Page, caseId: string) {
  const overflow = await page.evaluate((selector) => {
    const previewRoots = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const roots = [
      { label: "documentElement", element: document.documentElement },
      { label: "body", element: document.body },
      ...previewRoots.map((element, index) => ({
        label: `preview[${index}]`,
        element,
      })),
    ];
    return roots.flatMap(({ label, element }) =>
      element.scrollWidth > element.clientWidth
        ? [
            {
              label,
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
            },
          ]
        : [],
    );
  }, previewSelector);
  if (overflow.length > 0) {
    throw runtimeAssertionError(
      caseId,
      `horizontal overflow: ${overflow
        .map(
          ({ label, clientWidth, scrollWidth }) =>
            `${label} clientWidth=${clientWidth} scrollWidth=${scrollWidth}`,
        )
        .join(", ")}`,
    );
  }

  if (caseId === "narrow-light-empty") {
    const header = page.locator(`${previewSelector} header`).first();
    const headerBox = await header.boundingBox();
    if (!headerBox || Math.round(headerBox.height) !== 46) {
      throw runtimeAssertionError(
        caseId,
        `expected 46px header, received ${headerBox?.height ?? "missing"}`,
      );
    }
    for (const label of ["后退", "前进"]) {
      const count = await page.getByRole("button", { name: label, exact: true }).count();
      if (count !== 0) {
        throw runtimeAssertionError(
          caseId,
          `desktop navigation button "${label}" must be absent, found ${count}`,
        );
      }
    }
    const locale = await page
      .locator('[data-testid="parking-locale-chip"]')
      .evaluate((element) => {
        const node = element as HTMLElement;
        return {
          text: node.textContent?.trim() ?? "",
          whiteSpace: getComputedStyle(node).whiteSpace,
          clientHeight: node.clientHeight,
          scrollHeight: node.scrollHeight,
        };
      });
    if (
      !["ZH", "EN"].includes(locale.text) ||
      locale.whiteSpace !== "nowrap" ||
      locale.scrollHeight > locale.clientHeight
    ) {
      throw runtimeAssertionError(
        caseId,
        `locale must be visible on one line: ${JSON.stringify(locale)}`,
      );
    }
  }

  if (caseId === "wide-light-settings-reduced-motion") {
    const settingsStyle = await page
      .locator(
        `${previewSelector} [data-preview-surface="settings"] [data-slot="settings-group"]`,
      )
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return { backgroundColor: style.backgroundColor, color: style.color };
      });
    if (
      settingsStyle.backgroundColor !== "rgb(255, 255, 255)" ||
      settingsStyle.color !== "rgb(24, 24, 24)"
    ) {
      throw runtimeAssertionError(
        caseId,
        `settings group expected white surface and #181818 text, received ${JSON.stringify(settingsStyle)}`,
      );
    }
  }

  if (caseId === "collapse-light-approval") {
    const scrimColor = await page
      .getByRole("button", { name: "Close artifact overlay", exact: true })
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    const mainOpacity = await page
      .locator(`${previewSelector} main`)
      .evaluate((element) => getComputedStyle(element).opacity);
    if (scrimColor !== "rgba(0, 0, 0, 0.06)" || mainOpacity !== "1") {
      throw runtimeAssertionError(
        caseId,
        `expected scrim rgba(0, 0, 0, 0.06) and main opacity 1, received scrim=${scrimColor} main=${mainOpacity}`,
      );
    }
  }
}

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
      await assertRuntimeContract(page, reference.id);
      const target = page.locator(previewSelector);
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
