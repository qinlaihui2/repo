import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { AssistantWidget } from "@/components/assistant-widget";
import { ReadingProgress } from "@/components/reading-progress";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "MyBlog | 清新杂志风博客",
    template: "%s | MyBlog",
  },
  description: "清新杂志风全栈个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={cn("h-full", "antialiased", inter.variable, playfair.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col">
        <ReadingProgress />
        {children}
        <AssistantWidget />
      </body>
    </html>
  );
}
