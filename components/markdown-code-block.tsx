"use client";

import { cn } from "@/lib/utils";
import { useCallback, useState, useSyncExternalStore } from "react";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

function subscribePrefersDark(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshotPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * 带复制、随系统深/浅色切换的代码块（react-syntax-highlighter / Prism）
 */
export function MarkdownCodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const dark = useSyncExternalStore(subscribePrefersDark, getSnapshotPrefersDark, getServerSnapshot);
  const style = dark ? oneDark : oneLight;

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="not-prose group relative my-6 overflow-hidden rounded-lg border border-border bg-card text-left">
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "absolute right-2 top-2 z-10 rounded-md border border-border px-2 py-1 text-xs",
          "bg-background/90 text-muted-foreground shadow-sm backdrop-blur-sm",
          "transition hover:bg-muted hover:text-foreground"
        )}
      >
        {copied ? "已复制" : "复制"}
      </button>
      <SyntaxHighlighter
        language={language || "text"}
        style={style}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "2.5rem 1rem 1rem 1rem",
          fontSize: "0.8125rem",
          lineHeight: 1.7,
          borderRadius: "0.5rem",
          background: "transparent",
        }}
        codeTagProps={{
          className: "font-mono",
        }}
        showLineNumbers={code.split("\n").length > 2}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
