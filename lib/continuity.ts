import type { PricingInput } from "@/types/pricing";

const KEY = "bota-preco-continue-completao";

/**
 * Persistência temporária para continuar um Rapidin no Completão
 * sem perder o que já foi preenchido.
 */
export function stashForCompletao(input: PricingInput, parentId?: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    KEY,
    JSON.stringify({ input, parentId, at: new Date().toISOString() }),
  );
}

export function loadCompletaoStash(): {
  input: PricingInput;
  parentId?: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { input: PricingInput; parentId?: string };
    return parsed?.input ? parsed : null;
  } catch {
    return null;
  }
}

export function clearCompletaoStash() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
