"use client";

import { useState } from "react";
import { Checkbox } from "@/components/motion/checkbox";

export function CheckboxExample() {
  const [updates, setUpdates] = useState(true);
  const [tips, setTips] = useState(false);
  const [result, setResult] = useState("尚未保存偏好。");
  return (
    <form className="space-y-4 rounded-xl border border-border p-6" onSubmit={(event) => {
      event.preventDefault();
      setResult(`本地偏好已保存：产品更新${updates ? "开启" : "关闭"}，使用技巧${tips ? "开启" : "关闭"}。`);
    }}>
      <h2 className="font-medium">通知偏好</h2>
      <div className="flex flex-col gap-3">
        <Checkbox checked={updates} onCheckedChange={setUpdates} label="接收产品更新" />
        <Checkbox checked={tips} onCheckedChange={setTips} label="接收使用技巧" />
      </div>
      <button type="submit" className="rounded-md bg-primary px-3 py-2 text-primary-foreground">保存本地偏好</button>
      <p role="status">{result}</p>
    </form>
  );
}
