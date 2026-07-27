export type ApplicationProfile = "next-app" | "vite-app" | "electron-renderer";

export type RecipeSlot = {
  name: string;
  description: string;
  descriptionZh: string;
  required: boolean;
};

export type RecipeState = {
  name: string;
  description: string;
  descriptionZh: string;
};

export type RecipeResponsiveRule = {
  viewport: "desktop" | "tablet" | "mobile";
  behavior: string;
  behaviorZh: string;
};

export type RecipeAsset = {
  kind: "font" | "icon" | "image" | "illustration";
  requirement: string;
  requirementZh: string;
  required: boolean;
};

export type RecipeSection = {
  slug: string;
  variant: string;
  required: boolean;
};

export type Recipe = {
  slug: string;
  category: "application" | "landing";
  name: string;
  nameZh: string;
  aliases: readonly string[];
  description: string;
  descriptionZh: string;
  profiles: readonly ApplicationProfile[];
  recommendedSystem: string;
  entryComponent: string;
  components: readonly string[];
  optionalComponents: readonly string[];
  slots: readonly RecipeSlot[];
  states: readonly RecipeState[];
  responsive: readonly RecipeResponsiveRule[];
  assets: readonly RecipeAsset[];
  sections?: readonly RecipeSection[];
  required: readonly string[];
  forbidden: readonly string[];
  pagePath: string;
};

export const RECIPES: readonly Recipe[] = [
  {
    slug: "agent-workbench",
    category: "application",
    name: "Agent Workbench",
    nameZh: "智能体工作台",
    aliases: ["AI workbench", "agent desktop", "智能体桌面", "AI 工作台"],
    description:
      "A dense application shell for agent conversations, tools, approvals, and artifacts.",
    descriptionZh: "用于智能体会话、工具调用、审批与产物查看的高密度应用外壳。",
    profiles: ["next-app", "vite-app", "electron-renderer"],
    recommendedSystem: "graphite",
    entryComponent: "agent-workbench",
    components: [
      "agent-workbench",
      "thread-list",
      "agent-thread",
      "agent-composer",
      "artifact-panel",
    ],
    optionalComponents: ["agent-inbox", "agent-trace", "citations", "voice-orb"],
    slots: [
      {
        name: "navigation",
        description: "Conversation and task navigation in the left rail.",
        descriptionZh: "左侧栏中的会话与任务导航。",
        required: true,
      },
      {
        name: "thread",
        description: "The primary agent conversation and execution timeline.",
        descriptionZh: "主要的智能体会话与执行时间线。",
        required: true,
      },
      {
        name: "composer",
        description: "Prompt, context, model, and send/stop controls.",
        descriptionZh: "提示词、上下文、模型与发送/停止控制区。",
        required: true,
      },
      {
        name: "artifact",
        description: "An on-demand preview, source, and version surface.",
        descriptionZh: "按需打开的预览、源码与版本区域。",
        required: false,
      },
    ],
    states: [
      {
        name: "empty",
        description: "No active conversation is selected.",
        descriptionZh: "尚未选择活动会话。",
      },
      {
        name: "streaming",
        description: "The agent is producing output or running tools.",
        descriptionZh: "智能体正在生成内容或运行工具。",
      },
      {
        name: "approval",
        description: "A tool action is waiting for explicit approval.",
        descriptionZh: "工具操作正在等待明确审批。",
      },
      {
        name: "error",
        description: "A turn or tool execution failed and can be retried.",
        descriptionZh: "会话轮次或工具执行失败，可重试。",
      },
    ],
    responsive: [
      {
        viewport: "desktop",
        behavior: "Keep the three workbench regions visible and independently resizable.",
        behaviorZh: "保持三个工作台区域可见并可独立调整宽度。",
      },
      {
        viewport: "tablet",
        behavior: "Collapse navigation first and open artifacts as an overlay panel.",
        behaviorZh: "优先收起导航，将产物区作为覆盖面板打开。",
      },
      {
        viewport: "mobile",
        behavior: "Show one task surface at a time with explicit navigation between regions.",
        behaviorZh: "一次只显示一个任务区域，并提供明确的区域切换。",
      },
    ],
    assets: [
      {
        kind: "font",
        requirement: "Use the Theme Kit system sans and monospace stacks.",
        requirementZh: "使用主题套件的系统无衬线与等宽字体栈。",
        required: true,
      },
      {
        kind: "icon",
        requirement: "Use Lucide icons with consistent 16px workbench sizing.",
        requirementZh: "使用 Lucide 图标，并保持工作台统一的 16px 尺寸。",
        required: true,
      },
    ],
    required: [
      "Use the complete AgentWorkbench shell as the composition entry point.",
      "Install the selected Theme Kit before adapting application content.",
      "Preserve the --wb-* workbench token contract in vendored components.",
    ],
    forbidden: [
      "Do not replace the workbench shell with unrelated generic dashboard cards.",
      "Do not collapse --wb-* tokens into a smaller ad-hoc semantic palette.",
      "Do not hide task state behind decorative animation.",
    ],
    pagePath: "/components/blocks/agent-workbench",
  },
  {
    slug: "saas-landing",
    category: "landing",
    name: "SaaS Landing",
    nameZh: "SaaS 落地页",
    aliases: ["startup landing", "product marketing page", "软件落地页", "产品官网"],
    description:
      "A product-led landing composition with a clear hero, proof, features, pricing, and CTA rhythm.",
    descriptionZh: "以产品为主线，组合首屏、信任证明、功能、定价与行动召唤的落地页配方。",
    profiles: ["next-app", "vite-app"],
    recommendedSystem: "minimal-light",
    entryComponent: "recording-card",
    components: ["recording-card", "button", "animated-badge"],
    optionalComponents: ["marquee", "tabs", "feedback-widget"],
    sections: [
      { slug: "navbar", variant: "simple", required: true },
      { slug: "hero", variant: "screenshot", required: true },
      { slug: "logo-wall", variant: "row", required: true },
      { slug: "features", variant: "alternating", required: true },
      { slug: "testimonials", variant: "quote", required: true },
      { slug: "pricing", variant: "tiers", required: false },
      { slug: "faq", variant: "accordion", required: false },
      { slug: "cta", variant: "boxed", required: true },
      { slug: "footer", variant: "columns", required: true },
    ],
    slots: [
      {
        name: "navigation",
        description: "Brand, primary links, and the single primary CTA.",
        descriptionZh: "品牌、主导航链接与唯一主行动按钮。",
        required: true,
      },
      {
        name: "hero",
        description: "Product promise, supporting copy, CTA, and product proof.",
        descriptionZh: "产品承诺、辅助文案、行动按钮与产品证明。",
        required: true,
      },
      {
        name: "proof",
        description: "Customer logos, metrics, testimonials, or product recording.",
        descriptionZh: "客户标志、指标、评价或产品录屏证明。",
        required: true,
      },
      {
        name: "features",
        description: "Outcome-led feature groups grounded in real product UI.",
        descriptionZh: "以结果为导向、由真实产品界面支撑的功能分组。",
        required: true,
      },
      {
        name: "pricing",
        description: "Comparable plans with one recommended path.",
        descriptionZh: "可比较的方案与一个明确的推荐选择。",
        required: false,
      },
      {
        name: "cta",
        description: "The repeated primary action before the footer.",
        descriptionZh: "页脚之前重复出现的主行动入口。",
        required: true,
      },
      {
        name: "footer",
        description: "Product, legal, and support links that close the page hierarchy.",
        descriptionZh: "收束页面层级的产品、法律与支持链接。",
        required: true,
      },
    ],
    states: [
      {
        name: "default",
        description: "All product proof and calls to action are readable without interaction.",
        descriptionZh: "无需交互即可阅读产品证明与行动入口。",
      },
      {
        name: "media-loading",
        description: "Product imagery or recordings reserve stable space while loading.",
        descriptionZh: "产品图片或录屏加载时保留稳定空间。",
      },
      {
        name: "form-error",
        description: "Lead or signup forms explain validation and recovery inline.",
        descriptionZh: "线索或注册表单就地说明校验错误与恢复方式。",
      },
      {
        name: "submitted",
        description: "A successful conversion receives an explicit confirmation state.",
        descriptionZh: "转化成功后显示明确的确认状态。",
      },
    ],
    responsive: [
      {
        viewport: "desktop",
        behavior: "Use a bounded content grid with alternating proof and feature regions.",
        behaviorZh: "使用有最大宽度的内容网格，交替组织证明与功能区域。",
      },
      {
        viewport: "tablet",
        behavior: "Reduce multi-column sections without changing content order.",
        behaviorZh: "减少多列布局，但不改变内容顺序。",
      },
      {
        viewport: "mobile",
        behavior: "Stack content, keep CTA order intact, and avoid horizontal carousels for core proof.",
        behaviorZh: "纵向堆叠内容，保持行动按钮顺序，核心证明不使用横向轮播。",
      },
    ],
    assets: [
      {
        kind: "font",
        requirement: "Load the Theme Kit display and body fonts without layout shift.",
        requirementZh: "加载主题套件的展示与正文字体，避免布局偏移。",
        required: true,
      },
      {
        kind: "image",
        requirement: "Provide real product screenshots or a concise product recording.",
        requirementZh: "提供真实产品截图或简洁的产品录屏。",
        required: true,
      },
      {
        kind: "icon",
        requirement: "Use one consistent Lucide icon treatment for feature support.",
        requirementZh: "功能辅助图标统一使用一种 Lucide 处理方式。",
        required: false,
      },
    ],
    required: [
      "Establish one primary CTA and repeat it consistently through the page.",
      "Preserve the declared navigation, hero, proof, features, CTA, and footer order; pricing is optional and may be omitted when the product has no pricing model.",
      "Apply the selected Theme Kit typography, spacing, and semantic color tokens.",
    ],
    forbidden: [
      "Do not use generic gradient blobs as the main visual identity.",
      "Do not invent competing button, card, or typography systems per section.",
      "Do not add motion that delays reading or obscures the primary CTA.",
    ],
    pagePath: "/sections",
  },
];
