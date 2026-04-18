import { SiteHeader } from "@/components/site-header";
import { getApiBase } from "@/lib/api";
import type { ApiResult, Post } from "@/lib/api-types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPost(id: string): Promise<Post | null> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/api/posts/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiResult<Post>;
    if (json.code !== 0 || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    return { title: "文章未找到" };
  }
  return {
    title: post.title,
    description: post.summary?.trim() ? post.summary.slice(0, 160) : post.title,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) {
    notFound();
  }

  const dateStr = new Date(post.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <article className="mx-auto w-full max-w-3xl px-6 pb-20 pt-12 md:px-10 md:pt-16">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#787878]">Article</p>
        <h1 className="mb-4 text-3xl leading-tight md:text-[2.75rem] md:leading-[1.15]">{post.title}</h1>
        <p className="mb-10 text-sm text-[#737373]">{dateStr}</p>

        {post.summary ? (
          <p className="mb-10 border-l-2 border-[#d4d0c8] pl-4 text-lg leading-relaxed text-[#5a5a5a] md:text-xl">
            {post.summary}
          </p>
        ) : null}

        <div className="article-body whitespace-pre-wrap break-words text-[17px] leading-[1.85] text-[#333] md:text-lg md:leading-[1.9]">
          {post.content.trim() ? post.content : "暂无正文"}
        </div>

        <p className="mt-14 border-t border-[#e8e6e2] pt-10 text-center">
          <Link href="/#posts" className="text-sm text-[#666] hover:text-foreground">
            ← 返回文章列表
          </Link>
        </p>
      </article>
    </div>
  );
}
