/**
 * Capítulos do Completão — consultoria, não formulário.
 * UI: uma pergunta por vez dentro de cada capítulo.
 */

export type ChapterId =
  | "produto"
  | "ingredientes"
  | "producao"
  | "embalagens"
  | "custos"
  | "venda"
  | "objetivos";

export type ChapterQuestion = {
  id: string;
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
    title: "Seu produto",
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
        id: "order-ready",
        field: "orderOrReady",
        label: "Modelo",
        title: "Sob encomenda, pronta entrega ou os dois?",
        kind: "choice",
        options: [
          { value: "order", label: "Encomenda" },
          { value: "ready", label: "Pronta entrega" },
          { value: "both", label: "Os dois" },
        ],
      },
      {
        id: "how-sells",
        field: "howSells",
        label: "Onde vende",
        title: "Onde costuma vender?",
        text: "WhatsApp, feira, Instagram, iFood…",
        kind: "text",
        optional: true,
      },
    ],
  },
  {
    id: "ingredientes",
    number: 2,
    title: "Ingredientes ou materiais",
    subtitle: "Lista detalhada do que entra na conta",
    emoji: "📦",
    questions: [
      {
        id: "materials",
        field: "materials",
        label: "Ingredientes",
        title: "Quais ingredientes ou materiais você usa?",
        text: "Marca, preço pago, quanto veio e quanto usou.",
        kind: "materials",
      },
    ],
  },
  {
    id: "producao",
    number: 3,
    title: "Como você faz",
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
        title: "Quantas deveriam sair — e quantas ficaram prontas?",
        kind: "waste-pair",
      },
      {
        id: "works-alone",
        field: "worksAlone",
        label: "Ajuda",
        title: "Você tem ajuda de outras pessoas na produção?",
        kind: "boolean",
      },
    ],
  },
  {
    id: "embalagens",
    number: 4,
    title: "Embalagem e entrega",
    subtitle: "Kit completo até o cliente",
    emoji: "🛍️",
    questions: [
      {
        id: "packaging",
        field: "packagingItems",
        label: "Embalagens",
        title: "Quais embalagens, etiquetas e sacolas você usa?",
        kind: "packaging",
      },
    ],
  },
  {
    id: "custos",
    number: 5,
    title: "Custos do negócio",
    subtitle: "Gastos que costumam passar batido",
    emoji: "🧾",
    questions: [
      {
        id: "extras",
        field: "extraCostItems",
        label: "Outros gastos",
        title: "Quais outros custos entram neste lote?",
        text: "Gás, energia, aluguel rateado, equipamentos…",
        kind: "extras-list",
      },
    ],
  },
  {
    id: "venda",
    number: 6,
    title: "Como você vende",
    subtitle: "Taxas, canais e concorrência",
    emoji: "💳",
    questions: [
      {
        id: "fees",
        field: "salesFeePercent",
        label: "Taxas",
        title: "Você paga taxa de cartão, marketplace ou comissão?",
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
    title: "Seu trabalho e seus objetivos",
    subtitle: "O valor do seu tempo e o que você quer conquistar",
    emoji: "🎯",
    questions: [
      {
        id: "hourly",
        field: "hourlyRate",
        label: "Sua hora",
        title: "Quanto deseja receber por hora do seu trabalho?",
        kind: "money",
      },
      {
        id: "monthly-income",
        field: "desiredMonthlyIncome",
        label: "Renda mensal",
        title: "Quanto gostaria de receber por mês com este produto?",
        kind: "money",
        optional: true,
      },
      {
        id: "priority",
        field: "priority",
        label: "Prioridade",
        title: "O que é mais importante agora?",
        kind: "choice",
        options: [
          { value: "volume", label: "Vender mais unidades" },
          { value: "margin", label: "Ganhar mais por unidade" },
          { value: "balance", label: "Equilíbrio entre os dois" },
        ],
        optional: true,
      },
    ],
  },
];

export type FlatQuestion = ChapterQuestion & {
  chapterId: ChapterId;
  chapterNumber: number;
  chapterTitle: string;
  chapterEmoji: string;
  indexInChapter: number;
  chapterLen: number;
};

/** Lista plana de perguntas na ordem de navegação. */
export function flattenQuestions(): FlatQuestion[] {
  const out: FlatQuestion[] = [];
  for (const ch of COMPLETAO_CHAPTERS) {
    ch.questions.forEach((q, i) => {
      out.push({
        ...q,
        chapterId: ch.id,
        chapterNumber: ch.number,
        chapterTitle: ch.title,
        chapterEmoji: ch.emoji,
        indexInChapter: i,
        chapterLen: ch.questions.length,
      });
    });
  }
  return out;
}

export function getChapter(id: ChapterId): Chapter | undefined {
  return COMPLETAO_CHAPTERS.find((c) => c.id === id);
}

export function totalChapterQuestions(): number {
  return flattenQuestions().length;
}
