"use client";

import { useEffect, useState } from "react";

/** 顶部阅读进度条，宽度随页面滚动比例变化（3px） */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight;
      if (h <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Math.min(1, Math.max(0, el.scrollTop / h)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
