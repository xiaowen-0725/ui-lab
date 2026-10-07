# 组件实验室 (UI Lab)

本项目的完整约定见 @AGENTS.md(所有 agent 通用,单一真源)。Claude Code 会随本文件一并加载它。

新增流程写入 `CONTRIBUTING.md`，判断规则写入 `CODING_STANDARDS.md`，机械规则进入检查脚本；`AGENTS.md` 只保留必要边界和按任务读取的指针。

## Agent skills

### Issue tracker

需求与问题跟踪使用 `xiaowen-0725/ui-lab` 的 GitHub Issues（`gh`）。见 [issue-tracker.md](docs/agents/issue-tracker.md)。

### Triage labels

分诊使用五个默认标签；角色映射见 [triage-labels.md](docs/agents/triage-labels.md)。

### Domain docs

单上下文：根 `GLOSSARY.md` + `docs/adr/`；术语表建立前读取现有 `CONTEXT.md`。读取与迁移规则见 [domain.md](docs/agents/domain.md)。
