import { calculatePrice } from "@/src/domain/pricing";
import type { PricingInput, PricingResult } from "@/types/pricing";

export type SavedCalculation = {
  id: string;
  createdAt: string;
  mode: "rapidin" | "completao" | "completin";
  input: PricingInput;
  /** Legado: pode existir em registros antigos. Sempre preferir recalcular. */
  result?: PricingResult;
};

const KEY = "bota-preco-calculations";

export function saveCalculation(item: SavedCalculation) {
  if (typeof window === "undefined") return;
  const current = getCalculations();
  const toStore: SavedCalculation = {
    id: item.id,
    createdAt: item.createdAt,
    mode: item.mode,
    input: item.input,
  };
  localStorage.setItem(KEY, JSON.stringify([toStore, ...current].slice(0, 30)));
}

export function getCalculations(): SavedCalculation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Resultado sempre recalculado a partir do input (motor atual). */
export function resolveCalculation(item: SavedCalculation): SavedCalculation & { result: PricingResult } {
  return {
    ...item,
    result: calculatePrice(item.input),
  };
}

export function clearCalculations() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
