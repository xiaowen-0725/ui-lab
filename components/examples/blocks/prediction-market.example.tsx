"use client";

import { useState } from "react";
import { PredictionMarket, type PredictionMarketOrderValue } from "@/components/motion/prediction-market";

const OUTCOMES = [{ id: "yes", label: "会完成", price: 0.6 }, { id: "no", label: "不会完成", price: 0.4 }];

export function PredictionMarketExample() {
  const [value, setValue] = useState<PredictionMarketOrderValue>({ mode: "buy", outcomeId: "yes", amount: "10" });
  const [authenticated, setAuthenticated] = useState(false);
  const [result, setResult] = useState("仅为本地订单演示，不涉及资金或真实交易。");
  return (
    <section className="max-w-md space-y-4">
      <h2 className="font-medium">本周能否完成阅读计划？</h2>
      <PredictionMarket
        outcomes={OUTCOMES}
        value={value}
        onValueChange={setValue}
        authenticated={authenticated}
        onSignIn={() => { setAuthenticated(true); setResult("已进入本地演示会话，可以试填订单。"); }}
        orderTypeLabel="演示市价单"
        balance={100}
        positions={{ yes: 30, no: 20 }}
        quickAmounts={[5, 10, 20]}
        onTrade={(order, quote) => {
          const label = OUTCOMES.find((outcome) => outcome.id === order.outcomeId)?.label;
          const amount = order.mode === "buy" ? quote.amount : quote.payout;
          setResult(`本地订单：${order.mode === "buy" ? "买入" : "卖出"}「${label}」，${quote.shares.toFixed(2)} 份，${order.mode === "buy" ? "支出" : "所得"}演示金额 ${amount.toFixed(2)}。未执行真实交易。`);
        }}
      />
      <p className="text-sm">当前草稿：{value.mode === "buy" ? "买入，金额" : "卖出，份数"} {value.amount || "0"}</p>
      <p role="status">{result}</p>
    </section>
  );
}
