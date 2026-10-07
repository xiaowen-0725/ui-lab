"use client";

import { useState } from "react";
import { Input } from "@/components/motion/input";

export function InputExample() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <form noValidate className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-6 text-foreground" onSubmit={(event) => {
      event.preventDefault();
      if (name.trim().length < 2) { setError("请输入至少两个字符的项目名称"); setSaved(""); return; }
      setError("");
      setSaved(name.trim());
    }}>
      <Input label="项目名称" placeholder="例如：设计练习册" value={name} onChange={(value) => { setName(value); setError(""); setSaved(""); }} error={error} success={Boolean(saved)} />
      <button type="submit" className="rounded-lg border border-border px-3 py-2 text-sm">保存本地名称</button>
      <p role="status" className="text-sm text-muted-foreground">{saved ? `本地名称已保存：${saved}` : "填写名称后保存，空值或单字会提示错误。"}</p>
    </form>
  );
}
