"use client";

import { useState } from "react";
import { LoginCard } from "@/components/motion/login-card";

export function LoginCardExample() {
  const [result, setResult] = useState("本地表单演示：输入手机号，演示验证码为 123456；阅读并勾选协议后提交。");
  return (
    <section className="w-full max-w-2xl space-y-4">
      <LoginCard
        titleLines={["欢迎回来", "体验登录表单"]}
        countryCode="+86"
        countryOptions={["+86", "+852", "+886"]}
        qr={<div className="grid h-40 w-40 place-items-center p-4 text-center text-sm text-muted-foreground">扫码登录槽位<br />仅展示，未接入登录服务</div>}
        footer={<p className="text-center text-xs text-muted-foreground">演示数据仅保存在本页面，不发送短信或建立真实会话。</p>}
        onSendCode={(phone) => setResult(`已记录 ${phone} 的验证码请求（本地演示）；请填写 123456。`)}
        onSubmit={({ phone, code, countryCode }) => {
          setResult(!phone.trim() ? "请填写手机号后再提交。" : code !== "123456" ? "演示验证码不正确，请填写 123456。" : `表单校验通过：${countryCode} ${phone}（本地演示，未建立登录会话）。`);
        }}
      />
      <p role="status" className="text-sm text-muted-foreground">{result}</p>
    </section>
  );
}
