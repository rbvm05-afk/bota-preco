export type {
  DomainProduct,
  DomainProfileTemplate,
  ProductKind,
  ProductSuggestion,
} from "./types";

export {
  productCatalog,
  profileTemplates,
  productSuggestions,
  toProductSuggestion,
} from "./catalog";

export { resolveProfile, productProfiles, baseQuestions } from "./profileAdapter";
export { searchProducts } from "./search";

export type { ProductBlueprint } from "./blueprint";
export {
  productBlueprints,
  getBlueprint,
  getSuggestedIngredients,
  getSuggestedPackaging,
  getDefaultYield,
  getDefaultLoss,
  getCategory,
  getQuestions,
  getInputDefaults,
} from "./blueprint";
