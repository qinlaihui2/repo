"use client";

import { SiteHeader } from "@/components/site-header";
import { getApiBase } from "@/lib/api";
import type { ApiResult, LoginData, Post } from "@/lib/api-types";
import { FormEvent, useMemo, useState } from "react";

const apiBase = getApiBase();

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const canCreate = useMemo(() => token && title.trim() && content.trim(), [token, title, content]);

  async function fetchPosts() {
    const res = await fetch(`${apiBase}/api/posts`, { cache: "no-store" });
    const json: ApiResult<Post[]> = await res.json();
    if (json.code === 0) {
      setPosts(json.data ?? []);
    }
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${apiBase}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json: ApiResult<LoginData> = await res.json();
    if (json.code === 0 && json.data?.token) {
      setToken(json.data.token);
      setMessage("登录成功");
      await fetchPosts();
      return;
    }
    setMessage(json.message || "登录失败");
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!canCreate) return;
    const res = await fetch(`${apiBase}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        summary,
        content,
        published: true,
      }),
    });
    const json = await res.json();
    if (json.code === 0) {
      setTitle("");
      setSummary("");
      setContent("");
      setMessage("文章发布成功");
      await fetchPosts();
      return;
    }
    setMessage(json.message || "发布失败");
  }

  async function onDelete(id: number) {
    if (!token) {
      setMessage("请先登录");
      return;
    }
    const res = await fetch(`${apiBase}/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (json.code === 0) {
      setMessage("已删除文章");
      await fetchPosts();
      return;
    }
    setMessage(json.message || "删除失败");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
      <h1 className="mb-2 text-3xl">博客管理台</h1>
      <p className="mb-8 text-sm text-[#666]">
        登录、发文、删文。请勿在公共环境使用弱密码；登录框不会预填任何凭据。
      </p>

      <section className="mag-card mb-6 rounded-xl p-5">
        <h2 className="mb-4 text-xl">1) 登录</h2>
        <form onSubmit={onLogin} className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-md border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="用户名"
            autoComplete="username"
          />
          <input
            className="rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            type="password"
            autoComplete="current-password"
          />
          <button className="rounded-md bg-[#2d2d2d] px-4 py-2 text-white" type="submit">
            登录并加载文章
          </button>
        </form>
        {token ? <p className="mt-3 text-xs text-[#666]">Token 已获取（已隐藏）</p> : null}
      </section>

      <section className="mag-card mb-6 rounded-xl p-5">
        <h2 className="mb-4 text-xl">2) 发布文章</h2>
        <form onSubmit={onCreate} className="space-y-3">
          <input className="w-full rounded-md border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题（必填）" />
          <input className="w-full rounded-md border px-3 py-2" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="摘要（可选）" />
          <textarea className="min-h-36 w-full rounded-md border px-3 py-2" value={content} onChange={(e) => setContent(e.target.value)} placeholder="正文（必填）" />
          <button disabled={!canCreate} className="rounded-md bg-[#2d2d2d] px-4 py-2 text-white disabled:opacity-40" type="submit">
            发布
          </button>
        </form>
      </section>

      <section className="mag-card rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">3) 文章列表</h2>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={fetchPosts} type="button">
            刷新
          </button>
        </div>
        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-[#666]">暂无文章</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-lg border p-4">
                <h3 className="mb-2 text-lg">{post.title}</h3>
                <p className="mb-2 text-sm text-[#666]">{post.summary || "无摘要"}</p>
                <p className="mb-3 text-xs text-[#777]">{new Date(post.createdAt).toLocaleString("zh-CN")}</p>
                <button onClick={() => onDelete(post.id)} className="rounded-md border border-red-400 px-3 py-1 text-sm text-red-600" type="button">
                  删除
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      {message ? <p className="mt-6 text-sm text-[#444]">{message}</p> : null}
    </main>
    </div>
  );
}
