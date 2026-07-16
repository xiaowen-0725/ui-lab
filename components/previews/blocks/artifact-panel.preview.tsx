"use client";

import { Copy, Download, FileCode2 } from "lucide-react";
import { useState } from "react";
import { ThreadMessage, ThreadUserMessage } from "@/components/motion/agent-thread";
import {
  ArtifactAction,
  ArtifactContent,
  ArtifactHeader,
  ArtifactPanel,
  ArtifactVersionNav,
  ArtifactViewToggle,
  type ArtifactView,
} from "@/components/motion/artifact-panel";
import { cn } from "@/lib/utils";

type Version = 1 | 2 | 3;

const CODE_BY_VERSION: Record<Version, string> = {
  1: `export function LandingHero() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-4xl font-semibold">
        Ship your product, faster.
      </h1>
      <p className="mt-3 text-muted-foreground">
        A starter hero — no call to action yet.
      </p>
    </section>
  );
}`,
  2: `export function LandingHero() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-4xl font-semibold">
        Ship your product, faster.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Everything you need to launch, in one kit.
      </p>
      <button className="mt-6 rounded-full bg-foreground px-5 py-2 text-background">
        Get started
      </button>
    </section>
  );
}`,
  3: `export function LandingHero() {
  return (
    <section
      className={cn(
        "relative py-24 text-center",
        "bg-gradient-to-b from-[#339CFF]/10 to-transparent",
      )}
    >
      <h1 className="text-4xl font-semibold">
        Ship your product, faster.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Everything you need to launch, in one kit.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <button className="rounded-full bg-foreground px-5 py-2 text-background">
          Get started
        </button>
        <button className="rounded-full border border-black/10 px-5 py-2">
          View docs
        </button>
      </div>
    </section>
  );
}`,
};

/** Version-dependent hero mock — stands in for a live-rendered artifact preview. */
function HeroPreview({ version }: { version: Version }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3 px-8 text-center",
        version === 3 && "bg-gradient-to-b from-[#339CFF]/10 to-transparent dark:from-[#339CFF]/15",
      )}
    >
      <h2 className="font-semibold text-2xl">Ship your product, faster.</h2>
      <p className="max-w-[280px] text-muted-foreground text-sm">
        {version === 1
          ? "A starter hero — no call to action yet."
          : "Everything you need to launch, in one kit."}
      </p>
      {version >= 2 ? (
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-foreground px-4 py-1.5 text-background text-sm">
            Get started
          </span>
          {version === 3 ? (
            <span className="rounded-full border border-black/10 px-4 py-1.5 text-sm dark:border-white/10">
              View docs
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function ArtifactPanelPreview() {
  const [view, setView] = useState<ArtifactView>("preview");
  const [version, setVersion] = useState<Version>(3);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-xl border border-border bg-neutral-100 p-4 dark:bg-neutral-950">
      <div className="flex h-full gap-4">
        <div className="flex w-[220px] shrink-0 flex-col gap-1">
          <ThreadUserMessage>Build a hero section for the landing page.</ThreadUserMessage>
          <ThreadMessage>Drafted the landing hero — see the artifact.</ThreadMessage>
        </div>

        <ArtifactPanel className="flex-1">
          <ArtifactHeader
            icon={<FileCode2 className="h-4 w-4" />}
            title="landing-hero.tsx"
            subtitle="React component"
            actions={
              <>
                <ArtifactViewToggle value={view} onChange={setView} />
                <ArtifactAction aria-label="Copy code">
                  <Copy className="h-3.5 w-3.5" />
                </ArtifactAction>
                <ArtifactAction aria-label="Download file">
                  <Download className="h-3.5 w-3.5" />
                </ArtifactAction>
              </>
            }
          />

          <ArtifactContent view={`${view}-${version}`}>
            {view === "preview" ? (
              <HeroPreview version={version} />
            ) : (
              <pre className="m-0 h-full overflow-auto whitespace-pre p-4 font-mono text-[13px] leading-[20px]">
                <code>{CODE_BY_VERSION[version]}</code>
              </pre>
            )}
          </ArtifactContent>

          <div className="flex h-10 shrink-0 items-center justify-between border-black/5 border-t-[0.5px] px-3 dark:border-white/[0.06]">
            <ArtifactVersionNav
              index={version}
              count={3}
              onPrev={() => setVersion((v) => (v > 1 ? ((v - 1) as Version) : v))}
              onNext={() => setVersion((v) => (v < 3 ? ((v + 1) as Version) : v))}
              onRestore={version < 3 ? () => setVersion(3) : undefined}
            />
            <span className="text-muted-foreground text-xs">Updated just now</span>
          </div>
        </ArtifactPanel>
      </div>
    </div>
  );
}
