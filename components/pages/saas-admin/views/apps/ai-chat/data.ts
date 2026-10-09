export const CHAT_MODELS = [
	{ value: "pulse", label: "Pulse", labelZh: "Pulse" },
	{ value: "atlas", label: "Atlas", labelZh: "Atlas" },
	{ value: "draft", label: "Draft", labelZh: "Draft" },
] as const;

export type ChatModelId = (typeof CHAT_MODELS)[number]["value"];

export type ChatBlock =
	| { type: "p"; en: string; zh: string }
	| { type: "list"; items: { en: string; zh: string }[] }
	| { type: "code"; language: string; code: string };

export interface ChatTurn {
	id: string;
	role: "user" | "assistant";
	text: string;
	textZh: string;
	blocks?: ChatBlock[];
	reasoning?: { en: string; zh: string };
	usage?: { inputTokens: number; outputTokens: number; cost: number };
}

export interface ChatConversation {
	id: string;
	title: string;
	titleZh: string;
	preview: string;
	previewZh: string;
	updated: string;
	updatedZh: string;
	pinned?: boolean;
	model: ChatModelId;
	turns: ChatTurn[];
}

export const SAMPLE_FILES = [
	{ id: "brief", name: "trial-letter.md" },
	{ id: "export", name: "september-paid.csv" },
	{ id: "mark", name: "status-mark.svg" },
] as const;

export const CONVERSATIONS: readonly ChatConversation[] = [
	{
		id: "trial-letter",
		title: "Trial-end letter",
		titleZh: "试用结束信",
		preview: "Name Studio and Team. Leave Company out.",
		previewZh: "写明工作室版和团队版，公司版先不提。",
		updated: "Oct 9, 09:40",
		updatedZh: "10月9日 09:40",
		pinned: true,
		model: "pulse",
		turns: [
			{
				id: "trial-q",
				role: "user",
				text: "Rewrite the trial-end email so it names Studio and Team.",
				textZh: "重写试用结束信，点明工作室版和团队版。",
			},
			{
				id: "trial-a",
				role: "assistant",
				text: "Keep the letter short. Name the two plans, then one next step.",
				textZh: "信要短。点明两档方案，再给一个下一步。",
				reasoning: {
					en: "The current letter only says “upgrade”. Readers cannot tell which plan they would land on.",
					zh: "现在的信只写“升级”，读者不知道会落到哪一档。",
				},
				blocks: [
					{
						type: "p",
						en: "Open with the date the trial ends, then name **Studio** and **Team**. Leave Company out until the pricing call.",
						zh: "先写试用结束的日子，再点明 **工作室版** 和 **团队版**。公司版等定价通话后再提。",
					},
					{
						type: "code",
						language: "markdown",
						code: "Subject: Studio and Team after 14 October\n\nYour trial ends on 14 October.\nStudio keeps one workspace.\nTeam adds seats and shared notes.",
					},
					{
						type: "list",
						items: [
							{
								en: "One sentence on what happens to trial notes.",
								zh: "用一句说明试用笔记会怎样。",
							},
							{
								en: "A single button: “Choose a plan”.",
								zh: "只放一个按钮：“选择方案”。",
							},
						],
					},
				],
				usage: { inputTokens: 412, outputTokens: 268, cost: 0.018 },
			},
		],
	},
	{
		id: "invoice-csv",
		title: "September export",
		titleZh: "九月导出",
		preview: "One row per paid invoice, no drafts.",
		previewZh: "已付账单一行，不含草稿。",
		updated: "Oct 9, 10:12",
		updatedZh: "10月9日 10:12",
		model: "atlas",
		turns: [
			{
				id: "csv-q",
				role: "user",
				text: "What columns should the September invoice export keep?",
				textZh: "九月账单导出应该留哪些列？",
			},
			{
				id: "csv-a",
				role: "assistant",
				text: "Keep five columns. Drop drafts and retries that later succeeded.",
				textZh: "留五列。草稿和后来成功的重试都去掉。",
				blocks: [
					{
						type: "p",
						en: "The bookkeeper asked for one row per **paid** invoice. A retry that later succeeded is the same invoice.",
						zh: "记账只要 **已付款** 的账单一行。后来成功的重试还是同一张账单。",
					},
					{
						type: "code",
						language: "csv",
						code: "invoice_id,account,paid_at,amount,tax\nHG-204,Harbor Goods,2026-10-08,240.00,12.00",
					},
				],
				usage: { inputTokens: 288, outputTokens: 194, cost: 0.021 },
			},
		],
	},
	{
		id: "status-mark",
		title: "Status page mark",
		titleZh: "状态页标记",
		preview: "A single-color N at 16 pixels.",
		previewZh: "16 像素下的单色 N。",
		updated: "Oct 8, 16:02",
		updatedZh: "10月8日 16:02",
		model: "draft",
		turns: [
			{
				id: "mark-q",
				role: "user",
				text: "How should we describe the status page mark to the designer?",
				textZh: "状态页标记怎么跟设计师说？",
			},
			{
				id: "mark-a",
				role: "assistant",
				text: "One color, the same N, drawn for 16 pixels.",
				textZh: "一种颜色，还是那个 N，按 16 像素来画。",
				blocks: [
					{
						type: "p",
						en: "Ask for a single-color mark. It is the same N as the workspace, redrawn so the counters stay open at 16px.",
						zh: "只要单色标记。和工区同一个 N，按 16 像素重画，空隙要留开。",
					},
				],
				usage: { inputTokens: 156, outputTokens: 92, cost: 0.006 },
			},
		],
	},
];

export const SUGGESTED_PROMPTS = [
	{
		id: "letter",
		en: "Tighten the trial-end letter",
		zh: "把试用结束信写短",
	},
	{
		id: "csv",
		en: "List columns for the September export",
		zh: "列出九月导出的列",
	},
	{
		id: "mark",
		en: "Describe the status page mark",
		zh: "说明状态页标记",
	},
] as const;

export function conversationMatches(
	conversation: ChatConversation,
	query: string,
) {
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	return [
		conversation.title,
		conversation.titleZh,
		conversation.preview,
		conversation.previewZh,
		...conversation.turns.flatMap((turn) => [turn.text, turn.textZh]),
	]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

export function replyForPrompt(prompt: string): Omit<ChatTurn, "id" | "role"> {
	const lower = prompt.toLowerCase();
	if (lower.includes("csv") || lower.includes("导出") || lower.includes("invoice")) {
		return {
			text: "Keep five columns and drop drafts.",
			textZh: "留五列，草稿去掉。",
			reasoning: {
				en: "The bookkeeper asked for paid invoices only.",
				zh: "记账只要已付款的账单。",
			},
			blocks: [
				{
					type: "p",
					en: "Use one row per paid invoice. A later retry is the same row.",
					zh: "已付账单一行。后来的重试还是同一行。",
				},
				{
					type: "code",
					language: "csv",
					code: "invoice_id,account,paid_at,amount,tax",
				},
			],
			usage: { inputTokens: 180, outputTokens: 96, cost: 0.009 },
		};
	}
	if (lower.includes("mark") || lower.includes("标记") || lower.includes("status")) {
		return {
			text: "One color, the same N, drawn for 16 pixels.",
			textZh: "一种颜色，还是那个 N，按 16 像素来画。",
			blocks: [
				{
					type: "p",
					en: "Ask for a single-color mark that still reads at 16px.",
					zh: "只要单色标记，16 像素下还能认出来。",
				},
			],
			usage: { inputTokens: 120, outputTokens: 64, cost: 0.005 },
		};
	}
	return {
		text: "Name the plan, then give one next step.",
		textZh: "点明方案，再给一个下一步。",
		reasoning: {
			en: "Short letters get read. Two named plans beat a vague upgrade.",
			zh: "短信才会被读完。点明两档比只写升级清楚。",
		},
		blocks: [
			{
				type: "p",
				en: "Open with the date, name **Studio** and **Team**, then one button.",
				zh: "先写日期，点明 **工作室版** 和 **团队版**，再放一个按钮。",
			},
			{
				type: "code",
				language: "markdown",
				code: "Your trial ends on 14 October.\nStudio keeps one workspace.\nTeam adds seats.",
			},
		],
		usage: { inputTokens: 210, outputTokens: 140, cost: 0.012 },
	};
}

export function blocksToPlain(blocks: ChatBlock[] | undefined, locale: string) {
	if (!blocks) return "";
	return blocks
		.map((block) => {
			if (block.type === "p") return locale === "zh" ? block.zh : block.en;
			if (block.type === "list") {
				return block.items
					.map((item) => `- ${locale === "zh" ? item.zh : item.en}`)
					.join("\n");
			}
			return `\`\`\`${block.language}\n${block.code}\n\`\`\``;
		})
		.join("\n\n");
}
