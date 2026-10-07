"use client";

import { useState } from "react";
import {
  Composer,
  ComposerAttachmentChip,
  ComposerAttachments,
  ComposerEffortSlider,
  ComposerMenuButton,
  ComposerMenuItem,
  ComposerMenuSection,
  ComposerModelPicker,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer/index";

const EFFORT_LABELS = ["简要", "标准", "详细"];

export function AgentComposerExample() {
  const [value, setValue] = useState("请将阅读笔记整理为三条要点。");
  const [attached, setAttached] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [effort, setEffort] = useState(1);
  const [result, setResult] = useState("尚未提交，本例只展示本地消息。");
  const send = () => {
    if (!value.trim()) return;
    setResult(`本地消息：${value.trim()}；详略：${EFFORT_LABELS[effort]}；附件：${attached ? "阅读笔记.md" : "无"}。`);
    setValue("");
  };

  return (
    <section className="max-w-xl space-y-4 rounded-xl border border-border bg-background p-4">
      <h2 className="font-medium">整理阅读笔记</h2>
      <Composer>
        {attached && <ComposerAttachments><ComposerAttachmentChip name="阅读笔记.md" meta="本地演示" onRemove={() => { setAttached(false); setResult("已移除演示附件。"); }} /></ComposerAttachments>}
        <div onKeyDownCapture={(event) => {
          // 原组件未过滤输入法选词 Enter；消费层拦截提交处理，保留默认选词行为。
          if (event.key === "Enter" && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) {
            event.stopPropagation();
          }
        }}>
          <ComposerTextarea value={value} onChange={setValue} onSubmit={send} placeholder="输入整理需求，Enter 提交" aria-label="整理需求" />
        </div>
        <ComposerToolbar>
          <ComposerMenuButton label="添加" aria-label="添加演示附件" open={menuOpen} onOpenChange={setMenuOpen}>
            <ComposerMenuSection title="本地示例">
              <ComposerMenuItem onSelect={() => { setAttached(true); setMenuOpen(false); setResult("已添加演示附件：阅读笔记.md。"); }}>阅读笔记.md</ComposerMenuItem>
            </ComposerMenuSection>
          </ComposerMenuButton>
          <div className="ml-auto" />
          <ComposerModelPicker label={EFFORT_LABELS[effort]} open={pickerOpen} onOpenChange={setPickerOpen}>
            <div className="space-y-2 p-3"><p className="text-sm">回答详略</p><ComposerEffortSlider value={effort} onChange={setEffort} labels={EFFORT_LABELS} aria-label="回答详略" /></div>
          </ComposerModelPicker>
          <ComposerSendButton disabled={!value.trim()} onClick={send} aria-label="提交本地消息" />
        </ComposerToolbar>
      </Composer>
      <p role="status" className="text-sm">{result}</p>
    </section>
  );
}
