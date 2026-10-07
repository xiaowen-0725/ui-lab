import type { WorkbenchSiteData } from "@/components/site-shells/agent-workbench-site";

/** Demonstration-only records; public pages never import this module. */
export function applicationSampleData(locale: "zh" | "en"): WorkbenchSiteData {
  const zh = locale === "zh";
  return {
    messages: [
      {
        id: "request",
        role: "user",
        content: zh
          ? "帮我整理本周的产品更新，做成一份清晰的发布摘要。"
          : "Organize this week's product updates into a clear release summary.",
      },
      {
        id: "response",
        role: "assistant",
        content: (
          <div className="space-y-4">
            <p>
              {zh
                ? "已整理三项重点变更。摘要保留了背景、用户影响和后续行动，方便团队核对。"
                : "I organized three key changes. The summary covers context, user impact and next steps for the team to review."}
            </p>
            <div className="rounded-2xl border border-[var(--wb-border)] bg-[var(--wb-inset)] p-4">
              <h2 className="mb-2 text-sm font-semibold">
                {zh ? "本周发布摘要" : "Weekly release summary"}
              </h2>
              <ul className="space-y-2 text-sm">
                <li>{zh ? "简化新成员加入工作区的流程" : "Simpler workspace onboarding"}</li>
                <li>
                  {zh
                    ? "制品预览与源码可以快速切换"
                    : "Faster switching between artifact previews and code"}
                </li>
                <li>
                  {zh ? "偏好设置集中到统一页面" : "Preferences brought together in one page"}
                </li>
              </ul>
            </div>
            <p>
              {zh
                ? "你可以在制品页检查摘要，再决定如何分享。"
                : "Review the summary in Artifacts before deciding how to share it."}
            </p>
          </div>
        ),
      },
    ],
    artifacts: [
      {
        id: "summary",
        title: zh ? "发布摘要.md" : "release-summary.md",
        description: zh ? "文档 · 最新版本" : "Document · Latest version",
        preview: (
          <article className="mx-auto max-w-xl space-y-5 py-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {zh ? "产品更新" : "Product update"}
            </p>
            <h2 className="text-2xl font-semibold">
              {zh ? "让协作更顺畅" : "A smoother way to collaborate"}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {zh
                ? "本次更新围绕日常工作：会话推动任务，制品沉淀结果，设置保持工作区的一致体验。"
                : "This update focuses on everyday work: conversations move tasks forward, artifacts preserve results, and preferences keep the workspace consistent."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {(zh
                ? ["更少步骤", "清晰结果", "统一偏好"]
                : ["Fewer steps", "Clear results", "Shared preferences"]
              ).map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-[var(--wb-border)] bg-[var(--wb-inset-faint)] p-4 text-sm"
                >
                  {label}
                </div>
              ))}
            </div>
          </article>
        ),
        code: zh
          ? "# 让协作更顺畅\n\n- 更少步骤\n- 清晰结果\n- 统一偏好"
          : "# A smoother way to collaborate\n\n- Fewer steps\n- Clear results\n- Shared preferences",
      },
      {
        id: "checklist",
        title: zh ? "发布清单.txt" : "release-checklist.txt",
        preview: (
          <ul className="space-y-3 text-sm">
            {(zh
              ? ["核对更新内容", "检查中英文文案", "确认分享范围"]
              : ["Review changes", "Check bilingual copy", "Confirm sharing scope"]
            ).map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        ),
        code: "[ ] Review changes\n[ ] Check copy\n[ ] Confirm sharing scope",
      },
    ],
    preferences: {
      workspaceName: zh ? "产品设计工作区" : "Product design workspace",
      appearance: "system",
      notifications: true,
    },
  };
}
