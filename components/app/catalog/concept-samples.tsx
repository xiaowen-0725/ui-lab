"use client";

import { Eye, EyeOff, MoreVertical, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { Input } from "@/components/motion/input";
import { Loader } from "@/components/motion/loader";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";
import { Skeleton } from "@/components/motion/skeleton";
import { Switch } from "@/components/motion/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { cn } from "@/lib/utils";

const btn =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm text-foreground";
const field =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none";

function useZh() {
  return useLocale() === "zh";
}

function IconButtonSample() {
  const zh = useZh();
  return (
    <button type="button" className={cn(btn, "w-9 px-0")} aria-label={zh ? "编辑" : "Edit"}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </button>
  );
}

function LinkSample() {
  const zh = useZh();
  return (
    <a href="#concept-link" className="text-sm text-foreground underline underline-offset-4">
      {zh ? "查看文档" : "Read the docs"}
    </a>
  );
}

function TextAreaSample() {
  const zh = useZh();
  return (
    <textarea
      rows={4}
      className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
      defaultValue={zh ? "可以写下多行。" : "Write more than one line."}
      aria-label={zh ? "多行输入" : "Text area"}
    />
  );
}

function SearchFieldSample() {
  const zh = useZh();
  return (
    <form className="flex w-full max-w-sm gap-2" action="#concept-search">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{zh ? "搜索" : "Search"}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input className={cn(field, "pl-9")} type="search" placeholder={zh ? "搜索" : "Search"} />
      </label>
      <button type="submit" className={btn}>{zh ? "搜索" : "Search"}</button>
    </form>
  );
}

function PasswordFieldSample() {
  const zh = useZh();
  const [shown, setShown] = useState(false);
  return (
    <div className="flex w-full max-w-sm gap-2">
      <label className="min-w-0 flex-1">
        <span className="sr-only">{zh ? "密码" : "Password"}</span>
        <input className={field} type={shown ? "text" : "password"} defaultValue="secret" />
      </label>
      <button
        type="button"
        className={cn(btn, "w-9 px-0")}
        aria-label={shown ? (zh ? "隐藏密码" : "Hide password") : zh ? "显示密码" : "Show password"}
        aria-pressed={shown}
        onClick={() => setShown((value) => !value)}
      >
        {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ComboboxSample() {
  const zh = useZh();
  const options = useMemo(
    () => (zh ? ["按钮", "侧边栏", "抽屉", "表格"] : ["Button", "Sidebar", "Drawer", "Table"]),
    [zh],
  );
  const [query, setQuery] = useState("");
  const matches = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="w-full max-w-sm">
      <label>
        <span className="sr-only">{zh ? "组合框" : "Combobox"}</span>
        <input
          className={field}
          role="combobox"
          aria-expanded={matches.length > 0}
          aria-controls="concept-combobox-list"
          value={query}
          placeholder={zh ? "输入或选择" : "Type or choose"}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <ul id="concept-combobox-list" className="mt-2 overflow-hidden rounded-lg border border-border bg-card">
        {matches.map((option) => (
          <li key={option}>
            <button type="button" className="block w-full px-3 py-2 text-left text-sm hover:bg-foreground/5" onClick={() => setQuery(option)}>
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarSample() {
  const zh = useZh();
  const items = zh ? ["首页", "组件", "文档"] : ["Home", "Components", "Docs"];
  return (
    <div className="flex h-40 w-full max-w-md overflow-hidden rounded-xl border border-border">
      <nav aria-label={zh ? "侧边栏" : "Sidebar"} className="w-28 border-r border-border bg-card p-2">
        {items.map((item, index) => (
          <a key={item} href={`#side-${index}`} className={cn("block rounded-md px-2 py-1.5 text-sm", index === 0 ? "bg-foreground/5 text-foreground" : "text-muted-foreground")}>
            {item}
          </a>
        ))}
      </nav>
      <div className="flex-1 p-3 text-sm text-muted-foreground">{zh ? "页面内容" : "Page"}</div>
    </div>
  );
}

function HeaderSample() {
  const zh = useZh();
  const links = zh ? ["组件", "词典"] : ["Components", "Dictionary"];
  return (
    <header className="flex h-12 w-full max-w-md items-center gap-4 rounded-xl border border-border bg-card px-3">
      <span className="text-sm font-medium">{zh ? "组件实验室" : "UI Lab"}</span>
      <nav aria-label={zh ? "顶栏" : "Header"} className="flex gap-3 text-sm text-muted-foreground">
        {links.map((link) => (
          <a key={link} href={`#header-${link}`} className="hover:text-foreground">{link}</a>
        ))}
      </nav>
    </header>
  );
}

function BreadcrumbSample() {
  const zh = useZh();
  const crumbs = zh ? ["首页", "组件", "按钮"] : ["Home", "Components", "Button"];
  return (
    <nav aria-label={zh ? "面包屑" : "Breadcrumb"}>
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => (
          <li key={crumb} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {index === crumbs.length - 1 ? (
              <span className="text-foreground">{crumb}</span>
            ) : (
              <a href={`#crumb-${index}`} className="hover:text-foreground">{crumb}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PaginationSample() {
  const zh = useZh();
  const [page, setPage] = useState(1);
  return (
    <nav aria-label={zh ? "分页" : "Pagination"} className="flex gap-1">
      {[1, 2, 3].map((number) => (
        <button
          key={number}
          type="button"
          aria-current={page === number ? "page" : undefined}
          className={cn(btn, "w-9 px-0", page === number && "bg-foreground text-background")}
          onClick={() => setPage(number)}
        >
          {number}
        </button>
      ))}
    </nav>
  );
}

function HamburgerSample() {
  const zh = useZh();
  const [open, setOpen] = useState(false);
  const items = zh ? ["组件", "词典", "文档"] : ["Components", "Dictionary", "Docs"];
  return (
    <div className="w-44">
      <button
        type="button"
        className={cn(btn, "w-9 px-0")}
        aria-expanded={open}
        aria-label={zh ? "菜单" : "Menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {open ? (
        <ul className="mt-2 rounded-lg border border-border bg-card p-1">
          {items.map((item) => (
            <li key={item}>
              <a href={`#ham-${item}`} className="block rounded-md px-2 py-1.5 text-sm hover:bg-foreground/5">{item}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function KebabSample() {
  const zh = useZh();
  const [open, setOpen] = useState(false);
  const items = zh ? ["编辑", "删除"] : ["Edit", "Delete"];
  return (
    <div className="relative">
      <button
        type="button"
        className={cn(btn, "w-9 px-0")}
        aria-expanded={open}
        aria-label={zh ? "更多" : "More"}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <ul className="absolute left-0 top-11 z-10 w-28 rounded-lg border border-border bg-card p-1 shadow-lg">
          {items.map((item) => (
            <li key={item}>
              <button type="button" className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-foreground/5" onClick={() => setOpen(false)}>
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DialogSample() {
  const zh = useZh();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex min-h-40 w-full items-center justify-center">
      <button type="button" className={btn} onClick={() => setOpen(true)}>
        {zh ? "打开对话框" : "Open dialog"}
      </button>
      {open ? (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
          <div role="dialog" aria-modal="true" aria-labelledby="concept-dialog-title" className="w-64 rounded-xl border border-border bg-card p-4">
            <h3 id="concept-dialog-title" className="text-sm font-medium text-foreground">
              {zh ? "确认" : "Confirm"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{zh ? "要继续吗？" : "Continue?"}</p>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" className={btn} onClick={() => setOpen(false)}>{zh ? "取消" : "Cancel"}</button>
              <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={() => setOpen(false)}>{zh ? "继续" : "Continue"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AlertSample() {
  const zh = useZh();
  return (
    <div role="status" className="w-full max-w-sm rounded-lg border border-border border-l-4 bg-card px-3 py-2 text-sm">
      {zh ? "保存前还有一项没填。" : "One field is still empty."}
    </div>
  );
}

function ProgressSample() {
  const zh = useZh();
  return (
    <div className="w-full max-w-sm" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label={zh ? "进度" : "Progress"}>
      <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
        <div className="h-full w-3/5 rounded-full bg-foreground" />
      </div>
    </div>
  );
}

function CardSample() {
  const zh = useZh();
  return (
    <article className="w-full max-w-xs rounded-2xl border border-border bg-card p-4">
      <h3 className="text-sm font-medium">{zh ? "发布说明" : "Release notes"}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{zh ? "这一版加上了词典。" : "This version adds the dictionary."}</p>
      <button type="button" className={cn(btn, "mt-3")}>{zh ? "查看" : "View"}</button>
    </article>
  );
}

function AvatarSample() {
  const zh = useZh();
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-sm font-medium" aria-hidden="true">A</span>
      <span className="text-sm">{zh ? "阿宁" : "Anning"}</span>
    </div>
  );
}

function TagSample() {
  const zh = useZh();
  const tags = zh ? ["导航", "反馈"] : ["Navigation", "Feedback"];
  return (
    <ul className="flex gap-2" aria-label={zh ? "标签" : "Tags"}>
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-border px-2.5 py-1 text-xs">{tag}</li>
      ))}
    </ul>
  );
}

function ListSample() {
  const zh = useZh();
  const items = zh ? ["按钮", "侧边栏", "抽屉"] : ["Button", "Sidebar", "Drawer"];
  return (
    <ul className="w-full max-w-xs divide-y divide-border rounded-xl border border-border">
      {items.map((item) => (
        <li key={item} className="px-3 py-2 text-sm">{item}</li>
      ))}
    </ul>
  );
}

const SAMPLES = {
  "icon-button": IconButtonSample,
  link: LinkSample,
  "text-area": TextAreaSample,
  "search-field": SearchFieldSample,
  "password-field": PasswordFieldSample,
  combobox: ComboboxSample,
  sidebar: SidebarSample,
  header: HeaderSample,
  breadcrumb: BreadcrumbSample,
  pagination: PaginationSample,
  hamburger: HamburgerSample,
  kebab: KebabSample,
  dialog: DialogSample,
  alert: AlertSample,
  progress: ProgressSample,
  card: CardSample,
  avatar: AvatarSample,
  tag: TagSample,
  list: ListSample,
} as const;

export function ConceptSample({ slug }: { slug: string }) {
  const Sample = SAMPLES[slug as keyof typeof SAMPLES];
  if (!Sample) return null;
  return <Sample />;
}

function ButtonFace() {
  const zh = useZh();
  return <Button>{zh ? "继续" : "Continue"}</Button>;
}

function IconButtonFace() {
  return <IconButtonSample />;
}

function TextFieldFace() {
  const zh = useZh();
  return <Input className="w-52" placeholder={zh ? "邮箱" : "Email"} />;
}

function CheckboxFace() {
  const zh = useZh();
  return <Checkbox checked onCheckedChange={() => undefined} label={zh ? "记住我" : "Remember me"} />;
}

function RadioFace() {
  const zh = useZh();
  return (
    <RadioGroup defaultValue="a" orientation="horizontal">
      <RadioGroupItem value="a" label={zh ? "浅色" : "Light"} />
      <RadioGroupItem value="b" label={zh ? "深色" : "Dark"} />
    </RadioGroup>
  );
}

function SwitchFace() {
  const zh = useZh();
  return <Switch checked onCheckedChange={() => undefined} label={zh ? "通知" : "Notifications"} />;
}

function SelectFace() {
  const zh = useZh();
  return (
    <div className="flex h-10 w-44 items-center justify-between rounded-lg border border-border bg-card px-3 text-sm">
      <span>{zh ? "中文" : "Chinese"}</span>
      <span aria-hidden="true" className="text-muted-foreground">⌄</span>
    </div>
  );
}

function SliderFace() {
  return (
    <div className="relative h-1.5 w-44 rounded-full bg-foreground/15">
      <div className="absolute inset-y-0 left-0 w-3/5 rounded-full bg-foreground" />
      <div className="absolute top-1/2 left-3/5 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card" />
    </div>
  );
}

function TextAreaFace() {
  const zh = useZh();
  return (
    <textarea
      rows={2}
      readOnly
      className="w-52 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
      value={zh ? "可以写下多行。" : "More than one line."}
      aria-label={zh ? "多行输入" : "Text area"}
    />
  );
}

function SearchFace() {
  const zh = useZh();
  return (
    <div className="relative w-52">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input className={cn(field, "pl-9")} readOnly value={zh ? "按钮" : "Button"} aria-label={zh ? "搜索" : "Search"} />
    </div>
  );
}

function ComboFace() {
  const zh = useZh();
  return (
    <div className="w-44">
      <input className={field} readOnly value={zh ? "抽" : "Dr"} aria-label={zh ? "组合框" : "Combobox"} />
      <div className="mt-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm">{zh ? "抽屉" : "Drawer"}</div>
    </div>
  );
}

function SidebarFace() {
  const zh = useZh();
  const items = zh ? ["首页", "组件"] : ["Home", "Components"];
  return (
    <div className="flex h-20 w-52 overflow-hidden rounded-lg border border-border">
      <div className="w-20 border-r border-border bg-card p-1.5">
        {items.map((item, index) => (
          <div key={item} className={cn("rounded px-1.5 py-1 text-xs", index === 0 ? "bg-foreground/5" : "text-muted-foreground")}>{item}</div>
        ))}
      </div>
      <div className="flex-1 bg-foreground/5" />
    </div>
  );
}

function HeaderFace() {
  const zh = useZh();
  return (
    <div className="flex h-10 w-56 items-center gap-3 rounded-lg border border-border bg-card px-3 text-sm">
      <span className="font-medium">{zh ? "实验室" : "UI Lab"}</span>
      <span className="text-muted-foreground">{zh ? "组件" : "Components"}</span>
      <span className="text-muted-foreground">{zh ? "词典" : "Dictionary"}</span>
    </div>
  );
}

function CardFace() {
  const zh = useZh();
  return (
    <div className="w-44 rounded-xl border border-border bg-card p-3">
      <p className="text-sm font-medium">{zh ? "发布说明" : "Release notes"}</p>
      <p className="mt-1 text-xs text-muted-foreground">{zh ? "这一版加上了词典。" : "Dictionary is in."}</p>
    </div>
  );
}

function TabsFace() {
  const zh = useZh();
  return (
    <Tabs defaultValue="a" variant="pill">
      <TabsList>
        <TabsTrigger value="a">{zh ? "概述" : "Overview"}</TabsTrigger>
        <TabsTrigger value="b">{zh ? "记录" : "Activity"}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function MenuFace() {
  const zh = useZh();
  const items = zh ? ["复制", "重命名", "删除"] : ["Copy", "Rename", "Delete"];
  return (
    <ul className="w-32 rounded-lg border border-border bg-card p-1 shadow-sm">
      {items.map((item, index) => (
        <li key={item} className={cn("rounded-md px-2 py-1 text-sm", index === 0 && "bg-foreground/5")}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function DialogFace() {
  const zh = useZh();
  return (
    <div className="w-48 rounded-xl border border-border bg-card p-3 shadow-sm">
      <p className="text-sm font-medium">{zh ? "确认" : "Confirm"}</p>
      <p className="mt-1 text-xs text-muted-foreground">{zh ? "要继续吗？" : "Continue?"}</p>
      <div className="mt-2 flex justify-end gap-1.5">
        <span className="rounded-md border border-border px-2 py-1 text-xs">{zh ? "取消" : "Cancel"}</span>
        <span className="rounded-md bg-foreground px-2 py-1 text-xs text-background">{zh ? "继续" : "Continue"}</span>
      </div>
    </div>
  );
}

function DrawerFace() {
  const zh = useZh();
  return (
    <div className="flex h-24 w-56 overflow-hidden rounded-lg border border-border">
      <div className="flex-1 bg-foreground/5" />
      <div className="flex w-24 flex-col gap-1 border-l border-border bg-card p-2">
        <span className="text-xs font-medium">{zh ? "筛选" : "Filters"}</span>
        <span className="h-2 w-full rounded bg-foreground/10" />
        <span className="h-2 w-2/3 rounded bg-foreground/10" />
      </div>
    </div>
  );
}

function PopoverFace() {
  const zh = useZh();
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm">
      {zh ? "已复制" : "Copied"}
    </div>
  );
}

function TooltipFace() {
  const zh = useZh();
  return (
    <div className="rounded-md bg-foreground px-2 py-1 text-xs text-background">
      {zh ? "保存草稿" : "Save draft"}
    </div>
  );
}

function ToastFace() {
  const zh = useZh();
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-sm">
      {zh ? "已保存" : "Saved"}
    </div>
  );
}

function AlertFace() {
  return <AlertSample />;
}

function BadgeFace() {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[11px] font-medium text-background">
      3
    </span>
  );
}

function ProgressFace() {
  return <ProgressSample />;
}

function SpinnerFace() {
  return <Loader variant="spinner" size={28} />;
}

function SkeletonFace() {
  return (
    <div className="flex w-40 items-center gap-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-2/3" />
      </div>
    </div>
  );
}

function EmptyFace() {
  const zh = useZh();
  return (
    <div className="text-center">
      <div className="mx-auto h-8 w-8 rounded-full border border-dashed border-border" />
      <p className="mt-2 text-xs text-muted-foreground">{zh ? "这里还没有内容" : "Nothing here yet"}</p>
    </div>
  );
}

function TableFace() {
  return (
    <div className="w-44 overflow-hidden rounded-lg border border-border text-xs">
      <div className="grid grid-cols-3 bg-foreground/5 px-2 py-1 font-medium">
        <span>A</span><span>B</span><span>C</span>
      </div>
      <div className="grid grid-cols-3 border-t border-border px-2 py-1"><span>1</span><span>2</span><span>3</span></div>
      <div className="grid grid-cols-3 border-t border-border px-2 py-1"><span>4</span><span>5</span><span>6</span></div>
    </div>
  );
}

function AccordionFace() {
  const zh = useZh();
  return (
    <div className="w-44 rounded-lg border border-border text-sm">
      <div className="flex items-center justify-between px-3 py-1.5 font-medium">
        <span>{zh ? "尺寸" : "Size"}</span>
        <span aria-hidden="true">–</span>
      </div>
      <p className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">{zh ? "中号，适合表单。" : "Medium, for forms."}</p>
      <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-muted-foreground">
        <span>{zh ? "颜色" : "Color"}</span>
        <span aria-hidden="true">+</span>
      </div>
    </div>
  );
}

const FACES = {
  button: ButtonFace,
  "icon-button": IconButtonFace,
  link: LinkSample,
  "text-field": TextFieldFace,
  "text-area": TextAreaFace,
  "search-field": SearchFace,
  "password-field": PasswordFieldSample,
  checkbox: CheckboxFace,
  radio: RadioFace,
  switch: SwitchFace,
  select: SelectFace,
  combobox: ComboFace,
  slider: SliderFace,
  sidebar: SidebarFace,
  header: HeaderFace,
  tabs: TabsFace,
  breadcrumb: BreadcrumbSample,
  pagination: PaginationSample,
  menu: MenuFace,
  hamburger: HamburgerSample,
  kebab: KebabSample,
  dialog: DialogFace,
  drawer: DrawerFace,
  popover: PopoverFace,
  tooltip: TooltipFace,
  "dropdown-menu": MenuFace,
  toast: ToastFace,
  alert: AlertFace,
  badge: BadgeFace,
  progress: ProgressFace,
  spinner: SpinnerFace,
  skeleton: SkeletonFace,
  "empty-state": EmptyFace,
  card: CardFace,
  table: TableFace,
  avatar: AvatarSample,
  tag: TagSample,
  accordion: AccordionFace,
  list: ListSample,
} as const;

export function ConceptCardFace({ slug }: { slug: string }) {
  const Face = FACES[slug as keyof typeof FACES];
  if (!Face) return null;
  return <Face />;
}
