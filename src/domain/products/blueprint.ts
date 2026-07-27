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

export function getQuestions(productName: string): WizardQuestion[] {
  const bp = getBlueprint(productName);
  const questions: WizardQuestion[] = [
    {
      id: "product",
      field: "productName",
      kind: "product",
      label: "Seu produto",
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
      label: "Materiais",
      eyebrow: "📦 Agora entra o que você usou",
      title: `Quais ${bp.materialLabel}s fazem parte de {produto}?`,
      text: "Coloque quanto pagou, quanto veio e quanto usou. O Bota faz a divisão.",
      tip: "Uma estimativa sincera já vale muito mais do que deixar algo esquecido.",
    });
  }

  questions.push({
    id: "yield",
    field: "yieldAmount",
    kind: "number",
    label: "Rendimento",
    eyebrow: "✅ Pronto. Os materiais já estão na conta",
    title: `Essa produção rende quantas ${bp.unitLabel}s?`,
    text: "Agora a gente transforma o custo do lote em custo por unidade.",
    inputLabel: `Quantidade (${bp.unitLabel})`,
    min: 1,
    step: 1,
  });

  questions.push({
    id: "hours",
    field: "workHours",
    kind: "number",
    label: "Tempo de produção",
    eyebrow: "⏱️ Seu tempo não é grátis",
    title: "Quantas horas você trabalhou nesse lote?",
    text: "Conte o tempo em que você realmente trabalhou em {produto}.",
    inputLabel: "Horas de trabalho",
    min: 0,
    step: 0.25,
    hint: "Ex.: 1,5 hora = 1 hora e 30 minutos.",
  });

  questions.push({
    id: "hourlyRate",
    field: "hourlyRate",
    kind: "number",
    label: "Valor do seu trabalho",
    eyebrow: "💪 Agora vamos valorizar seu trabalho",
    title: "Quanto você quer receber por hora?",
    text: "Não existe resposta perfeita. Comece com um valor que faça sentido para você.",
    inputLabel: "Valor da sua hora",
    min: 0,
    step: 0.01,
    hint: "O valor preenchido é só uma referência. Você manda na conta.",
  });

  if (bp.steps.packaging && bp.suggestedPackaging.length > 0) {
    questions.push({
      id: "packaging",
      field: "packagingItems",
      kind: "packaging",
      label: "Embalagem",
      eyebrow: "🛍️ Produto pronto também precisa sair bonito",
      title: "Qual kit de embalagem acompanha {produto}?",
      text: "O Bota sugeriu um kit. Marque o que usa, informe os preços e a quantidade acompanha o rendimento automaticamente.",
    });
  }

  if (bp.steps.extras) {
    questions.push({
      id: "extras",
      field: "extraCosts",
      kind: "number",
      label: "Outros gastos",
      eyebrow: "🧾 Vamos pegar os gastos escondidos",
      title: "Teve algum outro custo nesse lote?",
      text: "Energia, gás, entrega, ajuda, aluguel de equipamento ou qualquer gasto ligado à produção.",
      inputLabel: "Outros gastos do lote",
      min: 0,
      step: 0.01,
      tip: "Não teve nada? Pode deixar zero e seguir sem culpa.",
    });
  }

  if (bp.steps.waste) {
    questions.push({
      id: "waste",
      field: "wastePercent",
      kind: "number",
      label: "Perdas e desperdícios",
      eyebrow: "🧹 Nem tudo vira produto perfeito",
      title: "Quanto costuma se perder no caminho?",
      text: "Sobras, testes, quebra e pequenos erros também custam dinheiro.",
      inputLabel: "Perdas estimadas (%)",
      min: 0,
      max: 50,
      step: 1,
      hint: "Entre 3% e 10% costuma ser uma primeira estimativa razoável.",
    });
  }

  if (bp.steps.fees) {
    questions.push({
      id: "fees",
      field: "salesFeePercent",
      kind: "number",
      label: "Taxas de venda",
      eyebrow: "💳 Venda também pode ter taxa",
      title: "Você paga alguma porcentagem para vender?",
      text: "Cartão, marketplace, aplicativo ou comissão entram aqui.",
      inputLabel: "Taxa sobre a venda (%)",
      min: 0,
      max: 40,
      step: 0.1,
      hint: "Venda direta e sem taxa? Deixe em zero.",
    });
  }

  questions.push({
    id: "margin",
    field: "desiredMargin",
    kind: "margin",
    label: "Margem",
    eyebrow: "💰 Chegamos na última pergunta",
    title: "Qual margem você quer proteger na venda?",
    text: "É o espaço para respirar, repor material e continuar crescendo.",
    inputLabel: "Margem desejada (%)",
    min: 0,
    max: 89,
    step: 1,
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
