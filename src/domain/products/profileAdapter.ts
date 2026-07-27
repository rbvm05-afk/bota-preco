import type { ProductProfile } from "@/engine/types";
import {
  getBlueprint,
  getQuestions,
  productBlueprints,
  type ProductBlueprint,
} from "./blueprint";

function blueprintToProfile(bp: ProductBlueprint): ProductProfile {
  return {
    id: bp.id,
    category: bp.category,
    displayName: bp.name,
    matches: bp.matches,
    materialLabel: bp.materialLabel,
    materialExamples: bp.materialExamples,
    suggestedMaterials: bp.suggestedMaterials,
    suggestedPackaging: bp.suggestedPackaging,
    materialPlaceholder: bp.materialPlaceholder,
    questions: getQuestions(bp.name),
  };
}

/** Profiles derivados dos blueprints (compat Wizard). */
export const productProfiles: ProductProfile[] = productBlueprints.map(blueprintToProfile);

/**
 * Resolve perfil a partir do nome — via blueprint.
 * Wizard não precisa saber que existe blueprint.
 */
export function resolveProfile(productName: string): ProductProfile {
  const bp = getBlueprint(productName);
  return {
    id: bp.id,
    category: bp.category,
    displayName: bp.name,
    matches: bp.matches,
    materialLabel: bp.materialLabel,
    materialExamples: bp.materialExamples,
    suggestedMaterials: bp.suggestedMaterials,
    suggestedPackaging: bp.suggestedPackaging,
    materialPlaceholder: bp.materialPlaceholder,
    questions: getQuestions(productName),
  };
}

/** @deprecated use getQuestions from blueprint */
export const baseQuestions = getQuestions("");
