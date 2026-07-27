import type { ProductProfile, WizardQuestion } from "@/engine/types";
import { profileTemplates } from "./catalog";
import type { DomainProfileTemplate } from "./types";

/** Perguntas do wizard — iguais à 1.9.x (zero mudança de UX). */
export const baseQuestions: WizardQuestion[] = [
  { id: "product", field: "productName", kind: "product", label: "Seu produto", eyebrow: "👋 Bora começar", title: "O que você está colocando preço?", text: "Depois disso, a conversa fica com a cara do seu produto." },
  { id: "materials", field: "materials", kind: "materials", label: "Materiais", eyebrow: "📦 Agora entra o que você usou", title: "Quais materiais fazem parte de {produto}?", text: "Coloque quanto pagou, quanto veio e quanto usou. O Bota faz a divisão.", tip: "Uma estimativa sincera já vale muito mais do que deixar um material esquecido." },
  { id: "yield", field: "yieldAmount", kind: "number", label: "Rendimento", eyebrow: "✅ Pronto. Os materiais já estão na conta", title: "Essa produção rende quantas unidades?", text: "Agora a gente transforma o custo do lote em custo por unidade.", inputLabel: "Quantidade pronta", min: 1, step: 1 },
  { id: "hours", field: "workHours", kind: "number", label: "Tempo de produção", eyebrow: "⏱️ Seu tempo não é grátis", title: "Quantas horas você trabalhou nesse lote?", text: "Conte o tempo em que você realmente trabalhou em {produto}.", inputLabel: "Horas de trabalho", min: 0, step: 0.25, hint: "Ex.: 1,5 hora = 1 hora e 30 minutos." },
  { id: "hourlyRate", field: "hourlyRate", kind: "number", label: "Valor do seu trabalho", eyebrow: "💪 Agora vamos valorizar seu trabalho", title: "Quanto você quer receber por hora?", text: "Não existe resposta perfeita. Comece com um valor que faça sentido para você.", inputLabel: "Valor da sua hora", min: 0, step: 0.01, hint: "O valor preenchido é só uma referência. Você manda na conta." },
  { id: "packaging", field: "packagingItems", kind: "packaging", label: "Embalagem", eyebrow: "🛍️ Produto pronto também precisa sair bonito", title: "Qual kit de embalagem acompanha {produto}?", text: "O Bota sugeriu um kit. Marque o que usa, informe os preços e a quantidade acompanha o rendimento automaticamente." },
  { id: "extras", field: "extraCosts", kind: "number", label: "Outros gastos", eyebrow: "🧾 Vamos pegar os gastos escondidos", title: "Teve algum outro custo nesse lote?", text: "Energia, gás, entrega, ajuda, aluguel de equipamento ou qualquer gasto ligado à produção.", inputLabel: "Outros gastos do lote", min: 0, step: 0.01, tip: "Não teve nada? Pode deixar zero e seguir sem culpa." },
  { id: "waste", field: "wastePercent", kind: "number", label: "Perdas e desperdícios", eyebrow: "🧹 Nem tudo vira produto perfeito", title: "Quanto costuma se perder no caminho?", text: "Sobras, testes, quebra e pequenos erros também custam dinheiro.", inputLabel: "Perdas estimadas (%)", min: 0, max: 50, step: 1, hint: "Entre 3% e 10% costuma ser uma primeira estimativa razoável." },
  { id: "fees", field: "salesFeePercent", kind: "number", label: "Taxas de venda", eyebrow: "💳 Venda também pode ter taxa", title: "Você paga alguma porcentagem para vender?", text: "Cartão, marketplace, aplicativo ou comissão entram aqui.", inputLabel: "Taxa sobre a venda (%)", min: 0, max: 40, step: 0.1, hint: "Venda direta e sem taxa? Deixe em zero." },
  { id: "margin", field: "desiredMargin", kind: "margin", label: "Margem", eyebrow: "💰 Chegamos na última pergunta", title: "Qual margem você quer proteger na venda?", text: "É o espaço para respirar, repor material e continuar crescendo.", inputLabel: "Margem desejada (%)", min: 0, max: 89, step: 1 },
];

function templateToProfile(template: DomainProfileTemplate): ProductProfile {
  return {
    id: template.id,
    category: template.category,
    displayName: template.displayName,
    matches: template.matches,
    materialLabel: template.materialLabel,
    materialExamples: template.materialExamples,
    suggestedMaterials: template.suggestedMaterials,
    suggestedPackaging: template.suggestedPackaging,
    materialPlaceholder: template.materialPlaceholder,
    questions: baseQuestions,
  };
}

/** Profiles no formato que o Wizard já espera. */
export const productProfiles: ProductProfile[] = profileTemplates.map(templateToProfile);

/**
 * Resolve o perfil do wizard a partir do nome digitado.
 * Mesma regra da 1.9.x: primeiro match em `matches`, senão genérico.
 */
export function resolveProfile(productName: string): ProductProfile {
  const normalized = productName.trim().toLocaleLowerCase("pt-BR");
  return (
    productProfiles.find((profile) =>
      profile.matches.some((match) => normalized.includes(match)),
    ) ?? productProfiles[productProfiles.length - 1]
  );
}
