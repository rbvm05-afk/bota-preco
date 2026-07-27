import type { MeasurementUnit } from "@/types/pricing";

export type KnowledgeCategory =
  | "ingrediente"
  | "embalagem"
  | "material"
  | "decoracao";

export type KnowledgeItem = {
  id: string;
  name: string;
  category: KnowledgeCategory;
  aliases: string[];
  defaultUnit: MeasurementUnit;
  allowedUnits: MeasurementUnit[];
};
