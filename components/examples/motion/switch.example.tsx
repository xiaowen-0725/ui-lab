"use client";

import { useState } from "react";
import { Switch } from "@/components/motion/switch";

export function SwitchExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-3 rounded-xl border border-border p-5">
      <Switch checked={enabled} onCheckedChange={setEnabled} label="开启阅读提醒" />
      <p role="status" className="text-sm text-muted-foreground">
        {enabled ? "本地阅读提醒选项已开启。" : "本地阅读提醒选项已关闭。"}
      </p>
    </div>
  );
}
