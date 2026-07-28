# Issue tracker: GitHub

Issues and PRDs for this repository live in GitHub Issues:

- Repository: `xiaowen-0725/ui-lab`
- Remote: `https://github.com/xiaowen-0725/ui-lab`
- Operations use the `gh` CLI from this repository clone.

## Conventions

- Create: `gh issue create --title "..." --body "..."`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open`
- Comment: `gh issue comment <number> --body "..."`
- Label: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`
- Close: `gh issue close <number> --comment "..."`

When an engineering skill says “publish to the issue tracker,” create a
GitHub issue. When it says “fetch the relevant ticket,” read the corresponding
GitHub issue and its comments.

## Pull requests as a triage surface

PRs as a request surface: no.

## Wayfinding

A wayfinding map is one issue labeled `wayfinder:map`. Its child tickets use
`wayfinder:<type>`, where type is `research`, `prototype`, `grilling`, or
`task`.

Prefer GitHub sub-issues and native issue dependencies. If unavailable, record
relationships using `Part of #<map>` and `Blocked by: #<issue>` in issue bodies.

A ticket is ready to claim when it is open, unassigned, and has no open
blockers. Claim it with `gh issue edit <number> --add-assignee @me`.
