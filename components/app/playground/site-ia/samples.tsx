"use client";

import { Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";
import { ActionSwapCascadeButton } from "@/components/motion/action-swap-cascade";
import { Button, StatefulButton, type ButtonState } from "@/components/motion/button";
import { Drawer } from "@/components/motion/drawer";
import { Input } from "@/components/motion/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { RADII, SHADOWS } from "@/lib/atoms/shape";
import { SPRING_PANEL, SPRING_PRESS, SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";
import type { ItemId } from "./model";

const BENCH_RADII = RADII.filter((atom) =>
  atom.slug === "sm" || atom.slug === "md" || atom.slug === "lg",
);

const BENCH_SHADOWS = SHADOWS.filter((atom) =>
  atom.slug === "hairline" || atom.slug === "raised" || atom.slug === "floating",
);

export function tokenText(id: ItemId): string {
  if (id === "press") {
    return `SPRING_PRESS = ${JSON.stringify(SPRING_PRESS, null, 2)}`;
  }
  if (id === "swap") {
    return `SPRING_SWAP = ${JSON.stringify(SPRING_SWAP, null, 2)}`;
  }
  if (id === "panel") {
    return `SPRING_PANEL = ${JSON.stringify(SPRING_PANEL, null, 2)}`;
  }
  if (id === "radius") {
    return BENCH_RADII.map((atom) => `${atom.slug}: ${atom.value}`).join("\n");
  }
  if (id === "shadow") {
    return BENCH_SHADOWS.map((atom) => `${atom.slug}: ${atom.light}`).join("\n");
  }
  return "";
}

export function ButtonSample({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button size={compact ? "sm" : "md"}>提交</Button>
      {compact ? null : <Button variant="secondary">取消</Button>}
    </div>
  );
}

export function StatefulButtonSample() {
  const [state, setState] = useState<ButtonState>("idle");

  return (
    <StatefulButton
      state={state}
      loadingText="提交中"
      successText="已提交"
      onClick={() => {
        if (state !== "idle") return;
        setState("loading");
        window.setTimeout(() => {
          setState("success");
          window.setTimeout(() => setState("idle"), 1400);
        }, 700);
      }}
    >
      提交
    </StatefulButton>
  );
}

export function InputSample({ compact = false }: { compact?: boolean }) {
  return (
    <Input
      label={compact ? undefined : "名称"}
      placeholder="试着输入"
      className={compact ? "w-40" : "w-56"}
    />
  );
}

export function DrawerSample({
  compact = false,
  framedAsMotion = false,
}: {
  compact?: boolean;
  framedAsMotion?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <Button size={compact ? "sm" : "md"} onClick={() => setOpen(true)}>
        {framedAsMotion ? "重播面板" : "打开抽屉"}
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        ariaLabel={framedAsMotion ? "面板弹簧" : "抽屉面板"}
        className="gap-4 p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">
          {framedAsMotion ? "面板弹簧" : "抽屉面板"}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          这是现有 Drawer。{framedAsMotion ? "拿走的是 SPRING_PANEL，只标可预览。" : "别当成 Modal。"}
        </p>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          关闭
        </Button>
      </Drawer>
    </div>
  );
}

export function TabsSample({ compact = false }: { compact?: boolean }) {
  return (
    <Tabs defaultValue="see" variant="pill">
      <TabsList>
        <TabsTrigger value="see">看见</TabsTrigger>
        <TabsTrigger value="try">试</TabsTrigger>
        {compact ? null : <TabsTrigger value="take">拿走</TabsTrigger>}
      </TabsList>
    </Tabs>
  );
}

export function SwapSample() {
  return (
    <ActionSwapCascadeButton
      items={[
        { id: "copy", label: "复制", icon: <Copy className="h-4 w-4" />, ariaLabel: "复制" },
        { id: "copied", label: "已复制", icon: <Check className="h-4 w-4" />, ariaLabel: "已复制" },
      ]}
      variant="primary"
    />
  );
}

export function PressSample({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const [play, setPlay] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        key={play}
        initial={reduce ? { opacity: 0.7 } : { scale: 1 }}
        animate={reduce ? { opacity: 1 } : { scale: [1, 0.93, 1] }}
        transition={reduce ? { duration: 0.2 } : SPRING_PRESS}
        className={cn(
          "grid place-items-center rounded-full bg-primary text-primary-foreground",
          compact ? "h-10 px-4 text-xs" : "h-12 px-6 text-sm",
        )}
      >
        按压
      </motion.div>
      {compact ? null : (
        <Button variant="ghost" size="sm" onClick={() => setPlay((value) => value + 1)}>
          再播一次
        </Button>
      )}
    </div>
  );
}

function useSurfaceShadow(slug: "hairline" | "raised" | "floating") {
  const { resolvedTheme } = useTheme();
  const atom = SHADOWS.find((entry) => entry.slug === slug) ?? SHADOWS[1];
  const dark = resolvedTheme === "dark" || resolvedTheme === undefined;
  return dark ? atom.dark : atom.light;
}

export function ControlCluster({
  radius = "10px",
  shadowSlug = "raised",
  compact = false,
}: {
  radius?: string;
  shadowSlug?: "hairline" | "raised" | "floating";
  compact?: boolean;
}) {
  const shadow = useSurfaceShadow(shadowSlug);

  return (
    <div
      style={{
        borderRadius: radius,
        boxShadow: shadow,
        ["--ia-radius" as string]: radius,
      }}
      className={cn(
        "border border-border bg-card",
        compact ? "w-full max-w-56 space-y-3 p-3" : "w-full max-w-sm space-y-4 p-5",
      )}
    >
      <div className="flex flex-wrap gap-2">
        <Button
          size={compact ? "sm" : "md"}
          className="rounded-[length:var(--ia-radius)]"
          style={{ borderRadius: radius }}
        >
          提交
        </Button>
        <Button
          variant="secondary"
          size={compact ? "sm" : "md"}
          style={{ borderRadius: radius }}
        >
          取消
        </Button>
      </div>
      <Input
        label={compact ? undefined : "名称"}
        placeholder="试着输入"
        classNames={{ field: "rounded-[length:var(--ia-radius)]" }}
      />
    </div>
  );
}

export function RadiusSample({ compact = false }: { compact?: boolean }) {
  return <ControlCluster radius="12.5px" compact={compact} />;
}

export function ShadowSample({ compact = false }: { compact?: boolean }) {
  return <ControlCluster shadowSlug="floating" compact={compact} />;
}

export function GraphiteSample({ compact = false }: { compact?: boolean }) {
  return <ControlCluster radius="10px" shadowSlug="hairline" compact={compact} />;
}

export function ItemSample({
  id,
  compact = false,
}: {
  id: ItemId;
  compact?: boolean;
}) {
  switch (id) {
    case "button":
      return <ButtonSample compact={compact} />;
    case "input":
      return <InputSample compact={compact} />;
    case "drawer":
      return <DrawerSample compact={compact} />;
    case "tabs":
      return <TabsSample compact={compact} />;
    case "press":
      return <PressSample compact={compact} />;
    case "swap":
      return <SwapSample />;
    case "panel":
      return <DrawerSample compact={compact} framedAsMotion />;
    case "radius":
      return <RadiusSample compact={compact} />;
    case "shadow":
      return <ShadowSample compact={compact} />;
    case "graphite":
      return <GraphiteSample compact={compact} />;
  }
}

export function BenchLadders({
  kind,
  radiusSlug,
  shadowSlug,
  onRadius,
  onShadow,
}: {
  kind: "radius" | "shadow";
  radiusSlug: string;
  shadowSlug: "hairline" | "raised" | "floating";
  onRadius: (slug: string) => void;
  onShadow: (slug: "hairline" | "raised" | "floating") => void;
}) {
  const locale = useLocale();
  const radius = RADII.find((atom) => atom.slug === radiusSlug) ?? RADII[3];
  const shadow = SHADOWS.find((atom) => atom.slug === shadowSlug) ?? SHADOWS[1];

  return (
    <div className="space-y-6">
      <ControlCluster
        radius={radius.value}
        shadowSlug={shadowSlug}
      />
      {kind === "radius" ? (
        <div className="flex flex-wrap gap-2">
          {BENCH_RADII.map((atom) => (
            <button
              key={atom.slug}
              type="button"
              onClick={() => onRadius(atom.slug)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                atom.slug === radiusSlug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {locale === "zh" ? atom.nameZh : atom.name}
              <span className="ml-2 font-mono text-xs opacity-70">{atom.value}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {BENCH_SHADOWS.map((atom) => (
            <button
              key={atom.slug}
              type="button"
              onClick={() => onShadow(atom.slug as "hairline" | "raised" | "floating")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                atom.slug === shadowSlug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {locale === "zh" ? atom.nameZh : atom.name}
            </button>
          ))}
        </div>
      )}
      <p className="font-mono text-xs text-muted-foreground">
        {kind === "radius" ? `${radius.slug}: ${radius.value}` : `${shadow.slug}`}
      </p>
    </div>
  );
}

export { BENCH_RADII, BENCH_SHADOWS };
