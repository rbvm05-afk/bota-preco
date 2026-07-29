import type { WizardQuestion } from "@/engine/types";

/**
 * Blueprint de produto — fonte única para experiência inteligente.
 * Adicionar produto novo = criar um registro aqui.
 */
export type ProductBlueprint = {
  id: string;
  name: string;
  category: string;
  matches: string[];
  aliases?: string[];
  kind?: "base" | "format" | "flavor";
  unitLabel: string;
  defaultYield: number;
  defaultWastePercent: number;
  defaultWorkHours: number;
  defaultHourlyRate: number;
  defaultMargin: number;
  materialLabel: string;
  materialPlaceholder: string;
  materialExamples: string[];
  suggestedMaterials: string[];
  suggestedPackaging: string[];
  steps: {
    materials: boolean;
    packaging: boolean;
    extras: boolean;
    waste: boolean;
    fees: boolean;
  };
  notes?: string;
};

const defaultSteps = {
  materials: true,
  packaging: true,
  extras: true,
  waste: true,
  fees: true,
};

/**
 * Registro de blueprints.
 * NOVO PRODUTO: copie um bloco, ajuste os campos. Não mexa em componentes React.
 */
export const productBlueprints: ProductBlueprint[] = [
  {
    id: "brigadeiro",
    name: "Brigadeiro",
    category: "Doces",
    matches: ["brigadeiro"],
    aliases: ["brigadeiro tradicional", "docinho"],
    kind: "base",
    unitLabel: "unidade",
    defaultYield: 50,
    defaultWastePercent: 5,
    defaultWorkHours: 2,
    defaultHourlyRate: 15,
    defaultMargin: 35,
    materialLabel: "ingrediente",
    materialPlaceholder: "Ex.: leite condensado",
    materialExamples: ["leite condensado", "chocolate", "manteiga", "granulado"],
    suggestedMaterials: ["Leite condensado", "Chocolate 50%", "Manteiga", "Granulado"],
    suggestedPackaging: ["Forminha de papel", "Caixa para doces", "Etiqueta adesiva", "Sacola"],
    steps: defaultSteps,
  },
  {
    id: "bolo",
    name: "Bolo de pote",
    category: "Doces",
    matches: ["bolo de pote", "bolo"],
    aliases: ["bolo no pote"],
    kind: "base",
    unitLabel: "pote",
    defaultYield: 12,
    defaultWastePercent: 5,
    defaultWorkHours: 3,
    defaultHourlyRate: 15,
    defaultMargin: 35,
    materialLabel: "ingrediente",
    materialPlaceholder: "Ex.: farinha de trigo",
    materialExamples: ["farinha", "açúcar", "ovos", "recheio"],
    suggestedMaterials: ["Farinha de trigo", "Açúcar", "Ovos", "Leite"],
    suggestedPackaging: ["Pote", "Tampa", "Colher", "Etiqueta adesiva", "Sacola"],
    steps: defaultSteps,
  },
  {
    id: "vela",
    name: "Vela",
    category: "Artesanato",
    matches: ["vela aromática", "vela de pote", "vela", "candle"],
    aliases: ["velas"],
    kind: "base",
    unitLabel: "unidade",
    defaultYield: 6,
    defaultWastePercent: 3,
    defaultWorkHours: 2,
    defaultHourlyRate: 20,
    defaultMargin: 40,
    materialLabel: "material",
    materialPlaceholder: "Ex.: cera de soja",
    materialExamples: ["cera", "pavio", "essência", "recipiente"],
    suggestedMaterials: ["Cera de soja", "Essência aromática", "Pavio de algodão", "Pote de vidro"],
    suggestedPackaging: ["Tampa", "Etiqueta adesiva", "Caixa de papelão", "Sacola"],
    steps: { ...defaultSteps, extras: false },
    notes: "Artesanato: margem e hora um pouco mais altas por padrão.",
  },
  {
    id: "marmita",
    name: "Marmita",
    category: "Comida",
    matches: ["marmita fitness", "marmita", "marmitex", "quentinha"],
    aliases: ["marmitex", "quentinha"],
    kind: "base",
    unitLabel: "marmita",
    defaultYield: 10,
    defaultWastePercent: 4,
    defaultWorkHours: 4,
    defaultHourlyRate: 15,
    defaultMargin: 30,
    materialLabel: "ingrediente",
    materialPlaceholder: "Ex.: arroz",
    materialExamples: ["proteína", "arroz", "legumes", "temperos"],
    suggestedMaterials: ["Arroz", "Proteína", "Legumes", "Temperos"],
    suggestedPackaging: ["Marmita", "Tampa", "Etiqueta adesiva", "Sacola"],
    steps: defaultSteps,
  },
  {
    id: "doces",
    name: "Doce",
    category: "Doces",
    matches: ["trufa", "doce", "brownie", "cookie"],
    kind: "base",
    unitLabel: "unidade",
    defaultYield: 20,
    defaultWastePercent: 5,
    defaultWorkHours: 2,
    defaultHourlyRate: 15,
    defaultMargin: 35,
    materialLabel: "ingrediente",
    materialPlaceholder: "Ex.: chocolate",
    materialExamples: ["ingredientes principais", "recheio", "cobertura"],
    suggestedMaterials: [],
    suggestedPackaging: ["Forminha de papel", "Caixa para doces", "Etiqueta adesiva"],
    steps: defaultSteps,
  },
  {
    id: "refeicoes",
    name: "Refeição",
    category: "Comida",
    matches: ["salgado", "lasanha", "comida", "congelado", "coxinha"],
    kind: "base",
    unitLabel: "unidade",
    defaultYield: 20,
    defaultWastePercent: 5,
    defaultWorkHours: 3,
    defaultHourlyRate: 15,
    defaultMargin: 30,
    materialLabel: "ingrediente",
    materialPlaceholder: "Ex.: arroz",
    materialExamples: ["proteína", "acompanhamentos", "temperos"],
    suggestedMaterials: [],
    suggestedPackaging: ["Embalagem", "Etiqueta adesiva"],
    steps: defaultSteps,
  },
  {
    id: "sabonete",
    name: "Sabonete artesanal",
    category: "Artesanato",
    matches: ["sabonete", "sabão artesanal", "sabao"],
    aliases: ["sabonete caseiro"],
    kind: "base",
    unitLabel: "unidade",
    defaultYield: 15,
    defaultWastePercent: 4,
    defaultWorkHours: 2,
    defaultHourlyRate: 18,
    defaultMargin: 40,
    materialLabel: "material",
    materialPlaceholder: "Ex.: base glicerinada",
    materialExamples: ["base", "essência", "corante"],
    suggestedMaterials: ["Essência aromática"],
    suggestedPackaging: ["Etiqueta adesiva", "Sacola"],
    steps: defaultSteps,
  },
  {
    id: "generico",
    name: "Produto genérico",
    category: "Geral",
    matches: [],
    unitLabel: "unidade",
    defaultYield: 1,
    defaultWastePercent: 3,
    defaultWorkHours: 1,
    defaultHourlyRate: 15,
    defaultMargin: 30,
    materialLabel: "material",
    materialPlaceholder: "Ex.: matéria-prima",
    materialExamples: [],
    suggestedMaterials: [],
    suggestedPackaging: [],
    steps: {
      materials: true,
      packaging: false,
      extras: true,
      waste: true,
      fees: true,
    },
  },
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");

export function getBlueprint(productName: string): ProductBlueprint {
  const normalized = normalize(productName);
  if (!normalized) {
    return productBlueprints[productBlueprints.length - 1];
  }

  const found =
    productBlueprints.find((bp) =>
      bp.matches.some((m) => normalized.includes(normalize(m))),
    ) ??
    productBlueprints.find((bp) =>
      (bp.aliases ?? []).some((a) => normalized.includes(normalize(a))),
    ) ??
    productBlueprints.find((bp) => normalize(bp.name) === normalized);

  return found ?? productBlueprints[productBlueprints.length - 1];
}

export function getSuggestedIngredients(productName: string): string[] {
  return getBlueprint(productName).suggestedMaterials;
}

export function getSuggestedPackaging(productName: string): string[] {
  return getBlueprint(productName).suggestedPackaging;
}

export function getDefaultYield(productName: string): number {
  return getBlueprint(productName).defaultYield;
}

export function getDefaultLoss(productName: string): number {
  return getBlueprint(productName).defaultWastePercent;
}

export function getCategory(productName: string): string {
  return getBlueprint(productName).category;
}

/**
 * Ordem 2.6.0:
 * Produto → Ingredientes → Rendimento+Tempo → Embalagens →
 * Outros gastos + Hora → Perdas → Taxas → Concorrência → (Revisão)
 */
export function getQuestions(productName: string): WizardQuestion[] {
  const bp = getBlueprint(productName);
  const unit = bp.unitLabel;
  const questions: WizardQuestion[] = [
    {
      id: "product",
      field: "productName",
      kind: "product",
      label: "Produto",
      eyebrow: "👋 Bora começar",
      title: "O que você está colocando preço?",
      text: "Depois disso, a conversa fica com a cara do seu produto.",
    },
  ];

  if (bp.steps.materials) {
    questions.push({
      id: "materials",
      field: "materials",
      kind: "materials",
      label: "Ingredientes",
      eyebrow: "📦 O que você usou",
      title: `Quais ${bp.materialLabel}s entram em {produto}?`,
      text: "Coloque quanto pagou, quanto veio na embalagem e quanto usou. Se souber a marca, melhor ainda.",
      tip: "Uma estimativa sincera já vale muito mais do que deixar algo esquecido.",
    });
  }

  questions.push({
    id: "yield-time",
    field: "yieldAmount",
    kind: "yield-time",
    label: "Rendimento e tempo",
    eyebrow: "✅ Materiais na conta",
    title: `Essa produção rende quantas ${unit}s — e quanto tempo levou?`,
    text: "Informe o rendimento planejado e as horas em que você realmente trabalhou.",
  });

  if (bp.steps.packaging && bp.suggestedPackaging.length > 0) {
    questions.push({
      id: "packaging",
      field: "packagingItems",
      kind: "packaging",
      label: "Embalagens",
      eyebrow: "🛍️ Produto pronto também precisa sair bonito",
      title: "Qual kit de embalagem acompanha {produto}?",
      text: "Marque o que usa e informe os preços. A quantidade acompanha o rendimento.",
    });
  }

  if (bp.steps.extras) {
    questions.push({
      id: "extras-hora",
      field: "extraCostItems",
      kind: "extras-list",
      label: "Outros gastos",
      eyebrow: "🧾 Gastos escondidos + o valor do seu tempo",
      title: "Teve outros custos? E quanto você quer receber por hora?",
      text: "Gás, energia, entrega, etiqueta… e o valor da sua hora de trabalho.",
      tip: "Não teve gasto extra? Pode deixar a lista vazia e seguir.",
    });
  } else {
    questions.push({
      id: "extras-hora",
      field: "hourlyRate",
      kind: "extras-list",
      label: "Seu tempo",
      eyebrow: "💪 Valorizar o seu trabalho",
      title: "Quanto você quer receber por hora?",
      text: "Não existe resposta perfeita. Comece com um valor que faça sentido para você.",
    });
  }

  if (bp.steps.waste) {
    questions.push({
      id: "waste",
      field: "sellableUnits",
      kind: "waste-pair",
      label: "Perdas",
      eyebrow: "🧹 Nem tudo vira produto perfeito",
      title: "Quantas unidades deveriam sair — e quantas ficaram prontas para vender?",
      text: "O Bota calcula o desperdício sozinho. Você não precisa chutar porcentagem.",
    });
  }

  if (bp.steps.fees) {
    questions.push({
      id: "fees",
      field: "salesFeePercent",
      kind: "fees-gate",
      label: "Taxas de venda",
      eyebrow: "💳 Venda também pode ter taxa",
      title: "Você paga alguma taxa quando vende?",
      text: "Cartão, marketplace, aplicativo ou comissão. Se não pagar, é só dizer Não.",
    });
  }

  questions.push({
    id: "competition",
    field: "competitorPrice",
    kind: "competition",
    label: "Concorrência",
    eyebrow: "👀 Só para comparar",
    title: "Deseja informar o preço praticado pela concorrência apenas como referência?",
    text: "Esse valor não altera o cálculo de custo. Serve só para você comparar depois.",
  });

  return questions;
}

export function getInputDefaults(productName: string): {
  yieldAmount: number;
  wastePercent: number;
  workHours: number;
  hourlyRate: number;
  desiredMargin: number;
} {
  const bp = getBlueprint(productName);
  return {
    yieldAmount: bp.defaultYield,
    wastePercent: bp.defaultWastePercent,
    workHours: bp.defaultWorkHours,
    hourlyRate: bp.defaultHourlyRate,
    desiredMargin: bp.defaultMargin,
  };
}
