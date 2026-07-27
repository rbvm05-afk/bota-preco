import type { IntegrationResult } from "../types";

const PROVIDER = "openai";
const DEFAULT_MODEL = "gpt-4o-mini";
const TIMEOUT_MS = 12_000;

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function openaiPing(): Promise<IntegrationResult<{ model: string; reply: string }>> {
  const started = Date.now();
  const key = process.env.OPENAI_API_KEY?.trim();

  if (!key) {
    return {
      success: false,
      provider: PROVIDER,
      latencyMs: Date.now() - started,
      error: {
        code: "MISSING_API_KEY",
        message: "OPENAI_API_KEY não configurada no ambiente do servidor.",
      },
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
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
        provider: PROVIDER,
        latencyMs,
        error: {
          code: `HTTP_${res.status}`,
          message: body.error?.message || `Falha HTTP ${res.status}`,
        },
      };
    }

    const reply = body.choices?.[0]?.message?.content?.trim() || "";
    return {
      success: true,
      provider: PROVIDER,
      latencyMs,
      data: {
        model: body.model || process.env.OPENAI_MODEL || DEFAULT_MODEL,
        reply,
      },
    };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      success: false,
      provider: PROVIDER,
      latencyMs,
      error: {
        code: aborted ? "TIMEOUT" : "NETWORK",
        message: aborted
          ? `Timeout após ${TIMEOUT_MS}ms`
          : err instanceof Error
            ? err.message
            : "Erro de rede desconhecido",
      },
    };
  } finally {
    clearTimeout(timer);
  }
}
