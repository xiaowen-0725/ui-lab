"use client";

import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FilePenLine,
  Lock,
} from "lucide-react";
import { useLocale } from "next-intl";
import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type AssemblyOrderApiResult,
  type AssemblyOrderSelection,
  decodeOrderShare,
  diffAssemblyOrders,
  encodeOrderShare,
  type SemanticOrderChange,
  serializeAssemblyOrder,
} from "@/lib/assembly-order";
import type { OrderManifest } from "@/lib/order-manifest";
import {
  buildParkingPreviewSearchParams,
  type ParkingPreviewConfiguration,
} from "@/lib/system-presets/parking-preview-config";
import { cn } from "@/lib/utils";
import {
  type CalibrationSource,
  VisualReferenceBoard,
} from "./visual-reference-board";

type PresetCase = {
  id: string;
  size: string;
  theme: string;
  states: readonly string[];
  surfaces: readonly string[];
  calibrationSourceIds: readonly string[];
};

type EvidenceCapture = {
  caseId: string;
  path: string;
  sha256: string;
};

export type AssemblyStudioProps = {
  preset: {
    slug: string;
    calibrationSources: readonly CalibrationSource[];
    profiles: readonly string[];
    capabilities: ReadonlyArray<{
      slug: string;
      name: string;
      required: boolean;
    }>;
    recipe: string;
    cases: readonly PresetCase[];
  };
  evidence:
    | {
        available: true;
        acceptanceStatus: "pending" | "approved";
        reason?: string;
        captures: readonly EvidenceCapture[];
      }
    | {
        available: false;
        acceptanceStatus: "pending" | "approved";
        reason?: string;
        captures: readonly EvidenceCapture[];
      };
  className?: string;
};

const LOCKED_VISUAL_KEYS = [
  "typography",
  "icons",
  "surfaces",
  "selection",
  "density",
  "geometry",
  "shadows",
  "motion",
  "responsive",
] as const;

const SEMANTIC_COLOR_KEYS = [
  "success",
  "warning",
  "danger",
  "destructive",
  "info",
] as const;

const sectionClass =
  "border border-border bg-background p-4 shadow-[0_1px_2px_rgb(0_0_0/0.03)]";
const inputClass =
  "mt-1 block w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const buttonClass =
  "inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45";

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(sectionClass, className)}>
      <h2 className="font-medium">{title}</h2>
      {children}
    </section>
  );
}

function formatDiffValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null) return "null";
  return JSON.stringify(value);
}

function previewConfigurationFromSelection(
  selection: AssemblyOrderSelection,
): Partial<ParkingPreviewConfiguration> {
  const overrides = selection.safeOverrides as Record<string, unknown>;
  const branding = overrides.branding;
  const productCopy = overrides.productCopy;
  const productName =
    typeof branding === "string"
      ? branding
      : branding &&
          typeof branding === "object" &&
          typeof (branding as Record<string, unknown>).productName === "string"
        ? String((branding as Record<string, unknown>).productName)
        : undefined;
  const logoReference =
    branding &&
    typeof branding === "object" &&
    typeof (branding as Record<string, unknown>).logoReference === "string"
      ? String((branding as Record<string, unknown>).logoReference)
      : undefined;
  const composerPlaceholder =
    productCopy &&
    typeof productCopy === "object" &&
    typeof (productCopy as Record<string, unknown>).composerPlaceholder === "string"
      ? String((productCopy as Record<string, unknown>).composerPlaceholder)
      : undefined;
  return {
    ...(productName ? { productName } : {}),
    ...(logoReference ? { logoReference } : {}),
    ...(composerPlaceholder ? { composerPlaceholder } : {}),
    activeLocale: selection.locales[0],
    platformChrome: selection.platformChrome,
    capabilitySlugs: selection.capabilitySlugs as ParkingPreviewConfiguration["capabilitySlugs"],
    ...(overrides.semanticStateColors &&
    typeof overrides.semanticStateColors === "object"
      ? {
          semanticStateColors: overrides.semanticStateColors as ParkingPreviewConfiguration["semanticStateColors"],
        }
      : {}),
  };
}

function previewUrl(
  caseId: string,
  configuration: Partial<ParkingPreviewConfiguration>,
  locale: string,
): string {
  const query = buildParkingPreviewSearchParams(configuration).toString();
  const localePrefix = locale === "en" ? "/en" : "";
  return `${localePrefix}/studio/preview/${caseId}${query ? `?${query}` : ""}`;
}

function caseDimensions(size: string): { width: number; height: number } {
  const match = /^(\d+)x(\d+)$/.exec(size);
  if (!match) return { width: 1440, height: 900 };
  return { width: Number(match[1]), height: Number(match[2]) };
}

function selectionKey(selection: AssemblyOrderSelection): string {
  return JSON.stringify({
    ...selection,
    capabilitySlugs: [...selection.capabilitySlugs].sort(),
    locales: [...selection.locales].sort(),
  });
}

export function AssemblyStudio({
  preset,
  evidence,
  className,
}: AssemblyStudioProps) {
  const locale = useLocale();
  const zh = locale !== "en";
  const initialSelectionResolved = useRef(false);
  const resolveRequestId = useRef(0);
  const [profile, setProfile] = useState("electron-renderer");
  const [capabilities, setCapabilities] = useState(() =>
    preset.capabilities.map((item) => item.slug),
  );
  const [caseId, setCaseId] = useState(preset.cases[0]?.id ?? "");
  const [productName, setProductName] = useState("Parking Agent");
  const [locales, setLocales] = useState([zh ? "zh-CN" : "en"]);
  const [platformChrome, setPlatformChrome] = useState<"native" | "web">(
    "native",
  );
  const [colors, setColors] = useState<Record<string, string>>({});
  const [logoReference, setLogoReference] = useState("");
  const [composerPlaceholder, setComposerPlaceholder] = useState("");
  const [apiError, setApiError] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [order, setOrder] = useState<OrderManifest | null>(null);
  const [busy, setBusy] = useState(false);
  const [reviewedCaseIds, setReviewedCaseIds] = useState<string[]>([]);
  const [reviewerId, setReviewerId] = useState("");
  const [revisionParent, setRevisionParent] =
    useState<OrderManifest | null>(null);
  const [revisionEditing, setRevisionEditing] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");
  const [revisionChanges, setRevisionChanges] = useState<
    SemanticOrderChange[]
  >([]);
  const [affectedCaseIds, setAffectedCaseIds] = useState<string[]>([]);
  const [resolvedSelectionKey, setResolvedSelectionKey] = useState<string>();

  const selection = useMemo(
    (): AssemblyOrderSelection => ({
      presetSlug: preset.slug,
      recipeSlug: preset.recipe,
      profile: profile as AssemblyOrderSelection["profile"],
      capabilitySlugs: capabilities,
      safeOverrides: {
        ...(productName.trim() || logoReference.trim()
          ? {
              branding: {
                ...(productName.trim()
                  ? { productName: productName.trim() }
                  : {}),
                ...(logoReference.trim()
                  ? { logoReference: logoReference.trim() }
                  : {}),
              },
            }
          : {}),
        ...(composerPlaceholder.trim()
          ? {
              productCopy: {
                composerPlaceholder: composerPlaceholder.trim(),
              },
            }
          : {}),
        navigation: capabilities,
        locale: locales,
        platformChrome,
        ...(Object.keys(colors).length
          ? { semanticStateColors: colors }
          : {}),
      },
      productId: "parking-agent",
      locales,
      platformChrome,
    }),
    [
      capabilities,
      colors,
      composerPlaceholder,
      locales,
      logoReference,
      platformChrome,
      preset.recipe,
      preset.slug,
      productName,
      profile,
    ],
  );

  const previewConfiguration = useMemo(
    () => previewConfigurationFromSelection(selection),
    [selection],
  );
  const selectedCase = preset.cases.find((item) => item.id === caseId);
  const selectedPreviewUrl = previewUrl(caseId, previewConfiguration, locale);
  const currentSelectionKey = selectionKey(selection);
  const parentPreviewConfiguration = useMemo(() => {
    if (!revisionParent) return null;
    return previewConfigurationFromSelection({
      ...selection,
      capabilitySlugs: [...revisionParent.composition.capabilities],
      safeOverrides: revisionParent.safeOverrides,
      locales: [...revisionParent.target.locales],
      platformChrome: revisionParent.target.platformChrome,
    });
  }, [revisionParent, selection]);

  const captureByCase = useMemo(
    () => new Map(evidence.captures.map((capture) => [capture.caseId, capture])),
    [evidence.captures],
  );
  const captureComplete =
    evidence.available &&
    evidence.captures.length === preset.cases.length &&
    new Set(evidence.captures.map((capture) => capture.caseId)).size ===
      preset.cases.length &&
    preset.cases.every((item) => captureByCase.has(item.id));
  const orderIsConfirmed = order?.identity.status === "confirmed";
  const controlsLocked =
    !revisionEditing && (readOnly || orderIsConfirmed === true);
  const reviewComplete =
    reviewedCaseIds.length === preset.cases.length &&
    new Set(reviewedCaseIds).size === preset.cases.length &&
    preset.cases.every((item) => reviewedCaseIds.includes(item.id));
  const canConfirm =
    order?.identity.status === "draft" &&
    captureComplete &&
    evidence.acceptanceStatus === "approved" &&
    reviewComplete &&
    resolvedSelectionKey === currentSelectionKey &&
    !busy &&
    !readOnly;

  const hydrateControls = useCallback((manifest: OrderManifest) => {
    const overrides = manifest.safeOverrides as Record<string, unknown>;
    const branding = overrides.branding;
    if (typeof branding === "string") {
      setProductName(branding);
      setLogoReference("");
    } else if (branding && typeof branding === "object") {
      const values = branding as Record<string, unknown>;
      setProductName(
        typeof values.productName === "string" ? values.productName : "",
      );
      setLogoReference(
        typeof values.logoReference === "string" ? values.logoReference : "",
      );
    }
    const productCopy = overrides.productCopy;
    setComposerPlaceholder(
      productCopy &&
        typeof productCopy === "object" &&
        typeof (productCopy as Record<string, unknown>).composerPlaceholder ===
          "string"
        ? String(
            (productCopy as Record<string, unknown>).composerPlaceholder,
          )
        : "",
    );
    const semanticColors = overrides.semanticStateColors;
    setColors(
      semanticColors && typeof semanticColors === "object"
        ? (semanticColors as Record<string, string>)
        : {},
    );
    setProfile(manifest.target.profile);
    const navigation = overrides.navigation;
    setCapabilities(
      Array.isArray(navigation) &&
        navigation.length > 0 &&
        navigation.every((item): item is string => typeof item === "string")
        ? [...navigation]
        : [...manifest.composition.capabilities],
    );
    setLocales([...manifest.target.locales]);
    setPlatformChrome(manifest.target.platformChrome);
  }, []);

  const postAction = useCallback(async (body: unknown) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await response.json()) as AssemblyOrderApiResult;
  }, []);

  const resolve = useCallback(
    async (
      nextSelection: AssemblyOrderSelection = selection,
      preserveIdentity = true,
    ) => {
      const requestId = ++resolveRequestId.current;
      setBusy(true);
      setApiError("");
      try {
        const identity = preserveIdentity ? order?.identity : undefined;
        const result = await postAction({
          action: "resolve",
          ...nextSelection,
          ...(identity?.orderId
            ? {
                orderId: identity.orderId,
                createdAt: identity.createdAt,
              }
            : {}),
        });
        if (requestId !== resolveRequestId.current) return;
        if (result.ok) {
          setOrder(result.order as OrderManifest);
          setReviewedCaseIds([]);
          setResolvedSelectionKey(selectionKey(nextSelection));
        } else {
          setApiError(`${result.error.code}: ${result.error.message}`);
        }
      } catch {
        if (requestId === resolveRequestId.current) {
          setApiError("INVALID_REQUEST: Could not resolve this order.");
        }
      } finally {
        if (requestId === resolveRequestId.current) setBusy(false);
      }
    },
    [order?.identity, postAction, selection],
  );

  const importManifest = useCallback(
    async (manifest: unknown) => {
      resolveRequestId.current += 1;
      setBusy(true);
      setApiError("");
      try {
        const result = await postAction({ action: "import", manifest });
        if (result.ok) {
          const imported = result.order as OrderManifest;
          hydrateControls(imported);
          setOrder(imported);
          setReadOnly(true);
          setReviewedCaseIds([]);
          setRevisionEditing(false);
          setRevisionParent(null);
          setResolvedSelectionKey(undefined);
        } else {
          setApiError(`${result.error.code}: ${result.error.message}`);
        }
      } catch {
        setApiError("INVALID_REQUEST: Could not import this manifest.");
      } finally {
        setBusy(false);
      }
    },
    [hydrateControls, postAction],
  );

  useEffect(() => {
    if (initialSelectionResolved.current) return;
    initialSelectionResolved.current = true;
    const encoded = new URLSearchParams(window.location.search).get("order");
    if (encoded) {
      try {
        void importManifest(decodeOrderShare(encoded));
      } catch {
        setApiError("INVALID_REQUEST: Invalid shared order.");
      }
      return;
    }
    void resolve(selection, false);
  }, [importManifest, resolve, selection]);

  useEffect(() => {
    if (resolvedSelectionKey !== currentSelectionKey) {
      setReviewedCaseIds([]);
    }
  }, [currentSelectionKey, resolvedSelectionKey]);

  async function handleFileImport(
    file: File | undefined,
    input: HTMLInputElement,
  ) {
    try {
      if (!file) return;
      await importManifest(JSON.parse(await file.text()));
    } catch {
      setApiError("INVALID_REQUEST: Invalid manifest.");
    } finally {
      input.value = "";
    }
  }

  async function confirm() {
    if (!canConfirm || !order) return;
    resolveRequestId.current += 1;
    setBusy(true);
    setApiError("");
    try {
      const result = await postAction({
        action: "confirm",
        draft: order,
        captures: evidence.captures.map((capture) => ({
          caseId: capture.caseId,
          goldenSha256: capture.sha256,
        })),
        review: {
          explicitlyConfirmed: true,
          reviewedCaseIds: [...reviewedCaseIds],
        },
        ...(reviewerId.trim() ? { reviewerId: reviewerId.trim() } : {}),
      });
      if (result.ok) {
        const confirmed = result.order as OrderManifest;
        setOrder(confirmed);
        setReadOnly(true);
        setRevisionEditing(false);
        setReviewedCaseIds([]);
        setResolvedSelectionKey(currentSelectionKey);
      } else {
        setApiError(`${result.error.code}: ${result.error.message}`);
      }
    } catch {
      setApiError("INVALID_REQUEST: Could not confirm this order.");
    } finally {
      setBusy(false);
    }
  }

  function beginRevision() {
    if (order?.identity.status !== "confirmed") return;
    hydrateControls(order);
    setRevisionParent(order);
    setRevisionEditing(true);
    setReadOnly(false);
    setRevisionReason("");
    setRevisionChanges([]);
    setAffectedCaseIds([]);
    setReviewedCaseIds([]);
    setApiError("");
  }

  async function generateRevision() {
    if (!revisionParent || !revisionReason.trim() || busy) return;
    resolveRequestId.current += 1;
    setBusy(true);
    setApiError("");
    try {
      const result = await postAction({
        action: "revise",
        parent: revisionParent,
        nextSelection: selection,
        reason: revisionReason.trim(),
      });
      if (result.ok) {
        const draft = result.order as OrderManifest;
        setOrder(draft);
        setRevisionChanges(diffAssemblyOrders(revisionParent, draft));
        // Phase 2 conservatively rechecks the complete deterministic matrix.
        setAffectedCaseIds(preset.cases.map((item) => item.id));
        setReviewedCaseIds([]);
        setResolvedSelectionKey(currentSelectionKey);
      } else {
        setApiError(`${result.error.code}: ${result.error.message}`);
      }
    } catch {
      setApiError("INVALID_REQUEST: Could not create this revision.");
    } finally {
      setBusy(false);
    }
  }

  function changeRuntime(event: ChangeEvent<HTMLSelectElement>) {
    const nextProfile = event.target.value as AssemblyOrderSelection["profile"];
    const nextChrome: AssemblyOrderSelection["platformChrome"] =
      nextProfile === "electron-renderer" ? "native" : "web";
    setProfile(nextProfile);
    setPlatformChrome(nextChrome);
    const nextSelection = {
      ...selection,
      profile: nextProfile,
      platformChrome: nextChrome,
      safeOverrides: {
        ...selection.safeOverrides,
        platformChrome: nextChrome,
      },
    };
    if (!revisionEditing) void resolve(nextSelection);
  }

  function toggleCapability(slug: string) {
    const next = capabilities.includes(slug)
      ? capabilities.filter((item) => item !== slug)
      : [...capabilities, slug];
    setCapabilities(next);
    if (!revisionEditing) {
      void resolve({
        ...selection,
        capabilitySlugs: next,
        safeOverrides: { ...selection.safeOverrides, navigation: next },
      });
    }
  }

  function toggleLocale(locale: string) {
    const next = locales.includes(locale)
      ? locales.length > 1
        ? locales.filter((item) => item !== locale)
        : locales
      : [...locales, locale];
    setLocales(next);
  }

  function toggleReviewedCase(nextCaseId: string) {
    setReviewedCaseIds((current) =>
      current.includes(nextCaseId)
        ? current.filter((item) => item !== nextCaseId)
        : [...current, nextCaseId],
    );
  }

  return (
    <div
      data-testid="assembly-studio"
      className={cn("space-y-6 text-sm", className)}
    >
      <VisualReferenceBoard
        presetSlug={preset.slug}
        calibrationSources={preset.calibrationSources}
        candidateCases={preset.cases.flatMap((item) => {
          const capture = captureByCase.get(item.id);
          return capture
            ? [
                {
                  caseId: item.id,
                  path: capture.path,
                  size: item.size,
                  theme: item.theme,
                  calibrationSourceIds: item.calibrationSourceIds,
                },
              ]
            : [];
        })}
        acceptanceStatus={evidence.acceptanceStatus}
      />

      <label className="inline-flex items-center gap-2 text-muted-foreground">
        <span>Import manifest</span>
        <input
          aria-label="Import manifest"
          type="file"
          accept="application/json"
          onChange={(event) =>
            void handleFileImport(
              event.target.files?.[0],
              event.currentTarget,
            )
          }
        />
      </label>

      <Section
        title={
          zh ? "1. 应用类型与运行时" : "1. Application and runtime"
        }
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-border px-2.5 py-1.5">
            Application
          </span>
          <select
            aria-label="Runtime"
            value={profile}
            disabled={controlsLocked}
            onChange={changeRuntime}
            className="rounded-md border border-border bg-background px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {preset.profiles.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {platformChrome} chrome
          </span>
        </div>
      </Section>

      <Section title="2. System Preset">
        <label className="mt-3 flex items-center gap-2">
          <input type="radio" checked readOnly />
          {preset.slug}
        </label>
      </Section>

      <Section title={zh ? "3. 业务能力" : "3. Capabilities"}>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {preset.capabilities.map((item) => (
            <label key={item.slug} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={capabilities.includes(item.slug)}
                disabled={controlsLocked || item.required}
                onChange={() => toggleCapability(item.slug)}
              />
              {item.name}
              {item.required ? <Lock className="h-3.5 w-3.5" /> : null}
            </label>
          ))}
        </div>
      </Section>

      <Section title={zh ? "4. 安全覆盖" : "4. Safe overrides"}>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="text-muted-foreground">
            Product name
            <input
              aria-label="Product name"
              value={productName}
              disabled={controlsLocked}
              onChange={(event) => setProductName(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-muted-foreground">
            Logo reference
            <input
              aria-label="Logo reference"
              value={logoReference}
              disabled={controlsLocked}
              onChange={(event) => setLogoReference(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-muted-foreground md:col-span-2">
            Composer placeholder
            <input
              aria-label="Composer placeholder"
              value={composerPlaceholder}
              disabled={controlsLocked}
              onChange={(event) =>
                setComposerPlaceholder(event.target.value)
              }
              className={inputClass}
            />
          </label>
        </div>
        {!revisionEditing ? (
          <button
            type="button"
            onClick={() => void resolve()}
            disabled={controlsLocked || busy}
            className={cn(buttonClass, "mt-3")}
          >
            {zh ? "应用覆盖" : "Apply overrides"}
          </button>
        ) : null}
      </Section>

      <Section title="Locale & platform">
        <div className="mt-3 flex flex-wrap gap-3">
          {["zh-CN", "en"].map((locale) => (
            <label key={locale}>
              <input
                type="checkbox"
                checked={locales.includes(locale)}
                disabled={controlsLocked}
                onChange={() => toggleLocale(locale)}
              />{" "}
              {locale}
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          {(["native", "web"] as const).map((chrome) => (
            <label key={chrome}>
              <input
                type="radio"
                name="platform-chrome"
                checked={platformChrome === chrome}
                disabled={controlsLocked}
                onChange={() => setPlatformChrome(chrome)}
              />{" "}
              {chrome}
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {SEMANTIC_COLOR_KEYS.map((name) => (
            <label key={name} className="text-xs">
              <input
                type="color"
                aria-label={name}
                value={colors[name] ?? "#000000"}
                disabled={controlsLocked}
                onChange={(event) =>
                  setColors((current) => ({
                    ...current,
                    [name]: event.target.value,
                  }))
                }
              />{" "}
              {name}
            </label>
          ))}
        </div>
      </Section>

      <Section
        title={zh ? "5. 完整应用预览" : "5. Full application preview"}
      >
        <div
          role="tablist"
          aria-label="Assembly preview cases"
          className="mt-3 flex flex-wrap gap-1.5"
        >
          {preset.cases.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === caseId}
              onClick={() => setCaseId(item.id)}
              className={cn(
                buttonClass,
                item.id === caseId && "bg-muted",
              )}
            >
              {item.id}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {selectedCase?.size ?? "—"} exact-size preview
          </span>
          <a
            href={selectedPreviewUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 underline"
          >
            Open exact-size preview <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="mt-3 overflow-x-auto border border-border bg-muted">
          <iframe
            title="Assembly preview"
            src={selectedPreviewUrl}
            width={caseDimensions(selectedCase?.size ?? "1440x900").width}
            height={caseDimensions(selectedCase?.size ?? "1440x900").height}
            className="block max-w-none bg-background"
          />
        </div>
      </Section>

      <Section
        title={
          zh ? "6. 解析结果与锁定决策" : "6. Resolution and locked decisions"
        }
      >
        {apiError ? (
          <p role="alert" className="mt-3 text-destructive">
            {apiError}
          </p>
        ) : null}
        {!order && !apiError ? (
          <p className="mt-3 text-muted-foreground">
            {busy
              ? zh
                ? "正在解析默认订单…"
                : "Resolving the default order…"
              : zh
                ? "尚未解析订单。"
                : "No resolved order yet."}
          </p>
        ) : null}
        {order ? (
          <div className="mt-3 grid gap-4 lg:grid-cols-3">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Components
              </h3>
              <ul className="mt-2 space-y-1">
                {order.composition.components.map((component) => (
                  <li key={component.slug}>
                    {component.slug}{" "}
                    <span className="text-muted-foreground">
                      ({component.sourceFiles.length} files)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Assets
              </h3>
              <ul className="mt-2 space-y-1">
                {order.composition.assets.map((asset, index) => (
                  <li key={`${asset.kind}-${asset.id ?? index}`}>
                    {asset.kind}
                    {asset.id ? ` · ${asset.id}` : ""}{" "}
                    <span className="text-muted-foreground">
                      {asset.required ? "required" : "optional"} · {asset.source}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                9 locked visual decisions
              </h3>
              <ul className="mt-2 grid grid-cols-2 gap-1">
                {LOCKED_VISUAL_KEYS.map((key) => (
                  <li key={key} className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void resolve()}
          disabled={busy || controlsLocked || revisionEditing}
          className={cn(buttonClass, "mt-4")}
        >
          {busy ? "…" : zh ? "校验并解析" : "Resolve"}
        </button>
      </Section>

      {revisionEditing && revisionParent ? (
        <Section title={zh ? "修订订单" : "Create revision"}>
          <p className="mt-2 text-muted-foreground">
            {zh
              ? "父订单保持不可变。修改上方选择后生成新的草稿修订。"
              : "The parent stays immutable. Edit the selection above, then generate a new draft revision."}
          </p>
          <label className="mt-3 block text-muted-foreground">
            Revision reason
            <input
              aria-label="Revision reason"
              value={revisionReason}
              onChange={(event) => setRevisionReason(event.target.value)}
              className={inputClass}
            />
          </label>
          <button
            type="button"
            disabled={!revisionReason.trim() || busy}
            onClick={() => void generateRevision()}
            className={cn(buttonClass, "mt-3")}
          >
            <FilePenLine className="h-3.5 w-3.5" />
            {zh ? "生成修订" : "Generate revision"}
          </button>
          {revisionChanges.length > 0 ? (
            <div className="mt-4">
              <h3 className="font-medium">Semantic diff</h3>
              <ul className="mt-2 divide-y divide-border border-y border-border">
                {revisionChanges.map((change) => (
                  <li key={change.path} className="grid gap-1 py-2 md:grid-cols-3">
                    <code>{change.path}</code>
                    <span className="break-all text-muted-foreground">
                      {formatDiffValue(change.before)}
                    </span>
                    <span className="break-all">
                      {formatDiffValue(change.after)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Affected preview cases (conservative full-matrix recheck):{" "}
                {affectedCaseIds.join(", ")}
              </p>
              {parentPreviewConfiguration && selectedCase ? (
                <div
                  data-testid="revision-visual-review"
                  className="mt-4 overflow-auto border border-border bg-muted p-3"
                >
                  <h3 className="mb-3 font-medium">Before / after visual review</h3>
                  <div className="flex min-w-max gap-4">
                    {([
                      ["Before", parentPreviewConfiguration],
                      ["After", previewConfiguration],
                    ] as const).map(([label, typedConfiguration]) => {
                      const url = previewUrl(
                        selectedCase.id,
                        typedConfiguration,
                        locale,
                      );
                      const dimensions = caseDimensions(selectedCase.size);
                      return (
                        <figure key={label} className="w-[504px] shrink-0">
                          <figcaption className="mb-2 flex items-center justify-between text-xs">
                            <span>{label} · {selectedCase.id}</span>
                            <a href={url} target="_blank" rel="noopener" className="underline">
                              exact size
                            </a>
                          </figcaption>
                          <div className="h-[315px] overflow-hidden border border-border bg-background">
                            <iframe
                              title={`${label} revision preview`}
                              src={url}
                              width={dimensions.width}
                              height={dimensions.height}
                              className="origin-top-left scale-[0.35]"
                            />
                          </div>
                        </figure>
                      );
                    })}
                  </div>
                  <ul className="mt-3 grid gap-1 text-xs md:grid-cols-2">
                    {affectedCaseIds.map((affectedCaseId) => (
                      <li key={affectedCaseId} className="flex gap-2">
                        <span>{affectedCaseId}</span>
                        <a
                          href={previewUrl(
                            affectedCaseId,
                            parentPreviewConfiguration,
                            locale,
                          )}
                          target="_blank"
                          rel="noopener"
                          className="underline"
                        >
                          before
                        </a>
                        <a
                          href={previewUrl(
                            affectedCaseId,
                            previewConfiguration,
                            locale,
                          )}
                          target="_blank"
                          rel="noopener"
                          className="underline"
                        >
                          after
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </Section>
      ) : null}

      <Section title="7. Review / Checkout">
        {order && resolvedSelectionKey !== currentSelectionKey ? (
          <p role="status" className="mt-3 text-xs text-muted-foreground">
            {zh
              ? "当前选择尚未解析；请先应用覆盖或解析订单，再确认。"
              : "Current selection has not been resolved. Apply overrides or resolve before confirming."}
          </p>
        ) : null}
        {captureComplete ? (
          <div
            data-testid="evidence-matrix"
            className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          >
            {preset.cases.map((item) => {
              const capture = captureByCase.get(item.id);
              if (!capture) return null;
              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-border"
                >
                  <a href={capture.path} target="_blank" rel="noopener">
                    {/* Repository-owned candidate bytes must remain untransformed. */}
                    {/* biome-ignore lint/performance/noImgElement: candidate regression evidence must not be transformed by the image optimizer */}
                    <img
                      src={capture.path}
                      alt={`${item.id} candidate regression capture`}
                      className="aspect-video w-full border-b border-border bg-muted object-cover"
                    />
                  </a>
                  <div className="space-y-1 p-2.5">
                    <p className="flex items-center gap-1 font-medium">
                      <Check className="h-3.5 w-3.5" />
                      {item.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} · {item.theme}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      states: {item.states.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      surfaces: {item.surfaces.join(", ")}
                    </p>
                    <a
                      className="inline-flex items-center gap-1 text-xs underline"
                      href={capture.path}
                      target="_blank"
                      rel="noopener"
                    >
                      Open candidate capture <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      aria-label={`Open current order preview ${item.id}`}
                      className="flex items-center gap-1 text-xs underline"
                      href={previewUrl(item.id, previewConfiguration, locale)}
                      target="_blank"
                      rel="noopener"
                    >
                      Open current order preview
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <label className="flex items-start gap-2 border-t border-border pt-2 text-xs">
                      <input
                        type="checkbox"
                        aria-label={`Review ${item.id} current order`}
                        checked={reviewedCaseIds.includes(item.id)}
                        disabled={
                          evidence.acceptanceStatus !== "approved" ||
                          readOnly ||
                          orderIsConfirmed ||
                          busy ||
                          resolvedSelectionKey !== currentSelectionKey
                        }
                        onChange={() => toggleReviewedCase(item.id)}
                      />
                      <span>{zh ? "已复核当前订单" : "Current order reviewed"}</span>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            role="status"
            className="mt-3 border border-border bg-muted p-3 text-muted-foreground"
          >
            <p className="font-medium text-foreground">
              Checkout blocked
            </p>
            <p className="mt-1">
              {evidence.reason ??
                (zh
                  ? "候选回归截图不可用或未完整覆盖 8 个预览用例。"
                  : "Candidate regression captures are unavailable or do not exactly cover all 8 preview cases.")}
            </p>
          </div>
        )}
        {captureComplete && evidence.acceptanceStatus === "pending" ? (
          <div
            role="status"
            className="mt-3 border border-border bg-muted p-3 text-muted-foreground"
          >
            <p className="font-medium text-foreground">Acceptance pending</p>
            <p className="mt-1 font-medium text-foreground">Checkout blocked</p>
            <p className="mt-1">
              {evidence.reason ??
                (zh
                  ? "候选回归矩阵完整，但尚未经过用户明确批准，因此不能成为验收母版。"
                  : "The candidate regression matrix is complete, but it has not been explicitly approved by the user and cannot act as the acceptance master.")}
            </p>
          </div>
        ) : null}
        {captureComplete ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {zh ? "当前订单复核" : "Current-order review"}: {reviewedCaseIds.length}
            /{preset.cases.length}
          </p>
        ) : null}
        <label className="mt-3 block max-w-sm text-muted-foreground">
          Reviewer ID (optional)
          <input
            aria-label="Reviewer ID"
            value={reviewerId}
            disabled={readOnly || orderIsConfirmed}
            onChange={(event) => setReviewerId(event.target.value)}
            className={inputClass}
          />
        </label>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => void confirm()}
          className={cn(buttonClass, "mt-3")}
        >
          {zh ? "确认订单" : "Confirm order"}
        </button>
      </Section>

      {order ? (
        <Section
          title={
            readOnly
              ? zh
                ? "只读订单"
                : "Read-only order"
              : zh
                ? "已解析订单"
                : "Resolved order"
          }
        >
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd>{order.identity.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Revision</dt>
              <dd>{order.identity.revision}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Order ID</dt>
              <dd className="break-all">{order.identity.orderId}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Manifest hash</dt>
              <dd className="break-all font-mono text-xs">
                {order.identity.manifestHash}
              </dd>
            </div>
          </dl>
          {order.lineage ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Parent revision {order.lineage.parentRevision} ·{" "}
              {order.lineage.parentHash}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                void navigator.clipboard.writeText(
                  serializeAssemblyOrder(order),
                )
              }
              className={buttonClass}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy manifest
            </button>
            <button
              type="button"
              onClick={() =>
                void navigator.clipboard.writeText(
                  `${window.location.origin}${window.location.pathname}?order=${encodeOrderShare(order)}`,
                )
              }
              className={buttonClass}
            >
              Copy read-only link
            </button>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([serializeAssemblyOrder(order)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "assembly-order.json";
                anchor.click();
                URL.revokeObjectURL(url);
              }}
              className={buttonClass}
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </button>
            {order.identity.status === "confirmed" && !revisionEditing ? (
              <button
                type="button"
                onClick={beginRevision}
                className={buttonClass}
              >
                <FilePenLine className="h-3.5 w-3.5" />
                Create revision
              </button>
            ) : null}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
