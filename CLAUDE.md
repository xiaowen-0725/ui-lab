# 组件实验室 (UI Lab)

本项目的完整约定见 @AGENTS.md(所有 agent 通用,单一真源)。Claude Code 会随本文件一并加载它。

不在此重复内容 —— 有新增约定请写进 `AGENTS.md`,这里只保留导入。

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
