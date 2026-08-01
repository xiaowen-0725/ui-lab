import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const skillRoot = path.join(projectRoot, "skill");
const errors: string[] = [];
const allowedFrontmatterKeys = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
]);

type MarkdownLink = {
  source: string;
  target: string;
};

function relative(filePath: string): string {
  return path.relative(projectRoot, filePath) || ".";
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files.sort();
}

function decodeYamlScalar(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed) as string;
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }
  return trimmed;
}

function yamlScalarAtIndent(source: string, key: string, expectedIndent: number): string | undefined {
  const lines = source.split(/\r?\n/);
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fieldPattern = new RegExp(`^ {${expectedIndent}}${escapedKey}:\\s*(.*)$`);

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index]?.match(fieldPattern);
    if (!match) continue;

    const rawValue = match[1] ?? "";
    if (!/^[|>][-+]?\s*$/.test(rawValue)) {
      return decodeYamlScalar(rawValue);
    }

    const blockLines: string[] = [];
    for (let next = index + 1; next < lines.length; next += 1) {
      const line = lines[next] ?? "";
      if (
        line.trim().length > 0 &&
        (line.match(/^\s*/)?.[0].length ?? 0) <= expectedIndent
      ) {
        break;
      }
      blockLines.push(line);
    }

    const nonEmptyIndents = blockLines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
    const blockIndent =
      nonEmptyIndents.length > 0 ? Math.min(...nonEmptyIndents) : expectedIndent + 1;
    const normalized = blockLines.map((line) => line.slice(Math.min(blockIndent, line.length)));
    return rawValue.trimStart().startsWith(">")
      ? normalized.join(" ").replace(/\s+/g, " ").trim()
      : normalized.join("\n").trim();
  }

  return undefined;
}

function topLevelKeys(source: string): string[] {
  return source
    .split(/\r?\n/)
    .map((line) => {
      if (line.length === 0 || /^\s|^#/.test(line)) return undefined;
      return line.match(/^([^:#][^:]*):(?:\s|$)/)?.[1]?.trim();
    })
    .filter((key): key is string => Boolean(key));
}

function interfaceDefaultPrompt(source: string): string | undefined {
  const lines = source.split(/\r?\n/);
  const interfaceIndex = lines.findIndex((line) => /^interface:\s*$/.test(line));
  if (interfaceIndex < 0) return undefined;

  const interfaceLines: string[] = [];
  for (let index = interfaceIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (line.trim().length > 0 && !line.startsWith(" ")) break;
    interfaceLines.push(line);
  }
  return yamlScalarAtIndent(interfaceLines.join("\n"), "default_prompt", 2);
}

function frontmatter(markdown: string): string | undefined {
  return markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
}

function withoutFencedCode(markdown: string): string {
  const visibleLines: string[] = [];
  let fence: "```" | "~~~" | undefined;

  for (const line of markdown.split(/\r?\n/)) {
    const marker = line.match(/^\s*(```|~~~)/)?.[1] as "```" | "~~~" | undefined;
    if (marker) {
      if (!fence) fence = marker;
      else if (fence === marker) fence = undefined;
      continue;
    }
    if (!fence) visibleLines.push(line);
  }

  return visibleLines.join("\n");
}

function relativeMarkdownTargets(markdown: string): string[] {
  const targets: string[] = [];
  const visibleMarkdown = withoutFencedCode(markdown);
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;

  for (const match of visibleMarkdown.matchAll(linkPattern)) {
    let target = (match[1] ?? "").trim();
    const angleTarget = target.match(/^<([^>]+)>/);
    if (angleTarget?.[1]) {
      target = angleTarget[1];
    } else {
      target = target.replace(/\s+(?:"[^"]*"|'[^']*')\s*$/, "");
    }

    if (
      target.length === 0 ||
      target.startsWith("#") ||
      target.startsWith("/") ||
      target.startsWith("//") ||
      /^[a-z][a-z\d+.-]*:/i.test(target)
    ) {
      continue;
    }

    const pathOnly = target.split(/[?#]/, 1)[0];
    if (!pathOnly) continue;
    try {
      targets.push(decodeURIComponent(pathOnly));
    } catch {
      targets.push(pathOnly);
    }
  }

  return targets;
}

const skillDirectories = (await readdir(skillRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort((left, right) => left.name.localeCompare(right.name));

const skillFiles: string[] = [];
let agentPromptCount = 0;

for (const directory of skillDirectories) {
  const skillFile = path.join(skillRoot, directory.name, "SKILL.md");
  if (!(await exists(skillFile))) continue;
  skillFiles.push(skillFile);

  const markdown = await readFile(skillFile, "utf8");
  const metadata = frontmatter(markdown);
  if (!metadata) {
    errors.push(`${relative(skillFile)}: missing YAML frontmatter`);
    continue;
  }

  const keys = topLevelKeys(metadata);
  for (const key of new Set(keys)) {
    if (!allowedFrontmatterKeys.has(key)) {
      errors.push(`${relative(skillFile)}: unknown top-level frontmatter field "${key}"`);
    }
  }
  for (const key of new Set(keys.filter((candidate, index) => keys.indexOf(candidate) !== index))) {
    errors.push(`${relative(skillFile)}: duplicate top-level frontmatter field "${key}"`);
  }

  const name = yamlScalarAtIndent(metadata, "name", 0)?.trim();
  const description = yamlScalarAtIndent(metadata, "description", 0)?.trim();
  if (!name) {
    errors.push(`${relative(skillFile)}: frontmatter name is missing or empty`);
  } else {
    if (name.length > 64) {
      errors.push(
        `${relative(skillFile)}: frontmatter name is ${name.length} characters; maximum is 64`,
      );
    }
    if (name !== directory.name) {
      errors.push(
        `${relative(skillFile)}: frontmatter name "${name}" must match directory "${directory.name}"`,
      );
    }
    if (!/^[a-z\d]+(?:-[a-z\d]+)*$/.test(name)) {
      errors.push(`${relative(skillFile)}: frontmatter name "${name}" must use hyphen-case`);
    }
  }

  if (!description) {
    errors.push(`${relative(skillFile)}: frontmatter description is missing or empty`);
  } else {
    if (description.length > 1024) {
      errors.push(
        `${relative(skillFile)}: frontmatter description is ${description.length} characters; maximum is 1024`,
      );
    }
    if (/[<>]/.test(description)) {
      errors.push(`${relative(skillFile)}: frontmatter description must not contain angle brackets`);
    }
  }

  const openAiConfig = path.join(skillRoot, directory.name, "agents", "openai.yaml");
  if (await exists(openAiConfig)) {
    agentPromptCount += 1;
    const prompt = interfaceDefaultPrompt(await readFile(openAiConfig, "utf8"))?.trim();
    if (!prompt) {
      errors.push(`${relative(openAiConfig)}: default_prompt is missing or empty`);
    } else if (name && !prompt.includes(`$${name}`)) {
      errors.push(`${relative(openAiConfig)}: default_prompt must contain $${name}`);
    }
  }
}

const markdownFiles = await collectMarkdownFiles(skillRoot);
const markdownLinks: MarkdownLink[] = [];
const resolvedLinks = new Map<string, string[]>();

for (const markdownFile of markdownFiles) {
  const markdown = await readFile(markdownFile, "utf8");
  const resolvedTargets: string[] = [];
  for (const target of relativeMarkdownTargets(markdown)) {
    const resolvedTarget = path.resolve(path.dirname(markdownFile), target);
    markdownLinks.push({ source: markdownFile, target });
    resolvedTargets.push(resolvedTarget);
    if (!(await exists(resolvedTarget))) {
      errors.push(`${relative(markdownFile)}: relative Markdown link "${target}" does not exist`);
    }
  }
  resolvedLinks.set(path.resolve(markdownFile), resolvedTargets);
}

const uiLabRoot = path.join(skillRoot, "ui-lab");
const uiLabSkill = path.join(uiLabRoot, "SKILL.md");
const requiredUiLabReferences = [
  "discover.md",
  "install.md",
  "scope-boundary.md",
].map((fileName) => path.join(uiLabRoot, "references", fileName));

if (!(await exists(uiLabSkill))) {
  errors.push(`${relative(uiLabSkill)}: required UI Lab router is missing`);
} else {
  const reachable = new Set<string>();
  const pending = [path.resolve(uiLabSkill)];
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current || reachable.has(current)) continue;
    reachable.add(current);
    for (const target of resolvedLinks.get(current) ?? []) {
      const targetPath = path.resolve(target);
      if (
        targetPath.endsWith(".md") &&
        (targetPath === path.resolve(uiLabRoot) || targetPath.startsWith(`${path.resolve(uiLabRoot)}${path.sep}`))
      ) {
        pending.push(targetPath);
      }
    }
  }

  for (const reference of requiredUiLabReferences) {
    if (!(await exists(reference))) {
      errors.push(`${relative(reference)}: required UI Lab reference is missing`);
    } else if (!reachable.has(path.resolve(reference))) {
      errors.push(`${relative(reference)}: required UI Lab reference is not reachable from skill/ui-lab/SKILL.md`);
    }
  }
}

const designIngestFile = path.join(skillRoot, "design-ingest", "SKILL.md");
if (await exists(designIngestFile)) {
  const designIngest = await readFile(designIngestFile, "utf8");
  const staleTokenClaim = /42\s*(?:个\s*)?(?:`?--wb-\*`?\s*)?(?:-\s*)?tokens?/giu;
  if (staleTokenClaim.test(designIngest)) {
    errors.push(
      `${relative(designIngestFile)}: contains a stale 42-token/42 个 --wb-* contract statement`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Skill validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Validated ${skillFiles.length} skills, ${markdownFiles.length} Markdown files, ${markdownLinks.length} relative links, and ${agentPromptCount} OpenAI agent prompt(s).`,
);
