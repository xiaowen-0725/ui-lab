"use client";

import { Bell, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { type ReactNode, useState } from "react";
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
import { Suggestion, Suggestions } from "@/components/agents/suggestion";
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

function Specimen({
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
  const locale = useLocale() as Locale;
  const zh = locale === "zh";
  const piece = findPiece(id);
  if (!piece) return null;

  return (
    <article
      id={`pr-piece-${id}`}
      data-pr-surface
      className={cn(
        "flex min-w-0 flex-col border border-border bg-card",
        selected && "outline outline-2 outline-offset-2 outline-primary",
        className,
      )}
      style={{ padding: "var(--pr-pad)", gap: "calc(var(--pr-gap) * 0.45)" }}
    >
      <button
        type="button"
        onClick={() => onSelect(id)}
        className="flex flex-col items-start text-left"
      >
        <span className="text-[13px] font-medium text-foreground">
          {zh ? piece.nameZh : piece.name}
          <span className="ml-1.5 font-normal text-muted-foreground">
            {zh ? piece.name : piece.nameZh}
          </span>
        </span>
        <span className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
          {zh ? `也叫 ${piece.aliases[0]}` : `also ${piece.aliases[0]}`}
        </span>
        <span className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
          {zh ? `别当成${piece.notNeighborZh}` : `Not ${piece.notNeighborEn}`}
        </span>
      </button>
      <div className="min-w-0">{children}</div>
    </article>
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

  const spec = (id: PieceId, children: ReactNode, className?: string) => (
    <Specimen id={id} selected={focus === id} onSelect={onSelect} className={className}>
      {children}
    </Specimen>
  );

  return (
    <div className="flex flex-col" style={{ gap: "var(--pr-gap)" }}>
      <div
        data-pr-surface
        className="border border-border bg-card"
        style={{ padding: "var(--pr-pad)" }}
      >
        <p data-pr-copy className="font-medium text-foreground">
          {zh ? "同一份 token 养活的工作台" : "A desk fed by one token set"}
        </p>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
          {zh
            ? "这不是白底标本托盘。顶栏、输入、反馈、卡片和区块住在同一张组成里。拧右边系统轨，吃 token 的面一起变。"
            : "Not a white specimen tray. Toolbar, inputs, feedback, cards and blocks share one composition. Twist the system rail and every token-fed surface moves together."}
        </p>
      </div>

      <div className="grid gap-[var(--pr-gap)] lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.9fr)]">
        <div className="grid gap-[var(--pr-gap)]">
          {spec(
            "tabs",
            <Tabs defaultValue="review" variant={instance.tabsVariant}>
              <TabsList>
                <TabsTrigger value="review">{zh ? "核对" : "Review"}</TabsTrigger>
                <TabsTrigger value="draft">{zh ? "草稿" : "Draft"}</TabsTrigger>
                <TabsTrigger value="ship">{zh ? "发布" : "Ship"}</TabsTrigger>
              </TabsList>
            </Tabs>,
          )}

          <div className="grid gap-[var(--pr-gap)] sm:grid-cols-2">
            {spec(
              "input",
              <Input
                label={zh ? "条目" : "Entry"}
                value={draft}
                onChange={setDraft}
                leftIcon={<Search className="h-4 w-4" />}
              />,
            )}
            {spec(
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
          </div>

          {spec(
            "range-slider",
            <RangeSlider
              value={intensity}
              onValueChange={setIntensity}
              aria-label={zh ? "强度" : "Intensity"}
            />,
          )}

          <div className="grid gap-[var(--pr-gap)] sm:grid-cols-3">
            {spec(
              "switch",
              <Switch
                checked={notify}
                onCheckedChange={setNotify}
                label={zh ? "即时通知" : "Notify"}
              />,
            )}
            {spec(
              "checkbox",
              <Checkbox
                checked={keep}
                onCheckedChange={setKeep}
                label={zh ? "记住这次" : "Remember"}
              />,
            )}
            {spec(
              "radio",
              <RadioGroup value={lane} onValueChange={setLane} orientation="horizontal">
                <RadioGroupItem value="a" label="A" />
                <RadioGroupItem value="b" label="B" />
              </RadioGroup>,
            )}
          </div>
        </div>

        <div className="grid gap-[var(--pr-gap)]">
          {spec(
            "animated-badge",
            <AnimatedBadge status={instance.badgeStatus}>
              {zh ? "进行中" : "In progress"}
            </AnimatedBadge>,
          )}
          {spec(
            "button",
            <div className="flex flex-wrap items-center gap-2">
              <Button variant={instance.buttonVariant}>{zh ? "发送" : "Send"}</Button>
              <Button variant="secondary">{zh ? "次要" : "Secondary"}</Button>
            </div>,
          )}
          {spec("button-stateful", <StatefulDemo label={zh ? "保存" : "Save"} />)}
          {spec(
            "button-magnetic",
            <MagneticButton variant="outline">{zh ? "靠近" : "Pull"}</MagneticButton>,
          )}
          {spec(
            "theme-toggle",
            <ThemeToggle className="h-10 w-10 border border-border bg-background" />,
          )}
        </div>
      </div>

      <div className="grid gap-[var(--pr-gap)] sm:grid-cols-2 xl:grid-cols-4">
        {spec("loader", <Loader variant={instance.loaderVariant} size={28} />)}
        {spec(
          "skeleton",
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>,
        )}
        {spec(
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
        {spec(
          "number-ticker",
          <NumberTicker value={1280} startOnView={false} className="text-xl font-semibold" />,
        )}
      </div>

      <div className="grid gap-[var(--pr-gap)] md:grid-cols-3">
        {spec(
          "tilt-card",
          <TiltCard className="w-full">
            <div
              data-pr-control
              className="border border-border bg-background p-3"
            >
              <p className="text-sm font-medium">{zh ? "倾斜看层次" : "Tilt for depth"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {zh ? "指针移动，卡片跟着倾" : "The card follows the pointer"}
              </p>
            </div>
          </TiltCard>,
        )}
        {spec(
          "glare-hover",
          <GlareHover className="w-full">
            <div
              data-pr-control
              className="border border-border bg-background p-3"
            >
              <p className="text-sm font-medium">{zh ? "光从表面扫过" : "Light across the face"}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {zh ? "不是透视，是一层高光" : "A sheen, not perspective"}
              </p>
            </div>
          </GlareHover>,
        )}
        {spec(
          "star-border",
          <StarBorder className="w-full" thickness={1.5}>
            <div className="bg-background px-3 py-2 text-sm">{zh ? "光在边上游" : "Light on the rim"}</div>
          </StarBorder>,
        )}
      </div>

      <div className="grid gap-[var(--pr-gap)] md:grid-cols-2">
        {spec(
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
        {spec(
          "text-scramble",
          <TextScramble
            text={zh ? "看得见才知道" : "See it first"}
            className="text-sm font-medium"
          />,
        )}
      </div>

      <div className="grid gap-[var(--pr-gap)] md:grid-cols-3">
        {spec("animated-icon", <AnimatedIcon variant="draw" size={28} />)}
        {spec("scroll-hint", <ScrollHint variant="mouse" label={zh ? "下面还有" : "More below"} />)}
        {spec(
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

      <div className="grid gap-[var(--pr-gap)] lg:grid-cols-[minmax(0,1fr)_14rem]">
        {spec(
          "suggestion",
          <Suggestions>
            <Suggestion suggestion={zh ? "复制安装命令" : "Copy install"} />
            <Suggestion suggestion={zh ? "拧一档圆角" : "Twist radius"} />
            <Suggestion suggestion={zh ? "对照邻居" : "Check neighbor"} />
          </Suggestions>,
        )}
        {spec(
          "empty-state",
          <EmptyStateInbox
            className="py-4"
            title={zh ? "没有待办" : "Inbox zero"}
            message={zh ? "空，不是还在加载。" : "Empty, not still loading."}
            actionLabel={zh ? "写一条" : "Compose"}
          />,
        )}
      </div>
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
        "h-7 rounded-md border px-2 text-[11px]",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-(--color-border-strong)",
      )}
    >
      {children}
    </button>
  );
}
