"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({
  href,
  children,
  active,
  nativeAnchor,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  /** 使用 <a>（锚点或外链） */
  nativeAnchor?: boolean;
}) {
  if (active) {
    return <span className="text-foreground">{children}</span>;
  }
  if (nativeAnchor) {
    return (
      <a href={href} className="hover:text-foreground">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="hover:text-foreground">
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isAdmin = pathname === "/admin";
  const postsHref = isHome ? "#posts" : "/#posts";

  return (
    <header className="frost-nav sticky top-0 z-50">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="text-lg font-semibold tracking-wide hover:opacity-90">
          MyBlog
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#555]">
          <NavItem href="/" active={isHome}>
            首页
          </NavItem>
          <NavItem href={postsHref} nativeAnchor>
            文章
          </NavItem>
          <NavItem href="/about" active={isAbout}>
            关于
          </NavItem>
          <NavItem href="/admin" active={isAdmin}>
            管理
          </NavItem>
        </div>
      </nav>
    </header>
  );
}
