import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function PostNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 py-20 text-center md:px-10">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#787878]">404</p>
        <h1 className="mb-4 text-2xl">找不到这篇文章</h1>
        <p className="mb-10 text-sm text-[#666]">可能已被删除或链接有误。</p>
        <Link href="/" className="text-sm text-[#444] underline underline-offset-4 hover:text-foreground">
          回到首页
        </Link>
      </main>
    </div>
  );
}
