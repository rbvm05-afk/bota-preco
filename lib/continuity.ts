import type { PricingInput } from "@/types/pricing";

const KEY = "bota-preco-continue-completao";

export type CompletaoStash = {
  input: PricingInput;
  parentId?: string;
  /** Preço recomendado do Rapidin de origem (para comparação) */
  rapidinHealthyPrice?: number;
  at: string;
};

export function stashForCompletao(
  input: PricingInput,
  parentId?: string,
  rapidinHealthyPrice?: number,
) {
  if (typeof window === "undefined") return;
  const payload: CompletaoStash = {
    input,
    parentId,
    rapidinHealthyPrice,
    at: new Date().toISOString(),
  };
  sessionStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadCompletaoStash(): CompletaoStash | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CompletaoStash;
    return parsed?.input ? parsed : null;
  } catch {
    return null;
  }
}

export function clearCompletaoStash() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

/** Guarda referência do Rapidin no draft do Completão. */
const PARENT_KEY = "bota-preco-completao-parent";

export function saveCompletaoParent(meta: {
  parentId?: string;
  rapidinHealthyPrice?: number;
}) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PARENT_KEY, JSON.stringify(meta));
}

export function loadCompletaoParent(): {
  parentId?: string;
  rapidinHealthyPrice?: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PARENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
