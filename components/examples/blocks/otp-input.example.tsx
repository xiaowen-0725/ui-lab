"use client";

import { useState } from "react";
import { OTPInput, type OTPStatus } from "@/components/motion/otp-input";

export function OtpInputExample() {
  const [run, setRun] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<OTPStatus>("idle");
  const [message, setMessage] = useState(
    "请输入演示验证码 123456，可直接粘贴。",
  );

  function validate(code: string) {
    const matches = code === "123456";
    setStatus(matches ? "success" : "error");
    setMessage(
      matches
        ? "本地示例校验通过，没有进行账户登录。"
        : "验证码不匹配，请改为 123456。",
    );
  }

  return (
    <section className="space-y-4">
      <OTPInput
        key={run}
        length={6}
        value={value}
        onChange={(next) => {
          setValue(next);
          if (next.length === 6) validate(next);
          else {
            setStatus("idle");
            setMessage("正在输入演示验证码。");
          }
        }}
        onComplete={validate}
        status={status}
        label="演示验证码"
        aria-label="输入六位演示验证码"
        hint="演示验证码为 123456"
        successMessage="本地校验通过"
        errorMessage="请使用演示验证码 123456"
      />
      <p role="status">{message}</p>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          setRun((current) => current + 1);
          setValue("");
          setStatus("idle");
          setMessage("已清空，请重新输入演示验证码 123456。");
        }}
      >
        重新输入
      </button>
    </section>
  );
}
