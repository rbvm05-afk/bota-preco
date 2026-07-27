import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PingResult = {
  success: boolean;
  provider: string;
  latencyMs: number;
  data?: { model: string; reply: string };
  error?: { code: string; message: string };
};

const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

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

async function callOpenAI(key: string): Promise<PingResult> {
  const started = Date.now();
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Responda apenas com a palavra: ok" }],
        max_tokens: 8,
        temperature: 0,
      }),
    });
    const latencyMs = Date.now() - started;
    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
      choices?: { message?: { content?: string } }[];
      model?: string;
    };
    if (!res.ok) {
      return {
        success: false,
        provider: "openai",
        latencyMs,
        error: {
          code: `HTTP_${res.status}`,
          message: body.error?.message || `Falha HTTP ${res.status}`,
        },
      };
    }
    return {
      success: true,
      provider: "openai",
      latencyMs,
      data: {
        model: body.model || model,
        reply: body.choices?.[0]?.message?.content?.trim() || "",
      },
    };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      provider: "openai",
      latencyMs,
      error: {
        code: aborted ? "TIMEOUT" : "NETWORK",
        message: aborted
          ? "Timeout após 12000ms"
          : err instanceof Error
            ? err.message
            : "Erro de rede",
      },
    };
  } finally {
    clearTimeout(timer);
  }
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
      } satisfies PingResult,
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
        error: { code: "RATE_LIMIT", message: "Muitas chamadas. Aguarde cerca de 1 minuto." },
      } satisfies PingResult,
      { status: 429 }
    );
  }

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        success: false,
        provider: "openai",
        latencyMs: 0,
        error: {
          code: "MISSING_API_KEY",
          message: "OPENAI_API_KEY não configurada no ambiente do servidor.",
        },
      } satisfies PingResult,
      { status: 200 }
    );
  }

  const result = await callOpenAI(key);
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
