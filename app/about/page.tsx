import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "关于我",
  description: "软件开发爱好者 · 个人博客与写作空间",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-6 pb-16 pt-14 md:px-10 md:pt-20">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#787878]">About</p>
        <h1 className="mb-8 text-4xl leading-tight md:text-5xl">关于我</h1>

        <article className="mag-card rounded-2xl p-8 md:p-10">
          <p className="mb-6 text-base leading-8 text-[#5b5b5b] md:text-lg">
            你好，我是一名<strong className="font-medium text-foreground">软件开发爱好者</strong>
            ，喜欢写代码、折腾小项目，也乐于把学习与实践记录下来。
          </p>
          <p className="mb-6 text-base leading-8 text-[#5b5b5b] md:text-lg">
            这个博客是我长期写作与分享的空间，欢迎你常来看看。
          </p>
          <div className="border-t border-[#e8e6e2] pt-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[#7e7a73]">联系</p>
            <p className="mt-2 text-lg tracking-wide text-foreground">
              QQ：<span className="font-mono tabular-nums">21888926911</span>
            </p>
          </div>
        </article>

        <p className="mt-10 text-center">
          <Link href="/" className="text-sm text-[#666] hover:text-foreground">
            ← 返回首页
          </Link>
        </p>
      </main>
    </div>
  );
}
