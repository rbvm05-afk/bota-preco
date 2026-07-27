/** Produto no domínio 2.0 — fonte única de conhecimento. */
export type ProductKind = "base" | "format" | "flavor";

export type DomainProduct = {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  kind?: ProductKind;
  /** Família de perfil (brigadeiro, bolo, vela, …) para kit/materiais. */
  profileFamily?: string;
};

/** Template de perfil do wizard (kits + labels). */
export type DomainProfileTemplate = {
  id: string;
  category: string;
  displayName?: string;
  matches: string[];
  materialLabel: string;
  materialExamples: string[];
  suggestedMaterials: string[];
  suggestedPackaging: string[];
  materialPlaceholder: string;
  /** Rendimento padrão sugerido (futuro; wizard ainda não aplica). */
  defaultYield?: number;
};

/** Compatível com autocomplete legado. */
export type ProductSuggestion = {
  id: string;
  name: string;
  group: string;
  aliases: string[];
  kind?: ProductKind;
};
