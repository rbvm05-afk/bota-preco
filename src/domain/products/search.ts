import { productSuggestions } from "./catalog";
import type { ProductSuggestion } from "./types";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function searchProducts(query: string, limit = 8): ProductSuggestion[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 1) return [];

  const asksForFlavor = normalizedQuery.includes(" de ") || normalizedQuery.endsWith(" de");

  return productSuggestions
    .filter(
      (item) =>
        item.kind !== "flavor" ||
        asksForFlavor ||
        normalize(item.name).startsWith(normalizedQuery),
    )
    .map((item) => {
      const normalizedName = normalize(item.name);
      const normalizedAliases = item.aliases.map(normalize);
      const nameWords = normalizedName.split(/\s+/);
      const startsWithName = normalizedName.startsWith(normalizedQuery);
      const startsWithWord = nameWords.some((word) => word.startsWith(normalizedQuery));
      const containsName = normalizedName.includes(normalizedQuery);
      const startsWithAlias = normalizedAliases.some((alias) => alias.startsWith(normalizedQuery));
      const baseBoost = item.kind === "base" ? 0.35 : item.kind === "format" ? 0.2 : 0;

      return {
        item,
        score:
          (startsWithName ? 4 : startsWithWord ? 3 : containsName ? 2 : startsWithAlias ? 1 : 0) +
          baseBoost,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, "pt-BR"))
    .slice(0, limit)
    .map(({ item }) => item);
}
