"use client";

import { Bell, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { type ReactNode, useState } from "react";
import { Suggestion, Suggestions } from "@/components/agents/suggestion";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/motion/animated-badge";
import { AnimatedIcon } from "@/components/motion/animated-icon";
import { Button, type ButtonVariant, MagneticButton, StatefulButton } from "@/components/motion/button";
import type { ButtonState } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { EmptyStateInbox } from "@/components/motion/empty-state/inbox";
import { GlareHover } from "@/components/motion/glare-hover";
import { Input } from "@/components/motion/input";
import { Loader, type LoaderVariant } from "@/components/motion/loader";
import { Marquee } from "@/components/motion/marquee";
import { NumberTicker } from "@/components/motion/number-ticker";
import { OTPInput } from "@/components/motion/otp-input";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";
import { RangeSlider } from "@/components/motion/range-slider";
import { ScrollHint } from "@/components/motion/scroll-hint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import { Skeleton } from "@/components/motion/skeleton";
import { StarBorder } from "@/components/motion/star-border";
import { Switch } from "@/components/motion/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { TextScramble } from "@/components/motion/text-scramble";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { TiltCard } from "@/components/motion/tilt-card";
import { Tooltip } from "@/components/motion/tooltip";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { findPiece, type Piece, type PieceId } from "./project-redesign-data";

export type InstanceState = {
  buttonVariant: ButtonVariant;
  tabsVariant: "pill" | "segment" | "underline";
  badgeStatus: AnimatedBadgeStatus;
  loaderVariant: Extract<LoaderVariant, "spinner" | "dots" | "bars">;
};

export const DEFAULT_INSTANCE: InstanceState = {
  buttonVariant: "primary",
  tabsVariant: "pill",
  badgeStatus: "info",
  loaderVariant: "spinner",
};

function NameTag({
  id,
  selected,
  onSelect,
}: {
  id: PieceId;
  selected: boolean;
  onSelect: (id: PieceId) => void;
}) {
  const locale = useLocale() as Locale;
  const zh = locale === "zh";
  const piece = findPiece(id);
  if (!piece) return null;

  return (
    <button
      type="button"
      data-pr-tag
      onClick={() => onSelect(id)}
      className={cn(
        "flex flex-col items-start text-left",
        selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="text-[12px] font-medium tracking-tight">
        {zh ? piece.nameZh : piece.name}
        <span className="ml-1.5 font-normal opacity-70">
          {zh ? piece.name : piece.nameZh}
        </span>
      </span>
      {selected ? (
        <span className="mt-0.5 text-[11px] leading-4 opacity-80">
          {zh
            ? `也叫 ${piece.aliases[0]} · 别当成${piece.notNeighborZh}`
            : `also ${piece.aliases[0]} · not ${piece.notNeighborEn}`}
        </span>
      ) : null}
    </button>
  );
}

function Cluster({
  id,
  selected,
  onSelect,
  children,
  className,
}: {
  id: PieceId;
  selected: boolean;
  onSelect: (id: PieceId) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      id={`pr-piece-${id}`}
      className={cn(
        "min-w-0",
        selected && "rounded-[var(--pr-radius)] outline outline-2 outline-offset-4 outline-primary",
        className,
      )}
    >
      <NameTag id={id} selected={selected} onSelect={onSelect} />
      <div className="mt-1.5 min-w-0">{children}</div>
    </div>
  );
}

function StatefulDemo({ label }: { label: string }) {
  const [state, setState] = useState<ButtonState>("idle");

  return (
    <StatefulButton
      state={state}
      loadingText={label}
      successText={label}
      errorText={label}
      onClick={() => {
        if (state !== "idle") return;
        setState("loading");
        window.setTimeout(() => setState("success"), 900);
        window.setTimeout(() => setState("idle"), 2000);
      }}
    >
      {label}
    </StatefulButton>
  );
}

function DeskCard({ children }: { children: ReactNode }) {
  return (
    <div
      data-pr-card
      data-pr-control
      className="border border-border bg-background"
      style={{ padding: "var(--pr-pad)" }}
    >
      {children}
    </div>
  );
}

export function ProjectRedesignCanvas({
  focus,
  onSelect,
  instance,
}: {
  focus: PieceId;
  onSelect: (id: PieceId) => void;
  instance: InstanceState;
}) {
  const locale = useLocale() as Locale;
  const zh = locale === "zh";
  const [draft, setDraft] = useState(zh ? "可见的词汇" : "Visible vocabulary");
  const [channel, setChannel] = useState("graphite");
  const [notify, setNotify] = useState(true);
  const [keep, setKeep] = useState(true);
  const [lane, setLane] = useState("a");
  const [intensity, setIntensity] = useState(42);
  const [code, setCode] = useState("");

  const cluster = (id: PieceId, children: ReactNode, className?: string) => (
    <Cluster id={id} selected={focus === id} onSelect={onSelect} className={className}>
      {children}
    </Cluster>
  );

  return (
    <div
      data-pr-desk
      className="flex flex-col border border-border bg-card"
      style={{ padding: "var(--pr-pad)", gap: "var(--pr-gap)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-[var(--pr-gap)]">
        <div className="min-w-0 max-w-xl">
          <p data-pr-copy className="font-medium text-foreground">
            {zh ? "核对台" : "Review desk"}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {zh
              ? "一张组成，不是白底标本。名字贴在控件上。拧右边系统轨，吃同一份 token 的面一起变。"
              : "One composition, not a white tray. Names sit on the controls. Twist the system rail and every token-fed surface moves together."}
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-5">
          {cluster(
            "animated-badge",
            <AnimatedBadge status={instance.badgeStatus}>
              {zh ? "进行中" : "In progress"}
            </AnimatedBadge>,
          )}
          {cluster(
            "theme-toggle",
            <ThemeToggle className="h-10 w-10 border border-border bg-background" />,
          )}
          {cluster(
            "tooltip",
            <Tooltip content={zh ? "短提示，不能点里面" : "A short hint, not a layer"}>
              <span>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                  {zh ? "悬停" : "Hover"}
                </Button>
              </span>
            </Tooltip>,
          )}
        </div>
      </div>

      {cluster(
        "tabs",
        <Tabs defaultValue="review" variant={instance.tabsVariant}>
          <TabsList>
            <TabsTrigger value="review">{zh ? "核对" : "Review"}</TabsTrigger>
            <TabsTrigger value="draft">{zh ? "草稿" : "Draft"}</TabsTrigger>
            <TabsTrigger value="ship">{zh ? "发布" : "Ship"}</TabsTrigger>
          </TabsList>
        </Tabs>,
      )}

      <div className="grid gap-[var(--pr-gap)] md:grid-cols-2">
        {cluster(
          "input",
          <Input
            label={zh ? "条目" : "Entry"}
            value={draft}
            onChange={setDraft}
            leftIcon={<Search className="h-4 w-4" />}
          />,
        )}
        {cluster(
          "select",
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger>
              <SelectValue placeholder={zh ? "通道" : "Channel"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="graphite">{zh ? "石墨" : "Graphite"}</SelectItem>
              <SelectItem value="paper">{zh ? "纸感" : "Paper"}</SelectItem>
              <SelectItem value="ink">{zh ? "墨" : "Ink"}</SelectItem>
            </SelectContent>
          </Select>,
        )}
        {cluster(
          "range-slider",
          <RangeSlider
            value={intensity}
            onValueChange={setIntensity}
            aria-label={zh ? "强度" : "Intensity"}
          />,
        )}
        {cluster(
          "otp-input",
          <OTPInput
            length={4}
            value={code}
            onChange={setCode}
            label={zh ? "校验" : "Code"}
            aria-label={zh ? "验证码" : "One-time code"}
          />,
        )}
      </div>

      <div className="flex flex-wrap items-end gap-5">
        {cluster(
          "switch",
          <Switch
            checked={notify}
            onCheckedChange={setNotify}
            label={zh ? "即时通知" : "Notify"}
          />,
        )}
        {cluster(
          "checkbox",
          <Checkbox
            checked={keep}
            onCheckedChange={setKeep}
            label={zh ? "记住这次" : "Remember"}
          />,
        )}
        {cluster(
          "radio",
          <RadioGroup value={lane} onValueChange={setLane} orientation="horizontal">
            <RadioGroupItem value="a" label="A" />
            <RadioGroupItem value="b" label="B" />
          </RadioGroup>,
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {cluster(
          "button",
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={instance.buttonVariant}>{zh ? "发送" : "Send"}</Button>
            <Button variant="secondary">{zh ? "次要" : "Secondary"}</Button>
          </div>,
        )}
        {cluster("button-stateful", <StatefulDemo label={zh ? "保存" : "Save"} />)}
        {cluster(
          "button-magnetic",
          <MagneticButton variant="outline">{zh ? "靠近" : "Pull"}</MagneticButton>,
        )}
      </div>

      <div className="grid gap-[var(--pr-gap)] md:grid-cols-3">
        {cluster(
          "tilt-card",
          <TiltCard className="w-full">
            <DeskCard>
              <p className="text-sm font-medium">{zh ? "倾斜看层次" : "Tilt for depth"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {zh ? "指针移动，卡片跟着倾" : "The card follows the pointer"}
              </p>
            </DeskCard>
          </TiltCard>,
        )}
        {cluster(
          "glare-hover",
          <GlareHover className="w-full">
            <DeskCard>
              <p className="text-sm font-medium">{zh ? "光从表面扫过" : "Light across the face"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {zh ? "不是透视，是一层高光" : "A sheen, not perspective"}
              </p>
            </DeskCard>
          </GlareHover>,
        )}
        {cluster(
          "star-border",
          <StarBorder className="w-full" thickness={1.5}>
            <DeskCard>
              <p className="text-sm font-medium">{zh ? "光在边上游" : "Light on the rim"}</p>
            </DeskCard>
          </StarBorder>,
        )}
      </div>

      <div className="grid gap-[var(--pr-gap)] sm:grid-cols-2 xl:grid-cols-3">
        {cluster(
          "marquee",
          <Marquee speed={28} className="max-w-full" gap="0.75rem">
            {(zh ? ["按钮", "开关", "圆角", "阴影"] : ["Button", "Switch", "Radius", "Shadow"]).map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs"
                >
                  {item}
                </span>
              ),
            )}
          </Marquee>,
        )}
        {cluster(
          "number-ticker",
          <NumberTicker value={1280} startOnView={false} className="text-xl font-semibold" />,
        )}
        {cluster(
          "text-scramble",
          <TextScramble
            text={zh ? "看得见才知道" : "See it first"}
            className="text-sm font-medium"
          />,
        )}
        {cluster("animated-icon", <AnimatedIcon variant="draw" size={28} />)}
        {cluster("loader", <Loader variant={instance.loaderVariant} size={28} />)}
        {cluster(
          "skeleton",
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>,
        )}
      </div>

      <div className="grid gap-[var(--pr-gap)] lg:grid-cols-[minmax(0,1fr)_14rem]">
        {cluster(
          "suggestion",
          <Suggestions>
            <Suggestion suggestion={zh ? "复制安装命令" : "Copy install"} />
            <Suggestion suggestion={zh ? "拧一档圆角" : "Twist radius"} />
            <Suggestion suggestion={zh ? "对照邻居" : "Check neighbor"} />
          </Suggestions>,
        )}
        {cluster(
          "empty-state",
          <EmptyStateInbox
            className="py-2"
            title={zh ? "没有待办" : "Inbox zero"}
            message={zh ? "空，不是还在加载。" : "Empty, not still loading."}
            actionLabel={zh ? "写一条" : "Compose"}
          />,
        )}
      </div>

      {cluster("scroll-hint", <ScrollHint variant="mouse" label={zh ? "下面还有" : "More below"} />)}
    </div>
  );
}

export function InstanceKnobs({
  piece,
  instance,
  onInstance,
}: {
  piece: Piece;
  instance: InstanceState;
  onInstance: (next: Partial<InstanceState>) => void;
}) {
  const locale = useLocale() as Locale;
  const zh = locale === "zh";

  if (piece.id === "button") {
    return (
      <KnobRow label={zh ? "这颗按钮的变体" : "This button's variant"}>
        {(["primary", "secondary", "outline"] as const).map((value) => (
          <KnobChip
            key={value}
            selected={instance.buttonVariant === value}
            onClick={() => onInstance({ buttonVariant: value })}
          >
            {value}
          </KnobChip>
        ))}
      </KnobRow>
    );
  }

  if (piece.id === "tabs") {
    return (
      <KnobRow label={zh ? "这组页签的样子" : "This tab set's look"}>
        {(["pill", "segment", "underline"] as const).map((value) => (
          <KnobChip
            key={value}
            selected={instance.tabsVariant === value}
            onClick={() => onInstance({ tabsVariant: value })}
          >
            {value}
          </KnobChip>
        ))}
      </KnobRow>
    );
  }

  if (piece.id === "animated-badge") {
    return (
      <KnobRow label={zh ? "这枚徽章的状态" : "This badge's status"}>
        {(["info", "success", "warning", "danger"] as const).map((value) => (
          <KnobChip
            key={value}
            selected={instance.badgeStatus === value}
            onClick={() => onInstance({ badgeStatus: value })}
          >
            {value}
          </KnobChip>
        ))}
      </KnobRow>
    );
  }

  if (piece.id === "loader") {
    return (
      <KnobRow label={zh ? "这个加载器的画法" : "This loader's drawing"}>
        {(["spinner", "dots", "bars"] as const).map((value) => (
          <KnobChip
            key={value}
            selected={instance.loaderVariant === value}
            onClick={() => onInstance({ loaderVariant: value })}
          >
            {value}
          </KnobChip>
        ))}
      </KnobRow>
    );
  }

  return (
    <p className="text-xs text-muted-foreground">
      {zh
        ? "这块没有实例旋钮。要改圆角 / 颜色 / 密度，用右边系统轨。"
        : "No instance knobs here. Radius / color / density live on the system rail."}
    </p>
  );
}

function KnobRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function KnobChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-7 border px-2 text-[11px]",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-(--color-border-strong)",
      )}
      style={{ borderRadius: "var(--pr-radius)" }}
    >
      {children}
    </button>
  );
}
