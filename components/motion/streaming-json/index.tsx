"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

/**
 * Token kinds produced by the tokenizer. `literal` covers `true` / `false` /
 * `null` — and any bare run of letters seen while a value is still
 * streaming in (e.g. a partial `tru`) — since they all share one color.
 */
type JsonTokenType = "key" | "string" | "number" | "literal" | "punct";

interface JsonToken {
  type: JsonTokenType;
  text: string;
  /** Character offsets into the source text — used to split a token across the stable/fresh boundary while streaming. */
  start: number;
  end: number;
}

const WHITESPACE = /\s/;
const DIGIT = /[0-9]/;
const WORD_CHAR = /[a-zA-Z_]/;

/**
 * Hand-rolled tokenizer for (possibly incomplete) JSON text. Deliberately
 * not `JSON.parse`-based — partial JSON throws, and re-parsing the whole
 * document on every chunk would also throw away exactly the incremental
 * info this component needs. Scans once, left to right, never backtracks
 * past a token boundary, so it stays cheap to re-run on every streamed
 * chunk.
 *
 * Key vs. string is the one genuinely ambiguous call. Correctly telling
 * "this string is an object member's key" apart from "this string is a
 * value" needs real structural context — a bracket-depth stack plus
 * "are we before the first colon of this member" tracking. Instead this
 * uses a simpler, good-enough rule: a string token is a "key" if the first
 * non-whitespace character after its closing quote is `:`. That rule is
 * wrong only for a string *value* immediately followed by a colon, which
 * essentially never happens in real tool-call / tool-result JSON — a
 * deliberate simplicity-over-completeness trade-off.
 */
function tokenizeJson(input: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  const n = input.length;
  let i = 0;

  const pushPunct = (text: string, start: number, end: number) => {
    const last = tokens.at(-1);
    if (last?.type === "punct" && last.end === start) {
      last.text += text;
      last.end = end;
    } else {
      tokens.push({ type: "punct", text, start, end });
    }
  };

  while (i < n) {
    const ch = input[i];

    if (ch === '"') {
      const start = i;
      let j = i + 1;
      let closed = false;
      while (j < n) {
        const c = input[j];
        if (c === "\\") {
          // Skip the escaped character too, so an escaped quote (`\"`)
          // never looks like the closing quote. If this runs past the end
          // of a still-streaming string, the loop below simply stops.
          j += 2;
          continue;
        }
        if (c === '"') {
          j += 1;
          closed = true;
          break;
        }
        j += 1;
      }
      const end = Math.min(j, n);
      let k = end;
      while (k < n && WHITESPACE.test(input[k])) k += 1;
      const isKey = closed && input[k] === ":";
      tokens.push({
        type: isKey ? "key" : "string",
        text: input.slice(start, end),
        start,
        end,
      });
      i = end;
      continue;
    }

    if (ch === "-" || DIGIT.test(ch)) {
      const start = i;
      let j = i;
      if (input[j] === "-") j += 1;
      while (j < n && DIGIT.test(input[j])) j += 1;
      if (input[j] === ".") {
        j += 1;
        while (j < n && DIGIT.test(input[j])) j += 1;
      }
      if (input[j] === "e" || input[j] === "E") {
        j += 1;
        if (input[j] === "+" || input[j] === "-") j += 1;
        while (j < n && DIGIT.test(input[j])) j += 1;
      }
      // A lone trailing "-" (the number hasn't streamed in yet) still gets
      // colored as a number rather than falling through uncounted.
      if (j === start) j = start + 1;
      tokens.push({ type: "number", text: input.slice(start, j), start, end: j });
      i = j;
      continue;
    }

    if (WORD_CHAR.test(ch)) {
      const start = i;
      let j = i;
      while (j < n && WORD_CHAR.test(input[j])) j += 1;
      tokens.push({ type: "literal", text: input.slice(start, j), start, end: j });
      i = j;
      continue;
    }

    // Structural punctuation and whitespace both fall here; merging
    // consecutive characters keeps the token count down and doesn't cost
    // anything visually since both render in the same muted color.
    pushPunct(ch, i, i + 1);
    i += 1;
  }

  return tokens;
}

const TOKEN_CLASS: Record<JsonTokenType, string> = {
  key: "text-[#e25507] dark:text-[#ff8549]",
  string: "text-emerald-600 dark:text-[#40C977]",
  number: "text-[#339CFF]",
  literal: "text-violet-500 dark:text-violet-400",
  punct: "text-muted-foreground",
};

function renderTokens(tokens: JsonToken[], keyPrefix: string) {
  // Keyed by the token's start offset (unique and stable within a given
  // text — a split token's two halves get distinct starts too) rather than
  // array index, since index would misattribute state across renders as
  // tokens are inserted ahead of it while streaming.
  return tokens.map((token) => (
    <span key={`${keyPrefix}-${token.start}`} className={TOKEN_CLASS[token.type]}>
      {token.text}
    </span>
  ));
}

/**
 * Splits a token list at a character `offset`, cutting the one token that
 * straddles the boundary in two so both halves keep the original type
 * (and thus color). Used to separate the stable, already-rendered prefix
 * from the newly-arrived tail.
 */
function splitTokens(tokens: JsonToken[], offset: number): [JsonToken[], JsonToken[]] {
  const before: JsonToken[] = [];
  const after: JsonToken[] = [];

  for (const token of tokens) {
    if (token.end <= offset) {
      before.push(token);
    } else if (token.start >= offset) {
      after.push(token);
    } else {
      const cut = offset - token.start;
      before.push({ ...token, text: token.text.slice(0, cut), end: offset });
      after.push({ ...token, text: token.text.slice(cut), start: offset });
    }
  }

  return [before, after];
}

/**
 * Small breathing block cursor for in-progress streams. Reimplemented
 * locally rather than imported from `agent-thread` — this block stays
 * self-contained with no cross-component dependency, same reasoning as
 * `ThreadThinking`'s independent header in that module.
 */
function StreamCaret({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const base = "inline-block h-3.5 w-[7px] translate-y-[2px] rounded-[2px] bg-foreground/70";

  if (reduce) {
    return <span aria-hidden className={cn(base, "opacity-50", className)} />;
  }

  return (
    <motion.span
      aria-hidden
      className={cn(base, className)}
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export interface StreamingJsonProps {
  /** The (possibly incomplete) JSON text to render, colorized as it grows. */
  text: string;
  /** Appends a breathing block cursor at the tail while true. */
  streaming?: boolean;
  /** Drops the rounded background/padding shell for inline embedding, e.g. inside `StreamingFunctionCall`. */
  bare?: boolean;
  className?: string;
}

/**
 * Fault-tolerant syntax-colored renderer for streaming JSON — tool inputs
 * and structured outputs that arrive as a growing, possibly-unclosed
 * string. Colors keys, strings, numbers and booleans/null as they appear,
 * without ever calling `JSON.parse` (which throws on partial JSON).
 *
 * Only the newly-appended tail re-animates in: a ref remembers the text
 * from the previous render, the stable prefix renders as plain colored
 * spans, and just the new suffix is wrapped in a `motion.span` that fades
 * in — so a long, already-settled block never reflows or re-flashes as
 * more text streams in behind it. Under `useReducedMotion()` the fade is
 * skipped entirely and the full text renders immediately.
 */
export function StreamingJson({ text, streaming = false, bare = false, className }: StreamingJsonProps) {
  const reduce = useReducedMotion() ?? false;
  const prevTextRef = useRef("");

  const tokens = tokenizeJson(text);

  // Track the previous render's text so only the newly-appended tail
  // animates. If `text` isn't a continuation of the previous value (e.g. a
  // caller resets it), treat the whole thing as fresh rather than diffing
  // unrelated content.
  const prevText = prevTextRef.current;
  const prefixLen = text.startsWith(prevText) ? prevText.length : 0;
  prevTextRef.current = text;

  const [stable, fresh] = reduce ? [tokens, []] : splitTokens(tokens, prefixLen);

  const content = (
    <>
      {renderTokens(stable, "s")}
      {fresh.length > 0 ? (
        <motion.span
          key={text.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
        >
          {renderTokens(fresh, "f")}
        </motion.span>
      ) : null}
      {streaming ? <StreamCaret className="ml-0.5" /> : null}
    </>
  );

  if (bare) {
    return <code className={cn("whitespace-pre-wrap break-words align-baseline", className)}>{content}</code>;
  }

  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl bg-black/[0.04] p-3 font-mono text-[13px] leading-[20px] whitespace-pre dark:bg-white/5",
        className,
      )}
    >
      <code>{content}</code>
    </pre>
  );
}

export interface StreamingFunctionCallProps {
  /** Function / tool name shown before the argument list, e.g. `"web_search"`. */
  name: string;
  /** The (possibly incomplete) JSON argument text, rendered via `StreamingJson`'s bare variant. */
  text: string;
  streaming?: boolean;
  className?: string;
}

/**
 * Streaming tool/function-call row — `name(` then its arguments fading in
 * through `StreamingJson`, matching how tool-call deltas actually arrive:
 * the name first, then the argument JSON key by key. The caller drives
 * completeness through `streaming` alone; this component never tries to
 * detect a balanced closing brace itself, so the trailing `)` only renders
 * once `streaming` is false — showing it mid-stream would misleadingly
 * suggest the call had already finished.
 */
export function StreamingFunctionCall({
  name,
  text,
  streaming = false,
  className,
}: StreamingFunctionCallProps) {
  return (
    <div className={cn("font-mono text-[13px]", className)}>
      <span className="font-medium text-foreground">{name}</span>
      <span className="text-muted-foreground">(</span>
      <StreamingJson text={text} streaming={streaming} bare />
      {!streaming ? <span className="text-muted-foreground">)</span> : null}
    </div>
  );
}
