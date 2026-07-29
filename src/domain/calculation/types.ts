import type { PricingInput, PricingResult } from "@/types/pricing";

/**
 * Modo unificado de cálculo.
 * Rapidin e Completão compartilham o mesmo modelo;
 * o Completão apenas enriquece um Calculation existente.
 */
export type CalculationMode = "rapidin" | "completao";

export type Calculation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  mode: CalculationMode;
  /** Origem quando o Completão continua um Rapidin */
  parentId?: string;
  input: PricingInput;
  /** Campos extras do Completão (capítulos) — opcional no Rapidin */
  chapters?: CompletaoChapterAnswers;
};

/** Respostas dos capítulos do Completão (consultoria). */
export type CompletaoChapterAnswers = {
  /** Cap. 1 — Sobre seu produto */
  product?: {
    fabricatesOrResells?: "fabricates" | "resells" | "both";
    howSells?: string;
    worksAlone?: boolean;
    orderOrReady?: "order" | "ready" | "both";
  };
  /** Cap. 3 — Produção (além de yield/tempo/desperdício já no input) */
  production?: {
    processNotes?: string;
  };
  /** Cap. 6 — Venda */
  sales?: {
    channels?: string[];
    paymentMethods?: string[];
  };
  /** Cap. 7 — Objetivos */
  goals?: {
    desiredMonthlyIncome?: number;
    notes?: string;
  };
};

export type CalculationWithResult = Calculation & {
  result: PricingResult;
};
