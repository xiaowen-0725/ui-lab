"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Allowlisted HTML/JSX renderer — no react-jsx-parser runtime.

import { AlertCircle } from "lucide-react";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface JSXPreviewContextValue {
  jsx: string;
  processedJsx: string;
  isStreaming: boolean;
  error: Error | null;
}

const JSXPreviewContext = createContext<JSXPreviewContextValue | null>(null);

const TAG_REGEX = /<\/?([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*?)(\/)?>/;

export function useJSXPreview() {
  const context = useContext(JSXPreviewContext);
  if (!context) {
    throw new Error("JSXPreview components must be used within JSXPreview");
  }
  return context;
}

const matchJsxTag = (code: string) => {
  if (code.trim() === "") return null;
  const match = code.match(TAG_REGEX);
  if (!match || match.index === undefined) return null;

  const [fullMatch, tagName, attributes, selfClosing] = match;
  let type: "self-closing" | "closing" | "opening";
  if (selfClosing) type = "self-closing";
  else if (fullMatch.startsWith("</")) type = "closing";
  else type = "opening";

  return {
    attributes: attributes.trim(),
    endIndex: match.index + fullMatch.length,
    startIndex: match.index,
    tag: fullMatch,
    tagName,
    type,
  };
};

const stripIncompleteTag = (text: string) => {
  const lastOpen = text.lastIndexOf("<");
  if (lastOpen === -1) return text;
  const afterOpen = text.slice(lastOpen);
  if (!afterOpen.includes(">")) return text.slice(0, lastOpen);
  return text;
};

export function completeJsxTag(code: string) {
  const stack: string[] = [];
  let result = "";
  let currentPosition = 0;

  while (currentPosition < code.length) {
    const match = matchJsxTag(code.slice(currentPosition));
    if (!match) {
      result += stripIncompleteTag(code.slice(currentPosition));
      break;
    }
    const { tagName, type, endIndex } = match;
    result += code.slice(currentPosition, currentPosition + endIndex);
    if (type === "opening") stack.push(tagName);
    else if (type === "closing") stack.pop();
    currentPosition += endIndex;
  }

  return `${result}${stack.toReversed().map((tag) => `</${tag}>`).join("")}`;
}

const ALLOWED_TAGS = new Set([
  "a",
  "article",
  "button",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "header",
  "img",
  "li",
  "ol",
  "p",
  "section",
  "small",
  "span",
  "strong",
  "ul",
]);

const ALLOWED_ATTRS = new Set(["class", "classname", "href", "src", "alt", "width", "height"]);

function attrName(name: string) {
  if (name === "classname" || name === "class") return "className";
  return name;
}

function isSafeUrl(value: string) {
  return /^(https?:|\/|#)/i.test(value);
}

function nodeToReact(node: ChildNode, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) return null;

  const props: Record<string, string | number> = { key };
  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase();
    if (!ALLOWED_ATTRS.has(name)) continue;
    if ((name === "href" || name === "src") && !isSafeUrl(attribute.value)) continue;
    props[attrName(name)] = attribute.value;
  }

  const children = Array.from(element.childNodes).map((child, index) =>
    nodeToReact(child, index),
  );

  if (tag === "img") {
    return createElement("img", { ...props, alt: props.alt ?? "" });
  }

  return createElement(tag, props, ...children);
}

export function renderAllowlistedJsx(jsx: string): ReactNode {
  if (typeof DOMParser === "undefined") return jsx;
  const prepared = jsx
    .replace(/\bclassName=/g, "class=")
    .replace(/\{['"]([^'"]+)['"]\}/g, "$1");
  const document = new DOMParser().parseFromString(
    `<div data-jsx-root="true">${prepared}</div>`,
    "text/html",
  );
  const root = document.body.firstElementChild;
  if (!root) return null;
  return Array.from(root.childNodes).map((child, index) => nodeToReact(child, index));
}

export interface JSXPreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  jsx: string;
  isStreaming?: boolean;
  onError?: (error: Error) => void;
}

export function JSXPreview({
  jsx,
  isStreaming = false,
  onError,
  className,
  children,
  ...props
}: JSXPreviewProps) {
  const [error] = useState<Error | null>(null);
  void onError;
  const processedJsx = useMemo(
    () => (isStreaming ? completeJsxTag(jsx) : jsx),
    [jsx, isStreaming],
  );

  const contextValue = useMemo(
    () => ({ error, isStreaming, jsx, processedJsx }),
    [error, isStreaming, jsx, processedJsx],
  );

  return (
    <JSXPreviewContext.Provider value={contextValue}>
      <div
        className={cn("relative", className)}
        data-jsx-error={error ? "true" : undefined}
        {...props}
      >
        {children}
      </div>
    </JSXPreviewContext.Provider>
  );
}

export interface JSXPreviewContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {}

export function JSXPreviewContent({ className, ...props }: JSXPreviewContentProps) {
  const { processedJsx, isStreaming } = useJSXPreview();
  const [nodes, setNodes] = useState<ReactNode>(null);

  useEffect(() => {
    try {
      setNodes(renderAllowlistedJsx(processedJsx));
    } catch {
      if (!isStreaming) setNodes(null);
    }
  }, [processedJsx, isStreaming]);

  return (
    <div className={cn("jsx-preview-content", className)} {...props}>
      {nodes}
    </div>
  );
}

export interface JSXPreviewErrorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode | ((error: Error) => ReactNode);
}

export function JSXPreviewError({
  className,
  children,
  ...props
}: JSXPreviewErrorProps) {
  const { error } = useJSXPreview();
  if (!error) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive",
        className,
      )}
      {...props}
    >
      {typeof children === "function" ? (
        children(error)
      ) : children ? (
        children
      ) : (
        <>
          <AlertCircle className="size-4 shrink-0" />
          <span>{error.message}</span>
        </>
      )}
    </div>
  );
}
