"use client";

import { ArrowLeft, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/motion/button";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  Avatar,
  enterTransition,
  focusRing,
  IconButton,
  SearchField,
  textFor,
  useQuietMotion,
} from "../ui";
import {
  FOLDER_IDS,
  type FolderId,
  type Thread,
  THREADS,
  threadMatches,
  threadsForFolder,
} from "./model";

export function InboxApp() {
  const t = useTranslations("apps");
  const locale = useLocale() as Locale;
  const quiet = useQuietMotion();
  const [threads, setThreads] = useState<Thread[]>(() =>
    THREADS.map((thread) => ({ ...thread, messages: thread.messages.map((message) => ({ ...message })) })),
  );
  const [folder, setFolder] = useState<FolderId>("inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(THREADS[0]?.id ?? null);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({ to: "", subject: "", body: "" });
  const [error, setError] = useState("");
  const [draftCount, setDraftCount] = useState(1);

  const visible = useMemo(
    () => threadsForFolder(threads, folder).filter((thread) => threadMatches(thread, query)),
    [threads, folder, query],
  );
  const selected = threads.find((thread) => thread.id === selectedId) ?? null;

  function openThread(id: string) {
    setComposing(false);
    setSelectedId(id);
    setThreads((current) =>
      current.map((thread) => (thread.id === id ? { ...thread, unread: false } : thread)),
    );
  }

  function toggleStar(id: string) {
    setThreads((current) =>
      current.map((thread) =>
        thread.id === id ? { ...thread, starred: !thread.starred } : thread,
      ),
    );
  }

  function sendDraft() {
    const to = draft.to.trim();
    const subject = draft.subject.trim();
    const body = draft.body.trim();
    if (!to.includes("@") || !subject || !body) {
      setError(t("composeNeed"));
      return;
    }
    const id = `local-${draftCount}`;
    const at = locale === "zh" ? "刚刚" : "Just now";
    const next: Thread = {
      id,
      folder: "sent",
      starred: false,
      unread: false,
      subject,
      subjectZh: subject,
      messages: [
        {
          id: `${id}-1`,
          author: "Lin Zhixia",
          authorZh: "林知夏",
          email: "zhixia@northline.example",
          body,
          bodyZh: body,
          at,
          atZh: at,
        },
      ],
    };
    setThreads((current) => [next, ...current]);
    setDraftCount((count) => count + 1);
    setDraft({ to: "", subject: "", body: "" });
    setError("");
    setComposing(false);
    setFolder("sent");
    setSelectedId(id);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t("inboxTitle")}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("inboxDescription")}</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchField
            label={t("searchMail")}
            placeholder={t("searchMail")}
            value={query}
            onChange={setQuery}
          />
          <Button
            size="sm"
            className="rounded-lg"
            onClick={() => {
              setComposing(true);
              setError("");
            }}
          >
            {t("newMessage")}
          </Button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(16rem,22rem)_1fr] xl:grid-cols-[12rem_minmax(16rem,22rem)_1fr]">
        <nav
          aria-label={t("folders")}
          className="hidden flex-col gap-1 border-r border-border p-3 xl:flex"
        >
          {FOLDER_IDS.map((id) => {
            const count = threadsForFolder(threads, id).length;
            const current = folder === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => setFolder(id)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors motion-reduce:transition-none",
                  focusRing,
                  current
                    ? "bg-foreground/[0.06] font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                <span>{t(`foldersMap.${id}`)}</span>
                <span className="tabular-nums text-xs">{count}</span>
              </button>
            );
          })}
        </nav>
        <section
          aria-label={t("threadList")}
          className={cn(
            "min-h-0 flex-col border-r border-border",
            selected || composing ? "hidden md:flex" : "flex",
          )}
        >
          <div className="flex gap-1 overflow-x-auto border-b border-border p-2 xl:hidden">
            {FOLDER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={folder === id}
                onClick={() => setFolder(id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs transition-colors motion-reduce:transition-none",
                  focusRing,
                  folder === id
                    ? "bg-foreground text-background"
                    : "bg-foreground/[0.04] text-muted-foreground",
                )}
              >
                {t(`foldersMap.${id}`)}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <p className="px-4 py-16 text-center text-sm text-muted-foreground">{t("emptySearch")}</p>
            ) : (
              <ul>
                {visible.map((thread) => {
                  const latest = thread.messages[thread.messages.length - 1];
                  const current = thread.id === selectedId && !composing;
                  if (!latest) return null;
                  return (
                    <li key={thread.id} className="border-b border-border">
                      <button
                        type="button"
                        onClick={() => openThread(thread.id)}
                        aria-current={current ? "true" : undefined}
                        className={cn(
                          "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03] motion-reduce:transition-none",
                          focusRing,
                          current && "bg-foreground/[0.05]",
                        )}
                      >
                        <Avatar name={textFor(locale, latest.author, latest.authorZh)} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span
                              className={cn(
                                "truncate text-sm",
                                thread.unread ? "font-semibold" : "font-medium",
                              )}
                            >
                              {textFor(locale, thread.subject, thread.subjectZh)}
                            </span>
                            {thread.unread ? (
                              <span className="size-2 shrink-0 rounded-full bg-foreground" />
                            ) : null}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {textFor(locale, latest.author, latest.authorZh)} ·{" "}
                            {textFor(locale, latest.at, latest.atZh)}
                          </span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">
                            {textFor(locale, latest.body, latest.bodyZh)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
        <section aria-label={t("reading")} className={cn("min-h-0 flex-col", selected || composing ? "flex" : "hidden md:flex")}>
          <AnimatePresence mode="wait" initial={false}>
            {composing ? (
              <motion.form
                key="compose"
                {...enterTransition(quiet)}
                className="flex h-full min-h-0 flex-col"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendDraft();
                }}
              >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <IconButton label={t("backToList")} className="md:hidden" onClick={() => setComposing(false)}>
                    <ArrowLeft aria-hidden="true" className="size-4" />
                  </IconButton>
                  <h2 className="text-sm font-medium">{t("newMessage")}</h2>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 md:p-6">
                  <Field label={t("to")} value={draft.to} onChange={(to) => setDraft({ ...draft, to })} type="email" />
                  <Field label={t("subject")} value={draft.subject} onChange={(subject) => setDraft({ ...draft, subject })} />
                  <label className="grid min-h-40 flex-1 gap-1 text-xs text-muted-foreground">
                    {t("message")}
                    <textarea
                      value={draft.body}
                      onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                      className={cn(
                        "min-h-40 w-full flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
                        focusRing,
                      )}
                    />
                  </label>
                  {error ? (
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">{t("sentLocal")}</p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-lg" type="submit">
                      {t("send")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-lg"
                      type="button"
                      onClick={() => {
                        setComposing(false);
                        setError("");
                      }}
                    >
                      {t("discard")}
                    </Button>
                  </div>
                </div>
              </motion.form>
            ) : selected ? (
              <motion.article
                key={selected.id}
                {...enterTransition(quiet)}
                className="flex h-full min-h-0 flex-col"
              >
                <header className="flex items-start gap-2 border-b border-border px-4 py-3 md:px-6">
                  <IconButton
                    label={t("backToList")}
                    className="md:hidden"
                    onClick={() => setSelectedId(null)}
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                  </IconButton>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold leading-snug">
                      {textFor(locale, selected.subject, selected.subjectZh)}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("messageCount", { count: selected.messages.length })}
                    </p>
                  </div>
                  <IconButton
                    label={selected.starred ? t("unstar") : t("star")}
                    onClick={() => toggleStar(selected.id)}
                    className={selected.starred ? "text-foreground" : undefined}
                  >
                    <Star
                      aria-hidden="true"
                      className={cn("size-4", selected.starred && "fill-current")}
                    />
                  </IconButton>
                </header>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
                  {selected.messages.map((message) => (
                    <article key={message.id} className="rounded-2xl border border-border bg-card/40 p-4">
                      <header className="flex items-center gap-3">
                        <Avatar name={textFor(locale, message.author, message.authorZh)} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {textFor(locale, message.author, message.authorZh)}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {message.email} · {textFor(locale, message.at, message.atZh)}
                          </p>
                        </div>
                      </header>
                      <p className="mt-3 text-sm leading-relaxed">
                        {textFor(locale, message.body, message.bodyZh)}
                      </p>
                    </article>
                  ))}
                </div>
              </motion.article>
            ) : (
              <motion.div
                key="empty"
                {...enterTransition(quiet)}
                className="grid h-full place-items-center p-8 text-center"
              >
                <p className="max-w-xs text-sm text-muted-foreground">{t("noThread")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs text-muted-foreground">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground",
          focusRing,
        )}
      />
    </label>
  );
}
