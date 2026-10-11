export const FOLDER_IDS = ["inbox", "starred", "sent", "archive"] as const;

export type FolderId = (typeof FOLDER_IDS)[number];

export interface MailMessage {
	id: string;
	author: string;
	authorZh: string;
	email: string;
	body: string;
	bodyZh: string;
	at: string;
	atZh: string;
}

export interface Thread {
	id: string;
	folder: Exclude<FolderId, "starred">;
	starred: boolean;
	unread: boolean;
	subject: string;
	subjectZh: string;
	messages: MailMessage[];
}

export const THREADS: readonly Thread[] = [
	{
		id: "pricing-call",
		folder: "inbox",
		starred: true,
		unread: true,
		subject: "Thursday works for the pricing call",
		subjectZh: "定价通话可以改到周四",
		messages: [
			{
				id: "pricing-1",
				author: "Elena Voss",
				authorZh: "Elena Voss",
				email: "elena@paperandpine.example",
				body: "Thursday after 13:00 our time is open. Thirty minutes is enough if we stay on the Team plan.",
				bodyZh: "我们当地周四 13:00 之后有空。如果只谈团队版，三十分钟就够。",
				at: "Oct 8, 16:40",
				atZh: "10月8日 16:40",
			},
			{
				id: "pricing-2",
				author: "Lin Zhixia",
				authorZh: "林知夏",
				email: "zhixia@northline.example",
				body: "I will send a short agenda tonight: seats, annual price, and what happens to the trial work.",
				bodyZh: "我今晚发一份短议程：席位、年付价格，以及试用里的工作会怎样。",
				at: "Oct 8, 18:05",
				atZh: "10月8日 18:05",
			},
		],
	},
	{
		id: "double-charge",
		folder: "inbox",
		starred: false,
		unread: true,
		subject: "Harbor Goods shows two charges",
		subjectZh: "Harbor Goods 显示两笔扣款",
		messages: [
			{
				id: "charge-1",
				author: "Priya Nair",
				authorZh: "Priya Nair",
				email: "priya@northline.example",
				body: "The second line is a retry of invoice HG-204. The first attempt failed on a expired card, then succeeded. I can write that on their receipt.",
				bodyZh: "第二行是账单 HG-204 的重试。第一次因为卡片过期失败，随后成功。我可以把这句话写进收据。",
				at: "Oct 9, 09:12",
				atZh: "10月9日 09:12",
			},
		],
	},
	{
		id: "workshop",
		folder: "inbox",
		starred: false,
		unread: false,
		subject: "Can we move the workshop?",
		subjectZh: "工作坊可以改期吗？",
		messages: [
			{
				id: "workshop-1",
				author: "Omar Haddad",
				authorZh: "Omar Haddad",
				email: "omar@fieldnote.example",
				body: "Two of our editors are in transit on Wednesday. Friday morning is better, if the same outline still holds.",
				bodyZh: "我们有两位编辑周三在路上。如果提纲不变，周五上午更好。",
				at: "Oct 7, 11:20",
				atZh: "10月7日 11:20",
			},
		],
	},
	{
		id: "logo",
		folder: "inbox",
		starred: true,
		unread: false,
		subject: "Status page mark",
		subjectZh: "状态页用的标记",
		messages: [
			{
				id: "logo-1",
				author: "Zhou Heng",
				authorZh: "周衡",
				email: "heng@northline.example",
				body: "I left a single-color mark in the shared folder. It is the same N as the workspace, drawn for small sizes.",
				bodyZh: "共享文件夹里有一枚单色标记。就是工作台那个 N，按小尺寸重画的。",
				at: "Oct 6, 15:02",
				atZh: "10月6日 15:02",
			},
		],
	},
	{
		id: "export-thanks",
		folder: "sent",
		starred: false,
		unread: false,
		subject: "September export is ready",
		subjectZh: "九月导出已经备好",
		messages: [
			{
				id: "export-1",
				author: "Lin Zhixia",
				authorZh: "林知夏",
				email: "zhixia@northline.example",
				body: "Attached is one row per paid invoice. Drafts stayed out. Tell me if the bookkeeper needs the tax column split.",
				bodyZh: "附件是每张已付账单一行。草稿没有放进去。如果记账需要把税拆成单独一列，跟我说。",
				at: "Oct 5, 10:18",
				atZh: "10月5日 10:18",
			},
		],
	},
	{
		id: "domain",
		folder: "archive",
		starred: false,
		unread: false,
		subject: "Old domain transfer notes",
		subjectZh: "旧域名转移笔记",
		messages: [
			{
				id: "domain-1",
				author: "Kenji Arai",
				authorZh: "Kenji Arai",
				email: "kenji@northline.example",
				body: "The transfer finished in March. Keeping this thread so we remember why the status page moved hosts.",
				bodyZh: "转移在三月完成。留下这封，是为了记得状态页为什么换了托管。",
				at: "Mar 12, 09:00",
				atZh: "3月12日 09:00",
			},
		],
	},
];

export function threadsForFolder(threads: readonly Thread[], folder: FolderId) {
	if (folder === "starred") {
		return threads.filter(
			(thread) => thread.starred && thread.folder !== "archive",
		);
	}
	return threads.filter((thread) => thread.folder === folder);
}

export function threadMatches(thread: Thread, query: string) {
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	const blob = [
		thread.subject,
		thread.subjectZh,
		...thread.messages.flatMap((message) => [
			message.author,
			message.authorZh,
			message.email,
			message.body,
			message.bodyZh,
		]),
	]
		.join(" ")
		.toLowerCase();
	return blob.includes(needle);
}
