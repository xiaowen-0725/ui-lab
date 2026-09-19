export type Room = "hall" | "bench";
export type Task = "unknown" | "purpose" | "tune";
export type Layer = "noun" | "motion" | "system";
export type Purpose = "submit" | "open" | "swap";
export type Capability = "preview" | "tune" | "install";
export type TakeKind = "install" | "token" | "theme";

export type ItemId =
  | "button"
  | "input"
  | "drawer"
  | "tabs"
  | "press"
  | "swap"
  | "panel"
  | "radius"
  | "shadow"
  | "graphite";

export type SiteIaState = {
  room: Room;
  task: Task | null;
  layer: Layer | null;
  purpose: Purpose | null;
  item: ItemId | null;
};

export type SiteIaItem = {
  id: ItemId;
  layer: Layer;
  purposes: readonly Purpose[];
  capabilities: readonly Capability[];
  takeKind: TakeKind;
  installSlug?: string;
  notNeighbor: boolean;
};

export const SITE_IA_PATH = "/playground/site-ia";

export const ITEM_IDS: readonly ItemId[] = [
  "button",
  "input",
  "drawer",
  "tabs",
  "press",
  "swap",
  "panel",
  "radius",
  "shadow",
  "graphite",
] as const;

export const ITEMS: readonly SiteIaItem[] = [
  {
    id: "button",
    layer: "noun",
    purposes: ["submit"],
    capabilities: ["preview", "install"],
    takeKind: "install",
    installSlug: "button-base",
    notNeighbor: true,
  },
  {
    id: "input",
    layer: "noun",
    purposes: ["submit"],
    capabilities: ["preview", "install"],
    takeKind: "install",
    installSlug: "input",
    notNeighbor: false,
  },
  {
    id: "drawer",
    layer: "noun",
    purposes: ["open"],
    capabilities: ["preview", "install"],
    takeKind: "install",
    installSlug: "drawer",
    notNeighbor: true,
  },
  {
    id: "tabs",
    layer: "noun",
    purposes: ["swap"],
    capabilities: ["preview", "install"],
    takeKind: "install",
    installSlug: "tabs",
    notNeighbor: true,
  },
  {
    id: "press",
    layer: "motion",
    purposes: ["submit"],
    capabilities: ["preview"],
    takeKind: "token",
    notNeighbor: false,
  },
  {
    id: "swap",
    layer: "motion",
    purposes: ["swap", "submit"],
    capabilities: ["preview", "install"],
    takeKind: "install",
    installSlug: "action-swap-cascade",
    notNeighbor: true,
  },
  {
    id: "panel",
    layer: "motion",
    purposes: ["open"],
    capabilities: ["preview"],
    takeKind: "token",
    notNeighbor: false,
  },
  {
    id: "radius",
    layer: "system",
    purposes: ["submit"],
    capabilities: ["preview", "tune"],
    takeKind: "token",
    notNeighbor: false,
  },
  {
    id: "shadow",
    layer: "system",
    purposes: ["open"],
    capabilities: ["preview", "tune"],
    takeKind: "token",
    notNeighbor: false,
  },
  {
    id: "graphite",
    layer: "system",
    purposes: [],
    capabilities: ["preview", "tune", "install"],
    takeKind: "theme",
    installSlug: "theme-graphite",
    notNeighbor: false,
  },
] as const;

export const EMPTY_STATE: SiteIaState = {
  room: "hall",
  task: null,
  layer: null,
  purpose: null,
  item: null,
};

export type SiteIaView =
  | "gate"
  | "purpose-pick"
  | "compare"
  | "specimen"
  | "bench";

export function isItemId(value: string | null): value is ItemId {
  return ITEM_IDS.includes(value as ItemId);
}

export function isTask(value: string | null): value is Task {
  return value === "unknown" || value === "purpose" || value === "tune";
}

export function isLayer(value: string | null): value is Layer {
  return value === "noun" || value === "motion" || value === "system";
}

export function isPurpose(value: string | null): value is Purpose {
  return value === "submit" || value === "open" || value === "swap";
}

export function parseSiteIaState(params: URLSearchParams): SiteIaState {
  const task = params.get("task");
  const layer = params.get("layer");
  const purpose = params.get("purpose");
  const item = params.get("item");
  const room = params.get("room") === "bench" || task === "tune" ? "bench" : "hall";
  return {
    room,
    task: isTask(task) ? task : null,
    layer: isLayer(layer) ? layer : null,
    purpose: isPurpose(purpose) ? purpose : null,
    item: isItemId(item) ? item : null,
  };
}

export function serializeSiteIaState(state: SiteIaState): Record<string, string> {
  const query: Record<string, string> = {};
  if (state.room === "bench") query.room = "bench";
  if (state.task) query.task = state.task;
  if (state.layer) query.layer = state.layer;
  if (state.purpose) query.purpose = state.purpose;
  if (state.item) query.item = state.item;
  return query;
}

export function mergeSiteIaState(
  current: SiteIaState,
  patch: Partial<SiteIaState>,
): SiteIaState {
  return { ...current, ...patch };
}

export function resolveSiteIaView(state: SiteIaState): SiteIaView {
  if (state.room === "bench" || state.task === "tune") return "bench";
  if (state.item) return "specimen";
  if (state.task === "purpose" && !state.purpose) return "purpose-pick";
  if (state.task === "unknown" || (state.task === "purpose" && state.purpose)) {
    return "compare";
  }
  return "gate";
}

export function findItem(id: ItemId): SiteIaItem {
  const item = ITEMS.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown site-ia item: ${id}`);
  return item;
}

export function visibleItems(state: SiteIaState): SiteIaItem[] {
  const layer = state.layer ?? (state.task === "unknown" ? "noun" : null);
  return ITEMS.filter((item) => {
    if (layer && item.layer !== layer) return false;
    if (state.purpose && !item.purposes.includes(state.purpose)) return false;
    return true;
  }).slice(0, 4);
}

export function queryString(state: SiteIaState): string {
  const query = serializeSiteIaState(state);
  const params = new URLSearchParams(query);
  return params.toString();
}
