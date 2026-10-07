# 组件实验室 (UI Lab)

本项目的完整约定见 @AGENTS.md(所有 agent 通用,单一真源)。Claude Code 会随本文件一并加载它。

新增流程写入 `CONTRIBUTING.md`，判断规则写入 `CODING_STANDARDS.md`，机械规则进入检查脚本；`AGENTS.md` 只保留必要边界和按任务读取的指针。

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
