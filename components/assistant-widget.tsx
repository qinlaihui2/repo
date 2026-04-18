"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Send, Trash2, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type Msg = { role: Role; content: string };

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const nextMsgs: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(nextMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const json = (await res.json()) as { message?: string; error?: string; detail?: string };
      if (!res.ok) {
        throw new Error(json.error || json.detail || `请求失败 (${res.status})`);
      }
      const reply = json.message?.trim();
      if (!reply) throw new Error("未收到回复");
      setMsgs([...nextMsgs, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "发送失败";
      setError(msg);
      setMsgs(nextMsgs.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send();
  }

  function clearChat() {
    setMsgs([]);
    setError(null);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-[95] flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition",
          "border border-[#e9e4db] bg-[#fffdf9] text-[#2d2d2d] hover:bg-[#f5f2eb]",
          "dark:border-[#333] dark:bg-[#252525] dark:text-[#eee] dark:hover:bg-[#333]"
        )}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <MessageCircle className="h-5 w-5" aria-hidden />}
        <span className="sr-only">{open ? "关闭答案之书" : "打开答案之书"}</span>
      </button>

      {open ? (
        <div
          id="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label="答案之书"
          className={cn(
            "fixed bottom-[5.25rem] right-6 z-[95] flex max-h-[min(420px,70vh)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl shadow-xl",
            "border border-[#e9e4db] bg-[#fffdf9] dark:border-[#333] dark:bg-[#1c1c1c]"
          )}
        >
          <div className="flex items-center justify-between border-b border-[#ebe6df] px-4 py-3 dark:border-[#333]">
            <p className="font-serif text-base font-medium text-[#2d2d2d] dark:text-[#eee]">答案之书</p>
            <button
              type="button"
              onClick={clearChat}
              className="rounded-md p-1.5 text-[#666] hover:bg-[#f0ebe3] hover:text-foreground dark:hover:bg-[#333]"
              title="清空对话"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-[200px] flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
            {msgs.length === 0 && !loading ? (
              <p className="text-[#6a6a6a] dark:text-[#aaa]">
                向答案之书提问…
              </p>
            ) : null}
            {msgs.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={cn(
                  "rounded-xl px-3 py-2",
                  m.role === "user"
                    ? "ml-6 bg-[#2d2d2d] text-[#faf9f7] dark:bg-[#3d3d3d]"
                    : "mr-4 bg-[#f3efe8] text-[#333] dark:bg-[#2a2a2a] dark:text-[#e6e6e6]"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading ? (
              <p className="text-xs text-[#888]">正在翻阅……</p>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {error ? (
            <p className="border-t border-[#ebe6df] px-4 py-2 text-xs text-red-600 dark:border-[#333]">{error}</p>
          ) : null}

          <form onSubmit={onSubmit} className="border-t border-[#ebe6df] p-3 dark:border-[#333]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="写一句想问的……"
                disabled={loading}
                className="min-w-0 flex-1 rounded-lg border border-[#ddd] bg-white px-3 py-2 text-sm outline-none ring-foreground/10 focus:ring-2 dark:border-[#444] dark:bg-[#252525]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-[#2d2d2d] px-3 py-2 text-white disabled:opacity-40 dark:bg-[#eee] dark:text-[#222]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="border-t border-[#ebe6df] px-3 py-2 text-[10px] leading-snug text-[#888] dark:border-[#333] dark:text-[#777]">
            仅供参考与阅读交流；引用未必为原文逐字，重要引用请核对原书版本。
          </p>
        </div>
      ) : null}
    </>
  );
}
