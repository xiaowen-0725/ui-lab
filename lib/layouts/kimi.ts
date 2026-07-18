import type { LayoutEntry } from "./types";

// Kimi's home screen — the canonical "conversational AI app shell":
// a fixed left conversation rail + a centered, empty-state composer stage.
export const kimiLayout: LayoutEntry = {
  slug: "kimi",
  name: "Conversational AI App Shell",
  nameZh: "对话式 AI 应用外壳",
  aliases: [
    "sidebar chat shell",
    "AI 对话外壳",
    "左栏会话 + 居中输入",
    "chat app layout",
    "assistant home",
  ],
  source: "Kimi",
  sourceUrl: "https://www.kimi.com",
  description:
    "A fixed left conversation rail (new-chat, tools, history, account) beside a centered empty-state stage: brand wordmark, a big composer with a model picker, quick-action chips, and a bottom discovery strip. The default shape for a chat-first AI product.",
  descriptionZh:
    "左侧固定会话栏(新建会话、工具入口、历史列表、账户)+ 右侧居中空态舞台:品牌字标、带模型选择的大输入框、快捷动作胶囊、底部探索条。对话优先的 AI 产品最通用的外壳。",
  bestFor: "Chat-first AI assistants, agent consoles, any product whose home is an input box.",
  bestForZh: "对话优先的 AI 助手、Agent 控制台,以及任何「首页就是一个输入框」的产品。",
  recipe: [
    "Two columns: a fixed ~260px left rail + a fluid main stage; the rail is one flex column, the main stage is a centered max-w-3xl block.",
    "Rail top-to-bottom: brand + collapse toggle → a raised 'new chat' button with a ⌘K hint → icon nav rows → a collapsible group → muted 'chats' label + history list → pinned promo card → account footer.",
    "Main stage is vertically centered: a small top-center pill, the brand wordmark, the composer, a wrap of quick-action chips, then a full-width discovery bar pinned to the bottom.",
    "Composer is a tall rounded card: placeholder on top, a bottom toolbar with a '+' on the left and a model selector + circular send button on the right.",
    "Dark, near-black surfaces (rail and stage share the same base); borders are barely-there low-contrast lines; one blue accent reserved for the promo pill and 'Beta' badges.",
  ],
  recipeZh: [
    "两列:左侧固定约 260px 会话栏 + 右侧流式主舞台;会话栏是一条 flex 纵列,主舞台是居中的 max-w-3xl 块。",
    "会话栏从上到下:品牌 + 收起按钮 → 带 ⌘K 提示的凸起「新建会话」按钮 → 图标导航行 → 可折叠分组 → 灰字「对话」标签 + 历史列表 → 置底促销卡 → 账户页脚。",
    "主舞台垂直居中:顶部居中小胶囊、品牌字标、输入框、一排换行的快捷动作胶囊,再加一条钉在底部的通栏探索条。",
    "输入框是高的圆角卡:上方占位文字,底部工具条左侧「+」、右侧模型选择器 + 圆形发送按钮。",
    "深色近黑表面(会话栏与舞台同一底色);描边是几乎看不见的低对比细线;只保留一处蓝色强调,用在促销胶囊和「Beta」徽章上。",
  ],
  promptZh:
    "做一个「对话式 AI 应用外壳」首页,深色近黑主题。左侧固定约 260px 会话栏:顶部品牌图标 + 收起面板按钮,下面一个凸起的圆角「新建会话」按钮(右侧带 ⌘K 快捷键提示),再是「插件 / 定时任务」等图标导航行,一个可折叠分组,然后灰字「对话」小标题 + 历史会话列表;栏底钉一张促销卡和带头像的账户行。右侧主区垂直居中:顶部居中一个蓝色小胶囊,中间大号品牌字标,下面一个高的圆角输入框(占位文字 + 底部工具条:左「+」、右侧模型选择器和圆形发送按钮),输入框下一排可换行的快捷动作胶囊,最底部一条通栏「探索灵感」条。所有表面同一深色底、描边极低对比,只用一处蓝色强调。FORBIDDEN:彩色渐变背景、卡片阴影、亮色主题、把会话栏做成折叠抽屉、输入框做成单行细条、多种强调色。",
  promptEn:
    "Build a 'conversational AI app shell' home screen, dark near-black theme. Left fixed rail ~260px: brand icon + panel-collapse toggle at top, then a raised rounded 'new chat' button with a ⌘K shortcut hint on its right, then icon nav rows (plugins / scheduled tasks…), a collapsible group, then a muted 'chats' label + a history list; pin a promo card and an account row (avatar) to the rail bottom. Right main area vertically centered: a small blue pill top-center, a large brand wordmark, a tall rounded composer (placeholder text + a bottom toolbar: '+' on the left, a model selector and a circular send button on the right), a wrap of quick-action chips under it, and a full-width 'explore' discovery bar pinned to the very bottom. All surfaces share one dark base, borders are ultra-low-contrast, a single blue accent only. FORBIDDEN: colorful gradient backgrounds, drop shadows on cards, light theme, making the rail a collapsing drawer, a single-line thin input, multiple accent colors.",
};
