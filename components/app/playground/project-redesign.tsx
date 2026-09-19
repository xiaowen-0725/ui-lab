"use client";

import { Check, Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CopyValue, useCopyFeedback } from "@/components/app/atoms/copy-value";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { DENSITIES, RADII, SHADOWS } from "@/lib/atoms";
import { useResolvedDark } from "@/lib/hooks/use-resolved-dark";
import { REGISTRY_NAMESPACE } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  DEFAULT_INSTANCE,
  InstanceKnobs,
  type InstanceState,
  ProjectRedesignCanvas,
} from "./project-redesign-canvas";
import {
  COLOR_OPTIONS,
  findPiece,
  GROUPS,
  matchingPreset,
  NAMED_PRESETS,
  parseSystem,
  PIECES,
  type PieceId,
  piecesInGroup,
  type SystemState,
  systemSearch,
  systemStyle,
  tokenBlock,
  TYPE_KNOBS,
} from "./project-redesign-data";
import "./project-redesign.css";

function writeUrl(pathname: string, state: SystemState, focus: PieceId) {
  const next = `${pathname}${systemSearch(state, focus)}`;
  window.history.replaceState(null, "", next);
}

export function ProjectRedesign() {
  const locale = useLocale() as Locale;
  const zh = locale === "zh";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dark = useResolvedDark();
  const { copiedLabel, copyValue } = useCopyFeedback();

  const [system, setSystem] = useState<SystemState>(() => parseSystem(searchParams));
  const [focus, setFocus] = useState<PieceId>(() => {
    const raw = searchParams.get("focus");
    return findPiece(raw ?? "")?.id ?? "button";
  });
  const [instance, setInstance] = useState<InstanceState>(DEFAULT_INSTANCE);

  useEffect(() => {
    writeUrl(pathname, system, focus);
  }, [pathname, system, focus]);

  useEffect(() => {
    document.getElementById(`pr-piece-${focus}`)?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [focus]);

  const piece = findPiece(focus) ?? PIECES[0];
  const named = matchingPreset(system);
  const tokens = useMemo(() => tokenBlock(system, dark), [system, dark]);
  const install = `npx shadcn add ${REGISTRY_NAMESPACE}/${piece.installSlug}`;
  const scopeStyle = systemStyle(system, dark);

  const patchSystem = (next: Partial<SystemState>) => {
    setSystem((current) => ({ ...current, ...next }));
  };

  return (
    <div
      data-pr-scope
      className="min-h-[calc(100vh-3.5rem)] font-sans"
      style={scopeStyle as CSSProperties}
    >
      <div className="border-b border-border px-4 py-5 md:px-6">
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {zh ? "一次性原型 · 不进顶栏" : "Throwaway prototype · not in the header"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {zh ? "看得见的词汇，试得了的系统" : "Visible vocabulary. A system you can twist."}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {zh
            ? "整站重做原型。进门就是馆藏：中间是组成，不是白底标本；名字贴在样本上；右边系统轨一拧，吃同一份 token 的面一起变。带走的是 registry 命令，不是提示词。"
            : "Whole-site redesign prototype. The collection is the first screen: a composition, not a white tray; names sit on the samples; the system rail restyles every token-fed surface at once. You leave with a registry command, not a prompt."}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {NAMED_PRESETS.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => setSystem(preset.state)}
              className={cn(
                "h-8 border px-3 text-xs",
                named === preset.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-(--color-border-strong)",
              )}
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              {zh ? preset.name : preset.nameEn}
              <span className="ml-1.5 text-[10px] opacity-70">{preset.slug}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {systemSearch(system, focus) || "?preset=graphite"}
        </p>
      </div>

      <div className="grid lg:grid-cols-[13.5rem_minmax(0,1fr)_17.5rem]">
        <aside className="border-b border-border lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-b-0">
          <nav className="flex flex-col gap-4 px-3 py-4" aria-label={zh ? "馆藏" : "Collection"}>
            {GROUPS.map((group) => {
              const items = piecesInGroup(group.id);
              return (
                <div key={group.id}>
                  <p className="flex items-baseline justify-between px-1 text-[11px] text-muted-foreground">
                    <span>{zh ? group.nameZh : group.name}</span>
                    <span>{items.length}</span>
                  </p>
                  <ul className="mt-1.5 flex flex-col">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setFocus(item.id)}
                          className={cn(
                            "flex w-full items-baseline justify-between gap-2 px-1 py-1.5 text-left text-[13px]",
                            focus === item.id
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <span className="truncate">
                            {zh ? item.nameZh : item.name}
                          </span>
                          <span className="truncate text-[11px] opacity-70">
                            {zh ? item.name : item.nameZh}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 px-4 py-4 md:px-5">
          <ProjectRedesignCanvas
            focus={focus}
            onSelect={setFocus}
            instance={instance}
          />

          <section
            data-pr-surface
            className="mt-4 border border-border bg-card"
            style={{ padding: "var(--pr-pad)" }}
            aria-label={zh ? "选中的名词" : "Selected term"}
          >
            <p className="text-[11px] text-muted-foreground">
              {zh ? "实例层 · 只改这块，不改整页系统" : "Instance layer · this piece only, not the page system"}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              {zh ? piece.nameZh : piece.name}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {zh ? piece.name : piece.nameZh}
              </span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {zh
                ? `也叫 ${piece.aliases.join(" · ")}`
                : `also ${piece.aliases.join(" · ")}`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {zh ? `别当成${piece.notNeighborZh}` : `Not ${piece.notNeighborEn}`}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-background px-2.5 py-2 font-mono text-[12px]">
                {install}
              </code>
              <button
                type="button"
                onClick={() => copyValue(install, `install-${piece.installSlug}`)}
                className="inline-flex h-9 items-center gap-1.5 border border-border bg-foreground px-3 text-xs text-background"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                {copiedLabel === `install-${piece.installSlug}` ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {zh ? "复制安装" : "Copy install"}
              </button>
            </div>

            <div className="mt-3">
              <InstanceKnobs
                piece={piece}
                instance={instance}
                onInstance={(next) => setInstance((current) => ({ ...current, ...next }))}
              />
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground">
              <Link
                href={`/components/${piece.category}/${piece.registrySlug}`}
                className="underline-offset-2 hover:underline"
              >
                {zh ? "打开现有组件页" : "Open the existing component page"}
              </Link>
              {zh ? " · 提示词只做发现，不放主按钮" : " · prompts stay a discovery layer, not the main button"}
            </p>
          </section>
        </div>

        <aside className="border-t border-border lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <div className="flex flex-col gap-5 px-4 py-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {zh ? "系统轨" : "System rail"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {zh
                  ? "改的是整页状态。和上面实例旋钮分开。"
                  : "This is page state. Separate from the instance knobs."}
              </p>
            </div>

            <Ladder
              title={zh ? "圆角" : "Radius"}
              value={system.radius}
              options={RADII.map((entry) => ({
                slug: entry.slug,
                label: zh ? entry.nameZh : entry.name,
                hint: entry.value,
              }))}
              onChange={(radius) => patchSystem({ radius })}
            />
            <Ladder
              title={zh ? "阴影" : "Shadow"}
              value={system.shadow}
              options={SHADOWS.map((entry) => ({
                slug: entry.slug,
                label: zh ? entry.nameZh : entry.name,
                hint: entry.slug,
              }))}
              onChange={(shadow) => patchSystem({ shadow })}
            />
            <Ladder
              title={zh ? "颜色" : "Color"}
              value={system.color}
              options={COLOR_OPTIONS.map((entry) => ({
                slug: entry.id,
                label: zh ? entry.name : entry.nameEn,
                hint: entry.id,
              }))}
              onChange={(color) => patchSystem({ color: color as SystemState["color"] })}
            />
            <Ladder
              title={zh ? "密度" : "Density"}
              value={system.density}
              options={DENSITIES.map((entry) => ({
                slug: entry.slug,
                label: zh ? entry.nameZh : entry.name,
                hint: `${entry.rowHeight}px`,
              }))}
              onChange={(density) => patchSystem({ density })}
            />
            <Ladder
              title={zh ? "字阶" : "Type step"}
              value={system.type}
              options={TYPE_KNOBS.map((entry) => ({
                slug: entry.slug,
                label: zh ? entry.nameZh : entry.name,
                hint: entry.fontSize,
              }))}
              onChange={(type) => patchSystem({ type })}
            />

            <div>
              <p className="text-[11px] text-muted-foreground">
                {zh ? "复制真值" : "Copy real values"}
              </p>
              <div className="mt-2">
                <CopyValue value={tokens} label="pr-tokens" />
              </div>
              <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                {zh
                  ? `当前 ${RADII.find((entry) => entry.slug === system.radius)?.value} · ${system.shadow} · ${system.color} · ${system.density}`
                  : `Now ${RADII.find((entry) => entry.slug === system.radius)?.value} · ${system.shadow} · ${system.color} · ${system.density}`}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Ladder({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: readonly { slug: string; label: string; hint: string }[];
  onChange: (slug: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-foreground">{title}</p>
      <div className="mt-2 flex flex-col gap-1">
        {options.map((option) => (
          <button
            key={option.slug}
            type="button"
            onClick={() => onChange(option.slug)}
            className={cn(
              "flex h-8 items-center justify-between border px-2 text-left text-xs",
              value === option.slug
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-foreground hover:border-(--color-border-strong)",
            )}
            style={{ borderRadius: "var(--pr-radius)" }}
          >
            <span>{option.label}</span>
            <span className="font-mono text-[10px] opacity-70">{option.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
