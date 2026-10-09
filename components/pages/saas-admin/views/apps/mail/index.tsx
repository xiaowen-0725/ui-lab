"use client";

import { ArrowLeft, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { APP_FOCUS, enterTransition, textFor, useQuietMotion } from "../surface";
import {
	FOLDER_IDS,
	type FolderId,
	THREADS,
	type Thread,
	threadMatches,
	threadsForFolder,
} from "./data";

const FOLDER_KEY: Record<FolderId, string> = {
	inbox: "Inbox",
	starred: "Starred",
	sent: "Sent",
	archive: "Archive",
};

export function MailApp() {
	const { locale, t } = useSaasAdmin();
	const quiet = useQuietMotion();
	const [threads, setThreads] = useState<Thread[]>(() =>
		THREADS.map((thread) => ({
			...thread,
			messages: thread.messages.map((message) => ({ ...message })),
		})),
	);
	const [folder, setFolder] = useState<FolderId>("inbox");
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(
		THREADS[0]?.id ?? null,
	);
	const [composing, setComposing] = useState(false);
	const [draft, setDraft] = useState({ to: "", subject: "", body: "" });
	const [error, setError] = useState("");
	const [draftCount, setDraftCount] = useState(1);
	const listSection = useRef<HTMLElement | null>(null);
	const readingTitle = useRef<HTMLHeadingElement | null>(null);
	const composeTo = useRef<HTMLInputElement | null>(null);
	const pendingFocus = useRef<"list" | "thread" | "compose" | null>(null);

	const visible = useMemo(
		() =>
			threadsForFolder(threads, folder).filter((thread) =>
				threadMatches(thread, query),
			),
		[threads, folder, query],
	);
	const selected = threads.find((thread) => thread.id === selectedId) ?? null;

	useEffect(() => {
		const next = pendingFocus.current;
		pendingFocus.current = null;
		if (next === "thread") readingTitle.current?.focus();
		if (next === "list") listSection.current?.focus();
		if (next === "compose") composeTo.current?.focus();
	}, [selectedId, composing]);

	function openThread(id: string) {
		setComposing(false);
		setSelectedId(id);
		setThreads((current) =>
			current.map((thread) =>
				thread.id === id ? { ...thread, unread: false } : thread,
			),
		);
		pendingFocus.current = "thread";
	}

	function backToList() {
		setComposing(false);
		setSelectedId(null);
		pendingFocus.current = "list";
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
			setError(t("Enter a valid recipient, subject, and message."));
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
		<div className="flex min-h-[36rem] flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
			<header className="flex shrink-0 flex-col gap-3 border-b px-4 py-4 md:flex-row md:items-center md:justify-between">
				<p className="text-sm text-muted-foreground">
					<SaasAdminText>
						Read threads by folder. A sent letter stays in this visit.
					</SaasAdminText>
				</p>
				<div className="flex items-center gap-2">
					<Input
						type="search"
						value={query}
						placeholder={t("Search mail")}
						aria-label={t("Search mail")}
						className="min-w-0 flex-1 md:max-w-xs"
						onChange={(event) => setQuery(event.target.value)}
					/>
					<Button
						size="sm"
						onClick={() => {
							setComposing(true);
							setError("");
							pendingFocus.current = "compose";
						}}
					>
						<SaasAdminText>New message</SaasAdminText>
					</Button>
				</div>
			</header>
			<div className="grid min-h-0 flex-1 md:grid-cols-[minmax(16rem,22rem)_1fr] xl:grid-cols-[11rem_minmax(16rem,22rem)_1fr]">
				<nav
					aria-label={t("Folders")}
					className="hidden flex-col gap-1 border-r p-3 xl:flex"
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
									APP_FOCUS,
									current
										? "bg-muted font-medium text-foreground"
										: "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
								)}
							>
								<SaasAdminText>{FOLDER_KEY[id]}</SaasAdminText>
								<span className="tabular-nums text-xs">{count}</span>
							</button>
						);
					})}
				</nav>
				<section
					ref={listSection}
					tabIndex={-1}
					aria-label={t("Thread list")}
					className={cn(
						"min-h-0 flex-col border-r outline-none",
						selected || composing ? "hidden md:flex" : "flex",
					)}
				>
					<div className="flex gap-1 overflow-x-auto border-b p-2 xl:hidden">
						{FOLDER_IDS.map((id) => (
							<button
								key={id}
								type="button"
								aria-pressed={folder === id}
								onClick={() => setFolder(id)}
								className={cn(
									"shrink-0 rounded-full px-3 py-1 text-xs transition-colors motion-reduce:transition-none",
									APP_FOCUS,
									folder === id
										? "bg-foreground text-background"
										: "bg-muted text-muted-foreground",
								)}
							>
								<SaasAdminText>{FOLDER_KEY[id]}</SaasAdminText>
							</button>
						))}
					</div>
					<div className="min-h-0 flex-1 overflow-y-auto">
						{visible.length === 0 ? (
							<p className="px-4 py-16 text-center text-sm text-muted-foreground">
								<SaasAdminText>No matching results</SaasAdminText>
							</p>
						) : (
							<ul>
								{visible.map((thread) => {
									const latest = thread.messages[thread.messages.length - 1];
									const current = thread.id === selectedId && !composing;
									if (!latest) return null;
									return (
										<li key={thread.id} className="border-b">
											<button
												type="button"
												onClick={() => openThread(thread.id)}
												aria-current={current ? "true" : undefined}
												className={cn(
													"flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 motion-reduce:transition-none",
													APP_FOCUS,
													current && "bg-muted",
												)}
											>
												<Initials
													name={textFor(locale, latest.author, latest.authorZh)}
												/>
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
				<section
					aria-label={t("Reading pane")}
					className={cn(
						"min-h-0 flex-col",
						selected || composing ? "flex" : "hidden md:flex",
					)}
				>
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
								<div className="flex items-center gap-2 border-b px-4 py-3">
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="md:hidden"
										aria-label={t("Back to list")}
										onClick={backToList}
									>
										<ArrowLeft aria-hidden="true" />
									</Button>
									<h2 className="text-sm font-medium">
										<SaasAdminText>New message</SaasAdminText>
									</h2>
								</div>
								<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 md:p-6">
									<div className="grid gap-1 text-xs text-muted-foreground">
										<label htmlFor="saas-admin-mail-to">
											<SaasAdminText>To</SaasAdminText>
										</label>
										<Input
											id="saas-admin-mail-to"
											ref={composeTo}
											type="email"
											value={draft.to}
											onChange={(event) =>
												setDraft({ ...draft, to: event.target.value })
											}
										/>
									</div>
									<div className="grid gap-1 text-xs text-muted-foreground">
										<label htmlFor="saas-admin-mail-subject">
											<SaasAdminText>Subject</SaasAdminText>
										</label>
										<Input
											id="saas-admin-mail-subject"
											value={draft.subject}
											onChange={(event) =>
												setDraft({ ...draft, subject: event.target.value })
											}
										/>
									</div>
									<div className="grid min-h-40 flex-1 gap-1 text-xs text-muted-foreground">
										<label htmlFor="saas-admin-mail-body">
											<SaasAdminText>Message body</SaasAdminText>
										</label>
										<Textarea
											id="saas-admin-mail-body"
											value={draft.body}
											onChange={(event) =>
												setDraft({ ...draft, body: event.target.value })
											}
											className="min-h-40 flex-1"
										/>
									</div>
									{error ? (
										<p role="alert" className="text-sm text-destructive">
											{error}
										</p>
									) : (
										<p className="text-xs text-muted-foreground">
											<SaasAdminText>
												Sending stays in this visit.
											</SaasAdminText>
										</p>
									)}
									<div className="flex gap-2">
										<Button size="sm" type="submit">
											<SaasAdminText>File in Sent</SaasAdminText>
										</Button>
										<Button
											size="sm"
											variant="ghost"
											type="button"
											onClick={() => {
												setComposing(false);
												setError("");
											}}
										>
											<SaasAdminText>Discard</SaasAdminText>
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
								<header className="flex items-start gap-2 border-b px-4 py-3 md:px-6">
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="md:hidden"
										aria-label={t("Back to list")}
										onClick={backToList}
									>
										<ArrowLeft aria-hidden="true" />
									</Button>
									<div className="min-w-0 flex-1">
										<h2
											ref={readingTitle}
											tabIndex={-1}
											className="text-base leading-snug font-semibold outline-none"
										>
											{textFor(locale, selected.subject, selected.subjectZh)}
										</h2>
										<p className="mt-1 text-xs text-muted-foreground">
											{locale === "zh"
												? `${selected.messages.length} 封`
												: `${selected.messages.length} messages`}
										</p>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										aria-label={selected.starred ? t("Unstar") : t("Star")}
										onClick={() => toggleStar(selected.id)}
										className={selected.starred ? "text-foreground" : undefined}
									>
										<Star
											aria-hidden="true"
											className={cn("size-4", selected.starred && "fill-current")}
										/>
									</Button>
								</header>
								<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
									{selected.messages.map((message) => (
										<article
											key={message.id}
											className="rounded-xl bg-muted/40 p-4 ring-1 ring-foreground/10"
										>
											<header className="flex items-center gap-3">
												<Initials
													name={textFor(locale, message.author, message.authorZh)}
												/>
												<div className="min-w-0">
													<p className="truncate text-sm font-medium">
														{textFor(locale, message.author, message.authorZh)}
													</p>
													<p className="truncate text-xs text-muted-foreground">
														{message.email} ·{" "}
														{textFor(locale, message.at, message.atZh)}
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
								<p className="max-w-xs text-sm text-muted-foreground">
									<SaasAdminText>Select a thread to read.</SaasAdminText>
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</section>
			</div>
		</div>
	);
}

function Initials({ name }: { name: string }) {
	const initials = name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.slice(0, 1))
		.join("")
		.toUpperCase();
	return (
		<span
			aria-hidden="true"
			className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium"
		>
			{initials}
		</span>
	);
}
