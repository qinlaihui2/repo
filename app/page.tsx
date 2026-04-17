type ApiResult<T> = {
  code: number;
  message: string;
  data: T;
};

type Post = {
  id: number;
  title: string;
  summary: string;
  createdAt: string;
};

async function getPosts(): Promise<Post[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  try {
    const res = await fetch(`${apiBase}/api/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const json: ApiResult<Post[]> = await res.json();
    return json.code === 0 ? json.data ?? [] : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = {
    title: "在春天开始写作：保持表达，保持清醒",
    summary: "把灵感、阅读与技术实践写成可被反复阅读的文字，是个人博客最迷人的长期主义。",
  };

  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="frost-nav sticky top-0 z-50">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <p className="text-lg font-semibold tracking-wide">MyBlog</p>
          <div className="flex items-center gap-6 text-sm text-[#555]">
            <a href="#" className="hover:text-foreground">
              首页
            </a>
            <a href="#" className="hover:text-foreground">
              文章
            </a>
            <a href="#" className="hover:text-foreground">
              关于
            </a>
            <a href="/admin" className="hover:text-foreground">
              管理
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14 md:px-10 md:pt-24">
        <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#787878]">
              Fresh Magazine Style
            </p>
            <h1 className="text-4xl leading-tight md:text-6xl">
              记录技术、阅读和生活的温柔角落
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#5b5b5b] md:text-lg">
              你好，我是 清濑灰二。这里是我的长期写作空间，分享工程实践、内容创作和审美观察。
              希望每次更新，都像翻开一本刚刚印好的独立杂志。
            </p>
          </div>
          <article className="mag-card rounded-2xl p-7">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#7e7a73]">
              Featured
            </p>
            <h2 className="mb-4 text-2xl leading-snug">{featured.title}</h2>
            <p className="text-sm leading-7 text-[#5f5f5f]">{featured.summary}</p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl">最新文章</h3>
            <a href="#" className="text-sm text-[#666] hover:text-foreground">
              查看全部
            </a>
          </div>
          {posts.length === 0 ? (
            <article className="mag-card rounded-xl p-6 text-sm text-[#6a6a6a]">
              暂无文章数据。请先启动后端服务，或在后端新增文章后刷新页面。
            </article>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="mag-card rounded-xl p-5 transition hover:-translate-y-0.5">
                  <p className="mb-3 text-xs tracking-[0.18em] text-[#7f7b74]">最新发布</p>
                  <h4 className="mb-3 text-xl leading-snug">{post.title}</h4>
                  <p className="mb-4 text-sm leading-7 text-[#606060]">{post.summary}</p>
                  <p className="text-sm text-[#696969]">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
