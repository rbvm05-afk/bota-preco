import { NextResponse } from "next/server";
import { openaiPing } from "@/src/integrations";

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_HITS) return false;
  entry.count += 1;
  return true;
}

export async function GET(request: Request) {
  const allowed =
    process.env.NODE_ENV !== "production" || process.env.INTEGRATIONS_TEST === "1";

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        provider: "none",
        latencyMs: 0,
        error: { code: "FORBIDDEN", message: "Endpoint de teste desabilitado em produção." },
      },
      { status: 403 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      {
        success: false,
        provider: "openai",
        latencyMs: 0,
        error: {
          code: "RATE_LIMIT",
          message: "Muitas chamadas. Aguarde cerca de 1 minuto.",
        },
      },
      { status: 429 }
    );
  }

  const result = await openaiPing();
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
