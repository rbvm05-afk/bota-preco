import type { MeasurementUnit } from "@/types/pricing";

export type PriceReferenceSource = "history" | "open-prices" | "mercado-livre";

export type PriceReference = {
  source: PriceReferenceSource;
  amount: number;
  currency: string;
  label: string;
  detail?: string;
  observedAt?: string;
  packageAmount?: number;
  packageUnit?: MeasurementUnit;
};

export type PriceReferenceResponse = {
  reference: PriceReference | null;
  alternatives?: PriceReference[];
  warning?: string;
};

export const PRICE_HISTORY_STORAGE_KEY = "bota-preco:price-history:v1";

export type StoredPriceHistory = Record<string, PriceReference & { savedAt: string }>;

export const normalizePriceKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
