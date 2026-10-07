"use client";

import { type Chain, MultiChainSwap, type Token } from "@/components/motion/swap";

const CHAINS: Chain[] = [
  { id: "demo-a", name: "演示网络甲", symbol: "甲", tone: "bg-primary text-primary-foreground" },
  { id: "demo-b", name: "演示网络乙", symbol: "乙", tone: "bg-secondary text-secondary-foreground" },
];
const TOKENS: Token[] = [
  { id: "demo-a-read", symbol: "READ", name: "阅读积分（示例）", chainId: "demo-a", balance: 100, usd: 2, popular: true },
  { id: "demo-b-note", symbol: "NOTE", name: "笔记积分（示例）", chainId: "demo-b", balance: 60, usd: 1, popular: true },
  { id: "demo-a-write", symbol: "WRITE", name: "写作积分（示例）", chainId: "demo-a", balance: 20, usd: 4, popular: true },
];

export function SwapExample() {
  return (
    <section className="w-full max-w-md space-y-4">
      <h2 className="font-medium">跨网络兑换界面演示</h2>
      <MultiChainSwap chains={CHAINS} tokens={TOKENS} defaultFromId="demo-a-read" defaultToId="demo-b-note" />
      <p className="text-sm text-muted-foreground">
        可编辑数量、选择积分、交换方向及填写目标地址。余额与比率均为固定示例值。
        当前组件没有兑换或设置回调，操作按钮仅展示状态，不会连接钱包、发送积分或执行交易。
      </p>
    </section>
  );
}
