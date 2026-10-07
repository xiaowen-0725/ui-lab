# Plan 005 independent consumer acceptance

Run from repository root: `bun scripts/verify-application-consumers.ts` (optional Profile arguments). Each run creates fresh packages in /tmp. Templates are independent packages; shadcn 4.21.1 writes all registry implementation files. Graphite is installed by its real theme registry item. Local unpublished CLI uses one --dir throughout init/compose/add/lock/audit. Browser checks are engineering evidence, not user visual approval. No commit/push/publish.

Missing-helper audit: failure must be exit 1, restored helper audit must be exit 0. Each run remains below to retain failure/fix/retest history.

## Run 2026-10-03T14:22:03.647Z

Evidence root: `/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO`. Registry: `http://127.0.0.1:59632`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |



Commands and exit codes: [commands.json](/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/commands.json). HTTP requests: [requests.json](/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/requests.json). Registry graphs: [registry.json](/var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install` | 0 | /var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/002-tooling-command.log |
| tooling | `node node_modules/playwright/cli.js install chromium` | 143 | /var/folders/zb/n9v29jps6p90w6qjh7lswx080000gn/T/uilab-catalog-assets-Xf1spO/003-tooling-command.log |

## Run 2026-10-03T14:37:42.301Z

Evidence root: `/tmp/uilab-catalog-assets-dj9vtn`. Registry: `http://127.0.0.1:64800`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| next-app | FAIL | /tmp/uilab-catalog-assets-dj9vtn/next-app |

Failure next-app:

```text
Error: Expected exit 0, got 143: bun install
bun install v1.3.14 (0d9b296a)

Resolving dependencies

```

Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-dj9vtn/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-dj9vtn/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-dj9vtn/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-dj9vtn/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-dj9vtn/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-dj9vtn/002-tooling-command.log |
| next-app | `bun install` | 143 | /tmp/uilab-catalog-assets-dj9vtn/003-next-app-command.log |

## Resume fixes 2026-10-03

Removed automatic Chromium download; browser runner reuses an installed executable and records actual version. CLI `add` is called without unsupported `--json`; missing-helper finding accepts `missing|incomplete`. Initial Next consumer dependency installation was interrupted (exit 143) after prolonged download stalls. Official registry returned HTTP 200 but Next 15.5.9/SWC downloads remained slow. Next template now pins already cached compatible Next 15.5.18 to reuse the local package cache; no product source was modified. Existing failed run records are retained.

## Run 2026-10-03T14:38:56.426Z

Evidence root: `/tmp/uilab-catalog-assets-LrF7i0`. Registry: `http://127.0.0.1:50153`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| next-app | FAIL | /tmp/uilab-catalog-assets-LrF7i0/next-app |

Failure next-app:

```text
Error: Expected exit 0, got 1: node browser.mjs next-app /tmp/uilab-catalog-assets-LrF7i0/next-app /tmp/uilab-catalog-assets-LrF7i0 http://127.0.0.1:50654
{"profile":"next-app","assertions":100,"screenshots":56,"errors":["Failed to load resource: the server responded with a status of 404 (Not Found)","Error: Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.","Error: Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.","Error: Minified React error #418; visit https://react.dev/errors/418?args[]=HTML&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.","Error: locator.click: Error: strict mode violation: getByTestId('asset').locator('summary') resolved to 5 elements:\n    1) <summary class=\"cursor-pointer text-sm\">页面导航</summary> aka getByText('页面导航')\n    2) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">可以随时取消吗?</summary> aka getByText('可以随时取消吗?')\n    3) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">我的数据安全吗?</summary> aka getByText('我的数据安全吗?')\n    4) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">支持哪些付款方式?</summary> aka getByText('支持哪些付款方式?')\n    5) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">有免费试用吗?</summary> aka getByText('有免费试用吗?')\n\nCall log:\n  - waiting for getByTestId('asset').locator('summary')\n"]}


```

Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-LrF7i0/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-LrF7i0/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-LrF7i0/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-LrF7i0/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-LrF7i0/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-LrF7i0/002-tooling-command.log |
| next-app | `bun install` | 0 | /tmp/uilab-catalog-assets-LrF7i0/003-next-app-command.log |
| next-app | `bun cli/src/index.ts init --profile next-app --system graphite --json --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/004-next-app-command.log |
| next-app | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/005-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50153/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-LrF7i0/next-app` | 0 | /tmp/uilab-catalog-assets-LrF7i0/006-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50153/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-LrF7i0/next-app` | 0 | /tmp/uilab-catalog-assets-LrF7i0/007-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50153/r/button.json http://127.0.0.1:50153/r/button-base.json http://127.0.0.1:50153/r/saas-landing-page.json http://127.0.0.1:50153/r/workbench-conversation-page.json http://127.0.0.1:50153/r/workbench-artifact-page.json http://127.0.0.1:50153/r/workbench-settings-page.json http://127.0.0.1:50153/r/agent-workbench-site.json http://127.0.0.1:50153/r/agent-workbench.json http://127.0.0.1:50153/r/thread-list.json http://127.0.0.1:50153/r/agent-thread.json http://127.0.0.1:50153/r/agent-composer.json http://127.0.0.1:50153/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-LrF7i0/next-app` | 0 | /tmp/uilab-catalog-assets-LrF7i0/008-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50153/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-LrF7i0/next-app` | 0 | /tmp/uilab-catalog-assets-LrF7i0/009-next-app-command.log |
| next-app | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/010-next-app-command.log |
| next-app | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/011-next-app-command.log |
| next-app | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/012-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/013-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/014-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/015-next-app-command.log |
| next-app | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/016-next-app-command.log |
| next-app | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/017-next-app-command.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/018-next-app-audit.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 1 | /tmp/uilab-catalog-assets-LrF7i0/019-next-app-audit.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-LrF7i0/next-app --registry http://127.0.0.1:50153` | 0 | /tmp/uilab-catalog-assets-LrF7i0/020-next-app-audit.log |
| next-app | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-LrF7i0/021-next-app-command.log |
| next-app | `bun run build` | 0 | /tmp/uilab-catalog-assets-LrF7i0/022-next-app-command.log |
| next-app | `node browser.mjs next-app /tmp/uilab-catalog-assets-LrF7i0/next-app /tmp/uilab-catalog-assets-LrF7i0 http://127.0.0.1:50654` | 1 | /tmp/uilab-catalog-assets-LrF7i0/023-next-app-command.log |

## Run 2026-10-03T14:39:35.018Z

Evidence root: `/tmp/uilab-catalog-assets-Lh7fxq`. Registry: `http://127.0.0.1:63556`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| next-app | FAIL | /tmp/uilab-catalog-assets-Lh7fxq/next-app |
| vite-app | FAIL | /tmp/uilab-catalog-assets-Lh7fxq/vite-app |
| electron-renderer | FAIL | /tmp/uilab-catalog-assets-Lh7fxq/electron-renderer |

Failure next-app:

```text
Error: Expected exit 0, got 143: bun install
bun install v1.3.14 (0d9b296a)

Resolving dependencies

```

Failure vite-app:

```text
Error: Expected exit 0, got 1: bun cli/src/index.ts init --profile vite-app --system graphite --json --dir /tmp/uilab-catalog-assets-Lh7fxq/vite-app --registry http://127.0.0.1:63556

Cannot load requested registry http://127.0.0.1:63556 (Invalid catalog: recipe:saas-landing references missing section variant navbar/simple.); project files were not changed.

```

Failure electron-renderer:

```text
Error: Expected exit 0, got 1: bun install
bun install v1.3.14 (0d9b296a)

Resolving dependencies
Resolved, downloaded and extracted [300]
warn: electron's postinstall cost you 1m15.1s
RequestError: connect ETIMEDOUT 20.205.243.166:443
    at ClientRequest.<anonymous> (/private/tmp/uilab-catalog-assets-Lh7fxq/electron-renderer/node_modules/got/dist/source/core/index.js:970:111)
    at Object.onceWrapper (node:events:623:26)
    at ClientRequest.emit (node:events:520:35)
    at origin.emit (/private/tmp/uilab-catalog-assets-Lh7fxq/electron-renderer/node_modules/@szmarczak/http-timer/dist/source/index.js:43:20)
    at emitErrorEvent (node:_http_client:107:11)
    at TLSSocket.socketErrorListener (node:_http_client:574:5)
    at TLSSocket.emit (node:events:508:28)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21)
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16)

error: postinstall script from "electron" exited with 1

```

Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-Lh7fxq/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-Lh7fxq/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-Lh7fxq/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-Lh7fxq/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-Lh7fxq/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-Lh7fxq/002-tooling-command.log |
| next-app | `bun install` | 143 | /tmp/uilab-catalog-assets-Lh7fxq/003-next-app-command.log |
| vite-app | `bun install` | 0 | /tmp/uilab-catalog-assets-Lh7fxq/004-vite-app-command.log |
| vite-app | `bun cli/src/index.ts init --profile vite-app --system graphite --json --dir /tmp/uilab-catalog-assets-Lh7fxq/vite-app --registry http://127.0.0.1:63556` | 1 | /tmp/uilab-catalog-assets-Lh7fxq/005-vite-app-command.log |
| electron-renderer | `bun install` | 1 | /tmp/uilab-catalog-assets-Lh7fxq/006-electron-renderer-command.log |

## Run 2026-10-03T14:40:10.251Z

Evidence root: `/tmp/uilab-catalog-assets-Qp5mvx`. Registry: `http://127.0.0.1:50817`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| vite-app | FAIL | /tmp/uilab-catalog-assets-Qp5mvx/vite-app |

Failure vite-app:

```text
Error: Expected exit 0, got 1: node browser.mjs vite-app /tmp/uilab-catalog-assets-Qp5mvx/vite-app /tmp/uilab-catalog-assets-Qp5mvx http://127.0.0.1:51138
{"profile":"vite-app","assertions":100,"screenshots":56,"errors":["Failed to load resource: the server responded with a status of 404 (Not Found)","Error: locator.click: Error: strict mode violation: getByTestId('asset').locator('summary') resolved to 5 elements:\n    1) <summary class=\"cursor-pointer text-sm\">页面导航</summary> aka getByText('页面导航')\n    2) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">可以随时取消吗?</summary> aka getByText('可以随时取消吗?')\n    3) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">我的数据安全吗?</summary> aka getByText('我的数据安全吗?')\n    4) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">支持哪些付款方式?</summary> aka getByText('支持哪些付款方式?')\n    5) <summary class=\"cursor-pointer text-sm font-medium text-foreground\">有免费试用吗?</summary> aka getByText('有免费试用吗?')\n\nCall log:\n  - waiting for getByTestId('asset').locator('summary')\n"]}


```

Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-Qp5mvx/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-Qp5mvx/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-Qp5mvx/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/002-tooling-command.log |
| vite-app | `bun install` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/003-vite-app-command.log |
| vite-app | `bun cli/src/index.ts init --profile vite-app --system graphite --json --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/004-vite-app-command.log |
| vite-app | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/005-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50817/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Qp5mvx/vite-app` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/006-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50817/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Qp5mvx/vite-app` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/007-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50817/r/button.json http://127.0.0.1:50817/r/button-base.json http://127.0.0.1:50817/r/saas-landing-page.json http://127.0.0.1:50817/r/workbench-conversation-page.json http://127.0.0.1:50817/r/workbench-artifact-page.json http://127.0.0.1:50817/r/workbench-settings-page.json http://127.0.0.1:50817/r/agent-workbench-site.json http://127.0.0.1:50817/r/agent-workbench.json http://127.0.0.1:50817/r/thread-list.json http://127.0.0.1:50817/r/agent-thread.json http://127.0.0.1:50817/r/agent-composer.json http://127.0.0.1:50817/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Qp5mvx/vite-app` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/008-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:50817/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Qp5mvx/vite-app` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/009-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/010-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/011-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/012-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/013-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/014-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/015-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/016-vite-app-command.log |
| vite-app | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/017-vite-app-command.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/018-vite-app-audit.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 1 | /tmp/uilab-catalog-assets-Qp5mvx/019-vite-app-audit.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-Qp5mvx/vite-app --registry http://127.0.0.1:50817` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/020-vite-app-audit.log |
| vite-app | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/021-vite-app-command.log |
| vite-app | `bun run build` | 0 | /tmp/uilab-catalog-assets-Qp5mvx/022-vite-app-command.log |
| vite-app | `node browser.mjs vite-app /tmp/uilab-catalog-assets-Qp5mvx/vite-app /tmp/uilab-catalog-assets-Qp5mvx http://127.0.0.1:51138` | 1 | /tmp/uilab-catalog-assets-Qp5mvx/023-vite-app-command.log |

## Run 2026-10-03T15:10:48.576Z

Evidence root: `/tmp/uilab-catalog-assets-I7mUAE`. Registry: `http://127.0.0.1:57730`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| next-app | FAIL | /tmp/uilab-catalog-assets-I7mUAE/next-app |
| vite-app | FAIL | /tmp/uilab-catalog-assets-I7mUAE/vite-app |

Failure next-app:

```text
Error: Expected exit 0, got 1: node browser.mjs next-app /tmp/uilab-catalog-assets-I7mUAE/next-app /tmp/uilab-catalog-assets-I7mUAE http://127.0.0.1:57791
{"profile":"next-app","assertions":20,"screenshots":12,"errors":["Failed to load resource: the server responded with a status of 404 (Not Found)","AssertionError [ERR_ASSERTION]: false == true"]}


```

Failure vite-app:

```text
Error: Expected exit 0, got 1: node browser.mjs vite-app /tmp/uilab-catalog-assets-I7mUAE/vite-app /tmp/uilab-catalog-assets-I7mUAE http://127.0.0.1:57929
{"profile":"vite-app","assertions":20,"screenshots":12,"errors":["Failed to load resource: the server responded with a status of 404 (Not Found)","AssertionError [ERR_ASSERTION]: false == true"]}


```

Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-I7mUAE/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-I7mUAE/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-I7mUAE/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-I7mUAE/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-I7mUAE/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-I7mUAE/002-tooling-command.log |
| next-app | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-I7mUAE/003-next-app-command.log |
| next-app | `bun cli/src/index.ts init --profile next-app --system graphite --json --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/004-next-app-command.log |
| next-app | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/005-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/next-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/006-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/next-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/007-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/button.json http://127.0.0.1:57730/r/button-base.json http://127.0.0.1:57730/r/saas-landing-page.json http://127.0.0.1:57730/r/workbench-conversation-page.json http://127.0.0.1:57730/r/workbench-artifact-page.json http://127.0.0.1:57730/r/workbench-settings-page.json http://127.0.0.1:57730/r/agent-workbench-site.json http://127.0.0.1:57730/r/agent-workbench.json http://127.0.0.1:57730/r/thread-list.json http://127.0.0.1:57730/r/agent-thread.json http://127.0.0.1:57730/r/agent-composer.json http://127.0.0.1:57730/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/next-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/008-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/next-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/009-next-app-command.log |
| next-app | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/010-next-app-command.log |
| next-app | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/011-next-app-command.log |
| next-app | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/012-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/013-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/014-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/015-next-app-command.log |
| next-app | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/016-next-app-command.log |
| next-app | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/017-next-app-command.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/018-next-app-audit.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 1 | /tmp/uilab-catalog-assets-I7mUAE/019-next-app-audit.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-I7mUAE/next-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/020-next-app-audit.log |
| next-app | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-I7mUAE/021-next-app-command.log |
| next-app | `bun run build` | 0 | /tmp/uilab-catalog-assets-I7mUAE/022-next-app-command.log |
| next-app | `node browser.mjs next-app /tmp/uilab-catalog-assets-I7mUAE/next-app /tmp/uilab-catalog-assets-I7mUAE http://127.0.0.1:57791` | 1 | /tmp/uilab-catalog-assets-I7mUAE/023-next-app-command.log |
| vite-app | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-I7mUAE/024-vite-app-command.log |
| vite-app | `bun cli/src/index.ts init --profile vite-app --system graphite --json --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/025-vite-app-command.log |
| vite-app | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/026-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/vite-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/027-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/vite-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/028-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/button.json http://127.0.0.1:57730/r/button-base.json http://127.0.0.1:57730/r/saas-landing-page.json http://127.0.0.1:57730/r/workbench-conversation-page.json http://127.0.0.1:57730/r/workbench-artifact-page.json http://127.0.0.1:57730/r/workbench-settings-page.json http://127.0.0.1:57730/r/agent-workbench-site.json http://127.0.0.1:57730/r/agent-workbench.json http://127.0.0.1:57730/r/thread-list.json http://127.0.0.1:57730/r/agent-thread.json http://127.0.0.1:57730/r/agent-composer.json http://127.0.0.1:57730/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/vite-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/029-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:57730/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-I7mUAE/vite-app` | 0 | /tmp/uilab-catalog-assets-I7mUAE/030-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/031-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/032-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/033-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/034-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/035-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/036-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/037-vite-app-command.log |
| vite-app | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/038-vite-app-command.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/039-vite-app-audit.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 1 | /tmp/uilab-catalog-assets-I7mUAE/040-vite-app-audit.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-I7mUAE/vite-app --registry http://127.0.0.1:57730` | 0 | /tmp/uilab-catalog-assets-I7mUAE/041-vite-app-audit.log |
| vite-app | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-I7mUAE/042-vite-app-command.log |
| vite-app | `bun run build` | 0 | /tmp/uilab-catalog-assets-I7mUAE/043-vite-app-command.log |
| vite-app | `node browser.mjs vite-app /tmp/uilab-catalog-assets-I7mUAE/vite-app /tmp/uilab-catalog-assets-I7mUAE http://127.0.0.1:57929` | 1 | /tmp/uilab-catalog-assets-I7mUAE/044-vite-app-command.log |

## Run 2026-10-03T15:13:24.857Z

Evidence root: `/tmp/uilab-catalog-assets-jFoRH2`. Registry: `http://127.0.0.1:58469`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| next-app | PASS engineering/runtime | /tmp/uilab-catalog-assets-jFoRH2/next-app |
| vite-app | PASS engineering/runtime | /tmp/uilab-catalog-assets-jFoRH2/vite-app |


Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-jFoRH2/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-jFoRH2/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-jFoRH2/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-jFoRH2/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-jFoRH2/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-jFoRH2/002-tooling-command.log |
| next-app | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-jFoRH2/003-next-app-command.log |
| next-app | `bun cli/src/index.ts init --profile next-app --system graphite --json --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/004-next-app-command.log |
| next-app | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/005-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/next-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/006-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/next-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/007-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/button.json http://127.0.0.1:58469/r/button-base.json http://127.0.0.1:58469/r/saas-landing-page.json http://127.0.0.1:58469/r/workbench-conversation-page.json http://127.0.0.1:58469/r/workbench-artifact-page.json http://127.0.0.1:58469/r/workbench-settings-page.json http://127.0.0.1:58469/r/agent-workbench-site.json http://127.0.0.1:58469/r/agent-workbench.json http://127.0.0.1:58469/r/thread-list.json http://127.0.0.1:58469/r/agent-thread.json http://127.0.0.1:58469/r/agent-composer.json http://127.0.0.1:58469/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/next-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/008-next-app-command.log |
| next-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/next-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/009-next-app-command.log |
| next-app | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/010-next-app-command.log |
| next-app | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/011-next-app-command.log |
| next-app | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/012-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/013-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/014-next-app-command.log |
| next-app | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/015-next-app-command.log |
| next-app | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/016-next-app-command.log |
| next-app | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/017-next-app-command.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/018-next-app-audit.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 1 | /tmp/uilab-catalog-assets-jFoRH2/019-next-app-audit.log |
| next-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-jFoRH2/next-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/020-next-app-audit.log |
| next-app | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-jFoRH2/021-next-app-command.log |
| next-app | `bun run build` | 0 | /tmp/uilab-catalog-assets-jFoRH2/022-next-app-command.log |
| next-app | `node browser.mjs next-app /tmp/uilab-catalog-assets-jFoRH2/next-app /tmp/uilab-catalog-assets-jFoRH2 http://127.0.0.1:58561` | 0 | /tmp/uilab-catalog-assets-jFoRH2/023-next-app-command.log |
| vite-app | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-jFoRH2/024-vite-app-command.log |
| vite-app | `bun cli/src/index.ts init --profile vite-app --system graphite --json --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/025-vite-app-command.log |
| vite-app | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/026-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/vite-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/027-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/vite-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/028-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/button.json http://127.0.0.1:58469/r/button-base.json http://127.0.0.1:58469/r/saas-landing-page.json http://127.0.0.1:58469/r/workbench-conversation-page.json http://127.0.0.1:58469/r/workbench-artifact-page.json http://127.0.0.1:58469/r/workbench-settings-page.json http://127.0.0.1:58469/r/agent-workbench-site.json http://127.0.0.1:58469/r/agent-workbench.json http://127.0.0.1:58469/r/thread-list.json http://127.0.0.1:58469/r/agent-thread.json http://127.0.0.1:58469/r/agent-composer.json http://127.0.0.1:58469/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/vite-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/029-vite-app-command.log |
| vite-app | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:58469/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-jFoRH2/vite-app` | 0 | /tmp/uilab-catalog-assets-jFoRH2/030-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/031-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/032-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/033-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/034-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/035-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/036-vite-app-command.log |
| vite-app | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/037-vite-app-command.log |
| vite-app | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/038-vite-app-command.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/039-vite-app-audit.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 1 | /tmp/uilab-catalog-assets-jFoRH2/040-vite-app-audit.log |
| vite-app | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-jFoRH2/vite-app --registry http://127.0.0.1:58469` | 0 | /tmp/uilab-catalog-assets-jFoRH2/041-vite-app-audit.log |
| vite-app | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-jFoRH2/042-vite-app-command.log |
| vite-app | `bun run build` | 0 | /tmp/uilab-catalog-assets-jFoRH2/043-vite-app-command.log |
| vite-app | `node browser.mjs vite-app /tmp/uilab-catalog-assets-jFoRH2/vite-app /tmp/uilab-catalog-assets-jFoRH2 http://127.0.0.1:58670` | 0 | /tmp/uilab-catalog-assets-jFoRH2/044-vite-app-command.log |

## Run 2026-10-03T15:27:28.707Z

Evidence root: `/tmp/uilab-catalog-assets-Bdvh1a`. Registry: `http://127.0.0.1:61672`. Catalog frozen from current buildCatalog(); source graphs frozen using actual builders.

| Profile | Result | Evidence/package |
| --- | --- | --- |
| electron-renderer | PASS engineering/runtime | /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer |


Commands and exit codes: [commands.json](/tmp/uilab-catalog-assets-Bdvh1a/commands.json). HTTP requests: [requests.json](/tmp/uilab-catalog-assets-Bdvh1a/requests.json). Registry graphs: [registry.json](/tmp/uilab-catalog-assets-Bdvh1a/registry.json). Screenshots, assertions and runtime errors: `<Profile>-browser.json`, `<Profile>-*.png`, and command/runtime logs in the same evidence root.

| Profile | Command | Exit | Log |
| --- | --- | --- | --- |
| tooling | `bun install --frozen-lockfile` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/000-tooling-command.log |
| tooling | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js --version` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/001-tooling-command.log |
| tooling | `bun cli/src/index.ts --help` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/002-tooling-command.log |
| electron-renderer | `bun install` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/003-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts init --profile electron-renderer --system graphite --json --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/004-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts compose agent-workbench --json --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/005-electron-renderer-command.log |
| electron-renderer | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:61672/r/theme-graphite.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/006-electron-renderer-command.log |
| electron-renderer | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:61672/r/button-base.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/007-electron-renderer-command.log |
| electron-renderer | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:61672/r/button.json http://127.0.0.1:61672/r/button-base.json http://127.0.0.1:61672/r/saas-landing-page.json http://127.0.0.1:61672/r/workbench-conversation-page.json http://127.0.0.1:61672/r/workbench-artifact-page.json http://127.0.0.1:61672/r/workbench-settings-page.json http://127.0.0.1:61672/r/agent-workbench-site.json http://127.0.0.1:61672/r/agent-workbench.json http://127.0.0.1:61672/r/thread-list.json http://127.0.0.1:61672/r/agent-thread.json http://127.0.0.1:61672/r/agent-composer.json http://127.0.0.1:61672/r/artifact-panel.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/008-electron-renderer-command.log |
| electron-renderer | `node /Users/zhoujw/develop/github/ui-lab/benchmarks/runs/catalog-assets/node_modules/shadcn/dist/index.js add http://127.0.0.1:61672/r/system-workbench.json --yes --overwrite --cwd /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/009-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add button --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/010-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add button-base --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/011-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add saas-landing-page --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/012-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add workbench-conversation-page --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/013-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add workbench-artifact-page --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/014-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add workbench-settings-page --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/015-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts add agent-workbench-site --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/016-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts lock --json --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/017-electron-renderer-command.log |
| electron-renderer | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/018-electron-renderer-audit.log |
| electron-renderer | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 1 | /tmp/uilab-catalog-assets-Bdvh1a/019-electron-renderer-audit.log |
| electron-renderer | `bun cli/src/index.ts audit --json --strict --dir /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer --registry http://127.0.0.1:61672` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/020-electron-renderer-audit.log |
| electron-renderer | `bun run typecheck` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/021-electron-renderer-command.log |
| electron-renderer | `bun run build` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/022-electron-renderer-command.log |
| electron-renderer | `node browser.mjs electron-renderer /tmp/uilab-catalog-assets-Bdvh1a/electron-renderer /tmp/uilab-catalog-assets-Bdvh1a` | 0 | /tmp/uilab-catalog-assets-Bdvh1a/023-electron-renderer-command.log |


## 通过记录与复跑边界

最终Next/Vite run `/tmp/uilab-catalog-assets-jFoRH2`，两Profile均通过；最终Electron run `/tmp/uilab-catalog-assets-Bdvh1a`，实际Electron38.2.0、Chrome140.0.7339.133 hidden BrowserWindow，运行`file:`构建产物，通过129检查/66截图/0error。所有原失败保留上文。默认完整命令为 `bun run benchmark:catalog-assets`；只重跑某Profile可传 `bun scripts/verify-application-consumers.ts electron-renderer`。

如Electron postinstall网络超时，可先用官方Electron release的SHA-256校验完整二进制，再指定：

```sh
ELECTRON_SKIP_BINARY_DOWNLOAD=1 \
UILAB_ELECTRON_EXECUTABLE=/absolute/path/Electron.app/Contents/MacOS/Electron \
bun scripts/verify-application-consumers.ts electron-renderer
```

这仍启动真实Electron并断言版本/隐藏窗口/fileURL；不接受Vite或Chrome模拟Electron。实际本轮官方38.2.0 archive SHA-256和获取来源见 `plans/005-evidence/electron-runtime-provenance.json`，运行/命令副本见相邻evidence。消费者userData/sessionData在临时package内，不使用原有桌面应用的数据目录。
