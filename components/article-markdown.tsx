"use client";

import { MarkdownCodeBlock } from "@/components/markdown-code-block";
import { normalizeMarkdownForCodeFences } from "@/lib/normalize-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

type CodeProps = {
  className?: string;
  children?: ReactNode;
  node?: unknown;
};

/**
 * 将后端 content 按 Markdown 渲染；代码块用 react-syntax-highlighter，语言由 ```lang 指定。
 */
export function ArticleMarkdown({ content }: { content: string }) {
  const md = normalizeMarkdownForCodeFences(content);

  return (
    <div className="article-markdown text-[17px] leading-[1.85] text-[#333] md:text-lg md:leading-[1.9] dark:text-[#e8e6e3]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 避免再包一层 <pre>，由代码块组件自己布局
          pre({ children }) {
            return <div className="not-prose contents">{children as ReactNode}</div>;
          },
          code({ className, children }: CodeProps) {
            const text = String(children).replace(/\n$/, "");
            const match = /language-(\w+)/.exec(className ?? "");
            const language = match?.[1];
            // 有 language- 或 多行无语言标识的围栏，都走高亮
            if (language) {
              return <MarkdownCodeBlock language={language} code={text} />;
            }
            if (text.includes("\n")) {
              return <MarkdownCodeBlock language="text" code={text} />;
            }
            return (
              <code className="rounded-md bg-muted/90 px-1.5 py-0.5 font-mono text-[0.88em] text-foreground dark:bg-muted">
                {children}
              </code>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mt-12 mb-4 font-serif text-2xl font-medium text-foreground first:mt-0">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return <h3 className="mt-10 mb-3 font-serif text-xl font-medium text-foreground">{children}</h3>;
          },
          p({ children }) {
            return <p className="mb-6 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-6 list-disc space-y-2 pl-6 marker:text-[#888]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-6 list-decimal space-y-2 pl-6 marker:text-[#888]">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="mb-6 border-l-2 border-[#d4d0c8] pl-4 text-[#5a5a5a] italic dark:border-[#555] dark:text-[#b8b6b3]">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-foreground underline decoration-[#ccc] underline-offset-4 transition hover:decoration-foreground"
              >
                {children}
              </a>
            );
          },
          hr() {
            return <hr className="my-10 border-border" />;
          },
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-left text-[0.95em]">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="border-b border-border bg-muted/50 px-3 py-2 font-medium">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-border px-3 py-2">{children}</td>;
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
