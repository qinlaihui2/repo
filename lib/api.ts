/** 线上默认后端（Railway）；本地用 localhost，或在 .env / Vercel 中设置 NEXT_PUBLIC_API_BASE_URL 覆盖 */
const PRODUCTION_API_BASE = "https://my-block-backend-production.up.railway.app";

/** 浏览器与服务端请求后端 API 时统一使用 */
export function getApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API_BASE;
  }
  return "http://localhost:8080";
}
