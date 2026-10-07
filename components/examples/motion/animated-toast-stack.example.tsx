"use client";

import { useState } from "react";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "@/components/motion/animated-toast-stack";

export function AnimatedToastStackExample() {
  const { toasts, showToast, dismissToast, clearToasts } =
    useAnimatedToastStack({ defaultDuration: 6000, limit: 4 });
  const [message, setMessage] = useState("点击添加通知，体验本地消息栈。");

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2"
          onClick={() => {
            setMessage("已在本地演示状态中保存笔记。");
            showToast({
              title: "本地笔记已保存",
              description: "只用于演示通知，没有上传到服务端。",
              status: "success",
              action: {
                label: "撤销",
                onClick: (toast) => {
                  dismissToast(toast.id);
                  setMessage("已撤销本次本地保存演示。");
                },
              },
            });
          }}
        >
          演示保存通知
        </button>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2"
          onClick={() => {
            showToast({
              title: "阅读提醒",
              description: "别忘了整理今天的阅读笔记。",
              status: "info",
            });
            setMessage("已添加阅读提醒。");
          }}
        >
          添加提醒
        </button>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2"
          onClick={() => {
            clearToasts();
            setMessage("已清空所有通知。");
          }}
        >
          清空通知
        </button>
      </div>
      <p role="status">{message}</p>
      <AnimatedToastStack
        toasts={toasts}
        placement="static"
        onDismiss={(id) => {
          dismissToast(id);
          setMessage("已关闭一条通知。");
        }}
      />
    </section>
  );
}
