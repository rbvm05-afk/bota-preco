/**
 * Domain Layer 2.0 — fachada pública.
 * Produtos: src/domain/products (fonte única).
 * Materiais/unidades: ainda em src/knowledge (próximos épicos).
 */

export {
  productCatalog,
  profileTemplates,
  productSuggestions,
  productProfiles,
  resolveProfile,
  searchProducts,
  baseQuestions,
  toProductSuggestion,
} from "./products";

export type {
  DomainProduct,
  DomainProfileTemplate,
  ProductKind,
  ProductSuggestion,
} from "./products";

export {
  knowledgeCatalog,
  searchKnowledge,
  convertAmount,
  findKnowledgeItem,
  inferUnits,
  unitLabels,
} from "@/src/knowledge";

export type { KnowledgeCategory, KnowledgeItem } from "@/src/knowledge";

export { getPackagingSuggestion, packagingNames } from "@/src/knowledge/packaging";
export type { PackagingSuggestion } from "@/src/knowledge/packaging";

export type { ProductProfile, WizardQuestion, WizardField, QuestionKind } from "@/engine/types";
