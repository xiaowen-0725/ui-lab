import { afterEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { GET as getLlmsIndex } from "@/app/llms.txt/route";
import { buildCatalog } from "@/lib/catalog";
import { SECTIONS } from "@/lib/sections";
import { auditProject } from "../cli/src/audit";
import { catalogContractHash } from "../cli/src/project-lock";

const REPO_ROOT = resolve(import.meta.dir, "..");
const temporaryDirectories: string[] = [];

function temporaryProject(): string {
  const directory = mkdtempSync(resolve(tmpdir(), "ui-lab-application-kit-"));
  temporaryDirectories.push(directory);
  return directory;
}

function runCli(...args: string[]) {
  const process = Bun.spawnSync({
    cmd: [Bun.which("bun") ?? "bun", "cli/src/index.ts", ...args],
    cwd: REPO_ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });

  return {
    exitCode: process.exitCode,
    stdout: process.stdout.toString(),
    stderr: process.stderr.toString(),
  };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("application recipes catalog", () => {
  test("llms index directs Theme Kits through the theme command", async () => {
    const response = await getLlmsIndex();
    const text = await response.text();

    expect(text).toContain("ui-lab theme <slug>");
    expect(text).toContain("Design Systems and Studio Presets");
    expect(text).not.toContain(
      "styles, palettes, studio presets) has no CLI installer",
    );
  });

  test("component items expose their complete registry source family for consumer audits", async () => {
    const catalog = await buildCatalog();
    const components = catalog.filter((item) => item.kind === "component");

    expect(components.every((item) => item.sourceFile)).toBe(true);
    expect(components.every((item) => item.sourceFiles?.[0] === item.sourceFile)).toBe(
      true,
    );
    expect(components.find((item) => item.slug === "text-animation")?.sourceFile).toBe(
      "components/motion/text-reveal.tsx",
    );
    expect(components.find((item) => item.slug === "agent-thread")?.sourceFiles).toEqual([
      "components/motion/agent-thread/index.tsx",
      "components/motion/agent-thread/cards.tsx",
      "components/motion/agent-thread/status.tsx",
    ]);
  });

  test("publishes installable application and landing recipes with valid references", async () => {
    const catalog = await buildCatalog();
    const recipes = catalog.filter((item) => item.kind === "recipe");
    const components = new Set(
      catalog.filter((item) => item.kind === "component").map((item) => item.slug),
    );
    const systems = new Set(
      catalog.filter((item) => item.themePreview).map((item) => item.slug),
    );

    expect(recipes.map((item) => item.slug)).toEqual(["agent-workbench", "saas-landing"]);

    for (const recipe of recipes) {
      expect(recipe.nameZh).not.toBe(recipe.name);
      expect(recipe.descriptionZh).not.toBe(recipe.description);
      expect(recipe.aliases.length).toBeGreaterThan(0);
      expect(recipe.pageUrl).toStartWith("http");
      expect(recipe.fetch.endpoint).toStartWith("http");
      expect(recipe.profiles?.length).toBeGreaterThan(0);
      expect(
        recipe.profiles?.every((profile) =>
          ["next-app", "vite-app", "electron-renderer"].includes(profile),
        ),
      ).toBe(true);
      expect(systems.has(recipe.recommendedSystem ?? "")).toBe(true);
      expect(components.has(recipe.entryComponent ?? "")).toBe(true);
      expect(recipe.components).toContain(recipe.entryComponent);
      expect(recipe.components?.every((slug) => components.has(slug))).toBe(true);
      expect(recipe.optionalComponents?.every((slug) => components.has(slug))).toBe(true);
      expect(
        recipe.optionalComponents?.some((slug) => recipe.components?.includes(slug)),
      ).toBe(false);
      expect(recipe.slots?.length).toBeGreaterThan(0);
      expect(recipe.states?.length).toBeGreaterThan(0);
      expect(recipe.responsive?.length).toBeGreaterThan(0);
      expect(recipe.assets?.length).toBeGreaterThan(0);
      expect(recipe.required?.length).toBeGreaterThan(0);
      expect(recipe.forbidden?.length).toBeGreaterThan(0);
    }

    expect(recipes.find((item) => item.slug === "agent-workbench")?.category).toBe(
      "application",
    );
    expect(recipes.find((item) => item.slug === "saas-landing")).toMatchObject({
      category: "landing",
      entryComponent: "recording-card",
      components: ["recording-card", "button", "animated-badge"],
      optionalComponents: ["marquee", "tabs", "feedback-widget"],
    });
  });

  test("saas landing publishes a real section composition contract", async () => {
    const catalog = await buildCatalog();
    const recipe = catalog.find(
      (item) => item.kind === "recipe" && item.slug === "saas-landing",
    );
    const expected = [
      { slug: "navbar", variant: "simple", required: true },
      { slug: "hero", variant: "screenshot", required: true },
      { slug: "logo-wall", variant: "row", required: true },
      { slug: "features", variant: "alternating", required: true },
      { slug: "testimonials", variant: "quote", required: true },
      { slug: "pricing", variant: "tiers", required: false },
      { slug: "faq", variant: "accordion", required: false },
      { slug: "cta", variant: "boxed", required: true },
      { slug: "footer", variant: "columns", required: true },
    ];

    expect(recipe?.sections).toEqual(expected);
    for (const sectionContract of recipe?.sections ?? []) {
      const section = SECTIONS.find(
        (candidate) => candidate.slug === sectionContract.slug,
      );
      expect(section).toBeDefined();
      expect(
        section?.variants.some(
          (variant) => variant.key === sectionContract.variant,
        ),
      ).toBe(true);
    }
    expect(
      recipe?.required?.some(
        (rule) =>
          rule.includes("pricing is optional") &&
          rule.includes("no pricing model"),
      ),
    ).toBe(true);
  });
});

describe("ui-lab application kit CLI", () => {
  test("help presents the Application Kit commands and current catalog source", () => {
    const help = runCli("--help");

    expect(help.exitCode).toBe(0);
    expect(help.stdout).toContain("compose, discover, and audit coherent React frontends");
    expect(help.stdout).toContain("init --profile");
    expect(help.stdout).toContain("compose <recipe>");
    expect(help.stdout).toContain("lock [--dir");
    expect(help.stdout).toContain("ui-lab lock --dir packages/desktop");
    expect(help.stdout).toContain("audit [--dir");
    expect(help.stdout).toContain("--strict");
    expect(help.stdout).toContain("design-system, recipe");
    expect(help.stdout).toContain("do not include /catalog.json");
    expect(help.stdout).not.toContain("isn't deployed yet");
  });

  test("rejects unknown and command-inapplicable flags before loading the catalog", () => {
    const typo = runCli("audit", "--strcit");
    expect(typo.exitCode).toBe(1);
    expect(typo.stderr).toContain('Unknown flag for command "audit": --strcit');
    expect(typo.stderr).not.toContain("Using bundled snapshot");

    const inapplicable = runCli("audit", "--pm", "bun");
    expect(inapplicable.exitCode).toBe(1);
    expect(inapplicable.stderr).toContain(
      'Unknown flag for command "audit": --pm',
    );

    const lockInapplicable = runCli("lock", "--strict");
    expect(lockInapplicable.exitCode).toBe(1);
    expect(lockInapplicable.stderr).toContain(
      'Unknown flag for command "lock": --strict',
    );
  });

  test("show renders a recipe as a composition contract instead of an empty fetch block", () => {
    const shown = runCli("show", "agent-workbench", "--kind", "recipe");

    expect(shown.exitCode).toBe(0);
    expect(shown.stdout).toContain("ui-lab compose agent-workbench");
    expect(shown.stdout).toContain(
      "Profiles: next-app, vite-app, electron-renderer",
    );
    expect(shown.stdout).toContain("Recommended system: graphite");
    expect(shown.stdout).toContain("Entry component: agent-workbench");
    expect(shown.stdout).toContain("Required components:");
    expect(shown.stdout).toContain("Optional components:");
    expect(shown.stdout).toContain("Required:");
    expect(shown.stdout).toContain("Forbidden:");
    expect(shown.stdout).not.toContain("copy the block below:");

    const landing = runCli("show", "saas-landing", "--kind", "recipe");
    expect(landing.stdout).toContain("Sections:");
    expect(landing.stdout).toContain("navbar/simple (required)");
    expect(landing.stdout).toContain("pricing/tiers (optional)");
  });

  test("init creates a versioned project binding and refuses to overwrite it", () => {
    const directory = temporaryProject();
    const first = runCli(
      "init",
      "--profile",
      "electron-renderer",
      "--system",
      "graphite",
      "--dir",
      directory,
      "--json",
    );

    expect(first.exitCode).toBe(0);
    expect(JSON.parse(first.stdout)).toMatchObject({
      ok: true,
      action: "created",
      config: {
        schemaVersion: 1,
        profile: "electron-renderer",
        system: "graphite",
        components: [],
        mode: "adopt",
      },
    });

    const configPath = resolve(directory, "ui-lab.config.json");
    const original = readFileSync(configPath, "utf8");
    const second = runCli(
      "init",
      "--profile",
      "next-app",
      "--system",
      "minimal-light",
      "--dir",
      directory,
      "--json",
    );

    expect(second.exitCode).toBe(1);
    expect(second.stderr).toContain("Refusing to overwrite");
    expect(readFileSync(configPath, "utf8")).toBe(original);

    const forced = runCli(
      "init",
      "--profile",
      "next-app",
      "--system",
      "minimal-light",
      "--dir",
      directory,
      "--force",
      "--json",
    );
    expect(JSON.parse(forced.stdout)).toMatchObject({
      ok: true,
      action: "replaced",
      config: { profile: "next-app", system: "minimal-light" },
    });
    const forcedHuman = runCli(
      "init",
      "--profile",
      "next-app",
      "--system",
      "minimal-light",
      "--dir",
      directory,
      "--force",
    );
    expect(forcedHuman.exitCode).toBe(0);
    expect(forcedHuman.stdout).toStartWith("Replaced ");

    const freshDirectory = temporaryProject();
    const forcedFresh = runCli(
      "init",
      "--profile",
      "vite-app",
      "--system",
      "minimal-light",
      "--dir",
      freshDirectory,
      "--force",
      "--json",
    );
    expect(JSON.parse(forcedFresh.stdout)).toMatchObject({
      ok: true,
      action: "created",
    });
  });

  test("init only overwrites when force is an explicit true boolean", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "next-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    const configPath = resolve(directory, "ui-lab.config.json");
    const original = readFileSync(configPath, "utf8");

    const falseForce = runCli(
      "init",
      "--profile",
      "vite-app",
      "--system",
      "minimal-light",
      "--dir",
      directory,
      "--force=false",
      "--json",
    );
    expect(falseForce.exitCode).toBe(1);
    expect(falseForce.stderr).toContain("Refusing to overwrite");
    expect(readFileSync(configPath, "utf8")).toBe(original);

    const invalidForce = runCli(
      "init",
      "--profile",
      "vite-app",
      "--system",
      "minimal-light",
      "--dir",
      directory,
      "--force=maybe",
      "--json",
    );
    expect(invalidForce.exitCode).toBe(1);
    expect(invalidForce.stderr).toContain('Invalid boolean for "--force"');
    expect(readFileSync(configPath, "utf8")).toBe(original);

    const invalidSpacedForce = runCli(
      "init",
      "--profile",
      "vite-app",
      "--system",
      "minimal-light",
      "--dir",
      directory,
      "--force",
      "maybe",
      "--json",
    );
    expect(invalidSpacedForce.exitCode).toBe(1);
    expect(invalidSpacedForce.stderr).toContain(
      'Invalid boolean for "--force"',
    );
    expect(readFileSync(configPath, "utf8")).toBe(original);
  });

  test("explicit false values apply to every boolean flag", () => {
    const listed = runCli("list", "--kind", "recipe", "--json=false");

    expect(listed.exitCode).toBe(0);
    expect(listed.stdout).toStartWith("recipe (2)");
    expect(listed.stdout).not.toStartWith("[");
  });

  test("compose updates the project binding and returns an executable-free install plan", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "electron-renderer",
        "--system",
        "graphite",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);

    const composed = runCli("compose", "agent-workbench", "--dir", directory, "--json");

    expect(composed.exitCode).toBe(0);
    const output = JSON.parse(composed.stdout);
    expect(output).toMatchObject({
      ok: true,
      recipe: "agent-workbench",
      config: {
        schemaVersion: 1,
        profile: "electron-renderer",
        system: "graphite",
        recipe: "agent-workbench",
        mode: "adopt",
      },
      plan: {
        strategy: "review-before-install",
        theme: {
          slug: "graphite",
          action: "compare",
        },
      },
    });
    expect(output.plan.theme.command).toStartWith("npx shadcn@latest add ");
    expect(output.plan.theme.pageUrl).toStartWith("http");
    expect(output.plan.components.map((item: { slug: string }) => item.slug)).toEqual([
      "agent-workbench",
      "thread-list",
      "agent-thread",
      "agent-composer",
      "artifact-panel",
    ]);
    expect(
      output.plan.components.every(
        (item: { command: string; pageUrl: string }) =>
          item.command.startsWith("npx shadcn@latest add ") && item.pageUrl.startsWith("http"),
      ),
    ).toBe(true);
    expect(
      output.plan.optionalComponents.map((item: { slug: string }) => item.slug),
    ).toEqual(["agent-inbox", "agent-trace", "citations", "voice-orb"]);
    expect(
      output.plan.optionalComponents.every(
        (item: { command: string; pageUrl: string }) =>
          item.command.startsWith("npx shadcn@latest add ") && item.pageUrl.startsWith("http"),
      ),
    ).toBe(true);

    const configPath = resolve(directory, "ui-lab.config.json");
    const firstConfig = JSON.parse(readFileSync(configPath, "utf8"));
    expect(firstConfig.components).toEqual(output.plan.components.map((item: { slug: string }) => item.slug));
    expect(firstConfig.components).not.toContain("agent-inbox");
    expect(runCli("compose", "agent-workbench", "--dir", directory, "--json").exitCode).toBe(0);
    const secondConfig = JSON.parse(readFileSync(configPath, "utf8"));
    expect(secondConfig.components).toEqual(firstConfig.components);
  });

  test("init, compose, and add keep a deterministic catalog contract lock in sync", async () => {
    const directory = temporaryProject();
    const initialized = runCli(
      "init",
      "--profile",
      "vite-app",
      "--system",
      "graphite",
      "--dir",
      directory,
      "--json",
    );
    expect(initialized.exitCode).toBe(0);

    const lockPath = resolve(directory, "ui-lab.lock.json");
    const initialText = readFileSync(lockPath, "utf8");
    const initialLock = JSON.parse(initialText);
    expect(initialLock).toMatchObject({
      schemaVersion: 1,
      catalogSource: "snapshot",
      items: [
        {
          slug: "graphite",
          contractHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        },
      ],
    });
    expect(initialLock).not.toHaveProperty("generatedAt");

    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "graphite",
        "--dir",
        directory,
        "--force",
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(readFileSync(lockPath, "utf8")).toBe(initialText);

    expect(
      runCli("compose", "agent-workbench", "--dir", directory, "--json")
        .exitCode,
    ).toBe(0);
    const composedLock = JSON.parse(readFileSync(lockPath, "utf8"));
    expect(
      composedLock.items.map((item: { slug: string }) => item.slug),
    ).toEqual(
      expect.arrayContaining([
        "graphite",
        "agent-workbench",
        "thread-list",
        "agent-thread",
        "agent-composer",
        "artifact-panel",
      ]),
    );

    expect(runCli("add", "button", "--dir", directory).exitCode).toBe(0);
    const addedText = readFileSync(lockPath, "utf8");
    const button = JSON.parse(addedText).items.find(
      (item: { kind: string; slug: string }) =>
        item.kind === "component" && item.slug === "button",
    );
    expect(button).toMatchObject({
      contractHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      sourceFiles: [
        "components/motion/button/index.tsx",
        "components/motion/button/base.tsx",
        "components/motion/button/stateful.tsx",
        "components/motion/button/magnetic.tsx",
      ],
    });

    const tamperedLock = JSON.parse(addedText);
    tamperedLock.items.find(
      (item: { kind: string; slug: string }) =>
        item.kind === "component" && item.slug === "button",
    ).contractHash = "0".repeat(64);
    writeFileSync(lockPath, `${JSON.stringify(tamperedLock, null, 2)}\n`);
    expect(runCli("add", "button", "--dir", directory).exitCode).toBe(0);
    expect(readFileSync(lockPath, "utf8")).toBe(addedText);

    const catalog = await buildCatalog();
    const recipe = catalog.find(
      (item) => item.kind === "recipe" && item.slug === "agent-workbench",
    );
    if (!recipe) throw new Error("agent-workbench recipe fixture is missing");
    const hash = catalogContractHash(recipe);
    expect(
      catalogContractHash({
        ...recipe,
        name: "Display-only rename",
        nameZh: "仅展示改名",
        description: "Display-only description",
        descriptionZh: "仅展示描述",
        prompt: "Display-only prompt",
        promptZh: "仅展示提示词",
        pageUrl: "https://example.invalid/display-only",
        slots: recipe.slots?.map((slot) => ({
          ...slot,
          description: "Display-only slot description",
          descriptionZh: "仅展示插槽描述",
        })),
      }),
    ).toBe(hash);
    expect(
      catalogContractHash({
        ...recipe,
        required: [...(recipe.required ?? []), "A new behavior contract"],
      }),
    ).not.toBe(hash);
  });

  test("compose distinguishes adopt review from replace installation", () => {
    const adoptDirectory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "electron-renderer",
        "--system",
        "graphite",
        "--mode",
        "adopt",
        "--dir",
        adoptDirectory,
      ).exitCode,
    ).toBe(0);
    const adoptJson = JSON.parse(
      runCli("compose", "agent-workbench", "--dir", adoptDirectory, "--json").stdout,
    );
    expect(adoptJson.plan.strategy).toBe("review-before-install");
    expect(adoptJson.plan.theme.action).toBe("compare");
    expect(
      adoptJson.plan.components.every(
        (item: { action: string }) => item.action === "compare",
      ),
    ).toBe(true);
    const adoptHuman = runCli(
      "compose",
      "agent-workbench",
      "--dir",
      adoptDirectory,
    );
    expect(adoptHuman.stdout).toContain("Review-before-install plan");
    expect(adoptHuman.stdout).not.toContain("Install plan:");

    const replaceDirectory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "electron-renderer",
        "--system",
        "graphite",
        "--mode",
        "replace",
        "--dir",
        replaceDirectory,
      ).exitCode,
    ).toBe(0);
    const replaceJson = JSON.parse(
      runCli("compose", "agent-workbench", "--dir", replaceDirectory, "--json").stdout,
    );
    expect(replaceJson.plan.strategy).toBe("install");
    expect(replaceJson.plan.theme.action).toBe("install");
    expect(
      replaceJson.plan.components.every(
        (item: { action: string }) => item.action === "install",
      ),
    ).toBe(true);
    expect(
      runCli("compose", "agent-workbench", "--dir", replaceDirectory).stdout,
    ).toContain("Install plan (");
  });

  test("add registers a component when a project binding exists and stays print-only otherwise", () => {
    const unboundDirectory = temporaryProject();
    const unbound = runCli("add", "tilt-card", "--dir", unboundDirectory);
    expect(unbound.exitCode).toBe(0);
    expect(unbound.stdout).toContain("/r/tilt-card.json");
    expect(
      existsSync(resolve(unboundDirectory, "ui-lab.config.json")),
    ).toBe(false);

    const boundDirectory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "minimal-light",
        "--dir",
        boundDirectory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "tilt-card", "--dir", boundDirectory).exitCode).toBe(0);
    expect(runCli("add", "tilt-card", "--dir", boundDirectory).exitCode).toBe(0);
    expect(
      JSON.parse(
        readFileSync(
          resolve(boundDirectory, "ui-lab.config.json"),
          "utf8",
        ),
      ).components,
    ).toEqual(["tilt-card"]);
    expect(existsSync(resolve(boundDirectory, "tilt-card.tsx"))).toBe(false);
  });

  test("audit uses the catalog source hint when slug and filename differ", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "text-animation", "--dir", directory).exitCode).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: {
          tailwindcss: "^4.0.0",
          typescript: "^5.7.0",
        },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      })}\n`,
    );
    mkdirSync(resolve(directory, "src/components"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/text-reveal.tsx"),
      "export function TextReveal() { return <span />; }\n",
    );

    const audited = runCli("audit", "--dir", directory, "--json");
    expect(audited.exitCode).toBe(0);
    expect(
      JSON.parse(audited.stdout).findings.map(
        (finding: { code: string }) => finding.code,
      ),
    ).not.toContain("component-source-missing");
  });

  test("audit accepts the canonical nested registry source file", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "text-animation", "--dir", directory).exitCode).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: {
          tailwindcss: "^4.0.0",
          typescript: "^5.7.0",
        },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      })}\n`,
    );
    mkdirSync(resolve(directory, "src/components/motion"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/motion/text-reveal.tsx"),
      "export function TextReveal() { return <span />; }\n",
    );

    expect(runCli("audit", "--dir", directory, "--json").exitCode).toBe(0);
  });

  test("audit accepts the canonical nested registry index file", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "button", "--dir", directory).exitCode).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: {
          tailwindcss: "^4.0.0",
          typescript: "^5.7.0",
        },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      })}\n`,
    );
    mkdirSync(resolve(directory, "src/components/motion/button"), {
      recursive: true,
    });
    writeFileSync(
      resolve(directory, "src/components/motion/button/index.tsx"),
      "export function Button() { return <button />; }\n",
    );

    expect(runCli("audit", "--dir", directory, "--json").exitCode).toBe(0);
  });

  test("audit permits an adopt-mode auxiliary component family to be intentionally narrowed", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "graphite",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "button", "--dir", directory).exitCode).toBe(0);
    expect(JSON.parse(readFileSync(resolve(directory, "ui-lab.config.json"), "utf8"))).toMatchObject({
      mode: "adopt",
    });
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } })}\n`,
    );
    mkdirSync(resolve(directory, "src/components"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/button.tsx"),
      "export function Button() { return <button />; }\n",
    );

    expect(JSON.parse(runCli("audit", "--dir", directory, "--json").stdout)).toMatchObject({
      ok: true,
      summary: { errors: 0, warnings: 0 },
    });
  });

  test("audit reports stale locks as warnings and strict mode fails on them", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } })}\n`,
    );

    const lockPath = resolve(directory, "ui-lab.lock.json");
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    lock.items[0].contractHash = "0".repeat(64);
    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

    const ordinary = runCli("audit", "--dir", directory, "--json");
    expect(ordinary.exitCode).toBe(0);
    expect(JSON.parse(ordinary.stdout)).toMatchObject({
      ok: true,
      findings: [
        expect.objectContaining({
          severity: "warning",
          code: "lock-contract-stale",
        }),
      ],
      summary: { errors: 0, warnings: 1 },
    });
    const ordinaryHuman = runCli("audit", "--dir", directory);
    expect(ordinaryHuman.exitCode).toBe(0);
    expect(ordinaryHuman.stdout).toContain("Audit passed with warnings:");

    const strict = runCli(
      "audit",
      "--dir",
      directory,
      "--strict",
      "--json",
    );
    expect(strict.exitCode).toBe(1);
    expect(JSON.parse(strict.stdout)).toMatchObject({
      ok: false,
      summary: { errors: 0, warnings: 1 },
    });
  });

  test("strict audit requires a lock while ordinary audit remains backward compatible", () => {
    const directory = temporaryProject();
    writeFileSync(
      resolve(directory, "ui-lab.config.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        profile: "vite-app",
        system: "minimal-light",
        components: [],
        mode: "adopt",
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } })}\n`,
    );

    expect(
      JSON.parse(runCli("audit", "--dir", directory, "--json").stdout),
    ).toMatchObject({
      ok: true,
      summary: { errors: 0, warnings: 0 },
    });

    const strict = runCli(
      "audit",
      "--dir",
      directory,
      "--strict",
      "--json",
    );
    expect(strict.exitCode).toBe(1);
    expect(JSON.parse(strict.stdout)).toMatchObject({
      ok: false,
      findings: [
        expect.objectContaining({
          severity: "warning",
          code: "lock-missing",
        }),
      ],
      summary: { errors: 0, warnings: 1 },
    });
  });

  test("lock safely repairs stale or missing locks without changing config", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "graphite",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "button", "--dir", directory).exitCode).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } })}\n`,
    );
    mkdirSync(resolve(directory, "src/components"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/button.tsx"),
      "export function Button() { return <button />; }\n",
    );

    const configPath = resolve(directory, "ui-lab.config.json");
    const configText = readFileSync(configPath, "utf8");
    const lockPath = resolve(directory, "ui-lab.lock.json");
    const staleLock = JSON.parse(readFileSync(lockPath, "utf8"));
    const button = staleLock.items.find(
      (item: { kind: string; slug: string }) =>
        item.kind === "component" && item.slug === "button",
    );
    delete button.sourceFiles;
    writeFileSync(lockPath, `${JSON.stringify(staleLock, null, 2)}\n`);

    const staleAudit = runCli(
      "audit",
      "--dir",
      directory,
      "--strict",
      "--json",
    );
    expect(staleAudit.exitCode).toBe(1);
    expect(
      JSON.parse(staleAudit.stdout).findings.map(
        (finding: { code: string }) => finding.code,
      ),
    ).toContain("lock-source-files-stale");

    const repaired = runCli("lock", "--dir", directory, "--json");
    expect(repaired.exitCode).toBe(0);
    expect(JSON.parse(repaired.stdout)).toMatchObject({
      ok: true,
      lockPath,
      lock: {
        schemaVersion: 1,
        catalogSource: "snapshot",
      },
    });
    expect(readFileSync(configPath, "utf8")).toBe(configText);
    expect(
      runCli("audit", "--dir", directory, "--strict", "--json").exitCode,
    ).toBe(0);

    rmSync(lockPath);
    expect(
      runCli("audit", "--dir", directory, "--strict", "--json").exitCode,
    ).toBe(1);
    expect(runCli("lock", "--dir", directory, "--json").exitCode).toBe(0);
    expect(readFileSync(configPath, "utf8")).toBe(configText);
    expect(
      runCli("audit", "--dir", directory, "--strict", "--json").exitCode,
    ).toBe(0);
  });

  test("audit checks nested canonical and sibling direct sidecars for Recipe-required families", async () => {
    const directory = temporaryProject();
    const catalog = await buildCatalog();
    const baseRecipe = catalog.find(
      (item) => item.kind === "recipe" && item.slug === "agent-workbench",
    );
    expect(baseRecipe).toBeDefined();
    if (!baseRecipe) throw new Error("agent-workbench recipe fixture is missing");
    const items = [
      ...catalog,
      {
        ...baseRecipe,
        slug: "source-family-fixture",
        entryComponent: "agent-thread",
        components: ["agent-thread", "text-animation"],
        optionalComponents: [],
      },
    ];
    writeFileSync(
      resolve(directory, "ui-lab.config.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        profile: "vite-app",
        system: "graphite",
        recipe: "source-family-fixture",
        components: ["agent-thread", "text-animation"],
        mode: "adopt",
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } })}\n`,
    );
    const familyDirectory = resolve(directory, "src/components/motion/agent-thread");
    mkdirSync(familyDirectory, { recursive: true });
    for (const sourceFile of ["index.tsx", "status.tsx"]) {
      writeFileSync(
        resolve(familyDirectory, sourceFile),
        'export function ThreadPart() { return <div className="text-[var(--wb-text)]" />; }\n',
      );
    }
    writeFileSync(
      resolve(directory, "src/components/text-reveal.tsx"),
      "export function TextReveal() { return <span />; }\n",
    );
    const siblingDirectory = resolve(directory, "src/components/text-animation");
    mkdirSync(siblingDirectory, { recursive: true });
    writeFileSync(
      resolve(siblingDirectory, "text-cascade.tsx"),
      "export function TextCascade() { return <span />; }\n",
    );
    mkdirSync(resolve(directory, "src"), { recursive: true });
    writeFileSync(resolve(directory, "src/globals.css"), ":root { --wb-surface: #151515; }\n");

    const incomplete = auditProject(items, directory);
    expect(incomplete).toMatchObject({
      ok: true,
      summary: { errors: 0, warnings: 2 },
    });
    const warningText = incomplete.findings
      .filter((finding) => finding.code === "component-source-family-incomplete")
      .map((finding) => finding.message)
      .join("\n");
    expect(warningText).toContain("agent-thread/cards.tsx");
    expect(warningText).not.toContain("agent-thread/status.tsx");
    expect(warningText).toContain("text-shimmer.tsx");
    expect(warningText).not.toContain("text-cascade.tsx");

    writeFileSync(
      resolve(familyDirectory, "cards.tsx"),
      'export function ThreadCards() { return <div className="text-[var(--wb-text)]" />; }\n',
    );
    writeFileSync(
      resolve(siblingDirectory, "text-shimmer.tsx"),
      "export function TextShimmer() { return <span />; }\n",
    );

    expect(auditProject(items, directory)).toMatchObject({
      ok: true,
      summary: { errors: 0, warnings: 0 },
    });
  });

  test("audit accepts a tokenized implementation when a flat compatibility wrapper also matches", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "graphite",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "agent-thread", "--dir", directory).exitCode).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({ aliases: { components: "@/components", utils: "@/lib/utils" } })}\n`,
    );
    mkdirSync(resolve(directory, "src/components/agent-thread"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/agent-thread.tsx"),
      'export { AgentThread } from "./agent-thread";\n',
    );
    writeFileSync(
      resolve(directory, "src/components/agent-thread/index.tsx"),
      'export function AgentThread() { return <main className="text-[var(--wb-text)]" />; }\n',
    );
    mkdirSync(resolve(directory, "src"), { recursive: true });
    writeFileSync(resolve(directory, "src/globals.css"), ":root { --wb-surface: #151515; }\n");

    expect(JSON.parse(runCli("audit", "--dir", directory, "--json").stdout)).toMatchObject({
      ok: true,
      summary: { errors: 0, warnings: 0 },
    });
  });

  test("audit only accepts component sources inside the configured alias directory", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "vite-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("add", "button", "--dir", directory).exitCode).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { react: "^19.0.0", vite: "^7.0.0" },
        devDependencies: {
          tailwindcss: "^4.0.0",
          typescript: "^5.7.0",
        },
      })}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      })}\n`,
    );
    mkdirSync(resolve(directory, "tests"), { recursive: true });
    writeFileSync(
      resolve(directory, "tests/button.tsx"),
      "export function Button() { return <button />; }\n",
    );

    const outsideOnly = runCli("audit", "--dir", directory, "--json");
    expect(outsideOnly.exitCode).toBe(1);
    expect(
      JSON.parse(outsideOnly.stdout).findings.map(
        (finding: { code: string }) => finding.code,
      ),
    ).toContain("component-source-missing");

    mkdirSync(resolve(directory, "src/components"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/button.tsx"),
      "export function Button() { return <button />; }\n",
    );
    const insideAlias = runCli("audit", "--dir", directory, "--json");
    expect(insideAlias.exitCode).toBe(0);
  });

  test("audit rejects unknown project binding fields with a clear schema error", () => {
    const directory = temporaryProject();
    writeFileSync(
      resolve(directory, "ui-lab.config.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        profile: "next-app",
        system: "minimal-light",
        components: [],
        mode: "adopt",
        unexpected: true,
      })}\n`,
    );
    const result = runCli("audit", "--dir", directory, "--json");
    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      ok: false,
      findings: [
        {
          severity: "error",
          code: "config-invalid",
          message: expect.stringContaining("unknown field: unexpected"),
        },
      ],
      summary: { errors: 1, warnings: 0 },
    });
  });

  test("audit validates the shadcn components.json aliases contract", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "next-app",
        "--system",
        "minimal-light",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify({
        dependencies: { next: "^15.0.0", react: "^19.0.0" },
        devDependencies: { tailwindcss: "^4.0.0", typescript: "^5.7.0" },
      })}\n`,
    );
    writeFileSync(resolve(directory, "components.json"), "{}\n");

    const invalid = runCli("audit", "--dir", directory, "--json");
    expect(invalid.exitCode).toBe(1);
    expect(
      JSON.parse(invalid.stdout).findings.map(
        (finding: { code: string }) => finding.code,
      ),
    ).toContain("components-json-invalid");

    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      })}\n`,
    );
    const valid = runCli("audit", "--dir", directory, "--json");
    expect(valid.exitCode).toBe(0);
  });

  test("audit enforces TypeScript and the selected profile runtime", () => {
    const cases = [
      { profile: "next-app", dependency: "next", code: "next-missing" },
      { profile: "vite-app", dependency: "vite", code: "vite-missing" },
      {
        profile: "electron-renderer",
        dependency: "electron",
        code: "electron-missing",
      },
    ] as const;

    for (const profileCase of cases) {
      const directory = temporaryProject();
      expect(
        runCli(
          "init",
          "--profile",
          profileCase.profile,
          "--system",
          "minimal-light",
          "--dir",
          directory,
          "--json",
        ).exitCode,
      ).toBe(0);
      writeFileSync(
        resolve(directory, "package.json"),
        `${JSON.stringify({
          dependencies: { react: "^19.0.0" },
          devDependencies: { tailwindcss: "^4.0.0" },
        })}\n`,
      );
      writeFileSync(
        resolve(directory, "components.json"),
        `${JSON.stringify({
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
          },
        })}\n`,
      );

      const invalid = runCli("audit", "--dir", directory, "--json");
      expect(invalid.exitCode).toBe(1);
      const codes = JSON.parse(invalid.stdout).findings.map(
        (finding: { code: string }) => finding.code,
      );
      expect(codes).toContain("typescript-missing");
      expect(codes).toContain(profileCase.code);

      writeFileSync(
        resolve(directory, "package.json"),
        `${JSON.stringify({
          dependencies: {
            react: "^19.0.0",
            [profileCase.dependency]: "^1.0.0",
          },
          devDependencies: {
            tailwindcss: "^4.0.0",
            typescript: "^5.7.0",
          },
        })}\n`,
      );
      expect(runCli("audit", "--dir", directory, "--json").exitCode).toBe(0);
    }
  });

  test("audit reports missing golden-path contracts and passes a conforming project", () => {
    const directory = temporaryProject();
    expect(
      runCli(
        "init",
        "--profile",
        "electron-renderer",
        "--system",
        "graphite",
        "--dir",
        directory,
        "--json",
      ).exitCode,
    ).toBe(0);
    expect(runCli("compose", "agent-workbench", "--dir", directory, "--json").exitCode).toBe(0);

    const sourceDirectory = resolve(directory, "src/components/agent-workbench");
    mkdirSync(sourceDirectory, { recursive: true });
    writeFileSync(
      resolve(sourceDirectory, "index.tsx"),
      '// var(--wb-surface)\nexport function AgentWorkbench() { return <main className="bg-card" />; }\n',
    );
    mkdirSync(resolve(directory, "src/components/stories"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/stories/thread-list.tsx"),
      "export function ThreadListStory() { return <aside />; }\n",
    );
    mkdirSync(resolve(directory, "tests"), { recursive: true });
    writeFileSync(
      resolve(directory, "tests/thread-list.tsx"),
      "export function ThreadListFixture() { return <aside />; }\n",
    );
    mkdirSync(resolve(directory, "src"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/globals.css"),
      "/* :root { --wb-surface: #151515; } */\n",
    );

    const failing = runCli("audit", "--dir", directory, "--json");
    expect(failing.exitCode).toBe(1);
    const failingOutput = JSON.parse(failing.stdout);
    expect(failingOutput.ok).toBe(false);
    expect(failingOutput.findings.map((finding: { code: string }) => finding.code)).toEqual(
      expect.arrayContaining([
        "react-missing",
        "tailwind-v4-missing",
        "components-json-missing",
        "component-source-missing",
        "workbench-theme-token-missing",
      ]),
    );
    expect(failingOutput.summary.errors).toBeGreaterThan(0);

    writeFileSync(
      resolve(directory, "package.json"),
      `${JSON.stringify(
        {
          dependencies: { electron: "^31.0.0", react: "^19.0.0" },
          devDependencies: {
            tailwindcss: "^4.1.0",
            typescript: "^5.7.0",
          },
        },
        null,
        2,
      )}\n`,
    );
    writeFileSync(
      resolve(directory, "components.json"),
      `${JSON.stringify({
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      })}\n`,
    );
    const storyCannotSatisfySource = runCli("audit", "--dir", directory, "--json");
    expect(storyCannotSatisfySource.exitCode).toBe(1);
    expect(
      JSON.parse(storyCannotSatisfySource.stdout).findings.find(
        (finding: { code: string; message: string }) =>
          finding.code === "component-source-missing" &&
          finding.message.includes('"thread-list"'),
      ),
    ).toBeDefined();
    writeFileSync(
      resolve(sourceDirectory, "index.tsx"),
      'export function AgentWorkbench() { return <main style={{ background: "var(--wb-surface)" }} />; }\n',
    );
    writeFileSync(
      resolve(sourceDirectory, "preview.tsx"),
      "export function Preview() { return <div />; }\n",
    );
    writeFileSync(
      resolve(directory, "src/components/thread-list.tsx"),
      "// var(--wb-surface)\nexport function ThreadList() { return <aside />; }\n",
    );
    writeFileSync(
      resolve(directory, "src/components/agent-thread.tsx"),
      'export function AgentThread() { return <main className="text-[var(--wb-text)]" />; }\n',
    );
    writeFileSync(
      resolve(directory, "src/components/agent-composer.tsx"),
      'export function AgentComposer() { return <form className="bg-[var(--wb-surface-composer)]" />; }\n',
    );
    writeFileSync(
      resolve(directory, "src/components/artifact-panel.tsx"),
      'export function ArtifactPanel() { return <aside className="border-[var(--wb-hairline)]" />; }\n',
    );
    writeFileSync(
      resolve(directory, "src/globals.css"),
      '@import "https://ui-lab-ten.vercel.app/themes/graphite.css";\n',
    );

    const perFileFailure = runCli("audit", "--dir", directory, "--json");
    expect(perFileFailure.exitCode).toBe(1);
    const perFileOutput = JSON.parse(perFileFailure.stdout);
    expect(
      perFileOutput.findings.find(
        (finding: { code: string }) => finding.code === "workbench-token-missing",
      )?.path,
    ).toEndWith("thread-list.tsx");
    const familyWarnings = perFileOutput.findings.filter(
      (finding: { code: string }) => finding.code === "component-source-family-incomplete",
    );
    expect(familyWarnings.map((finding: { message: string }) => finding.message).join("\n")).toContain(
      "agent-thread/cards.tsx",
    );
    expect(familyWarnings.map((finding: { message: string }) => finding.message).join("\n")).toContain(
      "agent-composer/effort-slider.tsx",
    );
    expect(familyWarnings.map((finding: { message: string }) => finding.message).join("\n")).toContain(
      "agent-workbench/summary-card.tsx",
    );

    writeFileSync(
      resolve(directory, "src/components/thread-list.tsx"),
      'export function ThreadList() { return <aside className="bg-[var(--wb-surface)]" />; }\n',
    );
    mkdirSync(resolve(directory, "src/components/agent-thread"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/agent-thread/cards.tsx"),
      'export function ThreadCards() { return <div className="text-[var(--wb-text)]" />; }\n',
    );
    writeFileSync(
      resolve(directory, "src/components/agent-thread/status.tsx"),
      'export function ThreadStatus() { return <div className="text-[var(--wb-text)]" />; }\n',
    );
    mkdirSync(resolve(directory, "src/components/agent-composer"), { recursive: true });
    writeFileSync(
      resolve(directory, "src/components/agent-composer/effort-slider.tsx"),
      'export function EffortSlider() { return <div className="text-[var(--wb-text)]" />; }\n',
    );
    writeFileSync(
      resolve(directory, "src/components/agent-composer/autonomy-dial.tsx"),
      'export function AutonomyDial() { return <div className="text-[var(--wb-text)]" />; }\n',
    );
    writeFileSync(
      resolve(sourceDirectory, "resize-handle.tsx"),
      'export function ResizeHandle() { return <div className="bg-[var(--wb-hover)]" />; }\n',
    );
    writeFileSync(
      resolve(sourceDirectory, "summary-card.tsx"),
      'export function SummaryCard() { return <div className="bg-[var(--wb-surface-raised)]" />; }\n',
    );

    const passing = runCli("audit", "--dir", directory, "--json");
    expect(passing.exitCode).toBe(0);
    expect(JSON.parse(passing.stdout)).toMatchObject({
      ok: true,
      summary: {
        errors: 0,
        warnings: 0,
      },
    });
  });
});
