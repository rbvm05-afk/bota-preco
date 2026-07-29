export type GuideCategory = {
  slug: string;
  title: string;
  description: string;
};

export type GuideArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  published?: boolean;
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  { slug: "precificacao", title: "Precificação", description: "Como calcular preço de forma justa e sustentável." },
  { slug: "custos", title: "Custos", description: "Ingredientes, embalagem, tempo e despesas escondidas." },
  { slug: "negocio", title: "Negócio", description: "Lucro, faturamento e decisões do dia a dia." },
];

export const GUIDE_ARTICLES: GuideArticleMeta[] = [
  { slug: "como-calcular-preco-brigadeiro", title: "Como calcular o preço do brigadeiro", description: "Passo a passo para precificar docinhos sem chute.", category: "precificacao", keywords: ["preço brigadeiro"], published: false },
  { slug: "como-cobrar-marmita", title: "Como cobrar por uma marmita", description: "Custo, embalagem e margem para marmitas.", category: "precificacao", keywords: ["preço marmita"], published: false },
  { slug: "como-calcular-mao-de-obra", title: "Como calcular mão de obra", description: "Coloque o valor da sua hora no preço.", category: "custos", keywords: ["mão de obra"], published: false },
  { slug: "como-incluir-embalagem", title: "Como incluir embalagem no preço", description: "Pote, tampa, sacola e o impacto no custo.", category: "custos", keywords: ["custo embalagem"], published: false },
  { slug: "como-calcular-desperdicio", title: "Como calcular desperdício", description: "Sem porcentagem: o que planejou vs o que vendeu.", category: "custos", keywords: ["desperdício"], published: false },
  { slug: "lucro-vs-faturamento", title: "Diferença entre lucro e faturamento", description: "Entenda os dois números sem complicação.", category: "negocio", keywords: ["lucro", "faturamento"], published: false },
];
