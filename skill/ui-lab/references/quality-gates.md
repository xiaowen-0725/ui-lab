# Quality gates

四层门禁分别回答“结构正确、运行正常、视觉一致、是否获准”。上层不能替代下层，任何指标都必须来自工具、runtime artifact 或用户记录，Agent 不得自报。

| 层 | 必须证明 | 可接受证据 |
|---|---|---|
| **Static** | 类型、lint、registry/source-family、config/lock/Recipe 结构正确；strict audit 为 `0 errors / 0 warnings` | 原始命令输出、audit JSON、文件路径与 Catalog/registry 记录 |
| **Runtime** | 目标 runtime 启动并保持业务/API/IPC；所需 viewport 无横向溢出；所需字体 family 与 weight 实际加载；所有要求状态、keyboard 与 a11y 行为可达 | Electron/浏览器目标运行时日志、自动化结果、computed font/`document.fonts` 证据、状态 case |
| **Visual** | 同尺寸可比较截图覆盖布局、主题、状态、responsive、focus 与 reduced motion；差异被分类并解释 | [visual-acceptance.md](visual-acceptance.md) 定义的 pair、capture metadata、comparison report、图像 diff 辅助结果 |
| **Human** | 用户批准 visual master、approved acceptance evidence 与适用订单 | 明确用户决定及其绑定的 evidence id/path；不能由 Agent、audit、hash 或 pixel score生成 |

## 量化下限

- 正常文本对比度至少 **4.5:1**；大文本以及适用的关键 UI 边界/图形至少 **3:1**。使用对比度工具或可复核的 computed color 结果，不凭肉眼宣称。
- Recipe、approved contract 或测试要求的 viewport 中不得出现非预期横向溢出；记录 viewport、`scrollWidth` 与 `clientWidth` 或等价自动化断言。
- 字体 family 及实际使用的每个 weight 必须完成加载，不允许静默 fallback；附 `document.fonts.check(...)`、网络/资源记录或等价证据。
- loading、empty、error、success、disabled、offline、permission 及所有 Recipe/domain-required 状态必须覆盖；不适用项需有可复核理由。
- 必须在声明的 target runtime 验证。Electron、WebView 或桌面壳不能只用普通浏览器截图替代。

## 结论规则

- 缺原始输出、截图 metadata、状态 fixture 或批准记录时，标为 `Insufficient evidence`，不得补写一个“已通过”。
- Audit 通过不等于视觉通过；visual diff 低不等于用户批准；用户批准也不能掩盖 static/runtime blocker。
- Mutating 路线交付时列出每层的 Pass/Block/Insufficient evidence 和证据位置。

