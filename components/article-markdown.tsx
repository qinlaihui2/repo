import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrismPlus from "rehype-prism-plus";
import { CodeBlock } from "@/components/code-block";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * 文章 Markdown 正文：GFM + Prism 高亮；代码块语言由 ```lang 标识。
 * rehype-prism-plus 会为 code 打上 language-xxx，需配合 prism 主题 CSS。
 */
export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <div className="article-markdown text-[17px] leading-[1.85] text-[#333] md:text-lg md:leading-[1.9] dark:text-[#e8e6e3]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypePrismPlus, { ignoreMissing: true }]]}
        components={{
          pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
            return <CodeBlock {...props}>{children as ReactNode}</CodeBlock>;
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
            return <p className="mb-6 last:mb-0 [&+p]:mt-0">{children}</p>;
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
          code({ className, children }) {
            const isFenced = Boolean(className?.startsWith("language-"));
            if (isFenced) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code className="rounded-md bg-muted/90 px-1.5 py-0.5 font-mono text-[0.88em] text-foreground dark:bg-muted">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
