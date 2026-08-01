# Route: discover

只读查询 UI Lab 已有组件/区块。

## 做什么

- 搜索、列表、查看组件详情
- 返回 install / fetch 信息
- 比较候选并说明取舍

## 不做什么

- 不创建/修改消费者业务代码
- 不进入 Preset / Package / adopt / replace 流程
- 不安装组件（安装走 `install` 路线）

## 步骤

1. 运行 `ui-lab --help`，确认当前 CLI 能力
2. 把用户需求翻译成关键词 / kind / slug
3. 查询：

```bash
ui-lab search "<need>" --json
ui-lab list --kind component --json
ui-lab list --kind block --json
ui-lab show <slug> --json
```

4. 需要指定部署源时：

```bash
ui-lab search "<need>" --registry https://ui-lab-ten.vercel.app --json
```

`--registry` 填部署 base URL，不要带 `/catalog.json`。

5. 输出候选表

## 输出模板

```md
## Discover

| 需求 | 候选 (kind/slug) | 为什么合适 | 安装命令/来源 | 注意 |
|---|---|---|---|---|

### 建议下一步
- 若要安装：进入 `install`，指定 slug
- 若都不合适：说明缺口，不要伪造组件
```

## 证据要求

- 结果必须来自 CLI/catalog/registry，不能凭记忆编造 slug
- 说明数据来自 bundled snapshot 还是 `--registry` 线上源
