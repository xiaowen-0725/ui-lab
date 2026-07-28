import { describe, expect, test } from "bun:test";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const uiLabRoot = path.join(projectRoot, "skill", "ui-lab");

async function read(relativePath: string): Promise<string> {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

function section(markdown: string, heading: string): string {
  const start = markdown.indexOf(heading);
  if (start < 0) return "";
  const rest = markdown.slice(start + heading.length);
  const nextHeading = rest.search(/^##\s+/m);
  return nextHeading < 0 ? rest : rest.slice(0, nextHeading);
}

function expectInOrder(source: string, values: readonly string[]): void {
  let cursor = -1;
  for (const value of values) {
    const next = source.indexOf(value, cursor + 1);
    expect(next, `expected "${value}" after "${source.slice(Math.max(0, cursor), cursor + 32)}"`).toBeGreaterThan(
      cursor,
    );
    cursor = next;
  }
}

function routeRow(markdown: string, route: string): string {
  return (
    markdown
      .split(/\r?\n/)
      .find((line) => line.startsWith("|") && line.includes(`| \`${route}\` |`)) ?? ""
  );
}

function paragraphWith(markdown: string, terms: readonly string[]): string | undefined {
  return markdown
    .split(/\n\s*\n/)
    .find((paragraph) => terms.every((term) => paragraph.includes(term)));
}

function markdownTableRows(markdown: string): string[][] {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  const headerIndex = lines.findIndex((line) => line.startsWith("|") && line.endsWith("|"));
  if (headerIndex < 0) return [];

  const separatorCells = (lines[headerIndex + 1] ?? "")
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  if (
    separatorCells.length === 0 ||
    !separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell))
  ) {
    return [];
  }

  const rows: string[][] = [];
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (!line.startsWith("|") || !line.endsWith("|")) break;
    rows.push(
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
  }
  return rows;
}

describe("UI Lab skill routing contract", () => {
  test("keeps one four-stage router with eight mutually exclusive branches", async () => {
    const router = await read("skill/ui-lab/SKILL.md");
    const tree = await read("skill/ui-lab/references/skill-tree.md");
    const routeSection = section(router, "## 先路由");
    const routeRows = markdownTableRows(routeSection);
    const routes = routeRows.map(
      (row) => row[1]?.match(/^`([^`]+)`$/)?.[1] ?? row[1] ?? "",
    );

    expect(routeRows).toHaveLength(8);
    expect(routes).toEqual([
      "discover",
      "select",
      "adopt",
      "replace",
      "review",
      "polish",
      "motion",
      "harden",
    ]);
    expect(new Set(routes).size).toBe(8);
    expect(tree.match(/^\| \*\*(Define|Build|Refine|Verify)\*\* \|/gm)?.map((row) => row.match(/\*\*(\w+)\*\*/)?.[1])).toEqual([
      "Define",
      "Build",
      "Refine",
      "Verify",
    ]);
    expect(router).toContain("每轮只进入一个互斥路线");
  });

  test("keeps every routed reference present", async () => {
    const references = [
      "skill-tree.md",
      "selection.md",
      "craft-contract.md",
      "review.md",
      "polish.md",
      "motion.md",
      "harden.md",
      "quality-gates.md",
      "influences.md",
    ];

    for (const reference of references) {
      await access(path.join(uiLabRoot, "references", reference));
    }
  });

  test("selects approved assets from reference evidence down to bespoke code", async () => {
    const router = await read("skill/ui-lab/SKILL.md");
    const selection = await read("skill/ui-lab/references/selection.md");
    const contract = `${router}\n${selection}`;

    expectInOrder(contract, [
      "Reference Pack",
      "System Preset",
      "Recipe",
      "Block",
      "Component",
      "shadcn primitive",
      "bespoke",
    ]);
    expect(selection).toMatch(/一次只分叉一个维度/);
    expect(selection).toMatch(/Agent.*不能|Agent.*不得/);
  });

  test("routes an applied discovery through selection before adopt or replace", async () => {
    const discover = await read("skill/ui-lab/references/discover.md");
    const guardrail = section(discover, "## Guardrail");

    expectInOrder(guardrail, ["select", "adopt", "replace"]);
  });

  test("keeps discover and select evidence writes isolated from consumer production code", async () => {
    const branches = [
      await read("skill/ui-lab/references/discover.md"),
      await read("skill/ui-lab/references/selection.md"),
    ];

    for (const branch of branches) {
      expect(branch).toMatch(
        /(?:may be generated|可以|可写|允许|放在)[^\n]{0,160}(?:temporary|临时|授权|evidence|harness)/i,
      );
      expect(branch).toMatch(/(?:do not|不得|不能|不修改)[^\n]{0,180}(?:consumer|消费者)/i);
    }
  });

  test("loads project and evidence contracts directly for every validating route", async () => {
    const router = await read("skill/ui-lab/SKILL.md");

    expect(routeRow(router, "review")).toContain("references/project-contract.md");
    for (const route of ["polish", "harden"]) {
      const row = routeRow(router, route);
      for (const reference of ["project-contract.md", "audit.md", "visual-acceptance.md"]) {
        expect(row).toContain(`references/${reference}`);
      }
    }
  });

  test("routes motion-only findings to motion review instead of general review", async () => {
    const review = section(await read("skill/ui-lab/references/review.md"), "## 边界");

    expect(review).toMatch(
      /纯\s*motion[^\n]{0,180}(?:必须进入|优先|first|route)[^\n]{0,100}(?:motion\.md|motion review)/i,
    );
  });
});

describe("UI Lab quality and motion policies", () => {
  test("keeps static, runtime, visual, and human evidence as four separate gates", async () => {
    const gates = await read("skill/ui-lab/references/quality-gates.md");
    const gateRows = [...gates.matchAll(/^\| \*\*(Static|Runtime|Visual|Human)\*\* \|/gm)].map(
      (match) => match[1],
    );

    expect(gateRows).toEqual(["Static", "Runtime", "Visual", "Human"]);
    expect(gates).toContain("4.5:1");
    expect(gates).toContain("3:1");
    expect(gates).toContain("Insufficient evidence");
  });

  test("keeps motion in find, review, or apply mode and reuses UI Lab tokens", async () => {
    const motion = await read("skill/ui-lab/references/motion.md");
    const motionModes = [...motion.matchAll(/^\| `(find|review|apply)` \|/gm)].map(
      (match) => match[1],
    );

    expect(motionModes).toEqual(["find", "review", "apply"]);
    for (const tokenFamily of ["EASE_*", "EASE_*_CSS", "SPRING_*"]) {
      expect(motion).toContain(tokenFamily);
    }
    expect(motion).toContain("lib/ease.ts");
    expect(motion).toContain("useReducedMotion()");
    expect(motion).toContain("useHoverCapable()");
  });

  test("makes motion apply load full contracts and motion review return a bounded verdict", async () => {
    const motion = await read("skill/ui-lab/references/motion.md");
    const applyContract = paragraphWith(motion, [
      "apply",
      "project-contract.md",
      "audit.md",
      "visual-acceptance.md",
    ]);
    const reviewVerdict = paragraphWith(motion, [
      "review",
      "Pass",
      "Block",
      "Insufficient evidence",
    ]);

    expect(applyContract).toBeDefined();
    expect(reviewVerdict).toBeDefined();
  });
});

describe("UI Lab skill metadata", () => {
  test("treats a locked System Preset as one composition axis without inventing manifest commands", async () => {
    const selection = await read("skill/ui-lab/references/selection.md");
    const systemPresetAxis = selection
      .split(/\n\s*\n/)
      .find(
        (paragraph) =>
          paragraph.includes("System Preset") &&
          /完整|锁定|full|locked/i.test(paragraph) &&
          /组合(?:决策)?轴|组合维度|composition axis/i.test(paragraph),
      );
    const mixingBan = selection
      .split(/\n\s*\n/)
      .find(
        (paragraph) =>
          /拆散|拆开|拆分|split/i.test(paragraph) &&
          /混搭|混合|mix/i.test(paragraph) &&
          /不得|不能|禁止|must not|do not/i.test(paragraph),
      );
    const fabricatedCommandBan = selection
      .split(/\n\s*\n/)
      .find(
        (paragraph) =>
          paragraph.includes("Confirmed Manifest") &&
          /命令|command/i.test(paragraph) &&
          /臆造|编造|fabricat|invent/i.test(paragraph) &&
          /不得|不能|禁止|must not|do not/i.test(paragraph),
      );

    expect(systemPresetAxis).toBeDefined();
    expect(mixingBan).toBeDefined();
    expect(fabricatedCommandBan).toBeDefined();
  });

  test("defines the current 43-token design-ingest boundary without claiming an application preset", async () => {
    const designIngest = await read("skill/design-ingest/SKILL.md");
    const contractParagraph = designIngest
      .split(/\n\s*\n/)
      .find(
        (paragraph) =>
          paragraph.includes("System Preset") && paragraph.includes("Confirmed Manifest"),
      );

    expect(designIngest).toMatch(/43\s*(?:个\s*)?(?:`?--wb-\*`?\s*)?(?:-\s*)?tokens?/iu);
    expect(designIngest).not.toMatch(/42\s*(?:个\s*)?(?:`?--wb-\*`?\s*)?(?:-\s*)?tokens?/iu);
    expect(contractParagraph).toBeDefined();
    expect(contractParagraph).toMatch(/不等于|不是|不能|does not|is not/i);
  });

  test("requires provenance and blocks publishing or copying assets without clear rights", async () => {
    const designIngest = await read("skill/design-ingest/SKILL.md");
    const provenanceHeading = "## 第 0 步 · Provenance / license 硬门";
    const provenanceGate = `${provenanceHeading}\n${section(designIngest, provenanceHeading)}`;

    for (const requiredField of [
      /Provenance/i,
      /License|许可/i,
      /权利人|rights holder/i,
      /Attribution|署名/i,
      /采集日期|capture date/i,
    ]) {
      expect(provenanceGate).toMatch(requiredField);
    }
    expect(provenanceGate).toMatch(
      /(?:权利人|rights)[^\n]{0,120}(?:不明|unknown)[^\n]{0,180}(?:禁止|不得|must not)[^\n]{0,120}vendoring/i,
    );
    expect(provenanceGate).toMatch(
      /(?:禁止|不得|must not)[^\n]{0,160}(?:Catalog|正式 `DESIGN_SYSTEMS`)/i,
    );
    expect(
      paragraphWith(provenanceGate, ["品牌资产", "外部 prompt", "源码", "不得复制"]),
    ).toBeDefined();
    expect(
      paragraphWith(provenanceGate, [
        "本地绝对路径",
        "用户名",
        "公开 `DESIGN.md`",
        "Catalog",
        "脱敏",
      ]),
    ).toBeDefined();
  });

  test("gives both model-invoked skills an explicit default prompt", async () => {
    for (const skillName of ["ui-lab", "design-ingest"]) {
      const config = await read(`skill/${skillName}/agents/openai.yaml`);
      const defaultPrompt = config.match(/^\s*default_prompt:\s*(.+)$/m)?.[1];

      expect(defaultPrompt).toBeDefined();
      expect(defaultPrompt).toContain(`$${skillName}`);
    }
  });
});
