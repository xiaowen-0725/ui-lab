# 组件实验室 (UI Lab)

本项目的完整约定见 @AGENTS.md(所有 agent 通用,单一真源)。Claude Code 会随本文件一并加载它。

不在此重复内容 —— 有新增约定请写进 `AGENTS.md`,这里只保留导入。

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `xiaowen-0725/ui-lab`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the canonical triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository. Domain vocabulary belongs in root `CONTEXT.md`, with decisions under `docs/adr/`. See `docs/agents/domain.md`.
