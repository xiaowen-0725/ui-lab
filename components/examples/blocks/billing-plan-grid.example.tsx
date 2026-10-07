"use client";

import { useState } from "react";
import { BillingPlanGrid, type BillingInterval, type BillingPlan } from "@/components/motion/billing-plan-grid";

const PLANS: BillingPlan[] = [
  { id: "personal", name: "个人版", description: "适合个人整理阅读资料。", monthlyPrice: 0, annualPrice: 0, currency: "¥", cta: "选择个人版", includedHeading: "包含功能", excludedHeading: "未包含", features: [{ label: "一个阅读空间", included: true }, { label: "团队共享", included: false }] },
  { id: "team", name: "协作版", description: "适合小团队共同学习。", monthlyPrice: 39, annualPrice: 29, currency: "¥", cta: "选择协作版", includedHeading: "包含功能", excludedHeading: "未包含", features: [{ label: "五个阅读空间", included: true }, { label: "团队共享", included: true }] },
  { id: "organization", name: "组织版", description: "按组织需求定制空间。", monthlyPrice: null, annualPrice: null, cta: "了解组织版", includedHeading: "包含功能", excludedHeading: "未包含", features: [{ label: "专属空间配置", included: true }, { label: "资料审计记录", included: true }] },
];

export function BillingPlanGridExample() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [selected, setSelected] = useState("personal");
  const [result, setResult] = useState("仅展示本地方案选择，不会产生订阅或扣款。");
  return (
    <section className="space-y-4">
      <h2 className="font-medium">阅读空间方案</h2>
      <BillingPlanGrid plans={PLANS} currentPlanId={selected} interval={interval} onIntervalChange={setInterval} onSelectPlan={(id) => {
        setSelected(id);
        setResult(`本地已选择：${PLANS.find((plan) => plan.id === id)?.name}。未提交订单。`);
      }} />
      <p className="text-sm">当前演示计费周期：{interval === "monthly" ? "月付" : "年付，价格按月折算"}</p>
      <p role="status">{result}</p>
    </section>
  );
}
