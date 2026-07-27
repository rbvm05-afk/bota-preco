/**
 * Domain Layer 2.0 — fachada pública.
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
  getBlueprint,
  getSuggestedIngredients,
  getSuggestedPackaging,
  getDefaultYield,
  getDefaultLoss,
  getCategory,
  getQuestions,
  getInputDefaults,
  productBlueprints,
} from "./products";

export type { ProductBlueprint } from "./products";

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

export {
  calculatePrice,
  packagingBatchCost,
  packagingRequiredUnits,
  money,
} from "./pricing";

export {
  buildSmartPricingReport,
  simulateSellPrice,
  buildExplanation,
  diagnoseRecommended,
  assessConfidence,
  buildInsights,
} from "./insights";

export type {
  SmartPricingReport,
  PricingDiagnosis,
  ConfidenceReport,
  PricingInsight,
  SimulationResult,
  PriceExplanation,
} from "./insights";
