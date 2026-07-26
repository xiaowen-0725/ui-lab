"use client";

import { LoginCard } from "@/components/motion/login-card";

export function LoginCardPreview() {
  return (
    <div className="flex w-full justify-center rounded-2xl bg-[#eef1f5] p-6 sm:p-10">
      <LoginCard
        onSendCode={async () => {
          await new Promise((r) => setTimeout(r, 500));
        }}
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 900));
        }}
      />
    </div>
  );
}
