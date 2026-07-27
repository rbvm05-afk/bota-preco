/**
 * Fonte de verdade (fachada) — série 2.0
 *
 * Hoje apenas reexporta os módulos que a 1.9.x já usa.
 * Componentes NÃO precisam migrar ainda: a lógica runtime permanece em
 * engine/profiles.ts e src/knowledge/*.
 *
 * Ordem de migração (ver docs/03-migracao-2.0.md):
 * 1) produtos/sugestões  → productCatalog + resolveProfile
 * 2) embalagens         → packaging rules + suggestedPackaging
 * 3) ingredientes       → knowledgeCatalog
 * 4) desligar knowledge-base/*.json (experimental)
 */

export {
  knowledgeCatalog,
  productCatalog,
  searchKnowledge,
  searchProducts,
  convertAmount,
  findKnowledgeItem,
  inferUnits,
  unitLabels,
} from "@/src/knowledge";

export type {
  KnowledgeCategory,
  KnowledgeItem,
  ProductSuggestion,
} from "@/src/knowledge";

export { getPackagingSuggestion, packagingNames } from "@/src/knowledge/packaging";
export type { PackagingSuggestion } from "@/src/knowledge/packaging";

export { resolveProfile, productProfiles } from "@/engine/profiles";
export type { ProductProfile, WizardQuestion, WizardField, QuestionKind } from "@/engine/types";
