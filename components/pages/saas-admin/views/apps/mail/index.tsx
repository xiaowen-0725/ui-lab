"use client";

import { ArrowLeft, Search, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { IconTip, PersonAvatar } from "../chrome";
import { enterTransition, textFor, useQuietMotion } from "../surface";
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

	const visible = useMemo(
		() =>
			threadsForFolder(threads, folder).filter((thread) =>
				threadMatches(thread, query),
			),
		[threads, folder, query],
	);
	const selected = threads.find((thread) => thread.id === selectedId) ?? null;

	function focusSoon(node: { current: HTMLElement | null }) {
		window.setTimeout(() => node.current?.focus(), 0);
	}

	function openThread(id: string) {
		setComposing(false);
		setSelectedId(id);
		setThreads((current) =>
			current.map((thread) =>
				thread.id === id ? { ...thread, unread: false } : thread,
			),
		);
		focusSoon(readingTitle);
	}

	function backToList() {
		setComposing(false);
		setSelectedId(null);
		focusSoon(listSection);
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
		<Card className="min-h-[36rem] gap-0 py-0">
			<header className="flex shrink-0 flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
				<p className="text-sm text-muted-foreground">
					<SaasAdminText>
						Read threads by folder. A sent letter stays in this visit.
					</SaasAdminText>
				</p>
				<div className="flex items-center gap-2">
					<InputGroup className="min-w-0 flex-1 md:max-w-xs">
						<InputGroupAddon>
							<Search aria-hidden="true" />
						</InputGroupAddon>
						<InputGroupInput
							type="search"
							value={query}
							placeholder={t("Search mail")}
							aria-label={t("Search mail")}
							onChange={(event) => setQuery(event.target.value)}
						/>
					</InputGroup>
					<Button
						size="sm"
						onClick={() => {
							setComposing(true);
							setError("");
							focusSoon(composeTo);
						}}
					>
						<SaasAdminText>New message</SaasAdminText>
					</Button>
				</div>
			</header>
			<Separator />
			<div className="grid min-h-0 flex-1 md:grid-cols-[minmax(16rem,22rem)_1fr] xl:grid-cols-[11rem_minmax(16rem,22rem)_1fr]">
				<nav
					aria-label={t("Folders")}
					className="hidden flex-col gap-1 border-r p-3 xl:flex"
				>
					<ToggleGroup
						value={[folder]}
						onValueChange={(values) => {
							if (values[0]) setFolder(values[0] as FolderId);
						}}
						orientation="vertical"
						spacing={1}
						className="w-full flex-col items-stretch"
					>
						{FOLDER_IDS.map((id) => (
							<ToggleGroupItem
								key={id}
								value={id}
								aria-current={folder === id ? "page" : undefined}
								className="h-auto w-full justify-between px-2.5 py-2"
							>
								<SaasAdminText>{FOLDER_KEY[id]}</SaasAdminText>
								<Badge variant="secondary" className="tabular-nums">
									{threadsForFolder(threads, id).length}
								</Badge>
							</ToggleGroupItem>
						))}
					</ToggleGroup>
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
					<div className="p-2 xl:hidden">
						<ToggleGroup
							value={[folder]}
							onValueChange={(values) => {
								if (values[0]) setFolder(values[0] as FolderId);
							}}
							spacing={1}
							className="w-full justify-start overflow-x-auto"
						>
							{FOLDER_IDS.map((id) => (
								<ToggleGroupItem
									key={id}
									value={id}
									size="sm"
									className="shrink-0"
								>
									<SaasAdminText>{FOLDER_KEY[id]}</SaasAdminText>
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>
					<Separator className="xl:hidden" />
					<ScrollArea className="min-h-0 flex-1">
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
										<li key={thread.id}>
											<Button
												type="button"
												variant="ghost"
												onClick={() => openThread(thread.id)}
												aria-current={current ? "true" : undefined}
												className={cn(
													"h-auto w-full items-start justify-start gap-3 whitespace-normal rounded-none border-b px-4 py-3 text-left",
													current && "bg-muted",
												)}
											>
												<PersonAvatar
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
															<Badge
																variant="default"
																className="size-2 p-0"
																aria-hidden="true"
															/>
														) : null}
													</span>
													<span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
														{textFor(locale, latest.author, latest.authorZh)} ·{" "}
														{textFor(locale, latest.at, latest.atZh)}
													</span>
													<span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
														{textFor(locale, latest.body, latest.bodyZh)}
													</span>
												</span>
											</Button>
										</li>
									);
								})}
							</ul>
						)}
					</ScrollArea>
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
								<div className="flex items-center gap-2 px-4 py-3">
									<IconTip
										label={t("Back to list")}
										trigger={
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												className="md:hidden"
												aria-label={t("Back to list")}
												onClick={backToList}
											/>
										}
									>
										<ArrowLeft aria-hidden="true" />
									</IconTip>
									<h2 className="text-sm font-medium">
										<SaasAdminText>New message</SaasAdminText>
									</h2>
								</div>
								<Separator />
								<ScrollArea className="min-h-0 flex-1">
								<div className="flex min-h-0 flex-1 flex-col gap-3 p-4 md:p-6">
									<Field>
										<FieldLabel htmlFor="saas-admin-mail-to">
											<SaasAdminText>To</SaasAdminText>
										</FieldLabel>
										<Input
											id="saas-admin-mail-to"
											ref={composeTo}
											type="email"
											value={draft.to}
											onChange={(event) =>
												setDraft({ ...draft, to: event.target.value })
											}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="saas-admin-mail-subject">
											<SaasAdminText>Subject</SaasAdminText>
										</FieldLabel>
										<Input
											id="saas-admin-mail-subject"
											value={draft.subject}
											onChange={(event) =>
												setDraft({ ...draft, subject: event.target.value })
											}
										/>
									</Field>
									<Field className="min-h-40 flex-1">
										<FieldLabel htmlFor="saas-admin-mail-body">
											<SaasAdminText>Message body</SaasAdminText>
										</FieldLabel>
										<Textarea
											id="saas-admin-mail-body"
											value={draft.body}
											onChange={(event) =>
												setDraft({ ...draft, body: event.target.value })
											}
											className="min-h-40 flex-1"
										/>
									</Field>
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
								</ScrollArea>
							</motion.form>
						) : selected ? (
							<motion.article
								key={selected.id}
								{...enterTransition(quiet)}
								className="flex h-full min-h-0 flex-col"
							>
								<header className="flex items-start gap-2 px-4 py-3 md:px-6">
									<IconTip
										label={t("Back to list")}
										trigger={
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												className="md:hidden"
												aria-label={t("Back to list")}
												onClick={backToList}
											/>
										}
									>
										<ArrowLeft aria-hidden="true" />
									</IconTip>
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
									<IconTip
										label={selected.starred ? t("Unstar") : t("Star")}
										trigger={
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												aria-label={selected.starred ? t("Unstar") : t("Star")}
												onClick={() => toggleStar(selected.id)}
												className={selected.starred ? "text-foreground" : undefined}
											/>
										}
									>
										<Star
											aria-hidden="true"
											className={cn("size-4", selected.starred && "fill-current")}
										/>
									</IconTip>
								</header>
								<Separator />
								<ScrollArea className="min-h-0 flex-1">
								<div className="space-y-4 p-4 md:p-6">
									{selected.messages.map((message) => (
										<Card
											key={message.id}
											size="sm"
											className="gap-3 bg-muted/40 py-4 shadow-none"
										>
											<CardHeader className="flex-row items-center gap-3">
												<PersonAvatar
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
											</CardHeader>
											<CardContent>
												<p className="text-sm leading-relaxed">
													{textFor(locale, message.body, message.bodyZh)}
												</p>
											</CardContent>
										</Card>
									))}
								</div>
								</ScrollArea>
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
		</Card>
	);
}
