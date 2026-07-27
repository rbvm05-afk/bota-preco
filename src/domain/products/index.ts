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
