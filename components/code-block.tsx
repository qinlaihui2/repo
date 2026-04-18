"use client";

import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef, useCallback, useRef, useState } from "react";

/** 代码块外壳：右上角复制（配合 react-markdown 的 pre） */
export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const text = ref.current?.innerText ?? "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="code-block-shell group relative my-6 overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={copy}
        className={cn(
          "absolute right-2 top-2 z-10 rounded-md border border-border px-2 py-1 text-xs",
          "bg-background/90 text-muted-foreground shadow-sm backdrop-blur-sm",
          "transition hover:bg-muted hover:text-foreground"
        )}
      >
        {copied ? "已复制" : "复制"}
      </button>
      <pre
        ref={ref}
        className={cn(
          "m-0 overflow-x-auto p-4 pb-4 pr-4 pt-10 text-[13px] leading-relaxed md:text-sm",
          "[&>code]:bg-transparent [&>code]:p-0",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
