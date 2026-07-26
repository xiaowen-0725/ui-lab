"use client";

import {
  ArrowUp,
  Check,
  ChevronDown,
  CornerDownRight,
  Globe,
  Mic,
  Paperclip,
  Pencil,
  Slash,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PANEL, SPRING_PRESS, SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface PromptBarSkill {
  id: string;
  label: string;
  hint?: string;
}

export interface PromptBarModel {
  id: string;
  label: string;
}

export interface PromptBarQueuedMessage {
  id: string;
  text: string;
}

export interface PromptBarProps {
  /** Slash-triggered skills — typing "/" opens the picker. */
  skills?: PromptBarSkill[];
  models?: PromptBarModel[];
  defaultModelId?: string;
  /** Shows the credits banner above the bar when provided (including 0). */
  credits?: number;
  onUpgrade?: () => void;
  placeholder?: string;
  onSubmit?: (payload: {
    text: string;
    skillId?: string;
    attachments: string[];
    webSearch: boolean;
    modelId: string;
  }) => void;
  className?: string;
}

/** Demo file chip — no real file picker, just a label to show/remove. */
interface Attachment {
  id: string;
  name: string;
}

/** Demo streaming duration — a real integration would resolve this from the actual response. */
const STREAM_DEMO_MS = 3000;

/** Flat demo cost per send — a real integration would price this server-side. */
const CREDIT_COST_PER_SEND = 10;

const DEMO_FILE_NAMES = ["brief.pdf", "screenshot.png", "meeting-notes.md", "diagram.svg", "transcript.txt"];

/** Glass-surface hairline + soft shadow trio — same technique as agent-composer's Composer shell. */
const HAIRLINE_SHADOW = "0 0 0 0.5px var(--wb-hairline-soft), 0 3px 7.5px rgba(0,0,0,0.04), 0 0 20px rgba(0,0,0,0.05)";

/** Matches a skill against the text typed after "/", by id or label prefix. */
function matchesSkillQuery(skill: PromptBarSkill, query: string): boolean {
  if (query.length === 0) return true;
  const q = query.toLowerCase();
  const label = skill.label.replace(/^\//, "").toLowerCase();
  return label.startsWith(q) || skill.id.toLowerCase().startsWith(q);
}

function CreditsNumber({ value, reduce }: { value: number; reduce: boolean }) {
  return (
    <span className="relative inline-block overflow-hidden font-medium text-foreground tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_SWAP}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Dismissible banner shown above the bar when `credits` is provided. */
function CreditsBanner({
  credits,
  onUpgrade,
  onDismiss,
}: {
  credits: number;
  onUpgrade?: () => void;
  onDismiss: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
      transition={reduce ? { duration: 0.15, ease: EASE_OUT } : { height: SPRING_LAYOUT, opacity: { duration: 0.18 } }}
      style={{ overflow: "hidden" }}
      className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--wb-inset-subtle)] px-3.5 py-2"
    >
      <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
        <CreditsNumber value={credits} reduce={reduce} />
        Credits Remaining
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={onUpgrade}
          className="rounded-full px-2 py-1 text-[13px] font-medium text-[var(--wb-accent)] transition-colors hover:bg-[var(--wb-hover)]"
        >
          Upgrade
        </button>
        <button
          type="button"
          aria-label="Dismiss credits banner"
          onClick={onDismiss}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--wb-hover)] hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}

function RowActionButton({
  "aria-label": ariaLabel,
  onClick,
  children,
}: {
  "aria-label": string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--wb-hover-strong)] hover:text-foreground"
    >
      {children}
    </button>
  );
}

/** One queued message above the bar — steer it in now, edit it back into the draft, or drop it. */
function QueuedRow({
  item,
  onSteer,
  onEdit,
  onDelete,
}: {
  item: PromptBarQueuedMessage;
  onSteer: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
      transition={
        reduce ? { duration: 0.12 } : { height: SPRING_LAYOUT, y: SPRING_LAYOUT, opacity: { duration: 0.15 } }
      }
      style={{ overflow: "hidden" }}
      className="flex items-center gap-2 rounded-xl bg-[var(--wb-inset-subtle)] px-3 py-1.5"
    >
      <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">{item.text}</span>
      <div className="flex shrink-0 items-center gap-0.5">
        <RowActionButton aria-label={`Steer now: ${item.text}`} onClick={onSteer}>
          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
        </RowActionButton>
        <RowActionButton aria-label={`Edit: ${item.text}`} onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </RowActionButton>
        <RowActionButton aria-label={`Delete: ${item.text}`} onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </RowActionButton>
      </div>
    </motion.div>
  );
}

function AttachmentChip({ name, onRemove }: { name: string; onRemove: () => void }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.span
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      transition={reduce ? { duration: 0.12 } : SPRING_SWAP}
      className="flex items-center gap-1.5 rounded-lg bg-[var(--wb-inset-subtle)] py-1 pr-1 pl-2 text-[12px] text-foreground"
    >
      <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden />
      <span className="max-w-40 truncate">{name}</span>
      <button
        type="button"
        aria-label={`Remove ${name}`}
        onClick={onRemove}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-[var(--wb-hover-strong)]"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </motion.span>
  );
}

/** The "/xxx" text solidified into a removable pill once a skill is picked. */
function SkillChip({ skill, onRemove }: { skill: PromptBarSkill; onRemove: () => void }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.span
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      transition={reduce ? { duration: 0.12 } : SPRING_SWAP}
      className="mt-0.5 flex h-6 shrink-0 items-center gap-1 rounded-full bg-[var(--wb-accent)]/15 py-0 pr-1 pl-2 text-[12px] font-medium text-[var(--wb-accent)]"
    >
      <Slash className="h-3 w-3" aria-hidden />
      {skill.label.replace(/^\//, "")}
      <button
        type="button"
        aria-label={`Remove ${skill.label} skill`}
        onClick={onRemove}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full hover:bg-[var(--wb-accent)]/25"
      >
        <X className="h-2.5 w-2.5" aria-hidden />
      </button>
    </motion.span>
  );
}

/** Floating slash-command list — arrow keys and Enter are driven from the textarea's onKeyDown. */
function SkillPanel({
  listId,
  items,
  highlightIndex,
  onSelect,
}: {
  listId: string;
  items: PromptBarSkill[];
  highlightIndex: number;
  onSelect: (skill: PromptBarSkill) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.ul
      id={listId}
      role="listbox"
      aria-label="Skills"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
      transition={reduce ? { duration: 0.12 } : SPRING_PANEL}
      style={{ transformOrigin: "bottom left", boxShadow: HAIRLINE_SHADOW }}
      className="absolute bottom-[calc(100%+8px)] left-3 z-20 max-h-56 w-64 overflow-auto rounded-2xl bg-[var(--wb-surface-raised)] p-1 backdrop-blur-xl"
    >
      {items.map((skill, index) => (
        <li key={skill.id}>
          <button
            type="button"
            id={`${listId}-${skill.id}`}
            role="option"
            aria-selected={index === highlightIndex}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(skill)}
            className={cn(
              "flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-1.5 text-left transition-colors",
              index === highlightIndex ? "bg-[var(--wb-hover-strong)]" : "hover:bg-[var(--wb-hover)]",
            )}
          >
            <span className="flex items-center gap-1 text-[13px] font-medium text-foreground">
              <Slash className="h-3 w-3 text-muted-foreground" aria-hidden />
              {skill.label.replace(/^\//, "")}
            </span>
            {skill.hint ? <span className="truncate text-[12px] text-muted-foreground">{skill.hint}</span> : null}
          </button>
        </li>
      ))}
    </motion.ul>
  );
}

/** Small text-button model picker — a simplified, self-contained cousin of components/motion/select.tsx. */
function ModelMenu({
  models,
  modelId,
  onSelect,
}: {
  models: PromptBarModel[];
  modelId: string;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = models.find((m) => m.id === modelId) ?? models[0];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 items-center gap-1 rounded-full px-2 text-[13px] text-muted-foreground transition-colors hover:bg-[var(--wb-hover)]"
      >
        {current?.label ?? "Model"}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label="Model"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
            transition={reduce ? { duration: 0.12 } : SPRING_PANEL}
            style={{ transformOrigin: "bottom right", boxShadow: HAIRLINE_SHADOW }}
            className="absolute right-0 bottom-[calc(100%+8px)] z-20 min-w-[160px] rounded-2xl bg-[var(--wb-surface-raised)] p-1 backdrop-blur-xl"
          >
            {models.map((model) => (
              <li key={model.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={model.id === current?.id}
                  onClick={() => {
                    onSelect(model.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors",
                    model.id === current?.id
                      ? "bg-[var(--wb-hover-strong)] text-foreground"
                      : "text-muted-foreground hover:bg-[var(--wb-hover)] hover:text-foreground",
                  )}
                >
                  {model.label}
                  {model.id === current?.id ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ToolbarIconButton({
  "aria-label": ariaLabel,
  onClick,
  children,
}: {
  "aria-label": string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.92, transition: SPRING_PRESS }}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--wb-hover)] hover:text-foreground"
    >
      {children}
    </motion.button>
  );
}

/** Icon-only when off; springs open into a filled "Search" pill when on. */
function WebSearchToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.button
      type="button"
      layout={!reduce}
      aria-pressed={on}
      aria-label={on ? "Turn off web search" : "Turn on web search"}
      onClick={onToggle}
      transition={reduce ? { duration: 0.15, ease: EASE_OUT } : { layout: SPRING_LAYOUT }}
      whileTap={reduce ? undefined : { scale: 0.96, transition: SPRING_PRESS }}
      className={cn(
        "flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-full px-2 font-medium text-[13px] transition-colors",
        on
          ? "bg-[var(--wb-accent)] text-[var(--wb-accent-fg)]"
          : "w-7 px-0 text-muted-foreground hover:bg-[var(--wb-hover)]",
      )}
    >
      <Globe className="h-4 w-4 shrink-0" aria-hidden />
      {on ? "Search" : null}
    </motion.button>
  );
}

/** Morphs between a circular send arrow and a stop square — icon swap via SPRING_SWAP, per spec. */
function SendStopButton({
  streaming,
  canSubmit,
  onSend,
  onStop,
}: {
  streaming: boolean;
  canSubmit: boolean;
  onSend: () => void;
  onStop: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <button
      type="button"
      onClick={streaming ? onStop : onSend}
      disabled={!streaming && !canSubmit}
      aria-label={streaming ? "Stop generating" : "Send message"}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:pointer-events-none disabled:opacity-40"
    >
      <AnimatePresence mode="wait" initial={false}>
        {streaming ? (
          <motion.span
            key="stop"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            transition={reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_SWAP}
            className="flex items-center justify-center"
          >
            <Square className="h-3 w-3" fill="currentColor" aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="send"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            transition={reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_SWAP}
            className="flex items-center justify-center"
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/**
 * Compact single-line AI prompt bar — the lightweight sibling to
 * `agent-composer`'s full workbench input. Shares its glass-surface toolbar
 * language (hairline shadow trio, pill controls, send/stop morph) but adds
 * two moves of its own: typing "/" opens a skill picker whose pick
 * "solidifies" into a removable chip, and submitting again while a reply is
 * still streaming queues the message instead of sending it — queued rows can
 * be steered in immediately, edited back into the draft, or dropped.
 */
export function PromptBar({
  skills = [],
  models = [],
  defaultModelId,
  credits,
  onUpgrade,
  placeholder = "What do you want to do today?",
  onSubmit,
  className,
}: PromptBarProps) {
  const reduce = useReducedMotion() ?? false;
  const skillListId = useId();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerShellRef = useRef<HTMLDivElement>(null);
  const streamTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idSeqRef = useRef(0);
  const attachSeqRef = useRef(0);

  const [text, setText] = useState("");
  const [skillId, setSkillId] = useState<string | undefined>(undefined);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [webSearch, setWebSearch] = useState(false);
  const [modelId, setModelId] = useState(defaultModelId ?? models[0]?.id ?? "");
  const [queue, setQueue] = useState<PromptBarQueuedMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(credits ?? 0);
  const [creditsDismissed, setCreditsDismissed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [skillHighlight, setSkillHighlight] = useState(0);

  const makeId = useCallback((prefix: string) => {
    idSeqRef.current += 1;
    return `${prefix}-${idSeqRef.current}`;
  }, []);

  // Auto-resize up to ~5 lines; the wrapper (max-h + overflow-y-auto) clips/scrolls past that.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `text` is the trigger — height depends on rendered content read from the DOM, not from the value itself.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const beginStream = useCallback(
    (messageText: string, opts?: { skillId?: string; attachments?: string[] }) => {
      onSubmit?.({
        text: messageText,
        skillId: opts?.skillId,
        attachments: opts?.attachments ?? [],
        webSearch,
        modelId,
      });
      setCreditsLeft((c) => Math.max(0, c - CREDIT_COST_PER_SEND));
      setStreaming(true);
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
      streamTimerRef.current = setTimeout(() => {
        streamTimerRef.current = null;
        setStreaming(false);
      }, STREAM_DEMO_MS);
    },
    [onSubmit, webSearch, modelId],
  );

  // Whenever a stream ends (timeout or manual stop), pop the next queued
  // message and fire it — closes the demo loop described in the spec.
  useEffect(() => {
    if (streaming || queue.length === 0) return;
    const head = queue[0];
    setQueue((prev) => prev.slice(1));
    beginStream(head.text);
  }, [streaming, queue, beginStream]);

  // Clear any pending demo timer on unmount.
  useEffect(
    () => () => {
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    },
    [],
  );

  const handleStop = useCallback(() => {
    if (streamTimerRef.current) {
      clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setStreaming(false);
  }, []);

  const canSubmit = text.trim().length > 0 || attachments.length > 0;

  const handleComposerSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0 && attachments.length === 0) return;
    if (streaming) {
      const queuedText = trimmed.length > 0 ? trimmed : attachments.map((a) => a.name).join(", ");
      setQueue((prev) => [...prev, { id: makeId("queued"), text: queuedText }]);
    } else {
      beginStream(trimmed, { skillId, attachments: attachments.map((a) => a.name) });
    }
    setText("");
    setSkillId(undefined);
    setAttachments([]);
  };

  const handleSteer = (item: PromptBarQueuedMessage) => {
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
    if (streamTimerRef.current) {
      clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    beginStream(item.text);
  };

  const handleEditQueued = (item: PromptBarQueuedMessage) => {
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
    setText(item.text);
    textareaRef.current?.focus();
  };

  const handleDeleteQueued = (item: PromptBarQueuedMessage) => {
    setQueue((prev) => prev.filter((q) => q.id !== item.id));
  };

  const activeSkill = skills.find((s) => s.id === skillId);

  const slashMatch = !skillId && skills.length > 0 ? text.match(/^\/(\S*)/) : null;
  const slashQuery = slashMatch ? slashMatch[1] : null;
  const filteredSkills = slashQuery !== null ? skills.filter((s) => matchesSkillQuery(s, slashQuery)) : [];
  const skillPanelOpen = slashQuery !== null && !dismissed && filteredSkills.length > 0;
  const clampedHighlight = Math.min(skillHighlight, Math.max(filteredSkills.length - 1, 0));
  const highlightedSkill = skillPanelOpen ? filteredSkills[clampedHighlight] : undefined;
  const activeOptionId = highlightedSkill ? `${skillListId}-${highlightedSkill.id}` : undefined;

  const selectSkill = (skill: PromptBarSkill) => {
    const match = text.match(/^\/(\S*)/);
    const rest = match ? text.slice(match[0].length).replace(/^\s+/, "") : text;
    setText(rest);
    setSkillId(skill.id);
    setDismissed(false);
    textareaRef.current?.focus();
  };

  const removeSkillChip = () => {
    setSkillId(undefined);
    textareaRef.current?.focus();
  };

  const addDemoAttachment = () => {
    const name = DEMO_FILE_NAMES[attachSeqRef.current % DEMO_FILE_NAMES.length];
    attachSeqRef.current += 1;
    setAttachments((prev) => [...prev, { id: makeId("att"), name }]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Close the skill panel on outside pointerdown, matching the popover
  // dismissal convention used across the composer family.
  useEffect(() => {
    if (!skillPanelOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (composerShellRef.current && !composerShellRef.current.contains(event.target as Node)) {
        setDismissed(true);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [skillPanelOpen]);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    setDismissed(false);
    setSkillHighlight(0);
  };

  const handleTextKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (skillPanelOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSkillHighlight((i) => (Math.min(i, filteredSkills.length - 1) + 1) % filteredSkills.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSkillHighlight((i) => {
          const clamped = Math.min(i, filteredSkills.length - 1);
          return (clamped - 1 + filteredSkills.length) % filteredSkills.length;
        });
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setDismissed(true);
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (highlightedSkill) selectSkill(highlightedSkill);
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleComposerSubmit();
    }
  };

  const effectivePlaceholder = activeSkill ? (activeSkill.hint ?? activeSkill.label) : placeholder;
  const showCreditsBanner = credits !== undefined && !creditsDismissed;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <AnimatePresence initial={false}>
        {showCreditsBanner ? (
          <CreditsBanner credits={creditsLeft} onUpgrade={onUpgrade} onDismiss={() => setCreditsDismissed(true)} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {queue.map((item) => (
          <QueuedRow
            key={item.id}
            item={item}
            onSteer={() => handleSteer(item)}
            onEdit={() => handleEditQueued(item)}
            onDelete={() => handleDeleteQueued(item)}
          />
        ))}
      </AnimatePresence>

      <motion.div layout={!reduce} ref={composerShellRef} className="relative">
        <AnimatePresence>
          {skillPanelOpen ? (
            <SkillPanel
              listId={skillListId}
              items={filteredSkills}
              highlightIndex={clampedHighlight}
              onSelect={selectSkill}
            />
          ) : null}
        </AnimatePresence>

        <div
          style={{ boxShadow: HAIRLINE_SHADOW }}
          className="relative flex flex-col rounded-[20px] bg-[var(--wb-surface-composer)] backdrop-blur-lg"
        >
          {attachments.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 px-3.5 pt-3">
              <AnimatePresence initial={false}>
                {attachments.map((a) => (
                  <AttachmentChip key={a.id} name={a.name} onRemove={() => removeAttachment(a.id)} />
                ))}
              </AnimatePresence>
            </div>
          ) : null}

          <div className="flex items-start gap-1.5 px-3.5 pt-2.5 pb-1">
            <AnimatePresence initial={false}>
              {activeSkill ? (
                <SkillChip key={activeSkill.id} skill={activeSkill} onRemove={removeSkillChip} />
              ) : null}
            </AnimatePresence>
            <div className="max-h-[124px] min-h-[24px] flex-1 overflow-y-auto">
              <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleTextKeyDown}
                placeholder={effectivePlaceholder}
                aria-label="Prompt"
                role="combobox"
                aria-expanded={skillPanelOpen}
                aria-controls={skillListId}
                aria-activedescendant={activeOptionId}
                aria-autocomplete="list"
                autoComplete="off"
                className="min-h-[24px] w-full resize-none border-none bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 pt-1 pb-1.5">
            <ToolbarIconButton aria-label="Add attachment" onClick={addDemoAttachment}>
              <Paperclip className="h-4 w-4" aria-hidden />
            </ToolbarIconButton>
            <ToolbarIconButton aria-label="Dictate">
              <Mic className="h-4 w-4" aria-hidden />
            </ToolbarIconButton>
            <WebSearchToggle on={webSearch} onToggle={() => setWebSearch((v) => !v)} />
            <div className="ml-auto flex items-center gap-1">
              {models.length > 0 ? <ModelMenu models={models} modelId={modelId} onSelect={setModelId} /> : null}
              <SendStopButton
                streaming={streaming}
                canSubmit={canSubmit}
                onSend={handleComposerSubmit}
                onStop={handleStop}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
