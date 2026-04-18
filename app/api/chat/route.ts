import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/assistant-system-prompt";
import { NextRequest, NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 6000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.ASSISTANT_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json(
      { error: "未配置 OPENAI_API_KEY，请在部署环境变量中设置后再试。" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体须为 JSON" }, { status: 400 });
  }

  const messages = (body as { messages?: ChatMessage[] }).messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages 不能为空" }, { status: 400 });
  }

  const sanitized: ChatMessage[] = messages
    .slice(-MAX_MESSAGES)
    .filter((m): m is ChatMessage => m != null && typeof m === "object")
    .map((m): ChatMessage => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, MAX_CONTENT_LENGTH),
    }))
    .filter((m) => m.content.length > 0);

  if (sanitized.length === 0) {
    return NextResponse.json({ error: "没有有效对话内容" }, { status: 400 });
  }

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: ASSISTANT_SYSTEM_PROMPT }, ...sanitized],
        temperature: 0.65,
        max_tokens: 900,
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: "模型服务暂时不可用", detail: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      return NextResponse.json({ error: "模型返回格式异常" }, { status: 502 });
    }

    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) {
      return NextResponse.json({ error: "模型未返回内容" }, { status: 502 });
    }

    return NextResponse.json({ message: content });
  } catch (e) {
    console.error("[api/chat]", e);
    return NextResponse.json({ error: "请求模型失败" }, { status: 502 });
  }
}
