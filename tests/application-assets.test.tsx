import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useState } from "react";
import ts from "typescript";
import {
  SaasLandingPage,
  WorkbenchArtifactPage,
  WorkbenchConversationPage,
  WorkbenchSettingsPage,
  type ApplicationPageState,
  type WorkbenchPreferences,
} from "@/components/pages";
import { SECTION_VARIANTS, FeaturesGrid, HeroCentered, NavbarSimple } from "@/components/sections";
import { AgentWorkbenchSite, type WorkbenchSitePage } from "@/components/site-shells";
import { PAGES } from "@/lib/pages";
import { SITES } from "@/lib/sites";
import { readSourceFile, resolveSourceImport } from "@/lib/source-files";

const messages = [
  { id: "user", role: "user" as const, content: "A consumer-owned request" },
  { id: "agent", role: "assistant" as const, content: "A consumer-owned response" },
];
const artifacts = [
  { id: "one", title: "One", preview: <h2>First preview</h2>, code: "export const first = 1;" },
  { id: "two", title: "Two", preview: <h2>Second preview</h2>, code: "export const second = 2;" },
];
const preferences: WorkbenchPreferences = {
  workspaceName: "Consumer workspace",
  appearance: "system",
  notifications: false,
};

afterEach(cleanup);

describe("distributable section entry points", () => {
  test("all 19 public variants render in both locales without a site provider", () => {
    expect(Object.keys(SECTION_VARIANTS)).toHaveLength(19);
    for (const locale of ["zh", "en"] as const) {
      for (const Section of Object.values(SECTION_VARIANTS)) {
        const { container, unmount } = render(
          <Section locale={locale} className="consumer-section" />,
        );
        expect(container.firstElementChild?.classList.contains("consumer-section")).toBe(true);
        expect(container.textContent?.length).toBeGreaterThan(0);
        unmount();
      }
    }
  });

  test("content and action overrides work through the same public implementation", () => {
    const onAction = mock();
    const { rerender } = render(
      <HeroCentered
        locale="en"
        content={{ title: "Consumer headline", primary: "Launch" }}
        onAction={onAction}
      />,
    );
    expect(screen.getByRole("heading", { name: "Consumer headline" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Launch" }));
    expect(onAction).toHaveBeenCalledWith("primary");
    rerender(
      <HeroCentered
        content={{ primary: "Launch" }}
        hrefs={{ primary: "/signup" }}
        onAction={onAction}
      />,
    );
    expect(screen.getByRole("link", { name: "Launch" }).getAttribute("href")).toBe("/signup");
  });

  test("navigation is made of genuine links and supplied feature arrays are not fixed to sample data", () => {
    const { rerender } = render(
      <NavbarSimple content={{ links: ["Custom link"] }} hrefs={{ "Custom link": "/custom" }} />,
    );
    expect(screen.getByRole("link", { name: "Custom link" }).getAttribute("href")).toBe("/custom");
    rerender(<FeaturesGrid content={{ title: "Custom features", cards: [] }} />);
    expect(screen.getByRole("heading", { name: "Custom features" })).toBeTruthy();
    expect(screen.queryByText("秒级响应")).toBeNull();
  });
});

describe("complete SaaS page", () => {
  test("contains real section layouts, working anchors, plan actions and native FAQ", () => {
    const onAction = mock();
    const { container } = render(
      <SaasLandingPage
        locale="en"
        onAction={onAction}
        content={{ hero: { title: "Consumer SaaS" } }}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Consumer SaaS" })).toBeTruthy();
    for (const name of [
      "Three things, done well",
      "Feedback from real teams",
      "Simple, transparent pricing",
      "Still have questions?",
    ])
      expect(screen.getByRole("heading", { name })).toBeTruthy();
    const primary = screen.getByRole("link", { name: "Start for free" });
    const target = primary.getAttribute("href")?.slice(1);
    expect(target && document.getElementById(target)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Upgrade now" }));
    expect(onAction).toHaveBeenCalledWith("Pro");
    const questions = container.querySelectorAll("details");
    expect(questions).toHaveLength(5); // Mobile navigation plus four FAQ entries.
    const question = Array.from(questions).find((item) =>
      item.textContent?.includes("Is my data safe?"),
    );
    expect(question).toBeTruthy();
    if (!question) throw new Error("FAQ is missing");
    const summary = question.querySelector("summary");
    if (!summary) throw new Error("FAQ summary is missing");
    fireEvent.click(summary);
    expect(question.open).toBe(true);
    expect(question.textContent).toContain("encrypted");
  });

  test("pricing is optional and action URLs are consumer-owned", () => {
    render(<SaasLandingPage showPricing={false} hrefs={{ primary: "/register" }} />);
    expect(screen.queryByRole("heading", { name: "简单透明的价格" })).toBeNull();
    expect(screen.getByRole("link", { name: "免费开始" }).getAttribute("href")).toBe("/register");
  });
});

describe("conversation page behavior", () => {
  test("renders supplied messages and dispatches trimmed sends by button and Enter", () => {
    const onAction = mock();
    render(<WorkbenchConversationPage locale="en" data={messages} onAction={onAction} />);
    expect(screen.getByText("A consumer-owned response")).toBeTruthy();
    const input = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: "Send message" });
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.change(input, { target: { value: "  Ship it  " } });
    fireEvent.click(button);
    expect(onAction).toHaveBeenLastCalledWith({ type: "send", text: "Ship it" });
    expect(input.value).toBe("");
    fireEvent.change(input, { target: { value: "Next step" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(onAction).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAction).toHaveBeenLastCalledWith({ type: "send", text: "Next step" });
  });

  test("controlled text remains parent-owned; loading blocks both send paths", () => {
    const onAction = mock();
    const onChange = mock();
    const { rerender } = render(
      <WorkbenchConversationPage
        locale="en"
        value="Parent draft"
        onChange={onChange}
        onAction={onAction}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "Edit" } });
    expect(onChange).toHaveBeenCalledWith("Edit");
    expect(input.value).toBe("Parent draft");
    rerender(
      <WorkbenchConversationPage
        locale="en"
        value="Parent draft"
        state="loading"
        onAction={onAction}
      />,
    );
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onAction).not.toHaveBeenCalled();
  });

  test("empty is inferred from absent data and no demonstration messages are injected", () => {
    render(<WorkbenchConversationPage locale="en" />);
    expect(screen.getByRole("status").textContent).toBe("Start a conversation with an idea");
    expect(screen.getByRole("button", { name: "Send message" }).hasAttribute("disabled")).toBe(
      true,
    );
  });
});

describe("artifact page behavior", () => {
  test("selection, code/preview switching and downloads use actual supplied artifacts", () => {
    const onAction = mock();
    const onChange = mock();
    render(
      <WorkbenchArtifactPage
        locale="en"
        data={artifacts}
        onAction={onAction}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("heading", { name: "First preview" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Two" }));
    expect(onChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("heading", { name: "Second preview" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    expect(screen.getByText("export const second = 2;")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Second preview" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Download artifact" }));
    expect(onAction).toHaveBeenCalledWith({ type: "download", artifact: artifacts[1] });
  });

  test("controlled selection/view do not change until the parent updates", () => {
    const onChange = mock();
    const onViewChange = mock();
    const { rerender } = render(
      <WorkbenchArtifactPage
        locale="en"
        data={artifacts}
        value="one"
        view="preview"
        onChange={onChange}
        onViewChange={onViewChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Two" }));
    fireEvent.click(screen.getByRole("button", { name: "Code" }));
    expect(onChange).toHaveBeenCalledWith("two");
    expect(onViewChange).toHaveBeenCalledWith("code");
    expect(screen.getByRole("heading", { name: "First preview" })).toBeTruthy();
    rerender(<WorkbenchArtifactPage locale="en" data={artifacts} value="two" view="code" />);
    expect(screen.getByText("export const second = 2;")).toBeTruthy();
  });

  test("missing data and invalid controlled selection show empty rather than fabricated artifacts", () => {
    const { rerender } = render(<WorkbenchArtifactPage locale="en" />);
    expect(screen.getByRole("status").textContent).toContain("No artifacts yet");
    rerender(<WorkbenchArtifactPage locale="en" data={artifacts} value="missing" />);
    expect(screen.getByRole("status").textContent).toContain("unavailable");
    expect(screen.queryByRole("heading", { name: "First preview" })).toBeNull();
  });
});

describe("settings page behavior", () => {
  test("local preferences edit and submit through the public callback", () => {
    const onAction = mock();
    render(<WorkbenchSettingsPage locale="en" data={preferences} onAction={onAction} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Workspace name" }), {
      target: { value: "Updated workspace" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Appearance" }), {
      target: { value: "dark" },
    });
    fireEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    fireEvent.click(screen.getByRole("button", { name: "Save settings" }));
    expect(onAction).toHaveBeenCalledWith({
      type: "save",
      values: { workspaceName: "Updated workspace", appearance: "dark", notifications: true },
    });
    expect(preferences.workspaceName).toBe("Consumer workspace");
  });

  test("controlled preferences remain unchanged until supplied by the parent", () => {
    const onChange = mock();
    const { rerender } = render(
      <WorkbenchSettingsPage locale="en" value={preferences} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(onChange).toHaveBeenCalledWith({ ...preferences, notifications: true });
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
    rerender(<WorkbenchSettingsPage locale="en" value={{ ...preferences, notifications: true }} />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
  });
});

describe("public page state contracts", () => {
  for (const state of ["loading", "empty", "error"] as const) {
    for (const Page of [
      SaasLandingPage,
      WorkbenchConversationPage,
      WorkbenchArtifactPage,
      WorkbenchSettingsPage,
    ]) {
      test(`${Page.name} renders ${state} and exposes retry only for errors`, () => {
        const onAction = mock();
        const { container } = render(
          <Page locale="en" state={state} onAction={onAction} className="consumer-page" />,
        );
        expect(container.firstElementChild?.classList.contains("consumer-page")).toBe(true);
        expect(screen.getByRole(state === "error" ? "alert" : "status")).toBeTruthy();
        if (state === "error") {
          fireEvent.click(screen.getByRole("button", { name: "Retry" }));
          expect(onAction).toHaveBeenCalledTimes(1);
        } else expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
      });
    }
  }
});

describe("multi-page site using the shared shell", () => {
  test("mobile navigation opens and closes through the existing responsive shell", async () => {
    const originalObserver = globalThis.ResizeObserver;
    const originalRect = HTMLElement.prototype.getBoundingClientRect;
    class MeasuringObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(target: Element) {
        this.callback(
          [{ contentRect: target.getBoundingClientRect() } as ResizeObserverEntry],
          this as unknown as ResizeObserver,
        );
      }
      unobserve() {}
      disconnect() {}
    }
    globalThis.ResizeObserver = MeasuringObserver as unknown as typeof ResizeObserver;
    HTMLElement.prototype.getBoundingClientRect = () =>
      ({ width: 640, height: 800, top: 0, left: 0, right: 640, bottom: 800, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    try {
      const { container } = render(<AgentWorkbenchSite locale="en" />);
      await waitFor(() => expect(container.querySelector("[data-layout-mode]")?.getAttribute("data-layout-mode")).toBe("mobile"));
      const menu = screen.getByRole("button", { name: "Toggle navigation" });
      expect(menu.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(menu);
      expect(menu.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(screen.getByRole("button", { name: "Settings" }));
      expect(menu.getAttribute("aria-expanded")).toBe("false");
      expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeTruthy();
    } finally {
      cleanup();
      globalThis.ResizeObserver = originalObserver;
      HTMLElement.prototype.getBoundingClientRect = originalRect;
    }
  });

  test("switches among three pages, moves focus and preserves local drafts and the shell", async () => {
    const { container } = render(
      <AgentWorkbenchSite
        locale="en"
        data={{ messages, artifacts, preferences }}
        onAction={() => {}}
      />,
    );
    const shell = container.querySelector("[data-workbench]") ?? container.querySelector("main");
    const draft = screen.getByRole("textbox", { name: "Message" });
    fireEvent.change(draft, { target: { value: "Keep this draft" } });
    const navigation = screen.getByRole("combobox", { name: "Switch page" });
    fireEvent.change(navigation, { target: { value: "artifacts" } });
    expect(screen.getByRole("heading", { level: 1, name: "Artifacts" })).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("heading", { level: 1, name: "Artifacts" }),
      ),
    );
    fireEvent.change(navigation, { target: { value: "settings" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Workspace name" }), {
      target: { value: "Retain preferences" },
    });
    fireEvent.change(navigation, { target: { value: "conversation" } });
    expect((screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement).value).toBe(
      "Keep this draft",
    );
    fireEvent.change(navigation, { target: { value: "settings" } });
    expect(
      (screen.getByRole("textbox", { name: "Workspace name" }) as HTMLInputElement).value,
    ).toBe("Retain preferences");
    expect(container.contains(shell)).toBe(true);
  });

  test("controlled page changes notify without navigating until parent updates", () => {
    const onChange = mock();
    const { rerender } = render(
      <AgentWorkbenchSite locale="en" value="conversation" onChange={onChange} />,
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Switch page" }), {
      target: { value: "settings" },
    });
    expect(onChange).toHaveBeenCalledWith("settings");
    expect(screen.getByRole("heading", { level: 1, name: "Conversation" })).toBeTruthy();
    rerender(<AgentWorkbenchSite locale="en" value="settings" onChange={onChange} />);
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeTruthy();
  });

  test("forwards page-specific actions and lets a consumer control navigation and states", () => {
    const onAction = mock();
    function Consumer() {
      const [page, setPage] = useState<WorkbenchSitePage>("settings");
      const [state, setState] = useState<ApplicationPageState>("error");
      return (
        <AgentWorkbenchSite
          locale="zh"
          value={page}
          onChange={setPage}
          pages={{ settings: { state, content: { error: "消费方错误", retry: "重新获取" } } }}
          onAction={(event) => {
            onAction(event);
            setState("ready");
          }}
        />
      );
    }
    render(<Consumer />);
    fireEvent.click(screen.getByRole("button", { name: "重新获取" }));
    expect(onAction).toHaveBeenCalledWith({ page: "settings", action: { type: "retry" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));
    expect(onAction).toHaveBeenLastCalledWith({
      page: "settings",
      action: {
        type: "save",
        values: { workspaceName: "", appearance: "system", notifications: false },
      },
    });
  });

  test("individual page labels/content remain replaceable in a bilingual shell", () => {
    render(
      <AgentWorkbenchSite
        locale="zh"
        defaultValue="artifacts"
        content={{ brand: "自定义空间", artifacts: "交付成果" }}
        data={{ artifacts }}
        pages={{ artifacts: { content: { title: "交付成果页" } } }}
      />,
    );
    expect(screen.getByRole("heading", { name: "交付成果页" })).toBeTruthy();
    expect(
      within(screen.getByRole("combobox", { name: "切换页面" })).getByRole("option", {
        name: "交付成果",
      }),
    ).toBeTruthy();
  });
});

describe("application asset distribution contracts", () => {
  test("the frozen data refers to real page slugs and source entry files", async () => {
    expect(PAGES).toHaveLength(4);
    expect(SITES).toHaveLength(1);
    for (const page of PAGES) {
      expect(page.pagePath).toBe(`/pages/${page.slug}`);
      expect(await readSourceFile(`components/pages/${page.componentSlug}.tsx`)).toContain(
        "export function",
      );
    }
    for (const page of SITES[0].pages)
      expect(PAGES.some((entry) => entry.slug === page)).toBe(true);
    expect(SITES[0].shellComponent).toBe("agent-workbench");
  });

  test("source closures resolve without Next, next-intl, previews or site metadata", async () => {
    const pending = [
      "components/pages/saas-landing-page.tsx",
      "components/site-shells/agent-workbench-site.tsx",
      "components/sections/index.ts",
    ];
    const seen = new Set<string>();
    const externals = new Set<string>();
    while (pending.length) {
      const file = pending.pop();
      if (!file || seen.has(file)) continue;
      seen.add(file);
      expect(file).not.toMatch(/^components\/(app|previews)\//);
      expect(file).not.toMatch(/^lib\/(pages|sites|catalog|registry)\./);
      const source = await readSourceFile(file);
      for (const { fileName: spec } of ts.preProcessFile(source, true, true).importedFiles) {
        if (spec.startsWith("@/") || spec.startsWith(".")) {
          const resolved = await resolveSourceImport(spec, file);
          if (!resolved) throw new Error(`Unresolved dependency ${spec} from ${file}`);
          pending.push(resolved.path);
        } else externals.add(spec);
      }
    }
    expect(
      [...externals].some(
        (name) => name === "next-intl" || name === "next" || name.startsWith("next/"),
      ),
    ).toBe(false);
    for (const page of PAGES)
      expect(seen.has(`components/pages/${page.componentSlug}.tsx`)).toBe(true);
    expect(seen.has("components/motion/agent-workbench/index.tsx")).toBe(true);
  });
});
