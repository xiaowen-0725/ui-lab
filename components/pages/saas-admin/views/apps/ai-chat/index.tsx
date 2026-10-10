"use client";

import { ArrowLeft, Check, Copy, Paperclip, Pin, Plus, X } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { PromptInput } from "@/components/agents/prompt-input";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/agents/reasoning";
import { Suggestion, Suggestions } from "@/components/agents/suggestion";
import {
	Thread,
	ThreadCodeBlock,
	ThreadInlineCode,
	ThreadItem,
	ThreadMessage,
	ThreadUsage,
	ThreadUserMessage,
} from "@/components/motion/agent-thread";
import { SaasAdminText, useSaasAdmin } from "@/components/pages/saas-admin/environment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IconTip, PersonAvatar } from "../chrome";
import { textFor, useQuietMotion } from "../surface";
import {
	blocksToDisplay,
	CHAT_MODELS,
	type ChatBlock,
	type ChatConversation,
	type ChatModelId,
	type ChatTurn,
	CONVERSATIONS,
	conversationMatches,
	displayLength,
	replyForPrompt,
	SAMPLE_FILES,
	sliceBlocks,
	SUGGESTED_PROMPTS,
} from "./data";

const WB_BRIDGE = {
	"--wb-inset": "var(--muted)",
	"--wb-surface-composer": "var(--card)",
	"--wb-code-inline": "color-mix(in oklab, var(--foreground) 8%, var(--background))",
	"--wb-code-block": "var(--muted)",
	"--wb-hover": "var(--accent)",
	"--wb-hairline-soft": "var(--border)",
	"--wb-danger": "var(--destructive)",
} as CSSProperties;

export function AiChatApp() {
	const { locale, t } = useSaasAdmin();
	const quiet = useQuietMotion();
	const [chats, setChats] = useState<ChatConversation[]>(() =>
		CONVERSATIONS.map((chat) => ({
			...chat,
			turns: chat.turns.map((turn) => ({ ...turn, blocks: turn.blocks })),
		})),
	);
	const [selectedId, setSelectedId] = useState<string | null>(
		CONVERSATIONS[0]?.id ?? null,
	);
	const [pane, setPane] = useState<"list" | "thread">("thread");
	const [query, setQuery] = useState("");
	const [draft, setDraft] = useState("");
	const [model, setModel] = useState<ChatModelId>("pulse");
	const [attachments, setAttachments] = useState<string[]>([]);
	const [streamingId, setStreamingId] = useState<string | null>(null);
	const [streamedChars, setStreamedChars] = useState(0);
	const [nextId, setNextId] = useState(1);
	const timer = useRef<number | null>(null);
	const threadEnd = useRef<HTMLDivElement | null>(null);
	const threadTitle = useRef<HTMLHeadingElement | null>(null);

	useEffect(() => {
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, []);

	const visible = useMemo(
		() =>
			chats
				.filter((chat) => conversationMatches(chat, query))
				.slice()
				.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
		[chats, query],
	);
	const selected = chats.find((chat) => chat.id === selectedId) ?? null;

	function stopStream() {
		if (timer.current) window.clearTimeout(timer.current);
		timer.current = null;
		setStreamingId(null);
	}

	function openChat(id: string) {
		stopStream();
		setSelectedId(id);
		setPane("thread");
		const chat = chats.find((item) => item.id === id);
		if (chat) setModel(chat.model);
		window.setTimeout(() => threadTitle.current?.focus(), 0);
	}

	function startNew() {
		stopStream();
		setSelectedId(null);
		setDraft("");
		setAttachments([]);
		setPane("thread");
		window.setTimeout(() => threadTitle.current?.focus(), 0);
	}

	function attachSample() {
		const next = SAMPLE_FILES.find((file) => !attachments.includes(file.name));
		if (next) setAttachments((current) => [...current, next.name]);
	}

	function streamReply(turnId: string, totalChars: number) {
		if (quiet) {
			setStreamedChars(totalChars);
			setStreamingId(null);
			return;
		}
		setStreamedChars(0);
		setStreamingId(turnId);
		let index = 0;
		const step = () => {
			index = Math.min(
				totalChars,
				index + Math.max(2, Math.round(totalChars / 36)),
			);
			setStreamedChars(index);
			threadEnd.current?.scrollIntoView({ block: "end" });
			if (index < totalChars) {
				timer.current = window.setTimeout(step, 22);
			} else {
				timer.current = null;
				setStreamingId(null);
			}
		};
		step();
	}

	function send(prompt: string, nextModel?: string) {
		const text = prompt.trim();
		if (!text || streamingId) return;
		const chosen = (nextModel as ChatModelId) || model;
		const reply = replyForPrompt(text);
		const userId = `user-${nextId}`;
		const assistantId = `assistant-${nextId}`;
		setNextId((value) => value + 1);
		const userTurn: ChatTurn = {
			id: userId,
			role: "user",
			text: attachments.length
				? `${text}\n\n(${attachments.join(", ")})`
				: text,
			textZh: attachments.length
				? `${text}\n\n（${attachments.join(", ")}）`
				: text,
		};
		const assistantTurn: ChatTurn = {
			id: assistantId,
			role: "assistant",
			...reply,
		};
		const totalChars = reply.blocks?.length
			? displayLength(reply.blocks, locale)
			: textFor(locale, reply.text, reply.textZh).length;

		if (!selected) {
			const chatId = `local-${nextId}`;
			const created: ChatConversation = {
				id: chatId,
				title: text.slice(0, 32),
				titleZh: text.slice(0, 32),
				preview: textFor(locale, reply.text, reply.textZh),
				previewZh: textFor(locale, reply.text, reply.textZh),
				updated: locale === "zh" ? "刚刚" : "Just now",
				updatedZh: locale === "zh" ? "刚刚" : "Just now",
				model: chosen,
				turns: [userTurn, assistantTurn],
			};
			setChats((current) => [created, ...current]);
			setSelectedId(chatId);
			streamReply(assistantId, totalChars);
		} else {
			setChats((current) =>
				current.map((chat) =>
					chat.id === selected.id
						? {
								...chat,
								model: chosen,
								turns: [...chat.turns, userTurn, assistantTurn],
								preview: textFor(locale, reply.text, reply.textZh),
								previewZh: textFor(locale, reply.text, reply.textZh),
							}
						: chat,
				),
			);
			streamReply(assistantId, totalChars);
		}
		setDraft("");
		setAttachments([]);
	}

	return (
		<Card
			className="min-h-[38rem] w-full min-w-0 max-w-full flex-row gap-0 overflow-x-hidden py-0"
			style={WB_BRIDGE}
		>
			<section
				aria-label={t("Conversations")}
				className={cn(
					"w-full min-h-[38rem] flex-col border-r md:flex md:w-72 md:shrink-0",
					pane === "list" ? "flex" : "hidden",
				)}
			>
				<div className="flex items-center gap-2 p-3">
					<Input
						type="search"
						value={query}
						placeholder={t("Search conversations")}
						aria-label={t("Search conversations")}
						className="min-w-0 flex-1"
						onChange={(event) => setQuery(event.target.value)}
					/>
					<IconTip
						label={t("New chat")}
						trigger={
							<Button
								type="button"
								size="icon-sm"
								aria-label={t("New chat")}
								onClick={startNew}
							/>
						}
					>
						<Plus aria-hidden="true" />
					</IconTip>
				</div>
				<Separator />
				<ScrollArea className="min-h-0 flex-1">
					<div className="p-2">
						{visible.length === 0 ? (
							<p className="px-2 py-10 text-center text-sm text-muted-foreground">
								<SaasAdminText>No matching results</SaasAdminText>
							</p>
						) : (
							<ul className="space-y-1">
								{visible.map((chat) => {
									const current = chat.id === selectedId;
									const title = textFor(locale, chat.title, chat.titleZh);
									return (
										<li key={chat.id}>
											<Button
												type="button"
												variant="ghost"
												aria-current={current ? "true" : undefined}
												onClick={() => openChat(chat.id)}
												className={cn(
													"h-auto w-full flex-col items-start gap-1 whitespace-normal px-3 py-2.5 text-left",
													current && "bg-muted",
												)}
											>
												<span className="flex w-full items-center gap-2">
													<PersonAvatar name={title} size="sm" />
													<span className="min-w-0 flex-1 truncate text-sm font-medium">
														{title}
													</span>
													{chat.pinned ? (
														<Pin
															aria-hidden="true"
															className="size-3 text-muted-foreground"
														/>
													) : null}
												</span>
												<span className="truncate text-xs font-normal text-muted-foreground">
													{textFor(locale, chat.preview, chat.previewZh)}
												</span>
												<span className="text-[11px] font-normal text-muted-foreground">
													{textFor(locale, chat.updated, chat.updatedZh)}
												</span>
											</Button>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</ScrollArea>
			</section>
			<section
				aria-label={t("AI Chat")}
				className={cn(
					"min-h-[38rem] min-w-0 flex-1 flex-col",
					pane === "thread" ? "flex" : "hidden md:flex",
				)}
			>
				<header className="flex items-center gap-2 px-3 py-3 md:px-5">
					<IconTip
						label={t("Back to conversations")}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								className="md:hidden"
								aria-label={t("Back to conversations")}
								onClick={() => setPane("list")}
							/>
						}
					>
						<ArrowLeft aria-hidden="true" />
					</IconTip>
					<div className="min-w-0 flex-1">
						<h2
							ref={threadTitle}
							tabIndex={-1}
							className="truncate text-sm font-medium outline-none"
						>
							{selected
								? textFor(locale, selected.title, selected.titleZh)
								: t("New chat")}
						</h2>
						<p className="text-xs text-muted-foreground">
							<SaasAdminText>Local sample replies. Nothing is sent.</SaasAdminText>
						</p>
					</div>
				</header>
				<Separator />
				<div className="sr-only" aria-live="polite">
					{streamingId
						? announceStream(
								selected?.turns.find((turn) => turn.id === streamingId),
								locale,
								streamedChars,
							)
						: ""}
				</div>
				<ScrollArea className="min-h-0 min-w-0 flex-1 overflow-x-hidden">
					{!selected ? (
						<div className="mx-auto flex h-full max-w-2xl flex-col justify-center gap-6 px-4 py-10">
							<div>
								<p className="text-lg font-medium">
									<SaasAdminText>Ask about the October work</SaasAdminText>
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									<SaasAdminText>
										Suggested prompts stay in this visit and never call a model.
									</SaasAdminText>
								</p>
							</div>
							<Suggestions>
								{SUGGESTED_PROMPTS.map((item) => (
									<Suggestion
										key={item.id}
										suggestion={locale === "zh" ? item.zh : item.en}
										onClick={(value) => send(value, model)}
									/>
								))}
							</Suggestions>
						</div>
					) : (
						<Thread className="min-w-0 py-6">
							{selected.turns.map((turn) => {
								const live = turn.id === streamingId;
								if (turn.role === "user") {
									return (
										<ThreadItem key={turn.id} className="min-w-0">
											<ThreadUserMessage>
												{textFor(locale, turn.text, turn.textZh)}
											</ThreadUserMessage>
										</ThreadItem>
									);
								}
								return (
									<ThreadItem key={turn.id} className="min-w-0">
										<div className="group/turn min-w-0 space-y-3 py-2">
											{turn.reasoning ? (
												<Reasoning
													isStreaming={live}
													duration={live ? undefined : 4}
													defaultOpen={false}
												>
													<ReasoningTrigger
														getThinkingMessage={(streaming, duration) =>
															streaming
																? t("Thinking…")
																: duration
																	? locale === "zh"
																		? `想了 ${duration} 秒`
																		: `Thought for ${duration} seconds`
																	: t("Thought for a moment")
														}
													/>
													<ReasoningContent>
														{textFor(
															locale,
															turn.reasoning.en,
															turn.reasoning.zh,
														)}
													</ReasoningContent>
												</Reasoning>
											) : null}
											<ThreadMessage streaming={live} className="min-w-0">
												<MessageBlocks
													blocks={
														live && turn.blocks
															? sliceBlocks(turn.blocks, locale, streamedChars)
															: turn.blocks
													}
													locale={locale}
													fallback={
														live && turn.blocks?.length
															? ""
															: live
																? textFor(
																		locale,
																		turn.text,
																		turn.textZh,
																	).slice(0, streamedChars)
																: textFor(locale, turn.text, turn.textZh)
													}
												/>
											</ThreadMessage>
											{!live && turn.usage ? (
												<ThreadUsage
													cost={turn.usage.cost}
													inputTokens={turn.usage.inputTokens}
													outputTokens={turn.usage.outputTokens}
												/>
											) : null}
										</div>
									</ThreadItem>
								);
							})}
							<div ref={threadEnd} />
						</Thread>
					)}
				</ScrollArea>
				<Separator />
				<div className="p-3 md:p-4">
					{attachments.length ? (
						<div className="mb-2 flex flex-wrap gap-1.5">
							{attachments.map((name) => (
								<Badge key={name} variant="secondary" className="gap-1 pr-1">
									{name}
									<IconTip
										label={t("Remove attachment")}
										trigger={
											<Button
												type="button"
												variant="ghost"
												size="icon-xs"
												aria-label={t("Remove attachment")}
												onClick={() =>
													setAttachments((current) =>
														current.filter((item) => item !== name),
													)
												}
											/>
										}
									>
										<X aria-hidden="true" />
									</IconTip>
								</Badge>
							))}
						</div>
					) : null}
					<PromptInput
						value={draft}
						onValueChange={setDraft}
						models={CHAT_MODELS.map((item) => ({
							value: item.value,
							label: item.label,
						}))}
						model={model}
						onModelChange={(value) => setModel(value as ChatModelId)}
						actions={[
							{
								value: "attach",
								label: t("Attach a sample file"),
								icon: <Paperclip />,
							},
						]}
						onAction={(action) => {
							if (action === "attach") attachSample();
						}}
						onSubmit={(value, nextModel) => send(value, nextModel)}
						loading={Boolean(streamingId)}
						onStop={stopStream}
						placeholder={t("Ask a question…")}
						aria-label={t("Prompt")}
					/>
				</div>
			</section>
		</Card>
	);
}

function MessageBlocks({
	blocks,
	locale,
	fallback,
}: {
	blocks?: ChatBlock[];
	locale: string;
	fallback: string;
}) {
	if (!blocks?.length) return fallback ? <p>{fallback}</p> : null;
	return (
		<div className="min-w-0 space-y-3">
			{blocks.map((block) => {
				if (block.type === "p") {
					return (
						<p key={block.en}>
							<InlineMarks text={locale === "zh" ? block.zh : block.en} />
						</p>
					);
				}
				if (block.type === "list") {
					return (
						<ul key={block.items.map((item) => item.en).join("|")}>
							{block.items.map((item) => (
								<li key={item.en}>
									<InlineMarks text={locale === "zh" ? item.zh : item.en} />
								</li>
							))}
						</ul>
					);
				}
				return (
					<CopyableCodeBlock
						key={block.code}
						language={block.language}
						code={block.code}
					/>
				);
			})}
		</div>
	);
}

function CopyableCodeBlock({
	language,
	code,
}: {
	language?: string;
	code: string;
}) {
	const { t } = useSaasAdmin();
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, []);

	return (
		<div className="min-w-0 max-w-full rounded-xl bg-[var(--wb-code-block)]">
			<div className="flex items-center justify-between gap-2 px-3 pt-2">
				<span className="text-xs text-muted-foreground">{language}</span>
				<IconTip
					label={copied ? t("Copied") : t("Copy code")}
					trigger={
						<Button
							type="button"
							variant="ghost"
							size="xs"
							data-code-copied={copied ? "true" : undefined}
							aria-label={copied ? t("Copied") : t("Copy code")}
							onClick={async () => {
								await navigator.clipboard?.writeText(code);
								setCopied(true);
								if (timer.current) window.clearTimeout(timer.current);
								timer.current = window.setTimeout(() => setCopied(false), 1600);
							}}
						/>
					}
				>
					{copied ? (
						<Check aria-hidden="true" />
					) : (
						<Copy aria-hidden="true" />
					)}
					{copied ? t("Copied") : t("Copy code")}
				</IconTip>
			</div>
			<div
				data-code-scroll=""
				className="min-w-0 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/35"
			>
				<ThreadCodeBlock className="mb-0 [&>pre]:w-max [&>pre]:min-w-full [&>pre]:overflow-visible [&>pre]:rounded-none">
					{code}
				</ThreadCodeBlock>
			</div>
		</div>
	);
}

function announceStream(
	turn: ChatTurn | undefined,
	locale: string,
	chars: number,
) {
	if (!turn) return "";
	if (turn.blocks?.length) {
		return blocksToDisplay(sliceBlocks(turn.blocks, locale, chars), locale);
	}
	return textFor(locale, turn.text, turn.textZh).slice(0, chars);
}

function InlineMarks({ text }: { text: string }) {
	const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
	return (
		<>
			{parts.map((part) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					return <strong key={`b-${part}`}>{part.slice(2, -2)}</strong>;
				}
				if (part.startsWith("`") && part.endsWith("`")) {
					return (
						<ThreadInlineCode key={`c-${part}`}>
							{part.slice(1, -1)}
						</ThreadInlineCode>
					);
				}
				return <span key={`t-${part}`}>{part}</span>;
			})}
		</>
	);
}
