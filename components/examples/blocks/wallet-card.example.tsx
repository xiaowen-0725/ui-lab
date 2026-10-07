"use client";

import { useState } from "react";
import { WalletCard, type WalletAccount } from "@/components/motion/wallet-card/index";

const accounts: WalletAccount[] = [
  { id: "daily", name: "日常账户", address: "demo-daily-account", avatar: <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs">日</span> },
  { id: "saving", name: "储蓄账户", address: "demo-saving-account", avatar: <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs">储</span> },
];
const balances: Record<string, number> = { daily: 1280, saving: 5200 };

export function WalletCardExample() {
  const [accountId, setAccountId] = useState("daily");
  const [result, setResult] = useState("请选择账户或操作；金额为演示数据。");
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState(true);
  return (
    <section className="w-full max-w-sm space-y-3">
      <WalletCard
        accounts={accounts} accountId={accountId} balance={balances[accountId]} balancePrefix="¥"
        onAccountChange={(id) => { setAccountId(id); setResult(`已选择${accounts.find((account) => account.id === id)?.name}。`); }}
        onSend={() => setResult("已选择发送操作（本地演示，未转账）。")}
        onDeposit={() => setResult("已选择存入操作（本地演示，未入账）。")}
        onSwap={() => setResult("已选择兑换操作（本地演示，未兑换）。")}
        onBuy={() => setResult("已选择购买操作（本地演示，未下单）。")}
        searchPlaceholder="搜索演示记录" searchRecent={["日常支出", "储蓄计划"]}
        onSearchChange={setQuery} onSearchSubmit={(value) => setResult(`已记录搜索：${value}（仅本地演示）。`)}
        hasNotifications={unread} onNotifications={() => { setUnread(false); setResult("演示通知已标记为已读。"); }}
      />
      <p role="status" className="text-sm text-muted-foreground">{result}</p>
      <p className="text-xs text-muted-foreground">当前搜索输入：{query || "尚未输入"}</p>
    </section>
  );
}
