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

function routeRow(markdown: string, route: string): string {
  return (
    markdown
      .split(/\r?\n/)
      .find((line) => line.startsWith("|") && line.includes(`| \`${route}\` |`)) ?? ""
  );
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
  test("keeps a two-route component discover/install router", async () => {
    const router = await read("skill/ui-lab/SKILL.md");
    const routeSection = section(router, "## 先路由");
    const routeRows = markdownTableRows(routeSection);
    const routes = routeRows.map(
      (row) => row[1]?.match(/^`([^`]+)`$/)?.[1] ?? row[1] ?? "",
    );

    expect(routeRows).toHaveLength(2);
    expect(routes).toEqual(["discover", "install"]);
    expect(new Set(routes).size).toBe(2);
    expect(router).toContain("每轮只进入一个互斥路线");
    expect(router).toMatch(/shadcn/i);
    expect(router).toMatch(/查询|搜索|list|search/i);
    expect(router).toMatch(/安装|install|add/i);
  });

  test("keeps required references present and linked", async () => {
    for (const reference of ["discover.md", "install.md", "scope-boundary.md"]) {
      await access(path.join(uiLabRoot, "references", reference));
    }

    const router = await read("skill/ui-lab/SKILL.md");
    expect(routeRow(router, "discover")).toContain("references/discover.md");
    expect(routeRow(router, "install")).toContain("references/install.md");
  });

  test("discover stays read-only and points at catalog commands", async () => {
    const discover = await read("skill/ui-lab/references/discover.md");
    expect(discover).toMatch(/ui-lab search/);
    expect(discover).toMatch(/ui-lab list/);
    expect(discover).toMatch(/ui-lab show/);
    expect(discover).toMatch(/(?:do not|不|不得|不能)[^\n]{0,120}(?:consumer|消费者|生产|业务代码|修改)/i);
  });

  test("install uses shadcn registry commands and does not auto-run by default", async () => {
    const install = await read("skill/ui-lab/references/install.md");
    expect(install).toMatch(/ui-lab add/);
    expect(install).toMatch(/shadcn/i);
    expect(install).toMatch(/(?:不自动|not executed|打印|print)/i);
    expect(install).toMatch(/pnpm|npm|bun|yarn/);
  });

  test("explicitly excludes design-system lifecycle and admin template work", async () => {
    const router = await read("skill/ui-lab/SKILL.md");
    const scope = await read("skill/ui-lab/references/scope-boundary.md");
    const contract = `${router}\n${scope}`;

    expect(contract).toMatch(/uilab-admin|\$uilab-admin/);
    expect(contract).toMatch(/创建器|视觉选择|下单|creator|visual-selection|order/i);
    expect(contract).toMatch(/(?:不做|不在范围|Do NOT|不处理)/i);
  });
});

describe("UI Lab skill metadata", () => {
  test("gives the model-invoked skill an explicit default prompt", async () => {
    const prompt = await read("skill/ui-lab/agents/openai.yaml");
    expect(prompt).toContain("$ui-lab");
    expect(prompt.toLowerCase()).toMatch(/组件|component|install|安装|查询|search/);
  });
});
