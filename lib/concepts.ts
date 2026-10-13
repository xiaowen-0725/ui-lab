// Everyday interface concepts. An entry may point at a component we already
// ship. It never invents an installable for a concept we do not have.

export const CONCEPT_GROUPS = [
  "actions",
  "writing",
  "choice",
  "navigation",
  "jargon",
  "overlay",
  "feedback",
  "content",
] as const;

export type ConceptGroup = (typeof CONCEPT_GROUPS)[number];

export type ConceptComponent = {
  category: "motion" | "blocks";
  slug: string;
  previewKey: string;
  installSlug: string;
};

export type ConceptCrossNames = {
  antd?: string;
  shadcn?: string;
  spectrum?: string;
};

export type ConceptEntry = {
  slug: string;
  group: ConceptGroup;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  sentence: string;
  sentenceZh: string;
  prompt: string;
  promptZh: string;
  component?: ConceptComponent;
  /** Slugs of concepts people mix this one up with. Kept two-way by a test. */
  confusableWith?: readonly string[];
  /** What other well-known libraries call the same thing. */
  crossNames?: ConceptCrossNames;
  /** One way we ship the idea. The sample on the page stays the plain concept. */
  related?: {
    category: "motion" | "blocks";
    slug: string;
    name: string;
    nameZh: string;
  };
};

export const CONCEPTS: readonly ConceptEntry[] = [
  {
    slug: "button",
    group: "actions",
    name: "Button",
    nameZh: "按钮",
    aliases: ["CTA", "主按钮", "call to action"],
    sentence: "A control a person presses to do one thing.",
    sentenceZh: "让人点一下就做一件事的控件。",
    prompt:
      "Install UI Lab button-base and import Button from it. Press feedback uses its spring. Install button-stateful for StatefulButton with idle, loading, success, and error states; install button-magnetic for MagneticButton. The button target installs the whole family.",
    promptZh:
      "安装 UI Lab 的 button-base，引入其中的 Button，按压用它自带的弹簧。空闲、加载中、成功、失败安装 button-stateful 并使用 StatefulButton；跟随指针安装 button-magnetic 并使用 MagneticButton。button 入口安装整个组件族。",
    component: {
      category: "motion",
      slug: "button",
      previewKey: "motion/button-base",
      installSlug: "button-base",
    },
  },
  {
    slug: "icon-button",
    group: "actions",
    name: "Icon button",
    nameZh: "图标按钮",
    aliases: ["glyph button", "tool button"],
    sentence: "A button that shows an icon and no visible text.",
    sentenceZh: "只放图标、不放可见文字的按钮。",
    prompt:
      "Use an icon button with an aria-label that says what it does. The accessible name is the label, not the icon.",
    promptZh:
      "做图标按钮时用 aria-label 写明它做什么。读屏读到的是这句名字，不是图标本身。",
  },
  {
    slug: "link",
    group: "actions",
    name: "Link",
    nameZh: "链接",
    aliases: ["hyperlink", "anchor", "超链接"],
    sentence: "Text that takes a person to another place.",
    sentenceZh: "点了会去另一个地方的文字。",
    prompt:
      "Use a link to go to another page. Use a button when the press does something here.",
    promptZh: "去另一个页面用链接。在当前页面里做一件事用按钮。",
  },
  {
    slug: "text-field",
    group: "writing",
    name: "Text field",
    nameZh: "输入框",
    aliases: ["input", "text box", "单行输入"],
    confusableWith: ["caret"],
    sentence: "One line where a person types.",
    sentenceZh: "让人打一行字的地方。",
    prompt: "Install UI Lab input and use it for a single-line text field.",
    promptZh: "安装 UI Lab 的 input，用它做单行输入框。",
    component: {
      category: "motion",
      slug: "input",
      previewKey: "motion/input",
      installSlug: "input",
    },
  },
  {
    slug: "text-area",
    group: "writing",
    name: "Text area",
    nameZh: "多行输入",
    aliases: ["textarea", "多行文本框"],
    sentence: "A field for more than one line of text.",
    sentenceZh: "可以写下多行文字的输入区。",
    prompt:
      "Use a text area when the person may write several lines. Keep a single-line text field for a name or a search.",
    promptZh: "可能写好几行时用多行输入。名字和搜索仍用单行输入框。",
  },
  {
    slug: "search-field",
    group: "writing",
    name: "Search field",
    nameZh: "搜索框",
    aliases: ["search box", "search bar"],
    sentence: "A field meant for finding something.",
    sentenceZh: "用来找东西的输入框。",
    prompt:
      "Use a search field, with a search icon and a submit action, when the person is looking something up.",
    promptZh: "人要查找时用搜索框，带搜索图标和提交动作。",
  },
  {
    slug: "password-field",
    group: "writing",
    name: "Password field",
    nameZh: "密码框",
    aliases: ["masked input", "密码输入"],
    sentence: "A field that hides what is typed, with a way to reveal it.",
    sentenceZh: "把打出来的字盖住，并可以再显示出来。",
    prompt:
      "Use a password field that masks the characters and gives a control to show them.",
    promptZh: "密码框默认盖住字符，并提供一个控件把密码显示出来。",
  },
  {
    slug: "checkbox",
    group: "choice",
    name: "Checkbox",
    nameZh: "复选框",
    aliases: ["tick box", "check box", "勾选框"],
    sentence: "A box a person ticks. Several can be on at once.",
    sentenceZh: "可以勾上的小方框。好几个可以同时勾上。",
    prompt:
      "Install UI Lab checkbox. Use it when each choice is independent and more than one may be on.",
    promptZh: "安装 UI Lab 的 checkbox。每个选项各自成立、可以同时勾上好几个时用它。",
    component: {
      category: "motion",
      slug: "checkbox",
      previewKey: "motion/checkbox",
      installSlug: "checkbox",
    },
  },
  {
    slug: "radio",
    group: "choice",
    name: "Radio",
    nameZh: "单选",
    aliases: ["radio button", "radio group", "选项按钮"],
    sentence: "A set of choices where only one stays selected.",
    sentenceZh: "一组选项里只能留下一个。",
    prompt: "Install UI Lab radio. Use it when exactly one choice in the group may be selected.",
    promptZh: "安装 UI Lab 的 radio。这一组里只能选中一个时用它。",
    component: {
      category: "motion",
      slug: "radio",
      previewKey: "motion/radio",
      installSlug: "radio",
    },
  },
  {
    slug: "switch",
    group: "choice",
    name: "Switch",
    nameZh: "开关",
    aliases: ["toggle", "on/off switch"],
    sentence: "A control that turns one setting on or off.",
    sentenceZh: "把一项设置打开或关掉的控件。",
    prompt: "Install UI Lab switch. Use it for one setting that is either on or off.",
    promptZh: "安装 UI Lab 的 switch。一项设置只有开和关时用它。",
    component: {
      category: "motion",
      slug: "switch",
      previewKey: "motion/switch",
      installSlug: "switch",
    },
  },
  {
    slug: "select",
    group: "choice",
    name: "Select",
    nameZh: "下拉选择",
    aliases: ["dropdown", "picker", "选择器"],
    confusableWith: ["dropdown-menu", "combobox"],
    crossNames: { antd: "Select", shadcn: "Select", spectrum: "Picker" },
    sentence: "A closed list. The person opens it and picks one. They do not type a new value.",
    sentenceZh: "收起的一张清单。打开后选一个，不能另打一个新值。",
    prompt:
      "Install UI Lab select when the person picks one value from a list and cannot type their own.",
    promptZh: "人要从清单里选一个、不能自己输入时，安装 UI Lab 的 select。",
    component: {
      category: "motion",
      slug: "select",
      previewKey: "motion/select",
      installSlug: "select",
    },
  },
  {
    slug: "combobox",
    group: "choice",
    name: "Combobox",
    nameZh: "组合框",
    aliases: ["autocomplete", "typeahead", "可输入下拉", "可搜下拉", "组合框"],
    confusableWith: ["select", "command"],
    crossNames: { antd: "AutoComplete / Select showSearch", shadcn: "Combobox", spectrum: "ComboBox" },
    sentence: "A field where a person can type and also pick from suggestions.",
    sentenceZh: "既能打字，也能从建议里选的输入框。",
    prompt:
      "Use a combobox when the person may type and may also pick a suggestion. Use a select when they can only pick.",
    promptZh: "既能输入又能从建议里选，用组合框。只能从清单里选，用下拉选择。",
  },
  {
    slug: "slider",
    group: "choice",
    name: "Slider",
    nameZh: "滑块",
    aliases: ["range", "track and thumb"],
    sentence: "A thumb the person drags along a track to set a value.",
    sentenceZh: "沿轨道拖动滑块来设定一个值。",
    prompt: "Install UI Lab range-slider when the person sets a value by dragging.",
    promptZh: "靠拖动来设一个值时，安装 UI Lab 的 range-slider。",
    component: {
      category: "motion",
      slug: "range-slider",
      previewKey: "motion/range-slider",
      installSlug: "range-slider",
    },
  },
  {
    slug: "sidebar",
    group: "navigation",
    name: "Sidebar",
    nameZh: "侧边栏",
    aliases: ["side nav", "rail", "侧栏"],
    sentence: "A column beside the page that holds navigation or tools.",
    sentenceZh: "贴在页面一侧、放导航或工具的一栏。",
    prompt:
      "Use a sidebar for navigation that stays beside the page. A drawer covers the page and then goes away; a sidebar stays.",
    promptZh:
      "导航要一直留在页面旁边时用侧边栏。盖住页面、看完就走的是抽屉。",
  },
  {
    slug: "header",
    group: "navigation",
    name: "Header",
    nameZh: "顶栏",
    aliases: ["navbar", "top bar", "导航栏"],
    sentence: "The bar across the top of a page.",
    sentenceZh: "横在页面最上面的一条。",
    prompt: "Put the site name and the main links in a header across the top of the page.",
    promptZh: "把站点名字和主要链接放在页面顶部的顶栏里。",
  },
  {
    slug: "tabs",
    group: "navigation",
    name: "Tabs",
    nameZh: "选项卡",
    aliases: ["tab bar", "tabbed panels"],
    confusableWith: ["segmented-control", "navigation-menu"],
    crossNames: { antd: "Tabs", shadcn: "Tabs", spectrum: "Tabs" },
    sentence: "A row of labels that switches which panel is visible.",
    sentenceZh: "一排标签，用来切换眼前的那一块内容。",
    prompt: "Install UI Lab tabs when one row of labels switches the panel underneath.",
    promptZh: "一排标签切换下面的内容时，安装 UI Lab 的 tabs。",
    component: {
      category: "motion",
      slug: "tabs",
      previewKey: "motion/tabs",
      installSlug: "tabs",
    },
  },
  {
    slug: "breadcrumb",
    group: "navigation",
    name: "Breadcrumb",
    nameZh: "面包屑",
    aliases: ["breadcrumb trail", "路径导航"],
    sentence: "The path from the top of the site down to this page.",
    sentenceZh: "从站点顶层走到当前这一页的路径。",
    prompt: "Show a breadcrumb of the parent pages when the person may need to step back up.",
    promptZh: "人可能要退回上层时，显示从站点顶层走到当前页的面包屑。",
  },
  {
    slug: "pagination",
    group: "navigation",
    name: "Pagination",
    nameZh: "分页",
    aliases: ["pager", "页码"],
    sentence: "Controls that move between pages of the same list.",
    sentenceZh: "在同一份清单的各页之间移动的控件。",
    prompt: "Use pagination when a list is split into numbered pages.",
    promptZh: "一份清单拆成带页码的几页时，用分页。",
  },
  {
    slug: "menu",
    group: "navigation",
    name: "Menu",
    nameZh: "菜单",
    aliases: ["command list", "命令列表"],
    sentence: "A list of commands or destinations a person can choose.",
    sentenceZh: "一组可以点的命令或目的地。",
    prompt:
      "Install UI Lab dropdown-menu for a menu of commands. The same component is the dropdown menu.",
    promptZh:
      "一组命令用 UI Lab 的 dropdown-menu。从按钮展开的那一种，也是这个组件。",
    component: {
      category: "motion",
      slug: "dropdown-menu",
      previewKey: "motion/dropdown-menu",
      installSlug: "dropdown-menu",
    },
  },
  {
    slug: "hamburger",
    group: "jargon",
    name: "Hamburger",
    nameZh: "汉堡菜单",
    aliases: ["three-line menu", "nav button", "三道杠"],
    sentence: "The three-line button that opens the navigation.",
    sentenceZh: "三道横线的按钮，点开才出现导航。",
    prompt:
      "Use a hamburger button to open navigation on a narrow screen. Give it an accessible name such as Menu.",
    promptZh: "窄屏用汉堡按钮打开导航。给它一个可读的名字，例如「菜单」。",
  },
  {
    slug: "kebab",
    group: "jargon",
    name: "Kebab",
    nameZh: "竖三点",
    aliases: ["overflow menu", "three-dot menu", "更多"],
    sentence: "A vertical three-dot button that opens less-used commands.",
    sentenceZh: "竖着的三个点，点开后是较少用的命令。",
    prompt:
      "Use a vertical three-dot kebab for commands that do not fit in the main row. Horizontal three dots are meatballs.",
    promptZh: "主操作排不下的命令，用竖着的三点。横着的三点是另一回事。",
  },
  {
    slug: "dialog",
    group: "overlay",
    name: "Dialog",
    nameZh: "对话框",
    aliases: ["modal", "弹窗", "popup", "对话框", "Modal 弹框"],
    confusableWith: ["drawer", "sheet", "alert-dialog", "scrim"],
    crossNames: { antd: "Modal", shadcn: "Dialog", spectrum: "Dialog" },
    sentence: "A panel that asks for attention and sits over the page.",
    sentenceZh: "浮在页面上、要人先处理的一块面板。",
    prompt:
      "Use a dialog when the person should deal with this panel before going back to the page. Keep the title and a way to close it.",
    promptZh: "要人先处理这块面板再回到页面时，用对话框。写上标题，并给一个关闭的办法。",
    related: {
      category: "motion",
      slug: "morphing-modal",
      name: "Morphing modal",
      nameZh: "变形弹窗",
    },
  },
  {
    slug: "drawer",
    group: "overlay",
    name: "Drawer",
    nameZh: "抽屉",
    aliases: ["side sheet", "侧滑", "侧栏面板", "滑出层"],
    confusableWith: ["dialog", "sheet", "scrim"],
    crossNames: { antd: "Drawer", shadcn: "Sheet (side)", spectrum: "Tray" },
    sentence: "A panel that slides in from the edge and covers part of the page.",
    sentenceZh: "从屏幕边缘滑入、盖住页面一部分的面板。",
    prompt:
      "Install UI Lab drawer when a panel slides in from the side and then leaves. A sidebar stays put.",
    promptZh: "面板从侧面滑入、然后再离开，安装 UI Lab 的 drawer。一直留在旁边的是侧边栏。",
    component: {
      category: "motion",
      slug: "drawer",
      previewKey: "motion/drawer",
      installSlug: "drawer",
    },
  },
  {
    slug: "popover",
    group: "overlay",
    name: "Popover",
    nameZh: "气泡",
    aliases: ["flyout", "popup panel", "浮层"],
    confusableWith: ["dropdown-menu", "tooltip"],
    crossNames: { antd: "Popover", shadcn: "Popover", spectrum: "Popover" },
    sentence: "A small panel anchored to the thing that opened it.",
    sentenceZh: "锚在打开它的那一块旁边的小面板。",
    prompt: "Install UI Lab popover for a panel anchored to its trigger.",
    promptZh: "小面板要锚在触发它的那一块旁边时，安装 UI Lab 的 popover。",
    component: {
      category: "motion",
      slug: "popover",
      previewKey: "motion/popover",
      installSlug: "popover",
    },
  },
  {
    slug: "tooltip",
    group: "overlay",
    name: "Tooltip",
    nameZh: "文字提示",
    aliases: ["hint", "hover tip", "气泡提示"],
    confusableWith: ["popover"],
    crossNames: { antd: "Tooltip", shadcn: "Tooltip", spectrum: "Tooltip" },
    sentence: "A short hint that appears on hover or focus.",
    sentenceZh: "悬停或聚焦时出现的一句短提示。",
    prompt: "Install UI Lab tooltip for a short hint on hover or keyboard focus.",
    promptZh: "悬停或键盘聚焦时给一句短提示，安装 UI Lab 的 tooltip。",
    component: {
      category: "motion",
      slug: "tooltip",
      previewKey: "motion/tooltip",
      installSlug: "tooltip",
    },
  },
  {
    slug: "dropdown-menu",
    group: "overlay",
    name: "Dropdown menu",
    nameZh: "下拉菜单",
    aliases: ["pulldown", "弹出菜单", "三个点", "更多菜单", "three dots"],
    confusableWith: ["popover", "select"],
    crossNames: { antd: "Dropdown", shadcn: "Dropdown Menu", spectrum: "Menu" },
    sentence: "A list of commands that opens from a button and closes after a choice.",
    sentenceZh: "从按钮展开的命令列表，选完就收起。",
    prompt: "Install UI Lab dropdown-menu when commands open from a button and close after one is chosen.",
    promptZh: "命令从按钮展开、选完就收起时，安装 UI Lab 的 dropdown-menu。",
    component: {
      category: "motion",
      slug: "dropdown-menu",
      previewKey: "motion/dropdown-menu",
      installSlug: "dropdown-menu",
    },
  },
  {
    slug: "toast",
    group: "overlay",
    name: "Toast",
    nameZh: "提示",
    aliases: ["snackbar", "消息条", "notification", "轻提示"],
    confusableWith: ["alert", "banner"],
    crossNames: { antd: "message / notification", shadcn: "Sonner (toast)", spectrum: "Toast" },
    sentence: "A short message that appears, then leaves on its own.",
    sentenceZh: "短暂出现、然后自己走开的一句消息。",
    prompt: "Install UI Lab animated-toast-stack for a short message that appears and then leaves.",
    promptZh: "一句消息短暂出现再离开，安装 UI Lab 的 animated-toast-stack。",
    component: {
      category: "motion",
      slug: "animated-toast-stack",
      previewKey: "motion/animated-toast-stack",
      installSlug: "animated-toast-stack",
    },
  },
  {
    slug: "alert",
    group: "feedback",
    name: "Alert",
    nameZh: "警告",
    aliases: ["callout", "提示条"],
    confusableWith: ["toast", "banner"],
    crossNames: { antd: "Alert", shadcn: "Alert", spectrum: "InlineAlert" },
    sentence: "A message that stays on the page until the person handles it.",
    sentenceZh: "留在页面上、等人处理的一条消息。",
    prompt:
      "Use an alert for a message that stays in the page. Use a toast when the message should leave on its own.",
    promptZh: "消息要留在页面里用警告。消息自己走开用提示。",
  },
  {
    slug: "badge",
    group: "feedback",
    name: "Badge",
    nameZh: "徽标",
    aliases: ["count", "status dot", "角标", "计数"],
    confusableWith: ["avatar", "tag"],
    crossNames: { antd: "Badge", shadcn: "Badge", spectrum: "Badge" },
    sentence: "A small mark for a count or a status.",
    sentenceZh: "标个数或状态的一小块。",
    prompt: "Install UI Lab animated-badge for a small status or count mark.",
    promptZh: "用一小块标出状态或数量时，安装 UI Lab 的 animated-badge。",
    component: {
      category: "motion",
      slug: "animated-badge",
      previewKey: "motion/animated-badge",
      installSlug: "animated-badge",
    },
  },
  {
    slug: "progress",
    group: "feedback",
    name: "Progress",
    nameZh: "进度",
    aliases: ["progress bar", "进度条", "进度"],
    confusableWith: ["spinner"],
    crossNames: { antd: "Progress", shadcn: "Progress", spectrum: "ProgressBar" },
    sentence: "A bar that shows how far a task has gone.",
    sentenceZh: "一条用来表示事情做到哪的条。",
    prompt:
      "Use a progress bar when you know how much of the task is done. Use a spinner when you only know that it is still working.",
    promptZh: "知道做到多少时用进度条。只知道还在进行时用加载。",
  },
  {
    slug: "spinner",
    group: "feedback",
    name: "Spinner",
    nameZh: "加载",
    aliases: ["loader", "throbber", "忙碌指示", "转圈", "菊花"],
    confusableWith: ["skeleton", "progress"],
    crossNames: { antd: "Spin", shadcn: "Spinner", spectrum: "ProgressCircle" },
    sentence: "A mark that something is still working, without saying how far.",
    sentenceZh: "表示还在进行，但不说出做到多少。",
    prompt: "Install UI Lab loader when work is in progress and the amount done is unknown.",
    promptZh: "还在进行、又不知道做到多少时，安装 UI Lab 的 loader。",
    component: {
      category: "motion",
      slug: "loader",
      previewKey: "motion/loader",
      installSlug: "loader",
    },
  },
  {
    slug: "skeleton",
    group: "feedback",
    name: "Skeleton",
    nameZh: "骨架屏",
    aliases: ["placeholder", "shimmer", "占位", "骨架屏", "灰块", "grey blocks"],
    confusableWith: ["spinner"],
    crossNames: { antd: "Skeleton", shadcn: "Skeleton" },
    sentence: "Gray blocks in the shape of the content that is about to arrive.",
    sentenceZh: "用灰色块先占住即将出现的内容的形状。",
    prompt: "Install UI Lab skeleton while the real content is still loading.",
    promptZh: "真正的内容还在加载时，安装 UI Lab 的 skeleton 先占住形状。",
    component: {
      category: "motion",
      slug: "skeleton",
      previewKey: "motion/skeleton",
      installSlug: "skeleton",
    },
  },
  {
    slug: "empty-state",
    group: "feedback",
    name: "Empty state",
    nameZh: "空状态",
    aliases: ["blank slate", "zero state", "没有内容"],
    sentence: "What the page shows when there is nothing here yet.",
    sentenceZh: "这里还没有东西时，页面给出的说明。",
    prompt: "Install UI Lab empty-state-inbox when a list or page has nothing to show yet.",
    promptZh: "列表或页面还没有内容时，安装 UI Lab 的 empty-state-inbox。",
    component: {
      category: "blocks",
      slug: "empty-state",
      previewKey: "blocks/empty-state-inbox",
      installSlug: "empty-state-inbox",
    },
  },
  {
    slug: "card",
    group: "content",
    name: "Card",
    nameZh: "卡片",
    aliases: ["tile", "panel card"],
    sentence: "A bordered piece of content that can stand on its own.",
    sentenceZh: "自己能成立的一块带边界的内容。",
    prompt:
      "Group a title, a short text, and an action into a card. A tilt or a glare is an effect on a card, not the card itself.",
    promptZh: "把标题、短文和一次操作放进一张卡片。倾斜和眩光是加在卡片上的效果。",
  },
  {
    slug: "table",
    group: "content",
    name: "Table",
    nameZh: "表格",
    aliases: ["data grid", "数据表"],
    sentence: "Rows and columns of records.",
    sentenceZh: "用行和列排起来的记录。",
    prompt: "Install UI Lab table when the person is scanning records in rows and columns.",
    promptZh: "人要按行和列查看记录时，安装 UI Lab 的 table。",
    component: {
      category: "motion",
      slug: "table",
      previewKey: "motion/table",
      installSlug: "table",
    },
  },
  {
    slug: "avatar",
    group: "content",
    name: "Avatar",
    nameZh: "头像",
    aliases: ["profile picture", "用户头像", "头像"],
    confusableWith: ["badge"],
    crossNames: { antd: "Avatar", shadcn: "Avatar", spectrum: "Avatar" },
    sentence: "A picture or initials that stand for a person.",
    sentenceZh: "用图片或首字母代表一个人。",
    prompt: "Use an avatar for a person. Use initials when there is no picture.",
    promptZh: "代表一个人时用头像。没有图片就用姓名的首字母。",
  },
  {
    slug: "tag",
    group: "content",
    name: "Tag",
    nameZh: "标签",
    aliases: ["chip", "pill", "徽章", "标签"],
    confusableWith: ["badge"],
    crossNames: { antd: "Tag", shadcn: "Badge" },
    sentence: "A small label that names a category.",
    sentenceZh: "标出一个分类的小块文字。",
    prompt: "Use a tag to name a category on a piece of content. A badge is for a count or a status.",
    promptZh: "给内容标一个分类用标签。标数量或状态用徽标。",
  },
  {
    slug: "accordion",
    group: "content",
    name: "Accordion",
    nameZh: "手风琴",
    aliases: ["disclosure", "折叠面板", "手风琴"],
    confusableWith: ["collapsible"],
    crossNames: { antd: "Collapse (accordion)", shadcn: "Accordion", spectrum: "Accordion" },
    sentence: "A heading that opens and closes the text under it.",
    sentenceZh: "点标题，展开或收起下面的文字。",
    prompt: "Install UI Lab bouncy-accordion when a heading opens and closes the text under it.",
    promptZh: "点标题展开或收起下面的文字时，安装 UI Lab 的 bouncy-accordion。",
    component: {
      category: "motion",
      slug: "bouncy-accordion",
      previewKey: "motion/bouncy-accordion",
      installSlug: "bouncy-accordion",
    },
  },
  {
    slug: "list",
    group: "content",
    name: "List",
    nameZh: "列表",
    aliases: ["feed", "item rows", "清单"],
    sentence: "Items stacked in a single column.",
    sentenceZh: "在一列里叠起来的条目。",
    prompt: "Use a list when items stack in one column. Use a table when those items have columns to compare.",
    promptZh: "条目只是往下排，用列表。条目有好几列要对着看，用表格。",
  },
  {
    slug: "sheet",
    group: "overlay",
    name: "Sheet",
    nameZh: "底部面板",
    aliases: ["bottom sheet", "action sheet", "动作面板", "底栏浮层"],
    confusableWith: ["dialog", "drawer"],
    crossNames: { antd: "Drawer (placement)", shadcn: "Sheet / Drawer", spectrum: "Tray" },
    sentence: "A light panel that rises from the bottom edge, often draggable, for a short list of actions.",
    sentenceZh: "从底边升起的轻量面板，常可拖动，放几项操作或辅助内容。",
    prompt:
      "Install UI Lab bottom-sheet for a panel that rises from the bottom with snap points and can be dragged away. Use a drawer when a full panel slides in from the side.",
    promptZh:
      "从底部升起、有吸附点、可以拖走的面板，安装 UI Lab 的 bottom-sheet。整块面板从侧边滑入时用抽屉。",
    component: {
      category: "motion",
      slug: "bottom-sheet",
      previewKey: "motion/bottom-sheet",
      installSlug: "bottom-sheet",
    },
  },
  {
    slug: "alert-dialog",
    group: "overlay",
    name: "Alert dialog",
    nameZh: "确认对话框",
    aliases: ["confirm dialog", "确认框", "二次确认"],
    confusableWith: ["dialog"],
    crossNames: { antd: "Modal.confirm / Popconfirm", shadcn: "Alert Dialog", spectrum: "AlertDialog" },
    sentence: "A dialog that stops the person until they choose, usually to confirm something risky.",
    sentenceZh: "必须做出选择才能继续的对话框，多用于确认有风险的操作。",
    prompt:
      "Use an alert dialog with role=\"alertdialog\" for a destructive confirmation: a short title, one sentence on the consequence, Cancel and a danger action. Clicking outside does not close it; Escape cancels.",
    promptZh:
      "删除这类危险操作用确认对话框，role=\"alertdialog\"：短标题、一句后果说明、取消和危险按钮。点外面不关闭，Esc 等于取消。",
  },
  {
    slug: "scrim",
    group: "overlay",
    name: "Scrim",
    nameZh: "遮罩",
    aliases: ["backdrop", "overlay", "蒙层", "灰罩"],
    confusableWith: ["dialog", "drawer"],
    crossNames: { antd: "mask", shadcn: "DialogOverlay", spectrum: "Underlay" },
    sentence: "The dimmed layer behind a dialog or drawer that pushes the page back.",
    sentenceZh: "对话框或抽屉背后那层半透明暗色，把页面往后推。",
    prompt:
      "Put a scrim behind the overlay: a fixed full-screen layer in foreground color at about 40% opacity. Decide whether clicking it closes the overlay, and lock page scroll while it shows.",
    promptZh:
      "在浮层背后加一层遮罩：铺满屏幕、前景色约 40% 透明度。想清楚点遮罩是否关闭浮层，显示期间锁住页面滚动。",
  },
  {
    slug: "segmented-control",
    group: "choice",
    name: "Segmented control",
    nameZh: "分段控件",
    aliases: ["segmented button", "toggle group", "分段选择"],
    confusableWith: ["tabs"],
    crossNames: { antd: "Segmented", shadcn: "Toggle Group", spectrum: "SegmentedControl" },
    sentence: "A compact row of options where exactly one is on, used to switch a view or a value.",
    sentenceZh: "一排紧凑的互斥选项，只能选中一个，用来切换视图或取值。",
    prompt:
      "Use a segmented control with two to five short options and exactly one selected, for example Day / Week / Month. It changes a value on the same view; use tabs when each option owns its own panel.",
    promptZh:
      "用分段控件放二到五个短选项、只选一个，例如日 / 周 / 月。它改的是同一视图里的取值；每个选项各有一块面板时用标签页。",
  },
  {
    slug: "navigation-menu",
    group: "navigation",
    name: "Navigation menu",
    nameZh: "导航菜单",
    aliases: ["nav menu", "mega menu", "顶部导航", "站点导航"],
    confusableWith: ["tabs"],
    crossNames: { antd: "Menu (horizontal)", shadcn: "Navigation Menu", spectrum: "SideNav" },
    sentence: "The site-level links that take a person to other pages, sometimes opening a panel of sub-links.",
    sentenceZh: "站点级的一组链接，去往其他页面，有时展开一块子链接面板。",
    prompt:
      "Build a navigation menu inside <nav> with real links, aria-current on the active page, and an optional panel of sub-links that opens on click or focus. It changes the page; tabs change a panel on the same page.",
    promptZh:
      "在 <nav> 里做导航菜单，用真实链接，当前页带 aria-current，可选一块点击或聚焦展开的子链接面板。它换的是页面；标签页换的是同页面板。",
  },
  {
    slug: "command",
    group: "navigation",
    name: "Command palette",
    nameZh: "命令面板",
    aliases: ["⌘K", "cmd+k", "command menu", "快捷命令"],
    confusableWith: ["combobox"],
    crossNames: { shadcn: "Command", spectrum: "SearchField + Menu" },
    sentence: "A keyboard-first box that opens over everything and runs an action or jumps somewhere by typing.",
    sentenceZh: "按快捷键浮在一切之上的输入框，打几个字就执行操作或跳转。",
    prompt:
      "Install UI Lab command-palette for a ⌘K palette with a fuzzy filter, grouped results and arrow-key navigation. A combobox picks a value for one field; a command palette runs actions.",
    promptZh:
      "要 ⌘K 命令面板、模糊过滤、分组结果和方向键选择，安装 UI Lab 的 command-palette。可输入下拉是给一个字段选值，命令面板是执行操作。",
    component: {
      category: "blocks",
      slug: "command-palette",
      previewKey: "blocks/command-palette",
      installSlug: "command-palette",
    },
  },
  {
    slug: "banner",
    group: "feedback",
    name: "Banner",
    nameZh: "通知横幅",
    aliases: ["announcement bar", "top bar", "公告条", "顶部通知"],
    confusableWith: ["alert", "toast"],
    crossNames: { antd: "Alert (banner)", spectrum: "Banner" },
    sentence: "A full-width strip at the top or bottom of the page that stays until it is dismissed.",
    sentenceZh: "贴在页面顶部或底部的通栏，一直在，直到被关掉。",
    prompt:
      "Add a full-width banner at the top of the page for a site-wide notice, with one short sentence, an optional link and a close button. It persists across pages; an alert sits inside content and a toast disappears on its own.",
    promptZh:
      "在页面顶部加一条通栏通知横幅：一句短话、可选链接和关闭按钮。它跨页面一直在；警示块待在内容里，轻提示会自己消失。",
  },
  {
    slug: "collapsible",
    group: "content",
    name: "Collapsible",
    nameZh: "折叠区",
    aliases: ["expand / collapse", "show more", "展开收起", "disclosure"],
    confusableWith: ["accordion"],
    crossNames: { antd: "Collapse (single panel)", shadcn: "Collapsible", spectrum: "Disclosure" },
    sentence: "One block of content with a trigger that shows or hides it.",
    sentenceZh: "一块内容加一个开关，点一下展开或收起。",
    prompt:
      "Use a collapsible for one section: a button with aria-expanded toggles the content below it. Use an accordion when several such sections sit together as a group.",
    promptZh:
      "单独一块内容用折叠区：带 aria-expanded 的按钮控制下方内容展开收起。好几块并排成组时用折叠面板。",
  },
  {
    slug: "focus-ring",
    group: "jargon",
    name: "Focus ring",
    nameZh: "焦点环",
    aliases: ["focus outline", "focus-visible", "聚焦框", "键盘焦点"],
    crossNames: { antd: "focus outline token", shadcn: "ring", spectrum: "Focus indicator" },
    sentence: "The outline that shows which control the keyboard is on.",
    sentenceZh: "告诉人键盘现在停在哪个控件上的那圈描边。",
    prompt:
      "Give every interactive element a visible focus ring on :focus-visible, a 2px outline with offset in the theme ring color. Never remove the outline without a replacement.",
    promptZh:
      "所有可交互元素在 :focus-visible 时显示焦点环：2px 描边加偏移，用主题的 ring 色。不要去掉 outline 却不给替代。",
  },
  {
    slug: "caret",
    group: "jargon",
    name: "Caret",
    nameZh: "插入符",
    aliases: ["text cursor", "光标", "闪的竖线", "chevron (in menus)"],
    confusableWith: ["text-field"],
    sentence: "The blinking line in a text field where the next character goes. In menus the word also means the small down arrow.",
    sentenceZh: "输入框里一闪一闪、标出下一个字落点的竖线。在菜单里这个词也指那个向下的小箭头。",
    prompt:
      "Style the text caret with caret-color in the primary color. When you mean the small down arrow on a select or menu trigger, say chevron instead of caret.",
    promptZh:
      "用 caret-color 把输入框插入符设成主色。如果指的是下拉触发器上的小箭头，对 AI 说 chevron，不要说 caret。",
  },
];

export function findConcept(slug: string) {
  return CONCEPTS.find((entry) => entry.slug === slug);
}

/** Lower-cased names, slug and aliases with spaces and dashes removed, so
 * colloquial queries such as 三个点 or "grey blocks" find the entry. */
export function conceptHaystack(entry: ConceptEntry) {
  return [entry.slug, entry.name, entry.nameZh, ...entry.aliases]
    .join("|")
    .toLowerCase()
    .replace(/[\s\-_·]+/g, "");
}
