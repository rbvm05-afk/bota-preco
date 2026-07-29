/**
 * Capítulos do Completão — estrutura de consultoria.
 * Cada capítulo pode ter várias perguntas, mas a UI mostra UMA por vez.
 */

export type ChapterId =
  | "produto"
  | "ingredientes"
  | "producao"
  | "embalagens"
  | "custos"
  | "venda"
  | "objetivos"
  | "revisao";

export type ChapterQuestion = {
  id: string;
  /** Campo lógico / chave de resposta */
  field: string;
  label: string;
  title: string;
  text?: string;
  kind:
    | "text"
    | "choice"
    | "boolean"
    | "materials"
    | "packaging"
    | "extras-list"
    | "yield-time"
    | "waste-pair"
    | "fees-gate"
    | "competition"
    | "money"
    | "multi-choice";
  options?: { value: string; label: string }[];
  optional?: boolean;
};

export type Chapter = {
  id: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  questions: ChapterQuestion[];
};

export const COMPLETAO_CHAPTERS: Chapter[] = [
  {
    id: "produto",
    number: 1,
    title: "Sobre seu produto",
    subtitle: "Quem você é e como trabalha",
    emoji: "👋",
    questions: [
      {
        id: "product-name",
        field: "productName",
        label: "Produto",
        title: "Qual é o nome do produto?",
        kind: "text",
      },
      {
        id: "fabricates",
        field: "fabricatesOrResells",
        label: "Produção",
        title: "Você fabrica, revende ou faz os dois?",
        kind: "choice",
        options: [
          { value: "fabricates", label: "Fabrico" },
          { value: "resells", label: "Revendo" },
          { value: "both", label: "Os dois" },
        ],
      },
      {
        id: "how-sells",
        field: "howSells",
        label: "Como vende",
        title: "Como você vende hoje?",
        text: "WhatsApp, feira, Instagram, iFood…",
        kind: "text",
        optional: true,
      },
      {
        id: "works-alone",
        field: "worksAlone",
        label: "Equipe",
        title: "Você trabalha sozinho(a)?",
        kind: "boolean",
      },
      {
        id: "order-ready",
        field: "orderOrReady",
        label: "Modelo",
        title: "Trabalha sob encomenda, pronta entrega ou os dois?",
        kind: "choice",
        options: [
          { value: "order", label: "Encomenda" },
          { value: "ready", label: "Pronta entrega" },
          { value: "both", label: "Os dois" },
        ],
      },
    ],
  },
  {
    id: "ingredientes",
    number: 2,
    title: "Ingredientes",
    subtitle: "Tudo o que entra na receita",
    emoji: "📦",
    questions: [
      {
        id: "materials",
        field: "materials",
        label: "Ingredientes",
        title: "Quais ingredientes você usa?",
        text: "Adicione quantos precisar. Marca, preço e quantidade.",
        kind: "materials",
      },
    ],
  },
  {
    id: "producao",
    number: 3,
    title: "Produção",
    subtitle: "Rendimento, tempo e perdas",
    emoji: "🏭",
    questions: [
      {
        id: "yield-time",
        field: "yieldAmount",
        label: "Rendimento e tempo",
        title: "Quanto rende e quanto tempo leva?",
        kind: "yield-time",
      },
      {
        id: "waste",
        field: "sellableUnits",
        label: "Perdas",
        title: "Quantas unidades deveriam sair — e quantas ficaram prontas?",
        kind: "waste-pair",
      },
      {
        id: "process",
        field: "processNotes",
        label: "Processo",
        title: "Quer anotar algo sobre o processo de produção?",
        text: "Opcional — ajuda em revisões futuras.",
        kind: "text",
        optional: true,
      },
    ],
  },
  {
    id: "embalagens",
    number: 4,
    title: "Embalagens",
    subtitle: "Kit completo do produto",
    emoji: "🛍️",
    questions: [
      {
        id: "packaging",
        field: "packagingItems",
        label: "Embalagens",
        title: "Qual kit de embalagem você usa?",
        kind: "packaging",
      },
    ],
  },
  {
    id: "custos",
    number: 5,
    title: "Custos",
    subtitle: "Gastos extras e valor da sua hora",
    emoji: "🧾",
    questions: [
      {
        id: "extras",
        field: "extraCostItems",
        label: "Outros gastos",
        title: "Teve outros custos neste lote?",
        kind: "extras-list",
      },
      {
        id: "hourly",
        field: "hourlyRate",
        label: "Sua hora",
        title: "Quanto você quer receber por hora?",
        kind: "money",
      },
    ],
  },
  {
    id: "venda",
    number: 6,
    title: "Venda",
    subtitle: "Taxas, canais e concorrência",
    emoji: "💳",
    questions: [
      {
        id: "fees",
        field: "salesFeePercent",
        label: "Taxas",
        title: "Você paga alguma taxa quando vende?",
        kind: "fees-gate",
      },
      {
        id: "competition",
        field: "competitorPrice",
        label: "Concorrência",
        title: "Quer informar o preço da concorrência como referência?",
        kind: "competition",
      },
      {
        id: "channels",
        field: "channels",
        label: "Canais",
        title: "Por quais canais você vende?",
        kind: "multi-choice",
        options: [
          { value: "whatsapp", label: "WhatsApp" },
          { value: "instagram", label: "Instagram" },
          { value: "feira", label: "Feira / presencial" },
          { value: "ifood", label: "iFood / apps" },
          { value: "site", label: "Site próprio" },
          { value: "outro", label: "Outro" },
        ],
        optional: true,
      },
    ],
  },
  {
    id: "objetivos",
    number: 7,
    title: "Objetivos",
    subtitle: "O que você quer conquistar",
    emoji: "🎯",
    questions: [
      {
        id: "monthly-income",
        field: "desiredMonthlyIncome",
        label: "Renda mensal",
        title: "Quanto gostaria de receber por mês com este produto?",
        kind: "money",
        optional: true,
      },
      {
        id: "goals-notes",
        field: "goalsNotes",
        label: "Metas",
        title: "Alguma expectativa ou meta que queira registrar?",
        kind: "text",
        optional: true,
      },
    ],
  },
];

export function getChapter(id: ChapterId): Chapter | undefined {
  return COMPLETAO_CHAPTERS.find((c) => c.id === id);
}

export function totalChapterQuestions(): number {
  return COMPLETAO_CHAPTERS.reduce((acc, c) => acc + c.questions.length, 0);
}
