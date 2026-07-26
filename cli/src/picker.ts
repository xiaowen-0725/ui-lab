// Self-contained HTML "theme picker" page generator for `ui-lab themes
// --picker`. Zero runtime dependencies — this module only builds a string;
// the caller (index.ts) does the actual file write via node:fs. Deliberately
// does NOT import from the main repo's lib/** — only this CLI's own
// CatalogItem type (compile-time only, erased at build time), so the CLI
// stays decoupled from the Next app.
import type { CatalogItem } from "./catalog-source.js";

type PreviewTokens = Record<string, string>;

const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6"] as const;

// A fixed, soft two-blob gradient used as a stand-in "aurora" backdrop behind
// any kit whose background is translucent (currently: frost) — otherwise its
// mini workbench mock would render as a flat, meaningless rectangle.
const AURORA_BACKGROUND =
  "radial-gradient(circle at 22% 24%, rgba(167,139,250,0.55), transparent 60%), " +
  "radial-gradient(circle at 78% 76%, rgba(56,189,248,0.5), transparent 60%), " +
  "#dbe3ee";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * True when a CSS color value carries alpha < 1: legacy rgba()/hsla() with a
 * 4th channel, the modern `color(... / alpha)` slash syntax, or the literal
 * `transparent` keyword. Used to flag "frost"-style kits (semi-transparent
 * background) so their card gets an aurora backdrop + a "needs backdrop" tag
 * instead of rendering as a flat, illegible rectangle.
 */
function isTranslucent(color: string | undefined): boolean {
  if (!color) return false;
  if (color.includes("transparent")) return true;
  const legacy = color.match(/^(?:rgba|hsla)\(([^)]+)\)$/i);
  if (legacy) {
    const parts = legacy[1].split(",").map((part) => part.trim());
    const alpha = Number.parseFloat(parts[3] ?? "1");
    if (!Number.isNaN(alpha) && alpha < 1) return true;
  }
  const modern = color.match(/\/\s*([\d.]+)(%?)\s*\)\s*$/);
  if (modern) {
    const raw = Number.parseFloat(modern[1]);
    const alpha = modern[2] === "%" ? raw / 100 : raw;
    if (!Number.isNaN(alpha) && alpha < 1) return true;
  }
  return false;
}

function modesLabel(item: CatalogItem): string {
  const modes = item.themePreview?.modes ?? [];
  return modes.length > 1 ? "light + dark" : `${modes[0] ?? "?"} only`;
}

/**
 * Renders one mode's mini agent-workbench diorama out of plain divs + inline
 * styles, using that mode's real token values: a topbar (card + hairline +
 * an accent dot + two foreground/muted text bars), a sidebar (wb-surface,
 * three rows, the middle one highlighted primary/primary-foreground), a main
 * area (background + two muted message blocks + a card/border composer with
 * a primary send button), and a status row (success/danger/warning dots +
 * the chart-1..6 strip). Needs no external CSS classes to read on its own.
 */
function renderMockup(tokens: PreviewTokens): string {
  const bg = tokens.background ?? "#fff";
  const fg = tokens.foreground ?? "#111";
  const card = tokens.card ?? bg;
  const muted = tokens["muted-foreground"] ?? fg;
  const border = tokens.border ?? "rgba(0,0,0,.12)";
  const primary = tokens.primary ?? fg;
  const primaryFg = tokens["primary-foreground"] ?? bg;
  const surface = tokens["wb-surface"] ?? card;
  const accent = tokens["wb-accent"] ?? primary;
  const hairline = tokens["wb-hairline"] ?? border;
  const success = tokens.success ?? "#22c55e";
  const danger = tokens.danger ?? "#ef4444";
  const warning = tokens.warning ?? "#f59e0b";
  const font = tokens["font-sans"] ?? "system-ui, sans-serif";

  const chartStrip = CHART_KEYS.map(
    (key) => `<i style="background:${escapeHtml(tokens[key] ?? muted)}"></i>`,
  ).join("");

  return `<div class="mock" style="background:${escapeHtml(bg)};font-family:${escapeHtml(font)};">
    <div class="mock-topbar" style="background:${escapeHtml(card)};border-bottom:1px solid ${escapeHtml(hairline)};">
      <span class="mock-dot" style="background:${escapeHtml(accent)}"></span>
      <div class="mock-topbar-text">
        <span class="mock-bar" style="background:${escapeHtml(fg)};width:52%"></span>
        <span class="mock-bar" style="background:${escapeHtml(muted)};width:32%;opacity:.7"></span>
      </div>
    </div>
    <div class="mock-body">
      <div class="mock-sidebar" style="background:${escapeHtml(surface)};">
        <span class="mock-row" style="background:${escapeHtml(muted)};opacity:.18"></span>
        <span class="mock-row mock-row-selected" style="background:${escapeHtml(primary)};">
          <i style="background:${escapeHtml(primaryFg)}"></i>
        </span>
        <span class="mock-row" style="background:${escapeHtml(muted)};opacity:.18"></span>
      </div>
      <div class="mock-main">
        <span class="mock-msg" style="background:${escapeHtml(muted)};opacity:.16;width:78%"></span>
        <span class="mock-msg" style="background:${escapeHtml(muted)};opacity:.16;width:55%"></span>
        <div class="mock-composer" style="background:${escapeHtml(card)};border:1px solid ${escapeHtml(border)};">
          <span class="mock-send" style="background:${escapeHtml(primary)};"></span>
        </div>
      </div>
    </div>
    <div class="mock-status">
      <span class="mock-status-dot" style="background:${escapeHtml(success)}"></span>
      <span class="mock-status-dot" style="background:${escapeHtml(danger)}"></span>
      <span class="mock-status-dot" style="background:${escapeHtml(warning)}"></span>
      <span class="mock-chart-strip">${chartStrip}</span>
    </div>
  </div>`;
}

/**
 * Decides single- vs dual-mode rendering for one kit's preview area: dual
 * kits split left/right into one mock per mode with a 1px divider + light/
 * dark corner badges; single-mode kits render one mock full-width with a
 * "<mode> only" corner badge. Either way, if the rendered mode's background
 * is translucent (frost), an aurora underlay + "needs backdrop" tag is added
 * so the card doesn't render as a flat, illegible rectangle.
 */
function renderPreviewArea(item: CatalogItem): string {
  const preview = item.themePreview;
  if (!preview) return "";
  const dual = preview.modes.length > 1;

  if (dual) {
    const light = preview.light ?? {};
    const dark = preview.dark ?? {};
    const frost = isTranslucent(light.background) || isTranslucent(dark.background);
    const style = frost ? ` style="background:${AURORA_BACKGROUND}"` : "";
    return `<div class="preview preview-dual"${style}>
      <div class="preview-half">${renderMockup(light)}</div>
      <div class="preview-half preview-half-right">${renderMockup(dark)}</div>
      <span class="mode-badge mode-badge-left">light</span>
      <span class="mode-badge mode-badge-right">dark</span>
      ${frost ? '<span class="frost-badge">needs backdrop</span>' : ""}
    </div>`;
  }

  const mode = preview.modes[0];
  const tokens = (mode === "dark" ? preview.dark : preview.light) ?? {};
  const frost = isTranslucent(tokens.background);
  const style = frost ? ` style="background:${AURORA_BACKGROUND}"` : "";
  return `<div class="preview"${style}>
    ${renderMockup(tokens)}
    <span class="mode-badge mode-badge-solo">${escapeHtml(mode)} only</span>
    ${frost ? '<span class="frost-badge">needs backdrop</span>' : ""}
  </div>`;
}

/**
 * Renders one kit's full card: the token-driven preview diorama on top, and
 * a fixed light footer below it (deliberately NOT styled with the kit's own
 * tokens, so it stays readable no matter how dark/translucent the kit is) —
 * name (en + zh), slug, kind, modes, the shadcn install command (click to
 * select), and the literal line to say to an agent.
 */
function renderCard(item: CatalogItem): string {
  const command = escapeHtml(item.fetch.command ?? "");
  const slug = escapeHtml(item.slug);
  const searchKey = escapeHtml(`${item.slug} ${item.name} ${item.nameZh}`.toLowerCase());

  return `<article class="card" data-search="${searchKey}">
    ${renderPreviewArea(item)}
    <div class="card-info">
      <h2>${escapeHtml(item.name)} <span class="zh">${escapeHtml(item.nameZh)}</span></h2>
      <div class="meta">
        <code class="slug">${slug}</code>
        <span class="kind">${escapeHtml(item.kind)}</span>
        <span class="modes">${escapeHtml(modesLabel(item))}</span>
      </div>
      <code class="command" tabindex="0" title="click to select">${command}</code>
      <p class="ai-line">对 AI 这样说：使用 UI Lab 主题套件 <strong>${slug}</strong></p>
    </div>
  </article>`;
}

// Page chrome (grid, cards, mock diorama) is deliberately plain and
// restrained — system font stack, an 8px spacing rhythm, a neutral light
// page background — so the token-driven kit cards stay the visual focus.
const CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f1f5f9;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .page { max-width: 1440px; margin: 0 auto; padding: 48px 32px 64px; }
  .page-header h1 { font-size: 26px; margin: 0 0 8px; letter-spacing: -0.01em; }
  .page-header p { font-size: 14px; color: #475569; margin: 0 0 4px; line-height: 1.6; }
  .page-header code { background: #e2e8f0; padding: 1px 6px; border-radius: 4px; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 13px; }
  .meta-line { color: #94a3b8 !important; font-size: 12px !important; margin-top: 8px !important; }
  .filter-bar { margin: 24px 0 8px; }
  .filter-bar input {
    width: 100%;
    max-width: 320px;
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
  }
  .filter-bar input:focus { outline: 2px solid #6366f1; outline-offset: 1px; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }
  .card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
  }
  .preview { position: relative; height: 180px; overflow: hidden; }
  .preview-dual { display: flex; }
  .preview-half { flex: 1; position: relative; overflow: hidden; }
  .preview-half-right { border-left: 1px solid rgba(15, 23, 42, 0.18); }
  .preview-half .mock { position: absolute; inset: 0; z-index: 1; }
  .preview > .mock { position: absolute; inset: 0; z-index: 1; }
  .mock { display: flex; flex-direction: column; font-size: 11px; height: 100%; }
  .mode-badge {
    position: absolute; top: 6px; z-index: 2;
    font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em;
    background: rgba(15, 23, 42, 0.55); color: #fff;
    padding: 2px 6px; border-radius: 999px;
  }
  .mode-badge-left { left: 6px; }
  .mode-badge-right { right: 6px; }
  .mode-badge-solo { right: 6px; }
  .frost-badge {
    position: absolute; bottom: 6px; right: 6px; z-index: 2;
    font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em;
    background: rgba(15, 23, 42, 0.7); color: #fff;
    padding: 2px 6px; border-radius: 999px;
  }
  .mock-topbar { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 10px; flex: none; }
  .mock-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
  .mock-topbar-text { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
  .mock-bar { display: block; height: 6px; border-radius: 3px; }
  .mock-body { display: flex; flex: 1; min-height: 0; }
  .mock-sidebar { width: 68px; display: flex; flex-direction: column; gap: 6px; padding: 8px; flex: none; }
  .mock-row { display: block; height: 14px; border-radius: 4px; flex: none; }
  .mock-row-selected { display: flex; align-items: center; justify-content: center; }
  .mock-row-selected i { display: block; width: 55%; height: 3px; border-radius: 2px; opacity: 0.9; }
  .mock-main { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 8px; min-width: 0; }
  .mock-msg { display: block; height: 8px; border-radius: 4px; flex: none; }
  .mock-composer { margin-top: auto; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: flex-end; padding: 0 4px; flex: none; }
  .mock-send { width: 13px; height: 13px; border-radius: 50%; display: block; }
  .mock-status { height: 22px; display: flex; align-items: center; gap: 6px; padding: 0 10px; flex: none; }
  .mock-status-dot { width: 6px; height: 6px; border-radius: 50%; flex: none; }
  .mock-chart-strip { margin-left: auto; display: flex; gap: 2px; align-items: flex-end; }
  .mock-chart-strip i { display: block; width: 6px; height: 4px; border-radius: 1px; }
  .card-info { padding: 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  .card-info h2 { font-size: 15px; margin: 0 0 6px; font-weight: 600; }
  .card-info h2 .zh { font-weight: 400; color: #64748b; margin-left: 6px; font-size: 13px; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px; font-size: 12px; color: #475569; }
  .meta .slug { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  .meta .kind { text-transform: uppercase; letter-spacing: 0.03em; font-size: 10px; color: #94a3b8; }
  .command {
    display: block; background: #0f172a; color: #e2e8f0;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11.5px;
    padding: 8px 10px; border-radius: 6px; white-space: pre-wrap; word-break: break-all;
    cursor: pointer; margin-bottom: 10px; line-height: 1.5;
  }
  .ai-line { font-size: 12px; color: #334155; margin: 0; line-height: 1.5; }
  .ai-line strong { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-weight: 600; }
`;

/**
 * Builds the full self-contained HTML picker page for every catalog item
 * that carries a themePreview (design-system + studio-preset kits). No
 * external assets, fonts, or scripts — the only inline JS is an optional
 * slug/name filter and click-to-select on the install command.
 */
export function renderPickerHtml(items: readonly CatalogItem[]): string {
  const themeItems = items.filter((item): item is CatalogItem => Boolean(item.themePreview));
  const cards = themeItems.map(renderCard).join("\n");
  const generatedAt = new Date().toISOString();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>UI Lab 主题套件 · 选一套告诉你的 agent</title>
<style>${CSS}</style>
</head>
<body>
<div class="page">
  <header class="page-header">
    <h1>UI Lab 主题套件 · 选一套告诉你的 agent</h1>
    <p>选中一套后，对你的 agent 说 <code>用 &lt;slug&gt; 主题套件</code>，或者把卡片上的安装命令直接粘进终端跑。</p>
    <p class="meta-line">${themeItems.length} kits · generated ${escapeHtml(generatedAt)}</p>
  </header>
  <div class="filter-bar">
    <input id="filter-input" type="search" placeholder="按 slug 或名称过滤…" autocomplete="off" />
  </div>
  <main class="grid">
    ${cards}
  </main>
</div>
<script>
(function () {
  var input = document.getElementById('filter-input');
  if (input) {
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var cards = document.querySelectorAll('.card');
      for (var i = 0; i < cards.length; i++) {
        var hay = cards[i].getAttribute('data-search') || '';
        cards[i].style.display = hay.indexOf(q) === -1 ? 'none' : '';
      }
    });
  }
  var commands = document.querySelectorAll('.command');
  for (var j = 0; j < commands.length; j++) {
    commands[j].addEventListener('click', function (event) {
      var range = document.createRange();
      range.selectNodeContents(event.currentTarget);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }
})();
</script>
</body>
</html>
`;
}
